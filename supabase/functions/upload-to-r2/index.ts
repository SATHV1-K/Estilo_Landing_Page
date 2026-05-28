import { AwsClient } from 'npm:aws4fetch';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const accountId     = Deno.env.get('R2_ACCOUNT_ID')!;
    const accessKeyId   = Deno.env.get('R2_ACCESS_KEY_ID')!;
    const secretKey     = Deno.env.get('R2_SECRET_ACCESS_KEY')!;
    const bucket        = Deno.env.get('R2_BUCKET_NAME')!;
    const publicUrlBase = Deno.env.get('R2_PUBLIC_URL')!;

    const formData    = await req.formData();
    const file        = formData.get('file') as File | null;
    const storagePath = formData.get('path') as string | null;
    const contentType = formData.get('contentType') as string | null;

    if (!file || !storagePath || !contentType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: file, path, contentType' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const aws = new AwsClient({
      accessKeyId,
      secretAccessKey: secretKey,
      service: 's3',
      region: 'auto',
    });

    const objectUrl = `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${storagePath}`;
    const buf = await file.arrayBuffer();

    const r2Res = await aws.fetch(objectUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(buf.byteLength),
      },
      body: buf,
    });

    if (!r2Res.ok) {
      const errText = await r2Res.text();
      console.error('R2 upload error:', r2Res.status, errText);
      return new Response(
        JSON.stringify({ error: `R2 upload failed: ${r2Res.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ url: `${publicUrlBase}/${storagePath}` }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});

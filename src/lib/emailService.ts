// Sends transactional email via Resend REST API.
// VITE_RESEND_API_KEY must be set in .env.
// The "from" address must use a domain verified in your Resend dashboard.

const RESEND_API = 'https://api.resend.com/emails';

// ─── Contact Form Notification ────────────────────────────────────────────────

export interface ContactNotificationPayload {
  name:    string;
  email:   string;
  phone:   string;
  message: string;
}

// Delegates to the server-side handler (/api/contact-notify) to avoid CORS
// and keep the Resend API key out of the browser bundle.
export async function sendContactNotification(
  payload: ContactNotificationPayload
): Promise<void> {
  const res = await fetch('/api/contact-notify', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Contact notification failed: ${body}`);
  }
}

export interface AlertEmailPayload {
  title:     string;
  message:   string;
  link?:     string;
  linkLabel?: string;
  type:      'info' | 'warning' | 'promo';
}

function buildHtml(p: AlertEmailPayload): string {
  const typeColor = p.type === 'warning' ? '#F59E0B' : '#F6B000';
  const linkHtml = p.link
    ? `<a href="${p.link}" style="display:inline-block;margin-top:20px;padding:12px 28px;background:#F6B000;color:#0A0A0A;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;letter-spacing:0.05em;">${p.linkLabel || 'Learn More'}</a>`
    : '';
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">
        <!-- Logo bar -->
        <tr>
          <td style="padding-bottom:24px;text-align:center;">
            <div style="display:inline-block;padding:8px 20px;background:#F6B000;border-radius:8px;">
              <span style="font-size:20px;font-weight:900;color:#0A0A0A;letter-spacing:0.08em;">ESTILO LATINO</span>
            </div>
            <p style="color:#999;font-size:12px;margin:6px 0 0;">Dance Company</p>
          </td>
        </tr>
        <!-- Card -->
        <tr>
          <td style="background:#141414;border:1px solid #2A2A2A;border-top:4px solid ${typeColor};border-radius:12px;padding:32px;">
            <h2 style="color:#FFFFFF;font-size:22px;margin:0 0 14px;line-height:1.3;">${p.title}</h2>
            ${p.message ? `<p style="color:#E8E8E8;font-size:15px;line-height:1.6;margin:0;">${p.message}</p>` : ''}
            ${linkHtml}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 0;text-align:center;">
            <p style="color:#666;font-size:11px;margin:0 0 4px;">You're receiving this because you subscribed to Estilo Latino Dance Company updates.</p>
            <p style="color:#666;font-size:11px;margin:0;">To unsubscribe, reply to this email with the word <strong>unsubscribe</strong>.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendAlertToSubscribers(
  subscribers: string[],
  payload: AlertEmailPayload,
  fromAddress: string
): Promise<{ sent: number; errors: number }> {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY as string | undefined;
  if (!apiKey) throw new Error('VITE_RESEND_API_KEY is not set in .env');
  if (subscribers.length === 0) return { sent: 0, errors: 0 };

  const html = buildHtml(payload);
  const subject = `📢 ${payload.title} — Estilo Latino Dance Company`;

  // Resend batch endpoint: send up to 100 emails per request
  const BATCH_SIZE = 100;
  let sent = 0;
  let errors = 0;

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE).map(to => ({
      from: fromAddress,
      to,
      subject,
      html,
    }));

    const res = await fetch(`${RESEND_API}/batch`, {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batch),
    });

    if (res.ok) {
      sent += batch.length;
    } else {
      errors += batch.length;
    }
  }

  return { sent, errors };
}

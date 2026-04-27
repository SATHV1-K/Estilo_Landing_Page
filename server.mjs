// Production server: serves the Vite build (dist/) as a static SPA
// and handles the /api/contact-notify route server-side (avoids CORS,
// keeps the Resend API key out of the browser bundle).

import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, 'dist')
const PORT = process.env.PORT || 3000

const MIME = {
  '.html':  'text/html; charset=utf-8',
  '.js':    'application/javascript',
  '.mjs':   'application/javascript',
  '.css':   'text/css',
  '.json':  'application/json',
  '.png':   'image/png',
  '.jpg':   'image/jpeg',
  '.jpeg':  'image/jpeg',
  '.svg':   'image/svg+xml',
  '.gif':   'image/gif',
  '.ico':   'image/x-icon',
  '.woff':  'font/woff',
  '.woff2': 'font/woff2',
  '.ttf':   'font/ttf',
  '.mp4':   'video/mp4',
  '.webm':  'video/webm',
  '.webp':  'image/webp',
}

function buildContactHtml(p) {
  const phoneRow = p.phone
    ? `<tr><td style="padding:10px 0;border-bottom:1px solid #2A2A2A;"><span style="color:#999;font-size:12px;text-transform:uppercase;">Phone</span><br><span style="color:#E8E8E8;font-size:16px;">${p.phone}</span></td></tr>`
    : ''
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:40px 16px;background:#0A0A0A;font-family:Arial,sans-serif;">
  <div style="max-width:580px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;padding:8px 20px;background:#F6B000;border-radius:8px;">
        <span style="font-size:20px;font-weight:900;color:#0A0A0A;letter-spacing:0.08em;">ESTILO LATINO</span>
      </div>
      <p style="color:#999;font-size:12px;margin:6px 0 0;">Dance Company — New Contact Inquiry</p>
    </div>
    <div style="background:#141414;border:1px solid #2A2A2A;border-top:4px solid #F6B000;border-radius:12px;padding:32px;">
      <h2 style="color:#FFF;font-size:22px;margin:0 0 20px;">New Message from Website</h2>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:10px 0;border-bottom:1px solid #2A2A2A;"><span style="color:#999;font-size:12px;text-transform:uppercase;">Name</span><br><span style="color:#E8E8E8;font-size:16px;font-weight:600;">${p.name}</span></td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #2A2A2A;"><span style="color:#999;font-size:12px;text-transform:uppercase;">Email</span><br><a href="mailto:${p.email}" style="color:#F6B000;font-size:16px;">${p.email}</a></td></tr>
        ${phoneRow}
        <tr><td style="padding:10px 0;"><span style="color:#999;font-size:12px;text-transform:uppercase;">Message</span><br><p style="color:#E8E8E8;font-size:15px;line-height:1.6;margin:8px 0 0;white-space:pre-wrap;">${p.message}</p></td></tr>
      </table>
      <div style="margin-top:24px;padding:16px;background:#0A0A0A;border-radius:8px;">
        <p style="color:#999;font-size:12px;margin:0;">Reply to this email to respond directly to ${p.name} at ${p.email}</p>
      </div>
    </div>
    <p style="color:#666;font-size:11px;text-align:center;margin-top:24px;">Submitted via the contact form on estilolatinodance.com</p>
  </div>
</body></html>`
}

async function handleContactNotify(req, res) {
  return new Promise((resolve) => {
    let raw = ''
    req.setEncoding('utf8')
    req.on('data', (chunk) => { raw += chunk })
    req.on('end', async () => {
      res.setHeader('Content-Type', 'application/json')
      try {
        const payload = JSON.parse(raw)
        const apiKey = process.env.VITE_RESEND_API_KEY
        if (!apiKey) throw new Error('VITE_RESEND_API_KEY not set')

        const from = process.env.VITE_RESEND_FROM_EMAIL || 'Estilo Latino <noreply@estilolatinodance.com>'
        const resendRes = await fetch('https://api.resend.com/emails', {
          method:  'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from,
            to:       'info@estilolatinodance.com',
            reply_to: payload.email,
            subject:  `New Contact Message from ${payload.name}`,
            html:     buildContactHtml(payload),
          }),
        })

        if (resendRes.ok) {
          res.statusCode = 200
          res.end(JSON.stringify({ ok: true }))
        } else {
          res.statusCode = 500
          res.end(JSON.stringify({ error: await resendRes.text() }))
        }
      } catch (e) {
        res.statusCode = 500
        res.end(JSON.stringify({ error: String(e) }))
      }
      resolve()
    })
  })
}

function serveStatic(req, res) {
  const urlPath = req.url.split('?')[0]
  let filePath = path.join(DIST, urlPath === '/' ? 'index.html' : urlPath)

  try {
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) filePath = path.join(filePath, 'index.html')
    const ext = path.extname(filePath).toLowerCase()
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream')
    res.statusCode = 200
    fs.createReadStream(filePath).pipe(res)
  } catch {
    // SPA fallback — let React Router handle the route
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.statusCode = 200
    fs.createReadStream(path.join(DIST, 'index.html')).pipe(res)
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/contact-notify') {
    await handleContactNotify(req, res)
    return
  }
  serveStatic(req, res)
})

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

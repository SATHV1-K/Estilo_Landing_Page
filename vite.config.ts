import { defineConfig, loadEnv, type Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'node:http'

function buildContactHtml(p: { name: string; email: string; phone: string; message: string }): string {
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

function contactNotifyPlugin(apiKey: string, fromAddress: string): Plugin {
  return {
    name: 'contact-notify-api',
    configureServer(server) {
      server.middlewares.use('/api/contact-notify', (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }

        let raw = ''
        req.setEncoding('utf8')
        req.on('data', (chunk: string) => { raw += chunk })
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json')
          try {
            if (!apiKey) throw new Error('VITE_RESEND_API_KEY not set in .env')
            const payload = JSON.parse(raw) as { name: string; email: string; phone: string; message: string }

            const resendRes = await fetch('https://api.resend.com/emails', {
              method:  'POST',
              headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from:     fromAddress,
                to:       'info@estilolatinodance.com',
                reply_to: payload.email,
                subject:  `New Contact Message from ${payload.name}`,
                html:     buildContactHtml(payload),
              }),
            })

            const resendBody = await resendRes.text()
            if (resendRes.ok) {
              res.statusCode = 200
              res.end(JSON.stringify({ ok: true }))
            } else {
              console.error('[contact-notify] Resend error:', resendBody)
              res.statusCode = 500
              res.end(JSON.stringify({ error: resendBody }))
            }
          } catch (e) {
            console.error('[contact-notify] Handler error:', e)
            res.statusCode = 500
            res.end(JSON.stringify({ error: String(e) }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // loadEnv reads .env files reliably in the Vite config context
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey     = env.VITE_RESEND_API_KEY    || ''
  const fromAddress = env.VITE_RESEND_FROM_EMAIL || 'Estilo Latino <noreply@estilolatinodance.com>'

  return {
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
      contactNotifyPlugin(apiKey, fromAddress),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})

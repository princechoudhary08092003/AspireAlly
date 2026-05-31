const nodemailer = require('nodemailer')

let transporter

if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
} else {
  // Dev fallback — logs to console so the app works without SMTP configured
  transporter = {
    sendMail: async (opts) => {
      console.log('\n─── [DEV EMAIL] ───────────────────────')
      console.log('To:', opts.to)
      console.log('Subject:', opts.subject)
      console.log('Body:', opts.text)
      console.log('───────────────────────────────────────\n')
      return {}
    },
  }
}

const FROM = process.env.FROM_EMAIL || '"AspireAlly" <noreply@aspireally.in>'

async function sendVerificationEmail(to, firstName, token, clientUrl) {
  const base = clientUrl || process.env.CLIENT_URL || 'http://localhost:5173'
  const link = `${base}/verify-email?token=${token}`

  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#F8FAFF;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFF;padding:40px 20px;">
    <tr><td align="center">
      <table width="540" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#080E1D,#1E3A8A);padding:32px 40px;text-align:center;">
            <div style="display:inline-block;background:linear-gradient(135deg,#2563EB,#881337);border-radius:12px;padding:8px 18px;margin-bottom:14px;">
              <span style="color:#fff;font-weight:900;font-size:22px;letter-spacing:-.5px;">AA</span>
            </div>
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-.5px;">Aspire<span style="color:#F59E0B;">Ally</span></h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h2 style="margin:0 0 12px;font-size:24px;font-weight:800;color:#0F172A;">Verify your email, ${firstName} 👋</h2>
            <p style="margin:0 0 28px;color:#64748B;font-size:15px;line-height:1.7;">
              You're almost there. Click the button below to confirm your email address and start your mentorship journey.
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#2563EB,#1D4ED8);color:#ffffff;text-decoration:none;padding:16px 44px;border-radius:50px;font-weight:700;font-size:15px;letter-spacing:.3px;">
                Verify My Email →
              </a>
            </div>
            <p style="margin:0 0 6px;color:#94A3B8;font-size:12px;text-align:center;">Or copy this link into your browser:</p>
            <p style="margin:0;color:#2563EB;font-size:12px;text-align:center;word-break:break-all;">${link}</p>
            <hr style="border:none;border-top:1px solid #E2E8F0;margin:32px 0;" />
            <p style="margin:0;color:#94A3B8;font-size:12px;text-align:center;line-height:1.6;">
              This link expires in <strong>24 hours</strong>. If you didn't create an account, you can safely ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#F8FAFF;padding:20px 40px;text-align:center;">
            <p style="margin:0;color:#CBD5E1;font-size:11px;">© 2025 AspireAlly · Empowering careers through mentorship</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Verify your AspireAlly account',
    text: `Hi ${firstName},\n\nVerify your email address by visiting:\n${link}\n\nThis link expires in 24 hours.\n\n– The AspireAlly Team`,
    html,
  })
}

module.exports = { sendVerificationEmail }

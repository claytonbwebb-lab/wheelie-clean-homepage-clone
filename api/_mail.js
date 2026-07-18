const nodemailer = require('nodemailer');

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.zoho.eu';
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) throw new Error('SMTP_USER/SMTP_PASS are not configured');
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
}

async function sendFormEmail({ subject, heading, fields, replyTo }) {
  const to = process.env.FORM_TO || 'malesy@yahoo.com';
  const from = process.env.FORM_FROM || process.env.SMTP_USER;
  const rows = Object.entries(fields || {}).map(([label, value]) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e7edf4;font-weight:700;color:#041E4E;width:34%;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e7edf4;color:#333;white-space:pre-line;">${escapeHtml(value || '—')}</td>
    </tr>`).join('');
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;border:1px solid #e7edf4;border-radius:14px;overflow:hidden;">
      <div style="background:#041E4E;color:white;padding:22px 26px;">
        <h1 style="margin:0;font-size:22px;">${escapeHtml(heading)}</h1>
        <p style="margin:8px 0 0;color:#dff6f1;">Wheelie Clean UK clone form submission</p>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#fff;">${rows}</table>
      <div style="background:#f7fbff;padding:14px 26px;color:#667;font-size:12px;">Testing recipient: ${escapeHtml(to)}</div>
    </div>`;
  const text = `${heading}\n\n` + Object.entries(fields || {}).map(([k, v]) => `${k}: ${v || '-'}`).join('\n');
  await getTransporter().sendMail({ from: `"Wheelie Clean Website" <${from}>`, to, replyTo: replyTo || undefined, subject, html, text });
}

module.exports = { escapeHtml, sendFormEmail };

const { sendFormEmail } = require('./_mail');
function clean(v = '') { return String(v).trim(); }
function ref() { return `WQ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`; }

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  try {
    const body = req.body || {};
    if (!clean(body.name) || !clean(body.phone)) {
      return res.status(400).json({ success: false, error: 'Name and phone are required.' });
    }
    const reference = ref();
    await sendFormEmail({
      subject: `TEST Wheelie Clean quote ${reference} — ${clean(body.service || 'General')}`,
      heading: `New Quote Request — ${reference}`,
      replyTo: clean(body.email),
      fields: {
        Reference: reference,
        Name: clean(body.name),
        Phone: clean(body.phone),
        Email: clean(body.email),
        Service: clean(body.service || 'General enquiry'),
        Postcode: clean(body.postcode).toUpperCase(),
        Message: clean(body.message),
        Source: clean(body.source || 'Website clone')
      }
    });
    return res.status(200).json({ success: true, reference });
  } catch (error) {
    console.error('quote error', error);
    return res.status(500).json({ success: false, error: 'Email could not be sent.' });
  }
};

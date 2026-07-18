const { sendFormEmail } = require('./_mail');

const VALID_AREAS = ['OL1', 'OL2', 'OL4', 'OL9', 'M35'];
function clean(v = '') { return String(v).trim(); }
function covered(postcode = '') {
  const compact = postcode.toUpperCase().replace(/\s+/g, '');
  return VALID_AREAS.some(area => compact.startsWith(area));
}
function priceFor(count) {
  if (count <= 0) return 0;
  if (count === 1) return 5;
  if (count === 2) return 9;
  return 12;
}
function ref() {
  return `WC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  try {
    const body = req.body || {};
    const bins = Array.isArray(body.bins) ? body.bins.map(clean).filter(Boolean) : [];
    const count = bins.length;
    const postcode = clean(body.postcode || body.postcodeFull).toUpperCase();
    const reference = ref();
    if (!clean(body.name) || !clean(body.phone) || !clean(body.address1) || !postcode || count < 1) {
      return res.status(400).json({ success: false, error: 'Please complete all required fields.' });
    }
    const areaOk = covered(postcode);
    if (!areaOk) return res.status(400).json({ success: false, error: 'This postcode is outside the current bin-cleaning area.' });
    const price = priceFor(count);
    await sendFormEmail({
      subject: `TEST New bin booking ${reference} — ${clean(body.name)}`,
      heading: `New Bin Booking — ${reference}`,
      replyTo: clean(body.email),
      fields: {
        Reference: reference,
        Name: clean(body.name),
        Phone: clean(body.phone),
        Email: clean(body.email),
        Address: [clean(body.address1), clean(body.address2), clean(body.town), postcode].filter(Boolean).join(', '),
        'Area check': `${postcode} — covered (${VALID_AREAS.join(', ')})`,
        Bins: bins.join(', '),
        'Discount logic': count === 1 ? '1 bin = £5.00' : count === 2 ? '2 bins = £9.00 (£1 saving)' : '3 bins = £12.00 (£3 saving)',
        'Quoted total': `£${price}.00`,
        Notes: clean(body.notes),
        Source: clean(body.source || 'Website clone')
      }
    });
    return res.status(200).json({ success: true, reference, price, areaOk });
  } catch (error) {
    console.error('bin-booking error', error);
    return res.status(500).json({ success: false, error: 'Email could not be sent.' });
  }
};

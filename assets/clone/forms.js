(() => {
  const VALID_AREAS = ['OL1', 'OL2', 'OL4', 'OL9', 'M35'];
  const BIN_PRICES = { 0: 0, 1: 5, 2: 9, 3: 12 };
  const binNames = { black: 'Black Bin', green: 'Green Bin', brown: 'Brown Bin' };
  const priceFor = count => BIN_PRICES[Math.min(count, 3)] || 0;
  const savingFor = count => count === 2 ? 1 : count >= 3 ? 3 : 0;
  const covered = postcode => VALID_AREAS.some(area => postcode.toUpperCase().replace(/\s+/g, '').startsWith(area));

  function buildBinBookingForm() {
    return `
      <section class="wc-clone-form-wrap" id="booking-form">
        <div class="wc-clone-panel">
          <div class="wc-clone-panel__head">
            <h2>Book Your Bin Cleaning</h2>
            <p>Select your bins, check your area and send the booking request. Payments are still handled offline.</p>
          </div>
          <form class="wc-clone-form" id="wc-bin-booking-form">
            <div class="wc-clone-notice">Testing mode: enquiries currently email malesy@yahoo.com.</div>
            <div class="wc-bin-grid" role="group" aria-label="Choose bins">
              ${binCard('black','Black Bin','General waste','/wp-content/uploads/2020/10/black-1-180x250-1.png')}
              ${binCard('brown','Brown Bin','Food / garden','/wp-content/uploads/2020/10/brown-180x250-1.png')}
              ${binCard('green','Green Bin','Recycling','/wp-content/uploads/2020/10/green-1-180x250-1.png')}
            </div>
            <div class="wc-price-strip"><span id="wc-price-copy">Choose any 1 bin for £5.00, any 2 for £9.00, or all 3 for £12.00.</span><strong id="wc-price">£0.00</strong></div>
            <div class="wc-form-grid">
              <div class="wc-field full"><label for="wc-postcode">Postcode / area check *</label><input id="wc-postcode" name="postcode" required placeholder="e.g. OL1 1AA"><div id="wc-area-result" class="wc-area-result"></div><div class="wc-small">Bin cleaning areas: OL1, OL2, OL4, OL9 and M35. Other services may be available further afield.</div></div>
              <div class="wc-field"><label for="wc-name">Name *</label><input id="wc-name" name="name" required autocomplete="name"></div>
              <div class="wc-field"><label for="wc-phone">Phone *</label><input id="wc-phone" name="phone" required autocomplete="tel"></div>
              <div class="wc-field"><label for="wc-email">Email</label><input id="wc-email" name="email" type="email" autocomplete="email"></div>
              <div class="wc-field"><label for="wc-town">Town</label><input id="wc-town" name="town" autocomplete="address-level2"></div>
              <div class="wc-field full"><label for="wc-address1">Address *</label><input id="wc-address1" name="address1" required autocomplete="address-line1"></div>
              <div class="wc-field full"><label for="wc-address2">Address line 2</label><input id="wc-address2" name="address2" autocomplete="address-line2"></div>
              <div class="wc-field full"><label for="wc-notes">Notes</label><textarea id="wc-notes" name="notes" placeholder="Collection day, access notes, anything Steve needs to know"></textarea></div>
            </div>
            <div class="wc-form-actions"><button class="wc-btn" id="wc-submit" type="submit" disabled>Send Booking Request</button><span class="wc-status" id="wc-status"></span></div>
          </form>
        </div>
      </section>`;
  }

  function binCard(id, title, note, img) {
    return `<button type="button" class="wc-bin-card" data-bin="${id}" aria-pressed="false"><img src="${img}" alt="${title}"><strong>${title}</strong><span>${note}</span></button>`;
  }

  function buildQuoteForm(service = '') {
    return `
      <section class="wc-clone-form-wrap" id="quote-form">
        <div class="wc-clone-panel">
          <div class="wc-clone-panel__head"><h2>Get A Quote</h2><p>Send a quick enquiry and we’ll come back with a price.</p></div>
          <form class="wc-clone-form wc-service-form" id="wc-quote-form">
            <div class="wc-clone-notice">Testing mode: enquiries currently email malesy@yahoo.com.</div>
            <div class="wc-form-grid">
              <div class="wc-field"><label for="q-name">Name *</label><input id="q-name" name="name" required></div>
              <div class="wc-field"><label for="q-phone">Phone *</label><input id="q-phone" name="phone" required></div>
              <div class="wc-field"><label for="q-email">Email</label><input id="q-email" name="email" type="email"></div>
              <div class="wc-field"><label for="q-postcode">Postcode</label><input id="q-postcode" name="postcode"></div>
              <div class="wc-field full"><label for="q-service">Service</label><select id="q-service" name="service"><option>${service || 'General enquiry'}</option><option>Pressure Washing</option><option>UPVC Cleaning</option><option>Gutter Cleaning</option><option>Conservatory Cleaning</option><option>Patio Cleaning</option><option>Driveway Cleaning</option><option>Commercial Cleaning</option></select></div>
              <div class="wc-field full"><label for="q-message">Message</label><textarea id="q-message" name="message" placeholder="Tell us what needs cleaning, approximate size and access details"></textarea></div>
            </div>
            <div class="wc-form-actions"><button class="wc-btn" type="submit">Send Quote Request</button><span class="wc-status" id="q-status"></span></div>
          </form>
        </div>
      </section>`;
  }

  function mountForms() {
    const path = location.pathname.replace(/\/$/, '') || '/';
    const main = document.querySelector('main') || document.querySelector('#content') || document.body;
    const isBinFlow = ['/bin-cleaning','/cart','/checkout','/product/black-bin','/product/brown-bin','/product/green-bin','/product-category/wheelie-bin-cleaning'].includes(path);
    if (isBinFlow && !document.getElementById('wc-bin-booking-form')) main.insertAdjacentHTML('beforeend', buildBinBookingForm());
    const serviceMap = {
      '/contact-us': 'General enquiry', '/pressure-washing': 'Pressure Washing', '/driveway-cleaning': 'Driveway Cleaning', '/patio-cleaning': 'Patio Cleaning', '/gutter-cleaning': 'Gutter Cleaning', '/conservatory-cleaning': 'Conservatory Cleaning', '/upvc-cleaning': 'UPVC Cleaning', '/commercial': 'Commercial Cleaning'
    };
    if (serviceMap[path] && !document.getElementById('wc-quote-form')) main.insertAdjacentHTML('beforeend', buildQuoteForm(serviceMap[path]));
    initBinForm(); initQuoteForm(); rewriteWooButtons();
  }

  function initBinForm() {
    const form = document.getElementById('wc-bin-booking-form'); if (!form) return;
    const selected = new Set();
    const priceEl = document.getElementById('wc-price');
    const copyEl = document.getElementById('wc-price-copy');
    const submit = document.getElementById('wc-submit');
    const status = document.getElementById('wc-status');
    const postcode = document.getElementById('wc-postcode');
    const areaResult = document.getElementById('wc-area-result');
    let areaOk = false;
    function update() {
      const count = selected.size, price = priceFor(count), saving = savingFor(count);
      priceEl.textContent = `£${price}.00`;
      copyEl.textContent = count === 0 ? 'Choose any 1 bin for £5.00, any 2 for £9.00, or all 3 for £12.00.' : count === 1 ? '1 bin selected — £5.00.' : `${count} bins selected — £${price}.00 (${saving ? `£${saving}.00 saving` : 'best price'}).`;
      submit.disabled = !(count > 0 && areaOk);
    }
    function syncCards() {
      form.querySelectorAll('.wc-bin-card').forEach(card => {
        card.classList.toggle('is-selected', selected.has(card.dataset.bin));
        card.setAttribute('aria-pressed', selected.has(card.dataset.bin));
      });
    }
    window.wcSelectBins = function(ids = []) {
      selected.clear();
      ids.forEach(id => selected.add(id));
      syncCards();
      update();
      document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    form.querySelectorAll('.wc-bin-card').forEach(card => card.addEventListener('click', () => { const id = card.dataset.bin; selected.has(id) ? selected.delete(id) : selected.add(id); syncCards(); update(); }));
    postcode.addEventListener('input', () => { const val = postcode.value.trim().toUpperCase(); areaResult.className = 'wc-area-result'; areaOk = false; if (val.length >= 2) { areaOk = covered(val); areaResult.classList.add(areaOk ? 'ok' : 'no'); areaResult.textContent = areaOk ? `✓ We cover ${val} for bin cleaning.` : `Sorry, bin cleaning is currently limited to ${VALID_AREAS.join(', ')}. Use the quote form for other services.`; } update(); });
    form.addEventListener('submit', async e => { e.preventDefault(); status.textContent = 'Sending…'; submit.disabled = true; const fd = new FormData(form); const payload = Object.fromEntries(fd.entries()); payload.bins = [...selected].map(id => binNames[id]); payload.source = location.pathname; try { const r = await fetch('/api/bin-booking', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }); const data = await r.json(); if (!r.ok || !data.success) throw new Error(data.error || 'Could not send'); status.textContent = `Sent — reference ${data.reference}.`; form.reset(); selected.clear(); form.querySelectorAll('.wc-bin-card').forEach(c => { c.classList.remove('is-selected'); c.setAttribute('aria-pressed','false'); }); areaOk = false; areaResult.className = 'wc-area-result'; update(); } catch (err) { status.textContent = err.message || 'Could not send. Please call instead.'; update(); } });
    update();
  }

  function initQuoteForm() {
    const form = document.getElementById('wc-quote-form'); if (!form) return;
    const status = document.getElementById('q-status');
    form.addEventListener('submit', async e => { e.preventDefault(); const btn = form.querySelector('button[type="submit"]'); btn.disabled = true; status.textContent = 'Sending…'; const payload = Object.fromEntries(new FormData(form).entries()); payload.source = location.pathname; try { const r = await fetch('/api/quote', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }); const data = await r.json(); if (!r.ok || !data.success) throw new Error(data.error || 'Could not send'); status.textContent = `Sent — reference ${data.reference}.`; form.reset(); } catch (err) { status.textContent = err.message || 'Could not send. Please call instead.'; } finally { btn.disabled = false; } });
  }

  function rewriteWooButtons() {
    document.querySelectorAll('a[href*="add-to-cart"], button[name="add-to-cart"], .single_add_to_cart_button, .checkout-button').forEach(el => {
      if (el.tagName === 'A') el.href = '/bin-cleaning/#booking-form';
      el.addEventListener('click', e => { e.preventDefault(); location.href = '/bin-cleaning/#booking-form'; });
      el.textContent = 'Book / Request Quote';
    });

    // Original WordPress shortcode form posted to /wp-admin/admin-ajax.php.
    // In the static clone that route is forbidden on Vercel, so convert it into
    // a hand-off to the replacement booking form and carry over the ticked bins.
    const legacyBinForm = document.getElementById('bin-form');
    if (legacyBinForm) {
      legacyBinForm.setAttribute('action', '#booking-form');
      legacyBinForm.addEventListener('submit', e => {
        e.preventDefault();
        const map = { '1139': 'black', '1140': 'brown', '1138': 'green' };
        const ids = [...legacyBinForm.querySelectorAll('input[name="bin[]"]:checked')].map(input => map[input.value]).filter(Boolean);
        if (typeof window.wcSelectBins === 'function') window.wcSelectBins(ids);
        else document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountForms); else mountForms();
})();

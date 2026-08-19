/**
 * ARENA MARKETING DATA LOADER v1.0.0
 * S159 continued — 2026-08-16
 *
 * Fetches PRICING + TESTIMONIALS from the same ARENA_SITE_CONFIG GAS Web App
 * that arena-config.js already uses (extended to v1.2.0 — see
 * website/arena-hub-co-uk/ARENA_SITE_CONFIG.gs). If a live, ACTIVE row exists
 * for this page's PRODUCT, overwrites the static fallback pricing already
 * hand-written in the HTML. If the fetch fails, or no row matches, the page's
 * existing static values are left exactly as they are — this script never
 * removes or blanks anything, only overwrites when better data is confirmed
 * available. Design doc: docs/planning/Future_Work/
 * ARENA_MARKETING_CMS_ARCHITECTURE_STUB.md.
 *
 * REQUIRES, already declared on hestia.html/lite.html before this script runs:
 *   - var PRODUCT = 'hestia' | 'lite';
 *   - var PRICE_DISPLAY = { monthly: {...}, annual: {...} };
 *   - var _billingPeriod = 'monthly' | 'annual';
 *   - #priceAmount, #priceNote, .pricing__card-features, .pricing__save-badge,
 *     .pricing__card .btn — all already present in the existing pricing card.
 *
 * TESTIMONIALS render into a container with id="marketingTestimonials" (a
 * <section>, starts with style="display:none" in the HTML). If that element
 * isn't present on a given page, testimonial data is simply ignored.
 */
(function () {
  'use strict';

  var ARENA_CONFIG_URL = 'https://script.google.com/macros/s/AKfycbxphfIOhEweH4m3WeF8lAVffSPbAB9uUXH-1t0qfYnWPV_G9NHxdbCrcMZHLm6gXROabA/exec';

  if (typeof PRODUCT === 'undefined') {
    console.warn('[MarketingData] No PRODUCT var declared on this page — skipping.');
    return;
  }

  fetch(ARENA_CONFIG_URL)
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (payload) {
      if (!payload || !payload.ok) throw new Error('Invalid payload');
      applyPricing(payload.pricing || []);
      applyTestimonials(payload.testimonials || []);
    })
    .catch(function (err) {
      console.warn('[MarketingData] Fetch failed — keeping static fallback values.', err.message);
    });

  function isActive(v) {
    return v === true || String(v).trim().toUpperCase() === 'TRUE';
  }

  function applyPricing(rows) {
    var plan = null;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].PRODUCT === PRODUCT && isActive(rows[i].ACTIVE)) { plan = rows[i]; break; }
    }
    if (!plan || typeof PRICE_DISPLAY === 'undefined') return; // no live row — keep static fallback

    PRICE_DISPLAY.monthly = {
      amount: plan.MONTHLY_AMOUNT, unit: plan.MONTHLY_UNIT,
      note:   plan.MONTHLY_NOTE,   btn:  plan.MONTHLY_BTN_TEXT
    };
    PRICE_DISPLAY.annual = {
      amount: plan.ANNUAL_AMOUNT, unit: plan.ANNUAL_UNIT,
      note:   plan.ANNUAL_NOTE,   btn:  plan.ANNUAL_BTN_TEXT
    };

    // Re-render whichever period is currently showing, using the exact same
    // element targets the page's own toggleBilling() already updates — this
    // is a data source swap, not a new render path.
    var period = (typeof _billingPeriod !== 'undefined') ? _billingPeriod : 'monthly';
    var d = PRICE_DISPLAY[period];
    var amountEl = document.getElementById('priceAmount');
    var noteEl   = document.getElementById('priceNote');
    if (amountEl) amountEl.innerHTML = d.amount + '<span>' + d.unit + '</span>';
    if (noteEl)   noteEl.textContent = d.note;
    var btnEl = document.querySelector('.pricing__card .btn');
    if (btnEl) btnEl.textContent = d.btn;

    if (plan.SAVE_BADGE_TEXT) {
      var badgeEl = document.querySelector('.pricing__save-badge');
      if (badgeEl) badgeEl.textContent = plan.SAVE_BADGE_TEXT;
    }

    if (plan.FEATURES) {
      var listEl = document.querySelector('.pricing__card-features');
      if (listEl) {
        var items = String(plan.FEATURES).split('|').map(function (s) { return s.trim(); }).filter(Boolean);
        if (items.length) {
          listEl.innerHTML = items.map(function (t) { return '<li>' + escHtml(t) + '</li>'; }).join('');
        }
      }
    }
  }

  function applyTestimonials(rows) {
    var container = document.getElementById('marketingTestimonials');
    if (!container) return; // page has no testimonials slot — nothing to do

    var live = rows.filter(function (r) {
      return isActive(r.ACTIVE) && (r.PRODUCT === PRODUCT || r.PRODUCT === 'all');
    });

    if (!live.length) {
      container.style.display = 'none';
      container.innerHTML = '';
      return; // stays hidden — no placeholder, no "coming soon" card
    }

    live.sort(function (a, b) { return (Number(a.SORT_ORDER) || 0) - (Number(b.SORT_ORDER) || 0); });

    container.innerHTML =
      '<div class="container">' +
        '<div class="testimonials__grid">' +
          live.map(function (t) {
            return (
              '<blockquote class="testimonials__card">' +
                '<p class="testimonials__quote">“' + escHtml(t.QUOTE || '') + '”</p>' +
                '<footer class="testimonials__attribution">' +
                  escHtml(t.ATTRIBUTION || '') +
                  (t.ROLE_OR_CONTEXT ? '<span>' + escHtml(t.ROLE_OR_CONTEXT) + '</span>' : '') +
                '</footer>' +
              '</blockquote>'
            );
          }).join('') +
        '</div>' +
      '</div>';
    container.style.display = '';
  }

  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();

// Second Look: screens and the check flow.
// Rules: render everything with textContent (never innerHTML), and only ever
// link to phone numbers that come from the family's profile or our own list.

(() => {
  const PROFILE_KEY = 'secondlook.profile';
  // Our community partner: the call button when no family helper is set up (verified on sascc.org).
  const SASCC_PHONE = '+14088681257';
  const $ = (id) => document.getElementById(id);

  const screens = ['home', 'oncall', 'results', 'setup'];
  let setupStarted = false;

  // ---------- Profile (saved by Family setup, on this device only) ----------
  function loadProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      const p = raw ? JSON.parse(raw) : null;
      return p && typeof p === 'object' ? p : null;
    } catch {
      return null;
    }
  }

  // Only the fields the check needs: company names and account types. Never phone numbers.
  function trustedForCheck(profile) {
    if (!profile) return undefined;
    const companies = Array.isArray(profile.companies) ? profile.companies.filter((c) => typeof c === 'string').slice(0, 50) : [];
    const accounts = Array.isArray(profile.accounts) ? profile.accounts.filter((a) => typeof a === 'string').slice(0, 10) : [];
    return { companies, accounts };
  }

  function cleanPhone(raw) {
    if (typeof raw !== 'string') return '';
    const digits = raw.replace(/[^\d+]/g, '');
    return /^\+?\d{7,15}$/.test(digits) ? digits : '';
  }

  function applyProfile() {
    const profile = loadProfile();
    const name = profile && typeof profile.firstName === 'string' ? profile.firstName.trim().slice(0, 40) : '';
    $('greeting').textContent = name ? `Hi ${name}.` : 'Hello.';

    const helperLink = $('call-helper');
    const helper = profile && profile.helper;
    const phone = helper ? cleanPhone(helper.phone) : '';
    const helperName = helper && typeof helper.name === 'string' ? helper.name.trim().slice(0, 40) : '';
    // Always offer one trusted call: the family helper if set up, otherwise SASCC.
    helperLink.href = `tel:${phone || SASCC_PHONE}`;
    helperLink.textContent = phone ? `📞 Call ${helperName || 'my helper'}` : '📞 Call SASCC';
    helperLink.hidden = false;
  }

  // ---------- Screens ----------
  function show(name, { focus } = {}) {
    if (!screens.includes(name)) name = 'home';
    for (const s of screens) $(s).hidden = s !== name;
    $('setup-back').hidden = name !== 'setup';

    if (name === 'home') applyProfile();
    if (name === 'oncall') applyProfile();
    if (name === 'setup' && !setupStarted) {
      setupStarted = true;
      if (typeof window.initSetup === 'function') {
        window.initSetup($('setup'));
      } else {
        const p = document.createElement('p');
        p.textContent = 'Family setup is coming soon.';
        $('setup').replaceChildren(p);
      }
    }

    window.scrollTo(0, 0);
    const target = focus ? $(focus) : $(name).querySelector('h1');
    if (target) target.focus({ preventScroll: true });
  }

  // Back button and the "Family setup" link use the URL hash.
  window.addEventListener('hashchange', () => {
    const name = location.hash.replace('#', '');
    show(name === 'setup' ? 'setup' : 'home');
  });

  // ---------- Results ----------
  const VERDICTS = {
    scam:    { icon: '⛔', title: 'This looks like a scam' },
    caution: { icon: '⚠️', title: 'Be careful' },
    ok:      { icon: '✅', title: 'No warning signs found' },
    unknown: { icon: '❔', title: 'We could not check this' },
  };

  function fillList(listEl, items) {
    listEl.replaceChildren(
      ...items.slice(0, 3).map((text) => {
        const li = document.createElement('li');
        li.textContent = String(text);
        return li;
      })
    );
  }

  function showResult(result) {
    const kind = VERDICTS[result.verdict] ? result.verdict : 'unknown';
    const v = VERDICTS[kind];
    const box = $('verdict');
    box.className = `verdict ${kind}`;
    $('verdict-icon').textContent = v.icon;
    $('verdict-title').textContent = result.headline || v.title;

    const explanation = $('explanation');
    explanation.textContent = result.explanation || '';
    explanation.hidden = !result.explanation;

    fillList($('reasons'), Array.isArray(result.reasons) && result.reasons.length ? result.reasons : ['We did not find any of the usual warning signs.']);
    fillList($('steps'), Array.isArray(result.steps) && result.steps.length ? result.steps : ['When in doubt, call back on a number you look up yourself.']);

    if (result.report) $('report-line').textContent = String(result.report);

    show('results', { focus: 'verdict-title' });
  }

  // ---------- Check ----------
  async function runCheck(event) {
    event.preventDefault();
    const textEl = $('check-text');
    const errorEl = $('check-error');
    const button = $('check-button');
    const text = textEl.value.trim();

    errorEl.hidden = true;
    if (!text) {
      errorEl.textContent = 'Please paste the message, or type what the caller said, in the box above.';
      errorEl.hidden = false;
      textEl.focus();
      return;
    }

    button.disabled = true;
    button.textContent = 'Checking… this takes a few seconds';
    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, trusted: trustedForCheck(loadProfile()) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      showResult(data);
    } catch (err) {
      errorEl.textContent = `${err.message} When in doubt, hang up and call someone you trust.`;
      errorEl.hidden = false;
    } finally {
      button.disabled = false;
      button.textContent = 'Check it';
    }
  }

  // ---------- Wire up ----------
  $('check-form').addEventListener('submit', runCheck);
  $('oncall-button').addEventListener('click', () => show('oncall'));
  $('hungup-button').addEventListener('click', () => {
    show('home', { focus: 'check-text' });
  });
  $('startover-button').addEventListener('click', () => {
    $('check-text').value = '';
    if (location.hash) history.replaceState(null, '', location.pathname);
    show('home', { focus: 'check-text' });
  });
  $('setup-link').addEventListener('click', (e) => {
    e.preventDefault();
    location.hash = 'setup';
  });

  // Family setup can call this after saving, so the greeting and helper update.
  window.SecondLook = { refreshProfile: applyProfile };

  show(location.hash === '#setup' ? 'setup' : 'home');
})();

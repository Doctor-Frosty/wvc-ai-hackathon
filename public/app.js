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
  let trustedCall = { href: `tel:${SASCC_PHONE}`, label: '📞 Call SASCC' };

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
    trustedCall = {
      href: `tel:${phone || SASCC_PHONE}`,
      label: phone ? `📞 Call ${helperName || 'my helper'}` : '📞 Call SASCC',
    };
    helperLink.href = trustedCall.href;
    helperLink.textContent = trustedCall.label;
    helperLink.hidden = false;
  }

  // ---------- Screens ----------
  function show(name, { focus } = {}) {
    if (!screens.includes(name)) name = 'home';
    if (name !== 'results' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
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

  function showResult(result, removed = 0) {
    const kind = VERDICTS[result.verdict] ? result.verdict : 'unknown';

    const removedNote = $('removed-note');
    removedNote.textContent =
      removed > 0
        ? `We removed ${removed === 1 ? 'a personal number' : 'some personal numbers'} from your message before checking it, to protect you.`
        : '';
    removedNote.hidden = removed === 0;
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

    // After a warning, the most helpful next step is talking to someone trusted.
    applyProfile();
    const call = $('results-call');
    call.hidden = kind !== 'scam' && kind !== 'caution';
    call.href = trustedCall.href;
    call.textContent = trustedCall.label;

    show('results', { focus: 'verdict-title' });
  }

  // ---------- Read it to me (built-in device voice; nothing is sent anywhere) ----------
  const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  function stopReading() {
    if (canSpeak) window.speechSynthesis.cancel();
    $('read-button').textContent = '🔊 Read it to me';
    $('read-button').setAttribute('aria-pressed', 'false');
  }

  function readResults() {
    if (!canSpeak) return;
    if (window.speechSynthesis.speaking) return stopReading();
    const items = (id) => [...document.querySelectorAll(`#${id} li`)].map((li) => li.textContent);
    const parts = [
      $('verdict-title').textContent + '.',
      $('explanation').hidden ? '' : $('explanation').textContent,
      'Why.', ...items('reasons'),
      'What to do now.', ...items('steps'),
    ].filter(Boolean);
    const u = new SpeechSynthesisUtterance(parts.join(' '));
    u.rate = 0.9;
    u.lang = 'en-US';
    u.onend = stopReading;
    u.onerror = stopReading;
    $('read-button').textContent = '⏹ Stop reading';
    $('read-button').setAttribute('aria-pressed', 'true');
    window.speechSynthesis.speak(u);
  }

  $('read-wrap').hidden = !canSpeak;
  $('read-button').addEventListener('click', readResults);

  // ---------- Remove personal numbers in the browser, before anything is sent ----------
  // Same patterns as lib/redact.js (which stays on the server as a safety net).
  // Phone numbers are kept on purpose: they are what scammers use.
  const REDACT_PATTERNS = [
    { re: /\b\d{3}[-\s]\d{2}[-\s]\d{4}\b/g }, // Social Security number
    { re: /\b[1-9][A-Z][A-Z0-9]\d[-\s]?[A-Z][A-Z0-9]\d[-\s]?[A-Z]{2}\d{2}\b/gi }, // Medicare number
    { re: /\b(?:\d[-\s]?){12,18}\d\b/g }, // card number
    { re: /\b\d{8,17}\b/g, keep: (m) => /^1?\d{10}$/.test(m) && (m.length === 10 || m.startsWith('1')) }, // account number
  ];

  function redactInBrowser(text) {
    let out = text;
    let removed = 0;
    for (const { re, keep } of REDACT_PATTERNS) {
      out = out.replace(re, (match) => {
        if (keep && keep(match)) return match;
        removed += 1;
        return '[removed]';
      });
    }
    return { text: out, removed };
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

    // Personal numbers we recognize are removed here, on this device. Only the cleaned text is sent.
    const safe = redactInBrowser(text);

    button.disabled = true;
    button.textContent = 'Checking…';
    $('checking').hidden = false;
    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: safe.text, trusted: trustedForCheck(loadProfile()) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      showResult(data, safe.removed);
    } catch (err) {
      errorEl.textContent = `${err.message} When in doubt, hang up and call someone you trust.`;
      errorEl.hidden = false;
    } finally {
      button.disabled = false;
      button.textContent = 'Check it';
      $('checking').hidden = true;
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

// Second Look: Family setup ("My trusted list").
// A family member fills this in once on the senior's phone or tablet.
// Saved ONLY in this browser (localStorage, key "secondlook.profile"). Never sent to a server.
// Rules: render with textContent (never innerHTML), no inline styles or handlers
// (the server's content security policy blocks them), no account numbers, ever.

(() => {
  const PROFILE_KEY = 'secondlook.profile';

  // Account types the contract allows. An empty saved list means "none of these".
  const ACCOUNTS = [
    ['checking', 'Checking account'],
    ['savings', 'Savings account'],
    ['credit card', 'Credit card'],
    ['home loan', 'Home loan or mortgage'],
    ['car loan', 'Car loan'],
    ['investments', 'Investments'],
  ];

  const CATEGORIES = [
    ['bank', 'Banks and payments'],
    ['health', 'Health care'],
    ['utility', 'Water and power'],
    ['phone', 'Phone and internet'],
    ['shopping', 'Shopping'],
    ['delivery', 'Mail and delivery'],
    ['tech', 'Technology'],
  ];

  // "Use example setup" saves exactly this profile (the 555 number is fictional).
  const EXAMPLE = {
    firstName: 'Margaret',
    companies: ['Wells Fargo', 'Kaiser Permanente', 'PG&E', 'AT&T'],
    accounts: ['checking', 'savings', 'credit card'],
    helper: { name: 'Sarah', phone: '+14085550123' },
    dropDone: false,
  };

  let root = null;
  let companyList = []; // from /data/companies.json
  let confirmingDelete = false;

  // ---------- Saved profile (every read and write is wrapped in try/catch) ----------
  function readProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      const p = raw ? JSON.parse(raw) : null;
      return p && typeof p === 'object' ? p : null;
    } catch {
      return null;
    }
  }

  function writeProfile(profile) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      return true;
    } catch {
      return false;
    }
  }

  function removeProfile() {
    try {
      localStorage.removeItem(PROFILE_KEY);
      return true;
    } catch {
      return false;
    }
  }

  // Tells the Home screen to update the greeting and the "Call [helper]" button.
  function refreshApp() {
    try {
      if (window.SecondLook && typeof window.SecondLook.refreshProfile === 'function') {
        window.SecondLook.refreshProfile();
      }
    } catch {
      /* the app will pick the profile up the next time it shows Home */
    }
  }

  // ---------- Small helpers ----------
  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs || {})) {
      if (value === false || value === null || value === undefined) continue;
      node.setAttribute(key, value === true ? '' : String(value));
    }
    for (const child of children) {
      if (child === null || child === undefined) continue;
      node.append(typeof child === 'string' ? document.createTextNode(child) : child);
    }
    return node;
  }

  const clean = (s, max = 60) => (typeof s === 'string' ? s.trim().replace(/\s+/g, ' ').slice(0, max) : '');
  const lower = (s) => String(s).toLowerCase();

  // Turns what a person typed into +14085550123, or '' if it can't be a phone number.
  function normalizePhone(raw) {
    const text = clean(raw, 30);
    const digits = text.replace(/\D/g, '');
    if (text.startsWith('+')) return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : '';
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
    return '';
  }

  // Shows +14085550123 as (408) 555-0123 so it is easy to read and check.
  function displayPhone(stored) {
    const digits = clean(stored, 30).replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('1')) {
      const ten = digits.slice(1);
      return `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`;
    }
    return clean(stored, 30);
  }

  // Typed names like "Kaiser" become the list's name ("Kaiser Permanente").
  function canonicalLookup() {
    const map = new Map();
    for (const c of companyList) {
      map.set(lower(c.name), c.name);
      for (const alias of c.aliases || []) {
        if (!map.has(lower(alias))) map.set(lower(alias), c.name);
      }
    }
    return map;
  }

  // ---------- Building the form ----------
  function checkRow({ name, value, label, checked }) {
    const input = el('input', { type: 'checkbox', name, value, checked: !!checked });
    return el('label', { class: 'setup-check' }, input, el('span', {}, label));
  }

  function field({ id, label, hint, type = 'text', value = '', autocomplete = 'off', inputmode }) {
    const hintId = hint ? `${id}-hint` : null;
    const input = el('input', {
      id,
      name: id,
      type,
      value,
      autocomplete,
      inputmode,
      'aria-describedby': hintId,
      maxlength: 60,
    });
    return el(
      'div',
      { class: 'setup-field' },
      el('label', { for: id }, label),
      hint ? el('p', { class: 'setup-hint', id: hintId }, hint) : null,
      input
    );
  }

  function companySection(profile) {
    const saved = Array.isArray(profile && profile.companies) ? profile.companies.map((c) => clean(c)).filter(Boolean) : [];
    const savedLower = new Set(saved.map(lower));
    const listedLower = new Set(companyList.map((c) => lower(c.name)));

    const outer = el(
      'fieldset',
      { class: 'setup-section', id: 'setup-companies' },
      el('legend', {}, 'Companies they really use'),
      el('p', { class: 'setup-hint' }, 'Tick only the ones they have really dealt with. Anything else that claims to be from a company will look suspicious.')
    );

    for (const [category, title] of CATEGORIES) {
      const inCategory = companyList.filter((c) => c.category === category);
      if (!inCategory.length) continue;
      const group = el('fieldset', { class: 'setup-group' }, el('legend', {}, title));
      for (const c of inCategory) {
        group.append(checkRow({ name: 'company', value: c.name, label: c.name, checked: savedLower.has(lower(c.name)) }));
      }
      outer.append(group);
    }

    // Anything saved earlier that is not on our list goes into the "other" box.
    const others = saved.filter((c) => !listedLower.has(lower(c)));
    outer.append(
      field({
        id: 'setup-other-companies',
        label: 'Any other companies (optional)',
        hint: 'Type the names, with a comma between each. For example: Golden 1 Credit Union, Lucky Supermarket.',
        value: others.join(', '),
      })
    );
    return outer;
  }

  function accountSection(profile) {
    const hasProfile = !!profile;
    const saved = Array.isArray(profile && profile.accounts) ? profile.accounts.map(lower) : [];
    const section = el(
      'fieldset',
      { class: 'setup-section', id: 'setup-accounts' },
      el('legend', {}, 'Accounts they really have'),
      el('p', { class: 'setup-hint' }, 'If a message is about an account they do not have, we can tell them right away that it is not real.')
    );
    for (const [value, label] of ACCOUNTS) {
      section.append(checkRow({ name: 'account', value, label, checked: saved.includes(value) }));
    }
    section.append(
      checkRow({ name: 'account', value: 'none', label: 'None of these', checked: hasProfile && saved.length === 0 })
    );
    return section;
  }

  function helperSection(profile) {
    const helper = (profile && profile.helper) || {};
    return el(
      'fieldset',
      { class: 'setup-section', id: 'setup-helper' },
      el('legend', {}, 'Who should they call first?'),
      el('p', { class: 'setup-hint' }, 'One person they trust. Their name and number go on the "Call" button when something feels wrong.'),
      field({ id: 'setup-helper-name', label: "Helper's name", value: clean(helper.name, 40), autocomplete: 'off' }),
      field({
        id: 'setup-helper-phone',
        label: "Helper's phone number",
        type: 'tel',
        inputmode: 'tel',
        value: displayPhone(helper.phone),
        hint: 'For example: (408) 555-0123',
      })
    );
  }

  function dropSection(profile) {
    return el(
      'fieldset',
      { class: 'setup-section', id: 'setup-drop' },
      el('legend', {}, 'One more helpful thing'),
      el(
        'p',
        { class: 'setup-hint' },
        'Scammers often buy people’s details from data brokers. California’s free DROP request tells over 500 of them to delete them. It takes about 10 minutes at privacy.ca.gov/drop.'
      ),
      checkRow({
        name: 'drop',
        value: 'done',
        label: 'I have helped them file a California DROP request',
        checked: !!(profile && profile.dropDone),
      })
    );
  }

  function render({ message = '', focusStatus = false } = {}) {
    const profile = readProfile();
    confirmingDelete = false;

    const heading = el('h1', { id: 'setup-title', tabindex: '-1' }, 'Family setup');
    const intro = el(
      'p',
      { class: 'lead' },
      'This page is for a family member. Fill it in once, on the phone or tablet that will be used. It makes the second opinion personal: a message from a bank they do not use, or about a loan they do not have, will be flagged right away.'
    );
    const privacy = el(
      'p',
      { class: 'note setup-privacy' },
      'Saved only on this device, never on our server. Please do not type any account numbers or passwords. When a message is checked, only the company names and account types are used to compare, and they are never saved.'
    );

    const status = el('p', { id: 'setup-status', class: 'setup-status', role: 'status', tabindex: '-1' }, message);
    status.hidden = !message;
    const error = el('p', { id: 'setup-error', class: 'error', role: 'alert' });
    error.hidden = true;

    const firstName = field({
      id: 'setup-first-name',
      label: 'Their first name',
      hint: 'Used for the greeting, like "Hi Margaret."',
      value: clean(profile && profile.firstName, 40),
      autocomplete: 'off',
    });

    const exampleLink = el('button', { type: 'button', id: 'setup-example', class: 'setup-textlink' }, 'Use example setup');
    const deleteLink = el('button', { type: 'button', id: 'setup-delete', class: 'setup-textlink setup-danger' }, 'Delete everything');
    const deleteNote = el('p', { id: 'setup-delete-note', class: 'setup-hint', role: 'status' });
    deleteNote.hidden = true;

    const form = el(
      'form',
      { id: 'setup-form', novalidate: true },
      firstName,
      companySection(profile),
      accountSection(profile),
      helperSection(profile),
      dropSection(profile),
      error,
      el('button', { type: 'submit', class: 'btn btn-primary', id: 'setup-save' }, 'Save'),
      status
    );

    const extras = el('div', { class: 'setup-extras' }, exampleLink, deleteLink);

    root.replaceChildren(heading, intro, privacy, form, extras, deleteNote);

    form.addEventListener('submit', onSave);
    form.addEventListener('change', onChange);
    exampleLink.addEventListener('click', onExample);
    deleteLink.addEventListener('click', onDelete);
    deleteLink.addEventListener('blur', () => resetDeleteConfirm());

    if (focusStatus) status.focus();
  }

  // ---------- Behavior ----------
  // "None of these" and the real accounts cancel each other out.
  function onChange(event) {
    const t = event.target;
    if (!(t instanceof HTMLInputElement) || t.name !== 'account' || !t.checked) return;
    for (const other of root.querySelectorAll('input[name="account"]')) {
      if (other === t) continue;
      if (t.value === 'none' || other.value === 'none') other.checked = false;
    }
  }

  function showError(message, fieldId) {
    const error = root.querySelector('#setup-error');
    error.textContent = message;
    error.hidden = false;
    const status = root.querySelector('#setup-status');
    status.hidden = true;
    const target = fieldId && root.querySelector(`#${fieldId}`);
    if (target) target.focus();
  }

  function collect() {
    const lookup = canonicalLookup();
    const names = [];
    const seen = new Set();
    const add = (raw) => {
      const typed = clean(raw, 60);
      if (!typed) return;
      const name = lookup.get(lower(typed)) || typed;
      if (seen.has(lower(name))) return;
      seen.add(lower(name));
      names.push(name);
    };

    for (const box of root.querySelectorAll('input[name="company"]:checked')) add(box.value);
    for (const part of root.querySelector('#setup-other-companies').value.split(/[,;\n]/)) add(part);

    const checked = [...root.querySelectorAll('input[name="account"]:checked')].map((b) => b.value);
    const accounts = ACCOUNTS.map(([value]) => value).filter((value) => checked.includes(value));

    return {
      firstName: clean(root.querySelector('#setup-first-name').value, 40),
      companies: names.slice(0, 50),
      accounts,
      noneChosen: checked.includes('none'),
      helperName: clean(root.querySelector('#setup-helper-name').value, 40),
      helperPhoneRaw: root.querySelector('#setup-helper-phone').value,
      dropDone: root.querySelector('input[name="drop"]').checked,
    };
  }

  function onSave(event) {
    event.preventDefault();
    const data = collect();

    // An empty accounts list means "none of these", so make sure that was a real answer.
    if (!data.accounts.length && !data.noneChosen) {
      return showError('Please tick the accounts they have, or tick "None of these".', 'setup-accounts');
    }

    let phone = '';
    if (data.helperPhoneRaw.trim()) {
      phone = normalizePhone(data.helperPhoneRaw);
      if (!phone) {
        return showError('That phone number does not look right. Please type all 10 digits, like (408) 555-0123.', 'setup-helper-phone');
      }
      if (!data.helperName) {
        return showError("Please type the helper's name, so the Call button can say who it calls.", 'setup-helper-name');
      }
    } else if (data.helperName) {
      return showError(`Please type ${data.helperName}'s phone number, or clear the name.`, 'setup-helper-phone');
    }

    const profile = {
      firstName: data.firstName,
      companies: data.companies,
      accounts: data.accounts,
      helper: { name: data.helperName, phone },
      dropDone: data.dropDone,
    };

    if (!writeProfile(profile)) {
      return showError(
        'We could not save on this device. Private browsing, or blocked site data, can cause this. Please try a normal browser window.'
      );
    }
    refreshApp();
    render({
      message: `Saved. ${data.firstName ? `${data.firstName}'s` : 'The'} trusted list is now on this device. Choose "Back to start" below to try it.`,
      focusStatus: true,
    });
  }

  function onExample() {
    if (!writeProfile(EXAMPLE)) {
      render();
      return showError('We could not save on this device. Please try a normal browser window.');
    }
    refreshApp();
    render({ message: 'The example setup for Margaret is saved. Choose "Back to start" below to try it.', focusStatus: true });
  }

  function resetDeleteConfirm() {
    if (!confirmingDelete) return;
    confirmingDelete = false;
    const link = root.querySelector('#setup-delete');
    const note = root.querySelector('#setup-delete-note');
    if (link) link.textContent = 'Delete everything';
    if (note) note.hidden = true;
  }

  // Two taps, so nothing is lost by accident.
  function onDelete() {
    const link = root.querySelector('#setup-delete');
    const note = root.querySelector('#setup-delete-note');
    if (!confirmingDelete) {
      confirmingDelete = true;
      link.textContent = 'Yes, delete everything';
      note.textContent = 'This removes the saved trusted list from this device. Tap "Yes, delete everything" to confirm, or tap anywhere else to keep it.';
      note.hidden = false;
      return;
    }
    if (!removeProfile()) {
      render();
      return showError('We could not delete the saved list. Please try again.');
    }
    refreshApp();
    render({ message: 'Everything was deleted from this device.', focusStatus: true });
  }

  // ---------- Entry point (called once by app.js) ----------
  window.initSetup = function initSetup(rootElement) {
    root = rootElement;
    root.replaceChildren(el('p', {}, 'Loading Family setup…'));

    fetch('/data/companies.json')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('not found'))))
      .then((data) => {
        companyList = Array.isArray(data.companies) ? data.companies : [];
      })
      .catch(() => {
        companyList = []; // the "other companies" box still works
      })
      .finally(() => render());
  };
})();

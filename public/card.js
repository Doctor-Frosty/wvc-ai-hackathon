// Fills the printable card from the Family setup profile saved on this device.
// Nothing is sent anywhere. All text is set with textContent.

(() => {
  const PROFILE_KEY = 'secondlook.profile';
  const $ = (id) => document.getElementById(id);

  const ACCOUNT_WORDS = {
    'home loan': 'a home loan or mortgage',
    'car loan': 'a car loan',
    'credit card': 'a credit card',
    investments: 'investments or crypto',
  };

  function loadProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      const p = raw ? JSON.parse(raw) : null;
      return p && typeof p === 'object' ? p : null;
    } catch {
      return null;
    }
  }

  const clean = (s, max = 60) => (typeof s === 'string' ? s.trim().slice(0, max) : '');

  function formatPhone(raw) {
    const d = clean(raw, 20).replace(/\D/g, '');
    const ten = d.length === 11 && d.startsWith('1') ? d.slice(1) : d;
    return ten.length === 10 ? `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}` : clean(raw, 20);
  }

  function li(parts) {
    const item = document.createElement('li');
    for (const part of parts) {
      if (typeof part === 'string') item.append(part);
      else {
        const strong = document.createElement('strong');
        strong.textContent = part.bold;
        item.append(strong);
      }
    }
    return item;
  }

  // Bank names Isabel's list marks as banks; used to say "Your bank is ...".
  async function loadBankNames() {
    try {
      const res = await fetch('/data/companies.json');
      const data = await res.json();
      return new Set(
        (data.companies || [])
          .filter((c) => c.category === 'bank')
          .flatMap((c) => [c.name, ...(c.aliases || [])])
          .map((n) => n.toLowerCase())
      );
    } catch {
      return new Set();
    }
  }

  async function fill() {
    const p = loadProfile();
    if (!p) return; // general version for workshops

    const name = clean(p.firstName, 40);
    if (name) {
      $('card-title').textContent = `${name}, before you do anything, take a second look.`;
      $('personal-title').textContent = `${name}'s trusted list`;
    }

    const companies = Array.isArray(p.companies) ? p.companies.map((c) => clean(c)).filter(Boolean) : [];
    const accounts = Array.isArray(p.accounts) ? p.accounts.map((a) => clean(a).toLowerCase()) : [];
    const banks = await loadBankNames();
    const myBanks = companies.filter((c) => banks.has(c.toLowerCase()));
    const others = companies.filter((c) => !banks.has(c.toLowerCase()));
    const missing = Object.keys(ACCOUNT_WORDS).filter((a) => !accounts.includes(a));

    const items = [];
    if (myBanks.length) {
      items.push(li([`My bank: `, { bold: myBanks.join(', ') }, `. If anyone else says they are my bank, it's a scam.`]));
    }
    if (others.length) {
      items.push(li([`Companies I really use: `, { bold: others.slice(0, 8).join(', ') }, `.`]));
    }
    if (companies.length && missing.length) {
      items.push(li([`I do NOT have `, { bold: missing.map((a) => ACCOUNT_WORDS[a]).join(', ') }, `. Any message about these is a scam.`]));
    }
    if (items.length) {
      $('personal-list').replaceChildren(...items);
      $('personal').hidden = false;
    }

    const helper = p.helper || {};
    const helperName = clean(helper.name, 40);
    const helperPhone = formatPhone(helper.phone);
    if (helperName || helperPhone) {
      const line = $('helper-line');
      line.replaceChildren(
        ...li([`Call first: `, { bold: [helperName, helperPhone].filter(Boolean).join(', ') }]).childNodes
      );
      line.classList.add('first');
      line.hidden = false;
    }
  }

  $('print-button').addEventListener('click', () => window.print());
  fill();
})();

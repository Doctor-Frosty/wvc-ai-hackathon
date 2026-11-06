// The trusted-list check: Second Look's main new idea.
// Family records which companies the senior really uses and which accounts they really have.
// A message "from" a company they don't use, or about an account they don't have, is a strong sign of a scam.
// The list arrives with each check and is never stored.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadCompanies() {
  try {
    const raw = JSON.parse(readFileSync(path.join(__dirname, '..', 'data', 'companies.json'), 'utf8'));
    return Array.isArray(raw.companies) ? raw.companies : [];
  } catch (err) {
    console.error('could not load data/companies.json:', err.message);
    return [];
  }
}

const COMPANIES = loadCompanies();

// Companies where a message they don't recognize is very likely fake.
const HIGH_RISK_CATEGORIES = new Set(['bank', 'health', 'utility', 'phone']);

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Single ordinary words (Chase, Apple, Target) must be capitalized to count,
// so "chase the dog" or "apple pie" doesn't trigger anything.
function nameRegex(name) {
  const n = name.trim();
  if (/^[A-Za-z]+$/.test(n)) {
    const cap = n[0].toUpperCase() + n.slice(1);
    return new RegExp(`\\b(${escapeRe(cap)}|${escapeRe(n.toUpperCase())})\\b`);
  }
  return new RegExp(`\\b${escapeRe(n)}\\b`, 'i');
}

const MATCHERS = COMPANIES.map((c) => ({
  company: c,
  keys: new Set([c.name, ...(c.aliases || [])].map(norm)),
  regexes: [c.name, ...(c.aliases || [])].filter(Boolean).map(nameRegex),
}));

// Account types the family can tick, and how a message might mention them.
const ACCOUNT_PATTERNS = {
  'home loan': /\b(home loan|mortgage|home equity|heloc)\b/i,
  'car loan': /\b(car|auto|vehicle) loan\b/i,
  'credit card': /\bcredit card\b/i,
  investments: /\b(investment|brokerage|401\s?\(?k\)?|ira account|retirement account|stock account)s?\b/i,
};

const ACCOUNT_WORDS = {
  'home loan': 'a home loan',
  'car loan': 'a car loan',
  'credit card': 'a credit card',
  investments: 'an investment account',
};

// Cleans what the browser sends: short strings only.
export function cleanTrusted(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const strings = (list, max) =>
    Array.isArray(list)
      ? list.filter((s) => typeof s === 'string' && s.trim()).map((s) => s.trim().slice(0, 60)).slice(0, max)
      : [];
  const companies = strings(raw.companies, 50);
  const accounts = strings(raw.accounts, 10).map((a) => a.toLowerCase());
  if (!companies.length && !accounts.length) return null; // nothing set up yet
  return { companies, accounts };
}

// Returns extra flags (same shape as redflags.js) based on the family's list.
export function trustedFlags(text, trusted) {
  if (!trusted) return [];
  const t = String(text);
  const flags = [];

  const usedKeys = new Set(trusted.companies.map(norm));
  const isUsed = (m) => [...m.keys].some((k) => usedKeys.has(k));
  const ownBank = MATCHERS.find((m) => m.company.category === 'bank' && isUsed(m));

  // 1. Companies the message mentions that are not on their list
  if (trusted.companies.length) {
    const mentioned = MATCHERS.filter((m) => m.regexes.some((re) => re.test(t)));
    for (const m of mentioned) {
      if (isUsed(m)) continue;
      const name = m.company.name;
      const high = HIGH_RISK_CATEGORIES.has(m.company.category);
      flags.push({
        id: `not_your_company:${name}`,
        severity: high ? 'high' : 'medium',
        topic: 'general',
        reason: high
          ? `This says it is from ${name}. ${name} is not one of the companies on your list, so this message is almost certainly not real.`
          : `This mentions ${name}, which is not on your list of companies you use. Be careful before you trust it.`,
        step:
          m.company.category === 'bank' && ownBank
            ? `If you are worried about your money, call your own bank, ${ownBank.company.name}, using the number on your card.`
            : `If you are worried, call the company yourself using a number from a bill or card you already have.`,
      });
      if (flags.length >= 2) break;
    }
  }

  // 2. Accounts the message talks about that they don't have
  for (const [account, re] of Object.entries(ACCOUNT_PATTERNS)) {
    if (!re.test(t) || trusted.accounts.includes(account)) continue;
    const words = ACCOUNT_WORDS[account];
    flags.push({
      id: `not_your_account:${account}`,
      severity: 'high',
      topic: account === 'investments' ? 'investment' : 'general',
      reason: `This talks about ${words}, but you do not have ${words}. A problem with an account you don't have cannot be real.`,
      step: 'You do not need to do anything about this message. It is safe to delete it.',
    });
  }

  return flags;
}

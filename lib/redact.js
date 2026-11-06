// Removes personal numbers before any text leaves our server (for example, to Gemini).
// Phone numbers are kept on purpose: they are what scammers use, and we may look them up.

const PATTERNS = [
  // Social Security number: 123-45-6789 or 123 45 6789
  { name: 'ssn', re: /\b\d{3}[-\s]\d{2}[-\s]\d{4}\b/g },
  // Medicare number (MBI), e.g. 1EG4-TE5-MK73
  { name: 'medicare', re: /\b[1-9][A-Z][A-Z0-9]\d[-\s]?[A-Z][A-Z0-9]\d[-\s]?[A-Z]{2}\d{2}\b/gi },
  // Card numbers: 13 to 19 digits, possibly grouped with spaces or dashes
  { name: 'card', re: /\b(?:\d[-\s]?){12,18}\d\b/g },
  // Bank account or other long ID numbers: 8 to 17 digits in a row,
  // except exactly 10 or 11 digits starting with 1 (likely a phone number)
  { name: 'account', re: /\b\d{8,17}\b/g, keep: (m) => /^1?\d{10}$/.test(m) && (m.length === 10 || m.startsWith('1')) },
];

export function redact(text) {
  let out = String(text);
  let count = 0;
  for (const { re, keep } of PATTERNS) {
    out = out.replace(re, (match) => {
      if (keep && keep(match)) return match;
      count += 1;
      return '[removed]';
    });
  }
  return { text: out, removed: count };
}

// Finds US phone numbers in the text, normalized to 10 digits.
export function findPhoneNumbers(text) {
  const re = /(?:\+?1[\s.-]?)?\(?\b(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})\b/g;
  const found = new Set();
  for (const m of String(text).matchAll(re)) found.add(`${m[1]}${m[2]}${m[3]}`);
  return [...found].slice(0, 3);
}

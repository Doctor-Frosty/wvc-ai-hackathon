// The one right place to report each kind of scam, plus shared wording.
// Contacts verified 2026-11-06 from official sites (see OUTLINE.md, "California support").
// Shown as plain text only: never as clickable links (the no-accidental-harm rule).

const AGENCIES = {
  investment:
    'Report investment and crypto scams to the California Department of Financial Protection and Innovation (DFPI): (866) 275-2677, or dfpi.ca.gov.',
  medicare:
    'Report Medicare scams to the California Senior Medicare Patrol: (855) 613-7080.',
  socialSecurity:
    'Report Social Security scams to the Social Security Office of the Inspector General: oig.ssa.gov/report.',
  moneyLost:
    'If you already sent money or shared details, call your bank first, using the number on your card. Then call Santa Clara County Adult Protective Services, any time, day or night: (408) 975-4900.',
  general:
    'You can report this to the California Attorney General: (800) 952-5225, and to the FTC: (877) 382-4357 or reportfraud.ftc.gov.',
};

const MONEY_LOST = [
  /\bi (already )?(sent|paid|gave|wired|transferred|bought|mailed)\b/i,
  /\bi (gave|told) (them|him|her) my\b/i,
  /\b(they|he|she) (took|has|got) my (money|savings|card|number|password)\b/i,
];

// Picks the single most fitting agency line for this text and its flags.
export function pickAgency(text, flags) {
  const t = String(text);
  if (MONEY_LOST.some((re) => re.test(t))) return AGENCIES.moneyLost;
  if (flags.some((f) => f.topic === 'investment')) return AGENCIES.investment;
  if (/\bmedicare\b/i.test(t)) return AGENCIES.medicare;
  if (/\bsocial security\b|\bssa\b/i.test(t)) return AGENCIES.socialSecurity;
  if (flags.some((f) => f.topic === 'money')) return AGENCIES.moneyLost;
  return AGENCIES.general;
}

export const ALWAYS_STEP_SCAM = 'Do not reply, open any links, or call any number in it.';
export const TRUSTED_PERSON_STEP = 'Call someone you trust, like a family member, before you do anything.';
export const OK_STEPS = [
  'If it later asks for money, a payment, or private numbers, stop and check again.',
  'When in doubt, call back on a number you look up yourself, not one in the message.',
];
export const OK_REPORT = 'If something still feels wrong, trust that feeling and call someone you trust.';

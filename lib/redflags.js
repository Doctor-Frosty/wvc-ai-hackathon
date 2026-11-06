// Scam warning signs. Each rule has a plain, gentle explanation written for someone
// who may not remember using this tool before: every sentence stands on its own.
//
// severity: 'high'  -> one of these alone means "This looks like a scam"
//           'medium' -> two or more mean "This looks like a scam", one means "Be careful"
// topic: used to pick the one right agency to report to (see resources.js)

export const RULES = [
  // ---------- High risk ----------
  {
    id: 'payment',
    severity: 'high',
    topic: 'general',
    patterns: [
      /\bgift ?cards?\b/i, /\b(itunes|google play|steam|apple|amazon|target|walmart|ebay)\s+(gift\s+)?cards?\b/i,
      /\bprepaid (debit )?cards?\b/i, /\bwire (transfer|the money|money)\b/i, /\bwestern union\b/i, /\bmoney ?gram\b/i,
      /\bbitcoin\b/i, /\bcrypto(currency)?\b/i, /\bbitcoin atm\b/i, /\b(zelle|venmo|cash ?app)\b/i,
      /\b(courier|driver|someone)\b.{0,30}\b(pick up|collect)\b.{0,20}\b(cash|money|package)\b/i,
      /\bsend (cash|money)\b/i,
    ],
    reason: 'They want to be paid with gift cards, cryptocurrency, a wire transfer, or cash. Real companies and government offices never ask for payment this way.',
    step: 'Do not buy gift cards, send cryptocurrency, wire money, or hand cash to anyone.',
  },
  {
    id: 'move_money',
    severity: 'high',
    topic: 'money',
    patterns: [
      /\bsafe(ty)? account\b/i, /\bsecure account\b/i, /\bprotect (your|the) (money|savings|funds|account)\b/i,
      /\b(move|transfer|withdraw)\b.{0,25}\b(your )?(money|savings|funds)\b/i,
    ],
    reason: 'They told you to move your money to keep it safe. No real bank or government office ever asks you to do this.',
    step: 'Do not move or withdraw any money. Call your bank using the number on the back of your card.',
  },
  {
    id: 'personal_info',
    severity: 'high',
    topic: 'general',
    patterns: [
      /\bsocial security (number|#)\b/i, /\bssn\b/i, /\bmedicare (number|#|id)\b/i,
      /\b(account|routing|card) (number|#)\b/i, /\b(pin|password|passcode)\b/i,
      /\b(verify|confirm|update)\b.{0,25}\b(identity|account|information|details|number)\b/i,
      /\b(verification|security|one[- ]time) code\b/i,
    ],
    reason: 'They asked for private information, like a password, a code, or your Social Security, Medicare, or bank numbers. Real companies never ask for these by phone, text, or email.',
    step: 'Do not share any numbers, passwords, or codes.',
  },
  {
    id: 'remote_access',
    severity: 'high',
    topic: 'general',
    patterns: [
      /\b(anydesk|teamviewer|logmein|ultraviewer|quick ?support)\b/i, /\bremote (access|control|desktop)\b/i,
      /\b(access|connect to|log ?into)\b.{0,15}\byour (computer|phone|device|screen)\b/i,
      /\b(download|install)\b.{0,20}\b(app|program|software)\b/i, /\bshare your screen\b/i,
    ],
    reason: 'They want to get into your computer or phone. Letting a stranger connect to your device lets them take your money and information.',
    step: 'Do not install anything or let anyone connect to your computer or phone.',
  },
  {
    id: 'secrecy',
    severity: 'high',
    topic: 'general',
    patterns: [
      /\b(don'?t|do not|dont|not to|never)\s+tell\b/i, /\bkeep (this|it)\b.{0,15}\b(secret|quiet|confidential|between us)\b/i,
      /\bconfidential\b/i, /\bbetween (you and me|us)\b/i,
    ],
    reason: 'They asked you to keep it a secret. Scammers say this so no one can warn you. People who really need help are glad when you check with family.',
    step: 'Tell a family member or someone you trust right away. It is always OK to check.',
  },
  {
    id: 'investment',
    severity: 'high',
    topic: 'investment',
    patterns: [
      /\bguarantee[ds]? (return|profit|income)s?\b/i, /\bdouble your (money|investment)\b/i, /\brisk[- ]free\b/i,
      /\b(investment|trading) (opportunity|platform|app|account)\b/i, /\b(high|huge|big) (returns?|profits?)\b/i,
      /\bcrypto(currency)? (investment|trading)\b/i, /\bget rich\b/i,
    ],
    reason: 'It promises big or guaranteed profits from an investment. Real investments never guarantee returns, and this is one of the most common ways people lose their savings.',
    step: 'Do not invest or send any money. Talk with family or your own bank first.',
  },

  // ---------- Medium risk ----------
  {
    id: 'urgency',
    severity: 'medium',
    topic: 'general',
    patterns: [
      /\b(act|respond|call|reply|pay) (now|immediately|today|right away)\b/i, /\bimmediately\b/i, /\burgent(ly)?\b/i,
      /\bwithin \d+ (hours?|hrs?|minutes?|days?)\b/i, /\b(final|last) (notice|warning|chance)\b/i,
      /\b(suspended|locked|frozen|disabled|deactivated|cancel+ed|terminated|expired?)\b/i,
    ],
    reason: 'It tries to rush you. Scammers want you to act before you have time to think or ask someone. A real problem will still be there after you check.',
    step: 'Slow down. You have time to check before you do anything.',
  },
  {
    id: 'threat',
    severity: 'medium',
    topic: 'general',
    patterns: [
      // Threats aimed at the person themselves. "My grandson is in jail" is handled by family_emergency.
      /\b(warrant|lawsuit|sue you|legal action|deport(ed|ation)?|police will|arrest you)\b/i,
      /\byou (will|could|can|may) be (arrested|jailed|sued|deported|charged|prosecuted)\b/i,
      /\b(fine|penalty) of\b/i,
    ],
    reason: 'It threatens you with arrest, jail, a lawsuit, or a fine. Real government offices send letters first and never threaten you over the phone.',
    step: 'Hang up. Real agencies never threaten you like this.',
  },
  {
    id: 'government',
    severity: 'medium',
    topic: 'government',
    patterns: [
      /\b(irs|internal revenue)\b/i, /\bsocial security (administration|office|benefits)\b/i, /\bssa\b/i,
      /\bmedicare\b/i, /\b(sheriff|federal agent|fbi|dea|homeland security|us marshal)\b/i,
    ],
    reason: 'It says it is from a government office. Government offices do not call, text, or email to demand money or your numbers.',
    step: 'If you are worried, call the office yourself using a number from an official letter or card.',
  },
  {
    id: 'family_emergency',
    severity: 'medium',
    topic: 'money',
    patterns: [
      /\b(grandma|grandpa|grandmother|grandfather|nana|granny)\b/i, /\bgrand(son|daughter|child)\b/i,
      /\bit'?s me\b/i, /\b(in jail|bail)\b/i, /\b(he|she|they)('s| is| was| got| were) arrested\b/i,
      /\b(car )?accident\b/i, /\bin the hospital\b/i,
    ],
    reason: 'It says a family member is in trouble. Scammers can now copy a loved one’s voice. Your family member will still be fine after you hang up and call them yourself.',
    step: 'Hang up and call your family member on the number you already have for them.',
  },
  {
    id: 'prize',
    severity: 'medium',
    topic: 'general',
    patterns: [
      /\byou('ve| have)? won\b/i, /\bwinner\b/i, /\b(lottery|sweepstakes|jackpot)\b/i,
      /\bclaim (your )?(prize|reward|winnings|refund)\b/i, /\b(inheritance|unclaimed (funds|money))\b/i,
    ],
    reason: 'It says you won a prize or are owed money. If you have to pay or share details to get it, it is not real.',
    step: 'Do not pay any fee to collect a prize or money.',
  },
  {
    id: 'tech_support',
    severity: 'medium',
    topic: 'general',
    patterns: [
      /\b(virus|malware|infected|hacked|compromised)\b/i, /\b(microsoft|apple|windows|geek squad|norton|mcafee) (support|security|team)\b/i,
      /\btech(nical)? support\b/i,
    ],
    reason: 'It says there is a problem with your computer or account. Real tech companies do not contact you out of the blue about viruses.',
    step: 'Close the message. If you are worried about your computer, ask family or a store you trust.',
  },
  {
    id: 'link',
    severity: 'medium',
    topic: 'general',
    patterns: [
      /\bhttps?:\/\//i, /\bwww\./i, /\b[a-z0-9-]+\.(com|net|org|info|xyz|top|site|online|link|click|co|io|us|me)\b(\/\S*)?/i,
      /\b(bit\.ly|tinyurl|t\.co|goo\.gl|rb\.gy|cutt\.ly)\b/i, /\bclick (here|the link|below)\b/i, /\bscan (the|this) qr\b/i,
    ],
    reason: 'It has a link and wants you to open it. Links in unexpected messages often lead to fake websites that steal information.',
    step: 'Do not open the link. If you need to check an account, type the company’s address yourself or call them.',
  },
  {
    id: 'delivery_toll',
    severity: 'medium',
    topic: 'general',
    patterns: [
      /\b(package|parcel|delivery|shipment)\b.{0,40}\b(failed|held|missed|problem|address|reschedule|fee)\b/i,
      /\b(unpaid|outstanding) (toll|fee|balance)\b/i, /\btoll (road|services?)\b/i,
    ],
    reason: 'It is about a package or an unpaid toll. These are among the most common scam texts right now.',
    step: 'Check with the company yourself using their official app or website, not the message.',
  },
];

const ORDER = { high: 0, medium: 1 };

// Returns the rules that match, most serious first.
export function findRedFlags(text) {
  const t = String(text);
  // Most serious first; an investment pitch leads, since it explains the other signs.
  const lead = (r) => (r.id === 'investment' ? -1 : 0);
  return RULES.filter((rule) => rule.patterns.some((re) => re.test(t))).sort(
    (a, b) => ORDER[a.severity] - ORDER[b.severity] || lead(a) - lead(b)
  );
}

// Turns matched flags (rules plus any trusted-list hits) into a verdict.
export function scoreFlags(flags) {
  const high = flags.filter((f) => f.severity === 'high').length;
  const medium = flags.filter((f) => f.severity === 'medium').length;
  if (high > 0 || medium >= 2) return 'scam';
  if (medium === 1) return 'caution';
  return 'ok';
}

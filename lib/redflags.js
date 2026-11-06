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
      // "gift crad" and other common typos count too.
      /\bgift ?c(ar|ra)ds?\b/i, /\b(itunes|google play|steam|apple|amazon|target|walmart|ebay)\s+(gift\s+)?cards?\b/i,
      /\bprepaid (debit )?cards?\b/i, /\bwire (transfer|the money|money)\b/i, /\bwestern union\b/i, /\bmoney ?gram\b/i,
      /\b(green ?dot|moneypak|vanilla (gift |visa )?card|reloadable (debit )?card)\b/i,
      /\$[\d,]+(\.\d\d)? in cash\b/i, /\bin cash\b.{0,60}\b(pick (it|that|the money|the cash) up|pick up|collect)\b/i,
      // Spanish and Chinese: gift cards, wire transfers
      /tarjetas? de regalo/i, /礼品卡|转账|汇款|比特币/,
      /\bwire\b.{0,25}\b(back|difference|the rest|it to)\b/i,
      // "Overpayment" trick: you were paid too much, now send the difference back.
      /\boverpa(id|yment)\b.{0,80}\b(send|wire|return|pay|refund)\b/i,
      // Fake check: "deposit our check, then send money back"
      /\b(send|wire|return|pay)\b.{0,20}\$[\d,]+.{0,25}\bback\b/i, /\bdeposit (it|the check|this check)\b.{0,80}\b(send|wire|return)\b/i,
      /\bbitcoin\b/i, /\bcrypto(currency)?\b/i, /\bbitcoin atm\b/i,
      // A stranger coming to collect cash or a package is a classic grandparent-scam step.
      /\b(courier|driver|someone|messenger)\b.{0,40}\b(pick (it|that|the cash|the money|the package) up|pick up|collect)\b/i,
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
      /安全账户|安全帳戶/, /cuenta segura/i,
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
      /\b(account|routing|card) (number|#)\b/i,
      // Asking to verify *your* details. ("Reply C to confirm or call the number on your card" is fine.)
      /\b(verify|confirm|update)\b.{0,15}\byour\b.{0,15}\b(identity|account|information|details|number|password|pin)\b/i,
      // Asking you to hand over a code or password. Messages that *give* you a code and say
      // "never share it" are fine, so warnings like "do not share" are skipped.
      /(?<!\b(?:not|never|n't|don'?t)\s)\b(send|give|read|tell|share|provide|enter|reply with|text)\b(?:\s+(?:us|me|him|her|them))?\s+(?:the|your|this|that|a)?\s*(?:(?:\d|one|two|three|four|five|six|seven|eight)[- ]digit\s+)?(code|pin|password|passcode)\b/i,
      /\bwhat('s| is) your\b.{0,15}\b(pin|password|passcode|code)\b/i,
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
      // "Go to this website so I can fix it for you"
      /\bgo to (a|this|the|our) (website|site|link|page)\b.{0,60}\b(fix|connect|access|repair|help)\b/i,
      /\b(fix|repair|clean)\b.{0,25}\b(your|my|the) (computer|laptop|phone|device)\b.{0,20}\b(remotely|for (you|me))\b/i,
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
      /\bno (le )?digas\b/i, /不要告诉|别告诉/,
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
      /立即|马上|冻结|凍結/, /\b(ahora mismo|urgente|inmediatamente)\b/i,
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
      // Utility shut-off threats
      /\b(cut off|shut off|disconnect(ed)?|turn off)\b.{0,25}\b(your |my |the )?(power|electricity|gas|water|service|lights)\b/i,
      /起诉|逮捕|起訴/,
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
      // Family words only count together with trouble words, so "Hi Grandma! See you Sunday" is fine.
      /\b(grandma|grandpa|grandmother|grandfather|nana|granny|grand(son|daughter|child|kid)|it'?s me)\b.{0,200}\b(jail|bail|accident|hospital|arrested|trouble|lawyer|attorney|emergency|money|need help|don'?t tell)\b/i,
      /\b(jail|bail|accident|hospital|arrested|trouble|lawyer|attorney|emergency)\b.{0,200}\b(grandma|grandpa|grandmother|grandfather|nana|granny|grand(son|daughter|child|kid))\b/i,
      /\b(in jail|bail)\b/i, /\b(he|she|they)('s| is| was| got| were) arrested\b/i,
      /\b(car )?accident\b/i, /\bin the hospital\b/i,
      /\b(abuel[oa]|soy yo)\b.{0,200}\b(accidente|c[aá]rcel|fianza|dinero|ayuda|hospital)\b/i,
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
      /\b(errors?|warnings?|problems?)\b.{0,40}\b(microsoft|windows|apple)\b/i,
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
    id: 'fake_invoice',
    severity: 'medium',
    topic: 'general',
    patterns: [
      /\b(renewed|charged|billed|auto[- ]?renew(al|ed)?|subscription|invoice|order)\b.{0,50}\$\s?\d/i,
      /\$\s?\d[\d,.]*.{0,40}\b(renewed|charged|billed|has been (processed|deducted))\b/i,
    ],
    reason: 'It says you were charged for something, like a renewal or an order. Fake bills are a common way to get you to call a scammer.',
    step: 'Check your bank or card statement yourself. Do not call the number in the message.',
  },
  {
    id: 'refund_callback',
    severity: 'medium',
    topic: 'general',
    patterns: [
      /\bif you did not (authorize|make|request|recognize|approve|place)\b/i,
      /\bcall\b.{0,40}\b(to|for)\b.{0,15}\b(refund|cancel|cancellation|dispute)\b/i,
    ],
    reason: 'It wants you to call a number to cancel or get a refund. Scammers use this to get you on the phone and take control of your money.',
    step: 'Do not call the number in the message. Use the number on your card or the company’s official website.',
  },
  {
    id: 'wrong_number',
    severity: 'medium',
    topic: 'investment',
    patterns: [
      /\bwrong number\b.{0,240}\b(trader|trading|invest(or|ing|ment)?|crypto|be friends|get to know you|nice person)\b/i,
    ],
    reason: 'A stranger texted the "wrong number" and wants to be friends. This is often the first step of a long scam that ends in a fake investment.',
    step: 'Do not reply. You can block the number.',
  },
  {
    // Money apps a child might ask a parent to use: only a medium sign on their own,
    // so "Mom, can you Venmo me $20 for pizza?" is "Be careful" at most, not "scam".
    id: 'p2p_payment',
    severity: 'medium',
    topic: 'general',
    patterns: [/\b(zelle|venmo|cash ?app|paypal me)\b/i],
    reason: 'It asks you to send money through an app like Zelle or Venmo. Money sent this way usually cannot be taken back, so be sure you know who you are paying.',
    step: 'Only send money to someone you have confirmed, by calling them on a number you already have.',
  },
  {
    id: 'door_to_door',
    severity: 'medium',
    topic: 'general',
    patterns: [
      /\b(knocked on|at) (my|your|the) (front )?door\b|\bdoor[- ]to[- ]door\b/i,
      /\b(roof|driveway|gutter|tree|chimney|foundation|repair|paving)\b.{0,60}\b(cash|up ?front|today only|deposit)\b/i,
      /\b(half|deposit|pay)\b.{0,20}\bup ?front\b/i,
    ],
    reason: 'Someone came to your door offering a repair and wants cash or money up front. Real contractors give written estimates and don’t pressure you to pay that day.',
    step: 'Don’t pay anything today. Ask for a written estimate and talk with family first.',
  },
  {
    // "Hi, how are you doing?" from someone who may be a stranger: the opening of
    // romance and "pig butchering" scams. Only short, greeting-style texts that
    // don't sound like family or plans, so real texts from loved ones aren't flagged.
    id: 'stranger_greeting',
    severity: 'medium',
    topic: 'general',
    patterns: [],
    test: (t) => {
      const s = t.trim();
      if (s.length > 160) return false;
      const greeting =
        /\bhow are you( doing| today)?\b|\bhow have you been\b|\bis this [A-Z]\w+\b|\blong time no (see|talk)\b|\b(do you|don'?t you) remember me\b|\bit'?s been a while\b|\bare you (there|free to chat)\b/i;
      const familiar =
        /\b(mom|mother|dad|father|grandma|grandpa|nana|granny|papa|auntie|aunt|uncle|sis|bro|honey|love you|xoxo|lunch|dinner|church|doctor|appointment|pick you up|see you)\b/i;
      return greeting.test(s) && !familiar.test(s);
    },
    reason: 'This is a friendly message that may be from a stranger. Some scams start with small talk like this, then ask for money weeks later.',
    step: "If you don't know who sent it, don't reply. If you do know them, it's fine to answer.",
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

// Scammers space out letters ("G i f t  c a r d s") to dodge filters. Join them back up.
function collapseSpacedLetters(s) {
  return s.replace(/\b(?:[A-Za-z] {1,2}){2,}[A-Za-z]\b/g, (m) => m.replace(/ {2,}/g, ' \u0000 ').replace(/ /g, '').replace(/\u0000/g, ' '));
}

// A message *warning* about scams ("Scammers may pretend to be Medicare. Never give your
// Social Security number…") names the same words as a scam. If it reads like a warning and
// doesn't ask for anything, those mentions don't count.
const AWARENESS = /\b(scammers?|beware|watch out for|never (give|share)|(do not|don'?t) (give|share)|be (careful|aware|alert))\b/i;
const ASKS = /\b(verify your|confirm your|send (us|me)|call (us|me) (now|today|immediately)|click|reply with|pay (now|today))\b/i;
const MENTION_ONLY = new Set(['personal_info', 'government']);

// Returns the rules that match, most serious first.
export function findRedFlags(text) {
  const raw = String(text);
  const collapsed = collapseSpacedLetters(raw);
  const t = collapsed === raw ? raw : `${raw}\n${collapsed}`;
  const awarenessOnly = AWARENESS.test(t) && !ASKS.test(t);
  // Most serious first; an investment pitch leads, since it explains the other signs.
  const lead = (r) => (r.id === 'investment' ? -1 : 0);
  const matches = (rule) =>
    !(awarenessOnly && MENTION_ONLY.has(rule.id)) &&
    (rule.patterns.some((re) => re.test(t)) || (typeof rule.test === 'function' && rule.test(raw)));
  return RULES.filter(matches).sort(
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

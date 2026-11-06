// Runs a check on a message or a description of a call.
// Layers: rules (always on) -> trusted-list check -> Gemini second opinion and explanation.
// The AI can add a friendly explanation and raise the verdict one level, but never lower it.

import { findRedFlags, scoreFlags } from './redflags.js';
import { cleanTrusted, trustedFlags } from './trusted.js';
import { aiSecondOpinion, combineVerdicts, cleanExplanation } from './ai.js';
import { pickAgency, ALWAYS_STEP_SCAM, TRUSTED_PERSON_STEP, OK_STEPS, OK_REPORT } from './resources.js';

const HEADLINES = {
  scam: 'This looks like a scam',
  caution: 'Be careful',
  ok: 'No warning signs found',
};

const AI_ONLY_REASON =
  'Our simple checks did not find a clear warning sign, but a closer reading suggests it may not be what it seems.';

function uniq(list) {
  return [...new Set(list.filter(Boolean))];
}

export async function checkText(text, trusted) {
  // Trusted-list reasons come first: they are personal, and the clearest proof.
  const flags = [...trustedFlags(text, cleanTrusted(trusted)), ...findRedFlags(text)];
  const rulesVerdict = scoreFlags(flags);
  const ruleReasons = flags.slice(0, 3).map((f) => f.reason);

  const ai = await aiSecondOpinion(text, rulesVerdict, ruleReasons);
  const verdict = combineVerdicts(rulesVerdict, ai?.verdict);
  const explanation = ai ? cleanExplanation(ai.explanation, verdict) : '';

  if (verdict === 'ok') {
    return {
      verdict,
      headline: HEADLINES.ok,
      reasons: ['We did not find any of the usual warning signs. That does not always mean it is real.'],
      steps: OK_STEPS,
      report: OK_REPORT,
      explanation,
      flags: [],
      ai: Boolean(ai),
    };
  }

  const reasons = ruleReasons.length ? ruleReasons : [AI_ONLY_REASON];

  // Steps: the most specific advice first, then the always-useful ones. Max 3.
  const specific = flags.map((f) => f.step);
  const steps = uniq([specific[0], verdict === 'scam' ? ALWAYS_STEP_SCAM : null, TRUSTED_PERSON_STEP, ...specific.slice(1)]).slice(0, 3);

  return {
    verdict,
    headline: HEADLINES[verdict],
    reasons,
    steps,
    report: pickAgency(text, flags),
    explanation,
    flags: flags.map((f) => f.id),
    ai: Boolean(ai),
  };
}

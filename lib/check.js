// Runs a check on a message or a description of a call.
// Layers: rules (always on) -> trusted-list check -> Gemini second opinion and explanation.
// The AI can add a friendly explanation and raise the verdict one level, but never lower it.

import { findRedFlags, scoreFlags } from './redflags.js';
import { cleanTrusted, trustedFlags } from './trusted.js';
import { aiSecondOpinion, combineVerdicts, cleanExplanation, looksNonEnglish } from './ai.js';
import { lookupNumber } from './keenable.js';
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
  const baseFlags = [...trustedFlags(text, cleanTrusted(trusted)), ...findRedFlags(text)];

  // The Gemini second opinion and the Keenable number lookup run at the same time.
  const [ai, lookup] = await Promise.all([
    aiSecondOpinion(text, scoreFlags(baseFlags), baseFlags.slice(0, 3).map((f) => f.reason)),
    lookupNumber(text),
  ]);

  // Several web reports calling this number a scam is a warning sign of its own.
  const flags = [...baseFlags];
  if (lookup && lookup.scamReports >= 2) {
    const at = flags.findIndex((f) => !String(f.id).startsWith('not_your_'));
    flags.splice(at === -1 ? flags.length : at, 0, {
      id: 'reported_number',
      severity: 'medium',
      topic: 'general',
      reason: `Other people online have reported the number ${lookup.number} as a scam or unwanted call.`,
      step: `Do not call ${lookup.number} back. If you're worried, call the company on a number you look up yourself.`,
    });
  }
  const rulesVerdict = scoreFlags(flags);
  const ruleReasons = flags.slice(0, 3).map((f) => f.reason);
  const verdict = combineVerdicts(rulesVerdict, ai?.verdict, { nonEnglish: looksNonEnglish(text) });
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
      lookup,
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
    lookup,
  };
}

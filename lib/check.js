// Runs a check on a message or a description of a call.
// Layers: rules (always on) -> trusted-list check (next step) -> Gemini explanation (later).
// The AI can add a friendly explanation but can never lower the verdict the rules give.

import { findRedFlags, scoreFlags } from './redflags.js';
import { cleanTrusted, trustedFlags } from './trusted.js';
import { pickAgency, ALWAYS_STEP_SCAM, TRUSTED_PERSON_STEP, OK_STEPS, OK_REPORT } from './resources.js';

const HEADLINES = {
  scam: 'This looks like a scam',
  caution: 'Be careful',
  ok: 'No warning signs found',
};

function uniq(list) {
  return [...new Set(list.filter(Boolean))];
}

export async function checkText(text, trusted) {
  // Trusted-list reasons come first: they are personal, and the clearest proof.
  const flags = [...trustedFlags(text, cleanTrusted(trusted)), ...findRedFlags(text)];
  const verdict = scoreFlags(flags);

  if (verdict === 'ok') {
    return {
      verdict,
      headline: HEADLINES.ok,
      reasons: ['We did not find any of the usual warning signs. That does not always mean it is real.'],
      steps: OK_STEPS,
      report: OK_REPORT,
      explanation: '',
    };
  }

  const reasons = flags.slice(0, 3).map((f) => f.reason);

  // Steps: the most specific advice first, then the always-useful ones. Max 3.
  const specific = flags.map((f) => f.step);
  const steps = uniq([specific[0], verdict === 'scam' ? ALWAYS_STEP_SCAM : null, TRUSTED_PERSON_STEP, ...specific.slice(1)]).slice(0, 3);

  return {
    verdict,
    headline: HEADLINES[verdict],
    reasons,
    steps,
    report: pickAgency(text, flags),
    explanation: '',
    flags: flags.map((f) => f.id),
  };
}

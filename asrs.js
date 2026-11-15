// ASRS-v1.1 6-question screener: items, scoring and copy. Shared by the static site and the hosted preview.
// Sources: NYU Langone patient-facing ASRS-v1.1 screener PDF (items, 5 options, two-level shading, "four or more checkmarks
// in the darkly shaded area" rule; Q1-3 dark from Sometimes, Q4-6 dark from Often; checked visually) and
// Harvard HCP scoring update, 28 Feb 2024 (0-24 points, cutpoint 14, four bands).
export const SCALE = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often'];

export const ITEMS = [
  { q: 'How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?', at: 2, short: 'Finishing final details' },
  { q: 'How often do you have difficulty getting things in order when you have to do a task that requires organization?', at: 2, short: 'Getting things in order' },
  { q: 'How often do you have problems remembering appointments or obligations?', at: 2, short: 'Remembering appointments' },
  { q: 'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?', at: 3, short: 'Delaying getting started' },
  { q: 'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?', at: 3, short: 'Fidgeting when seated' },
  { q: 'How often do you feel overly active and compelled to do things, like you were driven by a motor?', at: 3, short: 'Feeling driven by a motor' },
];

// answers: array of 6 indexes into SCALE
export function score(answers) {
  const marks = answers.map((v, i) => v >= ITEMS[i].at);
  const original = marks.filter(Boolean).length;
  const points = answers.reduce((t, v) => t + v, 0);
  const band = points >= 18 ? 'high positive range' : points >= 14 ? 'low positive range' : points >= 10 ? 'high negative range' : 'low negative range';
  return { marks, original, points, band, posOriginal: original >= 4, posUpdate: points >= 14 };
}

// Interpretation text. Quoted or closely paraphrased from the sources named in each line.
export const SOURCE_TEXT = {
  // NYU/Harvard patient-facing screener: "Four (4) or more checkmarks indicate that your symptoms may be consistent with Adult ADHD. It may be beneficial for you to talk with your healthcare provider about an evaluation."
  originalPositive: 'Four or more checkmarks in the darkly shaded area. The screener says this indicates your symptoms may be consistent with adult ADHD, and that it may be beneficial to talk with your healthcare provider about an evaluation.',
  originalNegative: 'Fewer than four checkmarks in the darkly shaded area, so this rule does not flag your answers. The screener gives no further interpretation for a lower count.',
  // Harvard HCP scoring update, 28 Feb 2024: 14 or more screens positive; 0-9 low negative, 10-13 high negative, 14-17 low positive, 18-24 high positive.
  updatePositive: 'The 2024 scoring update says a total of 14 or more screens positive for ADHD.',
  updateNegative: 'The 2024 scoring update says a total below 14 is a negative screen.',
};

export const NHS_TEXT = [
  'The NHS says: if your ADHD symptoms are affecting your studies, work or relationships, make an appointment with a GP to find out what support is available.',
  'The NHS says the GP will ask about your symptoms and how they affect your life, and may consider other conditions that could be causing them, such as autism, Tourette\'s or anxiety. They may then refer you for an assessment with a specialist.',
  'The NHS says waiting times vary and you may wait several months or years. You may be able to find a clinic with a shorter wait through your GP using the Right to Choose scheme.',
];

export const LINKS = [
  ['The ASRS-v1.1 6-question screener, from NYU Langone (patient-facing PDF)', 'https://nyulangone.org/files/adhd-screener.pdf'],
  ['The full 18-question ASRS-v1.1 checklist (NYU licensing page)', 'https://license.tov.med.nyu.edu/product/asrs-v11-18-question-symptom-checklist'],
  ['The 18-question checklist and instructions (NHS-hosted PDF)', 'https://bsw.icb.nhs.uk/wp-content/uploads/sites/6/2022/06/Adult-ADHD-Self-Report-Scale-ASRS-white.pdf'],
  ['The 2024 scoring update (Harvard, PDF)', 'https://www.hcp.med.harvard.edu/ncs/ftpdir/adhd/ASRS_v1.1_screener%286Q%29_scoring_update.pdf'],
  ['NHS: ADHD in adults', 'https://www.nhs.uk/conditions/adhd-adults/'],
];

export const CREDIT = 'Adult Self-Report Scale-V1.1 (ASRS-V1.1) Screener. © New York University and President and Fellows of Harvard College. All rights reserved. Created by Lenard Adler, MD (NYU) and Ronald C. Kessler, PhD (Harvard), developed with the World Health Organization. The 6-question screener is a subset of the 18-question ASRS-V1.1 Symptom Checklist. NYU states the screener is free to use, including online, with attribution, and that only electronic versions are permitted as modifications. See: Kessler RC, et al. (2005). The World Health Organization Adult ADHD Self-Report Scale (ASRS). Psychological Medicine, 35(2), 245-256. This is an electronic version of the questions, response options, shading and scoring rule. The score summaries and the NHS notes are added by this site. This site is not affiliated with or endorsed by NYU, Harvard, WHO or the NHS.';

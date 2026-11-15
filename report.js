import { SCALE, ITEMS, score, SOURCE_TEXT, LINKS, CREDIT } from './asrs.js';
import { WAIT } from './content.js';
import { AGREE, AREAS, STATEMENTS, EARLY, areaCounts, NHS } from './content.js';

// Report CSS for the downloaded HTML file (a standalone document, opened from disk). On screen the same report is also
// rendered inside the page for printing, styled by the @media print rules in style.css.
export const REPORT_CSS = `
body{font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#222;max-width:760px;margin:24px auto;padding:0 18px}
h1{font-size:24px;margin:0 0 4px}h2{font-size:18px;margin:26px 0 6px;border-bottom:1px solid #ccc;padding-bottom:4px}h3{font-size:15px;margin:16px 0 4px}
table{border-collapse:collapse;width:100%;margin:8px 0}th,td{border:1px solid #ccc;padding:5px 8px;text-align:left;vertical-align:top;font-size:13px}th{background:#f3f3f3}
.box{border:1px solid #999;border-radius:6px;padding:10px 12px;margin:10px 0}.warn{background:#f7f2ee}.big{font-size:22px;font-weight:700}
.small{font-size:12px;color:#555}ul{padding-left:20px}li{margin:3px 0}td.ans{width:150px}a{color:#222}.dark{background:#bbb}.light{background:#e8e8e8}
@media print{body{margin:0;max-width:none}h2{break-after:avoid}table,.box,li{break-inside:avoid}}
`;

function el(tag, attrs, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) if (v != null && v !== false) n.setAttribute(k, v === true ? '' : v);
  for (const k of kids.flat(Infinity)) if (k != null && k !== false) n.append(k.nodeType ? k : document.createTextNode(String(k)));
  return n;
}
const ul = a => el('ul', {}, a.map(t => el('li', {}, t)));
const a = (t, h) => el('a', { href: h }, t);

export function reportNode(st, when) {
  const r = score(st.a), full = st.d.length === STATEMENTS.length && st.early != null;
  const root = el('div', { class: 'report' });
  root.append(
    el('h1', {}, 'ADHD check-in report'),
    el('p', { class: 'small' }, `Self-completed on ${when}. Adult, answering about themselves.`),
    el('div', { class: 'box warn' }, el('b', {}, 'Private health information. '), 'This report holds answers about your health. It was made on your device and has not been sent anywhere. Keep it private, and share it only with people you choose, such as a GP or another professional.'),
    el('div', { class: 'box' }, el('b', {}, 'A screen, not a diagnosis. '), 'The ASRS screener is not a standalone diagnostic tool and a diagnosis should never be made solely on its score. Only a clinical evaluation can diagnose ADHD. The day-to-day statements in section 2 were written for this tool, are not validated and have no score. Nothing here is a percentage or severity rating of ADHD.'),

    el('h2', {}, '1. ASRS-v1.1 screener (6 questions)'),
    el('p', { class: 'small' }, 'Questions and answer options are those of the published ASRS-v1.1 screener. Respondent was asked to answer for the past 6 months. A "yes" in the last column means the answer fell in the darkly shaded area of the form.'),
    el('table', {}, el('tr', {}, el('th', {}, '#'), el('th', {}, 'Question'), el('th', {}, 'Answer'), el('th', {}, 'Darkly shaded?')),
      ITEMS.map((it, i) => el('tr', {}, el('td', {}, i + 1), el('td', {}, it.q), el('td', {}, SCALE[st.a[i]]), el('td', {}, r.marks[i] ? 'yes' : 'no')))),
    el('div', { class: 'box' }, el('div', { class: 'small' }, 'Result using the screener form\'s own counting rule (NYU / Harvard)'), el('div', { class: 'big' }, `${r.original} of 6 in the darkly shaded area`),
      el('p', {}, r.posOriginal ? SOURCE_TEXT.originalPositive : SOURCE_TEXT.originalNegative)),
    el('div', { class: 'box' }, el('div', { class: 'small' }, 'Result using the Harvard 2024 scoring update (a different published method for the same answers)'), el('div', { class: 'big' }, `${r.points} of 24`),
      el('p', {}, `Never 0, Rarely 1, Sometimes 2, Often 3, Very often 4. ${r.posUpdate ? SOURCE_TEXT.updatePositive : SOURCE_TEXT.updateNegative} Range: ${r.band}. Bands: 0-9 low negative, 10-13 high negative, 14-17 low positive, 18-24 high positive.`)),
    el('p', { class: 'small' }, 'The two methods are reported separately and are not combined. They can disagree. Harvard says the original 4-of-6 rule gave high and inconsistent prevalence estimates and that the 0 to 24 method is more robust, especially for research on prevalence.'),
  );
  root.append(el('h2', {}, '2. Day-to-day statements (not part of the ASRS, not validated)'));
  if (full) {
    root.append(el('p', { class: 'small' }, 'Statements written for this tool from the symptom areas the NHS describes. There is no score or cut-off. "Agreed" means Agree or Strongly agree.'));
    const counts = areaCounts(st.d);
    AREAS.forEach((ar, ai) => {
      root.append(...[el('h3', {}, `${ar.name}: ${counts[ai].agreed} of ${counts[ai].n} agreed`), ar.note ? el('p', { class: 'small' }, ar.note) : null,
        el('table', {}, STATEMENTS.map((s, i) => (s.area === ai ? el('tr', {}, el('td', {}, s.q), el('td', { class: 'ans' }, AGREE[st.d[i]])) : null)))].filter(Boolean));
    });
    root.append(el('h3', {}, 'Context'),
      el('table', {}, el('tr', {}, el('td', {}, 'Noticed some of these before about age 12?'), el('td', {}, EARLY[st.early])),
        el('tr', {}, el('td', {}, 'Gets in the way of'), el('td', {}, st.impact.length ? st.impact.join(', ') : 'none selected')),
        el('tr', {}, el('td', {}, 'Also going on at the moment'), el('td', {}, st.other.length ? st.other.join(', ') : 'none selected'))));
  } else root.append(el('p', {}, 'Not completed.'));
  root.append(
    el('h2', {}, '3. What the NHS says'),
    el('h3', {}, 'Traits described in adults'), el('p', {}, el('b', {}, 'Inattentive: '), NHS.traits.inattentive.join('; '), '.'), el('p', {}, el('b', {}, 'Hyperactive and impulsive: '), NHS.traits.hyper.join('; '), '.'),
    el('h3', {}, 'Getting help'), el('p', {}, NHS.route.adult), el('p', {}, NHS.route.wait),
    el('h3', {}, 'What can help'), ul(NHS.adultHelp),
    el('h3', {}, WAIT.title), el('p', {}, WAIT.intro), ...WAIT.groups.flatMap(g => [el('h3', {}, g.label), ul(g.items)]), el('p', { class: 'small' }, WAIT.caveat),
    el('h3', {}, 'Adults and children can look different'), ul(NHS.differences),
    el('p', { class: 'small' }, 'NHS passages are closely paraphrased from nhs.uk (adults page last reviewed 19 March 2025 when this tool was built).'),
    el('h2', {}, '4. What this is based on'),
    ul(LINKS.map(([t, h]) => el('span', {}, t, ': ', a(h, h)))),
    el('p', { class: 'small' }, 'For "what you can try while waiting":'), ul(WAIT.sources.map(([t, h]) => el('span', {}, t, ': ', a(h, h)))),
    el('p', {}, el('b', {}, 'Primary reference: '), 'Kessler RC, Adler L, Ames M, et al. The World Health Organization Adult ADHD Self-Report Scale (ASRS): a short screening scale for use in the general population. Psychological Medicine 2005; 35(2): 245-256.'),
    el('p', { class: 'small' }, CREDIT),
    el('p', { class: 'small' }, 'Limits: this is an electronic version of an existing screener, not a newly validated tool. The day-to-day statements, grouping and this summary were written for this tool and are not part of the ASRS or any NHS material. Self-reported answers depend on how you felt on the day.'),
  );
  return root;
}

export function reportHtml(st, when) {
  const body = reportNode(st, when).outerHTML;
  return `<!doctype html>\n<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>ADHD check-in report</title><style>${REPORT_CSS}</style></head><body>${body}</body></html>`;
                                           }

import { SCALE, ITEMS, score, SOURCE_TEXT, NHS_TEXT, LINKS, CREDIT } from './asrs.js';
import { reportNode, reportHtml } from './report.js';
import { WAIT, APMS } from './content.js';
import { AGREE, AREAS, STATEMENTS, EARLY, IMPACT, OTHER, areaCounts, NHS } from './content.js';
import { C_AGE_BANDS, CHILD, childPrepHtml, CHILD_RESEARCH, CHILD_FREQUENCY, CHILD_SUPPORT, CHILD_SETTINGS, CHILD_HISTORY, childItems, childObservationLines } from './child.js';

const PER_PAGE = 5;
const PAGES = Math.ceil(STATEMENTS.length / PER_PAGE);
const blank = () => ({ path: null, stage: 'home', i: 0, a: [], d: [], early: null, impact: [], other: [], c: [], cage: null, cprep: [], cnote: '', ci: 0, cfreq: [], csupport: [], csettings: [], chistory: null, cwho: '', cvoice: '', ccontext: '' });

function el(tag, attrs, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'class') n.className = v; else if (k === 'on') n.addEventListener('click', v); else if (v !== false && v != null) n.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat(Infinity)) if (k != null && k !== false) n.append(k.nodeType ? k : document.createTextNode(k));
  return n;
}

// store: { load(): object|null, save(obj), clear(), persistent: boolean }
export function mount(root, store, opts = {}) {
  let st = blank();
  try { const v = store.load(); if (v && typeof v === 'object') st = Object.assign(blank(), v); } catch (e) {}
  const save = () => { try { store.save(st); } catch (e) {} };
  const go = patch => { Object.assign(st, patch); save(); render(); const h=root.querySelector('h1,h2'); if(h){h.setAttribute('tabindex','-1'); h.focus({preventScroll:true}); h.scrollIntoView({block:'start'});} else window.scrollTo(0,0); };
  const btn = (label, fn, cls = '', extra) => el('button', Object.assign({ class: 'btn ' + cls, type: 'button', on: fn }, extra || {}), label);
  const reset = () => { try { store.clear(); } catch (e) {} st = blank(); render(); window.scrollTo(0, 0); };
  const link = (t, h) => el('a', { href: h, target: '_blank', rel: 'noopener noreferrer' }, t);

  const fill = (n, total) => { const s = el('span', {}); s.style.width = (n / total) * 100 + '%'; return s; };
  const top = (label, n, total) => el('div', { class: 'top' },
    el('div', { class: 'brand' }, 'ADHD ', el('i', {}, 'check-in')),
    label ? el('div', { class: 'meta' }, el('span', {}, label), el('span', {}, n != null ? `${Math.round((n / total) * 100)}% complete` : '')) : null,
    n != null ? el('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round((n / total) * 100) }, fill(n, total)) : null);

  function footer() {
    const privacy = st.path === 'child'
      ? opts.childFooterPrivacy || 'Nothing on this page is scored or sent anywhere, and it loads nothing from other sites. Your ticks and notes are kept only in this tab\'s memory and are cleared when you close or reload it; use the print or download options if you want to keep the preparation sheet. Like any website, the host keeps standard visit logs (such as IP address and time), which are separate from anything you type here.'
      : opts.footerPrivacy;
    return el('footer', {},
      el('p', { class: 'small' }, privacy),
      (st.a.length || st.d.length || st.path) ? btn('Clear my answers and start over', reset, 'ghost') : null);
  }

  const tap = (opts_, value, pick, labelClass = '') => el('div', { class: 'opts ' + labelClass }, opts_.map((o, i) => el('button', { class: 'btn', type: 'button', 'aria-pressed': String(value === i), on: () => pick(i) }, o)));

  // One question per screen. Tap to answer, moves on by itself. Back keeps answers.
  function single({ label, items, key, optsList, instruction, onDone, onBack, qprefix }) {
    const i = st.i, n = items.length;
    return [top(label, i, n),
      el('p', { class: 'instr' }, instruction),
      el('h2', { class: 'q' }, el('span', { class: 'qn' }, `${i + 1} of ${n}`), items[i].q || items[i]),
      tap(optsList, st[key][i], v => { const a = st[key].slice(); a[i] = v; i === n - 1 ? onDone(a) : go({ [key]: a, i: i + 1 }); }),
      btn('Back', () => (i === 0 ? onBack() : go({ i: i - 1 })), 'ghost'),
      st[key][i] != null && i < n - 1 ? btn('Next', () => go({ i: i + 1 }), 'ghost right') : null];
  }

  function home() {
    return [top(), el('h1', {}, 'A plain-language ADHD check-in'),
      el('p', { class: 'lede' }, 'An adult screener and optional reflection questions, or an unscored everyday-life check-in about a child. With UK guidance and a sheet to prepare for the GP. No account, nothing to pay.'),
      el('div', { class: 'warn' }, el('b', {}, 'A check-in, not a diagnosis'), 'Only a specialist assessment can diagnose ADHD. Nothing here gives a percentage or a severity rating of your ADHD.'),
      el('h2', {}, 'Who is answering?'),
      el('div', { class: 'choice' },
        btn(el('span', {}, el('b', {}, 'I am an adult answering about myself'), el('small', {}, '18 or over. About 5 minutes.')), () => go({ path: 'adult', stage: 'a-intro', i: 0 }), 'card'),
        btn(el('span', {}, el('b', {}, 'Parent, carer or supporting adult about a child'), el('small', {}, 'Under 18. Original everyday-life questions, UK guidance and a preparation sheet.')), () => go({ path: 'child', stage: 'c-age' }), 'card')),
            el('h2', {}, 'Where this comes from'),
      el('p', {}, 'The adult screener is the official ASRS-v1.1 six-question screener, created by Lenard Adler (NYU) and Ronald Kessler (Harvard) with the World Health Organization. Advice on traits, where to go next and what helps comes from the NHS page on ADHD in adults.'),
      el('p', {}, 'The six screener questions are shown exactly as published. The extra plain-language questions are our own, are labelled as such, and are never turned into a score.'),
      btn('What this is based on', () => go({ stage: 'about' })),
      footer()];
  }

  function aIntro() {
    return [top(), el('h1', {}, 'Part 1: the ASRS screener'),
      el('p', { class: 'lede' }, 'Six questions, one at a time. Tap an answer and it moves on.'),
      el('p', {}, 'Think about how you have felt and acted over the past 6 months. Go with your first answer.'),
      el('div', { class: 'note' }, el('b', {}, 'About this part'), 'These six questions are the official ASRS-v1.1 screener, word for word, with its five answer options. They are the part with published scoring and research behind it. In Part 2 you can optionally add your own day-to-day picture.'),
      btn('Start', () => go({ stage: 'a', i: 0, a: [] }), 'primary'), btn('Back', () => go({ stage: 'home', path: null }), 'ghost'), footer()];
  }

  function bridge() {
    return [top('Part 1 done', 100, 100), el('h1', {}, 'Thanks. Part 1 is done.'),
      el('p', { class: 'lede' }, 'Your screener result is ready. You can see it now, or add more first.'),
      el('div', { class: 'note' }, el('b', {}, 'Part 2: your day-to-day (optional, about 4 minutes)'), '30 short statements across six areas, answered Strongly disagree to Strongly agree, plus three quick questions about when it started and what else is going on. These are our own plain-language statements. They are not part of the ASRS, are not validated, and do not produce a score. They give you a picture to talk through with a GP.'),
      btn('Add Part 2', () => go({ stage: 'd', i: 0 }), 'primary'), btn('Just show my result', () => go({ stage: 'result' })), footer()];
  }

  function statementsPage() {
    const p = st.i, from = p * PER_PAGE, items = STATEMENTS.slice(from, from + PER_PAGE);
    const done = items.every((_, k) => st.d[from + k] != null);
    return [top('Part 2 · Your day-to-day', p, PAGES),
      el('h2', { class: 'q' }, 'How true is each statement for you?'),
      el('p', { class: 'instr' }, 'Answer by feel. There are no right answers.'),
      items.map((s, k) => el('div', { class: 'card' }, el('p', { class: 'stmt' }, s.q),
        el('div', { class: 'likert', role: 'group', 'aria-label': s.q }, AGREE.map((lab, v) => el('button', { type: 'button', class: 'dot d' + v, 'aria-pressed': String(st.d[from + k] === v), 'aria-label': lab, on: () => { const d = st.d.slice(); d[from + k] = v; st.d = d; save(); render(); } }, el('span', {}, lab)))))),
      el('div', { class: 'nav' }, btn('Back', () => (p === 0 ? go({ stage: 'bridge' }) : go({ i: p - 1 })), 'ghost'),
        btn(p === PAGES - 1 ? 'Last questions' : 'Next', () => (p === PAGES - 1 ? go({ stage: 'ctx' }) : go({ i: p + 1 })), 'primary', done ? {} : { disabled: true })),
      done ? null : el('p', { class: 'small center' }, 'Answer all five to continue.'), footer()];
  }

  const toggle = (list, v, key) => { const a = st[key].includes(v) ? st[key].filter(x => x !== v) : st[key].concat(v); go0({ [key]: a }); };
  const go0 = patch => { Object.assign(st, patch); save(); render(); };

  function ctxPage() {
    const chips = (list, key) => el('div', { class: 'opts' }, list.map(o => el('button', { class: 'btn', type: 'button', 'aria-pressed': String(st[key].includes(o)), on: () => toggle(null, o, key) }, o)));
    return [top('Part 2 · Three quick questions', 99, 100),
      el('h2', { class: 'q' }, 'Looking back, did you notice some of these before about age 12?'),
      el('p', { class: 'small' }, 'The NHS says ADHD symptoms usually start before the age of 12.'),
      tap(EARLY, st.early, v => go0({ early: v })),
      el('h2', { class: 'q' }, 'Where do these get in the way? (pick any)'), chips(IMPACT, 'impact'),
      el('h2', { class: 'q' }, 'Is any of this going on for you at the moment? (pick any)'),
      el('p', { class: 'small' }, 'These can look like ADHD or sit alongside it.'), chips(OTHER, 'other'),
      el('div', { class: 'nav' }, btn('Back', () => go({ stage: 'd', i: PAGES - 1 }), 'ghost'),
        btn('See my results', () => go({ stage: 'result' }), 'primary', st.early == null ? { disabled: true } : {})),
      st.early == null ? el('p', { class: 'small center' }, 'Answer the first question to continue.') : null, footer()];
  }

  const row = (name, detail, val, yes) => el('div', { class: 'row' + (/^\d+ of \d+$/.test(val) ? '' : ' stack') }, el('div', {}, el('b', {}, name), el('small', {}, detail)), el('div', { class: 'val' + (yes ? ' yes' : '') + (/^\d+ of \d+$/.test(val) ? ' num' : '') }, val));
  function grid(it, i, v) {
    return el('div', { class: 'qrow' }, el('p', {}, `${i + 1}. ${it.q}`),
      el('div', { class: 'cells' }, SCALE.map((name, k) => el('span', { class: 'cell ' + (k >= it.at ? 'dark' : 'light'), role: 'img', 'aria-label': `${name}${k >= it.at ? ', counts' : ''}${k === v ? ', your answer' : ''}` }, k === v ? '\u2713' : ''))),
      el('div', { class: 'cells labs' }, SCALE.map(n => el('span', { class: 'lab' }, n))));
  }
  const list = a => el('ul', {}, a.map(t => el('li', {}, t)));

  function summaryText() {
    const r = score(st.a), lines = ['ADHD check-in summary (self-reported, not a diagnosis)', ''];
    lines.push(`ASRS-v1.1 screener: ${r.original} of 6 checkmarks in the darkly shaded area (screener rule); ${r.points} of 24 on the 2024 scoring update.`);
    if (st.d.length === STATEMENTS.length) {
      lines.push('', 'My own day-to-day statements (not a validated scale), statements agreed with by area:');
      areaCounts(st.d).forEach(a => lines.push(`- ${a.name}: ${a.agreed} of ${a.n}`));
      lines.push('', 'Before about age 12: ' + EARLY[st.early]);
      if (st.impact.length) lines.push('Gets in the way of: ' + st.impact.join(', '));
      if (st.other.length) lines.push('Also going on: ' + st.other.join(', '));
    }
    return lines.join('\n');
  }
  function copyBox() {
    const t = summaryText(); const ta = el('textarea', { class: 'sum', readonly: true, rows: 9, 'aria-label': 'Summary to share with a GP' }); ta.value = t;
    return [el('p', { class: 'small' }, 'You can copy this summary to take to a GP. It stays on your device unless you share it.'), ta,
      btn('Copy summary', e => { ta.select(); try { navigator.clipboard.writeText(t); e.target.textContent = 'Copied'; } catch (x) { document.execCommand && document.execCommand('copy'); } })];
  }

  // ---- Child route (guidance + preparation; no third-party questionnaire items embedded) ----
  function cAge() {
    return [top(), el('h1', {}, 'About your child'),
      el('p', { class: 'lede' }, CHILD.intro),
      el('div', { class: 'warn' }, el('b', {}, 'Original everyday-life check-in'), 'Our own questions help describe attention-related routines, support needs and impact. They are not a validated ADHD test, have no diagnostic score, and are not copied from the SDQ or another scale. A recent fortnight is used only to help recall examples, not to test diagnostic duration.'),
      el('h2', {}, "Child's age"),
      tap(C_AGE_BANDS, st.cage, v => go({ cage: v, stage: 'c-info', ci: 0, cfreq: [], csupport: [] })),
      btn('Back', () => go({ stage: 'home', path: null }), 'ghost'), footer()];
  }

  function cInfo() {
    const band = st.cage === 0 ? 'u6' : st.cage === 1 ? 's612' : 's1317';
    const b = CHILD.bands[band];
    return [top(), el('h1', {}, `Age ${C_AGE_BANDS[st.cage].toLowerCase()}: the UK pathway`),
      el('p', {class:'lede'}, 'You can complete our original everyday-life questions, or go straight to guidance and GP preparation.'), btn('Start the everyday-life check-in', () => go({stage:'c-observe',ci:0}), 'primary'), el('details', {}, el('summary', {}, 'UK guidance and optional official questionnaires'), b.body.map(p => el('p', {}, p)),
      el('h2', {}, 'Official questionnaires (on the publishers\' own sites)'),
      el('ul', {}, CHILD.official.map(([t, h]) => el('li', {}, link(t, h)))),
      el('details', { class: 'how' }, el('summary', {}, 'Why the questionnaires are linked, not built in'), el('p', { class: 'small' }, CHILD.rightsNote))),
      el('div', { class: 'nav' }, btn('Back', () => go({ stage: 'c-age' }), 'ghost'),
        btn('Prepare for the GP', () => go({ stage: 'c-prep' }), 'primary')),
      footer()];
  }

  function cObserve() {
    const items=childItems(st.cage), q=items[st.ci];
    const ready=st.cfreq[st.ci]!=null && st.csupport[st.ci]!=null;
    return [top('Child everyday-life check-in',st.ci,items.length), el('h1',{},q[0]),
      el('p',{class:'small'},'Our own questions, unvalidated and unscored. Think about the last two weeks. Only describe what you observed; not sure is a useful answer.'),
      el('h2',{},q[1]), el('p',{},q[2]),
      tap(CHILD_FREQUENCY,st.cfreq[st.ci],v=>{const a=st.cfreq.slice();a[st.ci]=v;go0({cfreq:a});}),
      el('h2',{},'When this came up, how much extra support was needed?'),
      el('p',{class:'small'},'Think about help, adjustments or effort needed to take part, not how much ADHD someone has.'),
      tap(CHILD_SUPPORT,st.csupport[st.ci],v=>{const a=st.csupport.slice();a[st.ci]=v;go0({csupport:a});}),
      el('div',{class:'nav'},btn('Back',()=>st.ci===0?go({stage:'c-info'}):go({ci:st.ci-1}),'ghost'),
       btn(st.ci===items.length-1?'Add the context':'Next',()=>st.ci===items.length-1?go({stage:'c-context'}):go({ci:st.ci+1}),'primary',ready?{}:{disabled:true})),footer()];
  }
  function cContext() {
    const field=(label,key)=>{const t=el('textarea',{class:'sum',rows:3,'aria-label':label,maxlength:3000});t.value=st[key];t.addEventListener('input',()=>{st[key]=t.value;save();});return [el('h2',{},label),t];};
    return [top(),el('h1',{},'Put the observations in context'),
      el('p',{class:'lede'},'Optional. Different views can all be useful. Do not guess what happens somewhere you have not observed.'),
      el('h2',{},'Your role'),el('div',{class:'opts'},['Parent / carer','Teacher / school staff','Other supporting adult'].map(x=>btn(x,()=>go0({cwho:x}),'',{'aria-pressed':String(st.cwho===x)}))),
      el('h2',{},'Which settings have you observed?'),el('div',{class:'opts'},CHILD_SETTINGS.map(x=>btn(x,()=>go0({csettings:st.csettings.includes(x)?st.csettings.filter(y=>y!==x):st.csettings.concat(x)}),'',{'aria-pressed':String(st.csettings.includes(x))}))),
      el('h2',{},'How long has this pattern been noticeable?'),tap(CHILD_HISTORY,st.chistory,v=>go0({chistory:v})),
      ...field('What does the child or young person want people to understand? (their words, if they want to add them)','cvoice'),
      ...field('Examples, impact and what helps. Any recent changes in sleep, health, mood, learning or circumstances?','ccontext'),
      el('p',{class:'small'},'These other factors may matter, with or without ADHD. This page cannot work out the cause. Avoid names or other identifying details.'),
      btn('See the everyday-life summary',()=>go({stage:'c-profile'}),'primary'),btn('Back',()=>go({stage:'c-observe',ci:childItems(st.cage).length-1}),'ghost'),footer()];
  }
  function cProfile() {
    return [top(),el('h1',{},'Everyday-life summary'),
      el('div',{class:'warn'},el('b',{},'Your observations, not an ADHD result'),'There is no total, cut-off, probability or severity rating. These questions have not been validated. They do not confirm or rule out ADHD, even when few difficulties were noticed.'),
      el('p',{},'Age band: '+C_AGE_BANDS[st.cage]+'. Recent window: two weeks, for recalling examples only.'),
      list(childObservationLines(st)),
      el('h2',{},'Use this to start a conversation'),
      el('p',{},'Ask the child or young person what feels difficult and what already helps. If possible, bring a separate view from school, home or another setting. Keep differences visible rather than averaging them into one judgement.'),
      el('p',{},'If difficulties are affecting learning, relationships or family life, discuss them with the GP, health visitor or school. Severe impact should lead to direct specialist referral under NICE NG87 1.2.8, not a wait for a check-in score. This page cannot assess urgency or replace professional help.'),
      st.cage===0?el('p',{},'For under-6s, treat these as observations for a health visitor, GP or nursery conversation. No developmental norms or ADHD interpretation are applied.'):null,
      btn('Add GP preparation and save',()=>go({stage:'c-prep'}),'primary'),btn('Review context',()=>go({stage:'c-context'}),'ghost'),
      el('details',{},el('summary',{},'Research behind the design, not validation of these questions'),
       el('p',{},'NICE informs settings, development and impact; the 2024 and 2026 youth reviews support careful multi-informant assessment and show measurement-evidence gaps. Our wording, fortnight window and support options are design choices, not a published instrument or validated model.'),
       list(CHILD_RESEARCH.map(([t,h])=>link(t,h))),
       el('p',{},'Before any screening accuracy claim, these exact items need clinician and lived-experience review, cognitive interviews in each age/respondent group, and prospective comparison with independent specialist assessments. Reliability, validity and subgroup fairness must be checked separately.')),
      footer()];
  }

  function cPrep() {
    const chips = el('div', { class: 'opts' }, CHILD.prep.chips.map(o => el('button', { class: 'btn', type: 'button', 'aria-pressed': String(st.cprep.includes(o)), on: () => { const a = st.cprep.includes(o) ? st.cprep.filter(x => x !== o) : st.cprep.concat(o); go0({ cprep: a }); } }, o)));
    const ta = el('textarea', { class: 'sum', rows: 6, 'aria-label': CHILD.prep.notesPrompt }); ta.value = st.cnote;
    ta.addEventListener('input', () => { st.cnote = ta.value; save(); });
    return [top(), el('h1', {}, CHILD.prep.title),
      el('p', { class: 'lede' }, CHILD.prep.intro),
      el('h2', {}, 'Tick what applies'), chips,
      el('h2', {}, CHILD.prep.notesPrompt), ta,
      el('div', { class: 'nav' }, btn('Back', () => go({ stage: st.cfreq.length ? 'c-profile' : 'c-info' }), 'ghost'),
        btn('See the preparation sheet', () => go({ stage: 'c-sum' }), 'primary')),
      footer()];
  }

  function cSum() {
    if (opts && opts.exports === false) return [top(), el('h1', {}, 'Your preparation sheet'),
      el('p', { class: 'small' }, 'In the standalone version, buttons here print or download this sheet, made on your device. Download and print controls are switched off in this hosted review. This is how the sheet reads:'),
      st.cfreq.length ? list(childObservationLines(st)) : null,
      el('ul', {}, st.cprep.length ? st.cprep.map(c => el('li', {}, c)) : el('li', {}, 'Nothing ticked.')),
      st.cnote ? el('p', {}, st.cnote) : null,
      btn('Back', () => go({ stage: 'c-prep' }), 'ghost'), footer()];
    return [top(), el('h1', {}, 'Your preparation sheet'),
      el('p', { class: 'lede' }, 'Print or save this and take it to the appointment. It is made on your device; nothing is sent anywhere.'),
      st.cfreq.length ? list(childObservationLines(st)) : null,
      el('ul', {}, st.cprep.length ? st.cprep.map(c => el('li', {}, c)) : el('li', {}, 'Nothing ticked.')),
      st.cnote ? el('p', {}, st.cnote) : null,
      el('div', { class: 'nav' }, btn('Back', () => go({ stage: 'c-prep' }), 'ghost'),
        btn('Print or save as PDF', printReport, 'primary'), btn('Download as a web page (HTML)', downloadReport)),
      el('p', { class: 'small' }, 'The PDF comes from your browser\'s print window: choose "Save as PDF". The sheet holds information about your child\'s health, so store it safely.'),
      footer()];
  }

  const todayStr = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  function printReport() {
    const holder = el('div', { id: 'print-root' });
    if (st.path === 'child') {
      const doc = childPrepHtml(st.cprep, st.cnote, st.cage != null ? C_AGE_BANDS[st.cage] : 'not given', todayStr(), st.cfreq.length ? childObservationLines(st) : []);
      const parsed = new DOMParser().parseFromString(doc, 'text/html');
      if (parsed.body) while (parsed.body.firstChild) holder.append(parsed.body.firstChild);
    } else holder.append(reportNode(st, todayStr()));
    document.body.append(holder);
    const done = () => { holder.remove(); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    try { window.print(); } catch (e) { done(); }
    if (!window.matchMedia || !window.matchMedia('print').matches) setTimeout(() => holder.isConnected && done(), 60000);
  }
  function downloadReport() {
    const d = new Date(), pad = n => String(n).padStart(2, '0');
    const name = st.path === 'child'
      ? `gp-visit-preparation-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.html`
      : `adhd-checkin-report-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.html`;
    const html = st.path === 'child'
      ? childPrepHtml(st.cprep, st.cnote, st.cage != null ? C_AGE_BANDS[st.cage] : 'not given', todayStr(), st.cfreq.length ? childObservationLines(st) : [])
      : reportHtml(st, todayStr());
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    const a = el('a', { href: url, download: name }); document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
  function exportBox() {
    if (opts && opts.exports === false) return [el('h2', {}, 'Save your report'),
      el('p', {}, 'In the standalone version, a button here saves your report as a PDF (through your browser\'s print window) or as a downloadable web page, made on your device. Download and print controls are switched off in this hosted review. This is how the report reads:'),
      el('details', { class: 'how' }, el('summary', {}, 'See the report'), (() => { const d = el('div', { class: 'report-inline' }); d.append(reportNode(st, todayStr())); return d; })())];
    return [el('h2', {}, 'Save your report'),
      el('p', {}, 'A report for you and, if you choose, a professional: your answers, the screener result under each published method, your day-to-day responses kept separate, the NHS guidance and the sources.'),
      btn('Print or save as PDF', printReport, 'primary'), btn('Download as a web page (HTML)', downloadReport),
      el('p', { class: 'small' }, 'The PDF comes from your browser\'s print window: choose "Save as PDF" as the destination. Both are made on your device and nothing is uploaded. The report holds health information, so store it safely and share it only with people you choose.')];
  }

  function about() {
    return [top(), el('h1', {}, 'What this is based on'),
      el('p', { class: 'lede' }, 'The screening questions and scoring come from published instruments. Everything else is labelled as ours.'),
      el('h2', {}, 'The screener'),
      el('p', {}, 'The six screener questions, the five answer options, the two-level shading and the counting rule come from the ASRS-v1.1 6-question screener, created by Lenard Adler (NYU) and Ronald Kessler (Harvard) with the World Health Organization. NYU\'s licensing page lists it as free to use with attribution, allowing electronic versions with no other modifications. The primary paper is Kessler RC et al., Psychological Medicine 2005; 35(2): 245-256.'),
      el('p', {}, 'Harvard published an updated way of scoring the same six answers in 2024 (0 to 24 points, cutpoint 14, four bands). It is shown as a second, separate method. The two are never merged into one verdict.'),
      el('h2', {}, 'What is ours'),
      el('p', {}, 'The 30 day-to-day statements, the six area groupings, the three context questions, the child everyday-life questions, GP-preparation checklist and report layout were written for this tool from the symptom areas the NHS describes and what NICE says an assessment needs. The statements and checklist are not validated, have no score or cut-off, and are not part of the ASRS.'),
      el('h2', {}, 'The England comparison'),
      el('p', {}, 'The national figures on the result page come from NHS England\'s Adult Psychiatric Morbidity Survey 2023/4, which used these same six ASRS questions with adults across England. They describe the population, not any individual.'),
      el('h2', {}, 'Recent research complements the adult check-in'),
      el('p',{},'The 2024 UK adult assessment standard and 2025 adult evidence review emphasise examples, childhood history, context and functional impact. They support the purpose of the optional day-to-day picture; they do not validate our 30 statements, change the ASRS score or turn emotional regulation or executive-function difficulties into ADHD-specific markers.'),
      el('h2', {}, 'The guidance'),
      el('p', {}, 'Traits, how to get help, waiting times and what can help are closely paraphrased from the NHS pages on ADHD. The child route paraphrases NICE guideline NG87, with recommendation numbers shown.'),
      el('h2', {}, 'Not used'),
      el('p', {}, 'The longer 18-question ASRS checklist and the DSM-5 version have their own licensing terms with NYU, so they are not included. The child questionnaires (SDQ, NICHQ Vanderbilt, SNAP-IV) are linked to their official publishers but not built into this page: the SDQ\'s owner does not permit electronic versions without authorisation, NICHQ offers the Vanderbilt as a free download without stating interactive-rebuild rights, and the SNAP-IV\'s reuse terms are unverified. Rewording someone else\'s validated questions would break their accuracy, so it is not done.'),
      el('h2', {}, 'Sources'), el('ul', {}, LINKS.concat(CHILD_RESEARCH, CHILD.official.map(([t, h]) => [t, h]), [APMS.source]).map(([t, h]) => el('li', {}, link(t, h)))),
      el('p', { class: 'small' }, CREDIT),
      btn('Back', () => go({ stage: st.path === 'adult' ? 'a-intro' : 'home' }), 'ghost')];
  }

  function adultResult() {
    const r = score(st.a), full = st.d.length === STATEMENTS.length && st.early != null;
    const out = [top(), el('h1', {}, 'Your results')];
    // 1. The screening result, from the screener's own counting rule, in the source's own words.
    out.push(el('div', { class: 'result ' + (r.posOriginal ? 'flag' : '') },
      el('small', {}, 'ASRS-v1.1 screener, using its own counting rule (NYU)'),
      el('div', { class: 'big' }, `${r.original} of 6`),
      el('p', {}, r.posOriginal ? SOURCE_TEXT.originalPositive : SOURCE_TEXT.originalNegative),
      r.posOriginal ? null : el('p', {}, 'A count below four does not rule out ADHD. The NHS says that if symptoms are affecting your studies, work or relationships, it is worth making a GP appointment.'),
      el('p', { class: 'small' }, 'This is a screen, not a diagnosis. NYU says the screener is not a standalone diagnostic tool and that diagnosis should never be made solely on its score.')));
    out.push(el('p', { class: 'small' }, `Harvard's 2024 update scores the same six answers a different way and gives ${r.points} of 24. The two methods can disagree, so they are kept apart. See "How the screener is scored" below.`));
    out.push(el('div', { class: 'note' }, el('b', {}, APMS.title), ' ', APMS.body, ' ', el('a', { href: APMS.source[1], target: '_blank', rel: 'noopener noreferrer' }, 'Source: NHS England survey chapter'), '.'));
    out.push(el('p', { class: 'small' }, APMS.extra+' Contains public sector information licensed under the Open Government Licence v3.0.'));
    out.push(el('details',{},el('summary',{},'How newer research complements this result'),el('p',{},'The 2024 UK assessment standard and 2025 adult evidence review emphasise real examples, developmental history, impact and more than one information source. Our optional day-to-day questions can help organise that conversation, but they are not validated and do not alter this ASRS result. Emotional or executive-function difficulties are useful context, not proof of ADHD.'),list(CHILD_RESEARCH.filter((_,i)=>i===3||i===4).map(([t,h])=>link(t,h)))));
    out.push(...exportBox());
    // 2. What the user told us.
    if (full) {
      const counts = areaCounts(st.d);
      out.push(el('h2', {}, 'What you told us'),
        el('p', { class: 'small' }, 'Our own plain-language statements, not part of the ASRS. Not validated, no cut-off. The bars only show how many statements in each area you agreed with. They cannot tell you whether you have ADHD, or how much.'),
        counts.map((a, ai) => {
          const agreed = STATEMENTS.map((x, i) => ({ x, i })).filter(o => o.x.area === ai && st.d[o.i] >= 3);
          return el('div', { class: 'area' }, el('div', { class: 'areahead' }, el('b', {}, a.name), el('span', {}, `${a.agreed} of ${a.n} agreed`)),
            el('div', { class: 'meter', 'aria-hidden': 'true' }, Array.from({ length: a.n }, (_, k) => el('i', { class: k < a.agreed ? 'on' : '' }))),
            agreed.length ? el('ul', { class: 'agreed' }, agreed.map(o => el('li', {}, o.x.q, st.d[o.i] === 4 ? el('em', {}, ' (strongly)') : null))) : null,
            a.note ? el('small', {}, a.note) : null);
        }),
        row('Noticed before about age 12', 'The NHS says symptoms usually start before 12. A clinician will ask about this.', EARLY[st.early]),
        st.impact.length ? row('Gets in the way of', 'The NHS suggests seeing a GP if symptoms affect studies, work or relationships.', st.impact.join(', ')) : null,
        st.other.length ? row('Also going on', 'The NHS says a GP may consider other things that could cause symptoms, such as anxiety. Anxiety and depression can make ADHD symptoms worse, and sleep matters.', st.other.join(', ')) : null);
    } else {
      out.push(btn('Add Part 2: my day-to-day (optional)', () => go({ stage: 'd', i: 0 })));
    }
    // 3. What to do next.
    out.push(el('h2', {}, 'What to do next'), el('p', {}, NHS.route.adult), el('p', {}, NHS.route.wait), el('p', {}, link('NHS: ADHD in adults', NHS.adultsUrl)));
    if (full) out.push(el('h3', {}, 'Take this to a GP'), copyBox());
    // 4. Traits and what helps.
    out.push(el('h2', {}, WAIT.title), el('p', {}, WAIT.intro));
    WAIT.groups.forEach(g => out.push(el('h3', {}, g.label), list(g.items)));
    out.push(el('p', { class: 'small' }, WAIT.caveat), el('details', { class: 'how' }, el('summary', {}, 'Where this comes from'), el('ul', {}, WAIT.sources.map(([t, h]) => el('li', {}, link(t, h))))));
    out.push(el('h2', {}, 'The traits the NHS describes in adults'),
      el('p', {}, el('b', {}, 'Inattentive: ')), list(NHS.traits.inattentive), el('p', {}, el('b', {}, 'Hyperactive and impulsive: ')), list(NHS.traits.hyper),
      el('h2', {}, 'What can help, from the NHS'), list(NHS.adultHelp),
      el('h2', {}, 'Adults and children can look different'), list(NHS.differences));
    // 5. Explanation of scoring, sources.
    out.push(el('h2', {}, 'How the screener is scored'),
      el('details', {}, el('summary', {}, 'Both scoring methods, and your answers on the form'),
        el('p', { class: 'small' }, 'The same six answers can be scored two published ways. They are shown separately and not combined.'),
        row('Screener rule: checkmarks in the darkly shaded boxes', r.posOriginal ? SOURCE_TEXT.originalPositive : SOURCE_TEXT.originalNegative, `${r.original} of 6`, r.posOriginal),
        row('2024 scoring update: total out of 24', `Never 0, Rarely 1, Sometimes 2, Often 3, Very often 4. ${r.posUpdate ? SOURCE_TEXT.updatePositive : SOURCE_TEXT.updateNegative} Your range: ${r.band}.`, `${r.points} of 24`, r.posUpdate),
        el('p', { class: 'small' }, 'Harvard says the original 4-of-6 rule gave high and inconsistent prevalence estimates, and that the 0 to 24 method is more robust, especially for research on prevalence. Bands: 0-9 low negative, 10-13 high negative, 14-17 low positive, 18-24 high positive.'),
        el('p', { class: 'small' }, 'Your answers on the form. Dark boxes count under the screener rule. Light boxes do not. A tick marks your answer.'),
        ITEMS.map((it, i) => grid(it, i, st.a[i]))),
      el('h2', {}, 'Sources'), el('ul', {}, LINKS.map(([t, h]) => el('li', {}, link(t, h)))),
      el('p', { class: 'small' }, CREDIT),
      el('p', { class: 'small' }, 'Part 2 statements, the summary and the way answers are grouped were written for this page and are not part of the ASRS or any NHS material. The NHS passages are closely paraphrased from nhs.uk (adults page last reviewed 19 March 2025 as seen when this was built).'),
      btn('Start over', reset), footer());
    return out;
  }

  function render() {
    root.replaceChildren();
    let body;
    const S = st.stage;
    if (S === 'home') body = home();
    else if (S === 'a-intro') body = aIntro();
    else if (S === 'a') body = single({ label: 'Part 1 · ASRS screener', items: ITEMS, key: 'a', optsList: SCALE, instruction: 'Over the past 6 months, how have you felt and conducted yourself?', onDone: a => go({ a, stage: 'bridge', i: 0 }), onBack: () => go({ stage: 'a-intro' }) });
    else if (S === 'bridge') body = bridge();
    else if (S === 'd') body = statementsPage();
    else if (S === 'ctx') body = ctxPage();
    else if (S === 'c-age') body = cAge();
    else if (S === 'c-info') body = cInfo();
    else if (S === 'c-observe') body = cObserve();
    else if (S === 'c-context') body = cContext();
    else if (S === 'c-profile') body = cProfile();
    else if (S === 'c-prep') body = cPrep();
    else if (S === 'c-sum') body = cSum();
    else if (S === 'result') body = adultResult();
    else if (S === 'about') body = about();
    else body = home();
    root.append(...body.flat(Infinity).filter(Boolean));
  }
  render();
}

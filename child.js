// Child route: age-gated, NICE NG87-grounded guidance and GP-preparation, plus signposts to the official
// questionnaires. No third-party questionnaire items are reproduced in this preview, because the reuse terms
// for each candidate instrument do not clearly cover interactive embedding (see RIGHTs notes below).
// Pathway text paraphrases NICE NG87 recommendations (cited by number). Preparation prompts are our own,
// clearly labelled, and produce no score.

export const C_AGE_BANDS = ['Under 6', '6 to 12', '13 to 17'];

export const CHILD = {
  intro: 'For a child, the UK guidance (NICE NG87) says only a specialist - a child psychiatrist, paediatrician or specialist ADHD service - can diagnose ADHD, after a full assessment that includes a developmental history and reports from people who see the child in more than one setting, such as school (NG87 1.3.1). Symptoms need to be present in two or more settings, such as home and school, with at least moderate impact (NG87 1.3.3). A questionnaire on its own is never the diagnosis (NG87 1.3.2).',
  whyNoQuizHere:
    'There are proper, validated child questionnaires - NICE names the Conners\' rating scales and the Strengths and Difficulties Questionnaire (SDQ) as helpful added tools, and the NICHQ Vanderbilt scales (US-authored, ages 6 to 12) are another option. Each has an owner whose terms do not clearly allow us to rebuild their questions inside an interactive page like this one. Rather than reword someone else\'s questions (which would break their accuracy), this page helps you use the official versions and get ready for the GP.',
  bands: {
    u6: {
      title: 'Under 6',
      body: [
        'Use age-appropriate professional advice rather than the adult questions. The SDQ has age-specific forms, including for ages 2 to 4, but none is embedded in this preview. The NHS has a page on the signs of ADHD in children and what to look for.',
        'If you are worried, speak to your health visitor or GP, and (if they attend one) the nursery or preschool, so people who see your child in different settings can compare notes.',
      ],
    },
    s612: {
      title: '6 to 12',
      body: [
        'NICE (the UK guideline, NG87) names the Conners\' rating scales and the Strengths and Difficulties Questionnaire (SDQ) as helpful added tools alongside an assessment. The official versions are linked below; electronic-use rights have not been secured for this page.',
        'The SDQ is a UK-authored option, with parent and teacher versions for ages 4 to 17. Official paper versions are free from its owner (Youthinmind), and there is an official free online scorer for completed paper forms at sdqscore.org; it is an external service with its own privacy terms.',
        'A US-authored set, the NICHQ Vanderbilt scales (ages 6 to 12), is free to print from its publisher, with a parent form, a teacher form and scoring instructions. A professional will usually want both a parent view and a teacher view, because a diagnosis needs evidence from more than one setting.',
        'What the GP will do (NICE NG87): if the impact is severe, they should refer straight to a specialist children\'s service, without a watchful-waiting period first (1.2.8 - a recommendation for direct referral, not a promised appointment time). If the impact is moderate, they may suggest watchful waiting of up to 10 weeks, and should offer a referral to group-based ADHD-focused parent support, which does not wait for a diagnosis (1.2.7). GPs do not diagnose ADHD or start medication in children (1.2.9).',
        'The specialist may also offer a QbTest - a short computer-based attention and activity test - for children aged 6 to 17 as part of the assessment (NICE, 2024).',
      ],
    },
    s1317: {
      title: '13 to 17',
      body: [
        'For teenagers the pathway is the same, and their own view matters: NICE says children and young people\'s views should be taken into account (1.3.6). The SDQ has an official self-report version for ages 11 to 17 on sdqinfo.org, alongside the parent and teacher versions.',
        'The Vanderbilt scales were validated for ages 6 to 12, so they are not the right fit at this age. QbTest, if offered by the specialist, covers ages 6 to 17.',
        'If the impact is severe, the GP should refer straight to a specialist service, without a watchful-waiting period first (1.2.8 - a recommendation for direct referral, not a promised appointment time). If the impact is moderate, they may suggest watchful waiting of up to 10 weeks plus group-based parent support, which does not wait for a diagnosis (1.2.7).',
      ],
    },
  },
  prep: {
    title: 'Getting ready for the GP (our own checklist - not a medical form)',
    intro: 'These prompts mirror what NICE says a specialist assessment needs. They produce no score. Tick what applies and add examples; the result is a preparation sheet you can print or save.',
    chips: [
      'Difficulties at home (routines, homework, mealtimes, family life)',
      'Difficulties at school or college (attention, behaviour, friendships, schoolwork)',
      'Been present since before about age 12 / primary school years',
      'Happening in more than one setting (home and school, clubs, relatives\' homes)',
      'Affecting learning, friendships or family life in a real way',
      'Sleep problems',
      'Other things going on too (worries, low mood, tics, learning difficulties)',
      'A close relative has ADHD or similar traits',
    ],
    notesPrompt: 'Specific examples worth telling the GP (what happens, where, how often, since when):',
  },
  official: [
    ['NICHQ Vanderbilt Assessment Scales (US-authored, ages 6-12), official 1st-edition download - parent + teacher forms', 'https://nichq.org/downloadable/nichq-vanderbilt-assessment-scales/'],
    ['SDQ official site (UK-authored) - paper questionnaires free, ages 2-17 and adult (sdqinfo.org)', 'https://www.sdqinfo.org/'],
    ['SDQscore - external scorer for completed paper SDQs (own privacy terms)', 'https://sdqscore.org/SDQ'],
    ['NICE NG87 recommendations: ADHD diagnosis and management', 'https://www.nice.org.uk/guidance/ng87/chapter/recommendations'],
    ['NHS: ADHD in children and young people', 'https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/symptoms/'],
  ],
  rightsNote:
    'Why the questionnaires are linked, not built in: the SDQ\'s owner (Youthinmind) does not permit electronic versions without their authorisation (sdqinfo.org). NICHQ offers the Vanderbilt 1st edition as a free download but does not state permission to rebuild it interactively; it is copyright 2002 AAP and NICHQ. The SNAP-IV\'s reuse terms are unverified. No permission request or external contact is planned. The NHS publication licence does not automatically cover third-party questionnaires.',
};

export function childPrepHtml(prep, note, bandLabel, when, observations = []) {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const items = prep.length ? prep.map(c => `<li>${esc(c)}</li>`).join('') : '<li>Nothing ticked yet</li>';
  return `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>GP visit preparation - child ADHD concerns</title><style>
body{font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#222;max-width:720px;margin:24px auto;padding:0 18px}
h1{font-size:22px;margin:0 0 4px}h2{font-size:17px;margin:22px 0 6px;border-bottom:1px solid #ccc;padding-bottom:4px}
.box{border:1px solid #999;border-radius:6px;padding:10px 12px;margin:10px 0}.warn{background:#f7f2ee}.small{font-size:12px;color:#555}ul{padding-left:20px}li{margin:3px 0}
@media print{body{margin:0;max-width:none}}
</style></head><body>
<h1>Getting ready for the GP: ADHD concerns about my child</h1>
<p class="small">Prepared ${esc(when)}. Child's age band: ${esc(bandLabel)}. Written by the parent or carer using a checklist; not a medical form and not a score.</p>
<div class="box warn"><b>Private information.</b> This sheet is about your child's health. It was made on your device and not sent anywhere. Share it only with people you choose, such as the GP.</div>
${observations.length ? `<h2>Everyday-life check-in (original, unvalidated)</h2><p>These are observations, not a score or diagnosis. The recent fortnight is a memory aid, not a diagnostic duration.</p><ul>${observations.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
<h2>What applies</h2><ul>${items}</ul>
<h2>Examples to tell the GP</h2><p>${note ? esc(note).replace(/\n/g, '<br>') : '(none written)'}</p>
<h2>What UK guidance says happens next</h2>
<ul>
<li>Only a specialist can diagnose ADHD in a child - never a questionnaire on its own (NICE NG87 1.3.1, 1.3.2).</li>
<li>The specialist will want a developmental history and reports from more than one setting, such as school (NG87 1.3.1, 1.3.3).</li>
<li>With severe impact, NICE recommends the GP refer straight to a specialist, without a watchful-waiting period first (NG87 1.2.8) - this is a referral recommendation, not a promised appointment time. With moderate impact, they may suggest watchful waiting up to 10 weeks and should offer group-based parent support without waiting for a diagnosis (NG87 1.2.7).</li>
<li>Specialists can offer a QbTest for ages 6 to 17 as part of the assessment (NICE, 2024).</li>
</ul>
<p class="small">Questionnaires a professional may use: the SDQ (UK-authored; official paper forms free at sdqinfo.org, external scorer for completed paper forms at sdqscore.org, with its own privacy terms) and the NICHQ Vanderbilt scales (ages 6-12; free official download at nichq.org). Links were correct when this sheet was made.</p>
<p class="small">Design sources for the original questions (not evidence validating their wording): NICE NG87; Peterson et al. Pediatrics 2024; Bunford et al. Journal of Clinical Child &amp; Adolescent Psychology 2026. No screening accuracy is claimed.</p>
</body></html>`;
}

// Original everyday-life prompts. Research informs domains, not item validity or scoring.
export const CHILD_RESEARCH = [
 ['NICE NG87: development, settings, impact and the young person\'s view', 'https://www.nice.org.uk/guidance/ng87/chapter/recommendations'],
 ['2024 diagnostic-tools review: 231 studies, multiple informants and clinical assessment', 'https://pubmed.ncbi.nlm.nih.gov/38523599/'],
 ['2026 youth assessment review: reliability/validity evidence and gaps', 'https://www.tandfonline.com/doi/full/10.1080/15374416.2026.2660295'],
 ['2025 adult evidence review: impairment, context and diagnostic uncertainties', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12434367/'],
 ['UK adult assessment quality standard, 2024: examples and developmental history', 'https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2024.1380410/full'],
 ['COSMIN 2024: content validity and measurement evaluation', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11541334/'],
];
export const CHILD_FREQUENCY = ['Not noticed in this fortnight', 'On some days', 'On most days', 'Not sure / no chance to observe'];
export const CHILD_SUPPORT = ['No extra support noticed', 'Some extra support', 'A lot of extra support', 'Not sure / no chance to observe'];
export const CHILD_SETTINGS = ['Home', 'Nursery / school / college', 'Clubs / activities', 'With friends / relatives', 'Only one setting observed'];
export const CHILD_HISTORY = ['A pattern over 6 months or longer', 'Noticed more recently', 'Unsure how long', 'Prefer not to answer'];
export function childItems(age) {
 const common = [
  ['Getting going', 'When a familiar activity is ready to begin, how often does getting going need extra reminders or help?', 'Think about getting dressed, beginning a short piece of work, or starting a chosen activity.'],
  ['Keeping a plan in view', 'During an activity with several steps, how often does someone need to help the child find their place again?', 'Use an example from an ordinary day, not an unusually difficult task.'],
  ['Managing a change of activity', 'When it is time to leave one activity for another, how often does the change need extra support?', 'Notice what happens with advance warning as well as without it.'],
  ['Making room for movement', 'How often does the child need a movement break or an adjustment to take part comfortably?', 'Record the situation and what helped. Needing movement does not by itself mean ADHD.'],
  ['Pausing with other people', 'During shared activities, how often is help needed to make space for someone else\'s turn or plan?', 'Think about a game, group activity or conversation.'],
  ['Keeping daily life on track', 'How often do everyday arrangements need rescuing by another person?', 'For example, having what is needed for the day or returning to a plan after an interruption.'],
 ];
 if(age===0)return [
  ['Joining a routine', 'During familiar routines, how often does the child need more hands-on support than you had planned?', 'Describe what happened. Young children vary widely; this is not a comparison with an age norm.'],
  ['Switching activities', 'When moving from play to the next part of the day, how often does extra support help the change happen?', 'Note whether a warning, familiar routine or quieter space helped.'],
  ['Taking part comfortably', 'How often do surroundings or the pace of an activity need changing for the child to join in?', 'Describe the setting, rather than labelling the child.'],
  ['Shared play', 'During play with someone else, how often does an adult need to help keep the activity working for everyone?', 'Observe only situations you have actually seen.'],
 ];
 if(age===2)return common.map((x,i)=>[x[0],x[1].replace('the child','the young person'),[
  'For example, starting independent study or getting ready to leave, including activities they chose.',
  'Think about independent work or a practical task. Ask what it felt like from their side.',
  'Consider transitions between lessons, home, study and social time.',
  'Include internal discomfort the young person describes, not only visible movement.',
  'Ask about group work or time with friends without treating one disagreement as a pattern.',
  'For example, balancing school or college materials, plans and commitments. Record support that hides the effort.',
 ][i]]);
 return common;
}
export function childObservationLines(state) {
 const items=childItems(state.cage);
 const lines=items.map((q,i)=>`${q[0]}: ${CHILD_FREQUENCY[state.cfreq?.[i]] || 'Not answered'}; ${CHILD_SUPPORT[state.csupport?.[i]] || 'Not answered'}.`);
 if(state.cwho)lines.unshift('Observer: '+state.cwho);
 lines.push('Observed settings: '+(state.csettings?.join(', ') || 'Not given'));
 lines.push('History: '+(CHILD_HISTORY[state.chistory] || 'Not given'));
 if(state.cvoice)lines.push('Child / young person\'s own words: '+state.cvoice);
 if(state.ccontext)lines.push('Context, examples and what helps: '+state.ccontext);
 return lines;
                               }

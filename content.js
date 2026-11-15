// Our own plain-language statements, NOT the ASRS and NOT a validated scale. Written from the symptom areas the NHS lists
// for ADHD (inattention, restlessness/hyperactivity, impulsivity) plus everyday organisation and emotions. Used only to show
// the user which areas they agreed with. No score, no cut-off, no diagnosis comes from them.
export const AGREE = ['Strongly disagree', 'Disagree', 'Not sure', 'Agree', 'Strongly agree'];

export const AREAS = [
  { id: 'focus', name: 'Attention and focus', items: [
    'My mind wanders in conversations, even when I want to listen.',
    'I lose track of what I was doing when something else grabs my attention.',
    'I find it hard to stay with tasks that feel boring, even when they matter.',
    'Noise or movement around me pulls my attention away easily.',
    'I make small mistakes because I rush or skip over details.' ] },
  { id: 'org', name: 'Organisation and time', items: [
    'I run late, or I misjudge how long things will take.',
    'I put tasks off until a deadline forces me to start.',
    'My space, bag or paperwork gets messy faster than I can keep up.',
    'With a big task, I find it hard to know where to start or how to split it up.',
    'I often lose everyday things like my keys, phone or wallet.' ] },
  { id: 'mem', name: 'Remembering and finishing', items: [
    'I forget plans, messages or things I said I would do.',
    'I start things and leave them half done.',
    'I need alarms, lists or reminders to get through the day, and I still miss things.',
    'I walk into a room and forget why I went there.',
    'I find it hard to follow instructions that have several steps.' ] },
  { id: 'rest', name: 'Restlessness and energy', items: [
    'I feel restless or on edge when I have to sit still.',
    'I fidget, tap or shift about without meaning to.',
    'It is hard for me to switch off, even in my free time.',
    'I feel like I always need to be doing something.',
    'I take on lots of things at once because I have so much energy.' ] },
  { id: 'imp', name: 'Acting on impulse', items: [
    'I say things before I have thought them through.',
    'I interrupt people, or finish their sentences for them.',
    'I make quick decisions or purchases and regret them later.',
    'I find it hard to wait my turn, in queues or in conversation.',
    'I get bored quickly and look for something new.' ] },
  { id: 'emo', name: 'Feelings and stress', note: 'This is not one of the symptom groups the NHS lists for ADHD. It is here because people often mention it when they talk to a GP, and many other things cause these feelings too.', items: [
    'My mood can change quickly because of small things.',
    'I get frustrated or overwhelmed more easily than most people I know.',
    'Criticism or setbacks hit me hard.',
    'It takes me a long time to calm down once I am worked up.',
    'Everyday stress seems harder for me to handle than it is for other people.' ] },
];
export const STATEMENTS = AREAS.flatMap((a, ai) => a.items.map(q => ({ q, area: ai })));

export const EARLY = ['Yes, quite a lot', 'Some of them', 'Not sure', 'No'];
export const IMPACT = ['Work or study', 'Home and daily life', 'Relationships and friendships', 'Money or admin'];
export const OTHER = ['Poor sleep', 'Feeling anxious', 'Low mood or feeling down', 'A lot of stress right now'];

// Statements agreed with = Agree or Strongly agree (index 3 or 4). Counts per area only. Not a score.
export function areaCounts(d) {
  return AREAS.map((a, ai) => {
    const idx = STATEMENTS.map((s, i) => (s.area === ai ? i : -1)).filter(i => i >= 0);
    return { name: a.name, note: a.note, n: idx.length, agreed: idx.filter(i => d[i] >= 3).length, strong: idx.filter(i => d[i] === 4).length };
  });
}

// NHS wording, paraphrased closely. Source pages and review dates noted in README.
export const NHS = {
  adultsUrl: 'https://www.nhs.uk/conditions/adhd-adults/',
  childUrl: 'https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/symptoms/',
  traits: {
    inattentive: ['being easily distracted or forgetful', 'finding it hard to organise your time', 'finding it hard to follow instructions or finish tasks', 'losing things often, like a wallet, mobile or keys'],
    hyper: ['having a lot of energy or feeling restless', 'being very talkative or interrupting conversations', 'making quick decisions without thinking about what might happen as a result'],
  },
  childTraits: {
    inattentive: ['being easily distracted', 'finding it hard to listen to what people are saying or to follow instructions', 'forgetting everyday tasks, like brushing their teeth or putting on socks'],
    hyper: ['having high energy levels', 'fidgeting or tapping their hands and feet', 'talking noisily', 'feeling restless, or getting up and moving around when they are supposed to sit still', 'finding it hard to wait their turn, or interrupting conversations'],
  },
  adultHelp: [
    'Make time for physical activity you enjoy. The NHS says exercise can be a good focus for energy and can reduce anxiety and depression, which can make ADHD symptoms worse.',
    'Get enough sleep: a regular bedtime and a quiet, dark bedroom, and try to avoid screens, caffeine, sugar and alcohol close to bedtime.',
    'Aim for a balanced diet and regular mealtimes.',
    'Talk to friends and family about it.',
    'At work, college or university you can ask for "reasonable adjustments", for example a personalised workspace in a quiet area, written instructions as well as spoken ones, or help from another person to plan and structure tasks.',
    'Specialists may also recommend medicines (started and monitored by an ADHD specialist) or talking therapies such as CBT or mindfulness. Not everyone needs or wants medicine.',
  ],
  childHelp: [
    'Make time for physical activities they enjoy, and encourage regular sleep, a balanced diet and regular mealtimes.',
    'Split tasks, like homework or sitting down to eat, into 15 to 20 minute slots with a break in between.',
    'Give clear, simple instructions one at a time, in a calm voice.',
    'Write a to-do list and put it somewhere easy to see.',
    'Give praise when they do well, or use a reward chart.',
    'Talk to a teacher or the school SENCO (special educational needs co-ordinator) about support at school. The NHS says not every child needs help from a health professional.',
    'ADHD medicines must be started and monitored by an ADHD specialist, and talking therapies such as CBT might be recommended.',
  ],
  differences: [
    'NHS: symptoms usually start before the age of 12, so a clinician will ask about childhood, including how things were at school.',
    'In adults the NHS lists forgetfulness, difficulty organising time, losing things and restlessness. In children it lists things like forgetting everyday tasks, fidgeting and getting up when they should sit still.',
    'Most people have symptoms of both the inattentive and the hyperactive-impulsive type. Some only show one.',
    'The NHS says ADHD is thought to be recognised less often in girls and women, perhaps because they more often have inattentive symptoms, which can be harder to spot.',
    'The NHS says many children are easily distracted, impulsive and full of energy, particularly under 5, and this does not mean they have ADHD. It could be tiredness, anxiety or stress.',
  ],
  route: {
    adult: 'If symptoms affect your studies, work or relationships, make a GP appointment. The GP will ask how symptoms affect your life and may consider other things that could cause them, such as autism, Tourette\'s or anxiety, and may refer you to an ADHD specialist.',
    child: 'The NHS suggests talking to the child\'s teacher first, who will usually refer to the school SENCO. If you are still worried, make a GP appointment. If support is not helping, ask the GP or SENCO how to request an ADHD assessment with a specialist such as a paediatrician or child and adolescent psychiatrist. The specialist will usually also contact the school.',
    wait: 'The NHS says waiting times vary and can be several months or years. You may be able to find a clinic with a shorter wait through your GP using the Right to Choose scheme.',
  },
};

// "What you can try while waiting for an assessment". Evidence is graded in three honest groups. Nothing here treats or cures ADHD,
// and nothing implies a diagnosis. Sources are in WAIT.sources.
export const WAIT = {
  title: 'What you can try while waiting for an assessment',
  intro: 'These are low-risk things people try. None of them treats or cures ADHD, and trying them does not mean you have it. They are worth a go whatever the assessment says.',
  groups: [
    { label: 'Backed by NHS advice for adults with ADHD', items: [
      'Move your body in a way you enjoy. The NHS says exercise can be a good focus for energy and can ease anxiety and low mood, which can make ADHD symptoms worse.',
      'Protect your sleep: a regular bedtime, a quiet dark bedroom, and avoiding screens, caffeine, sugar and alcohol close to bedtime.',
      'Eat regular meals and aim for a balanced diet.',
      'Talk to friends and family about how things are for you, and ask for reasonable adjustments at work or study (for example a quieter workspace, written instructions, or help to plan and structure tasks).',
    ] },
    { label: 'Some research behind it, but small, short-term or mixed', items: [
      'Exercise: a 2026 review of trials in adults with ADHD found that a single session had a moderate short-term benefit for self-control (inhibitory control) and a small one for symptoms straight afterwards. Results for regular exercise programmes were mixed. A brisk walk before a task is a low-risk thing to try.',
      'Steady noise: a 2024 meta-analysis of 13 small trials found a small benefit of white or pink noise on short lab attention tasks in children and college-age adults with ADHD or high ADHD symptoms, and a slight negative effect in people without. The noise was played for only minutes, so there is no evidence on long-term use or on real-life symptoms. Rain or a fan are everyday sounds you can experiment with, not the same as the white or pink noise that was tested. Keep the volume low, because long loud listening can damage hearing.',
      'Music: the research is mostly small studies in children. In some, calm music helped reading or arithmetic. In others it did not help, or it made harder tasks worse. In one trial of adults, Mozart lowered negative mood in people with and without ADHD, and silence did not help. So music may help your mood or a dull task and may get in the way of a demanding one. Try it as an experiment, with and without.',
    ] },
    { label: 'Unproven', items: [
      'Binaural beats: the only adult trial I found is a small pilot reported as a conference abstract. People rated their studying as better, but symptom scores, mind-wandering and an attention test did not clearly change. It needs confirming, so treat it as unproven.',
      'No natural cure for ADHD is established.',
    ] },
    { label: 'Everyday experiments to try', items: [
      'Change one thing for a week and see what you notice: sound on or off, a 20 to 25 minute timer, a short walk between tasks.',
      'Put plans and deadlines where you will see them, and use alarms for what you forget.',
      'Keep notes on what helps and what gets in the way. They are useful to show a professional.',
    ] },
  ],
  caveat: 'If low mood, anxiety or other things are making life hard, or you ever feel unsafe, tell your GP. In the UK you can also call NHS 111, or Samaritans on 116 123 at any time.',
  sources: [
    ['NHS: ADHD in adults (self-help, sleep, exercise, diet)', 'https://www.nhs.uk/conditions/adhd-adults/'],
    ['Nigg JT et al. 2024. White and pink noise and attention in ADHD: systematic review and meta-analysis. J Am Acad Child Adolesc Psychiatry 63(8):778-788', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11283987/'],
    ['Xu S, Zhao C, Hu L. Acute and chronic exercise, executive functions and core symptoms in adults with ADHD: systematic review and meta-analysis (Europe PMC)', 'https://europepmc.org/article/med/41638541'],
    ['Saville P et al. 2025. Exploring the intersection of ADHD and music: a systematic review. Behavioral Sciences 15(1):65', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11762814/'],
    ['Malandrone F et al. 2022. Binaural beats pilot RCT in adults with ADHD (conference abstract). European Psychiatry 65(S1):S274', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9564012/'],
    ['NICE NG87: ADHD diagnosis and management (environmental modifications)', 'https://www.nice.org.uk/guidance/ng87/chapter/Recommendations'],
  ],
};

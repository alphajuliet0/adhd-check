import { score } from './asrs.js';
import { STATEMENTS, areaCounts, AREAS } from './content.js';
import { C_AGE_BANDS, CHILD, childPrepHtml, childItems, childObservationLines, CHILD_FREQUENCY, CHILD_SUPPORT } from './child.js';
let bad = 0;
const t = (name, ok) => { console.log(ok ? 'PASS' : 'FAIL', name); if (!ok) bad = 1; };
for (const [a, o, p] of [[[2,2,1,3,3,0],4,11],[[0,0,0,0,0,0],0,0],[[4,4,4,4,4,4],6,24],[[1,1,1,2,2,2],0,9],[[3,3,3,2,2,2],3,15],[[2,2,2,3,2,2],4,13],[[3,3,3,3,2,2],4,16],[[2,2,2,2,2,2],3,12]]) {
  const r = score(a); t('asrs ' + a.join(''), r.original === o && r.points === p && r.posOriginal === (o >= 4) && r.posUpdate === (p >= 14));
}
t('30 statements, 6 areas of 5', STATEMENTS.length === 30 && AREAS.every(a => a.items.length === 5));
const d = Array(30).fill(0); for (let i = 0; i < 5; i++) d[i] = 4; d[5] = 3;
const c = areaCounts(d); t('area counts', c[0].agreed === 5 && c[0].strong === 5 && c[1].agreed === 1 && c[2].agreed === 0);
// Child route
t('3 age bands with content', C_AGE_BANDS.length === 3 && Object.keys(CHILD.bands).length === 3);
const sheet = childPrepHtml(['Sleep problems'], 'Sits at the back of class', '6 to 12', '15 November 2026');
t('prep sheet html', sheet.includes('Sleep problems') && sheet.includes('Sits at the back of class') && sheet.includes('6 to 12') && sheet.includes('NICE NG87'));
t('prep sheet escapes html', childPrepHtml(['<b>x</b>'], '<script>', '13 to 17', 'd').indexOf('<script>') === -1);

t('original child paths 4/6/6', childItems(0).length===4 && childItems(1).length===6 && childItems(2).length===6);
t('teen context distinct', childItems(1)[0][2]!==childItems(2)[0][2]);
const observations=childObservationLines({cage:1,cfreq:[3,0,1,2,3,0],csupport:[3,0,1,2,3,0],csettings:['Home'],cwho:'Parent / carer',chistory:2,cvoice:'<script>alert(1)</script>',ccontext:'quiet room helps'});
t('unknowns not zero', observations.some(x=>x.includes('Not sure / no chance to observe')));
t('observation settings preserved', observations.some(x=>x==='Observed settings: Home'));
t('no child numerical total', !observations.some(x=>/total|probability|positive|negative|of 6/i.test(x)));
const withObs=childPrepHtml([], '', '6 to 12', 'd', observations);
t('child export includes original response', withObs.includes('Getting going: Not sure') && withObs.includes('quiet room helps'));
t('child export safely escapes observations', !withObs.includes('<script>') && withObs.includes('&lt;script>'));
process.exit(bad);

import { score } from './asrs.js';
import { STATEMENTS, areaCounts, AREAS } from './content.js';
let bad = 0;
const t = (name, ok) => { console.log(ok ? 'PASS' : 'FAIL', name); if (!ok) bad = 1; };
for (const [a, o, p] of [[[2,2,1,3,3,0],4,11],[[0,0,0,0,0,0],0,0],[[4,4,4,4,4,4],6,24],[[1,1,1,2,2,2],0,9],[[3,3,3,2,2,2],3,15],[[2,2,2,3,2,2],4,13],[[3,3,3,3,2,2],4,16],[[2,2,2,2,2,2],3,12]]) {
  const r = score(a); t('asrs ' + a.join(''), r.original === o && r.points === p && r.posOriginal === (o >= 4) && r.posUpdate === (p >= 14));
}
t('30 statements, 6 areas of 5', STATEMENTS.length === 30 && AREAS.every(a => a.items.length === 5));
const d = Array(30).fill(0); for (let i = 0; i < 5; i++) d[i] = 4; d[5] = 3;
const c = areaCounts(d); t('area counts', c[0].agreed === 5 && c[0].strong === 5 && c[1].agreed === 1 && c[2].agreed === 0);
process.exit(bad);

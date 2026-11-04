const TITLES=[[0,'Rookie'],[5e3,'Tapper'],[25e3,'Metronome'],[7e4,'Virtuoso'],[13e4,'Maestro'],[2e5,'Legend'],[3.2e5,'Mythic'],[5e5,'Transcendent'],[8e5,'Ascendant'],[12e5,'Eternal']];

let HM=100,LT=0;const DRAIN=2.5; // HM = max health (Half health mod), LT = last frame time, DRAIN = health lost per second with the Drain mod
const hurt=a=>{brk++;hp=Math.max((PS||mo.nf)?1:0,hp-a*.6*(mo.fr?2:1)*(mo.ez?.5:1));combo=0;gw=gw0;if(mo.fc||mo.ap){hp=0;why='Combo broken'}};
function award(o,bd,n){const per=bd<=pw;o.j=per?'P':'G';st[o.j]++;combo++;maxc=Math.max(maxc,combo);hp=Math.min(HM,hp+(mo.fr?0:(per?2.5:1)*(mo.ez?1.5:1)));if(mo.ap&&!per){hp=0;why='Not a Perfect hit'}if(F.q){gw=gw0*(1-Math.min(combo,40)*.006);pw=gw*.4}
 pts+=(per?100:60)*(1+Math.min(combo,50)/100)*SMUL;say(per?'Perfect':(n<o.t?'Early':'Late'),per?cols.ok:cols.ring)}
function fail(o,t,a,undo){if(undo)st[o.j]--;o.hit=-1;st.M++;hurt(a);say(t,cols.hot);tone(100,ac.currentTime,.15,'sawtooth',.25,50)}
/* ================= GRADES, ACHIEVEMENTS, TOASTS ================= */
const GR=['D','C','B','A','S','SS','SSS'],gAcc=a=>a>=97?'S':a>=90?'A':a>=80?'B':a>=60?'C':'D';
const nClr=(a,b)=>{let n=0;for(let i=a;i<b;i++)if(save.best[i])n++;return n};
const GI=g=>GR.indexOf(g||'D'),nGr=g=>Object.values(save.best).filter(b=>GI(b.g)>=GI(g)).length;
const rk=r=>!!(r&&r.win&&r.ranked&&!r.pr&&!r.custom);
// id, name, description, check(run) (null = unlocked directly), hidden until earned
const ACH=[
['first','First steps','Clear a level.',()=>nClr(0,SEC+1)>=1],
['c10','Warmed up','Clear 10 levels.',()=>nClr(0,SEC+1)>=10],
['c50','Getting somewhere','Clear 50 levels.',()=>nClr(0,SEC+1)>=50],
['c100','Centurion','Clear 100 levels.',()=>nClr(0,SEC+1)>=100],
['c200','Completionist','Clear all 200 campaign levels.',()=>nClr(0,NL)>=NL],
['a1','Downbeat cleared','Clear every level in Area 1.',()=>nClr(0,A1)>=A1],
['a2','Afterglow cleared','Clear every level in Area 2.',()=>nClr(A1,100)>=100-A1],
['a3','Dreamstate cleared','Clear every level in Area 3.',()=>nClr(100,150)>=50],
['a4','Zenith cleared','Clear every level in Area 4.',()=>nClr(150,NL)>=50],
['s1','S-tier','Earn an S rank or better.',()=>nGr('S')>=1],
['ss1','Flawless','Earn an SS rank: a full combo with 97%+ accuracy.',()=>nGr('SS')>=1],
['sss1','Perfectionist','Earn an SSS rank: every single note Perfect.',()=>nGr('SSS')>=1],
['ss25','Untouchable','Earn SS or better on 25 different levels.',()=>nGr('SS')>=25],
['sss10','Metronome','Earn SSS on 10 different levels.',()=>nGr('SSS')>=10],
['cb100','Hundred club','Reach a 100 combo.',r=>!!r&&r.maxc>=100],
['cb250','Unbroken','Reach a 250 combo.',r=>!!r&&r.maxc>=250],
['e50','Warm legs','Survive 50 beats in Endless.',()=>save.endBest>=50],
['e150','Marathon','Survive 150 beats in Endless.',()=>save.endBest>=150],
['e300','Ultramarathon','Survive 300 beats in Endless.',()=>save.endBest>=300],
['imp','Impossible','Clear a level on Impossible timing.',r=>rk(r)&&r.diff==4],
['spd','Speed demon','Clear a level at 150% speed or faster.',r=>rk(r)&&r.rate>=1.5],
['spd2','Double time','Clear a level at 200% speed.',r=>rk(r)&&r.rate>=2],
['ap','Nothing but perfect','Clear a level with the All Perfect modifier.',r=>rk(r)&&!!r.mo.ap],
['hd','Blindfolded','Clear a level with the Hidden modifier.',r=>rk(r)&&!!r.mo.hd],
['fr','Glass cannon','Clear a level with the Fragile modifier.',r=>rk(r)&&!!r.mo.fr],
['mr','Through the looking glass','Clear a level with the Mirror modifier.',r=>rk(r)&&!!r.mo.mr],
['tw','Needle threader','Clear a level with the Tight timing modifier.',r=>rk(r)&&!!r.mo.tw],
['lg','Legend','Reach the Legend title.',()=>total()>=2e5],
['map','Mapper','Chart a custom level with 20 or more notes.',null],
['exp','Sharing is caring','Share a level as a .otm file.',null],
['cimp','Community','Import a level from a .otm file.',null],
['sec','Something is waiting','Find the secret level.',()=>!!save.sec,1],
['secc','Behind the door','Clear the secret level.',()=>!!save.best[SEC],1]];
function checkAch(r,quiet){const got=[];for(const a of ACH){if(save.ach[a[0]]||!a[3])continue;let ok=false;try{ok=!!a[3](r||null)}catch(e){}if(ok){save.ach[a[0]]=Date.now();got.push(a)}}
 if(got.length){persist();if(!quiet)got.forEach(a=>toast('Achievement unlocked',a[1]))}}
function unlock(id){if(save.ach[id])return;const a=ACH.find(q=>q[0]==id);if(!a)return;save.ach[id]=Date.now();persist();toast('Achievement unlocked',a[1])}

const $=s=>document.querySelector(s),cv=$('#c'),x=cv.getContext('2d'),ui=$('#ui');
let W,H;function rs(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;x.setTransform(d,0,0,d,0,0)}
addEventListener('resize',rs);rs();
const SC={min:[0,2,3,5,7,8,10],maj:[0,2,4,5,7,9,11],phr:[0,1,3,5,7,8,10],mix:[0,2,4,5,7,9,10],har:[0,2,3,5,7,8,11],loc:[0,1,3,5,6,8,10]};
// A1 (first level of Area 2) and NL (campaign length) are filled in from main/manifest.json at boot.
let A1=50,NL=200;const SEC=200,END=201,CUS=202;
/* ================= SAVE DATA =================
   Progress lives in localStorage ("onetap2") and, when logged in, in Firestore.
   The shape is normalised here so an older or partial save can never crash the game. */
let save={unlocked:1,best:{},runs:[],off:0,diff:2,slow:5,free:false,pr:false,endBest:0,st:{},mods:{},custom:[],ach:{}};
try{Object.assign(save,JSON.parse(localStorage.getItem('onetap2')||'{}'))}catch(e){}
save.st=Object.assign({snd:1,vol:.5,hot:'',ring:'',theme:'auto',fx:1,ar:1,tt:1,fps:1,syn:2},save.st);
save.mods=Object.assign({fc:0,ap:0,fr:0,tw:0,hd:0,mr:0,ez:0,dr:0,hh:0,nf:0},save.mods);
if(typeof save.spd!=='number'||!(save.spd>=.5&&save.spd<=2))save.spd=SL[save.slow]||1;
if(!Array.isArray(save.custom))save.custom=[];
if(!save.ach||typeof save.ach!=='object'||Array.isArray(save.ach))save.ach={};
const persist=()=>{save.ts=Date.now();try{localStorage.setItem('onetap2',JSON.stringify(save))}catch(e){}syncDirty()};

/* ================= OLD SAVES =================
   The campaign used to be ordered differently and its levels were renumbered, so
   saves from before version 5 are moved onto the levels they were earned on.
   L0ID (chart ids in the old order) and PERM (old position -> current position)
   are in legacy-order.js. This runs once, after the level files have loaded. */
function reorder(o){const m=i=>PERM[i]!=null?PERM[i]:i,b={};
 for(const k in o.best||{})b[m(+k)]=o.best[k];
 o.best=b;(o.runs||[]).forEach(r=>{r.l=m(r.l)});
 const hi=Math.max(-1,...Object.keys(b).map(Number).filter(k=>k<NL));
 o.unlocked=Math.max(Math.min(o.unlocked||1,NL),Math.min(NL,hi+2));o.v=5}
function migrate(){
 if(!save.v||save.v<3){ // saves keyed by chart id
  if(save.best[29]&&save.unlocked<31)save.unlocked=31;
  const mp=o=>{const j=L0ID.indexOf(o);return j<0?0:j},nb2={};
  for(const k in save.best)nb2[mp(+k)]=save.best[k];save.best=nb2;save.runs.forEach(r=>r.l=mp(r.l));
  save.unlocked=Math.min(NL,mp(Math.max(0,Math.min(save.unlocked,60)-1))+1);save.v=3;persist()}
 if(save.v<4){if(save.best[100]){save.best[200]=save.best[100];delete save.best[100]}save.runs.forEach(r=>{if(r.l===100)r.l=200});save.v=4;persist()}
 if(save.v<5){reorder(save);persist()}
}

let ac,nb,master,state='menu',lv=0,notes=[],t0=0,hp=100,combo=0,maxc=0,st,fb=null,gw=.1,gw0=.1,SH=false,sx=0,pw=.04,raf,segs,segT,rate=1,F={},pts=0,hn=null,endT=0,cols={},PS=0,ES=1,mo={},SMUL=1,brk=0,why='',LV=0,CL=null,CAB=null,csrc=null,EDI=null,delArm=-1;

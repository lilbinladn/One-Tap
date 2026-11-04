const TR=[[0,'Beginner','#2e9e5b'],[1.5,'Casual','#1a8fc4'],[2.5,'Steady','#a88400'],[3.5,'Tough','#e07b00'],[4.5,'Fierce','#e0452b'],[5.5,'Brutal','#d81b72'],[6.5,'Savage','#8e44d9'],[8,'Merciless','#b00d2a'],[11,'Hellbound','#4a0000']];
const MAXBPM=1000;
// how much each modifier raises (or lowers) the star rating; speed is applied by scaling the level's BPM
const DN=['Easy','Medium','Hard','Extreme','Impossible'],DW=[1.6,1.3,1,.75,.55],DS=[.5,.75,1,1.5,2.5],SL=[.5,.6,.7,.8,.9,1,1.1,1.25,1.5,1.75,2];
/* ================= DIFFICULTY ================= */
// speed x note density, plus a weight per mechanic
const stars=l=>{const bpm=l.bpm||120,f=l.mechanics||{},subs=l.subdivisions&&l.subdivisions.length?l.subdivisions:[1],p=l.density||0,
 tb=Math.max(bpm,...(f.t||[]).map(a=>a[1])),eb=bpm*.6+tb*.4,npb=subs.reduce((a,d)=>a+1+(d-1)*p,0)/subs.length;
 let m=0;for(const k in f)m+=k=='t'?.5+(f.t.length>3?.4:0):(MW[k]||.5);return eb/60*npb*.55+m*.45};
const starsAt=(l,rt,m)=>{const f2=Object.assign({},l.mechanics||{});if(f2.t)f2.t=f2.t.map(q=>[q[0],q[1]*rt]);
 let s=stars(Object.assign({},l,{bpm:(l.bpm||120)*rt,mechanics:f2}));
 for(const k in MSTAR)if(m&&m[k]&&!(m.ap&&k=='fc'))s*=MSTAR[k];return s};
const tier=i=>{const l=lev(i),s=starsAt(l,save.spd||1,save.mods),t=TR.filter(a=>s>=a[0]).pop();return{n:t[1],c:t[2],s,b:stars(l)}};
const srng=(a,b)=>{let lo=1e9,hi=0;for(let i=a;i<b;i++){const q=stars(lev(i));lo=Math.min(lo,q);hi=Math.max(hi,q)}return '★'+lo.toFixed(1)+' to ★'+hi.toFixed(1)};

/* ================= CUSTOM LEVEL RATINGS ================= */
const NMAP={hold:'h',lift:'li',roll:'ro',dbl:'x',tri:'tr',decoy:'d',rb:'rb',sg:'sg',scl:'sc',scr:'sc'};
// same idea as the campaign stars: speed x note density, plus a weight per mechanic (scaled by how much of the level uses it)
const custStars=(c,rt)=>{rt=rt||1;const n=c.notes.length;if(!n)return 0;const npb=Math.min(4,n/Math.max(8,c.beats||8)),cnt={};
 for(const o of c.notes){const k=NMAP[o.t];if(k)cnt[k]=(cnt[k]||0)+1}
 let m=0;for(const k in cnt)m+=(MW[k]||.5)*Math.min(1,cnt[k]/n/.15);
 if(c.fl){if(c.fl.r)m+=MW.r;if(c.fl.w)m+=MW.w;if(c.fl.s)m+=MW.s;if(c.fl.q)m+=MW.q}
 let q=c.bpm*rt/60*npb*.55+m*.45;const mm=Object.assign({},save.mods,c.mods||{});for(const k in MSTAR)if(mm[k]&&!(mm.ap&&k=='fc'))q*=MSTAR[k];return q};
const ctier=c=>{const q=custStars(c,save.spd||1),t=TR.filter(a=>q>=a[0]).pop()||TR[0];return{n:t[1],c:t[2],s:q}};
const cbadge=c=>{const t=ctier(c);return t.s>0?`<u style="background:${t.c}" title="${t.n}. Difficulty rating at your current speed and modifiers.">★${t.s.toFixed(1)}</u>`:'<u style="background:#6a6388">Empty</u>'};
const ratingHTML=c=>{if(!c.notes.length)return 'Place notes to get a difficulty rating.';const t=ctier(c);return 'Difficulty rating: <b style="color:'+t.c+'">★'+t.s.toFixed(1)+' · '+t.n+'</b>'};

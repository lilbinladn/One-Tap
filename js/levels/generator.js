// deterministic random: same seed, same chart
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
/* ================= CHART GENERATION =================
   The seed decides the pattern, so a level always plays the same way. Mechanics
   in "mechanics" turn some notes into holds, rolls, doubles, decoys and so on. */
function gen(i){if(i==CUS)return genCustom();
 const l=lev(i),BEATS=l.beats,sd=songOf(l),subs=l.subdivisions,p=l.density,f=l.mechanics||{},r=rng(i==END?ES:l.seed),out=[];let pn=7;
 for(let b=0;b<BEATS;b++){const d=subs[Math.floor(r()*subs.length)];
  for(let k=0;k<d;k++){const bt=b+k/d;if(r()<(k==0?(b%4==0||chartId(l)<3?1:.85):p)&&(!out.length||bt-out[out.length-1].b>=.24)){
   pn=Math.max(0,Math.min(13,pn+Math.floor(r()*5)-2));
   if(k==0&&b%2==0){const dg=sd.chords[Math.floor(b/4)%4];for(const o of[0,1,-1,2,-2]){const q=pn+o;if(q>=0&&q<=13&&[0,2,4].includes((((q-dg)%7)+7)%7)){pn=q;break}}}
   out.push({b:bt,n:pn,len:0,dbl:0,decoy:0,hit:0})}}}
 const real=out.slice();
 real.forEach((o,j)=>{const gap=(real[j+1]?real[j+1].b:BEATS+1)-o.b;
  if(f.h&&gap>=1&&r()<f.h)o.len=Math.min(2,Math.floor((gap-.5)*4)/4);
  else if(f.li&&gap>=1.25&&r()<f.li){o.len=Math.min(2,Math.floor((gap-.5)*4)/4);o.lift=1}
  else if(f.ro&&gap>=1.25&&r()<f.ro){o.len=Math.min(2,Math.floor((gap-.5)*4)/4);o.roll=1;o.need=Math.max(3,Math.round(o.len*3))}
  else if(f.tr&&gap>=(l.bpm>140?2:1)&&r()<f.tr)o.dbl=2;
  else if(f.x&&gap>=1&&r()<f.x)o.dbl=1;else if(f.wp&&r()<f.wp)o.warp=1;else if(f.ph&&r()<f.ph)o.ph=1;
  else if(f.rb&&r()<f.rb)o.rb=.75;else if(f.sg&&r()<f.sg)o.sg=1;
  if(f.sc&&r()<f.sc)o.sx=r()<.5?-1:1;
  const g=gap-o.len;if(f.d&&g>=1.5&&r()<f.d)out.push({b:o.b+o.len+g/2,n:0,len:0,dbl:0,decoy:1,hit:0})});
 let res=out.sort((a,b)=>a.b-b.b);
 if(i==END){const r2=rng(ES+5);res=res.filter(o=>{const q=Math.min(1,o.b/300);if(o.decoy)return o.b>150;if(o.b%1&&r2()>.35+.65*q)return false;if(o.b<40)o.len=0;if(o.b<90)o.dbl=0;return true})}
 return res}
function genCustom(){return notesFromChart(CL.notes||[])}

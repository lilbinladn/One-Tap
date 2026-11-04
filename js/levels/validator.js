// chart note list -> the runtime note objects the game plays (also used for custom charts)
function notesFromChart(list){return list.filter(o=>o&&NT.includes(o.t)).sort((a,b)=>(+a.b||0)-(+b.b||0)).map(o=>{
 const r={b:Math.max(0,+o.b||0),n:Math.max(0,Math.min(13,Math.round(+o.n||0))),len:0,dbl:0,decoy:0,hit:0};
 if(o.t=='hold'||o.t=='lift'||o.t=='roll'){r.len=Math.max(.25,+o.len||.5);if(o.t=='lift')r.lift=1;if(o.t=='roll'){r.roll=1;r.need=Math.max(3,Math.round(r.len*3))}}
 else if(o.t=='dbl')r.dbl=1;else if(o.t=='tri')r.dbl=2;else if(o.t=='ph')r.ph=1;else if(o.t=='decoy')r.decoy=1;
 else if(o.t=='rb')r.rb=.75;else if(o.t=='sg')r.sg=1;else if(o.t=='scl')r.sx=-1;else if(o.t=='scr')r.sx=1;
 return r})}

function normLevel(raw,i){if(!raw||typeof raw!=='object')throw new Error('level '+i+' is not an object');
 const num=(v,lo,hi,d)=>{v=+v;return Number.isFinite(v)?Math.min(hi,Math.max(lo,v)):d};
 const subs=(Array.isArray(raw.subdivisions)?raw.subdivisions:[1]).map(v=>Math.round(num(v,1,8,1)));
 return{version:2,id:i,
  name:String(raw.name||'Level '+(i+1)).slice(0,40),
  song:String(raw.song||'neon-drive'),
  bpm:num(raw.bpm,40,MAXBPM,120),
  beats:Math.round(num(raw.beats,8,2000,64)),
  subdivisions:subs.length?subs:[1],
  density:num(raw.density,0,1,.4),
  seed:Math.round(num(raw.seed,0,1e9,13)),
  mechanics:raw.mechanics&&typeof raw.mechanics==='object'?raw.mechanics:{},
  notes:Array.isArray(raw.notes)&&raw.notes.length?notesFromChart(raw.notes):null}}

/* ================= LEVEL FILES (.otm) =================
   A level file is JSON that is gzip-compressed (browsers that can't compress write plain JSON, and import accepts both).
   Audio is never stored inside the file, only the song's name, so people pick their own copy of the song. */
const OTM_MAGIC='onetap-level',NT=['tap','hold','dbl','tri','roll','lift','decoy','ph','rb','sg','scl','scr'];
const gz=async t=>new Uint8Array(await new Response(new Blob([t]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
const gunz=async u8=>{const rd=new Blob([u8]).stream().pipeThrough(new DecompressionStream('gzip')).getReader(),parts=[];let n=0;
 for(;;){const{done,value}=await rd.read();if(done)break;n+=value.length;if(n>8e6){rd.cancel();throw new Error('That level file is too large.')}parts.push(value)}
 return new TextDecoder().decode(await new Blob(parts).arrayBuffer())};
const r5=v=>Math.round(v*1e5)/1e5;
const clean=t=>String(t==null?'':t).replace(/[<>&"'`\u0000-\u001f]/g,'').trim();
function cleanLevel(l,by){if(!l||typeof l!=='object')throw new Error('That isn’t a One Tap level.');
 const num=(v,lo,hi,d)=>{v=+v;return Number.isFinite(v)?Math.min(hi,Math.max(lo,v)):d};
 if(!Array.isArray(l.notes)||!l.notes.length)throw new Error('That level has no notes.');if(l.notes.length>6000)throw new Error('That level has too many notes.');
 const beats=Math.round(num(l.beats,8,2000,64)),notes=[];
 for(const o of l.notes){if(!o||!NT.includes(o.t))continue;notes.push({b:num(o.b,0,beats,0),n:Math.round(num(o.n,0,13,7)),t:o.t,len:['hold','lift','roll'].includes(o.t)?num(o.len,.25,8,.5):0})}
 if(!notes.length)throw new Error('That level has no usable notes.');
 const f=l.fl&&typeof l.fl==='object'?l.fl:{},mods={};for(const m of MODS)if(l.mods&&l.mods[m[0]])mods[m[0]]=1;if(mods.nf){delete mods.fc;delete mods.ap}if(mods.ez&&mods.fr)delete mods.ez;
 return{id:'c'+Date.now().toString(36)+Math.floor(Math.random()*1e4).toString(36),name:clean(l.name).slice(0,40)||'Imported level',bpm:num(l.bpm,40,MAXBPM,120),off:num(l.off,0,600,0),beats,si:(()=>{const j=typeof l.song==='string'?SONGS.findIndex(s=>s.id===l.song):-1;return j>=0?j:Math.round(num(l.si,0,SONGS.length-1,0))})(),
  audio:l.audio?1:0,audioName:clean(l.audioName).slice(0,80),dur:l.audio?num(l.dur,0,7200,0):0,notes,
  fl:{r:[0,2,4,8].includes(+f.r)?+f.r:0,w:f.w?1:0,s:[0,.5,1].includes(+f.s)?+f.s:0,q:f.q?1:0},mods,by:clean(by).slice(0,24)}}
const sig=c=>canon({bpm:c.bpm,off:c.off,beats:c.beats,an:c.audioName||'',notes:c.notes.map(o=>[r5(o.b),o.n,o.t,r5(o.len||0)])});
// A level is verified once its creator has cleared it from the start themselves. The hash ties the
// verification to the current chart, so editing the notes afterwards means playing it again.
const vhash=c=>{const s=sig(c);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(36)+'.'+s.length};
const verified=c=>!!(c&&c.vt&&c.vh&&c.vh===vhash(c));

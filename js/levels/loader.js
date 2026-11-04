/* ================= CAMPAIGN LEVELS (main/) =================
   Every campaign level is its own file under main/, listed in main/manifest.json.
   A level carries its metadata plus the seed its chart is generated from, so the
   note pattern is rebuilt on the fly instead of shipping a note dump. A level may
   also set "notes" to a fixed chart instead of a seed.
   Songs live in songs/manifest.json: a song can be synthesised from its scale/chords,
   or played from a real file given as "url" or as base64 in "audio". */
const AREAS=[];             // [{name,first,count}] in play order
const SONGS=[],SONGBY={};   // songs/manifest.json in file order (custom levels store the index)
const CAMP=[];              // campaign levels in play order
const LEV=[];               // any level by index, including SEC, END and CUS
let SECRET=null;            // the hidden level, also LEV[SEC]

const songOf=l=>SONGBY[l&&l.song]||SONGS[0];
const songAt=i=>SONGS[i]||SONGS[0];
const lev=i=>LEV[i];
const chartId=l=>Math.round((((l&&l.seed)||13)-13)/977); // chart 0 has seed 13, chart 1 has 990…
const beatsOf=i=>i==CUS?CL.beats:i==END?400:lev(i)?lev(i).beats:64;

const SONG_URL='songs/manifest.json',MAIN_URL='main/manifest.json';
async function mainJSON(url){const r=await fetch(url,{cache:'no-cache'});if(!r.ok)throw new Error(url+' ('+r.status+')');return r.json()}

// Boot: songs first, then the manifest, then every level file in one round of requests.
async function loadMain(){
 const [songFile,idx]=await Promise.all([mainJSON(SONG_URL),mainJSON(MAIN_URL)]);
 SONGS.length=0;for(const k in SONGBY)delete SONGBY[k];
 for(const s of songFile.songs||[]){
  const o={id:String(s.id||'song-'+SONGS.length),name:String(s.name||s.id||'Song'),root:+s.root||60,
   scale:Array.isArray(s.scale)&&s.scale.length?s.scale:SC.maj,chords:Array.isArray(s.chords)&&s.chords.length?s.chords:[0,4,5,3],
   lead:s.lead||'triangle',drums:Math.round(+s.drums)||0,url:String(s.url||''),audio:String(s.audio||'')};
  SONGS.push(o);SONGBY[o.id]=o}
 if(!SONGS.length)throw new Error('songs/manifest.json lists no songs');
 if(!Array.isArray(idx.levels)||!idx.levels.length)throw new Error('main/manifest.json lists no levels');
 const raw=await Promise.all(idx.levels.map((f,i)=>mainJSON('main/'+f).catch(e=>{throw new Error('level '+(i+1)+': '+e.message)})));
 CAMP.length=0;LEV.length=0;
 raw.forEach((r,i)=>{const l=normLevel(r,i);CAMP.push(l);LEV[i]=l});
 NL=CAMP.length;
 AREAS.length=0;
 const ar=Array.isArray(idx.areas)&&idx.areas.length?idx.areas:[{name:'Campaign',first:0,count:NL}];
 ar.forEach(a=>AREAS.push({name:String(a.name||'Area').slice(0,24),first:Math.round(+a.first)||0,count:Math.round(+a.count)||0}));
 A1=AREAS[1]?AREAS[1].first:NL;
 if(idx.secret){try{const s=normLevel(await mainJSON('main/'+idx.secret),SEC);s.id=SEC;s.secret=true;SECRET=s;LEV[SEC]=s}catch(e){console.warn('secret level missing:',e.message)}}
}

function levelToFile(c){return{fmt:OTM_MAGIC,v:2,by:SYNC.acct?SYNC.acct.name:'',level:{name:c.name,bpm:c.bpm,off:c.off,beats:c.beats,song:songAt(c.si).id,si:c.si,audio:c.audio?1:0,audioName:c.audioName||'',dur:c.audio?r5(c.dur||0):0,
 notes:c.notes.map(o=>({b:r5(o.b),n:o.n,t:o.t,len:o.len?r5(o.len):0})),fl:c.fl,mods:c.mods}}}
async function shareLevel(i){const c=save.custom[i];if(!c)return;const json=JSON.stringify(levelToFile(c));let data;
 try{data=typeof CompressionStream==='function'?await gz(json):new TextEncoder().encode(json)}catch(e){data=new TextEncoder().encode(json)}
 const a=document.createElement('a'),nm=(c.name.replace(/[^\w\- ]+/g,'').trim().replace(/\s+/g,'_').slice(0,40)||'level')+'.otm';
 a.href=URL.createObjectURL(new Blob([data],{type:'application/octet-stream'}));a.download=nm;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);
 toast('Level saved',nm+(c.audio?' · the song isn’t included':''));unlock('exp')}
async function readLevelFile(file){if(file.size>4e6)throw new Error('That file is too big to be a level.');
 const u8=new Uint8Array(await file.arrayBuffer());let text;
 if(u8[0]===0x1f&&u8[1]===0x8b){if(typeof DecompressionStream!=='function')throw new Error('This browser can’t open compressed level files.');text=await gunz(u8)}else text=new TextDecoder().decode(u8);
 let d;try{d=JSON.parse(text)}catch(e){throw new Error('That file isn’t a One Tap level.')}
 if(!d||d.fmt!==OTM_MAGIC)throw new Error('That file isn’t a One Tap level.');return cleanLevel(d.level,d.by)}
async function importFiles(fl){let ok=0,last='';
 for(const f of fl){try{const c=await readLevelFile(f),sg=sig(c);if(save.custom.some(q=>sig(q)===sg)){toast('Already in your list',c.name);continue}save.custom.push(c);ok++;last=c.name}
  catch(e){toast('Couldn’t import '+clean(f.name).slice(0,30),e.message||'Unreadable file')}}
 if(ok){persist();toast(ok>1?ok+' levels imported':'Level imported',ok>1?'They’re under Custom levels.':last+(save.custom[save.custom.length-1].audio?' · needs the song '+(save.custom[save.custom.length-1].audioName||''):''));unlock('cimp');if(state==='menu'&&$('.wrap'))menu()}}
function importPick(){const inp=document.createElement('input');inp.type='file';inp.multiple=true;inp.accept='.otm,.ot,application/octet-stream';inp.onchange=()=>importFiles([...inp.files]);inp.click()}
addEventListener('dragover',e=>e.preventDefault());
addEventListener('drop',e=>{e.preventDefault();const fl=e.dataTransfer&&[...e.dataTransfer.files];if(fl&&fl.length&&state==='menu'&&$('.wrap'))importFiles(fl)});
// imported levels point at a song the player has to supply themselves
let NA=null;
function needAudio(i,show,from,fromEd){const c=save.custom[i];state='menu';ui.scrollTop=0;NA={i,show,from,fromEd};
 ui.innerHTML=`<div class="p" style="max-width:420px"><h1 style="font-size:24px">Song needed</h1><p><b>${esc(c.name)}</b> was charted for <b>${esc(c.audioName||'a song')}</b>${c.dur?' ('+fmtT(c.dur)+')':''}. Level files don’t include the music, so pick your own copy of the song.</p><p class="nb" id="namsg" style="min-height:20px"></p>
 <div class="row"><button class="main" data-a="na_pick">Choose audio file…</button><button data-a="na_bk">Play without it</button><button data-a="${fromEd?'e_back':'menu'}">Back</button></div></div>`}
function naPick(){const inp=document.createElement('input');inp.type='file';inp.accept='audio/*,.mp3,.wav,.ogg,.m4a';
 inp.onchange=async()=>{const f=inp.files[0];if(!f||!NA)return;const c=save.custom[NA.i],m=$('#namsg');if(m)m.textContent='Decoding audio…';
  try{actx();const bytes=await f.arrayBuffer(),b=await ac.decodeAudioData(bytes.slice(0));MEM[c.id]=bytes;try{await idbPut(c.id,bytes)}catch(e){}ABUF[c.id]=b;PK[c.id]=mkPeaks(b);if(!c.dur)c.dur=b.duration;persist();const n=NA;NA=null;playCustom(n.i,n.show,n.from,n.fromEd)}
  catch(e){const m2=$('#namsg');if(m2)m2.textContent='Could not read that file. Try an MP3, WAV or OGG.'}};inp.click()}

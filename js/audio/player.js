/* Real song audio. A song in main/songs.json can point at an audio file with
   "url" or carry the bytes as base64 in "audio" (raw or gzip). Without either it
   is synthesised from its scale and chords, exactly like before. */
const SBUF={};
async function gunzBytes(u8){const rd=new Blob([u8]).stream().pipeThrough(new DecompressionStream('gzip')).getReader(),parts=[];let n=0;
 for(;;){const{done,value}=await rd.read();if(done)break;n+=value.length;if(n>3e7){rd.cancel();throw new Error('That song is too large.')}parts.push(value)}
 const out=new Uint8Array(n);let o=0;for(const p of parts){out.set(p,o);o+=p.length}return out}
async function songBuffer(song){if(!song||(!song.url&&!song.audio))return null;
 if(song.id in SBUF)return SBUF[song.id];
 ac=ac||new (window.AudioContext||window.webkitAudioContext)();ac.resume();
 try{let u8;
  if(song.url){const r=await fetch(song.url);if(!r.ok)throw new Error('song file '+r.status);u8=new Uint8Array(await r.arrayBuffer())}
  else{const bin=atob(song.audio),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);u8=u[0]===0x1f&&u[1]===0x8b?await gunzBytes(u):u}
  SBUF[song.id]=await ac.decodeAudioData(u8.slice().buffer);return SBUF[song.id]}
 catch(e){SBUF[song.id]=null;throw e}}
const ABUF={},PK={},MEM={};
function actx(){ac=ac||new (window.AudioContext||window.webkitAudioContext)();ac.resume();if(!nb){nb=ac.createBuffer(1,ac.sampleRate>>1,ac.sampleRate);const d=nb.getChannelData(0);for(let k=0;k<d.length;k++)d[k]=Math.random()*2-1}}
function stopCA(){if(csrc){try{csrc.stop()}catch(e){}csrc=null}}
// audio files live in IndexedDB (too big for localStorage); level data lives in the normal save
const idb=()=>new Promise((res,rej)=>{try{const r=indexedDB.open('onetap-audio',1);r.onupgradeneeded=()=>r.result.createObjectStore('a');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}});
const idbPut=(k,v)=>idb().then(d=>new Promise((res,rej)=>{const t=d.transaction('a','readwrite');t.objectStore('a').put(v,k);t.oncomplete=()=>res();t.onerror=()=>rej(t.error)}));
const idbGet=k=>idb().then(d=>new Promise((res,rej)=>{const q=d.transaction('a').objectStore('a').get(k);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)}));
const idbDel=k=>idb().then(d=>new Promise(res=>{const t=d.transaction('a','readwrite');t.objectStore('a').delete(k);t.oncomplete=()=>res();t.onerror=()=>res()})).catch(()=>{});
async function loadAudio(c){if(ABUF[c.id])return ABUF[c.id];actx();let bytes=MEM[c.id];if(!bytes)bytes=await idbGet(c.id);if(!bytes)throw new Error('missing');
 const b=await ac.decodeAudioData(bytes.slice(0));ABUF[c.id]=b;PK[c.id]=mkPeaks(b);return b}

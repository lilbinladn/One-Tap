/* ================= LEVEL EDITOR ================= */
let ED=null,edRaf=0;
const edBeat=()=>ED.play?ED.ph0+(ac.currentTime-ED.at0)*ED.c.bpm/60:ED.ph;
const minPh=()=>ED.c.audio?-ED.c.off*ED.c.bpm/60:0;
const edFit=()=>{const c=ED.c;if(c.audio&&c.dur)c.beats=Math.max(8,Math.floor((c.dur-c.off)*c.bpm/60));persist()};
const edf=n=>{const sd=songAt(ED.c.si),q=sd.scale[((n%7)+7)%7]+12*Math.floor(n/7);return 440*2**((sd.root+12+q-69)/12)};
const edBlip=n=>{try{tone(edf(n),ac.currentTime,.16,songAt(ED.c.si).lead,.14)}catch(e){}};
function delNote(o){const a=ED.c.notes;const i=a.indexOf(o);if(i>=0)a.splice(i,1);if(ED.sel===o)ED.sel=null;ED.ms.delete(o);persist()}
function delSel(){const a=ED.c.notes;for(const o of[...ED.ms]){const i=a.indexOf(o);if(i>=0)a.splice(i,1)}ED.ms.clear();ED.sel=null;persist();edPanel()}
function edPlay(){const c=ED.c,b=ABUF[c.id];edStop(true);ED.play=true;ED.ph0=ED.ph;ED.at0=ac.currentTime+.08;ED.sched=ED.ph-1e-6;
 if(b){const T=c.off+ED.ph*60/c.bpm,s=ac.createBufferSource();s.buffer=b;s.connect(master);if(T>=0){if(T<b.duration)s.start(ED.at0,T)}else s.start(ED.at0-T,0);ED.src=s}}
function edStop(keep){if(ED.src){try{ED.src.stop()}catch(e){}ED.src=null}if(ED.play&&!keep)ED.ph=edBeat();ED.play=false}
function seekTo(b){const wp=ED.play;if(wp)edStop();ED.ph=Math.max(minPh(),b);const vw=ED.cv?ED.cv.clientWidth/ED.zoom:10;if(ED.ph<ED.sc||ED.ph>ED.sc+vw)ED.sc=ED.ph-vw*.2;if(wp)edPlay()}
const clampSc=()=>{ED.sc=Math.max(-2,Math.min(ED.c.beats,ED.sc))};
function setBpm(v){const c=ED.c;v=Math.round(v*100)/100;if(!(v>=40&&v<=MAXBPM)){edPanel();return}const wp=ED.play;if(wp)edStop();c.bpm=v;edFit();if(wp)edPlay();edPanel()}
function setOff(v){const c=ED.c;const wp=ED.play;if(wp)edStop();c.off=Math.max(0,Math.round(v*1000)/1000);edFit();if(wp)edPlay();edPanel()}
async function edImport(file){const c=ED.c;ED.msg='Decoding audio…';ED.warn='';edPanel();
 try{actx();const bytes=await file.arrayBuffer(),b=await ac.decodeAudioData(bytes.slice(0));edStop();MEM[c.id]=bytes;
  try{await idbPut(c.id,bytes)}catch(e){ED.warn='This browser would not store the file, so you will need to re-import it next visit.'}
  ABUF[c.id]=b;PK[c.id]=mkPeaks(b);c.audio=1;c.audioName=file.name.replace(/\.[^.]+$/,'');c.dur=b.duration;edFit();ED.msg='';ED.ph=0;ED.sc=-.5}
 catch(e){ED.msg='Could not read that file. Try an MP3, WAV or OGG.'}edPanel()}
async function edTest(from){const c=ED.c;if(!c.notes.length){ED.msg='Place at least one note first.';edPanel();return}edStop();persist();await playCustom(EDI,false,from,true)}
function edExit(){if(ED&&ED.play)edStop(true);if(ED&&ED.c.notes.length>=20)unlock('map');persist();menu()}
function edAct(a,b){const c=ED.c,v=b.dataset.v,n=+v;
 if(a=='e_imp')$('#efile').click();
 else if(a=='e_noaud'){edStop();c.audio=0;c.audioName='';c.dur=0;delete ABUF[c.id];delete PK[c.id];delete MEM[c.id];idbDel(c.id);ED.warn='';persist();edPanel()}
 else if(a=='e_tool'){ED.tool=v;edPanel()}
 else if(a=='e_snap'){ED.snap=n;edPanel()}
 else if(a=='e_flip'){c.fl.r=[0,2,4,8][n];persist();edPanel()}
 else if(a=='e_wavy'){c.fl.w=n;persist();edPanel()}
 else if(a=='e_spin'){c.fl.s=[0,.5,1][n];persist();edPanel()}
 else if(a=='e_sq'){c.fl.q=n;persist();edPanel()}
 else if(a=='e_mod'){const k=b.dataset.k;if(c.mods[k])delete c.mods[k];else{c.mods[k]=1;if(k=='ez')delete c.mods.fr;if(k=='fr')delete c.mods.ez;if(k=='nf'){delete c.mods.fc;delete c.mods.ap}if(k=='fc'||k=='ap')delete c.mods.nf}persist();edPanel()}
 else if(a=='e_play'){ED.play?edStop():edPlay()}
 else if(a=='e_met'){ED.met=ED.met?0:1;b.classList.toggle('sel',!!ED.met)}
 else if(a=='e_ns'){ED.ns=ED.ns?0:1;b.classList.toggle('sel',!!ED.ns)}
 else if(a=='e_tap'){const t=performance.now();if(ED.taps.length&&t-ED.taps[ED.taps.length-1]>2000)ED.taps=[];ED.taps.push(t);ED.taps=ED.taps.slice(-9);
  if(ED.taps.length>=3){const q=ED.taps,avg=(q[q.length-1]-q[0])/(q.length-1),bpm=Math.round(60000/avg*10)/10;if(bpm>=40&&bpm<=MAXBPM){c.bpm=bpm;edFit();$('#ebpm').value=bpm}}}
 else if(a=='e_half')setBpm(c.bpm/2);else if(a=='e_dbl')setBpm(c.bpm*2);
 else if(a=='e_o-')setOff(c.off-.01);else if(a=='e_o+')setOff(c.off+.01);
 else if(a=='e_oh'){const T=c.off+edBeat()*60/c.bpm;const wp=ED.play;if(wp)edStop();c.off=Math.max(0,Math.round(T*1000)/1000);ED.ph=0;edFit();ED.sc=-.5;if(wp)edPlay();edPanel()}
 else if(a=='e_test')edTest(0);
 else if(a=='e_testph'){const f=Math.floor(edBeat());edTest(f>=1&&f<c.beats-4?f:0)}
 else if(a=='e_clear'){if(ED.clr){c.notes.length=0;ED.sel=null;ED.ms.clear();ED.clr=0;persist()}else ED.clr=1;edPanel()}
 else if(a=='e_all'){ED.ms=new Set(c.notes);ED.sel=c.notes[c.notes.length-1]||null;edPanel()}
 else if(a=='e_none'){ED.ms.clear();ED.sel=null;edPanel()}
 else if(a=='e_delsel')delSel();
 else if(a=='e_done')edExit();
 else if(a=='e_back')editor(EDI,true)}
function edPanel(){const c=ED.c,el=$('#edside');if(!el)return;const has=!!ABUF[c.id],tl=TOOLS.find(t=>t[0]==ED.tool);
 el.innerHTML=`<h1 style="font-size:26px">Level editor</h1>
 <label>Name<br><input type="text" id="enm" maxlength="40" value="${esc(c.name)}" style="width:100%"></label>
 <h2>Music</h2>
 <p>${c.audio?'<b>'+esc(c.audioName)+'</b> · '+fmtT(c.dur)+(has?'':' · loading…'):'No audio yet, so the built-in backing plays.'}</p>
 ${ED.msg?'<div class="nb">'+ED.msg+'</div>':''}${ED.warn?'<p>'+ED.warn+'</p>':''}
 <div class="row"><button data-a="e_imp">Import MP3…</button>${c.audio?'<button data-a="e_noaud">Remove</button>':''}</div>
 <input type="file" id="efile" accept="audio/*,.mp3,.wav,.ogg,.m4a" hidden>
 <label>Backing style (no MP3) <select id="esi">${SONGS.map((s,i)=>`<option value="${i}"${i==c.si?' selected':''}>${esc(s.name)}</option>`).join('')}</select></label>
 <h2>Tempo and timing</h2>
 <label>BPM <input type="number" id="ebpm" min="40" max="${MAXBPM}" step="0.01" value="${c.bpm}"></label>
 <div class="row" style="margin-top:6px"><button data-a="e_tap">Tap tempo</button><button data-a="e_half">÷2</button><button data-a="e_dbl">×2</button></div>
 <label>First beat at <input type="number" id="eoff" min="0" step="0.001" value="${c.off.toFixed(3)}"> s</label>
 <div class="row" style="margin-top:6px"><button data-a="e_o-">−10 ms</button><button data-a="e_o+">+10 ms</button>${c.audio&&has?'<button data-a="e_oh">First beat = playhead</button>':''}</div>
 ${c.audio&&has?`<p>Length: <b>${c.beats}</b> beats, from the song. Changing BPM or the first beat keeps your notes on the same beats.</p>`:`<label>Length <input type="number" id="ebt" min="8" max="2000" step="4" value="${c.beats}"> beats</label>`}
 <p>Turn on the metronome, press Play, and adjust until the ticks sit on the song's beat.</p>
 <h2>Note type</h2><div class="row">${TOOLS.map(t=>`<button data-a="e_tool" data-v="${t[0]}" class="${ED.tool==t[0]?'sel':''}">${t[1]}</button>`).join('')}</div>
 <p>${tl[2]}</p>
 <h2>Snap</h2><div class="row">${SNP.map(d=>`<button data-a="e_snap" data-v="${d}" class="${ED.snap==d?'sel':''}">1/${d}</button>`).join('')}</div><label style="margin-top:6px">Custom 1/<input type="number" id="esnc" min="1" max="64" step="1" value="${SNP.includes(ED.snap)?'':ED.snap}" placeholder="n" style="width:70px"></label>
 <h2>Level mechanics</h2>
 <label style="margin-top:2px">Flip sides</label><div class="row">${seg('e_flip',['Off','2 beats','4 beats','8 beats'],[0,2,4,8].indexOf(c.fl.r))}</div>
 <label>Wavy track</label><div class="row">${seg('e_wavy',['Off','On'],c.fl.w?1:0)}</div>
 <label>Spin</label><div class="row">${seg('e_spin',['Off','Low','High'],c.fl.s?(c.fl.s>.5?2:1):0)}</div>
 <label>Squeeze (hit window tightens as combo grows)</label><div class="row">${seg('e_sq',['Off','On'],c.fl.q?1:0)}</div>
 <h2>Forced modifiers</h2><div class="row">${MODS.map(m=>`<button data-a="e_mod" data-k="${m[0]}" title="${m[2]}" class="${c.mods[m[0]]?'sel':''}">${m[1]}</button>`).join('')}</div>
 <p>${MODS.filter(m=>c.mods[m[0]]).map(m=>'<b>'+m[1]+'</b>: '+m[2]).join('<br>')||'Rules that are always on when this level is played.'}</p>
 <h2 id="ecnt">${c.notes.length} notes${ED.ms.size?' · '+ED.ms.size+' selected':''}</h2><p id="erate">${ratingHTML(c)}</p>
 <div class="row"><button data-a="e_all">Select all</button><button data-a="e_none"${ED.ms.size?'':' disabled'}>Deselect</button><button data-a="e_delsel"${ED.ms.size?'':' disabled'}>Delete selected</button></div>
 <p class="hint" style="margin-top:6px">Shift-click notes, or drag a box (Select tool, or Shift+drag), to select several. Drag any selected note to move them all together. Ctrl+A selects everything.</p>
 <div class="row"><button class="main" data-a="e_test">Test level</button><button data-a="e_testph">Test from playhead</button></div>
 <div class="row" style="margin-top:8px"><button data-a="e_clear">${ED.clr?'Sure?':'Clear notes'}</button><button class="main" data-a="e_done">Done</button></div>`;
 $('#enm').oninput=e=>{c.name=e.target.value||'Untitled';persist()};
 $('#ebpm').onchange=e=>setBpm(+e.target.value);
 $('#eoff').onchange=e=>setOff(+e.target.value);
 const bt=$('#ebt');if(bt)bt.onchange=e=>{c.beats=Math.max(8,Math.min(2000,Math.round(+e.target.value||64)));persist();edPanel()};
 $('#esi').onchange=e=>{c.si=+e.target.value;persist()};
 $('#efile').onchange=e=>{const f=e.target.files[0];if(f)edImport(f)};
 $('#esnc').onchange=e=>{const v=Math.round(+e.target.value);if(v>=1&&v<=64)ED.snap=v;edPanel()}}
function edDraw(){const c=ED.c,cn=ED.cv;if(!cn)return;const r=cn.getBoundingClientRect(),d=devicePixelRatio||1,w=r.width,h=r.height;if(w<20||h<20)return;
 if(cn.width!==Math.round(w*d)||cn.height!==Math.round(h*d)){cn.width=Math.round(w*d);cn.height=Math.round(h*d)}
 const g=cn.getContext('2d');g.setTransform(d,0,0,d,0,0);const C=ED.col,z=ED.zoom,sc=ED.sc,xo=b=>(b-sc)*z,rh=rowH(h),cur=edBeat();
 g.fillStyle=C.bg;g.fillRect(0,0,w,h);
 for(let n=0;n<14;n++){g.fillStyle=n%2?'rgba(128,128,160,.06)':'rgba(128,128,160,.14)';g.fillRect(0,TOP+(13-n)*rh,w,rh)}
 g.fillStyle='rgba(128,128,160,.12)';g.fillRect(0,0,w,TOP);
 const x0=xo(0),x1=xo(c.beats);g.fillStyle='rgba(0,0,0,.22)';if(x0>0)g.fillRect(0,TOP,Math.min(w,x0),h-TOP);if(x1<w)g.fillRect(Math.max(0,x1),TOP,w-Math.max(0,x1),h-TOP);
 edWave(g,C,c,w,z,sc);
 // grid and ruler
 const k0=Math.floor(sc),k1=Math.ceil(sc+w/z),dv=ED.snap;g.lineWidth=1;g.font='700 11px Space Grotesk,system-ui';g.textAlign='left';
 for(let k=k0;k<=k1;k++){const px=Math.round(xo(k))+.5,st2=k%4==0;
  if(z/dv>=14&&dv>1){g.strokeStyle=C.fg;g.globalAlpha=.07;g.beginPath();for(let j=1;j<dv;j++){const sx2=Math.round(xo(k+j/dv))+.5;g.moveTo(sx2,TOP);g.lineTo(sx2,h)}g.stroke()}
  g.strokeStyle=C.fg;g.globalAlpha=st2?.4:.18;g.beginPath();g.moveTo(px,st2?0:TOP-8);g.lineTo(px,h);g.stroke();g.globalAlpha=1;
  if(st2||z>=50){g.fillStyle=C.fg;g.globalAlpha=.75;g.fillText(String(k),px+3,14);g.globalAlpha=1}}
 // notes
 for(const o of c.notes){const a1=xo(o.b),a2=xo(o.b+(o.len||0));if(a2<-30||a1>w+30)continue;const y=TOP+(13-o.n+.5)*rh,rad=Math.min(rh*.42,12);
  if(o.len){const col=o.t=='roll'?C.ring:o.t=='lift'?C.ok:C.hot;g.globalAlpha=.5;g.strokeStyle=col;g.lineCap='round';g.lineWidth=rad*1.5;g.beginPath();g.moveTo(a1,y);g.lineTo(a2,y);g.stroke();g.lineCap='butt';g.globalAlpha=1;g.fillStyle=col;g.fillRect(a2-2,y-rad,4,rad*2)}
  if(o.t=='decoy'){g.fillStyle=C.mut;g.beginPath();g.arc(a1,y,rad*.85,0,7);g.fill();g.strokeStyle=C.bg;g.lineWidth=2;g.beginPath();g.moveTo(a1-4,y-4);g.lineTo(a1+4,y+4);g.moveTo(a1+4,y-4);g.lineTo(a1-4,y+4);g.stroke()}
  else{g.fillStyle=o.t=='lift'?C.ok:o.t=='roll'?C.ring:C.hot;g.globalAlpha=o.t=='ph'?.35:1;g.beginPath();g.arc(a1,y,rad,0,7);g.fill();g.globalAlpha=1;g.strokeStyle=o.t=='rb'?'#ffd24a':o.t=='sg'?'#7be04f':'#fff';g.lineWidth=2;if(o.t=='ph')g.setLineDash([3,3]);g.stroke();g.setLineDash([]);
   const rg=o.t=='dbl'?1:o.t=='tri'?2:0;for(let q=0;q<rg;q++){g.strokeStyle=C.ring;g.lineWidth=2;g.beginPath();g.arc(a1,y,rad+3+q*4,0,7);g.stroke()}}
  {const gl={rb:'↺',sg:'‖',scl:'◀',scr:'▶'}[o.t];if(gl){g.fillStyle='#fff';g.font='700 '+Math.max(9,Math.round(rad*1.1))+'px Space Grotesk,system-ui';g.textAlign='center';g.fillText(gl,a1,y+rad*.38);g.textAlign='left'}}
  if(ED.ms.has(o)){g.strokeStyle=C.fg;g.lineWidth=2;g.strokeRect(Math.min(a1,a2)-rad-5,y-rad-5,Math.abs(a2-a1)+rad*2+10,rad*2+10)}}
 // playhead
 if(ED.drag&&ED.drag.k==='box'){const d=ED.drag,rx=Math.min(d.x0,d.x1),ry=Math.min(d.y0,d.y1),rw=Math.abs(d.x1-d.x0),rhh=Math.abs(d.y1-d.y0);g.fillStyle=C.ring;g.globalAlpha=.15;g.fillRect(rx,ry,rw,rhh);g.globalAlpha=1;g.strokeStyle=C.ring;g.lineWidth=1;g.strokeRect(rx+.5,ry+.5,rw,rhh)}
 const ph=xo(cur);if(ph>-10&&ph<w+10){g.strokeStyle=C.hot;g.lineWidth=2;g.beginPath();g.moveTo(ph,0);g.lineTo(ph,h);g.stroke();g.fillStyle=C.hot;g.beginPath();g.moveTo(ph-6,0);g.lineTo(ph+6,0);g.lineTo(ph,9);g.fill()}}
function edLoop(){if(state!=='edit'||!ED)return;const c=ED.c;
 if(ED.play){const cur=edBeat(),hz=cur+.25*c.bpm/60,T=b=>ED.at0+(b-ED.ph0)*60/c.bpm;
  if(ED.met)for(let k=Math.floor(ED.sched)+1;k<=hz;k++)if(k>ED.sched)tone(k%4==0?1600:1100,T(k),.04,'square',.12);
  if(ED.ns)for(const o of c.notes)if(o.b>ED.sched&&o.b<=hz){tone(1900,T(o.b),.04,'square',.2);if(!c.audio&&o.t!=='decoy')tone(edf(o.n),T(o.b),.15,songAt(c.si).lead,.12)}
  ED.sched=hz;const vw=ED.cv.clientWidth/ED.zoom;if(cur>ED.sc+vw*.85||cur<ED.sc){ED.sc=cur-vw*.15;clampSc()}
  if(cur>c.beats+2){ED.ph=Math.min(cur,c.beats);edStop(true)}}
 const pb=$('#epb'),lab=ED.play?'⏸ Pause':'▶ Play';if(pb&&pb.textContent!==lab)pb.textContent=lab;
 const sl=$('#escr');if(sl){if(+sl.max!==c.beats)sl.max=c.beats;sl.value=ED.sc}
 {const k=c.notes.length+'|'+ED.ms.size,eh=$('#ecnt');if(eh&&ED.rk!==k){ED.rk=k;eh.textContent=c.notes.length+' notes'+(ED.ms.size?' · '+ED.ms.size+' selected':'');const er=$('#erate');if(er)er.innerHTML=ratingHTML(c)}}
 const tl=$('#etl');if(tl){const cur=edBeat(),s=`beat ${cur.toFixed(2)} · ${fmtT(c.off+cur*60/c.bpm)}`;if(tl.textContent!==s)tl.textContent=s}
 edDraw();edRaf=requestAnimationFrame(edLoop)}
function edKey(e){const t=e.target,tg=t&&t.tagName;if(tg==='SELECT'||(tg==='INPUT'&&/text|number/.test(t.type)))return;const k=e.key;
 if(k===' '){e.preventDefault();ED.play?edStop():edPlay();return}
 if(k==='Delete'||k==='Backspace'){if(ED.ms.size){e.preventDefault();delSel()}return}
 if((e.ctrlKey||e.metaKey)&&(k==='a'||k==='A')){e.preventDefault();ED.ms=new Set(ED.c.notes);ED.sel=ED.c.notes[ED.c.notes.length-1]||null;edPanel();return}
 const ti='1234567890-'.indexOf(k);if(ti>=0&&ti<TOOLS.length){ED.tool=TOOLS[ti][0];edPanel();return}
 if(k==='e'||k==='E'){ED.tool='erase';edPanel();return}if(k==='s'||k==='S'){ED.tool='select';edPanel();return}
 if(k==='m'||k==='M'){ED.met=ED.met?0:1;const b=$('#emet');if(b)b.classList.toggle('sel',!!ED.met);return}
 if(k==='ArrowLeft'||k==='ArrowRight'){e.preventDefault();seekTo(edBeat()+(k==='ArrowRight'?1:-1)*(e.shiftKey?4:1));return}
 if(k==='Home'){seekTo(0);ED.sc=-.5}}
function editor(i,keep){
 cancelAnimationFrame(raf);cancelAnimationFrame(edRaf);stopCA();if(ED&&ED.play)edStop(true);
 actx();if(master)master.gain.value=0;killAudio();x.clearRect(0,0,W,H);
 let c;if(i<0){c={id:'c'+Date.now().toString(36)+Math.floor(Math.random()*1e4).toString(36),name:'My level '+(save.custom.length+1),bpm:120,off:0,beats:64,si:0,audio:0,audioName:'',dur:0,notes:[],fl:{r:0,w:0,s:0,q:0},mods:{}};save.custom.push(c);i=save.custom.length-1;persist()}else c=save.custom[i];
 EDI=i;state='edit';ui.style.touchAction='';ui.scrollTop=0;
 if(!(keep&&ED&&ED.c===c))ED={c,tool:'tap',snap:2,sc:-.5,zoom:80,ph:0,play:false,sel:null,ms:new Set(),drag:null,taps:[],met:1,ns:1,msg:'',warn:'',clr:0,src:null};
 ED.play=false;ED.src=null;ED.clr=0;
 const cs=getComputedStyle(document.documentElement);ED.col={bg:cs.getPropertyValue('--bg').trim(),fg:cs.getPropertyValue('--fg').trim(),mut:cs.getPropertyValue('--mut').trim(),hot:save.st.hot||cs.getPropertyValue('--hot').trim(),ring:save.st.ring||cs.getPropertyValue('--ring').trim(),ok:cs.getPropertyValue('--ok').trim()};
 master=ac.createGain();master.gain.value=save.st.vol;master.connect(ac.destination);
 ui.innerHTML=`<div class="edw"><div class="ed-side" id="edside"></div><div class="ed-main">
 <div class="ed-bar"><button class="main" id="epb" data-a="e_play">▶ Play</button><button id="emet" data-a="e_met" class="${ED.met?'sel':''}">Metronome</button><button data-a="e_ns" class="${ED.ns?'sel':''}">Note clicks</button><span id="etl"></span></div>
 <canvas id="ec"></canvas>
 <div class="ed-bar"><label style="margin:0">Scroll <input type="range" id="escr" min="-2" max="${c.beats}" step="0.25" style="width:200px"></label><label style="margin:0">Zoom <input type="range" id="ezoom" min="16" max="240" value="${ED.zoom}" style="width:120px"></label></div>
 <p class="hint">Click the grid to place a note. Drag a note to move it, or drag a hold's end to resize. Right-click deletes. Click the ruler or waveform to move the playhead. Space plays, Ctrl+wheel zooms. Keys 1–9, 0 and - pick note types. Shift-click or drag a box to select several notes.</p></div></div>`;
 const cn=ED.cv=$('#ec');
 const pos=e=>{const r=cn.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top,r.width,r.height]};
 const noteAt=(px,py,h)=>{const rh=rowH(h),pad=Math.max(3,Math.min(12,ED.zoom/ED.snap/2-1));let best=null;for(const o of c.notes){const y=TOP+(13-o.n+.5)*rh;if(py<y-rh/2||py>y+rh/2)continue;if(px>=edX(o.b)-pad&&px<=edX(o.b+(o.len||0))+pad)best=o}return best};
 cn.oncontextmenu=e=>e.preventDefault();
 const MODK=e=>e.shiftKey||e.ctrlKey||e.metaKey;
 const setSel=(o,add)=>{if(!add)ED.ms.clear();if(o){if(add&&ED.ms.has(o))ED.ms.delete(o);else ED.ms.add(o)}ED.sel=o&&ED.ms.has(o)?o:(ED.ms.size?[...ED.ms].pop():null)};
 cn.onpointerdown=e=>{e.preventDefault();actx();try{cn.setPointerCapture(e.pointerId)}catch(_){}const[px,py,w,h]=pos(e);
  if(py<TOP){ED.drag={k:'seek',wp:ED.play};if(ED.play)edStop();ED.ph=Math.max(minPh(),edB(px));return}
  const o=noteAt(px,py,h);
  if(e.button===2||ED.tool==='erase'){if(o){if(ED.ms.has(o)&&ED.ms.size>1)delSel();else delNote(o)}return}
  if(o){if(MODK(e)){setSel(o,true);edPanel();return}
   if(!ED.ms.has(o))setSel(o,false);else ED.sel=o;
   if(ED.ms.size>1){ED.drag={k:'gmove',o,dx:edB(px)-o.b,n0:pitchAt(py,h),orig:[...ED.ms].map(q=>[q,q.b,q.n]),db:0,dn:0,pdn:0};return}
   ED.drag=o.len&&Math.abs(px-edX(o.b+o.len))<=10&&px>edX(o.b)+14?{k:'len',o}:{k:'move',o,dx:edB(px)-o.b};return}
  if(ED.tool==='select'||e.shiftKey){ED.drag={k:'box',x0:px,y0:py,x1:px,y1:py,add:MODK(e),base:new Set(ED.ms)};if(!MODK(e)){ED.ms.clear();ED.sel=null}return}
  const n={b:Math.max(0,snapB(edB(px))),n:pitchAt(py,h),t:ED.tool,len:0},isLen=n.t==='hold'||n.t==='lift'||n.t==='roll';
  if(isLen)n.len=.5;
  if(!fits(n)){ED.ms.clear();ED.sel=null;edPanel();return}
  c.notes.push(n);c.notes.sort((p,q)=>p.b-q.b);ED.ms.clear();ED.ms.add(n);ED.sel=n;if(!ED.play)edBlip(n.n);ED.drag=isLen?{k:'len',o:n,fresh:1}:null;persist()};
 cn.onpointermove=e=>{const[px,py,w,h]=pos(e),d=ED.drag;
  if(!d){cn.style.cursor=py<TOP?'pointer':(noteAt(px,py,h)&&ED.tool!=='erase'?'grab':'crosshair');return}
  if(d.k==='seek'){ED.ph=Math.max(minPh(),edB(px));return}
  if(d.k==='box'){d.x1=px;d.y1=py;const xa=Math.min(d.x0,px),xb=Math.max(d.x0,px),ya=Math.min(d.y0,py),yb=Math.max(d.y0,py),rh=rowH(h);
   ED.ms=new Set(d.add?d.base:[]);for(const o of c.notes){const y=TOP+(13-o.n+.5)*rh;if(y+rh/2<ya||y-rh/2>yb)continue;if(edX(o.b+(o.len||0))<xa||edX(o.b)>xb)continue;ED.ms.add(o)}
   ED.sel=ED.ms.size?[...ED.ms].pop():null;return}
  if(d.k==='gmove'){const o0=d.orig.find(q=>q[0]===d.o);let db=snapB(edB(px)-d.dx)-o0[1],dn=pitchAt(py,h)-d.n0;
   const mnB=Math.min(...d.orig.map(q=>q[1])),mxB=Math.max(...d.orig.map(q=>q[1])),mnN=Math.min(...d.orig.map(q=>q[2])),mxN=Math.max(...d.orig.map(q=>q[2]));
   db=Math.max(-mnB,Math.min(c.beats-mxB,db));dn=Math.max(-mnN,Math.min(13-mxN,dn));
   if(db===d.db&&dn===d.dn)return;
   for(const[q,b0,n0]of d.orig){q.b=b0+db;q.n=n0+dn}
   if(d.orig.every(r=>fitsG(r[0]))){d.db=db;d.dn=dn;d.moved=1;if(dn!==d.pdn){d.pdn=dn;if(!ED.play)edBlip(d.o.n)}}
   else for(const[q,b0,n0]of d.orig){q.b=b0+d.db;q.n=n0+d.dn}
   return}
  if(d.k==='move'){const o=d.o,ob=o.b,on=o.n;o.b=Math.max(0,snapB(edB(px)-d.dx));o.n=pitchAt(py,h);if(!fits(o,o)){o.b=ob;o.n=on}else if(o.n!==on&&!ED.play)edBlip(o.n);return}
  if(d.k==='len'){const o=d.o,ol=o.len;o.len=Math.max(.25,Math.min(8,snapB(edB(px))-o.b));if(!fits(o,o))o.len=ol;else if(o.len!==ol)d.moved=1}};
 cn.onpointerup=cn.onpointercancel=e=>{const d=ED.drag;ED.drag=null;if(!d)return;
  if(d.k==='seek'){if(d.wp)edPlay();return}
  if(d.k==='box'){ED.sel=ED.ms.size?[...ED.ms].pop():null;edPanel();return}
  if(d.k==='len'&&d.fresh&&!d.moved){const o=d.o;for(const l2 of(o.t==='roll'?[1.5,1,.5]:[1,.5])){const old=o.len;o.len=l2;if(fits(o,o))break;o.len=old}}
  c.notes.sort((p,q)=>p.b-q.b);persist();edPanel()};
 cn.onwheel=e=>{e.preventDefault();const[px]=pos(e);
  if(e.ctrlKey||e.metaKey){const bb=edB(px);ED.zoom=Math.max(16,Math.min(240,ED.zoom*(e.deltaY<0?1.15:1/1.15)));ED.sc=bb-px/ED.zoom;$('#ezoom').value=ED.zoom}
  else ED.sc+=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)/ED.zoom;clampSc()};
 $('#escr').oninput=e=>{ED.sc=+e.target.value};
 $('#ezoom').oninput=e=>{const mid=ED.sc+cn.clientWidth/ED.zoom/2;ED.zoom=+e.target.value;ED.sc=mid-cn.clientWidth/ED.zoom/2;clampSc()};
 edPanel();
 if(c.audio&&!ABUF[c.id])loadAudio(c).then(()=>edPanel()).catch(()=>{ED.warn='The audio file is missing from this browser. Import the MP3 again, or play with the built-in backing.';edPanel()});
 edRaf=requestAnimationFrame(edLoop)}

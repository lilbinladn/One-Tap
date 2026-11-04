async function start(i,show,from){if(i==END){ES=Date.now()&0xfffffff;
 LEV[END]={version:2,id:END,name:'Endless',song:SONGS[Math.floor(Math.random()*SONGS.length)].id,bpm:100,beats:400,subdivisions:[1,2,2,4],density:.55,seed:0,mechanics:{h:.2,x:.15,d:.25,t:Array.from({length:24},(_,k)=>[16*(k+1),Math.min(220,105+k*5)])},notes:null}}
 SH=!!show;ac=ac||new (window.AudioContext||window.webkitAudioContext)();ac.resume();
 if(!nb){nb=ac.createBuffer(1,ac.sampleRate>>1,ac.sampleRate);const d=nb.getChannelData(0);for(let k=0;k<d.length;k++)d[k]=Math.random()*2-1}
 if(master)master.gain.value=0;killAudio();
 lv=i;LV=i==CUS?40:i==END?60:i==SEC?100:Math.min(i,100);const CA=i==CUS&&!!CAB,L0=lev(i),bpm=L0.bpm,f=L0.mechanics,sd=songOf(L0);F=f;PS=from||0;const Bs=PS>0?PS+2:0;rate=save.spd;mo=Object.assign({},save.mods,i==CUS?CL.mods:{});SMUL=DS[save.diff]*mulOf(mo,rate);
 gw=Math.max(.02,(i==END?90:i==CUS?75:i==SEC?30:i<A1?125-i*1.4:(i>=150?42:i>=100?46:Math.max(48,95-(i-A1)*.95)))*DW[save.diff]*(mo.tw?.7:1)/1000);pw=gw*.4;gw0=gw;
 // a song can ship real audio: load it before timing is set, so playback stays in sync
 let songBuf=CA?CAB:null;
 if(!songBuf&&(sd.url||sd.audio)){try{songBuf=await songBuffer(sd)}catch(e){console.warn(e);toast('Song didn’t load','Playing the built-in backing instead.')}}
 segs=[[0,bpm]];(f.t||[]).forEach(a=>segs.push([a[0]+4,a[1]]));segT=[0];
 for(let k=1;k<segs.length;k++)segT[k]=segT[k-1]+(segs[k][0]-segs[k-1][0])*60/(segs[k-1][1]*rate);
 notes=gen(i);notes.forEach(o=>{o.B=o.b+4;o.t=tm(o.B);if(o.len)o.e=tm(o.B+o.len);if(o.roll)o.need=Math.max(2,Math.min(o.need,Math.floor((o.e-o.t)*5)))});if(Bs)notes.forEach(o=>{if(o.B<Bs+2)o.hit=1});
 TP=segs.slice(1).map((a,k)=>({B:a[0],up:a[1]>segs[k][1],bpm:a[1]}));
 BN=[['rb','REBOUND: tap when it comes back','#ffd24a'],['sg','STUTTER: it pauses mid-flight, then keeps going','#7be04f'],['sx','SCATTER: notes can come from either side',0]].map(([k,t,c])=>{const o=notes.find(n=>n[k]&&n.B>=Bs+2);return o&&{B:o.B,t,c}}).filter(Boolean);
 endT=Math.max(...notes.map(o=>o.e||o.t))+.8;
 master=ac.createGain();master.gain.value=save.st.vol;master.connect(ac.destination);t0=ac.currentTime+.6-tm(Bs);stopCA();
 if(songBuf){const src=ac.createBufferSource();src.buffer=songBuf;src.playbackRate.value=rate;src.connect(master);
  const s0=t0+tm(4)-(i==CUS?CL.off/rate:0),wh=Math.max(ac.currentTime+.02,s0);src.start(wh,Math.max(0,(wh-s0)*rate));csrc=src}
 const sc=n=>sd.scale[((n%7)+7)%7]+12*Math.floor(n/7),mf=m=>440*2**((m-69)/12),ds=sd.drums;
 for(let B=Bs;B<(i==END?404:L0.beats+8);B++){const t=t0+tm(B),h=tm(B+1)-tm(B);
  if(B<4||B<Bs+2){tone(1200,t,.05,'square',.15);continue}
  if(SH)tone(500,t,.025,'sine',.1);if(songBuf)continue;
  const k=B-4,dg=sd.chords[Math.floor(k/4)%4];
  if(ds==0||ds==3||(ds==1&&k%2==0)||(ds==2&&k%4==0))tone(150,t,.16,'sine',.8,45);
  if((ds==2&&k%4==2)||ds==3)tone(150,t+h/2,.14,'sine',.7,45);
  if(k%2==1)noise(t,.12,.22,1500);noise(t+h/2,.03,.06,7000);if(ds==2)noise(t,.03,.05,7000);
  tone(mf(sd.root-12+sc(dg)),t,h*.85,'triangle',.35);if(ds)tone(mf(sd.root-12+sc(dg)),t+h/2,h*.4,'triangle',.25);
  if(i==SEC){if(k%2==0)tone(mf(sd.root-12+sc(dg)+6),t,h*1.8,'sawtooth',.1);if(k%8==0)tone(mf(sd.root+24),t,h*6,'sine',.18)}
  if(k%4==0){const d2=tm(B+4)-t0*0-tm(B);[0,2,4].forEach(q=>tone(mf(sd.root+sc(dg+q)),t,d2,'sine',.07))}}
 const clk=(t,v)=>tone(1900,t,.04,'square',.22*v);notes.forEach(o=>{if(o.decoy||o.B<Bs+2)return;const fq=mf(sd.root+12+sc(o.n)),t=t0+o.t;if(SH){clk(t,1);if(o.roll)for(let q=1;q<o.need;q++)clk(t+(o.e-o.t)*q/(o.need-1),.6);else if(o.len)clk(t0+o.e,.4);for(let q=1;q<=(o.dbl||0);q++)clk(t+.11*q,.8)}if(!songBuf){tone(fq,t,o.len?o.e-o.t:.18,sd.lead,.15);for(let q=1;q<=(o.dbl||0);q++)tone(fq,t+.1*q,.1,sd.lead,.12)}});
 const cs=getComputedStyle(document.documentElement);['bg','fg','hot','ring','ok','mut'].forEach(k=>cols[k]=cs.getPropertyValue('--'+k).trim());
 if(i>=A1&&i<END){const th=TH[thOf(i)];Object.assign(cols,{bg:th[1],fg:'#ffffff',ring:th[3],hot:th[4],ok:'#8dffc0',mut:'#c8c0e8'})}
 if(save.st.hot)cols.hot=save.st.hot;if(save.st.ring)cols.ring=save.st.ring;HM=mo.hh?50:100;hp=HM;LT=performance.now();combo=0;maxc=0;pts=0;hn=null;brk=0;why='';st={P:0,G:0,M:0,S:0};fb=null;HC={};state='play';ui.innerHTML='';ui.style.touchAction='none';
 cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
function tap(id){if(state!=='play'||SH||hn)return;const n=now(),T=ac.currentTime;
 for(const o of notes){if(o.hit===3&&n<=o.dl){tone(1500,T,.08,'triangle',.4);if(--o.need<=0){o.hit=1;pts+=40*SMUL;say(o.dbl>1?'Triple!':'Double!',cols.ok)}return}
  if(o.roll&&o.hit===0&&n>=o.t-gw&&n<=o.e){o.cnt=(o.cnt||0)+1;pts+=8*SMUL;tone(1000+o.cnt*60,T,.05,'triangle',.3);if(o.cnt>=o.need){o.hit=1;combo++;maxc=Math.max(maxc,combo);st.P++;pts+=50*SMUL;say('Roll!',cols.ok)}return}}
 let best=null,bd=9;for(const o of notes){if(o.hit!==0||o.roll)continue;const d=Math.abs(o.t-n);if(d<bd){bd=d;best=o}}
 if(best&&bd<=gw){if(best.decoy){best.hit=-2;hurt(10+LV*.4);say('Decoy!',cols.hot);tone(90,T,.2,'sawtooth',.3,40);return}
  award(best,bd,n);hs(T);
  if(best.len){best.hit=2;hn=best;hn.own=id}else if(best.dbl){best.hit=3;best.need=best.dbl;best.dl=n+.22*best.dbl}else best.hit=1}
 else{st.S++;hurt(4+LV*.2);say('Stray tap',cols.hot);tone(120,T,.1,'square',.2,60)}}
function release(id){if(!hn||state!=='play'||hn.own!==id)return;const n=now();
 if(n>=hn.e-gw&&(!hn.lift||n<=hn.e+gw)){hn.hit=1;pts+=30*SMUL;say('Hold!',cols.ok)}else fail(hn,'Let go early',8+LV*.5,1);hn=null}
function loop(){if(state!=='play')return;const n=now(),pn=performance.now(),dl=Math.min(.1,Math.max(0,(pn-LT)/1000));LT=pn;
 if(mo.dr&&!SH&&hp>0&&bt(n)>=4){hp=Math.max((PS||mo.nf)?1:0,hp-DRAIN*dl);if(hp<=0&&!why)why='Health drained'}
 for(const o of notes){if(SH){if(o.hit===0&&n>=o.t)o.hit=o.decoy?-2:o.len?2:1;else if(o.hit===2&&n>=o.e)o.hit=1;continue}
  if(o.roll){if(o.hit===0&&n>o.e)fail(o,'Roll too short',8+LV*.5);continue}
  if(o.hit===0&&n-o.t>gw){if(o.decoy)o.hit=-2;else fail(o,'Miss',8+LV*.5)}
  else if(o.hit===3&&n>o.dl)fail(o,'Missed 2nd tap',8+LV*.5,1)}
 if(hn&&!hn.lift&&n>=hn.e){hn.hit=1;pts+=30*SMUL;say('Hold!',cols.ok);hn=null}
 if(hn&&hn.lift&&n>hn.e+gw){fail(hn,'Held too long',8+LV*.5,1);hn=null}
 draw(n);if(hp<=0)return end(false);if(n>endT)return end(true);raf=requestAnimationFrame(loop)}
/* ================= PAUSE MENU ================= */
var PT=0;
function showPause(){const ed=lv==CUS&&EDI!=null;ui.style.touchAction='';ui.style.background='#0007';
 ui.innerHTML=`<div class="p" style="max-width:340px"><h1 style="font-size:28px">Paused</h1><p>${esc(lev(lv)?lev(lv).name:'')}</p><div class="pst"><button class="main" data-a="p_resume">Resume</button><button data-a="p_retry">Restart</button><button data-a="p_tt">Tempo text: ${save.st.tt!==0?'On':'Off'}</button><button data-a="p_quit">${ed?'Back to editor':'Quit to menu'}</button></div><p class="hint" style="margin-top:12px">Esc resumes · R restarts</p></div>`}
function pauseGame(){if(state!=='play')return;cancelAnimationFrame(raf);state='pause';inClear();ac.suspend();showPause()}
function resumeGame(){if(state!=='pause')return;state='resuming';let n=3;
 const tick=()=>{if(state!=='resuming')return;
  if(n<=0){ui.innerHTML='';ui.style.background='';ui.style.touchAction='none';state='play';ac.resume();if(hn){const h=hn;hn=null;fail(h,'Hold dropped',0,1)}raf=requestAnimationFrame(loop);return}
  ui.innerHTML=`<div class="p" style="max-width:220px;background:transparent;box-shadow:none"><p class="big" style="color:var(--hot)">${n}</p></div>`;n--;PT=setTimeout(tick,700)};tick()}
function pauseRetry(){clearTimeout(PT);ui.style.background='';ac.resume();start(lv,SH,PS)}
function pauseQuit(){clearTimeout(PT);ui.style.background='';ac.resume();if(lv==CUS&&EDI!=null)editor(EDI,true);else menu()}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play')pauseGame()});

async function playCustom(i,show,from,fromEd,noAud){const c=save.custom[i];if(!c||!c.notes.length)return;actx();CL=c;EDI=fromEd?i:null;CAB=null;
 if(c.audio&&!noAud){try{CAB=await loadAudio(c)}catch(e){return needAudio(i,show,from,fromEd)}}
 const f={};if(c.fl.r)f.r=c.fl.r;if(c.fl.w)f.w=1;if(c.fl.s)f.s=c.fl.s;if(c.fl.q)f.q=1;if(c.notes.some(o=>o.t=='scl'||o.t=='scr'))f.sc=1;if(c.notes.some(o=>o.t=='rb'))f.rb=1;if(c.notes.some(o=>o.t=='sg'))f.sg=1;
 LEV[CUS]={version:2,id:CUS,name:c.name,song:songAt(c.si).id,bpm:c.bpm,beats:c.beats,subdivisions:[1],density:0,seed:0,mechanics:f,notes:null};start(CUS,show,from)}

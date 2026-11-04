/* ================= OFFSET CALIBRATION + FPS/CPS ================= */
let CAL=null;
function calStop(){if(CAL){clearInterval(CAL.timer);CAL=null}ui.style.touchAction=''}
function calAct(a){if(a=='cal_go')calStart();else if(a=='cal_apply'){if(CAL&&CAL.sug!=null){save.off=CAL.sug;persist();toast('Offset saved',save.off+' ms')}calStop();killAudio();settings()}else if(a=='cal_back'){calStop();killAudio();settings()}}
function calStart(){calStop();state='cal';actx();killAudio();master=ac.createGain();master.gain.value=Math.max(.5,save.st.vol);master.connect(ac.destination);
 const iv=.6,N=24,t0=ac.currentTime+1;CAL={t0,iv,N,taps:[],done:0,sug:null};
 for(let k=0;k<N;k++)tone(k%4==0?1900:1400,t0+k*iv,.05,'square',.45);
 ui.style.touchAction='none';calDraw();CAL.timer=setInterval(calTick,100)}
function calTap(){if(!CAL||CAL.done)return;const T=ac.currentTime,k=Math.round((T-CAL.t0)/CAL.iv);if(k<4||k>=CAL.N||CAL.taps.some(q=>q.k===k))return;CAL.taps.push({k,e:(T-(CAL.t0+k*CAL.iv))*1000});calDraw()}
function calTick(){if(CAL&&!CAL.done&&ac.currentTime>CAL.t0+CAL.N*CAL.iv+.2){CAL.done=1;clearInterval(CAL.timer);ui.style.touchAction='';calDraw()}}
function calDraw(){const c=CAL;if(!c)return;const n=c.taps.length,last=c.taps[n-1];
 if(!c.done){const big=$('#calbig');
  if(big){big.textContent=last?(last.e>0?'+':'')+Math.round(last.e)+' ms':'…';$('#calcnt').textContent=n+' taps counted';return}
  ui.innerHTML=`<div class="p" style="max-width:420px"><h1 style="font-size:26px">Calibrate offset</h1><p>Tap along with every click using Space, any key, mouse or touch. The first few clicks are a warm-up. Keep a steady beat, even if it feels a little off.</p><p class="big" id="calbig" style="font-size:44px">…</p><p id="calcnt">0 taps counted</p><div class="row"><button data-a="cal_back">Cancel</button></div></div>`;return}
 const es=c.taps.map(t=>t.e).sort((a,b)=>a-b);
 if(es.length<8){ui.innerHTML=`<div class="p" style="max-width:420px"><h1 style="font-size:26px">Not enough taps</h1><p>Only ${es.length} taps lined up with the clicks. Try again and tap along with each click.</p><div class="row"><button class="main" data-a="cal_go">Try again</button><button data-a="cal_back">Back</button></div></div>`;return}
 const med=es[es.length>>1],ok=es.filter(e=>Math.abs(e-med)<=60),avg=ok.reduce((a,b)=>a+b,0)/ok.length,sd=Math.sqrt(ok.reduce((a,b)=>a+(b-avg)*(b-avg),0)/ok.length);
 c.sug=Math.max(-200,Math.min(200,Math.round(avg/5)*5));
 ui.innerHTML=`<div class="p" style="max-width:420px"><h1 style="font-size:26px">Calibration done</h1><p class="big" style="font-size:48px;color:var(--ok)">${c.sug} ms</p><p>Suggested audio offset. Yours is currently ${save.off} ms. ${ok.length} taps used, timing spread ±${Math.round(sd)} ms.${sd>35?' Your taps were uneven, so a retry may give a better reading.':''}</p><div class="row"><button class="main" data-a="cal_apply">Use ${c.sug} ms</button><button data-a="cal_go">Try again</button><button data-a="cal_back">Back</button></div></div>`}

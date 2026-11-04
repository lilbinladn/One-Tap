// Input: every key, mouse button and finger is tracked on its own, so a new input counts while another is still held.
const dn=new Set();let lastT=0;
const inUp=id=>{if(dn.delete(id))release(id)},inDown=id=>{if(state!=='play')return;if(save.st.fps)CT.push(performance.now());if(dn.has(id))inUp(id);dn.add(id);tap(id)},inClear=()=>[...dn].forEach(inUp);
addEventListener('keydown',e=>{if(e.repeat)return;if(state==='cal'&&e.key!=='Escape'){e.preventDefault();calTap();return}if(state==='edit'&&e.key!=='Escape'){edKey(e);return}if(state==='menu'&&!(e.target&&e.target.tagName==='INPUT')){sx=e.key==='6'?sx+1:0;if(sx>=3&&!save.sec){save.sec=1;persist();menu()}}
 if(e.key==='Escape'){if(state==='play')pauseGame();else if(state==='pause')resumeGame();else if(state==='resuming'){clearTimeout(PT);state='pause';showPause()}else if(state==='edit')edExit();else if(state==='cal'){calStop();killAudio();settings()}else if(state!=='menu'){if(lv==CUS&&EDI!=null)editor(EDI,true);else menu()}return}
 if(e.key==='r'||e.key==='R'){if(state==='pause')pauseRetry();else if(state==='play'||state==='end')start(lv,SH,PS);return}if(state==='play'){e.preventDefault();inDown(e.code||e.key)}});
addEventListener('keyup',e=>inUp(e.code||e.key));
addEventListener('pointerdown',e=>{if(state==='cal'){if(e.pointerType!=='mouse'&&!(e.target.closest&&e.target.closest('button'))){lastT=performance.now();calTap()}return}if(e.pointerType==='mouse'||state!=='play')return;e.preventDefault();lastT=performance.now();inDown('p'+e.pointerId)});
addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')inUp('p'+e.pointerId)});addEventListener('pointercancel',e=>{if(e.pointerType!=='mouse')inUp('p'+e.pointerId)});
addEventListener('mousedown',e=>{if(state==='cal'){if(performance.now()-lastT>700&&!(e.target.closest&&e.target.closest('button')))calTap();return}if(state!=='play'||performance.now()-lastT<700)return;e.preventDefault();inDown('m'+e.button)});
addEventListener('mouseup',e=>inUp('m'+e.button));
addEventListener('contextmenu',e=>{if(state==='play')e.preventDefault()});
addEventListener('blur',inClear);

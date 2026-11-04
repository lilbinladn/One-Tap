function settings(){state='menu';const sy=ui.scrollTop;ui.innerHTML=`<div class="p setp"><h1 style="font-size:28px">Settings</h1><p>Saved on this device and, when you’re logged in, synced to your account.</p>
 <div class="setgrid">
 <section class="setcard"><h2>Sound</h2><div class="row">${seg('snd',['Off','Tick','Pop','Snap'],save.st.snd)}</div>
  <label>Volume: <b id="vv">${Math.round(save.st.vol*100)}</b>%<br><input id="vol" type="range" min="0" max="100" value="${save.st.vol*100}"></label>
  <div class="row" style="margin-top:10px"><button data-a="test">Test sound</button></div></section>
 <section class="setcard"><h2>Colors</h2>
  <h2 class="sub">Notes</h2><div class="row">${sw('hot',save.st.hot)}</div>
  <h2 class="sub">Ring</h2><div class="row">${sw('ring',save.st.ring)}</div>
  <h2 class="sub">Theme</h2><div class="row">${seg('theme',['Auto','Light','Dark'],['auto','light','dark'].indexOf(save.st.theme))}</div></section>
 <section class="setcard"><h2>During a level</h2>
  <h2 class="sub">Background effects</h2><div class="row">${seg('fx',['Off','On'],save.st.fx?1:0)}</div>
  <h2 class="sub">Approach rings</h2><div class="row">${seg('ar',['Off','On'],save.st.ar?1:0)}</div>
  <h2 class="sub">Tempo change text</h2><div class="row">${seg('tt',['Off','On'],save.st.tt!==0?1:0)}</div><p class="hint">Off hides the big TEMPO UP / DOWN text. The small marker on the track stays.</p>
  <h2 class="sub">FPS / CPS counter</h2><div class="row">${seg('fps',['Off','On'],save.st.fps?1:0)}</div><p class="hint">Shows frames per second and clicks per second in the bottom corner during a level.</p></section>
 <section class="setcard"><h2>Timing &amp; device</h2>
  <label>Audio offset: <b id="ov">${save.off}</b> ms<br><input id="off" type="range" min="-200" max="200" step="5" value="${save.off}"></label><p class="hint">Tap along to a beat and the game works out the right value for this device.</p>
  <div class="row"><button data-a="cal_go">Calibrate…</button></div></section>
 <section class="setcard"><h2>Cloud sync</h2><div class="row">${seg('syn',['1 min','2 min','3 min','5 min'],[1,2,3,5].indexOf(save.st.syn||2))}</div><p class="hint">The longest wait before changes are saved to your account. Leaving the tab saves right away.</p></section>
 </div>
 <div class="row" style="margin-top:14px"><button class="main" data-a="menu">Done</button></div></div>`;
 $('#vol').oninput=e=>{save.st.vol=e.target.value/100;$('#vv').textContent=e.target.value;persist()};
 $('#off').oninput=e=>{save.off=+e.target.value;$('#ov').textContent=save.off;persist()};
 ui.scrollTop=sy}

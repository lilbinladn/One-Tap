function prac(v){const B=beatsOf(v);ui.innerHTML=`<div class="p"><h1 style="font-size:26px">Practice</h1><p>Level ${v+1}: ${lev(v).name}. Choose where to start. Health can’t run out in practice.</p><label>Start at beat <b id="pv">0</b> of ${B}<br><input id="pb" type="range" min="0" max="${B-8}" step="2" value="0"></label><div class="row" style="margin-top:14px"><button class="main" data-a="pgo" data-v="${v}">Start</button><button data-a="menu">Back</button></div></div>`;$('#pb').oninput=e=>$('#pv').textContent=e.target.value}
function menu(){keep();if(ED&&ED.play)edStop(true);cancelAnimationFrame(edRaf);stopCA();EDI=null;state='menu';ui.style.touchAction='';cancelAnimationFrame(raf);if(master)master.gain.value=0;killAudio();x.clearRect(0,0,W,H);
 const cd=i=>{const l=lev(i),b=save.best[i],lock=false,tr=tier(i),th=i>=A1&&i<NL?' style="border-left-color:'+TH[thOf(i)][3]+'"':i==SEC?' style="border-left-color:#ff1a1a"':'';return `<button class="card" data-a="lv" data-v="${i}"${lock?' disabled':''}${th}><b>${i+1}</b><span>${l.name}<i>${songOf(l).name} · ${l.bpm} BPM · ${mech(l.mechanics)}${b?' · best '+b.s.toLocaleString()+(b.f?' · FC':''):''}</i></span><u style="background:${tr.c}" title="Base ★${tr.b.toFixed(1)}${tr.s.toFixed(1)!==tr.b.toFixed(1)?' · with your speed and modifiers ★'+tr.s.toFixed(1):''}">★${tr.s.toFixed(1)}</u>${b?`<em${b.g.length>1?' class="g'+b.g.length+'"':''}>${b.g}</em>`:''}</button>`},rg=(a,b)=>{let o='';for(let i=a;i<b;i++)o+=cd(i);return o};
 const am=MODS.filter(m=>save.mods[m[0]]),sl=save.spd;
 ui.innerHTML=`<div class="wrap"><div class="side"><div class="brand"><h1>One Tap</h1><div class="chip">${title()} · ${Math.round(total()).toLocaleString()} pts</div></div>
 ${acctHTML()}
 <button class="main start" data-a="endless">Endless<small>${save.endBest?'Best: '+save.endBest+' beats':'Survive as long as you can'}</small></button>
 <div class="nav"><button data-a="rank">Rankings</button><button data-a="ach">Achievements <b>${ACH.filter(q=>save.ach[q[0]]).length}/${ACH.length}</b></button><button data-a="lb_open">Leaderboards</button><button data-a="fr_open">Friends</button><button data-a="cnew">Level editor</button><button data-a="set">Settings</button></div>
 <h2>Timing difficulty</h2><div class="row">${seg('diff',DN,save.diff)}</div>
 <h2>Speed ${sl<1?'(unranked)':sl>1?'(bonus score)':''}</h2><label style="margin-top:0">Speed: <b id="spv">${Math.round(sl*100)}</b>%<br><input id="spd" type="range" min="50" max="200" step="5" value="${Math.round(sl*100)}"></label>
 <h2>Modifiers · score ×${mulOf(save.mods,sl).toFixed(2)}</h2><div class="row">${MODS.map(m=>`<button data-a="mod" data-k="${m[0]}" title="${m[2]}" class="${save.mods[m[0]]?'sel':''}">${m[1]}</button>`).join('')}</div>
 <p>${am.length?am.map(m=>'<b>'+m[1]+'</b>: '+m[2]).join('<br>'):'Optional rules that give bonus score. Faster speeds count too.'}</p>
 <div class="toggles"><button class="tg ${save.sc?'on':''}" data-a="sc" data-v="${save.sc?0:1}" title="Show a short preview of the chart before the level starts"><span>Showcase first</span><b>${save.sc?'On':'Off'}</b></button><button class="tg ${save.pr?'on':''}" data-a="pr" data-v="${save.pr?0:1}" title="Ask where to start when you pick a level"><span>Practice start point</span><b>${save.pr?'On':'Off'}</b></button></div>
 <p class="hint">Tap with Space, any key, mouse or touch. You can press a new input while another is held, so every key, mouse button and finger counts on its own. R retries, Esc returns here.</p></div>
 <div class="listwrap"><div class="listhead"><div class="row">${seg('on',['Campaign','Community'],save.on?1:0)}</div><p class="hint">${save.on?'Featured picks and levels published by players.':'Levels in every area run from easiest to hardest.'}</p></div><div class="list" id="onl">${save.on?onlHTML():`${AREAS.map((a,i)=>`<h2>Area ${i+1}: ${esc(a.name)} · ${a.count} levels · ${srng(a.first,a.first+a.count)}</h2>${rg(a.first,a.first+a.count)}`).join('')}${save.sec?'<h2 style="color:#ff1a1a">Something is waiting</h2>'+cd(SEC):''}<h2>Custom levels · ${save.custom.length}</h2>${save.custom.map(ccd).join('')||'<p>Nothing here yet. Open the level editor to chart your own, or import a .otm level someone sent you.</p>'}<div class="row" style="margin:8px 0"><button class="main" data-a="cnew">+ New level</button><button data-a="cimp">Import level…</button></div><p class="hint">Share a level with the Share button. It saves a small .otm file. Import one here or drop it anywhere on this screen.</p>`}</div></div></div>`;
 const s2=$('.side'),l2=$('.list');if(s2&&l2){s2.scrollTop=ms.s;l2.scrollTop=ms.l;ui.scrollTop=ms.u}
 if(save.on){CM.k=onlKey();if(cmOK()&&!CM.loaded&&!CM.busy)cmLoad()}
 $('#spd').oninput=e=>{save.spd=Math.round(+e.target.value)/100;$('#spv').textContent=e.target.value};$('#spd').onchange=()=>{persist();menu()}}
function rankings(){state='menu';const runs=save.runs.map((r,i)=>`<tr><td>${i+1}</td><td>Lv ${r.l+1} ${lev(r.l).name}</td><td>${DN[r.d]}${r.m?' · '+r.m:''}</td><td>${r.s.toLocaleString()}</td><td>${r.a}% ${r.g}</td></tr>`).join('')||'<tr><td colspan=5>No ranked runs yet. Clear a level at full speed.</td></tr>';
 ui.innerHTML=`<div class="p"><h1>${title()}</h1><p>Total score ${Math.round(total()).toLocaleString()}. Next title at ${(TITLES.find(a=>a[0]>total())||[0,'max'])[0].toLocaleString()||''}. Scores are multiplied by timing difficulty (Easy ×0.5 up to Impossible ×2.5), plus bonuses for faster speeds and modifiers.<br>Grades: S is 97%+ accuracy. SS needs a full combo at 97%+. SSS needs every note Perfect. Practice runs don’t count.</p>
 <table><tr><th>#</th><th>Level</th><th>Mode</th><th>Score</th><th>Acc</th></tr>${runs}</table><div class="row"><button data-a="menu">Back</button></div></div>`}

function achScreen(){state='menu';ui.scrollTop=0;const n=ACH.filter(a=>save.ach[a[0]]).length;
 ui.innerHTML=`<div class="p" style="max-width:520px"><h1 style="font-size:28px">Achievements</h1><p><b>${n}</b> of ${ACH.length} unlocked</p><div class="achl">${ACH.map(a=>{const d=save.ach[a[0]],hid=a[4]&&!d;
  return `<div class="ach${d?' got':''}"><b>${d?'★':'☆'}</b><div><strong>${hid?'???':esc(a[1])}</strong><small>${hid?'Keep playing to find this one.':esc(a[2])}${d?' · '+new Date(d).toLocaleDateString():''}</small></div></div>`}).join('')}</div>
 <div class="row" style="margin-top:12px"><button class="main" data-a="menu">Back</button></div></div>`}

function ccd(c,i){const v=verified(c);return `<div class="crow"><button class="card" data-a="clv" data-v="${i}"${c.notes.length?'':' disabled'} style="border-left-color:var(--ok)"><b>★</b><span>${esc(c.name)}<i>${c.audioName?esc(c.audioName):'Built-in backing'} · ${c.bpm} BPM · ${c.notes.length} notes${c.by?' · by '+esc(c.by):''}${c.pub?' · published':''}</i></span>${cbadge(c)}</button><button data-a="ced" data-v="${i}">Edit</button><button data-a="cshr" data-v="${i}" title="Save as a .otm level file you can send to anyone">Share</button><button data-a="cpub" data-v="${i}" title="${c.pub?'Remove this level from Community → All levels.':v?'Publish it as an unranked community level.':'Clear the level from the start to verify it, then you can publish it.'}">${c.pub?'Published ✓':v?'Publish':'Verify'}</button><button data-a="cdel" data-v="${i}">${delArm===i?'Sure?':'✕'}</button></div>`}
function cdel(i){if(delArm!==i){delArm=i;menu();return}const c=save.custom[i];save.custom.splice(i,1);(save.cdel=save.cdel||[]).push(c.id);if(save.cdel.length>200)save.cdel.shift();delete ABUF[c.id];delete PK[c.id];delete MEM[c.id];idbDel(c.id);delArm=-1;persist();menu()}

/* ================= COMMUNITY LEVELS =================
   The head account ("micah") and the curators it appoints choose what shows up here:
   - whole accounts (every level that player has synced), or
   - individual levels.
   Firestore layout (see firestore.rules):
     profiles/<uid>          { name, lv:[{k,n,b,m,a}], ts }   public index of a player's synced levels (username accounts only)
     community/acct_<uid>    { type:'account', uid, name, by, ts }
     community/lvl_<uid>_<k> { type:'level', uid, key, name, owner, bpm, m, a, by, ts }
     curators/<uid>          { name, by, ts }                  written only by the head account
   Level data itself stays where it already lives (users/<uid>/data/c_<id>); the rules open that one document
   for reading only while the level or its owner is featured. */
const HEAD='micah',headMail=()=>HEAD+'@'+UDOM; // built on demand: UDOM comes from online/sync.js, which loads after this file
const isUdom=e=>!!e&&e.endsWith('@'+UDOM);
const isHead=()=>!!SYNC.acct&&SYNC.email===headMail();
const isCur=()=>isHead()||SYNC.cur===true;
const CM={items:[],feat:[],lvls:[],curs:[],busy:false,loaded:false,msg:'',br:null,tab:0};
const cmOK=()=>!!(SYNC.fb&&SYNC.fb.cget&&SYNC.uid);
async function syncProfile(uid){try{if(!cmOK()||SYNC.uid!==uid||!SYNC.uname)return;
 const lv=save.custom.filter(c=>c&&c.id&&canon(c).length<=300000).slice(0,300).map(c=>({k:ckey(c.id),n:String(c.name||'').slice(0,40),b:c.bpm,m:c.notes.length,a:String(c.audioName||'').slice(0,40)})),s=canon(lv);
 if(s===SYNC.plv)return;await SYNC.fb.cset(['profiles',uid],{name:SYNC.uname,lv,ts:Date.now()},true);SYNC.plv=s}catch(e){}}
function ensureProfile(){const uid=SYNC.uid,n=SYNC.uname;if(!cmOK()||!n)return;
 if(isUdom(SYNC.email))SYNC.fb.cget(['usernames',n]).then(d=>d?0:SYNC.fb.cset(['usernames',n],{uid,ts:Date.now()})).catch(()=>{}); // older username-only accounts reserve their name too
 SYNC.fb.cset(['profiles',uid],{name:n,ts:Date.now()},true).catch(()=>{})}
async function cmFind(name){name=String(name||'').trim().toLowerCase();
 if(!/^[a-z0-9._-]{3,24}$/.test(name))throw new Error('Type a username first (3 to 24 letters, numbers, dots, dashes or underscores).');
 const r=await SYNC.fb.cfind(['profiles'],'name',name);
 if(!r.length)throw new Error('No player called '+name+'. They need to log in and pick a username first.');
 return{uid:r[0].id,name:r[0].d.name||name,lv:Array.isArray(r[0].d.lv)?r[0].d.lv:[]}}
async function cmLoad(){if(!cmOK())return;CM.busy=true;CM.msg='';cmDraw();
 try{const uid=SYNC.uid;if(!isHead())SYNC.cur=!!(await SYNC.fb.cget(['curators',uid]));
  const ents=await SYNC.fb.clist(['community']);
  CM.feat=ents.filter(e=>e.d&&e.d.type==='account'&&e.d.uid).map(e=>({id:e.id,uid:e.d.uid,name:e.d.name||'?',by:e.d.by||'',ts:e.d.ts||0}));
  CM.lvls=ents.filter(e=>e.d&&e.d.type==='level'&&e.d.uid&&e.d.key).map(e=>({id:e.id,uid:e.d.uid,key:e.d.key,name:e.d.name||'Level',owner:e.d.owner||'',bpm:e.d.bpm||0,m:e.d.m||0,a:e.d.a||'',ts:e.d.ts||0}));
  CM.curs=isHead()?(await SYNC.fb.clist(['curators'])).map(e=>({uid:e.id,name:(e.d&&e.d.name)||e.id})):[];
  const items=[],seen=new Set(),add=o=>{const k=o.uid+'/'+o.key;if(seen.has(k))return;seen.add(k);items.push(o)};
  for(const l of CM.lvls)add({uid:l.uid,key:l.key,name:l.name,owner:l.owner,bpm:l.bpm,m:l.m,a:l.a,pin:l.id,ts:l.ts});
  const fe=CM.feat.slice(0,60),profs=await Promise.all(fe.map(f=>SYNC.fb.cget(['profiles',f.uid]).catch(()=>null)));
  fe.forEach((f,i)=>{const p=profs[i];if(p&&Array.isArray(p.lv))for(const l of p.lv.slice(0,300))if(l&&l.k)add({uid:f.uid,key:l.k,name:l.n||'Level',owner:f.name,bpm:l.b||0,m:l.m||0,a:l.a||'',ts:+p.ts||f.ts||0})});
  CM.items=items.sort((a,b)=>(b.ts||0)-(a.ts||0));CM.loaded=true;await pubLoad(true)}
 catch(e){CM.msg=e&&e.code==='permission-denied'?'The community rules aren’t deployed yet. Publish the firestore.rules file in the Firebase console.':'Couldn’t load the community. Check your connection and try again.'}
 CM.busy=false;cmDraw()}
const cmCard=(it,i)=>`<div class="crow"><button class="card" data-a="cm_play" data-v="${i}" style="border-left-color:var(--ok)"><b>♪</b><span>${esc(it.name)}<i>${it.a?esc(it.a)+' · ':''}${it.bpm?it.bpm+' BPM · ':''}${it.m} notes · by ${esc(it.owner)}</i></span><u style="background:#6a6388">Featured</u></button><button data-a="cm_save" data-v="${i}" title="Copy it into your Custom levels without playing">Save</button>${it.pin&&isCur()?`<button data-a="cm_unpin" data-v="${i}" title="Take this level out of the community tab">✕</button>`:''}</div>`;
// Community → All levels: unranked levels their creators published themselves. Firestore keeps only
// the small metadata document (published/<uid>_<key>); the level data is read from the creator's
// own c_<id> document, which firestore.rules opens while the published record exists.
const pubCard=(it,i)=>`<div class="crow"><button class="card" data-a="cm_pubplay" data-v="${i}" style="border-left-color:var(--ring)"><b>♪</b><span>${esc(it.name)}<i>${it.a?esc(it.a)+' · ':''}${it.bpm?it.bpm+' BPM · ':''}${it.m} notes · by ${esc(it.owner)}</i></span><u style="background:#6a6388" title="Scores on published levels don’t count towards rankings">Unranked</u></button><button data-a="cm_pubsave" data-v="${i}" title="Copy it into your Custom levels without playing">Save</button>${it.uid===SYNC.uid||isCur()?`<button data-a="cm_pubunpub" data-v="${i}" title="Remove it from All levels">✕</button>`:''}</div>`;
const PUB={items:[],busy:false,loaded:false,msg:''};
async function pubLoad(quiet){if(!cmOK())return;PUB.busy=true;if(!quiet)commPaint();
 try{let rows;
  try{rows=await SYNC.fb.ctop(['published'],'ts',200)} // newest uploads first, straight from the database
  catch(e){if(e&&e.code==='permission-denied')throw e;rows=await SYNC.fb.clist(['published'])}
  PUB.items=rows.filter(r=>r.d&&r.d.uid&&r.d.key).map(r=>({id:r.id,uid:r.d.uid,key:r.d.key,name:r.d.name||'Level',owner:r.d.owner||'?',bpm:r.d.bpm||0,m:r.d.m||0,a:r.d.a||'',vt:r.d.vt||0,ts:r.d.ts||0})).sort((a,b)=>b.ts-a.ts).slice(0,200);
  PUB.loaded=true;PUB.msg=''}
 catch(e){PUB.msg=e&&e.code==='permission-denied'?'The community rules aren’t deployed yet. Publish the firestore.rules file in the Firebase console.':'Couldn’t load published levels. Check your connection and try again.'}
 PUB.busy=false;if(!quiet)commPaint()}
const commPaint=()=>{if(state!=='menu')return;if($('#cmroot'))cmDraw();else onlDraw()};
async function cmPublish(i){const c=save.custom[i];if(!c)return;
 if(!socOK()){toast('Log in to publish','Publishing needs an account and a username.');return acctScreen()}
 if(canon(c).length>300000)return toast('Too big to publish','This level is larger than the cloud save limit. Try fewer notes.');
 if(!verified(c)){toast('Verify it first','Clear the level from the start once, then you can publish it.');return playCustom(i,false,0,false)}
 try{await SYNC.fb.cset(['published',SYNC.uid+'_'+ckey(c.id)],{uid:SYNC.uid,key:ckey(c.id),name:String(c.name||'Level').slice(0,40),owner:SYNC.uname,bpm:c.bpm,m:c.notes.length,a:String(c.audioName||'').slice(0,40),vt:c.vt,ts:Date.now()});
  c.pub=Date.now();persist();schedulePush(0);toast('Published','Unranked · it is now in Community → All levels.');await pubLoad(true);commPaint()}
 catch(e){toast('Couldn’t publish',socErr(e,'community'))}}
async function cmUnpublish(i){const c=save.custom[i];if(!c)return;
 if(!socOK())return toast('Log in to unpublish','Published levels are tied to your account.');
 try{await SYNC.fb.cdel(['published',SYNC.uid+'_'+ckey(c.id)])}catch(e){return toast('Couldn’t unpublish',socErr(e,'community'))}
 delete c.pub;persist();toast('Unpublished',c.name);await pubLoad(true);commPaint()}
function cmPubAct(i){const c=save.custom[i];if(!c)return;return c.pub?cmUnpublish(i):cmPublish(i)}
async function pubRemove(it){if(!it)return;
 try{await SYNC.fb.cdel(['published',it.id])}catch(e){PUB.msg=socErr(e,'community');commPaint();return}
 if(it.uid===SYNC.uid){const c=save.custom.find(q=>q.id&&ckey(q.id)===it.key);if(c){delete c.pub;persist()}}
 toast('Removed from All levels',it.name);await pubLoad(true);commPaint()}
function cmDraw(){if(state!=='menu')return;if(!$('#cmroot')){onlDraw();return}const u=$('#cmu'),uv=u?u.value:'',st=ui.scrollTop;
 let h='<div class="p" id="cmroot" style="max-width:700px"><h1 style="font-size:28px">Community</h1>';
 if(!SYNC.fb||SYNC.dbState==='none')h+='<p>Community levels need accounts, which aren’t available right now.</p>';
 else if(!SYNC.acct)h+='<p>Community levels are picked by the community team. Log in to browse them.</p><div class="row"><button class="main" data-a="acct">Log in</button></div>';
 else{
  h+='<p>Levels picked by the community team. Tap one to play it. It’s copied into your Custom levels, and songs aren’t included, so you may be asked for the audio file.</p>';
  if(CM.busy&&!CM.loaded)h+='<p>Loading…</p>';else if(CM.items.length)h+=CM.items.map(cmCard).join('');else if(!CM.msg)h+='<p>Nothing is featured yet.</p>';
  if(CM.msg)h+='<p class="nb">'+esc(CM.msg)+'</p>';
  if(isCur()){
   h+='<h2>'+(isHead()?'Head controls':'Curator controls')+'</h2><div class="acct"><label style="margin-top:0">Player username<br><input id="cmu" type="text" maxlength="24" autocomplete="off" value="'+esc(uv)+'" style="width:min(100%,260px)"></label>'
    +'<div class="row" style="margin-top:8px"><button data-a="cm_addacct">Feature whole account</button><button data-a="cm_browse">Pick individual levels</button>'+(isHead()?'<button data-a="cm_addcur">Make curator</button>':'')+'</div></div>';
   if(CM.feat.length)h+='<h2>Featured accounts</h2><div class="acct">'+CM.feat.map((f,i)=>`<div class="ac-row"><div><b>${esc(f.name)}</b><small>all their levels · added by ${esc(f.by||'?')}</small></div><button data-a="cm_rmacct" data-v="${i}">Remove</button></div>`).join('')+'</div>';
   if(CM.br){const p=CM.br;h+='<h2>Levels by '+esc(p.name)+'</h2><div class="acct">'+(p.lv.length?p.lv.map((l,i)=>{const on=CM.lvls.some(q=>q.id==='lvl_'+p.uid+'_'+l.k);return `<div class="ac-row"><div><b>${esc(l.n||'Level')}</b><small>${l.b||'?'} BPM · ${l.m||0} notes</small></div><button data-a="${on?'cm_pinrm':'cm_pin'}" data-v="${i}"${on?' class="sel"':''}>${on?'Featured ✓':'Feature'}</button></div>`}).join(''):'<small>They haven’t synced any levels yet.</small>')+'</div>'}
   if(isHead()){h+='<h2>Curators</h2><div class="acct">'+(CM.curs.length?CM.curs.map((c,i)=>`<div class="ac-row"><div><b>${esc(c.name)}</b><small>can feature accounts and levels</small></div><button data-a="cm_rmcur" data-v="${i}">Remove</button></div>`).join(''):'<small>No curators yet. Type a username above and press Make curator.</small>')+'</div>'}}}
 h+='<div class="row" style="margin-top:14px"><button data-a="cm_refresh">Refresh</button><button class="main" data-a="menu">Back</button></div></div>';
 ui.innerHTML=h;ui.scrollTop=st}
function commScreen(){state='menu';ui.scrollTop=0;CM.br=null;CM.msg='';ui.innerHTML='<div class="p" id="cmroot"></div>';cmDraw();if(cmOK())cmLoad()}
async function cmGet(it,play){if(!it||!cmOK())return;
 try{const d=await SYNC.fb.cget(['users',it.uid,'data',it.key]);if(!d||typeof d.j!=='string')throw new Error('That level is no longer available.');
  const c=cleanLevel(JSON.parse(d.j),it.owner),sg=sig(c);let i=save.custom.findIndex(q=>sig(q)===sg);
  if(i<0){save.custom.push(c);i=save.custom.length-1;persist();toast('Added to Custom levels',c.name)}else if(!play)toast('Already in your list',c.name);
  if(play)playCustom(i,save.sc)}
 catch(e){toast('Couldn’t load that level',e&&e.code==='permission-denied'?'It isn’t featured any more.':(e.message||'Try again.'))}}
async function commAct(a,b){const v=+b.dataset.v;
 if(a=='cm_open')return commScreen();
 if(a=='cm_tab'){CM.tab=v;if(v==1&&!PUB.loaded&&cmOK())pubLoad();else commPaint();return}
 if(a=='cm_refresh')return cmLoad();
 if(a=='cm_play'||a=='cm_save')return cmGet(CM.items[v],a=='cm_play');
 if(a=='cm_pubplay'||a=='cm_pubsave')return cmGet(PUB.items[v],a=='cm_pubplay');
 if(a=='cm_pubunpub')return pubRemove(PUB.items[v]);
 const nm=()=>($('#cmu')&&$('#cmu').value)||'',F=SYNC.fb;CM.msg='';
 try{
  if(a=='cm_addacct'){const p=await cmFind(nm());await F.cset(['community','acct_'+p.uid],{type:'account',uid:p.uid,name:p.name,by:SYNC.acct.name,ts:Date.now()});toast('Account featured',p.name)}
  else if(a=='cm_rmacct'){const f=CM.feat[v];if(f){await F.cdel(['community',f.id]);toast('Account removed',f.name)}}
  else if(a=='cm_browse'){CM.br=await cmFind(nm())}
  else if(a=='cm_pin'||a=='cm_pinrm'){const p=CM.br,l=p&&p.lv[v];if(l){const id='lvl_'+p.uid+'_'+l.k;
   if(a=='cm_pin'){await F.cset(['community',id],{type:'level',uid:p.uid,key:l.k,name:String(l.n||'Level').slice(0,40),owner:p.name,bpm:l.b||0,m:l.m||0,a:String(l.a||'').slice(0,40),by:SYNC.acct.name,ts:Date.now()});toast('Level featured',l.n||'Level')}
   else{await F.cdel(['community',id]);toast('Level removed',l.n||'Level')}}}
  else if(a=='cm_unpin'){const it=CM.items[v];if(it&&it.pin){await F.cdel(['community',it.pin]);toast('Level removed',it.name)}}
  else if(a=='cm_addcur'&&isHead()){const p=await cmFind(nm());await F.cset(['curators',p.uid],{name:p.name,by:SYNC.acct.name,ts:Date.now()});toast('New curator',p.name)}
  else if(a=='cm_rmcur'&&isHead()){const c=CM.curs[v];if(c){await F.cdel(['curators',c.uid]);toast('Curator removed',c.name)}}}
 catch(e){CM.msg=e&&e.code==='permission-denied'?'Only the head account and curators can do that.':(e&&e.message)||'That didn’t work.';cmDraw();return}
 await cmLoad()}
const onlKey=()=>SYNC.dbState+'|'+(SYNC.acct?1:0)+'|'+(SYNC.uid||'');
function onlHTML(){let h='<h2 style="margin-top:0">Community</h2>';
 if(!SYNC.fb||SYNC.dbState==='none')return h+'<p>Community levels need accounts, which aren’t available right now.</p>';
 if(SYNC.dbState==='wait')return h+'<p>Connecting…</p>';
 if(!SYNC.acct)return h+'<p>Log in to browse community levels.</p><div class="row"><button class="main" data-a="acct">Log in</button></div>';
 h+='<div class="row" style="margin:0 0 8px">'+seg('cm_tab',['Featured','All levels'],CM.tab)+'</div>';
 if(CM.tab===1){
  h+='<p class="hint" style="margin:0 4px 8px">Unranked levels published by their creators, newest first. Tap one to play it. It’s copied into your Custom levels, and songs aren’t included, so you may be asked for the audio file.</p>';
  if(PUB.busy&&!PUB.loaded)h+='<p>Loading…</p>';else if(PUB.items.length)h+=PUB.items.map(pubCard).join('');else if(!PUB.msg)h+='<p>Nothing is published yet. Clear one of your custom levels from the start, then press Publish on it.</p>';
  if(PUB.msg)h+='<p class="nb">'+esc(PUB.msg)+'</p>';
  return h+'<div class="row" style="margin:8px 0"><button data-a="cm_refresh">Refresh</button>'+(isCur()?'<button data-a="cm_open">Curator tools</button>':'')+'</div>'}
 h+='<p class="hint" style="margin:0 4px 8px">Featured picks from the community team, newest first. Tap one to play it. It’s copied into your Custom levels, and songs aren’t included, so you may be asked for the audio file.</p>';
 if(CM.busy&&!CM.loaded)h+='<p>Loading…</p>';else if(CM.items.length)h+=CM.items.map(cmCard).join('');else if(!CM.msg)h+='<p>Nothing is featured yet. Player-published levels are under All levels.</p>';
 if(CM.msg)h+='<p class="nb">'+esc(CM.msg)+'</p>';
 return h+'<div class="row" style="margin:8px 0"><button data-a="cm_refresh">Refresh</button>'+(isCur()?'<button data-a="cm_open">Curator tools</button>':'')+'</div>'}
function onlDraw(){const e=$('#onl');if(!save.on||!e)return;const st=e.scrollTop;e.innerHTML=onlHTML();e.scrollTop=st}
function onlSync(){if(!save.on||state!=='menu'||!$('#onl'))return;const k=onlKey();if(k===CM.k)return;CM.k=k;onlDraw();if(cmOK()&&!CM.busy)cmLoad()}

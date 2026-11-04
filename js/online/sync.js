/* ================= ACCOUNTS + CLOUD SYNC (Firebase) =================
   Email/username + password accounts through Firebase Authentication. Progress lives in Firestore at users/<uid>/data/*,
   and the security rules only let each signed-in player read or write their own documents.
   If Firebase isn't configured or can't load, the game keeps working from localStorage as before. */
const sjson=o=>JSON.stringify(o);
const canon=o=>o===null||typeof o!=='object'?JSON.stringify(o):Array.isArray(o)?'['+o.map(canon).join(',')+']':'{'+Object.keys(o).sort().filter(k=>o[k]!==undefined).map(k=>JSON.stringify(k)+':'+canon(o[k])).join(',')+'}';
const ckey=id=>'c_'+String(id).replace(/[^\w.~:@+-]/g,'_');
const PWBAD=['password','password1','password123','12345678','123456789','1234567890','qwerty123','qwertyuiop','iloveyou1','letmein123','welcome123','admin1234','abc12345','11111111','00000000'];
const pwRules=(pw,nm)=>{const n=(nm||'').trim().toLowerCase(),l=pw.toLowerCase();return[['At least 8 characters',pw.length>=8],['A letter and a number',/[a-z]/i.test(pw)&&/\d/.test(pw)],['Not your username or email',!!pw&&l!==n&&l!==n.split('@')[0]],['Not a common password',!!pw&&!PWBAD.includes(l)]]};
const UDOM='users.onetap-game.app'; // a plain username is stored as username@UDOM (no real mailbox, so no password reset)
function idToEmail(v){v=v.trim().toLowerCase();
 if(v.includes('@')){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))throw new Error('That email address doesn’t look right.');return v}
 if(!/^[a-z0-9._-]{3,24}$/.test(v))throw new Error('Usernames are 3 to 24 letters, numbers, dots, dashes or underscores.');return v+'@'+UDOM}
const nameOf=e=>e&&e.endsWith('@'+UDOM)?e.slice(0,-UDOM.length-1):(e||'Player');
function fbMsg(e){const c=e&&e.code||'';
 return({'auth/email-already-in-use':'That email already has an account.','auth/invalid-credential':'Wrong username/email or password.','auth/wrong-password':'Wrong username/email or password.','auth/user-not-found':'Wrong username/email or password.',
 'auth/weak-password':'Password must be at least 8 characters, with a letter and a number.','auth/invalid-email':'That email address doesn’t look right.','auth/too-many-requests':'Too many attempts. Wait a bit and try again.','auth/network-request-failed':'Couldn’t reach the server. Check your connection.',
 'auth/requires-recent-login':'For security, log out, log back in and try again.','auth/operation-not-allowed':'Email/password sign-in isn’t switched on in the Firebase console yet.'})[c]||'Something went wrong. Please try again.'}
var SYNC={fb:null,dbState:'wait',acct:null,uid:null,unsub:null,cloud:{},pending:null,ready:false,busy:false,again:false,timer:0,retry:0,last:0,big:0,tk:0,st:'connecting',note:''};
function acctInner(){const s=SYNC,fm=t=>new Date(t).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
 if(!s.acct){const t=s.dbState==='wait'?'Checking accounts…':s.dbState==='none'?'Saved on this device only. Accounts aren’t available right now.':'Saved on this device only. Log in to sync across devices.';
  return `<div class="ac-row"><div><b>Guest</b><small>${esc(t)}</small></div>${s.dbState==='ok'?'<button data-a="acct">Log in</button>':''}</div>`}
 const t={connecting:'Connecting…',syncing:'Syncing…',ok:'Synced'+(s.last?' · '+fm(s.last):'')+(s.big?' · '+s.big+' large level'+(s.big>1?'s':'')+' not synced':''),
  ro:'The cloud refused the save. Check that the Firestore rules are deployed. Progress is safe on this device.',off:'Can’t reach the account service. Progress is safe on this device.',err:'Couldn’t sync. Progress is safe on this device and will retry.'}[s.st]||'';
 return `<div class="ac-row"><div><b>${esc(s.acct.name)}</b><small>${t}</small></div>${s.needName?'<button data-a="a_uname">Pick username</button>':''}<button data-a="sync"${s.st==='syncing'||s.st==='connecting'?' disabled':''}>Sync</button><button data-a="acct">Account</button></div>`}
const acctHTML=()=>`<div class="acct" id="acct">${acctInner()}</div>`;
function acctRefresh(){const e=$('#acct');if(e)e.innerHTML=acctInner();onlSync()}
function acctStatusText(){const d=document.createElement('div');d.innerHTML=acctInner();const sm=d.querySelector('small');return sm?sm.textContent:''}
function setSt(v){SYNC.st=v;acctRefresh();const a=$('#aacct');if(a)a.textContent=acctStatusText()}
function syncDirty(){if(!(SYNC&&SYNC.uid&&SYNC.ready&&SYNC.st!=='ro')||SYNC.timer)return;const iv=((save.st&&save.st.syn)||2)*60000;SYNC.timer=setTimeout(push,Math.max(2000,(SYNC.lastPush||0)+iv-Date.now()))} // changes are batched: at most one upload per 1 to 5 minutes (Settings)
function schedulePush(ms){clearTimeout(SYNC.timer);SYNC.timer=setTimeout(push,ms)}
function pack(){const o=JSON.parse(sjson(save));delete o.custom;delete o.off;delete o.acct; // audio offset belongs to each device
 const P={save:{ts:save.ts||0,p:canon(o)}};SYNC.big=0;
 for(const c of save.custom){if(!c||!c.id)continue;const p=canon(c);if(p.length>300000){SYNC.big++;continue}P[ckey(c.id)]={ts:save.ts||0,p}}return P}
function mergeRemote(D){
 const L0=JSON.parse(sjson(save)),R0=D.save?(()=>{try{return JSON.parse(D.save.j)}catch(e){return{}}})():{},rc=[];
 if((R0.v||3)<4){if(R0.best&&R0.best[100]){R0.best[200]=R0.best[100];delete R0.best[100]}(R0.runs||[]).forEach(r=>{if(r.l===100)r.l=200})}
 if((R0.v||3)<5&&R0.best)reorder(R0);
 for(const k in D)if(k!=='save'){try{rc.push(JSON.parse(D[k].j))}catch(e){}}
 const localNewer=(L0.ts||0)>=(R0.ts||0),m=JSON.parse(sjson(localNewer?L0:Object.assign({},R0)));
 m.unlocked=Math.max(L0.unlocked||1,R0.unlocked||1);m.endBest=Math.max(L0.endBest||0,R0.endBest||0);if(L0.sec||R0.sec)m.sec=1;m.ach=Object.assign({},R0.ach||{},L0.ach||{});
 m.best={};for(const src of[R0.best||{},L0.best||{}])for(const k in src){const o=m.best[k];if(!o||(src[k].s||0)>(o.s||0))m.best[k]=src[k]}
 const seen=new Set(),rr=[];for(const r of[].concat(L0.runs||[],R0.runs||[])){const k=[r.l,r.d,r.s,r.a,r.m].join('|');if(!seen.has(k)){seen.add(k);rr.push(r)}}
 rr.sort((p,q)=>q.s-p.s||(canon(p)<canon(q)?-1:1));m.runs=rr.slice(0,10);
 const dead=new Set([].concat(L0.cdel||[],R0.cdel||[]));m.cdel=[...dead].sort().slice(-200);
 const cm=new Map();for(const c of(L0.custom||[]))if(c&&c.id)cm.set(c.id,c);
 for(const c of rc){if(!c||!c.id)continue;if(!cm.has(c.id)||!localNewer)cm.set(c.id,c)}
 m.custom=[...cm.values()].filter(c=>!dead.has(c.id));
 m.off=L0.off||0;m.acct=L0.acct;m.ts=Math.max(L0.ts||0,R0.ts||0);m.v=5;return m}
function applyMerged(m){for(const k of Object.keys(save))delete save[k];Object.assign(save,m);
 save.st=Object.assign({snd:1,vol:.5,hot:'',ring:'',theme:'auto',fx:1,ar:1,tt:1,fps:1,syn:2},save.st);save.mods=Object.assign({fc:0,ap:0,fr:0,tw:0,hd:0,mr:0,ez:0,dr:0,hh:0,nf:0},save.mods);if(typeof save.spd!=='number'||!(save.spd>=.5&&save.spd<=2))save.spd=SL[save.slow]||1;if(!Array.isArray(save.custom))save.custom=[];if(!save.ach||typeof save.ach!=='object'||Array.isArray(save.ach))save.ach={};
 try{localStorage.setItem('onetap2',sjson(save))}catch(e){}applyTheme()}
function pull(){const D=SYNC.pending;if(!D||!SYNC.uid||state!=='menu')return; // never change progress under a running level or the editor
 SYNC.pending=null;const before=canon(save);applyMerged(mergeRemote(D));SYNC.cloud={};for(const k in D)SYNC.cloud[k]=D[k].j;
 const first=!SYNC.ready;SYNC.ready=true;
 if(canon(save)!==before&&$('.wrap'))menu();
 if(first)schedulePush(0);else syncDirty()}
async function push(){clearTimeout(SYNC.timer);SYNC.timer=0;
 const uid=SYNC.uid;if(!uid||!SYNC.ready)return;if(SYNC.busy){SYNC.again=true;return}
 SYNC.busy=true;SYNC.again=false;SYNC.lastPush=Date.now();setSt('syncing');
 try{const P=pack(),dead=new Set((save.cdel||[]).map(ckey));
  for(const k in P){if(SYNC.cloud[k]===P[k].p)continue;const prev=SYNC.cloud[k];SYNC.cloud[k]=P[k].p;
   try{await SYNC.fb.setDoc(uid,k,{ts:P[k].ts,j:P[k].p})}catch(e){if(prev===undefined)delete SYNC.cloud[k];else SYNC.cloud[k]=prev;throw e}}
  for(const k of Object.keys(SYNC.cloud))if(k!=='save'&&!P[k]&&dead.has(k)){await SYNC.fb.delDoc(uid,k);delete SYNC.cloud[k]}
  syncProfile(uid);syncBoard(uid);SYNC.last=Date.now();if(SYNC.uid===uid)setSt('ok')}
 catch(e){if(SYNC.uid===uid){if(e&&e.code==='permission-denied')setSt('ro');else{setSt('err');clearTimeout(SYNC.retry);SYNC.retry=setTimeout(()=>schedulePush(0),15000)}}}
 finally{SYNC.busy=false;if(SYNC.again&&SYNC.st!=='ro'&&SYNC.uid)syncDirty()}}
async function syncNow(){if(!SYNC.uid||SYNC.busy)return;const uid=SYNC.uid;setSt('syncing');
 try{const tk=++SYNC.tk,D=await SYNC.fb.getDocs(uid);if(tk!==SYNC.tk||SYNC.uid!==uid)return;SYNC.pending=D;if(state==='menu')pull();await push()}catch(e){setSt(e&&e.code==='permission-denied'?'ro':'err')}}
function onCloud(info){if(info.fromCache||info.pending)return;const D=info.docs,a=Object.keys(D),b=Object.keys(SYNC.cloud);
 if(SYNC.ready&&a.length===b.length&&a.every(k=>SYNC.cloud[k]===D[k].j))return; // our own write coming back
 SYNC.pending=D;pull()}
async function acctConnect(){const uid=SYNC.uid;SYNC.cloud={};SYNC.ready=false;setSt('connecting');
 const tk=++SYNC.tk,D=await SYNC.fb.getDocs(uid);if(tk!==SYNC.tk||SYNC.uid!==uid)return;SYNC.pending=D;pull();
 SYNC.unsub=SYNC.fb.listen(uid,onCloud,e=>setSt(e&&e.code==='permission-denied'?'ro':'err'))}
async function onUser(u){ // fires at load (restoring a saved login) and on every login/logout
 if(SYNC.regBusy)return;if(SYNC.unsub){try{SYNC.unsub()}catch(e){}SYNC.unsub=null}clearTimeout(SYNC.timer);SYNC.timer=0;clearTimeout(SYNC.retry);SYNC.tk++;
 Object.assign(SYNC,{cloud:{},pending:null,ready:false});
 if(!u){SYNC.acct=null;SYNC.uid=null;SYNC.email='';SYNC.uname='';SYNC.needName=false;SYNC.cur=null;acctRefresh();return}
 SYNC.uid=u.uid;SYNC.email=(u.email||'').toLowerCase();SYNC.uname=u.displayName||(isUdom(SYNC.email)?nameOf(SYNC.email):'');SYNC.needName=!SYNC.uname;SYNC.acct={name:SYNC.uname||'New player'};SYNC.cur=null;SYNC.plv='';SYNC.blv='';ensureProfile();
 if(save.acct&&save.acct!==u.uid)applyMerged({unlocked:1,best:{},runs:[],off:save.off||0,diff:2,slow:5,spd:1,free:false,pr:false,endBest:0,st:{},mods:{},custom:[],ach:{},v:5,ts:0}); // different account: don't mix progress
 save.acct=u.uid;try{localStorage.setItem('onetap2',sjson(save))}catch(e){}
 if(SYNC.needName)setTimeout(()=>{if(SYNC.needName&&state==='menu'&&SYNC.uid===u.uid)nameScreen()},0); // older email-only accounts must pick a username
 acctRefresh();
 try{await acctConnect()}catch(e){if(SYNC.uid===u.uid){setSt(e&&e.code==='permission-denied'?'ro':'err');clearTimeout(SYNC.retry);SYNC.retry=setTimeout(()=>{if(SYNC.uid===u.uid)acctConnect().catch(()=>setSt('err'))},15000)}}}
function fbInit(fb){if(!fb){SYNC.dbState='none';SYNC.st='idle';acctRefresh();return}
 SYNC.fb=fb;SYNC.dbState='ok';fb.onAuth(onUser)}
async function logout(){if(SYNC.uid&&SYNC.ready&&SYNC.timer)await push();try{await SYNC.fb.signOut()}catch(e){}menu()}
function acctScreen(mode){state='menu';ui.scrollTop=0;const s=SYNC,ok=s.dbState==='ok';
 if(s.acct){ui.innerHTML=`<div class="p" style="max-width:420px"><h1 style="font-size:26px">Account</h1><p>Signed in as <b>${esc(s.acct.name)}</b>.${s.email&&!isUdom(s.email)?'<br>'+esc(s.email):''}</p><p id="aacct">${esc(acctStatusText())}</p><div class="row" style="margin-top:12px"><button data-a="sync">Sync now</button>${s.needName?'<button data-a="a_uname">Pick username</button>':''}<button data-a="a_pw">Change password</button><button data-a="a_out">Log out</button><button class="main" data-a="menu">Back</button></div></div>`;return}
 const up=mode==='up',off=ok?'':' disabled';
 ui.innerHTML=`<div class="p" style="max-width:420px"><h1 style="font-size:26px">${up?'Create account':'Log in'}</h1>
 <p>${up?'Pick an email and a username. Each one can only belong to one account. Progress already on this device is added to your new account.':'Log in with your email address. Accounts made earlier with only a username still log in with that username. Progress already on this device is added to your account.'}</p>
 ${up?`<label>Email<br><input id="ae" type="text" inputmode="email" autocomplete="email" maxlength="64" style="width:min(100%,300px)"${off}></label>
 <label>Username<br><input id="an" type="text" autocomplete="username" maxlength="24" style="width:min(100%,300px)"${off}></label>`:`<label>Email or username<br><input id="an" type="text" autocomplete="username" maxlength="64" style="width:min(100%,300px)"${off}></label>`}
 <label>Password<br><input id="ap" type="password" autocomplete="${up?'new-password':'current-password'}" maxlength="128" style="width:min(100%,300px)"${off}></label>
 <p class="hint" id="apr" style="margin:4px 0"></p>
 <p class="nb" id="amsg" style="min-height:20px">${ok?'':(s.dbState==='wait'?'Still connecting…':'Accounts aren’t available right now.')}</p>
 ${up?'<p class="hint">Your username is shown to other players and can’t be changed later. Use a real email so you can reset your password.</p>':''}
 <div class="row" style="margin-top:10px"><button class="main" data-a="${up?'a_reg':'a_login'}"${off}>${up?'Create account':'Log in'}</button><button data-a="a_mode" data-v="${up?0:1}">${up?'I have an account':'New here? Create account'}</button></div>
 <div class="row" style="margin-top:8px">${up?'':`<button data-a="a_reset"${off}>Forgot password?</button>`}<button data-a="menu">Back</button></div></div>`;
 const go=e=>{if(e.key==='Enter')doAuth(up)},hint=()=>{const v=$('#ap').value;$('#apr').innerHTML=!up?'':v?'Password needs: '+pwRules(v,$('#an').value).map(r=>(r[1]?'✓ ':'✗ ')+r[0]).join(' · '):'Password needs 8+ characters, a letter and a number.'};hint();
 if(ok){['#ae','#an','#ap'].forEach(q=>{const e=$(q);if(e)e.onkeydown=go});$('#ap').oninput=hint;$('#an').oninput=hint;($('#ae')||$('#an')).focus()}}
// reserve a username for the signed-in account (a name can only be claimed once, and the rules never allow it to change)
async function claimName(un){const F=SYNC.fb,uid=F.cur().uid,ex=await F.cget(['usernames',un]).catch(()=>null);
 if(ex){if(ex.uid===uid)return;throw new Error('That username is taken.')}
 try{await F.cset(['usernames',un],{uid,ts:Date.now()})}catch(e){throw new Error(e&&e.code==='permission-denied'?'That username is taken or isn’t allowed.':'Couldn’t reserve that username. Try again.')}}
async function doAuth(reg){const msg=t=>{const e=$('#amsg');if(e)e.textContent=t},busy=v=>document.querySelectorAll('.p button').forEach(b=>b.disabled=v);
 let em,un='';const pw=$('#ap').value||'';
 if(reg){em=($('#ae').value||'').trim().toLowerCase();un=($('#an').value||'').trim().toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))return msg('Enter a valid email address.');
  if(em.endsWith('@'+UDOM))return msg('That email address can’t be used.');
  if(!/^[a-z0-9._-]{3,24}$/.test(un))return msg('Usernames are 3 to 24 letters, numbers, dots, dashes or underscores.')}
 else{try{em=idToEmail($('#an').value||'')}catch(e){return msg(e.message)}}
 if(!pw)return msg('Enter your password.');
 if(reg){const bad=[...pwRules(pw,un),...pwRules(pw,em)].filter(r=>!r[1]).map(r=>r[0].toLowerCase());if(bad.length)return msg('Choose a stronger password. Needed: '+[...new Set(bad)].join(', ')+'.')}
 busy(true);msg(reg?'Creating account…':'Logging in…');let done=false;if(reg)SYNC.regBusy=true;
 try{if(reg){await SYNC.fb.signUp(em,pw);
   try{await claimName(un);await SYNC.fb.setName(un)}catch(e){try{await SYNC.fb.delUser()}catch(_){}throw e} // username taken: undo the new login so the email isn't used up
   SYNC.regBusy=false;onUser(SYNC.fb.cur())}
  else await SYNC.fb.signIn(em,pw);
  done=true;menu()}
 catch(e){msg(e&&e.code?fbMsg(e):(e&&e.message)||'Something went wrong. Please try again.')}
 finally{SYNC.regBusy=false;if(!done)busy(false)}}
function nameScreen(){state='menu';ui.scrollTop=0;ui.innerHTML=`<div class="p" style="max-width:420px"><h1 style="font-size:26px">Choose a username</h1><p>Every account needs its own username. It’s shown to other players and can’t be changed later.</p><label>Username<br><input id="un" type="text" autocomplete="off" maxlength="24" style="width:min(100%,300px)"></label><p class="nb" id="amsg" style="min-height:20px"></p><div class="row"><button class="main" data-a="a_nameok">Save username</button><button data-a="menu">Later</button></div></div>`;const i=$('#un');i.onkeydown=e=>{if(e.key==='Enter')doName()};i.focus()}
async function doName(){const msg=t=>{const e=$('#amsg');if(e)e.textContent=t},bs=v=>document.querySelectorAll('.p button').forEach(b=>b.disabled=v),un=($('#un').value||'').trim().toLowerCase();
 if(!/^[a-z0-9._-]{3,24}$/.test(un))return msg('Usernames are 3 to 24 letters, numbers, dots, dashes or underscores.');
 if(!SYNC.fb||!SYNC.fb.cur())return msg('You’re not logged in.');
 bs(true);msg('Saving…');
 try{await claimName(un);await SYNC.fb.setName(un);SYNC.uname=un;SYNC.needName=false;SYNC.acct={name:un};SYNC.plv='';SYNC.blv='';ensureProfile();syncProfile(SYNC.uid);syncBoard(SYNC.uid);menu()}
 catch(e){msg((e&&e.message)||'That didn’t work.');bs(false)}}
async function doReset(){const msg=t=>{const e=$('#amsg');if(e)e.textContent=t},v=($('#an').value||'').trim().toLowerCase();
 if(!v.includes('@'))return msg('Enter your email address above. Accounts made with just a username can’t be reset.');
 try{idToEmail(v)}catch(e){return msg(e.message)}
 try{await SYNC.fb.reset(v);msg('If that email has an account, a reset link is on its way.')}catch(e){msg(fbMsg(e))}}
setInterval(()=>{if(SYNC.pending)pull()},1500);
addEventListener('visibilitychange',()=>{if(document.hidden&&SYNC.timer&&SYNC.ready)push()});
setTimeout(()=>{if(SYNC.dbState==='wait')fbInit(null)},8000); // Firebase never loaded (offline or blocked): stay local

// Change password (Firebase wants the current password again before it will set a new one)
function pwScreen(){if(!SYNC.acct||!SYNC.fb)return acctScreen();state='menu';ui.scrollTop=0;
 const fld=(id,l,ac)=>`<label>${l}<br><input id="${id}" type="password" autocomplete="${ac}" maxlength="128" style="width:min(100%,300px)"></label>`;
 ui.innerHTML=`<div class="p" style="max-width:420px"><h1 style="font-size:26px">Change password</h1><p>Enter your current password, then choose a new one.</p>
 ${fld('pw0','Current password','current-password')}${fld('pw1','New password','new-password')}${fld('pw2','Confirm new password','new-password')}
 <p class="hint" id="apr" style="margin:4px 0">Password needs 8+ characters, a letter and a number.</p><p class="nb" id="amsg" style="min-height:20px"></p>
 <div class="row" style="margin-top:10px"><button class="main" data-a="a_pwok">Change password</button><button data-a="acct">Back</button></div></div>`;
 const hint=()=>{const v=$('#pw1').value;if(!v){$('#apr').textContent='Password needs 8+ characters, a letter and a number.';return}const m=new Map();for(const r of[...pwRules(v,SYNC.uname),...pwRules(v,SYNC.email)])m.set(r[0],(m.has(r[0])?m.get(r[0]):true)&&r[1]);$('#apr').textContent='Password needs: '+[...m].map(([n,ok])=>(ok?'✓ ':'✗ ')+n).join(' · ')};
 ['#pw0','#pw1','#pw2'].forEach(q=>{$(q).onkeydown=e=>{if(e.key==='Enter')doPw()}});$('#pw1').oninput=hint;$('#pw0').focus()}
async function doPw(){const msg=t=>{const e=$('#amsg');if(e)e.textContent=t},bs=v=>document.querySelectorAll('.p button').forEach(b=>b.disabled=v);
 const cur=$('#pw0').value,n1=$('#pw1').value,n2=$('#pw2').value;
 if(!cur)return msg('Enter your current password.');
 if(!n1)return msg('Enter a new password.');
 if(n1!==n2)return msg('The new passwords don’t match.');
 if(n1===cur)return msg('The new password has to be different from your current one.');
 const bad=[...pwRules(n1,SYNC.uname),...pwRules(n1,SYNC.email)].filter(r=>!r[1]).map(r=>r[0].toLowerCase());
 if(bad.length)return msg('Choose a stronger password. Needed: '+[...new Set(bad)].join(', ')+'.');
 if(!SYNC.fb||!SYNC.fb.cur())return msg('You’re not logged in.');
 bs(true);msg('Changing password…');
 try{await SYNC.fb.changePw(cur,n1);
  ui.innerHTML='<div class="p" style="max-width:420px"><h1 style="font-size:26px">Password changed</h1><p>Your new password is ready to use. Other devices stay logged in until they sign out.</p><div class="row"><button class="main" data-a="acct">Back to account</button></div></div>'}
 catch(e){const c=e&&e.code||'';msg(c==='auth/wrong-password'||c==='auth/invalid-credential'?'Your current password is wrong.':c==='auth/weak-password'?'That password is too weak. Use 8+ characters with a letter and a number.':fbMsg(e));bs(false)}}

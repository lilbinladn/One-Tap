/* ================= ONLINE TAB, CHANGE PASSWORD, FRIENDS, LEADERBOARDS ================= */
// Online tab: the community levels now live in the main menu's right-hand list when "Online" is switched on.
// ----- Friends: friendReqs/<from>_<to> holds a pending request, friends/<uid>/with/<other> is each side of an accepted friendship
const FR={inc:[],out:[],fl:[],busy:false,loaded:false,msg:''};
function friendsScreen(){state='menu';ui.scrollTop=0;FR.msg='';ui.innerHTML='<div class="p" id="frroot"></div>';frDraw();if(socOK())frLoad()}
async function frLoad(){const uid=SYNC.uid;FR.busy=true;frDraw();
 try{const F=SYNC.fb,[inc,out,fl]=await Promise.all([F.cfind(['friendReqs'],'to',uid),F.cfind(['friendReqs'],'from',uid),F.clist(['friends',uid,'with'])]);
  FR.inc=inc.map(r=>({id:r.id,uid:r.d.from,name:r.d.fromName||'?'}));FR.out=out.map(r=>({id:r.id,uid:r.d.to,name:r.d.toName||'?'}));
  const docs=await Promise.all(fl.map(x=>F.cget(['leaderboard',x.id]).catch(()=>null)));
  FR.fl=fl.map((x,i)=>({uid:x.id,name:(docs[i]&&docs[i].name)||x.d.name||'?',total:docs[i]?docs[i].total||0:null})).sort((p,q)=>(q.total||0)-(p.total||0));FR.loaded=true}
 catch(e){FR.msg=socErr(e,'friends')}
 FR.busy=false;frDraw()}
function frDraw(){if(state!=='menu'||!$('#frroot'))return;const u=$('#fru'),uv=u?u.value:'',st=ui.scrollTop;
 let h='<div class="p" id="frroot" style="max-width:700px"><h1 style="font-size:28px">Friends</h1>';const g=socGate('Friends');
 if(g)h+=g;else{
  h+='<div class="acct"><label style="margin-top:0">Add a friend by username<br><input id="fru" type="text" maxlength="24" autocomplete="off" value="'+esc(uv)+'" style="width:min(100%,260px)"></label><div class="row" style="margin-top:8px"><button class="main" data-a="fr_add">Send request</button></div></div>';
  if(FR.msg)h+='<p class="nb">'+esc(FR.msg)+'</p>';
  if(FR.busy&&!FR.loaded)h+='<p>Loading…</p>';
  if(FR.inc.length)h+='<h2>Requests for you</h2><div class="acct">'+FR.inc.map((r,i)=>`<div class="ac-row"><div><b>${esc(r.name)}</b><small>wants to be your friend</small></div><button class="main" data-a="fr_acc" data-v="${i}">Accept</button><button data-a="fr_no" data-v="${i}">Decline</button></div>`).join('')+'</div>';
  if(FR.out.length)h+='<h2>Requests you sent</h2><div class="acct">'+FR.out.map((r,i)=>`<div class="ac-row"><div><b>${esc(r.name)}</b><small>waiting for them to accept</small></div><button data-a="fr_cancel" data-v="${i}">Cancel</button></div>`).join('')+'</div>';
  h+='<h2>Your friends · '+FR.fl.length+'</h2>';
  h+=FR.fl.length?'<div class="acct">'+FR.fl.map((f,i)=>`<div class="ac-row"><div><b>${esc(f.name)}</b><small>${f.total==null?'No score yet':ttl(f.total)+' · '+fmtN(f.total)+' pts'}</small></div><button data-a="fr_rm" data-v="${i}">Remove</button></div>`).join('')+'</div>':(FR.loaded?'<p>No friends yet. Type a player’s username above to send a request. They need to have logged in and picked a username.</p>':'');
  h+='<div class="row" style="margin-top:12px"><button data-a="lb_open">Leaderboards</button><button data-a="fr_refresh">Refresh</button></div>'}
 h+=backRow+'</div>';ui.innerHTML=h;ui.scrollTop=st;
 const i=$('#fru');if(i)i.onkeydown=e=>{if(e.key==='Enter')socAct('fr_add',i)}}
async function frAccept(r){const F=SYNC.fb,me=SYNC.uid;
 await F.cset(['friends',me,'with',r.uid],{name:r.name,ts:Date.now()});
 await F.cset(['friends',r.uid,'with',me],{name:SYNC.uname,ts:Date.now()});
 await F.cdel(['friendReqs',r.id]);
 if(FR.out.some(q=>q.uid===r.uid))await F.cdel(['friendReqs',me+'_'+r.uid]).catch(()=>{})}

async function socAct(a,b){const v=+b.dataset.v;
 if(a=='fr_open')return friendsScreen();
 if(a=='fr_refresh')return frLoad();
 if(a=='lb_open'||a.startsWith('lb_'))return lbAct(a,b);
 if(!socOK())return;
 const F=SYNC.fb,me=SYNC.uid;FR.msg='';
 try{
  if(a=='fr_add'){const p=await cmFind(($('#fru')&&$('#fru').value)||'');
   if(p.uid===me)throw new Error('That’s your own username.');
   if(FR.fl.some(f=>f.uid===p.uid))throw new Error(p.name+' is already your friend.');
   const inc=FR.inc.find(r=>r.uid===p.uid);
   if(inc){await frAccept(inc);toast('Friend added',p.name)}
   else if(FR.out.some(r=>r.uid===p.uid))throw new Error('You already sent '+p.name+' a request.');
   else{await F.cset(['friendReqs',me+'_'+p.uid],{from:me,to:p.uid,fromName:SYNC.uname,toName:p.name,ts:Date.now()});toast('Request sent',p.name)}
   const i=$('#fru');if(i)i.value=''}
  else if(a=='fr_acc'){const r=FR.inc[v];if(r){await frAccept(r);toast('Friend added',r.name)}}
  else if(a=='fr_no'){const r=FR.inc[v];if(r){await F.cdel(['friendReqs',r.id]);toast('Request declined',r.name)}}
  else if(a=='fr_cancel'){const r=FR.out[v];if(r){await F.cdel(['friendReqs',r.id]);toast('Request cancelled',r.name)}}
  else if(a=='fr_rm'){const f=FR.fl[v];if(f&&confirm('Remove '+f.name+' from your friends?')){await F.cdel(['friends',me,'with',f.uid]);await F.cdel(['friends',f.uid,'with',me]).catch(()=>{});toast('Friend removed',f.name)}}}
 catch(e){FR.msg=socErr(e,'friends');frDraw();return}
 await frLoad()}

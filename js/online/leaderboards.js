// Leaderboard row: one public document per player (leaderboard/<uid>), rewritten whenever progress syncs
async function syncBoard(uid){try{if(!cmOK()||SYNC.uid!==uid||!SYNC.uname||SYNC.needName)return;
 const b={};for(const k in save.best){const e=save.best[k];if(e&&+k<=SEC&&e.s>0)b['l'+k]=Math.round(e.s)}
 const o={name:SYNC.uname,total:Math.round(total()),end:Math.round(save.endBest||0),b},s=canon(o);
 if(s===SYNC.blv)return;await SYNC.fb.cset(['leaderboard',uid],Object.assign({},o,{ts:Date.now()}));SYNC.blv=s}catch(e){}}

// ----- Leaderboards: top scores for everyone or just you and your friends
const LB={scope:0,board:'total',rows:[],busy:false,msg:'',tk:0,loaded:false};
function lbScreen(){state='menu';ui.scrollTop=0;LB.msg='';LB.rows=[];LB.loaded=false;ui.innerHTML='<div class="p" id="lbroot"></div>';lbDraw();if(socOK())lbLoad()}
async function lbLoad(){const tk=++LB.tk,uid=SYNC.uid;LB.busy=true;LB.msg='';lbDraw();
 try{const F=SYNC.fb;await syncBoard(uid); // publish your latest scores first
  const bd=LB.board,fld=bd==='total'?'total':bd==='end'?'end':'b.l'+bd,val=d=>bd==='total'?d.total:bd==='end'?d.end:(d.b&&d.b['l'+bd]);let docs;
  if(LB.scope===0)docs=(await F.ctop(['leaderboard'],fld,50)).map(r=>({uid:r.id,d:r.d}));
  else{const fl=await F.clist(['friends',uid,'with']),ids=[uid,...fl.map(x=>x.id)],ds=await Promise.all(ids.map(id=>F.cget(['leaderboard',id]).catch(()=>null)));docs=ids.map((id,i)=>({uid:id,d:ds[i]})).filter(r=>r.d)}
  if(tk!==LB.tk)return;
  LB.rows=docs.map(r=>({uid:r.uid,name:r.d.name||'?',v:+val(r.d)||0})).filter(r=>r.v>0).sort((p,q)=>q.v-p.v).slice(0,50);LB.loaded=true}
 catch(e){if(tk!==LB.tk)return;LB.msg=socErr(e,'leaderboard')}
 LB.busy=false;lbDraw()}
function lbDraw(){if(state!=='menu'||!$('#lbroot'))return;const st=ui.scrollTop;
 let h='<div class="p" id="lbroot" style="max-width:700px"><h1 style="font-size:28px">Leaderboards</h1>';const g=socGate('Leaderboards');
 if(g)h+=g;else{
  const opts='<option value="total">Total score</option><option value="end">Endless</option>'+CAMP.map((l,i)=>`<option value="${i}">Level ${i+1} · ${esc(l.name)}</option>`).join('');
  h+='<div class="row">'+seg('lb_scope',['Everyone','Friends'],LB.scope)+'</div><label style="margin-top:8px">Board<br><select id="lbsel" style="max-width:100%">'+opts.replace('value="'+LB.board+'"','value="'+LB.board+'" selected')+'</select></label>';
  if(LB.msg)h+='<p class="nb">'+esc(LB.msg)+'</p>';
  else if(LB.busy&&!LB.loaded)h+='<p>Loading…</p>';
  else if(!LB.rows.length)h+='<p>'+(LB.scope?'None of your friends have a score on this board yet.':'Nobody has a score on this board yet.')+'</p>'+(LB.scope?'<div class="row"><button data-a="fr_open">Find friends</button></div>':'');
  else{const tot=LB.board==='total';h+='<table><tr><th>#</th><th>Player</th>'+(tot?'<th>Title</th>':'')+'<th>Score</th></tr>'+LB.rows.map((r,i)=>{const me=r.uid===SYNC.uid;return `<tr${me?' style="font-weight:700"':''}><td>${i+1}</td><td>${esc(r.name)}${me?' (you)':''}</td>${tot?'<td>'+ttl(r.v)+'</td>':''}<td>${fmtN(r.v)}</td></tr>`}).join('')+'</table>'}
  h+='<p class="hint">Scores come from each player’s own device, and show up after their progress syncs. Practice, slowed and No Fail runs don’t count.</p>';
  h+='<div class="row" style="margin-top:12px"><button data-a="lb_refresh">Refresh</button><button data-a="fr_open">Friends</button></div>'}
 h+=backRow+'</div>';ui.innerHTML=h;ui.scrollTop=st}
ui.onchange=e=>{if(e.target&&e.target.id==='lbsel'){LB.board=e.target.value;lbLoad()}};

// leaderboard actions; socAct in friends.js forwards any lb_* action here
async function lbAct(a,b){const v=+b.dataset.v;
 if(a=='lb_open')return lbScreen();
 if(a=='lb_scope'){LB.scope=v;return lbLoad()}
 if(a=='lb_refresh')return lbLoad()}

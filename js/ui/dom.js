const applyTheme=()=>{const e=document.documentElement;save.st.theme=='auto'?e.removeAttribute('data-theme'):e.setAttribute('data-theme',save.st.theme)};
const seg=(a,o,c)=>o.map((n,i)=>`<button data-a="${a}" data-v="${i}" class="${i===c?'sel':''}">${n}</button>`).join('');
const total=()=>Object.values(save.best).reduce((a,b)=>a+b.s,0);
const title=()=>{const t=total();return TITLES.filter(a=>t>=a[0]).pop()[1]};
const CP=['#e0245e','#ff3d81','#ff9f1a','#ffd24a','#7be04f','#3de0ff','#a66bff','#ffffff'];
const sw=(a,c)=>`<button data-a="${a}" data-v="-1" class="${c?'':'sel'}">Auto</button>`+CP.map((k,i)=>`<button data-a="${a}" data-v="${i}" title="${k}" style="background:${k};width:34px;height:34px;padding:0;border-radius:50%;border-color:${c===k?'var(--fg)':'transparent'}"></button>`).join('');
const ms={u:0,s:0,l:0},keep=()=>{const s=$('.side'),l=$('.list');if(s&&l){ms.s=s.scrollTop;ms.l=l.scrollTop;ms.u=ui.scrollTop}};
const TQ=[];let TB=0;
function toast(h,t){TQ.push([h,t]);if(!TB)nextToast()}
function nextToast(){const q=TQ.shift();if(!q){TB=0;return}TB=1;let e=$('#toast');if(!e){e=document.createElement('div');e.id='toast';document.body.appendChild(e)}
 e.innerHTML='<b>'+esc(q[0])+'</b><span>'+esc(q[1])+'</span>';requestAnimationFrame(()=>e.classList.add('on'));setTimeout(()=>{e.classList.remove('on');setTimeout(nextToast,450)},2800)}
const socOK=()=>!!(SYNC.fb&&SYNC.fb.cget&&SYNC.uid&&SYNC.uname&&!SYNC.needName);
const ttl=t=>TITLES.filter(a=>(t||0)>=a[0]).pop()[1],fmtN=n=>Math.round(n).toLocaleString();
function socGate(what){
 if(!SYNC.fb||SYNC.dbState==='none')return '<p>'+what+' need accounts, which aren’t available right now.</p>';
 if(SYNC.dbState==='wait')return '<p>Connecting…</p>';
 if(!SYNC.acct)return '<p>Log in to use '+what.toLowerCase()+'.</p><div class="row"><button class="main" data-a="acct">Log in</button></div>';
 if(!socOK())return '<p>Pick a username first so other players can find you.</p><div class="row"><button class="main" data-a="a_uname">Pick username</button></div>';
 return ''}
const socErr=(e,what)=>e&&e.code==='permission-denied'?'The '+what+' rules aren’t deployed yet. Publish the updated firestore.rules file in the Firebase console.':(e&&e.message&&!e.code)?e.message:'That didn’t work. Check your connection and try again.';
const backRow='<div class="row" style="margin-top:14px"><button class="main" data-a="menu">Back</button></div>';

const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

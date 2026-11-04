const dst=(o,d)=>o.rb?(d>o.rb?d-o.rb:o.rb/2-Math.abs(d-o.rb/2)):o.sg?(d>1.5?d-.5:d>1?1:d):d;
const side=B=>(F.r?(Math.floor((B-4)/F.r)%2?-1:1):1)*(mo.mr?-1:1);
let HC={},TP=[],BN=[];
function draw(n){const{bg,fg,hot,ring,mut}=cols,cb=bt(n),hx=(F.r||F.sc)?W/2:mo.mr?W*.78:W*.22,cy=H/2,ppb=Math.min(180,W/5),R=24,bpm=curBpm(cb),pulse=1-(((cb%1)+1)%1);
 const yOf=d=>F.w?cy+Math.sin(d*1.3+cb*.6)*Math.min(1,Math.abs(d)/1.5)*H*.15:cy;
 bgDraw(cb,pulse);
 x.save();x.translate(hx,cy);x.rotate(F.s?Math.sin(cb*.22)*F.s*.6:0);x.translate(-hx,-cy);if(lv==SEC)x.translate(Math.sin(cb*47)*3*pulse,Math.cos(cb*53)*3*pulse);x.strokeStyle=fg;x.globalAlpha=.25;x.lineWidth=2;
 for(const s of[1,-1]){x.beginPath();x.moveTo(hx,cy);for(let d=0;d<=W/ppb+1;d+=.25)x.lineTo(hx+s*d*ppb,yOf(d));x.stroke()}
 x.globalAlpha=1;x.lineWidth=4;x.strokeStyle=ring;x.beginPath();x.arc(hx,cy,R+pulse*4,0,7);x.stroke();
 const gwp=gw*bpm/60*ppb;x.globalAlpha=.2;x.fillStyle=ring;x.fillRect(hx-gwp,cy-R-14,gwp*2,R*2+28);x.globalAlpha=1;
 for(const o of notes){const d=o.B-cb,sd=o.sx||side(o.B);if(d>W/ppb+1||d+o.len<-W/ppb||o.hit===1)continue;
  const dv=dst(o,d),px=hx+sd*dv*ppb,py=yOf(dv);let a=o.hit<0?.25:1;
  if((mo.hd)&&(o.hit===0||o.hit===3)){const ad=Math.abs(d);if(ad<1.4)a*=ad<.45?.04:(ad-.45)/.95}
  x.globalAlpha=a;
  if(o.len){const sx=hx+sd*Math.max(d,0)*ppb,ex=hx+sd*(d+o.len)*ppb;x.strokeStyle=o.roll?ring:o.lift?cols.ok:hot;x.lineCap='round';x.lineWidth=16;x.globalAlpha=a*.45;x.beginPath();x.moveTo(sx,o.hit===2?cy:yOf(Math.max(d,0)));x.lineTo(ex,yOf(d+o.len));x.stroke();x.globalAlpha=a;x.lineCap='butt'}
  if(o.hit===2){x.globalAlpha=1}
  if(o.decoy){x.fillStyle=mut;x.beginPath();x.arc(px,py,R-8,0,7);x.fill();x.strokeStyle=bg;x.lineWidth=3;x.beginPath();x.moveTo(px-6,py-6);x.lineTo(px+6,py+6);x.moveTo(px+6,py-6);x.lineTo(px-6,py+6);x.stroke()}
  else{const cx=o.hit===2?hx:px,cy2=o.hit===2?cy:py;x.fillStyle=hot;x.globalAlpha=a*.25;x.beginPath();x.arc(cx,cy2,R+5,0,7);x.fill();x.globalAlpha=a;x.beginPath();x.arc(cx,cy2,R-4,0,7);x.fill();x.strokeStyle=o.rb?'#ffd24a':o.sg?'#7be04f':'#fff';x.lineWidth=4;x.stroke();
   if(save.st.ar&&o.hit===0&&d>0&&d<1.5){x.globalAlpha=a*.7;x.strokeStyle=ring;x.lineWidth=3;x.beginPath();x.arc(cx,cy2,R+d*26,0,7);x.stroke();x.globalAlpha=a}
   for(let q=0;q<(o.dbl||0);q++){x.strokeStyle=ring;x.lineWidth=3;x.beginPath();x.arc(cx,cy2,R+1+q*6,0,7);x.stroke()}
   if(o.roll){x.fillStyle=fg;x.font='700 13px Space Grotesk,system-ui';x.textAlign='center';x.fillText((o.cnt||0)+'/'+o.need,cx,cy2-R-6)}}
  x.globalAlpha=1}
 for(const k of TP){const d=k.B-cb;if(d<-.5||d>W/ppb+1)continue;const px=hx+side(k.B)*d*ppb,py=yOf(d),c=k.up?hot:cols.ok;x.globalAlpha=.85;x.strokeStyle=c;x.lineWidth=3;x.setLineDash([6,5]);x.beginPath();x.moveTo(px,py-52);x.lineTo(px,py+52);x.stroke();x.setLineDash([]);x.fillStyle=c;x.font='700 13px Space Grotesk,system-ui';x.textAlign='center';x.fillText((k.up?'▲ ':'▼ ')+Math.round(k.bpm*rate),px,py-60);x.globalAlpha=1}
 x.restore();if(cb<4){x.fillStyle=fg;x.font='700 64px Space Grotesk,system-ui';x.textAlign='center';x.fillText(Math.max(1,4-Math.floor(Math.max(cb,0))),W/2,cy-100)}
 const bw=Math.min(340,W-40),hk=Math.round(bpm);if(HC.k!==hk){HC.k=hk;HC.a=`${lv==END?'':lv==CUS?'Custom: ':'Level '+(lv+1)+': '}${lev(lv).name}${lv==END?'':'  ·  '+(lv==CUS?'★'+custStars(CL,rate).toFixed(1):'★'+tier(lv).s.toFixed(1))}  ·  ${lv==CUS?(CL.audioName||'Built-in backing'):songOf(lev(lv)).name}  ·  ${hk} BPM`;HC.b=(SH?'Showcase: music + click pattern  ·  ':'')+mech(F)+(rate!=1?`  ·  ${Math.round(rate*100)}% speed${rate<1?', unranked':''}`:'')+mnames()}x.fillStyle='#000';x.globalAlpha=.35;x.fillRect(16,14,bw+8,18);x.globalAlpha=1;x.fillStyle=hp>35?ring:hot;x.fillRect(20,18,bw*hp/100,10);
 x.font='700 15px Space Grotesk,system-ui';x.textAlign='left';x.fillStyle=fg;x.fillText(HC.a,20,56);
 x.globalAlpha=.7;x.fillText(HC.b,20,76);x.globalAlpha=1;
 x.textAlign='right';x.font='700 38px Space Grotesk,system-ui';x.fillText(mo.nf?'NO SCORE':String(Math.round(pts)).padStart(8,'0'),W-20,44);x.font='700 16px Space Grotesk,system-ui';const tt=st.P+st.G+st.M;x.globalAlpha=.8;x.fillText((tt?((st.P+.7*st.G)/tt*100).toFixed(2):'100.00')+'%',W-20,68);x.globalAlpha=1;
 x.textAlign='center';x.font='italic 700 42px Space Grotesk,system-ui';x.fillStyle=combo?hot:fg;x.globalAlpha=combo?1:.3;x.fillText(combo+'x',W/2,H-42);x.globalAlpha=1;
 x.fillStyle=fg;x.globalAlpha=.15;x.fillRect(0,H-6,W,6);x.globalAlpha=.7;x.fillRect(0,H-6,W*Math.max(0,Math.min(1,n/endT)),6);x.globalAlpha=1;
 if(save.st.fps){const pt=performance.now();FT.push(pt);while(FT.length&&pt-FT[0]>1000)FT.shift();while(CT.length&&pt-CT[0]>1000)CT.shift();x.textAlign='right';x.font='700 14px Space Grotesk,system-ui';x.fillStyle=fg;x.globalAlpha=.75;x.fillText(FT.length+' FPS  ·  '+CT.length+' CPS',W-20,H-18);x.globalAlpha=1}
 {let by=Math.max(100,cy-195);x.textAlign='center';
  for(const k of save.st.tt!==0?TP:[]){const d=k.B-cb;if(d>0&&d<4){x.globalAlpha=Math.min(1,(4-d)*3,d*3)*(.65+.35*pulse);x.fillStyle=k.up?hot:cols.ok;x.font='700 24px Space Grotesk,system-ui';x.fillText(`TEMPO ${k.up?'UP ▲':'DOWN ▼'}  ${Math.round(k.bpm*rate)} BPM`,W/2,by);by+=30}}
  for(const b of BN){const d=b.B-cb;if(d>1&&d<5.5){x.globalAlpha=Math.min(1,(5.5-d)*3,(d-1)*3);x.fillStyle=b.c||ring;x.font='700 18px Space Grotesk,system-ui';x.fillText(b.t,W/2,by);by+=26}}x.globalAlpha=1}
 if(fb){const a=1-(performance.now()-fb.at)/500;if(a>0){x.globalAlpha=a;x.fillStyle=fb.c;x.font='700 28px Space Grotesk,system-ui';x.textAlign='center';x.fillText(fb.t,hx,cy+90);x.globalAlpha=1}}}

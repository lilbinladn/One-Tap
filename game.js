const $=s=>document.querySelector(s),cv=$('#c'),x=cv.getContext('2d'),ui=$('#ui');
let W,H;function rs(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;x.setTransform(d,0,0,d,0,0)}
addEventListener('resize',rs);rs();
const SC={min:[0,2,3,5,7,8,10],maj:[0,2,4,5,7,9,11],phr:[0,1,3,5,7,8,10],mix:[0,2,4,5,7,9,10],har:[0,2,3,5,7,8,11],loc:[0,1,3,5,6,8,10]};
// name, root midi, scale, chord degrees, lead wave, drum style
const S=[['Neon Drive',57,SC.min,[0,5,3,6],'sawtooth',0],['Glass Garden',60,SC.maj,[0,4,5,3],'triangle',1],['Static Bloom',52,SC.phr,[0,1,0,6],'square',2],
['Sunset Relay',55,SC.mix,[0,6,3,0],'triangle',1],['Overclock',50,SC.har,[0,5,2,4],'sawtooth',2],['Zero Hour',48,SC.min,[0,3,5,4],'square',0],
['Crystal Rain',62,SC.maj,[0,5,3,4],'triangle',1],['Chrome Hearts',53,SC.min,[0,2,5,3],'square',0],['Midnight Circuit',59,SC.phr,[0,6,5,6],'sawtooth',2],['Supernova',45,SC.har,[0,5,3,4],'sawtooth',0],
['Abyssal Toll',40,SC.loc,[0,1,4,1],'sawtooth',3],
['Pocket Galaxy',58,SC.mix,[0,3,6,4],'triangle',1],['Velvet Static',54,SC.min,[0,6,5,3],'sawtooth',0],['Paper Lanterns',63,SC.maj,[0,2,5,4],'triangle',2],['Iron Lullaby',47,SC.har,[0,3,4,0],'square',3]];
// song, bpm, subdivisions, density, mechanics {h hold, t tempo shifts, r flip every N beats, d decoys, x double taps, v vanish, w wave}, name
// A1 = first level of Area 2, NL = campaign levels, SEC = secret level, END = endless.
const A1=50,NL=200,SEC=200,END=201,CUS=202;
// song, bpm, subdivisions, density, mechanics, name, id (id keeps each level's note pattern and old saves stable)
const L=[[0,90,[1],0,{},'Warm-up',0],[11,96,[1,1,2],.2,{},'Pulse check',100],[0,100,[1,2],.35,{},'Half-steps',1],
[1,105,[1,2],.5,{},'Off the beat',2],[12,108,[2],.5,{},'Skipping stones',101],[3,108,[2],.5,{h:0.15},'Lazy river',102],
[1,110,[2],.6,{h:0.25},'Hold on',3],[13,112,[2],.7,{h:0.2},'Snooze button',103],[1,115,[2,4],.4,{h:0.3},'Long and short',4],
[2,120,[3,2],.6,{},'Triplet town',5],[14,110,[2,4],.5,{x:0.3},'Rubber band',105],[2,120,[2,3],.5,{h:0.2,x:0.2},'Loose change',104],
[0,125,[2,4],.5,{r:8,h:0.15},'Hairpin',106],[2,125,[2,4],.55,{t:[[16,150],[32,125]]},'Gear shift',6],[4,135,[2,4],.6,{h:0.2},'Quickstep',107],
[3,130,[4,2],.55,{h:0.2,t:[[24,160]]},'Redline',7],[3,100,[2],.65,{d:0.7},'Fake out',8],[3,135,[3,4],.6,{d:0.5},'Don’t bite',9],
[4,140,[2,4],.55,{r:8},'Flip side',10],[4,120,[4,2],.55,{r:4,h:0.2},'Back and forth',11],[4,130,[2,4],.6,{x:0.35},'Double trouble',12],
[3,140,[2,4],.55,{t:[[8,180],[16,110],[24,170],[32,120]]},'Whiplash',108],[5,145,[4,2],.6,{w:1,x:0.2},'Crosswind',109],[5,150,[4,2],.6,{x:0.3,h:0.2},'Ricochet',13],
[5,125,[2,4],.6,{},'Fade out',14],[4,150,[2,4],.6,{r:4,t:[[12,120],[28,160]]},'Switchback',110],[0,150,[4,3],.6,{w:1},'Seasick',15],
[0,140,[2,4],.6,{h:0.25},'Ghost notes',16],[1,135,[4,3],.6,{w:1,d:0.4},'Rough seas',17],[1,150,[2,4],.65,{t:[[12,110],[24,170],[36,130]],h:0.2},'Tempo roulette',18],
[2,160,[4,2,3],.65,{r:4,x:0.25},'Mirror match',19],[2,140,[4,3],.65,{d:0.4},'Blind faith',20],[2,155,[4,3],.6,{x:0.3,d:0.4},'Static shock',111],
[1,150,[4,3],.65,{w:1},'Undertow',112],[14,165,[4,2],.65,{d:0.5,h:0.2},'Trapdoor',113],[3,170,[4,4,3],.7,{h:0.2,w:1},'Riptide',21],
[3,150,[4,2],.65,{t:[[8,200],[16,120],[24,190],[32,130]],x:0.25},'Whiplash II',22],[4,160,[4,3],.7,{r:2,d:0.4},'Ping-pong',23],[12,165,[4,3],.7,{r:2,w:1,h:0.2},'Backspin',115],
[0,170,[4,3],.7,{x:0.35,r:4},'Jitter',114],[5,175,[4,3],.72,{w:1,x:0.3,t:[[16,140],[32,190]]},'Tailspin',116],[4,170,[4],.7,{x:0.35},'Seeing double',24],
[5,175,[4,3],.7,{w:1,r:4,h:0.2},'Vertigo',25],[5,180,[4],.75,{d:0.5,x:0.3,t:[[20,150],[32,200]]},'Chaos theory',26],[0,185,[4,3],.75,{w:1,r:4},'Event horizon',27],
[3,190,[4,3],.78,{r:4,x:0.3,w:1,h:0.2,d:0.3},'Breakneck',118],[4,185,[4],.75,{x:0.35,d:0.4},'Hot wire',117],[4,190,[4],.78,{h:0.2,x:0.3,d:0.4,t:[[16,160],[32,210]]},'Overclocked',28],
[5,195,[4,3],.8,{h:0.25,x:0.3,d:0.4,w:1,r:4,t:[[16,160],[32,210]]},'Zero hour',29],[0,210,[4,3],.85,{h:0.2,x:0.3,d:0.4,w:1,r:4,t:[[10,180],[20,215],[30,190],[38,220]]},'Apex',119],[6,100,[1,2],.4,{tr:0.3},'Triple threat',30],
[13,105,[1,2],.45,{tr:0.25},'Lightleak',120],[11,110,[2],.5,{li:0.3},'Dusk run',121],[6,110,[2],.55,{tr:0.35,h:0.2},'Burst',31],
[8,120,[2],.55,{ph:0.3,x:0.2},'Echo chamber',123],[6,120,[2,4],.5,{ro:0.3},'Roll call',32],[7,115,[2],.6,{ro:0.35,h:0.2},'Drumroll',33],
[7,125,[2,4],.55,{li:0.35},'Let go',34],[6,118,[2,4],.5,{ro:0.3,wp:0.2},'Prism',122],[12,125,[2,4],.5,{wp:0.35,li:0.25},'Halo',124],
[7,130,[4,2],.55,{li:0.3,x:0.25},'Lift off',35],[7,120,[2],.6,{wp:0.4},'Warp speed',36],[6,130,[4,2],.55,{tr:0.3,wp:0.3},'Slipstream',125],
[8,135,[4,2],.6,{wp:0.4,d:0.3},'Time slip',37],[8,125,[2,4],.55,{ph:0.3},'Clean Slate',38],[14,130,[2,4],.55,{ph:0.3},'Afterhours',126],
[8,140,[4,2],.55,{ph:0.3,ro:0.2},'Restless',39],[8,130,[2,4],.6,{s:0.5},'Spin cycle',40],[9,140,[4,2],.6,{s:0.5,r:4},'Orbit',128],
[8,145,[2,4],.6,{q:1,ph:0.3},'Flatline',130],[7,138,[2,4],.6,{ro:0.3,li:0.25,wp:0.2},'Spectrum',127],[9,145,[4,3],.6,{s:0.7,h:0.2},'Dizzy',41],
[9,135,[2,4],.55,{q:1},'Pressure',42],[9,150,[4,2],.6,{q:1,tr:0.25},'Squeeze play',43],[11,148,[4,2],.62,{tr:0.3,wp:0.3,t:[[16,120],[32,170]]},'Comet tail',129],
[6,160,[4,3],.65,{s:0.6,w:1,ro:0.25},'Redshift',131],[13,160,[4,3],.65,{ph:0.3,wp:0.35,d:0.4},'Glitch garden',132],[6,155,[4,3],.65,{tr:0.3,ro:0.25,t:[[16,130],[32,170]]},'Burst mode',44],
[6,150,[2,4],.65,{li:0.3,wp:0.3,r:4},'Reverse lift',45],[7,165,[4,2],.65,{ph:0.3,d:0.4},'Overtone',46],[7,160,[4,3],.65,{s:0.8,wp:0.3,w:1},'Carousel',47],
[14,175,[4,2],.7,{tr:0.3,q:1,s:0.7,w:1},'Sunburst',135],[8,168,[4],.65,{ro:0.35,tr:0.3},'Machine gun',133],[8,170,[4],.65,{ro:0.3,tr:0.3,h:0.2},'Machine gun II',48],
[8,155,[2,4],.7,{q:1,li:0.3,t:[[12,120],[28,180],[40,140]]},'Vice grip',49],[9,175,[4,3],.7,{ph:0.35,x:0.3,d:0.4},'Rampage',50],[9,165,[4,2],.7,{s:1,r:4,tr:0.3},'Centrifuge',51],
[6,180,[4,3],.7,{wp:0.4,li:0.3},'Mirage',52],[6,170,[4,2,3],.7,{q:1,ro:0.3,d:0.4,w:1},'Meltdown',53],[7,170,[4,3],.7,{li:0.3,ph:0.3,x:0.25},'Wreckage',134],
[12,180,[4,3],.72,{ro:0.3,li:0.3,wp:0.3,ph:0.3,d:0.4},'Cold open',136],[7,185,[4],.72,{tr:0.35,ph:0.3,s:0.6},'Bullet hell',54],[7,175,[4,3],.75,{li:0.35,ro:0.3,x:0.3,r:4,t:[[16,150],[32,200]]},'Gauntlet',55],
[8,190,[4],.75,{q:1,wp:0.4,ph:0.3,d:0.4},'Tightrope',56],[8,195,[4,3],.78,{s:0.9,tr:0.3,li:0.3,ro:0.25,w:1},'Singularity',57],[9,190,[4],.75,{q:1,s:0.9,ph:0.35,x:0.3},'Eclipse',137],
[6,200,[4,3],.78,{tr:0.3,ro:0.25,li:0.25,wp:0.3,s:1,w:1,r:4,q:1,t:[[16,160],[32,210]]},'Parallax',138],[9,200,[4],.78,{q:1,ph:0.3,wp:0.3,tr:0.3,r:4,d:0.4,t:[[16,160],[32,210]]},'Afterimage',58],[9,210,[4,3],.8,{h:0.2,tr:0.3,ro:0.25,li:0.25,wp:0.3,ph:0.3,d:0.4,q:1,s:0.8,w:1,r:4,t:[[16,170],[32,220]]},'Supernova',59],
[14,220,[4,3],.85,{h:0.2,tr:0.3,ro:0.25,li:0.25,wp:0.3,ph:0.35,d:0.45,q:1,s:1,w:1,r:4,x:0.3,t:[[16,170],[32,230]]},'Heat death',139],[10,250,[4,4,3],.9,{h:0.15,tr:0.3,ro:0.2,li:0.2,wp:0.35,ph:0.35,d:0.5,q:1,s:1,w:1,r:2,x:0.25,t:[[8,200],[16,260],[24,170],[32,280],[40,190],[48,300],[56,230],[64,320]]},'666',60]];
const MT={h:'Holds',t:'Tempo shifts',r:'Flip sides',d:'Decoys',x:'Double taps',w:'Wavy track',tr:'Triple taps',ro:'Rolls',li:'Lift notes',wp:'Warp notes',ph:'Phantom notes',rb:'Rebound notes',sg:'Stutter notes',sc:'Scatter notes',s:'Spin',q:'Squeeze'};
const mech=f=>Object.keys(f).filter(k=>k!='wp'&&k!='ph').map(k=>MT[k]).join(', ')||'Pure rhythm';
const nB=i=>i==CUS?CL.beats:i==END?400:i==SEC?72:i>=150?64:i>=100?60:i>=A1?56:44;
// level difficulty: speed x note density, plus a weight per mechanic
const MW={h:.35,r:.7,d:.5,x:.6,w:.5,tr:.9,ro:.7,li:.5,wp:.6,ph:0,rb:.7,sg:.5,sc:.4,s:.6,q:.5};
const stars=l=>{const[,bpm,subs,p,f]=l,tb=Math.max(bpm,...(f.t||[]).map(a=>a[1])),eb=bpm*.6+tb*.4,npb=subs.reduce((a,d)=>a+1+(d-1)*p,0)/subs.length;let m=0;for(const k in f)m+=k=='t'?.5+(f.t.length>3?.4:0):(MW[k]||.5);return eb/60*npb*.55+m*.45};
const TR=[[0,'Beginner','#2e9e5b'],[1.5,'Casual','#1a8fc4'],[2.5,'Steady','#a88400'],[3.5,'Tough','#e07b00'],[4.5,'Fierce','#e0452b'],[5.5,'Brutal','#d81b72'],[6.5,'Savage','#8e44d9'],[8,'Merciless','#b00d2a'],[11,'Hellbound','#4a0000']];
const tier=i=>{const s=stars(L[i]),t=TR.filter(a=>s>=a[0]).pop();return{n:t[1],c:t[2],s}};
// modifiers: key, name, description, score multiplier, short tag
const MODS=[['fc','Full Combo','Any combo break fails the run (miss, stray tap, decoy, early release).',1.25,'FC'],['ap','All Perfect','Every hit must be Perfect. Anything else fails the run.',1.5,'AP'],['fr','Fragile','Damage is doubled and hits no longer heal you.',1.15,'FR'],['tw','Tight timing','Hit windows are 30% smaller.',1.2,'TT'],['hd','Hidden','Every note fades out before it reaches the ring.',1.2,'HD'],['mr','Mirror','Notes come from the opposite side.',1.05,'MR'],['nf','No Fail','Your health can’t run out, so you can always finish the level. Score is halved. Turns off Full Combo and All Perfect.',.5,'NF']];
const mulOf=(m,rt)=>MODS.reduce((a,d)=>m[d[0]]&&!(m.ap&&d[0]=='fc')?a*d[3]:a,1)*(rt>1?rt:1);
const modLabel=()=>[rate>1?Math.round(rate*100)+'%':'',...MODS.filter(m=>mo[m[0]]).map(m=>m[4])].filter(Boolean).join(' ');
const mnames=()=>{const a=MODS.filter(m=>mo[m[0]]).map(m=>m[1]);return a.length?'  ·  '+a.join(', '):''};
const TH=[['Crystal Rain','#0b1a2e','#14456b','#7ee8ff','#ff7ac8','rain'],['Cosmos','#0d0a2a','#2a1560','#c7b6ff','#ffd24a','stars'],['Synth Grid','#1a0626','#4a0f5c','#ff5fd2','#4df3ff','grid'],['Equalizer','#071a14','#0f4a3a','#5dffb0','#ff9f43','bars'],['Ripple','#10122e','#1a3a6e','#69b4ff','#ff6b8b','rings'],['Deep Tide','#021a2a','#06506b','#3df0d0','#ff8a5c','waves'],['Ember Forge','#210a05','#5c1d08','#ffb347','#ff4d4d','embers'],['Hive','#1f1604','#4d3a08','#ffe14d','#ff5c8a','hex'],['Aurora','#04141f','#0a3a45','#7dffb8','#b48cff','aurora'],['Nova','#1b0410','#5a0a2e','#ff6fa8','#ffe3a3','nova'],['666','#0a0000','#3a0000','#ff1a1a','#ffffff','hell']];

// Areas 3 and 4 (levels 101-200) are built from a compact recipe: bpm, density and mechanics ramp up with the level number.
(()=>{const N3='Lucid,Daybreak,Sleepwalk,Moonwell,Haze,Lullaby,Nocturne,Driftwood,Somnia,Velvet Hour,Cradle,Slow Bloom,Half Light,Wisp,Fever Dream,Candlewick,REM Cycle,Snowglobe,Hush,Paper Moon,Tidepool,Skylark,Dewdrop,Fable,Reverie,Starling,Hollow Night,Gossamer,Glimmer,Umbra,Cloudburst,Eventide,Lantern,Mistral,Wanderer,Silhouette,Quicksilver,Halcyon,Ember Sky,Undertone,Dusk Chorus,Marigold,Vapor,Zephyr,Kaleidoscope,Opaline,Nightjar,Serenade,Starfall,Last Lullaby'.split(','),N4='Ascent,Skyhook,Redline,Thunderhead,Vortex,Pinnacle,Overdrive,Warhead,Stormfront,Flashpoint,Ironclad,Voltage,Crosswind,Shockwave,Hyperdrive,Razorback,Tempest,Blitz,Cascade,Detonator,Highwire,Backdraft,Ricochet,Whiplash III,Surge,Rampart,Firebrand,Anvil,Jetstream,Crossfire,Hammerfall,Maelstrom,Zero Gravity,Stampede,Lightning Rod,Cataclysm,Terminal,Juggernaut,Stormbreaker,Apogee,Meteor,Warpath,Rift,Nemesis,Armageddon,Oblivion,Paradox,Ragnarok,Event Zero,Zenith'.split(','),V={h:.2,li:.3,ro:.3,x:.3,tr:.3,wp:.35,d:.4,s:.7,w:1,q:1,r:4,rb:.3,sg:.35,sc:.6},Q=Object.keys(V),K=['rain','stars','grid','bars','rings','waves','embers','hex','aurora','nova'],add=[];
 [['Dream','#140f2e','#3b2a73','#d9c8ff','#ff9ad5'],['Lagoon','#06203a','#0b5c7a','#8ff3ff','#ffd27a'],['Blush','#2a0d1f','#6b2350','#ffb3d9','#9be7ff'],['Meadow','#0b2410','#1f6b32','#b6ffa8','#ff8fb0'],['Dusk','#1b1030','#7a3568','#ffc8a8','#7fd6ff'],['Frost','#0c1d33','#2d5f8f','#e0f4ff','#ff8aa8'],['Honey','#2a1a05','#7a5410','#ffe08a','#ff6e9c'],['Orchid','#1d0b2a','#5b1f7a','#f0b6ff','#9bffd0'],['Mist','#101c1c','#2e5a58','#c9fff0','#ffb36b'],['Twilight','#0e0e2c','#3a2a8c','#b9b6ff','#ffd86b'],
['Voltage','#001a2a','#005a78','#00f0ff','#ffe600'],['Magma','#2a0600','#8a1a00','#ffb000','#ffffff'],['Toxic','#0a1f00','#2f6b00','#b6ff00','#ff3df2'],['Rust','#241006','#6b2d0e','#ff9a4d','#6bf3ff'],['Neon Red','#1f0010','#780030','#ff4d8d','#4dffe0'],['Steel','#0d1620','#2e4458','#c8e0ff','#ff5c5c'],['Plasma','#14002a','#52008c','#d96bff','#6bff9e'],['Solar','#2a1a00','#8a5a00','#fff25c','#ff4d4d'],['Abyss','#00101c','#00395c','#5cf0ff','#ff8a3d'],['Void','#050505','#2a0f3a','#ffffff','#ff2d6f']].forEach((a,i)=>TH.push([...a,K[i%10]]));
 for(let j=0;j<100;j++){const a=j<50?0:1,k=j%50,r=rng(j*31+5),bpm=a?170+Math.round(k*1.9):150+Math.round(k*1.6),f={},n=Math.min(6,1+((k/10)|0)+a),fo=a?null:{0:'rb',2:'sg',4:'sc'}[k];
  if(fo)f[fo]=V[fo];while(Object.keys(f).length<n){const q=Q[Math.floor(r()*Q.length)];f[q]=['s','w','q','r'].includes(q)?V[q]:Math.min(.5,V[q]+k*.004)}
  if(k%7==3)f.t=[[16,bpm-25],[32,bpm+20],[48,bpm-10]];
  add.push([(j*7+3)%S.length,bpm,k<20?[4,2]:k<40?[4,3]:[4,3,4],+(.58+k*.004+a*.06).toFixed(2),f,(a?N4:N3)[k],200+j])}
 L.splice(100,0,...add)})();
function bgDraw(cb,pl){const{bg,ring}=cols;
 if(lv<A1||lv==END||lv==CUS){x.fillStyle=bg;x.fillRect(0,0,W,H);x.fillStyle=ring;x.globalAlpha=.07*pl;x.fillRect(0,0,W,H);x.globalAlpha=1;return}
 const th=TH[thOf(lv)],g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,th[1]);g.addColorStop(1,th[2]);x.fillStyle=g;x.fillRect(0,0,W,H);
 if(!save.st.fx)return;x.fillStyle=th[3];x.strokeStyle=th[3];const k=th[5],t=cb;
 if(k=='rain'){x.globalAlpha=.35;x.lineWidth=2;x.beginPath();for(let i=0;i<60;i++){const ax=(i*97)%W,ay=((i*53+t*140*(1+i%3*.3))%(H+60))-30;x.moveTo(ax,ay);x.lineTo(ax-4,ay+22)}x.stroke()}
 else if(k=='stars'){for(let i=0;i<90;i++){x.globalAlpha=.3+.5*Math.abs(Math.sin(t*.8+i));x.fillRect((i*131)%W,(i*71)%H,i%3+1,i%3+1)}}
 else if(k=='grid'){x.globalAlpha=.3;x.lineWidth=1;const hz=H*.55,off=t%1;for(let i=0;i<14;i++){const f=(i+off)/14,y=hz+(H-hz)*f*f;x.beginPath();x.moveTo(0,y);x.lineTo(W,y);x.stroke()}for(let i=-10;i<=10;i++){x.beginPath();x.moveTo(W/2+i*20,hz);x.lineTo(W/2+i*W/10,H);x.stroke()}}
 else if(k=='bars'){x.globalAlpha=.22;const n=28,bw=W/n;for(let i=0;i<n;i++){const h=H*.1+H*.35*Math.abs(Math.sin(t*1.7+i*.7)*Math.cos(t*.6+i));x.fillRect(i*bw+2,H-h,bw-4,h)}}
 else if(k=='rings'){x.lineWidth=2;for(let i=0;i<6;i++){const r=(((t*.5+i/6)%1)+1)%1;x.globalAlpha=.4*(1-r);x.beginPath();x.arc(W/2,H/2,r*Math.max(W,H)*.7,0,7);x.stroke()}}
 else if(k=='waves'){x.lineWidth=2;for(let j=0;j<5;j++){x.globalAlpha=.18+j*.04;x.beginPath();for(let ax=0;ax<=W;ax+=12){const y=H*(.55+j*.09)+Math.sin(ax*.012+t*(1+j*.3)+j)*18;ax?x.lineTo(ax,y):x.moveTo(ax,y)}x.stroke()}}
 else if(k=='embers'){x.globalAlpha=.5;for(let i=0;i<50;i++){const y=H-((i*61+t*(30+i%5*12))%(H+20)),ax=(i*89+Math.sin(t+i)*20+W)%W;x.fillRect(ax,y,3,3)}}
 else if(k=='hex'){x.lineWidth=2;const s=46,P=[[],[],[],[]];for(let r=0;r<H/s+2;r++)for(let c=0;c<W/(s*1.75)+2;c++){const cx=c*s*1.75+(r%2)*s*.87,cy=r*s*1.5,a=.1+.25*Math.max(0,Math.sin(t*1.5-(c+r)*.5));P[Math.min(3,Math.round((a-.1)/.25*3))].push(cx,cy)}
  for(let b=0;b<4;b++){x.globalAlpha=.1+.25*b/3;x.beginPath();const q=P[b];for(let m=0;m<q.length;m+=2){for(let v=0;v<6;v++){const a=Math.PI/3*v+.52,hx2=q[m]+Math.cos(a)*s*.9,hy2=q[m+1]+Math.sin(a)*s*.9;v?x.lineTo(hx2,hy2):x.moveTo(hx2,hy2)}x.closePath()}x.stroke()}}
 else if(k=='aurora'){for(let j=0;j<3;j++){const gg=x.createLinearGradient(0,0,0,H*.7);gg.addColorStop(0,'transparent');gg.addColorStop(.5,j%2?th[4]:th[3]);gg.addColorStop(1,'transparent');x.globalAlpha=.16;x.fillStyle=gg;x.beginPath();x.moveTo(0,0);for(let ax=0;ax<=W;ax+=20)x.lineTo(ax,H*.25+Math.sin(ax*.006+t*.5+j*2)*H*.15+j*30);x.lineTo(W,H*.7);x.lineTo(0,H*.7);x.fill()}}
 else if(k=='hell'){x.lineWidth=3;const R0=Math.min(W,H)*.38,rot=t*.12;x.globalAlpha=.15+.35*pl;x.beginPath();x.arc(W/2,H/2,R0,0,7);x.stroke();x.beginPath();for(let q=0;q<6;q++){const a=rot+q*4*Math.PI/5-Math.PI/2,ax=W/2+Math.cos(a)*R0,ay=H/2+Math.sin(a)*R0;q?x.lineTo(ax,ay):x.moveTo(ax,ay)}x.stroke();x.globalAlpha=.3;for(let i=0;i<40;i++){x.fillRect((i*113)%W,(i*67+t*60*(1+i%4*.4))%(H+20),2,8)}x.globalAlpha=.12;for(let i=0;i<6;i++){x.fillRect(0,(Math.sin(t*3+i*9)*.5+.5)*H,W,3+i*2)}}
 else{x.lineWidth=2;for(let i=0;i<24;i++){const a=i/24*6.283+t*.15;x.globalAlpha=.12+.25*pl;x.beginPath();x.moveTo(W/2+Math.cos(a)*60,H/2+Math.sin(a)*60);x.lineTo(W/2+Math.cos(a)*Math.max(W,H),H/2+Math.sin(a)*Math.max(W,H));x.stroke()}}
 x.globalAlpha=.1*pl;x.fillStyle=th[3];x.fillRect(0,0,W,H);x.globalAlpha=1}
const thOf=i=>i==SEC?10:i<100?((i-A1)/5|0):11+(((i-100)/5)|0);
const DN=['Easy','Medium','Hard','Extreme','Impossible'],DW=[1.6,1.3,1,.75,.55],DS=[.5,.75,1,1.5,2.5],SL=[.5,.6,.7,.8,.9,1,1.1,1.25,1.5,1.75,2];
const TITLES=[[0,'Rookie'],[5e3,'Tapper'],[25e3,'Metronome'],[7e4,'Virtuoso'],[13e4,'Maestro'],[2e5,'Legend'],[3.2e5,'Mythic'],[5e5,'Transcendent'],[8e5,'Ascendant'],[12e5,'Eternal']];
let save={unlocked:1,best:{},runs:[],off:0,diff:2,slow:5,free:false,pr:false,endBest:0,st:{},mods:{},custom:[],ach:{}};
try{Object.assign(save,JSON.parse(localStorage.getItem('onetap2')||'{}'))}catch(e){}
save.st=Object.assign({snd:1,vol:.5,hot:'',ring:'',theme:'auto',fx:1,ar:1,tt:1},save.st);
save.mods=Object.assign({fc:0,ap:0,fr:0,tw:0,hd:0,mr:0,nf:0},save.mods);if(!Array.isArray(save.custom))save.custom=[];if(!save.ach||typeof save.ach!=='object'||Array.isArray(save.ach))save.ach={};
const persist=()=>{save.ts=Date.now();try{localStorage.setItem('onetap2',JSON.stringify(save))}catch(e){}syncDirty()};
if(!save.v||save.v<3){ // levels were re-ordered (100 campaign levels now): move old saves to the new positions
 if(save.best[29]&&save.unlocked<31)save.unlocked=31;
 const mp=o=>{const j=L.findIndex(l=>l[6]===o);return j<0?0:j},nb2={};
 for(const k in save.best)nb2[mp(+k)]=save.best[k];save.best=nb2;save.runs.forEach(r=>r.l=mp(r.l));
 save.unlocked=Math.min(NL,mp(Math.max(0,Math.min(save.unlocked,60)-1))+1);save.v=3;persist()}
if(save.v<4){if(save.best[100]){save.best[200]=save.best[100];delete save.best[100]}save.runs.forEach(r=>{if(r.l===100)r.l=200});save.v=4;persist()}
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const BEATS=44;
function gen(i){if(i==CUS)return genCustom();const BEATS=nB(i),[si,,subs,p,f]=L[i],sd=S[si],r=rng(i==END?ES:L[i][6]*977+13),out=[];let pn=7;
 for(let b=0;b<BEATS;b++){const d=subs[Math.floor(r()*subs.length)];
  for(let k=0;k<d;k++){const bt=b+k/d;if(r()<(k==0?(b%4==0||L[i][6]<3?1:.85):p)&&(!out.length||bt-out[out.length-1].b>=.24)){
   pn=Math.max(0,Math.min(13,pn+Math.floor(r()*5)-2));
   if(k==0&&b%2==0){const dg=sd[3][Math.floor(b/4)%4];for(const o of[0,1,-1,2,-2]){const q=pn+o;if(q>=0&&q<=13&&[0,2,4].includes((((q-dg)%7)+7)%7)){pn=q;break}}}
   out.push({b:bt,n:pn,len:0,dbl:0,decoy:0,hit:0})}}}
 const real=out.slice();
 real.forEach((o,j)=>{const gap=(real[j+1]?real[j+1].b:BEATS+1)-o.b;
  if(f.h&&gap>=1&&r()<f.h)o.len=Math.min(2,Math.floor((gap-.5)*4)/4);else if(f.li&&gap>=1.25&&r()<f.li){o.len=Math.min(2,Math.floor((gap-.5)*4)/4);o.lift=1}else if(f.ro&&gap>=1.25&&r()<f.ro){o.len=Math.min(2,Math.floor((gap-.5)*4)/4);o.roll=1;o.need=Math.max(3,Math.round(o.len*3))}else if(f.tr&&gap>=(L[i][1]>140?2:1)&&r()<f.tr)o.dbl=2;else if(f.x&&gap>=1&&r()<f.x)o.dbl=1;else if(f.wp&&r()<f.wp)o.warp=1;else if(f.ph&&r()<f.ph)o.ph=1;else if(f.rb&&r()<f.rb)o.rb=.75;else if(f.sg&&r()<f.sg)o.sg=1;
  if(f.sc&&r()<f.sc)o.sx=r()<.5?-1:1;
  const g=gap-o.len;if(f.d&&g>=1.5&&r()<f.d)out.push({b:o.b+o.len+g/2,n:0,len:0,dbl:0,decoy:1,hit:0})});
 let res=out.sort((a,b)=>a.b-b.b);
 if(i==END){const r2=rng(ES+5);res=res.filter(o=>{const q=Math.min(1,o.b/300);if(o.decoy)return o.b>150;if(o.b%1&&r2()>.35+.65*q)return false;if(o.b<40)o.len=0;if(o.b<90)o.dbl=0;return true})}
 return res}
let ac,nb,master,state='menu',lv=0,notes=[],t0=0,hp=100,combo=0,maxc=0,st,fb=null,gw=.1,gw0=.1,SH=false,sx=0,pw=.04,raf,segs,segT,rate=1,F={},pts=0,hn=null,endT=0,cols={},PS=0,ES=1,mo={},SMUL=1,brk=0,why='',LV=0,CL=null,CAB=null,csrc=null,EDI=null,delArm=-1;
const tm=B=>{let k=segs.length-1;while(k>0&&segs[k][0]>B)k--;return segT[k]+(B-segs[k][0])*60/(segs[k][1]*rate)};
const bt=t=>{let k=segs.length-1;while(k>0&&segT[k]>t)k--;return segs[k][0]+(t-segT[k])*segs[k][1]*rate/60};
const curBpm=B=>{let k=segs.length-1;while(k>0&&segs[k][0]>B)k--;return segs[k][1]*rate};
let AN=[];
const track=n=>{n.onended=()=>{n._d=1};AN.push(n);if(AN.length>4000)AN=AN.filter(a=>!a._d)};
function killAudio(){for(const n of AN){if(n._d)continue;try{n.stop()}catch(e){}try{n.disconnect()}catch(e){}}AN=[];if(master){try{master.disconnect()}catch(e){}}}
function fadeKill(){const m=master;setTimeout(()=>{if(master===m)killAudio()},400)}
function tone(f,t,d,type,v,f2){const o=ac.createOscillator(),g=ac.createGain();track(o);o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
 g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+.02)}
function noise(t,d,v,fr){const s=ac.createBufferSource(),fl=ac.createBiquadFilter(),g=ac.createGain();track(s);s.buffer=nb;fl.type='highpass';fl.frequency.value=fr;
 g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(fl);fl.connect(g);g.connect(master);s.start(t);s.stop(t+d+.02)}
const hs=T=>{const k=save.st.snd;if(k==1)tone(1100,T,.06,'triangle',.3);else if(k==2)tone(700,T,.08,'sine',.6,260);else if(k==3){noise(T,.04,.35,3000);tone(2200,T,.03,'square',.08)}};
const pvw=()=>{ac=ac||new (window.AudioContext||window.webkitAudioContext)();ac.resume();if(!nb){nb=ac.createBuffer(1,ac.sampleRate>>1,ac.sampleRate);const d=nb.getChannelData(0);for(let k=0;k<d.length;k++)d[k]=Math.random()*2-1}const g=ac.createGain();g.gain.value=save.st.vol;g.connect(ac.destination);const m=master;master=g;hs(ac.currentTime);master=m};
const applyTheme=()=>{const e=document.documentElement;save.st.theme=='auto'?e.removeAttribute('data-theme'):e.setAttribute('data-theme',save.st.theme)};
const seg=(a,o,c)=>o.map((n,i)=>`<button data-a="${a}" data-v="${i}" class="${i===c?'sel':''}">${n}</button>`).join('');
const total=()=>Object.values(save.best).reduce((a,b)=>a+b.s,0);
const title=()=>{const t=total();return TITLES.filter(a=>t>=a[0]).pop()[1]};
const CP=['#e0245e','#ff3d81','#ff9f1a','#ffd24a','#7be04f','#3de0ff','#a66bff','#ffffff'];
const sw=(a,c)=>`<button data-a="${a}" data-v="-1" class="${c?'':'sel'}">Auto</button>`+CP.map((k,i)=>`<button data-a="${a}" data-v="${i}" title="${k}" style="background:${k};width:34px;height:34px;padding:0;border-radius:50%;border-color:${c===k?'var(--fg)':'transparent'}"></button>`).join('');
function settings(){state='menu';ui.innerHTML=`<div class="p"><h1 style="font-size:28px">Settings</h1>
 <h2>Hit sound</h2><div class="row">${seg('snd',['Off','Tick','Pop','Snap'],save.st.snd)}</div>
 <label>Volume: <b id="vv">${Math.round(save.st.vol*100)}</b>%<br><input id="vol" type="range" min="0" max="100" value="${save.st.vol*100}"></label>
 <h2>Note color</h2><div class="row">${sw('hot',save.st.hot)}</div>
 <h2>Ring color</h2><div class="row">${sw('ring',save.st.ring)}</div>
 <h2>Theme</h2><div class="row">${seg('theme',['Auto','Light','Dark'],['auto','light','dark'].indexOf(save.st.theme))}</div>
 <h2>Background effects</h2><div class="row">${seg('fx',['Off','On'],save.st.fx?1:0)}</div>
 <h2>Approach rings</h2><div class="row">${seg('ar',['Off','On'],save.st.ar?1:0)}</div>
 <h2>Tempo change text</h2><div class="row">${seg('tt',['Off','On'],save.st.tt?1:0)}</div><p class="hint">Off hides the big TEMPO UP / DOWN text at the top. The small marker on the track stays.</p>
 <div class="row" style="margin-top:14px"><button data-a="test">Test sound</button><button class="main" data-a="menu">Done</button></div></div>`;
 $('#vol').oninput=e=>{save.st.vol=e.target.value/100;$('#vv').textContent=e.target.value;persist()}}
function prac(v){const B=nB(v);ui.innerHTML=`<div class="p"><h1 style="font-size:26px">Practice</h1><p>Level ${v+1}: ${L[v][5]}. Choose where to start. Health can’t run out in practice.</p><label>Start at beat <b id="pv">0</b> of ${B}<br><input id="pb" type="range" min="0" max="${B-8}" step="2" value="0"></label><div class="row" style="margin-top:14px"><button class="main" data-a="pgo" data-v="${v}">Start</button><button data-a="menu">Back</button></div></div>`;$('#pb').oninput=e=>$('#pv').textContent=e.target.value}
const ms={u:0,s:0,l:0},keep=()=>{const s=$('.side'),l=$('.list');if(s&&l){ms.s=s.scrollTop;ms.l=l.scrollTop;ms.u=ui.scrollTop}};
function menu(){keep();if(ED&&ED.play)edStop(true);cancelAnimationFrame(edRaf);stopCA();EDI=null;state='menu';ui.style.touchAction='';cancelAnimationFrame(raf);if(master)master.gain.value=0;killAudio();x.clearRect(0,0,W,H);
 const cd=i=>{const l=L[i],b=save.best[i],lock=!save.free&&i>=save.unlocked&&!(i==SEC&&save.sec),tr=tier(i),th=i>=A1&&i<NL?' style="border-left-color:'+TH[thOf(i)][3]+'"':i==SEC?' style="border-left-color:#ff1a1a"':'';return `<button class="card" data-a="lv" data-v="${i}"${lock?' disabled':''}${th}><b>${i+1}</b><span>${l[5]}<i>${S[l[0]][0]} · ${l[1]} BPM · ${mech(l[4])}${b?' · best '+b.s.toLocaleString()+(b.f?' · FC':''):''}</i></span><u style="background:${tr.c}">★${tr.s.toFixed(1)}</u>${b?`<em${b.g.length>1?' class="g'+b.g.length+'"':''}>${b.g}</em>`:''}</button>`},rg=(a,b)=>{let o='';for(let i=a;i<b;i++)o+=cd(i);return o};
 const am=MODS.filter(m=>save.mods[m[0]]),sl=SL[save.slow];
 ui.innerHTML=`<div class="wrap"><div class="side"><h1>One Tap</h1><p>Tap each note as it crosses the ring. ${title()} · ${Math.round(total()).toLocaleString()} pts</p>
 ${acctHTML()}
 <div class="row">${seg('free',['Campaign','Freeplay'],save.free?1:0)}</div>
 <h2>Timing difficulty</h2><div class="row">${seg('diff',DN,save.diff)}</div>
 <h2>Speed ${sl<1?'(unranked)':sl>1?'(bonus score)':''}</h2><div class="row">${seg('slow',SL.map(s=>Math.round(s*100)+'%'),save.slow)}</div>
 <h2>Modifiers · score ×${mulOf(save.mods,sl).toFixed(2)}</h2><div class="row">${MODS.map(m=>`<button data-a="mod" data-k="${m[0]}" title="${m[2]}" class="${save.mods[m[0]]?'sel':''}">${m[1]}</button>`).join('')}</div>
 <p>${am.length?am.map(m=>'<b>'+m[1]+'</b>: '+m[2]).join('<br>'):'Optional rules that give bonus score. Faster speeds count too.'}</p>
 <h2>Showcase first</h2><div class="row">${seg('sc',['Off','On'],save.sc?1:0)}</div>
 <h2>Practice (pick a start point)</h2><div class="row">${seg('pr',['Off','On'],save.pr?1:0)}</div>
 <div class="row" style="margin-top:14px"><button class="main" data-a="endless">Endless${save.endBest?' · best '+save.endBest:''}</button><button data-a="rank">Rankings</button><button data-a="set">Settings</button><button data-a="cnew">Level editor</button><button data-a="ach">Achievements ${ACH.filter(a=>save.ach[a[0]]).length}/${ACH.length}</button></div>
 <label>Audio offset: <b id="ov">${save.off}</b> ms<br><input id="off" type="range" min="-200" max="200" step="5" value="${save.off}"></label>
 <p>Tap with Space, any key, mouse or touch. You can press a new input while another is held, so every key, mouse button and finger counts on its own. R retries, Esc returns here.</p></div>
 <div class="list"><h2>Area 1 · ${A1} levels</h2>${rg(0,A1)}<h2>Area 2: Afterglow · 50 levels</h2>${rg(A1,100)}<h2>Area 3: Dreamstate · 50 levels</h2>${rg(100,150)}<h2>Area 4: Zenith · 50 levels</h2>${rg(150,NL)}${save.sec?'<h2 style="color:#ff1a1a">Something is waiting</h2>'+cd(SEC):''}<h2>Custom levels · ${save.custom.length}</h2>${save.custom.map(ccd).join('')||'<p>Nothing here yet. Open the level editor to chart your own, or import a .otm level someone sent you.</p>'}<div class="row" style="margin:8px 0"><button class="main" data-a="cnew">+ New level</button><button data-a="cimp">Import level…</button></div><p class="hint">Share a level with the Share button. It saves a small .otm file. Import one here or drop it anywhere on this screen.</p></div></div>`;
 const s2=$('.side'),l2=$('.list');if(s2&&l2){s2.scrollTop=ms.s;l2.scrollTop=ms.l;ui.scrollTop=ms.u}
 $('#off').oninput=e=>{save.off=+e.target.value;$('#ov').textContent=save.off;persist()}}
function rankings(){state='menu';const runs=save.runs.map((r,i)=>`<tr><td>${i+1}</td><td>Lv ${r.l+1} ${L[r.l][5]}</td><td>${DN[r.d]}${r.m?' · '+r.m:''}</td><td>${r.s.toLocaleString()}</td><td>${r.a}% ${r.g}</td></tr>`).join('')||'<tr><td colspan=5>No ranked runs yet. Clear a level at full speed.</td></tr>';
 ui.innerHTML=`<div class="p"><h1>${title()}</h1><p>Total score ${Math.round(total()).toLocaleString()}. Next title at ${(TITLES.find(a=>a[0]>total())||[0,'max'])[0].toLocaleString()||''}. Scores are multiplied by timing difficulty (Easy ×0.5 up to Impossible ×2.5), plus bonuses for faster speeds and modifiers.<br>Grades: S is 97%+ accuracy. SS needs a full combo at 97%+. SSS needs every note Perfect. Practice runs don’t count.</p>
 <table><tr><th>#</th><th>Level</th><th>Mode</th><th>Score</th><th>Acc</th></tr>${runs}</table><div class="row"><button data-a="menu">Back</button></div></div>`}
function start(i,show,from){if(i==END){ES=Date.now()&0xfffffff;L[END]=[[0,1,2,3,4,5,6,7,8,9,11,12,13,14][Math.floor(Math.random()*14)],100,[1,2,2,4],.55,{h:.2,x:.15,d:.25,t:Array.from({length:24},(_,k)=>[16*(k+1),Math.min(220,105+k*5)])},'Endless']}
 SH=!!show;ac=ac||new (window.AudioContext||window.webkitAudioContext)();ac.resume();
 if(!nb){nb=ac.createBuffer(1,ac.sampleRate>>1,ac.sampleRate);const d=nb.getChannelData(0);for(let k=0;k<d.length;k++)d[k]=Math.random()*2-1}
 if(master)master.gain.value=0;killAudio();
 lv=i;LV=i==CUS?40:i==END?60:i==SEC?100:Math.min(i,100);const CA=i==CUS&&!!CAB,[si,bpm,,,f]=L[i];F=f;PS=from||0;const Bs=PS>0?PS+2:0;rate=SL[save.slow];mo=Object.assign({},save.mods,i==CUS?CL.mods:{});SMUL=DS[save.diff]*mulOf(mo,rate);
 gw=Math.max(.02,(i==END?90:i==CUS?75:i==SEC?30:i<A1?125-i*1.4:(i>=150?42:i>=100?46:Math.max(48,95-(i-A1)*.95)))*DW[save.diff]*(mo.tw?.7:1)/1000);pw=gw*.4;gw0=gw;
 segs=[[0,bpm]];(f.t||[]).forEach(a=>segs.push([a[0]+4,a[1]]));segT=[0];
 for(let k=1;k<segs.length;k++)segT[k]=segT[k-1]+(segs[k][0]-segs[k-1][0])*60/(segs[k-1][1]*rate);
 notes=gen(i);notes.forEach(o=>{o.B=o.b+4;o.t=tm(o.B);if(o.len)o.e=tm(o.B+o.len);if(o.roll)o.need=Math.max(2,Math.min(o.need,Math.floor((o.e-o.t)*5)))});if(Bs)notes.forEach(o=>{if(o.B<Bs+2)o.hit=1});
 TP=segs.slice(1).map((a,k)=>({B:a[0],up:a[1]>segs[k][1],bpm:a[1]}));
 BN=[['rb','REBOUND: tap when it comes back','#ffd24a'],['sg','STUTTER: it pauses mid-flight, then keeps going','#7be04f'],['sx','SCATTER: notes can come from either side',0]].map(([k,t,c])=>{const o=notes.find(n=>n[k]&&n.B>=Bs+2);return o&&{B:o.B,t,c}}).filter(Boolean);
 endT=Math.max(...notes.map(o=>o.e||o.t))+.8;
 master=ac.createGain();master.gain.value=save.st.vol;master.connect(ac.destination);t0=ac.currentTime+.6-tm(Bs);stopCA();
 if(CA){const src=ac.createBufferSource();src.buffer=CAB;src.playbackRate.value=rate;src.connect(master);const s0=t0+tm(4)-CL.off/rate,wh=Math.max(ac.currentTime+.02,s0);src.start(wh,Math.max(0,(wh-s0)*rate));csrc=src}
 const sd=S[si],sc=n=>sd[2][((n%7)+7)%7]+12*Math.floor(n/7),mf=m=>440*2**((m-69)/12),ds=sd[5];
 for(let B=Bs;B<(i==END?404:nB(i)+8);B++){const t=t0+tm(B),h=tm(B+1)-tm(B);
  if(B<4||B<Bs+2){tone(1200,t,.05,'square',.15);continue}
  if(SH)tone(500,t,.025,'sine',.1);if(CA)continue;
  const k=B-4,dg=sd[3][Math.floor(k/4)%4];
  if(ds==0||ds==3||(ds==1&&k%2==0)||(ds==2&&k%4==0))tone(150,t,.16,'sine',.8,45);
  if((ds==2&&k%4==2)||ds==3)tone(150,t+h/2,.14,'sine',.7,45);
  if(k%2==1)noise(t,.12,.22,1500);noise(t+h/2,.03,.06,7000);if(ds==2)noise(t,.03,.05,7000);
  tone(mf(sd[1]-12+sc(dg)),t,h*.85,'triangle',.35);if(ds)tone(mf(sd[1]-12+sc(dg)),t+h/2,h*.4,'triangle',.25);
  if(i==SEC){if(k%2==0)tone(mf(sd[1]-12+sc(dg)+6),t,h*1.8,'sawtooth',.1);if(k%8==0)tone(mf(sd[1]+24),t,h*6,'sine',.18)}
  if(k%4==0){const d2=tm(B+4)-t0*0-tm(B);[0,2,4].forEach(q=>tone(mf(sd[1]+sc(dg+q)),t,d2,'sine',.07))}}
 const clk=(t,v)=>tone(1900,t,.04,'square',.22*v);notes.forEach(o=>{if(o.decoy||o.B<Bs+2)return;const fq=mf(sd[1]+12+sc(o.n)),t=t0+o.t;if(SH){clk(t,1);if(o.roll)for(let q=1;q<o.need;q++)clk(t+(o.e-o.t)*q/(o.need-1),.6);else if(o.len)clk(t0+o.e,.4);for(let q=1;q<=(o.dbl||0);q++)clk(t+.11*q,.8)}if(!CA){tone(fq,t,o.len?o.e-o.t:.18,sd[4],.15);for(let q=1;q<=(o.dbl||0);q++)tone(fq,t+.1*q,.1,sd[4],.12)}});
 const cs=getComputedStyle(document.documentElement);['bg','fg','hot','ring','ok','mut'].forEach(k=>cols[k]=cs.getPropertyValue('--'+k).trim());
 if(i>=A1&&i<END){const th=TH[thOf(i)];Object.assign(cols,{bg:th[1],fg:'#ffffff',ring:th[3],hot:th[4],ok:'#8dffc0',mut:'#c8c0e8'})}
 if(save.st.hot)cols.hot=save.st.hot;if(save.st.ring)cols.ring=save.st.ring;hp=100;combo=0;maxc=0;pts=0;hn=null;brk=0;why='';st={P:0,G:0,M:0,S:0};fb=null;HC={};state='play';ui.innerHTML='';ui.style.touchAction='none';
 cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
const now=()=>ac.currentTime-t0-save.off/1000;
const say=(t,c)=>{fb={t,c,at:performance.now()}};
const hurt=a=>{brk++;hp=Math.max((PS||mo.nf)?1:0,hp-a*.6*(mo.fr?2:1));combo=0;gw=gw0;if(mo.fc||mo.ap){hp=0;why='Combo broken'}};
function award(o,bd,n){const per=bd<=pw;o.j=per?'P':'G';st[o.j]++;combo++;maxc=Math.max(maxc,combo);hp=Math.min(100,hp+(mo.fr?0:per?2.5:1));if(mo.ap&&!per){hp=0;why='Not a Perfect hit'}if(F.q){gw=gw0*(1-Math.min(combo,40)*.006);pw=gw*.4}
 pts+=(per?100:60)*(1+Math.min(combo,50)/100)*SMUL;say(per?'Perfect':(n<o.t?'Early':'Late'),per?cols.ok:cols.ring)}
function fail(o,t,a,undo){if(undo)st[o.j]--;o.hit=-1;st.M++;hurt(a);say(t,cols.hot);tone(100,ac.currentTime,.15,'sawtooth',.25,50)}
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
function loop(){if(state!=='play')return;const n=now();
 for(const o of notes){if(SH){if(o.hit===0&&n>=o.t)o.hit=o.decoy?-2:o.len?2:1;else if(o.hit===2&&n>=o.e)o.hit=1;continue}
  if(o.roll){if(o.hit===0&&n>o.e)fail(o,'Roll too short',8+LV*.5);continue}
  if(o.hit===0&&n-o.t>gw){if(o.decoy)o.hit=-2;else fail(o,'Miss',8+LV*.5)}
  else if(o.hit===3&&n>o.dl)fail(o,'Missed 2nd tap',8+LV*.5,1)}
 if(hn&&!hn.lift&&n>=hn.e){hn.hit=1;pts+=30*SMUL;say('Hold!',cols.ok);hn=null}
 if(hn&&hn.lift&&n>hn.e+gw){fail(hn,'Held too long',8+LV*.5,1);hn=null}
 draw(n);if(hp<=0)return end(false);if(n>endT)return end(true);raf=requestAnimationFrame(loop)}
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
 const bw=Math.min(340,W-40),hk=Math.round(bpm);if(HC.k!==hk){HC.k=hk;HC.a=`${lv==END?'':lv==CUS?'Custom: ':'Level '+(lv+1)+': '}${L[lv][5]}${lv==END?'':'  ·  '+(lv==CUS?'Custom':'★'+tier(lv).s.toFixed(1))}  ·  ${lv==CUS?(CL.audioName||'Built-in backing'):S[L[lv][0]][0]}  ·  ${hk} BPM`;HC.b=(SH?'Showcase: music + click pattern  ·  ':'')+mech(F)+(rate!=1?`  ·  ${Math.round(rate*100)}% speed${rate<1?', unranked':''}`:'')+mnames()}x.fillStyle='#000';x.globalAlpha=.35;x.fillRect(16,14,bw+8,18);x.globalAlpha=1;x.fillStyle=hp>35?ring:hot;x.fillRect(20,18,bw*hp/100,10);
 x.font='700 15px Space Grotesk,system-ui';x.textAlign='left';x.fillStyle=fg;x.fillText(HC.a,20,56);
 x.globalAlpha=.7;x.fillText(HC.b,20,76);x.globalAlpha=1;
 x.textAlign='right';x.font='700 38px Space Grotesk,system-ui';x.fillText(String(Math.round(pts)).padStart(8,'0'),W-20,44);x.font='700 16px Space Grotesk,system-ui';const tt=st.P+st.G+st.M;x.globalAlpha=.8;x.fillText((tt?((st.P+.7*st.G)/tt*100).toFixed(2):'100.00')+'%',W-20,68);x.globalAlpha=1;
 x.textAlign='left';x.font='italic 700 58px Space Grotesk,system-ui';x.fillStyle=combo?hot:fg;x.globalAlpha=combo?1:.3;x.fillText(combo+'x',20,H-26);x.globalAlpha=1;
 x.fillStyle=fg;x.globalAlpha=.15;x.fillRect(0,H-6,W,6);x.globalAlpha=.7;x.fillRect(0,H-6,W*Math.max(0,Math.min(1,n/endT)),6);x.globalAlpha=1;
 {let by=Math.max(100,cy-195);x.textAlign='center';
  for(const k of save.st.tt?TP:[]){const d=k.B-cb;if(d>0&&d<4){x.globalAlpha=Math.min(1,(4-d)*3,d*3)*(.65+.35*pulse);x.fillStyle=k.up?hot:cols.ok;x.font='700 24px Space Grotesk,system-ui';x.fillText(`TEMPO ${k.up?'UP ▲':'DOWN ▼'}  ${Math.round(k.bpm*rate)} BPM`,W/2,by);by+=30}}
  for(const b of BN){const d=b.B-cb;if(d>1&&d<5.5){x.globalAlpha=Math.min(1,(5.5-d)*3,(d-1)*3);x.fillStyle=b.c||ring;x.font='700 18px Space Grotesk,system-ui';x.fillText(b.t,W/2,by);by+=26}}x.globalAlpha=1}
 if(fb){const a=1-(performance.now()-fb.at)/500;if(a>0){x.globalAlpha=a;x.fillStyle=fb.c;x.font='700 28px Space Grotesk,system-ui';x.textAlign='center';x.fillText(fb.t,hx,cy+90);x.globalAlpha=1}}}
function end(win){ui.style.touchAction='';if(SH){state='end';master.gain.setTargetAtTime(0,ac.currentTime,.05);fadeKill();ui.innerHTML=`<div class="p"><h1 style="font-size:26px">Showcase done</h1><p>${lv==CUS?'Custom':'Level '+(lv+1)}: ${esc(L[lv][5])}. Ticks are beats and clicks are notes. Rolls click fast, holds click twice, decoys stay silent.</p><div class="row"><button class="main" data-a="playit">Play it</button><button data-a="replay">Replay showcase</button><button data-a="menu">Levels</button></div></div>`;return}
 if(lv==END){state='end';master.gain.setTargetAtTime(0,ac.currentTime,.05);fadeKill();const bs=Math.max(0,Math.floor(bt(now())-4)),old=save.endBest,nb=rate>=1&&bs>old;if(nb)save.endBest=bs;persist();checkAch({endless:1,maxc,rate,mo,diff:save.diff,pr:!!PS});
  ui.innerHTML=`<div class="p"><p class="big" style="color:var(--hot)">${bs}</p><h1 style="font-size:24px">beats survived</h1>${nb?'<div class="nb">★ NEW BEST ★'+(old?'<br>Previous best: '+old:'')+'</div>':''}<p>${Math.round(pts).toLocaleString()} pts · best ${save.endBest} beats${rate>=1?'':' (slowed, not ranked)'}</p><div class="row"><button class="main" data-a="retry">Again</button><button data-a="menu">Menu</button></div></div>`;return}
 state='end';master.gain.setTargetAtTime(0,ac.currentTime,.05);fadeKill();
 const tot=notes.filter(o=>!o.decoy).length,acc=Math.round((st.P+.7*st.G)/tot*100),pc=win&&brk==0,g=pc&&st.G==0&&acc>=97?'SSS':pc&&acc>=97?'SS':gAcc(acc),sc=Math.round(pts),ranked=rate>=1,ml=modLabel();
 let nbm=[];
 if(win&&lv!=CUS){if(lv==NL-1)save.sec=1;save.unlocked=Math.max(save.unlocked,Math.min(NL,lv+2));
  if(ranked&&!PS){const b=save.best[lv],nw={s:Math.max(b?b.s:0,sc),a:Math.max(b?b.a:0,acc),c:Math.max(b&&b.c||0,maxc),d:b&&b.s>=sc?b.d:save.diff,m:b&&b.s>=sc?b.m||'':ml,f:(b&&b.f)||(brk==0?1:0)};nw.g=GR[Math.max(GR.indexOf(gAcc(nw.a)),GR.indexOf(b&&b.g||'D'),GR.indexOf(g))];if(GR.indexOf(g)>=5&&GR.indexOf(g)>GR.indexOf(b&&b.g||'D'))nbm.push('New rank: '+g);
   if(!b)nbm.push('First clear!');else{if(sc>b.s)nbm.push('Score +'+(sc-b.s).toLocaleString());if(acc>b.a)nbm.push('Accuracy '+b.a+'% → '+acc+'%');if(b.c&&maxc>b.c)nbm.push('Combo '+b.c+' → '+maxc)}
   save.best[lv]=nw;save.runs.push({l:lv,d:save.diff,s:sc,a:acc,g,m:ml});save.runs.sort((p,q)=>q.s-p.s);save.runs=save.runs.slice(0,10)}persist()}
 checkAch({win,lv,g,acc,maxc,rate,diff:save.diff,mo:Object.assign({},mo),pr:!!PS,ranked,custom:lv==CUS});
 ui.innerHTML=`<div class="p"><p class="big${win&&g.length>1?' g'+g.length:''}" style="color:${win?'var(--ok)':'var(--hot)'}">${win?g:'Failed'}</p>
 <h1 style="font-size:24px">${win?(lv==CUS?'Custom level':'Level '+(lv+1))+' cleared':(why||'Health ran out')}</h1>${nbm.length?'<div class="nb">★ NEW BEST ★<br>'+nbm.join(' · ')+'</div>':''}
 <p>${sc.toLocaleString()} pts on ${DN[save.diff]}${ml?' + '+ml:''}${PS?' (practice, not ranked)':ranked?'':' (slowed, not ranked)'}<br>${st.P} perfect, ${st.G} good, ${st.M} missed, ${st.S} stray taps · ${acc}% · best combo ${maxc}</p>
 <div class="row"><button class="main" data-a="retry">Retry</button>${win&&lv<NL-1?'<button data-a="next">Next level</button>':''}${lv==CUS&&EDI!=null?'<button data-a="e_back">Back to editor</button>':''}<button data-a="replay">Showcase</button><button data-a="menu">Levels</button><button data-a="rank">Rankings</button></div></div>`}
ui.onclick=e=>{const b=e.target.closest('button');if(!b)return;b.blur();keep();const a=b.dataset.a,v=+b.dataset.v;
 if(a&&a.startsWith('e_'))edAct(a,b);else if(a=='ach')achScreen();else if(a=='cimp')importPick();else if(a=='cshr')shareLevel(v);else if(a=='na_pick')naPick();else if(a=='na_bk'){const n=NA;NA=null;if(n)playCustom(n.i,n.show,n.from,n.fromEd,1)}else if(a=='cnew')editor(-1);else if(a=='ced')editor(v);else if(a=='clv')playCustom(v,save.sc);else if(a=='cdel')cdel(v);else if(a=='lv'){if(save.pr)prac(v);else start(v,save.sc)}else if(a=='set')settings();else if(a=='test')pvw();else if(a=='snd'){save.st.snd=v;persist();settings();pvw()}else if(a=='hot'||a=='ring'){save.st[a]=v<0?'':CP[v];persist();settings()}else if(a=='theme'){save.st.theme=['auto','light','dark'][v];persist();applyTheme();settings()}else if(a=='fx'){save.st.fx=v;persist();settings()}else if(a=='ar'){save.st.ar=v;persist();settings()}else if(a=='tt'){save.st.tt=v;persist();settings()}else if(a=='pr'){save.pr=!!v;persist();menu()}else if(a=='endless')start(END);else if(a=='pgo')start(v,save.sc,+$('#pb').value);else if(a=='sc'){save.sc=!!v;persist();menu()}else if(a=='playit')start(lv,false,PS);else if(a=='replay')start(lv,true,PS);else if(a=='diff'){save.diff=v;persist();menu()}else if(a=='slow'){save.slow=v;persist();menu()}else if(a=='free'){save.free=!!v;persist();menu()}
 else if(a=='mod'){{const k=b.dataset.k,M=save.mods;M[k]=M[k]?0:1;if(M[k]){if(k=='nf'){M.fc=0;M.ap=0}else if(k=='fc'||k=='ap')M.nf=0}persist();menu()}}else if(a=='rank')rankings();else if(a=='menu')menu();else if(a=='retry')start(lv,false,PS);else if(a=='next')start(lv+1);else if(a=='acct')acctScreen();else if(a=='a_login')doAuth(false);else if(a=='a_reg')doAuth(true);else if(a=='a_out')logout();else if(a=='a_reset')doReset();else if(a=='sync')syncNow();else if(a=='p_resume')resumeGame();else if(a=='p_retry')pauseRetry();else if(a=='p_quit')pauseQuit()};
// Input: every key, mouse button and finger is tracked on its own, so a new input counts while another is still held.
const dn=new Set();let lastT=0;
const inUp=id=>{if(dn.delete(id))release(id)},inDown=id=>{if(state!=='play')return;if(dn.has(id))inUp(id);dn.add(id);tap(id)},inClear=()=>[...dn].forEach(inUp);
addEventListener('keydown',e=>{if(e.repeat)return;if(state==='edit'&&e.key!=='Escape'){edKey(e);return}if(state==='menu'&&!(e.target&&e.target.tagName==='INPUT')){sx=e.key==='6'?sx+1:0;if(sx>=3&&!save.sec){save.sec=1;persist();menu()}}
 if(e.key==='Escape'){if(state==='play')pauseGame();else if(state==='pause')resumeGame();else if(state==='resuming'){clearTimeout(PT);state='pause';showPause()}else if(state==='edit')edExit();else if(state!=='menu'){if(lv==CUS&&EDI!=null)editor(EDI,true);else menu()}return}
 if(e.key==='r'||e.key==='R'){if(state==='pause')pauseRetry();else if(state==='play'||state==='end')start(lv,SH,PS);return}if(state==='play'){e.preventDefault();inDown(e.code||e.key)}});
addEventListener('keyup',e=>inUp(e.code||e.key));
addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||state!=='play')return;e.preventDefault();lastT=performance.now();inDown('p'+e.pointerId)});
addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')inUp('p'+e.pointerId)});addEventListener('pointercancel',e=>{if(e.pointerType!=='mouse')inUp('p'+e.pointerId)});
addEventListener('mousedown',e=>{if(state!=='play'||performance.now()-lastT<700)return;e.preventDefault();inDown('m'+e.button)});
addEventListener('mouseup',e=>inUp('m'+e.button));
addEventListener('contextmenu',e=>{if(state==='play')e.preventDefault()});
addEventListener('blur',inClear);
/* ================= LEVEL EDITOR ================= */
let ED=null,edRaf=0;
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const ABUF={},PK={},MEM={},TOP=78;
const TOOLS=[['tap','Tap','Single tap. Key 1'],['hold','Hold','Press, hold, release at the end. Drag the end to resize. Key 2'],['dbl','Double','Two quick taps. Key 3'],['tri','Triple','Three quick taps. Key 4'],['roll','Roll','Mash taps along the bar. Drag the end to resize. Key 5'],['lift','Lift','Hold, then release exactly at the end. Key 6'],['decoy','Decoy','The player must NOT tap this. Key 7'],['select','Select','Click a note to select it, drag to move it. Key S'],['erase','Erase','Click notes to delete them. Key E (or right-click any time)']];
const fmtT=s=>{s=Math.max(0,s);const r=s%60;return Math.floor(s/60)+':'+(r<10?'0':'')+r.toFixed(1)};
function actx(){ac=ac||new (window.AudioContext||window.webkitAudioContext)();ac.resume();if(!nb){nb=ac.createBuffer(1,ac.sampleRate>>1,ac.sampleRate);const d=nb.getChannelData(0);for(let k=0;k<d.length;k++)d[k]=Math.random()*2-1}}
function stopCA(){if(csrc){try{csrc.stop()}catch(e){}csrc=null}}
// audio files live in IndexedDB (too big for localStorage); level data lives in the normal save
const idb=()=>new Promise((res,rej)=>{try{const r=indexedDB.open('onetap-audio',1);r.onupgradeneeded=()=>r.result.createObjectStore('a');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}});
const idbPut=(k,v)=>idb().then(d=>new Promise((res,rej)=>{const t=d.transaction('a','readwrite');t.objectStore('a').put(v,k);t.oncomplete=()=>res();t.onerror=()=>rej(t.error)}));
const idbGet=k=>idb().then(d=>new Promise((res,rej)=>{const q=d.transaction('a').objectStore('a').get(k);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)}));
const idbDel=k=>idb().then(d=>new Promise(res=>{const t=d.transaction('a','readwrite');t.objectStore('a').delete(k);t.oncomplete=()=>res();t.onerror=()=>res()})).catch(()=>{});
function mkPeaks(buf){const d=buf.getChannelData(0),d2=buf.numberOfChannels>1?buf.getChannelData(1):d,n=Math.ceil(buf.duration*100),sp=Math.max(1,Math.floor(buf.sampleRate/100)),p=new Float32Array(n);let mx=.001;
 for(let i=0;i<n;i++){let m=0;const a=i*sp,b=Math.min(d.length,a+sp);for(let j=a;j<b;j+=3){const v=Math.max(Math.abs(d[j]),Math.abs(d2[j]));if(v>m)m=v}p[i]=m;if(m>mx)mx=m}
 for(let i=0;i<n;i++)p[i]/=mx;return p}
async function loadAudio(c){if(ABUF[c.id])return ABUF[c.id];actx();let bytes=MEM[c.id];if(!bytes)bytes=await idbGet(c.id);if(!bytes)throw new Error('missing');
 const b=await ac.decodeAudioData(bytes.slice(0));ABUF[c.id]=b;PK[c.id]=mkPeaks(b);return b}
function genCustom(){return CL.notes.slice().sort((a,b)=>a.b-b.b).map(o=>{const r={b:o.b,n:o.n,len:0,dbl:0,decoy:0,hit:0};
 if(o.t=='hold'||o.t=='lift'||o.t=='roll'){r.len=o.len;if(o.t=='lift')r.lift=1;if(o.t=='roll'){r.roll=1;r.need=Math.max(3,Math.round(o.len*3))}}
 else if(o.t=='dbl')r.dbl=1;else if(o.t=='tri')r.dbl=2;else if(o.t=='ph')r.ph=1;else if(o.t=='decoy')r.decoy=1;return r})}
async function playCustom(i,show,from,fromEd,noAud){const c=save.custom[i];if(!c||!c.notes.length)return;actx();CL=c;EDI=fromEd?i:null;CAB=null;
 if(c.audio&&!noAud){try{CAB=await loadAudio(c)}catch(e){return needAudio(i,show,from,fromEd)}}
 const f={};if(c.fl.r)f.r=c.fl.r;if(c.fl.w)f.w=1;if(c.fl.s)f.s=c.fl.s;if(c.fl.q)f.q=1;
 L[CUS]=[c.si,c.bpm,[1],0,f,c.name,9999];start(CUS,show,from)}
function ccd(c,i){return `<div class="crow"><button class="card" data-a="clv" data-v="${i}"${c.notes.length?'':' disabled'} style="border-left-color:var(--ok)"><b>★</b><span>${esc(c.name)}<i>${c.audioName?esc(c.audioName):'Built-in backing'} · ${c.bpm} BPM · ${c.notes.length} notes${c.by?' · by '+esc(c.by):''}</i></span><u style="background:#6a6388">Custom</u></button><button data-a="ced" data-v="${i}">Edit</button><button data-a="cshr" data-v="${i}" title="Save as a .otm level file you can send to anyone">Share</button><button data-a="cdel" data-v="${i}">${delArm===i?'Sure?':'✕'}</button></div>`}
function cdel(i){if(delArm!==i){delArm=i;menu();return}const c=save.custom[i];save.custom.splice(i,1);(save.cdel=save.cdel||[]).push(c.id);if(save.cdel.length>200)save.cdel.shift();delete ABUF[c.id];delete PK[c.id];delete MEM[c.id];idbDel(c.id);delArm=-1;persist();menu()}

// ---- editor model helpers
const edX=b=>(b-ED.sc)*ED.zoom,edB=px=>px/ED.zoom+ED.sc;
const snapB=b=>Math.round(b*ED.snap)/ED.snap;
const rowH=h=>Math.max(12,(h-TOP)/14);
const pitchAt=(py,h)=>Math.max(0,Math.min(13,13-Math.floor((py-TOP)/rowH(h))));
const occ=o=>o.t==='tri'?1:o.t==='dbl'?.5:Math.max(.25,(o.len||0)+.25);
function fits(o,ig){if(o.b<0||o.b>ED.c.beats)return false;const a0=o.b,a1=o.b+occ(o);for(const p of ED.c.notes){if(p===o||p===ig)continue;const b0=p.b,b1=p.b+occ(p);if(a0<b1-1e-6&&b0<a1-1e-6)return false}return true}
const edBeat=()=>ED.play?ED.ph0+(ac.currentTime-ED.at0)*ED.c.bpm/60:ED.ph;
const minPh=()=>ED.c.audio?-ED.c.off*ED.c.bpm/60:0;
const edFit=()=>{const c=ED.c;if(c.audio&&c.dur)c.beats=Math.max(8,Math.floor((c.dur-c.off)*c.bpm/60));persist()};
const edf=n=>{const sd=S[ED.c.si],q=sd[2][((n%7)+7)%7]+12*Math.floor(n/7);return 440*2**((sd[1]+12+q-69)/12)};
const edBlip=n=>{try{tone(edf(n),ac.currentTime,.16,S[ED.c.si][4],.14)}catch(e){}};
function delNote(o){const a=ED.c.notes;const i=a.indexOf(o);if(i>=0)a.splice(i,1);if(ED.sel===o)ED.sel=null;persist()}
function edPlay(){const c=ED.c,b=ABUF[c.id];edStop(true);ED.play=true;ED.ph0=ED.ph;ED.at0=ac.currentTime+.08;ED.sched=ED.ph-1e-6;
 if(b){const T=c.off+ED.ph*60/c.bpm,s=ac.createBufferSource();s.buffer=b;s.connect(master);if(T>=0){if(T<b.duration)s.start(ED.at0,T)}else s.start(ED.at0-T,0);ED.src=s}}
function edStop(keep){if(ED.src){try{ED.src.stop()}catch(e){}ED.src=null}if(ED.play&&!keep)ED.ph=edBeat();ED.play=false}
function seekTo(b){const wp=ED.play;if(wp)edStop();ED.ph=Math.max(minPh(),b);const vw=ED.cv?ED.cv.clientWidth/ED.zoom:10;if(ED.ph<ED.sc||ED.ph>ED.sc+vw)ED.sc=ED.ph-vw*.2;if(wp)edPlay()}
const clampSc=()=>{ED.sc=Math.max(-2,Math.min(ED.c.beats,ED.sc))};
function setBpm(v){const c=ED.c;v=Math.round(v*100)/100;if(!(v>=40&&v<=300)){edPanel();return}const wp=ED.play;if(wp)edStop();c.bpm=v;edFit();if(wp)edPlay();edPanel()}
function setOff(v){const c=ED.c;const wp=ED.play;if(wp)edStop();c.off=Math.max(0,Math.round(v*1000)/1000);edFit();if(wp)edPlay();edPanel()}
async function edImport(file){const c=ED.c;ED.msg='Decoding audio…';ED.warn='';edPanel();
 try{actx();const bytes=await file.arrayBuffer(),b=await ac.decodeAudioData(bytes.slice(0));edStop();MEM[c.id]=bytes;
  try{await idbPut(c.id,bytes)}catch(e){ED.warn='This browser would not store the file, so you will need to re-import it next visit.'}
  ABUF[c.id]=b;PK[c.id]=mkPeaks(b);c.audio=1;c.audioName=file.name.replace(/\.[^.]+$/,'');c.dur=b.duration;edFit();ED.msg='';ED.ph=0;ED.sc=-.5}
 catch(e){ED.msg='Could not read that file. Try an MP3, WAV or OGG.'}edPanel()}
async function edTest(from){const c=ED.c;if(!c.notes.length){ED.msg='Place at least one note first.';edPanel();return}edStop();persist();await playCustom(EDI,false,from,true)}
function edExit(){if(ED&&ED.play)edStop(true);if(ED&&ED.c.notes.length>=20)unlock('map');persist();menu()}
function edAct(a,b){const c=ED.c,v=b.dataset.v,n=+v;
 if(a=='e_imp')$('#efile').click();
 else if(a=='e_noaud'){edStop();c.audio=0;c.audioName='';c.dur=0;delete ABUF[c.id];delete PK[c.id];delete MEM[c.id];idbDel(c.id);ED.warn='';persist();edPanel()}
 else if(a=='e_tool'){ED.tool=v;edPanel()}
 else if(a=='e_snap'){ED.snap=n;edPanel()}
 else if(a=='e_flip'){c.fl.r=[0,2,4,8][n];persist();edPanel()}
 else if(a=='e_wavy'){c.fl.w=n;persist();edPanel()}
 else if(a=='e_spin'){c.fl.s=[0,.5,1][n];persist();edPanel()}
 else if(a=='e_sq'){c.fl.q=n;persist();edPanel()}
 else if(a=='e_mod'){const k=b.dataset.k;if(c.mods[k])delete c.mods[k];else c.mods[k]=1;persist();edPanel()}
 else if(a=='e_play'){ED.play?edStop():edPlay()}
 else if(a=='e_met'){ED.met=ED.met?0:1;b.classList.toggle('sel',!!ED.met)}
 else if(a=='e_ns'){ED.ns=ED.ns?0:1;b.classList.toggle('sel',!!ED.ns)}
 else if(a=='e_tap'){const t=performance.now();if(ED.taps.length&&t-ED.taps[ED.taps.length-1]>2000)ED.taps=[];ED.taps.push(t);ED.taps=ED.taps.slice(-9);
  if(ED.taps.length>=3){const q=ED.taps,avg=(q[q.length-1]-q[0])/(q.length-1),bpm=Math.round(60000/avg*10)/10;if(bpm>=40&&bpm<=300){c.bpm=bpm;edFit();$('#ebpm').value=bpm}}}
 else if(a=='e_half')setBpm(c.bpm/2);else if(a=='e_dbl')setBpm(c.bpm*2);
 else if(a=='e_o-')setOff(c.off-.01);else if(a=='e_o+')setOff(c.off+.01);
 else if(a=='e_oh'){const T=c.off+edBeat()*60/c.bpm;const wp=ED.play;if(wp)edStop();c.off=Math.max(0,Math.round(T*1000)/1000);ED.ph=0;edFit();ED.sc=-.5;if(wp)edPlay();edPanel()}
 else if(a=='e_test')edTest(0);
 else if(a=='e_testph'){const f=Math.floor(edBeat());edTest(f>=1&&f<c.beats-4?f:0)}
 else if(a=='e_clear'){if(ED.clr){c.notes.length=0;ED.sel=null;ED.clr=0;persist()}else ED.clr=1;edPanel()}
 else if(a=='e_done')edExit();
 else if(a=='e_back')editor(EDI,true)}
function edPanel(){const c=ED.c,el=$('#edside');if(!el)return;const has=!!ABUF[c.id],tl=TOOLS.find(t=>t[0]==ED.tool);
 el.innerHTML=`<h1 style="font-size:26px">Level editor</h1>
 <label>Name<br><input type="text" id="enm" maxlength="40" value="${esc(c.name)}" style="width:100%"></label>
 <h2>Music</h2>
 <p>${c.audio?'<b>'+esc(c.audioName)+'</b> · '+fmtT(c.dur)+(has?'':' · loading…'):'No audio yet, so the built-in backing plays.'}</p>
 ${ED.msg?'<div class="nb">'+ED.msg+'</div>':''}${ED.warn?'<p>'+ED.warn+'</p>':''}
 <div class="row"><button data-a="e_imp">Import MP3…</button>${c.audio?'<button data-a="e_noaud">Remove</button>':''}</div>
 <input type="file" id="efile" accept="audio/*,.mp3,.wav,.ogg,.m4a" hidden>
 <label>Backing style (no MP3) <select id="esi">${S.map((s,i)=>`<option value="${i}"${i==c.si?' selected':''}>${esc(s[0])}</option>`).join('')}</select></label>
 <h2>Tempo and timing</h2>
 <label>BPM <input type="number" id="ebpm" min="40" max="300" step="0.01" value="${c.bpm}"></label>
 <div class="row" style="margin-top:6px"><button data-a="e_tap">Tap tempo</button><button data-a="e_half">÷2</button><button data-a="e_dbl">×2</button></div>
 <label>First beat at <input type="number" id="eoff" min="0" step="0.001" value="${c.off.toFixed(3)}"> s</label>
 <div class="row" style="margin-top:6px"><button data-a="e_o-">−10 ms</button><button data-a="e_o+">+10 ms</button>${c.audio&&has?'<button data-a="e_oh">First beat = playhead</button>':''}</div>
 ${c.audio&&has?`<p>Length: <b>${c.beats}</b> beats, from the song. Changing BPM or the first beat keeps your notes on the same beats.</p>`:`<label>Length <input type="number" id="ebt" min="8" max="2000" step="4" value="${c.beats}"> beats</label>`}
 <p>Turn on the metronome, press Play, and adjust until the ticks sit on the song's beat.</p>
 <h2>Note type</h2><div class="row">${TOOLS.map(t=>`<button data-a="e_tool" data-v="${t[0]}" class="${ED.tool==t[0]?'sel':''}">${t[1]}</button>`).join('')}</div>
 <p>${tl[2]}</p>
 <h2>Snap</h2><div class="row">${[1,2,3,4].map(d=>`<button data-a="e_snap" data-v="${d}" class="${ED.snap==d?'sel':''}">1/${d}</button>`).join('')}</div>
 <h2>Level mechanics</h2>
 <label style="margin-top:2px">Flip sides</label><div class="row">${seg('e_flip',['Off','2 beats','4 beats','8 beats'],[0,2,4,8].indexOf(c.fl.r))}</div>
 <label>Wavy track</label><div class="row">${seg('e_wavy',['Off','On'],c.fl.w?1:0)}</div>
 <label>Spin</label><div class="row">${seg('e_spin',['Off','Low','High'],c.fl.s?(c.fl.s>.5?2:1):0)}</div>
 <label>Squeeze (hit window tightens as combo grows)</label><div class="row">${seg('e_sq',['Off','On'],c.fl.q?1:0)}</div>
 <h2>Forced modifiers</h2><div class="row">${MODS.map(m=>`<button data-a="e_mod" data-k="${m[0]}" title="${m[2]}" class="${c.mods[m[0]]?'sel':''}">${m[1]}</button>`).join('')}</div>
 <p>${MODS.filter(m=>c.mods[m[0]]).map(m=>'<b>'+m[1]+'</b>: '+m[2]).join('<br>')||'Rules that are always on when this level is played.'}</p>
 <h2>${c.notes.length} notes</h2>
 <div class="row"><button class="main" data-a="e_test">Test level</button><button data-a="e_testph">Test from playhead</button></div>
 <div class="row" style="margin-top:8px"><button data-a="e_clear">${ED.clr?'Sure?':'Clear notes'}</button><button class="main" data-a="e_done">Done</button></div>`;
 $('#enm').oninput=e=>{c.name=e.target.value||'Untitled';persist()};
 $('#ebpm').onchange=e=>setBpm(+e.target.value);
 $('#eoff').onchange=e=>setOff(+e.target.value);
 const bt=$('#ebt');if(bt)bt.onchange=e=>{c.beats=Math.max(8,Math.min(2000,Math.round(+e.target.value||64)));persist();edPanel()};
 $('#esi').onchange=e=>{c.si=+e.target.value;persist()};
 $('#efile').onchange=e=>{const f=e.target.files[0];if(f)edImport(f)}}
function edDraw(){const c=ED.c,cn=ED.cv;if(!cn)return;const r=cn.getBoundingClientRect(),d=devicePixelRatio||1,w=r.width,h=r.height;if(w<20||h<20)return;
 if(cn.width!==Math.round(w*d)||cn.height!==Math.round(h*d)){cn.width=Math.round(w*d);cn.height=Math.round(h*d)}
 const g=cn.getContext('2d');g.setTransform(d,0,0,d,0,0);const C=ED.col,z=ED.zoom,sc=ED.sc,xo=b=>(b-sc)*z,rh=rowH(h),cur=edBeat();
 g.fillStyle=C.bg;g.fillRect(0,0,w,h);
 for(let n=0;n<14;n++){g.fillStyle=n%2?'rgba(128,128,160,.06)':'rgba(128,128,160,.14)';g.fillRect(0,TOP+(13-n)*rh,w,rh)}
 g.fillStyle='rgba(128,128,160,.12)';g.fillRect(0,0,w,TOP);
 const x0=xo(0),x1=xo(c.beats);g.fillStyle='rgba(0,0,0,.22)';if(x0>0)g.fillRect(0,TOP,Math.min(w,x0),h-TOP);if(x1<w)g.fillRect(Math.max(0,x1),TOP,w-Math.max(0,x1),h-TOP);
 // waveform
 const P=PK[c.id],mid=50;
 if(P){g.fillStyle=C.ring;g.globalAlpha=.6;for(let px=0;px<w;px++){const t0=c.off+(sc+px/z)*60/c.bpm,t1=c.off+(sc+(px+1)/z)*60/c.bpm,i0=Math.floor(t0*100),i1=Math.max(i0,Math.floor(t1*100));if(i1<0||i0>=P.length)continue;let m=0;for(let i=Math.max(0,i0);i<=Math.min(P.length-1,i1);i++)if(P[i]>m)m=P[i];g.fillRect(px,mid-m*24,1,m*48+1)}g.globalAlpha=1}
 else{g.fillStyle=C.mut;g.font='12px Space Grotesk,system-ui';g.textAlign='left';g.fillText('Import an MP3 to see its waveform here',10,mid+4)}
 // grid and ruler
 const k0=Math.floor(sc),k1=Math.ceil(sc+w/z),dv=ED.snap;g.lineWidth=1;g.font='700 11px Space Grotesk,system-ui';g.textAlign='left';
 for(let k=k0;k<=k1;k++){const px=Math.round(xo(k))+.5,st2=k%4==0;
  if(z/dv>=14&&dv>1){g.strokeStyle=C.fg;g.globalAlpha=.07;g.beginPath();for(let j=1;j<dv;j++){const sx2=Math.round(xo(k+j/dv))+.5;g.moveTo(sx2,TOP);g.lineTo(sx2,h)}g.stroke()}
  g.strokeStyle=C.fg;g.globalAlpha=st2?.4:.18;g.beginPath();g.moveTo(px,st2?0:TOP-8);g.lineTo(px,h);g.stroke();g.globalAlpha=1;
  if(st2||z>=50){g.fillStyle=C.fg;g.globalAlpha=.75;g.fillText(String(k),px+3,14);g.globalAlpha=1}}
 // notes
 for(const o of c.notes){const a1=xo(o.b),a2=xo(o.b+(o.len||0));if(a2<-30||a1>w+30)continue;const y=TOP+(13-o.n+.5)*rh,rad=Math.min(rh*.42,12);
  if(o.len){const col=o.t=='roll'?C.ring:o.t=='lift'?C.ok:C.hot;g.globalAlpha=.5;g.strokeStyle=col;g.lineCap='round';g.lineWidth=rad*1.5;g.beginPath();g.moveTo(a1,y);g.lineTo(a2,y);g.stroke();g.lineCap='butt';g.globalAlpha=1;g.fillStyle=col;g.fillRect(a2-2,y-rad,4,rad*2)}
  if(o.t=='decoy'){g.fillStyle=C.mut;g.beginPath();g.arc(a1,y,rad*.85,0,7);g.fill();g.strokeStyle=C.bg;g.lineWidth=2;g.beginPath();g.moveTo(a1-4,y-4);g.lineTo(a1+4,y+4);g.moveTo(a1+4,y-4);g.lineTo(a1-4,y+4);g.stroke()}
  else{g.fillStyle=o.t=='lift'?C.ok:o.t=='roll'?C.ring:C.hot;g.globalAlpha=o.t=='ph'?.35:1;g.beginPath();g.arc(a1,y,rad,0,7);g.fill();g.globalAlpha=1;g.strokeStyle='#fff';g.lineWidth=2;if(o.t=='ph')g.setLineDash([3,3]);g.stroke();g.setLineDash([]);
   const rg=o.t=='dbl'?1:o.t=='tri'?2:0;for(let q=0;q<rg;q++){g.strokeStyle=C.ring;g.lineWidth=2;g.beginPath();g.arc(a1,y,rad+3+q*4,0,7);g.stroke()}}
  if(o===ED.sel){g.strokeStyle=C.fg;g.lineWidth=2;g.strokeRect(Math.min(a1,a2)-rad-5,y-rad-5,Math.abs(a2-a1)+rad*2+10,rad*2+10)}}
 // playhead
 const ph=xo(cur);if(ph>-10&&ph<w+10){g.strokeStyle=C.hot;g.lineWidth=2;g.beginPath();g.moveTo(ph,0);g.lineTo(ph,h);g.stroke();g.fillStyle=C.hot;g.beginPath();g.moveTo(ph-6,0);g.lineTo(ph+6,0);g.lineTo(ph,9);g.fill()}}
function edLoop(){if(state!=='edit'||!ED)return;const c=ED.c;
 if(ED.play){const cur=edBeat(),hz=cur+.25*c.bpm/60,T=b=>ED.at0+(b-ED.ph0)*60/c.bpm;
  if(ED.met)for(let k=Math.floor(ED.sched)+1;k<=hz;k++)if(k>ED.sched)tone(k%4==0?1600:1100,T(k),.04,'square',.12);
  if(ED.ns)for(const o of c.notes)if(o.b>ED.sched&&o.b<=hz){tone(1900,T(o.b),.04,'square',.2);if(!c.audio&&o.t!=='decoy')tone(edf(o.n),T(o.b),.15,S[c.si][4],.12)}
  ED.sched=hz;const vw=ED.cv.clientWidth/ED.zoom;if(cur>ED.sc+vw*.85||cur<ED.sc){ED.sc=cur-vw*.15;clampSc()}
  if(cur>c.beats+2){ED.ph=Math.min(cur,c.beats);edStop(true)}}
 const pb=$('#epb'),lab=ED.play?'⏸ Pause':'▶ Play';if(pb&&pb.textContent!==lab)pb.textContent=lab;
 const sl=$('#escr');if(sl){if(+sl.max!==c.beats)sl.max=c.beats;sl.value=ED.sc}
 const tl=$('#etl');if(tl){const cur=edBeat(),s=`beat ${cur.toFixed(2)} · ${fmtT(c.off+cur*60/c.bpm)}`;if(tl.textContent!==s)tl.textContent=s}
 edDraw();edRaf=requestAnimationFrame(edLoop)}
function edKey(e){const t=e.target,tg=t&&t.tagName;if(tg==='SELECT'||(tg==='INPUT'&&/text|number/.test(t.type)))return;const k=e.key;
 if(k===' '){e.preventDefault();ED.play?edStop():edPlay();return}
 if(k==='Delete'||k==='Backspace'){if(ED.sel){e.preventDefault();delNote(ED.sel)}return}
 const ti='1234567'.indexOf(k);if(ti>=0){ED.tool=TOOLS[ti][0];edPanel();return}
 if(k==='e'||k==='E'){ED.tool='erase';edPanel();return}if(k==='s'||k==='S'){ED.tool='select';edPanel();return}
 if(k==='m'||k==='M'){ED.met=ED.met?0:1;const b=$('#emet');if(b)b.classList.toggle('sel',!!ED.met);return}
 if(k==='ArrowLeft'||k==='ArrowRight'){e.preventDefault();seekTo(edBeat()+(k==='ArrowRight'?1:-1)*(e.shiftKey?4:1));return}
 if(k==='Home'){seekTo(0);ED.sc=-.5}}
function editor(i,keep){
 cancelAnimationFrame(raf);cancelAnimationFrame(edRaf);stopCA();if(ED&&ED.play)edStop(true);
 actx();if(master)master.gain.value=0;killAudio();x.clearRect(0,0,W,H);
 let c;if(i<0){c={id:'c'+Date.now().toString(36)+Math.floor(Math.random()*1e4).toString(36),name:'My level '+(save.custom.length+1),bpm:120,off:0,beats:64,si:0,audio:0,audioName:'',dur:0,notes:[],fl:{r:0,w:0,s:0,q:0},mods:{}};save.custom.push(c);i=save.custom.length-1;persist()}else c=save.custom[i];
 EDI=i;state='edit';ui.style.touchAction='';ui.scrollTop=0;
 if(!(keep&&ED&&ED.c===c))ED={c,tool:'tap',snap:2,sc:-.5,zoom:80,ph:0,play:false,sel:null,drag:null,taps:[],met:1,ns:1,msg:'',warn:'',clr:0,src:null};
 ED.play=false;ED.src=null;ED.clr=0;
 const cs=getComputedStyle(document.documentElement);ED.col={bg:cs.getPropertyValue('--bg').trim(),fg:cs.getPropertyValue('--fg').trim(),mut:cs.getPropertyValue('--mut').trim(),hot:save.st.hot||cs.getPropertyValue('--hot').trim(),ring:save.st.ring||cs.getPropertyValue('--ring').trim(),ok:cs.getPropertyValue('--ok').trim()};
 master=ac.createGain();master.gain.value=save.st.vol;master.connect(ac.destination);
 ui.innerHTML=`<div class="edw"><div class="ed-side" id="edside"></div><div class="ed-main">
 <div class="ed-bar"><button class="main" id="epb" data-a="e_play">▶ Play</button><button id="emet" data-a="e_met" class="${ED.met?'sel':''}">Metronome</button><button data-a="e_ns" class="${ED.ns?'sel':''}">Note clicks</button><span id="etl"></span></div>
 <canvas id="ec"></canvas>
 <div class="ed-bar"><label style="margin:0">Scroll <input type="range" id="escr" min="-2" max="${c.beats}" step="0.25" style="width:200px"></label><label style="margin:0">Zoom <input type="range" id="ezoom" min="16" max="240" value="${ED.zoom}" style="width:120px"></label></div>
 <p class="hint">Click the grid to place a note. Drag a note to move it, or drag a hold's end to resize. Right-click deletes. Click the ruler or waveform to move the playhead. Space plays, Ctrl+wheel zooms, 1–8 pick note types.</p></div></div>`;
 const cn=ED.cv=$('#ec');
 const pos=e=>{const r=cn.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top,r.width,r.height]};
 const noteAt=(px,py,h)=>{const rh=rowH(h);let best=null;for(const o of c.notes){const y=TOP+(13-o.n+.5)*rh;if(py<y-rh/2||py>y+rh/2)continue;if(px>=edX(o.b)-12&&px<=edX(o.b+(o.len||0))+12)best=o}return best};
 cn.oncontextmenu=e=>e.preventDefault();
 cn.onpointerdown=e=>{e.preventDefault();actx();try{cn.setPointerCapture(e.pointerId)}catch(_){}const[px,py,w,h]=pos(e);
  if(py<TOP){ED.drag={k:'seek',wp:ED.play};if(ED.play)edStop();ED.ph=Math.max(minPh(),edB(px));return}
  const o=noteAt(px,py,h);
  if(e.button===2||ED.tool==='erase'){if(o)delNote(o);return}
  if(o){ED.sel=o;ED.drag=o.len&&Math.abs(px-edX(o.b+o.len))<=10&&px>edX(o.b)+14?{k:'len',o}:{k:'move',o,dx:edB(px)-o.b};return}
  if(ED.tool==='select'){ED.sel=null;return}
  const n={b:Math.max(0,snapB(edB(px))),n:pitchAt(py,h),t:ED.tool,len:0},isLen=n.t==='hold'||n.t==='lift'||n.t==='roll';
  if(isLen)n.len=.5;
  if(!fits(n)){ED.sel=null;return}
  c.notes.push(n);c.notes.sort((p,q)=>p.b-q.b);ED.sel=n;if(!ED.play)edBlip(n.n);ED.drag=isLen?{k:'len',o:n,fresh:1}:null;persist()};
 cn.onpointermove=e=>{const[px,py,w,h]=pos(e),d=ED.drag;
  if(!d){cn.style.cursor=py<TOP?'pointer':(noteAt(px,py,h)&&ED.tool!=='erase'?'grab':'crosshair');return}
  if(d.k==='seek'){ED.ph=Math.max(minPh(),edB(px));return}
  if(d.k==='move'){const o=d.o,ob=o.b,on=o.n;o.b=Math.max(0,snapB(edB(px)-d.dx));o.n=pitchAt(py,h);if(!fits(o,o)){o.b=ob;o.n=on}else if(o.n!==on&&!ED.play)edBlip(o.n);return}
  if(d.k==='len'){const o=d.o,ol=o.len;o.len=Math.max(.25,Math.min(8,snapB(edB(px))-o.b));if(!fits(o,o))o.len=ol;else if(o.len!==ol)d.moved=1}};
 cn.onpointerup=cn.onpointercancel=e=>{const d=ED.drag;ED.drag=null;if(!d)return;
  if(d.k==='seek'){if(d.wp)edPlay();return}
  if(d.k==='len'&&d.fresh&&!d.moved){const o=d.o;for(const l2 of(o.t==='roll'?[1.5,1,.5]:[1,.5])){const old=o.len;o.len=l2;if(fits(o,o))break;o.len=old}}
  c.notes.sort((p,q)=>p.b-q.b);persist()};
 cn.onwheel=e=>{e.preventDefault();const[px]=pos(e);
  if(e.ctrlKey||e.metaKey){const bb=edB(px);ED.zoom=Math.max(16,Math.min(240,ED.zoom*(e.deltaY<0?1.15:1/1.15)));ED.sc=bb-px/ED.zoom;$('#ezoom').value=ED.zoom}
  else ED.sc+=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)/ED.zoom;clampSc()};
 $('#escr').oninput=e=>{ED.sc=+e.target.value};
 $('#ezoom').oninput=e=>{const mid=ED.sc+cn.clientWidth/ED.zoom/2;ED.zoom=+e.target.value;ED.sc=mid-cn.clientWidth/ED.zoom/2;clampSc()};
 edPanel();
 if(c.audio&&!ABUF[c.id])loadAudio(c).then(()=>edPanel()).catch(()=>{ED.warn='The audio file is missing from this browser. Import the MP3 again, or play with the built-in backing.';edPanel()});
 edRaf=requestAnimationFrame(edLoop)}

/* ================= PAUSE MENU ================= */
var PT=0;
function showPause(){const ed=lv==CUS&&EDI!=null;ui.style.touchAction='';ui.style.background='#0007';
 ui.innerHTML=`<div class="p" style="max-width:340px"><h1 style="font-size:28px">Paused</h1><p>${esc(L[lv][5]||'')}</p><div class="pst"><button class="main" data-a="p_resume">Resume</button><button data-a="p_retry">Restart</button><button data-a="p_quit">${ed?'Back to editor':'Quit to menu'}</button></div><p class="hint" style="margin-top:12px">Esc resumes · R restarts</p></div>`}
function pauseGame(){if(state!=='play')return;cancelAnimationFrame(raf);state='pause';inClear();ac.suspend();showPause()}
function resumeGame(){if(state!=='pause')return;state='resuming';let n=3;
 const tick=()=>{if(state!=='resuming')return;
  if(n<=0){ui.innerHTML='';ui.style.background='';ui.style.touchAction='none';state='play';ac.resume();if(hn){const h=hn;hn=null;fail(h,'Hold dropped',0,1)}raf=requestAnimationFrame(loop);return}
  ui.innerHTML=`<div class="p" style="max-width:220px;background:transparent;box-shadow:none"><p class="big" style="color:var(--hot)">${n}</p></div>`;n--;PT=setTimeout(tick,700)};tick()}
function pauseRetry(){clearTimeout(PT);ui.style.background='';ac.resume();start(lv,SH,PS)}
function pauseQuit(){clearTimeout(PT);ui.style.background='';ac.resume();if(lv==CUS&&EDI!=null)editor(EDI,true);else menu()}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play')pauseGame()});

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
 return({'auth/email-already-in-use':'That name is already taken.','auth/invalid-credential':'Wrong username/email or password.','auth/wrong-password':'Wrong username/email or password.','auth/user-not-found':'Wrong username/email or password.',
 'auth/weak-password':'Password must be at least 8 characters, with a letter and a number.','auth/invalid-email':'That email address doesn’t look right.','auth/too-many-requests':'Too many attempts. Wait a bit and try again.','auth/network-request-failed':'Couldn’t reach the server. Check your connection.',
 'auth/operation-not-allowed':'Email/password sign-in isn’t switched on in the Firebase console yet.'})[c]||'Something went wrong. Please try again.'}
var SYNC={fb:null,dbState:'wait',acct:null,uid:null,unsub:null,cloud:{},pending:null,ready:false,busy:false,again:false,timer:0,retry:0,last:0,big:0,tk:0,st:'connecting',note:''};
function acctInner(){const s=SYNC,fm=t=>new Date(t).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
 if(!s.acct){const t=s.dbState==='wait'?'Checking accounts…':s.dbState==='none'?'Saved on this device only. Accounts aren’t available right now.':'Saved on this device only. Log in to sync across devices.';
  return `<div class="ac-row"><div><b>Guest</b><small>${esc(t)}</small></div>${s.dbState==='ok'?'<button data-a="acct">Log in</button>':''}</div>`}
 const t={connecting:'Connecting…',syncing:'Syncing…',ok:'Synced'+(s.last?' · '+fm(s.last):'')+(s.big?' · '+s.big+' large level'+(s.big>1?'s':'')+' not synced':''),
  ro:'The cloud refused the save. Check that the Firestore rules are deployed. Progress is safe on this device.',off:'Can’t reach the account service. Progress is safe on this device.',err:'Couldn’t sync. Progress is safe on this device and will retry.'}[s.st]||'';
 return `<div class="ac-row"><div><b>${esc(s.acct.name)}</b><small>${t}</small></div><button data-a="sync"${s.st==='syncing'||s.st==='connecting'?' disabled':''}>Sync</button><button data-a="acct">Account</button></div>`}
const acctHTML=()=>`<div class="acct" id="acct">${acctInner()}</div>`;
function acctRefresh(){const e=$('#acct');if(e)e.innerHTML=acctInner()}
function acctStatusText(){const d=document.createElement('div');d.innerHTML=acctInner();const sm=d.querySelector('small');return sm?sm.textContent:''}
function setSt(v){SYNC.st=v;acctRefresh();const a=$('#aacct');if(a)a.textContent=acctStatusText()}
function syncDirty(){if(SYNC&&SYNC.uid&&SYNC.ready&&SYNC.st!=='ro')schedulePush(2000)}
function schedulePush(ms){clearTimeout(SYNC.timer);SYNC.timer=setTimeout(push,ms)}
function pack(){const o=JSON.parse(sjson(save));delete o.custom;delete o.off;delete o.acct; // audio offset belongs to each device
 const P={save:{ts:save.ts||0,p:canon(o)}};SYNC.big=0;
 for(const c of save.custom){if(!c||!c.id)continue;const p=canon(c);if(p.length>300000){SYNC.big++;continue}P[ckey(c.id)]={ts:save.ts||0,p}}return P}
function mergeRemote(D){
 const L0=JSON.parse(sjson(save)),R0=D.save?(()=>{try{return JSON.parse(D.save.j)}catch(e){return{}}})():{},rc=[];
 if((R0.v||3)<4){if(R0.best&&R0.best[100]){R0.best[200]=R0.best[100];delete R0.best[100]}(R0.runs||[]).forEach(r=>{if(r.l===100)r.l=200})}
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
 m.off=L0.off||0;m.acct=L0.acct;m.ts=Math.max(L0.ts||0,R0.ts||0);m.v=4;return m}
function applyMerged(m){for(const k of Object.keys(save))delete save[k];Object.assign(save,m);
 save.st=Object.assign({snd:1,vol:.5,hot:'',ring:'',theme:'auto',fx:1,ar:1,tt:1},save.st);save.mods=Object.assign({fc:0,ap:0,fr:0,tw:0,hd:0,mr:0,nf:0},save.mods);if(!Array.isArray(save.custom))save.custom=[];if(!save.ach||typeof save.ach!=='object'||Array.isArray(save.ach))save.ach={};
 try{localStorage.setItem('onetap2',sjson(save))}catch(e){}applyTheme()}
function pull(){const D=SYNC.pending;if(!D||!SYNC.uid||state!=='menu')return; // never change progress under a running level or the editor
 SYNC.pending=null;const before=canon(save);applyMerged(mergeRemote(D));SYNC.cloud={};for(const k in D)SYNC.cloud[k]=D[k].j;
 const first=!SYNC.ready;SYNC.ready=true;
 if(canon(save)!==before&&$('.wrap'))menu();
 schedulePush(first?0:300)}
async function push(){clearTimeout(SYNC.timer);
 const uid=SYNC.uid;if(!uid||!SYNC.ready)return;if(SYNC.busy){SYNC.again=true;return}
 SYNC.busy=true;SYNC.again=false;setSt('syncing');
 try{const P=pack(),dead=new Set((save.cdel||[]).map(ckey));
  for(const k in P){if(SYNC.cloud[k]===P[k].p)continue;const prev=SYNC.cloud[k];SYNC.cloud[k]=P[k].p;
   try{await SYNC.fb.setDoc(uid,k,{ts:P[k].ts,j:P[k].p})}catch(e){if(prev===undefined)delete SYNC.cloud[k];else SYNC.cloud[k]=prev;throw e}}
  for(const k of Object.keys(SYNC.cloud))if(k!=='save'&&!P[k]&&dead.has(k)){await SYNC.fb.delDoc(uid,k);delete SYNC.cloud[k]}
  SYNC.last=Date.now();if(SYNC.uid===uid)setSt('ok')}
 catch(e){if(SYNC.uid===uid){if(e&&e.code==='permission-denied')setSt('ro');else{setSt('err');clearTimeout(SYNC.retry);SYNC.retry=setTimeout(()=>schedulePush(0),15000)}}}
 finally{SYNC.busy=false;if(SYNC.again&&SYNC.st!=='ro'&&SYNC.uid)schedulePush(500)}}
async function syncNow(){if(!SYNC.uid||SYNC.busy)return;const uid=SYNC.uid;setSt('syncing');
 try{const tk=++SYNC.tk,D=await SYNC.fb.getDocs(uid);if(tk!==SYNC.tk||SYNC.uid!==uid)return;SYNC.pending=D;if(state==='menu')pull();await push()}catch(e){setSt(e&&e.code==='permission-denied'?'ro':'err')}}
function onCloud(info){if(info.fromCache||info.pending)return;const D=info.docs,a=Object.keys(D),b=Object.keys(SYNC.cloud);
 if(SYNC.ready&&a.length===b.length&&a.every(k=>SYNC.cloud[k]===D[k].j))return; // our own write coming back
 SYNC.pending=D;pull()}
async function acctConnect(){const uid=SYNC.uid;SYNC.cloud={};SYNC.ready=false;setSt('connecting');
 const tk=++SYNC.tk,D=await SYNC.fb.getDocs(uid);if(tk!==SYNC.tk||SYNC.uid!==uid)return;SYNC.pending=D;pull();
 SYNC.unsub=SYNC.fb.listen(uid,onCloud,e=>setSt(e&&e.code==='permission-denied'?'ro':'err'))}
async function onUser(u){ // fires at load (restoring a saved login) and on every login/logout
 if(SYNC.unsub){try{SYNC.unsub()}catch(e){}SYNC.unsub=null}clearTimeout(SYNC.timer);clearTimeout(SYNC.retry);SYNC.tk++;
 Object.assign(SYNC,{cloud:{},pending:null,ready:false});
 if(!u){SYNC.acct=null;SYNC.uid=null;acctRefresh();return}
 SYNC.uid=u.uid;SYNC.acct={name:nameOf(u.email)};
 if(save.acct&&save.acct!==u.uid)applyMerged({unlocked:1,best:{},runs:[],off:save.off||0,diff:2,slow:5,free:false,pr:false,endBest:0,st:{},mods:{},custom:[],ach:{},v:3,ts:0}); // different account: don't mix progress
 save.acct=u.uid;try{localStorage.setItem('onetap2',sjson(save))}catch(e){}
 acctRefresh();
 try{await acctConnect()}catch(e){if(SYNC.uid===u.uid){setSt(e&&e.code==='permission-denied'?'ro':'err');clearTimeout(SYNC.retry);SYNC.retry=setTimeout(()=>{if(SYNC.uid===u.uid)acctConnect().catch(()=>setSt('err'))},15000)}}}
function fbInit(fb){if(!fb){SYNC.dbState='none';SYNC.st='idle';acctRefresh();return}
 SYNC.fb=fb;SYNC.dbState='ok';fb.onAuth(onUser)}
async function logout(){if(SYNC.uid&&SYNC.ready&&SYNC.timer)await push();try{await SYNC.fb.signOut()}catch(e){}menu()}
function acctScreen(){state='menu';ui.scrollTop=0;const s=SYNC,ok=s.dbState==='ok';
 if(s.acct){ui.innerHTML=`<div class="p" style="max-width:420px"><h1 style="font-size:26px">Account</h1><p>Signed in as <b>${esc(s.acct.name)}</b>.</p><p id="aacct">${esc(acctStatusText())}</p><div class="row" style="margin-top:12px"><button data-a="sync">Sync now</button><button data-a="a_out">Log out</button><button class="main" data-a="menu">Back</button></div></div>`;return}
 ui.innerHTML=`<div class="p" style="max-width:420px"><h1 style="font-size:26px">Log in</h1><p>Use an email or a username with a password to keep your progress on every device. Progress already on this device is added to your account.</p>
 <label>Email or username<br><input id="an" type="text" autocomplete="username" maxlength="64" style="width:min(100%,300px)"${ok?'':' disabled'}></label>
 <label>Password<br><input id="ap" type="password" autocomplete="current-password" maxlength="128" style="width:min(100%,300px)"${ok?'':' disabled'}></label>
 <p class="hint" id="apr" style="margin:4px 0"></p>
 <p class="nb" id="amsg" style="min-height:20px">${ok?'':(s.dbState==='wait'?'Still connecting…':'Accounts aren’t available right now.')}</p>
 <p class="hint">Use a real email if you want to be able to reset your password later. A plain username works too, but can’t be reset.</p>
 <div class="row" style="margin-top:10px"><button class="main" data-a="a_login"${ok?'':' disabled'}>Log in</button><button data-a="a_reg"${ok?'':' disabled'}>Create account</button></div>
 <div class="row" style="margin-top:8px"><button data-a="a_reset"${ok?'':' disabled'}>Forgot password?</button><button data-a="menu">Back</button></div></div>`;
 const go=e=>{if(e.key==='Enter')doAuth(false)},hint=()=>{const v=$('#ap').value;$('#apr').innerHTML=v?'New accounts need: '+pwRules(v,$('#an').value).map(r=>(r[1]?'✓ ':'✗ ')+r[0]).join(' · '):'New accounts need a password with 8+ characters, a letter and a number.'};hint();if(ok){$('#an').onkeydown=go;$('#ap').onkeydown=go;$('#ap').oninput=hint;$('#an').oninput=hint;$('#an').focus()}}
async function doAuth(reg){const msg=t=>{const e=$('#amsg');if(e)e.textContent=t},busy=v=>document.querySelectorAll('.p button').forEach(b=>b.disabled=v);
 let em;try{em=idToEmail($('#an').value||'')}catch(e){return msg(e.message)}
 const pw=$('#ap').value||'';if(!pw)return msg('Enter your password.');
 if(reg){const bad=pwRules(pw,$('#an').value).filter(r=>!r[1]);if(bad.length)return msg('Choose a stronger password. Needed: '+bad.map(r=>r[0].toLowerCase()).join(', ')+'.')}
 busy(true);msg(reg?'Creating account…':'Logging in…');let done=false;
 try{if(reg)await SYNC.fb.signUp(em,pw);else await SYNC.fb.signIn(em,pw);done=true;menu()}
 catch(e){msg(fbMsg(e))}finally{if(!done)busy(false)}}
async function doReset(){const msg=t=>{const e=$('#amsg');if(e)e.textContent=t},v=($('#an').value||'').trim().toLowerCase();
 if(!v.includes('@'))return msg('Enter your email address above. Accounts made with just a username can’t be reset.');
 try{idToEmail(v)}catch(e){return msg(e.message)}
 try{await SYNC.fb.reset(v);msg('If that email has an account, a reset link is on its way.')}catch(e){msg(fbMsg(e))}}
setInterval(()=>{if(SYNC.pending)pull()},1500);
addEventListener('visibilitychange',()=>{if(document.hidden&&SYNC.timer&&SYNC.ready)push()});
setTimeout(()=>{if(SYNC.dbState==='wait')fbInit(null)},8000); // Firebase never loaded (offline or blocked): stay local

/* ================= GRADES, ACHIEVEMENTS, TOASTS ================= */
const GR=['D','C','B','A','S','SS','SSS'],gAcc=a=>a>=97?'S':a>=90?'A':a>=80?'B':a>=60?'C':'D';
const TQ=[];let TB=0;
function toast(h,t){TQ.push([h,t]);if(!TB)nextToast()}
function nextToast(){const q=TQ.shift();if(!q){TB=0;return}TB=1;let e=$('#toast');if(!e){e=document.createElement('div');e.id='toast';document.body.appendChild(e)}
 e.innerHTML='<b>'+esc(q[0])+'</b><span>'+esc(q[1])+'</span>';requestAnimationFrame(()=>e.classList.add('on'));setTimeout(()=>{e.classList.remove('on');setTimeout(nextToast,450)},2800)}
const nClr=(a,b)=>{let n=0;for(let i=a;i<b;i++)if(save.best[i])n++;return n};
const GI=g=>GR.indexOf(g||'D'),nGr=g=>Object.values(save.best).filter(b=>GI(b.g)>=GI(g)).length;
const rk=r=>!!(r&&r.win&&r.ranked&&!r.pr&&!r.custom);
// id, name, description, check(run) (null = unlocked directly), hidden until earned
const ACH=[
['first','First steps','Clear a level.',()=>nClr(0,SEC+1)>=1],
['c10','Warmed up','Clear 10 levels.',()=>nClr(0,SEC+1)>=10],
['c50','Getting somewhere','Clear 50 levels.',()=>nClr(0,SEC+1)>=50],
['c100','Centurion','Clear 100 levels.',()=>nClr(0,SEC+1)>=100],
['c200','Completionist','Clear all 200 campaign levels.',()=>nClr(0,NL)>=NL],
['a1','Area 1 cleared','Clear every level in Area 1.',()=>nClr(0,A1)>=A1],
['a2','Afterglow cleared','Clear every level in Area 2.',()=>nClr(A1,100)>=100-A1],
['a3','Dreamstate cleared','Clear every level in Area 3.',()=>nClr(100,150)>=50],
['a4','Zenith cleared','Clear every level in Area 4.',()=>nClr(150,NL)>=50],
['s1','S-tier','Earn an S rank or better.',()=>nGr('S')>=1],
['ss1','Flawless','Earn an SS rank: a full combo with 97%+ accuracy.',()=>nGr('SS')>=1],
['sss1','Perfectionist','Earn an SSS rank: every single note Perfect.',()=>nGr('SSS')>=1],
['ss25','Untouchable','Earn SS or better on 25 different levels.',()=>nGr('SS')>=25],
['sss10','Metronome','Earn SSS on 10 different levels.',()=>nGr('SSS')>=10],
['cb100','Hundred club','Reach a 100 combo.',r=>!!r&&r.maxc>=100],
['cb250','Unbroken','Reach a 250 combo.',r=>!!r&&r.maxc>=250],
['e50','Warm legs','Survive 50 beats in Endless.',()=>save.endBest>=50],
['e150','Marathon','Survive 150 beats in Endless.',()=>save.endBest>=150],
['e300','Ultramarathon','Survive 300 beats in Endless.',()=>save.endBest>=300],
['imp','Impossible','Clear a level on Impossible timing.',r=>rk(r)&&r.diff==4],
['spd','Speed demon','Clear a level at 150% speed or faster.',r=>rk(r)&&r.rate>=1.5],
['spd2','Double time','Clear a level at 200% speed.',r=>rk(r)&&r.rate>=2],
['ap','Nothing but perfect','Clear a level with the All Perfect modifier.',r=>rk(r)&&!!r.mo.ap],
['hd','Blindfolded','Clear a level with the Hidden modifier.',r=>rk(r)&&!!r.mo.hd],
['fr','Glass cannon','Clear a level with the Fragile modifier.',r=>rk(r)&&!!r.mo.fr],
['mr','Through the looking glass','Clear a level with the Mirror modifier.',r=>rk(r)&&!!r.mo.mr],
['tw','Needle threader','Clear a level with the Tight timing modifier.',r=>rk(r)&&!!r.mo.tw],
['lg','Legend','Reach the Legend title.',()=>total()>=2e5],
['map','Mapper','Chart a custom level with 20 or more notes.',null],
['exp','Sharing is caring','Share a level as a .otm file.',null],
['cimp','Community','Import a level from a .otm file.',null],
['sec','Something is waiting','Find the secret level.',()=>!!save.sec,1],
['secc','Behind the door','Clear the secret level.',()=>!!save.best[SEC],1]];
function checkAch(r,quiet){const got=[];for(const a of ACH){if(save.ach[a[0]]||!a[3])continue;let ok=false;try{ok=!!a[3](r||null)}catch(e){}if(ok){save.ach[a[0]]=Date.now();got.push(a)}}
 if(got.length){persist();if(!quiet)got.forEach(a=>toast('Achievement unlocked',a[1]))}}
function unlock(id){if(save.ach[id])return;const a=ACH.find(q=>q[0]==id);if(!a)return;save.ach[id]=Date.now();persist();toast('Achievement unlocked',a[1])}
function achScreen(){state='menu';ui.scrollTop=0;const n=ACH.filter(a=>save.ach[a[0]]).length;
 ui.innerHTML=`<div class="p" style="max-width:520px"><h1 style="font-size:28px">Achievements</h1><p><b>${n}</b> of ${ACH.length} unlocked</p><div class="achl">${ACH.map(a=>{const d=save.ach[a[0]],hid=a[4]&&!d;
  return `<div class="ach${d?' got':''}"><b>${d?'★':'☆'}</b><div><strong>${hid?'???':esc(a[1])}</strong><small>${hid?'Keep playing to find this one.':esc(a[2])}${d?' · '+new Date(d).toLocaleDateString():''}</small></div></div>`}).join('')}</div>
 <div class="row" style="margin-top:12px"><button class="main" data-a="menu">Back</button></div></div>`}

/* ================= LEVEL FILES (.otm) =================
   A level file is JSON that is gzip-compressed (browsers that can't compress write plain JSON, and import accepts both).
   Audio is never stored inside the file, only the song's name, so people pick their own copy of the song. */
const OTM_MAGIC='onetap-level',NT=['tap','hold','dbl','tri','roll','lift','decoy','ph'];
const gz=async t=>new Uint8Array(await new Response(new Blob([t]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
const gunz=async u8=>{const rd=new Blob([u8]).stream().pipeThrough(new DecompressionStream('gzip')).getReader(),parts=[];let n=0;
 for(;;){const{done,value}=await rd.read();if(done)break;n+=value.length;if(n>8e6){rd.cancel();throw new Error('That level file is too large.')}parts.push(value)}
 return new TextDecoder().decode(await new Blob(parts).arrayBuffer())};
const r5=v=>Math.round(v*1e5)/1e5;
function levelToFile(c){return{fmt:OTM_MAGIC,v:1,by:SYNC.acct?SYNC.acct.name:'',level:{name:c.name,bpm:c.bpm,off:c.off,beats:c.beats,si:c.si,audio:c.audio?1:0,audioName:c.audioName||'',dur:c.audio?r5(c.dur||0):0,
 notes:c.notes.map(o=>({b:r5(o.b),n:o.n,t:o.t,len:o.len?r5(o.len):0})),fl:c.fl,mods:c.mods}}}
async function shareLevel(i){const c=save.custom[i];if(!c)return;const json=JSON.stringify(levelToFile(c));let data;
 try{data=typeof CompressionStream==='function'?await gz(json):new TextEncoder().encode(json)}catch(e){data=new TextEncoder().encode(json)}
 const a=document.createElement('a'),nm=(c.name.replace(/[^\w\- ]+/g,'').trim().replace(/\s+/g,'_').slice(0,40)||'level')+'.otm';
 a.href=URL.createObjectURL(new Blob([data],{type:'application/octet-stream'}));a.download=nm;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);
 toast('Level saved',nm+(c.audio?' · the song isn’t included':''));unlock('exp')}
const clean=t=>String(t==null?'':t).replace(/[<>&"'`\u0000-\u001f]/g,'').trim();
function cleanLevel(l,by){if(!l||typeof l!=='object')throw new Error('That isn’t a One Tap level.');
 const num=(v,lo,hi,d)=>{v=+v;return Number.isFinite(v)?Math.min(hi,Math.max(lo,v)):d};
 if(!Array.isArray(l.notes)||!l.notes.length)throw new Error('That level has no notes.');if(l.notes.length>6000)throw new Error('That level has too many notes.');
 const beats=Math.round(num(l.beats,8,2000,64)),notes=[];
 for(const o of l.notes){if(!o||!NT.includes(o.t))continue;notes.push({b:num(o.b,0,beats,0),n:Math.round(num(o.n,0,13,7)),t:o.t,len:['hold','lift','roll'].includes(o.t)?num(o.len,.25,8,.5):0})}
 if(!notes.length)throw new Error('That level has no usable notes.');
 const f=l.fl&&typeof l.fl==='object'?l.fl:{},mods={};for(const m of MODS)if(l.mods&&l.mods[m[0]])mods[m[0]]=1;if(mods.nf){delete mods.fc;delete mods.ap}
 return{id:'c'+Date.now().toString(36)+Math.floor(Math.random()*1e4).toString(36),name:clean(l.name).slice(0,40)||'Imported level',bpm:num(l.bpm,40,300,120),off:num(l.off,0,600,0),beats,si:Math.round(num(l.si,0,S.length-1,0)),
  audio:l.audio?1:0,audioName:clean(l.audioName).slice(0,80),dur:l.audio?num(l.dur,0,7200,0):0,notes,
  fl:{r:[0,2,4,8].includes(+f.r)?+f.r:0,w:f.w?1:0,s:[0,.5,1].includes(+f.s)?+f.s:0,q:f.q?1:0},mods,by:clean(by).slice(0,24)}}
async function readLevelFile(file){if(file.size>4e6)throw new Error('That file is too big to be a level.');
 const u8=new Uint8Array(await file.arrayBuffer());let text;
 if(u8[0]===0x1f&&u8[1]===0x8b){if(typeof DecompressionStream!=='function')throw new Error('This browser can’t open compressed level files.');text=await gunz(u8)}else text=new TextDecoder().decode(u8);
 let d;try{d=JSON.parse(text)}catch(e){throw new Error('That file isn’t a One Tap level.')}
 if(!d||d.fmt!==OTM_MAGIC)throw new Error('That file isn’t a One Tap level.');return cleanLevel(d.level,d.by)}
const sig=c=>canon({bpm:c.bpm,off:c.off,beats:c.beats,an:c.audioName||'',notes:c.notes.map(o=>[r5(o.b),o.n,o.t,r5(o.len||0)])});
async function importFiles(fl){let ok=0,last='';
 for(const f of fl){try{const c=await readLevelFile(f),sg=sig(c);if(save.custom.some(q=>sig(q)===sg)){toast('Already in your list',c.name);continue}save.custom.push(c);ok++;last=c.name}
  catch(e){toast('Couldn’t import '+clean(f.name).slice(0,30),e.message||'Unreadable file')}}
 if(ok){persist();toast(ok>1?ok+' levels imported':'Level imported',ok>1?'They’re under Custom levels.':last+(save.custom[save.custom.length-1].audio?' · needs the song '+(save.custom[save.custom.length-1].audioName||''):''));unlock('cimp');if(state==='menu'&&$('.wrap'))menu()}}
function importPick(){const inp=document.createElement('input');inp.type='file';inp.multiple=true;inp.accept='.otm,.ot,application/octet-stream';inp.onchange=()=>importFiles([...inp.files]);inp.click()}
addEventListener('dragover',e=>e.preventDefault());
addEventListener('drop',e=>{e.preventDefault();const fl=e.dataTransfer&&[...e.dataTransfer.files];if(fl&&fl.length&&state==='menu'&&$('.wrap'))importFiles(fl)});
// imported levels point at a song the player has to supply themselves
let NA=null;
function needAudio(i,show,from,fromEd){const c=save.custom[i];state='menu';ui.scrollTop=0;NA={i,show,from,fromEd};
 ui.innerHTML=`<div class="p" style="max-width:420px"><h1 style="font-size:24px">Song needed</h1><p><b>${esc(c.name)}</b> was charted for <b>${esc(c.audioName||'a song')}</b>${c.dur?' ('+fmtT(c.dur)+')':''}. Level files don’t include the music, so pick your own copy of the song.</p><p class="nb" id="namsg" style="min-height:20px"></p>
 <div class="row"><button class="main" data-a="na_pick">Choose audio file…</button><button data-a="na_bk">Play without it</button><button data-a="${fromEd?'e_back':'menu'}">Back</button></div></div>`}
function naPick(){const inp=document.createElement('input');inp.type='file';inp.accept='audio/*,.mp3,.wav,.ogg,.m4a';
 inp.onchange=async()=>{const f=inp.files[0];if(!f||!NA)return;const c=save.custom[NA.i],m=$('#namsg');if(m)m.textContent='Decoding audio…';
  try{actx();const bytes=await f.arrayBuffer(),b=await ac.decodeAudioData(bytes.slice(0));MEM[c.id]=bytes;try{await idbPut(c.id,bytes)}catch(e){}ABUF[c.id]=b;PK[c.id]=mkPeaks(b);if(!c.dur)c.dur=b.duration;persist();const n=NA;NA=null;playCustom(n.i,n.show,n.from,n.fromEd)}
  catch(e){const m2=$('#namsg');if(m2)m2.textContent='Could not read that file. Try an MP3, WAV or OGG.'}};inp.click()}
checkAch(null,true); // quietly credit progress made before achievements existed
applyTheme();menu();

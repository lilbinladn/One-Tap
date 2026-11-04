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
const MAXBPM=1000;
// how much each modifier raises (or lowers) the star rating; speed is applied by scaling the level's BPM
const MSTAR={fc:1.1,ap:1.3,fr:1.1,tw:1.15,hd:1.15,mr:1.03,ez:.9,dr:1.1,hh:1.1,nf:1};
const starsAt=(l,rt,m)=>{const[a,bpm,subs,p,f]=l,f2=Object.assign({},f);if(f.t)f2.t=f.t.map(q=>[q[0],q[1]*rt]);let s=stars([a,bpm*rt,subs,p,f2]);for(const k in MSTAR)if(m&&m[k]&&!(m.ap&&k=='fc'))s*=MSTAR[k];return s};
const tier=i=>{const s=starsAt(L[i],save.spd||1,save.mods),t=TR.filter(a=>s>=a[0]).pop();return{n:t[1],c:t[2],s,b:stars(L[i])}};
// modifiers: key, name, description, score multiplier, short tag
const MODS=[['fc','Full Combo','Any combo break fails the run (miss, stray tap, decoy, early release).',1.25,'FC'],['ap','All Perfect','Every hit must be Perfect. Anything else fails the run.',1.5,'AP'],['fr','Fragile','Damage is doubled and hits no longer heal you.',1.15,'FR'],['tw','Tight timing','Hit windows are 30% smaller.',1.2,'TT'],['hd','Hidden','Every note fades out before it reaches the ring.',1.2,'HD'],['mr','Mirror','Notes come from the opposite side.',1.05,'MR'],['ez','Forgiving','Damage is halved and hits heal you 50% more. Can’t be combined with Fragile.',.8,'FG'],['dr','Drain','Your health slowly drains all the way through the level. Hits heal you back.',1.2,'DR'],['hh','Half health','You start at 50% health and can never heal above it.',1.15,'HH'],['nf','No Fail','Your health can’t run out, so you can always finish the level. No score is earned and the run isn’t ranked. Turns off Full Combo and All Perfect.',0,'NF']];
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
// Every area is ordered from easiest to hardest. L0ID/PERM let old saves (which used the old order) be moved over.
const L0ID=L.map(l=>l[6]),PERM=(()=>{const Lo=L.slice(),P=Lo.map((_,i)=>i);for(const[a,b]of[[0,A1],[A1,100],[100,150],[150,NL]]){const ix=[];for(let i=a;i<b;i++)ix.push(i);ix.sort((p,q)=>stars(Lo[p])-stars(Lo[q])||p-q);ix.forEach((o,k)=>{L[a+k]=Lo[o];P[o]=a+k})}return P})();
const srng=(a,b)=>{let lo=1e9,hi=0;for(let i=a;i<b;i++){const q=stars(L[i]);lo=Math.min(lo,q);hi=Math.max(hi,q)}return '★'+lo.toFixed(1)+' to ★'+hi.toFixed(1)};
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
save.st=Object.assign({snd:1,vol:.5,hot:'',ring:'',theme:'auto',fx:1,ar:1,tt:1,fps:1,syn:2},save.st);
save.mods=Object.assign({fc:0,ap:0,fr:0,tw:0,hd:0,mr:0,ez:0,dr:0,hh:0,nf:0},save.mods);if(typeof save.spd!=='number'||!(save.spd>=.5&&save.spd<=2))save.spd=SL[save.slow]||1;if(!Array.isArray(save.custom))save.custom=[];if(!save.ach||typeof save.ach!=='object'||Array.isArray(save.ach))save.ach={};
const persist=()=>{save.ts=Date.now();try{localStorage.setItem('onetap2',JSON.stringify(save))}catch(e){}syncDirty()};
if(!save.v||save.v<3){ // levels were re-ordered (100 campaign levels now): move old saves to the new positions
 if(save.best[29]&&save.unlocked<31)save.unlocked=31;
 const mp=o=>{const j=L0ID.indexOf(o);return j<0?0:j},nb2={};
 for(const k in save.best)nb2[mp(+k)]=save.best[k];save.best=nb2;save.runs.forEach(r=>r.l=mp(r.l));
 save.unlocked=Math.min(NL,mp(Math.max(0,Math.min(save.unlocked,60)-1))+1);save.v=3;persist()}
if(save.v<4){if(save.best[100]){save.best[200]=save.best[100];delete save.best[100]}save.runs.forEach(r=>{if(r.l===100)r.l=200});save.v=4;persist()}
function reorder(o){const m=i=>PERM[i]!=null?PERM[i]:i,b={};for(const k in o.best||{})b[m(+k)]=o.best[k];o.best=b;(o.runs||[]).forEach(r=>{r.l=m(r.l)});
 const hi=Math.max(-1,...Object.keys(b).map(Number).filter(k=>k<NL));o.unlocked=Math.max(Math.min(o.unlocked||1,NL),Math.min(NL,hi+2));o.v=5}
if(save.v<5){reorder(save);persist()}
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
function prac(v){const B=nB(v);ui.innerHTML=`<div class="p"><h1 style="font-size:26px">Practice</h1><p>Level ${v+1}: ${L[v][5]}. Choose where to start. Health can’t run out in practice.</p><label>Start at beat <b id="pv">0</b> of ${B}<br><input id="pb" type="range" min="0" max="${B-8}" step="2" value="0"></label><div class="row" style="margin-top:14px"><button class="main" data-a="pgo" data-v="${v}">Start</button><button data-a="menu">Back</button></div></div>`;$('#pb').oninput=e=>$('#pv').textContent=e.target.value}
const ms={u:0,s:0,l:0},keep=()=>{const s=$('.side'),l=$('.list');if(s&&l){ms.s=s.scrollTop;ms.l=l.scrollTop;ms.u=ui.scrollTop}};
function menu(){keep();if(ED&&ED.play)edStop(true);cancelAnimationFrame(edRaf);stopCA();EDI=null;state='menu';ui.style.touchAction='';cancelAnimationFrame(raf);if(master)master.gain.value=0;killAudio();x.clearRect(0,0,W,H);
 const cd=i=>{const l=L[i],b=save.best[i],lock=false,tr=tier(i),th=i>=A1&&i<NL?' style="border-left-color:'+TH[thOf(i)][3]+'"':i==SEC?' style="border-left-color:#ff1a1a"':'';return `<button class="card" data-a="lv" data-v="${i}"${lock?' disabled':''}${th}><b>${i+1}</b><span>${l[5]}<i>${S[l[0]][0]} · ${l[1]} BPM · ${mech(l[4])}${b?' · best '+b.s.toLocaleString()+(b.f?' · FC':''):''}</i></span><u style="background:${tr.c}" title="Base ★${tr.b.toFixed(1)}${tr.s.toFixed(1)!==tr.b.toFixed(1)?' · with your speed and modifiers ★'+tr.s.toFixed(1):''}">★${tr.s.toFixed(1)}</u>${b?`<em${b.g.length>1?' class="g'+b.g.length+'"':''}>${b.g}</em>`:''}</button>`},rg=(a,b)=>{let o='';for(let i=a;i<b;i++)o+=cd(i);return o};
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
 <div class="listwrap"><div class="listhead"><div class="row">${seg('on',['Campaign','Online'],save.on?1:0)}</div><p class="hint">${save.on?'Levels picked by the community team.':'Levels in every area run from easiest to hardest.'}</p></div><div class="list" id="onl">${save.on?onlHTML():`<h2>Area 1: Downbeat · ${A1} levels · ${srng(0,A1)}</h2>${rg(0,A1)}<h2>Area 2: Afterglow · 50 levels · ${srng(A1,100)}</h2>${rg(A1,100)}<h2>Area 3: Dreamstate · 50 levels · ${srng(100,150)}</h2>${rg(100,150)}<h2>Area 4: Zenith · 50 levels · ${srng(150,NL)}</h2>${rg(150,NL)}${save.sec?'<h2 style="color:#ff1a1a">Something is waiting</h2>'+cd(SEC):''}<h2>Custom levels · ${save.custom.length}</h2>${save.custom.map(ccd).join('')||'<p>Nothing here yet. Open the level editor to chart your own, or import a .otm level someone sent you.</p>'}<div class="row" style="margin:8px 0"><button class="main" data-a="cnew">+ New level</button><button data-a="cimp">Import level…</button></div><p class="hint">Share a level with the Share button. It saves a small .otm file. Import one here or drop it anywhere on this screen.</p>`}</div></div></div>`;
 const s2=$('.side'),l2=$('.list');if(s2&&l2){s2.scrollTop=ms.s;l2.scrollTop=ms.l;ui.scrollTop=ms.u}
 if(save.on){CM.k=onlKey();if(cmOK()&&!CM.loaded&&!CM.busy)cmLoad()}
 $('#spd').oninput=e=>{save.spd=Math.round(+e.target.value)/100;$('#spv').textContent=e.target.value};$('#spd').onchange=()=>{persist();menu()}}
function rankings(){state='menu';const runs=save.runs.map((r,i)=>`<tr><td>${i+1}</td><td>Lv ${r.l+1} ${L[r.l][5]}</td><td>${DN[r.d]}${r.m?' · '+r.m:''}</td><td>${r.s.toLocaleString()}</td><td>${r.a}% ${r.g}</td></tr>`).join('')||'<tr><td colspan=5>No ranked runs yet. Clear a level at full speed.</td></tr>';
 ui.innerHTML=`<div class="p"><h1>${title()}</h1><p>Total score ${Math.round(total()).toLocaleString()}. Next title at ${(TITLES.find(a=>a[0]>total())||[0,'max'])[0].toLocaleString()||''}. Scores are multiplied by timing difficulty (Easy ×0.5 up to Impossible ×2.5), plus bonuses for faster speeds and modifiers.<br>Grades: S is 97%+ accuracy. SS needs a full combo at 97%+. SSS needs every note Perfect. Practice runs don’t count.</p>
 <table><tr><th>#</th><th>Level</th><th>Mode</th><th>Score</th><th>Acc</th></tr>${runs}</table><div class="row"><button data-a="menu">Back</button></div></div>`}
function start(i,show,from){if(i==END){ES=Date.now()&0xfffffff;L[END]=[[0,1,2,3,4,5,6,7,8,9,11,12,13,14][Math.floor(Math.random()*14)],100,[1,2,2,4],.55,{h:.2,x:.15,d:.25,t:Array.from({length:24},(_,k)=>[16*(k+1),Math.min(220,105+k*5)])},'Endless']}
 SH=!!show;ac=ac||new (window.AudioContext||window.webkitAudioContext)();ac.resume();
 if(!nb){nb=ac.createBuffer(1,ac.sampleRate>>1,ac.sampleRate);const d=nb.getChannelData(0);for(let k=0;k<d.length;k++)d[k]=Math.random()*2-1}
 if(master)master.gain.value=0;killAudio();
 lv=i;LV=i==CUS?40:i==END?60:i==SEC?100:Math.min(i,100);const CA=i==CUS&&!!CAB,[si,bpm,,,f]=L[i];F=f;PS=from||0;const Bs=PS>0?PS+2:0;rate=save.spd;mo=Object.assign({},save.mods,i==CUS?CL.mods:{});SMUL=DS[save.diff]*mulOf(mo,rate);
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
 if(save.st.hot)cols.hot=save.st.hot;if(save.st.ring)cols.ring=save.st.ring;HM=mo.hh?50:100;hp=HM;LT=performance.now();combo=0;maxc=0;pts=0;hn=null;brk=0;why='';st={P:0,G:0,M:0,S:0};fb=null;HC={};state='play';ui.innerHTML='';ui.style.touchAction='none';
 cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
const now=()=>ac.currentTime-t0-save.off/1000;
const say=(t,c)=>{fb={t,c,at:performance.now()}};
let HM=100,LT=0;const DRAIN=2.5; // HM = max health (Half health mod), LT = last frame time, DRAIN = health lost per second with the Drain mod
const hurt=a=>{brk++;hp=Math.max((PS||mo.nf)?1:0,hp-a*.6*(mo.fr?2:1)*(mo.ez?.5:1));combo=0;gw=gw0;if(mo.fc||mo.ap){hp=0;why='Combo broken'}};
function award(o,bd,n){const per=bd<=pw;o.j=per?'P':'G';st[o.j]++;combo++;maxc=Math.max(maxc,combo);hp=Math.min(HM,hp+(mo.fr?0:(per?2.5:1)*(mo.ez?1.5:1)));if(mo.ap&&!per){hp=0;why='Not a Perfect hit'}if(F.q){gw=gw0*(1-Math.min(combo,40)*.006);pw=gw*.4}
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
function loop(){if(state!=='play')return;const n=now(),pn=performance.now(),dl=Math.min(.1,Math.max(0,(pn-LT)/1000));LT=pn;
 if(mo.dr&&!SH&&hp>0&&bt(n)>=4){hp=Math.max((PS||mo.nf)?1:0,hp-DRAIN*dl);if(hp<=0&&!why)why='Health drained'}
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
 const bw=Math.min(340,W-40),hk=Math.round(bpm);if(HC.k!==hk){HC.k=hk;HC.a=`${lv==END?'':lv==CUS?'Custom: ':'Level '+(lv+1)+': '}${L[lv][5]}${lv==END?'':'  ·  '+(lv==CUS?'★'+custStars(CL,rate).toFixed(1):'★'+tier(lv).s.toFixed(1))}  ·  ${lv==CUS?(CL.audioName||'Built-in backing'):S[L[lv][0]][0]}  ·  ${hk} BPM`;HC.b=(SH?'Showcase: music + click pattern  ·  ':'')+mech(F)+(rate!=1?`  ·  ${Math.round(rate*100)}% speed${rate<1?', unranked':''}`:'')+mnames()}x.fillStyle='#000';x.globalAlpha=.35;x.fillRect(16,14,bw+8,18);x.globalAlpha=1;x.fillStyle=hp>35?ring:hot;x.fillRect(20,18,bw*hp/100,10);
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
function end(win){ui.style.touchAction='';if(SH){state='end';master.gain.setTargetAtTime(0,ac.currentTime,.05);fadeKill();ui.innerHTML=`<div class="p"><h1 style="font-size:26px">Showcase done</h1><p>${lv==CUS?'Custom':'Level '+(lv+1)}: ${esc(L[lv][5])}. Ticks are beats and clicks are notes. Rolls click fast, holds click twice, decoys stay silent.</p><div class="row"><button class="main" data-a="playit">Play it</button><button data-a="replay">Replay showcase</button><button data-a="menu">Levels</button></div></div>`;return}
 if(lv==END){state='end';master.gain.setTargetAtTime(0,ac.currentTime,.05);fadeKill();const bs=Math.max(0,Math.floor(bt(now())-4)),old=save.endBest,nb=rate>=1&&!mo.nf&&bs>old;if(nb)save.endBest=bs;persist();checkAch({endless:1,maxc,rate,mo,diff:save.diff,pr:!!PS});
  ui.innerHTML=`<div class="p"><p class="big" style="color:var(--hot)">${bs}</p><h1 style="font-size:24px">beats survived</h1>${nb?'<div class="nb">★ NEW BEST ★'+(old?'<br>Previous best: '+old:'')+'</div>':''}<p>${Math.round(pts).toLocaleString()} pts · best ${save.endBest} beats${rate>=1?'':' (slowed, not ranked)'}</p><div class="row"><button class="main" data-a="retry">Again</button><button data-a="menu">Menu</button></div></div>`;return}
 state='end';master.gain.setTargetAtTime(0,ac.currentTime,.05);fadeKill();
 const tot=notes.filter(o=>!o.decoy).length,acc=Math.round((st.P+.7*st.G)/tot*100),pc=win&&brk==0,g=pc&&st.G==0&&acc>=97?'SSS':pc&&acc>=97?'SS':gAcc(acc),sc=Math.round(pts),ranked=rate>=1&&!mo.nf,ml=modLabel();
 let nbm=[];
 if(win&&lv!=CUS){if(lv==NL-1)save.sec=1;save.unlocked=Math.max(save.unlocked,Math.min(NL,lv+2));
  if(ranked&&!PS){const b=save.best[lv],nw={s:Math.max(b?b.s:0,sc),a:Math.max(b?b.a:0,acc),c:Math.max(b&&b.c||0,maxc),d:b&&b.s>=sc?b.d:save.diff,m:b&&b.s>=sc?b.m||'':ml,f:(b&&b.f)||(brk==0?1:0)};nw.g=GR[Math.max(GR.indexOf(gAcc(nw.a)),GR.indexOf(b&&b.g||'D'),GR.indexOf(g))];if(GR.indexOf(g)>=5&&GR.indexOf(g)>GR.indexOf(b&&b.g||'D'))nbm.push('New rank: '+g);
   if(!b)nbm.push('First clear!');else{if(sc>b.s)nbm.push('Score +'+(sc-b.s).toLocaleString());if(acc>b.a)nbm.push('Accuracy '+b.a+'% → '+acc+'%');if(b.c&&maxc>b.c)nbm.push('Combo '+b.c+' → '+maxc)}
   save.best[lv]=nw;save.runs.push({l:lv,d:save.diff,s:sc,a:acc,g,m:ml});save.runs.sort((p,q)=>q.s-p.s);save.runs=save.runs.slice(0,10)}persist()}
 checkAch({win,lv,g,acc,maxc,rate,diff:save.diff,mo:Object.assign({},mo),pr:!!PS,ranked,custom:lv==CUS});
 ui.innerHTML=`<div class="p"><p class="big${win&&g.length>1?' g'+g.length:''}" style="color:${win?'var(--ok)':'var(--hot)'}">${win?g:'Failed'}</p>
 <h1 style="font-size:24px">${win?(lv==CUS?'Custom level':'Level '+(lv+1))+' cleared':(why||'Health ran out')}</h1>${nbm.length?'<div class="nb">★ NEW BEST ★<br>'+nbm.join(' · ')+'</div>':''}
 <p>${mo.nf?'No score (No Fail)':sc.toLocaleString()+' pts'} on ${DN[save.diff]}${ml?' + '+ml:''}${PS?' (practice, not ranked)':mo.nf?' (not ranked)':ranked?'':' (slowed, not ranked)'}<br>${st.P} perfect, ${st.G} good, ${st.M} missed, ${st.S} stray taps · ${acc}% · best combo ${maxc}</p>
 <div class="row"><button class="main" data-a="retry">Retry</button>${win&&lv<NL-1?'<button data-a="next">Next level</button>':''}${lv==CUS&&EDI!=null?'<button data-a="e_back">Back to editor</button>':''}<button data-a="replay">Showcase</button><button data-a="menu">Levels</button><button data-a="rank">Rankings</button></div></div>`}
ui.onclick=e=>{const b=e.target.closest('button');if(!b)return;b.blur();keep();const a=b.dataset.a,v=+b.dataset.v;
 if(a&&a.startsWith('cal_')){calAct(a);return}if(a&&a.startsWith('e_'))edAct(a,b);else if(a&&a.startsWith('cm_'))commAct(a,b);else if(a&&(a.startsWith('fr_')||a.startsWith('lb_')))socAct(a,b);else if(a=='ach')achScreen();else if(a=='cimp')importPick();else if(a=='cshr')shareLevel(v);else if(a=='na_pick')naPick();else if(a=='na_bk'){const n=NA;NA=null;if(n)playCustom(n.i,n.show,n.from,n.fromEd,1)}else if(a=='cnew')editor(-1);else if(a=='ced')editor(v);else if(a=='clv')playCustom(v,save.sc);else if(a=='cdel')cdel(v);else if(a=='lv'){if(save.pr)prac(v);else start(v,save.sc)}else if(a=='set')settings();else if(a=='test')pvw();else if(a=='snd'){save.st.snd=v;persist();settings();pvw()}else if(a=='hot'||a=='ring'){save.st[a]=v<0?'':CP[v];persist();settings()}else if(a=='theme'){save.st.theme=['auto','light','dark'][v];persist();applyTheme();settings()}else if(a=='fx'){save.st.fx=v;persist();settings()}else if(a=='ar'){save.st.ar=v;persist();settings()}else if(a=='tt'){save.st.tt=v;persist();settings()}else if(a=='fps'){save.st.fps=v;persist();settings()}else if(a=='syn'){save.st.syn=[1,2,3,5][v]||2;persist();settings()}else if(a=='pr'){save.pr=!!v;persist();menu()}else if(a=='endless')start(END);else if(a=='pgo')start(v,save.sc,+$('#pb').value);else if(a=='sc'){save.sc=!!v;persist();menu()}else if(a=='playit')start(lv,false,PS);else if(a=='replay')start(lv,true,PS);else if(a=='diff'){save.diff=v;persist();menu()}else if(a=='slow'){save.slow=v;persist();menu()}else if(a=='on'){save.on=!!v;persist();menu()}
 else if(a=='mod'){{const k=b.dataset.k,M=save.mods;M[k]=M[k]?0:1;if(M[k]){if(k=='nf'){M.fc=0;M.ap=0}else if(k=='fc'||k=='ap')M.nf=0;if(k=='ez')M.fr=0;if(k=='fr')M.ez=0}persist();menu()}}else if(a=='rank')rankings();else if(a=='menu')menu();else if(a=='retry')start(lv,false,PS);else if(a=='next')start(lv+1);else if(a=='acct')acctScreen();else if(a=='a_login')doAuth(false);else if(a=='a_reg')doAuth(true);else if(a=='a_mode')acctScreen(v?'up':'in');else if(a=='a_uname')nameScreen();else if(a=='a_nameok')doName();else if(a=='a_out')logout();else if(a=='a_pw')pwScreen();else if(a=='a_pwok')doPw();else if(a=='a_reset')doReset();else if(a=='sync')syncNow();else if(a=='p_resume')resumeGame();else if(a=='p_retry')pauseRetry();else if(a=='p_quit')pauseQuit();else if(a=='p_tt'){save.st.tt=save.st.tt===0?1:0;persist();showPause()}};
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
/* ================= LEVEL EDITOR ================= */
let ED=null,edRaf=0;
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const ABUF={},PK={},MEM={},TOP=78;
const SNP=[1,2,3,4,6,8,12];
const TOOLS=[['tap','Tap','Single tap. Key 1'],['hold','Hold','Press, hold, release at the end. Drag the end to resize. Key 2'],['dbl','Double','Two quick taps. Key 3'],['tri','Triple','Three quick taps. Key 4'],['roll','Roll','Mash taps along the bar. Drag the end to resize. Key 5'],['lift','Lift','Hold, then release exactly at the end. Key 6'],['decoy','Decoy','The player must NOT tap this. Key 7'],['rb','Rebound','A tap that bounces back off the ring first. The player taps when it returns. Key 8'],['sg','Stutter','A tap that pauses mid-flight, then keeps going. Key 9'],['scl','Scatter ◀','A tap that arrives from the LEFT side. Key 0'],['scr','Scatter ▶','A tap that arrives from the RIGHT side. Key -'],['select','Select','Click a note to select it, drag to move it. Key S'],['erase','Erase','Click notes to delete them. Key E (or right-click any time)']];
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
 else if(o.t=='dbl')r.dbl=1;else if(o.t=='tri')r.dbl=2;else if(o.t=='ph')r.ph=1;else if(o.t=='decoy')r.decoy=1;else if(o.t=='rb')r.rb=.75;else if(o.t=='sg')r.sg=1;else if(o.t=='scl')r.sx=-1;else if(o.t=='scr')r.sx=1;return r})}
async function playCustom(i,show,from,fromEd,noAud){const c=save.custom[i];if(!c||!c.notes.length)return;actx();CL=c;EDI=fromEd?i:null;CAB=null;
 if(c.audio&&!noAud){try{CAB=await loadAudio(c)}catch(e){return needAudio(i,show,from,fromEd)}}
 const f={};if(c.fl.r)f.r=c.fl.r;if(c.fl.w)f.w=1;if(c.fl.s)f.s=c.fl.s;if(c.fl.q)f.q=1;if(c.notes.some(o=>o.t=='scl'||o.t=='scr'))f.sc=1;if(c.notes.some(o=>o.t=='rb'))f.rb=1;if(c.notes.some(o=>o.t=='sg'))f.sg=1;
 L[CUS]=[c.si,c.bpm,[1],0,f,c.name,9999];start(CUS,show,from)}
function ccd(c,i){return `<div class="crow"><button class="card" data-a="clv" data-v="${i}"${c.notes.length?'':' disabled'} style="border-left-color:var(--ok)"><b>★</b><span>${esc(c.name)}<i>${c.audioName?esc(c.audioName):'Built-in backing'} · ${c.bpm} BPM · ${c.notes.length} notes${c.by?' · by '+esc(c.by):''}</i></span>${cbadge(c)}</button><button data-a="ced" data-v="${i}">Edit</button><button data-a="cshr" data-v="${i}" title="Save as a .otm level file you can send to anyone">Share</button><button data-a="cdel" data-v="${i}">${delArm===i?'Sure?':'✕'}</button></div>`}
function cdel(i){if(delArm!==i){delArm=i;menu();return}const c=save.custom[i];save.custom.splice(i,1);(save.cdel=save.cdel||[]).push(c.id);if(save.cdel.length>200)save.cdel.shift();delete ABUF[c.id];delete PK[c.id];delete MEM[c.id];idbDel(c.id);delArm=-1;persist();menu()}

// ---- editor model helpers
const edX=b=>(b-ED.sc)*ED.zoom,edB=px=>px/ED.zoom+ED.sc;
const snapB=b=>Math.round(b*ED.snap)/ED.snap;
const rowH=h=>Math.max(12,(h-TOP)/14);
const pitchAt=(py,h)=>Math.max(0,Math.min(13,13-Math.floor((py-TOP)/rowH(h))));
const occ=o=>{const m=ED?Math.min(.25,1/ED.snap):.25;return o.t==='tri'?1:o.t==='dbl'?.5:o.t==='rb'?.75:Math.max(m,(o.len||0)+m)};
function fitsG(o){if(o.b<0||o.b>ED.c.beats)return false;const a0=o.b,a1=o.b+occ(o);for(const p of ED.c.notes){if(ED.ms.has(p))continue;const b0=p.b,b1=p.b+occ(p);if(a0<b1-1e-6&&b0<a1-1e-6)return false}return true}
function fits(o,ig){if(o.b<0||o.b>ED.c.beats)return false;const a0=o.b,a1=o.b+occ(o);for(const p of ED.c.notes){if(p===o||p===ig)continue;const b0=p.b,b1=p.b+occ(p);if(a0<b1-1e-6&&b0<a1-1e-6)return false}return true}
const edBeat=()=>ED.play?ED.ph0+(ac.currentTime-ED.at0)*ED.c.bpm/60:ED.ph;
const minPh=()=>ED.c.audio?-ED.c.off*ED.c.bpm/60:0;
const edFit=()=>{const c=ED.c;if(c.audio&&c.dur)c.beats=Math.max(8,Math.floor((c.dur-c.off)*c.bpm/60));persist()};
const edf=n=>{const sd=S[ED.c.si],q=sd[2][((n%7)+7)%7]+12*Math.floor(n/7);return 440*2**((sd[1]+12+q-69)/12)};
const edBlip=n=>{try{tone(edf(n),ac.currentTime,.16,S[ED.c.si][4],.14)}catch(e){}};
function delNote(o){const a=ED.c.notes;const i=a.indexOf(o);if(i>=0)a.splice(i,1);if(ED.sel===o)ED.sel=null;ED.ms.delete(o);persist()}
function delSel(){const a=ED.c.notes;for(const o of[...ED.ms]){const i=a.indexOf(o);if(i>=0)a.splice(i,1)}ED.ms.clear();ED.sel=null;persist();edPanel()}
function edPlay(){const c=ED.c,b=ABUF[c.id];edStop(true);ED.play=true;ED.ph0=ED.ph;ED.at0=ac.currentTime+.08;ED.sched=ED.ph-1e-6;
 if(b){const T=c.off+ED.ph*60/c.bpm,s=ac.createBufferSource();s.buffer=b;s.connect(master);if(T>=0){if(T<b.duration)s.start(ED.at0,T)}else s.start(ED.at0-T,0);ED.src=s}}
function edStop(keep){if(ED.src){try{ED.src.stop()}catch(e){}ED.src=null}if(ED.play&&!keep)ED.ph=edBeat();ED.play=false}
function seekTo(b){const wp=ED.play;if(wp)edStop();ED.ph=Math.max(minPh(),b);const vw=ED.cv?ED.cv.clientWidth/ED.zoom:10;if(ED.ph<ED.sc||ED.ph>ED.sc+vw)ED.sc=ED.ph-vw*.2;if(wp)edPlay()}
const clampSc=()=>{ED.sc=Math.max(-2,Math.min(ED.c.beats,ED.sc))};
function setBpm(v){const c=ED.c;v=Math.round(v*100)/100;if(!(v>=40&&v<=MAXBPM)){edPanel();return}const wp=ED.play;if(wp)edStop();c.bpm=v;edFit();if(wp)edPlay();edPanel()}
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
 else if(a=='e_mod'){const k=b.dataset.k;if(c.mods[k])delete c.mods[k];else{c.mods[k]=1;if(k=='ez')delete c.mods.fr;if(k=='fr')delete c.mods.ez;if(k=='nf'){delete c.mods.fc;delete c.mods.ap}if(k=='fc'||k=='ap')delete c.mods.nf}persist();edPanel()}
 else if(a=='e_play'){ED.play?edStop():edPlay()}
 else if(a=='e_met'){ED.met=ED.met?0:1;b.classList.toggle('sel',!!ED.met)}
 else if(a=='e_ns'){ED.ns=ED.ns?0:1;b.classList.toggle('sel',!!ED.ns)}
 else if(a=='e_tap'){const t=performance.now();if(ED.taps.length&&t-ED.taps[ED.taps.length-1]>2000)ED.taps=[];ED.taps.push(t);ED.taps=ED.taps.slice(-9);
  if(ED.taps.length>=3){const q=ED.taps,avg=(q[q.length-1]-q[0])/(q.length-1),bpm=Math.round(60000/avg*10)/10;if(bpm>=40&&bpm<=MAXBPM){c.bpm=bpm;edFit();$('#ebpm').value=bpm}}}
 else if(a=='e_half')setBpm(c.bpm/2);else if(a=='e_dbl')setBpm(c.bpm*2);
 else if(a=='e_o-')setOff(c.off-.01);else if(a=='e_o+')setOff(c.off+.01);
 else if(a=='e_oh'){const T=c.off+edBeat()*60/c.bpm;const wp=ED.play;if(wp)edStop();c.off=Math.max(0,Math.round(T*1000)/1000);ED.ph=0;edFit();ED.sc=-.5;if(wp)edPlay();edPanel()}
 else if(a=='e_test')edTest(0);
 else if(a=='e_testph'){const f=Math.floor(edBeat());edTest(f>=1&&f<c.beats-4?f:0)}
 else if(a=='e_clear'){if(ED.clr){c.notes.length=0;ED.sel=null;ED.ms.clear();ED.clr=0;persist()}else ED.clr=1;edPanel()}
 else if(a=='e_all'){ED.ms=new Set(c.notes);ED.sel=c.notes[c.notes.length-1]||null;edPanel()}
 else if(a=='e_none'){ED.ms.clear();ED.sel=null;edPanel()}
 else if(a=='e_delsel')delSel();
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
 <label>BPM <input type="number" id="ebpm" min="40" max="${MAXBPM}" step="0.01" value="${c.bpm}"></label>
 <div class="row" style="margin-top:6px"><button data-a="e_tap">Tap tempo</button><button data-a="e_half">÷2</button><button data-a="e_dbl">×2</button></div>
 <label>First beat at <input type="number" id="eoff" min="0" step="0.001" value="${c.off.toFixed(3)}"> s</label>
 <div class="row" style="margin-top:6px"><button data-a="e_o-">−10 ms</button><button data-a="e_o+">+10 ms</button>${c.audio&&has?'<button data-a="e_oh">First beat = playhead</button>':''}</div>
 ${c.audio&&has?`<p>Length: <b>${c.beats}</b> beats, from the song. Changing BPM or the first beat keeps your notes on the same beats.</p>`:`<label>Length <input type="number" id="ebt" min="8" max="2000" step="4" value="${c.beats}"> beats</label>`}
 <p>Turn on the metronome, press Play, and adjust until the ticks sit on the song's beat.</p>
 <h2>Note type</h2><div class="row">${TOOLS.map(t=>`<button data-a="e_tool" data-v="${t[0]}" class="${ED.tool==t[0]?'sel':''}">${t[1]}</button>`).join('')}</div>
 <p>${tl[2]}</p>
 <h2>Snap</h2><div class="row">${SNP.map(d=>`<button data-a="e_snap" data-v="${d}" class="${ED.snap==d?'sel':''}">1/${d}</button>`).join('')}</div><label style="margin-top:6px">Custom 1/<input type="number" id="esnc" min="1" max="64" step="1" value="${SNP.includes(ED.snap)?'':ED.snap}" placeholder="n" style="width:70px"></label>
 <h2>Level mechanics</h2>
 <label style="margin-top:2px">Flip sides</label><div class="row">${seg('e_flip',['Off','2 beats','4 beats','8 beats'],[0,2,4,8].indexOf(c.fl.r))}</div>
 <label>Wavy track</label><div class="row">${seg('e_wavy',['Off','On'],c.fl.w?1:0)}</div>
 <label>Spin</label><div class="row">${seg('e_spin',['Off','Low','High'],c.fl.s?(c.fl.s>.5?2:1):0)}</div>
 <label>Squeeze (hit window tightens as combo grows)</label><div class="row">${seg('e_sq',['Off','On'],c.fl.q?1:0)}</div>
 <h2>Forced modifiers</h2><div class="row">${MODS.map(m=>`<button data-a="e_mod" data-k="${m[0]}" title="${m[2]}" class="${c.mods[m[0]]?'sel':''}">${m[1]}</button>`).join('')}</div>
 <p>${MODS.filter(m=>c.mods[m[0]]).map(m=>'<b>'+m[1]+'</b>: '+m[2]).join('<br>')||'Rules that are always on when this level is played.'}</p>
 <h2 id="ecnt">${c.notes.length} notes${ED.ms.size?' · '+ED.ms.size+' selected':''}</h2><p id="erate">${ratingHTML(c)}</p>
 <div class="row"><button data-a="e_all">Select all</button><button data-a="e_none"${ED.ms.size?'':' disabled'}>Deselect</button><button data-a="e_delsel"${ED.ms.size?'':' disabled'}>Delete selected</button></div>
 <p class="hint" style="margin-top:6px">Shift-click notes, or drag a box (Select tool, or Shift+drag), to select several. Drag any selected note to move them all together. Ctrl+A selects everything.</p>
 <div class="row"><button class="main" data-a="e_test">Test level</button><button data-a="e_testph">Test from playhead</button></div>
 <div class="row" style="margin-top:8px"><button data-a="e_clear">${ED.clr?'Sure?':'Clear notes'}</button><button class="main" data-a="e_done">Done</button></div>`;
 $('#enm').oninput=e=>{c.name=e.target.value||'Untitled';persist()};
 $('#ebpm').onchange=e=>setBpm(+e.target.value);
 $('#eoff').onchange=e=>setOff(+e.target.value);
 const bt=$('#ebt');if(bt)bt.onchange=e=>{c.beats=Math.max(8,Math.min(2000,Math.round(+e.target.value||64)));persist();edPanel()};
 $('#esi').onchange=e=>{c.si=+e.target.value;persist()};
 $('#efile').onchange=e=>{const f=e.target.files[0];if(f)edImport(f)};
 $('#esnc').onchange=e=>{const v=Math.round(+e.target.value);if(v>=1&&v<=64)ED.snap=v;edPanel()}}
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
  else{g.fillStyle=o.t=='lift'?C.ok:o.t=='roll'?C.ring:C.hot;g.globalAlpha=o.t=='ph'?.35:1;g.beginPath();g.arc(a1,y,rad,0,7);g.fill();g.globalAlpha=1;g.strokeStyle=o.t=='rb'?'#ffd24a':o.t=='sg'?'#7be04f':'#fff';g.lineWidth=2;if(o.t=='ph')g.setLineDash([3,3]);g.stroke();g.setLineDash([]);
   const rg=o.t=='dbl'?1:o.t=='tri'?2:0;for(let q=0;q<rg;q++){g.strokeStyle=C.ring;g.lineWidth=2;g.beginPath();g.arc(a1,y,rad+3+q*4,0,7);g.stroke()}}
  {const gl={rb:'↺',sg:'‖',scl:'◀',scr:'▶'}[o.t];if(gl){g.fillStyle='#fff';g.font='700 '+Math.max(9,Math.round(rad*1.1))+'px Space Grotesk,system-ui';g.textAlign='center';g.fillText(gl,a1,y+rad*.38);g.textAlign='left'}}
  if(ED.ms.has(o)){g.strokeStyle=C.fg;g.lineWidth=2;g.strokeRect(Math.min(a1,a2)-rad-5,y-rad-5,Math.abs(a2-a1)+rad*2+10,rad*2+10)}}
 // playhead
 if(ED.drag&&ED.drag.k==='box'){const d=ED.drag,rx=Math.min(d.x0,d.x1),ry=Math.min(d.y0,d.y1),rw=Math.abs(d.x1-d.x0),rhh=Math.abs(d.y1-d.y0);g.fillStyle=C.ring;g.globalAlpha=.15;g.fillRect(rx,ry,rw,rhh);g.globalAlpha=1;g.strokeStyle=C.ring;g.lineWidth=1;g.strokeRect(rx+.5,ry+.5,rw,rhh)}
 const ph=xo(cur);if(ph>-10&&ph<w+10){g.strokeStyle=C.hot;g.lineWidth=2;g.beginPath();g.moveTo(ph,0);g.lineTo(ph,h);g.stroke();g.fillStyle=C.hot;g.beginPath();g.moveTo(ph-6,0);g.lineTo(ph+6,0);g.lineTo(ph,9);g.fill()}}
function edLoop(){if(state!=='edit'||!ED)return;const c=ED.c;
 if(ED.play){const cur=edBeat(),hz=cur+.25*c.bpm/60,T=b=>ED.at0+(b-ED.ph0)*60/c.bpm;
  if(ED.met)for(let k=Math.floor(ED.sched)+1;k<=hz;k++)if(k>ED.sched)tone(k%4==0?1600:1100,T(k),.04,'square',.12);
  if(ED.ns)for(const o of c.notes)if(o.b>ED.sched&&o.b<=hz){tone(1900,T(o.b),.04,'square',.2);if(!c.audio&&o.t!=='decoy')tone(edf(o.n),T(o.b),.15,S[c.si][4],.12)}
  ED.sched=hz;const vw=ED.cv.clientWidth/ED.zoom;if(cur>ED.sc+vw*.85||cur<ED.sc){ED.sc=cur-vw*.15;clampSc()}
  if(cur>c.beats+2){ED.ph=Math.min(cur,c.beats);edStop(true)}}
 const pb=$('#epb'),lab=ED.play?'⏸ Pause':'▶ Play';if(pb&&pb.textContent!==lab)pb.textContent=lab;
 const sl=$('#escr');if(sl){if(+sl.max!==c.beats)sl.max=c.beats;sl.value=ED.sc}
 {const k=c.notes.length+'|'+ED.ms.size,eh=$('#ecnt');if(eh&&ED.rk!==k){ED.rk=k;eh.textContent=c.notes.length+' notes'+(ED.ms.size?' · '+ED.ms.size+' selected':'');const er=$('#erate');if(er)er.innerHTML=ratingHTML(c)}}
 const tl=$('#etl');if(tl){const cur=edBeat(),s=`beat ${cur.toFixed(2)} · ${fmtT(c.off+cur*60/c.bpm)}`;if(tl.textContent!==s)tl.textContent=s}
 edDraw();edRaf=requestAnimationFrame(edLoop)}
function edKey(e){const t=e.target,tg=t&&t.tagName;if(tg==='SELECT'||(tg==='INPUT'&&/text|number/.test(t.type)))return;const k=e.key;
 if(k===' '){e.preventDefault();ED.play?edStop():edPlay();return}
 if(k==='Delete'||k==='Backspace'){if(ED.ms.size){e.preventDefault();delSel()}return}
 if((e.ctrlKey||e.metaKey)&&(k==='a'||k==='A')){e.preventDefault();ED.ms=new Set(ED.c.notes);ED.sel=ED.c.notes[ED.c.notes.length-1]||null;edPanel();return}
 const ti='1234567890-'.indexOf(k);if(ti>=0&&ti<TOOLS.length){ED.tool=TOOLS[ti][0];edPanel();return}
 if(k==='e'||k==='E'){ED.tool='erase';edPanel();return}if(k==='s'||k==='S'){ED.tool='select';edPanel();return}
 if(k==='m'||k==='M'){ED.met=ED.met?0:1;const b=$('#emet');if(b)b.classList.toggle('sel',!!ED.met);return}
 if(k==='ArrowLeft'||k==='ArrowRight'){e.preventDefault();seekTo(edBeat()+(k==='ArrowRight'?1:-1)*(e.shiftKey?4:1));return}
 if(k==='Home'){seekTo(0);ED.sc=-.5}}
function editor(i,keep){
 cancelAnimationFrame(raf);cancelAnimationFrame(edRaf);stopCA();if(ED&&ED.play)edStop(true);
 actx();if(master)master.gain.value=0;killAudio();x.clearRect(0,0,W,H);
 let c;if(i<0){c={id:'c'+Date.now().toString(36)+Math.floor(Math.random()*1e4).toString(36),name:'My level '+(save.custom.length+1),bpm:120,off:0,beats:64,si:0,audio:0,audioName:'',dur:0,notes:[],fl:{r:0,w:0,s:0,q:0},mods:{}};save.custom.push(c);i=save.custom.length-1;persist()}else c=save.custom[i];
 EDI=i;state='edit';ui.style.touchAction='';ui.scrollTop=0;
 if(!(keep&&ED&&ED.c===c))ED={c,tool:'tap',snap:2,sc:-.5,zoom:80,ph:0,play:false,sel:null,ms:new Set(),drag:null,taps:[],met:1,ns:1,msg:'',warn:'',clr:0,src:null};
 ED.play=false;ED.src=null;ED.clr=0;
 const cs=getComputedStyle(document.documentElement);ED.col={bg:cs.getPropertyValue('--bg').trim(),fg:cs.getPropertyValue('--fg').trim(),mut:cs.getPropertyValue('--mut').trim(),hot:save.st.hot||cs.getPropertyValue('--hot').trim(),ring:save.st.ring||cs.getPropertyValue('--ring').trim(),ok:cs.getPropertyValue('--ok').trim()};
 master=ac.createGain();master.gain.value=save.st.vol;master.connect(ac.destination);
 ui.innerHTML=`<div class="edw"><div class="ed-side" id="edside"></div><div class="ed-main">
 <div class="ed-bar"><button class="main" id="epb" data-a="e_play">▶ Play</button><button id="emet" data-a="e_met" class="${ED.met?'sel':''}">Metronome</button><button data-a="e_ns" class="${ED.ns?'sel':''}">Note clicks</button><span id="etl"></span></div>
 <canvas id="ec"></canvas>
 <div class="ed-bar"><label style="margin:0">Scroll <input type="range" id="escr" min="-2" max="${c.beats}" step="0.25" style="width:200px"></label><label style="margin:0">Zoom <input type="range" id="ezoom" min="16" max="240" value="${ED.zoom}" style="width:120px"></label></div>
 <p class="hint">Click the grid to place a note. Drag a note to move it, or drag a hold's end to resize. Right-click deletes. Click the ruler or waveform to move the playhead. Space plays, Ctrl+wheel zooms. Keys 1–9, 0 and - pick note types. Shift-click or drag a box to select several notes.</p></div></div>`;
 const cn=ED.cv=$('#ec');
 const pos=e=>{const r=cn.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top,r.width,r.height]};
 const noteAt=(px,py,h)=>{const rh=rowH(h),pad=Math.max(3,Math.min(12,ED.zoom/ED.snap/2-1));let best=null;for(const o of c.notes){const y=TOP+(13-o.n+.5)*rh;if(py<y-rh/2||py>y+rh/2)continue;if(px>=edX(o.b)-pad&&px<=edX(o.b+(o.len||0))+pad)best=o}return best};
 cn.oncontextmenu=e=>e.preventDefault();
 const MODK=e=>e.shiftKey||e.ctrlKey||e.metaKey;
 const setSel=(o,add)=>{if(!add)ED.ms.clear();if(o){if(add&&ED.ms.has(o))ED.ms.delete(o);else ED.ms.add(o)}ED.sel=o&&ED.ms.has(o)?o:(ED.ms.size?[...ED.ms].pop():null)};
 cn.onpointerdown=e=>{e.preventDefault();actx();try{cn.setPointerCapture(e.pointerId)}catch(_){}const[px,py,w,h]=pos(e);
  if(py<TOP){ED.drag={k:'seek',wp:ED.play};if(ED.play)edStop();ED.ph=Math.max(minPh(),edB(px));return}
  const o=noteAt(px,py,h);
  if(e.button===2||ED.tool==='erase'){if(o){if(ED.ms.has(o)&&ED.ms.size>1)delSel();else delNote(o)}return}
  if(o){if(MODK(e)){setSel(o,true);edPanel();return}
   if(!ED.ms.has(o))setSel(o,false);else ED.sel=o;
   if(ED.ms.size>1){ED.drag={k:'gmove',o,dx:edB(px)-o.b,n0:pitchAt(py,h),orig:[...ED.ms].map(q=>[q,q.b,q.n]),db:0,dn:0,pdn:0};return}
   ED.drag=o.len&&Math.abs(px-edX(o.b+o.len))<=10&&px>edX(o.b)+14?{k:'len',o}:{k:'move',o,dx:edB(px)-o.b};return}
  if(ED.tool==='select'||e.shiftKey){ED.drag={k:'box',x0:px,y0:py,x1:px,y1:py,add:MODK(e),base:new Set(ED.ms)};if(!MODK(e)){ED.ms.clear();ED.sel=null}return}
  const n={b:Math.max(0,snapB(edB(px))),n:pitchAt(py,h),t:ED.tool,len:0},isLen=n.t==='hold'||n.t==='lift'||n.t==='roll';
  if(isLen)n.len=.5;
  if(!fits(n)){ED.ms.clear();ED.sel=null;edPanel();return}
  c.notes.push(n);c.notes.sort((p,q)=>p.b-q.b);ED.ms.clear();ED.ms.add(n);ED.sel=n;if(!ED.play)edBlip(n.n);ED.drag=isLen?{k:'len',o:n,fresh:1}:null;persist()};
 cn.onpointermove=e=>{const[px,py,w,h]=pos(e),d=ED.drag;
  if(!d){cn.style.cursor=py<TOP?'pointer':(noteAt(px,py,h)&&ED.tool!=='erase'?'grab':'crosshair');return}
  if(d.k==='seek'){ED.ph=Math.max(minPh(),edB(px));return}
  if(d.k==='box'){d.x1=px;d.y1=py;const xa=Math.min(d.x0,px),xb=Math.max(d.x0,px),ya=Math.min(d.y0,py),yb=Math.max(d.y0,py),rh=rowH(h);
   ED.ms=new Set(d.add?d.base:[]);for(const o of c.notes){const y=TOP+(13-o.n+.5)*rh;if(y+rh/2<ya||y-rh/2>yb)continue;if(edX(o.b+(o.len||0))<xa||edX(o.b)>xb)continue;ED.ms.add(o)}
   ED.sel=ED.ms.size?[...ED.ms].pop():null;return}
  if(d.k==='gmove'){const o0=d.orig.find(q=>q[0]===d.o);let db=snapB(edB(px)-d.dx)-o0[1],dn=pitchAt(py,h)-d.n0;
   const mnB=Math.min(...d.orig.map(q=>q[1])),mxB=Math.max(...d.orig.map(q=>q[1])),mnN=Math.min(...d.orig.map(q=>q[2])),mxN=Math.max(...d.orig.map(q=>q[2]));
   db=Math.max(-mnB,Math.min(c.beats-mxB,db));dn=Math.max(-mnN,Math.min(13-mxN,dn));
   if(db===d.db&&dn===d.dn)return;
   for(const[q,b0,n0]of d.orig){q.b=b0+db;q.n=n0+dn}
   if(d.orig.every(r=>fitsG(r[0]))){d.db=db;d.dn=dn;d.moved=1;if(dn!==d.pdn){d.pdn=dn;if(!ED.play)edBlip(d.o.n)}}
   else for(const[q,b0,n0]of d.orig){q.b=b0+d.db;q.n=n0+d.dn}
   return}
  if(d.k==='move'){const o=d.o,ob=o.b,on=o.n;o.b=Math.max(0,snapB(edB(px)-d.dx));o.n=pitchAt(py,h);if(!fits(o,o)){o.b=ob;o.n=on}else if(o.n!==on&&!ED.play)edBlip(o.n);return}
  if(d.k==='len'){const o=d.o,ol=o.len;o.len=Math.max(.25,Math.min(8,snapB(edB(px))-o.b));if(!fits(o,o))o.len=ol;else if(o.len!==ol)d.moved=1}};
 cn.onpointerup=cn.onpointercancel=e=>{const d=ED.drag;ED.drag=null;if(!d)return;
  if(d.k==='seek'){if(d.wp)edPlay();return}
  if(d.k==='box'){ED.sel=ED.ms.size?[...ED.ms].pop():null;edPanel();return}
  if(d.k==='len'&&d.fresh&&!d.moved){const o=d.o;for(const l2 of(o.t==='roll'?[1.5,1,.5]:[1,.5])){const old=o.len;o.len=l2;if(fits(o,o))break;o.len=old}}
  c.notes.sort((p,q)=>p.b-q.b);persist();edPanel()};
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
 ui.innerHTML=`<div class="p" style="max-width:340px"><h1 style="font-size:28px">Paused</h1><p>${esc(L[lv][5]||'')}</p><div class="pst"><button class="main" data-a="p_resume">Resume</button><button data-a="p_retry">Restart</button><button data-a="p_tt">Tempo text: ${save.st.tt!==0?'On':'Off'}</button><button data-a="p_quit">${ed?'Back to editor':'Quit to menu'}</button></div><p class="hint" style="margin-top:12px">Esc resumes · R restarts</p></div>`}
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
['a1','Downbeat cleared','Clear every level in Area 1.',()=>nClr(0,A1)>=A1],
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
const OTM_MAGIC='onetap-level',NT=['tap','hold','dbl','tri','roll','lift','decoy','ph','rb','sg','scl','scr'];
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
 const f=l.fl&&typeof l.fl==='object'?l.fl:{},mods={};for(const m of MODS)if(l.mods&&l.mods[m[0]])mods[m[0]]=1;if(mods.nf){delete mods.fc;delete mods.ap}if(mods.ez&&mods.fr)delete mods.ez;
 return{id:'c'+Date.now().toString(36)+Math.floor(Math.random()*1e4).toString(36),name:clean(l.name).slice(0,40)||'Imported level',bpm:num(l.bpm,40,MAXBPM,120),off:num(l.off,0,600,0),beats,si:Math.round(num(l.si,0,S.length-1,0)),
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
const HEAD='micah',HEADMAIL=HEAD+'@'+UDOM;
const isUdom=e=>!!e&&e.endsWith('@'+UDOM);
const isHead=()=>!!SYNC.acct&&SYNC.email===HEADMAIL;
const isCur=()=>isHead()||SYNC.cur===true;
const CM={items:[],feat:[],lvls:[],curs:[],busy:false,loaded:false,msg:'',br:null};
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
  CM.feat=ents.filter(e=>e.d&&e.d.type==='account'&&e.d.uid).map(e=>({id:e.id,uid:e.d.uid,name:e.d.name||'?',by:e.d.by||''}));
  CM.lvls=ents.filter(e=>e.d&&e.d.type==='level'&&e.d.uid&&e.d.key).map(e=>({id:e.id,uid:e.d.uid,key:e.d.key,name:e.d.name||'Level',owner:e.d.owner||'',bpm:e.d.bpm||0,m:e.d.m||0,a:e.d.a||''}));
  CM.curs=isHead()?(await SYNC.fb.clist(['curators'])).map(e=>({uid:e.id,name:(e.d&&e.d.name)||e.id})):[];
  const items=[],seen=new Set(),add=o=>{const k=o.uid+'/'+o.key;if(seen.has(k))return;seen.add(k);items.push(o)};
  for(const l of CM.lvls)add({uid:l.uid,key:l.key,name:l.name,owner:l.owner,bpm:l.bpm,m:l.m,a:l.a,pin:l.id});
  const fe=CM.feat.slice(0,60),profs=await Promise.all(fe.map(f=>SYNC.fb.cget(['profiles',f.uid]).catch(()=>null)));
  fe.forEach((f,i)=>{const p=profs[i];if(p&&Array.isArray(p.lv))for(const l of p.lv.slice(0,300))if(l&&l.k)add({uid:f.uid,key:l.k,name:l.n||'Level',owner:f.name,bpm:l.b||0,m:l.m||0,a:l.a||''})});
  CM.items=items;CM.loaded=true}
 catch(e){CM.msg=e&&e.code==='permission-denied'?'The community rules aren’t deployed yet. Publish the firestore.rules file in the Firebase console.':'Couldn’t load the community. Check your connection and try again.'}
 CM.busy=false;cmDraw()}
const cmCard=(it,i)=>`<div class="crow"><button class="card" data-a="cm_play" data-v="${i}" style="border-left-color:var(--ok)"><b>♪</b><span>${esc(it.name)}<i>${it.a?esc(it.a)+' · ':''}${it.bpm?it.bpm+' BPM · ':''}${it.m} notes · by ${esc(it.owner)}</i></span><u style="background:#6a6388">Community</u></button><button data-a="cm_save" data-v="${i}" title="Copy it into your Custom levels without playing">Save</button>${it.pin&&isCur()?`<button data-a="cm_unpin" data-v="${i}" title="Take this level out of the community tab">✕</button>`:''}</div>`;
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
 if(a=='cm_refresh')return cmLoad();
 if(a=='cm_play'||a=='cm_save')return cmGet(CM.items[v],a=='cm_play');
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
/* ================= ONLINE TAB, CHANGE PASSWORD, FRIENDS, LEADERBOARDS ================= */
// Online tab: the community levels now live in the main menu's right-hand list when "Online" is switched on.
const onlKey=()=>SYNC.dbState+'|'+(SYNC.acct?1:0)+'|'+(SYNC.uid||'');
function onlHTML(){let h='<h2 style="margin-top:0">Online · community levels</h2>';
 if(!SYNC.fb||SYNC.dbState==='none')return h+'<p>Online levels need accounts, which aren’t available right now.</p>';
 if(SYNC.dbState==='wait')return h+'<p>Connecting…</p>';
 if(!SYNC.acct)return h+'<p>Log in to play levels picked by the community team.</p><div class="row"><button class="main" data-a="acct">Log in</button></div>';
 h+='<p class="hint" style="margin:0 4px 8px">Levels picked by the community team. Tap one to play it. It’s copied into your Custom levels, and songs aren’t included, so you may be asked for the audio file.</p>';
 if(CM.busy&&!CM.loaded)h+='<p>Loading…</p>';else if(CM.items.length)h+=CM.items.map(cmCard).join('');else if(!CM.msg)h+='<p>Nothing is featured yet.</p>';
 if(CM.msg)h+='<p class="nb">'+esc(CM.msg)+'</p>';
 return h+'<div class="row" style="margin:8px 0"><button data-a="cm_refresh">Refresh</button>'+(isCur()?'<button data-a="cm_open">Curator tools</button>':'')+'</div>'}
function onlDraw(){const e=$('#onl');if(!save.on||!e)return;const st=e.scrollTop;e.innerHTML=onlHTML();e.scrollTop=st}
function onlSync(){if(!save.on||state!=='menu'||!$('#onl'))return;const k=onlKey();if(k===CM.k)return;CM.k=k;onlDraw();if(cmOK()&&!CM.busy)cmLoad()}

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

// Leaderboard row: one public document per player (leaderboard/<uid>), rewritten whenever progress syncs
async function syncBoard(uid){try{if(!cmOK()||SYNC.uid!==uid||!SYNC.uname||SYNC.needName)return;
 const b={};for(const k in save.best){const e=save.best[k];if(e&&+k<=SEC&&e.s>0)b['l'+k]=Math.round(e.s)}
 const o={name:SYNC.uname,total:Math.round(total()),end:Math.round(save.endBest||0),b},s=canon(o);
 if(s===SYNC.blv)return;await SYNC.fb.cset(['leaderboard',uid],Object.assign({},o,{ts:Date.now()}));SYNC.blv=s}catch(e){}}
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
  const opts='<option value="total">Total score</option><option value="end">Endless</option>'+L.slice(0,NL).map((l,i)=>`<option value="${i}">Level ${i+1} · ${esc(l[5])}</option>`).join('');
  h+='<div class="row">'+seg('lb_scope',['Everyone','Friends'],LB.scope)+'</div><label style="margin-top:8px">Board<br><select id="lbsel" style="max-width:100%">'+opts.replace('value="'+LB.board+'"','value="'+LB.board+'" selected')+'</select></label>';
  if(LB.msg)h+='<p class="nb">'+esc(LB.msg)+'</p>';
  else if(LB.busy&&!LB.loaded)h+='<p>Loading…</p>';
  else if(!LB.rows.length)h+='<p>'+(LB.scope?'None of your friends have a score on this board yet.':'Nobody has a score on this board yet.')+'</p>'+(LB.scope?'<div class="row"><button data-a="fr_open">Find friends</button></div>':'');
  else{const tot=LB.board==='total';h+='<table><tr><th>#</th><th>Player</th>'+(tot?'<th>Title</th>':'')+'<th>Score</th></tr>'+LB.rows.map((r,i)=>{const me=r.uid===SYNC.uid;return `<tr${me?' style="font-weight:700"':''}><td>${i+1}</td><td>${esc(r.name)}${me?' (you)':''}</td>${tot?'<td>'+ttl(r.v)+'</td>':''}<td>${fmtN(r.v)}</td></tr>`}).join('')+'</table>'}
  h+='<p class="hint">Scores come from each player’s own device, and show up after their progress syncs. Practice, slowed and No Fail runs don’t count.</p>';
  h+='<div class="row" style="margin-top:12px"><button data-a="lb_refresh">Refresh</button><button data-a="fr_open">Friends</button></div>'}
 h+=backRow+'</div>';ui.innerHTML=h;ui.scrollTop=st}
ui.onchange=e=>{if(e.target&&e.target.id==='lbsel'){LB.board=e.target.value;lbLoad()}};

async function socAct(a,b){const v=+b.dataset.v;
 if(a=='fr_open')return friendsScreen();
 if(a=='lb_open')return lbScreen();
 if(a=='lb_scope'){LB.scope=v;return lbLoad()}
 if(a=='lb_refresh')return lbLoad();
 if(a=='fr_refresh')return frLoad();
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

/* ================= CUSTOM LEVEL RATINGS ================= */
const NMAP={hold:'h',lift:'li',roll:'ro',dbl:'x',tri:'tr',decoy:'d',rb:'rb',sg:'sg',scl:'sc',scr:'sc'};
// same idea as the campaign stars: speed x note density, plus a weight per mechanic (scaled by how much of the level uses it)
const custStars=(c,rt)=>{rt=rt||1;const n=c.notes.length;if(!n)return 0;const npb=Math.min(4,n/Math.max(8,c.beats||8)),cnt={};
 for(const o of c.notes){const k=NMAP[o.t];if(k)cnt[k]=(cnt[k]||0)+1}
 let m=0;for(const k in cnt)m+=(MW[k]||.5)*Math.min(1,cnt[k]/n/.15);
 if(c.fl){if(c.fl.r)m+=MW.r;if(c.fl.w)m+=MW.w;if(c.fl.s)m+=MW.s;if(c.fl.q)m+=MW.q}
 let q=c.bpm*rt/60*npb*.55+m*.45;const mm=Object.assign({},save.mods,c.mods||{});for(const k in MSTAR)if(mm[k]&&!(mm.ap&&k=='fc'))q*=MSTAR[k];return q};
const ctier=c=>{const q=custStars(c,save.spd||1),t=TR.filter(a=>q>=a[0]).pop()||TR[0];return{n:t[1],c:t[2],s:q}};
const cbadge=c=>{const t=ctier(c);return t.s>0?`<u style="background:${t.c}" title="${t.n}. Difficulty rating at your current speed and modifiers.">★${t.s.toFixed(1)}</u>`:'<u style="background:#6a6388">Empty</u>'};
const ratingHTML=c=>{if(!c.notes.length)return 'Place notes to get a difficulty rating.';const t=ctier(c);return 'Difficulty rating: <b style="color:'+t.c+'">★'+t.s.toFixed(1)+' · '+t.n+'</b>'};
/* ================= OFFSET CALIBRATION + FPS/CPS ================= */
let FT=[],CT=[],CAL=null;
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
checkAch(null,true); // quietly credit progress made before achievements existed
applyTheme();menu();

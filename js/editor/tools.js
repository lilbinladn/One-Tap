const TOP=78; // height of the editor ruler strip
const SNP=[1,2,3,4,6,8,12];
const TOOLS=[['tap','Tap','Single tap. Key 1'],['hold','Hold','Press, hold, release at the end. Drag the end to resize. Key 2'],['dbl','Double','Two quick taps. Key 3'],['tri','Triple','Three quick taps. Key 4'],['roll','Roll','Mash taps along the bar. Drag the end to resize. Key 5'],['lift','Lift','Hold, then release exactly at the end. Key 6'],['decoy','Decoy','The player must NOT tap this. Key 7'],['rb','Rebound','A tap that bounces back off the ring first. The player taps when it returns. Key 8'],['sg','Stutter','A tap that pauses mid-flight, then keeps going. Key 9'],['scl','Scatter ◀','A tap that arrives from the LEFT side. Key 0'],['scr','Scatter ▶','A tap that arrives from the RIGHT side. Key -'],['select','Select','Click a note to select it, drag to move it. Key S'],['erase','Erase','Click notes to delete them. Key E (or right-click any time)']];
const fmtT=s=>{s=Math.max(0,s);const r=s%60;return Math.floor(s/60)+':'+(r<10?'0':'')+r.toFixed(1)};
// ---- editor model helpers
const edX=b=>(b-ED.sc)*ED.zoom,edB=px=>px/ED.zoom+ED.sc;
const snapB=b=>Math.round(b*ED.snap)/ED.snap;
const rowH=h=>Math.max(12,(h-TOP)/14);
const pitchAt=(py,h)=>Math.max(0,Math.min(13,13-Math.floor((py-TOP)/rowH(h))));
const occ=o=>{const m=ED?Math.min(.25,1/ED.snap):.25;return o.t==='tri'?1:o.t==='dbl'?.5:o.t==='rb'?.75:Math.max(m,(o.len||0)+m)};
function fitsG(o){if(o.b<0||o.b>ED.c.beats)return false;const a0=o.b,a1=o.b+occ(o);for(const p of ED.c.notes){if(ED.ms.has(p))continue;const b0=p.b,b1=p.b+occ(p);if(a0<b1-1e-6&&b0<a1-1e-6)return false}return true}
function fits(o,ig){if(o.b<0||o.b>ED.c.beats)return false;const a0=o.b,a1=o.b+occ(o);for(const p of ED.c.notes){if(p===o||p===ig)continue;const b0=p.b,b1=p.b+occ(p);if(a0<b1-1e-6&&b0<a1-1e-6)return false}return true}

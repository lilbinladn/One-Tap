const tm=B=>{let k=segs.length-1;while(k>0&&segs[k][0]>B)k--;return segT[k]+(B-segs[k][0])*60/(segs[k][1]*rate)};
const bt=t=>{let k=segs.length-1;while(k>0&&segT[k]>t)k--;return segs[k][0]+(t-segT[k])*segs[k][1]*rate/60};
const curBpm=B=>{let k=segs.length-1;while(k>0&&segs[k][0]>B)k--;return segs[k][1]*rate};
const now=()=>ac.currentTime-t0-save.off/1000;

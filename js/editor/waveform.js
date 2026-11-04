function mkPeaks(buf){const d=buf.getChannelData(0),d2=buf.numberOfChannels>1?buf.getChannelData(1):d,n=Math.ceil(buf.duration*100),sp=Math.max(1,Math.floor(buf.sampleRate/100)),p=new Float32Array(n);let mx=.001;
 for(let i=0;i<n;i++){let m=0;const a=i*sp,b=Math.min(d.length,a+sp);for(let j=a;j<b;j+=3){const v=Math.max(Math.abs(d[j]),Math.abs(d2[j]));if(v>m)m=v}p[i]=m;if(m>mx)mx=m}
 for(let i=0;i<n;i++)p[i]/=mx;return p}

// drawn behind the grid so the beat lines stay readable over the song
function edWave(g,C,c,w,z,sc){
 const P=PK[c.id],mid=50;
 if(P){g.fillStyle=C.ring;g.globalAlpha=.6;for(let px=0;px<w;px++){const t0=c.off+(sc+px/z)*60/c.bpm,t1=c.off+(sc+(px+1)/z)*60/c.bpm,i0=Math.floor(t0*100),i1=Math.max(i0,Math.floor(t1*100));if(i1<0||i0>=P.length)continue;let m=0;for(let i=Math.max(0,i0);i<=Math.min(P.length-1,i1);i++)if(P[i]>m)m=P[i];g.fillRect(px,mid-m*24,1,m*48+1)}g.globalAlpha=1}
 else{g.fillStyle=C.mut;g.font='12px Space Grotesk,system-ui';g.textAlign='left';g.fillText('Import an MP3 to see its waveform here',10,mid+4)}
}

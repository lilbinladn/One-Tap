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

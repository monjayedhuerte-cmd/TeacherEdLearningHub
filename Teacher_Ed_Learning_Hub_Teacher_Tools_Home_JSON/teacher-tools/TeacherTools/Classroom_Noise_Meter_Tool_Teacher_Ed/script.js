let audioCtx=null, analyser=null, source=null, stream=null, running=false, raf=0, target=40, smoothed=0, lastAlert=0, alertSound=true;
const display=document.getElementById("level"),bar=document.getElementById("levelBar"),needle=document.getElementById("needle");
const pill=document.getElementById("levelPill"),title=document.getElementById("levelTitle"),msg=document.getElementById("levelMessage");
const micStatus=document.getElementById("micStatus"),status=document.getElementById("status");
const circumference=1;

for(let i=0;i<=30;i++){const t=document.createElement("span");t.className="tick";const deg=-90+(i/30)*180;t.style.transform=`translateX(-50%) rotate(${deg}deg) translateY(-${i%5===0?12:7}px)`;document.getElementById("ticks").appendChild(t)}

function beep(freq=850,d=.08){if(!alertSound)return;try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=freq;o.type="sine";g.gain.value=.035;o.connect(g);g.connect(audioCtx.destination);o.start();setTimeout(()=>o.stop(),d*1000)}catch(e){}}

function classify(v){
  if(v<20)return {name:"Silent",emoji:"🔇",color:"#54e99a",title:"Perfect for quiet work",msg:"Excellent! The room is very calm."};
  if(v<40)return {name:"Whisper",emoji:"🤫",color:"#54e99a",title:"Great classroom volume!",msg:"You're within the target range."};
  if(v<60)return {name:"Moderate",emoji:"🗣️",color:"#ffc94a",title:"Getting a little louder",msg:"Check your voices and keep them controlled."};
  if(v<80)return {name:"Loud",emoji:"📣",color:"#ff9b52",title:"The room is getting loud",msg:"Lower your voices so everyone can focus."};
  return {name:"Too Loud!",emoji:"🚨",color:"#ff5b78",title:"Whoa! Too loud!",msg:"Pause, lower your voices, and reset."};
}
function render(v){
 v=Math.max(0,Math.min(100,v));const c=classify(v);
 display.textContent=Math.round(v);display.style.color=c.color;bar.style.width=v+"%";bar.style.background=c.color;
 const deg=-90+(v/100)*180;needle.style.transform=`translateX(-50%) rotate(${deg}deg)`;
 pill.textContent=c.emoji+" "+c.name;pill.style.color=c.color;pill.style.background=c.color+"16";pill.style.borderColor=c.color+"44";
 title.textContent=c.title;msg.textContent=c.msg;
 document.body.classList.toggle("loud",v>=60&&v<80);document.body.classList.toggle("too-loud",v>=80);
 const card=document.getElementById("statusCard");document.getElementById("statusEmoji").textContent=c.emoji;
 document.getElementById("statusCardTitle").textContent=c.title;document.getElementById("statusCardText").textContent=c.msg;card.style.borderColor=c.color+"33";card.style.background=c.color+"09";
 if(v>=target+25&&Date.now()-lastAlert>2500){beep(950,.08);lastAlert=Date.now()}
}
function rmsToLevel(rms){
 // Relative classroom noise index rather than a claimed calibrated dB reading.
 // Typical laptop/desktop microphone input is normalized and varies by device.
 const x=Math.max(0,Math.min(1,rms));
 return Math.min(100,Math.pow(x*5.0,0.72)*100);
}
function loop(){
 if(!running)return;
 const data=new Uint8Array(analyser.fftSize);analyser.getByteTimeDomainData(data);
 let sum=0;for(let i=0;i<data.length;i++){const n=(data[i]-128)/128;sum+=n*n}
 const rms=Math.sqrt(sum/data.length),raw=rmsToLevel(rms);
 smoothed=smoothed*.78+raw*.22;render(smoothed);
 raf=requestAnimationFrame(loop);
}
async function start(){
 try{
  stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,autoGainControl:false,noiseSuppression:false}});
  audioCtx=new (window.AudioContext||window.webkitAudioContext)();analyser=audioCtx.createAnalyser();analyser.fftSize=1024;
  source=audioCtx.createMediaStreamSource(stream);source.connect(analyser);running=true;smoothed=0;lastAlert=0;
  micStatus.className="status on";micStatus.innerHTML="<i></i> MICROPHONE ON";status.textContent="Listening... the meter is showing relative classroom noise.";
  document.getElementById("startBtn").disabled=true;document.getElementById("stopBtn").disabled=false;loop();
 }catch(e){
  status.textContent="Microphone permission was not granted. Check your browser's site permissions and try again.";
  micStatus.className="status off";micStatus.innerHTML="<i></i> MICROPHONE OFF";
 }
}
function stop(){
 running=false;cancelAnimationFrame(raf);if(stream)stream.getTracks().forEach(t=>t.stop());if(source)source.disconnect();
 if(audioCtx){audioCtx.close().catch(()=>{});audioCtx=null}stream=null;source=null;
 document.getElementById("startBtn").disabled=false;document.getElementById("stopBtn").disabled=true;
 micStatus.className="status off";micStatus.innerHTML="<i></i> MICROPHONE OFF";status.textContent="Meter stopped. No audio is recorded or saved.";render(0);
}
document.getElementById("startBtn").onclick=start;document.getElementById("stopBtn").onclick=stop;
document.querySelectorAll(".target-grid button").forEach(b=>b.onclick=()=>{target=Number(b.dataset.target);document.querySelectorAll(".target-grid button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");document.getElementById("targetDisplay").textContent=target});
document.getElementById("soundBtn").onclick=()=>{alertSound=!alertSound;document.getElementById("soundBtn").textContent=alertSound?"🔊 Alerts On":"🔇 Alerts Off"};
document.getElementById("fullBtn").onclick=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.()};
window.addEventListener("beforeunload",stop);
render(0);

const display=document.getElementById("timeDisplay"),state=document.getElementById("stateText"),ring=document.getElementById("progressRing");
const minInput=document.getElementById("minInput"),secInput=document.getElementById("secInput");
const startBtn=document.getElementById("startBtn"),pauseBtn=document.getElementById("pauseBtn"),resetBtn=document.getElementById("resetBtn");
const status=document.getElementById("status"),title=document.getElementById("timerTitle"),subtitle=document.getElementById("timerSubtitle");
const finished=document.getElementById("finished"),finishTitle=document.getElementById("finishTitle"),finishSub=document.getElementById("finishSub");
const C=2*Math.PI*184;ring.style.strokeDasharray=C;

let total=300,remaining=300,running=false,last=0,raf=null,sound=true,warningDone=false;
const defaultTitle="Ready to learn?",defaultSub="Set the time and let the countdown begin.";

function fmt(s){s=Math.max(0,Math.ceil(s));return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
function render(){
  display.textContent=fmt(remaining);
  const ratio=total?remaining/total:0;ring.style.strokeDashoffset=C*(1-ratio);
  if(remaining<=10&&remaining>0)document.body.classList.add("danger"),document.body.classList.remove("warning");
  else if(remaining<=30&&remaining>0)document.body.classList.add("warning"),document.body.classList.remove("danger");
  else document.body.classList.remove("warning","danger");
}
function setTime(m,s=0){
  m=Math.max(0,Math.floor(Number(m)||0));s=Math.min(59,Math.max(0,Math.floor(Number(s)||0)));
  total=remaining=m*60+s;if(total<1)total=remaining=1;
  minInput.value=Math.floor(total/60);secInput.value=total%60;
  running=false;warningDone=false;cancelAnimationFrame(raf);startBtn.disabled=false;pauseBtn.disabled=true;
  state.textContent="READY";status.textContent="Choose a time, then press Start.";render();
}
function beep(freq=700,d=.1){
  if(!sound)return;try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const a=new A(),o=a.createOscillator(),g=a.createGain();o.frequency.value=freq;o.type="sine";g.gain.value=.045;o.connect(g);g.connect(a.destination);o.start();setTimeout(()=>{o.stop();a.close()},d*1000)}catch(e){}
}
function finish(){
  running=false;remaining=0;render();state.textContent="DONE";startBtn.disabled=false;pauseBtn.disabled=true;status.textContent="Time is up!";
  if(document.getElementById("alarmToggle").checked){beep(700,.18);setTimeout(()=>beep(900,.18),180);setTimeout(()=>beep(1100,.25),360)}
  finishTitle.textContent=title.textContent==="Ready to learn?"?"Time's Up!":title.textContent;
  finishSub.textContent="Great work! Time to check, share, or move to the next activity.";
  finished.classList.remove("hidden");
}
function tick(now){
  if(!running)return;const delta=(now-last)/1000;last=now;remaining-=delta;
  if(remaining<=10&&remaining>0&&!warningDone){warningDone=true;if(document.getElementById("warningToggle").checked){beep(950,.12);status.textContent="⚠️ 10 seconds left!"}}
  if(remaining<=0){finish();return}render();raf=requestAnimationFrame(tick)
}
startBtn.onclick=()=>{
  if(remaining<=0)setTime(minInput.value,secInput.value);
  running=true;last=performance.now();startBtn.disabled=true;pauseBtn.disabled=false;state.textContent="RUNNING";status.textContent="Focus time!";raf=requestAnimationFrame(tick)
};
pauseBtn.onclick=()=>{running=false;cancelAnimationFrame(raf);startBtn.disabled=false;pauseBtn.disabled=true;state.textContent="PAUSED";status.textContent="Timer paused. Press Start to continue."};
resetBtn.onclick=()=>setTime(minInput.value,secInput.value);
document.getElementById("setBtn").onclick=()=>setTime(minInput.value,secInput.value);
document.querySelectorAll(".presets button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".presets button").forEach(x=>x.classList.remove("active"));b.classList.add("active");setTime(b.dataset.min,b.dataset.sec)});
document.querySelectorAll(".purpose-grid button").forEach(b=>b.onclick=()=>{title.textContent=b.dataset.title;subtitle.textContent=b.dataset.sub;status.textContent="Purpose selected. Set your time.";beep(550,.05)});
document.getElementById("soundBtn").onclick=()=>{sound=!sound;document.getElementById("soundBtn").textContent=sound?"🔊 Sound On":"🔇 Sound Off"};
document.getElementById("fullBtn").onclick=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.()};
document.getElementById("closeFinish").onclick=()=>finished.classList.add("hidden");
finished.onclick=e=>{if(e.target===finished)finished.classList.add("hidden")};
setTime(5,0);

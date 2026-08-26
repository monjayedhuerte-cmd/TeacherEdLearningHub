const modes={
eyes:{label:"CALL & RESPONSE",icon:"👀",signal:"EYES ON ME!",response:"EYES ON YOU!",title:"Eyes on me!",sub:"Let's bring our attention back to the lesson.",steps:[["signal",700],["response",900]]},
class:{label:"CALL & RESPONSE",icon:"📣",signal:"CLASS, CLASS!",response:"YES, TEACHER!",title:"Class, Class!",sub:"Wait for the class response before continuing.",steps:[["signal",750],["response",900]]},
ready:{label:"READY SIGNAL",icon:"🧠",signal:"BRAIN READY!",response:"LEARNING READY!",title:"Brain ready!",sub:"Hands still. Eyes forward. Minds ready.",steps:[["signal",750],["response",950]]},
quiet:{label:"SILENT SIGNAL",icon:"🤫",signal:"WATCH • BREATHE • FOCUS",response:"WE ARE READY.",title:"Silent signal",sub:"No words needed. Watch the screen and reset.",steps:[["signal",1100],["response",950]]},
clap:{label:"CLAP PATTERN",icon:"👏",signal:"👏  👏  👏",response:"FREEZE! 🧊",title:"Clap pattern",sub:"Listen carefully and copy the pattern.",steps:[["signal",900],["response",800]]},
count:{label:"COUNTDOWN",icon:"🔢",signal:"GET READY!",response:"LET'S LEARN!",title:"Countdown",sub:"Five seconds to bring everyone together.",steps:[["count",5000]]},
magic:{label:"MAGIC WORD",icon:"✨",signal:"MAGIC WORD!",response:"ATTENTION!",title:"Magic word",sub:"A quick signal to reset the room.",steps:[["signal",800],["response",900]]}
};
let current="eyes",running=false,timers=[],sound=true;
const visual=document.getElementById("visual"),icon=document.getElementById("mainIcon"),signal=document.getElementById("signal"),response=document.getElementById("response"),count=document.getElementById("count");
function beep(freq=700,d=.08){if(!sound)return;try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const a=new A(),o=a.createOscillator(),g=a.createGain();o.type="sine";o.frequency.value=freq;g.gain.value=.04;o.connect(g);g.connect(a.destination);o.start();setTimeout(()=>{o.stop();a.close()},d*1000)}catch(e){}}
function clearTimers(){timers.forEach(clearTimeout);timers=[];running=false;document.body.classList.remove("active","counting")}
function selectMode(key){
  clearTimers();current=key;const m=modes[key];
  document.querySelectorAll(".routine").forEach(x=>x.classList.toggle("active",x.dataset.mode===key));
  document.getElementById("modeName").textContent=m.label;icon.textContent=m.icon;signal.textContent=m.signal;response.textContent=m.response;
  document.getElementById("messageTitle").textContent=m.title;document.getElementById("messageSub").textContent=m.sub;
  count.textContent="";signal.style.opacity="0";response.style.opacity="0";
}
function activate(){
  clearTimers();const m=modes[current];running=true;document.body.classList.add("active");
  signal.style.opacity="0";response.style.opacity="0";count.style.opacity="0";
  beep(600,.12);
  if(current==="count"){
    document.body.classList.remove("active");
    let n=5;count.textContent=n;document.body.classList.add("counting");
    const run=()=>{if(n<=0){count.textContent="";document.body.classList.remove("counting");document.body.classList.add("active");signal.style.opacity="1";response.style.opacity="1";beep(1100,.15);running=false;return}
      count.textContent=n;beep(500+n*80,.07);n--;timers.push(setTimeout(run,900))}
    run();return;
  }
  timers.push(setTimeout(()=>{beep(850,.1)},450));
  timers.push(setTimeout(()=>{response.style.opacity="1";beep(1050,.1)},900));
  timers.push(setTimeout(()=>{running=false;document.body.classList.remove("active")},2100));
}
document.querySelectorAll(".routine").forEach(b=>b.onclick=()=>selectMode(b.dataset.mode));
document.getElementById("activateBtn").onclick=activate;
document.getElementById("replayBtn").onclick=activate;
document.getElementById("stopBtn").onclick=()=>{clearTimers();signal.style.opacity="0";response.style.opacity="0";count.textContent="";};
document.getElementById("soundBtn").onclick=()=>{sound=!sound;document.getElementById("soundBtn").textContent=sound?"🔊 Sound On":"🔇 Sound Off"};
document.getElementById("fullBtn").onclick=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.()};
document.getElementById("useCustom").onclick=()=>{
 const v=document.getElementById("customInput").value.trim();if(!v)return;
 clearTimers();current="custom";document.querySelectorAll(".routine").forEach(x=>x.classList.remove("active"));
 document.getElementById("modeName").textContent="CUSTOM SIGNAL";icon.textContent="📢";signal.textContent=v;response.textContent="READY!";document.getElementById("messageTitle").textContent="Custom attention signal";document.getElementById("messageSub").textContent="Your custom classroom cue is ready.";
};
selectMode("eyes");

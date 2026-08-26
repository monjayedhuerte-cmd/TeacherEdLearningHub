const canvas=document.getElementById("wheel");
const ctx=canvas.getContext("2d");
const input=document.getElementById("studentInput");
const spinBtn=document.getElementById("spinBtn");
const previewName=document.getElementById("previewName");
const statusLabel=document.getElementById("statusLabel");
const removeAfter=document.getElementById("removeAfter");
const historyList=document.getElementById("historyList");
const modal=document.getElementById("winnerModal");
const winnerName=document.getElementById("winnerName");
const winnerMessage=document.getElementById("winnerMessage");
const quickName=document.getElementById("quickName");
let students=[],picked=[],angle=0,spinning=false,soundOn=true,currentMode="wheel";

const colors=["#4d70ff","#ffbf3f","#ff5c86","#43c6a0","#7659d9","#38a9cf","#ff8750","#637eea","#d9679c","#62ae76","#4e8edb","#d99035"];

function namesFromInput(){return input.value.split(/\n|,/).map(x=>x.trim()).filter(Boolean)}
function loadClass(){
  students=[...new Set(namesFromInput())];picked=[];
  statusLabel.textContent=students.length?"READY TO PICK":"ADD STUDENTS";
  previewName.textContent=students.length?"Spin the wheel!":"Add your students";
  updateUI();drawWheel();
}
function updateUI(){
  document.getElementById("totalCount").textContent=students.length+picked.length;
  document.getElementById("pickedCount").textContent=picked.length;
  document.getElementById("leftCount").textContent=students.length;
  document.getElementById("remainingCount").textContent=students.length;
  const total=students.length+picked.length;
  const percent=total?Math.round(picked.length/total*100):0;
  document.getElementById("fairnessBar").style.width=percent+"%";
  document.getElementById("fairnessText").textContent=total?(percent+"% class participation"):"Ready";
  historyList.innerHTML="";
  if(!picked.length){historyList.innerHTML='<div class="empty">No students picked yet.</div>';return}
  [...picked].reverse().forEach((n,i)=>{
    const d=document.createElement("div");d.className="history-item";
    d.innerHTML=`<span class="badge">${picked.length-i}</span><span>${esc(n)}</span>`;
    historyList.appendChild(d);
  });
}
function esc(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function drawWheel(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const cx=340,cy=340,r=306,n=students.length;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);
  if(!n){
    ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fillStyle="#26345f";ctx.fill();
    ctx.fillStyle="#8793b2";ctx.font="900 25px Segoe UI";ctx.textAlign="center";ctx.fillText("ADD STUDENTS",0,9);ctx.restore();return;
  }
  const arc=Math.PI*2/n;
  for(let i=0;i<n;i++){
    const start=i*arc;
    ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r,start,start+arc);ctx.closePath();
    ctx.fillStyle=colors[i%colors.length];ctx.fill();
    ctx.strokeStyle="#ffffff";ctx.lineWidth=4;ctx.stroke();
    ctx.save();ctx.rotate(start+arc/2);ctx.textAlign="right";ctx.textBaseline="middle";ctx.fillStyle="#fff";
    const fs=n>18?11:n>13?13:n>9?15:18;ctx.font=`900 ${fs}px Segoe UI`;
    let text=students[i],max=n>15?13:n>10?17:21;
    if(text.length>max)text=text.slice(0,max-1)+"…";
    ctx.fillText(text,r-22,0);ctx.restore();
  }
  ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.strokeStyle="#fff";ctx.lineWidth=8;ctx.stroke();
  ctx.restore();
}
function beep(freq=500,d=.07){
  if(!soundOn)return;
  try{
    const A=window.AudioContext||window.webkitAudioContext;if(!A)return;
    const a=new A(),o=a.createOscillator(),g=a.createGain();o.type="sine";o.frequency.value=freq;g.gain.value=.035;
    o.connect(g);g.connect(a.destination);o.start();setTimeout(()=>{o.stop();a.close()},d*1000);
  }catch(e){}
}
function recordPick(name){
  picked.push(name);
  if(removeAfter.checked)students=students.filter(s=>s!==name);
  input.value=students.concat(removeAfter.checked?[]:[]).join("\n");
  updateUI();drawWheel();
}
function openWinner(name){
  winnerName.textContent=name;
  winnerMessage.textContent=["You're today's classroom star! 🌟","The class has chosen you! 🎯","Great! Let's hear your answer! 🗣️","Your turn to shine! ✨"][Math.floor(Math.random()*4)];
  modal.classList.remove("hidden");beep(850,.14);setTimeout(()=>beep(1150,.18),120);
}
function spin(){
  if(spinning||!students.length){if(!students.length)alert("Please load at least one student.");return}
  spinning=true;spinBtn.disabled=true;statusLabel.textContent="SPINNING...";previewName.textContent="Who will it be?";
  const n=students.length,idx=Math.floor(Math.random()*n),arc=2*Math.PI/n;
  const norm=((angle%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
  const targetSlice=-(idx*arc+arc/2);let delta=targetSlice-norm;while(delta<0)delta+=2*Math.PI;
  const start=angle,target=angle+(6+Math.floor(Math.random()*3))*2*Math.PI+delta,duration=4200+Math.random()*700,t0=performance.now();
  function animate(now){
    const p=Math.min(1,(now-t0)/duration),ease=1-Math.pow(1-p,4);angle=start+(target-start)*ease;drawWheel();
    if(p<1){if(Math.random()<.12)beep(180+p*450,.02);requestAnimationFrame(animate)}
    else{
      angle=target;spinning=false;spinBtn.disabled=false;const name=students[idx];previewName.textContent=name;recordPick(name);openWinner(name);
    }
  }
  requestAnimationFrame(animate);
}
function quickPick(){
  if(spinning||!students.length){if(!students.length)alert("Please load at least one student.");return}
  const name=students[Math.floor(Math.random()*students.length)];
  quickName.textContent=name;recordPick(name);openWinner(name);
}
function reveal(){
  if(spinning||!students.length){if(!students.length)alert("Please load at least one student.");return}
  const card=document.getElementById("mysteryCard");card.classList.add("revealed");
  const name=students[Math.floor(Math.random()*students.length)];
  setTimeout(()=>{card.querySelector(".card-front").textContent=name;recordPick(name);openWinner(name)},450);
  setTimeout(()=>{card.classList.remove("revealed");card.querySelector(".card-front").textContent="?";},1800);
}
function setMode(mode){
  currentMode=mode;
  document.querySelectorAll(".mode").forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));
  document.getElementById("wheelMode").classList.toggle("hidden",mode!=="wheel");
  document.getElementById("cardsMode").classList.toggle("hidden",mode!=="cards");
  document.getElementById("quickMode").classList.toggle("hidden",mode!=="quick");
}
document.querySelectorAll(".mode").forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
document.getElementById("loadBtn").onclick=loadClass;
document.getElementById("clearBtn").onclick=()=>{input.value="";students=[];picked=[];loadClass()};
document.getElementById("shuffleBtn").onclick=()=>{
  const a=namesFromInput();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  input.value=a.join("\n");loadClass();
};
document.getElementById("resetBtn").onclick=()=>{
  students=[...students,...picked];picked=[];input.value=students.join("\n");statusLabel.textContent="RESET COMPLETE";previewName.textContent="Everyone is back!";updateUI();drawWheel();
};
spinBtn.onclick=spin;
document.getElementById("quickBtn").onclick=quickPick;
document.getElementById("revealBtn").onclick=reveal;
document.getElementById("mysteryCard").onclick=reveal;
document.getElementById("closeModal").onclick=()=>modal.classList.add("hidden");
document.getElementById("pickAgain").onclick=()=>{modal.classList.add("hidden");setMode(currentMode)};
modal.onclick=e=>{if(e.target===modal)modal.classList.add("hidden")};
document.getElementById("soundBtn").onclick=()=>{soundOn=!soundOn;document.getElementById("soundBtn").textContent=soundOn?"🔊 Sound On":"🔇 Sound Off"};
document.getElementById("fullscreenBtn").onclick=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.()};

input.value=`Ana
Ben
Carlo
Diana
Ethan
Faith
Gabriel
Hannah
Ivan
Julia
Kevin
Lara`;
loadClass();

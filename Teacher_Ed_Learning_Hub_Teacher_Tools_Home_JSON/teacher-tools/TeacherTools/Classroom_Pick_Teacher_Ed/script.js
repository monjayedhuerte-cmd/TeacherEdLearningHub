const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const input = document.getElementById("studentInput");
const spinBtn = document.getElementById("spinBtn");
const quickPickBtn = document.getElementById("quickPickBtn");
const resultName = document.querySelector(".result-name");
const resultLabel = document.querySelector(".result-label");
const removeAfterPick = document.getElementById("removeAfterPick");
const remaining = document.getElementById("remaining");
const totalCount = document.getElementById("totalCount");
const pickedCount = document.getElementById("pickedCount");
const remainingCount = document.getElementById("remainingCount");
const historyList = document.getElementById("historyList");
const modal = document.getElementById("winnerModal");
const winnerName = document.getElementById("winnerName");

let students = [];
let picked = [];
let angle = 0;
let spinning = false;
let soundOn = true;

const palette = ["#4f73e8","#f3b83f","#ef6175","#63b99a","#8065d9","#42a7cf","#ef8b47","#5f83d9","#d86e9d","#65ad75"];

function getNames() {
  return input.value.split(/\n|,/).map(s => s.trim()).filter(Boolean);
}

function loadNames() {
  const names = [...new Set(getNames())];
  students = names;
  picked = [];
  resultLabel.textContent = students.length ? "READY?" : "ADD STUDENTS";
  resultName.textContent = students.length ? "Spin the wheel!" : "Add names to begin.";
  updateUI();
  drawWheel();
}

function updateUI() {
  totalCount.textContent = students.length + picked.length;
  pickedCount.textContent = picked.length;
  remainingCount.textContent = students.length;
  remaining.textContent = `${students.length} remaining`;
  historyList.innerHTML = "";
  if (!picked.length) {
    historyList.innerHTML = '<div class="empty">No one has been picked yet.</div>';
  } else {
    [...picked].reverse().forEach((name, i) => {
      const div = document.createElement("div");
      div.className = "history-item";
      div.innerHTML = `<span class="badge">${picked.length-i}</span><span>${escapeHtml(name)}</span>`;
      historyList.appendChild(div);
    });
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function drawWheel() {
  const n = students.length;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const cx = canvas.width/2, cy = canvas.height/2, r = 295;
  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(angle);
  if (!n) {
    ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2);
    ctx.fillStyle="#dfe5f3"; ctx.fill();
    ctx.fillStyle="#68738a"; ctx.font="800 24px Segoe UI"; ctx.textAlign="center";
    ctx.fillText("ADD STUDENTS",0,8);
    ctx.restore(); return;
  }
  const arc = Math.PI*2/n;
  for (let i=0;i<n;i++) {
    const start = i*arc;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,r,start,start+arc); ctx.closePath();
    ctx.fillStyle=palette[i%palette.length]; ctx.fill();
    ctx.strokeStyle="#ffffff"; ctx.lineWidth=4; ctx.stroke();

    ctx.save();
    ctx.rotate(start+arc/2);
    ctx.textAlign="right"; ctx.textBaseline="middle";
    ctx.fillStyle="#fff";
    const name = students[i];
    let fontSize = n > 18 ? 12 : n > 12 ? 14 : n > 8 ? 16 : 18;
    ctx.font=`900 ${fontSize}px Segoe UI`;
    let label=name;
    const max= n>12 ? 14 : 19;
    if(label.length>max) label=label.slice(0,max-1)+"…";
    ctx.fillText(label,r-22,0);
    ctx.restore();
  }
  ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2);
  ctx.strokeStyle="#fff"; ctx.lineWidth=8; ctx.stroke();
  ctx.restore();
}

function beep(freq=500, duration=.08) {
  if(!soundOn) return;
  try {
    const AC=window.AudioContext||window.webkitAudioContext;
    const ac=new AC(), osc=ac.createOscillator(), gain=ac.createGain();
    osc.frequency.value=freq; osc.type="sine"; gain.gain.value=.035;
    osc.connect(gain); gain.connect(ac.destination); osc.start();
    setTimeout(()=>{osc.stop();ac.close()},duration*1000);
  } catch(e){}
}

function pickRandom() {
  if (!students.length) {
    alert("Add at least one student first!");
    return null;
  }
  return students[Math.floor(Math.random()*students.length)];
}

function addPicked(name) {
  picked.push(name);
  if (removeAfterPick.checked) students = students.filter(s => s !== name);
  updateUI();
  drawWheel();
}

function showWinner(name) {
  resultLabel.textContent = "THE WHEEL CHOSE";
  resultName.textContent = name;
  winnerName.textContent = name;
  modal.classList.remove("hidden");
  beep(880,.18); setTimeout(()=>beep(1175,.2),120);
}

function spin() {
  if (spinning) return;
  if (!students.length) { alert("No students left! Turn off 'Remove after being picked' or reset the picks."); return; }
  spinning=true; spinBtn.disabled=true;
  resultLabel.textContent="SPINNING...";
  resultName.textContent="Who will it be?";
  const n=students.length;
  const winnerIndex=Math.floor(Math.random()*n);
  const slice=(Math.PI*2)/n;
  const targetAtPointer = -(winnerIndex*slice + slice/2);
  const currentNorm=((angle%(Math.PI*2))+Math.PI*2)%(Math.PI*2);
  let delta=targetAtPointer-currentNorm;
  while(delta<0) delta+=Math.PI*2;
  const extra=(6+Math.floor(Math.random()*3))*Math.PI*2;
  const start=angle;
  const target=angle+extra+delta;
  const duration=4300+Math.random()*900;
  const t0=performance.now();

  function frame(now){
    const p=Math.min(1,(now-t0)/duration);
    const eased=1-Math.pow(1-p,4);
    angle=start+(target-start)*eased;
    drawWheel();
    if(Math.random()<.10) beep(180+p*500,.025);
    if(p<1) requestAnimationFrame(frame);
    else {
      angle=target;
      spinning=false; spinBtn.disabled=false;
      const name=students[winnerIndex];
      addPicked(name);
      showWinner(name);
    }
  }
  requestAnimationFrame(frame);
}

function quickPick() {
  if (spinning) return;
  const name=pickRandom();
  if(!name) return;
  addPicked(name);
  resultLabel.textContent="QUICK PICK";
  resultName.textContent=name;
  showWinner(name);
}

document.getElementById("loadBtn").onclick=loadNames;
document.getElementById("clearBtn").onclick=()=>{
  input.value=""; students=[]; picked=[];
  resultLabel.textContent="ADD STUDENTS"; resultName.textContent="Add names to begin.";
  updateUI(); drawWheel();
};
document.getElementById("shuffleBtn").onclick=()=>{
  const names=getNames();
  for(let i=names.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[names[i],names[j]]=[names[j],names[i]]}
  input.value=names.join("\n"); loadNames();
};
document.getElementById("resetBtn").onclick=()=>{
  students=[...students,...picked]; picked=[];
  input.value=students.join("\n");
  updateUI(); drawWheel();
  resultLabel.textContent="RESET COMPLETE"; resultName.textContent="Everyone is back on the wheel!";
};
spinBtn.onclick=spin;
quickPickBtn.onclick=quickPick;
document.getElementById("closeModal").onclick=()=>modal.classList.add("hidden");
modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.add("hidden")});
document.getElementById("soundBtn").onclick=()=>{
  soundOn=!soundOn; document.getElementById("soundBtn").textContent=soundOn?"🔊 Sound":"🔇 Muted";
};
document.getElementById("fullscreenBtn").onclick=()=>{
  if(!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
};

input.value=`Ana
Ben
Carlo
Diana
Ethan
Faith
Gabriel
Hannah
Ivan
Julia`;
loadNames();

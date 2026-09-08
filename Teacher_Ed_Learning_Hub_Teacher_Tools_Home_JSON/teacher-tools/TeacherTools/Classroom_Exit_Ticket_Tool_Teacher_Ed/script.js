const questions=[
 {icon:"💡",type:"REFLECTION",q:"What is one important thing you learned today?",i:"Think for a moment, then write your answer before you leave."},
 {icon:"⭐",type:"UNDERSTANDING",q:"What part of today's lesson do you understand best?",i:"Tell us what you can explain confidently."},
 {icon:"🤔",type:"CHALLENGE",q:"What was the most difficult part of today's lesson?",i:"Be honest. Your answer helps your teacher know what to review."},
 {icon:"🧠",type:"RECALL",q:"What is one idea, fact, or skill you can remember from today?",i:"Write one clear example."},
 {icon:"🗣️",type:"EXPLAIN",q:"Explain today's main idea in your own words.",i:"Pretend you are explaining it to a classmate who was absent."},
 {icon:"🔗",type:"CONNECTION",q:"How can you use what you learned today in real life?",i:"Give one practical example."},
 {icon:"🚦",type:"SELF-CHECK",q:"How well do you understand today's lesson?",i:"Use the scale: 🟢 Got it • 🟡 Almost • 🔴 Need help."},
 {icon:"🎯",type:"NEXT STEP",q:"What do you need to practice more?",i:"Name one skill or idea you want to improve."},
 {icon:"🏆",type:"SUCCESS",q:"What are you proud of accomplishing today?",i:"It can be something small or something challenging."},
 {icon:"❓",type:"QUESTION",q:"What question do you still have about today's lesson?",i:"Your question can guide our next discussion."}
];
let current=0,responses=JSON.parse(localStorage.getItem("teacherEdExitTickets")||"[]");
let seconds=120,timer=null;
const $=id=>document.getElementById(id);
function renderBank(){
 $("bank").innerHTML=questions.map((x,i)=>`<button data-i="${i}" class="${i===current?'active':''}"><span>${x.icon}</span><b>${x.q}</b></button>`).join("");
 document.querySelectorAll("#bank button").forEach(b=>b.onclick=()=>selectQuestion(Number(b.dataset.i)));
}
function selectQuestion(i){
 current=i;const x=questions[i];$("ticketNumber").textContent=String(i+1).padStart(2,"0");$("ticketIcon").textContent=x.icon;$("typeLabel").textContent=x.type;$("question").textContent=x.q;$("instruction").textContent=x.i;renderBank();
 $("answer").value="";$("submitStatus").textContent="";
}
function randomQuestion(){let n=current;while(n===current)n=Math.floor(Math.random()*questions.length);selectQuestion(n)}
function updateStats(){
 $("responseCount").textContent=responses.length;$("completedCount").textContent=responses.length;$("pendingCount").textContent="—";
 $("empty").style.display=responses.length?"none":"block";
 $("responses").innerHTML=responses.slice().reverse().map(r=>`<div class="response"><div><div class="name">${esc(r.name||"Anonymous")}</div><div class="date">${esc(r.date)}</div></div><div><div class="ans">${esc(r.answer)}</div><div class="q">${esc(r.question)}</div></div><div class="tag">✓ SUBMITTED</div></div>`).join("");
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("submitBtn").onclick=()=>{
 const answer=$("answer").value.trim();if(!answer){$("submitStatus").textContent="Please write an answer first.";return}
 responses.push({name:$("studentName").value.trim(),answer,question:questions[current]?.q||$("question").textContent,date:new Date().toLocaleString()});
 localStorage.setItem("teacherEdExitTickets",JSON.stringify(responses));$("answer").value="";$("studentName").value="";$("submitStatus").textContent="✓ Exit ticket submitted!";updateStats();
};
$("randomBtn").onclick=randomQuestion;
$("useCustom").onclick=()=>{
 const q=$("customQ").value.trim();if(!q)return;
 current=-1;$("ticketNumber").textContent="★";$("ticketIcon").textContent="✨";$("typeLabel").textContent="CUSTOM";$("question").textContent=q;$("instruction").textContent="Answer clearly and honestly before you leave.";document.querySelectorAll("#bank button").forEach(b=>b.classList.remove("active"));$("answer").value="";$("submitStatus").textContent="";
};
function formatTime(s){return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
function updateTime(){$("time").textContent=formatTime(seconds)}
function startTimer(){if(timer)return;timer=setInterval(()=>{seconds--;updateTime();if(seconds<=0){clearInterval(timer);timer=null;seconds=0;updateTime();document.body.animate([{transform:"scale(1)"},{transform:"scale(1.01)"},{transform:"scale(1)"}],{duration:600});alert("Exit ticket time is up!");}},1000)}
document.querySelectorAll(".timer-buttons button[data-sec]").forEach(b=>b.onclick=()=>{clearInterval(timer);timer=null;seconds=Number(b.dataset.sec);document.querySelectorAll("[data-sec]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");updateTime()});
$("startTimer").onclick=startTimer;$("resetTimer").onclick=()=>{clearInterval(timer);timer=null;seconds=120;updateTime()};
$("clearBtn").onclick=()=>{if(confirm("Clear all saved exit-ticket responses on this device?")){responses=[];localStorage.removeItem("teacherEdExitTickets");updateStats()}};
$("fullBtn").onclick=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.()};
$("exportBtn").onclick=()=>{
 if(!responses.length){alert("There are no responses to export.");return}
 const rows=[["Name","Question","Answer","Date"],...responses.map(r=>[r.name,r.question,r.answer,r.date])];
 const csv=rows.map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
 const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="Teacher_Ed_Exit_Tickets.csv";a.click();URL.revokeObjectURL(url);
};
selectQuestion(0);updateTime();updateStats();

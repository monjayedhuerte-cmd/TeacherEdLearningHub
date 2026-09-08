const presets={
understanding:{q:"How well do you understand today's lesson?",h:"Choose the answer that best describes you.",type:"UNDERSTANDING",choices:["🟢 I got it!","🟡 Almost there","🔴 I need help"]},
mood:{q:"How are you feeling about today's lesson?",h:"Choose the emoji that matches you.",type:"SELF-CHECK",choices:["😄 Great!","🙂 Good","😐 Okay","😕 Confused"]},
help:{q:"Do you need more help with today's topic?",h:"Your honest answer helps your teacher.",type:"SELF-CHECK",choices:["🟢 No, I'm ready","🟡 A little help","🔴 Yes, please"]},
opinion:{q:"Which part of today's lesson helped you learn the most?",h:"Choose one.",type:"OPINION",choices:["👩‍🏫 Teacher explanation","🎮 Activity/game","👥 Group work","📝 Practice"]}}
let poll={question:presets.understanding.q,hint:presets.understanding.h,type:presets.understanding.type,choices:[...presets.understanding.choices],votes:[0,0,0]},showResults=false,sound=true,seconds=60,total=60,timer=null;
const $=id=>document.getElementById(id);
function renderChoices(){ $("choiceInputs").innerHTML=poll.choices.map((c,i)=>`<div class="choice-line"><input value="${esc(c)}" maxlength="80" data-choice="${i}"><button class="remove-choice" data-remove="${i}" title="Remove">×</button></div>`).join(""); document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{if(poll.choices.length<=2)return;poll.choices.splice(Number(b.dataset.remove),1);renderChoices()})}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderPoll(){
 $("displayQuestion").textContent=poll.question;$("displayHint").textContent=poll.hint;$("pollType").textContent=poll.type;
 const letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ";$("options").innerHTML=poll.choices.map((c,i)=>`<button class="option" data-vote="${i}"><div class="option-top"><span class="letter">${letters[i]}</span><span class="option-text">${esc(c)}</span></div><span class="vote-count" id="vc${i}">0 votes</span><span class="bar" id="ob${i}"></span></button>`).join("");
 document.querySelectorAll("[data-vote]").forEach(b=>b.onclick=()=>vote(Number(b.dataset.vote)));updateResults();renderChoices()
}
function vote(i){poll.votes[i]++;showResults=false;document.querySelector(".poll-card").classList.remove("show-results");updateResults();if(sound)beep();$("totalVotes").textContent=poll.votes.reduce((a,b)=>a+b,0)}
function updateResults(){
 const totalVotes=poll.votes.reduce((a,b)=>a+b,0);$("totalVotes").textContent=totalVotes;
 poll.votes.forEach((v,i)=>{const pct=totalVotes?v/totalVotes*100:0;const bar=$("ob"+i),vc=$("vc"+i);if(bar)bar.style.width=pct+"%";if(vc)vc.textContent=`${v} vote${v===1?"":"s"} • ${Math.round(pct)}%`});
 $("emptyResults").style.display=totalVotes?"none":"block";
 if(!totalVotes){$("winner").classList.add("hidden");$("results").innerHTML="";return}
 const max=Math.max(...poll.votes),wi=poll.votes.indexOf(max);$("winner").classList.remove("hidden");$("winner").textContent=`🏆 Leading choice: ${poll.choices[wi]} — ${max} vote${max===1?"":"s"}`;
 $("results").innerHTML=poll.choices.map((c,i)=>{const pct=totalVotes?poll.votes[i]/totalVotes*100:0;return `<div class="result-row"><div class="result-label">${esc(c)}</div><div class="result-bar"><div class="result-fill" style="width:${pct}%">${Math.round(pct)}%</div></div><div class="result-number">${poll.votes[i]} vote${poll.votes[i]===1?"":"s"}</div></div>`}).join("");
}
function beep(){try{const c=new (window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.frequency.value=700;g.gain.value=.025;o.connect(g);g.connect(c.destination);o.start();setTimeout(()=>{o.frequency.value=900},70);setTimeout(()=>{o.stop();c.close()},140)}catch(e){}}
function readBuilder(){const q=$("questionInput").value.trim();if(!q){alert("Please enter a poll question.");return false}const choices=[...document.querySelectorAll("[data-choice]")].map(x=>x.value.trim()).filter(Boolean);if(choices.length<2){alert("A poll needs at least 2 choices.");return false}poll={question:q,hint:$("hintInput").value.trim()||"Choose one answer.",type:$("typeInput").value,choices,votes:choices.map(()=>0)};return true}
$("createBtn").onclick=()=>{if(readBuilder()){renderPoll();$("questionInput").value="";$("hintInput").value="";$("pollCard")?.scrollIntoView({behavior:"smooth"})}};
$("addChoice").onclick=()=>{if(document.querySelectorAll("[data-choice]").length>=6){alert("Maximum 6 choices.");return}poll.choices.push("New choice");renderChoices()};
document.querySelectorAll("[data-preset]").forEach(b=>b.onclick=()=>{poll={...presets[b.dataset.preset],choices:[...presets[b.dataset.preset].choices],votes:presets[b.dataset.preset].choices.map(()=>0)};renderPoll()});
$("voteModeBtn").onclick=()=>{showResults=false;document.querySelector(".poll-card").classList.remove("show-results")};
$("resultsBtn").onclick=()=>{showResults=true;document.querySelector(".poll-card").classList.add("show-results");updateResults()};
$("resetBtn").onclick=()=>{poll.votes=poll.choices.map(()=>0);showResults=false;document.querySelector(".poll-card").classList.remove("show-results");updateResults()};
function updateTime(){$("time").textContent=String(Math.floor(seconds/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0")}
$("timerBtn").onclick=()=>{if(timer)return;timer=setInterval(()=>{seconds--;updateTime();if(seconds<=0){clearInterval(timer);timer=null;alert("Poll time is up!");}},1000)};
$("timerReset").onclick=()=>{clearInterval(timer);timer=null;seconds=total;updateTime()};
document.querySelectorAll(".timer-buttons button[data-sec]").forEach(b=>b.onclick=()=>{clearInterval(timer);timer=null;total=seconds=Number(b.dataset.sec);document.querySelectorAll("[data-sec]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");updateTime()});
$("soundBtn").onclick=()=>{sound=!sound;$("soundBtn").textContent=sound?"🔊 Sound On":"🔇 Sound Off"};
$("fullBtn").onclick=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.()};
$("exportBtn").onclick=()=>{const rows=[["Choice","Votes","Percent"],...poll.choices.map((c,i)=>{const t=poll.votes.reduce((a,b)=>a+b,0);return[c,poll.votes[i],t?(poll.votes[i]/t*100).toFixed(1)+"%":"0%"]})];const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");const blob=new Blob(["\ufeff"+csv],{type:"text/csv"}),u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download="Teacher_Ed_Class_Poll.csv";a.click();URL.revokeObjectURL(u)};
$("questionInput").value=poll.question;$("hintInput").value=poll.hint;$("typeInput").value=poll.type;renderPoll();updateTime();

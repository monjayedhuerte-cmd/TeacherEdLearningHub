const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const KEY="ted_g3_l5_v1";
let state=JSON.parse(localStorage.getItem(KEY)||'{"stars":0,"badges":0,"answered":0,"correct":0,"mistakes":[],"completed":[]}');
let soundOn=true;
const maps=[
 ["Connect","Teach","Model","Together","Your Turn","Games","Review","Apply","Mastery"],
 ["Connect","Teach","Model","Together","Your Turn","Games","Review","Apply","Mastery"]
];
function save(){localStorage.setItem(KEY,JSON.stringify(state));updateProgress()}
function updateProgress(){
 const total=40, pct=Math.min(100,Math.round((state.answered/total)*100));
 $("#progressBar").style.width=pct+"%"; $("#progressText").textContent=pct+"%";
 $("#stars").textContent=state.stars; $("#badges").textContent=state.badges;
 $("#level").textContent=Math.min(5,Math.floor(pct/20)+1);
 $("#finalStars").textContent=state.stars; $("#finalBadges").textContent=state.badges; $("#finalProgress").textContent=pct+"%";
}
function reward(correct,label){
 state.answered++;
 if(correct){state.correct++;state.stars++; if(state.correct>0&&state.correct%8===0)state.badges++}
 else if(label&&!state.mistakes.includes(label))state.mistakes.push(label);
 save();
}
function feedback(id,correct,msg){
 const el=$("#"+id); if(el) el.innerHTML=correct?"<span style='color:#20844b'>🌟 Excellent! "+msg+"</span>":"<span style='color:#b04a4a'>💡 Let's think again. "+msg+"</span>";
}
function answerButtons(){
 $$(".choice,.picture-choice").forEach(btn=>btn.addEventListener("click",()=>{
   const group=btn.closest("[data-q]"); if(!group||group.dataset.done==="1")return;
   const correct=btn.dataset.answer==="true"; group.dataset.done="1";
   $$(".choice,.picture-choice",group).forEach(b=>b.disabled=true);
   btn.classList.add(correct?"correct":"incorrect");
   const id=group.dataset.q+"-feedback"; feedback(id,correct,correct?"That's right!":"Look at the lesson example and try to remember the direction or health idea.");
   reward(correct,group.dataset.q);
 }));
}
function buildMap(id){
 $(id).innerHTML=maps[0].map((x,i)=>`<span class="map-node ${i===0?'current':''}">${["🏫","📖","👩‍🏫","🤝","🎯","🎮","🧠","🌟","🏆"][i]} ${x}</span>${i<8?'<span class="map-arrow">→</span>':''}`).join("");
}
buildMap("#peMap");buildMap("#healthMap");
answerButtons();

const modelCaptions=[
 ["Start","Start in your own safe space.","translateY(0)"],
 ["Forward","Move ahead from where you are.","translateY(-25px)"],
 ["Backward","Move behind from where you are.","translateY(25px)"],
 ["Sideward","Move to the side.","translateX(45px)"]
];
$$(".model-step").forEach(b=>b.addEventListener("click",()=>{
 $$(".model-step").forEach(x=>x.classList.remove("active"));b.classList.add("active");
 const d=modelCaptions[+b.dataset.step], p=$("#modelStage .person");
 p.style.transform=d[2]; $("#modelStage .model-caption").textContent=d[1];
}));

const pePractice=[
 ["Which direction means go behind you?","Backward","Forward","Down","pe-p1"],
 ["Which direction means go ahead?","Forward","Clockwise","Up","pe-p2"],
 ["Which direction is shown by ⬆️?","Up","Down","Backward","pe-p3"],
 ["Which direction is shown by ⬇️?","Down","Up","Forward","pe-p4"]
];
const healthPractice=[
 ["Which is a characteristic of a healthy person?","Eats a balanced diet","Ignores hygiene","Never cares for health","h-p1"],
 ["Which is a healthy characteristic?","Socializes well with others","Always discontented","Avoids everyone","h-p2"],
 ["Which is listed in the source?","Practices proper hygiene","Never washes","Ignores health","h-p3"],
 ["A healthy person has…","a positive outlook in life","no confidence","no respect for others","h-p4"]
];
function practiceHTML(data,target){
 $(target).innerHTML=data.map((q,i)=>`<div class="practice-item" data-q="${q[4]}"><h3>${i+1}. ${q[0]}</h3>
 <div class="choice-row"><button class="choice" data-answer="true">${q[1]}</button><button class="choice" data-answer="false">${q[2]}</button><button class="choice" data-answer="false">${q[3]}</button></div>
 <button class="hint-btn" data-hint="${q[4]}">💡 Hint</button><div class="hint" id="hint-${q[4]}">Think about the words and examples in the lesson.</div><div class="feedback" id="${q[4]}-feedback"></div></div>`).join("");
 $$(target+" .choice").forEach(btn=>btn.addEventListener("click",()=>{
   const group=btn.closest(".practice-item"); if(group.dataset.done==="1")return; group.dataset.done="1";
   $$(".choice",group).forEach(x=>x.disabled=true); const correct=btn.dataset.answer==="true";btn.classList.add(correct?"correct":"incorrect");
   feedback(qid(group)+"-feedback",correct,correct?"Good thinking!":"Use the hint and review the example."); reward(correct,qid(group));
 }));
 $$(target+" .hint-btn").forEach(btn=>btn.addEventListener("click",()=>$("#hint-"+btn.dataset.hint).classList.toggle("show")));
}
function qid(el){return el.dataset.q}
practiceHTML(pePractice,"#pePractice");practiceHTML(healthPractice,"#healthPractice");

$("#healthyHabitBtn").addEventListener("click",()=>{ $("#habitFeedback").innerHTML="<span style='color:#20844b'>🌟 That's right! Washing hands supports proper hygiene.</span>"; reward(true,"habit-healthy")});
$("#notHealthyHabitBtn").addEventListener("click",()=>{ $("#habitFeedback").innerHTML="<span style='color:#b04a4a'>💡 Let's think again. Washing hands is an example of proper hygiene.</span>"; reward(false,"habit-model")});

function makeGame(area,type){
 const bank= type==="direction" ? [
  ["➡️","What direction?","Forward","Backward","Up"],
  ["⬅️","What direction?","Backward","Forward","Down"],
  ["⬆️","What direction?","Up","Down","Forward"],
  ["⬇️","What direction?","Down","Up","Backward"]
 ] : type==="scenario" ? [
  ["🏃","The teacher says “go ahead.”","Forward","Backward","Down"],
  ["🔙","The teacher says “go behind.”","Backward","Forward","Up"],
  ["↻","Turn in this direction.","Clockwise","Down","Forward"]
 ] : type==="healthySort" ? [
  ["🥗","Which supports health?","Balanced diet","Ignore hygiene","Never exercise"],
  ["🧼","Which supports health?","Proper hygiene","No cleaning","Ignoring health"],
  ["🤝","Which is listed?","Respect yourself and others","Disrespect others","Avoid all people"]
 ] : type==="healthAdventure" ? [
  ["🍎","Choose the better health habit.","Balanced diet","Ignore healthy food","Skip care"],
  ["🧼","Choose the better health habit.","Proper hygiene","Avoid hygiene","Never clean"],
  ["🏃","Choose the better health idea.","Be active","Never move","Ignore health"]
 ] : [
  ["🧠","Match the lesson idea.","Concept","Random","None"]
 ];
 let i=0,score=0;
 function render(){
  if(i>=bank.length){area.innerHTML=`<div class="game-question"><div class="big">🎉</div><h3>Game complete!</h3><p>You got <b>${score}/${bank.length}</b> correct.</p><button class="primary" id="replay">Play Again</button></div>`;$("#replay").onclick=()=>{i=0;score=0;render()};return}
  const q=bank[i], opts=[q[2],q[3],q[4]].sort(()=>Math.random()-.5);
  area.innerHTML=`<div class="game-score">Question ${i+1}/${bank.length} • ⭐ ${score}</div><div class="game-question"><div class="big">${q[0]}</div><h3>${q[1]}</h3><div class="game-options">${opts.map((o,n)=>`<button data-v="${o}" data-c="${o===q[2]}">${o}</button>`).join("")}</div><div class="feedback" id="gameFb"></div></div>`;
  $$(".game-options button",area).forEach(b=>b.onclick=()=>{const c=b.dataset.c==="true";score+=c?1:0;reward(c,type+"-"+i);b.style.borderWidth="3px";$("#gameFb").innerHTML=c?"🌟 Excellent!":"💡 Let's think again.";setTimeout(()=>{i++;render()},650)});
 }
 area.classList.remove("hidden");render();
}
$$(".game-card").forEach(btn=>btn.addEventListener("click",()=>{
 const panel=btn.closest(".lesson-panel"); const area=panel.id==="peLesson"?$("#peGameArea"):$("#healthGameArea");
 makeGame(area,btn.dataset.game); area.scrollIntoView({behavior:"smooth",block:"center"});
}));

function spiral(target,questions){
 $(target).innerHTML=questions.map((q,i)=>`<div class="practice-item" data-q="${q[3]}"><h3>${i+1}. ${q[0]}</h3><div class="choice-row"><button class="choice" data-answer="true">${q[1]}</button><button class="choice" data-answer="false">${q[2]}</button></div><div class="feedback" id="${q[3]}-feedback"></div></div>`).join("");
 $$(target+" .choice").forEach(btn=>btn.addEventListener("click",()=>{const g=btn.closest(".practice-item");if(g.dataset.done==="1")return;g.dataset.done="1";const c=btn.dataset.answer==="true";$$(".choice",g).forEach(x=>x.disabled=true);btn.classList.add(c?"correct":"incorrect");feedback(g.dataset.q+"-feedback",c,c?"Great retrieval!":"Review the lesson and try again.");reward(c,g.dataset.q)}));
}
spiral("#peSpiral",[["Which movement goes behind?","Backward","Forward","pe-s1"],["Which direction goes higher?","Up","Down","pe-s2"],["Which turning direction is shown by ↻?","Clockwise","Counterclockwise","pe-s3"]]);
spiral("#healthSpiral",[["Which is listed as a healthy characteristic?","Eats a balanced diet","Ignores hygiene","h-s1"],["Which is listed?","Has a positive outlook in life","Always discontented","h-s2"],["Which behavior is named in the lesson?","Respects oneself as well as others","Disrespects everyone","h-s3"]]);

const finals={
 pe:[["Which direction means moving ahead?","Forward","Backward","Down"],["Which direction means moving behind?","Backward","Forward","Up"],["Which is a turning direction shown in the lesson?","Clockwise","Forward","Down"],["Which direction is shown by ⬆️?","Up","Down","Backward"],["Which direction is shown by ⬇️?","Down","Up","Forward"]],
 health:[["Which is a characteristic of a healthy person?","Eats a balanced diet","Ignores health","Never practices hygiene"],["Which is listed in the lesson?","Practices proper hygiene","Avoids hygiene","Ignores cleanliness"],["A healthy person can…","Socialize well with others","Always be discontented","Disrespect others"],["Which statement is supported by the source?","A healthy person can have a positive outlook in life","Health does not matter","Good health habits are unnecessary"],["Which is a healthy characteristic?","Respects oneself as well as others","Disrespects oneself and others","Never cares for others"]]
};
function finalQuiz(target,type){
 const qs=finals[type], box=$(target); let i=0,score=0;
 function render(){
  if(i===qs.length){const pct=Math.round(score/qs.length*100);let msg=pct>=90?"🏆 Lesson Master!":pct>=80?"🌟 Almost There!":pct>=70?"👍 Good Progress!":"💡 Keep Practicing!";
   box.innerHTML=`<div class="game-question"><div class="big">${pct>=70?"🎉":"💪"}</div><h3>${msg}</h3><p>Final score: <b>${score}/${qs.length} (${pct}%)</b></p><div class="final-controls"><button class="primary" id="finalAgain">Try Again</button><button class="secondary" onclick="scrollToTop()">Back to Learning</button></div></div>`;
   if(pct>=90)state.badges++; save();return;
  }
  const q=qs[i], opts=[q[1],q[2],q[3]].sort(()=>Math.random()-.5);
  box.innerHTML=`<div class="game-score">Final Challenge • ${i+1}/${qs.length}</div><h3>${q[0]}</h3><div class="game-options">${opts.map(o=>`<button data-c="${o===q[1]}">${o}</button>`).join("")}</div><div class="feedback" id="finalFb"></div>`;
  $$(".game-options button",box).forEach(b=>b.onclick=()=>{const c=b.dataset.c==="true";score+=c?1:0;reward(c,"final-"+type+"-"+i);$("#finalFb").innerHTML=c?"🌟 Excellent!":"💡 Let's think again.";setTimeout(()=>{i++;render()},600)});
 }
 render();
}
finalQuiz("#peFinal","pe");finalQuiz("#healthFinal","health");

$$(".tab").forEach(tab=>tab.addEventListener("click",()=>{
 $$(".tab").forEach(t=>t.classList.remove("active"));tab.classList.add("active");
 $$(".lesson-panel").forEach(p=>p.classList.remove("active"));$("#"+tab.dataset.lesson+"Lesson").classList.add("active");
 window.scrollTo({top:0,behavior:"smooth"});
}));

$("#resetBtn").onclick=()=>{if(confirm("Reset all stars, badges, scores, and progress?")){localStorage.removeItem(KEY);location.reload()}};
$("#soundBtn").onclick=()=>{soundOn=!soundOn;$("#soundBtn").textContent=soundOn?"🔊 Sound On":"🔇 Sound Off"};
function scrollToTop(){window.scrollTo({top:0,behavior:"smooth"})}
function showMistakes(){const a=$("#mistakesArea");a.innerHTML=state.mistakes.length?`<h3>🔄 Practice My Mistakes</h3><p>Review these areas: <b>${state.mistakes.join(", ")}</b>.</p><p>Go back to the lesson sections and try those questions again.</p>`:"<p>🌟 No recorded mistakes yet. Keep practicing to stay strong!</p>";a.scrollIntoView({behavior:"smooth"})}
updateProgress();

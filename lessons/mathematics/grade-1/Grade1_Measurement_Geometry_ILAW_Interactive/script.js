const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const state = {
  quizIndex: 0, quizScore: 0, quizAnswered: false,
  rotation: 0, built: [], sortScore: 0, sortTotal: 0,
  completedLearn: false, completedApply: false, completedMastery: false
};

const shapeData = {
  triangle: {name:"Triangle", sides:3, corners:3, key:"It has 3 straight sides and 3 corners.", color:"pink"},
  square: {name:"Square", sides:4, corners:4, key:"It has 4 equal sides and 4 corners.", color:"blue"},
  rectangle: {name:"Rectangle", sides:4, corners:4, key:"It has 4 sides and 4 corners. Opposite sides are equal.", color:"green"}
};

function scrollToSelector(selector){ const el=$(selector); if(el) el.scrollIntoView({behavior:"smooth"}); }
$$("[data-scroll]").forEach(btn=>btn.addEventListener("click",()=>scrollToSelector(btn.dataset.scroll)));

const menuToggle=$("#menuToggle"), navLinks=$("#navLinks");
menuToggle?.addEventListener("click",()=>navLinks.classList.toggle("open"));
$$(".nav-links a").forEach(a=>a.addEventListener("click",()=>navLinks.classList.remove("open")));

const modal=$("#modal"), modalContent=$("#modalContent");
function openModal(title, text, emoji="🔷"){
  modalContent.innerHTML=`<div style="font-size:45px">${emoji}</div><h2>${title}</h2><p>${text}</p>`;
  modal.hidden=false;
}
$("#modalClose").addEventListener("click",()=>modal.hidden=true);
modal.addEventListener("click",e=>{if(e.target===modal) modal.hidden=true});

$("#foundShapesBtn").addEventListener("click",()=>{
  $("#foundMessage").hidden=false;
  state.completedLearn=true; updateOverallProgress();
});
$$(".object-card").forEach(card=>card.addEventListener("click",()=>{
  const obj=card.dataset.object;
  openModal(`${obj} in real life`, `You found an object that can remind us of a ${obj.toLowerCase()}. Look for its sides and corners!`, obj==="Triangle"?"🚩":obj==="Square"?"🟦":"📖");
}));

$$(".shape-card").forEach(card=>card.addEventListener("click",()=>{
  const d=shapeData[card.dataset.shape];
  state.completedLearn=true; updateOverallProgress();
  $("#shapeInfo").innerHTML=`<div class="info-icon">💡</div><div><h3>${d.name}</h3><p><b>${d.sides} sides</b> • <b>${d.corners} corners</b>. ${d.key}</p></div>`;
}));

$("#leftRotate").addEventListener("click",()=>changeRotation(-45));
$("#rightRotate").addEventListener("click",()=>changeRotation(45));
$("#resetRotate").addEventListener("click",()=>{state.rotation=0; $("#rotatingSquare").style.transform="rotate(0deg)"; $("#orientationAnswer").innerHTML="Is it still a square? 🤔";});
function changeRotation(amount){
  state.rotation+=amount;
  $("#rotatingSquare").style.transform=`rotate(${state.rotation}deg)`;
  $("#orientationAnswer").innerHTML="🎉 Yes! It is still a <b>square</b>. Turning a shape changes its orientation, not its name.";
  state.completedLearn=true; updateOverallProgress();
}

$$(".choice-row button").forEach(btn=>btn.addEventListener("click",()=>{
  const box=$("#compareFeedback");
  box.className="feedback show";
  if(btn.dataset.answer==="correct"){
    box.textContent="🎉 Correct! A square and a rectangle both have 4 sides and 4 corners.";
    box.style.background="#eafff3"; box.style.color="#26885b";
    state.completedApply=true;
  }else{
    box.textContent="💡 Try again. Count the sides and corners of each shape.";
    box.style.background="#fff5dd"; box.style.color="#986700";
  }
  updateOverallProgress();
}));

const questions=[
 {q:"Which shape has 3 sides and 3 corners?", answers:["Triangle","Square","Rectangle"], correct:0, visual:"triangle"},
 {q:"Which shape has 4 equal sides?", answers:["Triangle","Square","Rectangle"], correct:1, visual:"square"},
 {q:"Which shape usually looks longer than it is tall?", answers:["Triangle","Square","Rectangle"], correct:2, visual:"rectangle"},
 {q:"How many corners does a triangle have?", answers:["2","3","4"], correct:1},
 {q:"How many sides does a rectangle have?", answers:["3","4","5"], correct:1},
 {q:"A square is turned like a diamond. What is it?", answers:["Still a square","A triangle","A rectangle"], correct:0, visual:"diamond"},
 {q:"Which pair has 4 sides?", answers:["Triangle & Square","Square & Rectangle","Triangle & Rectangle"], correct:1},
 {q:"What can two triangles make when put together?", answers:["A square or rectangle","Only a circle","Nothing"], correct:0}
];

function renderQuiz(){
  const q=questions[state.quizIndex];
  state.quizAnswered=false;
  $("#quizNumber").textContent=`QUESTION ${state.quizIndex+1} OF ${questions.length}`;
  $("#quizScore").textContent=`⭐ ${state.quizScore}`;
  $("#quizProgress").style.width=`${(state.quizIndex/questions.length)*100}%`;
  $("#quizQuestion").textContent=q.q;
  $("#quizFeedback").className="feedback";
  $("#quizFeedback").textContent="";
  $("#nextQuestion").hidden=true;
  const visual=$("#quizVisual"); visual.innerHTML="";
  if(q.visual){
    const el=document.createElement("div");
    el.className=q.visual==="diamond"?"q-square":"q-"+q.visual;
    if(q.visual==="diamond") el.style.transform="rotate(45deg)";
    visual.appendChild(el);
  }
  const answers=$("#quizAnswers"); answers.innerHTML="";
  q.answers.forEach((a,i)=>{
    const b=document.createElement("button"); b.className="quiz-answer"; b.textContent=a;
    b.addEventListener("click",()=>answerQuiz(i,b)); answers.appendChild(b);
  });
}
function answerQuiz(index,button){
  if(state.quizAnswered)return;
  state.quizAnswered=true;
  const q=questions[state.quizIndex], all=$$(".quiz-answer");
  const box=$("#quizFeedback");
  if(index===q.correct){
    state.quizScore++; button.classList.add("correct");
    box.textContent="🎉 Excellent! That is correct!";
    box.style.background="#eafff3"; box.style.color="#26885b";
  }else{
    button.classList.add("wrong"); all[q.correct].classList.add("correct");
    box.textContent=`💡 Good try! The correct answer is "${q.answers[q.correct]}".`;
    box.style.background="#fff5dd"; box.style.color="#986700";
  }
  box.className="feedback show";
  $("#quizScore").textContent=`⭐ ${state.quizScore}`;
  $("#nextQuestion").hidden=false;
  state.completedApply=true; updateOverallProgress();
}
$("#nextQuestion").addEventListener("click",()=>{
  state.quizIndex++;
  if(state.quizIndex<questions.length) renderQuiz();
  else finishQuiz();
});
function finishQuiz(){
  const pct=Math.round(state.quizScore/questions.length*100);
  state.completedMastery=true;
  $("#finalScore").textContent=pct+"%";
  const stars=Math.ceil(pct/20);
  $("#stars").textContent="★".repeat(stars)+"☆".repeat(5-stars);
  let title,msg;
  if(pct>=90){title="🌟 Outstanding, Shape Master!";msg="You showed excellent understanding of triangles, squares, rectangles, and their features."}
  else if(pct>=75){title="🎉 Great Shape Explorer!";msg="You understand most of the lesson. Keep practicing to become even stronger."}
  else if(pct>=50){title="👍 Good Effort!";msg="You are learning! Review the shape features and try the quiz again."}
  else{title="🌱 Keep Exploring!";msg="Let's practice again. Look carefully at sides, corners, and shape names."}
  $("#masteryTitle").textContent=title; $("#masteryMessage").textContent=msg;
  $("#quizNumber").textContent="QUIZ COMPLETE 🎉"; $("#quizQuestion").textContent=`You scored ${state.quizScore} out of ${questions.length}.`;
  $("#quizVisual").innerHTML="🏆"; $("#quizAnswers").innerHTML="";
  $("#quizFeedback").className="feedback";
  $("#nextQuestion").hidden=true; $("#quizProgress").style.width="100%";
  updateOverallProgress();
  scrollToSelector("#mastery");
}
$("#restartQuiz").addEventListener("click",()=>{
  state.quizIndex=0;state.quizScore=0;state.completedMastery=false;renderQuiz();scrollToSelector("#apply");
});

function updateOverallProgress(){
  let completed=0;
  if(state.completedLearn)completed+=33;
  if(state.completedApply)completed+=33;
  if(state.completedMastery)completed+=34;
  $("#overallProgress").style.width=completed+"%";
  $("#overallText").textContent=`${completed}% completed`;
  $("#pLearn").textContent=(state.completedLearn?"✓":"○")+" Learn";
  $("#pApply").textContent=(state.completedApply?"✓":"○")+" Apply";
  $("#pMaster").textContent=(state.completedMastery?"✓":"○")+" Mastery";
}
$("#progressToggle").addEventListener("click",()=>$("#progressPanel").classList.toggle("open"));

function newSortShape(){
  const keys=Object.keys(shapeData), key=keys[Math.floor(Math.random()*keys.length)];
  const area=$("#sortShapeArea"); area.innerHTML="";
  const el=document.createElement("div"); el.className="sort-"+key; area.appendChild(el);
  area.dataset.answer=key;
  $("#sortFeedback").textContent="Which basket matches this shape?";
  state.sortTotal++; $("#sortTotal").textContent=state.sortTotal;
}
$$(".basket").forEach(b=>b.addEventListener("click",()=>{
  const answer=$("#sortShapeArea").dataset.answer;
  if(b.dataset.basket===answer){
    state.sortScore++;$("#sortFeedback").textContent="🎉 Correct! Great sorting!";
    $("#sortFeedback").style.color="#26885b";
  }else{
    $("#sortFeedback").textContent="💡 Not quite. Look at the sides and corners again.";
    $("#sortFeedback").style.color="#986700";
  }
  $("#sortScore").textContent=state.sortScore;
  state.completedApply=true;updateOverallProgress();
  setTimeout(newSortShape,900);
}));

$$(".piece-button").forEach(btn=>btn.addEventListener("click",()=>{
  if(state.built.length===0)$("#builderArea").innerHTML="";
  const type=btn.dataset.piece;
  state.built.push(type);
  const el=document.createElement("span");el.className=`built-piece built-${type}`;el.title=type;
  $("#builderArea").appendChild(el);
  $("#builderMessage").textContent=state.built.length<3?"Nice! Add another piece.":"🎉 You are composing a picture with shapes!";
  state.completedApply=true;updateOverallProgress();
}));
$("#clearBuild").addEventListener("click",()=>{
  state.built=[];$("#builderArea").innerHTML="<p>🧩 Your pieces will appear here.</p>";$("#builderMessage").textContent="What can you create?";
});
$("#checkBuild").addEventListener("click",()=>{
  if(state.built.length<2)$("#builderMessage").textContent="💡 Add at least two pieces to make a composition.";
  else $("#builderMessage").textContent="🌟 Great composing! You combined different 2-D shapes into a new design.";
  state.completedApply=true;updateOverallProgress();
});

$$(".decompose-buttons button").forEach(btn=>btn.addEventListener("click",()=>{
  const box=$("#decomposeFeedback");box.className="feedback show";
  if(btn.dataset.decomp==="triangle"){
    box.textContent="🎉 Correct! The square was divided into two triangles.";
    box.style.background="#eafff3";box.style.color="#26885b";
    state.completedApply=true;
  }else{
    box.textContent="💡 Look at the diagonal line. It creates two triangles.";
    box.style.background="#fff5dd";box.style.color="#986700";
  }
  updateOverallProgress();
}));

$$(".rating-row").forEach(row=>$$("button",row).forEach(btn=>btn.addEventListener("click",()=>{
  $$("button",row).forEach(x=>x.classList.remove("selected"));btn.classList.add("selected");
})));

renderQuiz();
newSortShape();
updateOverallProgress();

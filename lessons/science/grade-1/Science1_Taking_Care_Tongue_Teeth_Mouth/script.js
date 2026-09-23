const state = JSON.parse(localStorage.getItem("teacherEdScienceMouth") || '{"score":0,"stars":0,"badges":0,"completed":0,"mistakes":[]}');
let soundOn=true;
const stageIds=["connect","learn","model","guided","independent","games","review","apply","mastery","remediate","celebrate"];
function save(){localStorage.setItem("teacherEdScienceMouth",JSON.stringify(state));updateStats()}
function updateStats(){
  document.getElementById("score").textContent=state.score;
  document.getElementById("stars").textContent=state.stars;
  document.getElementById("badges").textContent=state.badges;
  document.getElementById("finalScore").textContent=state.score;
  document.getElementById("finalStars").textContent=state.stars;
  document.getElementById("finalBadges").textContent=state.badges;
  const pct=Math.min(100,Math.round(((state.completed+1)/stageIds.length)*100));
  document.getElementById("progressBar").style.width=pct+"%";
  document.getElementById("stageText").textContent=Math.min(stageIds.length,state.completed+1)+" of "+stageIds.length+" stages";
}
function goTo(id){document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"})}
function award(points=10,star=true){
  state.score+=points;
  if(star) state.stars+=1;
  save();
}
function feedback(el,msg,good){el.textContent=msg;el.className="feedback "+(good?"good":"try")}
function handleChoice(container, feedbackEl, onGood){
  [...container.querySelectorAll("button")].forEach(btn=>{
    btn.onclick=()=>{
      const correct=btn.dataset.correct==="true";
      [...container.querySelectorAll("button")].forEach(b=>b.disabled=true);
      if(correct){btn.classList.add("correct");feedback(feedbackEl,"🌟 Excellent! That's a healthy and safe choice.",true);award(10,true);if(onGood)onGood();}
      else{btn.classList.add("wrong");feedback(feedbackEl,"💡 Let's think again. Choose a habit that protects or cleans the tongue, teeth, or mouth.",false);}
    };
  });
}
handleChoice(document.getElementById("connectChoices"),document.getElementById("connectFeedback"));
handleChoice(document.getElementById("scenarioChoices"),document.getElementById("scenarioFeedback"));

let modelStep=0;
document.getElementById("modelNext").onclick=()=>{
  document.querySelectorAll(".model-step").forEach(x=>x.classList.remove("active"));
  modelStep=(modelStep+1)%3;
  document.querySelector(`.model-step[data-step="${modelStep}"]`).classList.add("active");
  if(modelStep===0) award(5,false);
};

const guided=[
["What should you do before eating very hot food?",["Cool it first.","Eat it quickly.","Taste it first."],0,"Hot food could burn your tongue."],
["What can you use to clean your tongue?",["A dirty cloth.","A cotton swab or clean, soft cloth.","A sharp object."],1,"The source says to use a cotton swab or a clean, soft cloth."],
["What should you use to remove particles between your teeth?",["Dental floss.","A pencil.","A coin."],0,"Dental floss removes particles between teeth."],
["What should you do after eating candy or sweet foods?",["Never brush.","Brush your teeth.","Put more candy in your mouth."],1,"The lesson says to brush your teeth after eating candies and other sweet foods."],
["How often should you see a dentist for a dental checkup?",["At least once a year.","Only once in childhood.","Never."],0,"The source recommends a dental checkup at least once a year."]
];
const independent=[
["Which toothbrush should you use?",["A clean toothbrush with soft bristles.","A dirty brush.","A brush with very hard bristles."],0],
["Which is a safe habit?",["Tasting unknown substances.","Being careful not to bite your tongue.","Eating food while it is very hot."],1],
["Why should you avoid tasting unknown things?",["They may be toxic or poisonous.","They are always sweet.","They make teeth stronger."],0],
["What does dental floss help remove?",["Particles between teeth.","Hair from your head.","Water from a cup."],0],
["What can mouthwash do when you gargle?",["It can kill bacteria that cause bad breath.","It makes candy healthier.","It burns the tongue."],0],
["What should you do regularly for your teeth?",["Brush after every meal.","Never clean them.","Eat more candy."],0]
];
function buildQuiz(data,prefix,rememberMistakes=true){
 let idx=0, scoreStart=state.score;
 const qEl=document.getElementById(prefix+"Q"), aEl=document.getElementById(prefix+"Answers"), fEl=document.getElementById(prefix+"Feedback"), nEl=document.getElementById(prefix+"Num"), next=document.getElementById(prefix+"Next");
 function render(){
  const q=data[idx]; nEl.textContent=idx+1;qEl.textContent=q[0];aEl.innerHTML="";fEl.textContent="";fEl.className="feedback";next.classList.add("hidden");
  q[1].forEach((ans,i)=>{const b=document.createElement("button");b.textContent=String.fromCharCode(65+i)+". "+ans;b.onclick=()=>{
   [...aEl.children].forEach(x=>x.disabled=true);
   if(i===q[2]){b.classList.add("correct");feedback(fEl,"🌟 Great thinking! "+(q[3]||""),true);award(10,true)}
   else{b.classList.add("wrong");feedback(fEl,"💡 Let's think again. "+(q[3]||"Look at the lesson picture and remember the rule."),false);if(rememberMistakes)state.mistakes.push(q[0]);save()}
   next.classList.remove("hidden");
  };aEl.appendChild(b)});
 }
 next.onclick=()=>{idx++;if(idx<data.length)render();else{next.classList.add("hidden");feedback(fEl,"🎉 You finished this practice set!",true);state.completed=Math.max(state.completed,4);save()}};
 render();
}
buildQuiz(guided,"guided");
buildQuiz(independent,"ind");

const master=[
["What should you do before eating food that is very hot?",["Cool it.","Eat it immediately.","Taste it first."],0],
["What can you use to clean your tongue after a meal?",["A clean, soft cloth.","A sharp tool.","A dirty towel."],0],
["Which is a safe mouth habit?",["Be careful not to bite your tongue.","Bite your tongue on purpose.","Taste unknown substances."],0],
["Why should you avoid tasting unknown things?",["Some may be toxic or poisonous.","They are always sour.","They clean your teeth."],0],
["How often should you brush your teeth according to the source?",["After every meal.","Once a month.","Only when they hurt."],0],
["What should a toothbrush have?",["Soft bristles and be clean.","Very sharp bristles.","Dirt on the handle."],0],
["What removes particles between teeth?",["Dental floss.","Candy.","A spoon."],0],
["What should you avoid eating too much of?",["Candy and sweet foods.","Healthy meals.","Water."],0],
["When should you see a dentist for a checkup?",["At least once a year.","Never.","Only after eating candy."],0],
["Which statement matches the lesson?",["Good care keeps the tongue, teeth, and mouth clean and safe.","Hot food is always safe.","Unknown substances are safe to taste."],0]
];
let masterIdx=0, masterCorrect=0, masterAnswered=false;
function renderMaster(){
 masterAnswered=false;const q=master[masterIdx];
 document.getElementById("masterNum").textContent=masterIdx+1;
 document.getElementById("masterQ").textContent=q[0];
 const a=document.getElementById("masterAnswers"),f=document.getElementById("masterFeedback"),n=document.getElementById("masterNext");
 a.innerHTML="";f.textContent="";f.className="feedback";n.classList.add("hidden");
 q[1].forEach((ans,i)=>{const b=document.createElement("button");b.textContent=String.fromCharCode(65+i)+". "+ans;b.onclick=()=>{
   if(masterAnswered)return;masterAnswered=true;[...a.children].forEach(x=>x.disabled=true);
   if(i===q[2]){masterCorrect++;b.classList.add("correct");feedback(f,"🏆 Correct! Excellent work.",true);award(10,true)}
   else{b.classList.add("wrong");feedback(f,"💡 Review the picture cards and try the idea again.",false);state.mistakes.push(q[0]);save()}
   n.classList.remove("hidden");
 };a.appendChild(b)});
}
document.getElementById("masterNext").onclick=()=>{
 masterIdx++;
 if(masterIdx<master.length)renderMaster(); else{
  document.getElementById("masterNext").classList.add("hidden");
  const pct=masterCorrect/master.length*100;
  let msg=pct>=90?"🏆 Lesson Master! You showed strong understanding.":pct>=80?"⭐ Almost There! Review any ideas you missed.":pct>=70?"🌱 Good Progress! A little more practice will help.":"💪 Keep Practicing! You can learn these habits step by step.";
  document.getElementById("masteryMessage").textContent=msg;
  if(pct>=90){state.badges=Math.max(state.badges,1);state.stars+=2}
  state.completed=Math.max(state.completed,9);save();goTo("celebrate");
 }
};
renderMaster();

function startSortGame(){
 const stage=document.getElementById("gameStage");
 stage.innerHTML=`<div class="question-count">SORT IT!</div><h3>Is the action HEALTHY or UNSAFE?</h3><p id="sortItem" style="font-size:26px;font-weight:800"></p><div class="choice-grid"><button id="healthy">🟢 Healthy</button><button id="unsafe">🔴 Unsafe</button></div><div class="feedback" id="sortFb"></div>`;
 const items=[
  ["Brushing after a meal",true],["Eating very hot food immediately",false],["Using dental floss",true],["Tasting an unknown liquid",false],
  ["Getting a yearly dental checkup",true],["Eating too much candy",false],["Being careful not to bite your tongue",true],["Using a clean toothbrush",true]
 ];
 let i=0;
 const render=()=>{document.getElementById("sortItem").textContent=items[i][0];document.getElementById("sortFb").textContent="";document.getElementById("sortFb").className="feedback"};
 ["healthy","unsafe"].forEach(id=>document.getElementById(id).onclick=()=>{
   const chosen=id==="healthy",ok=chosen===items[i][1],fb=document.getElementById("sortFb");
   feedback(fb,ok?"🌟 Correct!":"💡 Try again. Think about whether the action protects or cares for the mouth.",ok);
   if(ok){award(10,true);i++;if(i<items.length)setTimeout(render,500);else{document.getElementById("sortItem").textContent="🎉 Sort It complete!";document.querySelector(".choice-grid").style.display="none"}}});
 render();
}
function startPictureGame(){
 const stage=document.getElementById("gameStage");
 const pics=[
  ["assets/brush_teeth.jpg","Brush your teeth after every meal."],
  ["assets/cool_food.jpg","Cool hot food before eating."],
  ["assets/clean_tongue.jpg","Clean your tongue after each meal."],
  ["assets/dentist.jpg","See a dentist for a yearly checkup."]
 ];
 let i=0;
 function render(){
  const p=pics[i];
  stage.innerHTML=`<div class="question-count">FIND IT!</div><h3>What healthy habit does this picture show?</h3><img src="${p[0]}" style="width:100%;max-height:310px;object-fit:contain;border-radius:16px;background:#f6f7fa"><div class="answers" style="margin-top:15px"><button data-good="true">${p[1]}</button><button>Eat lots of candy.</button><button>Taste an unknown substance.</button></div><div class="feedback" id="picFb"></div>`;
  stage.querySelectorAll(".answers button").forEach(b=>b.onclick=()=>{
   const ok=b.dataset.good==="true";feedback(document.getElementById("picFb"),ok?"🌟 You matched the picture!":"💡 Look closely at what the child is doing.",ok);
   if(ok){award(10,true);i++;if(i<pics.length)setTimeout(render,600);else stage.innerHTML="<h3>🎉 Picture Detective complete!</h3><p>Great job noticing healthy habits.</p>"}
  });
 }
 render();
}
function startQuickPick(){
 const stage=document.getElementById("gameStage");
 const qs=[
  ["Which protects your tongue from a hot meal?",["Cool the food first.","Eat it quickly.","Taste it first."],0],
  ["Which keeps teeth clean?",["Brushing and flossing.","Eating more candy.","Never brushing."],0],
  ["Which is unsafe?",["Tasting an unknown substance.","Using a clean toothbrush.","Seeing a dentist."],0],
  ["What should you avoid eating too much of?",["Candy and sweet foods.","Water.","Regular meals."],0]
 ];
 let i=0;
 function render(){
  const q=qs[i];
  stage.innerHTML=`<div class="question-count">QUICK PICK • ${i+1}/${qs.length}</div><h3>${q[0]}</h3><div class="answers"></div><div class="feedback" id="qpFb"></div>`;
  const a=stage.querySelector(".answers");
  q[1].forEach((x,j)=>{const b=document.createElement("button");b.textContent=String.fromCharCode(65+j)+". "+x;b.onclick=()=>{const ok=j===q[2];feedback(document.getElementById("qpFb"),ok?"🌟 Correct!":"💡 Think about the healthy habit from our lesson.",ok);if(ok){award(10,true);i++;if(i<qs.length)setTimeout(render,550);else stage.innerHTML="<h3>🏆 Quick Pick complete!</h3><p>You remembered the important rules.</p>"}};a.appendChild(b)});
 }
 render();
}

function reviewMistakes(){
 const card=document.getElementById("mistakesCard");
 if(!state.mistakes.length){card.innerHTML="<h3>🌟 No missed questions saved!</h3><p>Excellent! You can replay a game for extra practice.</p>";return}
 const unique=[...new Set(state.mistakes)];
 card.innerHTML="<h3>🔄 Concepts to Review</h3><p>You can revisit these ideas:</p><ul>"+unique.slice(-8).map(x=>"<li>"+x+"</li>").join("")+"</ul><button class='primary' onclick=\"goTo('learn')\">📖 Review the Lesson</button>";
}

document.getElementById("soundBtn").onclick=()=>{soundOn=!soundOn;document.getElementById("soundBtn").textContent=soundOn?"🔊":"🔇"};
document.getElementById("resetBtn").onclick=()=>{if(confirm("Reset all saved progress for this lesson?")){localStorage.removeItem("teacherEdScienceMouth");location.reload()}};
updateStats();

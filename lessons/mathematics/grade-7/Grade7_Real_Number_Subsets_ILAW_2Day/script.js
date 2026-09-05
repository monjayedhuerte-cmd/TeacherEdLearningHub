const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const toast = msg => {
  const el=$("#toast"); el.textContent=msg; el.classList.add("show");
  clearTimeout(window.toastTimer); window.toastTimer=setTimeout(()=>el.classList.remove("show"),2200);
};

$("#year").textContent = new Date().getFullYear();

const menuToggle=$("#menuToggle"), navLinks=$("#navLinks");
menuToggle.addEventListener("click",()=>navLinks.classList.toggle("open"));
$$(".nav-links a").forEach(a=>a.addEventListener("click",()=>navLinks.classList.remove("open")));

$$(".ilaw-card").forEach(btn=>btn.addEventListener("click",()=>{
  const target=$(btn.dataset.target); if(target) target.scrollIntoView({behavior:"smooth",block:"start"});
}));

// Fullscreen: modern API + vendor prefixes + safe fallback.
const fsBtn=$("#fullscreenBtn");
function fsElement(){return document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement}
function updateFS(){
  const active=!!fsElement()||document.body.classList.contains("fullscreen-fallback");
  fsBtn.innerHTML=active?"⛶ <span>Exit Full Screen</span>":"⛶ <span>Full Screen</span>";
}
async function enterFS(){
  const el=document.documentElement;
  try{
    if(el.requestFullscreen){await el.requestFullscreen();return}
    if(el.webkitRequestFullscreen){el.webkitRequestFullscreen();return}
    if(el.mozRequestFullScreen){el.mozRequestFullScreen();return}
    if(el.msRequestFullscreen){el.msRequestFullscreen();return}
    document.body.classList.add("fullscreen-fallback");
  }catch(e){document.body.classList.add("fullscreen-fallback")}
  updateFS();
}
async function exitFS(){
  try{
    if(document.exitFullscreen) await document.exitFullscreen();
    else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if(document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if(document.msExitFullscreen) document.msExitFullscreen();
  }catch(e){}
  document.body.classList.remove("fullscreen-fallback"); updateFS();
}
fsBtn.addEventListener("click",()=>fsElement()||document.body.classList.contains("fullscreen-fallback")?exitFS():enterFS());
["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"].forEach(e=>document.addEventListener(e,updateFS));
updateFS();

// Introduce: mystery numbers
const mysteries=[
 {n:"−8", answers:["integer","rational","real"], best:"integer"},
 {n:"√2", answers:["irrational","real"], best:"irrational"},
 {n:"3/4", answers:["rational","real"], best:"rational"},
 {n:"12", answers:["natural","whole","integer","rational","real"], best:"natural"}
];
let mysteryIndex=0;
function renderMystery(){
 const m=mysteries[mysteryIndex]; $("#mysteryNumber").textContent=m.n;
 $("#mysteryFeedback").textContent=""; $("#nextMystery").disabled=true;
 $$("#mysteryChoices button").forEach(b=>{b.disabled=false;b.classList.remove("correct","wrong")});
}
$$("#mysteryChoices button").forEach(b=>b.addEventListener("click",()=>{
 const m=mysteries[mysteryIndex]; const ans=b.dataset.answer;
 $$("#mysteryChoices button").forEach(x=>x.disabled=true);
 if(m.answers.includes(ans)){b.classList.add("correct");$("#mysteryFeedback").textContent=`Great! ${m.n} belongs to the ${ans} set.`;$("#nextMystery").disabled=false;toast("⭐ Correct!")}
 else{b.classList.add("wrong");$("#mysteryFeedback").textContent=`Try again. The smallest appropriate set is ${m.best}.`;$$("#mysteryChoices button").forEach(x=>x.disabled=false)}
}));
$("#nextMystery").addEventListener("click",()=>{mysteryIndex=(mysteryIndex+1)%mysteries.length;renderMystery()});
renderMystery();

// Number classification cards
$$(".number-card").forEach(card=>card.addEventListener("click",()=>{
 $$(".number-card").forEach(c=>c.classList.remove("active"));card.classList.add("active");
 const types=card.dataset.types.split(",");
 const labels={natural:"Natural ℕ",whole:"Whole 𝕎",integer:"Integer ℤ",rational:"Rational ℚ",irrational:"Irrational 𝕀",real:"Real ℝ"};
 $("#classificationOutput").innerHTML=`<strong>${card.dataset.number}</strong> belongs to: ${types.map(t=>labels[t]).join(" → ")}.`;
}));

// Day 1 sorting
const sortItems=[{n:"−3",best:"integer"},{n:"0",best:"whole"},{n:"5",best:"natural"},{n:"2/7",best:"rational"}];
let sortIndex=0;
function renderSort(){$("#sortNum").textContent=sortItems[sortIndex].n;$("#sortFeedback").textContent="";$$("#sortButtons button").forEach(b=>b.disabled=false)}
$$("#sortButtons button").forEach(b=>b.addEventListener("click",()=>{
 const item=sortItems[sortIndex];
 if(b.dataset.set===item.best){$("#sortFeedback").textContent="✅ Correct! You found the smallest set.";toast("⭐ Nice sorting!");sortIndex=(sortIndex+1)%sortItems.length;setTimeout(renderSort,700)}
 else $("#sortFeedback").textContent="❌ Look for the smallest set that contains this number.";
}));
renderSort();

// Day 2 lab
const labAnswers={"0.333...":"Rational","√5":"Irrational","2.5":"Rational","π":"Irrational"};
$$(".lab-buttons button").forEach(b=>b.addEventListener("click",()=>{$("#labResult").innerHTML=`<strong>${b.dataset.lab}</strong> → ${labAnswers[b.dataset.lab]} number.`}));

// Apply quiz
const quiz=[
 ["Which set contains −11 as its smallest standard subset?","Integer",["Natural","Whole","Integer","Irrational"]],
 ["Which number is irrational?","√3",["0.5","−8","√3","7/9"]],
 ["Which is a whole number?","0",["−1","0","−2/3","√7"]],
 ["Which is rational?","−4/5",["π","√2","−4/5","√11"]],
 ["Every integer is also a…","Rational number",["Natural number","Whole number","Rational number","Irrational number"]],
 ["Which statement is true?","Natural ⊂ Whole",["Irrational ⊂ Rational","Natural ⊂ Whole","Real ⊂ Rational","Whole ⊂ Natural"]],
 ["Which number belongs to both rational and real sets?","3.25",["π","√6","3.25","√2"]],
 ["Which set contains both rational and irrational numbers?","Real numbers",["Natural numbers","Integers","Real numbers","Whole numbers"]]
];
let qIndex=0,qScore=0,qAnswered=false;
function renderQuiz(){
 $("#quizProgress").textContent=`Question ${qIndex+1} of ${quiz.length}`;$("#quizScore").textContent=`⭐ ${qScore}`;
 $("#quizQuestion").textContent=quiz[qIndex][0];$("#quizFeedback").textContent="";$("#nextQuiz").disabled=true;qAnswered=false;
 $("#quizOptions").innerHTML="";
 quiz[qIndex][2].forEach(opt=>{const b=document.createElement("button");b.type="button";b.textContent=opt;b.addEventListener("click",()=>answerQuiz(b,opt));$("#quizOptions").appendChild(b)});
}
function answerQuiz(btn,opt){
 if(qAnswered)return;qAnswered=true;const correct=quiz[qIndex][1];
 $$("#quizOptions button").forEach(b=>b.disabled=true);
 if(opt===correct){btn.classList.add("correct");qScore++;$("#quizFeedback").textContent="✅ Correct!";toast("⭐ +1 star!")}
 else{btn.classList.add("wrong");$("#quizFeedback").textContent=`❌ Correct answer: ${correct}`}
 $("#quizScore").textContent=`⭐ ${qScore}`;$("#nextQuiz").disabled=false;
}
$("#nextQuiz").addEventListener("click",()=>{qIndex++;if(qIndex>=quiz.length){$("#quizQuestion").textContent=`🎉 Challenge complete! You scored ${qScore}/${quiz.length}.`;$("#quizOptions").innerHTML="";$("#nextQuiz").disabled=true}else renderQuiz()});
renderQuiz();

// Family builder
const builder=[
 {n:"−6",types:["integer","rational","real"]},{n:"4",types:["natural","whole","integer","rational","real"]},
 {n:"√7",types:["irrational","real"]},{n:"1/3",types:["rational","real"]},{n:"0",types:["whole","integer","rational","real"]}
];
let bIndex=0,bSelected=new Set();
function renderBuilder(){const item=builder[bIndex];$("#builderNumber").textContent=item.n;bSelected.clear();$$("#setChoiceGrid button").forEach(b=>b.classList.remove("selected"));$("#builderFeedback").textContent=""}
$$("#setChoiceGrid button").forEach(b=>b.addEventListener("click",()=>{const s=b.dataset.set;if(bSelected.has(s)){bSelected.delete(s);b.classList.remove("selected")}else{bSelected.add(s);b.classList.add("selected")}}));
$("#checkBuilder").addEventListener("click",()=>{
 const expected=new Set(builder[bIndex].types);
 const ok=expected.size===bSelected.size&&[...expected].every(x=>bSelected.has(x));
 $("#builderFeedback").textContent=ok?"✅ Perfect! You identified the complete family.":"❌ Not quite. Remember that a number can belong to several nested sets.";
 if(ok)toast("🏆 Family mastered!");
});
$("#newBuilder").addEventListener("click",()=>{bIndex=(bIndex+1)%builder.length;renderBuilder()});
renderBuilder();

// Mastery check
const mastery=[
 ["Which is the correct relationship?","Natural ⊂ Whole ⊂ Integers",["Natural ⊂ Whole ⊂ Integers","Integers ⊂ Natural ⊂ Whole","Rational ⊂ Whole ⊂ Natural","Irrational ⊂ Rational"]],
 ["Which is irrational?","√10",["4/5","−2","√10","0.75"]],
 ["Which is rational?","−7/2",["π","√3","−7/2","√11"]],
 ["Which set includes rational and irrational numbers?","Real numbers",["Whole numbers","Integers","Real numbers","Natural numbers"]],
 ["Is 0 a whole number?","Yes",["No","Yes","Only irrational","Only natural"]],
 ["Which statement is true?","Every integer is rational",["Every rational is an integer","Every integer is rational","Every real is natural","Every irrational is rational"]]
];
let mIndex=0,mScore=0,mAnswered=false;
function renderMastery(){
 const total=mastery.length;$("#masteryBar").style.width=`${(mIndex/total)*100}%`;$("#masteryQuestion").textContent=mastery[mIndex][0];$("#masteryFeedback").textContent="";$("#nextMastery").disabled=true;mAnswered=false;
 $("#masteryOptions").innerHTML="";
 mastery[mIndex][2].forEach(opt=>{const b=document.createElement("button");b.type="button";b.textContent=opt;b.addEventListener("click",()=>answerMastery(b,opt));$("#masteryOptions").appendChild(b)});
}
function answerMastery(btn,opt){
 if(mAnswered)return;mAnswered=true;$$("#masteryOptions button").forEach(b=>b.disabled=true);
 if(opt===mastery[mIndex][1]){btn.classList.add("correct");mScore++;$("#masteryFeedback").textContent="🌟 Correct!";}else{btn.classList.add("wrong");$("#masteryFeedback").textContent=`The answer is: ${mastery[mIndex][1]}.`}
 $("#nextMastery").disabled=false;
}
$("#nextMastery").addEventListener("click",()=>{
 mIndex++;
 if(mIndex>=mastery.length){
   $("#masteryBar").style.width="100%";$("#masteryOptions").innerHTML="";$("#nextMastery").disabled=true;
   const passed=mScore>=5;
   $("#masteryResult").classList.remove("hidden");
   $("#masteryResult").innerHTML=`<h3>${passed?"🏆 Excellent work!":"💪 Keep practicing!"}</h3><p>Your score: <strong>${mScore}/${mastery.length}</strong></p><p>${passed?"You are ready to illustrate the subsets of real numbers.":"Review the family tree and try the practice activities again."}</p>`;
 }else renderMastery();
});
renderMastery();

// Reflection
$("#saveReflection").addEventListener("click",()=>{
 const text=$("#reflectionText").value.trim();
 if(!text){toast("Write a short reflection first.");return}
 $("#reflectionSaved").textContent="⭐ Reflection saved for this session. Great thinking!";
 toast("Reflection saved!");
});

// Quick challenge
$("#quickChallenge").addEventListener("click",()=>document.querySelector("#apply").scrollIntoView({behavior:"smooth"}));

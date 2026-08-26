const slides=[...document.querySelectorAll(".slide")];
const nav=[...document.querySelectorAll(".nav-item")];
let current=0;

function showSlide(i){
  current=Math.max(0,Math.min(slides.length-1,i));
  slides.forEach((s,n)=>s.classList.toggle("active",n===current));
  nav.forEach((b,n)=>b.classList.toggle("active",n===current));
  document.getElementById("progressText").textContent=`${current+1} / ${slides.length}`;
  document.getElementById("progressBar").style.width=`${((current+1)/slides.length)*100}%`;
  document.getElementById("prevBtn").disabled=current===0;
  document.getElementById("nextBtn").textContent=current===slides.length-1?"Tapos 🎉":"Susunod →";
  window.scrollTo({top:0,behavior:"smooth"});
}
nav.forEach(b=>b.addEventListener("click",()=>showSlide(+b.dataset.slide)));
document.querySelectorAll(".next-btn").forEach(b=>b.addEventListener("click",()=>showSlide(current+1)));
document.getElementById("nextBtn").addEventListener("click",()=>current===slides.length-1?finishLesson():showSlide(current+1));
document.getElementById("prevBtn").addEventListener("click",()=>showSlide(current-1));

document.addEventListener("keydown",e=>{
  if(e.key==="ArrowRight") showSlide(current+1);
  if(e.key==="ArrowLeft") showSlide(current-1);
  if(e.key.toLowerCase()==="f") toggleFullscreen();
  if(e.key.toLowerCase()==="n") document.body.classList.toggle("show-notes");
  if(e.key==="Escape") closeAllModals();
});

function toggleFullscreen(){
  if(!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}
document.getElementById("fullscreenBtn").addEventListener("click",toggleFullscreen);
document.getElementById("notesBtn").addEventListener("click",()=>document.body.classList.toggle("show-notes"));
document.getElementById("helpBtn").addEventListener("click",()=>document.getElementById("helpModal").classList.remove("hidden"));
document.getElementById("helpClose").addEventListener("click",()=>document.getElementById("helpModal").classList.add("hidden"));

/* Image viewer */
const imageModal=document.getElementById("imageModal");
const modalImage=document.getElementById("modalImage");
const modalCaption=document.getElementById("modalCaption");
function openImage(src,caption=""){modalImage.src=src;modalCaption.textContent=caption;imageModal.classList.remove("hidden")}
function closeAllModals(){document.querySelectorAll(".modal").forEach(m=>m.classList.add("hidden"))}
document.querySelectorAll("[data-image]").forEach(el=>el.addEventListener("click",()=>openImage(el.dataset.image,el.dataset.caption||"")));
document.getElementById("modalClose").addEventListener("click",closeAllModals);
document.querySelectorAll(".modal-backdrop").forEach(x=>x.addEventListener("click",closeAllModals));

/* Observation reveal */
document.querySelectorAll(".prompt-card.reveal").forEach(card=>card.addEventListener("click",()=>card.classList.toggle("revealed")));

/* Family type cards */
const familyInfo={
 two:["👨‍👩‍👧 Two-Parent Family","Binubuo ng nanay, tatay, at anak o mga anak."],
 solo:["👩‍👧 Solo-Parent Family","Binubuo ng isang magulang na nag-aalaga at gumagabay sa anak o mga anak."],
 extended:["👨‍👩‍👧‍👦👵 Extended Family","Maaaring kasama ang lolo, lola, tito, tita, at iba pang kamag-anak."]
};
document.querySelectorAll(".type-card").forEach(card=>card.addEventListener("click",()=>{
  const [title,desc]=familyInfo[card.dataset.family];
  toast(`${title}: ${desc}`);
}));

/* Type game */
const scenarios=[
 ["Si Ana ay nakatira kasama ang kanyang nanay, tatay, at kapatid.","two"],
 ["Si Ben ay nakatira kasama ang kanyang nanay.","solo"],
 ["Kasama nina Carlo ang kanyang nanay, tatay, lola at tito sa kanilang bahay.","extended"],
 ["Kasama ni Mia ang kanyang tatay at dalawang kapatid.","solo"]
];
let typeIndex=0,typeScore=0,typeAnswered=false;
function renderScenario(){
 document.getElementById("scenarioNumber").textContent=typeIndex+1;
 document.getElementById("scenarioText").textContent=scenarios[typeIndex][0];
 document.getElementById("typeFeedback").textContent="";
 document.getElementById("typeFeedback").className="feedback";
 document.querySelectorAll("#typeChoices button").forEach(b=>{b.className="";b.disabled=false});
 typeAnswered=false;
 document.getElementById("nextScenario").textContent=typeIndex===scenarios.length-1?"Tapos na ang Cases 🎉":"Next Case →";
}
document.querySelectorAll("#typeChoices button").forEach(btn=>btn.addEventListener("click",()=>{
 if(typeAnswered)return;
 typeAnswered=true;
 const answer=scenarios[typeIndex][1];
 const chosen=btn.dataset.answer;
 document.querySelectorAll("#typeChoices button").forEach(b=>b.disabled=true);
 if(chosen===answer){typeScore++;btn.classList.add("correct");setFeedback("typeFeedback","Tama! 🎉","good")}
 else{btn.classList.add("wrong");setFeedback("typeFeedback",`Hindi ito ang tamang sagot. Ang sagot ay ${answer==="two"?"Two-Parent":answer==="solo"?"Solo-Parent":"Extended"} Family.`,`bad`)}
 document.getElementById("typeScore").textContent=typeScore;
}));
document.getElementById("nextScenario").addEventListener("click",()=>{
 if(!typeAnswered){toast("Pumili muna ng sagot.");return}
 if(typeIndex<scenarios.length-1){typeIndex++;renderScenario()}else{toast(`Great job, Family Detectives! Score: ${typeScore}/4`)}
});

/* Needs */
document.querySelectorAll(".need-card").forEach(card=>card.addEventListener("click",()=>{
 document.querySelectorAll(".need-card").forEach(c=>c.classList.remove("selected"));
 card.classList.add("selected");
 const box=document.getElementById("needCheck");
 if(card.dataset.need==="toy") box.textContent="🧸 Ang laruan ay masaya, ngunit hindi pangunahing pangangailangan. Subukan ang pagkain, damit, o tirahan.";
 else box.textContent="✅ Tama! Ang "+card.querySelector("h3").textContent.toLowerCase()+" ay isang pangunahing pangangailangan ng pamilya.";
}));

/* Application */
document.querySelectorAll(".answer-buttons button").forEach(btn=>btn.addEventListener("click",()=>{
 document.getElementById("chosenAnswer").textContent="“Mahal ko ang aking pamilya dahil "+btn.dataset.sentence+"” ❤️";
}));

/* Generalization */
document.querySelectorAll(".recap-card").forEach(card=>card.addEventListener("click",()=>card.classList.toggle("revealed")));

/* Quiz */
const quiz=[
 {q:"Ang pamilya nina Ana ay binubuo ng nanay, tatay at dalawang anak. Anong uri ito?",c:["Solo-parent","Two-parent","Extended"],a:1},
 {q:"Si Carlo ay kasama ang kanyang nanay lamang. Anong uri ng pamilya ito?",c:["Solo-parent","Two-parent","Extended"],a:0},
 {q:"Kasama ni Maria ang kanyang nanay, tatay, lola at tito. Anong uri ito?",c:["Solo-parent","Two-parent","Extended"],a:2},
 {q:"Alin ang pangunahing pangangailangan ng pamilya?",c:["Pagkain","Laruan","Video game"],a:0},
 {q:"Alin ang HINDI pangunahing pangangailangan?",c:["Damit","Tirahan","Laruan"],a:2}
];
let quizIndex=0,quizScore=0,quizAnswered=false;
function renderQuiz(){
 const item=quiz[quizIndex];
 document.getElementById("quizNumber").textContent=`Question ${quizIndex+1} of ${quiz.length}`;
 document.getElementById("quizProgress").style.width=`${((quizIndex+1)/quiz.length)*100}%`;
 document.getElementById("quizQuestion").textContent=item.q;
 const wrap=document.getElementById("quizChoices");wrap.innerHTML="";
 item.c.forEach((choice,i)=>{
   const b=document.createElement("button");b.textContent=choice;
   b.addEventListener("click",()=>answerQuiz(i,b));wrap.appendChild(b);
 });
 document.getElementById("quizFeedback").textContent="";
 document.getElementById("quizFeedback").className="feedback";
 quizAnswered=false;
 document.getElementById("nextQuiz").textContent=quizIndex===quiz.length-1?"Tingnan ang Resulta 🎉":"Next Question →";
}
function answerQuiz(i,btn){
 if(quizAnswered)return;quizAnswered=true;
 const item=quiz[quizIndex];
 document.querySelectorAll("#quizChoices button").forEach(b=>b.disabled=true);
 if(i===item.a){quizScore++;btn.classList.add("correct");setFeedback("quizFeedback","Tama! Magaling! 🎉","good")}
 else{btn.classList.add("wrong");document.querySelectorAll("#quizChoices button")[item.a].classList.add("correct");setFeedback("quizFeedback","Balikan natin ang aralin at tingnan ang tamang sagot.","bad")}
 document.getElementById("quizScore").textContent=quizScore;
}
document.getElementById("nextQuiz").addEventListener("click",()=>{
 if(!quizAnswered){toast("Pumili muna ng sagot.");return}
 if(quizIndex<quiz.length-1){quizIndex++;renderQuiz()}
 else{
   const pct=quizScore*20;
   const result=document.getElementById("quizResult");result.classList.remove("hidden");
   result.innerHTML=`🏆 <strong>Resulta: ${quizScore}/5 (${pct}%)</strong><br>${pct>=80?"Nakamit ang mastery target! Ang galing!":"Kailangan pa ng kaunting practice. Balikan ang picture-supported examples."}`;
   toast("Natapos ang Family Detective Quiz!");
 }
});

/* Finish */
document.getElementById("finishBtn").addEventListener("click",finishLesson);
function finishLesson(){toast("🎉 Mahusay, Family Detective! Handa ka na sa Family Tree task.");}
function setFeedback(id,text,kind){const el=document.getElementById(id);el.textContent=text;el.className=`feedback ${kind}`;}
function toast(text){const t=document.getElementById("toast");t.textContent=text;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),2800)}
renderScenario();renderQuiz();showSlide(0);

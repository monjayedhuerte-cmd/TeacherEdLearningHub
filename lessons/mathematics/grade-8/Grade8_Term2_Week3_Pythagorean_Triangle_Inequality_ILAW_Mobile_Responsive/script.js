const dayButtons=document.querySelectorAll(".day-btn");
const mobileDayButtons=document.querySelectorAll(".mobile-day-btn");
const prevDay=document.getElementById("prevDay");
const nextDay=document.getElementById("nextDay");
const mobileDayLabel=document.getElementById("mobileDayLabel");
const sections=document.querySelectorAll(".day-section");
const progressBar=document.getElementById("progressBar");
const progressText=document.getElementById("progressText");

function showDay(day){
  sections.forEach(s=>s.classList.remove("active"));
  const target=document.getElementById("day"+day);
  if(target) target.classList.add("active");
  dayButtons.forEach(b=>b.classList.toggle("active",b.dataset.day===String(day)));
  mobileDayButtons.forEach(b=>b.classList.toggle("active",b.dataset.day===String(day)));
  progressBar.style.width=(day/5*100)+"%";
  progressText.textContent=`Day ${day} of 5`;
  if(mobileDayLabel) mobileDayLabel.textContent=`Day ${day} of 5`;
  if(prevDay) prevDay.disabled=Number(day)<=1;
  if(nextDay) nextDay.disabled=Number(day)>=5;
  document.getElementById("presentation").scrollIntoView({behavior:"smooth",block:"start"});
}
dayButtons.forEach(b=>b.addEventListener("click",()=>showDay(b.dataset.day)));
mobileDayButtons.forEach(b=>b.addEventListener("click",()=>showDay(b.dataset.day)));
if(prevDay) prevDay.addEventListener("click",()=>{
  const active=document.querySelector(".day-btn.active");
  const day=Math.max(1,Number(active?.dataset.day||1)-1);
  showDay(day);
});
if(nextDay) nextDay.addEventListener("click",()=>{
  const active=document.querySelector(".day-btn.active");
  const day=Math.min(5,Number(active?.dataset.day||1)+1);
  showDay(day);
});
document.querySelectorAll("[data-jump]").forEach(b=>b.addEventListener("click",()=>showDay(b.dataset.jump)));
showDay(1);

document.querySelectorAll(".choice-row").forEach(row=>{
  const buttons=row.querySelectorAll("button");
  const feedback=row.parentElement.querySelector(".feedback") || row.nextElementSibling;
  buttons.forEach(btn=>btn.addEventListener("click",()=>{
    const expected=row.dataset.answer;
    const value=btn.dataset.value || btn.textContent.trim().toLowerCase().replace(" triangle","");
    const correct=value===expected || btn.textContent.trim().toLowerCase().startsWith(expected);
    feedback.className="feedback "+(correct?"good":"bad");
    feedback.textContent=correct?"✅ Correct! Great thinking.":"❌ Not quite. Look at the rule and try again.";
  }));
});

document.querySelectorAll(".answer").forEach(btn=>btn.addEventListener("click",()=>{
  const feedback=btn.parentElement.querySelector(".feedback");
  const correct=btn.dataset.correct==="true";
  feedback.className="feedback "+(correct?"good":"bad");
  feedback.textContent=correct?"✅ Correct!":"❌ Try again—think about the definition.";
}));

document.querySelectorAll(".check-input").forEach(btn=>btn.addEventListener("click",()=>{
  const input=document.getElementById(btn.dataset.input), feedback=btn.parentElement.querySelector(".feedback");
  const correct=input.value.trim()===btn.dataset.answer;
  feedback.className="feedback "+(correct?"good":"bad");
  feedback.textContent=correct?"✅ Correct!":"❌ Check your calculation and try again.";
}));

document.querySelectorAll(".reveal-btn").forEach(btn=>btn.addEventListener("click",()=>{
  const ans=btn.parentElement.querySelector(".hidden-answer");
  ans.classList.toggle("show");
  btn.textContent=ans.classList.contains("show")?"Hide Hint":"Reveal Hint";
}));

const fullscreenBtn=document.getElementById("fullscreenBtn");
let fallbackPresentation=false;
function setPresentationMode(on){
  fallbackPresentation=on;
  document.body.classList.toggle("presentation-mode",on);
  fullscreenBtn.innerHTML=on?"⛶ <span>Exit Full Screen</span>":"⛶ <span>Full Screen</span>";
  fullscreenBtn.setAttribute("aria-label",on?"Exit full screen":"Enter full screen");
}
fullscreenBtn.addEventListener("click",async()=>{
  try{
    if(document.fullscreenElement){
      await document.exitFullscreen();
      return;
    }
    if(document.documentElement.requestFullscreen){
      await document.documentElement.requestFullscreen({navigationUI:"hide"});
      setPresentationMode(true);
    }else{
      // iPhone/iPad browsers may not expose the Fullscreen API.
      setPresentationMode(!fallbackPresentation);
    }
  }catch(e){
    // Keep the lesson usable even when native fullscreen is blocked.
    setPresentationMode(!fallbackPresentation);
  }
});
document.addEventListener("fullscreenchange",()=>{
  setPresentationMode(!!document.fullscreenElement);
});

const questions=[
["Which side is opposite the 90° angle?","Hypotenuse",["Leg","Hypotenuse","Base","Height"]],
["Which equation is the Pythagorean Theorem?","a² + b² = c²",["a+b=c","a²+b²=c²","a²−b²=c²","2a+2b=c"]],
["For legs 6 and 8, the hypotenuse is…","10",["12","14","10","8"]],
["For legs 5 and 12, the hypotenuse is…","13",["17","13","10","7"]],
["If c=13 and a=5, the missing leg is…","12",["8","10","12","18"]],
["If c=10 and one leg is 6, the other leg is…","8",["4","6","8","16"]],
["A triangle with sides 3,4,5 is…","Right",["Acute","Right","Obtuse","Equilateral"]],
["For 5,5,6, since 25+25 > 36, the triangle is…","Acute",["Acute","Right","Obtuse","Impossible"]],
["For 4,5,6, 16+25 is…","greater than 36",["less than 36","equal to 36","greater than 36","zero"]],
["Therefore 4,5,6 is…","Acute",["Acute","Right","Obtuse","Impossible"]],
["The converse helps us…","classify a triangle from its side lengths",["find its area only","classify a triangle from its side lengths","find its perimeter only","measure an angle with a ruler"]],
["Triangle inequality says the sum of two sides must be…","greater than the third side",["equal to the third side","less than the third side","greater than the third side","zero"]],
["Can 3,4,8 form a triangle?","No",["Yes","No","Only a right triangle","Only an obtuse triangle"]],
["Can 5,7,10 form a triangle?","Yes",["Yes","No","Only if rotated","Not enough information"]],
["Can 6,9,14 form a triangle?","Yes",["Yes","No","Only if angles are known","Only if it is right"]],
["If two sides are 8 and 11, x must satisfy…","3 < x < 19",["x<3","3 < x < 19","x>19","x=19"]],
["The hypotenuse is always…","the longest side of a right triangle",["the shortest side","opposite a 90° angle","always vertical","equal to a leg"]],
["If a²+b² < c², the triangle is…","Obtuse",["Acute","Right","Obtuse","Equilateral"]],
["If a²+b² = c², the triangle is…","Right",["Acute","Right","Obtuse","Impossible"]],
["Which is a real-life use of these ideas?","Finding a diagonal distance",["Choosing a color","Finding a diagonal distance","Naming a polygon","Counting vertices only"]]
];
const quiz=document.getElementById("quiz");
questions.forEach((q,i)=>{
  const div=document.createElement("div");div.className="q";
  const opts=[...q[2]].sort(()=>Math.random()-.5);
  div.innerHTML=`<p>${i+1}. ${q[0]}</p>`+opts.map(o=>`<label><input type="radio" name="q${i}" value="${o}">${o}</label>`).join("");
  quiz.appendChild(div);
});
document.getElementById("submitQuiz").addEventListener("click",()=>{
  let score=0;
  questions.forEach((q,i)=>{
    const chosen=document.querySelector(`input[name="q${i}"]:checked`);
    const labels=document.querySelectorAll(`input[name="q${i}"]`);
    labels.forEach(inp=>{
      inp.parentElement.classList.remove("quiz-correct","quiz-wrong");
      if(inp.value===q[1]) inp.parentElement.classList.add("quiz-correct");
    });
    if(chosen){
      if(chosen.value===q[1]) score++;
      else chosen.parentElement.classList.add("quiz-wrong");
    }
  });
  document.getElementById("scoreBox").textContent=`${score} / 20`;
  const pct=score/20*100;
  let msg=pct>=90?"🏆 Excellent! You are ready for the next challenge.":pct>=75?"🌟 Great job! Review the items you missed.":pct>=50?"👍 Good start! Practice the key rules again.":"💪 Keep going! Revisit Days 1–4 and try again.";
  document.getElementById("quizResult").innerHTML=`<div class="result">${msg}<br>Score: ${score}/20 (${pct}%)</div>`;
  document.getElementById("assessment").scrollIntoView({behavior:"smooth",block:"start"});
});

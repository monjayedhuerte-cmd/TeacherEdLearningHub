const slides=[...document.querySelectorAll(".slide")];
const navBtns=[...document.querySelectorAll(".nav-btn")];
const names=["Home","Lesson","Day 1","Day 2","Day 3","Day 4","Day 5","Assessment"];
let current=0;
const progressBar=document.getElementById("progressBar");
const progressText=document.getElementById("progressText");
const progressPct=document.getElementById("progressPct");
const pagerLabel=document.getElementById("pagerLabel");
const prevBtn=document.getElementById("prevBtn");
const nextBtn=document.getElementById("nextBtn");

function showSlide(index){
  current=Math.max(0,Math.min(slides.length-1,index));
  slides.forEach((s,i)=>s.classList.toggle("active",i===current));
  navBtns.forEach((b,i)=>b.classList.toggle("active",i===current));
  const pct=Math.round(((current+1)/slides.length)*100);
  progressBar.style.width=pct+"%";
  progressText.textContent=`Slide ${current+1} of ${slides.length}`;
  progressPct.textContent=pct+"%";
  pagerLabel.textContent=names[current];
  prevBtn.disabled=current===0;
  nextBtn.textContent=current===slides.length-1?"Finish":"Next →";
  window.scrollTo({top:0,behavior:"smooth"});
}
navBtns.forEach((b,i)=>b.addEventListener("click",()=>showSlide(i)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showSlide(Number(b.dataset.go))));
prevBtn.addEventListener("click",()=>showSlide(current-1));
nextBtn.addEventListener("click",()=>{if(current<slides.length-1)showSlide(current+1);});
document.addEventListener("keydown",e=>{
  if(["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)) return;
  if(e.key==="ArrowRight")showSlide(current+1);
  if(e.key==="ArrowLeft")showSlide(current-1);
});

document.querySelectorAll(".choice-row").forEach(row=>{
  const choices=[...row.querySelectorAll(".choice")];
  const feedback=document.getElementById(row.dataset.q+"-feedback");
  choices.forEach(ch=>{
    ch.addEventListener("click",()=>{
      choices.forEach(c=>c.classList.remove("selected","correct","wrong"));
      ch.classList.add("selected");
      const letter=String.fromCharCode(65+choices.indexOf(ch));
      if(letter===row.dataset.answer){
        ch.classList.add("correct");
        if(feedback){feedback.textContent="✅ Correct! Great thinking!";feedback.className="feedback good";}
      }else{
        ch.classList.add("wrong");
        const correctIndex=row.dataset.answer.charCodeAt(0)-65;
        choices[correctIndex]?.classList.add("correct");
        if(feedback){feedback.textContent="❌ Not quite. Review the example and try again.";feedback.className="feedback bad";}
      }
    });
  });
});

document.querySelectorAll(".tf").forEach(box=>{
  box.addEventListener("click",()=>{
    const currentVal=box.dataset.value;
    if(currentVal){return;}
    const ans=confirm("Choose OK for TRUE, or Cancel for FALSE.");
    const chosen=ans?"true":"false";
    box.dataset.value=chosen;
    const correct=chosen===box.dataset.answer;
    box.classList.add(correct?"correct":"wrong");
    const fb=document.getElementById(box.dataset.q+"-feedback");
    if(fb){fb.textContent=correct?"✅ Correct! Great thinking!":"❌ Not quite. Check the data again.";fb.className="feedback "+(correct?"good":"bad");}
  });
});

document.querySelectorAll(".reveal-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const target=document.getElementById(btn.dataset.target);
    target.classList.toggle("show");
    btn.textContent=target.classList.contains("show")?"Hide answer":"Reveal reasoning";
  });
});
document.querySelectorAll(".reset-activities").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const section=btn.closest(".activity");
    section.querySelectorAll(".choice").forEach(c=>c.classList.remove("selected","correct","wrong"));
    section.querySelectorAll(".feedback").forEach(f=>{f.textContent="";f.className="feedback";});
    section.querySelectorAll(".tf").forEach(t=>{t.dataset.value="";t.classList.remove("correct","wrong");});
  });
});

document.querySelectorAll(".flip-card").forEach(card=>{
  card.textContent=card.dataset.front;
  card.addEventListener("click",()=>{
    card.classList.toggle("flipped");
    card.textContent=card.classList.contains("flipped")?card.dataset.back:card.dataset.front;
  });
});
document.querySelector(".reset-flips").addEventListener("click",()=>{
  document.querySelectorAll(".flip-card").forEach(card=>{card.classList.remove("flipped");card.textContent=card.dataset.front;});
});

const tossBtn=document.getElementById("tossBtn"),resetTossBtn=document.getElementById("resetTossBtn");
const tosses=document.getElementById("tosses"),tossSummary=document.getElementById("tossSummary");
function runTosses(){
  tosses.innerHTML="";
  let heads=0;
  for(let i=0;i<30;i++){
    const h=Math.random()<.5;
    if(h)heads++;
    const span=document.createElement("span");span.className="toss";span.textContent=h?"H":"T";tosses.appendChild(span);
  }
  const tails=30-heads, exp=heads/30;
  tossSummary.innerHTML=`<span>Heads: ${heads}</span><span>Tails: ${tails}</span><span>Experimental P(Heads): ${exp.toFixed(3)}</span><span>Theoretical P(Heads): 0.50</span>`;
}
tossBtn.addEventListener("click",runTosses);
resetTossBtn.addEventListener("click",()=>{tosses.innerHTML="";tossSummary.innerHTML="<span>Heads: —</span><span>Tails: —</span><span>Experimental P(Heads): —</span><span>Theoretical P(Heads): 0.50</span>";});

document.getElementById("predictionBtn").addEventListener("click",()=>{
  const v=Number(document.getElementById("prediction").value), fb=document.getElementById("predictionFeedback");
  if(!Number.isFinite(v)||v<0||v>30){fb.textContent="Enter a whole-number prediction from 0 to 30.";fb.className="feedback bad";return;}
  const diff=Math.abs(v-15);
  fb.textContent=diff<=3?"🎯 Nice prediction! Remember: it is an expectation, not a guarantee.":"👍 Good scientific thinking! Any result from 0 to 30 is possible, but 15 is the theoretical center.";
  fb.className="feedback good";
});

const assessment=[
["MC","A published government report is used by a student for a school analysis. The report is an example of…",["A. primary data","B. secondary data","C. experimental data only","D. impossible data"],"B"],
["MC","Which graph feature tells you what the graph is about?",["A. title","B. color","C. border","D. animation"],"A"],
["MC","Why should you check the scale before comparing graph values?",["A. To make the graph prettier","B. To change the source","C. To read values accurately","D. To remove data"],"C"],
["MC","A secondary graph shows 48 visitors on Monday and 63 on Tuesday. Tuesday is how many visitors higher?",["A. 11","B. 15","C. 21","D. 111"],"B"],
["TF","A conclusion from a graph should be supported by evidence from the displayed data.",["True","False"],"A"],
["MC","A table from a published research report shows values 12, 18, 15, and 20. Which value is greatest?",["A. 12","B. 15","C. 18","D. 20"],"D"],
["MC","A graph shows sales of 90 units in June and 70 in July. Which statement is supported?",["A. June had 20 more units.","B. July had 20 more units.","C. The months were equal.","D. Sales doubled."],"A"],
["MC","Which statement goes beyond the evidence if a graph only shows monthly attendance?",["A. May had the highest attendance.","B. April had fewer students than May.","C. Attendance changed across months.","D. May was highest because students liked the weather."],"D"],
["MC","For a fair six-sided die, the theoretical probability of rolling a 3 is…",["A. 1/2","B. 1/3","C. 1/6","D. 1"],"C"],
["MC","Theoretical probability is calculated from…",["A. observed results only","B. possible outcomes and their likelihoods","C. graph colors","D. personal guesses"],"B"],
["MC","Experimental probability is based on…",["A. actual observed trials","B. a title only","C. a prediction only","D. no outcomes"],"A"],
["MC","A coin is tossed 40 times and heads occurs 18 times. Experimental P(heads) is…",["A. 0.18","B. 0.22","C. 0.45","D. 0.55"],"C"],
["TF","An experimental probability must always equal the theoretical probability.",["True","False"],"B"],
["MC","A fair 4-section spinner has one blue section. The theoretical probability of blue is…",["A. 1/2","B. 1/3","C. 1/4","D. 3/4"],"C"],
["MC","A spinner is used 80 times and lands red 22 times. Experimental P(red) is…",["A. 0.275","B. 0.22","C. 0.80","D. 22"],"A"],
["MC","If a fair die is rolled 60 times and a 5 appears 8 times, the experimental probability is…",["A. 5/60","B. 8/60","C. 52/60","D. 60/8"],"B"],
["MC","Why can experimental probability differ from theoretical probability in a short experiment?",["A. Random variation","B. The formula is always wrong","C. Outcomes are impossible","D. The sample space disappears"],"A"],
["MC","As the number of fair-coin trials becomes large, experimental probability of heads will often…",["A. move closer to 0.50","B. become exactly 1","C. become exactly 0","D. stop changing immediately"],"A"],
["TF","One experiment that differs from theory automatically proves the die or coin is unfair.",["True","False"],"B"],
["MC","A published graph shows 240 visitors Saturday and 180 Sunday. What is the difference?",["A. 40","B. 50","C. 60","D. 420"],"C"],
["MC","In 100 fair-coin tosses, heads occur 47 times. Which is correct?",["A. Theoretical P=0.47","B. Experimental P=0.47 and theoretical P=0.50","C. Both are 0.50","D. Experimental P=0.50 and theoretical P=0.47"],"B"],
["MC","Which sequence is the strongest way to analyze a secondary graph?",["A. Guess → color → conclude","B. Title/context → values → compare/pattern → evidence-based conclusion","C. Conclude → ignore labels → estimate","D. Color → title → guess"],"B"],
["MC","A fair 4-color spinner gives blue 18 times in 80 spins. Which comparison is correct?",["A. Theory 18/80; experiment 1/4","B. Theory 1/4; experiment 18/80=0.225","C. Theory 18/80; experiment 0.50","D. Theory 1/80; experiment 1/4"],"B"],
["MC","Which conclusion is most responsible after an experiment gives P(heads)=0.47 for a fair coin?",["A. The coin is definitely unfair.","B. The theory is wrong.","C. The result is below 0.50 and can be explained by random variation in the trials.","D. Heads are impossible."],"C"],
["MC","A secondary graph reports A=42 and B=56. Which conclusion is directly supported?",["A. B is 14 units higher than A.","B. B caused A.","C. B will always be higher.","D. A and B are equal."],"A"]
];

function renderAssessment(){
  const form=document.getElementById("assessmentForm");
  form.innerHTML="";
  assessment.forEach((item,i)=>{
    const [type,q,opts,ans]=item;
    const wrap=document.createElement("div");wrap.className="assessment-item";wrap.id=`item-${i}`;
    const title=document.createElement("h3");title.textContent=`${i+1}. ${q}`;wrap.appendChild(title);
    const optsWrap=document.createElement("div");optsWrap.className="assessment-options";
    opts.forEach((opt,j)=>{
      const label=document.createElement("label");
      const input=document.createElement("input");input.type="radio";input.name=`q${i}`;input.value=type==="TF"?(j===0?"A":"B"):String.fromCharCode(65+j);
      label.appendChild(input);label.appendChild(document.createTextNode(opt));optsWrap.appendChild(label);
    });
    wrap.appendChild(optsWrap);form.appendChild(wrap);
  });
}
renderAssessment();

document.getElementById("submitAssessment").addEventListener("click",()=>{
  let score=0,answered=0;
  assessment.forEach((item,i)=>{
    const chosen=document.querySelector(`input[name="q${i}"]:checked`);
    const wrap=document.getElementById(`item-${i}`);
    wrap.classList.remove("correct","wrong");
    if(chosen){
      answered++;
      if(chosen.value===item[3]){score++;wrap.classList.add("correct");}
      else wrap.classList.add("wrong");
    }else wrap.classList.add("wrong");
  });
  const pct=Math.round(score/assessment.length*100);
  let msg="";
  if(pct>=90)msg="🌟 Outstanding! You demonstrated strong mastery of Week 7.";
  else if(pct>=75)msg="👏 Great job! You have a good understanding. Review the missed items and keep practicing.";
  else if(pct>=60)msg="👍 You are making progress. Revisit Days 1–5, especially the sections connected to your missed questions.";
  else msg="💪 Keep going! Review the graph-analysis checklist and theoretical vs experimental probability, then try the assessment again.";
  const result=document.getElementById("assessmentResult");
  result.className="result-box show";
  result.innerHTML=`<div class="score-big">${score}/${assessment.length} — ${pct}%</div><p><strong>${answered}</strong> of ${assessment.length} questions answered.</p><p>${msg}</p><p><strong>Review guide:</strong> Items 1–8 focus on secondary data and graph analysis; Items 9–19 focus on theoretical and experimental probability; Items 20–25 integrate evidence and comparison.</p>`;
  result.scrollIntoView({behavior:"smooth",block:"center"});
});
document.getElementById("resetAssessment").addEventListener("click",()=>{
  document.querySelectorAll('#assessmentForm input[type="radio"]').forEach(i=>i.checked=false);
  document.querySelectorAll(".assessment-item").forEach(i=>i.classList.remove("correct","wrong"));
  const result=document.getElementById("assessmentResult");result.className="result-box";result.innerHTML="";
});

const fsBtn=document.getElementById("fullscreenBtn");
async function toggleFullscreen(){
  try{
    if(!document.fullscreenElement){await document.documentElement.requestFullscreen();document.body.classList.add("presentation");}
    else{await document.exitFullscreen();}
  }catch(e){document.body.classList.toggle("presentation");}
}
fsBtn.addEventListener("click",toggleFullscreen);
document.addEventListener("fullscreenchange",()=>{
  const active=!!document.fullscreenElement;
  document.body.classList.toggle("presentation",active);
  fsBtn.textContent=active?"⛶ EXIT FULL SCREEN":"⛶ FULL SCREEN";
});
showSlide(0);

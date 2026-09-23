const state={completed:new Set(["home"]), score:0, flashIndex:0};
let lessonData=null;
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

async function loadLesson(){
  try{const r=await fetch("data/lesson.json"); lessonData=await r.json(); renderConcepts(); renderQuiz(); renderMaster(); setupPractice();}
  catch(e){console.error(e); alert("Lesson data could not be loaded. If you open this file directly, use a local static server (for example VS Code Live Server).");}
}
function show(id){
  $$(".screen").forEach(x=>x.classList.remove("active"));
  const el=$("#"+id); if(el) el.classList.add("active");
  state.completed.add(id); updateProgress();
  window.scrollTo({top:0,behavior:"smooth"});
  $("#nav").classList.remove("open");
}
function updateProgress(){
  const ids=["home","engage","learn","practice","quiz","master"];
  const pct=Math.round((ids.filter(x=>state.completed.has(x)).length/ids.length)*100);
  $("#progressBar").style.width=pct+"%"; $("#progressPct").textContent=pct+"%";
}
$$("[data-section]").forEach(b=>b.addEventListener("click",()=>show(b.dataset.section)));
$$("[data-next]").forEach(b=>b.addEventListener("click",()=>show(b.dataset.next)));
$("#menuBtn").addEventListener("click",()=>$("#nav").classList.toggle("open"));

function renderConcepts(){
  $("#conceptGrid").innerHTML=lessonData.concepts.map((c,i)=>`
    <article class="concept">
      <button type="button" aria-expanded="false" data-concept="${i}">${c.title} <span>＋</span></button>
      <div class="detail hidden"><p>${c.summary}</p><div class="flow"><span>${c.visual}</span></div></div>
    </article>`).join("");
  $$("[data-concept]").forEach(btn=>btn.addEventListener("click",()=>{
    const detail=btn.nextElementSibling; detail.classList.toggle("hidden");
    btn.querySelector("span").textContent=detail.classList.contains("hidden")?"＋":"−";
  }));
}

$("#engageChoices").addEventListener("click",e=>{
  if(e.target.tagName!=="BUTTON")return;
  const correct=e.target.dataset.correct==="true";
  const fb=$("#engageFeedback");
  if(correct){fb.className="feedback success";fb.textContent="🎉 Correct! An algorithm needs the necessary input before it can process the task.";$("#engageNext").classList.remove("hidden");}
  else{fb.className="feedback error";fb.textContent="💡 Not quite. Think about what information or materials are needed before the process begins.";}
});
$("#engageNext").addEventListener("click",()=>show("learn"));

function setupPractice(){
  $$(".tab").forEach(t=>t.addEventListener("click",()=>{$$(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");renderPractice(t.dataset.tab);}));
  renderPractice("sequence");
}
function renderPractice(tab){
  const area=$("#practiceArea");
  if(tab==="sequence"){
    const shuffled=["Output","Termination","Input","Processing"];
    area.innerHTML=`<div class="card"><h3>🔢 Arrange the Stages</h3><p>Use the ↑ and ↓ buttons to put the stages in the correct order.</p><div class="sortable" id="sortList">${shuffled.map((x,i)=>`<div class="sort-item" data-value="${x}"><span>${x}</span><span><button class="up">↑</button> <button class="down">↓</button></span></div>`).join("")}</div><div class="action-row"><button class="primary" id="checkOrder">Check Order</button><div class="feedback" id="orderFeedback"></div></div></div>`;
    $$(".up").forEach(b=>b.addEventListener("click",()=>move(b.closest(".sort-item"),-1)));
    $$(".down").forEach(b=>b.addEventListener("click",()=>move(b.closest(".sort-item"),1)));
    $("#checkOrder").addEventListener("click",()=>{const got=$$("#sortList .sort-item").map(x=>x.dataset.value);const ok=got.join("|")==="Input|Processing|Output|Termination";const f=$("#orderFeedback");f.className="feedback "+(ok?"success":"error");f.textContent=ok?"🎉 Correct! You identified the four stages in the lesson's order.":"💡 Try again. Remember: the algorithm first receives input, then processes it, produces output, and terminates."});
  }else if(tab==="match"){
    const pairs=lessonData.activities[1].pairs;
    area.innerHTML=`<div class="card"><h3>🧩 Match the Construct</h3><p>Select the description that matches each construct.</p>${pairs.map((p,i)=>`<div class="match-row"><b>${p[0]}</b><select data-match="${i}"><option value="">Choose...</option>${pairs.map((q,j)=>`<option value="${j}">${q[1]}</option>`).join("")}</select></div>`).join("")}<button class="primary" id="checkMatch">Check Matches</button><div class="feedback" id="matchFeedback"></div></div>`;
    $("#checkMatch").addEventListener("click",()=>{let ok=true;$$("[data-match]").forEach(s=>{if(+s.value!==+s.dataset.match)ok=false});const f=$("#matchFeedback");f.className="feedback "+(ok?"success":"error");f.textContent=ok?"🎉 Excellent! Each construct is matched correctly.":"💡 Review the three constructs: linear sequence = orderly steps, conditional = decisions, loop = repetition."});
  }else if(tab==="cases"){
    area.innerHTML=`<div class="card"><h3>📊 Best, Worst, or Average?</h3><div id="caseQuiz"></div></div>`;
    const qs=lessonData.activities[2].questions;
    $("#caseQuiz").innerHTML=qs.map((q,i)=>`<div class="question"><h3>${i+1}. ${q.q}</h3><div class="options">${q.choices.map((c,j)=>`<button class="answer-btn" data-case="${i}" data-answer="${j}">${c}</button>`).join("")}</div><div id="caseFb${i}" class="feedback"></div></div>`).join("");
    $$("[data-case]").forEach(b=>b.addEventListener("click",()=>{const i=+b.dataset.case, q=qs[i], ok=+b.dataset.answer===q.answer;const f=$("#caseFb"+i);f.className="feedback "+(ok?"success":"error");f.textContent=ok?"🎉 Correct! "+q.why:"💡 Not quite. "+q.why;}));
  }else{
    const terms=lessonData.keyTerms;
    const t=terms[state.flashIndex%terms.length];
    area.innerHTML=`<div class="card"><h3>🃏 Key Term Flashcard</h3><p>Click the card to reveal the meaning.</p><div class="flashcard" id="flashcard"><h3>${t.term}</h3></div><div class="action-row"><button class="primary" id="flip">Reveal</button><button class="tab" id="nextCard">Next Term →</button></div></div>`;
    $("#flip").addEventListener("click",()=>{$("#flashcard").innerHTML=`<div><h3>${t.term}</h3><p>${t.definition}</p></div>`});
    $("#nextCard").addEventListener("click",()=>{state.flashIndex++;renderPractice("flashcards")});
  }
}
function move(el,dir){const list=$("#sortList");const items=[...list.children],i=items.indexOf(el),j=i+dir;if(j<0||j>=items.length)return;if(dir<0)list.insertBefore(el,items[j]);else list.insertBefore(items[j],el)}

function renderQuiz(){
  $("#quizForm").innerHTML=lessonData.quiz.map((q,i)=>`<div class="question"><h3>${i+1}. ${q.q}</h3><div class="options">${q.choices.map((c,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${c}</label>`).join("")}</div></div>`).join("");
}
$("#submitQuiz").addEventListener("click",()=>{
  if(!lessonData)return;let score=0, unanswered=0;
  lessonData.quiz.forEach((q,i)=>{const selected=$(`input[name="q${i}"]:checked`);if(!selected){unanswered++;return}if(+selected.value===q.answer)score++;});
  const pct=Math.round(score/lessonData.quiz.length*100);
  const label=pct>=90?"🏆 Excellent Mastery":pct>=80?"🌟 Very Good":pct>=70?"👍 Good Progress":"📚 Review and Practice Again";
  $("#quizResult").innerHTML=`<div class="result"><h2>${label}</h2><p><strong>${score}/${lessonData.quiz.length}</strong> correct — ${pct}%</p>${unanswered?`<p>⚠️ ${unanswered} question(s) were unanswered.</p>`:""}<details><summary>Review explanations</summary>${lessonData.quiz.map((q,i)=>`<p><b>${i+1}.</b> ${q.explanation}</p>`).join("")}</details><p><b>What you already understand:</b> ${score>=8?"You demonstrated strong understanding of the lesson.":"You have started building your understanding; review the explanations and try again."}</p><p><b>What you should review:</b> ${score>=8?"Focus on applying the concepts in new situations.":"Review the stages, constructs, and analysis types before retrying."}</p></div>`;
});

function renderMaster(){
  const steps=lessonData.masterChallenge.steps;
  $("#masterArea").innerHTML=steps.map((s,i)=>`<div class="master-step" data-master-step="${i}"><p>${i+1}. ${s.prompt}</p><div class="master-options">${s.choices.map((c,j)=>`<button data-master="${i}" data-answer="${j}">${c}</button>`).join("")}</div><div class="feedback" id="masterFb${i}"></div></div>`).join("");
  $$("[data-master]").forEach(b=>b.addEventListener("click",()=>{
    const i=+b.dataset.master, q=steps[i], ok=+b.dataset.answer===q.answer, f=$("#masterFb"+i);
    f.className="feedback "+(ok?"success":"error");f.textContent=ok?"🎉 Correct!":"💡 Not quite. Read the choices again and connect the situation to the lesson.";
    if(ok) b.parentElement.parentElement.dataset.done="true";
    if($$(".master-step[data-done='true']").length===steps.length) $("#reflection").classList.remove("hidden");
  }));
}
$("#finishBtn").addEventListener("click",()=>{$("#reflection").classList.add("hidden");$("#celebrate").classList.remove("hidden");state.completed.add("master");updateProgress()});
loadLesson();updateProgress();

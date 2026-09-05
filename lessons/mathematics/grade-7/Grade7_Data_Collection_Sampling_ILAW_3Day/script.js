const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();

  // Mobile navigation
  $("#menuBtn").addEventListener("click", () => {
    $("#navLinks").classList.toggle("open");
  });
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => $("#navLinks").classList.remove("open")));

  // Full screen button — works on modern browsers and has a safe fallback message.
  $("#fullscreenBtn").addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      alert("Full screen is not available in this browser window. Try pressing F11.");
    }
  });

  document.addEventListener("fullscreenchange", () => {
    const btn = $("#fullscreenBtn");
    btn.innerHTML = document.fullscreenElement ? "⛶ <span>Exit Full Screen</span>" : "⛶ <span>Full Screen</span>";
  });

  // Scroll progress
  window.addEventListener("scroll", () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    $("#progressBar").style.width = max > 0 ? `${(doc.scrollTop / max) * 100}%` : "0%";
  });

  // ILAW cards navigate to their matching section.
  $$(".ilaw-card").forEach(card => {
    card.addEventListener("click", () => {
      const target = document.getElementById(card.dataset.target);
      if (target) target.scrollIntoView({behavior:"smooth", block:"start"});
    });
  });

  // Data collection method quiz
  const methodQuestions = [
    {q:"You want to know the favorite school subject of 200 learners.", a:"Survey / Questionnaire", choices:["Survey / Questionnaire","Observation","Experiment","Interview"]},
    {q:"You record how many students arrive before 7:30 AM.", a:"Observation", choices:["Survey / Questionnaire","Observation","Experiment","Interview"]},
    {q:"You compare two paper towel brands by testing how much water each absorbs.", a:"Experiment", choices:["Survey / Questionnaire","Observation","Experiment","Interview"]},
    {q:"You ask the school nurse detailed questions about common student concerns.", a:"Interview", choices:["Survey / Questionnaire","Observation","Experiment","Interview"]}
  ];
  renderChoiceQuiz($("#methodQuiz"), methodQuestions, "methodChoice");
  $("#checkMethods").addEventListener("click", () => checkChoiceQuiz("methodQuiz","methodChoice","methodResult"));

  // Sampling quiz
  const samplingQuestions = [
    {q:"A school writes every learner's name on identical slips, mixes them, and randomly picks 50.", a:"Simple Random", choices:["Simple Random","Systematic","Stratified","Cluster"]},
    {q:"A researcher selects every 10th name from an ordered list after a random starting point.", a:"Systematic", choices:["Simple Random","Systematic","Stratified","Cluster"]},
    {q:"A school divides learners by grade level and selects some learners from every grade.", a:"Stratified", choices:["Simple Random","Systematic","Stratified","Cluster"]},
    {q:"A researcher randomly selects 3 whole classrooms and surveys everyone in those classrooms.", a:"Cluster", choices:["Simple Random","Systematic","Stratified","Cluster"]}
  ];
  renderChoiceQuiz($("#samplingQuiz"), samplingQuestions, "samplingChoice");
  $("#checkSampling").addEventListener("click", () => checkChoiceQuiz("samplingQuiz","samplingChoice","samplingResult"));

  // Population/sample flip cards
  const popExamples = [
    ["All 500 Grade 7 learners in the school","Population"],
    ["60 Grade 7 learners selected for a survey","Sample"],
    ["Every household in a barangay","Population"],
    ["100 households selected for an interview","Sample"]
  ];
  popExamples.forEach(([text,type]) => {
    const b = document.createElement("button");
    b.className = "flip-card";
    b.type = "button";
    b.innerHTML = `${text}<small>Click to reveal</small>`;
    b.addEventListener("click", () => {
      b.classList.add("revealed");
      b.innerHTML = `${text}<small>Answer: ${type}</small>`;
    });
    $("#popCards").appendChild(b);
  });

  // Simulator
  $("#runSimulator").addEventListener("click", runSimulator);

  // Plan builder
  $("#buildPlan").addEventListener("click", buildPlan);

  // Save reflections locally
  $$("[data-save]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.save;
      const value = document.getElementById(id).value.trim();
      localStorage.setItem(id, value);
      const note = document.getElementById(id + "Note");
      if (note) note.textContent = value ? "Saved on this device ✓" : "Nothing to save yet.";
    });
  });

  ["day1Reflection","day2Reflection"].forEach(id => {
    const saved = localStorage.getItem(id);
    if (saved) {
      document.getElementById(id).value = saved;
      const note = document.getElementById(id + "Note");
      if (note) note.textContent = "Previously saved ✓";
    }
  });

  $("#saveFinalReflection").addEventListener("click", () => {
    ["r1","r2","r3"].forEach(id => localStorage.setItem(id, document.getElementById(id).value));
    $("#finalNote").textContent = "Your 3-day reflection is saved on this device ✓";
  });

  // Mastery quiz
  const mastery = [
    {q:"Which method asks people prepared questions about their opinions or preferences?",a:"Survey / Questionnaire",c:["Observation","Survey / Questionnaire","Experiment","Cluster"]},
    {q:"What is the entire group being studied called?",a:"Population",c:["Sample","Population","Variable","Cluster"]},
    {q:"Which technique gives every member an equal chance of selection?",a:"Simple Random",c:["Simple Random","Systematic","Stratified","Cluster"]},
    {q:"Which technique selects every kth member from a list?",a:"Systematic",c:["Cluster","Systematic","Stratified","Simple Random"]},
    {q:"Which technique samples from each subgroup of a population?",a:"Stratified",c:["Systematic","Cluster","Stratified","Simple Random"]},
    {q:"Which technique selects whole natural groups, such as classrooms?",a:"Cluster",c:["Cluster","Stratified","Systematic","Simple Random"]},
    {q:"You want to know how many students actually buy fruit during recess. Which method is most direct?",a:"Observation",c:["Interview","Observation","Experiment","Survey / Questionnaire"]},
    {q:"Why is a representative sample useful?",a:"It can provide information about the population without studying everyone.",c:["It always gives a perfect result.","It can provide information about the population without studying everyone.","It removes the need for questions.","It makes the population smaller."]}
  ];
  renderMastery(mastery);
  $("#checkMastery").addEventListener("click", () => checkMastery(mastery));
});

function renderChoiceQuiz(container, questions, groupName) {
  container.innerHTML = "";
  questions.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "quiz-item";
    div.dataset.answer = item.a;
    div.innerHTML = `<div class="quiz-question">${i+1}. ${item.q}</div><div class="choices"></div>`;
    const choices = $(".choices", div);
    item.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.textContent = choice;
      btn.dataset.value = choice;
      btn.addEventListener("click", () => {
        $$(".choice", div).forEach(x => x.classList.remove("selected"));
        btn.classList.add("selected");
      });
      choices.appendChild(btn);
    });
    container.appendChild(div);
  });
}

function checkChoiceQuiz(containerId, groupName, resultId) {
  const items = $$("#" + containerId + " .quiz-item");
  let score = 0;
  items.forEach(item => {
    const selected = $(".choice.selected", item);
    const answer = item.dataset.answer;
    item.classList.remove("correct","incorrect");
    $$(".choice", item).forEach(c => c.classList.remove("correct-choice","wrong-choice"));
    if (selected && selected.dataset.value === answer) {
      score++;
      item.classList.add("correct");
      selected.classList.add("correct-choice");
    } else {
      item.classList.add("incorrect");
      if (selected) selected.classList.add("wrong-choice");
      $$(".choice", item).forEach(c => { if (c.dataset.value === answer) c.classList.add("correct-choice"); });
    }
  });
  const result = document.getElementById(resultId);
  result.className = score === items.length ? "result-box success" : "result-box retry";
  result.textContent = score === items.length
    ? `🎉 Excellent! ${score}/${items.length}. You solved the investigation!`
    : `🔎 You scored ${score}/${items.length}. Review the highlighted answers and try again.`;
}

function runSimulator() {
  const population = $("#populationSelect").value;
  const technique = $("#techniqueSelect").value;
  const names = {
    school:"All 1,000 learners in a school",
    grade7:"All 240 Grade 7 learners",
    clubs:"Students in 8 school clubs"
  };
  const details = {
    random:["Select individuals randomly from the full list.","Every member has an equal chance.","Useful when a complete list is available."],
    systematic:["Choose a starting point, then select members at a fixed interval.","Example: every 10th name.","Fast and organized for long lists."],
    stratified:["Divide the population into important subgroups, then sample from each.","Example: sample from every grade level.","Useful when each subgroup should be represented."],
    cluster:["Divide the population into natural groups and randomly select groups.","Example: choose whole classrooms.","Useful when groups are convenient to reach."]
  };
  const samples = {school:{random:100,systematic:100,stratified:120,cluster:125},grade7:{random:30,systematic:30,stratified:36,cluster:40},clubs:{random:48,systematic:48,stratified:48,cluster:3}};
  const [action,why,use] = details[technique];
  $("#simulatorOutput").innerHTML = `
    <h3>🔎 Investigation Complete</h3>
    <p><strong>Population:</strong> ${names[population]}</p>
    <p><strong>Your technique:</strong> ${techniqueLabel(technique)}</p>
    <p>${action}</p>
    <div class="sim-result-grid">
      <div class="sim-stat"><b>${samples[population][technique]}</b>Approx. selected</div>
      <div class="sim-stat"><b>✓</b>${why}</div>
      <div class="sim-stat"><b>💡</b>${use}</div>
    </div>`;
}

function techniqueLabel(v) {
  return ({random:"Simple Random",systematic:"Systematic",stratified:"Stratified",cluster:"Cluster"})[v];
}

function buildPlan() {
  const q = $("#researchQuestion").value.trim();
  const p = $("#researchPopulation").value.trim();
  const t = $("#researchTechnique").value;
  const out = $("#planOutput");
  if (!q || !p) {
    out.innerHTML = `<div class="plan-card">⚠️ Add both a research question and a population first.</div>`;
    return;
  }
  const advice = {
    "Simple Random":"Prepare a complete list of the population and randomly select members.",
    "Systematic":"Create an ordered list, choose a starting point, and select members at a fixed interval.",
    "Stratified":"Divide the population into relevant subgroups and select a sample from each subgroup.",
    "Cluster":"Divide the population into natural groups, randomly select groups, then study the selected groups."
  };
  out.innerHTML = `<div class="plan-card"><strong>My Data Investigation Plan</strong><br>
    <b>Question:</b> ${escapeHTML(q)}<br>
    <b>Population:</b> ${escapeHTML(p)}<br>
    <b>Technique:</b> ${t}<br>
    <b>How I will do it:</b> ${advice[t]}</div>`;
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

function renderMastery(data) {
  const box = $("#masteryQuiz");
  box.innerHTML = "";
  data.forEach((item,i) => {
    const div = document.createElement("div");
    div.className = "mastery-question";
    div.dataset.answer = item.a;
    div.innerHTML = `<p>${i+1}. ${item.q}</p><div class="choices"></div>`;
    item.c.forEach(choice => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choice";
      b.textContent = choice;
      b.dataset.value = choice;
      b.addEventListener("click", () => {
        $$(".choice", div).forEach(x => x.classList.remove("selected"));
        b.classList.add("selected");
      });
      $(".choices", div).appendChild(b);
    });
    box.appendChild(div);
  });
}

function checkMastery(data) {
  const items = $$("#masteryQuiz .mastery-question");
  let score=0;
  items.forEach(item => {
    const selected = $(".choice.selected", item);
    $$(".choice",item).forEach(c=>c.classList.remove("correct-choice","wrong-choice"));
    if(selected && selected.dataset.value === item.dataset.answer){
      score++; selected.classList.add("correct-choice");
    }else{
      if(selected) selected.classList.add("wrong-choice");
      $$(".choice",item).forEach(c=>{if(c.dataset.value===item.dataset.answer)c.classList.add("correct-choice")});
    }
  });
  const pct = Math.round(score/items.length*100);
  let message = score === items.length ? "🏆 Perfect! You are a Data Detective!" :
    pct >= 75 ? "🌟 Great work! Review a few ideas and keep practicing." :
    pct >= 50 ? "💪 Good start! Revisit the sampling techniques, then try again." :
    "🔎 Keep investigating! Review Days 1–3 and try the mission again.";
  $("#masteryResult").innerHTML = `${message}<br><small>Score: ${score}/${items.length} (${pct}%)</small>`;
  $("#masteryResult").scrollIntoView({behavior:"smooth",block:"center"});
}

const state = {
  completed: new Set(),
  practicePoints: 0,
  assessment: null,
  currentSection: "home"
};

const sections = [...document.querySelectorAll(".section")];
const navButtons = [...document.querySelectorAll("nav button")];

function showSection(id) {
  sections.forEach(s => s.classList.toggle("active", s.id === id));
  navButtons.forEach(b => b.classList.toggle("active", b.dataset.section === id));
  state.currentSection = id;
  window.scrollTo({top: 0, behavior: "smooth"});
  document.getElementById("mainNav").classList.remove("open");
  updateProgress();
}
document.querySelectorAll("[data-section]").forEach(el => {
  el.addEventListener("click", () => showSection(el.dataset.section));
});
document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("mainNav").classList.toggle("open");
});

const correctMap = {
  engage: "b", quietly: "b", findAdverb: "c", phone: "b", blocking: "b"
};
const feedbackMap = {
  engage: ["Not quite. Think about which opening is polite and complete.", "Correct! The speaker identifies himself and politely asks to speak with Mrs. Deloso."],
  quietly: ["Look for the meaning of “quietly.”", "Correct! “Quietly” means in a quiet way."],
  findAdverb: ["The answer is the word that tells how the children listened.", "Correct! “Carefully” tells how they listened."],
  phone: ["A formal call should use respectful language.", "Correct! “May I speak with Maria, please?” is polite and appropriate."],
  blocking: ["Think about how actor movement can help the audience understand a scene.", "Correct! Blocking can communicate focus, movement, story, and feelings."]
};

document.querySelectorAll("[data-single-choice]").forEach(group => {
  const key = group.dataset.singleChoice;
  group.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      group.querySelectorAll("button").forEach(x => x.classList.remove("selected"));
      btn.classList.add("selected");
      const ok = btn.dataset.value === correctMap[key];
      group.querySelectorAll("button").forEach(x => x.classList.remove("correct","incorrect"));
      btn.classList.add(ok ? "correct" : "incorrect");
      const feedback = document.getElementById(key + "Feedback");
      if (feedback) feedback.textContent = ok ? "✅ " + feedbackMap[key][1] : "❌ " + feedbackMap[key][0];
      if (ok) state.completed.add(key);
      updateProgress();
    });
  });
});

document.querySelectorAll(".word-chip").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById("wordTip").textContent = "💡 " + btn.dataset.tip;
    state.completed.add("explore");
    updateProgress();
  });
});

document.getElementById("connectCheck").addEventListener("click", () => {
  const checked = [...document.querySelectorAll(".connectBox:checked")].length;
  const box = document.getElementById("connectFeedback");
  if (checked === 4) {
    box.textContent = "✅ Excellent! These skills can all be useful in real communication and media work.";
    state.completed.add("connect");
  } else {
    box.textContent = "💡 Try again. Think about communication, writing, and creating scenes.";
  }
  updateProgress();
});

document.getElementById("adviceSample").addEventListener("click", () => document.getElementById("adviceSampleBox").classList.toggle("hidden"));
document.getElementById("adverbSample").addEventListener("click", () => document.getElementById("adverbSampleBox").classList.toggle("hidden"));
document.getElementById("reflectionSample").addEventListener("click", () => document.getElementById("reflectionSampleBox").classList.toggle("hidden"));

document.getElementById("adviceCheck").addEventListener("click", () => {
  const v = document.getElementById("adviceInput").value.trim();
  const f = document.getElementById("adviceFeedback");
  if (v.length < 12) f.textContent = "💡 Please write at least one complete, respectful piece of advice.";
  else { f.textContent = "✅ Response recorded. Your answer can be different from the sample as long as it gives sensible, respectful advice."; state.completed.add("advice"); }
  updateProgress();
});
document.getElementById("adverbCheck").addEventListener("click", () => {
  const v = document.getElementById("adverbInput").value.trim().toLowerCase();
  const f = document.getElementById("adverbFeedback");
  if (!v.includes("gratefully") || v.split(/\s+/).length < 4) f.textContent = "💡 Write a complete sentence and use the word “gratefully.”";
  else { f.textContent = "✅ Good! The sentence uses “gratefully.”"; state.completed.add("adverbOpen"); }
  updateProgress();
});

const gameQuestions = [
  {q:"Which word is an adverb?", a:["teacher","quickly","book"], c:1, hint:"Choose the word that tells how an action happens."},
  {q:"Which is the most polite telephone opening?", a:["“May I speak with Ana, please?”","“Give me Ana.”","“Ana. Now.”"], c:0, hint:"Look for a respectful request."},
  {q:"Blocking is mainly about...", a:["actor movement in relation to the camera","spelling every word","choosing costumes"], c:0, hint:"Think about position and movement."},
  {q:"Which adverb best completes: “He answered the question ___.”", a:["quietly","table","teacher"], c:0, hint:"Choose a word that can describe how he answered."},
  {q:"Why should an actor's movement have a purpose?", a:["To help communicate the story or idea","To make the scene confusing","To fill empty time"], c:0, hint:"Every shot should contribute to the central idea."},
  {q:"Which closing is appropriate after receiving a message?", a:["“Thank you very much!”","“Whatever.”","“Hurry up.”"], c:0, hint:"Choose the respectful expression."}
];
let gameIndex = 0, gameAnswered = false;
function renderGame() {
  const item = gameQuestions[gameIndex];
  document.getElementById("gameCounter").textContent = `${gameIndex + 1} / ${gameQuestions.length}`;
  document.getElementById("gameArea").innerHTML = `<h3>${item.q}</h3><div class="choice-row" id="gameChoices">${item.a.map((x,i)=>`<button data-i="${i}">${x}</button>`).join("")}</div>`;
  document.getElementById("gameFeedback").textContent = "";
  document.getElementById("gameSubmit").classList.remove("hidden");
  document.getElementById("gameNext").classList.add("hidden");
  gameAnswered = false;
  document.querySelectorAll("#gameChoices button").forEach(b => b.addEventListener("click", () => {
    if (gameAnswered) return;
    document.querySelectorAll("#gameChoices button").forEach(x=>x.classList.remove("selected"));
    b.classList.add("selected");
  }));
}
document.getElementById("gameSubmit").addEventListener("click", () => {
  if (gameAnswered) return;
  const selected = document.querySelector("#gameChoices button.selected");
  const f = document.getElementById("gameFeedback");
  if (!selected) { f.textContent = "💡 Choose an answer first."; return; }
  gameAnswered = true;
  const item = gameQuestions[gameIndex];
  const ok = Number(selected.dataset.i) === item.c;
  selected.classList.add(ok ? "correct" : "incorrect");
  if (ok) {
    f.textContent = "✅ Correct! Great thinking.";
    state.practicePoints++;
  } else {
    f.textContent = "❌ Not quite. " + item.hint;
  }
  state.completed.add("game" + gameIndex);
  document.getElementById("gameSubmit").classList.add("hidden");
  document.getElementById("gameNext").classList.remove("hidden");
  updateProgress();
});
document.getElementById("gameNext").addEventListener("click", () => {
  if (gameIndex < gameQuestions.length - 1) { gameIndex++; renderGame(); }
  else {
    document.getElementById("gameFeedback").textContent = `🏆 Game complete! Practice points: ${state.practicePoints}/${gameQuestions.length}.`;
    document.getElementById("gameNext").classList.add("hidden");
  }
});
renderGame();

const quizQuestions = [
  {q:"Which word is an adverb?", o:["quickly","student","school"], c:0, e:"“Quickly” tells how an action happens."},
  {q:"What does “quietly” mean?", o:["in a quiet way","in a loud way","in an angry way"], c:0, e:"“Quietly” means in a quiet way."},
  {q:"Which sentence is most appropriate for a formal phone call?", o:["Put Mrs. Lee on.","May I speak with Mrs. Lee, please?","Give me Mrs. Lee."], c:1, e:"The second sentence is a respectful request."},
  {q:"What should you do if the person you called is in a meeting?", o:["Hang up rudely.","Ask whether you may leave a message.","Demand that the person come to the phone."], c:1, e:"The sample conversation shows the caller leaving a message."},
  {q:"Which word best completes: “She sang ___.”", o:["beautifully","song","singer"], c:0, e:"“Beautifully” describes how she sang."},
  {q:"What is blocking?", o:["The relationship of the camera to the actors and their movement.","A list of difficult vocabulary.","A type of telephone greeting."], c:0, e:"Blocking concerns actor movement and camera position."},
  {q:"Which question helps plan blocking?", o:["Why does the actor move?","How many pages is the script?","What is the actor's favorite food?"], c:0, e:"The lesson identifies why, where, when, and how the actor moves."},
  {q:"Why should actor movement not be aimless?", o:["Each shot or movement should help convey the central idea.","Actors should never move.","Movement is only for decoration."], c:0, e:"Movement should contribute to the story or idea."},
  {q:"Which is a polite closing?", o:["You’re welcome.","Go away.","Hurry up."], c:0, e:"“You’re welcome” is the polite response shown in the dialogue."},
  {q:"Which sentence uses an adverb correctly?", o:["He answered politely.","He politely answer yesterday.","He answer polite."], c:0, e:"“Politely” correctly describes how he answered."}
];

function renderQuiz() {
  const form = document.getElementById("quizForm");
  form.innerHTML = quizQuestions.map((x,i)=>`
    <div class="quiz-question" id="qq${i}">
      <h4>${i+1}. ${x.q}</h4>
      ${x.o.map((o,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${o}</label>`).join("")}
      <p class="feedback" id="qf${i}"></p>
    </div>`).join("");
}
renderQuiz();

document.getElementById("submitQuiz").addEventListener("click", () => {
  let score = 0, answered = 0;
  quizQuestions.forEach((x,i) => {
    const chosen = document.querySelector(`input[name="q${i}"]:checked`);
    const box = document.getElementById("qq"+i), f = document.getElementById("qf"+i);
    box.classList.remove("correct","incorrect");
    if (!chosen) {
      f.textContent = "💡 Please answer this item.";
      box.classList.add("incorrect");
      return;
    }
    answered++;
    if (Number(chosen.value) === x.c) {
      score++; box.classList.add("correct"); f.textContent = "✅ Correct! " + x.e;
    } else {
      box.classList.add("incorrect"); f.textContent = "❌ Not quite. " + x.e;
    }
  });
  if (answered < quizQuestions.length) {
    document.getElementById("quizResult").classList.remove("hidden");
    document.getElementById("quizResult").innerHTML = `Please answer all 10 items before viewing your assessment score.`;
    return;
  }
  state.assessment = {score,total:quizQuestions.length};
  const pct = score * 10;
  const mastery = pct >= 90 ? "🏆 Mastery" : pct >= 75 ? "🌳 Proficient" : pct >= 60 ? "🌿 Developing" : "🌱 Learning";
  const msg = pct >= 90 ? "Excellent application of the lesson." : pct >= 75 ? "You understand most of the key ideas. Review any missed items." : pct >= 60 ? "You are developing. Review the examples and try again." : "Let's review the lesson, then try the assessment again.";
  document.getElementById("quizResult").classList.remove("hidden");
  document.getElementById("quizResult").innerHTML = `<h3>🎉 Assessment Result</h3><p><b>${score}/${quizQuestions.length}</b> (${pct}%)</p><p><b>${mastery}</b> — ${msg}</p>`;
  state.completed.add("assessment");
  updateResults();
  updateProgress();
});

document.getElementById("resetQuiz").addEventListener("click", () => {
  renderQuiz();
  document.getElementById("quizResult").classList.add("hidden");
  state.assessment = null;
  updateResults();
});

document.getElementById("bossSample").addEventListener("click", () => document.getElementById("bossSampleBox").classList.toggle("hidden"));
document.getElementById("bossCheck").addEventListener("click", () => {
  const a = document.getElementById("bossPhone").value.trim();
  const b = document.getElementById("bossAdverb").value.trim();
  const c = document.getElementById("bossBlocking").value.trim();
  const f = document.getElementById("bossFeedback");
  if (a.length < 8 || b.length < 8 || c.length < 12) {
    f.textContent = "💡 Complete all three responses. Your answers may be different from the samples.";
    return;
  }
  f.textContent = "🏆 Mission complete! Your responses show application of the three lesson areas. Your answers may differ from the samples.";
  state.completed.add("boss");
  updateProgress();
});

function updateResults() {
  const pct = state.assessment ? Math.round(state.assessment.score / state.assessment.total * 100) : 0;
  document.getElementById("overallPercent").textContent = pct + "%";
  document.getElementById("score-circle")?.style.setProperty("--deg", (pct*3.6)+"deg");
  document.querySelector(".score-circle").style.setProperty("--deg", (pct*3.6)+"deg");
  document.getElementById("assessmentScore").textContent = state.assessment ? `${state.assessment.score}/${state.assessment.total}` : "—";
  document.getElementById("practiceScore").textContent = state.practicePoints;
  document.getElementById("completedCount").textContent = state.completed.size;
  const title = document.getElementById("masteryTitle"), msg = document.getElementById("masteryMessage");
  if (!state.assessment) { title.textContent="🌱 Learning"; msg.textContent="Start the lesson and complete the assessment to see your mastery level."; }
  else if (pct >= 90) { title.textContent="🏆 Mastery"; msg.textContent="Excellent! Keep applying these skills in real communication."; }
  else if (pct >= 75) { title.textContent="🌳 Proficient"; msg.textContent="You understand the main ideas. Review any missed items."; }
  else if (pct >= 60) { title.textContent="🌿 Developing"; msg.textContent="You are making progress. Review the examples and try again."; }
  else { title.textContent="🌱 Learning"; msg.textContent="Review the lesson and use the hints before retrying."; }
}
function updateProgress() {
  const total = 15;
  const pct = Math.min(100, Math.round(state.completed.size / total * 100));
  document.getElementById("progressBar").style.width = pct + "%";
  document.getElementById("progressText").textContent = pct + "%";
  updateResults();
}
updateProgress();

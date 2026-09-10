let lessons = [];
let currentLesson = null,
  currentMode = "easy",
  currentQuestions = [],
  currentIndex = 0,
  score = 0,
  answered = false;

const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", async () => {
  setupNavigation();
  $("menuBtn").onclick = () => $("nav").classList.toggle("open");
  $("startBtn").onclick = () => showPage("lessons");
  document.querySelectorAll(".subject-card").forEach(
    (b) =>
      (b.onclick = () => {
        $("subjectFilter").value = b.dataset.subject;
        showPage("lessons");
        renderLessons();
      }),
  );
  $("searchInput").addEventListener("input", renderLessons);
  $("subjectFilter").addEventListener("change", renderLessons);
  $("typeFilter").addEventListener("change", renderLessons);
  $("closeGame").onclick = closeGame;
  $("hintBtn").onclick = showHint;
  $("nextBtn").onclick = nextQuestion;
  await loadLessons();
});

async function loadLessons() {
  try {
    const response = await fetch("lessons.json?cache=" + Date.now());
    if (!response.ok) throw new Error("Could not load lessons.json");
    const data = await response.json();
    lessons = Array.isArray(data) ? data : data.lessons || [];
    updateStats();
    renderLessons();
  } catch (err) {
    console.error(err);
    $("lessonGrid").innerHTML =
      `<div class="empty" style="grid-column:1/-1"><i class="fa-solid fa-triangle-exclamation"></i><h3>Lessons could not be loaded</h3><p>Use VS Code Live Server or another local web server, then open index.html again.</p></div>`;
  }
}

function updateStats() {
  $("mathCount").textContent = lessons.filter(
    (x) => x.subject === "Math",
  ).length;
  $("englishCount").textContent = lessons.filter(
    (x) => x.subject === "English",
  ).length;
  $("linkedCount").textContent = lessons.filter(
    (x) => x.lessonType !== "game",
  ).length;
}

function setupNavigation() {
  document
    .querySelectorAll(".nav-link")
    .forEach((btn) => (btn.onclick = () => showPage(btn.dataset.page)));
}
function showPage(page) {
  document
    .querySelectorAll(".page")
    .forEach((x) => x.classList.remove("active"));
  $(page + "Page").classList.add("active");
  document
    .querySelectorAll(".nav-link")
    .forEach((x) => x.classList.toggle("active", x.dataset.page === page));
  $("nav").classList.remove("open");
  if (page === "lessons") renderLessons();
  if (page === "progress") renderProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderLessons() {
  const q = $("searchInput").value.toLowerCase().trim();
  const subject = $("subjectFilter").value;
  const type = $("typeFilter").value;
  const filtered = lessons.filter((l) => {
    const text =
      `${l.title} ${l.description || ""} ${l.subject} ${l.grade || ""}`.toLowerCase();
    return (
      (!q || text.includes(q)) &&
      (subject === "All" || l.subject === subject) &&
      (type === "All" || l.lessonType === type)
    );
  });
  $("lessonGrid").innerHTML = "";
  $("emptyState").classList.toggle("hidden", filtered.length !== 0);
  filtered.forEach((l) => {
    const icon = l.subject === "Math" ? "fa-calculator" : "fa-book-open";
    const typeLabel =
      l.lessonType === "game"
        ? "Built-in Game"
        : l.lessonType === "html"
          ? "Local HTML"
          : "External Link";
    const card = document.createElement("article");
    card.className = "lesson-card";
    card.innerHTML = `<span class="badge"><i class="fa-solid ${icon}"></i>&nbsp; ${l.subject}</span>
      <h3>${escapeHtml(l.title)}</h3>
      <p>${escapeHtml(l.description || "Interactive intervention lesson.")}</p>
      <div class="lesson-meta">${escapeHtml(l.grade || "")} ${l.lessonType === "game" ? "• Easy / Average / Hard" : "• " + typeLabel}</div>
      <button class="lesson-open"><i class="fa-solid ${l.lessonType === "game" ? "fa-play" : "fa-arrow-up-right-from-square"}"></i> ${l.lessonType === "game" ? "Start Game" : "Open Lesson"}</button>`;
    card.querySelector("button").onclick = () => openLesson(l);
    $("lessonGrid").appendChild(card);
  });
}

function openLesson(lesson) {
  if (lesson.lessonType === "game") {
    openGame(lesson);
    return;
  }
  if (!lesson.url) {
    alert("This lesson has no URL in lessons.json.");
    return;
  }
  window.location.href = lesson.url;
}

function openGame(lesson) {
  currentLesson = lesson;
  currentMode = "easy";
  score = 0;
  currentIndex = 0;
  $("gameTitle").textContent = lesson.title;
  $("gameSubject").textContent = lesson.subject.toUpperCase();
  $("gameScore").textContent = "0";
  $("difficultyButtons").innerHTML = "";
  ["easy", "average", "hard"].forEach((mode) => {
    const b = document.createElement("button");
    b.textContent = mode[0].toUpperCase() + mode.slice(1);
    b.className = mode === "easy" ? "active" : "";
    b.onclick = () => {
      currentMode = mode;
      currentIndex = 0;
      score = 0;
      document
        .querySelectorAll(".difficulty button")
        .forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      startGameQuestions();
    };
    $("difficultyButtons").appendChild(b);
  });
  $("gameModal").classList.remove("hidden");
  startGameQuestions();
}
function closeGame() {
  $("gameModal").classList.add("hidden");
}
function startGameQuestions() {
  const set = currentLesson.modes?.[currentMode] || [];
  currentQuestions = shuffle([...set]);
  currentIndex = 0;
  score = 0;
  $("gameScore").textContent = "0";
  renderQuestion();
}
function renderQuestion() {
  answered = false;
  $("feedback").innerHTML = "";
  $("hintBtn").disabled = false;
  $("nextBtn").innerHTML =
    `Check Answer <i class="fa-solid fa-arrow-right"></i>`;
  if (currentIndex >= currentQuestions.length) {
    finishGame();
    return;
  }
  const q = currentQuestions[currentIndex];
  $("gameProgressBar").style.width =
    `${(currentIndex / currentQuestions.length) * 100}%`;
  const choices = (q.choices || [])
    .map(
      (c, i) =>
        `<button class="choice" data-index="${i}">${escapeHtml(String(c))}</button>`,
    )
    .join("");
  $("questionArea").innerHTML =
    `<div class="question-label">QUESTION ${currentIndex + 1} OF ${currentQuestions.length}</div>
    <div class="question">${escapeHtml(q.question)}</div><div class="choices">${choices}</div><div id="hintBox"></div>`;
  document
    .querySelectorAll(".choice")
    .forEach((btn) => (btn.onclick = () => selectChoice(btn)));
}
function selectChoice(btn) {
  if (answered) return;
  document
    .querySelectorAll(".choice")
    .forEach((x) => x.classList.remove("selected"));
  btn.classList.add("selected");
  btn.dataset.selected = "true";
}
function nextQuestion() {
  if (answered) {
    currentIndex++;
    renderQuestion();
    return;
  }
  const selected = document.querySelector(".choice.selected");
  if (!selected) {
    $("feedback").innerHTML =
      `<div class="feedback bad">Please choose an answer first.</div>`;
    return;
  }
  answered = true;
  const q = currentQuestions[currentIndex];
  const chosen = Number(selected.dataset.index);
  const correct = chosen === Number(q.answer);
  document.querySelectorAll(".choice").forEach((x) => (x.disabled = true));
  if (correct) {
    score++;
    selected.classList.add("correct");
    $("feedback").innerHTML =
      `<div class="feedback good"><b>Correct!</b> ${escapeHtml(q.explanation || "Great work!")}</div>`;
  } else {
    selected.classList.add("wrong");
    const right = document.querySelectorAll(".choice")[Number(q.answer)];
    if (right) right.classList.add("correct");
    $("feedback").innerHTML =
      `<div class="feedback bad"><b>Not quite.</b> ${escapeHtml(q.explanation || "Review the idea and try again.")}</div>`;
  }
  $("gameScore").textContent = score;
  $("nextBtn").innerHTML =
    currentIndex === currentQuestions.length - 1
      ? `See Result <i class="fa-solid fa-flag-checkered"></i>`
      : `Next <i class="fa-solid fa-arrow-right"></i>`;
}
function showHint() {
  const q = currentQuestions[currentIndex];
  if (!q) return;
  $("hintBox").innerHTML =
    `<div class="hint"><i class="fa-solid fa-lightbulb"></i> ${escapeHtml(q.hint || "Think carefully about the question.")}</div>`;
}
function finishGame() {
  const total = currentQuestions.length || 1;
  const pct = Math.round((score / total) * 100);
  saveProgress(
    currentLesson.id,
    currentLesson.title,
    currentMode,
    score,
    total,
    pct,
  );
  $("gameProgressBar").style.width = "100%";
  $("questionArea").innerHTML =
    `<div style="text-align:center;padding:30px 10px"><div class="about-icon" style="margin:0 auto 15px"><i class="fa-solid fa-trophy"></i></div><h2 style="font-family:'Playfair Display';color:var(--navy)">Great job!</h2><p>You scored <strong>${score} / ${total}</strong> (${pct}%).</p><button class="primary-btn" id="playAgain">Play Again</button></div>`;
  $("feedback").innerHTML = "";
  $("hintBtn").style.display = "none";
  $("nextBtn").style.display = "none";
  $("playAgain").onclick = () => {
    $("hintBtn").style.display = "";
    $("nextBtn").style.display = "";
    startGameQuestions();
  };
}
function saveProgress(id, title, mode, score, total, pct) {
  const all = JSON.parse(localStorage.getItem("msGraceProgress") || "{}");
  all[id] = {
    title,
    mode,
    score,
    total,
    pct,
    date: new Date().toLocaleString(),
  };
  localStorage.setItem("msGraceProgress", JSON.stringify(all));
}
function renderProgress() {
  const all = Object.values(
    JSON.parse(localStorage.getItem("msGraceProgress") || "{}"),
  );
  if (!all.length) {
    $("overallScore").textContent = "0%";
    $("progressText").textContent =
      "Complete a built-in game to begin tracking progress.";
    $("progressList").innerHTML = "";
    return;
  }
  const avg = Math.round(all.reduce((a, x) => a + x.pct, 0) / all.length);
  $("overallScore").textContent = avg + "%";
  $("progressText").textContent =
    `${all.length} lesson attempt${all.length === 1 ? "" : "s"} recorded on this device.`;
  $("progressList").innerHTML = all
    .map(
      (x) =>
        `<div class="progress-row"><span><b>${escapeHtml(x.title)}</b><small style="display:block;color:var(--muted)">${x.mode} • ${x.date}</small></span><strong>${x.pct}%</strong></div>`,
    )
    .join("");
}
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[m],
  );
}

// =========================================
// LOAD LESSONS FROM lessons.json
// =========================================

async function loadHomeLessons() {
  const container = document.getElementById("homeLessons");

  if (!container) return;

  try {
    const response = await fetch("lessons.json");

    if (!response.ok) {
      throw new Error("Unable to load lessons.json");
    }

    const data = await response.json();

    const lessons = data.lessons || [];

    if (lessons.length === 0) {
      container.innerHTML = `
                <div class="empty-lessons">
                    <p>No lessons available yet.</p>
                </div>
            `;

      return;
    }

    container.innerHTML = lessons
      .map((lesson) => {
        let icon = "fa-book-open";

        if (lesson.subject === "English") {
          icon = "fa-language";
        }

        if (lesson.subject === "Math") {
          icon = "fa-calculator";
        }

        return `
                <article
                    class="home-lesson-card"
                    onclick="openLesson('${lesson.url}')"
                >

                    <div class="lesson-card-icon">
                        <i class="fa-solid ${icon}"></i>
                    </div>

                    <span class="lesson-card-subject">
                        ${lesson.subject}
                    </span>

                    <h3 class="lesson-card-title">
                        ${lesson.title}
                    </h3>

                    <p class="lesson-card-description">
                        ${lesson.description}
                    </p>

                    <span class="lesson-card-grade">
                        <i class="fa-solid fa-graduation-cap"></i>
                        ${lesson.grade}
                    </span>

                    <button
                        class="lesson-card-button"
                        onclick="event.stopPropagation(); openLesson('${lesson.url}')"
                    >
                        <i class="fa-solid fa-gamepad"></i>
                        Start Lesson
                    </button>

                </article>
            `;
      })
      .join("");
  } catch (error) {
    console.error("Lesson loading error:", error);

    container.innerHTML = `
            <div class="empty-lessons">
                <p>
                    Unable to load lessons.
                    Please check your lessons.json file.
                </p>
            </div>
        `;
  }
}

// =========================================
// OPEN LESSON
// =========================================

function openLesson(url) {
  if (!url) {
    alert("This lesson does not have a valid URL.");
    return;
  }

  window.location.href = url;
}

// =========================================
// START HOME LESSON LOADING
// =========================================

document.addEventListener("DOMContentLoaded", () => {
  loadHomeLessons();
});

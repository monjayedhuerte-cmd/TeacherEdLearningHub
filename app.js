/* =========================================================
   TEACHER ED LEARNING HUB
   Add your lessons inside the LESSONS array below.
   Then put the corresponding HTML file in the lessons/ folder.
   ========================================================= */

let LESSONS = [];

const SUBJECTS = {
  "Mathematics": { icon: "calculator", description: "Numbers, patterns & problem solving." },
  "Filipino": { icon: "languages", description: "Wika, pagbasa & komunikasyon." },
  "English": { icon: "book-open", description: "Reading, language & communication." },
  "Science": { icon: "flask-conical", description: "Discover, investigate & explain." },
  "Araling Panlipunan": { icon: "map", description: "Kasaysayan, kultura & pamayanan." },
  "ESP": { icon: "heart-handshake", description: "Values, character & good citizenship." },
  "Computer": { icon: "monitor", description: "Technology, digital skills & computing." }
};

const state = {
  subject: "all",
  grade: "all",
  search: ""
};

const $ = (selector) => document.querySelector(selector);

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function icon(name, size = 18) {
  return `<i data-lucide="${name}" style="width:${size}px;height:${size}px"></i>`;
}

function refreshIcons() {
  if (window.lucide) lucide.createIcons();
}

function formatDate(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function getSubjects() {
  return [...new Set(LESSONS.map(l => l.subject))];
}

function renderSubjects() {
  const grid = $("#subjectGrid");

  grid.innerHTML = getSubjects().map(subject => {
    const info = SUBJECTS[subject] || { icon: "book-open", description: "Explore learning materials." };
    const count = LESSONS.filter(l => l.subject === subject).length;

    return `
      <article class="subject-card" data-subject="${escapeHTML(subject)}" tabindex="0">
        <div class="subject-icon">${icon(info.icon, 23)}</div>
        <h3>${escapeHTML(subject)}</h3>
        <p>${escapeHTML(info.description)} • ${count} lesson${count !== 1 ? "s" : ""}</p>
        <span class="arrow">${icon("arrow-up-right", 15)}</span>
      </article>
    `;
  }).join("");

  grid.querySelectorAll(".subject-card").forEach(card => {
    const choose = () => {
      state.subject = card.dataset.subject;
      state.grade = "all";
      $("#gradeFilter").value = "all";
      renderFilters();
      renderLessons();
      document.querySelector("#lessons").scrollIntoView({ behavior: "smooth" });
    };
    card.addEventListener("click", choose);
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") choose();
    });
  });

  refreshIcons();
}

function renderFilters() {
  const container = $("#subjectFilters");
  const subjects = getSubjects();

  container.innerHTML = [
    `<button class="filter-button ${state.subject === "all" ? "active" : ""}" data-filter="all">All Subjects</button>`,
    ...subjects.map(s => `
      <button class="filter-button ${state.subject === s ? "active" : ""}" data-filter="${escapeHTML(s)}">
        ${escapeHTML(s)}
      </button>
    `)
  ].join("");

  container.querySelectorAll(".filter-button").forEach(button => {
    button.addEventListener("click", () => {
      state.subject = button.dataset.filter;
      renderFilters();
      renderLessons();
    });
  });

  const grades = [...new Set(LESSONS.map(l => l.grade))]
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const gradeSelect = $("#gradeFilter");
  const current = state.grade;
  gradeSelect.innerHTML = `<option value="all">All Grades</option>` +
    grades.map(g => `<option value="${escapeHTML(g)}">${escapeHTML(g)}</option>`).join("");
  gradeSelect.value = grades.includes(current) ? current : "all";

  refreshIcons();
}

function getFilteredLessons() {
  return LESSONS
    .filter(lesson => state.subject === "all" || lesson.subject === state.subject)
    .filter(lesson => state.grade === "all" || lesson.grade === state.grade)
    .filter(lesson => {
      const query = state.search.toLowerCase().trim();
      if (!query) return true;
      return [lesson.title, lesson.subject, lesson.grade, lesson.description]
        .join(" ")
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

function renderLessons() {
  const grid = $("#lessonGrid");
  const lessons = getFilteredLessons();

  grid.innerHTML = lessons.map(lesson => `
    <article class="lesson-card">
      <div class="lesson-cover">
        <div class="lesson-cover-icon">${icon(lesson.icon || "book-open", 20)}</div>
        ${lesson.featured ? `<span class="badge">FEATURED</span>` : ""}
      </div>
      <div class="lesson-body">
        <div class="lesson-subject">${escapeHTML(lesson.subject)}</div>
        <h3>${escapeHTML(lesson.title)}</h3>
        <p>${escapeHTML(lesson.description)}</p>
        <div class="lesson-bottom">
          <span class="lesson-grade">${icon("graduation-cap", 13)} ${escapeHTML(lesson.grade)}</span>
          <a class="lesson-start" href="${escapeHTML(lesson.file)}">
            Start Lesson ${icon("arrow-right", 14)}
          </a>
        </div>
      </div>
    </article>
  `).join("");

  $("#emptyState").classList.toggle("hidden", lessons.length !== 0);
  grid.classList.toggle("hidden", lessons.length === 0);
  refreshIcons();
}

function renderToday() {
  const sorted = [...LESSONS].sort((a, b) => b.date.localeCompare(a.date));
  const today = sorted[0];

  if (!today) return;

  $("#todayTitle").textContent = today.title;
  $("#todayDescription").textContent = today.description;
  $("#todaySubject").textContent = today.subject;
  $("#todayGrade").textContent = today.grade;
  $("#todayLink").href = today.file;
}

function initializeStats() {
  $("#lessonCount").textContent = LESSONS.length;
  $("#subjectCount").textContent = getSubjects().length;
}

function clearFilters() {
  state.subject = "all";
  state.grade = "all";
  state.search = "";
  $("#searchInput").value = "";
  $("#gradeFilter").value = "all";
  renderFilters();
  renderLessons();
}

function setupNavigation() {
  const menuButton = $("#menuButton");
  const mobileMenu = $("#mobileMenu");

  menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
    menuButton.innerHTML = mobileMenu.classList.contains("open")
      ? icon("x", 20)
      : icon("menu", 20);
    refreshIcons();
  });

  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuButton.innerHTML = icon("menu", 20);
      refreshIcons();
    });
  });

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".nav-link").forEach(n => n.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

function setupSearch() {
  $("#searchInput").addEventListener("input", e => {
    state.search = e.target.value;
    renderLessons();
  });

  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      $("#searchInput").focus();
    }
  });
}

function setupTheme() {
  const saved = localStorage.getItem("teacherEdTheme");
  if (saved === "dark") document.body.classList.add("dark");

  $("#themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const dark = document.body.classList.contains("dark");
    localStorage.setItem("teacherEdTheme", dark ? "dark" : "light");

    $("#themeToggle").innerHTML = icon(dark ? "sun" : "moon", 18);
    refreshIcons();
  });

  $("#themeToggle").innerHTML = icon(
    document.body.classList.contains("dark") ? "sun" : "moon",
    18
  );
}

function setupGradeFilter() {
  $("#gradeFilter").addEventListener("change", e => {
    state.grade = e.target.value;
    renderLessons();
  });
}

async function loadLessons() {
  try {
    const response = await fetch("lessons.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    LESSONS = await response.json();

    initializeStats();
    renderSubjects();
    renderFilters();
    renderLessons();
    renderToday();

    $("#lessonCount").title = "Loaded from lessons.json";
  } catch (error) {
    console.error("Could not load lessons.json:", error);

    $("#lessonGrid").innerHTML = "";
    $("#emptyState").classList.remove("hidden");
    $("#emptyState h3").textContent = "Lessons could not be loaded";
    $("#emptyState p").textContent =
      "Make sure lessons.json is in the same folder as index.html.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupSearch();
  setupTheme();
  setupGradeFilter();

  $("#clearFilters").addEventListener("click", clearFilters);

  $("#todayButton").addEventListener("click", () => {
    $("#todaySection").scrollIntoView({ behavior: "smooth", block: "center" });
  });

  loadLessons();
  refreshIcons();
});

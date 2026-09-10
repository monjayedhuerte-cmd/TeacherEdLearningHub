const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
const KEY = "teacherEdItemAnalysisV1";
let state = {
  schoolName: "",
  teacherName: "Teacher Ed",
  gradeLevel: "Grade 3",
  sectionName: "",
  subject: "Mathematics",
  quarter: "Quarter 1",
  assessmentTitle: "Periodic Test",
  assessmentDate: "",
  schoolYear: "2026–2027",
  mastery: 75,
  nearly: 60,
  easy: 80,
  moderate: 60,
  items: [],
  students: [],
  reflection: {},
  plan: {},
};

function uid(prefix = "id") {
  return (
    prefix +
    "_" +
    Math.random().toString(36).slice(2, 9) +
    Date.now().toString(36).slice(-4)
  );
}
function num(v, d = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}
function pct(a, b) {
  return b ? Math.round((a / b) * 1000) / 10 : 0;
}
function esc(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        m
      ],
  );
}
function showToast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => t.classList.remove("show"), 2200);
}
function confirmModal(title, text, fn) {
  $("#modalTitle").textContent = title;
  $("#modalText").textContent = text;
  $("#modal").classList.add("open");
  $("#modal").setAttribute("aria-hidden", "false");
  $("#modalConfirm").onclick = () => {
    fn();
    $("#modal").classList.remove("open");
  };
  $("#modalCancel").onclick = () => $("#modal").classList.remove("open");
}

function defaults() {
  state.items = Array.from({ length: 20 }, (_, i) => ({
    id: uid("item"),
    number: i + 1,
    competency: "Learning competency " + (Math.floor(i / 4) + 1),
    manualCorrect: 0,
    manualWrong: 0,
  }));
  state.students = [];
}
function collectMeta() {
  state.schoolName = $("#schoolName").value;
  state.teacherName = $("#teacherName").value;
  state.gradeLevel = $("#gradeLevel").value;
  state.sectionName = $("#sectionName").value;
  state.subject = $("#subject").value;
  state.quarter = $("#quarter").value;
  state.assessmentTitle = $("#assessmentTitle").value;
  state.assessmentDate = $("#assessmentDate").value;
  state.schoolYear = $("#schoolYear").value;
  state.mastery = num($("#masteryThreshold").value, 75);
  state.nearly = num($("#nearlyThreshold").value, 60);
  state.easy = num($("#easyThreshold").value, 80);
  state.moderate = num($("#moderateThreshold").value, 60);
}
function pushMeta() {
  $("#schoolName").value = state.schoolName;
  $("#teacherName").value = state.teacherName;
  $("#gradeLevel").value = state.gradeLevel;
  $("#sectionName").value = state.sectionName;
  $("#subject").value = state.subject;
  $("#quarter").value = state.quarter;
  $("#assessmentTitle").value = state.assessmentTitle;
  $("#assessmentDate").value = state.assessmentDate;
  $("#schoolYear").value = state.schoolYear;
  $("#masteryThreshold").value = state.mastery;
  $("#nearlyThreshold").value = state.nearly;
  $("#easyThreshold").value = state.easy;
  $("#moderateThreshold").value = state.moderate;
  $("#totalItems").value = state.items.length;
}
function classifyStudent(p) {
  if (p >= state.mastery) return ["MASTERED", "mastered"];
  if (p >= state.nearly) return ["NEARLY MASTERED", "nearly"];
  return ["NEEDS INTERVENTION", "intervention"];
}
function classifyItem(p) {
  if (p >= state.easy) return ["EASY", "easy"];
  if (p >= state.moderate) return ["MODERATE", "moderate"];
  return ["DIFFICULT", "difficult"];
}
function actionFor(p) {
  if (p < 40) return "Immediate remediation";
  if (p < 60) return "Targeted reteaching";
  if (p < 80) return "Additional practice";
  return "Maintain / Enrichment";
}
function studentStats(s) {
  let recorded = s.responses.filter(
    (x) => x !== null && x !== undefined && x !== "",
  );
  let correct = recorded.filter((x) => x === true).length;
  let wrong = recorded.filter((x) => x === false).length;
  let total = state.items.length;
  let score = recorded.length === total ? correct : num(s.manualScore, 0);
  if (recorded.length < total && s.manualScore !== "" && s.manualScore != null)
    score = num(s.manualScore, correct);
  else score = correct;
  let p = pct(score, total);
  return { recorded, correct, wrong, score, p, ...classifyStudent(p) };
}
function itemStats(itemIndex) {
  let correct = 0,
    wrong = 0,
    recorded = 0;
  state.students.forEach((s) => {
    const r = s.responses[itemIndex];
    if (r === true) {
      correct++;
      recorded++;
    } else if (r === false) {
      wrong++;
      recorded++;
    }
  });
  const it = state.items[itemIndex] || {};
  if (recorded === 0) {
    correct = Math.max(0, num(it.manualCorrect, 0));
    wrong = Math.max(0, num(it.manualWrong, 0));
  }
  const total = correct + wrong;
  return { correct, wrong, total, p: pct(correct, total), recorded };
}
function competencyStats() {
  const groups = {};
  state.items.forEach((it, i) => {
    const key = (it.competency || "Unassigned").trim() || "Unassigned";
    if (!groups[key]) groups[key] = { items: [], correct: 0, total: 0 };
    groups[key].items.push(it.number);
    const x = itemStats(i);
    groups[key].correct += x.correct;
    groups[key].total += x.total;
  });
  return groups;
}

function renderStudents() {
  const q = $("#studentSearch").value.toLowerCase(),
    filter = $("#statusFilter").value,
    body = $("#studentTable tbody");
  body.innerHTML = "";
  const visible = state.students
    .map((s, i) => ({ s, i, st: studentStats(s) }))
    .filter((o) => (o.s.name || "").toLowerCase().includes(q))
    .filter((o) => filter === "all" || o.st[1] === filter);
  visible.forEach(({ s, i, st }) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i + 1}</td>
    <td><input data-name="${s.id}" value="${esc(s.name)}" aria-label="Student name"></td>
    <td><input data-score="${s.id}" type="number" min="0" max="${state.items.length}" value="${st.score}" aria-label="Score"></td>
    <td>${st.correct}</td><td>${st.wrong}</td><td><strong>${st.p}%</strong></td>
    <td><span class="status ${st[1]}">${st[0]}</span></td>
    <td><button class="btn btn-danger-outline" data-delete="${s.id}">Delete</button></td>`;
    body.appendChild(tr);
  });
  $("#studentEmpty").style.display = state.students.length ? "none" : "block";
  $$("[data-name]").forEach(
    (el) =>
      (el.oninput = (e) => {
        const s = state.students.find((x) => x.id === el.dataset.name);
        s.name = e.target.value;
        saveLocal(false);
        renderProfileSelectors();
      }),
  );
  $$("[data-score]").forEach(
    (el) =>
      (el.oninput = (e) => {
        const s = state.students.find((x) => x.id === el.dataset.score);
        s.manualScore = Math.max(
          0,
          Math.min(state.items.length, num(e.target.value, 0)),
        );
        renderAll(false);
      }),
  );
  $$("[data-delete]").forEach(
    (el) =>
      (el.onclick = () =>
        confirmModal(
          "Delete student?",
          "This will remove the student and their item responses.",
          () => {
            state.students = state.students.filter(
              (x) => x.id !== el.dataset.delete,
            );
            renderAll();
            showToast("Student deleted.");
          },
        )),
  );
}
function renderMatrix() {
  const thead = $("#matrixTable thead"),
    body = $("#matrixTable tbody");
  thead.innerHTML =
    "<tr><th>Student / Item</th>" +
    state.items
      .map((it) => `<th title="${esc(it.competency)}">#${it.number}</th>`)
      .join("") +
    "<th>Score</th><th>%</th></tr>";
  body.innerHTML = "";
  state.students.forEach((s) => {
    const st = studentStats(s),
      tr = document.createElement("tr");
    tr.innerHTML =
      `<td><strong>${esc(s.name || "Unnamed Student")}</strong></td>` +
      state.items
        .map((it, i) => {
          const r = s.responses[i];
          return `<td><button class="resp ${r === true ? "correct" : r === false ? "wrong" : ""}" data-resp="${s.id}|${i}" aria-label="Item ${it.number} response">${r === true ? "✓" : r === false ? "✗" : "—"}</button></td>`;
        })
        .join("") +
      `<td><strong>${st.score}/${state.items.length}</strong></td><td>${st.p}%</td>`;
    body.appendChild(tr);
  });
  $$("[data-resp]").forEach(
    (b) =>
      (b.onclick = () => {
        const [sid, ii] = b.dataset.resp.split("|");
        const s = state.students.find((x) => x.id === sid),
          i = +ii;
        const r = s.responses[i];
        s.responses[i] = r === null ? true : r === true ? false : null;
        renderAll();
      }),
  );
}
function renderItems() {
  const filter = $("#itemDifficultyFilter").value,
    body = $("#itemTable tbody");
  body.innerHTML = "";
  state.items.forEach((it, i) => {
    const x = itemStats(i),
      d = classifyItem(x.p);
    if (filter !== "all" && d[1] !== filter) return;
    const hasResponses = x.recorded > 0;
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><input class="item-number-input" data-item-number="${it.id}" type="number" min="1" max="999" value="${Number(it.number) || i + 1}" aria-label="Item number ${i + 1}"></td>
    <td><input data-comp="${it.id}" value="${esc(it.competency)}" aria-label="Competency for item ${it.number}"></td>
    <td><input class="count-input" data-item-correct="${it.id}" type="number" min="0" max="999" value="${x.correct}" aria-label="Correct count for item ${it.number}" ${hasResponses ? 'readonly title="Calculated from the response matrix"' : ""}></td>
    <td><input class="count-input" data-item-wrong="${it.id}" type="number" min="0" max="999" value="${x.wrong}" aria-label="Wrong count for item ${it.number}" ${hasResponses ? 'readonly title="Calculated from the response matrix"' : ""}></td>
    <td><strong>${x.p}%</strong></td>
    <td><span class="difficulty ${d[1]}">${d[0]}</span></td><td>${actionFor(x.p)}</td>`;
    body.appendChild(tr);
  });
  $$("[data-comp]").forEach(
    (el) =>
      (el.oninput = (e) => {
        const it = state.items.find((x) => x.id === el.dataset.comp);
        it.competency = e.target.value;
        saveLocal(false);
        renderCompetencies();
        renderInsights();
      }),
  );
  $$("[data-item-number]").forEach(
    (el) =>
      (el.onchange = (e) => {
        const it = state.items.find((x) => x.id === el.dataset.itemNumber);
        it.number = Math.max(1, Math.min(999, num(e.target.value, 1)));
        saveLocal(false);
        renderAll(false);
      }),
  );
  $$("[data-item-correct]").forEach(
    (el) =>
      (el.onchange = (e) => {
        const it = state.items.find((x) => x.id === el.dataset.itemCorrect);
        it.manualCorrect = Math.max(0, num(e.target.value, 0));
        saveLocal(false);
        renderAll(false);
      }),
  );
  $$("[data-item-wrong]").forEach(
    (el) =>
      (el.onchange = (e) => {
        const it = state.items.find((x) => x.id === el.dataset.itemWrong);
        it.manualWrong = Math.max(0, num(e.target.value, 0));
        saveLocal(false);
        renderAll(false);
      }),
  );
}
function renderCompetencies() {
  const box = $("#competencyCards");
  box.innerHTML = "";
  const groups = competencyStats();
  Object.entries(groups).forEach(([name, g]) => {
    const p = pct(g.correct, g.total),
      d = classifyItem(p);
    box.insertAdjacentHTML(
      "beforeend",
      `<article class="competency-card"><h3>${esc(name)}</h3><p>Items: ${g.items.join(", ")}</p><p>Average item performance: <strong>${p}%</strong></p><div class="progress"><i style="width:${p}%"></i></div><p><span class="difficulty ${d[1]}">${d[0]}</span> · ${p < 60 ? "Needs Remediation" : p < 80 ? "Additional Practice" : "Maintain / Enrichment"}</p></article>`,
    );
  });
}
function renderItemBars() {
  const box = $("#itemBars");
  box.innerHTML = "";
  state.items.forEach((it, i) => {
    const x = itemStats(i),
      correctW = x.p,
      wrongW = 100 - x.p;
    box.insertAdjacentHTML(
      "beforeend",
      `<div class="item-bar"><div class="bar-head"><span>Item #${it.number} · ${esc(it.competency)}</span><span>${x.correct} correct / ${x.wrong} wrong</span></div><div class="bar-track"><div class="bar-correct" style="width:${correctW}%;"></div></div><div class="bar-head"><span>${x.p}% correct</span><span>${wrongW.toFixed(1)}% wrong</span></div></div>`,
    );
  });
}
function renderGroups() {
  const groups = { mastered: [], nearly: [], intervention: [] };
  state.students.forEach((s) => {
    const st = studentStats(s);
    groups[st[1]].push(s.name || "Unnamed Student");
  });
  Object.entries(groups).forEach(([k, names]) => {
    $("#group" + k[0].toUpperCase() + k.slice(1)).innerHTML = names.length
      ? names.map((n) => `<span class="name-pill">${esc(n)}</span>`).join("")
      : "<span class='empty'>None</span>";
  });
}
function renderClass() {
  const sts = state.students.map(studentStats),
    ps = sts.map((x) => x.p),
    avg = ps.length
      ? Math.round((ps.reduce((a, b) => a + b, 0) / ps.length) * 10) / 10
      : 0,
    sorted = [...ps].sort((a, b) => a - b),
    median = sorted.length
      ? sorted.length % 2
        ? sorted[(sorted.length - 1) / 2]
        : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : 0;
  const mastered = sts.filter((x) => x[1] === "mastered").length,
    nearly = sts.filter((x) => x[1] === "nearly").length,
    intv = sts.filter((x) => x[1] === "intervention").length;
  $("#classSummary").innerHTML = [
    ["Highest score", ps.length ? Math.max(...ps) + "%" : "—"],
    ["Lowest score", ps.length ? Math.min(...ps) + "%" : "—"],
    ["Class average", avg + "%"],
    ["Median", median + "%"],
    ["Mastered", mastered],
    ["Nearly mastered", nearly],
    ["Needs intervention", intv],
    ["Mastery percentage", ps.length ? pct(mastered, ps.length) + "%" : "0%"],
  ]
    .map(
      (x) =>
        `<div class="summary-item"><small>${x[0]}</small><strong>${x[1]}</strong></div>`,
    )
    .join("");
  const ranges = [
    ["90–100%", 90, 100],
    ["80–89%", 80, 89],
    ["70–79%", 70, 79],
    ["60–69%", 60, 69],
    ["Below 60%", 0, 59],
  ];
  $("#distribution").innerHTML = ranges
    .map(([lab, a, b]) => {
      const n = ps.filter((p) => p >= a && p <= b).length,
        w = ps.length ? pct(n, ps.length) : 0;
      return `<div class="distribution-row"><span>${lab}</span><div class="dist-track"><i style="width:${w}%"></i></div><strong>${n}</strong></div>`;
    })
    .join("");
}
function renderPriority() {
  const arr = state.items.map((it, i) => ({ it, x: itemStats(i) }));
  const hard = [...arr].sort((a, b) => a.x.p - b.x.p).slice(0, 5),
    best = [...arr].sort((a, b) => b.x.p - a.x.p).slice(0, 5);
  $("#hardestItems").innerHTML =
    hard
      .map(
        (o, i) =>
          `<div class="priority-item"><span>#${o.it.number} · ${esc(o.it.competency)}</span><strong>${o.x.p}%</strong></div>`,
      )
      .join("") || "<div class='empty'>No item responses recorded.</div>";
  $("#bestItems").innerHTML =
    best
      .map(
        (o, i) =>
          `<div class="priority-item"><span>#${o.it.number} · ${esc(o.it.competency)}</span><strong style="color:var(--green)">${o.x.p}%</strong></div>`,
      )
      .join("") || "<div class='empty'>No item responses recorded.</div>";
  const hardest = hard[0];
  $("#statHardest").textContent = hardest ? `#${hardest.it.number}` : "—";
  $("#statHardestPct").textContent = hardest
    ? `${hardest.x.p}% correct`
    : "lowest % correct";
}
function renderProfileSelectors() {
  const opts =
    '<option value="">Choose a student…</option>' +
    state.students
      .map(
        (s) =>
          `<option value="${s.id}">${esc(s.name || "Unnamed Student")}</option>`,
      )
      .join("");
  const cur = $("#profileStudent").value,
    cur2 = $("#reassessStudent").value;
  $("#profileStudent").innerHTML = opts;
  $("#reassessStudent").innerHTML = opts;
  $("#profileStudent").value = cur;
  $("#reassessStudent").value = cur2;
}
function renderProfile() {
  const s = state.students.find((x) => x.id === $("#profileStudent").value),
    box = $("#studentProfile");
  if (!s) {
    box.className = "profile-card empty-profile";
    box.textContent = "Select a student to view their error profile.";
    return;
  }
  const st = studentStats(s),
    errors = [];
  s.responses.forEach((r, i) => {
    if (r === false) errors.push(i);
  });
  const comps = [
    ...new Set(errors.map((i) => state.items[i].competency || "Unassigned")),
  ];
  box.className = "profile-card";
  box.innerHTML = `<div class="profile-title">${esc(s.name || "Unnamed Student")}</div><div class="profile-stats"><span class="profile-stat">Score: <strong>${st.score}/${state.items.length}</strong></span><span class="profile-stat">Percentage: <strong>${st.p}%</strong></span><span class="status ${st[1]}">${st[0]}</span></div><h4>Items Answered Incorrectly</h4><div class="error-list">${errors.length ? errors.map((i) => `<span class="error-pill">Item #${state.items[i].number}</span>`).join("") : "<span class='empty'>No recorded incorrect responses.</span>"}</div><h4>Related Competencies</h4><ul>${comps.length ? comps.map((c) => `<li>${esc(c)}</li>`).join("") : "<li>No error-linked competencies yet.</li>"}</ul><h4>Recommended Intervention</h4><p>${st[1] === "mastered" ? "Provide enrichment or extension activities while monitoring continued mastery." : st[1] === "nearly" ? "Provide guided practice, additional examples, and a short formative check." : "Provide focused reteaching, guided practice, and reassessment on the identified competencies."}</p>`;
  $("#interventionEngine").innerHTML =
    `<h3>Intervention Recommendation Engine</h3><p><strong>${esc(s.name || "Student")}</strong> is classified as <strong>${st[0]}</strong> at ${st.p}%.</p><p>${errors.length ? `Prioritize ${errors.length} recorded incorrect item${errors.length > 1 ? "s" : ""}: ${errors.map((i) => "#" + state.items[i].number).join(", ")}.` : "Record item responses to generate competency-specific recommendations."}</p><p><strong>Suggested strategies:</strong> explicit reteaching, worked examples, guided practice, visual aids, peer-assisted practice, short formative assessment, and reassessment.</p>`;
}
function renderInsights() {
  const sts = state.students.map(studentStats),
    items = state.items.map((it, i) => ({ it, x: itemStats(i) })),
    hard = [...items].sort((a, b) => a.x.p - b.x.p).slice(0, 3),
    groups = competencyStats();
  const strengths = Object.entries(groups).sort(
      (a, b) => pct(b[1].correct, b[1].total) - pct(a[1].correct, a[1].total),
    )[0],
    gap = Object.entries(groups).sort(
      (a, b) => pct(a[1].correct, a[1].total) - pct(b[1].correct, b[1].total),
    )[0];
  $("#teacherInsights").innerHTML = `<h3>Teacher Insights</h3>
  <p><strong>Class Strength:</strong> ${strengths ? `<em>${esc(strengths[0])}</em> is currently the strongest competency at ${pct(strengths[1].correct, strengths[1].total)}%.` : "Record item responses to identify strengths."}</p>
  <p><strong>Learning Gap:</strong> ${gap ? `<em>${esc(gap[0])}</em> currently has the lowest competency performance at ${pct(gap[1].correct, gap[1].total)}%.` : "No competency gap can be calculated yet."}</p>
  <p><strong>Priority:</strong> ${hard.length && state.students.length ? hard.map((o) => `Item #${o.it.number} (${o.x.p}%)`).join(", ") + " require attention." : "Record student item responses to identify priority items."}</p>
  <p><strong>Recommended Approach:</strong> Use the identified competency gaps to form small-group or individual intervention, then reassess the targeted skills.</p>`;
}
function updateStats() {
  const sts = state.students.map(studentStats),
    ps = sts.map((x) => x.p),
    avg = ps.length
      ? Math.round((ps.reduce((a, b) => a + b, 0) / ps.length) * 10) / 10
      : 0,
    mastered = sts.filter((x) => x[1] === "mastered").length;
  $("#statStudents").textContent = state.students.length;
  $("#statItems").textContent = state.items.length;
  $("#statAverage").textContent = avg + "%";
  $("#statMastered").textContent = mastered;
  $("#statNearly").textContent = sts.filter((x) => x[1] === "nearly").length;
  $("#statIntervention").textContent = sts.filter(
    (x) => x[1] === "intervention",
  ).length;
  $("#statMastery").textContent = state.students.length
    ? pct(mastered, state.students.length) + "%"
    : "0%";
}
function renderReassessment() {
  const sid = $("#reassessStudent").value,
    s = state.students.find((x) => x.id === sid),
    pre = num($("#preScore").value, -1),
    pret = num($("#preTotal").value, 0),
    post = num($("#postScore").value, -1),
    postt = num($("#postTotal").value, 0),
    box = $("#reassessmentResult");
  if (pre < 0 || post < 0 || !pret || !postt) {
    box.className = "reassessment-result";
    box.textContent = "Enter scores to compare before and after intervention.";
    return;
  }
  const a = pct(pre, pret),
    b = pct(post, postt),
    diff = Math.round((b - a) * 10) / 10;
  let cls = diff >= 10 ? "improved" : diff > 0 ? "slight" : "nochange";
  box.className = "reassessment-result " + cls;
  box.innerHTML = `${s ? `<strong>${esc(s.name)}</strong> — ` : ""}Before Intervention: <strong>${a}%</strong> · After Intervention: <strong>${b}%</strong> · Improvement: <strong>${diff >= 0 ? "+" : ""}${diff} percentage points</strong> — ${diff >= 10 ? "🟢 Improved" : diff > 0 ? "🟡 Slight Improvement" : "🔴 No Significant Improvement"}`;
}

function saveLocal(notify = true) {
  collectMeta();
  state.reflection = {};
  for (let i = 1; i <= 6; i++)
    state.reflection["reflect" + i] = $("#reflect" + i).value;
  state.plan = {};
  [
    "planStudents",
    "planCompetency",
    "planDifficulty",
    "planStrategy",
    "planMaterials",
    "planNotes",
    "planDate",
    "planSessions",
    "planReassessDate",
  ].forEach((id) => (state.plan[id] = $("#" + id).value));
  localStorage.setItem(KEY, JSON.stringify(state));
  if (notify) showToast("Assessment saved locally.");
}
function loadLocal() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      state = JSON.parse(raw);
      return true;
    }
  } catch (e) {}
  return false;
}
function loadIntoForm() {
  pushMeta();
  for (let i = 1; i <= 6; i++)
    $("#reflect" + i).value = state.reflection?.["reflect" + i] || "";
  Object.entries(state.plan || {}).forEach(([k, v]) => {
    if ($("#" + k)) $("#" + k).value = v;
  });
}
function renderAll(save = true) {
  collectMeta();
  updateStats();
  renderStudents();
  renderMatrix();
  renderItems();
  renderCompetencies();
  renderItemBars();
  renderClass();
  renderPriority();
  renderGroups();
  renderProfileSelectors();
  renderProfile();
  renderInsights();
  renderReassessment();
  if (save) saveLocal(false);
}
function addStudent() {
  const s = {
    id: uid("student"),
    name: "Student " + (state.students.length + 1),
    manualScore: 0,
    responses: Array(state.items.length).fill(null),
  };
  state.students.push(s);
  renderAll();
  setTimeout(() => {
    $("#studentTable tbody tr:last-child input")?.focus();
  }, 50);
}
function addItem() {
  state.items.push({
    id: uid("item"),
    number: state.items.length + 1,
    competency: "New learning competency",
    manualCorrect: 0,
    manualWrong: 0,
  });
  state.students.forEach((s) => s.responses.push(null));
  $("#totalItems").value = state.items.length;
  renderAll();
  showToast("Item added.");
}
function applyItemCount() {
  let n = Math.max(1, Math.min(200, num($("#totalItems").value, 20)));
  if (n === state.items.length) return;
  confirmModal(
    "Change number of items?",
    `Adjust the assessment to ${n} items. Existing data beyond the new item count may be removed.`,
    () => {
      if (n > state.items.length) {
        for (let i = state.items.length; i < n; i++)
          state.items.push({
            id: uid("item"),
            number: i + 1,
            competency: "Learning competency " + (Math.floor(i / 4) + 1),
            manualCorrect: 0,
            manualWrong: 0,
          });
        state.students.forEach((s) => {
          while (s.responses.length < n) s.responses.push(null);
        });
      } else {
        state.items = state.items.slice(0, n);
        state.students.forEach((s) => (s.responses = s.responses.slice(0, n)));
      }
      $("#totalItems").value = n;
      renderAll();
      showToast("Item count updated.");
    },
  );
}
function reset() {
  confirmModal(
    "Reset assessment?",
    "This will remove the current assessment data stored in this browser.",
    () => {
      defaults();
      Object.assign(state, {
        schoolName: "",
        teacherName: "Teacher Ed",
        gradeLevel: "Grade 3",
        sectionName: "",
        subject: "Mathematics",
        quarter: "Quarter 1",
        assessmentTitle: "Periodic Test",
        assessmentDate: "",
        schoolYear: "2026–2027",
        mastery: 75,
        nearly: 60,
        easy: 80,
        moderate: 60,
        reflection: {},
        plan: {},
      });
      localStorage.removeItem(KEY);
      loadIntoForm();
      renderAll(false);
      showToast("Assessment reset.");
    },
  );
}
function demo() {
  confirmModal(
    "Load demo data?",
    "Demo data will replace the current assessment in this browser.",
    () => {
      state.schoolName = "Teacher Ed Demo School";
      state.teacherName = "Teacher Ed";
      state.gradeLevel = "Grade 3";
      state.sectionName = "Learning Hub";
      state.subject = "Mathematics";
      state.quarter = "Quarter 1";
      state.assessmentTitle = "Fractions & Number Sense Assessment";
      state.schoolYear = "2026–2027";
      state.mastery = 75;
      state.nearly = 60;
      state.easy = 80;
      state.moderate = 60;
      state.assessmentDate = new Date().toISOString().slice(0, 10);
      state.items = Array.from({ length: 20 }, (_, i) => ({
        id: uid("item"),
        number: i + 1,
        competency: [
          "Reads and represents fractions",
          "Compares and orders fractions",
          "Adds and subtracts fractions",
          "Solves fraction word problems",
          "Explains mathematical reasoning",
        ][Math.floor(i / 4)],
      }));
      const names = [
        "Ana Cruz",
        "Ben Santos",
        "Carlo Reyes",
        "Dana Flores",
        "Ella Garcia",
        "Francis Lim",
        "Gina Torres",
        "Hannah Lee",
        "Ivan Ramos",
        "Jessa Cruz",
        "Kevin Tan",
        "Lara Mendoza",
        "Marco Diaz",
        "Nina Lopez",
        "Owen Garcia",
        "Paolo Reyes",
        "Queenie Santos",
        "Rico Flores",
        "Sofia Tan",
        "Theo Ramos",
        "Uma Diaz",
        "Vince Cruz",
        "Wendy Lee",
        "Xavier Lim",
        "Yana Torres",
        "Zach Mendoza",
        "Aira Lopez",
        "Brent Garcia",
        "Chloe Reyes",
        "Diego Santos",
      ];
      state.students = names.map((name, si) => {
        let responses = state.items.map((_, i) => {
          const base = (si * 7 + i * 3) % 10;
          return base < 2 ? false : base < 9 ? true : null;
        });
        return { id: uid("student"), name, manualScore: 0, responses };
      });
      loadIntoForm();
      renderAll();
      showToast("Demo data loaded.");
    },
  );
}
function exportJSON() {
  saveLocal(false);
  const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    }),
    a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "teacher-ed-item-analysis.json";
  a.click();
  URL.revokeObjectURL(a.href);
}
function exportCSV() {
  const rows = [
    ["Student Name", "Score", "Correct", "Wrong", "Percentage", "Status"],
  ];
  state.students.forEach((s) => {
    const st = studentStats(s);
    rows.push([s.name, st.score, st.correct, st.wrong, st.p + "%", st[0]]);
  });
  const blob = new Blob(
      [
        rows
          .map((r) =>
            r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","),
          )
          .join("\n"),
      ],
      { type: "text/csv;charset=utf-8" },
    ),
    a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "teacher-ed-student-results.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}
function importJSON(e) {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const x = JSON.parse(r.result);
      if (!x.items || !x.students) throw Error();
      state = x;
      state.items = state.items.map((it, i) => ({
        ...it,
        number: i + 1,
        manualCorrect: num(it.manualCorrect, 0),
        manualWrong: num(it.manualWrong, 0),
      }));
      state.students.forEach((s) => {
        s.responses = Array.from(
          { length: state.items.length },
          (_, i) => s.responses?.[i] ?? null,
        );
      });
      loadIntoForm();
      renderAll();
      showToast("JSON data imported.");
    } catch (err) {
      showToast("Invalid assessment JSON file.");
    }
    e.target.value = "";
  };
  r.readAsText(f);
}
function exportWord() {
  saveLocal(false);
  // Offline Microsoft Word export: create a Word-compatible .doc file from HTML.
  // This avoids external libraries/CDNs, so the feature works even without internet access.
  const escWord = (v) =>
    String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  const cell = (v, header = false) =>
    `<td style="${header ? "background:#0b326d;color:#fff;font-weight:700;" : ""}border:1px solid #cbd5e1;padding:6px 8px;vertical-align:top;">${escWord(v)}</td>`;
  const table = (headers, rows) =>
    `<table style="border-collapse:collapse;width:100%;margin:8px 0 18px;font-family:Arial,sans-serif;font-size:10pt;"><tr>${headers.map((x) => cell(x, true)).join("")}</tr>${rows.map((r) => `<tr>${r.map((x) => cell(x)).join("")}</tr>`).join("")}</table>`;
  const heading = (t) =>
    `<h2 style="font-family:Arial,sans-serif;color:#0b326d;border-bottom:2px solid #f5b800;padding-bottom:4px;">${escWord(t)}</h2>`;
  const p = (t) =>
    `<p style="font-family:Arial,sans-serif;font-size:10.5pt;line-height:1.45;">${escWord(t)}</p>`;
  const sts = state.students.map(studentStats);
  const avg = sts.length
    ? Math.round((sts.reduce((a, x) => a + x.p, 0) / sts.length) * 10) / 10
    : 0;
  const mastered = sts.filter((x) => x[1] === "mastered").length;
  const nearly = sts.filter((x) => x[1] === "nearly").length;
  const intervention = sts.filter((x) => x[1] === "intervention").length;
  const itemRows = state.items.map((it, i) => {
    const x = itemStats(i);
    return [
      it.number,
      it.competency,
      x.correct,
      x.wrong,
      x.p + "%",
      x.diff,
      x.p < state.moderate ? "REMEDIATE" : "MONITOR",
    ];
  });
  const studentRows = state.students.map((s) => {
    const x = studentStats(s);
    return [
      s.name,
      x.score + "/" + state.items.length,
      x.correct,
      x.wrong,
      x.p + "%",
      x[0],
    ];
  });
  const compRows = Object.entries(competencyStats()).map(([name, x]) => [
    name,
    x.correct,
    x.wrong,
    pct(x.correct, x.total) + "%",
    x.items.length,
  ]);
  const group = (status) =>
    state.students
      .filter((s) => studentStats(s)[1] === status)
      .map((s) => s.name)
      .join(", ") || "None";
  const meta = [
    ["School Name", state.schoolName],
    ["Teacher Name", state.teacherName],
    ["Grade Level", state.gradeLevel],
    ["Section", state.sectionName],
    ["Subject", state.subject],
    ["Quarter / Term", state.quarter],
    ["Assessment", state.assessmentTitle],
    ["Date", state.assessmentDate || ""],
    ["School Year", state.schoolYear],
  ];
  let logo = "";
  try {
    const img = document.querySelector(".brand-logo");
    if (img?.src)
      logo = `<img src="${img.src}" style="width:85px;height:85px;object-fit:contain;" alt="Teacher Ed Learning Hub Logo">`;
  } catch (e) {}
  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escWord(state.assessmentTitle || "Item Analysis")} - Teacher Ed Learning Hub</title></head><body style="margin:36px;color:#172033;background:#fff;">`;
  html += `<div style="text-align:center;font-family:Arial,sans-serif;">${logo}<div style="font-size:22pt;font-weight:700;color:#0b326d;margin-top:8px;">Teacher Ed Learning Hub</div><div style="font-size:16pt;font-weight:700;color:#172033;">Item Analysis &amp; Intervention Tracker</div><div style="font-size:10pt;font-style:italic;color:#56657a;margin-top:4px;">Teach • Analyze • Intervene • Improve</div></div>`;
  html += heading("Assessment Information") + table(["Field", "Details"], meta);
  html +=
    heading("Class Performance Summary") +
    table(
      ["Metric", "Result"],
      [
        ["Total Students", state.students.length],
        ["Total Items", state.items.length],
        ["Class Average", avg + "%"],
        ["Mastered", mastered],
        ["Nearly Mastered", nearly],
        ["Needs Intervention", intervention],
        [
          "Overall Mastery",
          state.students.length
            ? pct(mastered, state.students.length) + "%"
            : "0%",
        ],
      ],
    );
  html +=
    heading("Student Results") +
    table(
      ["Student", "Score", "Correct", "Wrong", "Percentage", "Status"],
      studentRows,
    );
  html +=
    heading("Item Analysis") +
    table(
      [
        "Item",
        "Learning Competency",
        "Correct",
        "Wrong",
        "% Correct",
        "Difficulty",
        "Recommended Action",
      ],
      itemRows,
    );
  html +=
    heading("Competency Tracker") +
    table(
      ["Competency", "Correct", "Wrong", "Performance", "Items"],
      compRows.length
        ? compRows
        : [["No competency data recorded", "", "", "", "-"]],
    );
  html +=
    heading("Intervention Groups") +
    table(
      ["Group", "Students", "Recommended Focus"],
      [
        [
          "GROUP A — MASTERED",
          group("mastered"),
          "Enrichment / extension activities",
        ],
        [
          "GROUP B — NEARLY MASTERED",
          group("nearly"),
          "Guided practice and additional exercises",
        ],
        [
          "GROUP C — NEEDS INTERVENTION",
          group("intervention"),
          "Focused reteaching and scaffolded practice",
        ],
      ],
    );
  html += heading("Teacher Reflection");
  const prompts = [
    "Which competencies were mastered?",
    "Which competencies require reteaching?",
    "Which students require intervention?",
    "What instructional strategy will be used?",
    "When will reassessment occur?",
    "What changes should be made to future instruction?",
  ];
  for (let i = 1; i <= 6; i++)
    html += `<p style="font-family:Arial,sans-serif;font-size:10.5pt;"><strong>${i}. ${escWord(prompts[i - 1])}</strong><br>${escWord($("#reflect" + i).value || "")}</p>`;
  html +=
    heading("Intervention Plan") +
    table(
      ["Plan Field", "Details"],
      [
        ["Target Students", $("#planStudents").value],
        ["Target Competency", $("#planCompetency").value],
        ["Identified Difficulty", $("#planDifficulty").value],
        ["Intervention Strategy", $("#planStrategy").value],
        ["Materials Needed", $("#planMaterials").value],
        ["Teacher Notes", $("#planNotes").value],
        ["Intervention Date", $("#planDate").value],
        ["Number of Sessions", $("#planSessions").value],
        ["Reassessment Date", $("#planReassessDate").value],
      ],
    );
  html += `<div style="text-align:center;margin-top:30px;border-top:1px solid #cbd5e1;padding-top:10px;font:9pt Arial,sans-serif;color:#56657a;">Teacher Ed Learning Hub • Local Teacher Tool</div></body></html>`;
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download =
    (state.assessmentTitle || "Item_Analysis").replace(/[^a-z0-9]+/gi, "_") +
    "_Teacher_Ed_Editable.doc";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  showToast(
    "Editable Microsoft Word file downloaded. Open the .doc file in Microsoft Word to edit it.",
  );
}
function printReport() {
  saveLocal(false);
  window.print();
}
function printPlan() {
  window.print();
}

function init() {
  defaults();
  if (!loadLocal()) {
  }
  loadIntoForm();
  renderAll(false);
  [
    "schoolName",
    "teacherName",
    "gradeLevel",
    "sectionName",
    "subject",
    "quarter",
    "assessmentTitle",
    "assessmentDate",
    "schoolYear",
    "masteryThreshold",
    "nearlyThreshold",
    "easyThreshold",
    "moderateThreshold",
    "totalItems",
  ].forEach((id) => $("#" + id).addEventListener("change", () => renderAll()));
  $("#addStudentBtn").onclick = addStudent;
  $("#addItemBtn").onclick = addItem;
  $("#applyItemCount").onclick = applyItemCount;
  $("#resetBtn").onclick = reset;
  $("#demoBtn").onclick = demo;
  $("#saveBtn").onclick = () => saveLocal(true);
  $("#studentSearch").oninput = () => renderStudents();
  $("#statusFilter").onchange = () => renderStudents();
  $("#itemDifficultyFilter").onchange = () => renderItems();
  $("#profileStudent").onchange = renderProfile;
  ["reassessStudent", "preScore", "preTotal", "postScore", "postTotal"].forEach(
    (id) => $("#" + id).addEventListener("input", renderReassessment),
  );
  $("#reassessStudent").onchange = renderReassessment;
  $("#printReportBtn").onclick = printReport;
  $("#printPlanBtn").onclick = printPlan;
  $("#exportWordBtn").onclick = exportWord;
  $("#exportJsonBtn").onclick = exportJSON;
  $("#exportCsvBtn").onclick = exportCSV;
  $("#importJson").onchange = importJSON;
  $("#savePlanBtn").onclick = () => {
    saveLocal(true);
    showToast("Intervention plan saved.");
  };
  $("#resetSettingsBtn").onclick = () => {
    state.mastery = 75;
    state.nearly = 60;
    state.easy = 80;
    state.moderate = 60;
    loadIntoForm();
    renderAll();
    showToast("Thresholds reset.");
  };
  $("#navToggle").onclick = () => {
    $("#navLinks").classList.toggle("open");
    $("#navToggle").setAttribute(
      "aria-expanded",
      $("#navLinks").classList.contains("open"),
    );
  };
  $$("#navLinks a").forEach(
    (a) => (a.onclick = () => $("#navLinks").classList.remove("open")),
  );
}
init();

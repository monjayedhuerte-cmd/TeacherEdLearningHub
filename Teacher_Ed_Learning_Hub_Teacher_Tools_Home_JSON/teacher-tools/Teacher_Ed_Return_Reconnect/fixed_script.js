(() => {
  "use strict";

  const KEY = "teacherEdReturnReconnect";
  const DEFAULT = {
    grade: "Grade 1",
    subject: "Mathematics",
    energy: "Medium",
    time: "20",
    completed: [],
    games: [],
    stars: 0,
    badges: [],
    wellness: "",
    reflection: {},
    readiness: "",
    skill: null,
    goal: "",
    sessionGame: "",
  };

  const GAMES = [
    {
      id: "teacher",
      name: "Teacher Says",
      desc: "Build listening, attention, and classroom readiness.",
      min: 5,
      energy: "Medium",
      setting: "Classroom",
      purpose: ["Movement", "Reconnect"],
      grades: [1, 2, 3, 4, 5, 6],
      materials: "None",
      how: "Give simple movement commands. Learners act only when the instruction begins with “Teacher says.” Finish with a familiar routine command.",
    },
    {
      id: "move",
      name: "Move If...",
      desc: "Reconnect learners through safe movement and shared experiences.",
      min: 5,
      energy: "Medium",
      setting: "Classroom",
      purpose: ["Reconnect", "Movement"],
      grades: [1, 2, 3, 4, 5, 6],
      materials: "None",
      how: "Call out safe statements such as “Move if you like reading.” Learners make a small agreed movement if it applies.",
    },
    {
      id: "feel",
      name: "Feelings Corners",
      desc: "Give learners a simple emotional check-in.",
      min: 5,
      energy: "Low",
      setting: "Classroom",
      purpose: ["Reconnect", "Confidence"],
      grades: [1, 2, 3, 4, 5, 6],
      materials: "Corner labels",
      how: "Label areas with feelings. Learners choose privately or with a gesture. Acknowledge every feeling without ranking.",
    },
    {
      id: "find",
      name: "Find Someone Who...",
      desc: "Rebuild peer connection after an absence or break.",
      min: 10,
      energy: "Medium",
      setting: "Classroom",
      purpose: ["Reconnect", "Teamwork"],
      grades: [2, 3, 4, 5, 6],
      materials: "Optional prompt sheet",
      how: "Use safe prompts such as “Find someone who likes drawing.” Learners talk briefly and share one positive discovery.",
    },
    {
      id: "mystery",
      name: "Mystery Object",
      desc: "Spark curiosity, observation, and speaking.",
      min: 10,
      energy: "Low",
      setting: "Classroom",
      purpose: ["Reconnect", "Confidence"],
      grades: [1, 2, 3, 4, 5, 6],
      materials: "One classroom object",
      how: "Hide an ordinary classroom object. Give clues one at a time. Learners guess and explain their thinking.",
    },
    {
      id: "memory",
      name: "Memory Chain",
      desc: "Warm up memory, listening, and classroom language.",
      min: 5,
      energy: "Low",
      setting: "Classroom",
      purpose: ["Reconnect", "Confidence"],
      grades: [1, 2, 3, 4, 5, 6],
      materials: "None",
      how: "One learner shares a safe favorite classroom activity. The next repeats and adds their own. Use pictures for younger learners.",
    },
    {
      id: "freeze",
      name: "Freeze & Go",
      desc: "Practice self-control, listening, and movement.",
      min: 5,
      energy: "High",
      setting: "Indoor",
      purpose: ["Movement", "Reconnect"],
      grades: [1, 2, 3, 4],
      materials: "None",
      how: "Learners move safely on “Go” and freeze on “Freeze.” Clear the movement area first.",
    },
    {
      id: "goal",
      name: "My Goal Toss",
      desc: "Turn a new term into positive goal setting.",
      min: 10,
      energy: "Medium",
      setting: "Classroom",
      purpose: ["Goal Setting", "Confidence"],
      grades: [1, 2, 3, 4, 5, 6],
      materials: "Soft ball or paper ball",
      how: "Learner names one thing to improve. Gently pass a soft object and celebrate realistic goals without comparison.",
    },
    {
      id: "treasure",
      name: "Learning Treasure Hunt",
      desc: "Reconnect while revisiting familiar classroom or subject ideas.",
      min: 15,
      energy: "High",
      setting: "Indoor",
      purpose: ["Movement", "Review", "Teamwork"],
      grades: [2, 3, 4, 5, 6],
      materials: "Clue cards",
      how: "Place safe clues around the classroom. Each clue leads to a simple task. Keep clues accessible and avoid running.",
    },
    {
      id: "brain",
      name: "Brain Warm-Up Challenge",
      desc: "Move from easy success to moderate thinking and one gentle challenge.",
      min: 10,
      energy: "Low",
      setting: "Classroom",
      purpose: ["Review", "Confidence"],
      grades: [1, 2, 3, 4, 5, 6],
      materials: "Board or cards",
      how: "Give two easy items, two moderate items, and one gentle challenge. Do not grade it; use encouraging feedback.",
    },
  ];

  const MOODS = {
    Happy: [
      "😀",
      "That’s wonderful! Let’s use that happy energy for learning!",
    ],
    Excited: ["😄", "Awesome! Your learning adventure is about to begin!"],
    Okay: ["🙂", "That’s perfectly fine. We’ll take it one step at a time."],
    Tired: ["😴", "Thank you for telling us. Let’s start gently."],
    Worried: ["😟", "You’re not alone. Your teacher is here to help."],
    Ready: ["😎", "Fantastic! Let’s begin!"],
  };
  const STAGES = [
    ["❤️", "Check In"],
    ["🎮", "Play"],
    ["🏫", "Reset"],
    ["📝", "Reflect"],
    ["🧠", "Warm Up"],
    ["🔍", "Get Ready"],
    ["🎯", "Set Goal"],
    ["🚀", "Start Learning"],
  ];
  const ICONS = {
    teacher: "🎤",
    move: "🏃",
    feel: "❤️",
    find: "🤝",
    mystery: "🕵️",
    memory: "🧠",
    freeze: "🧊",
    goal: "🎯",
    treasure: "🗺️",
    brain: "🧠",
  };
  const $ = (id) => document.getElementById(id);
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        })[ch],
    );

  function loadState() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredClone(DEFAULT);
      const parsed = JSON.parse(raw);
      return {
        ...structuredClone(DEFAULT),
        ...(parsed && typeof parsed === "object" ? parsed : {}),
      };
    } catch (e) {
      return structuredClone(DEFAULT);
    }
  }
  let state = loadState();
  let timerId = null,
    timerSeconds = 0,
    timerTotal = 0,
    wizardStep = 0;

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
  }
  function toast(message) {
    const el = $("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 2200);
  }
  function celebrate() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    for (let i = 0; i < 18; i++) {
      const el = document.createElement("span");
      el.className = "conf";
      el.textContent = ["⭐", "✨", "🎉", "🌟", "🚀"][
        Math.floor(Math.random() * 5)
      ];
      el.style.left = Math.random() * 100 + "vw";
      el.style.animationDelay = Math.random() * 0.35 + "s";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1700);
    }
  }
  function markStage(index) {
    if (!state.completed.includes(index)) {
      state.completed.push(index);
      state.stars += 1;
    }
    save();
    renderProgress();
    renderReport();
  }
  function navigate(id) {
    const page = $(id);
    if (!page) return;
    document
      .querySelectorAll(".page")
      .forEach((p) => p.classList.toggle("active", p === page));
    document
      .querySelectorAll(".nav")
      .forEach((n) => n.classList.toggle("active", n.dataset.go === id));
    if (id === "reports") renderReport();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function renderProgress() {
    const track = $("track");
    if (!track) return;
    track.innerHTML = STAGES.map(
      (s, i) =>
        `<div class="stage ${state.completed.includes(i) ? "done" : ""}"><span>${state.completed.includes(i) ? "✓" : s[0]}</span><span>${s[1]}</span></div>`,
    ).join("");
    $("ptext").textContent = `${state.completed.length} / 8 stages`;
  }
  function setup() {
    ["grade", "subject", "energy", "time"].forEach((id) => {
      const el = $(id);
      if (!el) return;
      if (state[id]) el.value = state[id];
      el.addEventListener("change", () => {
        state[id] = el.value;
        save();
        $("saved").textContent = "Saved";
        toast("Teacher setup saved.");
      });
    });
  }
  function gameIcon(id) {
    return ICONS[id] || "🎮";
  }
  function renderGames() {
    const values = {
      grade: $("gf").value,
      energy: $("ef").value,
      setting: $("sf").value,
      time: $("tf").value,
      purpose: $("pf").value,
    };
    const grade =
      values.grade === "all" ? 0 : Number(values.grade.replace("Grade ", ""));
    const time = values.time === "all" ? 0 : Number(values.time);
    const list = GAMES.filter(
      (g) =>
        (!grade || g.grades.includes(grade)) &&
        (values.energy === "all" || g.energy === values.energy) &&
        (values.setting === "all" || g.setting === values.setting) &&
        (!time || g.min === time) &&
        (values.purpose === "all" || g.purpose.includes(values.purpose)),
    );
    const grid = $("gamegrid");
    if (!list.length) {
      grid.innerHTML =
        '<div class="card" style="grid-column:1/-1;text-align:center"><div class="big">🔎</div><h2>No exact matches</h2><p>Try changing one filter. Another adventure is waiting!</p></div>';
      return;
    }
    grid.innerHTML = list
      .map(
        (g) =>
          `<article class="card game"><div class="big">${gameIcon(g.id)}</div><h2>${esc(g.name)}</h2><p>${esc(g.desc)}</p><div class="meta"><span class="tag">${g.min} min</span><span class="tag">${esc(g.energy)}</span><span class="tag">${esc(g.setting)}</span>${g.purpose
            .slice(0, 2)
            .map((x) => `<span class="tag">${esc(x)}</span>`)
            .join(
              "",
            )}</div><details><summary>How to play</summary><p><b>Materials:</b> ${esc(g.materials)}</p><p>${esc(g.how)}</p></details><div class="game-actions"><button type="button" class="secondary use" data-game="${g.id}">Use This Game</button><button type="button" class="ghost complete" data-game="${g.id}">✓ Complete</button></div></article>`,
      )
      .join("");
    grid.querySelectorAll(".use").forEach((btn) =>
      btn.addEventListener("click", () => {
        state.sessionGame = btn.dataset.game;
        save();
        toast(
          `${GAMES.find((g) => g.id === btn.dataset.game).name} added to your session.`,
        );
        celebrate();
      }),
    );
    grid.querySelectorAll(".complete").forEach((btn) =>
      btn.addEventListener("click", () => {
        const id = btn.dataset.game;
        if (!state.games.includes(id)) state.games.push(id);
        state.stars += 1;
        state.badges = [...new Set([...state.badges, "🎮 Game Explorer"])];
        save();
        toast("Game completed! ⭐");
        celebrate();
        renderGames();
        renderReport();
      }),
    );
  }
  function randomGame() {
    const grade = Number(state.grade.replace("Grade ", ""));
    const max = Math.min(Number(state.time) || 20, 20);
    let candidates = GAMES.filter(
      (g) =>
        g.grades.includes(grade) && g.energy === state.energy && g.min <= max,
    );
    if (!candidates.length)
      candidates = GAMES.filter((g) => g.grades.includes(grade));
    const g = candidates[Math.floor(Math.random() * candidates.length)];
    if (!g) return;
    $("gf").value = state.grade;
    $("ef").value = "all";
    $("sf").value = "all";
    $("tf").value = "all";
    $("pf").value = "all";
    renderGames();
    setTimeout(() => {
      const card = [...document.querySelectorAll(".game")].find(
        (c) => c.querySelector("h2")?.textContent === g.name,
      );
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.style.outline = "4px solid var(--g)";
        setTimeout(() => (card.style.outline = ""), 1600);
      }
    }, 80);
    toast(`🎲 Try: ${g.name}`);
  }
  function clearTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }
  function fmt(sec) {
    return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
  }
  function setTimer(sec, el) {
    clearTimer();
    timerSeconds = sec;
    timerTotal = sec;
    if (el) el.textContent = fmt(sec);
  }
  function startTimer(el) {
    if (!el) return;
    if (timerSeconds <= 0) timerSeconds = timerTotal;
    clearTimer();
    el.textContent = fmt(timerSeconds);
    timerId = setInterval(() => {
      timerSeconds = Math.max(0, timerSeconds - 1);
      el.textContent = fmt(timerSeconds);
      if (timerSeconds === 0) {
        clearTimer();
        toast("⏰ Time’s up!");
        celebrate();
      }
    }, 1000);
  }
  const WIZARD = [
    { title: "❤️ How are you feeling today?", type: "mood" },
    { title: "🎮 Movement Game", type: "movement" },
    { title: "🤝 Reconnection Game", type: "reconnect" },
    { title: "🧠 Subject Brain Warm-Up", type: "warmup" },
    { title: "🎯 Learning Goal", type: "goal" },
  ];
  function startMission() {
    wizardStep = 0;
    $("sessionStart").classList.add("hidden");
    $("wizard").classList.remove("hidden");
    navigate("session");
    renderWizard();
  }
  function renderWizard() {
    clearTimer();
    const s = WIZARD[wizardStep];
    const pct = (wizardStep / WIZARD.length) * 100;
    $("wizard").innerHTML =
      `<div class="section-head"><div><span class="ey">Welcome Back Mission</span><h2>${s.title}</h2></div><b>Step ${wizardStep + 1} of ${WIZARD.length}</b></div><div class="wbar"><i style="width:${pct}%"></i></div><div id="wc" style="text-align:center;padding:18px"></div><div class="actions" style="justify-content:center"><button type="button" class="ghost" id="skip">Skip</button><button type="button" class="secondary" id="next">${wizardStep === WIZARD.length - 1 ? "Finish Mission" : "Next Activity →"}</button></div>`;
    const c = $("wc");
    if (s.type === "mood") {
      c.innerHTML = `<p>Choose a feeling. There is no wrong answer.</p><div class="moods">${Object.entries(
        MOODS,
      )
        .map(
          ([k, v]) =>
            `<button type="button" class="mood ${state.wellness === k ? "sel" : ""}" data-mood="${k}">${v[0]}<span>${k}</span></button>`,
        )
        .join(
          "",
        )}</div><div id="mm" class="notice ${state.wellness ? "" : "hidden"}">${state.wellness ? esc(MOODS[state.wellness][1]) : ""}</div>`;
      c.querySelectorAll(".mood").forEach((b) =>
        b.addEventListener("click", () => {
          state.wellness = b.dataset.mood;
          save();
          markStage(0);
          c.querySelectorAll(".mood").forEach((x) => x.classList.remove("sel"));
          b.classList.add("sel");
          $("mm").textContent = MOODS[state.wellness][1];
          $("mm").classList.remove("hidden");
          toast("Thank you for checking in.");
        }),
      );
    } else if (s.type === "movement" || s.type === "reconnect") {
      const purpose = s.type === "movement" ? "Movement" : "Reconnect",
        grade = Number(state.grade.replace("Grade ", ""));
      let candidates = GAMES.filter(
        (g) =>
          g.purpose.includes(purpose) &&
          g.grades.includes(grade) &&
          g.energy === state.energy,
      );
      if (!candidates.length)
        candidates = GAMES.filter(
          (g) => g.purpose.includes(purpose) && g.grades.includes(grade),
        );
      const g =
        candidates[Math.floor(Math.random() * candidates.length)] || GAMES[0];
      c.innerHTML = `<div class="big">${gameIcon(g.id)}</div><h2>${esc(g.name)}</h2><p>${esc(g.desc)}</p><details open><summary>Instructions</summary><p>${esc(g.how)}</p></details><div class="timer" id="tm">${g.min}:00</div><div class="actions" style="justify-content:center"><button type="button" class="secondary" id="ts">▶ Start</button><button type="button" class="ghost" id="tp">⏸ Pause</button><button type="button" class="ghost" id="tr">↻ Reset</button></div>`;
      markStage(s.type === "movement" ? 1 : 2);
      setTimer(g.min * 60, $("tm"));
      $("ts").addEventListener("click", () => startTimer($("tm")));
      $("tp").addEventListener("click", () => {
        clearTimer();
        toast("Timer paused.");
      });
      $("tr").addEventListener("click", () => {
        setTimer(g.min * 60, $("tm"));
        toast("Timer reset.");
      });
    } else if (s.type === "warmup") {
      c.innerHTML = `<p>Not graded. Wake up the <b>${esc(state.subject)}</b> brain.</p><div class="meta" style="justify-content:center"><span class="tag">🟢 Easy</span><span class="tag">🟡 Moderate</span><span class="tag">🔵 Challenge</span></div><p>Use two easy questions, two moderate questions, and one gentle challenge from previous learning.</p><button type="button" class="primary" id="wd">🧠 Brain Warm-Up Complete</button>`;
      $("wd").addEventListener("click", () => {
        markStage(4);
        toast("Brain warm-up complete!");
        celebrate();
      });
    } else {
      c.innerHTML = `<p>Choose one realistic next step for ${esc(state.subject)}.</p><div id="sg" class="goals" style="justify-content:center"></div><label class="field" style="max-width:560px;margin:16px auto;text-align:left">Goal<input id="sginput" value="${esc(state.goal)}" placeholder="My goal is to..."></label>`;
      $("sg").innerHTML = [
        "Reading",
        "Mathematics",
        "Writing",
        "Science",
        "Speaking",
        "Problem Solving",
      ]
        .map((x) => `<button type="button" data-g="${x}">${x}</button>`)
        .join("");
      $("sg")
        .querySelectorAll("button")
        .forEach((b) =>
          b.addEventListener("click", () => {
            $("sginput").value =
              `Improve my ${b.dataset.g.toLowerCase()} skills.`;
          }),
        );
    }
    $("skip").addEventListener("click", () => {
      clearTimer();
      wizardStep++;
      if (wizardStep < WIZARD.length) renderWizard();
      else finishMission();
    });
    $("next").addEventListener("click", () => {
      clearTimer();
      if (s.type === "goal") {
        const g = $("sginput")?.value.trim();
        if (g) {
          state.goal = g;
          markStage(6);
        }
      }
      wizardStep++;
      if (wizardStep < WIZARD.length) renderWizard();
      else finishMission();
    });
  }
  function finishMission() {
    clearTimer();
    for (let i = 0; i < 8; i++) markStage(i);
    state.badges = [
      ...new Set([
        ...state.badges,
        "🌟 Welcome Back Star",
        "🏆 Learning Explorer",
      ]),
    ];
    save();
    $("wizard").innerHTML =
      `<div style="text-align:center;padding:25px"><div class="big">🎉</div><h2>WELCOME BACK MISSION COMPLETE!</h2><p>Your learning adventure continues!</p><div class="notice">⭐ ${state.stars} stars • 🎮 ${state.games.length} games completed • 🎯 ${state.goal ? "Goal created" : "Goal available"}</div><div class="actions" style="justify-content:center;margin-top:15px"><button type="button" class="primary" id="gl">🚀 Start My Lesson</button><button type="button" class="secondary" id="gr">📊 View Teacher Report</button></div></div>`;
    $("gl").addEventListener("click", () => navigate("launch"));
    $("gr").addEventListener("click", () => navigate("reports"));
    celebrate();
    renderProgress();
  }
  function bindReflection() {
    [1, 2, 3, 4, 5].forEach((i) => {
      const el = $("r" + i);
      el.value = state.reflection?.["r" + i] || "";
    });
    $("reflectionForm").addEventListener("submit", (e) => {
      e.preventDefault();
      state.reflection = {};
      [1, 2, 3, 4, 5].forEach(
        (i) => (state.reflection["r" + i] = $("r" + i).value.trim()),
      );
      markStage(3);
      save();
      $("rsaved").classList.remove("hidden");
      toast("Reflection saved locally.");
      celebrate();
    });
  }
  const READINESS_TEXT = {
    READY: "Ready to begin the new lesson.",
    "ALMOST READY": "Needs a short warm-up before new learning.",
    "NEEDS PRACTICE": "Needs targeted review or a bridge activity.",
    "READY FOR A CHALLENGE": "Ready for extension or deeper thinking.",
  };
  const REC = {
    Mastered: "Review briefly, then proceed or offer extension.",
    Developing: "Use a short bridge activity and guided practice.",
    "Needs Support":
      "Provide targeted prerequisite practice before the new lesson.",
  };
  function updateReadinessDisplay() {
    const r = state.readiness;
    if (!r) return;
    $("rl").textContent = r;
    $("rd").textContent = READINESS_TEXT[r];
    $("rm").style.width =
      r === "READY FOR A CHALLENGE"
        ? "100%"
        : r === "READY"
          ? "82%"
          : r === "ALMOST READY"
            ? "60%"
            : "38%";
  }
  function bindReadiness() {
    const opts = [
      ["🟢", "READY"],
      ["🟡", "ALMOST READY"],
      ["🟠", "NEEDS PRACTICE"],
      ["🔵", "READY FOR A CHALLENGE"],
    ];
    $("readyopts").innerHTML = opts
      .map(
        (x) =>
          `<button type="button" class="readybtn ${state.readiness === x[1] ? "sel" : ""}" data-r="${x[1]}">${x[0]} <b>${x[1]}</b><span>${READINESS_TEXT[x[1]]}</span></button>`,
      )
      .join("");
    $("readyopts")
      .querySelectorAll(".readybtn")
      .forEach((b) =>
        b.addEventListener("click", () => {
          state.readiness = b.dataset.r;
          markStage(5);
          save();
          bindReadiness();
          updateReadinessDisplay();
          toast(`Readiness: ${state.readiness}`);
        }),
      );
    if (state.skill) {
      $("skill").value = state.skill.name;
      $("skillStatus").value = state.skill.status;
      $("rec").textContent = REC[state.skill.status] || "";
      $("rec").classList.remove("hidden");
    }
    updateReadinessDisplay();
  }
  function bindGoals() {
    const choices = [
      "Reading",
      "Mathematics",
      "Writing",
      "Science",
      "Speaking",
      "Problem Solving",
      "Working with Others",
    ];
    $("goals").innerHTML = choices
      .map((x) => `<button type="button" data-g="${x}">${x}</button>`)
      .join("");
    $("goals")
      .querySelectorAll("button")
      .forEach((b) =>
        b.addEventListener("click", () => {
          $("goalInput").value =
            `My goal is to improve my ${b.dataset.g.toLowerCase()} skills.`;
          $("goals")
            .querySelectorAll("button")
            .forEach((x) => x.classList.remove("sel"));
          b.classList.add("sel");
        }),
      );
    if (state.goal) {
      $("goalInput").value = state.goal;
      $("goalText").textContent = state.goal;
    }
    $("goalForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const g = $("goalInput").value.trim();
      if (!g) {
        toast("Please write or choose a learning goal.");
        return;
      }
      state.goal = g;
      markStage(6);
      $("goalText").textContent = g;
      save();
      toast("🎯 Goal set!");
      celebrate();
    });
  }
  function renderReport() {
    if (!$("report")) return;
    const games =
      state.games
        .map((id) => GAMES.find((g) => g.id === id)?.name || id)
        .join(", ") || "None recorded";
    const refl =
      Object.values(state.reflection || {})
        .filter(Boolean)
        .map(esc)
        .join("<br>") || "Not recorded";
    $("report").innerHTML =
      `<h2>Session Summary</h2><table><tr><th>Date</th><td>${esc(new Date().toLocaleDateString())}</td></tr><tr><th>Grade</th><td>${esc(state.grade)}</td></tr><tr><th>Subject</th><td>${esc(state.subject)}</td></tr><tr><th>Stages</th><td>${state.completed.length}/8</td></tr><tr><th>Stars</th><td>${state.stars}</td></tr><tr><th>Badges</th><td>${state.badges.map(esc).join(" • ") || "None yet"}</td></tr><tr><th>Well-being</th><td>${esc(state.wellness || "Not recorded")}</td></tr><tr><th>Games</th><td>${esc(games)}</td></tr><tr><th>Readiness</th><td>${esc(state.readiness || "Not recorded")}</td></tr><tr><th>Prerequisite skill</th><td>${state.skill ? esc(state.skill.name) + " — " + esc(state.skill.status) : "Not recorded"}</td></tr><tr><th>Learning goal</th><td>${esc(state.goal || "Not recorded")}</td></tr><tr><th>Reflection</th><td>${refl}</td></tr></table>`;
  }
  function downloadFile(content, name, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }
  function bindReports() {
    $("print").addEventListener("click", () => {
      renderReport();
      window.print();
    });
    $("csv").addEventListener("click", () => {
      const rows = [
        ["Field", "Value"],
        ["Date", new Date().toLocaleDateString()],
        ["Grade", state.grade],
        ["Subject", state.subject],
        ["Stages", state.completed.length + "/8"],
        ["Stars", state.stars],
        ["Well-being", state.wellness || ""],
        ["Readiness", state.readiness || ""],
        ["Learning goal", state.goal || ""],
      ];
      downloadFile(
        rows
          .map((r) =>
            r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
          )
          .join("\r\n"),
        "teacher-ed-return-reconnect-report.csv",
        "text/csv",
      );
      toast("CSV report downloaded.");
    });
    $("doc").addEventListener("click", () => {
      downloadFile(
        `<html><meta charset="utf-8"><body><h1>Teacher Ed Learning Hub</h1><h2>Return &amp; Reconnect Report</h2><p>Date: ${esc(new Date().toLocaleDateString())}</p><p>Grade: ${esc(state.grade)}<br>Subject: ${esc(state.subject)}</p><table border="1" cellpadding="6"><tr><th>Field</th><th>Value</th></tr><tr><td>Stages</td><td>${state.completed.length}/8</td></tr><tr><td>Stars</td><td>${state.stars}</td></tr><tr><td>Well-being</td><td>${esc(state.wellness || "Not recorded")}</td></tr><tr><td>Readiness</td><td>${esc(state.readiness || "Not recorded")}</td></tr><tr><td>Learning Goal</td><td>${esc(state.goal || "Not recorded")}</td></tr></table><p><b>Teacher Tip:</b> Focus on growth and specific skills that need practice.</p></body></html>`,
        "teacher-ed-return-reconnect-report.doc",
        "application/msword",
      );
      toast("Word-compatible report downloaded.");
    });
    $("backup").addEventListener("click", () => {
      downloadFile(
        JSON.stringify(state, null, 2),
        "teacher-ed-return-reconnect-backup.json",
        "application/json",
      );
      toast("Backup exported.");
    });
    $("restore").addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const x = JSON.parse(reader.result);
          if (!x || !Array.isArray(x.completed)) throw new Error("invalid");
          state = { ...structuredClone(DEFAULT), ...x };
          save();
          location.reload();
        } catch (err) {
          toast("That backup file is not valid.");
        }
      };
      reader.readAsText(file);
    });
    $("clear").addEventListener("click", () => {
      if (
        window.confirm(
          "Clear all Return & Reconnect data stored on this device?",
        )
      ) {
        try {
          localStorage.removeItem(KEY);
        } catch (e) {}
        location.reload();
      }
    });
  }
  function bindLaunch() {
    $("warm").addEventListener("click", () => {
      navigate("games");
      $("pf").value = "Review";
      renderGames();
      toast("Choose a Brain Warm-Up game.");
    });
    $("bridge").addEventListener("click", () => {
      $("launchOut").classList.remove("hidden");
      $("launchOut").innerHTML =
        '<div class="notice">🌱 <b>Bridge Activity Plan</b><br>1. Identify the prerequisite skill.<br>2. Model one example.<br>3. Give guided practice.<br>4. Let learners try independently.<br>5. Recheck the skill before moving forward.</div>';
    });
    $("newlesson").addEventListener("click", () => {
      markStage(7);
      $("launchOut").classList.remove("hidden");
      $("launchOut").innerHTML =
        `<div class="notice">🚀 <b>Lesson Launch Ready!</b><br>Grade: ${esc(state.grade)} • Subject: ${esc(state.subject)} • Readiness: ${esc(state.readiness || "Not recorded")}<br><br>Teacher reminder: start with a clear learning target and a short success experience.</div>`;
      toast("New lesson launch is ready!");
      celebrate();
    });
  }
  function bindFullscreen() {
    const btn = $("fullscreen");
    if (!btn) return;
    const update = () => {
      const on = !!document.fullscreenElement;
      btn.textContent = on ? "⛶ Exit Fullscreen" : "⛶ Fullscreen";
      btn.setAttribute(
        "aria-label",
        on ? "Exit fullscreen" : "Enter fullscreen",
      );
      document.body.classList.toggle("is-fullscreen", on);
    };
    btn.addEventListener("click", async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
      } catch (e) {
        toast("Fullscreen is not available in this browser.");
      }
    });
    document.addEventListener("fullscreenchange", update);
    update();
  }
  function boot() {
    try {
      document
        .querySelectorAll(".nav")
        .forEach((n) =>
          n.addEventListener("click", () => navigate(n.dataset.go)),
        );
      setup();
      renderProgress();
      renderGames();
      bindReflection();
      bindReadiness();
      bindGoals();
      renderReport();
      bindReports();
      bindLaunch();
      bindFullscreen();
      ["gf", "ef", "sf", "tf", "pf"].forEach((id) =>
        $(id).addEventListener("change", renderGames),
      );
      $("start").addEventListener("click", startMission);
      $("launchSession").addEventListener("click", startMission);
      $("random").addEventListener("click", randomGame);
      $("pick").addEventListener("click", () => {
        navigate("games");
        randomGame();
      });
      $("saveSkill").addEventListener("click", () => {
        const name = $("skill").value.trim();
        if (!name) {
          toast("Please enter a prerequisite skill.");
          $("skill").focus();
          return;
        }
        state.skill = { name, status: $("skillStatus").value };
        save();
        $("rec").textContent = REC[state.skill.status];
        $("rec").classList.remove("hidden");
        toast("Skill check saved.");
      });
      $("theme").addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const dark = document.body.classList.contains("dark");
        try {
          localStorage.setItem("teacherEdTheme", dark ? "dark" : "light");
        } catch (e) {}
        $("theme").textContent = dark ? "☀️" : "🌙";
      });
      try {
        if (localStorage.getItem("teacherEdTheme") === "dark") {
          document.body.classList.add("dark");
          $("theme").textContent = "☀️";
        }
      } catch (e) {}
    } catch (err) {
      console.error("Teacher Ed Learning Hub boot error:", err);
      toast("The module had a startup issue. Please refresh the page.");
    }
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

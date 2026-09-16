"use strict";
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
const state = {
  sound: true,
  challenge: [],
  chIndex: 0,
  chScore: 0,
  chMissed: [],
  guidedIndex: 0,
  practiceIndex: 0,
  practiceScore: 0,
  gameScore: 0,
  memory: { first: null, lock: false, matched: 0 },
  best: Number(localStorage.getItem("science1_l8_best") || 0),
};
function beep(ok = true) {
  if (!state.sound) return;
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    const c = new C(),
      o = c.createOscillator(),
      g = c.createGain();
    o.frequency.value = ok ? 660 : 220;
    o.type = "sine";
    g.gain.value = 0.05;
    o.connect(g);
    g.connect(c.destination);
    o.start();
    o.stop(c.currentTime + 0.12);
  } catch (e) {}
}
function show(id) {
  $$(".screen").forEach((x) => x.classList.remove("active"));
  const el = $("#" + id);
  if (el) el.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
$$("[data-go]").forEach((b) =>
  b.addEventListener("click", () => show(b.dataset.go)),
);
$("#soundBtn").addEventListener("click", () => {
  state.sound = !state.sound;
  $("#soundBtn").textContent = state.sound ? "🔊" : "🔇";
});
$("#resetBtn").addEventListener("click", () => {
  if (confirm("Reset your saved best score and start over?")) {
    localStorage.removeItem("science1_l8_best");
    location.reload();
  }
});
$$(".reveal").forEach((b) =>
  b.addEventListener("click", () => {
    b.nextElementSibling.textContent = "⭐ " + b.dataset.answer;
    b.disabled = true;
  }),
);
$$(".quick").forEach((b) =>
  b.addEventListener("click", () => {
    const ok = b.dataset.correct === "true";
    $$(".quick").forEach((x) => x.classList.remove("correct", "wrong"));
    b.classList.add(ok ? "correct" : "wrong");
    $("#quickFeedback").textContent = ok
      ? "🎉 Excellent! The nose helps you smell."
      : "💡 Think about the organ that detects smells.";
    beep(ok);
  }),
);

const models = {
  eat: {
    title: "🍎 Eating a meal",
    intro: "Several sense organs work as a team when you eat.",
    steps: [
      ["1 • Eyes", "Your eyes see the color and shape of the food."],
      ["2 • Nose", "Your nose smells the food."],
      ["3 • Tongue", "Your tongue tastes the food."],
    ],
  },
  safe: {
    title: "🚦 Crossing the street safely",
    intro: "Your senses help you notice vehicles and warning signals.",
    steps: [
      ["1 • Eyes", "Your eyes see cars, buses, and other vehicles."],
      ["2 • Ears", "Your ears hear the sounds vehicles make."],
      ["3 • Teamwork", "Eyes and ears work together to help keep you safe."],
    ],
  },
  food: {
    title: "🍲 Cooking",
    intro: "A cook uses several senses while preparing food.",
    steps: [
      ["1 • Skin", "Skin can feel the ingredients and objects being handled."],
      ["2 • Nose", "The nose smells the aroma of the food."],
      ["3 • Tongue", "The tongue tastes the food."],
    ],
  },
  birds: {
    title: "🦜 Receiving a gift",
    intro:
      "When you receive a bird from a friend, different senses help you notice it.",
    steps: [
      ["1 • Eyes", "Your eyes see its colors and shapes."],
      ["2 • Skin", "Your hand feels its feathers."],
      ["3 • Ears", "Your ears listen to the sounds it makes."],
    ],
  },
};
function renderModel(k) {
  const m = models[k];
  $("#modelBox").innerHTML =
    `<h3>${m.title}</h3><p>${m.intro}</p><div class="model-steps">${m.steps.map((s) => `<div class="step"><strong>${s[0]}</strong><span>${s[1]}</span></div>`).join("")}</div><div class="tip"><b>Teacher thought:</b> Ask yourself, “What does each sense organ help me notice?”</div>`;
}
$$(".tab").forEach((t) =>
  t.addEventListener("click", () => {
    $$(".tab").forEach((x) => x.classList.remove("active"));
    t.classList.add("active");
    renderModel(t.dataset.model);
  }),
);
renderModel("eat");

const guided = [
  {
    q: "You are eating a slice of fruit. Which three sense organs can work together?",
    a: ["Eyes + Nose + Tongue", "Ears + Skin + Eyes", "Nose + Ears + Skin"],
    c: 0,
    h: "Think: Which organs help you see, smell, and taste food?",
  },
  {
    q: "You are crossing a street. Which two sense organs help you notice vehicles and their sounds?",
    a: ["Eyes + Ears", "Nose + Tongue", "Skin + Tongue"],
    c: 0,
    h: "One organ sees. The other hears.",
  },
  {
    q: "You touch a soft cloth while looking at its color. Which two sense organs are working?",
    a: ["Eyes + Skin", "Nose + Tongue", "Ears + Nose"],
    c: 0,
    h: "One organ helps you see. One helps you feel.",
  },
  {
    q: "You smell smoke and look around to find where it is coming from. Which two senses work together?",
    a: ["Nose + Eyes", "Tongue + Skin", "Ears + Tongue"],
    c: 0,
    h: "One sense detects the smell. Another helps you look.",
  },
  {
    q: "You listen to music while watching a dance. Which two sense organs are especially useful?",
    a: ["Ears + Eyes", "Nose + Tongue", "Skin + Nose"],
    c: 0,
    h: "One organ hears music. One sees the dance.",
  },
];
function renderGuided() {
  const q = guided[state.guidedIndex];
  $("#guidedCount").textContent = `${state.guidedIndex + 1} / ${guided.length}`;
  $("#guidedBar").style.width = `${(state.guidedIndex / guided.length) * 100}%`;
  $("#guidedNext").disabled = true;
  $("#guidedBox").innerHTML =
    `<div class="question">${q.q}</div><div class="choice-row" style="margin-top:18px">${q.a.map((x, i) => `<button class="choice guided-choice" data-i="${i}">${x}</button>`).join("")}</div><button class="hint-btn" id="guidedHint">💡 Hint</button><div class="hint" id="guidedHintBox">${q.h}</div><div id="guidedFeedback" class="feedback" style="margin-top:14px"></div>`;
  $$(".guided-choice").forEach((b) =>
    b.addEventListener("click", () => {
      const ok = +b.dataset.i === q.c;
      $$(".guided-choice").forEach((x) =>
        x.classList.remove("correct", "wrong"),
      );
      b.classList.add(ok ? "correct" : "wrong");
      $("#guidedFeedback").textContent = ok
        ? "🎉 That’s right! Let’s keep thinking."
        : "💡 Let’s think again. Use the hint and look for the senses described.";
      $("#guidedNext").disabled = false;
      beep(ok);
    }),
  );
  $("#guidedHint").addEventListener("click", () =>
    $("#guidedHintBox").classList.toggle("show"),
  );
}
$("#guidedNext").addEventListener("click", () => {
  state.guidedIndex++;
  if (state.guidedIndex >= guided.length) {
    state.guidedIndex = 0;
    show("practice");
    renderPractice();
  } else renderGuided();
});
renderGuided();

const practice = [
  {
    q: "Which sense organ helps you read a book?",
    a: ["Eyes", "Nose", "Tongue"],
    c: 0,
    h: "You use this organ to see words.",
  },
  {
    q: "Which sense organ helps you hear a warning sound?",
    a: ["Skin", "Ears", "Eyes"],
    c: 1,
    h: "Think about the organ used for hearing.",
  },
  {
    q: "Which sense organ helps you smell the aroma of food?",
    a: ["Nose", "Ears", "Skin"],
    c: 0,
    h: "You smell when you breathe.",
  },
  {
    q: "Which sense organ helps you taste sweet, sour, salty, or bitter food?",
    a: ["Tongue", "Eyes", "Ears"],
    c: 0,
    h: "Taste happens with this organ.",
  },
  {
    q: "Which sense organ helps you feel whether something is rough or smooth?",
    a: ["Nose", "Skin", "Tongue"],
    c: 1,
    h: "Touch is sensed by this organ.",
  },
  {
    q: "You see a bus and hear its horn while crossing. Which two organs are working together?",
    a: ["Eyes + Ears", "Nose + Tongue", "Skin + Tongue"],
    c: 0,
    h: "One sees the bus; one hears the horn.",
  },
  {
    q: "You hold a pineapple and look at its shape. Which two organs help?",
    a: ["Eyes + Skin", "Ears + Nose", "Tongue + Ears"],
    c: 0,
    h: "You see the shape and feel the surface.",
  },
  {
    q: "You smell a meal before tasting it. Which two organs are involved?",
    a: ["Nose + Tongue", "Eyes + Ears", "Skin + Ears"],
    c: 0,
    h: "One smells; one tastes.",
  },
];
function renderPractice() {
  const q = practice[state.practiceIndex];
  $("#practiceCount").textContent =
    `${state.practiceIndex + 1} / ${practice.length}`;
  $("#practiceBar").style.width =
    `${(state.practiceIndex / practice.length) * 100}%`;
  $("#practiceNext").disabled = true;
  $("#practiceBox").innerHTML =
    `<div class="question">${q.q}</div><div class="choice-row" style="margin-top:18px">${q.a.map((x, i) => `<button class="choice p-choice" data-i="${i}">${x}</button>`).join("")}</div><button class="hint-btn" id="pHint">💡 Hint</button><div class="hint" id="pHintBox">${q.h}</div><div id="pFeedback" class="feedback" style="margin-top:14px"></div>`;
  $$(".p-choice").forEach((b) =>
    b.addEventListener("click", () => {
      const ok = +b.dataset.i === q.c;
      $$(".p-choice").forEach((x) => x.classList.remove("correct", "wrong"));
      b.classList.add(ok ? "correct" : "wrong");
      $("#pFeedback").textContent = ok
        ? "⭐ Great job!"
        : "💡 Let’s try that idea again. Look at the clue in the question.";
      $("#practiceNext").disabled = false;
      beep(ok);
    }),
  );
  $("#pHint").addEventListener("click", () =>
    $("#pHintBox").classList.toggle("show"),
  );
}
$("#practiceNext").addEventListener("click", () => {
  state.practiceIndex++;
  if (state.practiceIndex >= practice.length) {
    state.practiceIndex = 0;
    show("games");
    renderGame("match");
  } else renderPractice();
});
renderPractice();

const matchItems = [
  ["Eating", "Eyes + Nose + Tongue"],
  ["Reading", "Eyes"],
  ["Crossing a street", "Eyes + Ears"],
  ["Feeling cloth", "Skin"],
  ["Smelling smoke", "Nose"],
];
const findItems = [
  {
    q: "A child looks at the color of a gift. Which organ?",
    a: ["Eyes", "Ears", "Skin"],
    c: 0,
  },
  {
    q: "A child listens to the sound of birds. Which organ?",
    a: ["Tongue", "Ears", "Nose"],
    c: 1,
  },
  {
    q: "A child smells smoke. Which organ?",
    a: ["Nose", "Eyes", "Skin"],
    c: 0,
  },
  {
    q: "A child tastes a lemon. Which organ?",
    a: ["Ears", "Tongue", "Eyes"],
    c: 1,
  },
  {
    q: "A child feels a rough surface. Which organ?",
    a: ["Skin", "Nose", "Tongue"],
    c: 0,
  },
];
function renderGame(type) {
  $$(".game-tile").forEach((x) =>
    x.classList.toggle("active", x.dataset.game === type),
  );
  const area = $("#gameArea");
  if (type === "match") {
    let idx = 0;
    area.innerHTML = `<div class="game-question">🧩 Match It: Which senses are used for <span id="matchAct">${matchItems[0][0]}</span>?</div><div class="game-grid">${["Eyes", "Ears", "Nose", "Tongue", "Skin"].map((x) => `<button class="choice gmatch" data-v="${x}">${x}</button>`).join("")}</div><p class="tiny-note">Tap all sense organs that belong. Then tap Next.</p><button class="primary" id="matchNext" disabled>Next Activity</button><div id="matchFeed" class="feedback"></div>`;
    let selected = new Set();
    function load() {
      selected.clear();
      $$(".gmatch").forEach((b) => {
        b.classList.remove("selected", "correct", "wrong");
      });
      $("#matchAct").textContent = matchItems[idx][0];
      $("#matchNext").disabled = true;
    }
    $$(".gmatch").forEach((b) =>
      b.addEventListener("click", () => {
        const v = b.dataset.v;
        selected.has(v)
          ? (selected.delete(v), b.classList.remove("selected"))
          : (selected.add(v), b.classList.add("selected"));
        $("#matchNext").disabled = false;
      }),
    );
    $("#matchNext").addEventListener("click", () => {
      const need = matchItems[idx][1].split(" + ");
      const ok =
        need.length === selected.size && need.every((x) => selected.has(x));
      $("#matchFeed").textContent = ok
        ? "🎉 Perfect match!"
        : "💡 Check which senses are described by the activity.";
      beep(ok);
      if (ok) {
        idx++;
        if (idx >= matchItems.length) {
          $("#gameArea").innerHTML =
            `<div class="results-card" style="box-shadow:none;border:0;margin:0"><div class="celebrate">🏆</div><h3>Match It Complete!</h3><p>You connected activities with the senses that help.</p></div>`;
        } else load();
      }
    });
    return;
  }
  if (type === "find") {
    let idx = 0;
    function draw() {
      const q = findItems[idx];
      area.innerHTML = `<div class="game-question">🔎 Find It: ${q.q}</div><div class="choice-row">${q.a.map((x, i) => `<button class="choice find-choice" data-i="${i}">${x}</button>`).join("")}</div><div id="findFeed" class="feedback" style="margin-top:14px"></div>`;
      $$(".find-choice").forEach((b) =>
        b.addEventListener("click", () => {
          const ok = +b.dataset.i === q.c;
          b.classList.add(ok ? "correct" : "wrong");
          $("#findFeed").textContent = ok
            ? "🌟 You found it!"
            : "💡 Try again. Think about the sense described.";
          beep(ok);
          if (ok)
            setTimeout(() => {
              idx++;
              if (idx < findItems.length) draw();
              else
                area.innerHTML =
                  '<div class="results-card" style="box-shadow:none;border:0;margin:0"><div class="celebrate">🎯</div><h3>Find It Complete!</h3><p>Excellent sense-organ detective work.</p></div>';
            }, 350);
        }),
      );
    }
    draw();
    return;
  }
  if (type === "sort") {
    area.innerHTML = `<div class="game-question">🗂️ Sort It: Which job belongs to each sense organ?</div><div class="game-grid">${[
      ["Eyes", "see"],
      ["Ears", "hear"],
      ["Nose", "smell"],
      ["Tongue", "taste"],
      ["Skin", "feel"],
    ]
      .map(
        (x, i) =>
          `<button class="choice sort-choice" data-i="${i}">${x[0]} → ${x[1]}</button>`,
      )
      .join(
        "",
      )}</div><div id="sortFeed" class="feedback" style="margin-top:14px"></div>`;
    let clicked = new Set();
    $$(".sort-choice").forEach((b) =>
      b.addEventListener("click", () => {
        clicked.add(+b.dataset.i);
        b.classList.add("correct");
        $("#sortFeed").textContent =
          clicked.size === 5
            ? "🎉 All sorted correctly!"
            : "Keep going—find all five jobs.";
        beep(true);
      }),
    );
    return;
  }
  if (type === "memory") {
    const pairs = [
      ["👀", "SEE"],
      ["👂", "HEAR"],
      ["👃", "SMELL"],
      ["👅", "TASTE"],
      ["🖐️", "FEEL"],
      ["📖", "BOOK"],
    ];
    const cards = [...pairs, ...pairs].sort(() => Math.random() - 0.5);
    let first = null,
      lock = false,
      matched = 0;
    area.innerHTML = `<div class="game-question">🧠 Memory Match: Find the matching picture and word.</div><div class="memory-grid">${cards.map((x, i) => `<button class="memory-card" data-i="${i}" data-key="${x[1]}">❓</button>`).join("")}</div><div id="memFeed" class="feedback" style="margin-top:14px"></div>`;
    const els = $$(".memory-card");
    els.forEach((card) =>
      card.addEventListener("click", () => {
        if (lock || card.classList.contains("flipped")) return;
        card.classList.add("flipped");
        card.textContent =
          cards[+card.dataset.i][0] + " " + cards[+card.dataset.i][1];
        if (first === null) {
          first = card;
          return;
        }
        lock = true;
        const same = first.dataset.key === card.dataset.key && first !== card;
        if (same) {
          matched += 2;
          first = null;
          lock = false;
          beep(true);
          if (matched === cards.length)
            $("#memFeed").textContent =
              "🏆 Memory Master! You found every pair.";
        } else {
          beep(false);
          setTimeout(() => {
            first.classList.remove("flipped");
            card.classList.remove("flipped");
            first.textContent = "❓";
            card.textContent = "❓";
            first = null;
            lock = false;
          }, 650);
        }
      }),
    );
  }
}
$$(".game-tile").forEach((b) =>
  b.addEventListener("click", () => renderGame(b.dataset.game)),
);
renderGame("match");

const challenge = [
  [
    "Which sense organ helps you see the shape of a fruit?",
    ["Eyes", "Ears", "Nose"],
    0,
  ],
  [
    "Which sense organ helps you hear a vehicle horn?",
    ["Tongue", "Ears", "Skin"],
    1,
  ],
  ["Which sense organ helps you smell food?", ["Nose", "Eyes", "Skin"], 0],
  ["Which sense organ helps you taste food?", ["Tongue", "Ears", "Eyes"], 0],
  [
    "Which sense organ helps you feel a rough fruit peel?",
    ["Skin", "Nose", "Tongue"],
    0,
  ],
  [
    "When eating, which three sense organs can work together?",
    ["Eyes + Nose + Tongue", "Ears + Skin + Eyes", "Nose + Ears + Skin"],
    0,
  ],
  [
    "When crossing a street, which pair is especially important in the lesson?",
    ["Eyes + Ears", "Tongue + Skin", "Nose + Tongue"],
    0,
  ],
  [
    "A child looks at a book while reading. Which organ is used?",
    ["Eyes", "Skin", "Nose"],
    0,
  ],
  [
    "A child writes with a pen. Which pair can work together?",
    ["Eyes + Skin", "Nose + Tongue", "Ears + Nose"],
    0,
  ],
  [
    "A cook smells food and tastes it. Which pair is used?",
    ["Nose + Tongue", "Eyes + Ears", "Skin + Ears"],
    0,
  ],
  [
    "A child sees a bird, feels its feathers, and hears its sound. Which three senses?",
    ["Eyes + Skin + Ears", "Nose + Tongue + Skin", "Tongue + Nose + Ears"],
    0,
  ],
  [
    "Which sense organ can warn you about smoke by detecting its smell?",
    ["Nose", "Tongue", "Skin"],
    0,
  ],
  [
    "Which statement is true?",
    [
      "Sense organs can work together.",
      "Only one sense organ can ever work at a time.",
      "Sense organs are not useful for safety.",
    ],
    0,
  ],
  [
    "You hold a fruit and look at it. What are you using?",
    ["Skin and eyes", "Ears and tongue", "Nose and ears"],
    0,
  ],
  [
    "You smell a meal before eating it. Why is the nose involved?",
    ["It detects the smell.", "It sees the food.", "It tastes the food."],
    0,
  ],
  [
    "You hear a warning sound while crossing. Which organ detects the sound?",
    ["Ears", "Eyes", "Tongue"],
    0,
  ],
  [
    "Which activity mainly uses the eyes to see words?",
    ["Reading a book", "Smelling food", "Tasting food"],
    0,
  ],
  [
    "Which activity can use eyes, nose, and tongue together?",
    ["Eating", "Reading", "Listening"],
    0,
  ],
  [
    "Which sense helps you know that an object feels soft?",
    [
      "Touch through the skin",
      "Taste through the tongue",
      "Smell through the nose",
    ],
    0,
  ],
  [
    "What is the big idea of this lesson?",
    [
      "Sense organs have special jobs and can work together.",
      "Only the eyes are important.",
      "Sense organs work only when we are eating.",
    ],
    0,
  ],
];
function startChallenge() {
  state.challenge = [...challenge].sort(() => Math.random() - 0.5);
  state.chIndex = 0;
  state.chScore = 0;
  state.chMissed = [];
  drawChallenge();
}
function drawChallenge() {
  const q = state.challenge[state.chIndex];
  $("#chNum").textContent = state.chIndex + 1;
  $("#chScore").textContent = state.chScore;
  $("#chBar").style.width = `${(state.chIndex / challenge.length) * 100}%`;
  $("#chNext").disabled = true;
  $("#challengeBox").innerHTML =
    `<div class="question">${q[0]}</div><div class="choice-row" style="margin-top:18px">${q[1].map((x, i) => `<button class="choice ch-choice" data-i="${i}">${x}</button>`).join("")}</div><div id="chFeedback" class="feedback" style="margin-top:14px"></div>`;
  $$(".ch-choice").forEach((b) =>
    b.addEventListener("click", () => {
      if ($("#chNext").disabled === false) return;
      const ok = +b.dataset.i === q[2];
      $$(".ch-choice").forEach((x) => x.classList.remove("correct", "wrong"));
      b.classList.add(ok ? "correct" : "wrong");
      if (ok) {
        state.chScore++;
        $("#chFeedback").textContent = "🎉 Correct! Great thinking.";
      } else {
        state.chMissed.push({ q: q[0], answer: q[1][q[2]] });
        $("#chFeedback").textContent =
          `💡 Let’s learn from it. The answer is: ${q[1][q[2]]}.`;
      }
      $("#chScore").textContent = state.chScore;
      $("#chNext").disabled = false;
      beep(ok);
    }),
  );
}
$("#chNext").addEventListener("click", () => {
  state.chIndex++;
  if (state.chIndex >= state.challenge.length) finishChallenge();
  else drawChallenge();
});
function finishChallenge() {
  const pct = Math.round((state.chScore / challenge.length) * 100);
  if (pct > state.best) {
    state.best = pct;
    localStorage.setItem("science1_l8_best", pct);
  }
  $("#finalPct").textContent = pct + "%";
  let msg =
    pct >= 90
      ? "🏆 Lesson Master! You showed strong understanding."
      : pct >= 80
        ? "🌟 Almost There! A little more practice will make it stronger."
        : pct >= 70
          ? "👍 Good Progress! Keep practicing the sense-team ideas."
          : "🌱 Keep Practicing! Review the examples and try again.";
  $("#resultMessage").textContent =
    `${msg} You answered ${state.chScore} of ${challenge.length} correctly.`;
  const badges = [];
  if (pct >= 90) badges.push("🏆 Lesson Master");
  if (pct >= 80) badges.push("🧠 Smart Thinker");
  if (pct >= 70) badges.push("🎯 Practice Pro");
  if (state.chScore >= 10) badges.push("💡 Problem Solver");
  if (!badges.length) badges.push("⭐ Great Effort");
  $("#badges").innerHTML = badges
    .map((x) => `<span class="badge">${x}</span>`)
    .join("");
  $("#mistakes").innerHTML = "";
  show("results");
}
$("#mistakesBtn").addEventListener("click", () => {
  const box = $("#mistakes");
  if (!state.chMissed.length) {
    box.innerHTML =
      '<div class="tip">🎉 No missed questions! You can play a bonus game or try the challenge again.</div>';
    return;
  }
  box.innerHTML =
    '<h3 style="color:var(--navy)">🔄 Practice My Mistakes</h3>' +
    state.chMissed
      .map(
        (m, i) =>
          `<div class="mistake"><b>${i + 1}. ${m.q}</b><div>Remember: <strong>${m.answer}</strong></div></div>`,
      )
      .join("") +
    '<div class="tip">💡 Read each reminder aloud, then try the Final Challenge again.</div>';
});
$("#againBtn").addEventListener("click", () => {
  show("challenge");
  startChallenge();
});
// Enter challenge only from journey button; initialize lazily on first visit.
$$('[data-go="challenge"]').forEach((b) =>
  b.addEventListener("click", () => {
    show("challenge");
    startChallenge();
  }),
);

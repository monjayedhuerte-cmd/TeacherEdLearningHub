"use strict";
const stages = [
  { id: "engage", icon: "🎮", title: "ENGAGE", sub: "Hook & Warm-up" },
  { id: "connect", icon: "🔗", title: "CONNECT", sub: "Iugnay sa sarili" },
  { id: "explore", icon: "🔎", title: "EXPLORE", sub: "Tuklasin" },
  { id: "learn", icon: "🧠", title: "LEARN", sub: "Alamin" },
  { id: "guided", icon: "🤝", title: "GUIDED PRACTICE", sub: "May gabay" },
  { id: "practice", icon: "🎯", title: "PRACTICE", sub: "Magsanay" },
  { id: "think", icon: "💭", title: "THINK", sub: "Mag-isip" },
  { id: "review", icon: "🔄", title: "REVIEW", sub: "Balikan" },
  { id: "check", icon: "✅", title: "CHECK", sub: "Formative check" },
  { id: "master", icon: "🏆", title: "MASTER", sub: "Mastery challenge" },
  { id: "reflect", icon: "🌈", title: "REFLECT", sub: "Pagnilayan" },
  { id: "celebrate", icon: "🎉", title: "CELEBRATE", sub: "Ipagdiwang" },
];
const facts = [
  [
    "🪴",
    "Palayok",
    "Clay pot",
    "Gawa sa luwad/clay; makikita sa maraming pamayanan.",
  ],
  [
    "🏺",
    "Bangang Manunggul",
    "Manunggul Jar",
    "Sinaunang palayok na may takip na may disenyong may dalawang taong nakasakay sa bangka.",
  ],
  [
    "🔥",
    "Burnay",
    "Burnay pottery",
    "Sa Ilocos, may mga palayok na burnay na gawa sa luwad mula sa lupa.",
  ],
  [
    "🪵",
    "Paglililok sa Paete",
    "Wood carving in Paete",
    "Kilala ang Paete, Laguna sa pag-uukit/paglililok sa kahoy.",
  ],
  [
    "🗿",
    "Bulul",
    "Bulul figure",
    "Kilala sa Cordillera; inilalarawan sa aralin bilang estatwa ng isang espiritu.",
  ],
  [
    "🧶",
    "Abel",
    "Abel textile",
    "Kilala sa Vigan, Ilocos Sur; telang gawa sa hibla ng bulak.",
  ],
  [
    "👕",
    "Piña at Jusi",
    "Piña & Jusi fabric",
    "Ginagamit sa paggawa ng Barong Tagalog; piña mula sa hibla ng pinya at jusi mula sa hibla ng abaka.",
  ],
  [
    "🧵",
    "T’nalak",
    "T’nalak textile",
    "Kilala sa mga T’boli sa Timog Cotabato; telang gawa sa hibla ng abaka.",
  ],
  [
    "🧣",
    "Pis Syabit",
    "Pis Syabit textile",
    "Kilala sa mga Tausug; telang gawa mula sa bulak at seda.",
  ],
  [
    "🧺",
    "Paghahabi",
    "Weaving",
    "Gumagamit ng iba’t ibang materyales; halimbawa: banig, basket, bag, tela, at sombrero.",
  ],
];
const mcq = [
  [
    "Ano ang tinutukoy ng “likha” sa aralin?",
    "Anumang gawa ng kamay ng tao",
    "Isang uri ng halaman",
    "Isang gusali lamang",
    0,
  ],
  [
    "Ano ang maaaring ipakita ng isang likhang-sining?",
    "Aspeto ng sining o kultura ng pamayanan",
    "Presyo lamang ng produkto",
    "Laki ng pamayanan",
    0,
  ],
  [
    "Ano ang Bangang Manunggul?",
    "Sinaunang palayok na may natatanging disenyo",
    "Uri ng tela",
    "Uri ng sayaw",
    0,
  ],
  [
    "Saang lugar kilala ang pag-uukit/paglililok sa kahoy?",
    "Paete, Laguna",
    "Vigan, Ilocos Sur",
    "Timog Cotabato",
    0,
  ],
  [
    "Ano ang bulul ayon sa aralin?",
    "Isang estatwa na kaugnay ng pamayanang Cordillera",
    "Isang telang gawa sa bulak",
    "Isang uri ng basket",
    0,
  ],
  [
    "Ano ang abel?",
    "Tela na gawa sa hibla ng bulak",
    "Palayok na gawa sa luwad",
    "Kahoy na rebulto",
    0,
  ],
  [
    "Sino ang kilala sa paghahabi ng t’nalak?",
    "T’boli",
    "Tausug",
    "Pampanga",
    0,
  ],
  [
    "Ano ang materyal na pinagmumulan ng piña?",
    "Hibla ng pinya",
    "Hibla ng abaka",
    "Luwad",
    0,
  ],
  [
    "Ano ang pis syabit?",
    "Telang kilala sa pamayanang Tausug",
    "Palayok sa Ilocos",
    "Wood carving sa Paete",
    0,
  ],
  [
    "Bakit mahalaga ang mga likhang-katutubo?",
    "Ipinapakita nila ang sining, kultura, kasanayan, at yaman ng pamayanan",
    "Dahil pare-pareho ang lahat ng disenyo",
    "Dahil hindi na kailangan ang ibang kultura",
    0,
  ],
];
const review = [
  ["Ang likha ay maaaring gawa ng kamay ng tao.", "Tama"],
  ["Ang mga likha ay maaaring nagpapakita ng kultura ng pamayanan.", "Tama"],
  ["Ang abel ay kilala sa Vigan, Ilocos Sur.", "Tama"],
  ["Ang t’nalak ay kaugnay ng mga T’boli sa Timog Cotabato.", "Tama"],
  ["Ang pis syabit ay kaugnay ng mga Tausug.", "Tama"],
  ["Ang Paete ay kilala sa pag-uukit sa kahoy.", "Tama"],
];
let state = JSON.parse(localStorage.getItem("ap3Lesson11") || "null") || {
  stage: 0,
  points: 0,
  stars: 0,
  mastery: 0,
  answered: 0,
  correct: 0,
  reflect: null,
};
let currentStage = 0,
  qIndex = 0,
  selectedMatch = null,
  memFirst = null,
  memLock = false,
  memPairs = 0;
const $ = (id) => document.getElementById(id);
function save() {
  localStorage.setItem("ap3Lesson11", JSON.stringify(state));
  updateHUD();
}
function updateHUD() {
  $("stars").textContent = state.stars;
  $("points").textContent = state.points;
  $("pPoints").textContent = state.points;
  $("pStars").textContent = state.stars;
  $("pMastery").textContent = state.mastery + "%";
}
function show(id) {
  document
    .querySelectorAll(".screen")
    .forEach((x) => x.classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function toast(msg) {
  const e = $("toast");
  e.textContent = msg;
  e.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => e.classList.remove("show"), 2200);
}
function celebrate(title, text) {
  $("celebrateTitle").textContent = title;
  $("celebrateText").textContent = text;
  $("celebrate").classList.add("show");
}
$("celebrateClose").addEventListener("click", () => {
  $("celebrate").classList.remove("show");
});
$("startBtn").addEventListener("click", () => {
  show("lesson");
  renderStage(Math.min(state.stage, 11));
});
$("previewBtn").addEventListener("click", () => {
  show("lesson");
  renderStage(0);
});
$("continueBtn").addEventListener("click", () => {
  show("lesson");
  renderStage(Math.min(state.stage, 11));
});
$("resetBtn").addEventListener("click", () => {
  if (
    confirm(
      "I-reset ang progress ng lesson na ito? / Reset this lesson progress?",
    )
  ) {
    state = {
      stage: 0,
      points: 0,
      stars: 0,
      mastery: 0,
      answered: 0,
      correct: 0,
      reflect: null,
    };
    save();
    renderStage(0);
    show("lesson");
    toast("Progress reset.");
  }
});
$("fullscreenBtn").addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement)
      await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch (e) {
    toast("Fullscreen is not available on this browser.");
  }
});
document
  .querySelectorAll("[data-go]")
  .forEach((b) => b.addEventListener("click", () => show(b.dataset.go)));
function renderNav() {
  const nav = $("lessonNav");
  nav.innerHTML = stages
    .map(
      (s, i) =>
        `<button class="stageBtn ${i === currentStage ? "active " : ""}${i < state.stage ? "done" : ""}" data-stage="${i}">${s.icon}<br>${s.title}<small>${s.sub}</small></button>`,
    )
    .join("");
  nav.querySelectorAll(".stageBtn").forEach((b) =>
    b.addEventListener("click", () => {
      const n = Number(b.dataset.stage);
      if (n > state.stage) {
        toast("🔒 Kumpletuhin muna ang kasalukuyang bahagi.");
      } else renderStage(n);
    }),
  );
  $("lessonBar").style.width = ((currentStage + 1) / stages.length) * 100 + "%";
}
function renderStage(n) {
  currentStage = n;
  renderNav();
  const h = $("stageHost");
  const next =
    n < 11
      ? `<div class="row"><button class="btn blue" id="nextStage">Next: ${stages[n + 1].icon} ${stages[n + 1].title} ➜</button></div>`
      : "";
  if (n === 0) h.innerHTML = engage() + next;
  else if (n === 1) h.innerHTML = connect() + next;
  else if (n === 2) h.innerHTML = explore() + next;
  else if (n === 3) h.innerHTML = learn() + next;
  else if (n === 4) {
    guided();
    return;
  } else if (n === 5) {
    practice();
    return;
  } else if (n === 6) h.innerHTML = think() + next;
  else if (n === 7) {
    reviewStage();
    return;
  } else if (n === 8) {
    checkStage();
    return;
  } else if (n === 9) {
    master();
    return;
  } else if (n === 10) {
    h.innerHTML = reflect() + next;
    bindReflect();
    return;
  } else {
    h.innerHTML = celebrateStage();
    return;
  }
  if ($("nextStage")) $("nextStage").addEventListener("click", () => advance());
}
function advance() {
  if (currentStage === 11) return;
  state.stage = Math.max(state.stage, currentStage + 1);
  state.stars += 1;
  save();
  renderStage(currentStage + 1);
}
function engage() {
  return `<div class="panel"><div class="title"><h2>🎮 ENGAGE — “Ano ang gawa nila?”</h2><p>Warm-up • 2–5 minutes • Hindi graded</p></div><div class="callout"><b>Panuto / Directions:</b> Tingnan ang mga halimbawa. Hulaan kung ano ang ginagawa o ginagamit sa larawan. <span class="en">Think about what people are making or using.</span></div><div class="visualGrid" style="margin-top:15px">${facts
    .slice(0, 8)
    .map(
      (f, i) =>
        `<button class="visual" data-reveal="${i}"><div class="pic">${f[0]}</div><strong>???</strong><small>Tap to reveal / Pindutin para makita</small></button>`,
    )
    .join("")}</div><div id="engageNote" class="feedback"></div></div>`;
}
function bindEngage() {
  document.querySelectorAll("[data-reveal]").forEach((b) =>
    b.addEventListener("click", () => {
      const f = facts[Number(b.dataset.reveal)];
      b.querySelector("strong").textContent = f[1];
      b.querySelector("small").textContent = f[2];
      $("engageNote").className = "feedback show good";
      $("engageNote").innerHTML = "💡 " + f[3];
    }),
  );
}
function connect() {
  return `<div class="panel"><div class="title"><h2>🔗 CONNECT — “May ganito ba sa amin?”</h2><p>Iugnay ang aralin sa sariling pamayanan. / Connect it to your community.</p></div><div class="two"><div class="card"><div class="icon">🏘️</div><h3>Isipin</h3><p>Anong likhang-kamay ang nakikita mo sa iyong pamayanan? Halimbawa: palayok, banig, basket, paghahabi, ukit, o iba pa.</p><span class="en">What handmade craft do you see in your community?</span></div><div class="card"><div class="icon">💬</div><h3>Sabihin</h3><p>Para saan ito ginagamit? Sino ang gumagawa? Anong materyales ang ginagamit?</p><span class="en">What is it used for? Who makes it? What materials are used?</span></div></div><div class="callout" style="margin-top:15px"><b>Teacher connection:</b> Ang mga likha ay maaaring nakabatay sa mga likas na yaman at materyales na matatagpuan sa lugar.</div></div>`;
}
function explore() {
  return `<div class="panel"><div class="title"><h2>🔎 EXPLORE — Kilalanin ang mga Likha</h2><p>Explore examples from the textbook.</p></div><div class="visualGrid">${facts.map((f) => `<div class="visual"><div class="pic">${f[0]}</div><strong>${f[1]}</strong><small><b>${f[2]}</b><br>${f[3]}</small></div>`).join("")}</div></div>`;
}
function learn() {
  return `<div class="panel"><div class="title"><h2>🧠 LEARN — Ano ang Katutubong Likha?</h2><p>Key concepts from the lesson.</p></div><div class="steps"><div class="step"><div class="num">1</div><div><b>Likha</b><p>Ang likha ay tumutukoy sa anumang gawa ng kamay ng tao. Maaari itong maging likhang-sining kapag nagpapakita ito ng isang aspeto ng sining o kultura ng isang pamayanan.</p><span class="en"><b>English:</b> A craft is something made by human hands. It may be considered art when it shows an aspect of a community’s art or culture.</span></div></div><div class="step"><div class="num">2</div><div><b>Materyales mula sa kalikasan</b><p>Maraming likha ang gumagamit ng mga sangkap o materyales mula sa kalikasan. Ang mga materyales na matatagpuan sa lugar ay nakatutulong sa pagbuo ng natatanging likha.</p><span class="en"><b>English:</b> Many crafts use natural materials available in the community.</span></div></div><div class="step"><div class="num">3</div><div><b>Pagkakaiba-iba ng pamayanan</b><p>May iba’t ibang likha ang mga pamayanan sa Pilipinas. Ipinapakita nito ang kanilang kasanayan, sining, kultura, at ugnayan sa kapaligiran.</p><span class="en"><b>English:</b> Different communities have different crafts that reflect skills, art, culture, and the environment.</span></div></div><div class="step"><div class="num">4</div><div><b>Halimbawa sa aralin</b><p>Paete—paglililok sa kahoy; Cordillera—bulul; Vigan—abel; T’boli—t’nalak; Tausug—pis syabit; Ilocos—burnay.</p><span class="en"><b>English:</b> Examples include Paete wood carving, Cordillera bulul, Vigan abel, T’boli t’nalak, Tausug pis syabit, and Ilocos burnay pottery.</span></div></div></div></div>`;
}
function guided() {
  qIndex = 0;
  guidedQuestion();
}
function guidedQuestion() {
  const x = mcq[qIndex % 5];
  $("stageHost").innerHTML =
    `<div class="panel"><div class="title"><h2>🤝 GUIDED PRACTICE</h2><p>May gabay muna tayo. / Let's practice with guidance.</p></div><div class="q">${x[0]}</div><div class="choices">${x
      .slice(1, 4)
      .map(
        (a, i) =>
          `<button class="choice" data-answer="${i}">${String.fromCharCode(65 + i)}. ${a}</button>`,
      )
      .join(
        "",
      )}</div><div id="fb" class="feedback"></div><div class="row"><button class="hint" id="hintBtn">💡 Hint</button></div></div>`;
  bindMCQ(x, () => {
    qIndex++;
    if (qIndex < 5) guidedQuestion();
    else {
      state.stage = Math.max(state.stage, 5);
      state.stars++;
      save();
      renderStage(5);
    }
  });
}
function bindMCQ(x, onDone) {
  document.querySelectorAll(".choice").forEach((b) =>
    b.addEventListener("click", () => {
      const i = Number(b.dataset.answer);
      document.querySelectorAll(".choice").forEach((z) => (z.disabled = true));
      if (i === x[4]) {
        b.classList.add("correct");
        $("fb").className = "feedback show good";
        $("fb").textContent = "🎉 Tama! / Correct!";
        state.points += 10;
        state.correct++;
        state.answered++;
        state.stars++;
        save();
        setTimeout(onDone, 550);
      } else {
        b.classList.add("wrong");
        document.querySelectorAll(".choice")[x[4]].classList.add("correct");
        $("fb").className = "feedback show try";
        $("fb").textContent =
          "💡 Hindi pa. Tingnan ang tamang sagot at subukang ipaliwanag kung bakit.";
        state.answered++;
        save();
        setTimeout(onDone, 800);
      }
    }),
  );
  $("hintBtn").addEventListener("click", () =>
    toast(
      "💡 Basahin muli ang mahalagang konsepto tungkol sa likha at pamayanan.",
    ),
  );
}
function practice() {
  qIndex = 0;
  practiceQuestion();
}
function practiceQuestion() {
  const x = mcq[(qIndex + 5) % mcq.length];
  $("stageHost").innerHTML =
    `<div class="panel"><div class="title"><h2>🎯 PRACTICE — Piliin ang Tama</h2><p>Independent practice • English support included.</p></div><div class="q">${x[0]}</div><div class="choices">${x
      .slice(1, 4)
      .map(
        (a, i) =>
          `<button class="choice" data-answer="${i}">${String.fromCharCode(65 + i)}. ${a}</button>`,
      )
      .join("")}</div><div id="fb" class="feedback"></div></div>`;
  document.querySelectorAll(".choice").forEach((b) =>
    b.addEventListener("click", () => {
      const i = Number(b.dataset.answer);
      document.querySelectorAll(".choice").forEach((z) => (z.disabled = true));
      if (i === x[4]) {
        b.classList.add("correct");
        $("fb").className = "feedback show good";
        $("fb").textContent = "⭐ Tama! Great work!";
        state.points += 10;
        state.correct++;
        state.answered++;
        state.stars++;
        save();
      } else {
        b.classList.add("wrong");
        document.querySelectorAll(".choice")[x[4]].classList.add("correct");
        $("fb").className = "feedback show try";
        $("fb").textContent = "💡 Review the correct answer, then continue.";
        state.answered++;
        save();
      }
      const btn = document.createElement("button");
      btn.className = "btn blue";
      btn.textContent = qIndex < 4 ? "Next ➜" : "Continue ➜";
      btn.addEventListener("click", () => {
        qIndex++;
        qIndex < 5 ? practiceQuestion() : advance();
      });
      document.querySelector(".panel").appendChild(btn);
    }),
  );
}
function think() {
  return `<div class="panel"><div class="title"><h2>💭 THINK — “Bakit mahalaga?”</h2><p>Think deeper. / Mag-isip nang mas malalim.</p></div><div class="two"><div class="card"><div class="icon">🌿</div><h3>Kalikasan + Likha</h3><p>Maraming materyales sa paggawa ng likha ay nagmumula sa kalikasan. Kaya mahalagang alagaan ang kapaligiran.</p><span class="en"><b>English:</b> Many craft materials come from nature, so caring for the environment matters.</span></div><div class="card"><div class="icon">❤️</div><h3>Kultura + Pagkakakilanlan</h3><p>Ang mga likha ay maaaring magpakita ng natatanging sining at kultura ng isang pamayanan.</p><span class="en"><b>English:</b> Crafts can show a community’s unique art and culture.</span></div></div><div class="callout" style="margin-top:15px"><b>Think question:</b> Kung mawala ang isang lokal na likha, ano ang maaaring mawala sa pamayanan—kasanayan, kuwento, pagkakakilanlan, o lahat ng ito?</div></div>`;
}
function reviewStage() {
  const cards = [...review].sort(() => Math.random() - 0.5);
  $("stageHost").innerHTML =
    `<div class="panel"><div class="title"><h2>🔄 REVIEW — Tama o Mali</h2><p>Tap the answer. / Pindutin ang sagot.</p></div><div id="reviewArea"></div></div>`;
  let i = 0,
    score = 0;
  const render = () => {
    if (i >= cards.length) {
      $("reviewArea").innerHTML =
        `<div class="result"><div class="big">🔄</div><h2>Review Finished!</h2><p>Nakuha mo ang <b>${score}/${cards.length}</b>.</p><button class="btn blue" id="reviewNext">Continue ➜</button></div>`;
      $("reviewNext").addEventListener("click", advance);
      return;
    }
    const [q, a] = cards[i];
    $("reviewArea").innerHTML =
      `<div class="q">${q}</div><div class="choices"><button class="choice" data-v="Tama">✅ Tama<br><span class="en">True</span></button><button class="choice" data-v="Mali">❌ Mali<br><span class="en">False</span></button></div><div id="fb" class="feedback"></div>`;
    document.querySelectorAll(".choice").forEach((b) =>
      b.addEventListener("click", () => {
        document
          .querySelectorAll(".choice")
          .forEach((z) => (z.disabled = true));
        if (b.dataset.v === a) {
          b.classList.add("correct");
          score++;
          state.correct++;
          state.points += 5;
          state.stars++;
          $("fb").className = "feedback show good";
          $("fb").textContent = "🎉 Tama!";
        } else {
          b.classList.add("wrong");
          $("fb").className = "feedback show try";
          $("fb").textContent = "💡 Balikan ang konsepto.";
        }
        state.answered++;
        save();
        setTimeout(() => {
          i++;
          render();
        }, 650);
      }),
    );
  };
  render();
}
function checkStage() {
  qIndex = 0;
  checkQuestion();
}
function checkQuestion() {
  const pool = mcq.slice(5);
  const x = pool[qIndex % pool.length];
  $("stageHost").innerHTML =
    `<div class="panel"><div class="title"><h2>✅ CHECK — Quick Formative Check</h2><p>3 questions • Check your understanding.</p></div><div class="q">${x[0]}</div><div class="choices">${x
      .slice(1, 4)
      .map(
        (a, i) =>
          `<button class="choice" data-answer="${i}">${String.fromCharCode(65 + i)}. ${a}</button>`,
      )
      .join("")}</div><div id="fb" class="feedback"></div></div>`;
  document.querySelectorAll(".choice").forEach((b) =>
    b.addEventListener("click", () => {
      const i = Number(b.dataset.answer);
      document.querySelectorAll(".choice").forEach((z) => (z.disabled = true));
      if (i === x[4]) {
        b.classList.add("correct");
        state.correct++;
        state.points += 10;
        state.stars++;
        $("fb").className = "feedback show good";
        $("fb").textContent = "🎉 Correct!";
      } else {
        b.classList.add("wrong");
        document.querySelectorAll(".choice")[x[4]].classList.add("correct");
        $("fb").className = "feedback show try";
        $("fb").textContent = "💡 Review the correct answer.";
      }
      state.answered++;
      save();
      const n = document.createElement("button");
      n.className = "btn blue";
      n.textContent = qIndex < 2 ? "Next ➜" : "Continue to Master ➜";
      n.addEventListener("click", () => {
        qIndex++;
        qIndex < 3 ? checkQuestion() : advance();
      });
      document.querySelector(".panel").appendChild(n);
    }),
  );
}
function master() {
  qIndex = 0;
  masterQuestion();
}
function masterQuestion() {
  const pool = [mcq[0], mcq[3], mcq[6], mcq[7], mcq[8], mcq[9]];
  const x = pool[qIndex];
  $("stageHost").innerHTML =
    `<div class="panel"><div class="title"><h2>🏆 MASTER — Community Craft Challenge</h2><p>Real-world mastery challenge • 6 items</p></div><div class="callout"><b>Scenario:</b> Ikaw ang “Kultura Detective.” Kilalanin ang likha at ipaliwanag kung bakit mahalaga ang mga ito sa pamayanan.</div><div class="q">${x[0]}</div><div class="choices">${x
      .slice(1, 4)
      .map(
        (a, i) =>
          `<button class="choice" data-answer="${i}">${String.fromCharCode(65 + i)}. ${a}</button>`,
      )
      .join("")}</div><div id="fb" class="feedback"></div>`;
  document.querySelectorAll(".choice").forEach((b) =>
    b.addEventListener("click", () => {
      const i = Number(b.dataset.answer);
      document.querySelectorAll(".choice").forEach((z) => (z.disabled = true));
      if (i === x[4]) {
        b.classList.add("correct");
        state.points += 15;
        state.correct++;
        state.stars += 2;
        $("fb").className = "feedback show good";
        $("fb").textContent = "🏆 Mastery point!";
      } else {
        b.classList.add("wrong");
        document.querySelectorAll(".choice")[x[4]].classList.add("correct");
        $("fb").className = "feedback show try";
        $("fb").textContent =
          "💡 Balikan ang halimbawa at subukan muli sa susunod.";
      }
      state.answered++;
      save();
      const n = document.createElement("button");
      n.className = "btn blue";
      n.textContent = qIndex < 5 ? "Next ➜" : "See Mastery Result ➜";
      n.addEventListener("click", () => {
        qIndex++;
        qIndex < 6 ? masterQuestion() : finishMaster();
      });
      document.querySelector(".panel").appendChild(n);
    }),
  );
}
function finishMaster() {
  state.mastery = Math.min(
    100,
    Math.round((state.correct / Math.max(state.answered, 1)) * 100),
  );
  state.stage = Math.max(state.stage, 10);
  save();
  show("lesson");
  renderStage(10);
  toast("🏆 Master challenge complete!");
}
function reflect() {
  return `<div class="panel"><div class="title"><h2>🌈 REFLECT — Ano ang natutuhan mo?</h2><p>Choose how you feel about your learning.</p></div><div class="reflection"><button class="feel" data-feel="😊">😊 Naiintindihan ko na!<span class="en">I understand it!</span></button><button class="feel" data-feel="🙂">🙂 Mas naiintindihan ko na.<span class="en">I understand more now.</span></button><button class="feel" data-feel="🤔">🤔 Kailangan ko pa ng practice.<span class="en">I need more practice.</span></button></div><div class="callout" style="margin-top:15px"><b>Reflection:</b> Ang pagpapahalaga sa mga likhang-katutubo ay paraan ng paggalang sa sining, kultura, kasanayan, at kasaysayan ng mga pamayanan.</div>`;
}
function bindReflect() {
  document.querySelectorAll(".feel").forEach((b) =>
    b.addEventListener("click", () => {
      state.reflect = b.dataset.feel;
      state.stage = 11;
      state.stars += 2;
      save();
      celebrate(
        "Mahusay! / Well done!",
        "Natapos mo ang learning journey. Ipinakita mo na nauunawaan mo ang kahalagahan ng mga katutubong likha.",
      );
      renderStage(11);
    }),
  );
}
function celebrateStage() {
  return `<div class="panel result"><div class="big">🎉</div><h2>CELEBRATE — Lesson Complete!</h2><p>Napag-aralan mo ang mga katutubong likha, halimbawa ng mga pamayanan, materyales, at kahalagahan ng kultura.</p><span class="badge">🏆 Aralin 11 Master</span><div class="row"><button class="btn primary" id="doneHome">🏠 Back to Home</button><button class="btn blue" id="doneProgress">📊 View Progress</button></div><div class="source" style="margin-top:18px"><b>Source alignment:</b> Batay sa ipinakitang textbook pages 162–167. Ang mga larawan at halimbawa sa website ay ginawang child-friendly interactive representations; hindi binago ang pangunahing konsepto ng aralin.</div></div>`;
}
function bindCelebrate() {
  if ($("doneHome"))
    $("doneHome").addEventListener("click", () => show("home"));
  if ($("doneProgress"))
    $("doneProgress").addEventListener("click", () => show("progress"));
}
// Patch renderStage celebration binding and engage binding after initial render.
const originalRenderStage = renderStage;
renderStage = function (n) {
  originalRenderStage(n);
  if (n === 0) bindEngage();
  if (n === 11) bindCelebrate();
  updateHUD();
};
updateHUD();
renderNav();

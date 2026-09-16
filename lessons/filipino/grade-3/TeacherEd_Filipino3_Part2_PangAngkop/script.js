const slides = [
  [
    "Simula",
    `<div class="hero"><div class="eyebrow">FILIPINO 3 • PART 2</div><h1>Pang-angkop</h1><span class="en">Words that connect words smoothly</span><p>Sa bahaging ito, pag-aaralan natin ang <b>na</b> at <b>-ng</b> bilang pang-angkop. Matututo tayo sa pamamagitan ng obserbasyon, pagmomodelo, gabay na pagsasanay, aplikasyon, at mastery check.</p><span class="en">We will learn through observation, modeling, guided practice, application, and a mastery check.</span><div class="call gold"><b>🎯 Layunin:</b> Makilala at magamit nang wasto ang <b>na</b> at <b>-ng</b> batay sa hulihan ng nauunang salita.</div><button class="btn goldbtn" onclick="go(1)">Simulan ang Aralin →</button></div><div class="teacher">👨‍🏫 <div><b>Teacher Guide:</b> “Obserbahan muna natin ang mga halimbawa bago tayo magbigay ng sagot.”</div></div>`,
  ],
  [
    "Larawan",
    `<div class="card"><div class="eyebrow">CONNECT</div><h2>👀 Gawing Batayan ang Larawan</h2><p>Tingnan ang pahina ng aklat. Hanapin ang mga halimbawa ng pang-angkop at pansinin kung paano pinagdurugtong ang mga salita.</p></div><div class="grid"><div class="card"><img class="source" src="source-page-132.jpg" alt="Pahina 132 tungkol sa Pang-angkop" onclick="zoom(this)"><div class="caption">Pahina 132 • Pang-angkop</div></div><div class="card"><img class="source" src="source-page-133.jpg" alt="Pahina 133 pagsasanay sa Pang-angkop" onclick="zoom(this)"><div class="caption">Pahina 133 • Pagtataya</div></div></div><div class="call"><b>Tanong ng guro:</b> “Ano ang napapansin ninyo sa mga salitang <i>masipag na bata</i> at <i>masayang pag-aaral</i>?”</div>`,
  ],
  [
    "Tuklasin",
    `<div class="card"><div class="eyebrow">MINI-LESSON 1 • EXPLAIN</div><h2>🔗 Ano ang Pang-angkop?</h2><p>Ayon sa aralin, ang <b>pang-angkop</b> ay bahagi ng pananalita na ginagamit upang <b>pag-ugnayin ang salitang panuring at salitang tinuturingan</b>. Nakakatulong ito upang maging maayos, malinaw, at maganda ang daloy ng mga salita sa isang pahayag.</p><span class="en">It connects the describing word and the word it describes, helping the words flow clearly and smoothly.</span></div><div class="grid3"><div class="card"><div class="big">🔗</div><h3>Nag-uugnay</h3><span class="en">Connects words</span></div><div class="card"><div class="big">🧩</div><h3>Nagpapalinaw</h3><span class="en">Makes the phrase clear</span></div><div class="card"><div class="big">✨</div><h3>Nagpapaganda</h3><span class="en">Improves the flow</span></div></div><div class="call gold"><b>Teacher Modeling:</b> <i>masipag + na + bata → masipag na bata</i></div>`,
  ],
  [
    "NA",
    `<div class="card"><div class="eyebrow">MINI-LESSON 2 • I DO</div><h2><b>na</b> — Kapag katinig ang hulihan</h2><div class="rule"><span class="term">na</span><p>Ginagamit ang <b>na</b> kapag ang nauunang salita ay <b>nagtatapos sa katinig</b>.</p><span class="en">Use <b>na</b> when the preceding word ends in a consonant.</span></div></div><div class="card"><h3>📖 Mga halimbawa mula sa aklat</h3><div class="example"><div class="word">masipag</div><div class="conn">na</div><div class="word">bata</div></div><div class="example"><div class="word">mabait</div><div class="conn">na</div><div class="word">guro</div></div><div class="example"><div class="word">matamis</div><div class="conn">na</div><div class="word">mangga</div></div></div><div class="call green"><b>Clue:</b> Tingnan ang hulihan: <b>g, t, s</b> → mga katinig → <b>na</b>.</div>`,
  ],
  [
    "-NG",
    `<div class="card"><div class="eyebrow">MINI-LESSON 3 • I DO</div><h2><b>-ng</b> — Kapag patinig o /n/ ang hulihan</h2><div class="rule"><span class="term">-ng</span><p>Ginagamit ang <b>-ng</b> kapag ang nauunang salita ay <b>nagtatapos sa patinig o /n/</b>.</p><span class="en">Use <b>-ng</b> when the preceding word ends in a vowel or /n/.</span></div></div><div class="card"><h3>📖 Mga halimbawa mula sa larawan</h3><div class="example"><div class="word">masaya</div><div class="conn">-ng</div><div class="word">pag-aaral</div></div><div class="example"><div class="word">maganda</div><div class="conn">-ng</div><div class="word">umaga</div></div><div class="example"><div class="word">puso</div><div class="conn">-ng</div><div class="word">bato</div></div><div class="example"><div class="word">halaman</div><div class="conn">-ng</div><div class="word">malago</div></div><div class="example"><div class="word">bayan</div><div class="conn">-ng</div><div class="word">magiliw</div></div></div><div class="call gold"><b>Tandaan:</b> Patinig o <b>/n/</b> ang hulihan → <b>-ng</b>.</div>`,
  ],
  [
    "Sabayan",
    `<div class="card"><div class="eyebrow">WE DO • GUIDED PRACTICE</div><h2>🤝 Hulihan Detective</h2><p>Piliin ang pang-angkop. Pagkatapos, basahin ang feedback at sabihin kung anong clue ang ginamit mo.</p></div><div id="guided"></div>`,
  ],
  [
    "Laro",
    `<div class="card"><div class="eyebrow">MEANINGFUL GAME</div><h2>🎯 Pang-angkop Match</h2><p>I-tap ang salita, pagkatapos ay piliin ang <b>na</b> o <b>-ng</b>. Mobile-friendly ito—walang drag-and-drop.</p></div><div id="game"></div>`,
  ],
  [
    "Ilapat",
    `<div class="card"><div class="eyebrow">YOU DO • APPLICATION</div><h2>✍️ Buoin ang Pangungusap</h2><p>Gamitin ang tuntunin sa mga pangungusap mula sa pagsasanay sa pahina 133.</p></div><div id="apply"></div>`,
  ],
  [
    "Mastery",
    `<div class="card"><div class="eyebrow">INDEPENDENT PRACTICE</div><h2>🏆 Kaya Ko Na!</h2><p>Sagutin nang mag-isa. Layunin natin ang pag-unawa at tamang paggamit, hindi lamang ang score.</p></div><div id="mastery"></div>`,
  ],
  [
    "Tapos",
    `<div class="hero" style="text-align:center"><div class="big">🎉</div><h2>Mission Complete!</h2><p>Natapos mo ang Part 2: Pang-angkop.</p><div class="score"><span>Mastery Score</span><strong id="finalScore">0 / 8</strong><span id="finalMsg">Patuloy na magsanay at tandaan ang hulihan ng unang salita.</span></div><div class="call gold"><b>NA</b> → katinig &nbsp;&nbsp; | &nbsp;&nbsp; <b>-NG</b> → patinig o /n/</div><button class="btn bluebtn" onclick="go(0)">↺ Balikan ang Aralin</button> <button class="btn goldbtn" onclick="window.print()">🖨️ I-print</button></div>`,
  ],
];
const guided = [
  ["masipag ___ bata", "na", "“masipag” ay nagtatapos sa katinig."],
  ["mabait ___ guro", "na", "“mabait” ay nagtatapos sa katinig."],
  ["matamis ___ mangga", "na", "“matamis” ay nagtatapos sa katinig."],
  ["masaya ___ pag-aaral", "-ng", "“masaya” ay nagtatapos sa patinig."],
  ["maganda ___ umaga", "-ng", "“maganda” ay nagtatapos sa patinig."],
  ["bayan ___ magiliw", "-ng", "“bayan” ay nagtatapos sa /n/."],
];
const applyQs = [
  ["Nagluto ang nanay ng masarap ___ ulam.", "na", "masarap na ulam"],
  [
    "Pinagpapala ang Pilipinas, bayan ___ magigiting.",
    "-ng",
    "bayang magigiting",
  ],
  ["Nag-aaral nang mabuti ang bata ___ matiyaga.", "na", "batang matiyaga"],
  [
    "Itinanim ni Jan ang magaganda ___ bulaklak sa hardin.",
    "-ng",
    "magagandang bulaklak",
  ],
  [
    "Ang pamayanan ___ maunlad ay may mamamayang masisipag.",
    "-ng",
    "pamayanang maunlad",
  ],
  [
    "Dapat pangalagaan ang mayaman ___ kalikasan ng Pilipinas.",
    "-ng",
    "mayamang kalikasan",
  ],
];
const gameQs = [
  ["masipag", "na", "masipag na bata"],
  ["mabait", "na", "mabait na guro"],
  ["matamis", "na", "matamis na mangga"],
  ["masaya", "-ng", "masayang pag-aaral"],
  ["maganda", "-ng", "magandang umaga"],
  ["bayan", "-ng", "bayang magiliw"],
];
const mastery = [
  ["masipag ___ bata", "na", ["na", "-ng", "wala"]],
  ["maganda ___ umaga", "-ng", ["na", "-ng", "wala"]],
  ["mabait ___ guro", "na", ["na", "-ng", "wala"]],
  ["masaya ___ pag-aaral", "-ng", ["na", "-ng", "wala"]],
  ["bayan ___ magiliw", "-ng", ["na", "-ng", "wala"]],
  ["halaman ___ malago", "-ng", ["na", "-ng", "wala"]],
  ["matamis ___ mangga", "na", ["na", "-ng", "wala"]],
  ["mayaman ___ kalikasan", "-ng", ["na", "-ng", "wala"]],
];
let cur = +localStorage.teFilPart2Slide || 0,
  scores = JSON.parse(localStorage.teFilPart2Scores || "{}"),
  gameDone = [],
  gameSel = null;
function go(n) {
  cur = Math.max(0, Math.min(slides.length - 1, n));
  render();
}
function render() {
  document.getElementById("app").innerHTML = slides[cur][1];
  document.getElementById("where").textContent =
    cur + 1 + ". " + slides[cur][0];
  document.getElementById("pt").textContent = cur + 1 + " / " + slides.length;
  document.getElementById("bar").style.width =
    ((cur + 1) / slides.length) * 100 + "%";
  document.getElementById("prev").disabled = !cur;
  document.getElementById("next").textContent =
    cur === slides.length - 1 ? "Tapos ✓" : "Susunod →";
  document
    .querySelectorAll("#nav button")
    .forEach((b, i) => b.classList.toggle("active", i === cur));
  localStorage.teFilPart2Slide = cur;
  if (cur === 5) renderGuided();
  if (cur === 6) renderGame();
  if (cur === 7) renderApply();
  if (cur === 8) renderMastery();
  if (cur === 9) renderFinal();
  scrollTo(0, 0);
}
document.getElementById("prev").onclick = () => go(cur - 1);
document.getElementById("next").onclick = () => go(cur + 1);
document.getElementById("nav").innerHTML = slides
  .map((s, i) => `<button onclick="go(${i})">${i + 1}. ${s[0]}</button>`)
  .join("");
function renderGuided() {
  document.getElementById("guided").innerHTML = guided
    .map(
      (q, i) =>
        `<div class="card" data-q="${i}"><b>${i + 1}. ${q[0]}</b><div class="choices"><button class="choice" onclick="ans(this,'${q[1]}','g',${i})">na</button><button class="choice" onclick="ans(this,'${q[1]}','g',${i})">-ng</button></div><div id="fg${i}" class="feedback"></div></div>`,
    )
    .join("");
}
function ans(btn, correct, k, i) {
  let card = btn.closest(".card");
  if (card.dataset.done) return;
  card.dataset.done = 1;
  let v = btn.textContent.trim(),
    f = document.getElementById("f" + k + i);
  card.querySelectorAll("button.choice").forEach((x) => (x.disabled = true));
  if (v === correct) {
    btn.classList.add("correct");
    f.className = "feedback show ok";
    f.innerHTML = "✅ Tama! " + (k === "g" ? guided[i][2] : "");
    scores[k] = (scores[k] || 0) + 1;
  } else {
    btn.classList.add("wrong");
    f.className = "feedback show no";
    f.innerHTML = "❌ Tamang sagot: <b>" + correct + "</b>.";
  }
  save();
}
function renderGame() {
  document.getElementById("game").innerHTML =
    `<div class="card"><h3>1. Piliin ang salita</h3><div class="tokens">${gameQs.map((q, i) => `<button class="token" onclick="selGame(${i})">${q[0]}</button>`).join("")}</div><div class="call">2. Piliin ang pang-angkop</div><div class="choices"><button class="choice" onclick="gameAns('na')">na</button><button class="choice" onclick="gameAns('-ng')">-ng</button></div><div id="gf" class="feedback"></div><p id="gp">0 / ${gameQs.length} completed</p></div>`;
}
function selGame(i) {
  gameSel = i;
  document
    .querySelectorAll(".token")
    .forEach((x, j) => x.classList.toggle("selected", j === i));
  let f = document.getElementById("gf");
  f.className = "feedback show";
  f.textContent = "Napili: " + gameQs[i][0] + ". Piliin ang pang-angkop.";
}
function gameAns(v) {
  let f = document.getElementById("gf");
  if (gameSel === null) {
    f.className = "feedback show no";
    f.textContent = "Pumili muna ng salita.";
    return;
  }
  if (gameDone.includes(gameSel)) return;
  let q = gameQs[gameSel];
  if (v === q[1]) {
    gameDone.push(gameSel);
    scores.game = (scores.game || 0) + 1;
    f.className = "feedback show ok";
    f.innerHTML = "✅ " + q[2];
    gameSel = null;
    document
      .querySelectorAll(".token")
      .forEach((x) => x.classList.remove("selected"));
  } else {
    f.className = "feedback show no";
    f.innerHTML = "❌ Tingnan ang hulihan ng <b>" + q[0] + "</b>.";
  }
  document.getElementById("gp").textContent =
    gameDone.length + " / " + gameQs.length + " completed";
  save();
}
function renderApply() {
  document.getElementById("apply").innerHTML = applyQs
    .map(
      (q, i) =>
        `<div class="card"><div class="sentence">${q[0].replace("___", `<select id="a${i}"><option value="">?</option><option>na</option><option>-ng</option></select>`)}</div><button class="btn bluebtn" onclick="checkApply(${i})">Suriin</button><div id="af${i}" class="feedback"></div></div>`,
    )
    .join("");
}
function checkApply(i) {
  let v = document.getElementById("a" + i).value,
    f = document.getElementById("af" + i),
    q = applyQs[i];
  if (!v) {
    f.className = "feedback show no";
    f.textContent = "Pumili muna.";
    return;
  }
  if (v === q[1]) {
    f.className = "feedback show ok";
    f.innerHTML = "✅ Tama! <b>" + q[2] + "</b>";
  } else {
    f.className = "feedback show no";
    f.innerHTML = "❌ Tamang sagot: <b>" + q[1] + "</b>. " + q[2];
  }
}
function renderMastery() {
  document.getElementById("mastery").innerHTML =
    mastery
      .map(
        (q, i) =>
          `<div class="card" data-m="${i}"><b>${i + 1}. ${q[0]}</b><div class="choices">${q[2].map((o) => `<button class="choice" onclick="mAns(this,${i},'${o}')">${o}</button>`).join("")}</div><div id="mf${i}" class="feedback"></div></div>`,
      )
      .join("") +
    `<div class="score"><span>Mastery Score</span><strong id="ms">0 / 8</strong><span id="mm">Sagutin ang lahat ng item.</span></div>`;
}
function mAns(btn, i, v) {
  let c = btn.closest("[data-m]");
  if (c.dataset.done) return;
  c.dataset.done = 1;
  let q = mastery[i],
    f = document.getElementById("mf" + i);
  c.querySelectorAll(".choice").forEach((x) => (x.disabled = true));
  if (v === q[1]) {
    btn.classList.add("correct");
    f.className = "feedback show ok";
    f.textContent = "✅ Tama!";
    scores.m = (scores.m || 0) + 1;
  } else {
    btn.classList.add("wrong");
    f.className = "feedback show no";
    f.innerHTML = "❌ Tamang sagot: <b>" + q[1] + "</b>";
  }
  document.getElementById("ms").textContent = (scores.m || 0) + " / 8";
  let d = document.querySelectorAll("[data-m][data-done]").length;
  document.getElementById("mm").textContent =
    d === 8 ? msg(scores.m || 0) : d + " / 8 answered";
  save();
}
function msg(s) {
  return s >= 7
    ? "Mahusay! Naipakita mo ang pag-unawa."
    : s >= 5
      ? "Maganda ang pag-unlad! Balikan ang ilang halimbawa."
      : "Patuloy na magsanay. Hanapin muna ang hulihan ng unang salita.";
}
function renderFinal() {
  document.getElementById("finalScore").textContent = (scores.m || 0) + " / 8";
  document.getElementById("finalMsg").textContent = msg(scores.m || 0);
}
function save() {
  localStorage.teFilPart2Scores = JSON.stringify(scores);
}
function zoom(img) {
  let o = document.createElement("div");
  o.style =
    "position:fixed;inset:0;background:#000d;z-index:100;display:grid;place-items:center;padding:15px;cursor:zoom-out";
  let x = new Image();
  x.src = img.src;
  x.alt = img.alt;
  x.style =
    "max-width:96vw;max-height:94vh;object-fit:contain;border-radius:12px";
  o.append(x);
  o.onclick = () => o.remove();
  document.body.append(o);
}
document.getElementById("fs").onclick = () =>
  document.fullscreenElement
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen?.();
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") go(cur + 1);
  if (e.key === "ArrowLeft") go(cur - 1);
  if (e.key.toLowerCase() === "f") document.getElementById("fs").click();
});
render();

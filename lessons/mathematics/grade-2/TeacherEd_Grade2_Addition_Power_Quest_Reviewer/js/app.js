
const state = {
  data:null, step:0, xp:0, sound:true, contrast:false, motion:false,
  current:null, answers:[], reviewIndex:0, masterIndex:0, score:0, missed:[],
  builder:{a:0,b:0}, match:{left:null,done:0}
};
const steps = ["WELCOME","ENGAGE","CONNECT","EXPLORE","LEARN","GUIDED PRACTICE","PRACTICE","THINK","REVIEW","CHECK","MASTER","REFLECT","CELEBRATE"];
const $ = s => document.querySelector(s);
const screen = $("#screen");

async function init(){
  try{
    const r = await fetch("data/lesson.json");
    state.data = await r.json();
    bindGlobal();
    renderWelcome();
  }catch(e){
    screen.innerHTML = `<div class="card"><h2>Lesson could not load.</h2><p>Open the folder with VS Code Live Server so the JSON file can load correctly.</p></div>`;
  }
}
function bindGlobal(){
  $("#soundBtn").onclick=()=>{state.sound=!state.sound; $("#soundBtn").textContent=state.sound?"Sound":"Muted"};
  $("#contrastBtn").onclick=()=>{state.contrast=!state.contrast;document.body.classList.toggle("high-contrast",state.contrast)};
  $("#motionBtn").onclick=()=>{state.motion=!state.motion;document.body.classList.toggle("reduce-motion",state.motion)};
  $("#teacherBtn").onclick=openTeacher;
  $("#modalClose").onclick=closeModal;
  loadProgress();
}
function updateHeader(label=steps[state.step]){
  $("#missionLabel").textContent=label;
  $("#xpLabel").textContent=`${state.xp} XP`;
  $("#progressBar").style.width=`${Math.round((state.step/(steps.length-1))*100)}%`;
}
function go(step){state.step=step; updateHeader(); ({1:renderEngage,2:renderConnect,3:renderExplore,4:renderLearn,5:renderGuided,6:renderPractice,7:renderThink,8:renderReview,9:renderCheck,10:renderMaster,11:renderReflect,12:renderCelebrate}[step]||renderWelcome)(); saveProgress();}
function addXP(n){state.xp+=n; updateHeader();}
function toast(msg){const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1500)}
function saveProgress(){localStorage.setItem("teacherEdAdditionQuest",JSON.stringify({xp:state.xp,step:state.step}));}
function loadProgress(){try{const x=JSON.parse(localStorage.getItem("teacherEdAdditionQuest"));if(x){state.xp=x.xp||0}}catch{}}
function resetProgress(){localStorage.removeItem("teacherEdAdditionQuest");state.xp=0;state.step=0;state.score=0;state.missed=[];toast("Progress reset.");renderWelcome();updateHeader()}

function renderWelcome(){
  updateHeader("WELCOME");
  const d=state.data;
  screen.innerHTML=`
  <section class="hero">
    <div class="card hero-main">
      <img class="logo-large" src="assets/TeacherEdLogo.png" alt="Teacher Ed Learning Hub">
      <div class="eyebrow">Grade 2 Mathematics Reviewer</div>
      <h1>${d.title}</h1>
      <p>${d.subtitle}</p>
      <div class="actions"><button class="btn gold" onclick="go(1)">START THE QUEST</button><button class="btn ghost" onclick="openQuickReview()">30-SECOND REVIEW</button></div>
    </div>
    <div class="card hero-side">
      <h3>Your Learning Mission</h3>
      <p>Review three connected skills:</p>
      <div class="rule-card"><strong>1. ADD WITHOUT REGROUPING</strong><br><small>Keep each place-value column separate.</small></div><br>
      <div class="rule-card"><strong>2. ADD WITH REGROUPING</strong><br><small>Trade 10 ones for 1 ten, or 10 tens for 1 hundred.</small></div><br>
      <div class="rule-card"><strong>3. PROPERTIES OF ADDITION</strong><br><small>Change places, change groups, or add zero.</small></div>
    </div>
  </section>
  <div class="section-title"><h2>What you will practice</h2><p>Learn → practice → think → prove what you know.</p></div>
  <div class="grid">
    ${d.objectives.map((x,i)=>`<div class="card mission-card"><span class="tag">Mission ${i+1}</span><h3>${x}</h3><p>Use an interactive task, a clue, and a mastery check.</p></div>`).join("")}
  </div>
  <div class="section-title"><h2>Memory Keys</h2></div>
  <div class="grid three">${d.properties.map(p=>`<div class="rule-card"><h3>${p.name}</h3><p>${p.rule}</p><span class="cue">${p.cue}</span><div class="example">${p.example}</div></div>`).join("")}</div>`;
}
function openQuickReview(){
  openModal(`<h2>30-Second Review</h2>
  <p><strong>ADDING WITHOUT REGROUPING:</strong> Add ones, tens, then hundreds. No column reaches 10.</p>
  <p><strong>ADDING WITH REGROUPING:</strong> If a column has 10 or more, trade 10 of that place for 1 of the next place.</p>
  <p><strong>COMMUTATIVE:</strong> Change places. <strong>ASSOCIATIVE:</strong> Change groups. <strong>IDENTITY:</strong> Add 0.</p>
  <div class="example">38 + 27 = 65</div>
  <p>8 + 7 = 15 → write 5 ones and regroup 1 ten.</p>`);
}
function renderEngage(){
  updateHeader("ENGAGE");
  screen.innerHTML=`<div class="section-title"><h2>ENGAGE — Build the Fastest Friendly Sum</h2><p>Find pairs that make 10. This wakes up your addition thinking.</p></div>
  <div class="card question-card">
    <div class="qnum">Warm-up</div><div class="question">Which pair makes 10?</div>
    <div class="choices">
      ${["2 + 8","3 + 6","4 + 5"].map((x,i)=>`<button class="choice" onclick="warm(${i})">${x}</button>`).join("")}
    </div>
    <div id="warmFeedback"></div>
  </div>`;
}
function warm(i){
  const f=$("#warmFeedback");
  if(i===0){addXP(10);f.innerHTML=`<div class="feedback"><strong>Great start!</strong> 2 + 8 = 10. Making 10 can make addition easier.</div><div class="actions"><button class="btn" onclick="go(2)">NEXT: CONNECT</button></div>`}
  else f.innerHTML=`<div class="feedback">Try again. Look for the pair that completes 10.</div>`;
}
function renderConnect(){
  updateHeader("CONNECT");
  screen.innerHTML=`<div class="section-title"><h2>CONNECT — Where do we add?</h2><p>Think about real classroom situations.</p></div>
  <div class="grid two">
    <div class="card"><h3>Math at the supply table</h3><p>There are 24 pencils in one box and 15 in another. What operation helps you find how many pencils there are altogether?</p>
      <div class="actions"><button class="btn" onclick="connectAnswer(true)">Addition</button><button class="btn ghost" onclick="connectAnswer(false)">Subtraction</button></div><div id="connectF"></div></div>
    <div class="card"><h3>Turn and Talk</h3><p><strong>Teacher prompt:</strong> “What does the word <em>altogether</em> tell us?”</p><div class="rule-card">Expected idea: We combine quantities, so we add.</div></div>
  </div>`;
}
function connectAnswer(ok){$("#connectF").innerHTML=ok?`<div class="feedback"><strong>Exactly.</strong> Addition combines quantities to find a total.</div><div class="actions"><button class="btn" onclick="addXP(10);go(3)">NEXT</button></div>`:`<div class="feedback">Think about combining two groups. Which operation finds the total?</div>`}
function renderExplore(){
  updateHeader("EXPLORE");
  screen.innerHTML=`<div class="section-title"><h2>EXPLORE — What changes when we add?</h2><p>Click each panel and discover the pattern before reading the rule.</p></div>
  <div class="grid three">
    <div class="card mission-card"><span class="tag">Discover 1</span><h3>23 + 14</h3><div class="example">23 + 14 = 37</div><p>Nothing needs to be traded because each column stays below 10.</p><button class="btn" onclick="reveal('r1','No regrouping: 3 + 4 = 7 and 2 + 1 = 3.')">REVEAL</button><div id="r1"></div></div>
    <div class="card mission-card"><span class="tag">Discover 2</span><h3>28 + 17</h3><div class="example">28 + 17 = 45</div><p>The ones make 15. We must trade 10 ones for 1 ten.</p><button class="btn" onclick="reveal('r2','Regrouping: 15 ones = 1 ten + 5 ones.')">REVEAL</button><div id="r2"></div></div>
    <div class="card mission-card"><span class="tag">Discover 3</span><h3>4 + 8 and 8 + 4</h3><div class="example">4 + 8 = 8 + 4</div><p>The order changes, but the sum does not.</p><button class="btn" onclick="reveal('r3','Commutative property: change places, same sum.')">REVEAL</button><div id="r3"></div></div>
  </div>
  <div class="actions"><button class="btn" onclick="addXP(15);go(4)">I DISCOVERED THE PATTERNS</button></div>`;
}
function reveal(id,msg){$("#"+id).innerHTML=`<div class="feedback">${msg}</div>`}
function renderLearn(){
  updateHeader("LEARN");
  const d=state.data;
  screen.innerHTML=`<div class="section-title"><h2>LEARN — The Addition Toolkit</h2><p>Use place value and the three properties as tools.</p></div>
  <div class="grid two">
    <div class="card"><h3>Adding Without Regrouping</h3><p>Line up the same place values. Add ones, then tens, then hundreds.</p>
      <div class="pv"><div><strong>Hundreds</strong><span>1</span></div><div><strong>Tens</strong><span>4</span></div><div><strong>Ones</strong><span>2</span></div></div>
      <div class="example">142 + 235 = 377</div><p><strong>Check:</strong> 2 + 5 = 7, 4 + 3 = 7, 1 + 2 = 3.</p></div>
    <div class="card"><h3>Adding With Regrouping</h3><p>When a place has 10 or more, trade.</p>
      <div class="example">28 + 17</div>
      <p>8 + 7 = 15 → write 5 ones, regroup 1 ten.</p><p>2 + 1 + 1 = 4 tens.</p><div class="example">28 + 17 = 45</div></div>
  </div>
  <div class="section-title"><h2>Properties of Addition</h2></div>
  <div class="grid three">${d.properties.map(p=>`<div class="rule-card"><h3>${p.name}</h3><p>${p.rule}</p><span class="cue">${p.cue}</span><div class="example">${p.example}</div></div>`).join("")}</div>
  <div class="card" style="margin-top:16px"><h3>Teacher Discussion Prompt</h3><p>Ask: “What stays the same when we change the order? What changes when we regroup? Why does adding zero leave a number unchanged?”</p></div>
  <div class="actions"><button class="btn" onclick="addXP(20);go(5)">I'M READY FOR GUIDED PRACTICE</button></div>`;
}
function renderGuided(){
  updateHeader("GUIDED PRACTICE");
  screen.innerHTML=`<div class="section-title"><h2>GUIDED PRACTICE — We Do It Together</h2><p>Follow the steps. Then try the next one.</p></div>
  <div class="card">
    <h3>Example 1: No Regrouping</h3><div class="example">125 + 243</div>
    <div class="grid three"><div class="rule-card"><strong>ONES</strong><p>5 + 3 = 8</p></div><div class="rule-card"><strong>TENS</strong><p>2 + 4 = 6</p></div><div class="rule-card"><strong>HUNDREDS</strong><p>1 + 2 = 3</p></div></div>
    <div class="example">125 + 243 = 368</div>
    <hr style="border:0;border-top:1px solid var(--line);margin:22px 0">
    <h3>Example 2: With Regrouping</h3><div class="example">156 + 278</div>
    <p>6 + 8 = 14 → write 4, regroup 1 ten.</p><p>5 + 7 + 1 = 13 → write 3, regroup 1 hundred.</p><p>1 + 2 + 1 = 4.</p><div class="example">156 + 278 = 434</div>
    <div class="actions"><button class="btn" onclick="go(6)">START THE GAMES</button></div>
  </div>`;
}
function renderPractice(){
  updateHeader("PRACTICE");
  screen.innerHTML=`<div class="section-title"><h2>PRACTICE — Choose Your Mission</h2><p>Each game trains a different part of your addition thinking.</p></div>
  <div class="grid three">
    <div class="card mission-card"><span class="tag">Game 1</span><h3>Addition Builder</h3><p>Build two numbers and predict their sum using place-value reasoning.</p><button class="btn" onclick="builderGame()">PLAY</button></div>
    <div class="card mission-card"><span class="tag">Game 2</span><h3>Regroup Rescue</h3><p>Find the place where 10 or more appears and make the correct trade.</p><button class="btn" onclick="regroupGame()">PLAY</button></div>
    <div class="card mission-card"><span class="tag">Game 3</span><h3>Property Detective</h3><p>Identify whether an equation shows change places, change groups, or add zero.</p><button class="btn" onclick="propertyGame()">PLAY</button></div>
  </div>
  <div class="card" style="margin-top:16px"><h3>Teacher Attention Cue</h3><p>Use the Teacher Mode button for “Eyes here,” “Think,” “Discuss,” and “Show your answer.”</p></div>`;
}
function builderGame(){
  const a=state.builder.a||0,b=state.builder.b||0;
  openModal(`<h2>Addition Builder</h2><p>Choose two numbers. Then predict the sum.</p>
    <div class="builder"><div class="card"><h3>Choose A</h3><div class="digit-box">${[12,24,35,41,53,62].map(n=>`<button class="digit" onclick="state.builder.a=${n};builderGame()">${n}</button>`).join("")}</div></div>
    <div class="card"><h3>Choose B</h3><div class="digit-box">${[13,21,25,32,44,16].map(n=>`<button class="digit" onclick="state.builder.b=${n};builderGame()">${n}</button>`).join("")}</div></div></div>
    <div class="sum-display">${a} + ${b} = ${a&&b?'<span id="pred">?</span>':'?'}</div>
    ${a&&b?`<div class="actions">${[a+b,a+b+10,a+b-10].map((n,i)=>`<button class="choice" onclick="builderCheck(${n},${a+b})">${n}</button>`).join("")}</div><div id="builderF"></div>`:""}
  `);
}
function builderCheck(n,ans){$("#builderF").innerHTML=n===ans?`<div class="feedback"><strong>Correct.</strong> ${ans} is the sum. You kept the place values aligned.</div><div class="actions"><button class="btn" onclick="addXP(15);closeModal();toast('Builder complete');">DONE</button></div>`:`<div class="feedback">Check each place value again. Add ones first, then tens.</div>`}
function regroupGame(){
  const q={a:68,b:27,ans:95};
  openModal(`<h2>Regroup Rescue</h2><p>Which step happens first?</p><div class="example">${q.a} + ${q.b}</div>
  <div class="choices"><button class="choice" onclick="regroupAnswer(false)">6 + 2 = 8</button><button class="choice" onclick="regroupAnswer(true)">8 + 7 = 15</button><button class="choice" onclick="regroupAnswer(false)">6 + 7 = 13</button></div><div id="regroupF"></div>`);
}
function regroupAnswer(ok){$("#regroupF").innerHTML=ok?`<div class="feedback"><strong>Yes.</strong> 8 + 7 = 15. Regroup 10 ones as 1 ten and keep 5 ones.</div><div class="actions"><button class="btn" onclick="addXP(15);closeModal();toast('Regroup rescue complete');">DONE</button></div>`:`<div class="feedback">Start with the ones column. Ask: “Do the ones make 10 or more?”</div>`}
function propertyGame(){
  const qs=[["7 + 4 = 4 + 7","Commutative"],["(3 + 5) + 2 = 3 + (5 + 2)","Associative"],["90 + 0 = 90","Identity"]];
  let i=0;
  function draw(){
    const q=qs[i]; openModal(`<h2>Property Detective</h2><p>Identify the property.</p><div class="example">${q[0]}</div><div class="choices">${["Commutative","Associative","Identity"].map(x=>`<button class="choice" onclick="propAnswer('${x}','${q[1]}',${i})">${x}</button>`).join("")}</div><div id="propF"></div>`);
  }
  draw();
}
window.propAnswer=(x,a,i)=>{if(x===a){state.xp+=10;if(i<2){closeModal();setTimeout(()=>{state.match.i=i+1;propertyNext(i+1)},150)}else{closeModal();toast("Property Detective complete");updateHeader()}}else $("#propF").innerHTML=`<div class="feedback">Not quite. ${a==="Commutative"?"Think: CHANGE PLACES.":a==="Associative"?"Think: CHANGE GROUPS.":"Think: ZERO CHANGES NOTHING."}</div>`};
function propertyNext(i){const qs=[["7 + 4 = 4 + 7","Commutative"],["(3 + 5) + 2 = 3 + (5 + 2)","Associative"],["90 + 0 = 90","Identity"]],q=qs[i];openModal(`<h2>Property Detective</h2><p>Round ${i+1} of 3</p><div class="example">${q[0]}</div><div class="choices">${["Commutative","Associative","Identity"].map(x=>`<button class="choice" onclick="propAnswer('${x}','${q[1]}',${i})">${x}</button>`).join("")}</div><div id="propF"></div>`)}

function renderThink(){
  updateHeader("THINK");
  screen.innerHTML=`<div class="section-title"><h2>THINK — Which strategy is smarter?</h2><p>Good mathematicians choose useful strategies, not just answers.</p></div>
  <div class="grid two">
    <div class="card"><h3>Challenge A</h3><div class="example">2 + 8 + 4 + 6</div><p>Which grouping makes this easiest?</p><div class="choices">${["(2+8) + (4+6)","(2+4) + (8+6)","2 + (8+4) + 6"].map((x,i)=>`<button class="choice" onclick="thinkAnswer(${i})">${x}</button>`).join("")}</div><div id="thinkF"></div></div>
    <div class="card"><h3>Explain Your Thinking</h3><p>Tell a partner:</p><div class="rule-card">“I chose this strategy because ______.”</div><p>Teacher listens for: making 10, changing grouping, and recognizing that the sum stays the same.</p></div>
  </div>`;
}
function thinkAnswer(i){$("#thinkF").innerHTML=i===0?`<div class="feedback"><strong>Strong strategy.</strong> 2 + 8 = 10 and 4 + 6 = 10, so the total is 20.</div><div class="actions"><button class="btn" onclick="addXP(20);go(8)">NEXT: REVIEW</button></div>`:`<div class="feedback">Look for two pairs that make 10.</div>`}

function renderReview(){
  updateHeader("REVIEW");
  state.reviewIndex=0;state.answers=[];state.score=0;state.missed=[];
  drawReview();
}
function drawReview(){
  const d=state.data, q=d.reviewItems[state.reviewIndex];
  screen.innerHTML=`<div class="section-title"><h2>REVIEW — Quick Recall</h2><p>Question ${state.reviewIndex+1} of ${d.reviewItems.length}</p></div>
  <div class="card question-card"><div class="qnum">${q.topic.toUpperCase()}</div><div class="question">${q.q}</div>
  <div class="choices">${q.options.map((x,i)=>`<button class="choice" onclick="reviewAnswer(${i})">${x}</button>`).join("")}</div>
  <div id="reviewF"></div><div class="actions"><button class="btn ghost" onclick="showHint('${escapeAttr(q.hint)}')">NEED A HINT?</button></div></div>`;
}
function reviewAnswer(i){
  const q=state.data.reviewItems[state.reviewIndex], ok=i===q.answer;
  document.querySelectorAll(".choice").forEach((b,idx)=>{if(idx===q.answer)b.classList.add("correct");if(idx===i&&!ok)b.classList.add("wrong")});
  if(ok){state.score++;addXP(8)}else state.missed.push(q);
  $("#reviewF").innerHTML=`<div class="feedback"><strong>${ok?"Correct!":"Let's learn from it."}</strong> ${q.why}</div>
  ${!ok?`<div class="hint"><strong>Hint:</strong> ${q.hint}</div>`:""}
  <div class="actions"><button class="btn" onclick="nextReview()">${state.reviewIndex<state.data.reviewItems.length-1?"NEXT":"FINISH REVIEW"}</button></div>`;
}
function nextReview(){if(state.reviewIndex<state.data.reviewItems.length-1){state.reviewIndex++;drawReview()}else{go(9)}}
function showHint(x){toast(x)}

function renderCheck(){
  updateHeader("CHECK");
  screen.innerHTML=`<div class="section-title"><h2>CHECK — Formative Assessment</h2><p>Show what you understand without help.</p></div>
  <div class="grid four"><div class="kpi"><strong>${state.score}</strong><span>Review Points</span></div><div class="kpi"><strong>${state.missed.length}</strong><span>Items to Revisit</span></div><div class="kpi"><strong>3</strong><span>Core Concepts</span></div><div class="kpi"><strong>1</strong><span>Final Mission</span></div></div>
  <div class="card" style="margin-top:16px"><h3>Before the final challenge</h3><p>Say these aloud:</p><div class="grid three">${state.data.properties.map(p=>`<div class="rule-card"><strong>${p.cue}</strong><p>${p.name}</p></div>`).join("")}</div><div class="actions"><button class="btn" onclick="go(10)">START MASTER CHALLENGE</button></div></div>`;
}
function renderMaster(){
  updateHeader("MASTER");
  state.masterIndex=0;state.masterScore=0;drawMaster();
}
function drawMaster(){
  const q=state.data.masterItems[state.masterIndex];
  screen.innerHTML=`<div class="section-title"><h2>MASTER — Addition Power Test</h2><p>Question ${state.masterIndex+1} of ${state.data.masterItems.length}. No shortcuts: think, solve, then choose.</p></div>
  <div class="card question-card"><div class="qnum">${q.topic.toUpperCase()}</div><div class="question">${q.q}</div><div class="choices">${q.options.map((x,i)=>`<button class="choice" onclick="masterAnswer(${i})">${x}</button>`).join("")}</div><div id="masterF"></div><div class="actions"><button class="btn ghost" onclick="showHint('Use the place-value columns. For properties, look for places, groups, or zero.')">NEED A HINT?</button></div></div>`;
}
function masterAnswer(i){
  const q=state.data.masterItems[state.masterIndex],ok=i===q.answer;
  document.querySelectorAll(".choice").forEach((b,idx)=>{if(idx===q.answer)b.classList.add("correct");if(idx===i&&!ok)b.classList.add("wrong")});
  if(ok){state.masterScore=(state.masterScore||0)+1;addXP(12)}
  $("#masterF").innerHTML=`<div class="feedback"><strong>${ok?"Correct.":"Keep learning."}</strong> ${q.why}</div><div class="actions"><button class="btn" onclick="nextMaster()">${state.masterIndex<state.data.masterItems.length-1?"NEXT":"SEE RESULTS"}</button></div>`;
}
function nextMaster(){if(state.masterIndex<state.data.masterItems.length-1){state.masterIndex++;drawMaster()}else{go(11)}}
function renderReflect(){
  updateHeader("REFLECT");
  const total=state.data.masterItems.length,score=state.masterScore||0,pct=Math.round(score/total*100);
  let status=pct>=90?"MASTERED":pct>=70?"DEVELOPING":"NEEDS PRACTICE";
  screen.innerHTML=`<div class="hero"><div class="card hero-main"><div class="eyebrow">Your Evidence of Learning</div><h1>${pct}%</h1><p>${score} out of ${total} mastery questions correct.</p><div class="actions"><button class="btn gold" onclick="go(12)">CELEBRATE</button><button class="btn ghost" onclick="retryMissed()">PRACTICE MISSED ITEMS</button></div></div>
  <div class="card"><h3>Result</h3><div class="rule-card"><h3>${status}</h3><p>${status==="MASTERED"?"You demonstrated strong understanding across addition and properties.":"Use the missed-item practice to strengthen the concepts before trying again."}</p></div><h3 style="margin-top:18px">Strengths</h3><p>${score>=9?"Addition accuracy and property recognition.":"Use of place value and careful checking."}</p><h3>Next Step</h3><p>Explain one answer to a partner without looking at the screen.</p></div></div>
  <div class="section-title"><h2>The 5 Things You Must Remember</h2></div>
  <div class="grid">${[
    ["1","ALIGN","Line up ones with ones, tens with tens, and hundreds with hundreds."],
    ["2","REGROUP","10 ones make 1 ten; 10 tens make 1 hundred."],
    ["3","CHANGE PLACES","Commutative: changing order does not change the sum."],
    ["4","CHANGE GROUPS","Associative: changing grouping does not change the sum."],
    ["5","ZERO","Identity: adding zero keeps the number the same."]
  ].map(x=>`<div class="rule-card"><span class="chip">${x[0]}</span><h3>${x[1]}</h3><p>${x[2]}</p></div>`).join("")}</div>`;
}
function retryMissed(){
  if(!state.missed.length){toast("No missed review items. Great work!");return}
  const q=state.missed[0];
  openModal(`<h2>Let's Review That Again</h2><p><strong>${q.q}</strong></p><div class="rule-card"><h3>Remember</h3><p>${q.why}</p><span class="cue">Hint: ${q.hint}</span></div><div class="actions"><button class="btn" onclick="closeModal();toast('Use the memory cue, then try the master challenge again.');">GOT IT</button></div>`);
}
function renderCelebrate(){
  updateHeader("CELEBRATE");
  screen.innerHTML=`<div class="card hero-main" style="text-align:center"><img class="logo-large" src="assets/TeacherEdLogo.png" alt="Teacher Ed Learning Hub"><div class="eyebrow">Mission Complete</div><h1>YOU DID THE MATH!</h1><p>You practiced addition, regrouping, and the properties of addition. The goal was not just to get answers — it was to understand why the strategies work.</p><div class="actions" style="justify-content:center"><button class="btn gold" onclick="openQuickReview()">REVIEW AGAIN</button><button class="btn ghost" onclick="resetProgress()">RESET PROGRESS</button></div></div>
  <div class="section-title"><h2>Teacher Debrief</h2><p>Use these prompts after the reviewer.</p></div>
  <div class="grid three"><div class="card"><h3>Explain</h3><p>“How do you know when to regroup?”</p></div><div class="card"><h3>Compare</h3><p>“How are commutative and associative properties different?”</p></div><div class="card"><h3>Apply</h3><p>“Where might you use addition properties to make a calculation easier?”</p></div></div>`;
}
function openTeacher(){
  openModal(`<h2>Teacher Mode</h2><p>Use these classroom attention signals while presenting the reviewer.</p>
  <div class="teacher-panel">${["EYES HERE IN 3…2…1","THINK — DON'T ANSWER YET","TURN AND TALK","SHOW YOUR ANSWER","30-SECOND CHALLENGE","RESET — LOOK AT THE SCREEN"].map(x=>`<button class="signal" onclick="showSignal('${x}')">${x}</button>`).join("")}</div>
  <div class="actions"><button class="btn red" onclick="resetProgress();closeModal()">RESET STUDENT PROGRESS</button></div>`);
}
function showSignal(x){closeModal();toast(x)}
function openModal(html){$("#modalContent").innerHTML=html;$("#modal").classList.remove("hidden");$("#modal").setAttribute("aria-hidden","false")}
function closeModal(){$("#modal").classList.add("hidden");$("#modal").setAttribute("aria-hidden","true")}
function escapeAttr(s){return String(s).replaceAll("'","&#39;")}
window.go=go;window.addXP=addXP;window.openQuickReview=openQuickReview;window.builderGame=builderGame;window.regroupGame=regroupGame;window.propertyGame=propertyGame;window.builderCheck=builderCheck;window.regroupAnswer=regroupAnswer;window.showHint=showHint;window.closeModal=closeModal;window.resetProgress=resetProgress;window.retryMissed=retryMissed;window.openTeacher=openTeacher;window.showSignal=showSignal;
init();

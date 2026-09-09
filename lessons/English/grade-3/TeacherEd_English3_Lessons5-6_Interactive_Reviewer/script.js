(() => {
  "use strict";

  const KEY = "teacherEdEnglish3L56";
  const defaultState = {
    stars: 0, badges: [], best: 0, completed: [],
    practiceDone: false, gamesDone: 0, masteryDone: false, reflection: ""
  };
  let state = loadState();
  let toastTimer;

  function loadState(){
    try { return {...defaultState, ...(JSON.parse(localStorage.getItem(KEY)) || {})}; }
    catch(e){ return {...defaultState}; }
  }
  function saveState(){ localStorage.setItem(KEY, JSON.stringify(state)); updateDashboard(); }
  function addStars(n){ state.stars += n; saveState(); }
  function badge(name){
    if(!state.badges.includes(name)){ state.badges.push(name); toast("🏆 Badge unlocked: " + name); saveState(); }
  }
  function toast(msg){
    const el = document.getElementById("toast");
    el.textContent = msg; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2600);
  }
  function updateDashboard(){
    document.getElementById("starCount").textContent=state.stars;
    document.getElementById("badgeCount").textContent=state.badges.length;
    document.getElementById("bestScore").textContent=state.best+"%";
    const done = new Set(state.completed || []);
    const pct = Math.round((done.size/6)*100);
    document.getElementById("progressText").textContent=pct+"% complete";
    document.getElementById("progressBar").style.width=pct+"%";
    document.querySelectorAll(".journey-step").forEach((b,i)=>{
      b.classList.toggle("done", done.has(String(i+1)));
      b.classList.toggle("active", i===0 || done.has(String(i)));
    });
  }
  function completeStep(n){
    if(!state.completed.includes(String(n))){ state.completed.push(String(n)); saveState(); }
  }
  function go(hash){
    const el=document.querySelector(hash);
    if(el) el.scrollIntoView({behavior:"smooth",block:"start"});
  }
  document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));

  // Mobile nav
  const menuBtn=document.getElementById("menuBtn"), nav=document.getElementById("mainNav");
  menuBtn.addEventListener("click",()=>{
    const open=nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded",open);
  });
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

  // Word meanings
  function wireWordChips(selector, outputId){
    document.querySelectorAll(selector).forEach(chip=>{
      chip.addEventListener("click",()=>{
        const out=document.getElementById(outputId);
        out.className="feedback-box good";
        out.innerHTML="<strong>"+chip.dataset.word+"</strong> — "+chip.dataset.def+".";
        addStars(1);
      });
    });
  }
  wireWordChips("#learn .word-chip","wordMeaning");
  wireWordChips("#l6 .word-chip","wordMeaning2");

  // Guided practice
  document.querySelectorAll("[data-guided] button").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const out=document.getElementById("guidedFeedback");
      document.querySelectorAll("[data-guided] button").forEach(x=>x.classList.remove("correct","incorrect"));
      if(btn.dataset.correct==="true"){
        btn.classList.add("correct"); out.className="feedback-box good";
        out.textContent="Excellent! “Huge” means extremely large.";
        addStars(2); completeStep(3);
      } else {
        btn.classList.add("incorrect"); out.className="feedback-box try";
        out.textContent="Let's think again. Look for the word that means extremely large.";
      }
    });
  });
  document.getElementById("guidedHint").addEventListener("click",()=>{
    const out=document.getElementById("guidedFeedback");
    out.className="feedback-box try"; out.textContent="💡 Hint: Think of something very, very big.";
  });

  // Tabs
  document.querySelectorAll(".tab").forEach(tab=>{
    tab.addEventListener("click",()=>{
      document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p=>p.classList.remove("active"));
      tab.classList.add("active"); document.getElementById(tab.dataset.tab).classList.add("active");
      if(tab.dataset.tab==="l6") completeStep(2);
    });
  });

  // Independent practice
  const practiceQuestions = [
    {q:"In the story, who keeps moving while the hare sleeps?", c:["The tortoise","The dog","The mouse"], a:0, h:"Think about the two racers."},
    {q:"Which word means “a contest of speed”?", c:["race","boring","proud"], a:0, h:"It is what the hare and tortoise are doing."},
    {q:"Which word is a CVC word?", c:["fun","tree","mango"], a:0, h:"Look for consonant-vowel-consonant."},
    {q:"What is the lesson of The Hare and the Tortoise?", c:["Do not underestimate others.","Always sleep during a race.","Only fast people succeed."], a:0, h:"Think about the tortoise's steady effort."},
    {q:"Which word can help you understand “lovely” in the sentence from Lesson 6?", c:["beautiful","construction","furious"], a:0, h:"The clue says the mouse looks more pleasing with her hat."}
  ];
  let pIndex=0,pScore=0,pAnswered=false;
  function renderPractice(){
    const item=practiceQuestions[pIndex];
    document.getElementById("practiceCounter").textContent="Question "+(pIndex+1)+" of "+practiceQuestions.length;
    document.getElementById("practiceScore").textContent=pScore+" / "+practiceQuestions.length;
    document.getElementById("practiceQuestion").innerHTML="<h3>"+item.q+"</h3>";
    const box=document.getElementById("practiceChoices"); box.innerHTML="";
    item.c.forEach((choice,i)=>{
      const b=document.createElement("button"); b.textContent=choice;
      b.addEventListener("click",()=>answerPractice(i));
      box.appendChild(b);
    });
    const f=document.getElementById("practiceFeedback"); f.className="feedback-box neutral"; f.textContent="Choose the best answer.";
    document.getElementById("practiceNext").disabled=true;pAnswered=false;
  }
  function answerPractice(i){
    if(pAnswered)return; pAnswered=true;
    const item=practiceQuestions[pIndex], buttons=[...document.querySelectorAll("#practiceChoices button")];
    buttons[i].classList.add(i===item.a?"correct":"incorrect");
    const f=document.getElementById("practiceFeedback");
    if(i===item.a){pScore++;addStars(2);f.className="feedback-box good";f.textContent="Great job! That's right.";buttons[i].classList.add("correct")}
    else {f.className="feedback-box try";f.textContent="Let's try again next time. Hint: "+item.h;buttons[item.a].classList.add("correct")}
    document.getElementById("practiceScore").textContent=pScore+" / "+practiceQuestions.length;
    document.getElementById("practiceNext").disabled=false;
  }
  document.getElementById("practiceNext").addEventListener("click",()=>{
    if(!pAnswered)return;
    if(pIndex<practiceQuestions.length-1){pIndex++;renderPractice()}
    else{
      state.practiceDone=true;completeStep(3);badge("Practice Pro");toast("🎉 Guided + independent practice complete!");
      document.getElementById("practiceNext").textContent="Review Again";
      pIndex=0;pScore=0;setTimeout(renderPractice,500);
    }
  });
  document.getElementById("practiceHint").addEventListener("click",()=>{
    const item=practiceQuestions[pIndex];
    const f=document.getElementById("practiceFeedback");f.className="feedback-box try";f.textContent="💡 Hint: "+item.h;
  });
  renderPractice();

  // Scenario application
  document.querySelectorAll(".scenario-options").forEach(group=>{
    group.querySelectorAll("button").forEach(btn=>{
      btn.addEventListener("click",()=>{
        const fb=group.parentElement.querySelector(".scenario-feedback");
        group.querySelectorAll("button").forEach(x=>x.classList.remove("correct","incorrect"));
        if(btn.dataset.correct==="true"){btn.classList.add("correct");fb.className="feedback-box good";fb.textContent="Excellent! You applied the lesson.";addStars(2);completeStep(5)}
        else{btn.classList.add("incorrect");fb.className="feedback-box try";fb.textContent="Good thinking. Let's use the story lesson to choose a better response."; }
      });
    });
  });

  // Games
  const gameArea=document.getElementById("gameArea"), gameContent=document.getElementById("gameContent"), gameTitle=document.getElementById("gameTitle");
  document.querySelectorAll(".game-launch").forEach(b=>b.addEventListener("click",()=>startGame(b.dataset.game)));
  document.getElementById("closeGame").addEventListener("click",()=>gameArea.hidden=true);

  function startGame(type){
    gameArea.hidden=false;gameArea.scrollIntoView({behavior:"smooth",block:"center"});
    if(type==="quick") quickGame();
    if(type==="match") matchGame();
    if(type==="sort") sortGame();
    if(type==="pair") pairGame();
  }
  function finishGame(msg){
    addStars(3);state.gamesDone++;completeStep(4);badge("Game Explorer");toast("⭐ "+msg);
  }
  function quickGame(){
    gameTitle.textContent="🎯 Quick Pick";
    const qs=[
      ["“proud” means…",["having high self-esteem","uninterested","a speed contest"],0],
      ["“boring” means…",["extremely large","uninterested","agreed"],1],
      ["“consented” means…",["agreed","angry","moving slowly"],0],
      ["“furious” means…",["very angry","beautiful","extremely large"],0]
    ];
    let i=0,score=0;
    const render=()=>{
      const q=qs[i];gameContent.innerHTML="<div class='question-label'>QUESTION "+(i+1)+" OF "+qs.length+"</div><h3>"+q[0]+"</h3><div class='choice-grid' id='gChoices'></div><div class='feedback-box neutral' id='gFb'>Choose the best answer.</div>";
      q[1].forEach((x,j)=>{const b=document.createElement("button");b.textContent=x;b.onclick=()=>{if(b.disabled)return;[...document.querySelectorAll("#gChoices button")].forEach(z=>z.disabled=true);if(j===q[2]){b.classList.add("correct");score++;addStars(2);document.getElementById("gFb").className="feedback-box good";document.getElementById("gFb").textContent="Excellent!";}else{b.classList.add("incorrect");document.getElementById("gFb").className="feedback-box try";document.getElementById("gFb").textContent="Let's think again. The correct idea is shown.";document.querySelectorAll("#gChoices button")[q[2]].classList.add("correct")}setTimeout(()=>{i++;i<qs.length?render():finishGame("Quick Pick complete! "+score+"/"+qs.length+" correct.")},650)};document.getElementById("gChoices").appendChild(b)})
    }; render();
  }
  function matchGame(){
    gameTitle.textContent="🧩 Match It";
    const pairs=[["huge","extremely large"],["race","contest of speed"],["lovely","beautiful or pleasing"],["consented","agreed"]];
    let cards=[];pairs.forEach((p,i)=>{cards.push({id:i,text:p[0],pair:i,type:"word"});cards.push({id:i+10,text:p[1],pair:i,type:"def"})});
    cards.sort(()=>Math.random()-.5);let selected=null,matched=0;
    gameContent.innerHTML="<p>Tap a word, then tap its meaning.</p><div class='match-board' id='matchBoard'></div>";
    const board=document.getElementById("matchBoard");
    cards.forEach(card=>{const b=document.createElement("button");b.className="match-card";b.textContent=card.text;b.onclick=()=>{if(b.classList.contains("matched"))return;if(!selected){selected={card,b};b.classList.add("selected");return}if(selected.card.pair===card.pair && selected.card.type!==card.type){b.classList.add("matched");selected.b.classList.add("matched");selected.b.classList.remove("selected");matched++;selected=null;if(matched===pairs.length){finishGame("All matches found!");}}else{b.classList.add("selected");setTimeout(()=>{b.classList.remove("selected");selected?.b.classList.remove("selected");selected=null},450)}};board.appendChild(b)});
  }
  function sortGame(){
    gameTitle.textContent="🗂️ Sort the Clue";
    const items=[
      ["huge","Vocabulary word",0],["beautiful","Context clue",1],["proud","Vocabulary word",0],["agreed","Context clue",1],["lovely","Vocabulary word",0],["site","Word pair",2]
    ];
    let i=0,score=0;
    const render=()=>{const x=items[i];gameContent.innerHTML="<div class='question-label'>SORT IT</div><h3>Where does <strong>"+x[0]+"</strong> belong?</h3><div class='choice-grid' id='sortChoices'><button>Vocabulary word</button><button>Context clue</button><button>Word pair</button></div><div class='feedback-box neutral' id='sortFb'>Choose a group.</div>";document.querySelectorAll("#sortChoices button").forEach((b,j)=>b.onclick=()=>{if(j===x[2]){b.classList.add("correct");score++;addStars(1);document.getElementById("sortFb").className="feedback-box good";document.getElementById("sortFb").textContent="That's right!";}else{b.classList.add("incorrect");document.getElementById("sortFb").className="feedback-box try";document.getElementById("sortFb").textContent="Let's think again.";document.querySelectorAll("#sortChoices button")[x[2]].classList.add("correct")}setTimeout(()=>{i++;i<items.length?render():finishGame("Sorting game complete! "+score+"/"+items.length+" correct.")},500)});};render();
  }
  function pairGame(){
    gameTitle.textContent="🔎 Find the Pair";
    const qs=[
      ["Mayon Volcano is a beautiful ___ .",["sight","site"],0],
      ["The construction ___ is busy.",["sight","site"],1],
      ["A beautiful ___ can be something you see.",["sight","site"],0],
      ["A building project has a ___ where work happens.",["sight","site"],1]
    ];
    let i=0,score=0;
    const render=()=>{const q=qs[i];gameContent.innerHTML="<div class='question-label'>FIND IT • "+(i+1)+"/"+qs.length+"</div><h3>"+q[0]+"</h3><div class='choice-grid' id='pairChoices'></div><div class='feedback-box neutral' id='pairFb'>Choose the word that fits.</div>";q[1].forEach((x,j)=>{const b=document.createElement("button");b.textContent=x;b.onclick=()=>{if(j===q[2]){b.classList.add("correct");score++;addStars(1);document.getElementById("pairFb").className="feedback-box good";document.getElementById("pairFb").textContent="Great job!";}else{b.classList.add("incorrect");document.getElementById("pairFb").className="feedback-box try";document.getElementById("pairFb").textContent="Remember: sight = seeing; site = a place.";document.querySelectorAll("#pairChoices button")[q[2]].classList.add("correct")}document.querySelectorAll("#pairChoices button").forEach(z=>z.disabled=true);setTimeout(()=>{i++;i<qs.length?render():finishGame("Sight/Site game complete! "+score+"/"+qs.length+" correct.")},550)};document.getElementById("pairChoices").appendChild(b)})};render();
  }

  // Mastery
  const mastery = [
    {q:"What kind of story is The Hare and the Tortoise?",c:["A fable","A recipe","A letter"],a:0,h:"It uses animal characters and teaches a lesson."},
    {q:"Why did the hare sleep?",c:["He thought the tortoise was far behind.","He was sick.","He was looking for the mango tree."],a:0,h:"The hare was very confident."},
    {q:"Which is the best lesson from the race?",c:["Do not underestimate others.","Always be first.","Never practice."],a:0,h:"Think about what the tortoise accomplished."},
    {q:"Which word means “uninterested”?",c:["boring","huge","challenge"],a:0,h:"It describes something that is not interesting."},
    {q:"Which is a CVC word from the reading practice?",c:["him","tree","tortoise"],a:0,h:"Look for consonant-vowel-consonant."},
    {q:"What helps a reader understand an unfamiliar word?",c:["Context clues","A race","A title only"],a:0,h:"Look at nearby words."},
    {q:"Which word is a context clue for “lovely” in the lesson example?",c:["beautiful","construction","furious"],a:0,h:"It describes the mouse as pleasing."},
    {q:"The cat proposed marriage. The mouse consented. What does consented mean?",c:["agreed","crept","became angry"],a:0,h:"She accepted the offer."},
    {q:"Choose the correct word: “The construction ___ is busy.”",c:["site","sight","sat"],a:0,h:"A site is a place."},
    {q:"What is the main warning in The Lovely Mouse?",c:["Looks can be deceiving.","Fast is always best.","Never make friends."],a:0,h:"The mouse judged by appearance and was surprised by the cat's behavior."}
  ];
  let mIndex=0,mScore=0,mMissed=[],mAnswered=false;
  function renderMastery(){
    const q=mastery[mIndex];mAnswered=false;
    document.getElementById("masteryCounter").textContent="Question "+(mIndex+1)+" of "+mastery.length;
    document.getElementById("masteryScore").textContent=mScore+" correct";
    document.getElementById("masteryQuestion").innerHTML="<h3>"+q.q+"</h3>";
    const box=document.getElementById("masteryChoices");box.innerHTML="";
    q.c.forEach((x,i)=>{const b=document.createElement("button");b.textContent=x;b.onclick=()=>answerMastery(i);box.appendChild(b)});
    document.getElementById("masteryFeedback").className="feedback-box neutral";document.getElementById("masteryFeedback").textContent="Choose the best answer.";
    document.getElementById("masteryNext").disabled=true;
  }
  function answerMastery(i){
    if(mAnswered)return;mAnswered=true;const q=mastery[mIndex],buttons=[...document.querySelectorAll("#masteryChoices button")];
    if(i===q.a){mScore++;addStars(3);buttons[i].classList.add("correct");document.getElementById("masteryFeedback").className="feedback-box good";document.getElementById("masteryFeedback").textContent="Excellent! That's right."}
    else{buttons[i].classList.add("incorrect");buttons[q.a].classList.add("correct");mMissed.push({q:q.q,answer:q.c[q.a],hint:q.h});document.getElementById("masteryFeedback").className="feedback-box try";document.getElementById("masteryFeedback").textContent="Let's think again. Hint: "+q.h}
    document.getElementById("masteryNext").disabled=false;
  }
  document.getElementById("masteryNext").addEventListener("click",()=>{
    if(!mAnswered)return;
    if(mIndex<mastery.length-1){mIndex++;renderMastery()}
    else showResults();
  });
  document.getElementById("masteryHint").addEventListener("click",()=>{
    const q=mastery[mIndex],f=document.getElementById("masteryFeedback");f.className="feedback-box try";f.textContent="💡 Hint: "+q.h;
  });
  function showResults(){
    const pct=Math.round((mScore/mastery.length)*100);state.best=Math.max(state.best,pct);state.masteryDone=true;completeStep(6);
    if(pct>=90)badge("Lesson Master");else if(pct>=80)badge("Smart Thinker");else badge("Great Effort");
    const stars="★★★★★".slice(0,Math.max(1,Math.ceil(pct/20)));
    const result=document.getElementById("results");result.hidden=false;
    result.innerHTML="<div class='results-score'>"+pct+"%</div><div class='stars'>"+stars+"</div><h3>"+(pct>=90?"Lesson Master!":pct>=80?"Almost There!":pct>=70?"Good Progress!":"Keep Practicing!")+"</h3><p>You answered <strong>"+mScore+" / "+mastery.length+"</strong> correctly.</p><div class='results-actions'><button class='btn primary' id='tryAgain'>Try Again</button><button class='btn ghost' id='practiceMistakes'>Practice My Mistakes</button><button class='btn ghost' id='backMap'>Back to Game Map</button></div>";
    result.scrollIntoView({behavior:"smooth",block:"center"});
    document.getElementById("tryAgain").onclick=()=>{mIndex=0;mScore=0;mMissed=[];result.hidden=true;renderMastery()};
    document.getElementById("backMap").onclick=()=>go("#games");
    document.getElementById("practiceMistakes").onclick=showMistakes;
    const mistakes=document.getElementById("mistakes");mistakes.hidden=mMissed.length===0;
    if(mMissed.length) renderMistakes();
  }
  function renderMistakes(){
    const list=document.getElementById("mistakeList");list.innerHTML="";
    mMissed.forEach((x,i)=>{const d=document.createElement("div");d.className="mistake-item";d.innerHTML="<strong>"+(i+1)+". "+x.q+"</strong><p>Remember: "+x.h+"</p><p><strong>Correct idea:</strong> "+x.answer+"</p>";list.appendChild(d)});
  }
  function showMistakes(){const m=document.getElementById("mistakes");m.hidden=false;renderMistakes();m.scrollIntoView({behavior:"smooth",block:"center"})}
  renderMastery();

  // Reflection
  document.querySelectorAll("[data-reflect]").forEach(b=>b.addEventListener("click",()=>{
    state.reflection=b.dataset.reflect;saveState();
    document.getElementById("reflectionSaved").textContent="Saved: "+state.reflection;
    toast("💭 Reflection saved.");
  }));

  // Continue button
  document.getElementById("continueBtn").addEventListener("click",()=>{
    const done=new Set(state.completed);
    if(!done.has("2"))go("#learn"); else if(!done.has("3"))go("#practice"); else if(!done.has("4"))go("#games"); else if(!done.has("5"))go("#apply"); else go("#mastery");
  });

  // Reset
  document.getElementById("resetProgress").addEventListener("click",()=>{
    if(confirm("Reset all English 3 reviewer progress, stars, badges, and best score?")){
      localStorage.removeItem(KEY);state={...defaultState};updateDashboard();toast("Progress reset. You can start again!");
    }
  });

  updateDashboard();
})();

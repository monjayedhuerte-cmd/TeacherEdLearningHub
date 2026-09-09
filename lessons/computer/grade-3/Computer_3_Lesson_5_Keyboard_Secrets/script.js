// ---------------- Progress ----------------
  const sections = ["learn","symbols","numpad","calculator","practice","quiz"];
  function updateProgress(){
    const y = window.scrollY + window.innerHeight * .55;
    let done = 0;
    sections.forEach(id=>{
      const el=document.getElementById(id);
      if(el && y >= el.offsetTop) done++;
    });
    const pct=Math.min(100,Math.round(done/sections.length*100));
    document.getElementById("progress").style.width=pct+"%";
    document.getElementById("progressText").textContent="Lesson progress: "+pct+"%";
  }
  window.addEventListener("scroll",updateProgress);
  updateProgress();

  function toast(msg){
    const t=document.getElementById("toast");
    t.textContent=msg;t.classList.add("show");
    setTimeout(()=>t.classList.remove("show"),2200);
  }

  // ---------------- Symbols ----------------
  function showSymbol(symbol, shortcut){
    document.getElementById("symbolOutput").innerHTML=symbol;
    document.getElementById("symbolHint").textContent=symbol+" is typed with "+shortcut+".";
    toast("Keyboard secret revealed!");
  }

  function toggleAcc(btn){
    btn.nextElementSibling.classList.toggle("show");
  }

  // ---------------- Number pad ----------------
  let numLock=true;
  function toggleNumLock(){
    numLock=!numLock;
    const btn=document.getElementById("numLockBtn");
    btn.textContent="Num Lock: "+(numLock?"ON":"OFF");
    btn.className="btn "+(numLock?"gold":"red");
    toast("Num Lock is now "+(numLock?"ON":"OFF"));
  }
  function npPress(k){
    const out=document.getElementById("npDisplay");
    if(k==="Num Lock"){toggleNumLock();return}
    if(["7","8","9","4","5","6","1","2","3","0","."].includes(k) && !numLock){
      toast(k+" would act as a navigation/cursor key when Num Lock is off.");
      return;
    }
    if(k==="Enter"){out.value += " [Enter] ";return}
    out.value += k;
  }

  // ---------------- Calculator ----------------
  let calcExpr="";
  function calcInput(v){
    if(calcExpr==="0" && /[0-9.]/.test(v)) calcExpr="";
    calcExpr+=v;
    document.getElementById("calcDisplay").value=calcExpr;
  }
  function calcClear(){
    calcExpr="";
    document.getElementById("calcDisplay").value="0";
  }
  function calcBack(){
    calcExpr=calcExpr.slice(0,-1);
    document.getElementById("calcDisplay").value=calcExpr||"0";
  }
  function calcEquals(){
    try{
      if(!/^[0-9+*/().\s-]+$/.test(calcExpr)) throw Error();
      const result=Function("return ("+calcExpr+")")();
      if(!Number.isFinite(result)) throw Error();
      calcExpr=String(result);
      document.getElementById("calcDisplay").value=calcExpr;
    }catch(e){
      document.getElementById("calcDisplay").value="Error";
      calcExpr="";
    }
  }

  // ---------------- Typing ----------------
  function checkTyping(){
    const target=document.getElementById("typingTarget").innerText;
    const typed=document.getElementById("typingInput").value;
    const max=Math.max(target.length,typed.length);
    let same=0;
    for(let i=0;i<Math.min(target.length,typed.length);i++) if(target[i]===typed[i]) same++;
    const accuracy=max?Math.round(same/max*100):0;
    document.getElementById("typingScore").textContent="Accuracy: "+accuracy+"%";
    toast(accuracy===100?"Perfect typing!":"Keep practicing the keyboard symbols.");
  }
  function clearTyping(){
    document.getElementById("typingInput").value="";
    document.getElementById("typingScore").textContent="Accuracy: —";
  }

  // ---------------- Unscramble ----------------
  const words=[
    {scramble:"DPA",answer:"PAD"},
    {scramble:"YEK",answer:"KEY"},
    {scramble:"KCO LUMN",answer:"NUM LOCK"},
    {scramble:"DRABYKOAE",answer:"KEYBOARD"},
    {scramble:"LACCLATUOR",answer:"CALCULATOR"}
  ];
  let currentWord=0;
  function newScramble(){
    currentWord=(currentWord+1)%words.length;
    document.getElementById("scrambleWord").textContent=words[currentWord].scramble;
    document.getElementById("scrambleInput").value="";
    document.getElementById("scrambleFeedback").textContent="";
  }
  function checkScramble(){
    const ans=document.getElementById("scrambleInput").value.trim().toUpperCase();
    const correct=words[currentWord].answer;
    const f=document.getElementById("scrambleFeedback");
    if(ans===correct){f.textContent="✓ Correct!";f.style.color="var(--green)";toast("Great job!");}
    else{f.textContent="Try again. Think about the keyboard lesson.";f.style.color="var(--red)";}
  }

  function symbolQuiz(btn,correct){
    document.querySelectorAll(".option").forEach(b=>b.classList.remove("correct","wrong"));
    btn.classList.add(correct?"correct":"wrong");
    document.getElementById("symbolQuizFeedback").textContent=correct?"✓ Correct! Shift + 4 types $.":"✗ Try again. Look at the number-row symbols.";
    document.getElementById("symbolQuizFeedback").style.color=correct?"var(--green)":"var(--red)";
  }

  // ---------------- Main quiz ----------------
  const quiz=[
    {q:"Where is the number pad usually found on a standard keyboard?",a:["At the far right","Above the monitor","Under the space bar","On the left side"],c:0},
    {q:"What key should be pressed together with a number key to type the character above it?",a:["Enter","Shift","Tab","Caps Lock"],c:1},
    {q:"Which shortcut types the dollar sign ($)?",a:["Shift + 2","Shift + 3","Shift + 4","Shift + 5"],c:2},
    {q:"What should be on when using the number pad to enter numbers?",a:["Caps Lock","Scroll Lock","Num Lock","Tab Lock"],c:2},
    {q:"Which number-pad key is used to add numbers?",a:["−","/","+","*"],c:2},
    {q:"Which key is described as being like the '=' sign on a calculator?",a:["Enter","Shift","Num Lock","Tab"],c:0},
    {q:"The number pad can help make it easier to enter large amounts of what?",a:["Pictures","Numerical data","Music","Videos"],c:1}
  ];
  function renderQuiz(){
    document.getElementById("quizBox").innerHTML=quiz.map((item,i)=>`
      <div class="quiz-question">
        <b>${i+1}. ${item.q}</b>
        ${item.a.map((opt,j)=>`<button class="option" name="q${i}" data-q="${i}" data-a="${j}" onclick="chooseQuiz(this)">${opt}</button>`).join("")}
      </div>
    `).join("");
  }
  function chooseQuiz(btn){
    const q=btn.dataset.q;
    document.querySelectorAll(`[data-q="${q}"]`).forEach(b=>b.classList.remove("correct","wrong"));
    btn.classList.add("selected");
    btn.style.outline="3px solid #d9e6f5";
  }
  function submitQuiz(){
    let score=0,answered=0;
    quiz.forEach((item,i)=>{
      const selected=document.querySelector(`[data-q="${i}"].selected`);
      const buttons=document.querySelectorAll(`[data-q="${i}"]`);
      buttons.forEach(b=>b.classList.remove("correct","wrong"));
      if(selected){
        answered++;
        const ok=Number(selected.dataset.a)===item.c;
        selected.classList.add(ok?"correct":"wrong");
        if(ok) score++;
      }
    });
    document.getElementById("quizScore").textContent="Score: "+score+"/"+quiz.length;
    toast(answered<quiz.length?"Answer all questions for a complete score.":"Quiz submitted!");
  }
  function resetQuiz(){
    renderQuiz();
    document.getElementById("quizScore").textContent="Score: —";
  }
  renderQuiz();

  function finishLesson(){
    localStorage.setItem("computer3_lesson5_complete","true");
    document.getElementById("progress").style.width="100%";
    document.getElementById("progressText").textContent="Lesson progress: 100% — Complete!";
    toast("Lesson 5 marked complete! 🎉");
  }
  if(localStorage.getItem("computer3_lesson5_complete")==="true"){
    document.getElementById("progress").style.width="100%";
    document.getElementById("progressText").textContent="Lesson progress: 100% — Complete!";
  }

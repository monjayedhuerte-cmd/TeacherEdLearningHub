(() => {
  "use strict";
  const DATA = window.REVIEW_DATA;
  const stageOrder = ["recall","booster","quickfire","fix","challenge","boss"];
  const stageNames = {recall:"What do you remember?",booster:"Memory Booster",quickfire:"Quick Fire",fix:"Fix the Mistake",challenge:"Challenge Mode",boss:"Boss Quiz"};
  const state = {
    xp: 0, answered: 0, correct: 0, attempts: {}, weak: {}, confidence: {},
    cursor: {recall:0,quickfire:0,fix:0,challenge:0,boss:0},
    done: {recall:false,quickfire:false,fix:false,challenge:false,boss:false},
    current: {}, results: null, started:false
  };
  const $ = (id) => document.getElementById(id);
  const storeKey = "teacherEdOperationQuestV1";
  let toastTimer;
  function loadProgress(){
    try{
      const saved=JSON.parse(localStorage.getItem(storeKey)||"null");
      if(saved && saved.v===1 && saved.state){
        const s=saved.state;
        state.xp=Number(s.xp)||0;state.answered=Number(s.answered)||0;state.correct=Number(s.correct)||0;
        state.attempts=s.attempts||{};state.weak=s.weak||{};state.confidence=s.confidence||{};
        state.cursor={...state.cursor,...s.cursor};state.done={...state.done,...s.done};state.results=s.results||null;state.started=!!s.started;
      }
    }catch(e){ /* local progress is optional */ }
    updateMetrics();
    if(state.started){ $("resumeBtn").classList.remove("hidden"); }
    if(state.results) showResults(state.results);
  }
  function saveProgress(){
    try{localStorage.setItem(storeKey,JSON.stringify({v:1,state:{xp:state.xp,answered:state.answered,correct:state.correct,attempts:state.attempts,weak:state.weak,confidence:state.confidence,cursor:state.cursor,done:state.done,results:state.results,started:state.started}}));}catch(e){}
  }
  function toast(message){
    const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2300);
  }
  function updateMetrics(){
    $("xpValue").textContent=state.xp;$("answeredValue").textContent=state.answered;
    $("accuracyValue").textContent=state.answered?Math.round(state.correct/state.answered*100)+"%":"—";
    const completed=stageOrder.filter(s=>s==="booster"||state.done[s]).length;
    $("progressBar").style.width=Math.round(completed/stageOrder.length*100)+"%";
    $("progressText").textContent=Math.round(completed/stageOrder.length*100)+"% complete";
    $("stageLabel").textContent=state.results?"Review complete":state.started?"Keep going, one step at a time":"Your learning path";
    document.querySelectorAll(".stage-link").forEach(b=>b.classList.toggle("active",b.dataset.stage===(window.activeStage||"recall")));
    saveProgress();
  }
  function renderQuestion(stage){
    const list=DATA[stage]; if(!list)return;
    const idx=state.cursor[stage]||0;const q=list[idx%list.length];const mount=$(stage+"Question");
    state.current[stage]={q,idx,locked:false,selected:null,hintLevel:0};
    mount.innerHTML="";
    const meta=document.createElement("div");meta.className="question-meta";
    meta.innerHTML=`<span>QUESTION ${idx+1} OF ${list.length}</span><span class="pill">${escapeHtml(q.difficulty)} · ${escapeHtml(q.concept)}</span>`;
    const prompt=document.createElement("p");prompt.className="question-text";prompt.textContent=q.q;
    const options=document.createElement("div");options.className="answer-list";
    const shuffled=shuffleWithStableSeed(q.options,idx+stage.length);
    shuffled.forEach(opt=>{
      const b=document.createElement("button");b.className="answer-option";b.type="button";b.textContent=opt;
      b.addEventListener("click",()=>choose(stage,opt,b,options));options.appendChild(b);
    });
    const feedback=document.createElement("div");feedback.className="feedback hidden";feedback.id=stage+"Feedback";feedback.setAttribute("aria-live","polite");
    const hint=document.createElement("div");hint.className="hint-box hidden";hint.id=stage+"Hint";
    const confidence=document.createElement("div");confidence.className="confidence hidden";confidence.id=stage+"Confidence";
    confidence.innerHTML='<p>How confident were you before checking?</p><div class="confidence-options"><button type="button" data-c="high">I know it!</button><button type="button" data-c="medium">I think so</button><button type="button" data-c="low">Not sure</button><button type="button" data-c="help">Need help</button></div>';
    confidence.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
      confidence.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");
      state.confidence[q.concept]=b.dataset.c;
      if(b.dataset.c==="high" && state.attempts[q.q] && state.attempts[q.q].lastCorrect===false){toast("High confidence + a missed answer: revisit this rule.");}
      saveProgress();
    }));
    const controls=document.createElement("div");controls.className="question-controls";
    const left=document.createElement("div");left.className="control-left";
    const hintBtn=button("Need a hint?","small-btn",()=>showHint(stage,hint));left.appendChild(hintBtn);
    const right=document.createElement("div");right.className="control-right";
    const next=button(idx===list.length-1?(stage==="boss"?"Finish quiz":"Complete stage"):"Next question","small-btn primary",()=>advance(stage));right.appendChild(next);
    next.disabled=true;next.id=stage+"Next";
    controls.append(left,right);mount.append(meta,prompt,options,feedback,hint,confidence,controls);
    if(stage==="boss" && state.results) showResults(state.results);
  }
  function choose(stage,opt,options){
    const current=state.current[stage];if(!current||current.locked)return;
    const q=current.q;current.locked=true;current.selected=opt;
    const correct=String(opt)===String(q.answer);
    options.querySelectorAll("button").forEach(b=>{
      b.disabled=true;
      if(String(b.textContent)===String(q.answer))b.classList.add("correct");
      else if(String(b.textContent)===String(opt))b.classList.add("wrong");
    });
    const fb=$(stage+"Feedback");fb.classList.remove("hidden","good","bad");fb.classList.add(correct?"good":"bad");
    fb.innerHTML=`<b>${correct?"Excellent! You got it!":"Not quite. This is a useful clue."}</b>${correct?"":`<br><b>Correct answer:</b> ${escapeHtml(q.answer)}<br>`}<b>WHY?</b> ${escapeHtml(q.why)}<br><b>MEMORY TIP:</b> ${escapeHtml(memoryCue(q.concept))}`;
    $(stage+"Confidence").classList.remove("hidden");
    $(stage+"Next").disabled=false;
    state.answered++;state.attempts[q.q]={lastCorrect:correct,stage,concept:q.concept,answer:opt};
    if(correct){state.correct++;state.xp+=10;}else{state.weak[q.concept]=(state.weak[q.concept]||0)+1;}
    updateMetrics();
  }
  function showHint(stage,el){
    const current=state.current[stage];if(!current)return;
    const hints=current.q.hint||["Look carefully at the expression.","Identify which operation comes first.","Work one step at a time and check your answer."];
    current.hintLevel=Math.min(current.hintLevel+1,hints.length);
    el.classList.remove("hidden");
    el.textContent="Hint "+current.hintLevel+": "+hints[current.hintLevel-1];
    if(current.hintLevel===hints.length)el.textContent+=" (Guided clue)";
  }
  function advance(stage){
    const list=DATA[stage];const idx=state.cursor[stage]||0;
    if(!state.current[stage]?.locked)return;
    if(idx<list.length-1){state.cursor[stage]=idx+1;renderQuestion(stage);saveProgress();return;}
    state.done[stage]=true;
    if(stage==="boss"){
      const total=list.length;const answered=state.attempts;
      const bossAnswers=list.filter(q=>answered[q.q]&&answered[q.q].stage==="boss");
      const right=bossAnswers.filter(q=>answered[q.q].lastCorrect).length;
      const result={total,answered:bossAnswers.length,correct:right,percentage:Math.round(right/total*100),weak:{...state.weak},confidence:{...state.confidence}};
      state.results=result;showResults(result);toast("Boss Quiz complete. Review your next steps below.");
    }else{
      const nextStage=stageOrder[stageOrder.indexOf(stage)+1];
      if(nextStage){window.activeStage=nextStage;document.getElementById(nextStage+"Section").scrollIntoView({behavior:"smooth",block:"start"});toast(stageNames[stage]+" complete!");}
    }
    updateMetrics();saveProgress();
  }
  function showResults(result){
    const box=$("results");box.classList.remove("hidden");
    const p=result.percentage;
    const status=p>=90?"MASTERED":p>=80?"GREAT JOB":p>=70?"ALMOST THERE":p>=60?"KEEP PRACTICING":"LET'S REVIEW AGAIN";
    const weak=Object.entries(result.weak||{}).sort((a,b)=>b[1]-a[1]);
    const recommendation=weak.length?`Recommended review: ${weak.slice(0,3).map(([name])=>name).join(", ")}.`:"Keep practising mixed expressions and explain each step aloud.";
    box.innerHTML=`<h3>${status}</h3><p>You completed the final mission. Use this result as a guide—not as a permanent label.</p><div class="result-stats"><div class="result-stat"><span>Boss Quiz score</span><strong>${result.correct}/${result.total}</strong></div><div class="result-stat"><span>Accuracy</span><strong>${p}%</strong></div><div class="result-stat"><span>XP earned</span><strong>${state.xp}</strong></div></div><p class="recommendation">${escapeHtml(recommendation)}</p><p class="recommendation">Whole-review accuracy: ${state.answered?Math.round(state.correct/state.answered*100):0}% across ${state.answered} answered items. A concept marked for review is not yet secure.</p><div class="question-controls"><button class="small-btn" id="reviewWeakBtn">Review a weak concept</button><button class="small-btn primary" id="restartFromResults">Try again</button></div>`;
    $("reviewWeakBtn").addEventListener("click",()=>{const name=weak[0]?.[0]||"Left-to-right rule";const q=Object.values(DATA).flat().find(item=>item.concept===name)||DATA.recall[0];showTargetedReview(q,name);});
    $("restartFromResults").addEventListener("click",resetReviewer);
    saveProgress();
  }
  function showTargetedReview(q,name){
    const section=$("results");const wrap=document.createElement("div");wrap.className="feedback bad";wrap.innerHTML=`<b>LET'S REVIEW THAT AGAIN: ${escapeHtml(name)}</b><br>${escapeHtml(q.why)}<br><b>Try:</b> ${escapeHtml(q.q)}<br><b>Answer:</b> ${escapeHtml(q.answer)}`;
    section.appendChild(wrap);wrap.scrollIntoView({behavior:"smooth",block:"center"});
  }
  function memoryCue(concept){
    const cues={"Left-to-right rule":"No grouping symbols? Follow the line from left to right.","Grouping symbols":"Parentheses first: solve inside before moving outside.","Decimal operations":"Line up decimal points; annex zeros when useful.","Word problems":"Story → expression → calculation → check.","Grouping and decimals":"Solve the group first, then align decimals as needed.","Grouping and whole numbers":"Parentheses first, then continue left to right.","Mixed operations":"Keep the order shown; do not rearrange the expression.","Compare expressions":"Parentheses can change the result.","Key rule":"GROUPS FIRST; OTHERWISE, LEFT TO RIGHT."};
    return cues[concept]||"One step at a time: show the operation, calculate, then check.";
  }
  function button(text,cls,fn){const b=document.createElement("button");b.type="button";b.className=cls;b.textContent=text;b.addEventListener("click",fn);return b;}
  function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function shuffleWithStableSeed(items,seed){
    const out=items.slice();let n=(seed+1)*2654435761>>>0;
    for(let i=out.length-1;i>0;i--){n=(n*1664525+1013904223)>>>0;const j=n%(i+1);[out[i],out[j]]=[out[j],out[i]];}
    return out;
  }
  function start(){
    state.started=true;window.activeStage="recall";
    $("recallSection").scrollIntoView({behavior:"smooth",block:"start"});
    $("startBtn").textContent="Review in progress";$("resumeBtn").classList.add("hidden");
    renderAll();updateMetrics();toast("Your first mission is ready.");
  }
  function renderAll(){["recall","quickfire","fix","challenge","boss"].forEach(renderQuestion);}
  function resetReviewer(){
    try{localStorage.removeItem(storeKey);}catch(e){}
    state.xp=0;state.answered=0;state.correct=0;state.attempts={};state.weak={};state.confidence={};
    state.cursor={recall:0,quickfire:0,fix:0,challenge:0,boss:0};state.done={recall:false,quickfire:false,fix:false,challenge:false,boss:false};state.results=null;state.started=false;
    $("results").classList.add("hidden");$("startBtn").textContent="Ready to Review? →";$("resumeBtn").classList.add("hidden");
    renderAll();updateMetrics();window.activeStage="recall";window.scrollTo({top:0,behavior:"smooth"});toast("Reviewer restarted.");
  }
  $("startBtn").addEventListener("click",start);
  $("resumeBtn").addEventListener("click",()=>{window.activeStage="recall";renderAll();$("recallSection").scrollIntoView({behavior:"smooth"});});
  $("resetBtn").addEventListener("click",()=>{if(confirm("Restart this reviewer and clear saved progress on this browser?"))resetReviewer();});
  document.querySelectorAll(".stage-link").forEach(b=>b.addEventListener("click",()=>{
    const stage=b.dataset.stage;window.activeStage=stage;
    const section=$(stage+"Section");section.scrollIntoView({behavior:"smooth",block:"start"});
    document.querySelectorAll(".stage-link").forEach(x=>x.classList.toggle("active",x===b));
  }));
  loadProgress();renderAll();
  if(state.started){$("startBtn").textContent="Continue reviewing";$("resumeBtn").classList.remove("hidden");}
})();
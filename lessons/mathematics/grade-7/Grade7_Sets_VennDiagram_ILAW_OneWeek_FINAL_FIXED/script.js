const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let stars=0, completed=new Set();
function addStars(n,key){if(completed.has(key))return;completed.add(key);stars+=n;showToast(`Great work! +${n} ⭐  Total: ${stars}`)}
function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2200)}
function scrollToSection(id){document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}
window.scrollToSection=scrollToSection;

$("#year").textContent=new Date().getFullYear();

$("#menuBtn").addEventListener("click",()=>$("#navLinks").classList.toggle("open"));
$$(".nav-links a").forEach(a=>a.addEventListener("click",()=>$("#navLinks").classList.remove("open")));

// Smooth navigation for lesson topic/day cards and internal links.
document.addEventListener("click", e => {
  const link = e.target.closest("a[href^=\"#\"]");
  if (!link) return;
  const id = link.getAttribute("href");
  if (!id || id === "#") return;
  const target = document.querySelector(id);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({behavior:"smooth", block:"start"});
    history.replaceState(null, "", id);
    const nav = document.querySelector("#navLinks");
    if (nav) nav.classList.remove("open");
  }
});

const fsBtn = $("#fullscreenBtn");

function getFullscreenElement(){
  return document.fullscreenElement ||
         document.webkitFullscreenElement ||
         document.mozFullScreenElement ||
         document.msFullscreenElement;
}

function updateFS(){
  const on = !!getFullscreenElement() || document.body.classList.contains("fullscreen-fallback");
  fsBtn.innerHTML = on
    ? "⛶ <span>Exit Full Screen</span>"
    : "⛶ <span>Full Screen</span>";
  fsBtn.setAttribute("aria-label", on ? "Exit full screen" : "Enter full screen");
  fsBtn.title = on ? "Exit full screen" : "Full screen";
}

async function enterFullscreen(){
  const el = document.documentElement;

  try{
    if(el.requestFullscreen){
      await el.requestFullscreen();
      return;
    }
    if(el.webkitRequestFullscreen){
      el.webkitRequestFullscreen();
      return;
    }
    if(el.mozRequestFullScreen){
      el.mozRequestFullScreen();
      return;
    }
    if(el.msRequestFullscreen){
      el.msRequestFullscreen();
      return;
    }

    // Fallback for browsers/environments where the Fullscreen API is unavailable.
    document.body.classList.add("fullscreen-fallback");
    updateFS();
    showToast("Full-screen mode enabled.");
  }catch(e){
    // Some browsers may reject the API on local files or embedded pages.
    // Keep the lesson usable with a page-level full-screen fallback.
    document.body.classList.add("fullscreen-fallback");
    updateFS();
    showToast("Full-screen view enabled.");
  }
}

async function exitFullscreen(){
  try{
    if(document.exitFullscreen){
      await document.exitFullscreen();
    }else if(document.webkitExitFullscreen){
      document.webkitExitFullscreen();
    }else if(document.mozCancelFullScreen){
      document.mozCancelFullScreen();
    }else if(document.msExitFullscreen){
      document.msExitFullscreen();
    }
  }catch(e){}

  document.body.classList.remove("fullscreen-fallback");
  updateFS();
}

fsBtn.addEventListener("click", async () => {
  if(getFullscreenElement() || document.body.classList.contains("fullscreen-fallback")){
    await exitFullscreen();
  }else{
    await enterFullscreen();
  }
});

document.addEventListener("fullscreenchange", updateFS);
document.addEventListener("webkitfullscreenchange", updateFS);
document.addEventListener("mozfullscreenchange", updateFS);
document.addEventListener("MSFullscreenChange", updateFS);

updateFS();

$("#quickChallenge").addEventListener("click",()=>{scrollToSection("activities");showToast("Quick Challenge ready! Start with Mission 1.")});

$$(".ilaw-card").forEach(btn=>btn.addEventListener("click",()=>{
  $$(".ilaw-card").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
  $$(".ilaw-panel").forEach(x=>x.classList.remove("active"));$("#"+btn.dataset.panel).classList.add("active");
}));

const concepts={
set:{title:"Set & Elements",num:"01",text:"A set is a well-defined collection. The objects inside it are called elements or members.",math:"A = {2, 4, 6, 8}",extra:"Here, 2, 4, 6, and 8 are elements of A. We can write 4 ∈ A, meaning “4 belongs to A.”",board:["2","4","6","8"]},
subset:{title:"Subset",num:"02",text:"Set A is a subset of set B when every element of A is also an element of B. We write A ⊆ B.",math:"A = {2, 4}  ⊆  B = {1, 2, 3, 4, 5}",extra:"A does not need to contain every element of B. It only needs to have no element outside B.",board:["B: 1","A: 2","A: 4","B: 5"]},
union:{title:"Union",num:"03",text:"The union A ∪ B contains every element that is in A, in B, or in both. Repeated elements are written only once.",math:"{1,2,3} ∪ {3,4,5} = {1,2,3,4,5}",extra:"Think: UNION = COMBINE the two groups.",board:["1","2","3","4","5"]},
intersection:{title:"Intersection",num:"04",text:"The intersection A ∩ B contains only the elements common to both A and B.",math:"{1,2,3,4} ∩ {3,4,5} = {3,4}",extra:"Think: INTERSECTION = the SHARED or COMMON part.",board:["3","4","COMMON"]}
};
$$(".concept-card").forEach(btn=>btn.addEventListener("click",()=>{
  $$(".concept-card").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
  const c=concepts[btn.dataset.concept];
  $("#conceptExplainer").querySelector(".panel-label").textContent=`CONCEPT ${c.num}`;
  $("#conceptExplainer").querySelector("h3").textContent=c.title;
  $("#conceptExplainer").querySelector(".explain-copy p").textContent=c.text;
  $("#conceptExplainer").querySelector(".math-example").textContent=c.math;
  $("#conceptExplainer").querySelectorAll(".explain-copy p")[1].textContent=c.extra;
  $("#exampleBoard").innerHTML=c.board.map(x=>`<span>${x}</span>`).join("");
}));

function setupSingle(container,feedback,correct,key){
  $$(container+" button").forEach(b=>b.addEventListener("click",()=>{
    $$(container+" button").forEach(x=>x.classList.remove("selected"));
    b.classList.add("selected");
    if(b.dataset.answer===correct){b.classList.add("correct");$(feedback).textContent="✅ Correct! Your set thinking is strong.";$(feedback).style.color="#16865f";addStars(2,key)}
    else{$(feedback).textContent="❌ Not quite. Look for the elements that are common to both groups.";$(feedback).style.color="#d14b4b"}
  }));
}
setupSingle("#subsetChoices","#subsetFeedback","yes","m2");
setupSingle("#intersectionChoices","#intersectionFeedback","3,4","m3");
setupSingle("#surveyChoices","#surveyFeedback","intersection","m5");

$("#checkSort").addEventListener("click",()=>{
  const buttons=$$("#sortChoices button"), selected=buttons.filter(b=>b.classList.contains("selected")), correct=buttons.filter(b=>b.dataset.correct==="true");
  buttons.forEach(b=>b.classList.remove("correct","wrong"));
  selected.forEach(b=>b.classList.add(b.dataset.correct==="true"?"correct":"wrong"));
  const ok=selected.length===correct.length&&selected.every(b=>b.dataset.correct==="true");
  $("#sortFeedback").textContent=ok?"🌟 Perfect! Even numbers less than 10 are 2, 4, 6, and 8.":"🔎 Check again. Select 2, 4, 6, and 8 only.";
  $("#sortFeedback").style.color=ok?"#16865f":"#d14b4b"; if(ok)addStars(2,"m1");
});
$$("#sortChoices button").forEach(b=>b.addEventListener("click",()=>b.classList.toggle("selected")));

let dragged=null;
$$(".number-bank button").forEach(b=>{b.addEventListener("dragstart",e=>{dragged=b;e.dataTransfer.setData("text/plain",b.textContent)});
 b.addEventListener("click",()=>{const region=b.dataset.region;moveToRegion(b,region)})});
$$(".drop-circle,.drop-both").forEach(zone=>{zone.addEventListener("dragover",e=>e.preventDefault());zone.addEventListener("drop",()=>{if(dragged)moveToRegion(dragged,zone.dataset.drop)})});
function moveToRegion(btn,region){const zone=document.querySelector(`[data-drop="${region}"] .dropped`);if(!zone||btn.parentElement===zone)return;const chip=document.createElement("span");chip.textContent=btn.textContent;chip.dataset.region=region;chip.dataset.value=btn.textContent;zone.appendChild(chip);btn.style.display="none"}
$("#resetVenn").addEventListener("click",()=>{$$("#numberBank button").forEach(b=>b.style.display="block");$$(".dropped").forEach(d=>d.innerHTML="");$("#vennFeedback").textContent=""});
$("#checkVenn").addEventListener("click",()=>{
  const all=$$(".dropped span");let ok=all.length===5;
  all.forEach(x=>{const v=x.textContent;const expected=["1","2"].includes(v)?"a":["3","4"].includes(v)?"both":"b";if(x.dataset.region!==expected)ok=false});
  $("#vennFeedback").textContent=ok?"🏆 Excellent! You built the Venn diagram correctly.":"🔧 Some numbers are in the wrong region. Remember: 3 and 4 are shared.";
  $("#vennFeedback").style.color=ok?"#16865f":"#d14b4b";if(ok)addStars(4,"m4");
});

const questions=[
 {q:"A = {1,2,3} and B = {3,4,5}. What is A ∪ B?",c:["{3}","{1,2,3,4,5}","{1,2}","{4,5}"],a:1},
 {q:"A = {2,4} and B = {1,2,3,4}. Which statement is true?",c:["A ⊆ B","B ⊆ A","A ∩ B = ∅","A = B"],a:0},
 {q:"What does A ∩ B represent?",c:["All elements in A only","All elements in B only","Elements common to A and B","Elements outside both"],a:2},
 {q:"If A = {a,e,i,o,u} and B = {a,e,i}, which is true?",c:["A ⊆ B","B ⊆ A","A ∩ B = ∅","A ∪ B = B"],a:1},
 {q:"A class has 20 learners. 12 like basketball, 10 like volleyball, and 4 like both. Which part of a Venn diagram contains the 4?",c:["A only","B only","A ∩ B","Outside A and B"],a:2}
];
let qi=0,ms=0,answered=false;
function renderMastery(){const q=questions[qi];$("#masteryProgress").textContent=`Question ${qi+1} of ${questions.length}`;$("#masteryScore").textContent=`Score: ${ms}`;$("#progressBar").style.width=`${((qi)/questions.length)*100}%`;$("#masteryQuestion").innerHTML=`<div class="mastery-q">${q.q}</div>`;$("#masteryChoices").innerHTML=q.c.map((x,i)=>`<button data-i="${i}">${x}</button>`).join("");$("#nextMastery").disabled=true;$("#nextMastery").textContent="Choose an answer";$("#masteryFeedback").textContent="";answered=false;
  $$("#masteryChoices button").forEach(b=>b.addEventListener("click",()=>{
    if(answered)return;
    answered=true;
    const good=+b.dataset.i===q.a;
    $$("#masteryChoices button").forEach(x=>x.disabled=true);
    b.classList.add(good?"correct":"wrong");
    if(!good)$$("#masteryChoices button")[q.a].classList.add("correct");
    $("#masteryFeedback").textContent=good?"✅ Correct!":"❌ Review the highlighted answer.";
    $("#masteryFeedback").style.color=good?"#16865f":"#d14b4b";
    if(good)ms++;
    $("#nextMastery").disabled=false;
    $("#nextMastery").textContent=qi===questions.length-1?"Finish Mastery":"Next Question →";
  }));
}
renderMastery();
$("#nextMastery").addEventListener("click",()=>{if(!answered)return;if(qi<questions.length-1){qi++;renderMastery()}else{const pct=Math.round(ms/questions.length*100);$("#masteryQuestion").innerHTML=`<div class="mastery-q">🎉 Mastery complete! You scored ${ms}/${questions.length} (${pct}%).</div>`;$("#masteryChoices").innerHTML=pct>=80?"<p><strong>Excellent mastery!</strong> You can explain sets, subsets, union, and intersection.</p>":"<p><strong>Keep practicing!</strong> Revisit the Learn section and try the missions again.</p>";$("#nextMastery").textContent="Restart Mastery";$("#nextMastery").disabled=false;$("#progressBar").style.width="100%";$("#nextMastery").onclick=()=>{qi=0;ms=0;$("#nextMastery").onclick=null;renderMastery()}}});

$$(".word-bank button").forEach(b=>b.addEventListener("click",()=>{if(b.textContent.includes("everything"))b.style.borderColor="#2ecf91";else b.style.borderColor="#2ecf91";$("#exitFeedback").textContent="✅ Key idea: union combines the groups; intersection shows what they share.";$("#exitFeedback").style.color="#16865f";addStars(2,"exit")}));
$("#saveReflection").addEventListener("click",()=>{const text=$("#reflectionText").value.trim();if(text.length<8){$("#reflectionFeedback").textContent="✏️ Write a little more so you can explain your thinking.";$("#reflectionFeedback").style.color="#d14b4b";return}$("#reflectionFeedback").textContent="🌟 Reflection saved! You explained your mathematical thinking.";$("#reflectionFeedback").style.color="#16865f";addStars(2,"reflection")});

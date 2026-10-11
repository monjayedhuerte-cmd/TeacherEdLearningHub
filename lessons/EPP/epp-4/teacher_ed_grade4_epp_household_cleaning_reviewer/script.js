(() => {
"use strict";
const DATA=window.REVIEW_DATA;
const stages=["recall","quickfire","fix","game","boss"];
const state={xp:0,answered:0,correct:0,attempts:{},weak:{},confidence:{},cursor:{recall:0,quickfire:0,fix:0,game:0,boss:0},done:{recall:false,quickfire:false,fix:false,game:false,boss:false},started:false,results:null,sound:false};
const $=id=>document.getElementById(id);let toastTimer;
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function toast(s){const t=$("toast");t.textContent=s;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2200);}
function save(){try{localStorage.setItem("teacherEdEppLinisQuestV1",JSON.stringify(state));}catch(e){}}
function load(){try{const x=JSON.parse(localStorage.getItem("teacherEdEppLinisQuestV1")||"null");if(x){Object.assign(state,x);state.cursor={...state.cursor,...x.cursor};state.done={...state.done,...x.done};}}catch(e){}}
function metrics(){
 $("xpValue").textContent=state.xp;$("answeredValue").textContent=state.answered;$("accuracyValue").textContent=state.answered?Math.round(state.correct/state.answered*100)+"%":"—";
 const complete=1+stages.filter(s=>state.done[s]).length;
 $("progressBar").style.width=Math.round(complete/7*100)+"%";$("progressText").textContent=Math.round(complete/7*100)+"% complete";
 $("stageLabel").textContent=state.results?"Tapos na ang reviewer!":state.started?"Magpatuloy—kaya mo ito!":"Simulan ang iyong learning path";
 document.querySelectorAll(".stage-link").forEach(b=>b.classList.toggle("active",b.dataset.target===(window.activeStage||"recall")));
 save();
}
function shuffle(arr,seed){const a=arr.slice();let x=(seed+3)*2654435761>>>0;for(let i=a.length-1;i>0;i--){x=(x*1664525+1013904223)>>>0;const j=x%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
function mkBtn(label,cls,fn){const b=document.createElement("button");b.type="button";b.className=cls;b.textContent=label;b.addEventListener("click",fn);return b;}
function memory(concept){
 const m={"Pagwawalis":"Simulan sa sulok at gilid; dahan-dahan patungo sa gitna.","Kalinisan ng bakuran":"Malinis na kanal at bakuran ay nakatutulong na maiwasan ang mga peste.","Paghihiwalay ng basura":"Ihiwalay ang bote, lata at plastik sa nabubulok na materyal.","Muwebles at kasangkapan":"Simulan sa itaas at magpatuloy pababa.","Paglilinis ng kisame":"Mahabang hawakan at takip sa mga kasangkapan.","Kaligtasan":"Ayusin ang gamit, mag-ingat sa kuryente at ilayo ang mapanganib na bagay sa bata.","Compost":"Ang angkop na nabubulok na dahon at balat ng prutas o gulay ay maaaring gawing compost.","Pag-aayos ng kagamitan":"Linisin, iligpit at ibalik sa wastong taguan.","Pangkalahatang pag-unawa":"LINIS – AYOS – INGAT.","Kaligtasan sa kuryente":"Tuyong kamay bago ikabit o tanggalin sa saksakan; magpatulong sa nakatatanda."};
 return m[concept]||"Balikan ang paraan sa aralin at isipin kung paano ito nakatutulong sa kalinisan o kaligtasan.";
}
function renderQuestion(stage){
 const list=DATA[stage],idx=state.cursor[stage]||0,q=list[idx%list.length],mount=$(stage+"Question");mount.innerHTML="";
 const meta=document.createElement("div");meta.className="q-meta";meta.innerHTML=`<span>QUESTION ${idx+1} OF ${list.length}</span><span class="pill">${esc(q.difficulty)} · ${esc(q.concept)}</span>`;
 const text=document.createElement("p");text.className="q-text";text.textContent=q.q;
 const grid=document.createElement("div");grid.className="answer-grid";
 const fb=document.createElement("div");fb.className="feedback hidden";fb.id=stage+"Feedback";fb.setAttribute("aria-live","polite");
 const hint=document.createElement("div");hint.className="hint-box hidden";hint.id=stage+"Hint";
 const confidence=document.createElement("div");confidence.className="confidence hidden";confidence.id=stage+"Confidence";
 confidence.innerHTML='<p>Gaano ka kasigurado? / How confident are you?</p><button data-c="high">😎 Alam ko!</button><button data-c="medium">🙂 Sa tingin ko</button><button data-c="low">🤔 Hindi sigurado</button><button data-c="help">😟 Kailangan ng tulong</button>';
 confidence.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{confidence.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state.confidence[q.concept]=b.dataset.c;save();if(b.dataset.c==="high"&&state.attempts[q.q]?.lastCorrect===false)toast("Balikan ang konseptong ito—mataas ang kumpiyansa ngunit mali ang sagot.");}));
 const shuffled=shuffle(q.options,idx+stage.length);
 let locked=false,hintLevel=0;
 shuffled.forEach(opt=>{const b=mkBtn(opt,"answer",()=>{
   if(locked)return;locked=true;const ok=opt===q.answer;
   grid.querySelectorAll("button").forEach(x=>{x.disabled=true;if(x.textContent===q.answer)x.classList.add("correct");else if(x.textContent===opt)x.classList.add("wrong");});
   fb.classList.remove("hidden","good","bad");fb.classList.add(ok?"good":"bad");
   fb.innerHTML=`<b>${ok?"Magaling! Tama ang sagot.":"Hindi pa. Gamitin itong pagkakataon para matuto."}</b>${ok?"":`<br><b>Tamang sagot:</b> ${esc(q.answer)}<br>`}<b>BAKIT?</b> ${esc(q.why)}<br><b>MEMORY TIP:</b> ${esc(memory(q.concept))}`;
   confidence.classList.remove("hidden");next.disabled=false;state.answered++;state.attempts[q.q]={lastCorrect:ok,stage,concept:q.concept,answer:opt};if(ok){state.correct++;state.xp+=10;}else state.weak[q.concept]=(state.weak[q.concept]||0)+1;
   metrics();if(state.sound)beep(ok);
 });grid.appendChild(b);});
 const controls=document.createElement("div");controls.className="q-controls";
 const left=document.createElement("div");const hintBtn=mkBtn("💡 Need a hint?","small-btn",()=>{hintLevel=Math.min(hintLevel+1,q.hint.length);hint.classList.remove("hidden");hint.textContent="Hint "+hintLevel+": "+q.hint[hintLevel-1];});left.appendChild(hintBtn);
 const right=document.createElement("div");const next=mkBtn(idx===list.length-1?(stage==="boss"?"Tingnan ang resulta":"Complete stage"):"Next question","small-btn primary",()=>advance(stage));next.disabled=true;next.id=stage+"Next";right.appendChild(next);controls.append(left,right);
 mount.append(meta,text,grid,fb,hint,confidence,controls);
}
function advance(stage){
 const idx=state.cursor[stage]||0;
 if(idx<DATA[stage].length-1){state.cursor[stage]=idx+1;renderQuestion(stage);save();return;}
 state.done[stage]=true;
 if(stage==="boss"){
   const qs=DATA.boss,attempts=qs.map(q=>state.attempts[q.q]).filter(a=>a&&a.stage==="boss"),right=attempts.filter(a=>a.lastCorrect).length;
   state.results={total:qs.length,answered:attempts.length,correct:right,percentage:Math.round(right/qs.length*100),weak:{...state.weak},confidence:{...state.confidence}};
   showResults(state.results);toast("Natapos mo ang Boss Quiz!");
 }else{
   const next={recall:"booster",quickfire:"sort",fix:"game",game:"boss"}[stage];if(next){window.activeStage=next;$(next+"Section").scrollIntoView({behavior:"smooth",block:"start"});toast("Mission complete!");}
 }
 metrics();
}
function renderSort(){
 const mount=$("sortActivity");mount.innerHTML='<p class="sort-instructions">Pumili ng kategorya para sa bawat gawain. / Choose the best category for each task.</p>';
 const items=[
 {q:"Pagwawalis ng sulok at pag-ipon ng dumi gamit ang pandakot",answer:"Paglilinis sa loob ng bahay",why:"Ito ang paraang inilarawan para sa sahig."},
 {q:"Pagbubunot ng damo at pagwawalis ng tuyong dahon",answer:"Paglilinis ng bakuran",why:"Mga gawain ito sa bakuran."},
 {q:"Pagtatago ng kutsilyo at disinfectant sa lugar na hindi maaabot ng bata",answer:"Kaligtasan",why:"Pinipigilan nitong maabot ng bata ang matulis o nakalalasong bagay."},
 {q:"Paglalagay ng tuyong dahon sa hukay na compost",answer:"Pag-aalaga sa bakuran",why:"Maaaring gawing compost ang angkop na nabubulok na materyal ayon sa aralin."}
 ];
 items.forEach((item,i)=>{const card=document.createElement("div");card.className="sort-item";const p=document.createElement("p");p.textContent=(i+1)+". "+item.q;const choices=document.createElement("div");choices.className="sort-choices";const fb=document.createElement("div");fb.className="sort-feedback";
 ["Paglilinis sa loob ng bahay","Paglilinis ng bakuran","Kaligtasan","Pag-aalaga sa bakuran"].forEach(c=>{const b=mkBtn(c,"",()=>{if(card.dataset.done)return;card.dataset.done="1";const ok=c===item.answer;b.classList.add(ok?"correct":"wrong");if(!ok)choices.querySelectorAll("button").forEach(x=>{if(x.textContent===item.answer)x.classList.add("correct");});fb.textContent=(ok?"Tama! ":"Balikan natin. Tamang kategorya: "+item.answer+". ")+item.why;state.answered++;state.attempts["sort-"+i]={lastCorrect:ok,stage:"sort",concept:"Pag-uuri"};if(ok){state.correct++;state.xp+=5;}else state.weak["Pag-uuri"]=(state.weak["Pag-uuri"]||0)+1;choices.querySelectorAll("button").forEach(x=>x.disabled=true);metrics();});choices.appendChild(b);});card.append(p,choices,fb);mount.appendChild(card);});
}
function showResults(r){
 const box=$("results");box.classList.remove("hidden");const p=r.percentage;const status=p>=90?"MASTERY MISSION":p>=80?"MAGALING!":p>=70?"MALAPIT NA!":p>=60?"MAGPRAKTIS PA":"BALIKAN NATIN";
 const weak=Object.entries(r.weak||{}).sort((a,b)=>b[1]-a[1]);const rec=weak.length?"Balikan ang: "+weak.slice(0,3).map(x=>x[0]).join(", ")+".":"Ipagpatuloy ang pagsasanay at ipaliwanag ang mga hakbang sa sariling salita.";
 box.innerHTML=`<h3>${status}</h3><p>Natapos mo ang final mission. Gamitin ang resulta upang malaman kung ano pa ang dapat balikan.</p><div class="result-stats"><div class="result-stat"><span>Boss Quiz</span><strong>${r.correct}/${r.total}</strong></div><div class="result-stat"><span>Accuracy</span><strong>${p}%</strong></div><div class="result-stat"><span>XP Points</span><strong>${state.xp}</strong></div></div><p><b>Susunod na hakbang:</b> ${esc(rec)}</p><p>Batay ito sa mga sagot na naitala sa browser na ito. Hindi ito opisyal na marka ng klase.</p><div class="q-controls"><button class="small-btn" id="reviewWeak">Balikan ang mahirap na konsepto</button><button class="small-btn primary" id="tryAgain">Subukan muli</button></div>`;
 $("reviewWeak").addEventListener("click",()=>{const c=weak[0]?.[0]||"Kaligtasan";const q=Object.values(DATA).flat().find(x=>x.concept===c)||DATA.recall[0];const d=document.createElement("div");d.className="feedback bad";d.innerHTML=`<b>LET'S REVIEW THAT AGAIN: ${esc(c)}</b><br>${esc(q.why)}<br><b>Halimbawa:</b> ${esc(q.q)}<br><b>Sagot:</b> ${esc(q.answer)}<br><b>Memory cue:</b> ${esc(memory(q.concept))}`;box.appendChild(d);d.scrollIntoView({behavior:"smooth",block:"center"});});
 $("tryAgain").addEventListener("click",reset);
}
function renderAll(){["recall","quickfire","fix","game","boss"].forEach(renderQuestion);renderSort();if(state.results)showResults(state.results);}
function start(){state.started=true;window.activeStage="recall";renderAll();metrics();$("recallSection").scrollIntoView({behavior:"smooth",block:"start"});$("startBtn").textContent="Magpatuloy sa reviewer";toast("Handa na ang unang mission!");}
function reset(){try{localStorage.removeItem("teacherEdEppLinisQuestV1");}catch(e){}state.xp=0;state.answered=0;state.correct=0;state.attempts={};state.weak={};state.confidence={};state.cursor={recall:0,quickfire:0,fix:0,game:0,boss:0};state.done={recall:false,quickfire:false,fix:false,game:false,boss:false};state.started=false;state.results=null;$("startBtn").textContent="Handa ka na? / Ready to Review? →";renderAll();metrics();window.scrollTo({top:0,behavior:"smooth"});toast("Na-reset ang reviewer.");}
function beep(ok){try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=ok?660:240;g.gain.value=.045;o.start();o.stop(c.currentTime+.09);o.onended=()=>c.close();}catch(e){}}
$("startBtn").addEventListener("click",start);$("resetBtn").addEventListener("click",()=>{if(confirm("I-reset ang reviewer at burahin ang naka-save na progreso sa browser na ito?"))reset();});
$("soundToggle").addEventListener("click",()=>{state.sound=!state.sound;$("soundToggle").textContent="Sound: "+(state.sound?"On":"Off");$("soundToggle").setAttribute("aria-pressed",String(state.sound));});
document.querySelectorAll(".stage-link").forEach(b=>b.addEventListener("click",()=>{const target=b.dataset.target;window.activeStage=target;const id=target==="sort"?"sortSection":target+"Section";$(id).scrollIntoView({behavior:"smooth",block:"start"});document.querySelectorAll(".stage-link").forEach(x=>x.classList.toggle("active",x===b));}));
load();renderAll();metrics();if(state.started)$("startBtn").textContent="Magpatuloy sa reviewer";
})();
(() => {
"use strict";
const $ = id => document.getElementById(id);
const Q = window.AP4_QUESTIONS || [];
const storeKey = "teacherEdAP4EconomyQuestV1";
let state = {answered:0,best:0,wrongTopics:{},reflection:""};
try { state = {...state,...JSON.parse(localStorage.getItem(storeKey)||"{}")}; } catch(e) {}
let practiceSet=[],practiceIndex=0,practiceCorrect=0,practiceMissed=[];
let quizSet=[],quizIndex=0,quizScore=0,quizAnswers=[];
let gameTimer=null,soundOn=false,toastTimer=null;
const letters=["A","B","C","D"];
function save(){try{localStorage.setItem(storeKey,JSON.stringify(state));}catch(e){} updateStats();}
function updateStats(){
 $("statDone").textContent=state.answered||0; $("statBest").textContent=(state.best||0)+"%";
 $("teacherDone").textContent=state.answered||0; $("teacherBest").textContent=(state.best||0)+"%";
 $("teacherBar").style.width=Math.min(100,(state.best||0))+"%";
 const topics=Object.entries(state.wrongTopics||{}).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0]);
 $("weakTopics").textContent=topics.length?topics.join(", "):"Wala pa";
 $("resumeBtn").textContent=(state.answered||state.best)?"Ituloy ang Review":"Tingnan ang Review";
 if($("reflectionText") && document.activeElement!==$("reflectionText")) $("reflectionText").value=state.reflection||"";
}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2300);}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function sound(){if(!soundOn)return;try{const C=window.AudioContext||window.webkitAudioContext;const c=new C();const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=660;g.gain.value=.04;o.start();o.stop(c.currentTime+.09);}catch(e){}}
function scrollToSection(id){$(id).scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});}
function populateTopics(){const topics=[...new Set(Q.map(q=>q.topic))];topics.forEach(t=>{const op=document.createElement("option");op.value=t;op.textContent=t;$("topicFilter").appendChild(op);});}
function startPractice(){
 clearTimeout(gameTimer);const filter=$("topicFilter").value;practiceSet=shuffle(Q.filter(q=>filter==="all"||q.topic===filter));practiceIndex=0;practiceCorrect=0;practiceMissed=[];$("practiceProgress").style.width="0%";renderPractice();
}
function renderPractice(){
 const q=practiceSet[practiceIndex];if(!q){$("practiceQuestion").textContent="Practice complete!";$("practiceChoices").innerHTML="";$("practiceFeedback").className="feedback good";$("practiceFeedback").textContent=`Natapos mo ang ${practiceSet.length} tanong. Tamang sagot: ${practiceCorrect}/${practiceSet.length}.`; $("nextPractice").textContent="Ulitin ang Practice";$("nextPractice").disabled=false;$("hintBtn").disabled=true;$("practiceNumber").textContent="Tapos na";return;}
 $("practiceNumber").textContent=`Tanong ${practiceIndex+1} / ${practiceSet.length}`;$("practiceQuestion").textContent=q.q;$("practiceChoices").innerHTML="";$("practiceFeedback").textContent="";$("practiceFeedback").className="feedback";$("nextPractice").disabled=true;$("nextPractice").textContent="Susunod →";$("hintBtn").disabled=false;
 q.choices.forEach((choice,i)=>{const b=document.createElement("button");b.className="choice";b.innerHTML=`<span class="letter">${letters[i]}</span><span>${choice}</span>`;b.addEventListener("click",()=>answerPractice(i,b));$("practiceChoices").appendChild(b);});
}
function answerPractice(index,button){
 const q=practiceSet[practiceIndex];if($("practiceChoices").dataset.answered==="yes")return;$("practiceChoices").dataset.answered="yes";
 [...$("practiceChoices").children].forEach((b,i)=>{b.disabled=true;if(i===q.a)b.classList.add("correct");if(i===index&&index!==q.a)b.classList.add("wrong");});
 const good=index===q.a;state.answered=(state.answered||0)+1;
 if(good){practiceCorrect++;$("practiceFeedback").className="feedback good";$("practiceFeedback").textContent="Tama! "+q.why;sound();}
 else{practiceMissed.push(q);state.wrongTopics[q.topic]=(state.wrongTopics[q.topic]||0)+1;$("practiceFeedback").className="feedback bad";$("practiceFeedback").textContent="Balikan natin ito. Tamang sagot: "+q.choices[q.a]+". "+q.why;}
 $("practiceProgress").style.width=((practiceIndex+1)/practiceSet.length*100)+"%";$("practiceCount").textContent=`${practiceIndex+1} / ${practiceSet.length} nasagot`;$("nextPractice").disabled=false;save();
}
function nextPractice(){if(practiceIndex>=practiceSet.length){startPractice();return;}practiceIndex++;$("practiceChoices").dataset.answered="";renderPractice();}
function hint(){const q=practiceSet[practiceIndex];if(!q)return;$("practiceFeedback").className="feedback hint";$("practiceFeedback").textContent="Hint: "+q.why.split(".")[0]+"."; }
function startQuiz(){
 quizSet=shuffle(Q).slice(0,10);quizIndex=0;quizScore=0;quizAnswers=[];$("quizIntro").classList.add("hidden");$("quizStage").classList.remove("hidden");renderQuiz();
}
function renderQuiz(){
 if(quizIndex>=quizSet.length){finishQuiz();return;}
 const q=quizSet[quizIndex];$("quizStage").innerHTML=`<div class="quiz-question"><div class="quiz-top"><span>BOSS QUIZ</span><span>Tanong ${quizIndex+1} sa ${quizSet.length}</span></div><h3>${q.q}</h3><div class="choices" id="quizChoices"></div><div id="quizFeedback" class="feedback" aria-live="polite"></div><div class="question-actions"><span class="muted">Puntos: ${quizScore}</span><button class="btn primary" id="quizNext" disabled>${quizIndex===quizSet.length-1?"Tingnan ang Resulta":"Susunod →"}</button></div></div>`;
 q.choices.forEach((choice,i)=>{const b=document.createElement("button");b.className="choice";b.innerHTML=`<span class="letter">${letters[i]}</span><span>${choice}</span>`;b.addEventListener("click",()=>answerQuiz(i));$("quizChoices").appendChild(b);});
 $("quizNext").addEventListener("click",()=>{quizIndex++;renderQuiz();});
}
function answerQuiz(index){
 const q=quizSet[quizIndex];if($("quizChoices").dataset.answered==="yes")return;$("quizChoices").dataset.answered="yes";
 [...$("quizChoices").children].forEach((b,i)=>{b.disabled=true;if(i===q.a)b.classList.add("correct");if(i===index&&i!==q.a)b.classList.add("wrong");});
 const good=index===q.a;if(good){quizScore++;sound();$("quizFeedback").className="feedback good";$("quizFeedback").textContent="Tama! "+q.why;}
 else{$("quizFeedback").className="feedback bad";$("quizFeedback").textContent="Tamang sagot: "+q.choices[q.a]+". "+q.why;state.wrongTopics[q.topic]=(state.wrongTopics[q.topic]||0)+1;}
 state.answered=(state.answered||0)+1;quizAnswers.push({q,good});$("quizNext").disabled=false;save();
}
function finishQuiz(){
 const pct=Math.round(quizScore/quizSet.length*100);state.best=Math.max(state.best||0,pct);save();
 const missed=quizAnswers.filter(x=>!x.good);const topics=[...new Set(missed.map(x=>x.q.topic))];
 $("quizStage").innerHTML=`<div class="quiz-result"><div class="score-ring" style="--score:${pct}%"><strong>${pct}%</strong></div><h2>${pct>=80?"Mahusay! Mastery achieved!":pct>=60?"Magandang simula!":"Kaya mo pang umangat!"}</h2><p>Nakuha mo ang <b>${quizScore} sa ${quizSet.length}</b> na tanong.</p><p>${pct>=80?"Balikan ang mga paliwanag at ipagpatuloy ang paghasa.": "Balikan ang Memory Booster at magsanay muli sa mga paksang kailangan pa."}</p>${topics.length?`<div class="remember-strip"><div><b>Mga paksang dapat balikan</b><p>${topics.join(", ")}</p></div></div>`:"<p>Walang paksang namarkahang kailangang balikan sa quiz na ito.</p>"}<div class="hero-actions" style="justify-content:center"><button class="btn primary" id="retryQuiz">Ulitin ang Boss Quiz</button><button class="btn secondary" id="reviewMissed">Practice Arena</button></div></div>`;
 $("retryQuiz").addEventListener("click",startQuiz);$("reviewMissed").addEventListener("click",()=>{const target=topics[0];if(target)$("topicFilter").value=target;startPractice();scrollToSection("practice");});
}
function startGame(mode){
 clearTimeout(gameTimer);const stage=$("gameStage");stage.classList.remove("hidden");
 if(mode==="quick"){
  const set=shuffle(Q).slice(0,5);let idx=0,score=0,time=30;
  stage.innerHTML=`<div class="quiz-top"><span>⚡ QUICK FIRE</span><span id="gameTime">30 segundo</span></div><h3 id="gameQ"></h3><div class="choices" id="gameChoices"></div><div id="gameFeedback" class="feedback" aria-live="polite"></div>`;
  const timer=setInterval(()=>{time--;$("gameTime").textContent=time+" segundo";if(time<=0){clearInterval(timer);end();}},1000);gameTimer=timer;
  function end(){clearInterval(timer);stage.innerHTML=`<h3>Quick Fire tapos na!</h3><p>Score mo: <b>${score} / 5</b>.</p><button class="btn primary" id="playAgain">Subukan muli</button>`;$("playAgain").onclick=()=>startGame("quick");}
  function render(){if(idx>=set.length){end();return;}const q=set[idx];$("gameQ").textContent=`${idx+1}/5 · ${q.q}`;$("gameChoices").innerHTML="";$("gameFeedback").textContent="";q.choices.forEach((c,i)=>{const b=document.createElement("button");b.className="choice";b.innerHTML=`<span class="letter">${letters[i]}</span><span>${c}</span>`;b.onclick=()=>{[...$("gameChoices").children].forEach(x=>x.disabled=true);if(i===q.a){score++;$("gameFeedback").className="feedback good";$("gameFeedback").textContent="Tama!";sound();}else{$("gameFeedback").className="feedback bad";$("gameFeedback").textContent="Tamang sagot: "+q.choices[q.a];}state.answered++;if(i!==q.a)state.wrongTopics[q.topic]=(state.wrongTopics[q.topic]||0)+1;save();setTimeout(()=>{idx++;render();},650);};$("gameChoices").appendChild(b);});}
  render();
 }else{
  const set=shuffle(Q).slice(0,5);let idx=0,score=0;const badStatements=set.map(q=>({q,choices:["Tama ang pahayag","Mali ang pahayag"],a:1}));
  stage.innerHTML=`<div class="quiz-top"><span>🛠️ FIX THE MISTAKE</span><span id="fixCount">1 / 5</span></div><h3 id="fixQ"></h3><p id="fixStatement" class="remember-strip"></p><div class="choices" id="fixChoices"></div><div id="fixFeedback" class="feedback" aria-live="polite"></div>`;
  function render(){if(idx>=set.length){stage.innerHTML=`<h3>Challenge complete!</h3><p>Score mo: <b>${score} / 5</b>.</p><button class="btn primary" id="fixAgain">Laruin muli</button>`;$("fixAgain").onclick=()=>startGame("fix");return;}const q=set[idx];$("fixCount").textContent=`${idx+1} / 5`;$("fixQ").textContent="Ano ang tamang pagwawasto?";$("fixStatement").textContent="Pahayag: "+q.choices[(q.a+1)%4];$("fixChoices").innerHTML="";$("fixFeedback").textContent="";const options=[{text:"Ang pahayag ay mali; "+q.why,a:0},{text:"Tama ang pahayag; walang kailangang baguhin.",a:1}];options.forEach((o,i)=>{const b=document.createElement("button");b.className="choice";b.textContent=o.text;b.onclick=()=>{[...$("fixChoices").children].forEach(x=>x.disabled=true);if(i===0){score++;$("fixFeedback").className="feedback good";$("fixFeedback").textContent="Magaling! "+q.why;sound();}else{$("fixFeedback").className="feedback bad";$("fixFeedback").textContent="Balikan ang konsepto: "+q.why;state.wrongTopics[q.topic]=(state.wrongTopics[q.topic]||0)+1;}state.answered++;save();setTimeout(()=>{idx++;render();},900);};$("fixChoices").appendChild(b);});}
  render();
 }
}
$("startBtn").addEventListener("click",()=>{scrollToSection("learn");toast("Simulan sa Memory Booster!");});
$("resumeBtn").addEventListener("click",()=>scrollToSection(state.answered?"practice":"learn"));
document.querySelectorAll("[data-section]").forEach(b=>b.addEventListener("click",()=>scrollToSection(b.dataset.section)));
$("practiceStart").addEventListener("click",startPractice);$("nextPractice").addEventListener("click",nextPractice);$("hintBtn").addEventListener("click",hint);
$("quickFireBtn").addEventListener("click",()=>startGame("quick"));$("fixMistakeBtn").addEventListener("click",()=>startGame("fix"));$("quizStart").addEventListener("click",startQuiz);
$("soundToggle").addEventListener("click",()=>{soundOn=!soundOn;$("soundToggle").setAttribute("aria-pressed",String(soundOn));$("soundToggle").innerHTML=(soundOn?"♫":"♪")+" <span>"+(soundOn?"Tunog on":"Tunog")+"</span>";if(soundOn)sound();});
$("resetProgress").addEventListener("click",()=>{if(confirm("Sigurado ka bang i-reset ang lahat ng progress at reflection?")){localStorage.removeItem(storeKey);state={answered:0,best:0,wrongTopics:{},reflection:""};save();updateStats();toast("Na-reset ang progress.");}});
$("saveReflection").addEventListener("click",()=>{state.reflection=$("reflectionText").value;save();$("reflectionStatus").textContent="Na-save sa browser na ito.";setTimeout(()=>$("reflectionStatus").textContent="",2500);});
$("closeDialog").addEventListener("click",()=>$("resultDialog").close());
populateTopics();updateStats();
})();
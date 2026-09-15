let soundOn=true;
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function speak(text){if(!soundOn||!("speechSynthesis"in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.88;u.pitch=1.04;speechSynthesis.speak(u)}
function feedback(el,text,good=true){el.textContent=text;el.style.color=good?"#28733f":"#b44e3a"}
$("#soundBtn").addEventListener("click",()=>{soundOn=!soundOn;$("#soundBtn").textContent=soundOn?"🔊 Sound":"🔇 Sound Off"});
$$(".vocab-card").forEach(b=>b.addEventListener("click",()=>speak(b.dataset.say)));
$$(".real-life-grid button").forEach(b=>b.addEventListener("click",()=>{$("#realLifeDisplay").textContent="💬 "+b.dataset.example+" — "+b.dataset.say;speak(b.dataset.say)}));

$("#countDemo").addEventListener("click",()=>speak("One, two, three, four, five. There are five pencils."));
const countObjects=$("#countObjects"),countChoices=$("#countChoices");let countAnswer=0;
function newCount(){countAnswer=Math.floor(Math.random()*7)+2;countObjects.innerHTML="";for(let i=0;i<countAnswer;i++)countObjects.innerHTML+="<span>🍎</span>";let nums=[countAnswer];while(nums.length<3){let n=Math.max(1,countAnswer+(Math.floor(Math.random()*5)-2));if(!nums.includes(n))nums.push(n)}nums.sort(()=>Math.random()-.5);countChoices.innerHTML=nums.map(n=>`<button data-n="${n}">${n}</button>`).join("");$$("[data-n]").forEach(b=>b.addEventListener("click",()=>{if(+b.dataset.n===countAnswer){b.classList.add("correct");feedback($("#countFeedback"),"🌟 Correct! You counted "+countAnswer+" objects.");speak("Correct! There are "+countAnswer+" objects.")}else{b.classList.add("wrong");feedback($("#countFeedback"),"Try again. Count each object carefully.",false)}}))}
newCount();$("#newCount").addEventListener("click",newCount);

for(let i=1;i<=20;i++){let b=document.createElement("button");b.textContent=i;b.addEventListener("click",()=>speak(String(i)));$("#numberChart").appendChild(b)}

$$(".measure-objects button").forEach(b=>b.addEventListener("click",()=>{ $$(".measure-objects button").forEach(x=>x.classList.remove("correct","wrong"));if(b.dataset.correct==="true"){b.classList.add("correct");feedback($("#measureFeedback"),"📏 Correct! 10 units is longer than 6 units.");}else{b.classList.add("wrong");feedback($("#measureFeedback"),"Look at the measurements. Which number is greater?",false)}}));
$("#measureSpeak").addEventListener("click",()=>speak("The ruler is longer."));

const shapeStates=[["circle","circle","same"],["square","square","same"],["triangle","triangle","same"],["circle","square","different"],["triangle","circle","different"],["square","triangle","different"]];let shapeIndex=0;
function showShape(){let s=shapeStates[shapeIndex];$("#shapePair").innerHTML=`<div class="shape ${s[0]}"></div><div class="shape ${s[1]}"></div>`;$("#shapePair").dataset.answer=s[2];$("#shapeFeedback").textContent=""}
showShape();$$("[data-shape]").forEach(b=>b.addEventListener("click",()=>{if(b.dataset.shape===$("#shapePair").dataset.answer){b.classList.add("correct");feedback($("#shapeFeedback"),"🌟 Correct! You identified the shapes.");}else{b.classList.add("wrong");feedback($("#shapeFeedback"),"Look carefully at the two shapes.",false)}}));
$("#newShape").addEventListener("click",()=>{shapeIndex=(shapeIndex+1)%shapeStates.length;showShape();$$("[data-shape]").forEach(b=>b.classList.remove("correct","wrong"))});

let timer=null,startTime=0,elapsed=0;
function renderTime(){let t=elapsed,sec=Math.floor(t/1000),tent=Math.floor((t%1000)/100);$("#stopwatchDisplay").textContent=`${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}.${tent}`}
$("#startStopwatch").addEventListener("click",()=>{if(timer){clearInterval(timer);timer=null;$("#startStopwatch").textContent="▶ Start"}else{startTime=Date.now()-elapsed;timer=setInterval(()=>{elapsed=Date.now()-startTime;renderTime()},50);$("#startStopwatch").textContent="⏸ Pause"}});
$("#resetStopwatch").addEventListener("click",()=>{clearInterval(timer);timer=null;elapsed=0;renderTime();$("#startStopwatch").textContent="▶ Start"});
$$(".answer-options button").forEach(b=>b.addEventListener("click",()=>{ $$(".answer-options button").forEach(x=>x.classList.remove("correct","wrong"));if(b.dataset.correct==="true"){b.classList.add("correct");feedback($("#timeFeedback"),"⏱️ Correct! A stopwatch shows numbers that help us measure time.");}else{b.classList.add("wrong");feedback($("#timeFeedback"),"Try again. What appears on a stopwatch?",false)}}));

$$(".talk-grid button").forEach(b=>b.addEventListener("click",()=>{$("#talkDisplay").textContent="💬 "+b.dataset.talk;speak(b.dataset.talk)}));
$("#patternCheck").addEventListener("click",()=>{let v=$("#patternInput").value.trim();if(v){feedback($("#patternFeedback"),"🌟 Great! I see numbers in "+v+".");speak("I see numbers in "+v)}else feedback($("#patternFeedback"),"Write a place where you see numbers.",false)});
$("#bigIdeaRead").addEventListener("click",()=>speak("We see numbers everywhere. Numbers help us to count, measure, tell shapes and tell time."));
$("#finishBtn").addEventListener("click",()=>{$("#finishMessage").textContent="🎉 Congratulations, Math Explorer! You completed the Math Mission with Ms. Rachel.";speak("Congratulations, Math Explorer! You completed the Math Mission with Ms. Rachel.")});
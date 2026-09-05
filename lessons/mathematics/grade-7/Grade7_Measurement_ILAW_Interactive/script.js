const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

let stars = 0;
let completed = new Set();

function updateProgress(){
  const total = 12;
  const percent = Math.min(100, Math.round((completed.size / total) * 100));
  $("#topProgress").style.width = percent + "%";
  $("#heroProgress").textContent = percent + "%";
  $("#heroScore").textContent = stars;
  $("#masterBar").style.width = percent + "%";
  $("#masterText").textContent = `${stars} stars collected. ${percent >= 80 ? "You're close to mastery!" : "Keep going!"}`;
}
function reward(key, amount=1){
  if(completed.has(key)) return;
  completed.add(key); stars += amount; updateProgress();
  showToast(`⭐ +${amount} star${amount>1?'s':''}! Great work!`);
}
function showToast(msg){
  const t=$("#toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>t.classList.remove("show"),1800);
}

$("#menuToggle").addEventListener("click",()=>$("#navLinks").classList.toggle("open"));
$$(".nav-links a").forEach(a=>a.addEventListener("click",()=>$("#navLinks").classList.remove("open")));
$("#year").textContent=new Date().getFullYear();

window.addEventListener("scroll",()=>{
  const doc=document.documentElement;
  const p=window.scrollY/(doc.scrollHeight-doc.clientHeight)*100;
  $("#topProgress").style.width=Math.max(0,p)+"%";
});

$(".answer-toggle").addEventListener("click",e=>{
  const ans=$("#storyAnswer");
  ans.textContent=e.currentTarget.dataset.answer;
  ans.classList.remove("hidden-answer");
  reward("intro",1);
});

$$(".choice").forEach((b,i)=>b.addEventListener("click",()=>{
  const good=b.dataset.choice==="good";
  $("#choiceFeedback").textContent=good ? "✅ Yes! A measurement needs a number and a unit." : "💡 Almost! “5” alone does not tell us what is being measured.";
  $("#choiceFeedback").style.color=good ? "#08774f" : "#b45309";
  if(good) reward("choice"+i,1);
}));

const tools={
 length:{title:"Length: Metric Ladder",explain:"Move between metric units by powers of 10.",units:["km","m","cm","mm"],factor:{km:1000,m:1,cm:.01,mm:.001},ladder:["km","hm","dam","m","dm","cm","mm"],rule:"Each step to the right ×10; each step to the left ÷10."},
 mass:{title:"Mass: Think in grams",explain:"For metric mass, grams are the base unit.",units:["kg","g","mg"],factor:{kg:1000,g:1,mg:.001},ladder:["kg","hg","dag","g","dg","cg","mg"],rule:"Use the metric prefix relationship. 1 kg = 1,000 g and 1 g = 1,000 mg."},
 capacity:{title:"Capacity: Liters & Milliliters",explain:"Liters and milliliters are common SI-based units for capacity.",units:["L","mL"],factor:{L:1,mL:.001},ladder:["L","mL"],rule:"1 L = 1,000 mL. To convert L → mL, multiply by 1,000."},
 temperature:{title:"Temperature: A different conversion",explain:"Temperature conversions use formulas rather than simply moving decimal places.",units:["°C","°F","K"],factor:null,ladder:["°C","°F","K"],rule:"°F = (°C × 9/5) + 32. °C = (°F − 32) × 5/9. K = °C + 273.15."}
};
let currentTool="length";

function loadTool(name){
  currentTool=name; const t=tools[name];
  $("#toolTitle").textContent=t.title; $("#toolExplain").textContent=t.explain;
  $("#metricLadder").innerHTML=t.ladder.map((u,i)=>`<span class="ladder-unit">${u}</span>${i<t.ladder.length-1?'<span class="ladder-arrow">→</span>':''}`).join("");
  $("#ruleBox").textContent=t.rule;
  const from=$("#fromUnit"),to=$("#toUnit");
  from.innerHTML=t.units.map(u=>`<option>${u}</option>`).join("");
  to.innerHTML=t.units.map(u=>`<option>${u}</option>`).join("");
  if(t.units.length>1) to.selectedIndex=1;
}
loadTool("length");
$$(".tool-tab").forEach(btn=>btn.addEventListener("click",()=>{
  $$(".tool-tab").forEach(x=>x.classList.remove("active")); btn.classList.add("active"); loadTool(btn.dataset.tool);
}));

$("#convertBtn").addEventListener("click",()=>{
  const value=Number($("#convertValue").value), from=$("#fromUnit").value, to=$("#toUnit").value;
  if(!Number.isFinite(value)){ $("#conversionResult").textContent="Enter a valid number."; return; }
  let result;
  if(currentTool==="temperature"){
    if(from===to) result=value;
    else if(from==="°C"&&to==="°F") result=value*9/5+32;
    else if(from==="°F"&&to==="°C") result=(value-32)*5/9;
    else if(from==="°C"&&to==="K") result=value+273.15;
    else if(from==="K"&&to==="°C") result=value-273.15;
    else if(from==="°F"&&to==="K") result=(value-32)*5/9+273.15;
    else if(from==="K"&&to==="°F") result=(value-273.15)*9/5+32;
  }else{
    const t=tools[currentTool];
    result=value*t.factor[from]/t.factor[to];
  }
  const rounded=Math.round((result+Number.EPSILON)*10000)/10000;
  $("#conversionResult").innerHTML=`<b>${value} ${from}</b> = <strong>${rounded} ${to}</strong>`;
  reward("converter",1);
});

$$(".answer-options").forEach((group,index)=>{
  group.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{
    const buttons=group.querySelectorAll("button"); buttons.forEach(x=>x.disabled=true);
    const correctText=group.dataset.answer;
    const val=btn.textContent.replace(/,/g,"").replace(" kg","").replace(" m","").replace(" cm","").replace(" mL","");
    const correct=Math.abs(Number(val)-Number(correctText))<0.00001;
    btn.classList.add(correct?"correct":"wrong");
    const feedback=group.parentElement.querySelector(".mission-feedback");
    feedback.textContent=correct?"✅ Correct! Excellent conversion.":"❌ Not quite. Check the direction and the conversion factor.";
    feedback.style.color=correct?"#08774f":"#b42338";
    if(correct) reward("mission"+index,2);
  }));
});

$("#checkWord").addEventListener("click",()=>{
  const ans=Number($("#wordAnswer").value);
  if(Math.abs(ans-13.5)<0.001){
    $("#wordFeedback").textContent="🎉 Correct! 18 × 750 mL = 13,500 mL = 13.5 L.";
    $("#wordFeedback").style.color="#08774f"; reward("word",2);
  }else{
    $("#wordFeedback").textContent="💡 Try again: multiply the bottles by 750 mL, then convert mL to L.";
    $("#wordFeedback").style.color="#b45309";
  }
});

$$(".reflection").forEach(b=>b.addEventListener("click",()=>{
  $$(".reflection").forEach(x=>x.classList.remove("selected")); b.classList.add("selected");
  $("#reflectionOutput").textContent="🌟 "+b.dataset.reflect+" Keep practicing so you can explain your thinking!";
  reward("reflection",1);
}));

const bossQuestions=[
  {q:"3.6 km is equal to...",o:["36 m","360 m","3,600 m","36,000 m"],a:2},
  {q:"0.75 kg is equal to...",o:["7.5 g","75 g","750 g","7,500 g"],a:2},
  {q:"5 feet is equal to how many centimeters? (1 ft = 30.48 cm)",o:["60.96 cm","91.44 cm","152.4 cm","304.8 cm"],a:2},
  {q:"2.4 L is equal to...",o:["24 mL","240 mL","2,400 mL","24,000 mL"],a:2},
  {q:"20°C is equal to...",o:["52°F","68°F","72°F","80°F"],a:1}
];
let bossIndex=0,bossScore=0,bossTimer=null,time=30,bossActive=false;
function renderBoss(){
  const q=bossQuestions[bossIndex];
  $("#bossQuestion").textContent=q.q;
  $("#bossOptions").innerHTML=q.o.map((x,i)=>`<button data-i="${i}">${x}</button>`).join("");
  $$("#bossOptions button").forEach(b=>b.addEventListener("click",()=>bossAnswer(Number(b.dataset.i))));
}
function bossAnswer(i){
  if(!bossActive)return;
  const q=bossQuestions[bossIndex];
  if(i===q.a){bossScore++; showToast("⚡ Correct!");} else showToast("Keep moving!");
  bossIndex++;
  if(bossIndex>=bossQuestions.length){endBoss();} else renderBoss();
}
function endBoss(){
  bossActive=false; clearInterval(bossTimer); $("#bossOptions").innerHTML="";
  const percent=Math.round(bossScore/bossQuestions.length*100);
  $("#bossResult").textContent=`🏁 Boss Challenge complete: ${bossScore}/${bossQuestions.length} (${percent}%).`;
  $("#startBoss").textContent="Play Again";
  if(percent>=80) reward("boss",3);
}
function startBoss(){
  clearInterval(bossTimer); bossActive=true; bossIndex=0; bossScore=0; time=30;
  $("#timer").textContent=time; $("#bossResult").textContent=""; $("#startBoss").textContent="Challenge Running…"; renderBoss();
  bossTimer=setInterval(()=>{time--;$("#timer").textContent=time;if(time<=0){endBoss();}},1000);
}
$("#startBoss").addEventListener("click",startBoss);

$("#finalCheck").addEventListener("click",()=>{
  const percent=Math.min(100,Math.round(completed.size/12*100));
  const box=$("#masteryMessage");
  if(percent>=80){box.textContent=`🏆 Measurement Master unlocked! You reached ${percent}% mission progress with ${stars} stars. Excellent work!`;box.style.color="#08774f";reward("mastery",3);}
  else{box.textContent=`📚 You're at ${percent}%. Complete more mission activities, then check again. You've got this!`;box.style.color="#b45309";}
});

$("#quickQuizBtn").addEventListener("click",()=>$("#quickModal").classList.add("open"));
$("#closeModal").addEventListener("click",()=>$("#quickModal").classList.remove("open"));
$("#quickModal").addEventListener("click",e=>{if(e.target.id==="quickModal")$("#quickModal").classList.remove("open")});
$$(".quick-options button").forEach(b=>b.addEventListener("click",()=>{
  $$(".quick-options button").forEach(x=>x.classList.remove("correct-choice","wrong-choice"));
  const correct=b.dataset.correct==="true"; b.classList.add(correct?"correct-choice":"wrong-choice");
  $("#quickFeedback").textContent=correct?"✅ Correct! 250 cm = 2.5 m. They are equal.":"💡 Remember: 100 cm = 1 m, so 250 cm = 2.5 m.";
  if(correct) reward("quick",1);
}));

updateProgress();

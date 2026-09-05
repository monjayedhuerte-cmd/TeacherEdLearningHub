const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let stars=0, completed=new Set(), total=14;
function updateProgress(){let p=Math.min(100,Math.round(completed.size/total*100));$("#starCount").textContent=stars;$("#progressText").textContent=p+"%";$("#masterBar").style.width=p+"%";$("#masterPercent").textContent=p+"% complete";}
function reward(key,n=1){if(completed.has(key))return;completed.add(key);stars+=n;updateProgress();toast(`⭐ +${n} star${n===1?"":"s"} earned!`)}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),1700)}
$("#year").textContent=new Date().getFullYear();

$("#menuToggle").addEventListener("click",()=>{const open=$("#navLinks").classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",open)});
$$(".nav-links a").forEach(a=>a.addEventListener("click",()=>$("#navLinks").classList.remove("open")));
window.addEventListener("scroll",()=>{const d=document.documentElement;$("#scrollProgress").style.width=(scrollY/(d.scrollHeight-d.clientHeight)*100)+"%"});

$$(".choice-btn").forEach(b=>b.addEventListener("click",()=>{
 const val=b.dataset.intro, f=$("#introFeedback");
 if(val==="b"){f.textContent="🎉 Correct! Can B has the greater volume because its radius is larger. The radius matters twice in r².";f.style.color="#08774f";reward("intro",1)}
 else{f.textContent="💡 Think about the circular base. A larger radius makes the base area grow because we square the radius.";f.style.color="#b45309"}
}));

const rSlider=$("#rSlider"), hSlider=$("#hSlider");
function updateLab(){
 const r=Number(rSlider.value),h=Number(hSlider.value),v=3.14*r*r*h;
 $("#rVal").textContent=r;$("#hVal").textContent=h;$("#rSq").textContent=r*r;$("#hNum").textContent=h;
 $("#liveVolume").textContent=v.toFixed(2)+" cm³";$("#labRadius").textContent="r = "+r;$("#labHeight").textContent="h = "+h;
}
rSlider.addEventListener("input",updateLab);hSlider.addEventListener("input",updateLab);updateLab();

$$(".quiz-card").forEach((q,qi)=>{
 const ans=Number(q.dataset.answer);
 $$(".answers button",q).forEach(b=>b.addEventListener("click",()=>{
   const bs=$$(".answers button",q);bs.forEach(x=>x.disabled=true);
   const ok=Number(b.dataset.i)===ans;b.classList.add(ok?"correct":"wrong");
   const f=$(".quiz-feedback",q);
   f.textContent=ok?"✅ Correct! Nice reasoning.":"❌ Not quite. Revisit V = πr²h and check the radius, not diameter.";
   f.style.color=ok?"#08774f":"#ad2438";
   if(ok)reward("quiz"+qi,1);
 }));
});

$("#checkWord").addEventListener("click",()=>{
 const a=Number($("#wordAnswer").value), f=$("#wordFeedback");
 if(Math.abs(a-1570)<.01){f.textContent="🎉 Correct! V = 3.14 × 5² × 20 = 1,570 cm³.";f.style.color="#08774f";reward("word",2)}
 else{f.textContent="💡 Square the radius first: 5² = 25. Then multiply 3.14 × 25 × 20.";f.style.color="#b45309"}
});

const bossQs=[
 ["A cylinder has r = 3 cm and h = 4 cm. Using π = 3.14, V = ?",["37.68 cm³","113.04 cm³","75.36 cm³","150.72 cm³"],1],
 ["A cylinder's diameter is 14 m. Its radius is…",["7 m","14 m","28 m","3.5 m"],0],
 ["If r = 2 cm and h = 5 cm, V = ?",["31.4 cm³","62.8 cm³","20 cm³","125.6 cm³"],1],
 ["Which formula is correct for cylinder volume?",["V=2πr²h","V=πrh","V=πr²h","V=πd²h"],2],
 ["A cylinder has a volume of 314 cm³, r=5 cm, π=3.14. What is h?",["2 cm","3 cm","4 cm","5 cm"],1]
];
let bossIndex=0,bossScore=0,bossTime=40,bossTimer=null,bossActive=false;
function renderBoss(){const q=bossQs[bossIndex];$("#bossQuestion").textContent=q[0];$("#bossOptions").innerHTML=q[1].map((x,i)=>`<button data-i="${i}">${x}</button>`).join("");$$(".boss-options button").forEach(b=>b.addEventListener("click",()=>answerBoss(Number(b.dataset.i))))}
function answerBoss(i){if(!bossActive)return;if(i===bossQs[bossIndex][2]){bossScore++;toast("⚡ Correct!")}else toast("Keep reasoning!");bossIndex++;if(bossIndex>=bossQs.length)finishBoss();else renderBoss()}
function finishBoss(){bossActive=false;clearInterval(bossTimer);$("#bossOptions").innerHTML="";const p=Math.round(bossScore/bossQs.length*100);$("#bossStatus").textContent="Finished!";$("#bossResult").textContent=`🏁 ${bossScore}/${bossQs.length} correct (${p}%).`;$("#startBoss").textContent="Play Again";if(p>=80)reward("boss",2)}
$("#startBoss").addEventListener("click",()=>{clearInterval(bossTimer);bossActive=true;bossIndex=0;bossScore=0;bossTime=40;$("#timer").textContent=bossTime;$("#bossStatus").textContent="Challenge active!";$("#bossResult").textContent="";$("#startBoss").textContent="Running…";renderBoss();bossTimer=setInterval(()=>{bossTime--;$("#timer").textContent=bossTime;if(bossTime<=0)finishBoss()},1000)});

$$(".reflection").forEach((b,i)=>b.addEventListener("click",()=>{$$(".reflection").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");$("#reflectionPanel").textContent="🌟 Great reflection: "+b.textContent+" Try explaining your reasoning aloud.";reward("reflection"+i,1)}));
$$(".exit-options button").forEach(b=>b.addEventListener("click",()=>{const ok=b.dataset.correct==="true";$$(".exit-options button").forEach(x=>x.disabled=true);b.classList.add(ok?"correct":"wrong");$("#exitFeedback").textContent=ok?"✅ Excellent! That statement captures the meaning of V = base area × height.":"💡 Remember: cylinder volume = area of circular base × height.";$("#exitFeedback").style.color=ok?"#08774f":"#b45309";if(ok)reward("exit",1)}));

$("#masterBtn").addEventListener("click",()=>{const p=Math.min(100,Math.round(completed.size/total*100));if(p>=80){$("#masterMessage").textContent=`🏆 Cylinder Master unlocked! You reached ${p}% and earned ${stars} stars. Excellent work!`;$("#masterMessage").style.color="#08774f";reward("mastery",2)}else{$("#masterMessage").textContent=`📚 You are at ${p}%. Complete more missions and try the mastery check again.`;$("#masterMessage").style.color="#b45309"}});

$("#quickStart").addEventListener("click",()=>$("#quickModal").classList.add("open"));$("#closeQuick").addEventListener("click",()=>$("#quickModal").classList.remove("open"));$("#quickModal").addEventListener("click",e=>{if(e.target.id==="quickModal")$("#quickModal").classList.remove("open")});
$$(".quick-options button").forEach(b=>b.addEventListener("click",()=>{const ok=b.dataset.ok==="true";$$(".quick-options button").forEach(x=>x.classList.remove("correct","wrong"));b.classList.add(ok?"correct":"wrong");$("#quickFeedback").textContent=ok?"✅ Correct! Radius is half the diameter: 12 ÷ 2 = 6 cm.":"💡 Radius is half of the diameter.";if(ok)reward("quick",1)}));

updateProgress();

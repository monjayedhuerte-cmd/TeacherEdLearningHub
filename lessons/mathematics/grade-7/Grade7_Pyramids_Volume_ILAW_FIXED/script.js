const $=s=>document.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
let stars=0, done=new Set(), total=14;
function progress(){const p=Math.min(100,Math.round(done.size/total*100));$("#stars").textContent=stars;$("#progressText").textContent=p+"%";$("#masterBar").style.width=p+"%";$("#masterPercent").textContent=p+"% complete"}
function reward(key,n=1){if(done.has(key))return;done.add(key);stars+=n;progress();toast(`⭐ +${n} star${n>1?"s":""} earned!`)}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),1700)}
$("#year").textContent=new Date().getFullYear();
$("#menuToggle").addEventListener("click",()=>{const open=$("#navLinks").classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",open)});
$$(".nav-links a").forEach(a=>a.addEventListener("click",()=>$("#navLinks").classList.remove("open")));
addEventListener("scroll",()=>{const d=document.documentElement;$("#scrollProgress").style.width=(scrollY/(d.scrollHeight-d.clientHeight)*100)+"%"});

$$(".choice").forEach(b=>b.addEventListener("click",()=>{const f=$("#mysteryFeedback");if(b.dataset.answer==="three"){f.textContent="🎉 Correct! The pyramid has one-third the volume of the matching prism, so the prism holds about three times as much.";f.style.color="#08774f";reward("mystery")}else{f.textContent="💡 Think about the one-third relationship between a pyramid and a matching prism.";f.style.color="#b45309"}}));

$("#animateDerivation").addEventListener("click",()=>{$(".three-pyramids").classList.toggle("animate");toast("🔺 Imagine three equal-volume pyramid shares filling the prism.")});

function updateLab(){const l=+$("#lenSlider").value,w=+$("#widSlider").value,h=+$("#heiSlider").value,b=l*w,v=b*h/3;$("#lenValue").textContent=l;$("#widValue").textContent=w;$("#heiValue").textContent=h;$("#baseCalc").textContent=b;$("#volumeResult").textContent=v.toFixed(2)+" cm³";$("#hLabel").textContent="h = "+h}
["#lenSlider","#widSlider","#heiSlider"].forEach(id=>$(id).addEventListener("input",updateLab));updateLab();

$$(".quiz").forEach((q,qi)=>{const answer=+q.dataset.answer;$$(".options button",q).forEach(btn=>btn.addEventListener("click",()=>{const buttons=$$(".options button",q);buttons.forEach(x=>x.disabled=true);const ok=+btn.dataset.i===answer;btn.classList.add(ok?"correct":"wrong");const f=$(".quiz-feedback",q);f.textContent=ok?"✅ Correct!":"❌ Not quite. Recheck B and the ⅓ factor.";f.style.color=ok?"#08774f":"#ad263c";if(ok)reward("quiz"+qi)}))});

$$(".estimate-buttons button").forEach(b=>b.addEventListener("click",()=>{const f=$("#estimateFeedback");if(b.dataset.est==="200"){f.textContent="🎉 Correct! V = ⅓(60)(10) = 200 cm³.";f.style.color="#08774f";reward("estimate",1)}else{f.textContent="💡 Use one-third of B×h: 60×10÷3.";f.style.color="#b45309"}}));
$("#checkWord").addEventListener("click",()=>{const a=+$("#wordAnswer").value,f=$("#wordFeedback");if(Math.abs(a-384)<.001){f.textContent="🎉 Correct! B = 12² = 144 m², so V = ⅓(144)(8) = 384 m³.";f.style.color="#08774f";reward("word",2)}else{f.textContent="💡 First find B = s² = 12² = 144 m², then use V = ⅓Bh.";f.style.color="#b45309"}});

const bossQs=[
["A rectangular pyramid has B=30 cm² and h=9 cm. V = ?",["90 cm³","270 cm³","39 cm³","10 cm³"],0],
["A square pyramid has side 8 m and h=6 m. V = ?",["64 m³","128 m³","384 m³","192 m³"],1],
["Which measurement must be perpendicular to the base?",["Slant height","Base edge","Perpendicular height","Lateral edge"],2],
["A pyramid has B=72 cm² and h=5 cm. V = ?",["120 cm³","360 cm³","72 cm³","30 cm³"],0],
["A rectangular pyramid has l=10, w=6, h=9. V = ?",["180","540","90","270"],0]
];
let bi=0,bs=0,time=45,active=false,timer;
function renderBoss(){const q=bossQs[bi];$("#bossQuestion").textContent=q[0];$("#bossOptions").innerHTML=q[1].map((x,i)=>`<button data-i="${i}">${x}</button>`).join("");$$(".boss-options button").forEach(b=>b.addEventListener("click",()=>answerBoss(+b.dataset.i)))}
function answerBoss(i){if(!active)return;if(i===bossQs[bi][2]){bs++;toast("⚡ Correct!")}else toast("Keep thinking!");bi++;if(bi>=bossQs.length)finishBoss();else renderBoss()}
function finishBoss(){active=false;clearInterval(timer);$("#bossOptions").innerHTML="";const pct=Math.round(bs/bossQs.length*100);$("#bossStatus").textContent="Finished!";$("#bossResult").textContent=`🏁 ${bs}/${bossQs.length} correct (${pct}%).`;$("#startBoss").textContent="Play Again";if(pct>=80)reward("boss",2)}
$("#startBoss").addEventListener("click",()=>{clearInterval(timer);active=true;bi=0;bs=0;time=45;$("#timer").textContent=time;$("#bossStatus").textContent="Challenge active!";$("#bossResult").textContent="";$("#startBoss").textContent="Running…";renderBoss();timer=setInterval(()=>{time--;$("#timer").textContent=time;if(time<=0)finishBoss()},1000)});

$$(".reflection").forEach((b,i)=>b.addEventListener("click",()=>{$$(".reflection").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");$("#reflectionOutput").textContent="🌟 "+b.textContent+" Now explain your reasoning in one or two sentences.";reward("reflection"+i)}));
$$(".exit-options button").forEach(b=>b.addEventListener("click",()=>{const ok=b.dataset.correct==="true";$$(".exit-options button").forEach(x=>x.disabled=true);b.classList.add(ok?"correct":"wrong");$("#exitFeedback").textContent=ok?"✅ Exactly! The ⅓ comes from the pyramid-to-prism volume relationship for equal base area and perpendicular height.":"💡 Focus on the comparison: pyramid volume = one-third of the matching prism volume.";$("#exitFeedback").style.color=ok?"#08774f":"#b45309";if(ok)reward("exit")}));

$("#masterBtn").addEventListener("click",()=>{const p=Math.min(100,Math.round(done.size/total*100));if(p>=80){$("#masterMessage").textContent=`🏆 Pyramid Volume Master! You reached ${p}% and earned ${stars} stars.`;$("#masterMessage").style.color="#08774f";reward("mastery",2)}else{$("#masterMessage").textContent=`📚 You are at ${p}%. Complete more missions, then try again.`;$("#masterMessage").style.color="#b45309"}});

$("#quickChallenge").addEventListener("click",()=>$("#quickModal").classList.add("open"));$("#closeQuick").addEventListener("click",()=>$("#quickModal").classList.remove("open"));$("#quickModal").addEventListener("click",e=>{if(e.target.id==="quickModal")$("#quickModal").classList.remove("open")});
$$(".quick-options button").forEach(b=>b.addEventListener("click",()=>{const ok=b.dataset.ok==="true";$$(".quick-options button").forEach(x=>x.classList.remove("correct","wrong"));b.classList.add(ok?"correct":"wrong");$("#quickFeedback").textContent=ok?"✅ Correct! A matching pyramid has one-third the prism's volume.":"💡 Remember the key relationship: Vpyramid = ⅓Vprism.";$("#quickFeedback").style.color=ok?"#08774f":"#b45309";if(ok)reward("quick")}));
progress();

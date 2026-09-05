const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let stars=0,done=new Set(); const TOTAL=13;
function progress(){let pct=Math.min(100,Math.round(done.size/TOTAL*100));$("#starCount").textContent=stars;$("#percentCount").textContent=pct+"%";$("#masterBar").style.width=pct+"%";$("#masterText").textContent=pct+"% complete";}
function reward(key,n=1){if(done.has(key))return;done.add(key);stars+=n;progress();toast(`⭐ +${n} star${n>1?"s":""}!`)}
function toast(msg){let t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.x);toast.x=setTimeout(()=>t.classList.remove("show"),1700)}
$("#year").textContent=new Date().getFullYear();

$("#menuBtn").addEventListener("click",()=>{let open=$("#navLinks").classList.toggle("open");$("#menuBtn").setAttribute("aria-expanded",open)});
$$(".nav-links a").forEach(a=>a.addEventListener("click",()=>$("#navLinks").classList.remove("open")));
addEventListener("scroll",()=>{let d=document.documentElement;$("#scrollBar").style.width=(scrollY/(d.scrollHeight-d.clientHeight)*100)+"%"});

$("#revealWhy").addEventListener("click",()=>{$("#whyText").textContent="A complete measurement has a numerical value and a unit. The unit tells us what the number means.";reward("introReveal")});
$$(".choice").forEach((b,i)=>b.addEventListener("click",()=>{let good=b.dataset.good==="true";$("#introFeedback").textContent=good?"✅ Correct! The number is connected to a clear unit.":"💡 Good thinking! The label needs a unit such as liters, milliliters, or gallons.";$("#introFeedback").style.color=good?"#08774f":"#b45309";if(good)reward("introChoice"+i)}));

const topics={
length:{title:"Length: Metric Ladder",text:"Length tells how long or far something is. Common metric units include kilometer, meter, centimeter, and millimeter.",units:["km","hm","dam","m","dm","cm","mm"],select:["km","m","cm","mm"],factor:{km:1000,m:1,cm:.01,mm:.001},rule:"Each step right is ×10; each step left is ÷10. Example: 1 m = 100 cm."},
mass:{title:"Mass: Grams & Kilograms",text:"Mass describes how much matter is in an object. Common metric units include kilograms, grams, and milligrams.",units:["kg","hg","dag","g","dg","cg","mg"],select:["kg","g","mg"],factor:{kg:1000,g:1,mg:.001},rule:"1 kg = 1,000 g and 1 g = 1,000 mg. Going to smaller units increases the number."},
capacity:{title:"Capacity: Liters & Milliliters",text:"Capacity describes how much liquid a container can hold. Liters and milliliters are common units.",units:["L","mL"],select:["L","mL"],factor:{L:1,mL:.001},rule:"1 L = 1,000 mL. Therefore, L → mL means ×1,000; mL → L means ÷1,000."},
temperature:{title:"Temperature: Use a Formula",text:"Temperature is different because Celsius and Fahrenheit are related by formulas, not just powers of 10.",units:["°C","°F","K"],select:["°C","°F","K"],factor:null,rule:"°F = (°C × 9/5) + 32. °C = (°F − 32) × 5/9. K = °C + 273.15."}
};
let topic="length";
function loadTopic(name){topic=name;let t=topics[name];$("#topicTitle").textContent=t.title;$("#topicText").textContent=t.text;$("#ladder").innerHTML=t.units.map((u,i)=>`<span class="unit-step">${u}</span>${i<t.units.length-1?'<span class="arrow">→</span>':''}`).join("");$("#topicRule").textContent=t.rule;$("#fromUnit").innerHTML=t.select.map(x=>`<option>${x}</option>`).join("");$("#toUnit").innerHTML=t.select.map(x=>`<option>${x}</option>`).join("");$("#toUnit").selectedIndex=t.select.length>1?1:0}
loadTopic("length");
$$(".tab").forEach(b=>b.addEventListener("click",()=>{$$(".tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");loadTopic(b.dataset.topic)}));

$("#convertBtn").addEventListener("click",()=>{
 let v=Number($("#convertValue").value),f=$("#fromUnit").value,t=$("#toUnit").value;if(!Number.isFinite(v)){return}
 let r;if(topic==="temperature"){if(f===t)r=v;else if(f==="°C"&&t==="°F")r=v*9/5+32;else if(f==="°F"&&t==="°C")r=(v-32)*5/9;else if(f==="°C"&&t==="K")r=v+273.15;else if(f==="K"&&t==="°C")r=v-273.15;else if(f==="°F"&&t==="K")r=(v-32)*5/9+273.15;else r=(v-273.15)*9/5+32}else{let x=topics[topic];r=v*x.factor[f]/x.factor[t]}
r=Math.round((r+Number.EPSILON)*100000)/100000;$("#conversionResult").innerHTML=`<b>${v} ${f}</b> = <strong>${r} ${t}</strong>`;reward("converter",1)
});

$$(".question").forEach((q,qi)=>{let ans=Number(q.dataset.answer);$$(".options button",q).forEach(b=>b.addEventListener("click",()=>{let bs=$$(".options button",q);bs.forEach(x=>x.disabled=true);let ok=Number(b.dataset.index)===ans;b.classList.add(ok?"correct":"wrong");let f=$(".qfeedback",q);f.textContent=ok?"✅ Correct! Your conversion is accurate.":"❌ Not quite. Recheck the conversion relationship and direction.";f.style.color=ok?"#08774f":"#b42338";if(ok)reward("q"+qi,1)}))});

$("#checkWord").addEventListener("click",()=>{let a=Number($("#wordAnswer").value);if(Math.abs(a-13.5)<.001){$("#wordFeedback").textContent="🎉 Correct! 18 × 750 mL = 13,500 mL = 13.5 L.";$("#wordFeedback").style.color="#08774f";reward("word",2)}else{$("#wordFeedback").textContent="💡 Multiply first: 18 × 750 mL. Then divide by 1,000 to change mL to L.";$("#wordFeedback").style.color="#b45309"}});

const bossQs=[
["3.6 km is equal to…",["36 m","360 m","3,600 m","36,000 m"],2],
["0.75 kg is equal to…",["7.5 g","75 g","750 g","7,500 g"],2],
["5 ft is equal to how many cm? (1 ft = 30.48 cm)",["60.96 cm","91.44 cm","152.4 cm","304.8 cm"],2],
["2.4 L is equal to…",["24 mL","240 mL","2,400 mL","24,000 mL"],2],
["20°C is equal to…",["52°F","68°F","72°F","80°F"],1]
];
let bi=0,bs=0,time=30,timer=null,active=false;
function renderBoss(){let q=bossQs[bi];$("#bossQuestion").textContent=q[0];$("#bossOptions").innerHTML=q[1].map((x,i)=>`<button data-i="${i}">${x}</button>`).join("");$$(".boss-options button").forEach(b=>b.addEventListener("click",()=>bossAnswer(Number(b.dataset.i))))}
function bossAnswer(i){if(!active)return;if(i===bossQs[bi][2]){bs++;toast("⚡ Correct!")}else toast("Keep going!");bi++;if(bi>=bossQs.length)finishBoss();else renderBoss()}
function finishBoss(){active=false;clearInterval(timer);$("#bossOptions").innerHTML="";let pct=Math.round(bs/bossQs.length*100);$("#bossResult").textContent=`🏁 Challenge complete: ${bs}/${bossQs.length} (${pct}%).`;$("#startBoss").textContent="Play Again";if(pct>=80)reward("boss",2)}
$("#startBoss").addEventListener("click",()=>{clearInterval(timer);active=true;bi=0;bs=0;time=30;$("#timer").textContent=time;$("#bossResult").textContent="";$("#startBoss").textContent="Challenge Running…";renderBoss();timer=setInterval(()=>{time--;$("#timer").textContent=time;if(time<=0)finishBoss()},1000)});

$$(".reflection").forEach((b,i)=>b.addEventListener("click",()=>{$$(".reflection").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");$("#reflectionBox").textContent="🌟 "+b.textContent+" Great! Try explaining how you know.";reward("reflection",1)}));

$("#masterBtn").addEventListener("click",()=>{let pct=Math.min(100,Math.round(done.size/TOTAL*100));if(pct>=80){$("#masterMessage").textContent=`🏆 Measurement Master unlocked! You reached ${pct}% progress and earned ${stars} stars. Excellent work!`;$("#masterMessage").style.color="#08774f";reward("mastery",2)}else{$("#masterMessage").textContent=`📚 You are at ${pct}%. Complete a few more missions, then check again. You can do it!`;$("#masterMessage").style.color="#b45309"}});

$("#openQuick").addEventListener("click",()=>$("#quickModal").classList.add("open"));$("#closeQuick").addEventListener("click",()=>$("#quickModal").classList.remove("open"));$("#quickModal").addEventListener("click",e=>{if(e.target.id==="quickModal")$("#quickModal").classList.remove("open")});
$$(".quick-options button").forEach(b=>b.addEventListener("click",()=>{let ok=b.dataset.correct==="true";$$(".quick-options button").forEach(x=>x.classList.remove("correct","wrong"));b.classList.add(ok?"correct":"wrong");$("#quickFeedback").textContent=ok?"✅ Correct! 250 cm ÷ 100 = 2.5 m, so they are equal.":"💡 Convert both to the same unit before comparing.";if(ok)reward("quick",1)}));
progress();

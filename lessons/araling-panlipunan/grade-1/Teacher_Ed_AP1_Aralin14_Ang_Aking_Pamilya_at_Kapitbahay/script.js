const KEY="teacherEdAP1Aralin14";
const state=JSON.parse(localStorage.getItem(KEY)||'null')||{
  completed:{}, stars:0, badges:0, best:0, mastery:null, missed:[], sound:true,
  game:{sort:0,country:0}
};
const phases=["connect","teach","model","guided","independent","game","review","apply","mastery","remediate","celebrate"];
const toastEl=document.getElementById("toast");
function save(){localStorage.setItem(KEY,JSON.stringify(state));updateProgress();}
function toast(msg){toastEl.textContent=msg;toastEl.classList.add("show");setTimeout(()=>toastEl.classList.remove("show"),1700);}
function mark(id,stars=1){if(!state.completed[id]){state.completed[id]=true;state.stars+=stars;if(state.stars>=5 && state.badges<1)state.badges=1;if(state.stars>=10&&state.badges<2)state.badges=2;save();}}
function updateProgress(){
  const done=phases.filter(p=>state.completed[p]).length;
  const pct=Math.round(done/phases.length*100);
  document.getElementById("progressBar").style.width=pct+"%";
  document.getElementById("progressText").textContent=pct+"% nakumpleto";
  document.getElementById("starCount").textContent=state.stars;
  document.getElementById("badgeCount").textContent=state.badges;
  document.getElementById("bestScore").textContent=state.best+"%";
  document.getElementById("finalStars").textContent=state.stars;
  document.getElementById("finalBadges").textContent=state.badges;
  document.getElementById("finalBest").textContent=state.best+"%";
}
function go(id){
  const el=document.getElementById(id);
  if(el){el.scrollIntoView({behavior:"smooth",block:"start"}); mark(id); setTimeout(updateProgress,100);}
}
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
document.querySelectorAll(".choice-grid").forEach(group=>{
  group.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{
    group.querySelectorAll("button").forEach(x=>x.disabled=true);
    const correct=btn.dataset.correct==="true";
    btn.classList.add(correct?"correct":"wrong");
    const q=group.dataset.question;
    const fb=document.getElementById(q+"-feedback");
    if(fb){fb.className="feedback "+(correct?"good":"bad");fb.textContent=correct?"Tama! Magandang pasiya iyan.":"Subukan muli. Isipin kung alin ang nagpapakita ng paggalang at pagtutulungan.";}
    if(correct){state.stars++; toast("⭐ Mahusay!");} else toast("💡 Mag-isip muli.");
    save();
  }));
});
const guided=[
 {q:"Si Ana ay may kapitbahay na may sakit. Ano ang mabuting gawin?",a:["Tulungan kung kaya at ipaalam sa nakatatanda.","Pagtawanan ang kapitbahay.","Iwasan ang kapitbahay."],c:0,e:"Ang pagtulong ay nagpapakita ng malasakit."},
 {q:"May bagong pamilyang lumipat sa inyong lugar. Ano ang maaari mong gawin?",a:["Batiin sila nang magalang.","Sigawan sila.","Huwag silang pansinin kailanman."],c:0,e:"Ang magalang na pagbati ay mabuting pakikitungo."},
 {q:"Bakit mahalaga ang pagtutulungan ng magkakapitbahay?",a:["Dahil maaari silang magtulungan sa oras ng pangangailangan.","Dahil dapat silang laging mag-away.","Dahil bawal silang mag-usap."],c:0,e:"Sa pangangailangan, mas madaling makatulong kapag nagkakaisa."}
];
const independent=[
 {q:"Alin ang halimbawa ng mabuting pakikitungo?",a:["Pagiging mabait at magalang.","Panunukso sa kapitbahay.","Pagsigaw sa kapitbahay."],c:0},
 {q:"Ano ang maaaring gawin ng pamilya sa kapitbahay na nangangailangan?",a:["Tumulong kung kaya.","Iwanan agad.","Pagtawanan."],c:0},
 {q:"Ano ang tawag sa mga taong nakatira malapit sa atin?",a:["Kapitbahay.","Guro.","Doktor."],c:0},
 {q:"Alin ang kabilang sa mga bansang binanggit sa aralin bilang kapitbahay ng Pilipinas?",a:["Malaysia.","Brazil.","Canada."],c:0}
];
function makeQuiz(containerId,items,phase,onDone){
 const el=document.getElementById(containerId); let i=0,score=0,locked=false;
 function render(){
  const x=items[i]; locked=false;
  el.innerHTML=`<div class="quiz-top"><span class="quiz-number">Tanong ${i+1}</span><span class="quiz-progress">${i+1} / ${items.length}</span></div>
  <div class="quiz-question">${x.q}</div>
  <div>${x.a.map((a,k)=>`<button class="quiz-choice" data-k="${k}">${String.fromCharCode(65+k)}. ${a}</button>`).join("")}</div>
  <div id="${containerId}Fb" class="feedback"></div>
  <div class="quiz-nav"><button id="${containerId}Next" disabled>${i===items.length-1?"Tingnan ang Resulta":"Susunod →"}</button></div>`;
  el.querySelectorAll(".quiz-choice").forEach(btn=>btn.addEventListener("click",()=>{
    if(locked)return; locked=true;
    const k=Number(btn.dataset.k), ok=k===x.c;
    el.querySelectorAll(".quiz-choice").forEach(b=>b.disabled=true);
    btn.classList.add(ok?"correct":"wrong");
    const fb=document.getElementById(containerId+"Fb"); fb.className="feedback "+(ok?"good":"bad");
    fb.textContent=ok?"Tama!":"Hindi pa. "+(x.e||"Balikan ang paliwanag sa aralin.");
    if(ok)score++; else {btn.insertAdjacentHTML("afterend",`<div class="feedback bad">Tamang sagot: ${String.fromCharCode(65+x.c)}. ${x.a[x.c]}</div>`);}
    document.getElementById(containerId+"Next").disabled=false;
  }));
  document.getElementById(containerId+"Next").addEventListener("click",()=>{
    if(i<items.length-1){i++;render();} else finish();
  });
 }
 function finish(){
   const pct=Math.round(score/items.length*100);
   el.innerHTML=`<div class="quiz-top"><span class="quiz-number">Natapos!</span><span class="quiz-progress">${score}/${items.length}</span></div>
   <div class="quiz-question">Ang iyong marka: ${pct}%</div>
   <p>${pct>=80?"Mahusay! Malinaw na ang iyong pag-unawa.":"Magandang simula! Balikan ang mga konsepto at subukan muli."}</p>
   <div class="feedback ${pct>=80?"good":"bad"}">${pct>=80?"🏅 Maaari ka nang magpatuloy sa susunod na misyon.":"💡 May ilang ideyang kailangan pang sanayin."}</div>
   <div class="quiz-nav"><button id="${containerId}Retry">Subukan Muli</button><button id="${containerId}Continue">Magpatuloy →</button></div>`;
   document.getElementById(containerId+"Retry").onclick=()=>render();
   document.getElementById(containerId+"Continue").onclick=()=>go(phase==="guided"?"independent":"game");
   mark(phase,pct>=80?2:1);
   if(pct>=80)state.stars++;
   save(); onDone?.(pct);
 }
 render();
}
makeQuiz("guidedQuiz",guided,"guided");
makeQuiz("independentQuiz",independent,"independent");

const sortItems=[
 ["Binati mo nang magalang ang bagong kapitbahay.","mabuti"],
 ["Tinulungan mo ang kapitbahay na nangangailangan.","mabuti"],
 ["Pinagtawanan mo ang kapitbahay na may problema.","hindi"],
 ["Nakipag-usap ka nang mahinahon sa kapitbahay.","mabuti"],
 ["Sinigawan mo ang kapitbahay dahil sa maliit na bagay.","hindi"],
 ["Nakilahok ang pamilya sa pagtulong sa biktima ng bagyo.","mabuti"]
];
let sortIndex=0;
function nextSort(){
 const x=sortItems[sortIndex%sortItems.length];
 document.getElementById("sortQuestion").textContent=x[0];
 document.getElementById("sortFeedback").textContent="";
}
document.querySelectorAll("[data-sort]").forEach(b=>b.addEventListener("click",()=>{
 const x=sortItems[sortIndex%sortItems.length], ok=b.dataset.sort===x[1];
 const fb=document.getElementById("sortFeedback");fb.className="feedback "+(ok?"good":"bad");
 fb.textContent=ok?"Tama!":"Hindi iyon ang tamang sagot.";
 if(ok){state.game.sort++;state.stars++;document.getElementById("sortScore").textContent=state.game.sort;toast("⭐ Tama!");}
 else toast("💡 Subukan muli sa susunod.");
 sortIndex++;save();nextSort(); if(sortIndex>=sortItems.length)mark("game",2);
}));
nextSort();

const countryItems=[
 ["Alin ang bansa sa listahan ng aralin?","Malaysia",["Malaysia","Mexico","Brazil"]],
 ["Alin ang bansa sa listahan ng aralin?","Vietnam",["Vietnam","Canada","Australia"]],
 ["Alin ang bansa sa listahan ng aralin?","Indonesia",["Indonesia","India","Japan"]],
 ["Alin ang bansa sa listahan ng aralin?","Thailand",["Thailand","Spain","Italy"]],
 ["Alin ang bansa sa listahan ng aralin?","Brunei",["Brunei","France","China"]]
];
let countryIndex=0;
function renderCountry(){
 const x=countryItems[countryIndex%countryItems.length];
 document.getElementById("countryQuestion").textContent=x[0];
 const c=document.getElementById("countryChoices");c.innerHTML="";
 [...x[2]].sort(()=>Math.random()-.5).forEach(v=>{
  const b=document.createElement("button");b.textContent=v;b.onclick=()=>{
    c.querySelectorAll("button").forEach(z=>z.disabled=true);
    const ok=v===x[1];const fb=document.getElementById("countryFeedback");
    fb.className="feedback "+(ok?"good":"bad");fb.textContent=ok?"Tama! Kasama ito sa listahan ng aralin.":"Hindi. Balikan ang listahan ng mga bansang binanggit sa aralin.";
    if(ok){state.game.country++;state.stars++;document.getElementById("countryScore").textContent=state.game.country;}
    countryIndex++;save();setTimeout(renderCountry,650); if(countryIndex>=countryItems.length)mark("game",2);
  };c.appendChild(b);
 });
 document.getElementById("countryFeedback").textContent="";
}
renderCountry();

document.querySelectorAll(".game-tab").forEach(tab=>tab.addEventListener("click",()=>{
 document.querySelectorAll(".game-tab").forEach(x=>x.classList.remove("active"));
 document.querySelectorAll(".game-panel").forEach(x=>x.classList.remove("active"));
 tab.classList.add("active");document.getElementById(tab.dataset.game).classList.add("active");
}));

document.querySelectorAll("[data-scenario]").forEach(btn=>btn.addEventListener("click",()=>{
 const box=btn.closest(".scenario");box.querySelectorAll("button").forEach(x=>x.disabled=true);
 const ok=btn.dataset.scenario==="good";btn.classList.add(ok?"correct":"wrong");
 const fb=box.querySelector(".scenario-feedback");fb.className="feedback "+(ok?"good":"bad");fb.textContent=ok?"Tama! Iyan ang mabuting pakikitungo.":"Hindi iyon ang mabuting kilos. Pumili ng kilos na nagpapakita ng paggalang at pagtutulungan.";
 if(ok){state.stars++;} save();
}));

// Mastery
const mastery=[
 {q:"Ano ang tawag sa mga taong nakatira malapit sa atin?",a:["Kapitbahay","Kaklase","Bisita"],c:0},
 {q:"Ano ang mabuting paraan ng pakikitungo sa kapitbahay?",a:["Pagiging magalang at mabait","Pagsigaw","Panunukso"],c:0},
 {q:"Ano ang maaaring gawin kapag may kapitbahay na nangangailangan?",a:["Tumulong kung kaya","Pagtawanan","Iwasan"],c:0},
 {q:"Bakit mahalaga ang pagtutulungan?",a:["Nakatutulong ito sa oras ng pangangailangan","Para mag-away","Para hindi mag-usap"],c:0},
 {q:"Alin ang magandang gawin sa bagong kapitbahay?",a:["Batiin nang magalang","Sigawan","Pagtawanan"],c:0},
 {q:"Alin ang kabilang sa mga bansang binanggit sa aralin?",a:["Indonesia","Brazil","Canada"],c:0},
 {q:"Alin ang kabilang sa mga bansang binanggit sa aralin?",a:["Singapore","Mexico","Spain"],c:0},
 {q:"Alin ang kabilang sa mga bansang binanggit sa aralin?",a:["Cambodia","France","Australia"],c:0},
 {q:"Ano ang ipinakita ng pagtulong sa mga biktima ng bagyo?",a:["Pagkakaisa at pagtutulungan","Pag-aaway","Pag-iwas"],c:0},
 {q:"Ano ang dapat pairalin sa pakikipag-ugnayan sa kapitbahay?",a:["Paggalang at kabutihan","Galit","Panunukso"],c:0}
];
let masteryIndex=0,masteryScore=0,masteryMissed=[];
function renderMastery(){
 const el=document.getElementById("masteryQuiz"),x=mastery[masteryIndex];
 el.innerHTML=`<div class="quiz-top"><span class="quiz-number">Mastery ${masteryIndex+1}</span><span class="quiz-progress">${masteryIndex+1} / ${mastery.length}</span></div>
 <div class="quiz-question">${x.q}</div><div>${x.a.map((a,k)=>`<button class="quiz-choice" data-k="${k}">${String.fromCharCode(65+k)}. ${a}</button>`).join("")}</div>
 <div id="masteryFb" class="feedback"></div>`;
 el.querySelectorAll(".quiz-choice").forEach(btn=>btn.onclick=()=>{
  el.querySelectorAll(".quiz-choice").forEach(b=>b.disabled=true);
  const k=Number(btn.dataset.k),ok=k===x.c;btn.classList.add(ok?"correct":"wrong");
  const fb=document.getElementById("masteryFb");fb.className="feedback "+(ok?"good":"bad");fb.textContent=ok?"Tama!":"Hindi pa. Ang tamang sagot ay "+String.fromCharCode(65+x.c)+". "+x.a[x.c];
  if(!ok)masteryMissed.push(masteryIndex);
  setTimeout(()=>{masteryIndex++; if(masteryIndex<mastery.length)renderMastery();else finishMastery();},650);
 });
}
function finishMastery(){
 const pct=Math.round((mastery.length-masteryMissed.length)/mastery.length*100);
 state.mastery=pct;state.missed=masteryMissed.slice();
 if(pct>state.best)state.best=pct;
 mark("mastery",pct>=80?3:1);
 if(pct>=80){state.stars+=3;state.badges=Math.max(state.badges,2);}
 save();
 document.getElementById("masteryQuiz").innerHTML=`<div class="quiz-top"><span class="quiz-number">Mastery Result</span><span class="quiz-progress">${mastery.length-masteryMissed.length}/${mastery.length}</span></div>
 <div class="quiz-question">${pct}% — ${pct>=80?"Mastery achieved!":"Kailangan pa ng kaunting pagsasanay."}</div>
 <p>${pct>=80?"Mahusay! Naipakita mo ang pag-unawa sa aralin.":"Huwag mag-alala. Gamitin ang Practice Again para balikan ang mga hindi pa malinaw."}</p>
 <div class="quiz-nav"><button onclick="go('remediate')">Practice Again →</button><button onclick="go('celebrate')">Tingnan ang Achievement →</button></div>`;
 buildRemediation();
}
function buildRemediation(){
 const box=document.getElementById("remediationBox");
 if(!state.mastery){box.innerHTML='<div class="empty-state">Tapusin muna ang Mastery Challenge para makita ang iyong practice set.</div>';return;}
 if(!state.missed.length){
  box.innerHTML='<div class="feedback good">🎉 Wala kang maling sagot sa Mastery Challenge! Subukan ang enrichment: ipaliwanag sa isang kasama kung bakit mahalaga ang mabuting pakikitungo sa kapitbahay.</div>';
  mark("remediate",2);return;
 }
 box.innerHTML=`<h3>💡 Balikan ang ${state.missed.length} tanong</h3>`+state.missed.map((idx,n)=>{
  const x=mastery[idx];
  return `<div class="practice-card"><p>${n+1}. ${x.q}</p>${x.a.map((a,k)=>`<button data-remediate="${idx}" data-k="${k}">${String.fromCharCode(65+k)}. ${a}</button>`).join("")}<div id="r${idx}" class="feedback"></div></div>`;
 }).join("");
 box.querySelectorAll("[data-remediate]").forEach(b=>b.onclick=()=>{
  const idx=Number(b.dataset.remediate),k=Number(b.dataset.k),x=mastery[idx],ok=k===x.c;
  const wrap=b.closest(".practice-card");wrap.querySelectorAll("button").forEach(z=>z.disabled=true);b.classList.add(ok?"correct":"wrong");
  const fb=document.getElementById("r"+idx);fb.className="feedback "+(ok?"good":"bad");fb.textContent=ok?"Tama! Naayos mo na ang konsepto.":"Balikan ang paliwanag at subukan muli.";
  if(ok)state.stars++;save();
 });
}
document.getElementById("resetBtn").onclick=()=>{
 if(confirm("Sigurado ka bang i-reset ang lahat ng progreso?")){localStorage.removeItem(KEY);location.reload();}
};
document.getElementById("soundBtn").onclick=()=>{state.sound=!state.sound;document.getElementById("soundBtn").textContent=state.sound?"🔊":"🔇";save();};
updateProgress();
if(state.mastery)buildRemediation();

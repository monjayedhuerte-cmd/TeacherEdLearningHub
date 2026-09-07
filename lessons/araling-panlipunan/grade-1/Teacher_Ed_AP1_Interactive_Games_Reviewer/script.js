const levels=[
{id:1,title:"Warm-Up",icon:"🌟",desc:"Kilalanin ang iyong sarili.",questions:[
{q:"Ano ang indibidwal?",c:["Taong may sariling katangian at pagkakakilanlan","Isang uri ng pamilya","Pagkakasunod-sunod ng pangyayari"],a:0,e:"Ang indibidwal ay taong may sariling katangian at pagkakakilanlan.",h:"Ito ay tumutukoy sa isang tao."},
{q:"Ano ang indibidwalidad?",c:["Pagiging natatangi ng bawat tao","Pagiging pare-pareho ng lahat","Pagkakaroon ng maraming laruan"],a:0,e:"Ang indibidwalidad ay pagiging natatangi ng bawat tao.",h:"Isipin ang salitang 'natatangi'."},
{q:"Ano ang sariling kuwento?",c:["Mahahalagang pangyayari at karanasan sa buhay","Listahan ng mga laruan","Pangalan ng paaralan"],a:0,e:"Ang sariling kuwento ay tungkol sa mahahalagang pangyayari at karanasan sa buhay.",h:"Kasama rito ang mahahalagang nangyari sa iyong buhay."},
{q:"Bakit mahalagang malaman ang sariling kuwento?",c:["Para mas makilala ang sarili","Para maging kapareho ng iba","Para makalimutan ang nakaraan"],a:0,e:"Nakakatulong ito upang mas makilala ang sarili.",h:"Tungkol ito sa pagkilala sa iyong sarili."},
{q:"Alin ang maaaring magpakita ng iyong pagiging natatangi?",c:["Talento o kakayahan","Parehong damit ng lahat","Parehong pangalan"],a:0,e:"Ang talento o kakayahan ay maaaring magpakita ng iyong pagiging natatangi.",h:"Ano ang bagay na mahusay mong ginagawa?"},
{q:"Ano ang pangarap?",c:["Nais o layuning nais makamit","Isang pagkain","Isang uri ng tirahan"],a:0,e:"Ang pangarap ay nais o layuning nais makamit.",h:"Ito ay isang bagay na nais mong makamit."}
]},
{id:2,title:"Knowledge Quest",icon:"🧠",desc:"Unawain ang kuwento, talento, at pangarap.",questions:[
{kind:"tf",q:"Ang bawat tao ay may sariling katangian.",a:true,e:"Tama! Bawat tao ay may sariling katangian.",h:"Tandaan: natatangi ang bawat tao."},
{kind:"tf",q:"Dapat tawanan ang kaklase dahil iba ang kaniyang talento.",a:false,e:"Mali. Dapat igalang at pahalagahan ang pagkakaiba.",h:"Ano ang ginagawa ng mabuting kaklase?"},
{q:"Si Ana ay mahusay gumuhit. Ano ang ipinapakita nito?",c:["Talento o kakayahan","Timeline","Uri ng pamilya"],a:0,e:"Ang talento o kakayahan ay nagpapakita ng isang natatanging katangian.",h:"Ano ang tawag sa bagay na mahusay mong ginagawa?"},
{q:"Gusto ni Ben maging guro. Ano ito?",c:["Pangarap","Indibidwalidad","Timeline"],a:0,e:"Ang nais maging guro ay isang pangarap.",h:"Ito ay isang nais niyang makamit."},
{q:"Bakit nagkakaiba ang mga tao?",c:["May sariling katangian, karanasan, at kakayahan","Pare-pareho ang lahat","Iisa ang kuwento ng lahat"],a:0,e:"Nagkakaiba ang mga tao dahil may sarili silang katangian, karanasan, at kakayahan.",h:"Isipin kung bakit natatangi ang bawat tao."},
{q:"Ano ang timeline?",c:["Pagkakasunod-sunod ng mahahalagang pangyayari ayon sa panahon","Isang talento","Isang pangarap"],a:0,e:"Ang timeline ay pagkakasunod-sunod ng mahahalagang pangyayari ayon sa panahon.",h:"Ito ay ayos ng mga pangyayari ayon sa panahon."}
]},
{id:3,title:"Family Quest",icon:"👨‍👩‍👧‍👦",desc:"Kilalanin ang iba't ibang pamilya.",questions:[
{q:"Ano ang pamilya?",c:["Mga taong nagmamahalan, nag-aalaga, at nagtutulungan","Mga taong pare-pareho ang talento","Mga taong magkakasamang naglalaro lamang"],a:0,e:"Ang pamilya ay mga taong nagmamahalan, nag-aalaga, at nagtutulungan.",h:"Isipin ang pagmamahalan at pagtutulungan."},
{q:"Alin ang pamilyang may dalawang magulang?",c:["Nanay, Tatay, at Anak","Nanay at Anak","Lolo at Lola lamang"],a:0,e:"Ang pamilyang may dalawang magulang ay may nanay at tatay kasama ang anak.",h:"Hanapin ang nanay at tatay."},
{q:"Alin ang solo-parent na pamilya?",c:["Nanay at Anak","Nanay, Tatay, at Anak","Lolo, Lola, Nanay, at Anak"],a:0,e:"Sa solo-parent, isang magulang ang kasama ng anak o mga anak.",h:"Isang magulang lamang ang kasama ng anak."},
{q:"Alin ang extended family?",c:["Nanay at Anak","Nanay, Tatay, at Anak","Nanay, Anak, Lolo, at Lola"],a:2,e:"Ang extended family ay maaaring kasama ang mga kamag-anak tulad ng lolo at lola.",h:"May kasama bang ibang kamag-anak?"},
{q:"Pare-pareho ba ang laki ng lahat ng pamilya?",c:["Oo","Hindi","Palaging pareho"],a:1,e:"Hindi pare-pareho ang laki ng mga pamilya.",h:"May malalaki at may maliliit na pamilya."},
{q:"Alin ang magandang paraan ng pagpapakita ng pagmamahal sa pamilya?",c:["Pagtulong at pag-aalaga","Pananakit","Pang-aasar"],a:0,e:"Naipapakita ang pagmamahal sa pagtulong at pag-aalaga sa isa't isa.",h:"Piliin ang mabuting ginagawa para sa pamilya."}
]},
{id:4,title:"Practice Challenge",icon:"💡",desc:"Pagsamahin ang iyong natutuhan.",questions:[
{kind:"match",pairs:[["Indibidwal","Taong may sariling katangian"],["Pangarap","Nais o layuning nais makamit"],["Timeline","Pagkakasunod-sunod ng pangyayari"]]},
{kind:"sort",items:[["Nanay, Tatay, Anak","Dalawang magulang"],["Nanay, Anak","Solo-parent"],["Lolo, Lola, Nanay, Anak","Extended"],["Tatay, Anak","Solo-parent"]]},
{q:"Ano ang tatlong pangunahing pangangailangan ng pamilya?",c:["Pagkain, damit, tirahan","Laruan, telepono, bisikleta","Bola, kendi, laruan"],a:0,e:"Ang tatlong pangunahing pangangailangan ay pagkain, damit, at tirahan.",h:"Isipin ang kailangan upang mabuhay at maging ligtas."},
{q:"Bakit kailangan ang pagkain?",c:["Para maging malusog at malakas","Para maging maganda ang bahay","Para magkaroon ng laruan"],a:0,e:"Ang pagkain ay kailangan upang maging malusog at malakas.",h:"Nakakatulong ito sa katawan."},
{q:"Bakit kailangan ang damit?",c:["Para maprotektahan ang katawan","Para maging laruan","Para maging pagkain"],a:0,e:"Ang damit ay tumutulong na maprotektahan ang katawan.",h:"Pinoprotektahan nito ang katawan."},
{q:"Bakit kailangan ang tirahan?",c:["Ito ay ligtas na lugar na tinitirhan","Para maging laruan","Para maging damit"],a:0,e:"Ang tirahan ay ligtas na lugar na tinitirhan.",h:"Saan ligtas na nakatira ang pamilya?"}
]},
{id:5,title:"Final Challenge",icon:"🏆",desc:"Ipakita ang iyong buong kaalaman.",questions:[
{q:"Ano ang indibidwalidad?",c:["Pagiging natatangi ng bawat tao","Pagiging pare-pareho","Pagkakaroon ng maraming laruan"],a:0,e:"Indibidwalidad = pagiging natatangi ng bawat tao.",h:"Isipin ang ibig sabihin ng natatangi."},
{q:"Ano ang sariling kuwento?",c:["Mahahalagang pangyayari at karanasan sa buhay","Listahan ng laruan","Listahan ng pagkain"],a:0,e:"Ito ay tungkol sa mahahalagang pangyayari at karanasan sa buhay.",h:"Kasama rito ang mga mahalagang nangyari sa iyo."},
{q:"Ano ang dapat gawin sa pagkakaiba ng ibang tao?",c:["Igalang at pahalagahan","Tawanan","Pagtawanan ang talento"],a:0,e:"Dapat igalang at pahalagahan ang pagkakaiba ng bawat tao.",h:"Maging mabuting kaklase."},
{q:"Ano ang dapat gawin upang makatulong na makamit ang pangarap?",c:["Magsikap","Sumuko","Huwag matuto"],a:0,e:"Mahalaga ang pagsisikap upang makamit ang pangarap.",h:"Kabaligtaran ito ng pagsuko."},
{q:"Ano ang pamilya?",c:["Mga taong nagmamahalan, nag-aalaga, at nagtutulungan","Mga taong pare-pareho","Mga taong magkakasamang naglalaro"],a:0,e:"Ang pamilya ay mga taong nagmamahalan, nag-aalaga, at nagtutulungan.",h:"Tandaan ang tatlong ideya: pagmamahal, pag-aalaga, pagtutulungan."},
{q:"Alin ang dalawang-magulang na pamilya?",c:["Nanay, Tatay, at Anak","Nanay at Anak","Tatay at Anak"],a:0,e:"May nanay at tatay ang pamilyang may dalawang magulang.",h:"Hanapin ang dalawang magulang."},
{q:"Alin ang solo-parent?",c:["Tatay at Anak","Nanay, Tatay, at Anak","Lolo, Lola, Nanay, at Anak"],a:0,e:"Sa solo-parent, isang magulang ang kasama ng anak o mga anak.",h:"Isang magulang lamang."},
{q:"Alin ang extended family?",c:["Nanay at Anak","Nanay, Tatay, at Anak","Nanay, Anak, Lolo, at Lola"],a:2,e:"May mga kamag-anak tulad ng lolo at lola sa halimbawa.",h:"Hanapin ang ibang kamag-anak."},
{q:"Alin ang pangunahing pangangailangan?",c:["Pagkain","Laruan","Telepono"],a:0,e:"Ang pagkain ay isa sa pagkain, damit, at tirahan.",h:"Kailangan ito upang maging malusog."},
{q:"Ano ang magandang paraan ng pagmamahal sa pamilya?",c:["Pagtulong at pag-aalaga","Pananakit","Pang-aasar"],a:0,e:"Ang pagtulong at pag-aalaga ay nagpapakita ng pagmamahal.",h:"Piliin ang mabuting gawain."}
]}
];

const badges=[
["🌟","Super Learner","Nakakuha ng 70% o higit pa."],
["🏆","Lesson Master","Nakakuha ng 90% o higit pa."],
["🎯","Level Champion","Nakumpleto ang isang level."],
["🧠","Brain Explorer","Natapos ang Practice Challenge."],
["⭐","Perfect Score","Perpekto ang isang level."],
["🔥","Amazing Streak","5 sunod-sunod na tamang sagot."],
["💡","Problem Solver","Gumamit ng hint at nagpatuloy."],
["🚀","Game Adventurer","Nakumpleto ang lahat ng level."]
];

const KEY="teacherEdAP1GamesV2";
let saved=JSON.parse(localStorage.getItem(KEY)||"null")||{
best:0,stars:0,attempts:0,completed:[],badges:[],missed:[],sound:true,totalCorrect:0,totalAnswered:0
};
let levelIndex=0,qIndex=0,items=[],answered=false,hintUsed=false,levelCorrect=0;
let matchSelected=null,matchFound=0,sortCount=0;

const el=id=>document.getElementById(id);
function persist(){localStorage.setItem(KEY,JSON.stringify(saved));updateAll();}
function updateAll(){
 el("topStars").textContent=saved.stars;el("topScore").textContent=saved.totalCorrect*10;
 el("bestScore").textContent=saved.best;el("progressStars").textContent=saved.stars;
 el("levelsDone").textContent=Math.min(saved.completed.length,5)+"/5";el("attempts").textContent=saved.attempts;
 renderMap();renderRewards();
}
function page(id){document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));el(id).classList.add("active");scrollTo({top:0,behavior:"smooth"});}
document.querySelectorAll(".nav button").forEach(b=>b.onclick=()=>page(b.dataset.page));

el("startAdventure").onclick=()=>page("mission");
el("beginMission").onclick=()=>page("map");
el("gameMapButton").onclick=()=>page("map");
el("resultMapButton").onclick=()=>page("map");
el("soundToggle").onclick=()=>{saved.sound=!saved.sound;el("soundToggle").textContent=saved.sound?"🔊":"🔇";persist()};
el("resetProgress").onclick=()=>{if(confirm("Sigurado ka bang buburahin ang lahat ng progress?")){localStorage.removeItem(KEY);location.reload()}};

function renderMap(){
 el("mapGrid").innerHTML=levels.map((l,i)=>{
   const open=i===0||saved.completed.includes(i);
   const done=saved.completed.includes(i+1);
   return `<article class="map-card ${open?"open":"locked"}">
   <div class="map-icon">${l.icon}</div><h3>LEVEL ${i+1}</h3><h3>${l.title}</h3><p>${l.desc}</p>
   <button class="${open?"primary":"secondary"}" ${open?"":"disabled"} onclick="startLevel(${i})">${done?"🔄 Laruin Muli":open?"▶️ Simulan":"🔒 Naka-lock"}</button></article>`;
 }).join("");
}
function startLevel(i){
 levelIndex=i;qIndex=0;levelCorrect=0;answered=false;hintUsed=false;matchSelected=null;matchFound=0;sortCount=0;
 items=[...levels[i].questions].sort(()=>Math.random()-.5);
 el("levelTag").textContent=`LEVEL ${i+1}`;el("gameTitle").textContent=levels[i].title;
 page("game");renderQuestion();
}
function renderQuestion(){
 const q=items[qIndex],total=items.length;
 answered=false;hintUsed=false;matchSelected=null;
 el("questionCount").textContent=`Tanong ${qIndex+1} sa ${total}`;
 el("percent").textContent=Math.round(qIndex/total*100)+"%";
 el("barFill").style.width=(qIndex/total*100)+"%";
 el("feedback").className="feedback hidden";el("nextButton").classList.add("hidden");el("hintButton").classList.remove("hidden");
 if(q.kind==="tf")renderTF(q);else if(q.kind==="match")renderMatch(q);else if(q.kind==="sort")renderSort(q);else renderQuick(q);
}
function renderQuick(q){
 el("gameArea").innerHTML=`<div class="question-card"><div class="q-label">🤔 MAG-ISIP</div><div class="question">${q.q}</div>
 <div class="choices">${q.c.map((x,i)=>`<button class="choice" onclick="choose(${i})">${x}</button>`).join("")}</div></div>`;
}
function renderTF(q){
 el("gameArea").innerHTML=`<div class="question-card"><div class="q-label">🔵 TAMA O MALI?</div><div class="question">${q.q}</div>
 <div class="choices"><button class="choice" onclick="chooseTF(true)">TAMA</button><button class="choice" onclick="chooseTF(false)">MALI</button></div></div>`;
}
function choose(i){
 if(answered)return;answered=true;const q=items[qIndex],ok=i===q.a;
 document.querySelectorAll(".choice").forEach((b,j)=>{b.disabled=true;if(j===q.a)b.classList.add("correct");if(j===i&&!ok)b.classList.add("wrong")});
 scoreAnswer(ok,q.e,q.h);
}
function chooseTF(v){
 if(answered)return;answered=true;const q=items[qIndex],ok=v===q.a;
 document.querySelectorAll(".choice").forEach(b=>b.disabled=true);scoreAnswer(ok,q.e,q.h);
}
function scoreAnswer(ok,explain,hint){
 if(ok){levelCorrect++;reviewCorrect++;saved.totalCorrect++;saved.stars++;saved.totalAnswered++;stateStreak++;celebrate();feedback(true,"🎉 Great job!",explain);
   if(stateStreak>=5)earn("🔥 Amazing Streak");
 }else{saved.totalAnswered++;saved.missed.push({level:levelIndex,question:items[qIndex]});stateStreak=0;feedback(false,"💡 Not quite!","Subukan nating isipin muli. "+explain)}
 if(hintUsed)earn("💡 Problem Solver");
 persist();el("nextButton").classList.remove("hidden");el("nextButton").textContent=qIndex===items.length-1?"🏁 Tapusin ang Level":"➡️ Susunod";
}
let stateStreak=0;
function feedback(ok,title,text){el("feedback").className="feedback "+(ok?"correct":"wrong");el("feedback").innerHTML=`${title}<small>${text}</small>`}
function showHint(){
 hintUsed=true;const q=items[qIndex];let old=document.querySelector(".hint");if(old)old.remove();
 const d=document.createElement("div");d.className="hint";d.textContent="💡 Hint: "+(q.h||"Balikan ang pangunahing ideya ng aralin.");el("gameArea").appendChild(d);
}
el("hintButton").onclick=showHint;
el("nextButton").onclick=()=>{if(qIndex<items.length-1){qIndex++;renderQuestion()}else completeLevel()};

function renderMatch(q){
 const L=q.pairs.map((p,i)=>({t:p[0],i})).sort(()=>Math.random()-.5);
 const R=q.pairs.map((p,i)=>({t:p[1],i})).sort(()=>Math.random()-.5);
 el("gameArea").innerHTML=`<div class="question-card"><div class="q-label">🔗 MATCH IT</div><div class="question">Piliin ang magkatugmang salita at kahulugan.</div>
 <div class="match-grid"><div>${L.map(x=>`<button class="match-btn" data-side="l" data-id="${x.i}" onclick="matchPick(this)">${x.t}</button>`).join("")}</div>
 <div>${R.map(x=>`<button class="match-btn" data-side="r" data-id="${x.i}" onclick="matchPick(this)">${x.t}</button>`).join("")}</div></div></div>`;
}
function matchPick(b){
 if(b.classList.contains("matched"))return;
 if(!matchSelected){matchSelected=b;b.classList.add("selected");return}
 if(matchSelected.dataset.side===b.dataset.side){matchSelected.classList.remove("selected");matchSelected=b;b.classList.add("selected");return}
 const a=matchSelected; a.classList.remove("selected");
 if(a.dataset.id===b.dataset.id){a.classList.add("matched");b.classList.add("matched");matchFound++;levelCorrect++;reviewCorrect++;saved.totalCorrect++;saved.totalAnswered++;saved.stars++;stateStreak++;celebrate();feedback(true,"🎉 Tama!","Magaling! Magkatugma ang dalawang ito.");}
 else{saved.totalAnswered++;saved.missed.push({level:levelIndex,question:{q:"Matching activity",e:"Subukang itugma ang salita sa tamang kahulugan."}});stateStreak=0;feedback(false,"💡 Subukan muli!","Hanapin ang kahulugang talagang tumutugma.");}
 persist();matchSelected=null;
 if(matchFound===items[qIndex].pairs.length){answered=true;el("nextButton").classList.remove("hidden");el("nextButton").textContent=qIndex===items.length-1?"🏁 Tapusin ang Level":"➡️ Susunod"}
}
function renderSort(q){
 const arr=q.items.map((x,i)=>({x,i})).sort(()=>Math.random()-.5);
 el("gameArea").innerHTML=`<div class="question-card"><div class="q-label">📦 SORT IT</div><div class="question">I-tap ang halimbawa at piliin ang tamang uri ng pamilya.</div>
 <div class="sort-zones"><div class="sort-zone"><h3>👨‍👩‍👧 Dalawang magulang</h3><div id="zoneA"></div></div>
 <div class="sort-zone"><h3>👩‍👧 Solo-parent</h3><div id="zoneB"></div></div>
 <div class="sort-zone"><h3>👨‍👩‍👧‍👦 Extended</h3><div id="zoneC"></div></div></div>
 <div id="sortChoices" style="margin-top:14px">${arr.map(o=>`<button class="sort-item" data-i="${o.i}" onclick="sortItem(this)">${o.x[0]}</button>`).join("")}</div></div>`;
}
function sortItem(b){
 if(b.classList.contains("placed"))return;
 const q=items[qIndex],item=q.items[Number(b.dataset.i)],ans=item[1];
 const zone=ans==="Dalawang magulang"?"zoneA":ans==="Solo-parent"?"zoneB":"zoneC";
 const copy=b.cloneNode(true);copy.disabled=true;copy.classList.add("placed");el(zone).appendChild(copy);b.classList.add("placed");
 sortCount++;levelCorrect++;reviewCorrect++;saved.totalCorrect++;saved.totalAnswered++;saved.stars++;stateStreak++;celebrate();feedback(true,"✨ Tama!","Tamang uri ng pamilya.");persist();
 if(sortCount===q.items.length){answered=true;el("nextButton").classList.remove("hidden");el("nextButton").textContent=qIndex===items.length-1?"🏁 Tapusin ang Level":"➡️ Susunod"}
}
function completeLevel(){
 if(!saved.completed.includes(levelIndex+1))saved.completed.push(levelIndex+1);
 earn("🎯 Level Champion");
 if(levelCorrect===countScorable(items))earn("⭐ Perfect Score");
 persist();
 if(levelIndex===4)finishReview();else page("map");
}
function countScorable(qs){return qs.reduce((n,q)=>n+(q.kind==="match"?q.pairs.length:q.kind==="sort"?q.items.length:1),0)}
function earn(name){if(!saved.badges.includes(name))saved.badges.push(name)}
function finishReview(){
 saved.attempts++;
 const total=levels.reduce((n,l)=>n+countScorable(l.questions),0);
 const correct=saved.totalCorrect; // reset per new review below
 const attemptCorrect=Math.min(total,reviewCorrect);
 const pct=Math.round(attemptCorrect/total*100);
 saved.best=Math.max(saved.best,pct);
 if(pct>=70)earn("🌟 Super Learner");if(pct>=90)earn("🏆 Lesson Master");if(saved.completed.length>=5)earn("🚀 Game Adventurer");
 persist();showResults(pct,attemptCorrect,total);
}
let reviewCorrect=0;
function scoreReviewCorrect(){reviewCorrect++}

function showResults(pct,correct,total){
 el("resultPercent").textContent=pct+"%";el("rCorrect").textContent=correct;el("rTotal").textContent=total;el("rStars").textContent=saved.stars;el("rAccuracy").textContent=pct+"%";
 let title="Magandang simula!",emoji="🌱",badge="💡 LEARNING EXPLORER",msg="Magandang pagsisikap! Mag-practice pa at mas lalo kang gagaling.";
 if(pct>=90){title="LESSON MASTER!";emoji="🏆";badge="🏆 LESSON MASTER";msg="Napakahusay! Naipakita mo ang iyong galing sa dalawang aralin!"}
 else if(pct>=80){title="SUPER LEARNER!";emoji="🌟";badge="🌟 SUPER LEARNER";msg="Ang galing! Malaki ang iyong natutuhan!"}
 else if(pct>=70){title="GREAT PROGRESS!";emoji="⭐";badge="⭐ GREAT PROGRESS";msg="Mahusay! Ipagpatuloy ang pagsasanay!"}
 else if(pct>=60){title="KEEP PRACTICING!";emoji="🎯";badge="🎯 KEEP PRACTICING";msg="Magandang effort! Subukan muli ang mga game."}
 el("resultTitle").textContent=title;el("resultEmoji").textContent=emoji;el("resultBadge").textContent=badge;el("resultMessage").textContent=msg;page("results");celebrate();
}
function beginFreshReview(){
 reviewCorrect=0;stateStreak=0;saved.stars=0;saved.missed=[];saved.completed=[];persist();startLevel(0);
}
el("againButton").onclick=beginFreshReview;
el("missedButton").onclick=()=>{
 const missed=saved.missed.slice(-8);
 if(!missed.length){alert("🎉 Wala kang naitalang missed questions!");return}
 alert("💡 May "+missed.length+" missed item(s) na naitala. I-play muli ang Game Map para mapraktis ang mga konseptong iyon.");
 page("map");
};

function renderRewards(){
 el("rewardGrid").innerHTML=badges.map(b=>`<article class="reward ${saved.badges.includes(b[0]+" "+b[1])?"earned":""}">
 <div class="reward-icon">${b[0]}</div><h3>${b[1]}</h3><p>${b[2]}</p></article>`).join("");
}
function celebrate(){
 if(!saved.sound)return;
 const layer=el("celebrationLayer");
 for(let i=0;i<20;i++){const c=document.createElement("span");c.className="confetti";c.style.left=Math.random()*100+"%";c.style.top="-15px";c.style.background=["#f7b719","#1976d2","#25a36f","#e85d75"][i%4];layer.appendChild(c);setTimeout(()=>c.remove(),1400)}
}
updateAll();

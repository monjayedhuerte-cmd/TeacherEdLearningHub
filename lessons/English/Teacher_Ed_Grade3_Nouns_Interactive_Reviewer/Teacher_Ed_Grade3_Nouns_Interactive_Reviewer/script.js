const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const KEY="teacherEd_g3_nouns_v1";
let state=JSON.parse(localStorage.getItem(KEY)||'{"answered":0,"correct":0,"stars":0,"badges":0,"mistakes":[],"completed":[],"final":null}');
let soundOn=true;

const journeyNames=["Connect","Teach","Model","We Do","You Do","Games","Review","Apply","Mastery","Celebrate"];
const journeyIcons=["👀","📖","👩‍🏫","🤝","🎯","🎮","🧠","🌟","🏆","🎉"];
function save(){localStorage.setItem(KEY,JSON.stringify(state)); updateProgress();}
function updateProgress(){
  const total=40, pct=Math.min(100,Math.round(state.answered/total*100));
  $("#progressBar").style.width=pct+"%"; $("#progressText").textContent=pct+"%";
  $("#stars").textContent=state.stars; $("#badges").textContent=state.badges;
  $("#level").textContent=Math.min(5,Math.max(1,Math.floor(pct/20)+1));
  const label=pct>=90?"MASTERED! 🏆":pct>=80?"ALMOST THERE! ⭐":pct>=70?"GOOD PROGRESS! 👍":"KEEP PRACTICING! 🌱";
  $("#masteryLabel").textContent=label;
  $("#finalStars").textContent=state.stars; $("#finalBadges").textContent=state.badges;
  $$(".node").forEach((n,i)=>{n.classList.toggle("done",pct>=((i+1)*10));n.classList.toggle("current",pct<i*10+10&&pct>=i*10)});
}
function renderJourney(){
  $("#journey").innerHTML=journeyNames.map((x,i)=>`${i?'<span class="arrow">→</span>':''}<button class="node" onclick="scrollToId('${["connect","teach","model","guided","independent","games","spiral","apply","mastery","celebrate"][i]}')">${journeyIcons[i]} ${x}</button>`).join("");
}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function beep(ok=true){if(!soundOn)return;try{const a=new AudioContext(),o=a.createOscillator(),g=a.createGain();o.frequency.value=ok?620:220;o.connect(g);g.connect(a.destination);g.gain.setValueAtTime(.035,a.currentTime);o.start();o.stop(a.currentTime+.09)}catch(e){}}
function reward(correct,id){
  state.answered++;
  if(correct){state.correct++;state.stars++;if(state.correct%8===0){state.badges++;toast("🏆 New badge! Keep going!");}}
  else if(id&&!state.mistakes.includes(id))state.mistakes.push(id);
  save();
}
function markAnswer(group,correct,goodText,badText,id){
  if(group.dataset.done==="1")return;
  group.dataset.done="1";
  $$(".choices button",group).forEach(b=>b.disabled=true);
  const clicked=event.currentTarget;
  clicked.classList.add(correct?"correct":"incorrect");
  const fb=group.querySelector(".feedback");
  fb.innerHTML=correct?`<span class="good">🌟 ${goodText||"Excellent! That's right."}</span>`:`<span class="bad">💡 Let's think again. ${badText||"Look at the example and try once more."}</span>`;
  beep(correct); reward(correct,id);
}
function attachChoiceGroups(root=document){
  $$(".mini-check,.practice-item,.apply-item",root).forEach(group=>{
    $$(".choices button",group).forEach(btn=>btn.onclick=function(){
      markAnswer(group,btn.dataset.correct==="true",btn.dataset.good,btn.dataset.bad,group.dataset.question||group.id);
    });
  });
}
function scrollToId(id){document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"})}
window.scrollToId=scrollToId;

$("#resetBtn").onclick=()=>{if(confirm("Reset all saved progress, stars, badges, and mistakes?")){localStorage.removeItem(KEY);location.reload();}};
$("#soundBtn").onclick=()=>{soundOn=!soundOn;$("#soundBtn").textContent=soundOn?"🔊 Sound On":"🔇 Sound Off";};

renderJourney(); updateProgress();

const connectCorrect=["teacher","Palawan","banca","fiesta","Rose"];
const connectWords=["teacher","quickly","Palawan","banca","beautifully","fiesta","Rose","carefully","happy","plane"];
$("#connectWords").innerHTML=connectWords.map(w=>`<button class="word" data-word="${w}">${w}</button>`).join("");
let selectedConnect=new Set();
$$(".word").forEach(b=>b.onclick=()=>{
 const w=b.dataset.word;
 if(selectedConnect.has(w)){selectedConnect.delete(w);b.classList.remove("selected");}
 else{selectedConnect.add(w);b.classList.add("selected");}
 if(selectedConnect.size===connectCorrect.length){
   const ok=connectCorrect.every(w=>selectedConnect.has(w));
   $("#connectFeedback").innerHTML=ok?'<span class="good">🌟 Great! You found the nouns.</span>':'<span class="bad">💡 Check again. Nouns name people, places, things, animals, or events.</span>';
   if(ok){reward(true,"connect-sort");toast("⭐ Connect task complete!")}
 }
});

attachChoiceGroups();

const modelText=[
"Read the whole sentence first. Don't rush.",
"Ask: Which words name people, places, things, animals, or events? Here, <b>teacher</b> names a person and <b>poem</b> names a thing.",
"The action is <b>reads</b>. The doer is the <b>teacher</b>. The noun can be the person, place, thing, animal, or event being talked about.",
"So the nouns are <b>teacher</b> and <b>poem</b>. Excellent!"
];
$$(".model-step").forEach(btn=>btn.onclick=()=>{$$(".model-step").forEach(x=>x.classList.remove("active"));btn.classList.add("active");$("#modelOutput").innerHTML=modelText[+btn.dataset.step]});

const guided=[
["The <b>boys</b> are afraid to ride the <b>banca</b>.","Which word names a person?","boys","banca","afraid","boys","Boys names people; banca names a thing."],
["My <b>mother</b> prepared delicious <b>lunch</b> for us.","Which word names a person?","mother","delicious","prepared","mother","Mother is the name of a person."],
["Rose rides on a <b>plane</b>.","Which word names a thing?","Rose","rides","plane","plane","A plane is a thing."],
["At the <b>plaza</b>, I eat <b>ice cream</b>.","Which word names a place?","plaza","eat","delicious","plaza","A plaza is a place."]
];
$("#guidedArea").innerHTML=guided.map((q,i)=>`<div class="practice-item" data-question="guided-${i}"><h3>${i+1}. ${q[0]}</h3><p>💡 ${q[1]}</p><div class="choices"><button data-correct="${q[2]===q[4]}" data-good="Good thinking!">${q[2]}</button><button data-correct="${q[3]===q[4]}">${q[3]}</button><button data-correct="${q[4]===q[4]}">${q[4]}</button></div><div class="feedback"></div></div>`).join("");
// Fix the generated guided answer buttons cleanly.
$$(".practice-item[data-question^='guided-']").forEach((g,i)=>{
 const buttons=$$(".choices button",g), ans=guided[i][4];
 buttons.forEach(b=>b.dataset.correct=(b.textContent===ans).toString());
});
attachChoiceGroups($("#guidedArea"));

const independent=[
["How many nouns are in: “The Rivera family goes to Palawan.”","3","2","1","ind-1"],
["Which is a noun in: “In the morning we went fishing.”","morning","went","we","ind-2"],
["Which word is a noun?","doctor","quickly","clearly","ind-3"],
["Which sentence has a proper noun?","Rose rides on a plane.","The girl rides.","The child runs.","ind-4"],
["Which word is a common noun?","province","Palawan","Rose","ind-5"]
];
$("#independentArea").innerHTML=independent.map(q=>`<div class="practice-item" data-question="${q[4]}"><h3>${q[0]}</h3><div class="choices"><button data-correct="${q[1]===q[1]}">${q[1]}</button><button data-correct="false">${q[2]}</button><button data-correct="false">${q[3]}</button></div><button class="hint-btn" onclick="this.nextElementSibling.classList.toggle('show')">💡 Hint</button><div class="hint">Think about what the word names. Remember: a proper noun names a specific person, place, thing, animal, or event.</div><div class="feedback"></div></div>`).join("");
// Correct independent answer keys: first choice is the intended correct choice.
attachChoiceGroups($("#independentArea"));

let currentGame="sort";
const gameData={
 sort:{title:"🗂️ Sort It",html:`
 <div class="game-instruction">Tap a word, then tap the category where it belongs. Purpose: classify nouns by person, animal, place, thing, or event.</div>
 <div class="sort-board" id="sortBoard"></div><div class="feedback" id="sortFeedback"></div>`},
 alphabet:{title:"🔤 Alphabet Race",html:`<div class="game-instruction">Choose the number that shows where each word belongs in alphabetical order. Purpose: practice alphabetizing words with different first letters.</div><div id="alphaGame"></div>`},
 plural:{title:"➕ Plural Builder",html:`<div class="game-instruction">Choose the plural form. Purpose: practice the regular plural rules shown in the lesson.</div><div id="pluralGame"></div>`},
 match:{title:"🧠 Memory Match",html:`<div class="game-instruction">Match a word with its meaning or plural partner. Purpose: retrieval and recognition.</div><div id="matchGame"></div>`}
};
function renderGame(name){
 currentGame=name; $$(".game-tab").forEach(b=>b.classList.toggle("active",b.dataset.game===name));
 $("#gameArea").innerHTML=gameData[name].html;
 if(name==="sort")initSort();
 if(name==="alphabet")initAlphabet();
 if(name==="plural")initPlural();
 if(name==="match")initMatch();
}
$$(".game-tab").forEach(b=>b.onclick=()=>renderGame(b.dataset.game));
renderGame("sort");

function initSort(){
 const items=[["teacher","Person"],["fish","Animal"],["Palawan","Place"],["plane","Thing"],["fiesta","Event"],["mother","Person"],["chicken","Animal"],["plaza","Place"],["banca","Thing"],["Christmas Day","Event"]];
 const bins=["Person","Animal","Place","Thing","Event"];
 $("#sortBoard").innerHTML=bins.map(x=>`<div class="sort-bin" data-bin="${x}"><h3>${x}</h3><div class="sort-items"></div></div>`).join("");
 const bank=document.createElement("div");bank.className="sort-items";bank.style.gridColumn="1/-1";
 items.forEach(([w,c])=>{const b=document.createElement("button");b.className="sort-item";b.textContent=w;b.dataset.cat=c;b.onclick=()=>selectSort(b);bank.appendChild(b)});
 $("#sortBoard").prepend(bank);
}
let sortSelected=null;
function selectSort(b){
 if(b.classList.contains("placed"))return;
 if(sortSelected)sortSelected.classList.remove("selected");
 sortSelected=b;b.classList.add("selected");
 $$(".sort-bin").forEach(bin=>bin.onclick=()=>{
   if(!sortSelected)return;
   const ok=sortSelected.dataset.cat===bin.dataset.bin;
   if(ok){bin.querySelector(".sort-items").appendChild(sortSelected);sortSelected.classList.remove("selected");sortSelected.classList.add("placed");reward(true,"sort-"+sortSelected.textContent);beep(true);toast("🌟 Correct category!");}
   else{toast("💡 Think about what the word names.");beep(false);}
   sortSelected=null;
 });
}

function initAlphabet(){
 const sets=[
  ["bright","creeping","furious","gallant","jealous","merry","quickly","rescued","shopping","attract"],
  ["attract","bright","creeping","furious","gallant","jealous","merry","quickly","rescued","shopping"]
 ];
 const correct=sets[1];
 $("#alphaGame").innerHTML=`<div class="alpha-list">${correct.map((w,i)=>`<div class="alpha-row"><span class="num">${i+1}</span><span class="alpha-word">${w}</span></div>`).join("")}</div>
 <p><b>Challenge:</b> Is “attract” before “bright”?</p><div class="choices" data-alpha><button data-correct="true">Yes</button><button data-correct="false">No</button></div><div class="feedback" id="alphaFb"></div>
 <p class="small-note">Correct order: attract → bright → creeping → furious → gallant → jealous → merry → quickly → rescued → shopping</p>`;
 const g=$("[data-alpha]");$$("button",g).forEach(b=>b.onclick=()=>{if(g.dataset.done)return;g.dataset.done=1;const ok=b.dataset.correct==="true";b.classList.add(ok?"correct":"incorrect");$("#alphaFb").innerHTML=ok?'<span class="good">🌟 Yes! “a” comes before “b”.</span>':'<span class="bad">💡 Start by comparing the first letters.</span>';reward(ok,"alphabet-game")});
}

function initPlural(){
 const data=[
  ["flower","flowers",["flowers","floweres","flowery"]],
  ["glass","glasses",["glasses","glasss","glassies"]],
  ["boy","boys",["boys","boies","boyes"]],
  ["day","days",["days","daies","dayes"]],
  ["story","stories",["stories","storys","storyes"]],
  ["city","cities",["cities","citys","citis"]],
  ["party","parties",["parties","partys","partyes"]],
  ["key","keys",["keys","keies","keyes"]],
  ["mango","mangoes",["mangoes","mangos","mangies"]],
  ["potato","potatoes",["potatoes","potatos","potaties"]]
 ];
 $("#pluralGame").innerHTML=data.map((x,i)=>`<div class="plural-card" data-question="plural-${i}"><div><b>Singular</b><br><span class="plural-answer">${x[0]}</span></div><div class="arrowp">→</div><div><b>Choose plural</b><div class="plural-options">${x[2].map((o,j)=>`<button class="alpha-choice" data-correct="${o===x[1]}">${o}</button>`).join("")}</div></div><div class="feedback"></div></div>`).join("");
 $$(".plural-card").forEach(g=>$$("button",g).forEach(b=>b.onclick=function(){markAnswer(g,b.dataset.correct==="true","Excellent!","Remember the rule shown in the lesson.",g.dataset.question)}));
}

function initMatch(){
 const pairs=[
  ["Person","teacher"],["Animal","fish"],["Place","Palawan"],["Thing","plane"],["Event","fiesta"],["Proper noun","Rose"],["boy","boys"],["city","cities"]
 ];
 let cards=[];pairs.forEach((p,i)=>{cards.push({id:i,pair:i,text:p[0]});cards.push({id:i,pair:i,text:p[1]})});
 cards.sort(()=>Math.random()-.5);
 $("#matchGame").innerHTML=`<div class="match-grid">${cards.map((c,i)=>`<button class="match-card" data-pair="${c.pair}" data-index="${i}">❓</button>`).join("")}</div><div class="feedback" id="matchFb"></div>`;
 $$(".match-card").forEach((b,i)=>b.onclick=()=>flipMatch(b));
 let open=null,locked=false,matches=0;
 function flipMatch(b){
   if(locked||b.classList.contains("matched")||b===open)return;
   b.classList.add("revealed");b.textContent=cards[+b.dataset.index].text;
   if(!open){open=b;return}
   if(open.dataset.pair===b.dataset.pair){
     open.classList.add("matched");b.classList.add("matched");matches++;reward(true,"match-"+matches);open=null;
     $("#matchFb").innerHTML='<span class="good">🌟 Match!</span>';
     if(matches===pairs.length)toast("🏆 Memory Match complete!");
   }else{
     locked=true;beep(false);$("#matchFb").innerHTML='<span class="bad">💡 Not a pair. Try again.</span>';
     const first=open;setTimeout(()=>{first.classList.remove("revealed");b.classList.remove("revealed");first.textContent="❓";b.textContent="❓";open=null;locked=false},650);
   }
 }
}

const spiral=[
 ["Which is a proper noun?","Palawan","province","plaza","spiral-1"],
 ["Which plural is correct?","stories","storys","storyes","spiral-2"],
 ["Which word is a thing?","plane","Rose","fiesta","spiral-3"],
 ["Which comes first alphabetically?","attract","bright","jealous","spiral-4"]
];
$("#spiralArea").innerHTML=spiral.map(q=>`<div class="practice-item apply-item" data-question="${q[4]}"><h3>${q[0]}</h3><div class="choices"><button data-correct="true">${q[1]}</button><button data-correct="false">${q[2]}</button><button data-correct="false">${q[3]}</button></div><div class="feedback"></div></div>`).join("");
attachChoiceGroups($("#spiralArea"));

const apply=[
 ["You are writing about a specific person named Rose. Which noun should begin with a capital letter?","Rose","girl","teacher","apply-1"],
 ["Your teacher asks for the plural of city. Which should you write?","cities","citys","cityes","apply-2"],
 ["You are making a list of places. Which belongs?","plaza","chicken","dinner","apply-3"],
 ["You are sorting words. Where does “Christmas Day” belong?","Event","Animal","Thing","apply-4"]
];
$("#applyArea").innerHTML=apply.map(q=>`<div class="practice-item apply-item" data-question="${q[4]}"><h3>${q[0]}</h3><div class="choices"><button data-correct="true">${q[1]}</button><button data-correct="false">${q[2]}</button><button data-correct="false">${q[3]}</button></div><div class="feedback"></div></div>`).join("");
attachChoiceGroups($("#applyArea"));

const mastery=[
 ["A noun is the name of a…","person, place, thing, animal, or event","verb only","sound only"],
 ["Which is a proper noun?","Palawan","province","school"],
 ["Which is a common noun?","doctor","Rose","Palawan"],
 ["Which word is a thing?","banca","teacher","fiesta"],
 ["Put these in alphabetical order: bright, attract, jealous. Which is first?","attract","bright","jealous"],
 ["Plural of boy","boys","boies","boyes"],
 ["Plural of city","cities","citys","cityes"],
 ["Plural of day","days","daies","dayes"],
 ["Plural of story","stories","storys","storyes"],
 ["Which sentence contains two nouns?","The mother cooks dinner.","She cooks quickly.","They run happily."]
];
let masteryAnswers={};
$("#masteryArea").innerHTML=mastery.map((q,i)=>`<div class="practice-item" data-mastery="${i}"><h3>${i+1}. ${q[0]}</h3><div class="choices">${q.slice(1).map((a,j)=>`<button data-correct="${j===0}">${a}</button>`).join("")}</div><div class="feedback"></div></div>`).join("");
$$("[data-mastery]").forEach(g=>$$("button",g).forEach(b=>b.onclick=function(){
 if(g.dataset.done)return;g.dataset.done=1;masteryAnswers[g.dataset.mastery]=b.dataset.correct==="true";
 const ok=b.dataset.correct==="true";b.classList.add(ok?"correct":"incorrect");g.querySelector(".feedback").innerHTML=ok?'<span class="good">🌟 Excellent!</span>':'<span class="bad">💡 Review the lesson, then try the challenge again.</span>';beep(ok);
}));
$("#finishBtn").onclick=()=>{
 const answered=Object.keys(masteryAnswers).length;
 if(answered<mastery.length){toast(`📝 Answer all ${mastery.length} questions first.`);return}
 const correct=Object.values(masteryAnswers).filter(Boolean).length,pct=Math.round(correct/mastery.length*100);
 state.final={correct,total:mastery.length,pct};
 if(pct>=90){state.badges=Math.max(state.badges,1)}
 save();
 $("#finalResult").classList.remove("hidden");
 $("#finalResult").innerHTML=`<div style="font-size:2rem">🏆 ${pct>=90?"LESSON MASTER":pct>=80?"ALMOST THERE":"KEEP PRACTICING"}</div><h3>${correct} / ${mastery.length} correct</h3><p>${pct>=90?"Fantastic! You demonstrated strong understanding.":pct>=80?"Great work! Review the missed skills once more.":"You are learning! Use Practice My Mistakes and try again."}</p>`;
 $("#finalScore").textContent=pct+"%";toast("🎉 Challenge complete!");
};

$("#challengeBtn").onclick=()=>{
 const area=$("#challengeArea");
 area.innerHTML=`<div class="practice-item" data-question="bonus"><h3>⭐ Challenge: Which list is completely in alphabetical order?</h3><div class="choices"><button data-correct="true">attract → bright → jealous</button><button data-correct="false">bright → attract → jealous</button><button data-correct="false">jealous → bright → attract</button></div><div class="feedback"></div></div>`;
 attachChoiceGroups(area);
};

function renderMistakes(){
 const area=$("#mistakeArea");
 if(!state.mistakes.length){area.innerHTML='<div class="teacher-note">🌟 No saved mistakes yet. Keep practicing and you will build your confidence!</div>';return}
 area.innerHTML=`<div class="teacher-note">You have ${state.mistakes.length} skill(s) to revisit: <b>${state.mistakes.join(", ")}</b>. Review the matching section above, then try again.</div>`;
}
renderMistakes();
setInterval(renderMistakes,1200);

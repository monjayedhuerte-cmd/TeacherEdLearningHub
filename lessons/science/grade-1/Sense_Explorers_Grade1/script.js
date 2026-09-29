const worlds = [
  {
    id:"sight", name:"Vision Valley", icon:"👀", sense:"Eyes • Sight", badge:"Eagle Eye Explorer",
    color:"#4aa3ff",
    questions:[
      ["mystery","🌈","Lia sees a bright rainbow after the rain. Which body part helps her see its colors?","Eyes","Ears","Nose","Skin","Your eyes help you see colors, shapes, and things around you.","Think about the body part you use when you look at something."],
      ["backpack","📖","Teacher Ed gives you a book to read. Which sense helps you see the words?","Sight","Hearing","Smell","Taste","Your sense of sight helps you see the words on a page.","Which sense helps you look at letters?"],
      ["detective","🔴","You see a red ball on the playground. Which sense are you using?","Sight","Smell","Taste","Touch","Seeing the red ball uses your sense of sight.","Think about what your eyes are doing."],
      ["odd","🧸","Which activity mainly uses your sense of sight?","Looking at a picture","Listening to a song","Smelling a flower","Tasting an apple","Looking at a picture uses your eyes and sense of sight.","Which choice is something you do with your eyes?"],
      ["mystery","🔎","A Sense Explorer wants to find a tiny star in a picture. Which organ should help?","Eyes","Tongue","Nose","Ears","The eyes help you notice the tiny star in the picture.","Think about the organ used for looking."]
    ]
  },
  {
    id:"hearing", name:"Sound Station", icon:"👂", sense:"Ears • Hearing", badge:"Super Listener",
    questions:[
      ["sound","🔔","Ding! Ding! A bell rings. Which sense helps you notice the sound?","Hearing","Sight","Taste","Smell","Your ears help you hear sounds such as a ringing bell.","Think about the sense used for sounds."],
      ["mystery","🎵","Music is playing in the classroom. Which organ helps you hear it?","Ears","Eyes","Nose","Skin","Your ears help you hear music, voices, and other sounds.","Which body part listens?"],
      ["detective","🗣️","Your friend says, “Good morning!” Which sense helps you hear the words?","Hearing","Sight","Taste","Touch","Hearing helps you notice the words your friend says.","Think about what happens when someone speaks."],
      ["backpack","🚗","You hear a car honk outside. Which sense are you using?","Hearing","Smell","Taste","Sight","Hearing lets you notice the car horn.","Which sense tells you there is a sound?"],
      ["odd","🎶","Which activity mainly uses your sense of hearing?","Listening to a song","Looking at a rainbow","Smelling soap","Feeling a soft toy","Listening to a song uses your ears and sense of hearing.","Choose the activity that depends on sound."]
    ]
  },
  {
    id:"smell", name:"Smell Garden", icon:"👃", sense:"Nose • Smell", badge:"Amazing Smeller",
    color:"#8c69e8",
    questions:[
      ["mystery","🌸","A flower has a lovely scent. Which organ helps you notice its smell?","Nose","Eyes","Ears","Tongue","Your nose helps you notice smells such as a flower's scent.","Think about the body part used for smelling."],
      ["detective","🍲","You notice the delicious smell of food cooking. Which sense are you using?","Smell","Sight","Hearing","Touch","Smelling food uses your sense of smell.","Which sense helps you notice an aroma?"],
      ["backpack","🧴","Teacher Ed opens a bottle of soap. You notice its scent. Which organ helps?","Nose","Ears","Eyes","Skin","The nose helps you notice the scent of the soap.","Think about the body part used to smell."],
      ["mystery","🌹","Which sense helps you notice the smell of a rose?","Smell","Hearing","Sight","Taste","The sense of smell helps you notice the rose's scent.","Which sense is connected with scents?"],
      ["odd","☕","Which activity mainly uses your sense of smell?","Smelling a flower","Reading a book","Listening to music","Feeling a smooth stone","Smelling a flower mainly uses your nose and sense of smell.","Choose the activity involving a scent."]
    ]
  },
  {
    id:"taste", name:"Taste Town", icon:"👅", sense:"Tongue • Taste", badge:"Taste Detective",
    color:"#f06c86",
    questions:[
      ["mystery","🍋","You taste a lemon and notice that it is sour. Which organ helps you taste it?","Tongue","Nose","Eyes","Ears","Your tongue helps you taste foods and notice tastes such as sour.","Think about the organ used when tasting food."],
      ["detective","🍭","You eat candy and notice that it is sweet. Which sense are you using?","Taste","Sight","Hearing","Touch","Taste helps you notice that the candy is sweet.","Which sense tells you how food tastes?"],
      ["backpack","🍉","You bite a watermelon and notice its taste. Which body part helps you taste it?","Tongue","Ears","Eyes","Skin","Your tongue helps you taste the watermelon.","Think about the body part involved in tasting."],
      ["mystery","🥨","Which sense helps you notice whether food tastes salty or sweet?","Taste","Hearing","Sight","Smell","Your sense of taste helps you notice different tastes.","Which sense is about how food tastes?"],
      ["odd","🍎","Which activity mainly uses your sense of taste?","Tasting an apple","Looking at an apple","Listening to an apple fall","Touching a table","Tasting an apple uses your tongue and sense of taste.","Choose the activity where you taste something."]
    ]
  },
  {
    id:"touch", name:"Touch Mountain", icon:"✋", sense:"Skin • Touch", badge:"Touch Expert",
    color:"#f3a53b",
    questions:[
      ["mystery","🧸","You touch a soft teddy bear. Which sense helps you notice that it is soft?","Touch","Sight","Hearing","Smell","Your sense of touch helps you notice textures such as soft and rough.","Think about what your skin can feel."],
      ["detective","🪨","You pick up a rough rock. Which sense are you using?","Touch","Taste","Smell","Hearing","Touch helps you feel that the rock is rough.","Which sense tells you how something feels?"],
      ["backpack","🧊","You touch something cold. Which sense helps you notice the cold feeling?","Touch","Sight","Hearing","Taste","Your sense of touch helps you notice hot, cold, soft, and rough sensations.","Think about what your skin feels."],
      ["mystery","🪶","A feather feels soft against your hand. Which organ helps you feel it?","Skin","Eyes","Ears","Nose","Your skin helps you feel the feather's texture.","Which organ covers much of your body and helps you feel?"],
      ["odd","🖐️","Which activity mainly uses your sense of touch?","Feeling a smooth stone","Looking at a picture","Listening to a bell","Smelling a flower","Feeling a smooth stone uses your skin and sense of touch.","Choose the activity that depends on feeling a texture."]
    ]
  }
];

let state = {
  score:0, streak:0, bestStreak:0, answered:0, badges:[],
  completed:[], currentWorld:null, qIndex:0, worldStartScore:0,
  worldCorrect:0, worldStreak:0, usedQuestions:[],
  activeQuestions:[],
  sound:true, secondChance:true, questionPool:[], bossPool:[], bossIndex:0, bossCorrect:0, bossStartScore:0, bossStreak:0, bossBestStreak:0
};

const $ = id => document.getElementById(id);
const screens = ["startScreen","mapScreen","quizScreen","worldComplete","showdownScreen","finalScreen"];

function show(id){
  screens.forEach(s => $(s).classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}

function beep(freq=600,duration=.08){
  if(!state.sound) return;
  try{
    const C=window.AudioContext||window.webkitAudioContext; const c=new C();
    const o=c.createOscillator(), g=c.createGain();
    o.frequency.value=freq; o.type="sine"; g.gain.value=.035;
    o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+duration);
  }catch(e){}
}

$("soundBtn").onclick=()=>{
  state.sound=!state.sound;
  $("soundBtn").textContent=state.sound?"🔊":"🔇";
};

function renderMap(){
  const grid=$("worldGrid"); grid.innerHTML="";
  worlds.forEach((w,i)=>{
    const locked = i>0 && !state.completed.includes(worlds[i-1].id);
    const done = state.completed.includes(w.id);
    const b=document.createElement("button");
    b.className="world-card"+(locked?" locked":"");
    b.innerHTML=`<div class="world-icon">${w.icon}</div><h3>${w.name}</h3><small>${w.sense}</small>${done?'<span class="done">✓ COMPLETE</span>':locked?'<span class="done">🔒 LOCKED</span>':''}`;
    if(!locked)b.onclick=()=>startWorld(w);
    grid.appendChild(b);
  });
  const p=Math.round((state.completed.length/worlds.length)*100);
  $("questProgress").style.width=p+"%"; $("progressText").textContent=p+"%";
}


function shuffle(array){
  return [...array].sort(()=>Math.random()-0.5);
}

function buildMixedPool(count=5){
  const all = worlds.flatMap(w => w.questions.map(q => ({
    q, worldId:w.id, worldName:w.name, icon:w.icon, sense:w.sense
  })));
  const selected = worlds.map(w => {
    const bucket = shuffle(w.questions);
    return {q:bucket[0], worldId:w.id, worldName:w.name, icon:w.icon, sense:w.sense};
  });
  return shuffle([...selected, ...shuffle(all.filter(item => !selected.some(s => s.q===item.q)))])
    .slice(0, Math.max(count,5));
}

function buildFinalBossPool(){
  const boss = [];
  worlds.forEach(w => {
    shuffle(w.questions).slice(0,2).forEach(q => boss.push({
      q, worldId:w.id, worldName:w.name, icon:w.icon, sense:w.sense
    }));
  });
  return shuffle(boss);
}

function startWorld(w){
  // Every mission mixes questions from ALL FIVE SENSES.
  state.currentWorld=w;
  state.qIndex=0;
  state.worldStartScore=state.score;
  state.worldCorrect=0;
  state.worldStreak=0;
  state.secondChance=true;

  const mixedPool = worlds.flatMap(world =>
    world.questions.map(q => ({ q, senseId: world.id, senseName: world.sense, icon: world.icon }))
  );

  // Fresh randomized 10-question set for this mission.
  state.activeQuestions = [...mixedPool].sort(() => Math.random() - 0.5).slice(0, 10);

  $("worldTitle").textContent=`${w.icon} ${w.name} • Mixed Sense Mission`;
  renderQuestion();
  show("quizScreen");
}

function renderQuestion(){
  const item = state.activeQuestions[state.qIndex];
  const q = item.q;

  $("questionCount").textContent=`Challenge ${state.qIndex+1} of ${state.activeQuestions.length}`;
  $("quizProgress").style.width=((state.qIndex)/state.activeQuestions.length*100)+"%";

  const types={
    mystery:"🔎 MYSTERY CHALLENGE",
    backpack:"🎒 EXPLORER'S BACKPACK",
    detective:"🕵️ SENSE DETECTIVE",
    sound:"🎯 MATCH THE CLUE",
    odd:"🧠 ODD ONE OUT"
  };

  $("challengeType").textContent=types[q[0]]||"🌟 SENSE CHALLENGE";
  $("questionVisual").textContent=q[1];
  $("questionText").textContent=q[2];
  $("hintBox").classList.add("hidden");
  $("feedback").className="feedback hidden";
  $("nextBtn").classList.add("hidden");
  $("teacherMessage").textContent="Teacher Ed says: Which of the FIVE senses is this?";
  $("hintBtn").disabled=false;
  $("scannerBtn").disabled=false;
  $("secondBtn").disabled=!state.secondChance;

  const choices=$("choices");
  choices.innerHTML="";

  const opts=[q[3],q[4],q[5],q[6]].sort(()=>Math.random()-.5);
  opts.forEach(text=>{
    const btn=document.createElement("button");
    btn.className="choice";
    btn.textContent=text;
    btn.onclick=()=>answer(btn,text,q);
    choices.appendChild(btn);
  });
}
function answer(btn,text,q){
  const all=[...document.querySelectorAll(".choice")];
  all.forEach(x=>x.classList.add("disabled"));
  const correct=text===q[3];
  state.answered++;
  if(correct){
    state.score+=10;state.streak++;state.worldCorrect++;state.worldStreak=Math.max(state.worldStreak,state.streak);
    state.bestStreak=Math.max(state.bestStreak,state.streak);
    btn.classList.add("correct");beep(850,.12);
    showFeedback(true,q[7]);
  }else{
    state.streak=0;btn.classList.add("wrong");beep(220,.12);
    if(state.secondChance){
      $("teacherMessage").textContent="⭐ Second Chance is ready! Think carefully.";
      $("secondBtn").disabled=false;
    }
    showFeedback(false,q[7]);
  }
  $("score").textContent=state.score;$("streak").textContent=state.streak;
}

function showFeedback(correct,hint){
  const box=$("feedback");box.classList.remove("hidden");
  box.className="feedback "+(correct?"good":"try");
  box.textContent=correct?"🎉 Amazing! Your Sense Explorer skills are growing!":"💡 Nice try! "+hint;
  $("nextBtn").classList.remove("hidden");
  $("nextBtn").textContent=state.qIndex===state.activeQuestions.length-1?"🏅 FINISH MISSION":"CONTINUE ➜";
}

$("nextBtn").onclick=()=>{
  if(state.qIndex<state.activeQuestions.length-1){state.qIndex++;renderQuestion()}
  else finishWorld();
};

$("hintBtn").onclick=()=>{
  const q=state.currentWorld.questions[state.qIndex];
  $("hintBox").textContent="💡 Teacher Ed's Clue: "+q[8];
  $("hintBox").classList.remove("hidden");$("hintBtn").disabled=true;beep(700,.08);
};

$("scannerBtn").onclick=()=>{
  const q=state.currentWorld.questions[state.qIndex];
  const wrong=[...document.querySelectorAll(".choice")].filter(x=>x.textContent!==q[3]&&!x.classList.contains("disabled"));
  wrong.sort(()=>Math.random()-.5).slice(0,2).forEach(x=>{x.style.visibility="hidden"});
  $("scannerBtn").disabled=true;beep(750,.08);
};

$("secondBtn").onclick=()=>{
  if(!state.secondChance)return;
  const q=state.currentWorld.questions[state.qIndex];
  [...document.querySelectorAll(".choice")].forEach(x=>{
    x.classList.remove("disabled");x.classList.remove("wrong");
    if(x.textContent===q[3])x.style.outline="3px solid #f8bb18";
  });
  $("feedback").className="feedback hidden";$("nextBtn").classList.add("hidden");
  state.secondChance=false;$("secondBtn").disabled=true;
  $("teacherMessage").textContent="You got another chance! Think like a Sense Explorer.";
};

function finishWorld(){
  const w=state.currentWorld;

  $("worldBadge").textContent="🌟";
  $("completeTitle").textContent=`${w.name} Mission Complete!`;
  $("completeMessage").textContent=
    `You answered a mixed set covering all five senses. You earned ${state.worldCorrect} correct answers out of ${state.activeQuestions.length}.`;

  $("worldPoints").textContent=state.score-state.worldStartScore;
  $("worldCorrect").textContent=state.worldCorrect+"/"+state.activeQuestions.length;
  $("worldStreak").textContent=state.worldStreak;

  if(!state.completed.includes(w.id)) state.completed.push(w.id);

  confetti();
  renderMap();
  save();
  show("worldComplete");
}
$("continueBtn").onclick=()=>{
  if(state.completed.length===worlds.length){
    prepareFinalBossIntro();
    show("showdownScreen");
  } else show("mapScreen");
};

$("showdownBtn").onclick=()=>runShowdown();

function prepareFinalBossIntro(){
  $("showdownScreen").querySelector("h1").innerHTML='THE FINAL <span>SENSE BOSS</span>';
  $("showdownScreen").querySelector(".hero-card > p:not(.eyebrow)").textContent=
    "The Sense Boss has mixed up all five senses! Defeat the Boss by solving 10 challenges—2 from every sense.";
  $("showdownScreen").querySelector(".rounds").innerHTML=
    `<span>👀 2<br><small>Eyes • Sight</small></span>
     <span>👂 2<br><small>Ears • Hearing</small></span>
     <span>👃 2<br><small>Nose • Smell</small></span>
     <span>👅 2<br><small>Tongue • Taste</small></span>
     <span>✋ 2<br><small>Skin • Touch</small></span>`;
  $("showdownBtn").textContent="👑 FIGHT THE SENSE BOSS";
}

function runShowdown(){
  state.bossPool=buildFinalBossPool();
  state.bossIndex=0;
  state.bossCorrect=0;
  state.bossStartScore=state.score;
  state.bossStreak=0;
  state.bossBestStreak=0;

  function askBoss(){
    if(state.bossIndex>=state.bossPool.length){
      finishFinal();
      return;
    }

    const item=state.bossPool[state.bossIndex];
    const q=item.q;
    $("worldTitle").textContent=`👑 FINAL SENSE BOSS • ${item.icon} ${item.sense}`;
    $("questionCount").textContent=`Boss Battle ${state.bossIndex+1} of ${state.bossPool.length}`;
    $("quizProgress").style.width=(state.bossIndex/state.bossPool.length*100)+"%";
    $("challengeType").textContent=state.bossIndex<3?"⚡ BOSS WARM-UP":state.bossIndex<7?"🕵️ BOSS MYSTERY":"🔥 FINAL BOSS ATTACK";
    $("questionVisual").textContent=q[1];
    $("questionText").textContent=q[2];
    $("hintBox").classList.add("hidden");
    $("feedback").className="feedback hidden";
    $("nextBtn").classList.add("hidden");
    $("teacherMessage").textContent="Teacher Ed says: Every sense matters. Think carefully!";
    $("hintBtn").disabled=true;
    $("scannerBtn").disabled=false;
    $("secondBtn").disabled=true;

    const choices=$("choices"); choices.innerHTML="";
    [q[3],q[4],q[5],q[6]].sort(()=>Math.random()-.5).forEach(x=>{
      const b=document.createElement("button");
      b.className="choice"; b.textContent=x;
      b.onclick=()=>{
        [...document.querySelectorAll(".choice")].forEach(z=>z.classList.add("disabled"));
        const correct=x===q[3];
        state.answered++;
        if(correct){
          state.score+=25; state.bossCorrect++; state.bossStreak++;
          state.bossBestStreak=Math.max(state.bossBestStreak,state.bossStreak);
          state.streak++; state.bestStreak=Math.max(state.bestStreak,state.streak);
          b.classList.add("correct");
          $("feedback").className="feedback good";
          $("feedback").textContent="💥 HIT! You weakened the Sense Boss!";
          beep(950,.14);
        }else{
          state.bossStreak=0; state.streak=0; b.classList.add("wrong");
          $("feedback").className="feedback try";
          $("feedback").textContent="🛡️ The Boss blocked that attack! Think about the sense organ.";
          beep(210,.12);
        }
        $("score").textContent=state.score; $("streak").textContent=state.streak;
        $("nextBtn").classList.remove("hidden");
        $("nextBtn").textContent=state.bossIndex===state.bossPool.length-1?"👑 DEFEAT THE BOSS":"NEXT BOSS ATTACK ➜";
        $("nextBtn").onclick=()=>{state.bossIndex++;askBoss()};
      };
      choices.appendChild(b);
    });
    show("quizScreen");
  }
  askBoss();
}


function finishFinal(){
  $("finalScore").textContent=state.score;
  $("finalBadges").textContent=state.badges.length;
  $("finalAnswered").textContent=state.answered;
  $("finalBestStreak").textContent=state.bestStreak;
  let msg=state.score>=500
    ?"👑 SENSE MASTER! You defeated the Final Boss and demonstrated strong understanding of all five senses!"
    :state.score>=350
      ?"🌟 SENSE SUPERSTAR! You completed the mixed missions and challenged the Final Boss!"
      :"🌱 RISING EXPLORER! You completed the quest—keep practicing your five senses!" ;
  $("achievementText").textContent=msg;
  $("badgeRow").innerHTML=state.badges.map(x=>`<span class="badge">🏅 ${x}</span>`).join("");
  confetti();save();show("finalScreen");
}

function confetti(){
  const box=$("confetti");box.innerHTML="";
  for(let i=0;i<75;i++){
    const p=document.createElement("i");p.className="piece";
    p.style.left=Math.random()*100+"%";p.style.top="-20px";
    p.style.background=["#f8bb18","#168bea","#0b2d63","#ef6b8a","#20a66a"][Math.floor(Math.random()*5)];
    p.style.transform=`rotate(${Math.random()*360}deg)`;
    p.style.animationDelay=(Math.random()*.6)+"s";box.appendChild(p);
  }
  setTimeout(()=>box.innerHTML="",3400);
}

function save(){localStorage.setItem("senseExplorerState",JSON.stringify(state))}
function load(){
  try{
    const saved=JSON.parse(localStorage.getItem("senseExplorerState"));
    if(saved){state={...state,...saved};$("score").textContent=state.score;$("streak").textContent=state.streak}
  }catch(e){}
}
$("startBtn").onclick=()=>{load();renderMap();show("mapScreen");beep(700,.1)};
$("backMap").onclick=()=>{renderMap();show("mapScreen")};
$("restartBtn").onclick=()=>{
  localStorage.removeItem("senseExplorerState");
  state={score:0,streak:0,bestStreak:0,answered:0,badges:[],completed:[],currentWorld:null,qIndex:0,worldStartScore:0,worldCorrect:0,worldStreak:0,usedQuestions:[],sound:state.sound,secondChance:true,activeQuestions:[]};
  $("score").textContent=0;$("streak").textContent=0;renderMap();show("mapScreen");
};
load();

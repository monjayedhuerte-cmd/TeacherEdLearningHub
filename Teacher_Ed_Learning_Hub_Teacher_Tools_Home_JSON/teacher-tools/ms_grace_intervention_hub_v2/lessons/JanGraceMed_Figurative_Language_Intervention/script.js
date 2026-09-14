const QUESTIONS = {
  easy: [
    ["Her smile was like sunshine.","Simile","The word “like” signals a comparison."],
    ["The classroom was a zoo.","Metaphor","The classroom is directly compared to a zoo."],
    ["The wind whispered through the trees.","Personification","The wind is given the human action of whispering."],
    ["I have told you a million times.","Hyperbole","A million times is an obvious exaggeration."],
    ["He is as busy as a bee.","Simile","The comparison uses “as...as.”"],
    ["The stars danced in the sky.","Personification","Stars are given the human action of dancing."],
    ["My brother is a walking encyclopedia.","Metaphor","A person is directly compared to an encyclopedia."],
    ["This bag weighs a ton!","Hyperbole","The weight is exaggerated for effect."],
    ["She is as quiet as a mouse.","Simile","The comparison uses “as.”"],
    ["Break a leg!","Idiom","The phrase has a non-literal meaning: good luck."]
  ],
  average: [
    ["“The test was a piece of cake.” What does it mean?","Easy","The idiom means something was easy."],
    ["“The hallway was a river of students.” What does this suggest?","Many students were moving through the hallway.","The metaphor creates a picture of a large flowing crowd."],
    ["“The thunder grumbled angrily.” What technique is used?","Personification","Thunder is given a human action and emotion."],
    ["“I am so hungry I could eat a horse.” What is the purpose?","To emphasize extreme hunger","The statement exaggerates hunger."],
    ["“Her voice is music to my ears.” What does this suggest?","Her voice is very pleasant.","The metaphor compares the voice to music."],
    ["“He runs like the wind.” What does this suggest?","He runs very fast.","The simile compares his speed to the wind."],
    ["“The old house groaned at night.” What is being shown?","Personification","The house is given a human-like action."],
    ["“Hit the books.” What does the idiom mean?","Study","It does not literally mean hitting books."],
    ["“The classroom was buzzing.” What idea is suggested?","The classroom was lively and active.","The expression creates an image of energetic activity."],
    ["“She has a heart of gold.” What does it mean?","She is kind and generous.","The metaphor describes her good character."]
  ],
  difficult: [
    ["When the principal entered, the noisy room became a volcano of voices. What does the metaphor suggest?","The room was extremely noisy.","The classroom is compared to a volcano to emphasize intense noise."],
    ["The exhausted runner said, “My legs are made of lead.” What does this imply?","His legs felt very heavy.","The metaphor communicates heaviness and tiredness."],
    ["After waiting for hours, Mia said, “I have been waiting forever!” What technique is used?","Hyperbole","“Forever” exaggerates the length of the wait."],
    ["The curtains danced whenever the evening breeze entered. What is the figurative device?","Personification","Curtains are given the human action of dancing."],
    ["The coach told the team to “keep your eyes on the ball.” In context, what does this mean?","Stay focused on the task.","The phrase can be used as advice to concentrate."],
    ["The river was a silver ribbon across the valley. What does the metaphor help the reader visualize?","The river was long, narrow, and shining.","The comparison creates a vivid visual image."],
    ["Her words were as sharp as a knife. What is emphasized?","Her words were hurtful or cutting.","The simile compares words to something sharp."],
    ["The sleepy town stretched and yawned at sunrise. What device is used?","Personification","The town is given human actions."],
    ["The assignment took a thousand years to finish. What is the writer emphasizing?","The assignment felt extremely long.","The exaggerated time emphasizes the feeling of difficulty or delay."],
    ["The new student broke the ice with a funny story. What does “broke the ice” mean?","Helped people feel more comfortable.","The idiom means to make a social situation less awkward."]
  ],
  master: [
    ["“The moon was a silver coin in the sky.” Identify the device.","Metaphor","The moon is directly compared to a silver coin."],
    ["“Her cheeks were as red as roses.” Identify the device.","Simile","The comparison uses “as.”"],
    ["“The angry storm knocked on our windows.” Identify the device.","Personification","The storm is given human behavior."],
    ["“I could sleep for a thousand years.” Identify the device.","Hyperbole","The amount of sleep is greatly exaggerated."],
    ["“That news was a punch in the stomach.” What does the metaphor communicate?","It was shocking or upsetting.","The comparison communicates a strong emotional impact."],
    ["“We need to call it a day.” What does the idiom mean?","Stop working for now.","The phrase has a non-literal meaning."],
    ["“The classroom erupted with laughter.” What is suggested?","Many students suddenly laughed loudly.","The metaphor makes the laughter seem sudden and powerful."],
    ["“The leaves clapped in the wind.” Which device is used?","Personification","Leaves are given the human action of clapping."],
    ["“He is as brave as a lion.” Which device is used?","Simile","The comparison uses “as.”"],
    ["“She has mountains of homework.” What does the expression suggest?","She has a very large amount of homework.","The metaphor exaggerates the amount to create emphasis."]
  ]
};

const TITLES = {
  easy:"Figurative Explorer",
  average:"Meaning Matcher",
  difficult:"Context Quest",
  master:"Figurative Challenge"
};

const STORAGE_KEY = "jangracemed_figurative_v1";

let state = loadState();
let game = null;

function loadState(){
  try{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved || {score:0,bestStreak:0,gamesPlayed:0,levels:{easy:0,average:0,difficult:0,master:0}};
  }catch(e){
    return {score:0,bestStreak:0,gamesPlayed:0,levels:{easy:0,average:0,difficult:0,master:0}};
  }
}

function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
  updateProgress();
}

function updateProgress(){
  const ids = ["easy","average","difficult","master"];
  document.getElementById("total-score").textContent = state.score;
  document.getElementById("best-streak").textContent = state.bestStreak;
  document.getElementById("games-played").textContent = state.gamesPlayed;
  document.getElementById("mastered-levels").textContent = ids.filter(x=>state.levels[x]>=10).length;

  ids.forEach(id=>{
    const value = Math.min(10,state.levels[id]||0);
    document.getElementById(id+"-text").textContent = value+" / 10";
    document.getElementById(id+"-bar").style.width = (value*10)+"%";
  });
}

function openGame(level){
  const source = QUESTIONS[level];
  game = {
    level,
    questions: source.slice(),
    index:0,
    score:0,
    streak:0,
    answered:false,
    hintUsed:false
  };

  document.getElementById("game-modal").classList.add("show");
  document.getElementById("game-modal").setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
  document.getElementById("game-level").textContent = level.toUpperCase();
  document.getElementById("game-title").textContent = TITLES[level];
  document.getElementById("game-score").textContent="0";
  document.getElementById("game-streak").textContent="0";
  renderQuestion();
}

function closeGame(){
  document.getElementById("game-modal").classList.remove("show");
  document.getElementById("game-modal").setAttribute("aria-hidden","true");
  document.body.style.overflow="";
  game=null;
  updateProgress();
}

function renderQuestion(){
  const q = game.questions[game.index];
  game.answered=false;
  game.hintUsed=false;

  document.getElementById("question-number").textContent=game.index+1;
  document.getElementById("game-progress").style.width=((game.index+1)/10*100)+"%";
  document.getElementById("question-text").textContent=q[0];
  document.getElementById("hint-text").textContent="";
  document.getElementById("answer-feedback").className="answer-feedback";
  document.getElementById("answer-feedback").textContent="";
  document.getElementById("next-question").disabled=true;

  const options = makeOptions(q[1], game.level);
  const container=document.getElementById("answer-options");
  container.innerHTML="";

  options.forEach(answer=>{
    const btn=document.createElement("button");
    btn.type="button";
    btn.textContent=answer;
    btn.addEventListener("click",()=>answerQuestion(btn,answer,q));
    container.appendChild(btn);
  });
}

function makeOptions(correct, level){
  let pool;
  if(level==="easy" || level==="master"){
    pool=["Simile","Metaphor","Personification","Hyperbole","Idiom"];
  }else if(level==="average"){
    pool=["Easy","Many students were moving through the hallway.","Personification","To emphasize extreme hunger","Her voice is very pleasant.","He runs very fast.","The house is given a human-like action.","Study","The classroom was lively and active.","She is kind and generous."];
  }else{
    pool=[
      "The room was extremely noisy.","His legs felt very heavy.","Hyperbole","Personification",
      "Stay focused on the task.","The river was long, narrow, and shining.",
      "Her words were hurtful or cutting.","It was shocking or upsetting.",
      "Many students suddenly laughed loudly.","Stop working for now.",
      "He runs very fast.","Study","Easy"
    ];
  }

  const unique=[correct,...pool.filter(x=>x!==correct)];
  return unique.slice(0,4).sort(()=>Math.random()-.5);
}

function answerQuestion(button,answer,q){
  if(game.answered) return;
  game.answered=true;

  const correct=answer===q[1];
  const buttons=[...document.querySelectorAll("#answer-options button")];
  buttons.forEach(b=>{
    b.disabled=true;
    if(b.textContent===q[1]) b.classList.add("correct");
  });

  const feedback=document.getElementById("answer-feedback");

  if(correct){
    button.classList.add("correct");
    game.streak++;
    const points=10+(game.streak>1?5:0);
    game.score+=points;
    state.score+=points;
    if(game.streak>state.bestStreak) state.bestStreak=game.streak;
    feedback.className="answer-feedback correct";
    feedback.textContent="✓ Correct! "+q[2]+" +"+points+" points";
    celebrate();
  }else{
    button.classList.add("wrong");
    game.streak=0;
    feedback.className="answer-feedback wrong";
    feedback.textContent="✗ Not quite. The correct answer is “"+q[1]+".” "+q[2];
  }

  document.getElementById("game-score").textContent=game.score;
  document.getElementById("game-streak").textContent=game.streak;
  document.getElementById("next-question").disabled=false;

  saveState();
}

function nextQuestion(){
  if(!game || !game.answered) return;
  if(game.index<9){
    game.index++;
    renderQuestion();
  }else{
    finishGame();
  }
}

function finishGame(){
  state.gamesPlayed++;
  const old=state.levels[game.level]||0;
  state.levels[game.level]=Math.max(old,game.score>=70?10:Math.min(10,Math.round(game.score/10)));
  saveState();

  const pct=game.score;
  const feedback=document.getElementById("answer-feedback");
  feedback.className="answer-feedback correct";
  feedback.textContent="🏆 Game Complete! You scored "+pct+" points. "+getMessage(pct);
  document.getElementById("next-question").textContent="Play Again →";
  document.getElementById("next-question").onclick=()=>openGame(game.level);
}

function getMessage(score){
  if(score>=120) return "Amazing! You are a figurative language master!";
  if(score>=90) return "Excellent work! Keep challenging yourself!";
  if(score>=70) return "Great job! Your skills are growing!";
  return "Good effort! Practice again and keep improving!";
}

function showHint(){
  if(!game || game.answered || game.hintUsed) return;
  game.hintUsed=true;
  const q=game.questions[game.index];
  let hint="Look carefully at the key words and the meaning of the sentence.";
  if(q[1]==="Simile") hint="Look for a comparison using “like” or “as.”";
  else if(q[1]==="Metaphor") hint="Look for a direct comparison without like or as.";
  else if(q[1]==="Personification") hint="Ask: Is a non-human thing doing something a person can do?";
  else if(q[1]==="Hyperbole") hint="Look for an extreme exaggeration.";
  else if(q[1]==="Idiom") hint="The phrase does not mean exactly what the individual words say.";
  document.getElementById("hint-text").textContent=hint;
}

function celebrate(){
  const box=document.getElementById("celebration");
  for(let i=0;i<14;i++){
    const c=document.createElement("i");
    c.className="confetti";
    c.style.left=Math.random()*100+"%";
    c.style.top="-20px";
    c.style.background=["#f6c344","#3b82d0","#18a66b","#9a64d8","#f58e23"][i%5];
    c.style.animationDelay=(Math.random()*.2)+"s";
    box.appendChild(c);
    setTimeout(()=>c.remove(),1500);
  }
}

document.querySelectorAll(".start-btn").forEach(btn=>{
  btn.addEventListener("click",()=>openGame(btn.dataset.game));
});

document.getElementById("close-game").addEventListener("click",closeGame);
document.querySelector(".modal-backdrop").addEventListener("click",closeGame);
document.getElementById("hint-button").addEventListener("click",showHint);
document.getElementById("next-question").addEventListener("click",nextQuestion);

document.querySelectorAll(".practice-options button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const feedback=document.getElementById("practice-feedback");
    if(btn.dataset.answer==="Personification"){
      feedback.textContent="✓ Correct! The moon is given the human action of smiling.";
      feedback.style.color="#168253";
    }else{
      feedback.textContent="Try again. Ask whether a non-human thing is doing something human.";
      feedback.style.color="#a33b3b";
    }
  });
});

document.querySelectorAll(".nav-link").forEach(link=>{
  link.addEventListener("click",()=>{
    document.querySelectorAll(".nav-link").forEach(x=>x.classList.remove("active"));
    link.classList.add("active");
  });
});

document.addEventListener("keydown",e=>{
  if(e.key==="Escape" && game) closeGame();
});

updateProgress();

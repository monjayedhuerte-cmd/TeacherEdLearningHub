const DATA={
easy:[
["Her smile was like sunshine.","Simile","The word “like” signals a comparison."],
["The classroom was a zoo.","Metaphor","The classroom is directly compared to a zoo."],
["The wind whispered through the trees.","Personification","The wind is given the human action of whispering."],
["I have told you a million times.","Hyperbole","A million times is an obvious exaggeration."],
["He is as busy as a bee.","Simile","The comparison uses “as.”"],
["The stars danced in the sky.","Personification","Stars are given the human action of dancing."],
["My brother is a walking encyclopedia.","Metaphor","A person is directly compared to an encyclopedia."],
["This bag weighs a ton!","Hyperbole","The weight is exaggerated for effect."],
["She is as quiet as a mouse.","Simile","The comparison uses “as.”"],
["Break a leg!","Idiom","The phrase means good luck, not an actual broken leg."]
],
average:[
["“The test was a piece of cake.” What does it mean?","Easy","The idiom means the test was easy."],
["“The hallway was a river of students.” What does this suggest?","Many students were moving through the hallway.","The metaphor creates an image of a large flowing crowd."],
["“The thunder grumbled angrily.” What technique is used?","Personification","Thunder is given a human action and emotion."],
["“I am so hungry I could eat a horse.” What is emphasized?","Extreme hunger","The statement uses exaggeration to emphasize hunger."],
["“Her voice is music to my ears.” What does this suggest?","Her voice is very pleasant.","The metaphor compares her voice to music."],
["“He runs like the wind.” What does this suggest?","He runs very fast.","The simile compares his speed to the wind."],
["“The old house groaned at night.” What is shown?","Personification","The house is given a human-like action."],
["“Hit the books.” What does the idiom mean?","Study","It does not literally mean hitting books."],
["“The classroom was buzzing.” What is suggested?","The classroom was lively and active.","The expression creates an image of energetic activity."],
["“She has a heart of gold.” What does it mean?","She is kind and generous.","The metaphor describes her good character."]
],
difficult:[
["The noisy room became a volcano of voices. What does the metaphor suggest?","The room was extremely noisy.","The room is compared to a volcano to emphasize intense noise."],
["“My legs are made of lead.” What does this imply?","His legs felt very heavy.","The metaphor communicates heaviness and tiredness."],
["“I have been waiting forever!” What technique is used?","Hyperbole","“Forever” exaggerates the length of the wait."],
["The curtains danced in the breeze. What device is used?","Personification","Curtains are given the human action of dancing."],
["“Keep your eyes on the ball.” In context, what does this mean?","Stay focused on the task.","The phrase can be used as advice to concentrate."],
["The river was a silver ribbon across the valley. What does the metaphor help visualize?","A long, narrow, shining river","The comparison creates a vivid visual image."],
["Her words were as sharp as a knife. What is emphasized?","Her words were hurtful or cutting.","The simile compares her words to something sharp."],
["The sleepy town stretched and yawned at sunrise. What device is used?","Personification","The town is given human actions."],
["The assignment took a thousand years to finish. What is emphasized?","The assignment felt extremely long.","The exaggerated time emphasizes the feeling of delay."],
["The new student broke the ice with a funny story. What does it mean?","Helped people feel more comfortable.","The idiom means to make a social situation less awkward."]
],
master:[
["“The moon was a silver coin in the sky.” Identify the device.","Metaphor","The moon is directly compared to a silver coin."],
["“Her cheeks were as red as roses.” Identify the device.","Simile","The comparison uses “as.”"],
["“The angry storm knocked on our windows.” Identify the device.","Personification","The storm is given human behavior."],
["“I could sleep for a thousand years.” Identify the device.","Hyperbole","The amount of sleep is greatly exaggerated."],
["“That news was a punch in the stomach.” What does the metaphor communicate?","It was shocking or upsetting.","The comparison communicates a strong emotional impact."],
["“We need to call it a day.” What does the idiom mean?","Stop working for now.","The phrase has a non-literal meaning."],
["“The classroom erupted with laughter.” What is suggested?","Many students suddenly laughed loudly.","The metaphor makes the laughter seem sudden and powerful."],
["“The leaves clapped in the wind.” Which device is used?","Personification","Leaves are given the human action of clapping."],
["“He is as brave as a lion.” Which device is used?","Simile","The comparison uses “as.”"],
["“She has mountains of homework.” What does the expression suggest?","She has a very large amount of homework.","The metaphor emphasizes the large amount."]
]
};

const TITLES={easy:"Figurative Scout",average:"Meaning Matcher",difficult:"Context Quest",master:"Figure of Speech Master"};
const KEY="jangracemed_figures_speech_v1";
let saved=load(),game=null;

function load(){try{return JSON.parse(localStorage.getItem(KEY))||{score:0,best:0,played:0,levels:{easy:0,average:0,difficult:0,master:0}}}catch{return{score:0,best:0,played:0,levels:{easy:0,average:0,difficult:0,master:0}}}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(saved))}catch{};updateProgress()}
function updateProgress(){
 document.querySelector("#score").textContent=saved.score;
 document.querySelector("#best").textContent=saved.best;
 document.querySelector("#played").textContent=saved.played;
 const levels=["easy","average","difficult","master"];
 document.querySelector("#mastered").textContent=levels.filter(x=>saved.levels[x]>=10).length;
 document.querySelector("#progress-bars").innerHTML=levels.map(x=>{
   const n=Math.min(10,saved.levels[x]||0);
   return `<div class="prow"><span><b>${x[0].toUpperCase()+x.slice(1)}</b><b>${n} / 10</b></span><div class="track"><i class="p-${x}" style="width:${n*10}%"></i></div></div>`;
 }).join("");
}
function optionsFor(correct,level){
 let pool=level==="master"?["Simile","Metaphor","Personification","Hyperbole","Idiom"]:
   level==="easy"?["Simile","Metaphor","Personification","Hyperbole","Idiom"]:
   [...new Set(DATA[level].map(q=>q[1]))];
 if(!pool.includes(correct))pool.unshift(correct);
 return [...new Set([correct,...pool])].slice(0,4).sort(()=>Math.random()-.5);
}
function openGame(level){
 game={level,index:0,score:0,streak:0,answered:false,hint:false};
 document.querySelector("#modal").classList.add("show");
 document.querySelector("#modal").setAttribute("aria-hidden","false");
 document.body.style.overflow="hidden";
 document.querySelector("#level-name").textContent=level.toUpperCase();
 document.querySelector("#game-title").textContent=TITLES[level];
 render();
}
function closeGame(){
 document.querySelector("#modal").classList.remove("show");
 document.querySelector("#modal").setAttribute("aria-hidden","true");
 document.body.style.overflow="";
 game=null;
}
function render(){
 const q=DATA[game.level][game.index];
 game.answered=false;game.hint=false;
 document.querySelector("#num").textContent=game.index+1;
 document.querySelector("#bar").style.width=((game.index+1)*10)+"%";
 document.querySelector("#question").textContent=q[0];
 document.querySelector("#hint-text").textContent="";
 document.querySelector("#feedback").className="feedback";
 document.querySelector("#feedback").textContent="";
 const next=document.querySelector("#next");next.disabled=true;next.textContent=game.index===9?"Finish Game →":"Next Question →";
 const box=document.querySelector("#answers");box.innerHTML="";
 optionsFor(q[1],game.level).forEach(answer=>{
   const b=document.createElement("button");b.type="button";b.textContent=answer;
   b.onclick=()=>answerQuestion(b,answer,q);box.appendChild(b);
 });
}
function answerQuestion(button,answer,q){
 if(game.answered)return;
 game.answered=true;
 const correct=answer===q[1];
 document.querySelectorAll("#answers button").forEach(b=>{
   b.disabled=true;if(b.textContent===q[1])b.classList.add("correct");
 });
 const feedback=document.querySelector("#feedback");
 if(correct){
   button.classList.add("correct");
   game.streak++;
   const points=10+(game.streak>1?5:0);
   game.score+=points;saved.score+=points;
   saved.best=Math.max(saved.best,game.streak);
   feedback.className="feedback correct";
   feedback.textContent=`✓ Correct! ${q[2]} +${points} points`;
   confetti();
 }else{
   game.streak=0;
   button.classList.add("wrong");
   feedback.className="feedback wrong";
   feedback.textContent=`✗ Not quite. The correct answer is “${q[1]}.” ${q[2]}`;
 }
 document.querySelector("#live-score").textContent=game.score;
 document.querySelector("#streak").textContent=game.streak;
 document.querySelector("#next").disabled=false;
 save();
}
function next(){
 if(!game||!game.answered)return;
 if(game.index<9){game.index++;render();return}
 saved.played++;
 saved.levels[game.level]=Math.max(saved.levels[game.level]||0,game.score>=70?10:Math.min(10,Math.floor(game.score/10)));
 save();
 const feedback=document.querySelector("#feedback");
 feedback.className="feedback correct";
 feedback.textContent=`🏆 Game complete! You scored ${game.score} points. ${message(game.score)}`;
 const nextBtn=document.querySelector("#next");
 nextBtn.disabled=false;nextBtn.textContent="Play Again →";nextBtn.onclick=()=>openGame(game.level);
}
function message(s){return s>=120?"Outstanding! You are a figure of speech master!":s>=90?"Excellent work! Keep challenging yourself!":s>=70?"Great job! Your skills are growing!":"Good effort! Practice again and keep improving!"}
function hint(){
 if(!game||game.answered||game.hint)return;
 game.hint=true;
 const type=game.level==="average"||game.level==="difficult"||game.level==="master"?game.questions?.[game.index]?.[1]:DATA[game.level][game.index][1];
 const clues={Simile:"Look for a comparison using “like” or “as.”",Metaphor:"Look for a direct comparison.",Personification:"Ask whether a nonhuman thing is acting like a person.",Hyperbole:"Look for an extreme exaggeration.",Idiom:"The phrase has a meaning beyond its literal words."};
 document.querySelector("#hint-text").textContent=clues[type]||"Look for the clue that reveals the writer's intended meaning.";
}
function confetti(){
 const box=document.querySelector("#confetti");
 for(let i=0;i<12;i++){
  const p=document.createElement("i");p.className="piece";p.style.left=Math.random()*100+"%";p.style.top="-15px";
  p.style.background=["#e6b63e","#2e7dd2","#16a866","#7651c8","#f19a26"][i%5];
  p.style.animationDelay=(Math.random()*.18)+"s";box.appendChild(p);setTimeout(()=>p.remove(),1400);
 }
}
document.querySelectorAll(".game-card button").forEach(b=>b.onclick=()=>{document.querySelector("#next").onclick=next;openGame(b.dataset.level)});
document.querySelector("#close").onclick=closeGame;
document.querySelector(".shade").onclick=closeGame;
document.querySelector("#hint").onclick=hint;
document.querySelector("#next").onclick=next;
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&game)closeGame()});
document.querySelectorAll(".quick-options button").forEach(b=>b.onclick=()=>{
 const f=document.querySelector("#quick-feedback");
 if(b.dataset.correct){f.textContent="✓ Correct! The moon is given the human action of smiling.";f.style.color="#168253"}
 else{f.textContent="Try again. Is a nonhuman thing doing something a person can do?";f.style.color="#a33b3b"}
});
updateProgress();

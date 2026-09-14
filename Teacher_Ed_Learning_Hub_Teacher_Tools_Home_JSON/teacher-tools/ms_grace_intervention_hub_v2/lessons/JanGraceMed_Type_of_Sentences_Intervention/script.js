const GAME_DATA={
easy:[
["What type of sentence is “The library opens at nine.”?","Declarative","It gives information and makes a statement."],
["What type of sentence is “Where is my notebook?”?","Interrogative","It asks a question and ends with a question mark."],
["What type of sentence is “Please sit down.”?","Imperative","It gives a request or direction."],
["What type of sentence is “That was an amazing goal!”?","Exclamatory","It expresses strong feeling."],
["Which type usually ends with a period when it makes a statement?","Declarative","A declarative sentence makes a statement."],
["Which type asks for information?","Interrogative","An interrogative sentence asks a question."],
["Which type gives a command or direction?","Imperative","An imperative sentence tells someone what to do."],
["Which type shows strong excitement?","Exclamatory","An exclamatory sentence expresses strong feeling."],
["What type is “My brother practices piano every afternoon.”?","Declarative","It states a fact or information."],
["What type is “Did you finish the assignment?”?","Interrogative","It asks whether the assignment was finished."]
],
average:[
["“Please close the window before you leave.” What type is it?","Imperative","It gives a polite command or request."],
["“What a beautiful rainbow!” What type is it?","Exclamatory","The sentence expresses strong feeling."],
["“The students completed the activity.” What type is it?","Declarative","It makes a statement."],
["“How did you solve the problem?” What type is it?","Interrogative","It asks a question."],
["Which sentence is imperative?","Bring your notebook to class.","It gives a direction."],
["Which sentence is interrogative?","Have you seen my pencil?","It asks a question."],
["Which sentence is declarative?","Our class begins after lunch.","It provides information."],
["Which sentence is exclamatory?","We won the final match!","It expresses strong excitement."],
["A sentence says, “Turn left at the corner.” What is its purpose?","To give a direction","An imperative sentence can give a direction."],
["A sentence asks, “Why are you smiling?” What is its purpose?","To ask a question","An interrogative sentence seeks information."]
],
difficult:[
["A sentence says, “Could you please pass the paper?” Which type is it?","Interrogative","Its grammatical form is a question, even though it functions as a polite request."],
["A sentence says, “What a wonderful performance!” Which type is it?","Exclamatory","It expresses strong feeling rather than simply asking a question."],
["Which sentence is imperative even though it includes the word “please”?","Please check your answer carefully.","It politely gives an instruction."],
["Which sentence is declarative?","The coach told us that practice begins at four.","It communicates information as a statement."],
["Which sentence is interrogative?","Why did the lights turn off?","It asks for information."],
["Which sentence is exclamatory?","I cannot believe we finished first!","It expresses strong emotion."],
["Which sentence is imperative?","Remember to bring your science notebook.","It tells the reader what to do."],
["Which sentence is declarative?","Our team will meet in the gym tomorrow.","It makes a statement about an event."],
["Which type should you choose when the main purpose is to obtain information?","Interrogative","Questions are interrogative."],
["Which type should you choose when the main purpose is to express strong emotion?","Exclamatory","Strong feeling is the key purpose."]
],
master:[
["“Please remember to submit your project by Friday.” What type is it?","Imperative","It gives a direction or request."],
["“Will the class visit the museum tomorrow?” What type is it?","Interrogative","It asks a question."],
["“The museum opens at ten o’clock.” What type is it?","Declarative","It provides information."],
["“What an exciting trip this is!” What type is it?","Exclamatory","It expresses strong excitement."],
["Which type makes a statement or gives information?","Declarative","Declarative sentences state information."],
["Which type asks a question?","Interrogative","Interrogative sentences ask questions."],
["Which type gives a command, instruction, or request?","Imperative","Imperative sentences direct an action."],
["Which type expresses strong feeling?","Exclamatory","Exclamatory sentences show strong emotion."],
["“Could you open the door?” is best classified by its grammatical form as what type?","Interrogative","It has the form of a question and ends with a question mark."],
["“Stop running in the hallway!” is best classified as what type?","Imperative","It gives a command; the exclamation mark adds force."]
]
};

const TITLES={easy:"Sentence Spotter",average:"Type Matcher",difficult:"Sentence Escape",master:"Sentence Master"};
const HINTS={
"Declarative":"Think: Does it tell or state information?",
"Interrogative":"Look for a question or a request for information.",
"Imperative":"Think: Is someone being told or asked to do something?",
"Exclamatory":"Look for strong feeling, excitement, or emphasis.",
"To give a direction":"The sentence tells someone what action to take.",
"To ask a question":"The speaker wants information."
};
const DISTRACTORS=["Declarative","Interrogative","Imperative","Exclamatory"];
const STORAGE="jangracemed_sentence_types_v1";
const defaultProgress=()=>({points:0,bestStreak:0,gamesPlayed:0,mastered:{easy:0,average:0,difficult:0,master:0}});
let progress=load();
let game=null;

function load(){
 try{
  const d=JSON.parse(localStorage.getItem(STORAGE));
  if(!d)return defaultProgress();
  return {points:Number(d.points)||0,bestStreak:Number(d.bestStreak)||0,gamesPlayed:Number(d.gamesPlayed)||0,
   mastered:{easy:Number(d.mastered?.easy)||0,average:Number(d.mastered?.average)||0,difficult:Number(d.mastered?.difficult)||0,master:Number(d.mastered?.master)||0}};
 }catch(e){return defaultProgress();}
}
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(progress));}catch(e){}renderProgress();}
function renderProgress(){
 document.getElementById("total-points").textContent=progress.points;
 document.getElementById("best-streak").textContent=progress.bestStreak;
 document.getElementById("games-played").textContent=progress.gamesPlayed;
 const levels=["easy","average","difficult","master"];
 document.getElementById("mastered").textContent=levels.filter(l=>progress.mastered[l]>=10).length;
 document.getElementById("progress-panel").innerHTML=levels.map(l=>{
  const n=Math.min(10,progress.mastered[l]);return `<div class="prow"><span><b>${l[0].toUpperCase()+l.slice(1)}</b><b>${n} / 10</b></span><div class="track"><i class="fill-${l}" style="width:${n*10}%"></i></div></div>`;
 }).join("");
}
function shuffled(a){return [...a].sort(()=>Math.random()-.5);}
function makeChoices(correct){
 let pool=DISTRACTORS.filter(x=>x!==correct);
 if(!DISTRACTORS.includes(correct)){
  pool=Object.values(GAME_DATA).flat().map(q=>q[1]).filter(x=>x!==correct);
 }
 return shuffled([correct,...shuffled(pool).slice(0,3)]);
}
function openGame(level){
 game={level,index:0,score:0,streak:0,answered:false,hintUsed:false,finished:false};
 document.getElementById("game-modal").classList.add("show");
 document.getElementById("game-modal").setAttribute("aria-hidden","false");
 document.body.style.overflow="hidden";
 renderQuestion();
}
function closeGame(){
 document.getElementById("game-modal").classList.remove("show");
 document.getElementById("game-modal").setAttribute("aria-hidden","true");
 document.body.style.overflow="";
 game=null;
}
function renderQuestion(){
 const item=GAME_DATA[game.level][game.index];
 game.answered=false;game.hintUsed=false;
 document.getElementById("game-level").textContent=game.level.toUpperCase();
 document.getElementById("game-title").textContent=TITLES[game.level];
 document.getElementById("question-number").textContent=game.index+1;
 document.getElementById("question-progress").style.width=`${(game.index+1)*10}%`;
 document.getElementById("game-question").textContent=item[0];
 document.getElementById("hint-text").textContent="";
 const fb=document.getElementById("feedback");fb.className="feedback";fb.textContent="";
 const next=document.getElementById("next-button");next.disabled=true;next.textContent=game.index===9?"Finish Game →":"Next Question →";
 const box=document.getElementById("answers");box.innerHTML="";
 makeChoices(item[1]).forEach(choice=>{
  const b=document.createElement("button");b.type="button";b.textContent=choice;
  b.addEventListener("click",()=>answer(b,choice,item));box.appendChild(b);
 });
 document.getElementById("live-score").textContent=game.score;
 document.getElementById("live-streak").textContent=game.streak;
}
function answer(button,value,item){
 if(game.answered||game.finished)return;
 game.answered=true;
 const correct=value===item[1];
 document.querySelectorAll("#answers button").forEach(b=>{
  b.disabled=true;if(b.textContent===item[1])b.classList.add("correct");
 });
 const fb=document.getElementById("feedback");
 if(correct){
  button.classList.add("correct");game.streak++;
  const pts=Math.max(5,10+(game.streak-1)*5-(game.hintUsed?3:0));
  game.score+=pts;progress.points+=pts;progress.bestStreak=Math.max(progress.bestStreak,game.streak);
  fb.className="feedback correct";fb.textContent=`✓ Correct! ${item[2]} +${pts} points`;confetti();
 }else{
  button.classList.add("wrong");game.streak=0;
  fb.className="feedback wrong";fb.textContent=`✗ Not quite. The correct answer is “${item[1]}.” ${item[2]}`;
 }
 document.getElementById("live-score").textContent=game.score;
 document.getElementById("live-streak").textContent=game.streak;
 document.getElementById("next-button").disabled=false;
 document.getElementById("next-button").onclick=goNext;
 save();
}
function showHint(){
 if(game.answered||game.hintUsed)return;
 game.hintUsed=true;
 const answer=GAME_DATA[game.level][game.index][1];
 document.getElementById("hint-text").textContent=HINTS[answer]||"Focus on the sentence's main purpose and punctuation.";
}
function goNext(){
 if(!game||!game.answered)return;
 if(game.index<9){game.index++;renderQuestion();return;}
 game.finished=true;progress.gamesPlayed++;
 const earned=Math.min(10,Math.floor(game.score/10));
 progress.mastered[game.level]=Math.max(progress.mastered[game.level],earned);
 save();
 const fb=document.getElementById("feedback");fb.className="feedback correct";
 fb.textContent=`🏆 Game complete! You scored ${game.score} points. ${message(game.score)}`;
 const next=document.getElementById("next-button");next.disabled=false;next.textContent="Play Again →";next.onclick=()=>openGame(game.level);
}
function message(score){
 if(score>=120)return"Outstanding! You are a sentence master!";
 if(score>=90)return"Excellent work! Keep identifying sentence purposes!";
 if(score>=70)return"Great job! Your sentence skills are growing!";
 return"Good effort! Play again and keep improving!";
}
function confetti(){
 const c=document.getElementById("confetti"),colors=["#e5b63e","#2e7dd2","#18a566","#7450c7","#ef9424"];
 for(let i=0;i<14;i++){
  const p=document.createElement("i");p.className="piece";
  p.style.left=`${Math.random()*100}%`;p.style.top="-20px";
  p.style.background=colors[i%colors.length];p.style.animationDelay=`${Math.random()*.15}s`;
  c.appendChild(p);setTimeout(()=>p.remove(),1400);
 }
}
document.querySelectorAll(".game-card button").forEach(b=>b.addEventListener("click",()=>openGame(b.dataset.level)));
document.getElementById("close-game").addEventListener("click",closeGame);
document.querySelector(".modal-shade").addEventListener("click",closeGame);
document.getElementById("hint-button").addEventListener("click",showHint);
document.getElementById("next-button").addEventListener("click",goNext);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&game)closeGame();});
document.querySelectorAll(".quick-options button").forEach(b=>b.addEventListener("click",()=>{
 const fb=document.getElementById("quick-feedback");
 if(b.dataset.answer==="C"){fb.textContent="✓ Correct! It is Imperative because it gives a request or direction.";fb.style.color="#168253";}
 else{fb.textContent="✗ Try again. Ask what the speaker wants the listener to do.";fb.style.color="#a33b3b";}
}));
renderProgress();

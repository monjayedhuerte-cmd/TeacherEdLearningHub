const GAME_DATA = {
easy: [
["Which is a complete sentence?", "The puppy slept.", "It has a subject and predicate and expresses a complete thought."],
["Which word is the subject? “The children played outside.”", "children", "The subject tells who or what the sentence is about."],
["Which part is the predicate? “The birds sang sweetly.”", "sang sweetly", "The predicate tells what the subject did."],
["Which sentence is a question?", "Where is your notebook?", "A question asks for information and ends with a question mark."],
["Which sentence is a command?", "Please close the door.", "A command tells someone to do something."],
["Which sentence is an exclamation?", "What a wonderful surprise!", "An exclamation expresses strong feeling."],
["Which is a fragment?", "After the movie ended.", "It begins with a dependent idea and does not express a complete thought."],
["Which is a complete sentence?", "My sister reads every night.", "It expresses a complete thought."],
["Which word is the subject? “The bright stars shone.”", "stars", "The stars are what the sentence is about."],
["Which word group is a predicate?", "ran across the field", "It tells what the subject did."]
],
average: [
["Which sentence is complete?", "The students finished their project.", "It contains a subject and a predicate and expresses a complete thought."],
["Which revision fixes the fragment “Because the bus was late.”?", "Because the bus was late, we arrived after eight.", "The dependent idea is connected to a complete main clause."],
["Which revision fixes the run-on “I studied hard I passed the test.”?", "I studied hard, so I passed the test.", "A conjunction and comma correctly connect the two independent clauses."],
["Which sentence is compound?", "I practiced, and my friend reviewed.", "Two independent clauses are joined with “and.”"],
["Which sentence is simple?", "The teacher smiled.", "It has one independent clause."],
["What type of sentence is “Did you finish your homework?”", "Interrogative", "It asks a question."],
["What type of sentence is “Bring your notebook to class.”", "Imperative", "It gives a command or direction."],
["What is the subject in “The young athletes trained daily.”?", "The young athletes", "That noun phrase tells who trained."],
["What is the predicate in “The young athletes trained daily.”?", "trained daily", "It tells what the athletes did."],
["Which sentence is NOT a fragment?", "Although it was raining, we continued.", "It has a dependent clause connected to an independent clause."]
],
difficult: [
["Which is the best correction? “When the bell rang. The class began.”", "When the bell rang, the class began.", "The dependent clause is correctly connected to the independent clause."],
["Which is the best correction? “The dog barked it heard a noise.”", "The dog barked when it heard a noise.", "The ideas are connected into one grammatical sentence."],
["Which sentence contains two independent clauses?", "Mia cooked dinner, and Leo washed the dishes.", "Both sides can stand as complete sentences."],
["Which sentence is a fragment?", "While the students were waiting.", "It starts with “while” and leaves the thought incomplete."],
["Which sentence correctly joins the ideas?", "I wanted to go, but I was tired.", "A comma and coordinating conjunction correctly join the independent clauses."],
["In “Although the road was crowded, we arrived on time,” which part is the independent clause?", "we arrived on time", "It can stand alone as a complete sentence."],
["In “Although the road was crowded, we arrived on time,” which part is the dependent clause?", "Although the road was crowded", "It cannot stand alone because it begins with “although.”"],
["Which sentence is a run-on?", "The rain stopped we went outside.", "Two complete thoughts are incorrectly joined without needed punctuation or a connector."],
["Which sentence is simple even though it has a compound subject?", "Ana and Ben practiced after school.", "It has one independent clause with a compound subject."],
["Which revision is clearest? “Running to the bus. Mark dropped his books.”", "While running to the bus, Mark dropped his books.", "The fragment is attached to the main clause to form a complete thought."]
],
master: [
["Which sentence is correctly written?", "Because the test was difficult, the learners kept practicing.", "A dependent clause is correctly connected to an independent clause."],
["Which sentence is compound?", "The sun set, and the sky became dark.", "Two independent clauses are joined by “and.”"],
["Which sentence is a fragment?", "After everyone finished the activity.", "It leaves the reader waiting for what happened after."],
["Which correction fixes the run-on? “I finished my work I checked it twice.”", "I finished my work, and I checked it twice.", "The two independent clauses are correctly joined."],
["What is the independent clause? “When the lesson ended, the students packed their bags.”", "the students packed their bags", "It expresses a complete thought and can stand alone."],
["What is the dependent clause? “If you practice every day, your skills will improve.”", "If you practice every day", "It begins with “if” and cannot stand alone."],
["Which sentence has a compound predicate?", "Lina opened her book and started reading.", "The subject performs two actions: opened and started."],
["Which sentence has a compound subject?", "Liam and Noah solved the puzzle.", "Two subjects share the same predicate."],
["Which sentence is an exclamation?", "That was an amazing performance!", "It expresses strong feeling and uses an exclamation mark."],
["Which choice is the best complete sentence?", "Although I was tired, I finished my assignment.", "The dependent clause is connected to a complete independent clause."]
]
};

const TITLES={easy:"Sentence Scout",average:"Sentence Builder",difficult:"Sentence Escape",master:"Sentence Master"};
const HINTS={
"The puppy slept.":"Look for a subject, a predicate, and a complete thought.",
"children":"Ask: Who or what is the sentence about?",
"sang sweetly":"Ask: What did the birds do?",
"Where is your notebook?":"A question asks something and usually ends with ?.",
"Please close the door.":"A command tells someone what to do.",
"What a wonderful surprise!":"Look for strong feeling and an exclamation mark.",
"After the movie ended.":"Does the thought feel unfinished? What is missing?",
"ran across the field":"Ask what the subject did."
};
const ALL=[
"The puppy slept.","children","sang sweetly","Where is your notebook?","Please close the door.","What a wonderful surprise!","After the movie ended.","My sister reads every night.","stars","ran across the field",
"The students finished their project.","Because the bus was late, we arrived after eight.","I studied hard, so I passed the test.","I practiced, and my friend reviewed.","The teacher smiled.","Interrogative","Imperative","The young athletes","trained daily","Although it was raining, we continued."
];

const STORAGE="jangracemed_sentences_v1";
const defaults=()=>({points:0,bestStreak:0,gamesPlayed:0,mastered:{easy:0,average:0,difficult:0,master:0}});
let progress=load();
let game=null;

function load(){
 try{
  const x=JSON.parse(localStorage.getItem(STORAGE));
  if(!x)return defaults();
  return {points:Number(x.points)||0,bestStreak:Number(x.bestStreak)||0,gamesPlayed:Number(x.gamesPlayed)||0,
    mastered:{easy:Number(x.mastered?.easy)||0,average:Number(x.mastered?.average)||0,difficult:Number(x.mastered?.difficult)||0,master:Number(x.mastered?.master)||0}};
 }catch(e){return defaults();}
}
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(progress));}catch(e){}renderProgress();}
function renderProgress(){
 document.getElementById("total-points").textContent=progress.points;
 document.getElementById("best-streak").textContent=progress.bestStreak;
 document.getElementById("games-played").textContent=progress.gamesPlayed;
 const levels=["easy","average","difficult","master"];
 document.getElementById("mastered").textContent=levels.filter(l=>progress.mastered[l]>=10).length;
 document.getElementById("progress-panel").innerHTML=levels.map(l=>{
  const n=Math.min(10,progress.mastered[l]), label=l[0].toUpperCase()+l.slice(1);
  return `<div class="prow"><span><b>${label}</b><b>${n} / 10</b></span><div class="track"><i class="fill-${l}" style="width:${n*10}%"></i></div></div>`;
 }).join("");
}
function shuffled(a){return [...a].sort(()=>Math.random()-.5);}
function choices(correct){
 const distractors=shuffled(ALL.filter(x=>x!==correct)).slice(0,3);
 return shuffled([correct,...distractors]);
}
function openGame(level){
 game={level,index:0,score:0,streak:0,answered:false,hintUsed:false,finished:false};
 const modal=document.getElementById("game-modal");
 modal.classList.add("show");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
 renderQuestion();
}
function closeGame(){
 document.getElementById("game-modal").classList.remove("show");
 document.getElementById("game-modal").setAttribute("aria-hidden","true");
 document.body.style.overflow="";game=null;
 document.getElementById("next-button").onclick=goNext;
}
function renderQuestion(){
 if(!game)return;
 const item=GAME_DATA[game.level][game.index];
 game.answered=false;game.hintUsed=false;
 document.getElementById("game-level").textContent=game.level.toUpperCase();
 document.getElementById("game-title").textContent=TITLES[game.level];
 document.getElementById("question-number").textContent=game.index+1;
 document.getElementById("question-progress").style.width=`${(game.index+1)*10}%`;
 document.getElementById("game-question").textContent=item[0];
 document.getElementById("hint-text").textContent="";
 const fb=document.getElementById("feedback");fb.className="feedback";fb.textContent="";
 const next=document.getElementById("next-button");next.disabled=true;next.textContent=game.index===9?"Finish Game →":"Next Question →";next.onclick=goNext;
 document.getElementById("live-score").textContent=game.score;document.getElementById("live-streak").textContent=game.streak;
 const box=document.getElementById("answers");box.innerHTML="";
 choices(item[1]).forEach(c=>{
  const b=document.createElement("button");b.type="button";b.textContent=c;
  b.addEventListener("click",()=>answer(b,c,item));box.appendChild(b);
 });
}
function answer(button,answerValue,item){
 if(!game||game.answered||game.finished)return;
 game.answered=true;
 const correct=answerValue===item[1];
 document.querySelectorAll("#answers button").forEach(b=>{b.disabled=true;if(b.textContent===item[1])b.classList.add("correct");});
 const fb=document.getElementById("feedback");
 if(correct){
  button.classList.add("correct");game.streak++;
  const pts=Math.max(5,10+(game.streak-1)*5-(game.hintUsed?3:0));game.score+=pts;progress.points+=pts;
  progress.bestStreak=Math.max(progress.bestStreak,game.streak);
  fb.className="feedback correct";fb.textContent=`✓ Correct! ${item[2]} +${pts} points`;confetti();
 }else{
  button.classList.add("wrong");game.streak=0;fb.className="feedback wrong";
  fb.textContent=`✗ Not quite. The correct answer is “${item[1]}.” ${item[2]}`;
 }
 document.getElementById("live-score").textContent=game.score;document.getElementById("live-streak").textContent=game.streak;
 document.getElementById("next-button").disabled=false;save();
}
function hint(){
 if(!game||game.answered||game.hintUsed)return;
 game.hintUsed=true;
 const item=GAME_DATA[game.level][game.index];
 document.getElementById("hint-text").textContent=HINTS[item[1]]||"Read the whole sentence and ask what role the answer plays.";
}
function goNext(){
 if(!game||!game.answered)return;
 if(game.index<9){game.index++;renderQuestion();return;}
 game.finished=true;progress.gamesPlayed++;
 progress.mastered[game.level]=Math.max(progress.mastered[game.level],game.score>=70?10:Math.min(10,Math.floor(game.score/10)));save();
 const fb=document.getElementById("feedback");fb.className="feedback correct";fb.textContent=`🏆 Game complete! You scored ${game.score} points. ${message(game.score)}`;
 const next=document.getElementById("next-button");next.disabled=false;next.textContent="Play Again →";next.onclick=()=>openGame(game.level);
}
function message(score){if(score>=120)return"Outstanding! You are a sentence master!";if(score>=90)return"Excellent work! Keep building stronger sentences!";if(score>=70)return"Great job! Your sentence skills are growing!";return"Good effort! Play again and keep improving!";}
function confetti(){
 const c=document.getElementById("confetti"),colors=["#e5b63e","#2e7dd2","#18a566","#7450c7","#ef9424"];
 for(let i=0;i<14;i++){const p=document.createElement("i");p.className="piece";p.style.left=`${Math.random()*100}%`;p.style.top="-20px";p.style.background=colors[i%colors.length];p.style.animationDelay=`${Math.random()*.15}s`;c.appendChild(p);setTimeout(()=>p.remove(),1400);}
}
document.querySelectorAll(".game-card button").forEach(b=>b.addEventListener("click",()=>openGame(b.dataset.level)));
document.getElementById("close-game").addEventListener("click",closeGame);
document.querySelector(".modal-shade").addEventListener("click",closeGame);
document.getElementById("hint-button").addEventListener("click",hint);
document.getElementById("next-button").addEventListener("click",goNext);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&game)closeGame();});
document.querySelectorAll(".quick-options button").forEach(b=>b.addEventListener("click",()=>{
 const fb=document.getElementById("quick-feedback");
 if(b.dataset.answer==="B"){fb.textContent="✓ Correct! “The children returned to class.” is a complete thought with a subject and predicate.";fb.style.color="#168253";}
 else{fb.textContent="Try again. Ask whether the sentence expresses a complete thought.";fb.style.color="#a33b3b";}
}));
renderProgress();

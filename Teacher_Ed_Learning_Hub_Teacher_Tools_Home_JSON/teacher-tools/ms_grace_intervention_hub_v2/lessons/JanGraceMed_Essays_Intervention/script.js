const GAME_DATA={
easy:[
["What is the main purpose of an introduction?","Introduce the topic and main idea","An introduction prepares the reader for the essay and presents its focus."],
["What does a body paragraph mainly do?","Develop one main idea with supporting details","Body paragraphs explain and support the essay's ideas."],
["What is a conclusion?","The ending that brings the essay's ideas together","A conclusion gives the essay a clear ending and reinforces important ideas."],
["Which part usually presents the essay's topic and focus first?","Introduction","The introduction opens the essay."],
["What is a supporting detail?","Information that helps explain or prove a main idea","Details make an idea clearer and stronger."],
["Why are transitions useful?","They connect ideas and guide the reader","Transitions help readers follow relationships between ideas."],
["What should a writer do during revision?","Improve ideas, organization, and clarity","Revision focuses on making the writing stronger."],
["Which is a good essay topic sentence?","Reading daily helps students develop stronger vocabulary.","It clearly introduces the paragraph's main idea."],
["Which detail supports the idea that exercise is healthy?","Regular exercise can strengthen the heart and muscles.","The detail directly supports the topic."],
["What should an essay have at the end?","A conclusion","The conclusion provides a purposeful ending."]
],
average:[
["Which introduction best fits an essay about daily reading?","Reading every day can help students grow their vocabulary and understand ideas more deeply.","It introduces the topic and gives a clear focus."],
["Which detail best supports the claim “School gardens are useful”?","Students can grow vegetables and learn how plants develop.","This detail directly supports the claim."],
["Which transition best shows addition?","Furthermore","Furthermore adds another related idea."],
["Which transition best shows contrast?","However","However signals a difference or contrast."],
["Which sentence is the strongest conclusion for an essay about reading?","For these reasons, making time to read each day is a valuable habit for students.","It restates the main idea and provides closure."],
["Which order is most logical for a basic essay?","Introduction → Body → Conclusion","This sequence gives the essay a clear structure."],
["Which detail is irrelevant to an essay about saving water?","My favorite color is green.","It does not support the topic."],
["What is the purpose of a topic sentence in a body paragraph?","To state the paragraph's main idea","It tells the reader what the paragraph will develop."],
["Which revision makes this sentence clearer? “Sports are good.”","Playing team sports can help students practice cooperation.","It gives a more specific idea."],
["What should a writer check after drafting?","Organization, support, clarity, and language","A strong revision checks several parts of the writing."]
],
difficult:[
["A body paragraph contains three facts, but none explains the paragraph's main idea. What is the best revision?","Add explanations showing how each fact supports the main idea.","Evidence is stronger when the connection to the main idea is clear."],
["Which opening is most focused for an essay arguing that students need sleep?","Getting enough sleep helps students stay focused and ready to learn.","It immediately introduces a focused claim."],
["A paragraph jumps from school lunches to video games without a connection. What is the main problem?","The ideas lack logical organization and connection.","Related ideas should be connected and ordered clearly."],
["Which transition best completes: “Reading builds vocabulary. ___, it can improve comprehension.”","In addition","The second idea adds another benefit."],
["Which sentence is least relevant in an essay about reducing plastic waste?","My cousin's birthday is in October.","It does not contribute to the topic."],
["A conclusion introduces a completely new major argument. What should the writer do?","Remove or move the new idea and focus the conclusion on the essay's main points.","A conclusion should close the existing discussion rather than suddenly begin a new one."],
["Which revision makes the claim more precise? “Homework is good.”","Reasonable homework can give students useful practice after a lesson.","The revised claim is more specific and defensible."],
["A writer has strong evidence but places it in random order. What should be improved first?","Organization","Logical order helps the evidence support the essay effectively."],
["Which sentence best connects evidence to a claim?","This example shows that regular reading gives students more opportunities to encounter new words.","It explicitly explains the evidence's connection to the claim."],
["What is the best reason to revise an essay more than once?","Different reviews can reveal problems in ideas, organization, and language.","Revision is an ongoing process of improving writing."]
],
master:[
["Which sequence best represents the essay-writing process?","Plan → Draft → Revise → Edit → Finalize","Writers develop ideas, draft, improve content and organization, edit language, then finalize."],
["Which thesis is most focused?","Students should have a short daily reading period because it can strengthen vocabulary and comprehension.","It presents a clear position and focused reasons."],
["Which body paragraph detail best supports a claim about school gardens?","Students can measure plant growth each week while learning about living things.","It provides a specific, relevant example."],
["Which transition best shows cause and effect?","Therefore","Therefore signals a result or conclusion based on what came before."],
["Which sentence would best conclude an essay about helping the community?","Small acts of service can make a meaningful difference, so everyone can look for ways to help.","It reinforces the central message and gives closure."],
["Which revision improves the vague sentence “Things are bad for the environment”?","Plastic waste can harm wildlife and add to pollution when it is not properly managed.","It replaces vague wording with a specific, relevant claim."],
["A paragraph begins with a clear topic sentence but ends with a detail about an unrelated hobby. What should the writer do?","Remove the unrelated detail or replace it with relevant support.","Every body paragraph should stay focused on its main idea."],
["Which introduction is most effective for an informational essay about exercise?","Regular physical activity supports healthy bodies and can help people build strong habits.","It introduces the subject with a clear focus."],
["Why should a writer use evidence rather than only opinions?","Evidence gives specific support that helps readers understand or evaluate the claim.","Support makes an argument or explanation stronger."],
["What is the strongest final check before submitting an essay?","Check content, organization, clarity, grammar, spelling, and punctuation.","A final review should check both ideas and language."]
]
};

const TITLES={easy:"Essay Explorer",average:"Essay Builder",difficult:"Essay Repair Lab",master:"Essay Master Challenge"};
const OPTIONS=["Introduce the topic and main idea","Develop one main idea with supporting details","The ending that brings the essay's ideas together","Information that helps explain or prove a main idea","They connect ideas and guide the reader","Improve ideas, organization, and clarity"];
const HINTS={
"Introduce the topic and main idea":"Think about what the reader needs at the beginning.",
"Develop one main idea with supporting details":"Think about the paragraph that explains and supports.",
"The ending that brings the essay's ideas together":"Think about the final paragraph.",
"Information that helps explain or prove a main idea":"Ask: What evidence or example makes the idea stronger?",
"They connect ideas and guide the reader":"Look for words such as however, furthermore, therefore, and in addition.",
"Improve ideas, organization, and clarity":"Revision means making the writing stronger, not just correcting spelling."
};
const STORAGE="jangracemed_essays_intervention_v2";
const defaultProgress=()=>({points:0,bestStreak:0,gamesPlayed:0,mastered:{easy:0,average:0,difficult:0,master:0}});
let progress=load(),game=null;

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
  const n=Math.min(10,progress.mastered[l]);
  return `<div class="prow"><span><b>${l[0].toUpperCase()+l.slice(1)}</b><b>${n} / 10</b></span><div class="track"><i class="fill-${l}" style="width:${n*10}%"></i></div></div>`;
 }).join("");
}
function shuffled(a){return [...a].sort(()=>Math.random()-.5);}
function makeChoices(correct){
 const all=Object.values(GAME_DATA).flat().map(q=>q[1]).filter(x=>x!==correct);
 const unique=[...new Set(all)];
 return shuffled([correct,...shuffled(unique).slice(0,3)]);
}
function openGame(level){
 game={level,index:0,score:0,streak:0,answered:false,hintUsed:false,finished:false};
 const modal=document.getElementById("game-modal");
 modal.classList.add("show");modal.setAttribute("aria-hidden","false");
 document.body.style.overflow="hidden";renderQuestion();
}
function closeGame(){
 document.getElementById("game-modal").classList.remove("show");
 document.getElementById("game-modal").setAttribute("aria-hidden","true");
 document.body.style.overflow="";game=null;
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
 save();
}
function showHint(){
 if(!game||game.answered||game.hintUsed)return;
 game.hintUsed=true;
 const answer=GAME_DATA[game.level][game.index][1];
 document.getElementById("hint-text").textContent=HINTS[answer]||"Look at the purpose of the essay part described in the question.";
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
 if(score>=120)return"Outstanding! You are an Essay Master!";
 if(score>=90)return"Excellent work! Your writing skills are growing!";
 if(score>=70)return"Great job! Keep practicing your essay skills!";
 return"Good effort! Play again and keep improving!";
}
function confetti(){
 const c=document.getElementById("confetti"),colors=["#e5b63e","#317dc4","#19a56a","#7451c6","#e89128"];
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
 if(b.dataset.answer==="B"){fb.textContent="✓ Correct! This detail directly supports the idea that daily reading is beneficial.";fb.style.color="#168253";}
 else{fb.textContent="✗ Try again. Choose the detail that explains a benefit of daily reading.";fb.style.color="#a33b3b";}
}));
renderProgress();

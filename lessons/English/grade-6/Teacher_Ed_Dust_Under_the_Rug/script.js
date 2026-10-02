const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const sections = $$('.section');
const navItems = $$('.nav-item');
let completed = new Set(JSON.parse(localStorage.getItem('edjay-dust-progress') || '[]'));

function showSection(id){
  sections.forEach(s=>s.classList.toggle('active-section',s.id===id));
  navItems.forEach(n=>n.classList.toggle('active',n.dataset.section===id));
  window.scrollTo({top:0,behavior:'smooth'});
  completed.add(id);
  localStorage.setItem('edjay-dust-progress',JSON.stringify([...completed]));
  updateProgress();
  if(window.innerWidth<=800) $('#sidebar').classList.remove('open');
}
function updateProgress(){
  const total = sections.length - 1; // home is orientation, not a required learning step
  const count = [...completed].filter(x=>x!=='home').length;
  const pct = Math.min(100, Math.round(count/total*100));
  $('#progressBar').style.width=pct+'%'; $('#progressText').textContent=pct+'%';
}
navItems.forEach(n=>n.addEventListener('click',()=>showSection(n.dataset.section)));
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>showSection(b.dataset.go)));
$('#menuBtn').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
$('#themeBtn').addEventListener('click',()=>document.body.classList.toggle('dark'));

$$('.show-sample').forEach(b=>b.addEventListener('click',()=>$( '#'+b.dataset.target).classList.toggle('show')));

// Engage
$$('#engageChoices button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const fb=$('#engageFeedback');
    fb.textContent=btn.dataset.correct==='1'
      ? '✅ Good thinking. The story invites us to consider why faithful work matters even when a task is unseen.'
      : '💡 Think again. The story focuses on the importance of doing a duty faithfully, not only when others can see it.';
    fb.className='feedback '+(btn.dataset.correct==='1'?'good':'bad');
  });
});

// Connect diagnostic
const connectQs=[
 {q:'What is a character?',a:['A person or other being/object that takes part in a story','The place where a story happens','The lesson at the end'],c:0},
 {q:'What does setting tell us?',a:['Only the main character','Where and when a story happens','Only the ending'],c:1},
 {q:'What is a theme?',a:['A central message or idea in a story','A list of vocabulary words','The name of the author'],c:0}
];
function renderConnect(){
 const box=$('#connectQuiz'); box.innerHTML='';
 connectQs.forEach((x,i)=>{
  const d=document.createElement('div'); d.className='q';
  d.innerHTML=`<div class="q-title">${i+1}. ${x.q}</div><div class="quiz-options">${x.a.map((o,j)=>`<button data-i="${i}" data-j="${j}">${o}</button>`).join('')}</div><div class="mini-feedback" id="cf${i}"></div>`;
  box.appendChild(d);
 });
 $$('#connectQuiz button').forEach(b=>b.addEventListener('click',()=>{
  const i=+b.dataset.i,j=+b.dataset.j,x=connectQs[i],fb=$('#cf'+i);
  $$('.q')[i].querySelectorAll('button').forEach(z=>z.classList.remove('selected'));
  b.classList.add('selected'); fb.textContent=j===x.c?'✅ Correct.':'💡 Not quite. Think about the definition in the lesson.';
  fb.style.color=j===x.c?'var(--good)':'var(--bad)';
 }));
}
renderConnect();

// Explore sorting
const sortItems=[
 ['Setting','Story Element'],['Minnie','Story Detail'],['Characters','Story Element'],['Forest','Story Detail'],['Plot','Story Element'],['Conclusion','Story Element']
];
function renderSort(){
 $('#sortArea').innerHTML=sortItems.map((x,i)=>`<div class="sort-card"><strong>${x[0]}</strong><select data-sort="${i}"><option value="">Choose…</option><option>Story Element</option><option>Story Detail</option></select></div>`).join('');
 $$('#sortArea select').forEach(s=>s.addEventListener('change',()=>{
   const i=+s.dataset.sort; if(s.value===sortItems[i][1]) s.style.borderColor='#55a77d'; else if(s.value) s.style.borderColor='#d88';
   const all=$$('#sortArea select'); if(all.every(z=>z.value && z.value===sortItems[+z.dataset.sort][1])){
     $('#sortResult').textContent='🎉 Excellent! You recognized the difference between an element and a detail that supports it.';
     $('#sortResult').className='feedback good';
   }
 }));
}
renderSort();

// Reading tools
let fontSize=17;
$('#fontPlus').onclick=()=>{$('#story').style.fontSize=(fontSize=Math.min(23,fontSize+1))+'px'};
$('#fontMinus').onclick=()=>{$('#story').style.fontSize=(fontSize=Math.max(14,fontSize-1))+'px'};
$('#readAloud').onclick=()=>{
 const text=$('#story').innerText;
 if('speechSynthesis' in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.9;speechSynthesis.speak(u)}
 else alert('Read-aloud is not supported by this browser.');
};
window.addEventListener('scroll',()=>{
 const r=$('#story').getBoundingClientRect();
 const h=$('#story').scrollHeight;
 const visible=Math.min(h,Math.max(0,window.innerHeight-r.top));
 const pct=Math.min(100,Math.round(visible/h*100));
 $('#readProgress').style.width=pct+'%';
});

// Guided practice
const guidedData=[
 {q:'Which character is the older daughter?',o:['Minnie','The fairy housekeeper','One of the dwarfs'],c:0,h:'Look at the first part of the story. The older daughter is named.'},
 {q:'Why did the dwarfs ask Minnie to stay?',o:['Their fairy housekeeper was away','They wanted her to become a dwarf','She had found their gold'],c:0,h:'Think about the reason their house was not well kept.'},
 {q:'What caused Minnie to leave the rug unturned?',o:['She was angry','She was in a hurry after being distracted by the beautiful window picture','She did not know how to sweep'],c:1,h:'The cuckoo clock struck twelve and she had little time left.'}
];
let guidedIndex=0;
function renderGuided(){
 const x=guidedData[guidedIndex];
 $('#guided').innerHTML=`<div class="guided-card"><div class="eyebrow">GUIDED QUESTION ${guidedIndex+1} / ${guidedData.length}</div><h3>${x.q}</h3><div class="choice-grid">${x.o.map((o,i)=>`<button data-g="${i}">${o}</button>`).join('')}</div><div class="hint">💡 Hint: ${x.h}</div><div id="guidedFb" class="feedback"></div></div>`;
 $$('#guided button').forEach(b=>b.addEventListener('click',()=>{
  const j=+b.dataset.g,fb=$('#guidedFb');
  if(j===x.c){fb.textContent='✅ Correct! Now you are ready for the next guided question.';fb.className='feedback good';setTimeout(()=>{guidedIndex=(guidedIndex+1)%guidedData.length;renderGuided()},700)}
  else {fb.textContent='💡 Try again. Use the hint and look back at the story.';fb.className='feedback bad'}
 }));
}
renderGuided();

// You Do
const youData=[
 {q:'What did the sisters do after their tasks?',o:['They watched the trees by the window','They went into the city','They slept all afternoon'],c:0},
 {q:'Why did Minnie decide to find work?',o:['She wanted to buy a new dress','Her mother was sick and the family needed food and other things','The dwarfs had already hired her'],c:1},
 {q:'What did Minnie find under the rug?',o:['A key','Twelve gold pieces','A letter'],c:1},
 {q:'Which statement best describes the story’s message?',o:['Beautiful pictures are more important than work.','Small duties do not matter when nobody sees them.','Faithful and honest work has value even when the task seems small.'],c:2}
];
function renderYou(){
 $('#youDoQuiz').innerHTML=youData.map((x,i)=>`<div class="assessment-item" data-y="${i}"><h3>${i+1}. ${x.q}</h3><div class="options">${x.o.map((o,j)=>`<button data-j="${j}">${String.fromCharCode(65+j)}. ${o}</button>`).join('')}</div><div class="explanation"></div></div>`).join('');
 $$('#youDoQuiz .options button').forEach(b=>b.addEventListener('click',()=>{
  const item=b.closest('.assessment-item'),i=+item.dataset.y,j=+b.dataset.j,x=youData[i],exp=item.querySelector('.explanation');
  if(j===x.c){b.classList.add('correct');exp.textContent='✅ Correct. You identified the detail that best matches the story.';exp.style.color='var(--good)';item.querySelectorAll('button').forEach(z=>z.disabled=true)}
  else{b.classList.add('incorrect');exp.textContent='💡 Not quite. Try another choice. Read the question again and look for evidence in the story.';exp.style.color='var(--bad)'}
 }));
}
renderYou();

// Arcade
const gameData=[
 {q:'Which is a setting clue?',o:['Great forest','Minnie','Faithful'],c:0},
 {q:'Which is a character?',o:['Winter','Minnie','A dusty floor'],c:1},
 {q:'What was Minnie’s first response to the dusty room?',o:['She ignored it','She cleaned it','She ran away'],c:1},
 {q:'What did the dwarfs promise?',o:['A new house','A reward if she proved faithful and good','A magic broom'],c:1},
 {q:'What distracted Minnie?',o:['A beautiful picture on a windowpane','A loud song','A storm'],c:0},
 {q:'Why did she leave the rug unturned?',o:['She had no broom','She was in a hurry','She hated cleaning'],c:1},
 {q:'What did she hear in her heart?',o:['Dust under the rug','Go to sleep','Leave the house'],c:0},
 {q:'What did she find?',o:['Twelve gold pieces','Twelve books','A silver key'],c:0}
];
let gameIndex=0,gameScore=0;
function renderGame(){
 const x=gameData[gameIndex];$('#gamePrompt').textContent=x.q;$('#gameRound').textContent=`Round ${gameIndex+1} of ${gameData.length}`;
 $('#gameFeedback').textContent='';
 $('#gameChoices').innerHTML=x.o.map((o,i)=>`<button data-g="${i}">${o}</button>`).join('');
 $$('#gameChoices button').forEach(b=>b.addEventListener('click',()=>{
  const j=+b.dataset.g;
  if(j===x.c){gameScore+=10;$('#gameScore').textContent=gameScore;$('#gameFeedback').textContent='✓ Correct';}
  else $('#gameFeedback').textContent='Try again — find evidence in the story.';
  if(j===x.c){setTimeout(()=>{gameIndex++; if(gameIndex<gameData.length)renderGame(); else {$('#gamePrompt').textContent='🏆 Mission complete! You caught every clue.'; $('#gameChoices').innerHTML=''; const next=document.createElement('button'); next.className='primary'; next.textContent='Continue to Final Boss →'; next.addEventListener('click',()=>showSection('master')); $('#gameChoices').appendChild(next); $('#gameRound').textContent='8 of 8 complete';}},550)}
 }));
}
renderGame();

// Vocabulary scramble
const vocab=[
 ['fulfathi','faithful','loyal; true to the original or promise'],
 ['edsklli','skilled','having skill or ability to do something'],
 ['mela','lame','unable to walk normally'],
 ['ronarw','narrow','small in width'],
 ['steha','haste','deliberate speed; hurry'],
 ['toasnish','astonish','to strike with amazement or wonder'],
 ['ppee','peep','to take a quick look through a small opening']
];
let vi=0;
function renderVocab(){
 const x=vocab[vi];
 $('#scrambleGame').innerHTML=`<div class="scramble-word">${x[0].toUpperCase()}</div><p><strong>Clue:</strong> ${x[2]}</p><div class="scramble-input"><input id="vInput" autocomplete="off" placeholder="Type the word"><button class="primary" id="vCheck">Check</button></div><div id="vFb" class="feedback"></div>`;
 $('#vCheck').onclick=()=>{
  const val=$('#vInput').value.trim().toLowerCase(),fb=$('#vFb');
  if(val===x[1]){fb.textContent='✅ Correct!';fb.className='feedback good';setTimeout(()=>{vi=(vi+1)%vocab.length;renderVocab()},500)}
  else{fb.textContent='💡 Not quite. Look at the clue again.';fb.className='feedback bad'}
 };
}
renderVocab();

// Review content
$('#vocabList').innerHTML=vocab.map(x=>`<div class="vocab-item"><strong>${x[1]}</strong> — ${x[2]}</div>`).join('');
const silent=['time','made','home','were','came','fire','live','make','rule','here','like','woke','pane','face','love','done','give','wave','take'];
$('#silentWords').innerHTML=silent.map(w=>`<button class="word-chip" data-word="${w}">${w}</button>`).join('');
$$('.word-chip').forEach(b=>b.addEventListener('click',()=>{
 if('speechSynthesis' in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(b.dataset.word);u.rate=.75;speechSynthesis.speak(u)}
}));

// Assessment
const assessment=[
 {q:'Who is Minnie?',o:['The older daughter','The fairy housekeeper','A dwarf'],c:0,e:'Minnie is the older of the two daughters.'},
 {q:'Where was the family home?',o:['Beside the sea','At the edge of a great forest','In a city'],c:1,e:'The story says their home was on the edge of a great forest.'},
 {q:'What happened to Minnie’s mother?',o:['She became sick','She moved away','She became a dwarf'],c:0,e:'Her mother came home sick, creating a need for help and work.'},
 {q:'What did Minnie find inside the little house?',o:['Twelve little beds and dirty plates','A treasure chest immediately','A classroom'],c:0,e:'The room had twelve little beds, dirty plates, and dust.'},
 {q:'What did Minnie do before the dwarfs arrived?',o:['She cleaned the room','She hid','She went back home'],c:0,e:'She washed plates, made beds, swept, straightened the rug, and arranged chairs.'},
 {q:'Why was the dwarfs’ housekeeper away?',o:['She was sick','She was on holiday','She moved to another forest'],c:1,e:'The dwarfs explained that their fairy housekeeper had taken a holiday.'},
 {q:'What did the dwarfs ask Minnie to do?',o:['Stay and help during the holiday','Find their gold','Build a new house'],c:0,e:'They asked her to stay through the holiday and prove faithful and good.'},
 {q:'What distracted Minnie from her work?',o:['A beautiful picture on a windowpane','A loud animal','A missing broom'],c:0,e:'She saw a beautiful picture of fairy palaces through a windowpane.'},
 {q:'Why did Minnie skip sweeping under the rug?',o:['She thought the rug was clean','She was in a hurry and thought the dust could not be seen','She lost the broom'],c:1,e:'She was rushed and reasoned that dust under the rug could not be seen.'},
 {q:'What made Minnie return to the rug?',o:['The dwarfs ordered her','A little voice in her heart reminded her','She heard a bell'],c:1,e:'The little voice in her heart repeatedly said, “Dust under the rug!”'},
 {q:'What was under the rug?',o:['Twelve gold pieces','A letter','A broom'],c:0,e:'She found twelve shining gold pieces.'},
 {q:'Why did the dwarfs reward Minnie?',o:['She had found a shortcut','She proved faithful and true','She was the fastest worker'],c:1,e:'They said the gold was for her because she had proved faithful and true.'},
 {q:'Which is a story element?',o:['Setting','Sentence length','Page number'],c:0,e:'Setting is one of the story elements explained in the lesson.'},
 {q:'What does plot mean?',o:['The sequence of events','The author’s name','The vocabulary list'],c:0,e:'Plot tells the sequence of events from beginning to the climax.'},
 {q:'What lesson does the story emphasize?',o:['Avoid all forests','Honesty and faithful work matter','Never help strangers'],c:1,e:'The ending says Minnie never forgot the lesson to do her work faithfully and states, “Honesty is the best policy!”'}
];
let assessDone=0,assessScore=0;
function renderAssessment(){
 const box=$('#assessmentQuiz');
 box.innerHTML='<div class="score-panel">Progress: <strong id="assessCount">0 / 15</strong> <span id="assessScore"></span></div>'+assessment.map((x,i)=>`<div class="assessment-item" data-a="${i}"><h3>${i+1}. ${x.q}</h3><div class="options">${x.o.map((o,j)=>`<button data-j="${j}">${String.fromCharCode(65+j)}. ${o}</button>`).join('')}</div><div class="explanation"></div></div>`).join('');
 $$('#assessmentQuiz .options button').forEach(b=>b.addEventListener('click',()=>{
  const item=b.closest('.assessment-item'); if(item.dataset.done) return;
  const i=+item.dataset.a,j=+b.dataset.j,x=assessment[i],exp=item.querySelector('.explanation');
  if(j===x.c){b.classList.add('correct');assessScore++;exp.textContent='✅ '+x.e;exp.style.color='var(--good)';}
  else{b.classList.add('incorrect');exp.textContent='💡 Try again. '+x.e;exp.style.color='var(--bad)';return}
  item.dataset.done='1';assessDone++;item.querySelectorAll('button').forEach(z=>z.disabled=true);
  $('#assessCount').textContent=`${assessDone} / ${assessment.length}`;$('#assessScore').textContent=` • ${assessScore} correct`;
  if(assessDone===assessment.length){
   const pct=Math.round(assessScore/assessment.length*100);
   setTimeout(()=>alert(`Assessment complete!\\nScore: ${assessScore}/${assessment.length} (${pct}%).\\n${pct>=90?'🏆 Mastery':pct>=75?'🌳 Proficient':pct>=60?'🌿 Developing':'🌱 Learning'}`),200);
  }
 }));
}
renderAssessment();

// Master Boss
const bossChoices=[
 ['Do the hidden work because responsibility matters even when nobody is watching.',1],
 ['Skip it because hidden work never matters.',0],
 ['Only do it if someone promises a reward.',0]
];
$('#boss1').innerHTML=bossChoices.map((x,i)=>`<button data-boss="${i}">${x[0]}</button>`).join('');
let boss1OK=false;
$$('#boss1 button').forEach(b=>b.addEventListener('click',()=>{
 const i=+b.dataset.boss;boss1OK=bossChoices[i][1]===1;
 b.parentElement.querySelectorAll('button').forEach(z=>z.classList.remove('selected'));
 b.classList.add('selected');
}));
$('#bossFinish').onclick=()=>{
 const v=$('#boss3').value.trim(),r=$('#bossResult');
 if(!boss1OK){r.textContent='💡 Complete Stage 1 first by connecting the situation to the story’s lesson.';r.className='feedback bad';return}
 if(v.length<8){r.textContent='💡 Finish your principle in a complete thought.';r.className='feedback bad';return}
 r.textContent='🏆 CASE SOLVED! You connected the story to a new situation and created your own principle.';r.className='feedback good';
 completed.add('master');updateProgress();
};

// Progress & persistence
updateProgress();
window.showSection=showSection;

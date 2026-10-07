const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let state={};
try { state=JSON.parse(localStorage.getItem('edjaySenseReview')||'{}') || {}; } catch(e) { state={}; localStorage.removeItem('edjaySenseReview'); }
state.best=Number(state.best)||0; state.practice=Number(state.practice)||0; state.badges=Array.isArray(state.badges)?state.badges:[]; state.missed=state.missed&&typeof state.missed==='object'?state.missed:{}; state.sound=state.sound!==false;
let session={correct:0,total:0,concepts:{},confidence:[]};
const quizResetters={};
function save(){localStorage.setItem('edjaySenseReview',JSON.stringify(state));updateStats()}
function updateStats(){$('#bestScore').textContent=Math.round(state.best)+'%';$('#practiceCount').textContent=state.practice;$('#badgeCount').textContent=state.badges.length}
function show(id){const target=document.getElementById(id); if(!target) return; if(quizResetters[id]) quizResetters[id](); $$('.screen').forEach(x=>x.classList.add('hidden')); target.classList.remove('hidden'); window.scrollTo({top:0,behavior:'smooth'});}
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]'); if(b){e.preventDefault(); show(b.dataset.go);}});
$('#soundBtn').onclick=()=>{state.sound=!state.sound;save();$('#soundBtn').textContent=state.sound?'🔊':'🔇'};
$('#resetBtn').onclick=()=>{if(confirm('Reset saved review progress?')){localStorage.removeItem('edjaySenseReview');location.reload()}};
updateStats();

const memory=[
 ['👁️ Eyes','Eyes help you see.','Care cue: Clean gently, use proper lighting, rest tired eyes, and never look directly at the sun.','SEE → PROTECT'],
 ['👂 Ears','Ears help you hear.','Care cue: Keep loud sounds low, avoid pointed objects, and protect your ears in noisy places.','HEAR → PROTECT'],
 ['👃 Nose','The nose helps you smell.','Care cue: Use a clean, soft tissue or handkerchief; do not put small objects inside; do not blow hard.','SMELL → CLEAN'],
 ['👅 Tongue, Teeth & Mouth','The tongue and teeth work together in the mouth.','Care cue: Cool hot food, clean your tongue, brush your teeth, floss, limit sweets, and visit the dentist.','EAT → CLEAN'],
 ['✋ Skin','Skin is the largest sense organ and is used for touching and feeling.','Care cue: Keep clean, avoid hot objects, protect from the sun, and care for irritated skin.','TOUCH → PROTECT'],
 ['🤝 Working Together','When eating, the eyes see the food, the nose smells the odor, and the tongue tastes the food.','Memory cue: SEE → SMELL → TASTE','ONE MEAL, THREE SENSES']
];
$('#memoryGrid').innerHTML=memory.map(m=>`<article class="memory-card"><h3>${m[0]}</h3><p>${m[1]}</p><p>${m[2]}</p><span class="cue">${m[3]}</span></article>`).join('');

const recallQ=[
 {q:'Which three sense organs work together when you are eating?',o:['Eyes, nose, and tongue','Ears, skin, and eyes','Skin, nose, and ears'],a:0,c:'Working together',e:'The book says the eyes, nose, and tongue work together when you are eating.',h:'Think about what you see, smell, and taste at a meal.'},
 {q:'What does your nose help you do?',o:['Smell things','Hear sounds','Feel pressure'],a:0,c:'Working together',e:'Your nose helps you smell things around you.',h:'Which sense is connected with an odor?'},
 {q:'What is the largest sense organ in your body?',o:['Skin','Tongue','Ear'],a:0,c:'Skin',e:'The book describes the skin as the largest sense organ in your body.',h:'It covers and protects your whole body.'},
 {q:'Which sense organ is used for touching and feeling?',o:['Skin','Nose','Eyes'],a:0,c:'Skin',e:'The skin is the sense organ used for touching and feeling.',h:'Think about hot, cold, soft, and rough.'},
 {q:'Which is a safe way to care for your eyes?',o:['Read with proper lighting','Look directly at the sun','Rub your eyes with dirty hands'],a:0,c:'Eyes',e:'The book says to read with proper lighting and avoid looking directly at the sun.',h:'Choose the action that protects your eyes.'},
 {q:'What should you NOT put inside your nose?',o:['Small objects','A clean tissue','A soft handkerchief'],a:0,c:'Nose',e:'The book warns not to put small objects inside your nose.',h:'One choice could be inhaled and injure the nose.'},
 {q:'What should you do with very hot food before eating it?',o:['Cool it off','Eat it quickly','Hold it in your mouth'],a:0,c:'Tongue, teeth and mouth',e:'Hot food could burn your tongue, so the book says to cool it before eating.',h:'Think: hot food → protect the tongue.'},
 {q:'Which is a good way to care for your ears?',o:['Keep music volume low','Put pointed objects inside','Shout into someone’s ears'],a:0,c:'Ears',e:'The book says to keep music volume low and avoid actions that can hurt the ears.',h:'Choose the quiet, protective action.'},
 {q:'Which action helps care for your skin?',o:['Take a regular bath with clean water and mild soap','Touch hot objects','Stay under the sun for a long time'],a:0,c:'Skin',e:'The book recommends regular bathing with clean water and mild soap.',h:'Clean skin is cared-for skin.'},
 {q:'Which action helps care for teeth?',o:['Brush after every meal','Eat lots of candy','Never visit a dentist'],a:0,c:'Tongue, teeth and mouth',e:'The book says to brush your teeth after every meal and see a dentist at least once a year.',h:'Think about keeping teeth clean.'}
];
function renderQuiz(container,questions,onDone){
  let i=0, score=0, answered=false;
  function q$(selector){return container.querySelector(selector)}
  function q$$(selector){return [...container.querySelectorAll(selector)]}
  function draw(){
    if(!questions.length){container.innerHTML='<div class="empty">No questions available.</div>';return;}
    const q=questions[i];
    container.innerHTML=`<div class="app-card"><div class="question-meta"><span>Question ${i+1} of ${questions.length}</span><span>${score} correct</span></div><div class="bar"><i style="width:${((i+1)/questions.length)*100}%"></i></div><div class="question">${q.q}</div><div class="choices">${q.o.map((x,j)=>`<button type="button" class="choice" data-choice="${j}">${String.fromCharCode(65+j)}. ${x}</button>`).join('')}</div><div class="quiz-feedback" aria-live="polite"></div><div class="next-row"><button type="button" class="secondary" data-action="hint">💡 Need a hint?</button><button type="button" class="primary" data-action="next" disabled>${i===questions.length-1?'Finish':'Next'} →</button></div></div>`;
    answered=false;
    q$$('.choice').forEach(b=>b.addEventListener('click',()=>{
      if(answered)return;
      answered=true;
      const j=Number(b.dataset.choice);
      q$$('.choice').forEach((x,k)=>{if(k===q.a)x.classList.add('correct');if(k===j&&j!==q.a)x.classList.add('wrong');x.disabled=true;});
      if(j===q.a){score++;session.correct++;session.concepts[q.c]=(session.concepts[q.c]||0)+1;}
      else {state.missed[q.c]=(state.missed[q.c]||0)+1;session.concepts[q.c]=(session.concepts[q.c]||0)-1;}
      session.total++; state.practice++;
      q$('.quiz-feedback').innerHTML=`<div class="feedback"><b>${j===q.a?'Excellent!':'Not quite.'}</b> ${q.e||'Review the lesson idea.'}<br><b>Memory tip:</b> ${q.h||'Think back to the Memory Booster.'}</div>`;
      q$(' [data-action="next"]'.trim()).disabled=false;
      save();
    }));
    q$('[data-action="hint"]').addEventListener('click',()=>{
      q$('.quiz-feedback').innerHTML=`<div class="hint">💡 ${q.h||'Think about the key idea in the lesson.'}</div>`;
    });
    q$('[data-action="next"]').addEventListener('click',()=>{
      if(!answered)return;
      i++;
      if(i<questions.length)draw();else onDone(score,questions.length);
    });
  }
  quizResetters[container.id]=()=>{i=0;score=0;answered=false;draw();};
  draw();
}
$('#recallApp').innerHTML='';renderQuiz($('#recallApp'),recallQ,(s,t)=>{show('memory');state.lastRecall=Math.round(s/t*100);save()});

const quickQ=[
['When eating, which organ smells the food?',['Eyes','Nose','Skin'],1,'Working together'],['Which organ sees the color of food?',['Eyes','Ears','Tongue'],0,'Working together'],['Which organ tastes food?',['Tongue','Nose','Skin'],0,'Working together'],['Skin helps you tell hot from what?',['Cold','Loud','Sweet'],0,'Skin'],['What can skin feel?',['Rough and smooth','Only colors','Only sounds'],0,'Skin'],['What should you use to wipe your eyes?',['Clean soft cloth/handkerchief','Rough object','Pointed object'],0,'Eyes'],['What should you avoid in your ears?',['Pointed objects','Soft washcloth outside','Low music volume'],0,'Ears'],['What should you do if you can hardly breathe through your nose?',['See a doctor at once','Put a small object inside','Blow very hard'],0,'Nose'],['What can help remove particles between teeth?',['Dental floss','Candy','Dirty cloth'],0,'Mouth'],['What should you wear/use to protect from strong sun according to the book?',['Umbrella or hat; sunglasses','Headphones only','A pointed object'],0,'Skin']].map(x=>({q:x[0],o:x[1],a:x[2],c:x[3],e:`The book teaches this as a way to understand or care for your sense organs.`,h:'Look back at the Memory Booster.'}));
renderQuiz($('#quickApp'),quickQ,(s,t)=>{show('match');state.lastQuick=Math.round(s/t*100);save()});

const pairs=[['Eyes','See the color of food'],['Nose','Smell the odor of food'],['Tongue','Taste the food'],['Skin','Touching and feeling'],['Ears','Hearing']];let leftSel=null,matched=0;function drawMatch(){const left=pairs.map((p,i)=>`<button class="match-item ${matchedPairs.has(i)?'matched':''}" data-left="${i}">${p[0]}</button>`).join('');const right=pairs.map((p,i)=>({text:p[1],i})).sort(()=>Math.random()-.5).map(p=>`<button class="match-item ${matchedPairs.has(p.i)?'matched':''}" data-right="${p.i}">${p.text}</button>`).join('');$('#matchApp').innerHTML=`<div class="match-card"><p><b>How to play:</b> Tap a sense organ, then tap its job.</p><div class="match-grid"><div>${left}</div><div>${right}</div></div><p class="match-status">${matched}/5 matched</p><div class="next-row"><button class="primary" id="matchNext" ${matched<5?'disabled':''}>Continue →</button></div></div>`;$$('[data-left]').forEach(b=>b.onclick=()=>{if(matchedPairs.has(+b.dataset.left))return;leftSel=+b.dataset.left;$$('[data-left]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')});$$('[data-right]').forEach(b=>b.onclick=()=>{if(leftSel===null||matchedPairs.has(+b.dataset.right))return;const r=+b.dataset.right;if(r===leftSel){matchedPairs.add(r);matched++;leftSel=null;drawMatch()}else{b.classList.add('wrong');setTimeout(()=>b.classList.remove('wrong'),500)}});$('#matchNext').onclick=()=>show('mistakes')}
let matchedPairs=new Set();
quizResetters.match=()=>{leftSel=null;matched=0;matchedPairs.clear();drawMatch();};
quizResetters.game=null;
drawMatch();

const mistakes=[
 {q:'A child says: “Looking directly at the sun is a good way to test my eyes.” What should you say?',o:['No. The book says never look directly at the sun.','Yes. Do it every day.','Yes, if the sun is bright.'],a:0,e:'The book says never look directly at the sun.'},
 {q:'A child wants to clean inside the ear with a pointed object. What is the best response?',o:['Do not do it. Pointed objects can hurt the ear.','That is the safest way.','Use a harder pointed object.'],a:0,e:'The book warns against hard or pointed objects in the ears.'},
 {q:'A child finds a tiny object and wants to put it in the nose. What should happen?',o:['Do not put it in the nose.','Try it carefully.','Push it farther inside.'],a:0,e:'The book says small objects can be inhaled and may injure the nose.'},
 {q:'A child wants to eat very hot food immediately. What is the safer choice?',o:['Cool the food first.','Eat it immediately.','Keep it in the mouth.'],a:0,e:'Hot food could burn the tongue.'},
 {q:'A child scratches an irritated insect bite. What does the book advise?',o:['Avoid scratching it and clean the irritated area.','Scratch it more.','Ignore all irritation.'],a:0,e:'The book says not to scratch the affected area and gives cleaning/disinfection guidance.'}
];
renderQuiz($('#mistakeApp'),mistakes,(s,t)=>{show('game');state.lastMistakes=Math.round(s/t*100);save()});

const gameQ=[
 {img:'eyes_care.jpg',s:'You are reading a book. Which choice protects your eyes?',o:['Use proper lighting.','Read in a dark place.','Look directly at the sun.'],a:0,c:'Eyes'},
 {img:'ears_care.jpg',s:'Music is very loud. What should you do?',o:['Keep the volume low.','Make it louder.','Shout into someone’s ears.'],a:0,c:'Ears'},
 {img:'nose_care.jpg',s:'You are traveling in polluted air. Which action follows the book?',o:['Cover your nose with a clean tissue/handkerchief or wear a nose mask.','Put a small object inside your nose.','Blow your nose very hard.'],a:0,c:'Nose'},
 {img:'skin_care.jpg',s:'Which routine helps care for your skin?',o:['Bathe regularly with clean water and mild soap.','Use very strong soap.','Never dry yourself with a clean towel.'],a:0,c:'Skin'},
 {img:'skin_safety.jpg',s:'The sun is very hot. Which is a protective choice from the book?',o:['Use an umbrella or hat and wear sunglasses.','Stay under the sun for a long time.','Touch hot objects.'],a:0,c:'Skin'},
 {img:'mouth_tongue.jpg',s:'Your food is steaming hot. What should you do?',o:['Cool it before eating.','Eat it immediately.','Bite your tongue.'],a:0,c:'Tongue/Mouth'},
 {img:'teeth_care.jpg',s:'Which habit helps care for your teeth?',o:['Brush after every meal.','Eat too many sweets.','Skip dental checkups.'],a:0,c:'Tongue/Teeth/Mouth'}
];
function renderGame(){let i=0,s=0;function draw(){let q=gameQ[i];$('#gameApp').innerHTML=`<div class="game-card"><div class="question-meta"><span>Mission ${i+1} of ${gameQ.length}</span><span>${s} points</span></div><div class="game-scene"><div class="game-image"><img src="assets/${q.img}" alt="Lesson illustration"></div><div><div class="scenario">${q.s}</div><div class="choices" style="margin-top:18px">${q.o.map((x,j)=>`<button class="choice" data-gchoice="${j}">${String.fromCharCode(65+j)}. ${x}</button>`).join('')}</div><div id="gfb"></div></div></div></div>`;let done=false;$$('[data-gchoice]').forEach(b=>b.onclick=()=>{if(done)return;done=true;let j=+b.dataset.gchoice;$$('[data-gchoice]').forEach((x,k)=>{if(k===q.a)x.classList.add('correct');if(k===j&&j!==q.a)x.classList.add('wrong')});if(j===q.a){s++;session.correct;session.concepts[q.c]=(session.concepts[q.c]||0)+1;$('#gfb').innerHTML=`<div class="feedback"><b>Great safety choice!</b> You protected the sense organ.</div>`}else{$('#gfb').innerHTML=`<div class="feedback"><b>Not quite.</b> ${q.o[q.a]} is the choice supported by the book.</div>`}state.practice++;session.total++;save();setTimeout(()=>{i++;if(i<gameQ.length)draw();else{state.gameScore=Math.round(s/gameQ.length*100);show('boss')}},800)})}
quizResetters.game=()=>{i=0;s=0;draw();};draw()}
renderGame();

const bossQ=[
 {q:'Which sentence best explains sense organs working together in the book?',o:['The eyes see food, the nose smells it, and the tongue tastes it.','Only the ears work during a meal.','The skin tastes the food.'],a:0,c:'Working together'},
 {q:'Which organ is described as the largest sense organ?',o:['Skin','Nose','Tongue'],a:0,c:'Skin'},
 {q:'Which is a safe eye-care habit?',o:['Use proper lighting when reading.','Look directly at the sun.','Rub eyes with dirty hands.'],a:0,c:'Eyes'},
 {q:'Which ear-care habit is supported by the book?',o:['Keep music volume low.','Put pointed objects in the ears.','Shout into another person’s ears.'],a:0,c:'Ears'},
 {q:'Which nose-care action is correct?',o:['Use a clean, soft tissue or handkerchief.','Put small objects in the nose.','Blow very hard.'],a:0,c:'Nose'},
 {q:'Which statement about skin is supported by the book?',o:['Skin lets you touch and feel things.','Skin only helps you hear.','Skin is not a sense organ.'],a:0,c:'Skin'},
 {q:'Which is a good way to care for the tongue?',o:['Cool hot food before eating.','Taste unknown substances.','Bite the tongue.'],a:0,c:'Tongue/Mouth'},
 {q:'What can dental floss help remove?',o:['Particles between your teeth','Sunlight','Loud sounds'],a:0,c:'Tongue/Teeth/Mouth'},
 {q:'What does the book recommend for a very sunny day?',o:['Wear sunglasses and use an umbrella or hat.','Look directly at the sun.','Stay under the sun for a long time.'],a:0,c:'Skin'},
 {q:'Why should you protect your sense organs?',o:['They help you learn about and respond to things around you.','They are only for games.','They are not important.'],a:0,c:'Working together'}
];
renderQuiz($('#bossApp'),bossQ,(s,t)=>finish(s,t));
function finish(s,t){const pct=Math.round(s/t*100);state.best=Math.max(state.best,pct);state.practice+=0;let badge=pct>=90?'Sense Master':pct>=80?'Sense Explorer':pct>=70?'Smart Reviewer':'Keep Practicing';if(!state.badges.includes(badge))state.badges.push(badge);save();$('#finalScore').textContent=pct+'%';$('#resultIcon').textContent=pct>=90?'🏆':pct>=80?'🌟':pct>=70?'🚀':'💪';$('#resultTitle').textContent=pct>=90?'Sense Master!':pct>=80?'Great Job!':pct>=70?'Almost There!':'Let’s Review Again';$('#resultMessage').textContent=pct>=90?'You showed strong understanding of the lesson.':pct>=80?'You remember most of the important ideas.':pct>=70?'A little more practice will make your learning stronger.':'Use the Memory Booster and try the questions again. Mistakes are part of learning.';const concepts=Object.entries(session.concepts).sort((a,b)=>a[1]-b[1]);const weak=concepts.length?concepts[0][0]:'Working together';$('#statsGrid').innerHTML=`<div><span>Score</span><strong>${pct}%</strong></div><div><span>Correct</span><strong>${s}/${t}</strong></div><div><span>Best</span><strong>${Math.round(state.best)}%</strong></div><div><span>Badge</span><strong>${badge}</strong></div>`;$('#weakCard').innerHTML=`<b>📚 Suggested review:</b> ${weak}. Revisit the Memory Booster and visual cards for this idea, then practice again.`;$('#fiveThings').innerHTML='<ul>'+['Eyes, ears, nose, tongue, and skin are sense organs.','Eyes, nose, and tongue work together when eating.','Skin is the largest sense organ and helps with touching and feeling.','Protect sense organs from harmful things and keep them clean.','When something is unsafe or a sense organ has a problem, ask an adult or see a doctor as taught in the book.'].map(x=>`<li>${x}</li>`).join('')+'</ul>';show('results')}

const sources=[
 ['working_together.jpg','Sense organs working together','When eating, the book explains that the eyes see the food, the nose smells the odor, and the tongue tastes the food.'],
 ['smell_touch_1.jpg','Smell and touch','The book shows that the nose helps you smell and that skin helps you identify how objects feel.'],
 ['eyes_care.jpg','Proper care of the eyes','Clean gently, use proper lighting, rest tired eyes, and protect eyes from very bright sunlight.'],
 ['ears_care.jpg','Proper care of the ears','Protect hearing from loud sounds and avoid pointed objects in the ears.'],
 ['nose_care.jpg','Proper care of the nose','Use a clean soft tissue/handkerchief, avoid small objects, and do not blow the nose hard.'],
 ['skin_care.jpg','Proper care of the skin','Keep clean, bathe with clean water and mild soap, and use a clean towel.'],
 ['skin_safety.jpg','Protect the skin','Avoid hot objects, protect from sun heat, and avoid scratching irritated insect bites.'],
 ['mouth_tongue.jpg','Proper care of the tongue','Cool hot food, clean the tongue, avoid biting it, and avoid tasting unknown substances.'],
 ['teeth_care.jpg','Proper care of teeth','Brush after meals, use dental floss, avoid too many sweets, and have dental checkups.']
];
$('#sourceGrid').innerHTML=sources.map(s=>`<article class="source-card"><img src="assets/${s[0]}" alt="${s[1]}"><h3>${s[1]}</h3><p>${s[2]}</p></article>`).join('');

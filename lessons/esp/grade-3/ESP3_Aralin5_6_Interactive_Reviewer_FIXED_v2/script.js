const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const state = { current:'home', lesson5Step:0, lesson6Step:0, finalScore:0, assessmentSubmitted:false };

function showSection(id){
  $$('.section').forEach(s=>s.classList.toggle('active', s.id===id));
  $$('.main-nav button').forEach(b=>b.classList.toggle('active', b.dataset.section===id));
  state.current=id;
  window.scrollTo({top:0,behavior:'smooth'});
  $('#mainNav').classList.remove('open');
  $('#menuBtn').setAttribute('aria-expanded','false');
}
function resetAssessment(){
  const form=$('#assessmentForm');
  if(!form) return;
  form.reset();
  $('#assessProgress').style.width='0%';
  state.assessmentSubmitted=false;
}
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>{
  if(b.dataset.go==='assessment' && state.assessmentSubmitted) resetAssessment();
  showSection(b.dataset.go);
}));
$$('.main-nav button').forEach(b=>b.addEventListener('click',()=>showSection(b.dataset.section)));

$('#menuBtn').addEventListener('click',()=>{
  const nav=$('#mainNav'); nav.classList.toggle('open');
  $('#menuBtn').setAttribute('aria-expanded', nav.classList.contains('open'));
});
$('#fullscreenBtn').addEventListener('click', async ()=>{
  try{
    if(!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  }catch(e){ alert('Full-screen mode is not available in this browser.'); }
});

function setupLesson(lesson){
  const section=$(`#lesson${lesson}`);
  const total=6;
  function goStep(step){
    state[`lesson${lesson}Step`]=step;
    $$(`[data-panel^="${lesson}-"]`,section).forEach(p=>p.classList.add('hidden'));
    $(`[data-panel="${lesson}-${step}"]`,section).classList.remove('hidden');
    $$('.step',section).forEach((b,i)=>b.classList.toggle('active',i===step));
    $(`#progress${lesson}Text`).textContent=`Step ${step+1} of ${total}`;
    $(`#progress${lesson}Bar`).style.width=`${((step+1)/total)*100}%`;
    window.scrollTo({top:0,behavior:'smooth'});
  }
  $$('.step',section).forEach(b=>b.addEventListener('click',()=>goStep(+b.dataset.step)));
  $$(`[data-next]`,section).forEach(b=>b.addEventListener('click',()=>{
    if(b.dataset.next==='5-4' && Object.keys(sortPlaced).length<sortData.length){
      const f=$('#sortFeedback');
      f.className='feedback try';
      f.textContent='Please place all six statements before checking your thinking.';
      return;
    }
    goStep(+b.dataset.next.split('-')[1]);
  }));
  return goStep;
}
const go5=setupLesson(5), go6=setupLesson(6);

$$('.flash').forEach(card=>{
  card.setAttribute('aria-pressed','false');
  card.addEventListener('click',()=>{
  const revealed=card.classList.toggle('revealed');
  card.querySelector('span').textContent=revealed?card.dataset.back:card.dataset.front;
  card.querySelector('small').textContent=revealed?'Tap to flip back':'Tap to reveal';
  card.setAttribute('aria-pressed', String(revealed));
  });
});

function wireChoiceGroup(container, correct, feedbackId){
  $$('.choice-row button',container).forEach(btn=>btn.addEventListener('click',()=>{
    $$('.choice-row button',container).forEach(x=>x.classList.remove('selected','correct','incorrect'));
    btn.classList.add('selected');
    const f=$(`#${feedbackId}`);
    if(btn.dataset.answer===correct){btn.classList.add('correct');f.className='feedback good';f.textContent='Excellent! That polite word fits the situation.'}
    else{btn.classList.add('incorrect');f.className='feedback try';f.textContent='Almost! Think about which expression is used when making a polite request.'}
  }));
}
wireChoiceGroup($('.mini-question'),'Pakiusap','explore1Feedback');

const scenarios5=[
  {q:'You want to ask your classmate to lend you a pencil.',a:['“Pakiusap, maaari mo ba akong pahiramin ng lapis?”','“Ibigay mo sa akin iyan!”','“Akin na lang iyan.”'],c:0},
  {q:'You accidentally step on someone’s foot.',a:['“Salamat!”','“Paumanhin.”','“Maaari ba?”'],c:1},
  {q:'Someone helps you carry your books.',a:['“Salamat.”','“Excuse me.”','“Pasensiya na.”'],c:0},
  {q:'You need to pass through people who are talking.',a:['“Paumanhin, maaari po bang makiraan?”','“Tumabi kayo.”','“Akin ang daan.”'],c:0},
  {q:'You made a mistake and want to apologize.',a:['“Pakiusap.”','“Pasensiya na.”','“Maaari ba?”'],c:1}
];
let s5Index=0,s5Score=0;
function renderS5(){
  const s=scenarios5[s5Index]; $('#s5Num').textContent=s5Index+1; $('#s5Scenario').textContent=s.q;
  $('#s5Feedback').textContent=''; $('#s5Feedback').className='feedback'; $('#s5Next').classList.add('hidden');
  const wrap=$('#s5Choices');wrap.innerHTML='';
  s.a.forEach((txt,i)=>{const b=document.createElement('button');b.textContent=txt;b.addEventListener('click',()=>{
    $$('#s5Choices button').forEach(x=>x.disabled=true);
    if(i===s.c){s5Score++;b.classList.add('correct');$('#s5Feedback').className='feedback good';$('#s5Feedback').textContent='Correct! You chose a respectful expression.'}
    else{b.classList.add('incorrect');wrap.children[s.c].classList.add('correct');$('#s5Feedback').className='feedback try';$('#s5Feedback').textContent='Not quite. Look at the polite expression highlighted in green.'}
    $('#s5Score').textContent=`Score: ${s5Score} / 5`; $('#s5Next').classList.remove('hidden');
    if(s5Index===4) $('#s5Continue').classList.remove('hidden');
  });wrap.appendChild(b)});
}
$('#s5Next').addEventListener('click',()=>{if(s5Index<4){s5Index++;renderS5()}});
renderS5();

const sortData=[
  ['“Pakiusap, maaari ba akong makisali?”',true],
  ['“Ako ang pinakamagaling! Walang tatalo sa akin.”',false],
  ['“Salamat sa pagtulong mo.”',true],
  ['“Ibigay mo sa akin iyan ngayon!”',false],
  ['“Pasensiya na, nagkamali ako.”',true],
  ['“Hindi ko kailangan ang tulong ninyo.”',false]
];
let sortPlaced={};
function renderSort(){
  const wrap=$('#sortItems');
  wrap.innerHTML='';
  $('#respectDrop').innerHTML='';
  $('#notRespectDrop').innerHTML='';

  sortData.forEach((item,i)=>{
    const b=document.createElement('button');
    b.type='button';
    b.className='sort-item';
    b.textContent=item[0];
    if(sortPlaced[i]!==undefined){
      b.classList.add('placed');
      b.title='Tap to move this statement back to the choices.';
      b.addEventListener('click',()=>{
        delete sortPlaced[i];
        renderSort();
        updateSortFeedback();
      });
      (sortPlaced[i] ? $('#respectDrop') : $('#notRespectDrop')).appendChild(b);
    }else{
      b.addEventListener('click',()=>{
        sortPlaced[i]=item[1];
        renderSort();
        updateSortFeedback();
      });
      wrap.appendChild(b);
    }
  });
}
function updateSortFeedback(){
  const placed=Object.keys(sortPlaced).length;
  const f=$('#sortFeedback');
  if(!placed){f.className='feedback';f.textContent='';return;}
  if(placed<sortData.length){
    f.className='feedback';
    f.textContent=`${placed} of ${sortData.length} statements placed. Keep going!`;
    return;
  }
  const correct=sortData.every((item,i)=>sortPlaced[i]===item[1]);
  f.className='feedback '+(correct?'good':'try');
  f.textContent=correct
    ? 'Excellent! All statements are correctly sorted.'
    : 'Review your choices. Respectful and humble statements belong in the first box.';
}
renderSort();

const check5Qs=[
  ['Which word politely asks for help?',['Salamat','Pakiusap','Paumanhin'],'Pakiusap'],
  ['Which word can be used when you make a mistake?',['Pasensiya na','Maaari ba','Salamat'],'Pasensiya na'],
  ['Which behavior shows humility?',['Being boastful','Being mababa ang loob','Making fun of others'],'Being mababa ang loob'],
  ['Which shows respect?',['Thanking someone who helped you','Shouting at someone','Taking something without asking'],'Thanking someone who helped you'],
  ['“Maaari ba?” is useful when…',['asking permission politely','insulting someone','boasting'],'asking permission politely']
];
function buildQuick(id,qs){
 const wrap=$(`#${id}`);wrap.innerHTML='';
 qs.forEach((q,i)=>{const box=document.createElement('fieldset');box.className='assess-q';box.innerHTML=`<legend>${i+1}. ${q[0]}</legend>`;q[1].forEach(opt=>{box.innerHTML+=`<label><input type="radio" name="${id}-${i}" value="${opt}"> ${opt}</label>`});wrap.appendChild(box)})
}
buildQuick('check5',check5Qs);
$('#check5Btn').addEventListener('click',()=>{
 let score=0;check5Qs.forEach((q,i)=>{const a=$(`input[name="check5-${i}"]:checked`);if(a&&a.value===q[2])score++});
 const r=$('#check5Result');r.className='result-box '+(score>=4?'good':'try');r.textContent=`You got ${score} / ${check5Qs.length}. ${score>=4?'Great understanding!':'Review the key words and try again.'}`;
});

const situations=[
 {title:'Situation A',q:'A classmate did not bring lunch and looks worried. What is a caring response?',a:['Laugh at the classmate.','Ask how you can help and share what you can.','Say, “That is your problem.”'],c:1},
 {title:'Situation B',q:'A friend is unusually quiet. What should you do first?',a:['Judge the friend immediately.','Understand that something may be bothering the friend and gently ask.','Tell everyone about the friend.'],c:1},
 {title:'Situation C',q:'Someone made a mistake during a group activity. What shows compassion?',a:['Make fun of the mistake.','Listen, understand, and help find an appropriate solution.','Refuse to talk to the person.'],c:1}
];
function renderSituation(i=0){
 const s=situations[i];const box=$('#sitContent');box.innerHTML=`<div class="scenario-number">${s.title}</div><p>${s.q}</p><div class="choice-stack">${s.a.map((x,j)=>`<button data-i="${j}">${x}</button>`).join('')}</div>`;
 $('#sitFeedback').textContent='';$('#sitFeedback').className='feedback';
 $$('.choice-stack button',box).forEach(b=>b.addEventListener('click',()=>{
   $$('.choice-stack button',box).forEach(x=>x.disabled=true);
   if(+b.dataset.i===s.c){b.classList.add('correct');$('#sitFeedback').className='feedback good';$('#sitFeedback').textContent='Correct! You considered the other person’s situation.'}
   else{b.classList.add('incorrect');box.querySelectorAll('button')[s.c].classList.add('correct');$('#sitFeedback').className='feedback try';$('#sitFeedback').textContent='Think first about understanding the person before judging.'}
 }));
}
$$('.situation-tab').forEach(b=>b.addEventListener('click',()=>{$$('.situation-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderSituation(+b.dataset.sit)}));renderSituation();

const careQs=[
 ['Listening to a friend who is having a hard time and trying to understand.',true],
 ['Laughing at someone because they made a mistake.',false],
 ['Helping someone after understanding what they need.',true],
 ['Judging a person immediately without knowing the situation.',false],
 ['Showing concern for another person’s feelings.',true]
];
let careI=0,careScore=0;
function renderCare(){
 const q=careQs[careI];const wrap=$('#careGame');wrap.innerHTML=`<div class="scenario-card"><div class="scenario-number">${careI+1}</div><p>${q[0]}</p><div class="choice-row"><button data-v="true">💗 Care</button><button data-v="false">⚠️ Judge / Not Care</button></div><div id="careFeedback" class="feedback"></div></div>`;
 $$('.choice-row button',wrap).forEach(b=>b.addEventListener('click',()=>{
   $$('.choice-row button',wrap).forEach(x=>x.disabled=true);
   const ok=(b.dataset.v==='true')===q[1];
   if(ok){careScore++;b.classList.add('correct');$('#careFeedback').className='feedback good';$('#careFeedback').textContent='Yes! This matches the lesson.'}
   else{b.classList.add('incorrect');$('#careFeedback').className='feedback try';$('#careFeedback').textContent='Not quite. Remember: understand the person and avoid judging too quickly.'}
   $('#careScore').textContent=`Score: ${careScore} / 5`;
   setTimeout(()=>{if(careI<4){careI++;renderCare()}else $('#careContinue').classList.remove('hidden')},450);
 }));
}
renderCare();

const empathyOptions=[
 ['Listen and gently ask if your classmate needs help.',true],
 ['Say, “Stop being quiet. You should be happy.”',false],
 ['Tell other classmates what you think happened.',false]
];
$('#empathyChoices').innerHTML=empathyOptions.map((x,i)=>`<button data-i="${i}">${x[0]}</button>`).join('');
$$('#empathyChoices button').forEach(b=>b.addEventListener('click',()=>{
 $$('#empathyChoices button').forEach(x=>x.disabled=true);
 if(+b.dataset.i===0){b.classList.add('correct');$('#empathyFeedback').className='feedback good';$('#empathyFeedback').textContent='Excellent! You are trying to understand and respond appropriately.'}
 else{b.classList.add('incorrect');$('#empathyChoices button').firstElementChild.classList.add('correct');$('#empathyFeedback').className='feedback try';$('#empathyFeedback').textContent='Think about the reminder: do not judge quickly; understand the situation first.'}
}));

const check6Qs=[
 ['Pagdamay o pakikiramay means…',['understanding another person’s feelings or putting yourself in their place','making fun of others','judging immediately'],'understanding another person’s feelings or putting yourself in their place'],
 ['What should you do before judging a person?',['Understand the situation first','Tell everyone','Ignore the person'],'Understand the situation first'],
 ['Why should you care for your own health?',['So you can better respond to others’ needs','So you can judge others','So you can avoid everyone'],'So you can better respond to others’ needs'],
 ['Which action shows pagmamalasakit?',['Helping after understanding what someone needs','Laughing at weakness','Immediately blaming someone'],'Helping after understanding what someone needs'],
 ['What should we remember about people?',['Everyone may experience difficult situations','Nobody has limitations','Everyone is always strong'],'Everyone may experience difficult situations']
];
buildQuick('check6',check6Qs);
$('#check6Btn').addEventListener('click',()=>{
 let score=0;check6Qs.forEach((q,i)=>{const a=$(`input[name="check6-${i}"]:checked`);if(a&&a.value===q[2])score++});
 const r=$('#check6Result');r.className='result-box '+(score>=4?'good':'try');r.textContent=`You got ${score} / ${check6Qs.length}. ${score>=4?'Excellent!':'Review the five reminders on page 38 and try again.'}`;
});

$('#master5Btn').addEventListener('click',()=>{
 const v=$('#master5Input').value.trim(),f=$('#master5Feedback');
 f.className='feedback '+(v?'good':'try');f.textContent=v?'Nice! You gave a personal example of respectful communication.':'Please write one way you can show respect when talking with others.';
});
$('#master6Btn').addEventListener('click',()=>{
 const v=$('#master6Input').value.trim(),f=$('#master6Feedback');
 f.className='feedback '+(v?'good':'try');f.textContent=v?'Wonderful! Caring actions begin with understanding others.':'Please write one caring action you can do for someone who is having a difficult time.';
});

const finalQs=[
 ['Which expression is best when politely asking for help?',['Pakiusap','Salamat','Pasensiya na','Walang pakialam'],'Pakiusap'],
 ['“Salamat” shows…',['gratitude','anger','boasting','judgment'],'gratitude'],
 ['“Paumanhin” can mean…',['Excuse me','Thank you','Goodbye','I am the best'],'Excuse me'],
 ['“Pasensiya na” is appropriate when…',['you apologize','you boast','you demand','you ignore someone'],'you apologize'],
 ['Which shows pagpapakumbaba?',['Being mababa ang loob','Bragging about being the best','Making fun of others','Refusing to say thank you'],'Being mababa ang loob'],
 ['Which action shows paggalang?',['Using polite words when speaking','Shouting at others','Taking without asking','Insulting a classmate'],'Using polite words when speaking'],
 ['“Maaari ba?” is useful for…',['asking permission politely','mocking someone','judging someone','boasting'],'asking permission politely'],
 ['Which is NOT a respectful way to ask for something?',['“Ibigay mo sa akin iyan!”','“Pakiusap…”','“Maaari ba?”','“Maaari po ba?”'],'“Ibigay mo sa akin iyan!”'],
 ['What does pagdamay/pakikiramay involve?',['Understanding another person’s feelings','Ignoring another person','Judging quickly','Making fun of weakness'],'Understanding another person’s feelings'],
 ['Before judging someone, you should…',['understand the situation first','tell everyone your guess','laugh','immediately blame the person'],'understand the situation first'],
 ['People may experience…',['difficult situations in life','no limitations at all','only happy days','the exact same feelings always'],'difficult situations in life'],
 ['Why should we care for our health and ourselves?',['To better respond to others’ needs','To become better than everyone','To avoid helping others','To judge others'],'To better respond to others’ needs'],
 ['Which is a caring response to a sad classmate?',['Gently ask what is wrong and offer appropriate help','Laugh','Tell everyone','Say the classmate is weak'],'Gently ask what is wrong and offer appropriate help'],
 ['Which action shows quick judgment?',['Blaming someone without understanding the situation','Listening first','Asking how you can help','Trying to understand feelings'],'Blaming someone without understanding the situation'],
 ['A person makes a mistake. What is a compassionate response?',['Understand and help appropriately','Mock the person','Spread the story','Refuse to listen'],'Understand and help appropriately'],
 ['Which statement best shows the lesson’s idea of respect?',['Respect involves regard and love for others','Respect means being boastful','Respect means always winning','Respect means ignoring others'],'Respect involves regard and love for others'],
 ['Which statement best shows humility?',['Not being boastful, especially in games','Always saying you are the best','Laughing at others who lose','Demanding special treatment'],'Not being boastful, especially in games'],
 ['A friend is quiet. What should you avoid?',['Judging immediately','Listening','Understanding','Offering appropriate help'],'Judging immediately'],
 ['Which pair belongs to the polite expressions in Aralin 5?',['Pakiusap and Salamat','Huwag and Tumabi','Akin and Ibigay','Bawal and Alis'],'Pakiusap and Salamat'],
 ['Which pair best summarizes Aralin 5 and Aralin 6?',['Respectful communication + understanding and caring for others','Winning games + being boastful','Judging others + demanding things','Ignoring people + refusing help'],'Respectful communication + understanding and caring for others']
];

function buildAssessment(){
 const wrap=$('#assessmentQuestions');wrap.innerHTML='';
 finalQs.forEach((q,i)=>{
   const box=document.createElement('fieldset');box.className='assess-q';
   const legend=document.createElement('legend');legend.textContent=`${i+1}. ${q[0]}`;box.appendChild(legend);
   q[1].forEach(opt=>{
     const label=document.createElement('label');
     label.innerHTML=`<input type="radio" name="final-${i}" value="${opt}"> ${opt}`;
     box.appendChild(label);
   });
   wrap.appendChild(box);
 });
}
buildAssessment();
$('#assessmentForm').addEventListener('change',()=>{
 const answered=$$('[name^="final-"]:checked').length;
 $('#assessProgress').style.width=`${answered/finalQs.length*100}%`;
});
$('#assessmentForm').addEventListener('submit',(e)=>{
 e.preventDefault();let score=0;
 finalQs.forEach((q,i)=>{const a=$(`input[name="final-${i}"]:checked`);if(a&&a.value===q[2])score++});
 state.finalScore=score;state.assessmentSubmitted=true;
 $('#finalScore').textContent=`${score} / ${finalQs.length}`;
 const pct=Math.round(score/finalQs.length*100);$('#finalPercent').textContent=`${pct}%`;
 $('#correctCount').textContent=score;$('#wrongCount').textContent=finalQs.length-score;
 let level,msg,advice;
 if(pct>=90){level='⭐⭐⭐⭐ Mastered';msg='Excellent work! You mastered the reviewer.';advice='You can explain respectful communication and show understanding, sympathy, and compassion in everyday situations.'}
 else if(pct>=75){level='⭐⭐⭐ Proficient';msg='Great job! You are doing very well.';advice='Review a few key words or situations, then try the challenge again for mastery.'}
 else if(pct>=60){level='⭐⭐ Developing';msg='Good effort! Keep practicing.';advice='Review the polite expressions and the five reminders about pagdamay and pagmamalasakit.'}
 else{level='⭐ Beginning';msg='Keep going! Mistakes help us learn.';advice='Go back to Aralin 5 and 6, read the book connections, and practice again.'}
 $('#masteryLevel').textContent=level;$('#finalMessage').textContent=msg;$('#resultAdvice').textContent=advice;
 showSection('results');
});
showSection('home');

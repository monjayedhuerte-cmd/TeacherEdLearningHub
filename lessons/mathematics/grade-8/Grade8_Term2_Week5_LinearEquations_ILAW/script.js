const dayState={day1:0,day2:0,day3:0,day4:0,day5:0};

function qs(s){return document.querySelector(s)}
function qsa(s){return [...document.querySelectorAll(s)]}

function goTo(id){
  const target=document.getElementById(id);
  if(!target)return;
  qsa('.slide-section,.assessment-section').forEach(s=>s.classList.remove('active-section'));
  if(id==='home'||id==='overview'){
    qs('#overview').classList.add('active-section');
  }else{
    target.classList.add('active-section');
  }
  qsa('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.target===id || (id==='overview'&&b.dataset.target==='home')));
  window.scrollTo({top:0,behavior:'smooth'});
}
qsa('.nav-item').forEach(btn=>btn.addEventListener('click',()=>goTo(btn.dataset.target)));
qs('#homeBtn').addEventListener('click',()=>goTo('overview'));

function updateDeck(day){
  const deck=qs('#deck-'+day), slides=qsa('#deck-'+day+' .lesson-slide');
  const i=dayState[day];
  slides.forEach((s,idx)=>s.classList.toggle('active',idx===i));
  qs('#counter-'+day).textContent=`Slide ${i+1} of ${slides.length}`;
}
function nextSlide(day){
  const slides=qsa('#deck-'+day+' .lesson-slide');
  dayState[day]=Math.min(dayState[day]+1,slides.length-1); updateDeck(day);
}
function prevSlide(day){
  dayState[day]=Math.max(dayState[day]-1,0); updateDeck(day);
}
['day1','day2','day3','day4','day5'].forEach(updateDeck);

function setFeedback(el,msg,good){
  if(!el)return;
  el.textContent=msg;el.className='feedback '+(good?'good':'bad');
}
function mark(btn,ok,msg){
  const row=btn.parentElement;
  row.querySelectorAll('button').forEach(b=>b.classList.remove('correct','wrong'));
  btn.classList.add(ok?'correct':'wrong');
  let fb=row.nextElementSibling;
  while(fb && !fb.classList.contains('feedback')) fb=fb.nextElementSibling;
  if(fb)setFeedback(fb,msg,ok);
}
function choice(btn,ok,id){
  const row=btn.parentElement;
  row.querySelectorAll('button').forEach(b=>b.classList.remove('correct','wrong'));
  btn.classList.add(ok?'correct':'wrong');
  const fb=document.getElementById(id+'-feedback');
  setFeedback(fb,ok?'🎉 Correct! Great thinking!':'💡 Not quite. Think about the inverse operation and try again.',ok);
}
function numberCheck(inputId,answer,feedbackId,goodMsg){
  const input=document.getElementById(inputId),fb=document.getElementById(feedbackId);
  const value=Number(input.value);
  if(input.value!=='' && Math.abs(value-answer)<1e-9)setFeedback(fb,'🎉 '+goodMsg,true);
  else setFeedback(fb,'💡 Try again. Show the equation and use inverse operations.',false);
}
function checkMany(items,feedbackId){
  let score=0;
  items.forEach(([id,ans])=>{
    const el=document.getElementById(id);
    if(el && el.value!=='' && Number(el.value)===ans)score++;
  });
  const fb=document.getElementById(feedbackId);
  setFeedback(fb,`${score}/${items.length} correct. ${score===items.length?'🔥 Perfect!':'Review the ones you missed and try again.'}`,score===items.length);
}
function saveReflection(inputId,feedbackId){
  const text=document.getElementById(inputId).value.trim();
  setFeedback(document.getElementById(feedbackId),text.length>5?'✅ Reflection submitted. Nice explanation!':'✏️ Write a little more so your thinking is clear.',text.length>5);
}

/* Fullscreen works with modern browsers and has a safe fallback message. */
const fsBtn=qs('#fullscreenBtn');
function fullscreen(){
  const el=document.getElementById('app');
  if(!document.fullscreenElement && el.requestFullscreen){
    el.requestFullscreen().catch(()=>setFeedback(fsBtn,'Fullscreen was blocked by the browser.',false));
  }else if(document.exitFullscreen){
    document.exitFullscreen();
  }else{
    alert('Your browser does not support Full Screen mode. You can use the browser menu to enter full screen.');
  }
}
fsBtn.addEventListener('click',fullscreen);
document.addEventListener('fullscreenchange',()=>{
  fsBtn.querySelector('span').textContent=document.fullscreenElement?'Exit Full Screen':'Full Screen';
});

/* Assessment */
const assessment=[
['Solve: x + 9 = 17.',['6','8','9','26'],1],
['Solve: x − 7 = 12.',['5','12','19','21'],2],
['Solve: 4x = 28.',['6','7','8','24'],1],
['Solve: x/5 = 6.',['1','11','25','30'],3],
['Solve: 2x + 5 = 19.',['5','6','7','12'],1],
['Solve: 3x − 8 = 16.',['6','8','10','24'],1],
['Solve: 5x + 10 = 35.',['3','5','7','9'],1],
['Solve: 7x − 4 = 31.',['4','5','6','7'],1],
['Solve: 4x + 3 = 2x + 15.',['4','6','8','9'],1],
['Solve: 6x − 5 = 3x + 13.',['4','6','8','10'],1],
['Which equation represents “a number increased by 11 is 25”?',['x−11=25','x+11=25','11x=25','x/11=25'],1],
['Which equation represents “three times a number decreased by 4 is 20”?',['3x+4=20','3x−4=20','4x−3=20','3(x−4)=20'],1],
['The sum of a number and 18 is 42. What is the number?',['18','20','24','60'],2],
['A number is 5 less than 31. What is the number?',['5','26','36','155'],1],
['A rectangle has perimeter 34 cm and width 6 cm. Find its length.',['8 cm','10 cm','11 cm','14 cm'],2],
['A square has perimeter 48 cm. Find one side.',['8 cm','10 cm','12 cm','16 cm'],2],
['You have ₱100 and spend ₱35. What amount remains?',['₱35','₱55','₱65','₱135'],2],
['Three identical pens plus a ₱12 notebook cost ₱57. What is the price of one pen?',['₱12','₱15','₱19','₱23'],1],
['A taxi charges ₱50 plus ₱10 per kilometer. The fare is ₱120. How many kilometers?',['5','6','7','8'],2],
['Which is the best first step in a word problem?',['Guess the answer','Define the unknown','Skip the equation','Change the numbers'],1]
];
function renderAssessment(){
  const form=qs('#assessmentForm');
  form.innerHTML=assessment.map((q,i)=>`
    <article class="q-card">
      <span class="q-number">ITEM ${i+1}</span>
      <div class="q-text">${q[0]}</div>
      <div class="q-options">
        ${q[1].map((opt,j)=>`<label><input type="radio" name="q${i}" value="${j}"> <span>${opt}</span></label>`).join('')}
      </div>
    </article>`).join('');
}
function submitAssessment(){
  let score=0,unanswered=0;
  assessment.forEach((q,i)=>{
    const picked=document.querySelector(`input[name="q${i}"]:checked`);
    if(!picked)unanswered++;
    else if(Number(picked.value)===q[2])score++;
  });
  const pct=Math.round(score/assessment.length*100);
  const result=qs('#assessmentResult');
  let message=pct>=80?'🏆 Excellent! You reached the suggested mastery level.':'💪 Keep practicing! Review the daily lessons and try the assessment again.';
  result.innerHTML=`<div class="score-big">${score} / ${assessment.length}</div><h3>${pct}%</h3><p>${message}</p><p>${unanswered?`You left ${unanswered} item(s) unanswered. `:''}Remember: <b>DEFINE → WRITE → SOLVE → CHECK → INTERPRET</b>.</p>`;
  result.classList.add('show');
  result.scrollIntoView({behavior:'smooth',block:'center'});
}
function resetAssessment(){
  qs('#assessmentForm').reset();qs('#assessmentResult').classList.remove('show');qs('#assessmentResult').innerHTML='';
}
renderAssessment();

/* Keyboard navigation for presentation feel. */
document.addEventListener('keydown',e=>{
  const active=qsa('.lesson-day.active-section')[0];
  if(!active)return;
  const day=active.id;
  if(e.key==='ArrowRight')nextSlide(day);
  if(e.key==='ArrowLeft')prevSlide(day);
  if(e.key==='f' || e.key==='F')fullscreen();
});

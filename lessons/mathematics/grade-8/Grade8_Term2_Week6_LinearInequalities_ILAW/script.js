const dayState={day1:0,day2:0,day3:0,day4:0,day5:0};
const qs=s=>document.querySelector(s), qsa=s=>[...document.querySelectorAll(s)];

function goTo(id){
  const target=document.getElementById(id);
  if(!target)return;
  qsa('.slide-section,.assessment-section').forEach(s=>s.classList.remove('active-section'));
  target.classList.add('active-section');
  qsa('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.target===id));
  window.scrollTo({top:0,behavior:'smooth'});
}
qsa('.nav-item').forEach(b=>b.addEventListener('click',()=>goTo(b.dataset.target)));
qs('#homeBtn').addEventListener('click',()=>goTo('home'));

function updateDeck(day){
  const slides=qsa('#deck-'+day+' .lesson-slide');
  const i=dayState[day];
  slides.forEach((s,n)=>s.classList.toggle('active',n===i));
  qs('#counter-'+day).textContent=`Slide ${i+1} of ${slides.length}`;
}
function nextSlide(day){const slides=qsa('#deck-'+day+' .lesson-slide');dayState[day]=Math.min(dayState[day]+1,slides.length-1);updateDeck(day)}
function prevSlide(day){dayState[day]=Math.max(dayState[day]-1,0);updateDeck(day)}
['day1','day2','day3','day4','day5'].forEach(updateDeck);

function setFeedback(el,msg,good){
  if(!el)return;
  el.textContent=msg;el.className='feedback '+(good?'good':'bad');
}
function choice(btn,ok,id){
  const row=btn.parentElement;
  row.querySelectorAll('button').forEach(b=>b.classList.remove('correct','wrong'));
  btn.classList.add(ok?'correct':'wrong');
  const fb=document.getElementById(id+'-feedback');
  setFeedback(fb,ok?'🎉 Correct! Great thinking!':'💡 Not quite. Review the explanation and try again.',ok);
}
function numberCheck(inputId,answer,feedbackId,goodMsg){
  const input=document.getElementById(inputId),fb=document.getElementById(feedbackId);
  const value=Number(input.value);
  const ok=input.value!=='' && Math.abs(value-answer)<1e-9;
  setFeedback(fb,ok?'🎉 '+goodMsg:'💡 Try again. Show each inverse operation and check the inequality.',ok);
}
function saveReflection(inputId,feedbackId){
  const text=document.getElementById(inputId).value.trim();
  setFeedback(document.getElementById(feedbackId),text.length>5?'✅ Reflection submitted. Nice explanation!':'✏️ Write a little more so your thinking is clear.',text.length>5);
}

const fsBtn=qs('#fullscreenBtn');
async function fullscreen(){
  try{
    if(!document.fullscreenElement){
      const el=document.getElementById('app');
      if(el.requestFullscreen) await el.requestFullscreen();
      else throw new Error('unsupported');
    }else{
      await document.exitFullscreen();
    }
  }catch(e){
    alert('Full Screen is not available in this browser. Try the browser menu or use the F11 key.');
  }
}
fsBtn.addEventListener('click',fullscreen);
document.addEventListener('fullscreenchange',()=>{
  fsBtn.querySelector('span').textContent=document.fullscreenElement?'Exit Full Screen':'Full Screen';
});

const assessment=[
['Which symbol means “less than”?',['<','>','≤','≥'],0],
['Which symbol means “greater than or equal to”?',['<','>','≤','≥'],3],
['“At most 12” is represented by:',['x<12','x>12','x≤12','x≥12'],2],
['“At least 7” is represented by:',['x<7','x≤7','x>7','x≥7'],3],
['Which is an inequality?',['x+3=9','x+3>9','x=6','2x=10'],1],
['Solve: x+5<12.',['x<5','x<7','x>7','x≤7'],1],
['Solve: x−4≥9.',['x≥5','x≥13','x≤13','x>13'],1],
['Solve: 3x≤18.',['x≤6','x≥6','x<6','x≤15'],0],
['Solve: 5x>35.',['x>5','x>7','x<7','x≥7'],1],
['Solve: −2x>10.',['x>−5','x<−5','x≥5','x≤5'],1],
['Solve: 4x−3≤13.',['x≤4','x≥4','x≤16','x≥16'],0],
['Solve: 2x+7≥15.',['x≥3','x≥4','x≤4','x>11'],1],
['For x>2, the graph uses:',['closed circle at 2, shade left','open circle at 2, shade left','open circle at 2, shade right','closed circle at 2, shade right'],2],
['For x≤−1, the graph uses:',['open at −1, shade left','closed at −1, shade left','open at −1, shade right','closed at −1, shade right'],1],
['When multiplying/dividing by a negative number, you should:',['keep the symbol','reverse the symbol','remove the symbol','change = to >'],1],
['A student needs at least 75 points and has 58. How many more points are needed?',['x≤17','x≥17','x>133','x<17'],1],
['A number increased by 9 is at most 20. Which inequality?',['x+9≥20','x+9<20','x+9≤20','x−9≤20'],2],
['Solve: 7x+2≤3x+18.',['x≤4','x≥4','x≤5','x≥5'],0],
['A bag costs ₱250 and you have ₱1,000. If each shirt costs ₱150, which represents the maximum number x of shirts?',['250+150x≤1000','250+150x≥1000','150x−250≤1000','250x+150≤1000'],0],
['Which is the best final step in a real-life inequality problem?',['Ignore the units','Interpret the answer in context','Change the inequality','Always round up'],1]
];

function renderAssessment(){
  const form=qs('#assessmentForm');
  form.innerHTML=assessment.map((q,i)=>`
  <article class="q-card">
    <span class="q-number">ITEM ${i+1}</span>
    <div class="q-text">${q[0]}</div>
    <div class="q-options">
      ${q[1].map((opt,j)=>`<label><input type="radio" name="q${i}" value="${j}"><span>${opt}</span></label>`).join('')}
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
  const message=pct>=80?'🏆 Excellent! You reached the suggested mastery level.':'💪 Keep practicing! Review the daily lessons and try again.';
  result.innerHTML=`<div class="score-big">${score} / ${assessment.length}</div><h3>${pct}%</h3><p>${message}</p><p>${unanswered?`You left ${unanswered} item(s) unanswered. `:''}<b>Remember:</b> SOLVE → CHECK → GRAPH → INTERPRET.</p>`;
  result.classList.add('show');
  result.scrollIntoView({behavior:'smooth',block:'center'});
}
function resetAssessment(){
  qs('#assessmentForm').reset();
  qs('#assessmentResult').classList.remove('show');
  qs('#assessmentResult').innerHTML='';
}
renderAssessment();

document.addEventListener('keydown',e=>{
  const active=document.querySelector('.lesson-day.active-section');
  if(!active)return;
  if(e.key==='ArrowRight')nextSlide(active.id);
  if(e.key==='ArrowLeft')prevSlide(active.id);
  if(e.key==='f'||e.key==='F')fullscreen();
});

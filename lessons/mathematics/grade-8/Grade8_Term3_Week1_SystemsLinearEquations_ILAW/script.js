const slides=[...document.querySelectorAll('.slide')];
const tabs=[...document.querySelectorAll('.day-nav button')];
let current=0;

function go(n){
  current=Math.max(0,Math.min(slides.length-1,n));
  slides.forEach((s,i)=>s.classList.toggle('active',i===current));
  tabs.forEach((b,i)=>b.classList.toggle('active',i===current));
  document.getElementById('progress').style.width=((current+1)/slides.length*100)+'%';
  document.getElementById('slideLabel').textContent=current===5?'ASSESSMENT':'DAY '+(current+1);
  document.getElementById('prevBtn').disabled=current===0;
  document.getElementById('nextBtn').disabled=current===slides.length-1;
  window.scrollTo({top:0,behavior:'smooth'});
}
function next(){if(current<slides.length-1)go(current+1)}
function prev(){if(current>0)go(current-1)}
tabs.forEach((b,i)=>b.addEventListener('click',()=>go(i)));

function mc(btn,correct){
  const box=btn.closest('.choice-grid');
  box.querySelectorAll('button').forEach(x=>x.disabled=true);
  btn.classList.add(correct?'correct':'wrong');
  const fb=box.parentElement.querySelector('.feedback');
  if(fb){fb.textContent=correct?'✅ Correct! Great thinking.':'💡 Not quite. Recheck the idea and try the next example.';fb.className='feedback '+(correct?'good':'bad')}
}

const questions=[
['Which best defines a system of linear equations in two variables?',['Two unrelated equations','Two linear equations considered together using the same variables','One quadratic equation','A table of values'],1],
['A solution of a system must satisfy…',['only the first equation','only the second equation','both equations','neither equation'],2],
['Which ordered pair satisfies x+y=10 and x−y=2?',['(4,6)','(6,4)','(5,5)','(8,2)'],1],
['What does each linear equation represent when graphed?',['A straight line','A circle','A parabola','A point only'],0],
['When two lines intersect, the intersection point represents…',['a random point','a common solution to both equations','the y-axis','the slope only'],1],
['For y=x+1, what is y when x=3?',['2','3','4','5'],2],
['For y=−x+5, what is y when x=2?',['2','3','4','7'],1],
['Which point lies on y=2x+1?',['(1,2)','(2,5)','(3,5)','(0,0)'],1],
['Which point satisfies y=x+2 and y=−x+6?',['(1,3)','(2,4)','(3,5)','(4,2)'],1],
['If two graphed lines meet at (−2,5), the solution is…',['(5,−2)','(−2,5)','(2,5)','(−2,−5)'],1],
['What should you do first when solving by graphing?',['Guess the answer','Write the equations clearly','Erase one equation','Multiply both equations'],1],
['How many points are normally needed to determine a straight line?',['1','2','5','10'],1],
['Which is a valid reason to verify an intersection point?',['To make sure it satisfies both equations','To change the graph','To avoid using variables','To find a circle'],0],
['If a point is on one line but not the other, it is…',['the solution of the system','not the solution of the system','always the midpoint','always the origin'],1],
['A system describes two facts about the same situation. The solution should make…',['both facts true','one fact true','neither fact true','only the variables equal'],0],
['Solve by graphing: y=x+1 and y=−x+5.',['(1,2)','(2,3)','(3,4)','(4,5)'],1],
['Solve by graphing: y=2x and y=−x+6.',['(1,2)','(2,4)','(3,6)','(4,8)'],1],
['If x+y=8 and the graph shows intersection (3,5), then x+y equals…',['3','5','8','15'],2],
['In a ticket problem, x may represent adult tickets and y student tickets. What must x and y be?',['Numbers with meaning in the situation','Always equal','Always negative','Angles'],0],
['A learner says “(4,2) is the solution because it is on one line.” What is the best correction?',['A solution must be on both lines','Only y matters','Any point is a solution','Graphs cannot solve systems'],0]
];

function buildQuiz(){
  const q=document.getElementById('quiz');
  q.innerHTML=questions.map((x,i)=>`
    <div class="quiz-item">
      <h3>${i+1}. ${x[0]}</h3>
      ${x[1].map((a,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${String.fromCharCode(65+j)}. ${a}</label>`).join('')}
    </div>`).join('');
}
function submitQuiz(){
  let score=0,answered=0;
  questions.forEach((x,i)=>{
    const pick=document.querySelector(`input[name="q${i}"]:checked`);
    if(pick){answered++;if(+pick.value===x[2])score++}
  });
  const r=document.getElementById('result');
  if(answered<questions.length){
    r.className='result show';r.innerHTML=`<b>⚠️ ${answered}/20 answered.</b><br>Please answer every item before submitting your final score.`;
    return;
  }
  const pct=score/questions.length*100;
  let msg=pct>=80?'🌟 Excellent mastery!':pct>=60?'👍 Good effort! Review the items you missed.':'💪 Keep practicing. Revisit Days 1–4 and try again.';
  r.className='result show';r.innerHTML=`<h2>Score: ${score}/20 (${pct}%)</h2><p>${msg}</p><p><b>Teacher tip:</b> For missed items, explain why the correct ordered pair must satisfy both equations.</p>`;
  r.scrollIntoView({behavior:'smooth',block:'center'});
}

async function toggleFullscreen(){
  const body=document.body;
  try{
    if(document.fullscreenElement || document.webkitFullscreenElement){
      if(document.exitFullscreen) await document.exitFullscreen();
      else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
      body.classList.remove('presentation-mode');
      return;
    }
    const el=document.documentElement;
    if(el.requestFullscreen) await el.requestFullscreen({navigationUI:'hide'});
    else if(el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else body.classList.toggle('presentation-mode');
  }catch(e){body.classList.toggle('presentation-mode')}
}
document.getElementById('fullscreenBtn').addEventListener('click',toggleFullscreen);
document.addEventListener('fullscreenchange',()=>document.body.classList.toggle('presentation-mode',!!document.fullscreenElement));
document.addEventListener('webkitfullscreenchange',()=>document.body.classList.toggle('presentation-mode',!!document.webkitFullscreenElement));

document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight')next();
  if(e.key==='ArrowLeft')prev();
});
buildQuiz();go(0);

const slides=[...document.querySelectorAll('.slide')], tabs=[...document.querySelectorAll('.week-nav button')];
let current=0;
const labels=['WEEKS 2–4','WEEK 2 DAY 1','WEEK 2 DAY 2','WEEK 2 DAY 3','WEEK 2 DAY 4','WEEK 2 DAY 5','WEEK 3 DAY 1','WEEK 3 DAY 2','WEEK 3 DAY 3','WEEK 3 DAY 4','WEEK 3 DAY 5','WEEK 4 DAY 1','WEEK 4 DAY 2','WEEK 4 DAY 3','WEEK 4 DAY 4','WEEK 4 DAY 5','ASSESSMENT'];
function go(n){current=Math.max(0,Math.min(slides.length-1,n));slides.forEach((s,i)=>s.classList.toggle('active',i===current));tabs.forEach(b=>b.classList.toggle('active',+b.dataset.target===current));document.getElementById('bar').style.width=((current+1)/slides.length*100)+'%';document.getElementById('label').textContent=labels[current];document.getElementById('prev').disabled=current===0;document.getElementById('next').disabled=current===slides.length-1;scrollTo({top:0,behavior:'smooth'})}
function next(){go(current+1)} function prev(){go(current-1)}
tabs.forEach(b=>b.onclick=()=>go(+b.dataset.target));
function mc(btn,ok){const box=btn.closest('.choice');box.querySelectorAll('button').forEach(x=>x.disabled=true);btn.classList.add(ok?'correct':'wrong');const fb=box.nextElementSibling;if(fb&&fb.classList.contains('fb')){fb.textContent=ok?'✅ Correct! Excellent reasoning.':'💡 Not quite. Recheck the concept and try again on the next item.';fb.style.color=ok?'#137a4b':'#b42318'}}
function pickClass(btn,type){const box=btn.parentElement;box.querySelectorAll('button').forEach(x=>x.disabled=true);const correct=(box.innerText.includes('y = x + 2')&&type==='one')||(box.innerText.includes('y = 2x + 1')&&type==='none')||(box.innerText.includes('y = −3x + 4')&&type==='inf');btn.classList.add(correct?'correct':'wrong');box.querySelector('small').textContent=correct?'✅ Correct classification.':'💡 Recheck the slopes and intercepts.'}
async function fullscreen(){try{if(document.fullscreenElement||document.webkitFullscreenElement){if(document.exitFullscreen)await document.exitFullscreen();else document.webkitExitFullscreen();document.body.classList.remove('presentation');return}if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen({navigationUI:'hide'});else if(document.documentElement.webkitRequestFullscreen)document.documentElement.webkitRequestFullscreen();else document.body.classList.toggle('presentation')}catch(e){document.body.classList.toggle('presentation')}}
document.getElementById('fullBtn').onclick=fullscreen;
document.addEventListener('fullscreenchange',()=>document.body.classList.toggle('presentation',!!document.fullscreenElement));
document.addEventListener('webkitfullscreenchange',()=>document.body.classList.toggle('presentation',!!document.webkitFullscreenElement));
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')next();if(e.key==='ArrowLeft')prev()});

const questions=[
['A system of linear equations in two variables is…',['two linear equations considered together using the same variables','two unrelated equations','a quadratic equation','a single point'],0],
['A system with lines that intersect once has…',['0 solutions','1 solution','2 solutions','infinitely many solutions'],1],
['Distinct parallel lines have…',['one solution','two solutions','no solution','infinitely many solutions'],2],
['The same line represented twice has…',['no solution','one solution','two solutions','infinitely many solutions'],3],
['For y=x+1 and y=−x+5, the solution is…',['(1,2)','(2,3)','(3,2)','(5,0)'],1],
['For y=2x+1 and y=2x−4, the system has…',['one solution','no solution','infinitely many solutions','two solutions'],1],
['For y=3x+2 and y=3x+2, the system has…',['no solution','one solution','infinitely many solutions','two solutions'],2],
['A solution to a system must make…',['only one equation true','both equations true','neither equation true','x equal y'],1],
['When solving x+y=7 and x−y=1 by addition, what disappears?',['x','y and −y','7','1'],1],
['The solution of x+y=7 and x−y=1 is…',['(3,4)','(4,3)','(7,1)','(1,7)'],1],
['Substitution is especially convenient when…',['a variable is already isolated','both equations are circles','there are no variables','all coefficients are zero'],0],
['For y=x+2 and x+y=8, the solution is…',['(2,6)','(3,5)','(4,4)','(5,3)'],1],
['For 2x+y=7 and x−y=2, the solution is…',['(2,3)','(3,1)','(1,3)','(4,−1)'],1],
['For 2x+3y=12 and 4x+3y=18, subtracting the equations eliminates…',['x','y','both variables','the constants'],1],
['After finding x algebraically, you should usually…',['stop immediately','find y and verify','change the equations','erase x'],1],
['In a ticket problem, variables should represent…',['meaningful quantities such as numbers of tickets','random letters only','always negative values','slopes only'],0],
['If x+y=10 and 60x+40y=480, x represents…',['student tickets','adult tickets','total money','ticket price'],1],
['Why must a real-life answer be checked for context?',['Some algebraic values may not make sense in the situation','Checking changes the equations','Context is never important','It makes every answer positive'],0],
['If x+y=12 and x−y=4, the solution is…',['(4,8)','(6,6)','(8,4)','(12,4)'],2],
['Best overall routine for a system word problem is…',['Guess → stop','Define → model → solve → verify → interpret','Graph only without variables','Add random numbers'],1]
];
function buildQuiz(){document.getElementById('quiz').innerHTML=questions.map((q,i)=>`<div class="q"><h3>${i+1}. ${q[0]}</h3>${q[1].map((a,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${String.fromCharCode(65+j)}. ${a}</label>`).join('')}</div>`).join('')}
function submitQuiz(){let score=0,answered=0;questions.forEach((q,i)=>{const a=document.querySelector(`input[name=q${i}]:checked`);if(a){answered++;if(+a.value===q[2])score++}});const r=document.getElementById('result');r.style.display='block';if(answered<20){r.innerHTML=`<b>⚠️ ${answered}/20 answered.</b><br>Please answer every item before final submission.`;return}const pct=score*5;let msg=pct>=80?'🌟 Excellent mastery!':pct>=60?'👍 Good work. Review the items you missed.':'💪 Keep practicing. Revisit Weeks 2–4 and try again.';r.innerHTML=`<h2>Score: ${score}/20 (${pct}%)</h2><p>${msg}</p><p><b>Remember:</b> classify by the relationship of the lines, choose an efficient algebraic method, and interpret solutions in context.</p>`;r.scrollIntoView({behavior:'smooth',block:'center'})}
buildQuiz();go(0);

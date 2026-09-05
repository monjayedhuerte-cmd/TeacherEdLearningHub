const sections=[...document.querySelectorAll('.section')];
const navItems=[...document.querySelectorAll('.nav-item')];
const visited=new Set(JSON.parse(localStorage.getItem('algVisited')||'[]'));

function showSection(id){
  sections.forEach(s=>s.classList.toggle('active',s.id===id));
  navItems.forEach(n=>n.classList.toggle('active',n.dataset.target===id));
  visited.add(id); saveProgress(); window.scrollTo({top:0,behavior:'smooth'});
}
navItems.forEach(n=>n.addEventListener('click',()=>showSection(n.dataset.target)));
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showSection(b.dataset.go)));

function saveProgress(){localStorage.setItem('algVisited',JSON.stringify([...visited]));const pct=Math.round(visited.size/sections.length*100);document.getElementById('progressBar').style.width=pct+'%';document.getElementById('progressText').textContent=pct+'% complete';}
function checkChoice(btn,correct,msg){const box=btn.parentElement.nextElementSibling;box.textContent=msg;box.style.color=correct?'#16804a':'#b23a3a';}
function saveReflection(input,out){if(document.getElementById(input).value.trim()){localStorage.setItem(input,document.getElementById(input).value);document.getElementById(out).textContent='✓ Saved';visited.add('discover');saveProgress();}}
document.getElementById('themeBtn').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('algDark',document.body.classList.contains('dark'))};
if(localStorage.getItem('algDark')==='true')document.body.classList.add('dark');
document.getElementById('resetBtn').onclick=()=>{if(confirm('Reset lesson progress and saved reflections?')){localStorage.removeItem('algVisited');localStorage.removeItem('dailyAlgo');location.reload()}};

document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active'));t.classList.add('active');document.getElementById(t.dataset.tab).classList.add('active')});

const structureQs=[
  {q:'Read three numbers, add them, then display the sum.',a:'Sequencing'},
  {q:'If the score is 75 or higher, display “Pass”; otherwise display “Try Again.”',a:'Selection'},
  {q:'Repeat the steps for every student in the class.',a:'Iteration'},
  {q:'Wash your hands: wet, soap, scrub, rinse, dry.',a:'Sequencing'}
]; let sq=0;
function renderStructure(){document.getElementById('structureQuestion').innerHTML='<p><strong>'+structureQs[sq].q+'</strong></p>'}
function answerStructure(a){const f=document.getElementById('structureFeedback');if(a===structureQs[sq].a){f.textContent='✓ Correct!';f.style.color='#16804a';sq=(sq+1)%structureQs.length;setTimeout(renderStructure,600)}else{f.textContent='Not yet—look for order, a condition, or repetition.';f.style.color='#b23a3a'}}
renderStructure();

const nums=[7,2,9,4,6];const row=document.getElementById('searchRow');let si=0;
nums.forEach(n=>{const d=document.createElement('div');d.className='search-item';d.textContent=n;row.appendChild(d)});
document.getElementById('searchBtn').onclick=()=>{const items=[...document.querySelectorAll('.search-item')];items.forEach(x=>x.className='search-item');si=0;document.getElementById('searchStatus').textContent='';const timer=setInterval(()=>{items.forEach(x=>x.className='search-item');if(si<items.length){items[si].classList.add('active');if(nums[si]===4){items[si].classList.remove('active');items[si].classList.add('found');document.getElementById('searchStatus').textContent='✓ Found 4 at position '+(si+1)+' after checking '+(si+1)+' item(s).';clearInterval(timer)}si++}else{document.getElementById('searchStatus').textContent='Target not found. Linear search returns -1.';clearInterval(timer)}},550)};

const avgSteps=[
'Read the first number.',
'Read the second number.',
'Add the two numbers.',
'Divide the sum by 2.',
'Display the average.'
];
let dragOrder=[...avgSteps].sort(()=>Math.random()-.5);
function renderDrag(){const box=document.getElementById('dragItems');box.innerHTML='';dragOrder.forEach((x,i)=>{const d=document.createElement('div');d.className='drag-step';d.draggable=true;d.textContent=(i+1)+'. '+x;d.dataset.i=i;d.ondragstart=e=>e.dataTransfer.setData('text/plain',i);d.ondragover=e=>e.preventDefault();d.ondrop=e=>{const from=+e.dataTransfer.getData('text/plain'),to=+d.dataset.i;[dragOrder[from],dragOrder[to]]=[dragOrder[to],dragOrder[from]];renderDrag()};box.appendChild(d)})}
function checkOrder(){const ok=dragOrder.every((x,i)=>x===avgSteps[i]);const f=document.getElementById('orderFeedback');f.textContent=ok?'✓ Excellent! Your algorithm is correctly sequenced.':'Keep trying. Think: input → operation → output.';f.style.color=ok?'#16804a':'#b23a3a';if(ok){visited.add('pseudocode');saveProgress()}}
renderDrag();

const seqCorrect=['Press the power button.','Wait for the computer to start.','Log in when prompted.','Wait for the desktop to load.'];
let seqItems=[...seqCorrect].sort(()=>Math.random()-.5);
function renderSequence(){const box=document.getElementById('sequenceGame');box.innerHTML='';seqItems.forEach((x,i)=>{const d=document.createElement('div');d.className='seq-item';d.textContent=(i+1)+'. '+x;d.draggable=true;d.dataset.i=i;d.ondragstart=e=>e.dataTransfer.setData('text/plain',i);d.ondragover=e=>e.preventDefault();d.ondrop=e=>{const from=+e.dataTransfer.getData('text/plain'),to=+d.dataset.i;[seqItems[from],seqItems[to]]=[seqItems[to],seqItems[from]];renderSequence()};box.appendChild(d)})}
function shuffleSequence(){seqItems=[...seqCorrect].sort(()=>Math.random()-.5);renderSequence();document.getElementById('sequenceFeedback').textContent=''}
function checkSequence(){const ok=seqItems.every((x,i)=>x===seqCorrect[i]);const f=document.getElementById('sequenceFeedback');f.textContent=ok?'✓ Perfect sequence!':'Almost. Put the actions in a realistic order.';f.style.color=ok?'#16804a':'#b23a3a'}
renderSequence();

function mcq(btn,correct,msg){const f=btn.parentElement.nextElementSibling;f.textContent=(correct?'✓ ':'')+msg;f.style.color=correct?'#16804a':'#b23a3a'}

function detective(correct){const f=document.getElementById('detectiveFeedback');f.textContent=correct?'✓ Correct. “Looks right” can mean different things to different people.':'Try again. The instruction needs a precise condition.';f.style.color=correct?'#16804a':'#b23a3a'}

const questions=[
['What is an algorithm?',['A random guess','A clear set of steps for solving a problem','A computer brand','A file type'],1],
['Which part is the result produced by an algorithm?',['Input','Output','Keyboard','Variable'],1],
['Which building block executes steps in an ordered manner?',['Selection','Iteration','Sequencing','Debugging'],2],
['Which building block uses a condition to choose an action?',['Selection','Sequencing','Iteration','Compilation'],0],
['Which building block repeats steps?',['Selection','Iteration','Input','Output'],1],
['Which is the best example of an algorithm?',['“Do it somehow.”','A clear recipe with ordered steps','A picture only','A random action'],1],
['Pseudocode is mainly used to…',['replace the computer','describe program logic in a simple form','turn off a computer','store photos'],1],
['A program differs from pseudocode because a program…',['must use exact programming-language syntax','cannot have instructions','is always handwritten','never uses logic'],0],
['A good algorithm should be…',['ambiguous','impossible','finite','random'],2],
['“If score ≥ 75, display Pass; else display Try Again” is…',['Sequencing','Selection','Iteration','Input'],1],
['“Repeat practice until there are no mistakes” is…',['Iteration','Selection','Output','Input'],0],
['Which is a real-world use of algorithms?',['Social-media recommendations','Only drawing','Only handwriting','Only sleeping'],0],
['Which field uses algorithms to analyze large amounts of data?',['Data science','Painting','Music only','Sports only'],0],
['What does language-independent mean?',['It works only in Python','Its logic is not tied to one programming language','It uses no instructions','It cannot be implemented'],1],
['What should an algorithm produce?',['At least one well-defined output','No output','Only errors','A keyboard'],0],
['Which quality means every step has one clear meaning?',['Finite','Clear and unambiguous','Expensive','Decorative'],1],
['A linear search normally checks items…',['one by one from the beginning','only the last item','randomly','in reverse only'],0],
['If a linear search finds no target, the sample pseudocode returns…',['0','1','-1','100'],2],
['Who is associated with the historical origin of the term “algorithm”?',['Al-Khwarizmi','Isaac Newton','Charles Darwin','Galileo'],0],
['Why are algorithms important in computing?',['They provide systematic procedures for solving problems','They make computers heavier','They remove all human decisions','They are only for games'],0]
];
function buildQuiz(){const form=document.getElementById('quizForm');questions.forEach((q,i)=>{const d=document.createElement('div');d.className='quiz-item';d.innerHTML='<h3>'+ (i+1)+'. '+q[0]+'</h3>'+q[1].map((o,j)=>'<label class="quiz-option"><input type="radio" name="q'+i+'" value="'+j+'"> '+o+'</label>').join('');form.appendChild(d)})}
buildQuiz();
function gradeQuiz(){let score=0,answered=0;questions.forEach((q,i)=>{const pick=document.querySelector('input[name=q'+i+']:checked');if(pick){answered++;if(+pick.value===q[2])score++}});const result=document.getElementById('quizResult');const pct=Math.round(score/questions.length*100);result.innerHTML='Score: <strong>'+score+'/20</strong> ('+pct+'%)<br><small>'+answered+' item(s) answered. '+(pct>=80?'Excellent work! You are ready for the next lesson.':pct>=60?'Good effort! Review the sections you missed and try again.':'Keep practicing. Revisit the Core Concepts and Building Blocks, then retry.')+'</small>';visited.add('assessment');saveProgress();window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'})}
function finishLesson(){const vals=['exit1','exit2','exit3'].map(id=>document.getElementById(id).value.trim());const msg=document.getElementById('finishMessage');if(vals.some(v=>!v)){msg.textContent='Please complete all three exit-ticket boxes first.';msg.style.color='#b23a3a';return}visited.add('summary');saveProgress();msg.textContent='🎉 Lesson completed! Great job, Algorithm Explorer. Your progress is saved on this device.';msg.style.color='#16804a'}
saveProgress();

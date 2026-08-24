let current=0;
const screens=[...document.querySelectorAll('.screen')];
function updateProgress(){
  document.getElementById('progressText').textContent=`Mission ${current+1} of ${screens.length}`;
  document.getElementById('progressBar').style.width=((current+1)/screens.length*100)+'%';
}
function showScreen(n){
  current=Math.max(0,Math.min(n,screens.length-1));
  screens.forEach((s,i)=>s.classList.toggle('active',i===current));
  updateProgress();
  window.scrollTo({top:0,behavior:'smooth'});
  if(current===4) initClassify();
  if(current===5) initQuiz();
}
function nextScreen(){showScreen(current+1)}
function revealMystery(){
  const items=['☁️ cotton','🪵 wooden block','🪞 smooth plastic','🪨 rough stone'];
  const item=items[Math.floor(Math.random()*items.length)];
  document.getElementById('mysteryResult').innerHTML=`<b>Secret object:</b> ${item}. Now describe how it feels!`;
}
function showClue(word){
  const map={soft:'☁️ Soft things can feel fluffy and gentle.',hard:'🪵 Hard things do not easily bend or squeeze.',smooth:'🪞 Smooth surfaces feel even.',rough:'🪨 Rough surfaces feel bumpy or uneven.'};
  document.getElementById('mysteryResult').textContent=map[word];
}
const parts={
  epidermis:{icon:'🧱',title:'Epidermis',text:'The epidermis is the top layer of the skin. It helps form a protective covering for our body.'},
  dermis:{icon:'🌸',title:'Dermis',text:'The dermis is a deeper layer of skin. It contains structures that help the skin work, including nerves and glands.'},
  hair:{icon:'💇',title:'Fine Hair',text:'Fine hairs grow from the skin and can help protect the skin from dust and germs.'},
  pores:{icon:'🔘',title:'Pores',text:'Pores are tiny openings in the skin. Sweat can come out through pores.'},
  sweat:{icon:'💧',title:'Sweat Gland',text:'Sweat glands make sweat. Sweating helps your body release heat.'},
  nerves:{icon:'⚡',title:'Nerve Endings',text:'Nerve endings help the skin sense touch, pressure, pain, and changes in temperature.'},
  oil:{icon:'✨',title:'Oil Ducts',text:'Oil travels through oil ducts and helps keep the skin from drying out.'}
};
function skinPart(key){
  const p=parts[key];
  document.getElementById('partInfo').innerHTML=`<div class="part-icon">${p.icon}</div><h3>${p.title}</h3><p>${p.text}</p>`;
}
const classify=[
  {emoji:'☁️',name:'Cotton',answer:'Soft'},
  {emoji:'🪵',name:'Wooden block',answer:'Hard'},
  {emoji:'🧊',name:'Ice',answer:'Cold'},
  {emoji:'🪨',name:'Rough stone',answer:'Rough'},
  {emoji:'🪞',name:'Smooth glass',answer:'Smooth'},
  {emoji:'🤝',name:'A gentle squeeze',answer:'Pressure'}
];
let gameIndex=0,gameScore=0;
function initClassify(){gameIndex=0;gameScore=0;renderClassify();}
function renderClassify(){
  const g=document.getElementById('classifyGame');
  if(gameIndex>=classify.length){
    g.innerHTML=`<div class="game-card"><div style="font-size:60px">🎉</div><h3>Challenge Complete!</h3><p>You scored <b>${gameScore}/${classify.length}</b>.</p><button class="primary" onclick="nextScreen()">Take the Quiz ➜</button></div>`;
    document.getElementById('score').textContent=`⭐ Final Score: ${gameScore}/${classify.length}`;
    return;
  }
  const q=classify[gameIndex];
  const options=['Soft','Hard','Warm','Cold','Smooth','Rough','Pressure'];
  g.innerHTML=`<div class="game-card"><div class="object-emoji">${q.emoji}</div><h3>What does ${q.name} feel like?</h3><div class="answers">${options.map(o=>`<button onclick="answerClassify('${o}')">${o}</button>`).join('')}</div></div>`;
}
function answerClassify(answer){
  const correct=classify[gameIndex].answer===answer;
  if(correct) gameScore++;
  const g=document.getElementById('classifyGame');
  g.querySelectorAll('button').forEach(b=>b.disabled=true);
  const msg=document.createElement('div');
  msg.style.marginTop='18px';msg.style.fontWeight='900';msg.textContent=correct?'✅ Correct! Great detective!':'💡 Good try! The best answer is '+classify[gameIndex].answer+'.';
  g.querySelector('.game-card').appendChild(msg);
  document.getElementById('score').textContent=`⭐ Score: ${gameScore}`;
  setTimeout(()=>{gameIndex++;renderClassify()},900);
}
const quizQs=[
 {q:'Which sense organ helps you touch and feel?',a:['Eyes','Skin','Ears'],c:1},
 {q:'What does cotton usually feel like?',a:['Soft','Rough','Hard'],c:0},
 {q:'What can skin tell you about ice?',a:['Cold','Loud','Sweet'],c:0},
 {q:'Which part of the skin helps sense touch, pressure, pain, and temperature?',a:['Nerve endings','Hair','Oil ducts'],c:0},
 {q:'Why is feeling pain important?',a:['It warns us something may be wrong.','It makes us hungry.','It helps us hear.'],c:0}
];
let quizDone=false;
function initQuiz(){
  quizDone=false;
  const qbox=document.getElementById('quiz');
  qbox.innerHTML=quizQs.map((q,i)=>`<div class="question"><h3>${i+1}. ${q.q}</h3>${q.a.map((a,j)=>`<button class="option" onclick="answerQuiz(${i},${j},this)">${a}</button>`).join('')}</div>`).join('');
  document.getElementById('quizResult').textContent='';
  document.getElementById('finishQuiz').classList.add('hidden');
}
let quizScore=0,quizAnswered=0;
function answerQuiz(i,j,btn){
  const parent=btn.parentElement;
  if(parent.dataset.done) return;
  parent.dataset.done='1';quizAnswered++;
  const correct=quizQs[i].c===j;
  if(correct){quizScore++;btn.classList.add('correct')}else{btn.classList.add('wrong');parent.querySelectorAll('.option')[quizQs[i].c].classList.add('correct')}
  if(quizAnswered===quizQs.length){
    document.getElementById('quizResult').textContent=`🌟 You scored ${quizScore}/${quizQs.length}!`;
    document.getElementById('finishQuiz').classList.remove('hidden');
  }
}
function exitAnswer(btn){
  document.querySelectorAll('.choices button').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('exitMessage').textContent=`Excellent! You can feel ${btn.textContent.toLowerCase()} with your skin. 🖐️`;
}
function toggleTeacherPanel(){document.getElementById('teacherPanel').classList.toggle('open')}
updateProgress();

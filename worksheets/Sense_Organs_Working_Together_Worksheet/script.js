const data = {};
let state = {answers:{}, matching:{}, reflection:null};
let answered = 0;

async function loadData(){
  const r=await fetch('data/worksheet.json');
  Object.assign(data,await r.json());
  renderReview(); renderSections(); renderReflection(); buildAnswerKey(); restore();
}
function esc(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function renderReview(){
  document.getElementById('reviewGrid').innerHTML=data.review.map(x=>`<article class="review-item"><div class="emoji">${x.icon}</div><h3>${x.organ}</h3><p>${x.job}</p></article>`).join('');
}
function renderSections(){
 const root=document.getElementById('worksheet');
 root.innerHTML=data.sections.map(sec=>{
   if(sec.id==='matching') return renderMatching(sec);
   return `<section class="worksheet-section" id="section-${sec.id}"><div class="section-head"><div><h2>${sec.title}</h2><p>${sec.subtitle}</p></div><span class="badge">${sec.id==='guided'?'🟢 EASY':sec.id==='practice'?'🟡 PRACTICE':sec.id==='application'?'🔵 APPLY':'🔴 CHALLENGE'}</span></div>${sec.questions.map(renderQuestion).join('')}</section>`;
 }).join('');
}
function renderQuestion(q){
 const hint={1:'Think about what you use to see, smell, and taste.',2:'Think about the organ you use to see words.',3:'Think about the organ that hears sounds.',4:'Think about the organ that helps you feel by touch.',5:'Think about the organ that detects smells.'}[q.id];
 return `<article class="q-card" data-q="${q.id}"><div class="q-text"><span class="q-number">${q.id}.</span>${q.q}</div><div class="choices">${q.choices.map((c,i)=>`<button class="choice" data-choice="${i}" onclick="choose(${q.id},${i})">${String.fromCharCode(65+i)}. ${esc(c)}</button>`).join('')}</div><div class="feedback" id="fb-${q.id}" aria-live="polite"></div>${hint?`<div class="hint"><button onclick="toggleHint(${q.id})">💡 Hint</button><p id="hint-${q.id}" class="hidden">${hint}</p></div>`:''}</article>`;
}
function findQ(id){for(const s of data.sections){if(s.questions){const q=s.questions.find(x=>x.id===id);if(q)return q;}}return null}
function choose(id,i){
 const q=findQ(id); if(!q)return; state.answers[id]=i;
 const card=document.querySelector(`[data-q="${id}"]`); card.querySelectorAll('.choice').forEach((b,n)=>{b.classList.remove('selected','correct','incorrect');if(n===i)b.classList.add('selected');});
 const fb=document.getElementById(`fb-${id}`); if(i===q.answer){fb.textContent='✅ Correct! Great job!';fb.style.color='var(--green)';card.querySelectorAll('.choice')[i].classList.add('correct')}else{fb.textContent='❌ Not quite. Try again!';fb.style.color='var(--red)';card.querySelectorAll('.choice')[i].classList.add('incorrect')}
 save(); updateScore();
}
function toggleHint(id){document.getElementById(`hint-${id}`).classList.toggle('hidden')}
function renderMatching(sec){return `<section class="worksheet-section" id="section-matching"><div class="section-head"><div><h2>${sec.title}</h2><p>${sec.subtitle}</p></div><span class="badge">🧩 MATCH</span></div><div class="match-grid">${sec.pairs.map(p=>`<div class="match-item"><span><b>${p.id-10}.</b> ${p.left}</span><select data-match="${p.id}"><option value="">Choose…</option>${sec.choices.map(c=>`<option>${c}</option>`).join('')}</select></div>`).join('')}</div><button class="check-btn" onclick="checkMatching()">Check Matching</button><div id="matchFeedback" class="feedback"></div></section>`}
function checkMatching(){let correct=0,total=5;data.sections.find(s=>s.id==='matching').pairs.forEach(p=>{const el=document.querySelector(`[data-match="${p.id}"]`);state.matching[p.id]=el.value;if(el.value===p.answer)correct++;});const fb=document.getElementById('matchFeedback');fb.textContent=correct===total?'✅ Perfect matching!':`You got ${correct} out of ${total}. Check the highlighted ideas and try again.`;fb.style.color=correct===total?'var(--green)':'var(--blue)';save();updateScore();}
function renderReflection(){document.getElementById('reflection').innerHTML=data.reflection.map(x=>`<button onclick="reflect(this,'${x.replace(/'/g,"\\'")}')">${x}</button>`).join('')}
function reflect(btn,val){document.querySelectorAll('.reflect-options button').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');state.reflection=val;save()}
function updateScore(){let total=30,score=0;Object.entries(state.answers).forEach(([id,i])=>{const q=findQ(+id);if(q&&q.answer===i)score++});const pairs=data.sections.find(s=>s.id==='matching').pairs;score+=pairs.filter(p=>state.matching[p.id]===p.answer).length;document.getElementById('scoreBox').value=`${score} / ${total}`;if(score>=total){showCompletion(score,total)}}
function showCompletion(score,total){const c=document.getElementById('completion');c.classList.remove('hidden');let pct=Math.round(score/total*100);let msg=pct>=90?'🌟 Excellent Work!':pct>=80?'⭐ Great Job!':pct>=70?'👍 Good Work!':'💪 Keep Practicing!';c.innerHTML=`<h2>🎉 Worksheet Complete!</h2><p>Great job, ${esc(document.getElementById('studentName').value||'Science Explorer')}!</p><div class="bigscore">${score}/${total}</div><h3>${pct}% — ${msg}</h3><p>Keep learning how your sense organs work together.</p>`}
function buildAnswerKey(){const list=[];data.sections.forEach(s=>{if(s.questions)s.questions.forEach(q=>list.push(`<li><b>${q.id}.</b> ${esc(q.choices[q.answer])}</li>`));if(s.id==='matching')s.pairs.forEach(p=>list.push(`<li><b>M${p.id-10}.</b> ${p.answer}</li>`))});document.getElementById('answerKey').innerHTML=`<h3>Answer Key</h3><ol>${list.join('')}</ol>`}
function save(){localStorage.setItem('teacherEdScience1SensesWorksheet',JSON.stringify({state,name:document.getElementById('studentName').value,grade:document.getElementById('gradeSection').value,date:document.getElementById('date').value}))}
function restore(){try{const x=JSON.parse(localStorage.getItem('teacherEdScience1SensesWorksheet'));if(!x)return;state=x.state||state;document.getElementById('studentName').value=x.name||'';document.getElementById('gradeSection').value=x.grade||'';document.getElementById('date').value=x.date||'';Object.entries(state.answers||{}).forEach(([id,i])=>choose(+id,i));Object.entries(state.matching||{}).forEach(([id,v])=>{const e=document.querySelector(`[data-match="${id}"]`);if(e)e.value=v});if(state.reflection){document.querySelectorAll('.reflect-options button').forEach(b=>{if(b.textContent===state.reflection)b.classList.add('selected')})}updateScore()}catch(e){console.warn(e)}}
function resetWorksheet(){localStorage.removeItem('teacherEdScience1SensesWorksheet');location.reload()}
document.getElementById('printBtn').onclick=()=>window.print();
document.getElementById('teacherBtn').onclick=()=>document.getElementById('teacherPanel').classList.remove('hidden');
document.getElementById('closeTeacher').onclick=()=>document.getElementById('teacherPanel').classList.add('hidden');
document.getElementById('showAnswers').onclick=()=>document.getElementById('answerKey').classList.remove('hidden');
document.getElementById('hideAnswers').onclick=()=>document.getElementById('answerKey').classList.add('hidden');
document.getElementById('resetBtn').onclick=resetWorksheet;
document.getElementById('printKey').onclick=()=>{document.getElementById('answerKey').classList.remove('hidden');window.print()};['studentName','gradeSection','date'].forEach(id=>document.getElementById(id).addEventListener('input',save));
loadData();

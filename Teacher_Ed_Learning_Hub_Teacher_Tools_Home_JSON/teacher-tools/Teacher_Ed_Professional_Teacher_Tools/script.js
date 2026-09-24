'use strict';

const state = {
  tools: [], questions: [], favorites: new Set(JSON.parse(localStorage.getItem('edjay_favorites') || '[]')),
  currentSetId: null, sound: localStorage.getItem('edjay_sound') !== 'off', reducedMotion: localStorage.getItem('edjay_motion') === 'reduced',
  gameTimer: null, game: null
};

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const esc = v => String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const uid = p => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;

async function loadData(){
  const [t,q] = await Promise.all([fetch('data/tools.json').then(r=>r.json()), fetch('data/questions.json').then(r=>r.json())]);
  state.tools=t; state.questions=q;
  if(state.reducedMotion) document.body.classList.add('reduced-motion');
  $('#year').textContent = new Date().getFullYear();
  buildCategories(); renderDashboard(); renderTools(); renderQuestionBank();
}

function buildCategories(){
  const cats=[...new Set(state.tools.map(t=>t.category))].sort();
  $('#categoryFilter').innerHTML='<option value="All">All Categories</option>'+cats.map(c=>`<option>${esc(c)}</option>`).join('');
}
function renderDashboard(){
  const sets=state.questions.length;
  $('#statGrid').innerHTML=[['54','Teacher Tools'],[state.tools.filter(t=>t.questions).length,'Question Games'],[sets,'Question Sets'],[state.favorites.size,'Favorites']].map(([n,l])=>`<div class="stat-card"><div class="num">${esc(n)}</div><div class="label">${esc(l)}</div></div>`).join('');
  const picks=state.tools.filter(t=>['rocket-race','target-toss','classroom-timer','attention-getter'].includes(t.id));
  $('#quickTools').innerHTML=picks.map(toolCard).join('');
}
function toolCard(t){
  const fav=state.favorites.has(t.id);
  return `<article class="tool-card">
    <div class="tool-icon">${t.icon}</div><h3>${esc(t.name)}</h3><p>${esc(t.description)}</p>
    <div class="tool-bottom"><span class="badge">${esc(t.category)}</span><div class="card-actions">
      <button class="card-gear" data-tool-customize="${t.id}" ${t.questions?'':'hidden'}>⚙ Customize</button>
      <button class="card-gear" data-fav="${t.id}" aria-label="${fav?'Remove':'Add'} favorite">${fav?'★':'☆'}</button>
      <button class="card-link" data-open-tool="${t.id}">Open Tool →</button>
    </div></div>
  </article>`;
}
function renderTools(){
  const q=($('#toolSearch').value||'').trim().toLowerCase(), cat=$('#categoryFilter').value, sub=$('#subjectFilter').value, grade=$('#gradeFilter').value;
  const filtered=state.tools.filter(t=>{
    const text=`${t.name} ${t.description} ${t.category}`.toLowerCase();
    return (!q||text.includes(q)) && (cat==='All'||t.category===cat) && (sub==='All'||t.subjects?.includes(sub)||!t.questions) && (grade==='All'||t.grades?.includes(grade)||!t.questions);
  });
  $('#toolGrid').innerHTML=filtered.length?filtered.map(toolCard).join(''):`<div class="empty-state" style="grid-column:1/-1;min-height:260px"><div>🔎</div><h3>No tools found</h3><p>Try a different search or filter.</p></div>`;
}
function renderFavorites(){
  const tools=state.tools.filter(t=>state.favorites.has(t.id));
  $('#favoriteGrid').innerHTML=tools.length?tools.map(toolCard).join(''):`<div class="empty-state" style="grid-column:1/-1"><div>☆</div><h3>No favorites yet</h3><p>Click ☆ on any tool to keep it close.</p></div>`;
}

function showView(name){
  $$('.view').forEach(v=>v.classList.remove('active'));
  $(`#${name}View`).classList.add('active');
  $$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
  if(name==='dashboard') renderDashboard(); if(name==='tools') renderTools(); if(name==='questions') renderQuestionBank(); if(name==='favorites') renderFavorites();
  window.scrollTo({top:0,behavior:state.reducedMotion?'auto':'smooth'});
}

function toast(message,type='success'){
  const el=document.createElement('div'); el.className=`toast ${type}`; el.textContent=message; $('#toastRoot').appendChild(el); setTimeout(()=>el.remove(),2600);
}
function modal(title,body,opts={}){
  const root=$('#modalRoot');
  root.innerHTML=`<div class="modal-backdrop" id="activeModal"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="modal-head"><div><span class="eyebrow">TEACHER ED</span><h2 id="modalTitle">${esc(title)}</h2></div><button class="modal-close" data-close-modal aria-label="Close">✕</button></div>${body}</div></div>`;
  $('#activeModal').addEventListener('click',e=>{if(e.target.id==='activeModal') closeModal()});
  if(opts.onOpen) opts.onOpen($('#activeModal'));
}
function closeModal(){ $('#modalRoot').innerHTML=''; clearInterval(state.gameTimer); state.gameTimer=null; }

function openTool(id){
  const t=state.tools.find(x=>x.id===id); if(!t)return;
  if(t.questions){openGameSetup(t);return;}
  const body=`<div class="game-shell"><div class="game-top"><div class="game-brand"><img src="assets/teacher-ed-logo.png" alt=""><strong>${esc(t.name)}</strong></div><button class="btn btn-ghost" data-close-modal>Close</button></div><div class="game-content"><div class="tool-icon" style="margin:0 auto">${t.icon}</div><h2>${esc(t.name)}</h2><p>${esc(t.description)}</p><div id="genericToolArea"></div><div style="margin-top:24px"><button class="btn btn-gold" id="runGeneric">Start Activity</button></div></div></div>`;
  modal(t.name,body,{onOpen:()=>setupGeneric(t)});
}
function setupGeneric(t){
  const area=$('#genericToolArea');
  const simple={
    'classroom-timer':`<div class="game-stats"><div><strong id="timerDisplay">05:00</strong>Timer</div></div>`,
    'attention-getter':`<div class="result-card"><div style="font-size:44px">🔔</div><h3>Ready, class?</h3><p>Click start for an attention signal.</p></div>`,
    'noise-meter':`<div class="progress-line"><span id="noiseBar" style="width:35%"></span></div><p id="noiseText">Classroom level: Ready</p>`,
    'classroom-status':`<div class="answer-grid"><button class="answer-btn" data-status="Ready">🟢 Ready</button><button class="answer-btn" data-status="Almost">🟡 Almost</button><button class="answer-btn" data-status="Reset">🔴 Reset</button></div>`,
    'emoji-checkin':`<div class="answer-grid"><button class="answer-btn">😀 Great</button><button class="answer-btn">🙂 Good</button><button class="answer-btn">😐 Okay</button><button class="answer-btn">😴 Tired</button></div>`,
    'mood-meter':`<div class="answer-grid"><button class="answer-btn">🌞 Energized</button><button class="answer-btn">🌤️ Calm</button><button class="answer-btn">🌧️ Need support</button><button class="answer-btn">🌈 Excited</button></div>`,
    'brain-break':`<div class="result-card"><h3 id="breakText">Ready for a quick reset?</h3><p>Examples: stretch, march in place, shoulder rolls, freeze pose.</p></div>`,
    'star-day':`<div class="result-card"><h3>🌟 Star of the Day</h3><input id="starName" placeholder="Enter student or team name"><div style="margin-top:12px"><button class="btn btn-gold" id="celebrateStar">Celebrate</button></div></div>`
  };
  area.innerHTML=simple[t.id]||`<div class="result-card"><h3>${esc(t.icon)} ${esc(t.name)}</h3><p>This classroom tool is ready for presentation. Use the controls below to run a quick activity.</p></div>`;
  const run=$('#runGeneric'); if(run)run.addEventListener('click',()=>{
    if(t.id==='classroom-timer'){startTimer(300);toast('Timer started.');return}
    if(t.id==='attention-getter'){playTone(880,.18); area.innerHTML='<div class="result-card"><div style="font-size:64px">🔔</div><h2>Eyes this way!</h2><p>Let’s get ready to learn.</p></div>';return}
    if(t.id==='noise-meter'){const n=Math.floor(20+Math.random()*75);$('#noiseBar').style.width=n+'%';$('#noiseText').textContent=`Classroom level: ${n<40?'Quiet':n<70?'Getting louder':'Too loud'}`;return}
    if(t.id==='brain-break'){const items=['Reach up high!','March in place!','Take three deep breaths!','Freeze like a statue!','Touch your shoulders!'];$('#breakText').textContent=items[Math.floor(Math.random()*items.length)];return}
    toast('Activity ready for the class.');
  });
  $$('#genericToolArea [data-status]').forEach(b=>b.addEventListener('click',()=>toast(`Classroom status: ${b.dataset.status}`)));
  $('#celebrateStar')?.addEventListener('click',()=>{const n=$('#starName').value.trim()||'our star';area.querySelector('.result-card').innerHTML=`<div style="font-size:60px">🏆</div><h2>${esc(n)}</h2><p>Fantastic effort today!</p>`;playTone(660,.15)});
}
function startTimer(seconds){clearInterval(state.gameTimer); const d=$('#timerDisplay'); if(!d)return; let left=seconds; const draw=()=>{const m=Math.floor(left/60),s=left%60;d.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`};draw();state.gameTimer=setInterval(()=>{left--;draw();if(left<=0){clearInterval(state.gameTimer);toast('Time is up!','error');playTone(440,.25)}},1000)}
function playTone(freq=660,duration=.12){if(!state.sound)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;o.type='sine';g.gain.value=.045;o.connect(g);g.connect(c.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+duration);o.stop(c.currentTime+duration);setTimeout(()=>c.close(),duration*1000+50)}catch(e){/* audio is optional */}}

function openGameSetup(tool){
  const sets=state.questions.map(q=>`<option value="${esc(q.id)}">${esc(q.title)} • ${esc(q.subject)} • ${esc(q.grade)}</option>`).join('');
  const body=`<form id="gameSetupForm"><div class="form-grid"><div class="field"><label>Question Set</label><select id="gameSet" required>${sets||'<option value="">No question sets yet</option>'}</select></div><div class="field"><label>Game Title</label><input id="gameTitleInput" value="${esc(tool.name)}"></div><div class="field"><label>Subject</label><select id="gameSubject"><option>Mathematics</option><option>Science</option><option>English</option><option>Filipino</option><option>Araling Panlipunan</option><option>EsP / GMRC</option><option>Computer</option><option>General</option></select></div><div class="field"><label>Grade</label><select id="gameGrade"><option>Kindergarten</option><option>Grade 1</option><option>Grade 2</option><option>Grade 3</option><option>Grade 4</option><option>Grade 5</option><option>Grade 6</option></select></div><div class="field"><label>Points per correct answer</label><input id="points" type="number" min="1" max="100" value="1"></div><div class="field"><label>Time per question (seconds)</label><input id="time" type="number" min="0" max="600" value="30"></div><div class="field full"><label>Options</label><div style="display:flex;gap:14px;flex-wrap:wrap"><label><input id="randomQ" type="checkbox"> Randomize questions</label><label><input id="randomC" type="checkbox"> Randomize choices</label><label><input id="showExp" type="checkbox" checked> Show explanations</label><label><input id="gameSound" type="checkbox" checked> Sound</label></div></div></div><div style="display:flex;justify-content:flex-end;gap:10px;margin-top:22px"><button type="button" class="btn btn-ghost" data-close-modal>Cancel</button><button type="submit" class="btn btn-gold">Start ${esc(tool.name)}</button></div></form><div style="margin-top:14px;text-align:right"><button class="text-btn" id="editSetFromGame">⚙ Edit Question Set</button></div></div></form>`;
  modal(`Customize ${tool.name}`,body,{onOpen:()=>{
    $('#editSetFromGame')?.addEventListener('click',()=>{closeModal();showView('questions');setTimeout(()=>selectSet($('#gameSet').value),0)});
    $('#gameSetupForm').addEventListener('submit',e=>{e.preventDefault();const set=state.questions.find(s=>s.id===$('#gameSet').value);if(!set||!set.questions.length){toast('Please create a question set first.','error');return}const cfg={title:$('#gameTitleInput').value.trim()||tool.name,points:+$('#points').value||1,time:+$('#time').value||0,randomQ:$('#randomQ').checked,randomC:$('#randomC').checked,showExp:$('#showExp').checked,sound:$('#gameSound').checked};closeModal();launchGame(tool,set,cfg)});
  }});
}

function launchGame(tool,set,cfg){
  let qs=JSON.parse(JSON.stringify(set.questions)); if(cfg.randomQ)qs.sort(()=>Math.random()-.5); state.game={tool,set,cfg,qs,index:0,score:0,correct:0};
  renderGameQuestion();
}
function renderGameQuestion(){
  const g=state.game;if(!g)return; clearInterval(state.gameTimer);
  if(g.index>=g.qs.length){renderGameResult();return}
  const q=g.qs[g.index];let choices=Array.isArray(q.choices)?[...q.choices]:[];if(g.cfg.randomC)choices.sort(()=>Math.random()-.5);
  const answers=q.type==='true-false'?['True','False']:choices;
  const body=`<div class="game-shell"><div class="game-top"><div class="game-brand"><img src="assets/teacher-ed-logo.png" alt=""><strong>${esc(g.cfg.title)}</strong></div><div><button class="btn btn-ghost" id="fullGame">⛶ Fullscreen</button> <button class="btn btn-ghost" data-close-modal>Exit</button></div></div><div class="progress-line"><span style="width:${(g.index/g.qs.length)*100}%"></span></div><div class="game-content"><div class="game-stats"><div><strong>${g.index+1}/${g.qs.length}</strong>Question</div><div><strong>${g.score}</strong>Score</div>${g.cfg.time?`<div><strong id="qTimer">${g.cfg.time}</strong>Seconds</div>`:''}</div><div class="game-question">${esc(q.question)}</div><div class="answer-grid" id="answers">${answers.map((a,i)=>`<button class="answer-btn" data-answer="${esc(a)}">${String.fromCharCode(65+i)}. ${esc(a)}</button>`).join('')}</div><div id="feedback" style="min-height:55px;margin-top:20px"></div></div></div>`;
  modal(g.tool.name,body,{onOpen:()=>{
    $('#fullGame').addEventListener('click',()=>document.querySelector('.modal')?.requestFullscreen?.().catch(()=>{}));
    $$('#answers .answer-btn').forEach(b=>b.addEventListener('click',()=>answerQuestion(q,b.dataset.answer)));
    if(g.cfg.time) startQuestionTimer(g.cfg.time,q);
  }});
}
function startQuestionTimer(seconds,q){let left=seconds;const d=$('#qTimer');state.gameTimer=setInterval(()=>{left--;if(d)d.textContent=left;if(left<=0){clearInterval(state.gameTimer);answerQuestion(q,'__TIMEOUT__')}},1000)}
function answerQuestion(q,answer){const g=state.game;if(!g)return;clearInterval(state.gameTimer);const correct=String(answer).trim().toLowerCase()===String(q.answer??'').trim().toLowerCase();if(correct){g.score+=g.cfg.points;g.correct++;playTone(880,.13)}else playTone(260,.16);$$('#answers .answer-btn').forEach(b=>{b.disabled=true;if(String(b.dataset.answer).toLowerCase()===String(q.answer).toLowerCase())b.classList.add('correct');if(b.dataset.answer===answer&&!correct)b.classList.add('wrong')});const f=$('#feedback');if(f)f.innerHTML=`<div class="result-card"><strong>${correct?'✓ Correct!':'✗ Nice try!'}</strong>${g.cfg.showExp&&q.explanation?`<div style="color:var(--muted);margin-top:6px">${esc(q.explanation)}</div>`:''}<div style="margin-top:12px"><button class="btn btn-gold" id="nextQ">${g.index===g.qs.length-1?'See Results':'Next Question →'}</button></div></div>`;$('#nextQ').addEventListener('click',()=>{g.index++;renderGameQuestion()})}
function renderGameResult(){const g=state.game;const pct=Math.round((g.correct/g.qs.length)*100);modal(`${g.cfg.title} • Complete`,`<div class="game-shell"><div class="game-content"><div style="font-size:70px">🎉</div><h2>Great job!</h2><div class="result-card"><div class="result-score">${pct}%</div><p>${g.correct} correct out of ${g.qs.length}</p><p>Score: <strong>${g.score}</strong></p></div><div style="display:flex;gap:10px;justify-content:center;margin-top:20px;flex-wrap:wrap"><button class="btn btn-gold" id="playAgain">Play Again</button><button class="btn btn-ghost" data-close-modal>Back to Tools</button></div></div></div>`,{onOpen:()=>$('#playAgain').addEventListener('click',()=>launchGame(g.tool,g.set,g.cfg))})}

function renderQuestionBank(){
  const list=$('#questionSetList');
  list.innerHTML=state.questions.length?state.questions.map(s=>`<div class="set-item ${s.id===state.currentSetId?'active':''}" data-set-id="${esc(s.id)}"><strong>${esc(s.title)}</strong><small>${esc(s.subject)} • ${esc(s.grade)} • ${s.questions.length} questions</small></div>`).join(''):`<div class="empty-state" style="min-height:200px"><div>📚</div><h3>No question sets</h3><p>Create your first reusable set.</p></div>`;
  $$('.set-item',list).forEach(i=>i.addEventListener('click',()=>selectSet(i.dataset.setId)));
  if(state.currentSetId&&!state.questions.some(s=>s.id===state.currentSetId))state.currentSetId=null;
  if(state.currentSetId)renderEditor();
}
function selectSet(id){state.currentSetId=id;renderQuestionBank();}
function renderEditor(){
  const set=state.questions.find(s=>s.id===state.currentSetId);if(!set)return;
  $('#questionEditor').innerHTML=`<div class="editor-head"><div><span class="eyebrow">REUSABLE QUESTION SET</span><h2>${esc(set.title)}</h2><div class="editor-meta">${esc(set.subject)} • ${esc(set.grade)} • ${esc(set.topic||'General')}</div></div><div class="editor-actions"><button class="btn btn-ghost" id="renameSet">Rename</button><button class="btn btn-ghost" id="exportSet">Export</button><button class="btn btn-gold" id="addQuestion">+ Add Question</button></div></div><div class="form-grid"><div class="field"><label>Title</label><input id="setTitle" value="${esc(set.title)}"></div><div class="field"><label>Topic</label><input id="setTopic" value="${esc(set.topic||'')}"></div><div class="field"><label>Subject</label><select id="setSubject">${['Mathematics','Science','English','Filipino','Araling Panlipunan','EsP / GMRC','Computer','General'].map(x=>`<option ${x===set.subject?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><label>Grade</label><select id="setGrade">${['Kindergarten','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6'].map(x=>`<option ${x===set.grade?'selected':''}>${x}</option>`).join('')}</select></div></div><div id="questionRows"></div><div style="display:flex;justify-content:space-between;gap:10px;margin-top:18px"><button class="btn btn-ghost" id="deleteSet">Delete Set</button><button class="btn btn-gold" id="saveSet">Save Changes</button></div>`;
  const rows=$('#questionRows'); rows.innerHTML=set.questions.map((q,i)=>questionRow(q,i)).join('');
  $$('.delete-q',rows).forEach(b=>b.addEventListener('click',()=>{set.questions.splice(+b.dataset.index,1);renderEditor();toast('Question deleted.')}));
  $$('.dup-q',rows).forEach(b=>b.addEventListener('click',()=>{const q=structuredClone(set.questions[+b.dataset.index]);q.id=uid('q');set.questions.splice(+b.dataset.index+1,0,q);renderEditor();toast('Question duplicated.')}));
  $('#addQuestion').addEventListener('click',()=>{set.questions.push({id:uid('q'),type:'multiple-choice',question:'New question',choices:['Option A','Option B','Option C','Option D'],answer:'Option A',explanation:''});renderEditor();toast('Question added.')});
  $('#saveSet').addEventListener('click',()=>{set.title=$('#setTitle').value.trim()||'Untitled Question Set';set.topic=$('#setTopic').value.trim();set.subject=$('#setSubject').value;set.grade=$('#setGrade').value;persistQuestions();renderQuestionBank();toast('Question set saved.')});
  $('#deleteSet').addEventListener('click',()=>{if(confirm('Delete this question set?')){state.questions=state.questions.filter(x=>x.id!==set.id);state.currentSetId=null;persistQuestions();renderQuestionBank();toast('Question set deleted.')}});
  $('#renameSet').addEventListener('click',()=>{const n=prompt('New question set name:',set.title);if(n?.trim()){set.title=n.trim();persistQuestions();renderQuestionBank();toast('Question set renamed.')}});
  $('#exportSet').addEventListener('click',()=>downloadJson(set,`${set.id}.json`));
}
function questionRow(q,i){return `<div class="question-row"><div class="question-row-top"><h4>Question ${i+1}</h4><div><button class="text-btn dup-q" data-index="${i}">Duplicate</button> <button class="text-btn delete-q" data-index="${i}">Delete</button></div></div><div class="form-grid"><div class="field full"><label>Question</label><textarea data-q="${i}" data-field="question" rows="3">${esc(q.question)}</textarea></div><div class="field"><label>Type</label><select data-q="${i}" data-field="type"><option value="multiple-choice" ${q.type==='multiple-choice'?'selected':''}>Multiple Choice</option><option value="true-false" ${q.type==='true-false'?'selected':''}>True / False</option><option value="short-answer" ${q.type==='short-answer'?'selected':''}>Short Answer</option></select></div><div class="field"><label>Correct Answer</label><input data-q="${i}" data-field="answer" value="${esc(q.answer)}"></div><div class="field full"><label>Choices (one per line)</label><textarea data-q="${i}" data-field="choices" rows="4">${esc((q.choices||[]).join('\n'))}</textarea></div><div class="field full"><label>Explanation / Feedback</label><textarea data-q="${i}" data-field="explanation" rows="2">${esc(q.explanation||'')}</textarea></div></div></div>`}
function persistQuestions(){localStorage.setItem('edjay_questions',JSON.stringify(state.questions));}
function hydrateQuestions(){try{const raw=localStorage.getItem('edjay_questions');if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed))state.questions=parsed}}catch(e){toast('Saved question data could not be restored.','error')}}
function newQuestionSet(){const id=uid('set');state.questions.push({id,title:'New Question Set',subject:'General',grade:'Grade 1',topic:'',questions:[{id:uid('q'),type:'multiple-choice',question:'Type your question here.',choices:['Option A','Option B','Option C','Option D'],answer:'Option A',explanation:''}]});state.currentSetId=id;persistQuestions();showView('questions');renderQuestionBank();toast('New question set created.')}
function downloadJson(data,name){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);toast('JSON exported.')}
function importQuestions(){const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.onchange=()=>{const f=input.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const data=JSON.parse(r.result);const sets=Array.isArray(data)?data:(data.questions&&Array.isArray(data.questions)?[data]:null);if(!sets)throw new Error('Expected a question set or array.');sets.forEach(s=>{if(!s.title||!Array.isArray(s.questions))throw new Error('A question set is missing title or questions.');s.id=uid('set');s.questions=s.questions.map(q=>({...q,id:uid('q'),question:q.question||'Untitled question',choices:Array.isArray(q.choices)?q.choices:[],answer:q.answer??'',explanation:q.explanation||''}));state.questions.push(s)});persistQuestions();renderQuestionBank();renderDashboard();toast('Question set imported.')}catch(e){toast(`Unable to import: ${e.message}`,'error')}};r.readAsText(f)};input.click()}

function bind(){
  $$('.nav-btn').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
  document.addEventListener('click',e=>{
    const open=e.target.closest('[data-open-tool]');if(open){openTool(open.dataset.openTool);return}
    const fav=e.target.closest('[data-fav]');if(fav){const id=fav.dataset.fav;if(state.favorites.has(id))state.favorites.delete(id);else state.favorites.add(id);localStorage.setItem('edjay_favorites',JSON.stringify([...state.favorites]));renderDashboard();renderTools();renderFavorites();toast(state.favorites.has(id)?'Added to favorites.':'Removed from favorites.');return}
    const custom=e.target.closest('[data-tool-customize]');if(custom){const t=state.tools.find(x=>x.id===custom.dataset.toolCustomize);if(t)openGameSetup(t);return}
    if(e.target.closest('[data-close-modal]'))closeModal();
    const action=e.target.closest('[data-action]')?.dataset.action;if(action==='open-tools')showView('tools');if(action==='new-question-set')newQuestionSet();
  });
  $('#toolSearch').addEventListener('input',renderTools);$('#categoryFilter').addEventListener('change',renderTools);$('#subjectFilter').addEventListener('change',renderTools);$('#gradeFilter').addEventListener('change',renderTools);
  $('#soundToggle').addEventListener('click',()=>{state.sound=!state.sound;localStorage.setItem('edjay_sound',state.sound?'on':'off');$('#soundToggle').textContent=state.sound?'🔊':'🔇';toast(`Sound ${state.sound?'on':'off'}.`)});
  $('#motionToggle').addEventListener('click',()=>{state.reducedMotion=!state.reducedMotion;document.body.classList.toggle('reduced-motion',state.reducedMotion);localStorage.setItem('edjay_motion',state.reducedMotion?'reduced':'full');toast(`Reduced motion ${state.reducedMotion?'on':'off'}.`)});
  $('#settingsBtn').addEventListener('click',()=>modal('Settings',`<div class="result-card"><h3>Teacher Ed Preferences</h3><p>Sound and reduced-motion settings are saved automatically on this device.</p><div style="display:flex;gap:10px;margin-top:15px;flex-wrap:wrap"><button class="btn btn-gold" id="importBtn">Import Question JSON</button><button class="btn btn-ghost" id="exportAllBtn">Export All Questions</button><button class="btn btn-ghost" id="resetData">Reset Saved Questions</button></div></div>`,{onOpen:()=>{$('#importBtn').addEventListener('click',()=>{closeModal();importQuestions()});$('#exportAllBtn').addEventListener('click',()=>downloadJson(state.questions,'teacher-ed-question-bank.json'));$('#resetData').addEventListener('click',()=>{if(confirm('Reset all saved question sets?')){localStorage.removeItem('edjay_questions');location.reload()}})}}));
  document.addEventListener('input',e=>{const el=e.target;if(!el.dataset.q||!state.currentSetId)return;const set=state.questions.find(s=>s.id===state.currentSetId),q=set?.questions[+el.dataset.q];if(!q)return;const f=el.dataset.field;if(f==='choices')q.choices=el.value.split(/\n/).map(x=>x.trim()).filter(Boolean);else q[f]=el.value});
  document.addEventListener('change',e=>{const el=e.target;if(!el.dataset.q||!state.currentSetId)return;const set=state.questions.find(s=>s.id===state.currentSetId),q=set?.questions[+el.dataset.q];if(q)q[el.dataset.field]=el.value});
}

async function init(){
  try{await loadData();hydrateQuestions();renderDashboard();renderQuestionBank();bind();$('#soundToggle').textContent=state.sound?'🔊':'🔇';}
  catch(e){console.error(e);document.body.innerHTML='<div style="padding:40px;color:white;font-family:system-ui"><h1>Teacher Ed Tools could not load</h1><p>Please make sure the project is being served from a web server and the data files are present.</p></div>'}
}
init();

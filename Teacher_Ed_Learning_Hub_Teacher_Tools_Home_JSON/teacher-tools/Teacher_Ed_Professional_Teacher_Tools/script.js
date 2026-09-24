'use strict';

/*
  Teacher Ed Professional Teacher Tools
  Content is separated from tool mechanics so every question game can
  be reused across subjects, grades, and topics.
*/

const SUBJECTS = ['Mathematics','Science','English','Filipino','Araling Panlipunan','EsP / GMRC','Computer','General'];
const GRADES = ['Kindergarten','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6'];
const STORAGE = {
  questions: 'edjay_questions_v3',
  favorites: 'edjay_favorites_v3',
  sound: 'edjay_sound_v3',
  motion: 'edjay_motion_v3',
  recent: 'edjay_recent_v3',
  names: 'edjay_students_v3',
  schedule: 'edjay_schedule_v3',
  points: 'edjay_points_v3'
};

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
const clone = obj => JSON.parse(JSON.stringify(obj));
const shuffle = arr => { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const clamp = (n,min,max) => Math.max(min,Math.min(max,n));

const state = {
  tools: [],
  questions: [],
  favorites: new Set(loadJson(STORAGE.favorites, [])),
  currentSetId: null,
  sound: localStorage.getItem(STORAGE.sound) !== 'off',
  reducedMotion: localStorage.getItem(STORAGE.motion) === 'reduced',
  students: loadJson(STORAGE.names, []),
  schedule: loadJson(STORAGE.schedule, [
    {id:uid('item'),time:'08:00',title:'Morning Meeting'},
    {id:uid('item'),time:'09:00',title:'Lesson Time'},
    {id:uid('item'),time:'10:00',title:'Practice'},
    {id:uid('item'),time:'11:00',title:'Break'}
  ]),
  points: loadJson(STORAGE.points, {}),
  recent: loadJson(STORAGE.recent, []),
  gameTimer: null,
  game: null,
  modalCleanup: null
};

function loadJson(key, fallback){
  try{ const raw=localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }catch(e){ return fallback; }
}
function saveJson(key,value){
  try{localStorage.setItem(key,JSON.stringify(value));return true;}catch(e){toast('Your browser could not save this change.','error');return false;}
}
function normalizeQuestion(q,index=0){
  const type=q?.type || 'multiple-choice';
  const choices=Array.isArray(q?.choices)?q.choices.map(String).filter(Boolean):[];
  return {
    id:q?.id || uid(`q${index}`), type, question:String(q?.question || 'Untitled question'),
    choices, answer:String(q?.answer ?? ''), explanation:String(q?.explanation || ''),
    image:q?.image ? String(q.image) : '', acceptedAnswers:Array.isArray(q?.acceptedAnswers)?q.acceptedAnswers.map(String):[]
  };
}
function normalizeSet(set,index=0){
  return {
    id:set?.id || uid(`set${index}`), title:String(set?.title || `Question Set ${index+1}`),
    subject:String(set?.subject || 'General'), grade:String(set?.grade || 'Grade 1'), topic:String(set?.topic || ''),
    questions:Array.isArray(set?.questions)?set.questions.map(normalizeQuestion):[]
  };
}

async function loadData(){
  const responses=await Promise.all([
    fetch('data/tools.json').then(r=>{if(!r.ok)throw new Error('tools.json could not be loaded');return r.json();}),
    fetch('data/questions.json').then(r=>{if(!r.ok)throw new Error('questions.json could not be loaded');return r.json();})
  ]);
  state.tools=responses[0];
  const bundled=Array.isArray(responses[1])?responses[1]:[];
  const saved=loadJson(STORAGE.questions,null);
  state.questions=Array.isArray(saved)?saved.map(normalizeSet):bundled.map(normalizeSet);
  document.body.classList.toggle('reduced-motion',state.reducedMotion);
  $('#year').textContent=new Date().getFullYear();
  buildCategories();
  renderAll();
}
function buildCategories(){
  const cats=[...new Set(state.tools.map(t=>t.category))].sort();
  $('#categoryFilter').innerHTML='<option value="All">All Categories</option>'+cats.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
}
function renderAll(){renderDashboard();renderTools();renderQuestionBank();renderFavorites();}

function renderDashboard(){
  const questionGames=state.tools.filter(t=>t.questions).length;
  $('#statGrid').innerHTML=[
    [state.tools.length,'Teacher Tools'],[questionGames,'Question Games'],[state.questions.length,'Question Sets'],[state.favorites.size,'Favorites']
  ].map(([n,l])=>`<div class="stat-card"><div class="num">${esc(n)}</div><div class="label">${esc(l)}</div></div>`).join('');
  const picks=['rocket-race','target-toss','classroom-timer','attention-getter'].map(id=>state.tools.find(t=>t.id===id)).filter(Boolean);
  $('#quickTools').innerHTML=picks.map(toolCard).join('');
}
function toolCard(t){
  const fav=state.favorites.has(t.id);
  return `<article class="tool-card">
    <div class="tool-icon">${esc(t.icon)}</div><h3>${esc(t.name)}</h3><p>${esc(t.description)}</p>
    <div class="tool-bottom"><span class="badge">${esc(t.category)}</span><div class="card-actions">
      ${t.questions?`<button class="card-gear" data-tool-customize="${esc(t.id)}">⚙ Customize</button>`:''}
      <button class="card-gear" data-fav="${esc(t.id)}" aria-label="${fav?'Remove':'Add'} favorite">${fav?'★':'☆'}</button>
      <button class="card-link" data-open-tool="${esc(t.id)}">Open Tool →</button>
    </div></div>
  </article>`;
}
function renderTools(){
  const q=($('#toolSearch').value||'').trim().toLowerCase();
  const cat=$('#categoryFilter').value, sub=$('#subjectFilter').value, grade=$('#gradeFilter').value;
  const filtered=state.tools.filter(t=>{
    const text=`${t.name} ${t.description} ${t.category} ${(t.subjects||[]).join(' ')}`.toLowerCase();
    const subjectOk=sub==='All'||!t.questions||!t.subjects||t.subjects.includes('All')||t.subjects.includes(sub);
    const gradeOk=grade==='All'||!t.questions||!t.grades||t.grades.includes('All')||t.grades.includes(grade);
    return (!q||text.includes(q))&&(cat==='All'||t.category===cat)&&subjectOk&&gradeOk;
  });
  $('#toolGrid').innerHTML=filtered.length?filtered.map(toolCard).join(''):`<div class="empty-state" style="grid-column:1/-1;min-height:260px"><div>🔎</div><h3>No tools found</h3><p>Try a different search or filter.</p></div>`;
}
function renderFavorites(){
  const tools=state.tools.filter(t=>state.favorites.has(t.id));
  $('#favoriteGrid').innerHTML=tools.length?tools.map(toolCard).join(''):`<div class="empty-state" style="grid-column:1/-1"><div>☆</div><h3>No favorites yet</h3><p>Click ☆ on any tool to keep it close.</p></div>`;
}
function showView(name){
  $$('.view').forEach(v=>v.classList.remove('active'));
  const target=$(`#${name}View`); if(target)target.classList.add('active');
  $$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
  if(name==='dashboard')renderDashboard();
  if(name==='tools')renderTools();
  if(name==='questions')renderQuestionBank();
  if(name==='favorites')renderFavorites();
  window.scrollTo({top:0,behavior:state.reducedMotion?'auto':'smooth'});
}

function toast(message,type='success'){
  const root=$('#toastRoot'); if(!root)return;
  const el=document.createElement('div');el.className=`toast ${type}`;el.textContent=message;root.appendChild(el);setTimeout(()=>el.remove(),2800);
}
function modal(title,body,{onOpen}={}){
  clearGameTimer();
  if(state.modalCleanup){try{state.modalCleanup();}catch(e){}state.modalCleanup=null;}
  $('#modalRoot').innerHTML=`<div class="modal-backdrop" id="activeModal"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="modal-head"><div><span class="eyebrow">TEACHER ED</span><h2 id="modalTitle">${esc(title)}</h2></div><button class="modal-close" data-close-modal aria-label="Close">✕</button></div>${body}</div></div>`;
  $('#activeModal').addEventListener('click',e=>{if(e.target.id==='activeModal')closeModal();});
  if(onOpen)onOpen($('#activeModal'));
}
function closeModal(){clearGameTimer();if(state.modalCleanup){try{state.modalCleanup();}catch(e){}state.modalCleanup=null;}$('#modalRoot').innerHTML='';state.game=null;}
function clearGameTimer(){if(state.gameTimer){clearInterval(state.gameTimer);state.gameTimer=null;}}
function playTone(freq=660,duration=.12){
  if(!state.sound)return;
  try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;o.type='sine';g.gain.value=.045;o.connect(g);g.connect(c.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+duration);o.stop(c.currentTime+duration);setTimeout(()=>c.close(),duration*1000+50);}catch(e){}
}
function markRecent(id){state.recent=[id,...state.recent.filter(x=>x!==id)].slice(0,8);saveJson(STORAGE.recent,state.recent);}

function openTool(id){
  const tool=state.tools.find(t=>t.id===id);if(!tool){toast('Tool not found.','error');return;}
  markRecent(id);
  if(tool.questions){openGameSetup(tool);return;}
  openFunctionalTool(tool);
}
function openFunctionalTool(tool){
  const body=`<div class="game-shell"><div class="game-top"><div class="game-brand"><img src="assets/teacher-ed-logo.png" alt="Teacher Ed"><strong>${esc(tool.name)}</strong></div><div><button class="btn btn-ghost" id="toolFullscreen">⛶ Present</button> <button class="btn btn-ghost" data-close-modal>Close</button></div></div><div id="functionalArea" class="game-content"></div></div>`;
  modal(tool.name,body,{onOpen:()=>{
    $('#toolFullscreen').addEventListener('click',toggleFullscreen);
    renderFunctionalTool(tool);
  }});
}

function renderFunctionalTool(tool){
  const area=$('#functionalArea');
  const renderers={
    'student-participation':renderStudentPicker,
    'random-student':renderStudentPicker,
    'group-maker':renderGroupMaker,
    'random-group':renderGroupMaker,
    'volunteer-picker':renderVolunteerPicker,
    'seat-picker':renderSeatPicker,
    'classroom-status':renderClassroomStatus,
    'quiet-challenge':renderQuietChallenge,
    'eyes-on-me':renderEyesOnMe,
    'class-points':renderClassPoints,
    'classroom-timer':renderTimerTool,
    'transition-timer':renderTimerTool,
    'think-time':renderTimerTool,
    'work-timer':renderTimerTool,
    'countdown':renderCountdown,
    'daily-schedule':renderDailySchedule,
    'activity-clock':renderActivityClock,
    'transition-bell':renderTransitionBell,
    'attention-getter':renderAttentionGetter,
    'noise-meter':renderNoiseMeter,
    'focus-challenge':renderFocusChallenge,
    'clap-pattern':renderClapPattern,
    'call-response':renderCallResponse,
    'listen-react':renderListenReact,
    'brain-break':renderBrainBreak,
    'movement-break':renderMovementBreak,
    'freeze':renderFreeze,
    'music-break':renderMusicBreak,
    'emoji-checkin':renderEmojiCheckin,
    'mood-meter':renderMoodMeter,
    'star-day':renderStarDay,
    'kindness':renderKindness,
    'achievement':renderAchievement,
    'celebration':renderCelebration
  };
  const fn=renderers[tool.id]||renderGenericTool;
  fn(area,tool);
}

function saveStudents(){saveJson(STORAGE.names,state.students);}
function studentInputBlock(){
  return `<div class="result-card"><h3>Class List</h3><p>Add student names separated by commas or one per line.</p><textarea id="studentNames" rows="5" placeholder="Ana\nBen\nCarlos"></textarea><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:12px"><button class="btn btn-gold" id="saveStudents">Save Class List</button><button class="btn btn-ghost" id="clearStudents">Clear</button></div><p id="studentCount" style="margin-top:10px;color:var(--muted)"></p></div>`;
}
function bindStudentList(after){
  const ta=$('#studentNames');if(ta){ta.value=state.students.join('\n');}
  $('#saveStudents')?.addEventListener('click',()=>{state.students=(($('#studentNames').value||'').split(/[\n,]+/).map(s=>s.trim()).filter(Boolean));saveStudents();toast(`${state.students.length} students saved.`);after?.();});
  $('#clearStudents')?.addEventListener('click',()=>{state.students=[];saveStudents();$('#studentNames').value='';after?.();});
  updateStudentCount();
}
function updateStudentCount(){const el=$('#studentCount');if(el)el.textContent=`${state.students.length} student${state.students.length===1?'':'s'} in class list.`;}
function renderStudentPicker(area,tool){
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">${esc(tool.icon)}</div><h2>${esc(tool.name)}</h2><p>Pick fairly from your saved class list.</p>${studentInputBlock()}<div class="result-card" style="margin-top:14px"><div id="pickerResult" class="big-display">—</div><button class="btn btn-gold" id="pickStudent">🎲 Pick Student</button></div></div>`;
  bindStudentList();
  $('#pickStudent').addEventListener('click',()=>{if(!state.students.length){toast('Add students first.','error');return;}const name=state.students[Math.floor(Math.random()*state.students.length)];$('#pickerResult').textContent=name;playTone(880,.15);});
}
function renderVolunteerPicker(area,tool){
  renderStudentPicker(area,tool); $('#pickerResult').insertAdjacentHTML('afterend','<p class="hint">Use the same class list, then invite the selected learner to volunteer.</p>');
}
function renderGroupMaker(area,tool){
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">${esc(tool.icon)}</div><h2>${esc(tool.name)}</h2>${studentInputBlock()}<div class="form-grid"><div class="field"><label>Number of groups</label><input id="groupCount" type="number" min="2" max="12" value="4"></div><div class="field"><label>Group naming</label><select id="groupNaming"><option>Team 1, Team 2…</option><option>Colors</option><option>Animals</option></select></div></div><button class="btn btn-gold" id="makeGroups" style="margin-top:16px">Create Groups</button><div id="groupsResult" class="groups-grid" style="margin-top:18px"></div></div>`;
  bindStudentList();
  $('#makeGroups').addEventListener('click',()=>{const count=clamp(parseInt($('#groupCount').value,10)||2,2,12);if(state.students.length<count){toast('Add at least as many students as groups.','error');return;}const names=shuffle(state.students);const labels=['Team','Red','Blue','Green','Yellow','Orange','Purple','Pink','Lions','Tigers','Eagles','Sharks'];const groups=Array.from({length:count},(_,i)=>({name:$('#groupNaming').value==='Colors'?['Red','Blue','Green','Yellow','Orange','Purple','Pink','Teal','Gold','Silver','Coral','Violet'][i]:`Team ${i+1}`,members:[]}));names.forEach((n,i)=>groups[i%count].members.push(n));$('#groupsResult').innerHTML=groups.map(g=>`<div class="result-card"><h3>${esc(g.name)}</h3><ul>${g.members.map(m=>`<li>${esc(m)}</li>`).join('')}</ul></div>`).join('');});
}
function renderSeatPicker(area,tool){
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">${esc(tool.icon)}</div><h2>${esc(tool.name)}</h2><div class="form-grid"><div class="field"><label>Number of seats</label><input id="seatCount" type="number" min="1" max="100" value="30"></div><div class="field"><label>Selection mode</label><select id="seatMode"><option>Random Seat</option><option>Random Row</option></select></div></div><div class="result-card" style="margin-top:16px"><div id="seatResult" class="big-display">—</div><button class="btn btn-gold" id="pickSeat">Pick Seat</button></div></div>`;
  $('#pickSeat').addEventListener('click',()=>{const n=clamp(parseInt($('#seatCount').value,10)||30,1,100);$('#seatResult').textContent=$('#seatMode').value==='Random Row'?`Row ${Math.floor(Math.random()*Math.ceil(n/5))+1}`:`Seat ${Math.floor(Math.random()*n)+1}`;playTone(760,.12);});
}
function renderClassroomStatus(area){
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">🚦</div><h2>Classroom Status</h2><p id="statusMessage">Choose the current classroom status.</p><div class="status-grid"><button class="status-card ready" data-status="READY">🟢<strong>READY</strong><span>We can begin.</span></button><button class="status-card almost" data-status="ALMOST READY">🟡<strong>ALMOST READY</strong><span>Finish getting ready.</span></button><button class="status-card reset" data-status="RESET & FOCUS">🔴<strong>RESET & FOCUS</strong><span>Pause and listen.</span></button></div></div>`;
  $$('.status-card',area).forEach(b=>b.addEventListener('click',()=>{$('#statusMessage').textContent=b.dataset.status;playTone(b.classList.contains('ready')?880:440,.12);}));
}
function renderQuietChallenge(area){
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">🤫</div><h2>Quiet Challenge</h2><div class="form-grid"><div class="field"><label>Challenge time (seconds)</label><input id="quietSeconds" type="number" min="5" max="3600" value="60"></div><div class="field"><label>Success message</label><input id="quietMessage" value="Can we stay focused until the timer ends?"></div></div><div class="big-display" id="quietDisplay">01:00</div><div><button class="btn btn-gold" id="quietStart">Start Challenge</button> <button class="btn btn-ghost" id="quietReset">Reset</button></div><p id="quietStatus" class="hint"></p></div>`;
  $('#quietStart').addEventListener('click',()=>startLocalTimer(parseInt($('#quietSeconds').value,10)||60,$('#quietDisplay'),()=>{$('#quietStatus').textContent=$('#quietMessage').value;playTone(880,.25);toast('Quiet challenge complete!');}));
  $('#quietReset').addEventListener('click',()=>{clearGameTimer();$('#quietDisplay').textContent=formatTime(parseInt($('#quietSeconds').value,10)||60);$('#quietStatus').textContent='';});
}
function renderEyesOnMe(area){
  area.innerHTML=`<div class="tool-stage signal-stage"><div class="signal-icon" id="signalIcon">👀</div><h2 id="signalTitle">Eyes on Me</h2><p id="signalText">Press the signal to bring the class back together.</p><button class="btn btn-gold" id="signalBtn">🔔 Get Attention</button><div class="signal-presets"><button class="btn btn-ghost" data-signal="Eyes on me in 3… 2… 1…">Countdown</button><button class="btn btn-ghost" data-signal="Clap once if you can hear me!">Clap Cue</button><button class="btn btn-ghost" data-signal="Show me listening eyes and ready hands.">Ready Cue</button></div></div>`;
  $('#signalBtn').addEventListener('click',()=>{const title=$('#signalTitle');title.textContent='👀 EYES THIS WAY!';$('#signalText').textContent='Thank you. We are ready to learn.';playTone(990,.2);});
  $$('.signal-presets button',area).forEach(b=>b.addEventListener('click',()=>{$('#signalText').textContent=b.dataset.signal;playTone(700,.1);}));
}
function renderClassPoints(area){
  const teams=['Team A','Team B','Team C','Team D'];
  teams.forEach(t=>{if(state.points[t]==null)state.points[t]=0;});saveJson(STORAGE.points,state.points);
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">⭐</div><h2>Class Points</h2><div class="points-grid">${teams.map(t=>`<div class="result-card team-score"><h3>${t}</h3><div class="big-display" id="score-${t.replace(/\s/g,'')}" >${state.points[t]}</div><div><button class="btn btn-gold" data-point="${t}" data-delta="1">+1</button><button class="btn btn-ghost" data-point="${t}" data-delta="5">+5</button><button class="btn btn-ghost" data-point="${t}" data-delta="-1">−1</button></div></div>`).join('')}</div><button class="btn btn-ghost" id="resetPoints" style="margin-top:16px">Reset Points</button></div>`;
  $$('[data-point]',area).forEach(b=>b.addEventListener('click',()=>{const t=b.dataset.point;state.points[t]=Math.max(0,(state.points[t]||0)+parseInt(b.dataset.delta,10));saveJson(STORAGE.points,state.points);$(`#score-${t.replace(/\s/g,'')}`).textContent=state.points[t];playTone(760,.08);}));
  $('#resetPoints').addEventListener('click',()=>{teams.forEach(t=>state.points[t]=0);saveJson(STORAGE.points,state.points);teams.forEach(t=>$(`#score-${t.replace(/\s/g,'')}`).textContent='0');});
}

function renderTimerTool(area,tool){
  const defaults={'classroom-timer':300,'transition-timer':60,'think-time':30,'work-timer':600};
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">${esc(tool.icon)}</div><h2>${esc(tool.name)}</h2><div class="form-grid"><div class="field"><label>Minutes</label><input id="timerMin" type="number" min="0" max="180" value="${Math.floor((defaults[tool.id]||60)/60)}"></div><div class="field"><label>Seconds</label><input id="timerSec" type="number" min="0" max="59" value="${(defaults[tool.id]||60)%60}"></div></div><div class="big-display" id="timerDisplay">${formatTime(defaults[tool.id]||60)}</div><div><button class="btn btn-gold" id="timerStart">▶ Start</button><button class="btn btn-ghost" id="timerPause">⏸ Pause</button><button class="btn btn-ghost" id="timerReset">↻ Reset</button></div></div>`;
  const getSec=()=>Math.max(1,(parseInt($('#timerMin').value,10)||0)*60+(parseInt($('#timerSec').value,10)||0));
  $('#timerStart').addEventListener('click',()=>startLocalTimer(getSec(),$('#timerDisplay'),()=>{playTone(880,.3);toast('Time is up!','error');}));
  $('#timerPause').addEventListener('click',()=>clearGameTimer());
  $('#timerReset').addEventListener('click',()=>{clearGameTimer();$('#timerDisplay').textContent=formatTime(getSec());});
}
function renderCountdown(area){
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">🏁</div><h2>Countdown Challenge</h2><div class="field"><label>Countdown seconds</label><input id="countdownSeconds" type="number" min="3" max="60" value="10"></div><div class="big-display" id="countdownDisplay">10</div><button class="btn btn-gold" id="startCountdown">Start Countdown</button><p id="countdownDone" class="hint"></p></div>`;
  $('#startCountdown').addEventListener('click',()=>{clearGameTimer();let n=clamp(parseInt($('#countdownSeconds').value,10)||10,3,60);$('#countdownDisplay').textContent=n;state.gameTimer=setInterval(()=>{n--;$('#countdownDisplay').textContent=n;if(n<=0){clearGameTimer();$('#countdownDone').textContent='🚀 GO!';playTone(1000,.3);}},1000);});
}
function renderDailySchedule(area){
  const draw=()=>{$('#scheduleList').innerHTML=state.schedule.sort((a,b)=>a.time.localeCompare(b.time)).map((x,i)=>`<div class="schedule-row"><strong>${esc(x.time)}</strong><span>${esc(x.title)}</span><button class="text-btn" data-del-schedule="${esc(x.id)}">Delete</button></div>`).join('');};
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">📅</div><h2>Daily Schedule</h2><div class="form-grid"><div class="field"><label>Time</label><input id="schedTime" type="time" value="09:00"></div><div class="field"><label>Activity</label><input id="schedTitle" value="New Activity"></div></div><button class="btn btn-gold" id="addSchedule" style="margin-top:12px">+ Add Activity</button><div id="scheduleList" class="schedule-list" style="margin-top:18px"></div></div>`;
  draw();
  $('#addSchedule').addEventListener('click',()=>{state.schedule.push({id:uid('item'),time:$('#schedTime').value||'09:00',title:$('#schedTitle').value.trim()||'Activity'});saveJson(STORAGE.schedule,state.schedule);draw();});
  area.addEventListener('click',e=>{const b=e.target.closest('[data-del-schedule]');if(!b)return;state.schedule=state.schedule.filter(x=>x.id!==b.dataset.delSchedule);saveJson(STORAGE.schedule,state.schedule);draw();});
}
function renderActivityClock(area){
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">🕘</div><h2>Activity Clock</h2><p>Set a start time and duration to see when the activity ends.</p><div class="form-grid"><div class="field"><label>Start time</label><input id="clockStart" type="time" value="09:00"></div><div class="field"><label>Duration (minutes)</label><input id="clockDuration" type="number" min="1" max="600" value="30"></div></div><button class="btn btn-gold" id="calcClock" style="margin-top:14px">Calculate End Time</button><div id="clockResult" class="result-card" style="margin-top:16px">Choose your activity time.</div></div>`;
  $('#calcClock').addEventListener('click',()=>{const [h,m]=($('#clockStart').value||'09:00').split(':').map(Number);const d=parseInt($('#clockDuration').value,10)||30;const date=new Date();date.setHours(h,m,0,0);date.setMinutes(date.getMinutes()+d);$('#clockResult').innerHTML=`<h3>Activity ends at</h3><div class="big-display">${date.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>`;});
}
function renderTransitionBell(area){
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">🔔</div><h2>Transition Bell</h2><p>Use a visual bell cue when it is time to transition.</p><div class="big-display" id="bellDisplay">🔔</div><button class="btn btn-gold" id="ringBell">Ring Bell</button><div class="signal-presets"><button class="btn btn-ghost" data-bell="Pack Up">Pack Up</button><button class="btn btn-ghost" data-bell="Switch Stations">Switch Stations</button><button class="btn btn-ghost" data-bell="Come Back Together">Come Back Together</button></div></div>`;
  $('#ringBell').addEventListener('click',()=>{bellPulse('🔔');playTone(900,.3);});
  $$('.signal-presets button',area).forEach(b=>b.addEventListener('click',()=>{bellPulse('🔔');toast(b.dataset.bell);playTone(900,.25);}));
}
function bellPulse(icon){const d=$('#bellDisplay');if(!d)return;d.textContent=icon;d.classList.remove('pulse-once');void d.offsetWidth;d.classList.add('pulse-once');}
function renderAttentionGetter(area){
  const cues=['🔔 Eyes on me!','👏 Clap twice if you can hear me!','👀 Looking and listening!','🙋 Show me ready hands!','📣 Teacher says: freeze and focus!'];
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">🔔</div><h2>Attention Getter</h2><div class="big-display" id="attentionCue">Ready?</div><button class="btn btn-gold" id="attentionRun">Random Cue</button><div class="signal-presets">${cues.map(c=>`<button class="btn btn-ghost" data-cue="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>`;
  $('#attentionRun').addEventListener('click',()=>{$('#attentionCue').textContent=cues[Math.floor(Math.random()*cues.length)];playTone(900,.2);});
  $$('.signal-presets button',area).forEach(b=>b.addEventListener('click',()=>{$('#attentionCue').textContent=b.dataset.cue;playTone(900,.15);}));
}
function renderNoiseMeter(area){
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">🔊</div><h2>Noise Meter</h2><p>Use the controls to model the classroom sound level.</p><div class="noise-gauge"><div id="noiseFill"></div></div><div class="big-display" id="noiseLabel">Quiet</div><div class="noise-controls"><button class="btn btn-ghost" data-noise="15">🤫 Quiet</button><button class="btn btn-gold" data-noise="50">🗣️ Talking</button><button class="btn btn-ghost" data-noise="85">🔊 Loud</button><button class="btn btn-ghost" data-noise="100">🚨 Too Loud</button></div></div>`;
  $$('.noise-controls button',area).forEach(b=>b.addEventListener('click',()=>setNoise(Number(b.dataset.noise))));
  setNoise(15);
}
function setNoise(n){const fill=$('#noiseFill'),label=$('#noiseLabel');if(!fill||!label)return;fill.style.width=`${n}%`;label.textContent=n<30?'Quiet':n<65?'Talking':n<90?'Loud':'Too Loud';}
function renderFocusChallenge(area){
  let round=0,score=0;const colors=[['RED','red'],['BLUE','blue'],['GREEN','green'],['YELLOW','yellow']];
  const draw=()=>{round++;const [word,color]=[colors[Math.floor(Math.random()*4)][0],colors[Math.floor(Math.random()*4)][1]];area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">🎯</div><h2>Focus Challenge</h2><p>Click the color of the word, not the word you read.</p><div class="focus-word ${color}">${esc(word)}</div><div class="answer-grid">${colors.map(([w,c])=>`<button class="answer-btn" data-focus="${c}">${w}</button>`).join('')}</div><p>Round ${round} • Score ${score}</p></div>`;$$('[data-focus]',area).forEach(b=>b.addEventListener('click',()=>{if(b.dataset.focus===color){score++;playTone(880,.08);}else playTone(260,.08);if(round<10)draw();else area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">🏆</div><h2>Focus Complete!</h2><div class="result-score">${score}/10</div><button class="btn btn-gold" id="focusAgain">Play Again</button></div>`;$('#focusAgain')?.addEventListener('click',()=>{round=0;score=0;draw();});}));};draw();
}
function renderClapPattern(area){
  const patterns=['👏 • 👏','👏 👏 • 👏','👏 • 👏 • 👏','👏 👏 • • 👏'];
  let hidden=false;let current=patterns[0];
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">👏</div><h2>Clap Pattern</h2><div class="big-display" id="patternDisplay">${current}</div><button class="btn btn-gold" id="newPattern">New Pattern</button><button class="btn btn-ghost" id="hidePattern">Hide Pattern</button><p id="patternPrompt" class="hint">Copy the rhythm, then check the pattern.</p></div>`;
  const next=()=>{current=patterns[Math.floor(Math.random()*patterns.length)];hidden=false;$('#patternDisplay').textContent=current;$('#patternPrompt').textContent='Copy the rhythm, then check the pattern.';};
  $('#newPattern').addEventListener('click',next);$('#hidePattern').addEventListener('click',()=>{hidden=!hidden;$('#patternDisplay').textContent=hidden?'❓❓❓':current;$('#patternPrompt').textContent=hidden?'Now clap the pattern from memory.':'Pattern shown.';});
}
function renderCallResponse(area){
  const pairs=[['Teacher: Class, class!','Students: Yes, yes!'],['Teacher: Are you ready?','Students: We are ready!'],['Teacher: Eyes and ears!','Students: Ready to learn!'],['Teacher: Give me five!','Students: Five!']];
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">📣</div><h2>Call & Response</h2><div class="result-card"><h3 id="callLine">Teacher: Class, class!</h3><p id="responseLine">Students: Yes, yes!</p></div><button class="btn btn-gold" id="newCall">New Call</button></div>`;
  $('#newCall').addEventListener('click',()=>{const p=pairs[Math.floor(Math.random()*pairs.length)];$('#callLine').textContent=p[0];$('#responseLine').textContent=p[1];playTone(720,.1);});
}
function renderListenReact(area){
  const cues=['Touch your head','Clap twice','Stand up','Freeze','Point left','Point right','Hands on shoulders'];
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">👂</div><h2>Listen & React</h2><div class="big-display" id="listenCue">Listen…</div><button class="btn btn-gold" id="listenGo">Give Cue</button><p class="hint">Students should react only after the cue appears.</p></div>`;
  $('#listenGo').addEventListener('click',()=>{$('#listenCue').textContent=cues[Math.floor(Math.random()*cues.length)];playTone(1000,.1);});
}
function renderBrainBreak(area){
  const items=['Reach up high for 5 seconds!','March in place for 20 seconds!','Roll your shoulders 5 times!','Take three slow breaths!','Freeze like a statue!','Do 5 star jumps!'];
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">🧠</div><h2>Brain Break</h2><div class="big-display" id="breakText">Ready?</div><button class="btn btn-gold" id="breakGo">Give Me a Break</button></div>`;
  $('#breakGo').addEventListener('click',()=>{$('#breakText').textContent=items[Math.floor(Math.random()*items.length)];playTone(760,.1);});
}
function renderMovementBreak(area){
  const moves=['🕺 March','🙆 Stretch','🦵 Knee lifts','🤸 Side bends','👏 Clap rhythm','🧍 Balance pose'];
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">🕺</div><h2>Movement Break</h2><div class="big-display" id="moveText">Choose a move!</div><button class="btn btn-gold" id="moveGo">Random Move</button></div>`;
  $('#moveGo').addEventListener('click',()=>{$('#moveText').textContent=moves[Math.floor(Math.random()*moves.length)];playTone(700,.1);});
}
function renderFreeze(area){
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">🧊</div><h2>Freeze!</h2><div class="big-display" id="freezeState">MOVE</div><button class="btn btn-gold" id="freezeGo">Start / Freeze</button><p id="freezeHint" class="hint">Move when it says MOVE. Freeze when it says FREEZE.</p></div>`;
  let frozen=false;$('#freezeGo').addEventListener('click',()=>{frozen=!frozen;$('#freezeState').textContent=frozen?'FREEZE!':'MOVE';playTone(frozen?990:600,.15);});
}
function renderMusicBreak(area){
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">🎵</div><h2>Music Break</h2><p>This tool provides a timer and movement prompt. Play your own classroom-safe music if desired.</p><div class="form-grid"><div class="field"><label>Break minutes</label><input id="musicMinutes" type="number" min="1" max="30" value="2"></div><div class="field"><label>Prompt</label><input id="musicPrompt" value="Move, stretch, and have fun!"></div></div><div class="big-display" id="musicDisplay">02:00</div><button class="btn btn-gold" id="musicStart">Start Break</button></div>`;
  const set=()=>{$('#musicDisplay').textContent=formatTime((parseInt($('#musicMinutes').value,10)||2)*60);};$('#musicMinutes').addEventListener('input',set);$('#musicStart').addEventListener('click',()=>{toast($('#musicPrompt').value||'Music break started!');startLocalTimer((parseInt($('#musicMinutes').value,10)||2)*60,$('#musicDisplay'),()=>toast('Music break complete!'));});
}
function renderEmojiCheckin(area){
  const emojis=[['😀','Great'],['😄','Happy'],['🙂','Okay'],['😐','Unsure'],['😴','Tired'],['🤔','Thinking']];
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">🌈</div><h2>Emoji Check-In</h2><p>Choose the feeling you want students to signal.</p><div class="emoji-grid">${emojis.map(e=>`<button class="emoji-card" data-emoji="${esc(e[0])}" data-label="${esc(e[1])}"><span>${e[0]}</span><small>${e[1]}</small></button>`).join('')}</div><div id="emojiChosen" class="result-card" style="margin-top:16px">Waiting for a check-in.</div></div>`;
  $$('.emoji-card',area).forEach(b=>b.addEventListener('click',()=>{$('#emojiChosen').innerHTML=`<div style="font-size:70px">${b.dataset.emoji}</div><h3>${esc(b.dataset.label)}</h3>`;}));
}
function renderMoodMeter(area){
  const levels=[['🔵','Need a quiet moment'],['🟢','Ready to learn'],['🟡','A little unsure'],['🟠','Need help'],['🔴','Need a reset']];
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">🌤️</div><h2>Mood Meter</h2><div class="mood-list">${levels.map(l=>`<button class="mood-card"><span>${l[0]}</span><strong>${l[1]}</strong></button>`).join('')}</div><p id="moodResult" class="hint">Select a mood.</p></div>`;
  $$('.mood-card',area).forEach((b,i)=>b.addEventListener('click',()=>$('#moodResult').textContent=`Selected: ${levels[i][1]}`));
}
function renderStarDay(area){
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">🌟</div><h2>Star of the Day</h2>${studentInputBlock()}<div class="result-card" style="margin-top:14px"><div id="starResult" class="big-display">🌟</div><button class="btn btn-gold" id="pickStar">Choose Star</button></div></div>`;
  bindStudentList();$('#pickStar').addEventListener('click',()=>{if(!state.students.length){toast('Add students first.','error');return;}const n=state.students[Math.floor(Math.random()*state.students.length)];$('#starResult').innerHTML=`🌟<br><strong>${esc(n)}</strong>`;playTone(900,.2);});
}
function renderKindness(area){
  const tasks=['Give someone a genuine compliment.','Help a classmate without being asked.','Thank someone who helped you.','Invite someone to join your group.','Leave a kind note.','Share classroom materials fairly.'];
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">💖</div><h2>Kindness Challenge</h2><div class="big-display" id="kindnessText">Ready for kindness?</div><button class="btn btn-gold" id="kindnessGo">Give Challenge</button></div>`;
  $('#kindnessGo').addEventListener('click',()=>{$('#kindnessText').textContent=tasks[Math.floor(Math.random()*tasks.length)];playTone(820,.1);});
}
function renderAchievement(area){
  const awards=['🌟 Great Thinker','👏 Great Teamwork','🎯 Great Focus','💡 Creative Thinker','❤️ Kind Helper','🚀 Persistence Award'];
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">🏆</div><h2>Achievement Board</h2>${studentInputBlock()}<div class="form-grid"><div class="field"><label>Award</label><select id="awardSelect">${awards.map(a=>`<option>${a}</option>`).join('')}</select></div><div class="field"><label>Student / Team</label><input id="awardName" placeholder="Enter a name"></div></div><button class="btn btn-gold" id="giveAward" style="margin-top:14px">Give Award</button><div id="awardResult" class="result-card" style="margin-top:16px">Awards will appear here.</div></div>`;
  bindStudentList();$('#giveAward').addEventListener('click',()=>{$('#awardResult').innerHTML=`<div style="font-size:60px">🏆</div><h3>${esc($('#awardSelect').value)}</h3><p>${esc($('#awardName').value.trim()||'Our learner')}</p>`;playTone(950,.2);});
}
function renderCelebration(area){
  const modes=['🎉 Amazing Work!','🌟 You Did It!','👏 Give Yourselves a Hand!','🚀 Fantastic Effort!','🏆 Class Champions!'];
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">🎉</div><h2>Celebration Tool</h2><div class="big-display" id="celebrateText">Ready to celebrate?</div><button class="btn btn-gold" id="celebrateGo">Celebrate!</button></div>`;
  $('#celebrateGo').addEventListener('click',()=>{$('#celebrateText').textContent=modes[Math.floor(Math.random()*modes.length)];playTone(1000,.3);});
}
function renderGenericTool(area,tool){
  area.innerHTML=`<div class="tool-stage"><div class="tool-hero-icon">${esc(tool.icon)}</div><h2>${esc(tool.name)}</h2><p>${esc(tool.description)}</p><button class="btn btn-gold" id="genericRun">Start Activity</button><div id="genericResult" class="result-card" style="margin-top:18px">Ready.</div></div>`;
  $('#genericRun').addEventListener('click',()=>{$('#genericResult').innerHTML='<h3>Activity started!</h3><p>This tool is ready for classroom presentation.</p>';playTone(800,.12);});
}

function formatTime(total){total=Math.max(0,Math.floor(total));return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;}
function startLocalTimer(seconds,display,onDone){
  clearGameTimer();let left=Math.max(1,seconds);display.textContent=formatTime(left);state.gameTimer=setInterval(()=>{left--;display.textContent=formatTime(left);if(left<=0){clearGameTimer();onDone?.();}},1000);
}
function toggleFullscreen(){const el=$('.modal');if(!el)return;if(document.fullscreenElement){document.exitFullscreen?.();}else{el.requestFullscreen?.().catch(()=>toast('Fullscreen is not available. Presentation mode is still active.','error'));}}

/* ===================== QUESTION GAMES ===================== */
function openGameSetup(tool){
  const sets=state.questions.filter(s=>s.questions.length);
  const first=sets[0];
  const body=`<form id="gameSetupForm"><div class="setup-banner"><strong>Reusable Game Engine</strong><span>${esc(tool.name)} can use any subject, grade, topic, and question set.</span></div><div class="form-grid"><div class="field full"><label>Question Set</label><select id="gameSet" required>${sets.length?sets.map(s=>`<option value="${esc(s.id)}">${esc(s.title)} • ${esc(s.subject)} • ${esc(s.grade)} • ${s.questions.length} Q</option>`).join(''):'<option value="">No question sets yet</option>'}</select></div><div class="field"><label>Game Title</label><input id="gameTitleInput" value="${esc(tool.name)}"></div><div class="field"><label>Subject Label</label><select id="gameSubject">${SUBJECTS.map(s=>`<option ${s===(first?.subject||'General')?'selected':''}>${s}</option>`).join('')}</select></div><div class="field"><label>Grade Label</label><select id="gameGrade">${GRADES.map(g=>`<option ${g===(first?.grade||'Grade 1')?'selected':''}>${g}</option>`).join('')}</select></div><div class="field"><label>Points per correct</label><input id="points" type="number" min="1" max="100" value="1"></div><div class="field"><label>Time per question (seconds)</label><input id="time" type="number" min="0" max="600" value="30"></div><div class="field"><label>Teams</label><input id="teams" type="number" min="1" max="6" value="2"></div><div class="field full"><label>Options</label><div class="check-row"><label><input id="randomQ" type="checkbox"> Randomize questions</label><label><input id="randomC" type="checkbox"> Randomize choices</label><label><input id="showExp" type="checkbox" checked> Show explanations</label><label><input id="gameSound" type="checkbox" ${state.sound?'checked':''}> Sound</label></div></div></div><div class="setup-actions"><button type="button" class="btn btn-ghost" data-close-modal>Cancel</button><button type="button" class="btn btn-ghost" id="editSetFromGame">⚙ Edit Question Set</button><button type="submit" class="btn btn-gold" ${sets.length?'':'disabled'}>Start ${esc(tool.name)}</button></div></form>`;
  modal(`Customize ${tool.name}`,body,{onOpen:()=>{
    $('#editSetFromGame')?.addEventListener('click',()=>{const id=$('#gameSet').value;closeModal();showView('questions');setTimeout(()=>selectSet(id),0);});
    $('#gameSet')?.addEventListener('change',()=>{const s=state.questions.find(x=>x.id===$('#gameSet').value);if(s){$('#gameSubject').value=s.subject;$('#gameGrade').value=s.grade;}});
    $('#gameSetupForm').addEventListener('submit',e=>{e.preventDefault();const set=state.questions.find(s=>s.id===$('#gameSet').value);if(!set||!set.questions.length){toast('Please create a question set first.','error');return;}const cfg={title:$('#gameTitleInput').value.trim()||tool.name,points:clamp(parseInt($('#points').value,10)||1,1,100),time:clamp(parseInt($('#time').value,10)||0,0,600),teams:clamp(parseInt($('#teams').value,10)||2,1,6),randomQ:$('#randomQ').checked,randomC:$('#randomC').checked,showExp:$('#showExp').checked,sound:$('#gameSound').checked,subject:$('#gameSubject').value,grade:$('#gameGrade').value};closeModal();launchGame(tool,set,cfg);});
  }});
}
function launchGame(tool,set,cfg){
  let qs=clone(set.questions).map(normalizeQuestion);if(cfg.randomQ)qs=shuffle(qs);
  state.game={tool,set,cfg,qs,index:0,score:0,correct:0,answers:[],teams:Array.from({length:cfg.teams},(_,i)=>({name:`Team ${String.fromCharCode(65+i)}`,score:0})),turn:0};
  if(tool.id==='target-toss')return renderTargetToss();
  if(tool.id==='rocket-race')return renderRocketRace();
  if(tool.id==='mystery-box')return renderMysteryBox();
  if(tool.id==='spin-wheel')return renderSpinWheel();
  if(tool.id==='quiz-race')return renderQuizRace();
  if(tool.id==='mystery-question')return renderMysteryQuestion();
  if(tool.id==='balloon-pop')return renderBalloonPop();
  if(tool.id==='puzzle-reveal')return renderPuzzleReveal();
  if(tool.id==='word-bee')return renderWordBee();
  if(tool.id==='missing-item')return renderMissingItem();
  if(tool.id==='quick-brain')return renderQuickBrain();
  if(tool.id==='five-second')return renderFiveSecond();
  if(tool.id==='exit-ticket')return renderStandardQuiz('Exit Ticket');
  if(tool.id==='quick-poll')return renderQuickPoll();
  if(tool.id==='true-false')return renderStandardQuiz('True or False');
  if(tool.id==='multiple-choice')return renderStandardQuiz('Multiple Choice');
  if(tool.id==='lightning-round')return renderLightningRound();
  if(tool.id==='matching')return renderMatching();
  if(tool.id==='think-pair-share')return renderThinkPairShare();
  if(tool.id==='oral-question')return renderOralQuestion();
  renderStandardQuiz(tool.name);
}
function gameShell(title,content,progress=true){
  const g=state.game;return `<div class="game-shell game-${esc(g.tool.id)}"><div class="game-top"><div class="game-brand"><img src="assets/teacher-ed-logo.png" alt="Teacher Ed"><div><strong>${esc(title)}</strong><small>${esc(g.cfg.subject)} • ${esc(g.cfg.grade)}</small></div></div><div class="game-actions"><button class="btn btn-ghost" id="gameFullscreen">⛶ Present</button><button class="btn btn-ghost" data-close-modal>Exit</button></div></div>${progress?`<div class="progress-line"><span style="width:${Math.round((g.index/g.qs.length)*100)}%"></span></div>`:''}${content}</div>`;
}
function renderGameFrame(title,content,onOpen){modal(title,gameShell(title,content),{onOpen:(root)=>{root.querySelector('#gameFullscreen')?.addEventListener('click',toggleFullscreen);onOpen?.(root);}});}
function answerCheck(q,answer){
  const norm=s=>String(s??'').trim().toLowerCase();
  if(q.type==='short-answer'||q.type==='open-response'||q.type==='missing-word')return [q.answer,...(q.acceptedAnswers||[])].some(a=>norm(a)===norm(answer));
  return norm(answer)===norm(q.answer);
}
function answersFor(q){
  if(q.type==='true-false')return ['True','False'];
  if(Array.isArray(q.choices)&&q.choices.length)return state.game.cfg.randomC?shuffle(q.choices):[...q.choices];
  return [];
}
function submitGameAnswer(answer){
  const g=state.game;if(!g)return;clearGameTimer();const q=g.qs[g.index];const correct=answerCheck(q,answer);g.answers.push({q,answer,correct});if(correct){g.correct++;g.score+=g.cfg.points;g.teams[g.turn%g.teams.length].score+=g.cfg.points;playTone(900,.12);}else playTone(250,.15);showGameFeedback(q,correct,answer,()=>{g.index++;g.turn++;renderCurrentGame();});}
function showGameFeedback(q,correct,answer,next){
  const feedback=`<div class="result-card feedback-card ${correct?'is-correct':'is-wrong'}"><strong>${correct?'✓ Correct!':'✗ Nice try!'}</strong>${!correct&&q.answer?`<div>Correct answer: <strong>${esc(q.answer)}</strong></div>`:''}${state.game.cfg.showExp&&q.explanation?`<div class="hint">${esc(q.explanation)}</div>`:''}<button class="btn btn-gold" id="nextGameQuestion">${state.game.index===state.game.qs.length-1?'See Results':'Next Question →'}</button></div>`;
  const existing=$('.feedback-slot');if(existing)existing.innerHTML=feedback;else{const root=$('.game-content');root?.insertAdjacentHTML('beforeend',`<div class="feedback-slot">${feedback}</div>`);}
  $$('.answer-btn').forEach(b=>b.disabled=true);$('#nextGameQuestion')?.addEventListener('click',next,{once:true});
}
function renderCurrentGame(){
  const id=state.game.tool.id;
  if(id==='target-toss')return renderTargetToss();if(id==='rocket-race')return renderRocketRace();if(id==='mystery-box')return renderMysteryBox();if(id==='spin-wheel')return renderSpinWheel();if(id==='quiz-race')return renderQuizRace();if(id==='mystery-question')return renderMysteryQuestion();if(id==='balloon-pop')return renderBalloonPop();if(id==='puzzle-reveal')return renderPuzzleReveal();if(id==='word-bee')return renderWordBee();if(id==='missing-item')return renderMissingItem();if(id==='quick-brain')return renderQuickBrain();if(id==='five-second')return renderFiveSecond();if(id==='quick-poll')return renderQuickPoll();if(id==='lightning-round')return renderLightningRound();if(id==='matching')return renderMatching();if(id==='think-pair-share')return renderThinkPairShare();if(id==='oral-question')return renderOralQuestion();return renderStandardQuiz(state.game.tool.name);
}
function gameStats(){const g=state.game;return `<div class="game-stats"><div><strong>${g.index+1}/${g.qs.length}</strong>Question</div><div><strong>${g.score}</strong>Score</div><div><strong>${g.teams[g.turn%g.teams.length]?.name||'Class'}</strong>Turn</div>${g.cfg.time?`<div><strong id="qTimer">${g.cfg.time}</strong>Seconds</div>`:''}</div>`;}
function questionBlock(q,{input=false}={}){
  const answers=answersFor(q);return `${gameStats()}${q.image?`<img class="question-image" src="${esc(q.image)}" alt="Question visual" onerror="this.style.display='none'">`:''}<div class="game-question">${esc(q.question)}</div>${input?`<div class="short-answer"><input id="shortAnswer" placeholder="Type your answer…" autocomplete="off"><button class="btn btn-gold" id="submitShort">Submit Answer</button></div>`:`<div class="answer-grid" id="answers">${answers.map((a,i)=>`<button class="answer-btn" data-answer="${esc(a)}">${String.fromCharCode(65+i)}. ${esc(a)}</button>`).join('')}</div>`}<div class="feedback-slot"></div>`;
}
function standardOpen(title,opts={}){const g=state.game;const q=g.qs[g.index];renderGameFrame(title,questionBlock(q,opts),()=>{if(opts.input){$('#submitShort').addEventListener('click',()=>submitGameAnswer($('#shortAnswer').value));$('#shortAnswer').addEventListener('keydown',e=>{if(e.key==='Enter')$('#submitShort').click();});}else $$('#answers .answer-btn').forEach(b=>b.addEventListener('click',()=>submitGameAnswer(b.dataset.answer)));if(g.cfg.time)startQuestionTimer(g.cfg.time);});}
function renderStandardQuiz(title){if(state.game.index>=state.game.qs.length)return renderGameResult();standardOpen(title,{input:['short-answer','open-response'].includes(state.game.qs[state.game.index].type)});}
function startQuestionTimer(seconds){clearGameTimer();let left=seconds;const d=$('#qTimer');if(d)d.textContent=left;state.gameTimer=setInterval(()=>{left--;if(d)d.textContent=left;if(left<=0){clearGameTimer();submitGameAnswer('__TIMEOUT__');}},1000);}
function renderGameResult(){const g=state.game;const pct=g.qs.length?Math.round(g.correct/g.qs.length*100):0;const teamScores=g.teams.map(t=>`<div class="result-card"><h3>${esc(t.name)}</h3><div class="result-score small">${t.score}</div></div>`).join('');renderGameFrame(`${g.cfg.title} • Complete`,`<div class="game-content"><div style="font-size:70px">🎉</div><h2>Great job!</h2><div class="result-card"><div class="result-score">${pct}%</div><p>${g.correct} correct out of ${g.qs.length}</p><p>Score: <strong>${g.score}</strong></p></div><div class="result-grid">${teamScores}</div><div class="game-actions-center"><button class="btn btn-gold" id="playAgain">Play Again</button><button class="btn btn-ghost" id="reviewGame">Review Questions</button><button class="btn btn-ghost" data-close-modal>Back to Tools</button></div><div id="reviewArea"></div></div>`,()=>{$('#playAgain').addEventListener('click',()=>launchGame(g.tool,g.set,g.cfg));$('#reviewGame').addEventListener('click',()=>{$('#reviewArea').innerHTML=g.answers.map((a,i)=>`<div class="result-card review-item"><strong>${i+1}. ${esc(a.q.question)}</strong><div>Your answer: ${esc(a.answer==='__TIMEOUT__'?'Time expired':a.answer)}</div><div>Correct: ${esc(a.q.answer)}</div></div>`).join('');});});}

function renderTargetToss(){if(state.game.index>=state.game.qs.length)return renderGameResult();const g=state.game,q=g.qs[g.index],answers=answersFor(q);renderGameFrame('Target Toss',`<div class="game-content"><div class="target-board"><div class="target-ring outer"><div class="target-ring mid"><div class="target-ring inner">🎯</div></div></div></div>${questionBlock(q)}</div>`,()=>{$$('#answers .answer-btn').forEach(b=>b.addEventListener('click',()=>submitGameAnswer(b.dataset.answer)));if(g.cfg.time)startQuestionTimer(g.cfg.time);});}
function renderRocketRace(){if(state.game.index>=state.game.qs.length)return renderGameResult();const g=state.game,q=g.qs[g.index];renderGameFrame('Rocket Race',`<div class="game-content"><div class="race-track">${g.teams.map(t=>`<div class="race-row"><span>${esc(t.name)}</span><div class="race-lane"><span style="width:${Math.min(100,t.score*8)}%"></span><b>🚀</b></div></div>`).join('')}</div>${questionBlock(q)}</div>`,()=>{$$('#answers .answer-btn').forEach(b=>b.addEventListener('click',()=>submitGameAnswer(b.dataset.answer)));if(g.cfg.time)startQuestionTimer(g.cfg.time);});}
function renderQuizRace(){return renderRocketRace();}
function renderMysteryBox(){if(state.game.index>=state.game.qs.length)return renderGameResult();const g=state.game,q=g.qs[g.index];renderGameFrame('Mystery Box',`<div class="game-content"><div class="mystery-box" id="mysteryBox">🎁<span>MYSTERY</span></div><button class="btn btn-gold" id="revealBox">Open Mystery Box</button><div id="mysteryQuestion" style="margin-top:20px"></div></div>`,()=>{$('#revealBox').addEventListener('click',()=>{$('#mysteryBox').classList.add('opened');$('#mysteryQuestion').innerHTML=questionBlock(q);$('#revealBox').disabled=true;$$('#answers .answer-btn').forEach(b=>b.addEventListener('click',()=>submitGameAnswer(b.dataset.answer)));if(g.cfg.time)startQuestionTimer(g.cfg.time);playTone(700,.15);});});}
function renderSpinWheel(){if(state.game.index>=state.game.qs.length)return renderGameResult();const g=state.game,q=g.qs[g.index];renderGameFrame('Spin the Wheel',`<div class="game-content"><div class="wheel" id="spinWheel">🎡</div><button class="btn btn-gold" id="spinBtn">SPIN</button><div id="spinQuestion" style="margin-top:20px"></div></div>`,()=>{$('#spinBtn').addEventListener('click',()=>{$('#spinWheel').classList.add('spinning');setTimeout(()=>{$('#spinQuestion').innerHTML=questionBlock(q);$('#spinBtn').disabled=true;$$('#answers .answer-btn').forEach(b=>b.addEventListener('click',()=>submitGameAnswer(b.dataset.answer)));if(g.cfg.time)startQuestionTimer(g.cfg.time);},state.reducedMotion?0:900);});});}
function renderMysteryQuestion(){if(state.game.index>=state.game.qs.length)return renderGameResult();const g=state.game,q=g.qs[g.index];renderGameFrame('Mystery Question',`<div class="game-content"><div class="mystery-card"><div class="lock">🔒</div><h2>Mystery Question</h2><button class="btn btn-gold" id="revealMystery">Reveal</button></div><div id="mysteryQuestion" style="margin-top:20px"></div></div>`,()=>{$('#revealMystery').addEventListener('click',()=>{$('#mysteryQuestion').innerHTML=questionBlock(q);$$('#answers .answer-btn').forEach(b=>b.addEventListener('click',()=>submitGameAnswer(b.dataset.answer)));$('#revealMystery').disabled=true;if(g.cfg.time)startQuestionTimer(g.cfg.time);});});}
function renderBalloonPop(){if(state.game.index>=state.game.qs.length)return renderGameResult();const g=state.game,q=g.qs[g.index];renderGameFrame('Balloon Pop',`<div class="game-content"><div class="balloon-field"><button class="balloon" id="popBalloon">🎈</button><button class="balloon b2" disabled>🎈</button><button class="balloon b3" disabled>🎈</button></div><div id="balloonQuestion"></div></div>`,()=>{$('#popBalloon').addEventListener('click',()=>{$('#popBalloon').classList.add('popped');$('#balloonQuestion').innerHTML=questionBlock(q);$$('#answers .answer-btn').forEach(b=>b.addEventListener('click',()=>submitGameAnswer(b.dataset.answer)));if(g.cfg.time)startQuestionTimer(g.cfg.time);playTone(820,.12);});});}
function renderPuzzleReveal(){if(state.game.index>=state.game.qs.length)return renderGameResult();const g=state.game,q=g.qs[g.index];if(!g.revealedTiles)g.revealedTiles=[];const tiles=Array.from({length:9},(_,i)=>`<div class="puzzle-tile ${g.revealedTiles.includes(i)?'revealed':''}" id="tile${i}">${g.revealedTiles.includes(i)?['⭐','🎉','🌈','🚀','🌟','💡','❤️','🏆','🎯'][i]:'?'}</div>`).join('');renderGameFrame('Puzzle Reveal',`<div class="game-content"><div class="puzzle-grid">${tiles}</div>${questionBlock(q)}</div>`,()=>{$$('#answers .answer-btn').forEach(b=>b.addEventListener('click',e=>{const correct=answerCheck(q,e.currentTarget.dataset.answer);if(correct&&!g.revealedTiles.includes(g.index%9))g.revealedTiles.push(g.index%9);submitGameAnswer(e.currentTarget.dataset.answer);}));if(g.cfg.time)startQuestionTimer(g.cfg.time);});}
function renderWordBee(){if(state.game.index>=state.game.qs.length)return renderGameResult();const q=state.game.qs[state.game.index];renderGameFrame('Word Bee',`<div class="game-content"><div class="bee">🐝</div>${questionBlock(q,{input:true})}</div>`,()=>{const g=state.game;$('#submitShort').addEventListener('click',()=>submitGameAnswer($('#shortAnswer').value));$('#shortAnswer').focus();if(g.cfg.time)startQuestionTimer(g.cfg.time);});}
function renderMissingItem(){if(state.game.index>=state.game.qs.length)return renderGameResult();const q=state.game.qs[state.game.index];renderGameFrame("What's Missing?",`<div class="game-content"><div class="missing-sequence">🔵 🟢 🟡 ❓ 🔵 🟢</div>${questionBlock(q,{input:true})}</div>`,()=>{$('#submitShort').addEventListener('click',()=>submitGameAnswer($('#shortAnswer').value));if(state.game.cfg.time)startQuestionTimer(state.game.cfg.time);});}
function renderQuickBrain(){if(state.game.index>=state.game.qs.length)return renderGameResult();renderStandardQuiz('Quick Brain Challenge');}
function renderFiveSecond(){if(state.game.index>=state.game.qs.length)return renderGameResult();state.game.cfg.time=5;renderStandardQuiz('5-Second Challenge');}
function renderLightningRound(){if(state.game.index>=state.game.qs.length)return renderGameResult();state.game.cfg.time=5;renderStandardQuiz('Lightning Round');}
function renderQuickPoll(){
  if(state.game.index>=state.game.qs.length)return renderGameResult();const g=state.game,q=g.qs[g.index],choices=answersFor(q);const tally={};choices.forEach(c=>tally[c]=0);
  renderGameFrame('Quick Class Poll',`<div class="game-content"><div class="game-question">${esc(q.question)}</div><div class="poll-grid">${choices.map(c=>`<button class="poll-option" data-poll="${esc(c)}"><span>${esc(c)}</span><b id="poll-${encodeURIComponent(c)}">0</b></button>`).join('')}</div><button class="btn btn-gold" id="nextPoll" style="margin-top:18px">Next Question</button></div>`,()=>{$$('.poll-option').forEach(b=>b.addEventListener('click',()=>{tally[b.dataset.poll]++;$('#poll-'+encodeURIComponent(b.dataset.poll)).textContent=tally[b.dataset.poll];playTone(700,.06);}));$('#nextPoll').addEventListener('click',()=>{g.index++;g.correct++;renderCurrentGame();});});
}
function renderMatching(){
  const g=state.game;if(g.index>=g.qs.length)return renderGameResult();
  const pairs=g.qs.slice(g.index,Math.min(g.index+Math.min(4,g.qs.length-g.index))).map(q=>({left:q.question,right:q.answer,id:q.id}));
  const rights=shuffle(pairs);let selected=null,matched=0;
  renderGameFrame('Matching Game',`<div class="game-content"><p>Match each question to its correct answer.</p><div class="matching-grid"><div>${pairs.map(p=>`<button class="match-card left" data-match-left="${esc(p.id)}">${esc(p.left)}</button>`).join('')}</div><div>${rights.map(p=>`<button class="match-card right" data-match-right="${esc(p.id)}">${esc(p.right)}</button>`).join('')}</div></div><div id="matchStatus" class="hint"></div></div>`,()=>{
    $$('[data-match-left]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.matchLeft;$$('[data-match-left]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');}));
    $$('[data-match-right]').forEach(b=>b.addEventListener('click',()=>{if(!selected){toast('Choose a question first.','error');return;}if(b.dataset.matchRight===selected){matched++;b.disabled=true;$$(`[data-match-left="${selected}"]`)[0].disabled=true;playTone(900,.1);selected=null;if(matched===pairs.length){g.correct+=matched;g.score+=matched*g.cfg.points;g.index+=pairs.length;$('#matchStatus').innerHTML='<strong>All matched! ✓</strong><br><button class="btn btn-gold" id="nextMatch">Continue</button>';$('#nextMatch').addEventListener('click',renderCurrentGame);}}else{playTone(250,.1);$('#matchStatus').textContent='Try another match.';}}));
  });
}
function renderThinkPairShare(){
  const g=state.game,q=g.qs[g.index];let phase=0;const phases=[['THINK','Think silently.'],['PAIR','Discuss with a partner.'],['SHARE','Share your idea.']];
  const draw=()=>renderGameFrame('Think–Pair–Share',`<div class="game-content"><div class="phase-badge">${phases[phase][0]}</div><div class="game-question">${esc(q.question)}</div><p>${phases[phase][1]}</p><div class="big-display" id="tpsTimer">00:30</div><button class="btn btn-gold" id="tpsStart">Start ${phases[phase][0]}</button><button class="btn btn-ghost" id="tpsNext">Next Phase</button></div>`,()=>{$('#tpsStart').addEventListener('click',()=>startLocalTimer(phase===0?30:45,$('#tpsTimer'),()=>playTone(880,.2)));$('#tpsNext').addEventListener('click',()=>{if(phase<2){phase++;draw();}else{g.correct++;g.index++;renderCurrentGame();}});});
  draw();
}
function renderOralQuestion(){
  const g=state.game,q=g.qs[g.index];const input=['short-answer','open-response','missing-word'].includes(q.type);renderGameFrame('Oral Question',`<div class="game-content"><div class="result-card"><h3>🎤 Student Speaker</h3><div id="oralStudent" class="big-display">—</div><button class="btn btn-gold" id="chooseOral">Choose Student</button></div>${questionBlock(q,{input})}</div>`,()=>{$('#chooseOral').addEventListener('click',()=>{$('#oralStudent').textContent=state.students.length?state.students[Math.floor(Math.random()*state.students.length)]:'Add students in Random Student Picker';});if(input){$('#submitShort').addEventListener('click',()=>submitGameAnswer($('#shortAnswer').value));}else{$$('#answers .answer-btn').forEach(b=>b.addEventListener('click',()=>submitGameAnswer(b.dataset.answer)));}if(g.cfg.time)startQuestionTimer(g.cfg.time);});
}

/* ===================== QUESTION BANK ===================== */
function persistQuestions(){saveJson(STORAGE.questions,state.questions);}
function renderQuestionBank(){
  const list=$('#questionSetList');
  list.innerHTML=state.questions.length?state.questions.map(s=>`<div class="set-item ${s.id===state.currentSetId?'active':''}" data-set-id="${esc(s.id)}"><strong>${esc(s.title)}</strong><small>${esc(s.subject)} • ${esc(s.grade)} • ${s.questions.length} questions</small></div>`).join(''):`<div class="empty-state" style="min-height:200px"><div>📚</div><h3>No question sets</h3><p>Create your first reusable set.</p></div>`;
  $$('.set-item',list).forEach(i=>i.addEventListener('click',()=>selectSet(i.dataset.setId)));
  if(state.currentSetId&&!state.questions.some(s=>s.id===state.currentSetId))state.currentSetId=null;
  if(state.currentSetId)renderEditor();else $('#questionEditor').innerHTML='<div class="empty-state"><div>🧠</div><h3>Select or create a question set</h3><p>Your questions can power every compatible game.</p></div>';
}
function selectSet(id){state.currentSetId=id;renderQuestionBank();}
function newQuestionSet(){
  const id=uid('set');state.questions.push({id,title:'New Question Set',subject:'General',grade:'Grade 1',topic:'',questions:[normalizeQuestion({type:'multiple-choice',question:'Type your question here.',choices:['Option A','Option B','Option C','Option D'],answer:'Option A',explanation:''})]});
  state.currentSetId=id;persistQuestions();showView('questions');renderQuestionBank();toast('New question set created.');
}
function questionRow(q,i){
  const choices=(q.choices||[]).join('\n');
  return `<div class="question-row"><div class="question-row-top"><h4>Question ${i+1}</h4><div><button class="text-btn dup-q" data-index="${i}">Duplicate</button> <button class="text-btn delete-q" data-index="${i}">Delete</button></div></div><div class="form-grid"><div class="field full"><label>Question / Prompt</label><textarea data-q="${i}" data-field="question" rows="3">${esc(q.question)}</textarea></div><div class="field"><label>Type</label><select data-q="${i}" data-field="type"><option value="multiple-choice" ${q.type==='multiple-choice'?'selected':''}>Multiple Choice</option><option value="true-false" ${q.type==='true-false'?'selected':''}>True / False</option><option value="short-answer" ${q.type==='short-answer'?'selected':''}>Short Answer</option><option value="open-response" ${q.type==='open-response'?'selected':''}>Open Response</option><option value="missing-word" ${q.type==='missing-word'?'selected':''}>Missing Word</option></select></div><div class="field"><label>Correct / Expected Answer</label><input data-q="${i}" data-field="answer" value="${esc(q.answer)}"></div><div class="field full"><label>Choices — one per line</label><textarea data-q="${i}" data-field="choices" rows="4" placeholder="Option A\nOption B\nOption C\nOption D">${esc(choices)}</textarea></div><div class="field full"><label>Explanation / Feedback</label><textarea data-q="${i}" data-field="explanation" rows="2">${esc(q.explanation)}</textarea></div><div class="field full"><label>Optional Image URL</label><input data-q="${i}" data-field="image" value="${esc(q.image)}" placeholder="https://…"></div></div></div>`;
}
function renderEditor(){
  const set=state.questions.find(s=>s.id===state.currentSetId);if(!set)return;
  $('#questionEditor').innerHTML=`<div class="editor-head"><div><span class="eyebrow">REUSABLE QUESTION SET</span><h2>${esc(set.title)}</h2><div class="editor-meta">${esc(set.subject)} • ${esc(set.grade)} • ${esc(set.topic||'General')}</div></div><div class="editor-actions"><button class="btn btn-ghost" id="exportSet">Export</button><button class="btn btn-gold" id="addQuestion">+ Add Question</button></div></div><div class="form-grid"><div class="field"><label>Title</label><input id="setTitle" value="${esc(set.title)}"></div><div class="field"><label>Topic</label><input id="setTopic" value="${esc(set.topic)}"></div><div class="field"><label>Subject</label><select id="setSubject">${SUBJECTS.map(x=>`<option ${x===set.subject?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><label>Grade</label><select id="setGrade">${GRADES.map(x=>`<option ${x===set.grade?'selected':''}>${x}</option>`).join('')}</select></div></div><div id="questionRows">${set.questions.map(questionRow).join('')}</div><div class="editor-footer-actions"><button class="btn btn-ghost" id="deleteSet">Delete Set</button><button class="btn btn-gold" id="saveSet">Save Changes</button></div>`;
  const rows=$('#questionRows');
  $$('.delete-q',rows).forEach(b=>b.addEventListener('click',()=>{set.questions.splice(+b.dataset.index,1);persistQuestions();renderEditor();toast('Question deleted.');}));
  $$('.dup-q',rows).forEach(b=>b.addEventListener('click',()=>{const q=clone(set.questions[+b.dataset.index]);q.id=uid('q');set.questions.splice(+b.dataset.index+1,0,q);persistQuestions();renderEditor();toast('Question duplicated.');}));
  $('#addQuestion').addEventListener('click',()=>{set.questions.push(normalizeQuestion({question:'New question',choices:['Option A','Option B','Option C','Option D'],answer:'Option A'}));persistQuestions();renderEditor();toast('Question added.');});
  $('#saveSet').addEventListener('click',()=>{set.title=$('#setTitle').value.trim()||'Untitled Question Set';set.topic=$('#setTopic').value.trim();set.subject=$('#setSubject').value;set.grade=$('#setGrade').value;persistQuestions();renderQuestionBank();renderDashboard();toast('Question set saved.');});
  $('#deleteSet').addEventListener('click',()=>{if(window.confirm('Delete this question set?')){state.questions=state.questions.filter(x=>x.id!==set.id);state.currentSetId=null;persistQuestions();renderQuestionBank();renderDashboard();toast('Question set deleted.');}});
  $('#exportSet').addEventListener('click',()=>downloadJson(set,`${set.id}.json`));
}
function importQuestions(){
  const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.onchange=()=>{const f=input.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const data=JSON.parse(r.result);const raw=Array.isArray(data)?data:(data&&Array.isArray(data.questions)?[data]:null);if(!raw)throw new Error('Expected a question set or an array of question sets.');const sets=raw.map((s,i)=>{const set=normalizeSet(s,i);if(!set.title)throw new Error(`Question set ${i+1} is missing a title.`);if(!set.questions.length)throw new Error(`Question set ${set.title} has no questions.`);return set;});state.questions.push(...sets);persistQuestions();renderAll();toast(`${sets.length} question set${sets.length===1?'':'s'} imported.`);}catch(e){toast(`Unable to import: ${e.message}`,'error');}};r.readAsText(f);};input.click();
}
function downloadJson(data,name){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);toast('JSON exported.');}

function settingsModal(){
  modal('Settings',`<div class="result-card"><h3>Teacher Ed Preferences</h3><p>Settings and classroom content are saved on this device.</p><div class="settings-grid"><label class="setting-row"><span>Sound effects</span><input id="setSound" type="checkbox" ${state.sound?'checked':''}></label><label class="setting-row"><span>Reduced motion</span><input id="setMotion" type="checkbox" ${state.reducedMotion?'checked':''}></label></div><div class="setup-actions"><button class="btn btn-gold" id="importBtn">Import Question JSON</button><button class="btn btn-ghost" id="exportAllBtn">Export All Questions</button><button class="btn btn-ghost" id="resetData">Reset Saved Questions</button></div></div>`,{onOpen:()=>{
    $('#setSound').addEventListener('change',e=>{state.sound=e.target.checked;localStorage.setItem(STORAGE.sound,state.sound?'on':'off');$('#soundToggle').textContent=state.sound?'🔊':'🔇';});
    $('#setMotion').addEventListener('change',e=>{state.reducedMotion=e.target.checked;localStorage.setItem(STORAGE.motion,state.reducedMotion?'reduced':'full');document.body.classList.toggle('reduced-motion',state.reducedMotion);});
    $('#importBtn').addEventListener('click',()=>{closeModal();importQuestions();});
    $('#exportAllBtn').addEventListener('click',()=>downloadJson(state.questions,'teacher-ed-question-bank.json'));
    $('#resetData').addEventListener('click',()=>{if(window.confirm('Reset all saved question sets?')){localStorage.removeItem(STORAGE.questions);location.reload();}});
  }});
}

function bind(){
  $$('.nav-btn').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
  document.addEventListener('click',e=>{
    const open=e.target.closest('[data-open-tool]');if(open){openTool(open.dataset.openTool);return;}
    const fav=e.target.closest('[data-fav]');if(fav){const id=fav.dataset.fav;if(state.favorites.has(id))state.favorites.delete(id);else state.favorites.add(id);saveJson(STORAGE.favorites,[...state.favorites]);renderDashboard();renderTools();renderFavorites();toast(state.favorites.has(id)?'Added to favorites.':'Removed from favorites.');return;}
    const custom=e.target.closest('[data-tool-customize]');if(custom){const t=state.tools.find(x=>x.id===custom.dataset.toolCustomize);if(t)openGameSetup(t);return;}
    if(e.target.closest('[data-close-modal]')){closeModal();return;}
    const action=e.target.closest('[data-action]')?.dataset.action;if(action==='open-tools')showView('tools');if(action==='new-question-set')newQuestionSet();
  });
  $('#toolSearch').addEventListener('input',renderTools);$('#categoryFilter').addEventListener('change',renderTools);$('#subjectFilter').addEventListener('change',renderTools);$('#gradeFilter').addEventListener('change',renderTools);
  $('#soundToggle').addEventListener('click',()=>{state.sound=!state.sound;localStorage.setItem(STORAGE.sound,state.sound?'on':'off');$('#soundToggle').textContent=state.sound?'🔊':'🔇';toast(`Sound ${state.sound?'on':'off'}.`);});
  $('#motionToggle').addEventListener('click',()=>{state.reducedMotion=!state.reducedMotion;document.body.classList.toggle('reduced-motion',state.reducedMotion);localStorage.setItem(STORAGE.motion,state.reducedMotion?'reduced':'full');toast(`Reduced motion ${state.reducedMotion?'on':'off'}.`);});
  $('#settingsBtn').addEventListener('click',settingsModal);
  document.addEventListener('input',e=>{const el=e.target;if(!el.dataset.q||!state.currentSetId)return;const set=state.questions.find(s=>s.id===state.currentSetId),q=set?.questions[+el.dataset.q];if(!q)return;const f=el.dataset.field;if(f==='choices')q.choices=el.value.split(/\n/).map(x=>x.trim()).filter(Boolean);else q[f]=el.value;persistQuestions();});
  document.addEventListener('change',e=>{const el=e.target;if(!el.dataset.q||!state.currentSetId)return;const set=state.questions.find(s=>s.id===state.currentSetId),q=set?.questions[+el.dataset.q];if(q){q[el.dataset.field]=el.value;persistQuestions();}});
}

async function init(){
  try{await loadData();bind();$('#soundToggle').textContent=state.sound?'🔊':'🔇';}
  catch(e){console.error(e);document.body.innerHTML=`<div style="padding:40px;color:white;font-family:system-ui;background:#06142F;min-height:100vh"><img src="assets/teacher-ed-logo.png" style="width:100px"><h1>Teacher Ed Tools could not load</h1><p>${esc(e.message)}</p><p>Run this project through a local web server so JSON files can load correctly.</p></div>`;}
}
init();

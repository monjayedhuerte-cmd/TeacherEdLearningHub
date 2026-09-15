const STORAGE_KEY = "teacherEdTermReadiness_v1";

const defaultData = {
  term: {
    schoolYear: "2026–2027",
    term: "Term 1",
    grade: "Grade 3",
    subject: "Mathematics",
    section: "",
    teacher: "Teacher Ed",
    diagnosticDate: new Date().toISOString().slice(0,10),
    previousTerm: "Previous Term",
  },
  settings: { mastery:80, ready:80, developing:60 },
  students: [],
  competencies: [],
  questions: [],
  results: [],
  interventions: [],
  reassessments: [],
  bridgeLessons: [],
  demo: false
};

let data = loadData();
let currentView = "dashboard";

const viewMeta = {
  dashboard:["Term Readiness & Diagnostic Tool","Diagnose • Plan • Intervene • Reassess • Monitor"],
  term:["Term Setup","Configure the new term and diagnostic context."],
  competencies:["Competencies","Define prerequisite skills and the new-term learning connections."],
  assessment:["Diagnostic Assessment","Build and manage a prerequisite diagnostic assessment."],
  students:["Student Profiles","Manage learner records and readiness results."],
  groups:["Readiness Groups","Organize learners by readiness and instructional need."],
  gaps:["Learning Gap Analysis","Find class and individual competency gaps."],
  bridge:["Bridge Lesson Planner","Connect previous learning to new learning."],
  intervention:["Intervention Planner","Plan and record targeted instructional support."],
  reassessment:["Reassessment","Record post-intervention checks and mastery."],
  progress:["Progress Monitoring","Track diagnostic-to-reassessment growth."],
  reports:["Reports & Export","Print reports and download editable documents/data."],
  settings:["Settings","Configure thresholds and manage local data."]
};

function $(sel){return document.querySelector(sel)}
function $all(sel){return [...document.querySelectorAll(sel)]}
function uid(prefix="id"){return prefix+"_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,7)}
function escapeHTML(value=""){return String(value).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function num(v){const n=Number(v);return Number.isFinite(n)?n:0}
function pct(correct,total){return total>0?Math.max(0,Math.min(100,(correct/total)*100)):0}
function fmtPct(v){return `${Math.round(num(v))}%`}
function statusFor(p){
  const r=num(data.settings.ready), d=num(data.settings.developing);
  if(p>=r) return ["Ready","ready"];
  if(p>=d) return ["Developing","developing"];
  return ["Needs Intervention","intervention"];
}
function saveData(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data))}
function loadData(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(raw) return normalize(JSON.parse(raw));
  }catch(e){}
  return structuredClone(defaultData);
}
function normalize(d){
  const x=structuredClone(defaultData);
  Object.assign(x,d||{});
  x.term=Object.assign(structuredClone(defaultData.term),d?.term||{});
  x.settings=Object.assign(structuredClone(defaultData.settings),d?.settings||{});
  for(const k of ["students","competencies","questions","results","interventions","reassessments","bridgeLessons"]) x[k]=Array.isArray(d?.[k])?d[k]:[];
  return x;
}
function toast(message,error=false){
  const el=document.createElement("div");el.className="toast"+(error?" error":"");el.textContent=message;
  $("#toastContainer").appendChild(el);setTimeout(()=>el.remove(),2800);
}
function openModal(title,html,onSave=null){
  $("#modalTitle").textContent=title;$("#modalBody").innerHTML=html;$("#modalBackdrop").classList.remove("hidden");
  $("#modalBody").dataset.hasSave=onSave?"1":"0";
  if(onSave) $("#modalBody").querySelector("[data-modal-save]")?.addEventListener("click",()=>onSave($("#modalBody")));
}
function closeModal(){$("#modalBackdrop").classList.add("hidden");$("#modalBody").innerHTML=""}
$("#modalClose").addEventListener("click",closeModal);
$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});

function render(){
  $("#pageTitle").textContent=viewMeta[currentView][0];
  $("#pageSubtitle").textContent=viewMeta[currentView][1];
  const t=data.term;
  $("#termBadge").textContent=t.subject&&t.grade?`${t.grade} • ${t.subject} • ${t.term}`:"No term set";
  $all(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===currentView));
  const renderers={dashboard:renderDashboard,term:renderTerm,competencies:renderCompetencies,assessment:renderAssessment,students:renderStudents,groups:renderGroups,gaps:renderGaps,bridge:renderBridge,intervention:renderIntervention,reassessment:renderReassessment,progress:renderProgress,reports:renderReports,settings:renderSettings};
  $("#viewContainer").innerHTML=renderers[currentView]();
  bindView();
}
function bindView(){
  $all("[data-action]").forEach(el=>el.addEventListener("click",handleAction));
  $all("[data-view-target]").forEach(el=>el.addEventListener("click",()=>{currentView=el.dataset.viewTarget;closeMobile();render()}));
}
function handleAction(e){
  const a=e.currentTarget.dataset.action;
  const id=e.currentTarget.dataset.id;
  if(a==="newStudent") modalStudent();
  else if(a==="editStudent") modalStudent(id);
  else if(a==="deleteStudent") deleteItem("student",id);
  else if(a==="newCompetency") modalCompetency();
  else if(a==="editCompetency") modalCompetency(id);
  else if(a==="deleteCompetency") deleteItem("competency",id);
  else if(a==="newQuestion") modalQuestion();
  else if(a==="editQuestion") modalQuestion(id);
  else if(a==="deleteQuestion") deleteItem("question",id);
  else if(a==="newBridge") modalBridge();
  else if(a==="editBridge") modalBridge(id);
  else if(a==="deleteBridge") deleteItem("bridge",id);
  else if(a==="newIntervention") modalIntervention();
  else if(a==="editIntervention") modalIntervention(id);
  else if(a==="deleteIntervention") deleteItem("intervention",id);
  else if(a==="newReassessment") modalReassessment();
  else if(a==="deleteReassessment") deleteItem("reassessment",id);
  else if(a==="saveTerm") saveTermForm();
  else if(a==="saveSettings") saveSettingsForm();
  else if(a==="recordResult") modalResult();
  else if(a==="loadDemo") loadDemo();
  else if(a==="clearDemo") clearDemo();
  else if(a==="clearAll") clearAll();
  else if(a==="exportJSON") exportJSON();
  else if(a==="importJSON") $("#importFile").click();
  else if(a==="exportCSV") exportCSV();
  else if(a==="print") window.print();
  else if(a==="exportDoc") exportEditableDoc();
}

function renderDashboard(){
  const rs=data.results, students=data.students;
  const classified=students.map(s=>({...s,...studentSummary(s.id)}));
  const ready=classified.filter(s=>s.status==="Ready").length, dev=classified.filter(s=>s.status==="Developing").length, need=classified.filter(s=>s.status==="Needs Intervention").length;
  const avg=rs.length?rs.reduce((a,r)=>a+num(r.percentage),0)/rs.length:0;
  const compStats=competencyStats();
  const gaps=[...compStats].sort((a,b)=>a.percentage-b.percentage).slice(0,4);
  const strengths=[...compStats].sort((a,b)=>b.percentage-a.percentage).slice(0,3);
  return `
  <div class="hero"><img src="assets/teacher-ed-learning-hub-logo.png" alt="Teacher Ed Learning Hub">
    <div><h2>Term Readiness & Diagnostic Tool</h2><p>Prepare learners for the next term by identifying prerequisite gaps, planning bridge lessons, and monitoring improvement.</p></div>
  </div>
  <div class="page-head"><div><h2>Readiness Dashboard</h2><p>${escapeHTML(data.term.grade)} • ${escapeHTML(data.term.subject)} • ${escapeHTML(data.term.term)}</p></div>
  <div class="actions"><button class="btn btn-gold" data-action="loadDemo">Load Demo Data</button><button class="btn btn-secondary" data-view-target="term">Set Up Term</button></div></div>
  <div class="grid grid-5">
    ${stat("Total Learners",students.length,"Students in this term")}
    ${stat("Ready",ready,"Ready for new-term instruction")}
    ${stat("Developing",dev,"Needs reinforcement")}
    ${stat("Needs Intervention",need,"Targeted support needed")}
    ${stat("Class Readiness",fmtPct(avg),"Average diagnostic result")}
  </div>
  <div class="grid grid-2" style="margin-top:16px">
    <div class="card"><h3>Priority Learning Gaps</h3>${gaps.length?`<div class="list">${gaps.map(c=>`<div class="list-item"><span>${escapeHTML(c.name)}</span><span class="status ${c.percentage>=data.settings.ready?"ready":c.percentage>=data.settings.developing?"developing":"intervention"}">${fmtPct(c.percentage)}</span></div>`).join("")}</div>`:empty("No competency data yet.","Add competencies and diagnostic results to see priority gaps.")}</div>
    <div class="card"><h3>Top Strengths</h3>${strengths.length?`<div class="list">${strengths.map(c=>`<div class="list-item"><span>${escapeHTML(c.name)}</span><span class="status ready">${fmtPct(c.percentage)}</span></div>`).join("")}</div>`:empty("No strength data yet.","Competency-level results will appear here.")}</div>
  </div>
  <div class="grid grid-2" style="margin-top:16px">
    <div class="card"><h3>Instructional Recommendation</h3><div class="callout gold">${recommendation(compStats,classified)}</div></div>
    <div class="card"><h3>Workflow</h3><div class="chips"><span class="chip">1. Diagnose</span><span class="chip">2. Analyze</span><span class="chip">3. Group</span><span class="chip">4. Bridge</span><span class="chip">5. Intervene</span><span class="chip">6. Reassess</span><span class="chip">7. Monitor</span></div></div>
  </div>`;
}
function stat(label,value,hint){return `<div class="card stat"><div class="label">${label}</div><div class="value">${value}</div><div class="hint">${hint}</div></div>`}
function empty(title,text){return `<div class="empty"><strong>${title}</strong><span>${text}</span></div>`}

function renderTerm(){
  const t=data.term;
  return `<div class="page-head"><div><h2>Term Setup</h2><p>Set the instructional context before administering the readiness diagnostic.</p></div></div>
  <div class="card"><div class="form-grid">
    ${input("schoolYear","School Year",t.schoolYear)}${select("term","Term / Quarter",["Term 1","Term 2","Term 3","Quarter 1","Quarter 2","Quarter 3","Quarter 4"],t.term)}
    ${select("grade","Grade Level",["Kindergarten","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12"],t.grade)}
    ${input("subject","Subject / Learning Area",t.subject)}${input("section","Section",t.section)}${input("teacher","Teacher Name",t.teacher)}
    ${input("diagnosticDate","Diagnostic Date",t.diagnosticDate,"date")}${input("previousTerm","Previous Term / Quarter",t.previousTerm)}
  </div><div class="form-actions"><button class="btn btn-primary" data-action="saveTerm">Save Term Setup</button></div></div>
  <div class="card" style="margin-top:16px"><h3>Readiness Approach</h3><div class="callout">Use a short prerequisite diagnostic before new-term instruction. Results should guide review, bridge lessons, and targeted intervention. The readiness thresholds are configurable and should follow your school's adopted assessment policy.</div></div>`;
}
function input(id,label,value="",type="text"){return `<div class="field"><label for="${id}">${label}</label><input id="${id}" type="${type}" value="${escapeHTML(value)}"></div>`}
function select(id,label,options,value=""){return `<div class="field"><label for="${id}">${label}</label><select id="${id}">${options.map(o=>`<option ${o===value?"selected":""}>${escapeHTML(o)}</option>`).join("")}</select></div>`}
function textarea(id,label,value="",full=false){return `<div class="field ${full?"full":""}"><label for="${id}">${label}</label><textarea id="${id}">${escapeHTML(value)}</textarea></div>`}

function saveTermForm(){
  const ids=["schoolYear","term","grade","subject","section","teacher","diagnosticDate","previousTerm"];
  ids.forEach(k=>data.term[k]=$("#"+k)?.value.trim()||"");
  saveData();toast("Term setup saved.");render();
}

function renderCompetencies(){
  return `<div class="page-head"><div><h2>Competency Manager</h2><p>Define prerequisite skills that support the new term.</p></div><div class="actions"><button class="btn btn-primary" data-action="newCompetency">+ Add Competency</button></div></div>
  ${data.competencies.length?`<div class="table-wrap"><table class="table"><thead><tr><th>ID</th><th>Prerequisite / Previous Learning</th><th>New-Term Connection</th><th>Priority</th><th>Actions</th></tr></thead><tbody>${data.competencies.map(c=>`<tr><td>${escapeHTML(c.code)}</td><td><strong>${escapeHTML(c.prerequisite)}</strong><br><span class="small muted">${escapeHTML(c.description)}</span></td><td>${escapeHTML(c.newTerm)}</td><td>${escapeHTML(c.priority)}</td><td><div class="actions"><button class="btn btn-secondary" data-action="editCompetency" data-id="${c.id}">Edit</button><button class="btn btn-danger" data-action="deleteCompetency" data-id="${c.id}">Delete</button></div></td></tr>`).join("")}</tbody></table></div>`:empty("No competencies added yet.","Start by adding the prerequisite skills learners need for the new term.")}`;
}
function modalCompetency(id=null){
  const c=data.competencies.find(x=>x.id===id)||{code:"",prerequisite:"",newTerm:"",description:"",priority:"Normal"};
  openModal(id?"Edit Competency":"Add Competency",`<div class="form-grid">${input("mCode","Competency ID",c.code)}${select("mPriority","Priority",["High","Normal","Low"],c.priority)}${input("mPrereq","Previous-Term Competency / Prerequisite Skill",c.prerequisite)}${input("mNew","New-Term Connection",c.newTerm)}${textarea("mDesc","Description",c.description,true)}</div><div class="form-actions"><button class="btn btn-secondary" data-modal-cancel>Cancel</button><button class="btn btn-primary" data-modal-save>Save Competency</button></div>`,()=>{
    const obj={id:id||uid("comp"),code:$("#mCode").value.trim()||`C${data.competencies.length+1}`,prerequisite:$("#mPrereq").value.trim(),newTerm:$("#mNew").value.trim(),description:$("#mDesc").value.trim(),priority:$("#mPriority").value};
    if(!obj.prerequisite||!obj.newTerm){toast("Please enter the prerequisite and new-term connection.",true);return}
    if(id){const i=data.competencies.findIndex(x=>x.id===id);data.competencies[i]=obj}else data.competencies.push(obj);
    saveData();closeModal();toast("Competency saved.");render();
  });
  $("#modalBody").querySelector("[data-modal-cancel]").addEventListener("click",closeModal);
}

function renderAssessment(){
  return `<div class="page-head"><div><h2>Diagnostic Assessment</h2><p>Create a prerequisite assessment and link every question to a competency.</p></div><div class="actions"><button class="btn btn-primary" data-action="newQuestion">+ Add Question</button><button class="btn btn-gold" data-action="recordResult">Record Result</button></div></div>
  <div class="grid grid-3"><div class="card"><h3>Items</h3><div class="stat"><div class="value">${data.questions.length}</div><div class="hint">Questions in current diagnostic</div></div></div><div class="card"><h3>Mastery Criterion</h3><div class="stat"><div class="value">${fmtPct(data.settings.mastery)}</div><div class="hint">Configurable; follow school policy</div></div></div><div class="card"><h3>Linked Competencies</h3><div class="stat"><div class="value">${new Set(data.questions.map(q=>q.competencyId).filter(Boolean)).size}</div><div class="hint">Competencies represented</div></div></div></div>
  <div class="card" style="margin-top:16px">${data.questions.length?`<div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Question</th><th>Type</th><th>Competency</th><th>Points</th><th>Actions</th></tr></thead><tbody>${data.questions.map((q,i)=>`<tr><td>${i+1}</td><td>${escapeHTML(q.text)}</td><td>${escapeHTML(q.type)}</td><td>${escapeHTML(compName(q.competencyId))}</td><td>${q.points}</td><td><div class="actions"><button class="btn btn-secondary" data-action="editQuestion" data-id="${q.id}">Edit</button><button class="btn btn-danger" data-action="deleteQuestion" data-id="${q.id}">Delete</button></div></td></tr>`).join("")}</tbody></table></div>`:empty("No diagnostic questions yet.","Add questions and assign each one to a prerequisite competency.")}</div>`;
}
function compName(id){return data.competencies.find(c=>c.id===id)?.prerequisite||"Unassigned"}
function modalQuestion(id=null){
  const q=data.questions.find(x=>x.id===id)||{text:"",type:"Multiple Choice",competencyId:data.competencies[0]?.id||"",choices:["","","",""],answer:"",points:1};
  const types=["Multiple Choice","True/False","Identification","Short Answer","Problem Solving","Matching"];
  openModal(id?"Edit Question":"Add Question",`<div class="form-grid">${select("qType","Question Type",types,q.type)}${select("qComp","Competency",data.competencies.map(c=>c.id),q.competencyId)}</div>${textarea("qText","Question Text",q.text,true)}<div id="choicesArea"></div><div class="form-grid">${input("qAnswer","Correct Answer",q.answer)}${input("qPoints","Points",q.points,"number")}</div><div class="form-actions"><button class="btn btn-secondary" data-modal-cancel>Cancel</button><button class="btn btn-primary" data-modal-save>Save Question</button></div>`,()=>{
    const obj={id:id||uid("q"),text:$("#qText").value.trim(),type:$("#qType").value,competencyId:$("#qComp").value,answer:$("#qAnswer").value.trim(),points:Math.max(1,num($("#qPoints").value)),choices:[...$("#choicesArea").querySelectorAll("input")].map(x=>x.value.trim()).filter(Boolean)};
    if(!obj.text||!obj.competencyId||!obj.answer){toast("Question text, competency, and correct answer are required.",true);return}
    if(id)data.questions[data.questions.findIndex(x=>x.id===id)]=obj;else data.questions.push(obj);
    saveData();closeModal();toast("Question saved.");render();
  });
  const updateChoices=()=>{
    const type=$("#qType").value, area=$("#choicesArea");
    if(type==="Multiple Choice"){const old=q.choices?.length? q.choices:["","","",""];area.innerHTML=`<div class="form-grid">${old.slice(0,4).map((v,i)=>input(`choice${i}`,`Choice ${String.fromCharCode(65+i)}`,v)).join("")}</div>`}
    else area.innerHTML="";
  };
  $("#qType").addEventListener("change",updateChoices);updateChoices();
  $("#modalBody").querySelector("[data-modal-cancel]").addEventListener("click",closeModal);
}

function studentSummary(id){
  const r=data.results.filter(x=>x.studentId===id).sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
  if(!r)return {score:0,percentage:0,status:"Not Assessed"};
  const [status]=statusFor(r.percentage);return {score:r.score,total:r.total,percentage:r.percentage,status};
}
function renderStudents(){
  return `<div class="page-head"><div><h2>Student Profiles</h2><p>Record learners and view their current readiness status.</p></div><div class="actions"><button class="btn btn-primary" data-action="newStudent">+ Add Student</button></div></div>
  ${data.students.length?`<div class="table-wrap"><table class="table"><thead><tr><th>Student</th><th>Diagnostic</th><th>Readiness</th><th>Learning Gaps</th><th>Actions</th></tr></thead><tbody>${data.students.map(s=>{const x=studentSummary(s.id);return `<tr><td><strong>${escapeHTML(s.name)}</strong><br><span class="small muted">${escapeHTML(s.code||"")}</span></td><td>${x.total?`${x.score}/${x.total} • ${fmtPct(x.percentage)}`:"Not assessed"}</td><td>${x.status==="Not Assessed"?`<span class="status developing">Not Assessed</span>`:`<span class="status ${statusFor(x.percentage)[1]}">${x.status}</span>`}</td><td>${escapeHTML(studentGaps(s.id).slice(0,2).map(g=>g.name).join(", ")||"None identified")}</td><td><div class="actions"><button class="btn btn-secondary" data-action="editStudent" data-id="${s.id}">Edit</button><button class="btn btn-danger" data-action="deleteStudent" data-id="${s.id}">Delete</button></div></td></tr>`}).join("")}</tbody></table></div>`:empty("No students added yet.","Add your learners before recording diagnostic results.")}`;
}
function modalStudent(id=null){
  const s=data.students.find(x=>x.id===id)||{name:"",code:"",notes:""};
  openModal(id?"Edit Student":"Add Student",`<div class="form-grid">${input("sName","Student Name",s.name)}${input("sCode","Student ID / Code (optional)",s.code)}${textarea("sNotes","Teacher Notes",s.notes,true)}</div><div class="form-actions"><button class="btn btn-secondary" data-modal-cancel>Cancel</button><button class="btn btn-primary" data-modal-save>Save Student</button></div>`,()=>{
    const obj={id:id||uid("stu"),name:$("#sName").value.trim(),code:$("#sCode").value.trim(),notes:$("#sNotes").value.trim()};
    if(!obj.name){toast("Please enter the student's name.",true);return}
    if(id)data.students[data.students.findIndex(x=>x.id===id)]=obj;else data.students.push(obj);
    saveData();closeModal();toast("Student saved.");render();
  });
  $("#modalBody").querySelector("[data-modal-cancel]").addEventListener("click",closeModal);
}

function renderGroups(){
  const groups={Ready:[],Developing:[], "Needs Intervention":[],"Not Assessed":[]};
  data.students.forEach(s=>groups[studentSummary(s.id).status].push(s));
  return `<div class="page-head"><div><h2>Readiness Groups</h2><p>Use these groups to plan differentiated support.</p></div></div>
  <div class="grid grid-3">${["Ready","Developing","Needs Intervention"].map(k=>`<div class="card"><h3>${k}</h3><div class="stat"><div class="value">${groups[k].length}</div><div class="hint">${k==="Ready"?"Proceed with new learning.":k==="Developing"?"Reinforce prerequisites.":"Targeted intervention needed."}</div></div><div class="list" style="margin-top:12px">${groups[k].length?groups[k].map(s=>`<div class="list-item"><span>${escapeHTML(s.name)}</span><span class="small">${fmtPct(studentSummary(s.id).percentage)}</span></div>`).join(""):empty("No learners","This group is empty.")}</div></div>`).join("")}</div>
  <div class="card" style="margin-top:16px"><h3>Grouping Guidance</h3><div class="callout">Use readiness groups flexibly. A learner may need support in one competency and be ready in another. Grouping should inform instruction, not permanently label learners.</div></div>`;
}

function competencyStats(){
  return data.competencies.map(c=>{
    const qs=data.questions.filter(q=>q.competencyId===c.id);
    const relevant=data.results.flatMap(r=>(r.answers||[]).filter(a=>a.competencyId===c.id));
    const total=relevant.length||0, correct=relevant.filter(a=>a.correct).length;
    return {id:c.id,name:c.prerequisite,total,correct,wrong:Math.max(0,total-correct),percentage:pct(correct,total)};
  }).filter(c=>c.total>0);
}
function studentGaps(studentId){
  return data.competencies.map(c=>{
    const a=data.results.filter(r=>r.studentId===studentId).flatMap(r=>(r.answers||[]).filter(x=>x.competencyId===c.id));
    if(!a.length)return null;
    return {name:c.prerequisite,percentage:pct(a.filter(x=>x.correct).length,a.length)};
  }).filter(Boolean).sort((a,b)=>a.percentage-b.percentage);
}
function renderGaps(){
  const stats=competencyStats().sort((a,b)=>a.percentage-b.percentage);
  return `<div class="page-head"><div><h2>Learning Gap Analysis</h2><p>Analyze results by prerequisite competency, not just overall score.</p></div></div>
  <div class="card">${stats.length?`<div class="table-wrap"><table class="table"><thead><tr><th>Competency</th><th>Correct</th><th>Wrong</th><th>% Correct</th><th>Status</th><th>Priority</th></tr></thead><tbody>${stats.map(c=>{const [st,cl]=statusFor(c.percentage);return `<tr><td><strong>${escapeHTML(c.name)}</strong></td><td>${c.correct}</td><td>${c.wrong}</td><td>${fmtPct(c.percentage)}</td><td><span class="status ${cl}">${st}</span></td><td>${c.percentage<data.settings.developing?"High":c.percentage<data.settings.ready?"Medium":"Low"}</td></tr>`}).join("")}</tbody></table></div>`:empty("No analysis available.","Record diagnostic results with competency-linked answers first.")}</div>`;
}
function recommendation(stats,students){
  if(!stats.length)return "Start with the Term Setup, add prerequisite competencies, and record a short diagnostic before beginning the new term.";
  const p=stats[0];
  if(p.percentage<data.settings.developing)return `Prioritize <strong>${escapeHTML(p.name)}</strong>. Consider a focused bridge lesson, concrete/pictorial representations where appropriate, guided practice, and a short follow-up check before expecting independent performance.`;
  if(p.percentage<data.settings.ready)return `Reinforce <strong>${escapeHTML(p.name)}</strong> with a short review or bridge lesson while beginning new learning with additional support.`;
  return "The current competency results indicate good readiness. Proceed with the new-term learning while continuing formative checks and enrichment where appropriate.";
}

function renderBridge(){
  return `<div class="page-head"><div><h2>Bridge Lesson Planner</h2><p>Previous Learning → Prerequisite Skill → New Learning</p></div><div class="actions"><button class="btn btn-primary" data-action="newBridge">+ New Bridge Lesson</button></div></div>
  ${data.bridgeLessons.length?`<div class="grid grid-2">${data.bridgeLessons.map(b=>`<div class="card"><h3>${escapeHTML(b.title)}</h3><p class="small muted">${escapeHTML(b.competency)}</p><div class="callout">${escapeHTML(b.objective)}</div><div class="actions" style="margin-top:12px"><button class="btn btn-secondary" data-action="editBridge" data-id="${b.id}">Edit</button><button class="btn btn-gold" data-action="exportDoc" data-id="${b.id}">Download Word Document</button><button class="btn btn-danger" data-action="deleteBridge" data-id="${b.id}">Delete</button></div></div>`).join("")}</div>`:empty("No bridge lessons yet.","Create a short lesson that addresses the prerequisite gap before or alongside the new competency.")}`;
}
function modalBridge(id=null){
  const b=data.bridgeLessons.find(x=>x.id===id)||{title:"",competency:"",objective:"",review:"",connect:"",mini:"",model:"",guided:"",independent:"",quick:"",follow:"",time:"20–30 minutes"};
  openModal(id?"Edit Bridge Lesson":"New Bridge Lesson",`<div class="form-grid">${input("bTitle","Lesson Title",b.title)}${input("bComp","Competency / Learning Gap",b.competency)}${input("bTime","Estimated Time",b.time)}${input("bObjective","Learning Objective",b.objective)}</div>${textarea("bReview","II. Review",b.review,true)}${textarea("bConnect","III. Connect Previous Learning",b.connect,true)}${textarea("bMini","IV. Teach Missing Prerequisite",b.mini,true)}${textarea("bModel","Teacher Modeling",b.model,true)}${textarea("bGuided","V. Guided Practice",b.guided,true)}${textarea("bIndependent","VI. Independent Practice",b.independent,true)}${textarea("bQuick","VII. Quick Check",b.quick,true)}${textarea("bFollow","VIII. Transition / Follow-Up",b.follow,true)}<div class="form-actions"><button class="btn btn-secondary" data-modal-cancel>Cancel</button><button class="btn btn-primary" data-modal-save>Save Lesson</button></div>`,()=>{
    const obj={id:id||uid("bridge"),title:$("#bTitle").value.trim(),competency:$("#bComp").value.trim(),objective:$("#bObjective").value.trim(),time:$("#bTime").value.trim(),review:$("#bReview").value.trim(),connect:$("#bConnect").value.trim(),mini:$("#bMini").value.trim(),model:$("#bModel").value.trim(),guided:$("#bGuided").value.trim(),independent:$("#bIndependent").value.trim(),quick:$("#bQuick").value.trim(),follow:$("#bFollow").value.trim()};
    if(!obj.title||!obj.objective){toast("Lesson title and objective are required.",true);return}
    if(id)data.bridgeLessons[data.bridgeLessons.findIndex(x=>x.id===id)]=obj;else data.bridgeLessons.push(obj);
    saveData();closeModal();toast("Bridge lesson saved.");render();
  });
  $("#modalBody").querySelector("[data-modal-cancel]").addEventListener("click",closeModal);
}

function renderIntervention(){
  return `<div class="page-head"><div><h2>Intervention Planner</h2><p>Plan targeted instructional support based on identified learning gaps.</p></div><div class="actions"><button class="btn btn-primary" data-action="newIntervention">+ Add Intervention</button></div></div>
  ${data.interventions.length?`<div class="table-wrap"><table class="table"><thead><tr><th>Student</th><th>Competency / Gap</th><th>Strategy</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>${data.interventions.map(x=>`<tr><td>${escapeHTML(studentName(x.studentId))}</td><td>${escapeHTML(x.competency)}</td><td>${escapeHTML(x.strategy)}</td><td>${escapeHTML(x.date)}</td><td>${escapeHTML(x.status)}</td><td><div class="actions"><button class="btn btn-secondary" data-action="editIntervention" data-id="${x.id}">Edit</button><button class="btn btn-danger" data-action="deleteIntervention" data-id="${x.id}">Delete</button></div></td></tr>`).join("")}</tbody></table></div>`:empty("No intervention records yet.","Add an intervention after identifying a specific prerequisite gap.")}`;
}
function studentName(id){return data.students.find(s=>s.id===id)?.name||"Unknown student"}
function modalIntervention(id=null){
  const x=data.interventions.find(i=>i.id===id)||{studentId:data.students[0]?.id||"",competency:"",strategy:"Reteaching",date:new Date().toISOString().slice(0,10),duration:"20–30 minutes",frequency:"As needed",notes:"",materials:"",status:"Planned",followUp:""};
  const strategies=["Reteaching","Small-group instruction","One-on-one instruction","Guided practice","Peer-assisted learning","Manipulatives","Visual aids","Worked examples","Interactive game","Reading support","Vocabulary support","Practice worksheet","Digital activity","Other"];
  openModal(id?"Edit Intervention":"Add Intervention",`<div class="form-grid">${select("iStudent","Student",data.students.map(s=>s.id),x.studentId)}${input("iComp","Competency / Learning Gap",x.competency)}${select("iStrategy","Intervention Strategy",strategies,x.strategy)}${input("iDate","Date",x.date,"date")}${input("iDuration","Duration",x.duration)}${input("iFrequency","Frequency",x.frequency)}${select("iStatus","Status",["Planned","In Progress","Completed","Needs Follow-Up"],x.status)}${input("iFollow","Follow-Up Date",x.followUp,"date")}${textarea("iMaterials","Materials Used",x.materials,true)}${textarea("iNotes","Teacher Notes",x.notes,true)}</div><div class="form-actions"><button class="btn btn-secondary" data-modal-cancel>Cancel</button><button class="btn btn-primary" data-modal-save>Save Intervention</button></div>`,()=>{
    const obj={id:id||uid("int"),studentId:$("#iStudent").value,competency:$("#iComp").value.trim(),strategy:$("#iStrategy").value,date:$("#iDate").value,duration:$("#iDuration").value.trim(),frequency:$("#iFrequency").value.trim(),status:$("#iStatus").value,followUp:$("#iFollow").value,materials:$("#iMaterials").value.trim(),notes:$("#iNotes").value.trim()};
    if(!obj.studentId||!obj.competency){toast("Student and competency/learning gap are required.",true);return}
    if(id)data.interventions[data.interventions.findIndex(i=>i.id===id)]=obj;else data.interventions.push(obj);
    saveData();closeModal();toast("Intervention saved.");render();
  });
  $("#modalBody").querySelector("[data-modal-cancel]").addEventListener("click",closeModal);
}

function renderReassessment(){
  return `<div class="page-head"><div><h2>Reassessment</h2><p>Record post-intervention results and percentage-point improvement.</p></div><div class="actions"><button class="btn btn-primary" data-action="newReassessment">+ Record Reassessment</button></div></div>
  ${data.reassessments.length?`<div class="table-wrap"><table class="table"><thead><tr><th>Student</th><th>Target</th><th>Diagnostic</th><th>Reassessment</th><th>Improvement</th><th>Status</th><th>Actions</th></tr></thead><tbody>${data.reassessments.map(r=>`<tr><td>${escapeHTML(studentName(r.studentId))}</td><td>${escapeHTML(r.competency)}</td><td>${fmtPct(r.prePct)}</td><td>${r.postScore}/${r.postTotal} • ${fmtPct(r.postPct)}</td><td>${r.improvement>=0?"+":""}${Math.round(r.improvement)} percentage points</td><td><span class="status ${statusFor(r.postPct)[1]}">${statusFor(r.postPct)[0]}</span></td><td><button class="btn btn-danger" data-action="deleteReassessment" data-id="${r.id}">Delete</button></td></tr>`).join("")}</tbody></table></div>`:empty("No reassessment records yet.","Record a post-intervention check after targeted support.")}`;
}
function modalReassessment(){
  openModal("Record Reassessment",`<div class="form-grid">${select("rStudent","Student",data.students.map(s=>s.id),data.students[0]?.id||"")}${input("rComp","Target Competency","")}${input("rPre","Diagnostic Percentage","0","number")}${input("rPostScore","Reassessment Score","0","number")}${input("rPostTotal","Reassessment Total","10","number")}${input("rSessions","Intervention Sessions","1","number")}${textarea("rIntervention","Intervention Provided","",true)}${textarea("rNext","Next Action","",true)}</div><div class="form-actions"><button class="btn btn-secondary" data-modal-cancel>Cancel</button><button class="btn btn-primary" data-modal-save>Save Reassessment</button></div>`,()=>{
    const postScore=Math.max(0,num($("#rPostScore").value)), postTotal=Math.max(0,num($("#rPostTotal").value)), pre=Math.max(0,Math.min(100,num($("#rPre").value))), post=pct(postScore,postTotal);
    if(!$("#rStudent").value||!$("#rComp").value.trim()||postTotal<=0){toast("Student, target competency, and a total greater than zero are required.",true);return}
    const obj={id:uid("re"),studentId:$("#rStudent").value,competency:$("#rComp").value.trim(),prePct:pre,postScore,postTotal,postPct:post,improvement:post-pre,sessions:Math.max(0,num($("#rSessions").value)),intervention:$("#rIntervention").value.trim(),next:$("#rNext").value.trim(),date:new Date().toISOString().slice(0,10)};
    data.reassessments.push(obj);saveData();closeModal();toast("Reassessment saved.");render();
  });
  $("#modalBody").querySelector("[data-modal-cancel]").addEventListener("click",closeModal);
}

function modalResult(){
  if(!data.students.length){toast("Add students before recording results.",true);return}
  if(!data.questions.length){toast("Add diagnostic questions before recording results.",true);return}
  const s=data.students[0];
  const answerInputs=data.questions.map((q,i)=>`<div class="card" style="padding:12px;margin-bottom:8px"><strong>${i+1}. ${escapeHTML(q.text)}</strong><div class="small muted">${escapeHTML(compName(q.competencyId))}</div><div class="field" style="margin-top:7px"><label>Correct?</label><select class="answer-select" data-qid="${q.id}"><option value="1">Correct</option><option value="0">Incorrect</option></select></div></div>`).join("");
  openModal("Record Diagnostic Result",`<div class="form-grid">${select("resStudent","Student",data.students.map(x=>x.id),s.id)}${input("resDate","Assessment Date",new Date().toISOString().slice(0,10),"date")}</div><div style="margin-top:12px">${answerInputs}</div><div class="form-actions"><button class="btn btn-secondary" data-modal-cancel>Cancel</button><button class="btn btn-primary" data-modal-save>Save Result</button></div>`,()=>{
    const answers=[...$("#modalBody").querySelectorAll(".answer-select")].map(sel=>{const q=data.questions.find(x=>x.id===sel.dataset.qid);return {questionId:q.id,competencyId:q.competencyId,correct:sel.value==="1"}});
    const score=answers.filter(a=>a.correct).length,total=answers.length;
    data.results.push({id:uid("result"),studentId:$("#resStudent").value,date:$("#resDate").value,score,total,percentage:pct(score,total),answers});
    saveData();closeModal();toast("Diagnostic result saved.");render();
  });
  $("#modalBody").querySelector("[data-modal-cancel]").addEventListener("click",closeModal);
}

function renderProgress(){
  const rs=data.reassessments;
  return `<div class="page-head"><div><h2>Progress Monitoring</h2><p>Track movement from diagnostic baseline to post-intervention reassessment.</p></div></div>
  ${rs.length?`<div class="grid grid-2">${rs.map(r=>`<div class="card"><h3>${escapeHTML(studentName(r.studentId))}</h3><p class="small muted">${escapeHTML(r.competency)}</p><div class="kpi-row"><div>Diagnostic</div><div class="bar"><div class="progress"><span style="width:${Math.max(0,Math.min(100,r.prePct))}%"></span></div></div><b>${fmtPct(r.prePct)}</b></div><div class="kpi-row" style="margin-top:9px"><div>Reassessment</div><div class="bar"><div class="progress"><span style="width:${Math.max(0,Math.min(100,r.postPct))}%"></span></div></div><b>${fmtPct(r.postPct)}</b></div><div class="callout" style="margin-top:12px">${r.improvement>=0?"Improvement":"Change"}: <strong>${r.improvement>=0?"+":""}${Math.round(r.improvement)} percentage points</strong></div></div>`).join("")}</div>`:empty("No progress data yet.","Record reassessment results to see learner growth.")}`;
}

function renderReports(){
  return `<div class="page-head"><div><h2>Reports & Export</h2><p>Print or download editable copies for offline work.</p></div><div class="actions"><button class="btn btn-secondary" data-action="print">Print / Save as PDF</button><button class="btn btn-gold" data-action="exportDoc">Download Editable Word Document</button></div></div>
  <div class="grid grid-2">
    <div class="card"><h3>Class Term Readiness Report</h3><p class="small muted">Includes class readiness, learner groups, priority competencies, and recommended action.</p><button class="btn btn-primary" data-action="print">Print Report</button></div>
    <div class="card"><h3>Editable Offline Document</h3><p class="small muted">Downloads a Microsoft Word-compatible <strong>.doc</strong> document that can be opened and edited offline in Word or another compatible word processor. No internet connection is required after the file is downloaded.</p><button class="btn btn-gold" data-action="exportDoc">Download .DOC</button></div>
    <div class="card"><h3>CSV Data Export</h3><p class="small muted">Export learner readiness and assessment records for spreadsheet use.</p><button class="btn btn-secondary" data-action="exportCSV">Download CSV</button></div>
    <div class="card"><h3>JSON Backup</h3><p class="small muted">Back up the complete local tool data and restore it later.</p><div class="actions"><button class="btn btn-secondary" data-action="exportJSON">Export Backup</button><button class="btn btn-secondary" data-action="importJSON">Import Backup</button></div><input type="file" id="importFile" accept=".json,application/json" class="hidden" style="display:none"></div>
  </div>
  <div class="card" style="margin-top:16px"><div class="print-header"><h1>Teacher Ed Learning Hub</h1></div><h3>Report Preview</h3>${reportHTML()}</div>`;
}
function reportHTML(){
  const classified=data.students.map(s=>({...s,...studentSummary(s.id)}));
  const avg=classified.length?classified.filter(s=>s.status!=="Not Assessed").reduce((a,s)=>a+s.percentage,0)/Math.max(1,classified.filter(s=>s.status!=="Not Assessed").length):0;
  const stats=competencyStats().sort((a,b)=>a.percentage-b.percentage);
  return `<div class="grid grid-4">${stat("Learners",data.students.length,"")}${stat("Ready",classified.filter(s=>s.status==="Ready").length,"")}${stat("Developing",classified.filter(s=>s.status==="Developing").length,"")}${stat("Intervention",classified.filter(s=>s.status==="Needs Intervention").length,"")}</div><div class="callout" style="margin-top:14px"><strong>Class Readiness:</strong> ${fmtPct(avg)}<br>${recommendation(stats,classified)}</div>${stats.length?`<h4 style="margin-top:18px">Priority Competencies</h4><div class="table-wrap"><table class="table"><thead><tr><th>Competency</th><th>% Correct</th><th>Status</th></tr></thead><tbody>${stats.slice(0,8).map(c=>`<tr><td>${escapeHTML(c.name)}</td><td>${fmtPct(c.percentage)}</td><td>${statusFor(c.percentage)[0]}</td></tr>`).join("")}</tbody></table></div>`:""}<p style="margin-top:24px">Teacher: ____________________________ &nbsp;&nbsp;&nbsp; Date: __________________</p>`;
}

function renderSettings(){
  return `<div class="page-head"><div><h2>Settings</h2><p>Configure readiness thresholds and manage local data.</p></div></div>
  <div class="grid grid-2">
    <div class="card"><h3>Assessment Settings</h3><div class="form-grid">${input("setMastery","Mastery Criterion (%)",data.settings.mastery,"number")}${input("setReady","Ready Threshold (%)",data.settings.ready,"number")}${input("setDeveloping","Developing Threshold (%)",data.settings.developing,"number")}</div><div class="callout" style="margin-top:14px">These thresholds are configurable. Use the assessment and mastery criteria adopted by your school.</div><div class="form-actions"><button class="btn btn-primary" data-action="saveSettings">Save Settings</button></div></div>
    <div class="card"><h3>Local Data</h3><p class="small muted">This static version stores records in this browser using LocalStorage. Export a JSON backup before changing devices or clearing browser data.</p><div class="actions"><button class="btn btn-secondary" data-action="exportJSON">Export Backup</button><button class="btn btn-secondary" data-action="importJSON">Import Backup</button><button class="btn btn-danger" data-action="clearAll">Clear All Data</button></div><input type="file" id="importFile" accept=".json,application/json" style="display:none"></div>
  </div>
  <div class="card" style="margin-top:16px"><h3>Privacy Reminder</h3><div class="callout">Store learner information securely and follow your school's applicable data privacy and records-management policies.</div></div>`;
}
function saveSettingsForm(){
  const mastery=Math.max(0,Math.min(100,num($("#setMastery").value))),ready=Math.max(0,Math.min(100,num($("#setReady").value))),developing=Math.max(0,Math.min(100,num($("#setDeveloping").value)));
  if(developing>ready){toast("Developing threshold must not be higher than the Ready threshold.",true);return}
  data.settings={mastery,ready,developing};saveData();toast("Settings saved.");render();
}

function deleteItem(type,id){
  const labels={student:"student",competency:"competency",question:"question",bridge:"bridge lesson",intervention:"intervention",reassessment:"reassessment"};
  if(!confirm(`Are you sure you want to delete this ${labels[type]}?`))return;
  const map={student:"students",competency:"competencies",question:"questions",bridge:"bridgeLessons",intervention:"interventions",reassessment:"reassessments"};
  data[map[type]]=data[map[type]].filter(x=>x.id!==id);saveData();toast("Deleted.");render();
}
function loadDemo(){
  if(data.demo && data.students.length){toast("Demo data is already loaded.");return}
  data.demo=true;
  data.competencies=[
    {id:"c1",code:"C1",prerequisite:"Place Value",newTerm:"Multi-digit Operations",description:"Read, compare, and understand digit values.",priority:"Normal"},
    {id:"c2",code:"C2",prerequisite:"Addition",newTerm:"Multi-step Operations",description:"Add whole numbers accurately.",priority:"Normal"},
    {id:"c3",code:"C3",prerequisite:"Subtraction",newTerm:"Multi-step Operations",description:"Subtract with regrouping.",priority:"High"},
    {id:"c4",code:"C4",prerequisite:"Word Problems",newTerm:"Problem Solving",description:"Identify known/unknown information and select operations.",priority:"High"}
  ];
  data.students=["Ana Santos","Ben Cruz","Carlo Reyes","Dina Garcia","Eli Ramos"].map((name,i)=>({id:"s"+i,name,code:"S"+(i+1),notes:""}));
  data.questions=Array.from({length:10},(_,i)=>({id:"q"+i,text:["What is the value of 5 in 352?","245 + 132 = ?","What is 600 − 275?","Which digit is in the hundreds place?","125 + 75 = ?","A class has 48 books and gets 25 more. How many?","What is 900 − 450?","Write 407 in expanded form.","Maria has 75 pesos and spends 28. How much remains?","Which operation helps solve a joining problem?"][i],type:"Multiple Choice",competencyId:["c1","c2","c3","c1","c2","c4","c3","c1","c4","c4"][i],answer:"A",points:1,choices:["A","B","C","D"]}));
  const scores=[8,7,6,9,5], comps=["c1","c2","c3","c1","c2","c4","c3","c1","c4","c4"];
  data.results=data.students.map((s,si)=>{const answers=data.questions.map((q,qi)=>({questionId:q.id,competencyId:q.competencyId,correct:(qi+si)%10 < scores[si]}));const score=answers.filter(a=>a.correct).length;return {id:uid("r"),studentId:s.id,date:data.term.diagnosticDate,score,total:10,percentage:pct(score,10),answers}});
  data.reassessments=[{id:"demo-re",studentId:"s2",competency:"Subtraction",prePct:60,postScore:8,postTotal:10,postPct:80,improvement:20,sessions:2,intervention:"Small-group guided practice",next:"Continue formative checks",date:data.term.diagnosticDate}];
  saveData();toast("Demo data loaded.");render();
}
function clearDemo(){
  if(!data.demo){toast("No demo data is marked.");return}
  if(!confirm("Clear demo data? This will reset the tool to a blank state."))return;
  localStorage.removeItem(STORAGE_KEY);data=structuredClone(defaultData);saveData();toast("Demo data cleared.");render();
}
function clearAll(){
  if(!confirm("Clear ALL local tool data? Export a backup first if you need the records."))return;
  localStorage.removeItem(STORAGE_KEY);data=structuredClone(defaultData);saveData();toast("All local data cleared.");render();
}
function exportJSON(){
  downloadBlob(JSON.stringify(data,null,2),"teacher-ed-term-readiness-backup.json","application/json");
}
function csvCell(v){return `"${String(v??"").replace(/"/g,'""')}"`}
function exportCSV(){
  const rows=[["Student","Code","Score","Total","Percentage","Readiness"]];
  data.students.forEach(s=>{const x=studentSummary(s.id);rows.push([s.name,s.code,x.score,x.total,x.percentage,x.status])});
  downloadBlob(rows.map(r=>r.map(csvCell).join(",")).join("\r\n"),"teacher-ed-term-readiness.csv","text/csv;charset=utf-8");
}
function downloadBlob(content,filename,type){
  const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportEditableDoc(id=null){
  const bridge=id?data.bridgeLessons.find(x=>x.id===id):null;
  const t=data.term;
  let body="";
  if(bridge){
    body=`<h1>Teacher Ed Learning Hub</h1><h2>Bridge Lesson Plan</h2><p><b>Lesson Title:</b> ${escapeHTML(bridge.title)}</p><p><b>Grade:</b> ${escapeHTML(t.grade)} &nbsp; <b>Subject:</b> ${escapeHTML(t.subject)}</p><p><b>Competency / Learning Gap:</b> ${escapeHTML(bridge.competency)}</p><p><b>Estimated Time:</b> ${escapeHTML(bridge.time)}</p><h3>I. Objective</h3><p>${escapeHTML(bridge.objective)}</p><h3>II. Review</h3><p>${escapeHTML(bridge.review)}</p><h3>III. Connect Previous Learning</h3><p>${escapeHTML(bridge.connect)}</p><h3>IV. Teach Missing Prerequisite</h3><p>${escapeHTML(bridge.mini)}</p><h3>Teacher Modeling</h3><p>${escapeHTML(bridge.model)}</p><h3>V. Guided Practice</h3><p>${escapeHTML(bridge.guided)}</p><h3>VI. Independent Practice</h3><p>${escapeHTML(bridge.independent)}</p><h3>VII. Quick Check</h3><p>${escapeHTML(bridge.quick)}</p><h3>VIII. Transition / Follow-Up</h3><p>${escapeHTML(bridge.follow)}</p><p style="margin-top:40px">Teacher: ____________________________ &nbsp;&nbsp; Date: __________________</p>`;
  }else{
    const classified=data.students.map(s=>({...s,...studentSummary(s.id)}));
    const avg=classified.filter(s=>s.status!=="Not Assessed").reduce((a,s)=>a+s.percentage,0)/Math.max(1,classified.filter(s=>s.status!=="Not Assessed").length);
    const stats=competencyStats().sort((a,b)=>a.percentage-b.percentage);
    body=`<h1>Teacher Ed Learning Hub</h1><h2>Term Readiness & Diagnostic Report</h2><p><b>School Year:</b> ${escapeHTML(t.schoolYear)}</p><p><b>Term:</b> ${escapeHTML(t.term)} &nbsp; <b>Grade:</b> ${escapeHTML(t.grade)} &nbsp; <b>Subject:</b> ${escapeHTML(t.subject)}</p><p><b>Section:</b> ${escapeHTML(t.section)} &nbsp; <b>Teacher:</b> ${escapeHTML(t.teacher)}</p><h3>Class Readiness</h3><p>${fmtPct(avg)}</p><table border="1" cellspacing="0" cellpadding="6"><tr><th>Student</th><th>Score</th><th>Percentage</th><th>Status</th></tr>${classified.map(s=>`<tr><td>${escapeHTML(s.name)}</td><td>${s.score}/${s.total||0}</td><td>${fmtPct(s.percentage)}</td><td>${escapeHTML(s.status)}</td></tr>`).join("")}</table><h3>Priority Competencies</h3><table border="1" cellspacing="0" cellpadding="6"><tr><th>Competency</th><th>% Correct</th><th>Status</th></tr>${stats.slice(0,10).map(c=>`<tr><td>${escapeHTML(c.name)}</td><td>${fmtPct(c.percentage)}</td><td>${escapeHTML(statusFor(c.percentage)[0])}</td></tr>`).join("")}</table><h3>Recommended Action</h3><p>${recommendation(stats,classified)}</p><p style="margin-top:40px">Teacher: ____________________________ &nbsp;&nbsp; Date: __________________</p>`;
  }
  const doc=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Teacher Ed Learning Hub</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#172033}h1{color:#0b2a5b}h2{color:#123d78}h3{color:#0b2a5b;border-bottom:1px solid #ddd;padding-bottom:4px}table{width:100%;border-collapse:collapse;margin:12px 0}th{background:#edf2f8}td,th{padding:7px;text-align:left}p{line-height:1.5}</style></head><body>${body}</body></html>`;
  downloadBlob(doc,bridge?"teacher-ed-bridge-lesson.doc":"teacher-ed-term-readiness-report.doc","application/msword");
}
function studentSummaryForAll(){}
function closeMobile(){$("#sidebar").classList.remove("open");$("#overlay").classList.remove("show")}
$("#menuBtn").addEventListener("click",()=>{$("#sidebar").classList.add("open");$("#overlay").classList.add("show")});
$("#mobileClose").addEventListener("click",closeMobile);$("#overlay").addEventListener("click",closeMobile);
$all(".nav-item").forEach(b=>b.addEventListener("click",()=>{currentView=b.dataset.view;closeMobile();render()}));
document.addEventListener("change",e=>{
  if(e.target.id==="importFile"){
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();reader.onload=()=>{try{const imported=JSON.parse(reader.result);data=normalize(imported);saveData();toast("Backup imported.");render()}catch(err){toast("Invalid backup file. No data was changed.",true)}};reader.readAsText(file);e.target.value="";
  }
});
render();

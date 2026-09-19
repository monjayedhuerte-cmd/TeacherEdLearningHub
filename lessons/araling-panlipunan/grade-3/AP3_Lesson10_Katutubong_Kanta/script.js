'use strict';

window.addEventListener('error', function(event){
  console.error('Lesson 10 error:', event.error || event.message);
});
window.addEventListener('unhandledrejection', function(event){
  console.error('Lesson 10 promise error:', event.reason);
});

const ASSET = 'assets/';
const app = document.getElementById('app');
const progressBar = document.getElementById('progressBar');
const phaseLabel = document.getElementById('phaseLabel');
const statsLabel = document.getElementById('statsLabel');

const PHASES = [
  {id:'connect', label:'CONNECT'},
  {id:'teach', label:'TEACH'},
  {id:'model', label:'MODEL'},
  {id:'guided', label:'GUIDED PRACTICE'},
  {id:'independent', label:'YOUR TURN'},
  {id:'game', label:'GAME ZONE'},
  {id:'review', label:'SPIRAL REVIEW'},
  {id:'apply', label:'APPLICATION'},
  {id:'mastery', label:'MASTERY CHECK'},
  {id:'celebrate', label:'CELEBRATE'}
];

const STORE = 'edjay_ap3_l10_katutubong_kanta_v3';
let state = loadState();
let soundOn = state.soundOn !== false;
let quizSession = null;
let gameSession = null;

function defaultState(){return {phase:0,stars:0,badges:[],best:0,missed:[],completed:[],soundOn:true,reflection:''};}
function loadState(){try{return {...defaultState(),...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch{return defaultState()}}
function save(){try{localStorage.setItem(STORE,JSON.stringify(state))}catch{}}
function setPhase(n){
  const target=Number(n);
  if(!Number.isFinite(target)) return;
  state.phase=Math.max(0,Math.min(PHASES.length-1,target));
  save();
  updateHeader();
  // Render synchronously so every Next/Continue button always advances.
  render();
  try{window.scrollTo(0,0)}catch{}
}
function updateHeader(){const pct=Math.round(((state.phase+1)/PHASES.length)*100);progressBar.style.width=pct+'%';phaseLabel.textContent=PHASES[state.phase].label;statsLabel.textContent=`⭐ ${state.stars} • 🏆 ${state.badges.length}`;}
function markComplete(id){if(!state.completed.includes(id))state.completed.push(id);save()}
function addStar(n=1){state.stars+=n;save();updateHeader()}
function awardBadge(name){if(!state.badges.includes(name)){state.badges.push(name);save();updateHeader();return true}return false}
function speak(){if(!soundOn || !window.AudioContext)return;try{const ctx=new AudioContext();const o=ctx.createOscillator();const g=ctx.createGain();o.frequency.value=620;g.gain.value=.035;o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+.09)}catch{}}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function shuffledQuestion(q){const pairs=q.choices.map((text,i)=>({text,correct:i===q.answer}));const p=shuffle(pairs);return {...q,choices:p.map(x=>x.text),answer:p.findIndex(x=>x.correct)} }
function choiceButtons(q){return `<div class="choice-grid">${q.choices.map((c,i)=>`<button type="button" class="choice" data-choice="${i}">${esc(c)}</button>`).join('')}</div>`}
function attachChoices(container,q,onDone){
  container.querySelectorAll('[data-choice]').forEach(btn=>{
    btn.type='button';
    btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();onDone(btn,Number(btn.dataset.choice));});
  });
}
function nextButton(label,fn,cls='btn gold'){
  const b=document.createElement('button');
  b.type='button';
  b.className=cls;
  b.textContent=label;
  b.setAttribute('role','button');
  b.setAttribute('data-nav-button','true');
  let busy=false;
  b.addEventListener('click',function(e){
    e.preventDefault();
    e.stopPropagation();
    if(busy) return;
    busy=true;
    b.setAttribute('aria-busy','true');
    try {
      // Run navigation immediately. Do not disable first because some
      // navigation handlers replace #app synchronously.
      fn();
    } catch(err) {
      console.error('Navigation error:',err);
      busy=false;
      b.removeAttribute('aria-busy');
    }
  }, {passive:false});
  return b;
}
function injectNav(row,label,fn){row.appendChild(nextButton(label,fn));}

const guidedQs=[
 {q:'Ano ang maaaring gawin ng isang katutubong awit?',choices:['Magpahayag ng damdamin','Gumawa ng mapa','Magbilang ng populasyon','Magbigay ng presyo'],answer:0,why:'Ayon sa aralin, ang mga awit ay maaaring magpahayag ng damdamin o maglahad ng kuwento.'},
 {q:'Ano ang halimbawa ng awit ng mga taga-Pampanga na naglalahad ng isang kuwento?',choices:['Atin Cu Pung Singsing','Dandansoy','Pasyon','Leron Leron Sinta'],answer:0,why:'Binanggit sa aklat ang “Atin Cu Pung Singsing” bilang awit ng mga taga-Pampanga na naglalahad ng kuwento.'},
 {q:'Ang ilang awit ay kinakanta sa…',choices:['takdang panahon o okasyon','oras ng pagsusulit lamang','lahat ng oras nang walang dahilan','isang lugar lamang'],answer:0,why:'May mga awit na ginagamit sa takdang panahon o okasyon.'},
 {q:'Ano ang makikita sa mga katutubong awit ayon sa aralin?',choices:['Ganda ng sining at mga wikang Pilipino','Mga tuntunin sa matematika','Mga mapa ng buong mundo','Mga presyo ng produkto'],answer:0,why:'Sinasabi sa Alalahanin Natin na makikita sa katutubong awit ang ganda ng sining at ng mga wikang Pilipino.'}
];

const independentQs=[
 {q:'Si Ana ay nakikinig sa isang awit na nagpapahayag ng lungkot. Anong gamit ng awit ang ipinakikita?',choices:['Pagpapahayag ng damdamin','Pagguhit ng mapa','Pagbibigay ng direksiyon','Pagbibilang'],answer:0,why:'Ang awit ay maaaring maging paraan upang maipahayag ang damdamin.'},
 {q:'Alin ang pinakaangkop na dahilan kung bakit dapat pahalagahan ang lokal na katutubong awit?',choices:['Bahagi ito ng kultura at pagkakakilanlan ng pamayanan','Dapat kalimutan ang mga lumang awit','Pare-pareho dapat ang lahat ng awit','Hindi mahalaga ang mga lokal na awit'],answer:0,why:'Layunin ng aralin na mapahalagahan ang mga lokal na katutubong awit bilang bahagi ng kultura.'},
 {q:'Kung ang isang awit ay kinakanta sa isang espesyal na okasyon, ano ang ipinakikita nito?',choices:['May awit para sa takdang panahon o okasyon','Walang kahulugan ang awit','Laging banyaga ang awit','Hindi ito bahagi ng kultura'],answer:0,why:'Binanggit sa aralin na may mga awit na kinakanta sa takdang panahon o okasyon.'},
 {q:'Ano ang dapat gawin kapag may katutubong awit mula sa sariling pamayanan?',choices:['Pakinggan, unawain, at pahalagahan ito','Iwasang alamin ang pinagmulan nito','Sabihing hindi ito mahalaga','Palitan agad ng ibang awit'],answer:0,why:'Ang pagpapahalaga sa mga lokal na katutubong awit ay isa sa layunin ng aralin.'}
];

const masteryQs=[
 {q:'Ang kultura ay nauugnay sa sariling…',choices:['pagkakakilanlan','numero ng bahay','oras ng klase','presyo ng pagkain'],answer:0},
 {q:'Alin ang awit ng mga taga-Pampanga na naglalahad ng kuwento?',choices:['Atin Cu Pung Singsing','Dandansoy','Pasyon','Tinikling'],answer:0},
 {q:'Ano ang dalawang mahalagang maaaring gawin ng mga awit?',choices:['Magpahayag ng damdamin at maglahad ng kuwento','Magbigay lamang ng numero at petsa','Gumuhit ng mapa at magturo ng sayaw','Magbenta ng produkto at magbilang'],answer:0},
 {q:'Ang ilang katutubong awit ay inaawit sa…',choices:['takdang panahon o okasyon','araw-araw na pagsusulit lamang','anumang oras na walang dahilan','mga banyagang lugar lamang'],answer:0},
 {q:'Ayon sa aralin, ano ang nakikita sa mga katutubong awit?',choices:['Ganda ng sining at mga wikang Pilipino','Mga tuntunin sa palakasan','Mga pormula sa matematika','Mga direksiyon sa paglalakbay'],answer:0},
 {q:'Ang Pasyon ay inilalarawan sa aralin bilang mahalagang bahagi ng pagdiriwang ng…',choices:['Mahal na Araw','Bagong Taon','Araw ng Kalayaan','Pista ng Ani'],answer:0},
 {q:'Ano ang kinukuwento ng Pasyon ayon sa aklat?',choices:['Buhay, pagpapakasakit, pagkamatay, at muling pagkabuhay ni Hesukristo','Kasaysayan ng isang bayan lamang','Paraan ng pagtatanim ng palay','Mga tuntunin sa isang paligsahan'],answer:0},
 {q:'Ang pagbasa ng Pasyon ay tinatawag na…',choices:['“pabasa”','“paligsahan”','“pagmamapa”','“pagtatanghal”'],answer:0}
];

function renderConnect(){
 app.innerHTML=`<section class="hero"><span class="eyebrow">ARALIN 10 • ARALING PANLIPUNAN 3</span><h1>Mga Katutubong Kanta 🎵</h1><p class="lead">Tuklasin kung paano nagpapahayag ng damdamin at naglalahad ng kuwento ang mga katutubong awit, at kung paano nauugnay ang mga ito sa kultura at pagkakakilanlan ng mga pamayanan.</p><div class="grid"><div class="mini"><div class="emoji">🎯</div><strong>Makilala</strong><span>Makilala ang ilang katutubong awit sa Pilipinas.</span></div><div class="mini"><div class="emoji">🏘️</div><strong>Maiugnay</strong><span>Maiugnay ang awit sa lungsod, bayan, lalawigan o rehiyon.</span></div><div class="mini"><div class="emoji">❤️</div><strong>Mapahalagahan</strong><span>Mapahalagahan ang mga lokal na katutubong awit.</span></div></div><div class="btn-row" id="connectBtns"></div></section><section class="card"><h2>💭 Connect: Ano ang alam mo?</h2><p>May awit ba sa inyong pamayanan na madalas ninyong marinig? Ano ang nararamdaman mo kapag naririnig mo ito?</p><div class="reflection" id="connectReflect"><button data-r="Masaya 😊">Masaya 😊</button><button data-r="Proud 🇵🇭">Proud 🇵🇭</button><button data-r="Mapayapa 🌿">Mapayapa 🌿</button><button data-r="Iba pa 💭">Iba pa 💭</button></div><p id="reflectMsg" class="muted"></p></section>`;
 const row=document.getElementById('connectBtns');injectNav(row,'Magsimula sa Aralin →',()=>{markComplete('connect');setPhase(1)});
 document.querySelectorAll('#connectReflect button').forEach(b=>b.addEventListener('click',()=>{state.reflection=b.dataset.r;save();document.getElementById('reflectMsg').textContent='Salamat! Handa na tayong matuto tungkol sa mga katutubong kanta.'}));
}

function renderTeach(){
 app.innerHTML=`<section class="card"><span class="eyebrow blue">LEVEL 2 • TEACH</span><h2>📖 Ano ang Katutubong Awit?</h2><p>Maraming katutubong awit ang mga pamayanang Pilipino. Ang mga awit ay <strong>nagpapahayag ng damdamin</strong> o <strong>naglalahad ng kuwento</strong>. Ang ilang awit ay kinakanta sa <strong>takdang panahon o okasyon</strong>.</p><p class="english"><strong>English support:</strong> Indigenous songs are found in Filipino communities. They can express feelings, tell stories, or be sung for a particular time or occasion.</p><img class="lesson-photo" src="assets/page153.jpg" alt="Larawan ng pahina 153 tungkol sa Dandansoy at katutubong awit"><div class="photo-caption">Sanggunian: Larawang ibinigay para sa Aralin 10.</div><h3>🌟 Tatlong ideyang dapat tandaan</h3><div class="grid"><div class="mini"><strong>💗 Nagpapahayag ng damdamin</strong><span>Maaaring ipakita ng awit ang saya, lungkot, pagmamahal o iba pang damdamin.</span></div><div class="mini"><strong>📖 Naglalahad ng kuwento</strong><span>May mga awit na nagsasalaysay ng isang kuwento.</span></div><div class="mini"><strong>📅 Para sa panahon o okasyon</strong><span>May ilang awit na inaawit sa isang tiyak na panahon o okasyon.</span></div></div><div class="btn-row" id="teachBtns"></div></section><section class="card"><h2>🎵 Halimbawa mula sa aralin</h2><div class="source-grid"><figure><img src="assets/page153.jpg" alt="Dandansoy at Atin Cu Pung Singsing"></figure><figure><img src="assets/page156.jpg" alt="Pasyon"></figure></div><p><strong>Atin Cu Pung Singsing</strong> — awit ng mga taga-Pampanga na naglalahad ng isang kuwento.</p><p><strong>Pasyon</strong> — mahalagang bahagi ng pagdiriwang ng Mahal na Araw ayon sa aklat; kinukuwento nito ang buhay, pagpapakasakit, pagkamatay, at muling pagkabuhay ni Hesukristo. Ang pag-awit nito ay tinatawag na “pabasa” at inilalarawan sa aklat bilang gawaing ginagawa ng mga Katoliko tuwing Mahal na Araw.</p></section>`;
 injectNav(document.getElementById('teachBtns'),'Natutuhan ko. I-model natin →',()=>{markComplete('teach');setPhase(2)});
}

function renderModel(){
 app.innerHTML=`<section class="hero"><span class="eyebrow blue">LEVEL 3 • MODEL</span><h2>👩‍🏫 WATCH ME: Paano natin susuriin ang isang awit?</h2><p class="lead">Gamitin ang tatlong tanong na parang isang batang music detective.</p><div class="steps"><div class="step"><div class="step-num">1</div><div><strong>Ano ang ipinahahayag?</strong><p>Damdamin ba ang ipinakikita ng awit?</p></div></div><div class="step"><div class="step-num">2</div><div><strong>Ano ang sinasabi o ikinukuwento?</strong><p>May kuwento o mensaheng inilalahad ba?</p></div></div><div class="step"><div class="step-num">3</div><div><strong>Kailan o saan ito inaawit?</strong><p>May takdang panahon, okasyon, lungsod, bayan, lalawigan o rehiyong kaugnay?</p></div></div></div><div class="activity-card"><h3>🔎 Halimbawa: Atin Cu Pung Singsing</h3><p><strong>Pinagmulan:</strong> mga taga-Pampanga</p><p><strong>Katangian sa aralin:</strong> naglalahad ito ng isang kuwento.</p><p class="english"><strong>English:</strong> The lesson identifies Atin Cu Pung Singsing with Pampanga and says that it tells a story.</p></div><div class="btn-row" id="modelBtns"></div></section>`;
 injectNav(document.getElementById('modelBtns'),'Subukan natin nang magkasama →',()=>{markComplete('model');setPhase(3)});
}

function runQuiz(questions,nextPhase,mode){
 const qs=shuffle(questions).map(shuffledQuestion);let index=0;let score=0;let misses=[];quizSession={qs,index,score,misses,mode};
 function show(){const q=quizSession.qs[quizSession.index];app.innerHTML=`<section class="card"><div class="quiz-head"><span class="eyebrow blue">${mode==='guided'?'LEVEL 4 • GUIDED PRACTICE':'LEVEL 5 • YOUR TURN'}</span><span class="pill">⭐ ${quizSession.score} • ${quizSession.index+1}/${quizSession.qs.length}</span></div><div class="tiny-progress"><span style="width:${((quizSession.index)/quizSession.qs.length)*100}%"></span></div><h2>${esc(q.q)}</h2>${choiceButtons(q)}<div id="feedback" aria-live="polite"></div></section>`;attachChoices(app,q,answer);app.focus({preventScroll:true})}
 function answer(btn,chosen){const q=quizSession.qs[quizSession.index];if(app.querySelector('.choice.correct,.choice.wrong'))return;const buttons=[...app.querySelectorAll('.choice')];buttons.forEach(b=>b.disabled=true);if(chosen===q.answer){btn.classList.add('correct');quizSession.score++;addStar();speak();document.getElementById('feedback').innerHTML=`<div class="feedback good">🌟 Tama! ${esc(q.why||'Magandang pag-iisip!')}</div>`}else{btn.classList.add('wrong');buttons[q.answer].classList.add('correct');quizSession.misses.push(q);document.getElementById('feedback').innerHTML=`<div class="feedback try">💡 Balikan natin: ${esc(q.why||'Isipin ang halimbawa sa lesson.')}</div>`}const row=document.createElement('div');row.className='btn-row';const label=quizSession.index===quizSession.qs.length-1?'Tingnan ang Resulta →':'Susunod →';row.appendChild(nextButton(label,()=>{quizSession.index++;if(quizSession.index<quizSession.qs.length)show();else finish()}));document.getElementById('feedback').appendChild(row)}
 function finish(){state.missed=[...quizSession.misses.map(q=>q.q),...state.missed.filter(x=>!quizSession.misses.some(m=>m.q===x))].slice(0,30);markComplete(mode);if(quizSession.score===quizSession.qs.length)awardBadge(mode==='guided'?'Practice Pro':'Super Learner');save();app.innerHTML=`<section class="card result"><div class="stars">${'⭐'.repeat(Math.min(5,Math.max(1,quizSession.score)))}</div><h2>${mode==='guided'?'Guided Practice Complete!':'Independent Practice Complete!'}</h2><div class="big">${quizSession.score}/${quizSession.qs.length}</div><p>${quizSession.misses.length?'May ilang konseptong maaari pa nating balikan.':'Excellent! Naipakita mo ang mahusay na pag-unawa.'}</p><div class="btn-row" id="resultBtns"></div></section>`;const r=document.getElementById('resultBtns');if(quizSession.misses.length){injectNav(r,'🔄 Practice My Mistakes',()=>renderMissed(quizSession.misses,nextPhase));}injectNav(r,'Magpatuloy →',()=>setPhase(nextPhase));}
 show();
}

function renderGuided(){runQuiz(guidedQs,4,'guided')}
function renderIndependent(){runQuiz(independentQs,5,'independent')}

const gameItems=[
 ['Damdamin','Maaaring ipahayag ng awit ang nararamdaman.','💗'],
 ['Kuwento','Maaaring maglahad ng isang kuwento ang awit.','📖'],
 ['Okasyon','May awit na kinakanta sa takdang panahon o okasyon.','📅'],
 ['Pampanga','Ang Atin Cu Pung Singsing ay kaugnay ng mga taga-Pampanga.','📍'],
 ['Pasyon','Ayon sa aralin, bahagi ito ng pagdiriwang ng Mahal na Araw.','✝️'],
 ['Kultura','Ang katutubong awit ay bahagi ng kultura ng pamayanan.','🏘️']
];
function renderGame(){
 let items=shuffle(gameItems);let selected=null;let done=new Set();
 app.innerHTML=`<section class="card"><span class="eyebrow blue">LEVEL 6 • GAME ZONE</span><h2>🎮 Kanta Detective: Hanapin ang Kapareha!</h2><p>Piliin ang isang konsepto, pagkatapos piliin ang tamang paliwanag. Walang timer—mag-isip nang mabuti.</p><div class="match-area"><div><h3>Mga Konsepto</h3><div class="match-list" id="terms"></div></div><div><h3>Mga Paliwanag</h3><div class="match-list" id="defs"></div></div></div><div id="gameMsg" aria-live="polite"></div><div class="btn-row" id="gameBtns"></div></section>`;
 const terms=document.getElementById('terms'),defs=document.getElementById('defs');
 const termOrder=shuffle(items);const defOrder=shuffle(items);
 terms.innerHTML=termOrder.map((x,i)=>`<div class="match-item" data-side="term" data-id="${i}"><button type="button">${x[2]} ${esc(x[0])}</button></div>`).join('');
 defs.innerHTML=defOrder.map((x,i)=>`<div class="match-item" data-side="def" data-id="${i}"><button type="button">${esc(x[1])}</button></div>`).join('');
 function handle(el){if(el.classList.contains('done'))return;const side=el.dataset.side;const idx=+el.dataset.id;const obj=(side==='term'?termOrder:defOrder)[idx];if(!selected){selected={side,obj,el};el.classList.add('selected');return}if(selected.side===side){selected.el.classList.remove('selected');selected={side,obj,el};el.classList.add('selected');return}const term=side==='term'?obj:selected.obj;const def=side==='def'?obj:selected.obj;selected.el.classList.remove('selected');if(term[0]===def[0]){done.add(term[0]);el.classList.add('done');selected.el.classList.add('done');addStar();speak();document.getElementById('gameMsg').innerHTML=`<div class="feedback good">🌟 Tama! ${esc(term[0])} ay magkapareha.</div>`}else{el.classList.add('selected');document.getElementById('gameMsg').innerHTML=`<div class="feedback try">💡 Hindi pa. Basahin muli ang paliwanag at subukan ulit.</div>`;setTimeout(()=>el.classList.remove('selected'),500)}selected=null;if(done.size===items.length){awardBadge('Kanta Detective');document.getElementById('gameBtns').appendChild(nextButton('Spiral Review →',()=>{markComplete('game');setPhase(6)}))}}
 terms.querySelectorAll('.match-item').forEach(e=>{const b=e.querySelector('button');b.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation();handle(e)});});
 defs.querySelectorAll('.match-item').forEach(e=>{const b=e.querySelector('button');b.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation();handle(e)});});
}

function renderReview(){
 const qs=shuffle([...guidedQs,...independentQs]).slice(0,5);
 let i=0,score=0;
 function show(){const q=shuffledQuestion(qs[i]);app.innerHTML=`<section class="card"><span class="eyebrow blue">LEVEL 7 • SPIRAL REVIEW</span><div class="quiz-head"><span class="pill">Balik-Aral ${i+1}/5</span><span class="pill">⭐ ${score}</span></div><h2>${esc(q.q)}</h2>${choiceButtons(q)}<div id="reviewFb"></div></section>`;attachChoices(app,q,(btn,ch)=>{if(app.querySelector('.choice.correct,.choice.wrong'))return;const bs=[...app.querySelectorAll('.choice')];bs.forEach(x=>x.disabled=true);if(ch===q.answer){score++;btn.classList.add('correct');addStar();document.getElementById('reviewFb').innerHTML='<div class="feedback good">🌟 Tama! Mahusay ang pag-alala.</div>'}else{btn.classList.add('wrong');bs[q.answer].classList.add('correct');document.getElementById('reviewFb').innerHTML=`<div class="feedback try">💡 ${esc(q.why)}</div>`}const row=document.createElement('div');row.className='btn-row';row.appendChild(nextButton(i===4?'Magpatuloy →':'Susunod →',()=>{i++;if(i<5)show();else{markComplete('review');setPhase(7)}}));document.getElementById('reviewFb').appendChild(row)})}
 show();
}

function renderApply(){
 app.innerHTML=`<section class="hero"><span class="eyebrow blue">LEVEL 8 • APPLICATION</span><h2>🧠 Gamitin ang iyong kaalaman</h2><p class="lead">Isipin na may bagong katutubong awit sa inyong pamayanan. Paano mo ito pahahalagahan?</p><div class="grid"><div class="mini"><strong>👂 Makinig</strong><p>Makinig nang maayos at alamin ang mensahe ng awit.</p></div><div class="mini"><strong>🔎 Magtanong</strong><p>Alamin kung saan at kailan ito ginagamit, at kung ano ang kuwento o damdaming ipinahahayag.</p></div><div class="mini"><strong>❤️ Pahalagahan</strong><p>Igalang ang lokal na awit bilang bahagi ng kultura ng pamayanan.</p></div></div><div class="activity-card"><h3>Scenario</h3><p>May matandang kamag-anak na nagtuturo sa iyo ng isang awit mula sa inyong lugar. Ano ang magandang gawin?</p><div class="choice-grid" id="applyChoices"><button class="choice" data-ok="1">Makinig, magtanong tungkol dito, at pahalagahan ang awit.</button><button class="choice" data-ok="0">Sabihing hindi na mahalaga ang lumang awit.</button><button class="choice" data-ok="0">Huwag pansinin dahil hindi ito sikat sa internet.</button></div><div id="applyFb"></div></div></section>`;
 document.querySelectorAll('#applyChoices .choice').forEach(b=>b.addEventListener('click',(e)=>{e.preventDefault();e.stopPropagation();const bs=[...document.querySelectorAll('#applyChoices .choice')];if(bs.some(x=>x.disabled))return;bs.forEach(x=>x.disabled=true);if(b.dataset.ok==='1'){b.classList.add('correct');addStar();awardBadge('Culture Keeper');document.getElementById('applyFb').innerHTML='<div class="feedback good">🌟 Tama! Ipinakikita mo ang pagpapahalaga sa lokal na kultura.</div>'}else{b.classList.add('wrong');bs[0].classList.add('correct');document.getElementById('applyFb').innerHTML='<div class="feedback try">💡 Isipin kung paano natin mapapahalagahan ang kultura ng ating pamayanan.</div>'}const row=document.createElement('div');row.className='btn-row';row.appendChild(nextButton('Final Mastery Check →',()=>{markComplete('apply');setPhase(8)}));document.getElementById('applyFb').appendChild(row)}));
}

function renderMastery(){
 let qs=shuffle(masteryQs).map(shuffledQuestion),i=0,score=0,miss=[];
 function show(){const q=qs[i];app.innerHTML=`<section class="card"><div class="quiz-head"><span class="eyebrow blue">LEVEL 9 • MASTERY CHECK</span><span class="pill">${i+1}/${qs.length} • ⭐ ${score}</span></div><div class="tiny-progress"><span style="width:${i/qs.length*100}%"></span></div><h2>${esc(q.q)}</h2>${choiceButtons(q)}<div id="mfb"></div></section>`;attachChoices(app,q,(btn,ch)=>{if(app.querySelector('.choice.correct,.choice.wrong'))return;const bs=[...app.querySelectorAll('.choice')];bs.forEach(x=>x.disabled=true);if(ch===q.answer){score++;btn.classList.add('correct');addStar();speak();document.getElementById('mfb').innerHTML='<div class="feedback good">🎉 Tama! Ipinakikita mo ang pag-unawa.</div>'}else{btn.classList.add('wrong');bs[q.answer].classList.add('correct');miss.push(q);document.getElementById('mfb').innerHTML='<div class="feedback try">💡 Tingnan ang tamang sagot at basahin muli ang paliwanag sa aralin.</div>'}const row=document.createElement('div');row.className='btn-row';row.appendChild(nextButton(i===qs.length-1?'Tingnan ang Resulta →':'Susunod →',()=>{i++;if(i<qs.length)show();else finish()}));document.getElementById('mfb').appendChild(row)})}
 function finish(){const pct=Math.round(score/qs.length*100);state.best=Math.max(state.best,pct);state.missed=[...miss.map(q=>q.q),...state.missed.filter(x=>!miss.some(m=>m.q===x))].slice(0,30);if(pct>=90)awardBadge('Lesson Master');else if(pct>=80)awardBadge('Smart Thinker');save();markComplete('mastery');app.innerHTML=`<section class="card result"><div class="eyebrow">🎉 MASTERY RESULT</div><div class="big">${pct}%</div><h2>${score}/${qs.length} Correct</h2><p class="stars">${'⭐'.repeat(Math.max(1,Math.round(pct/20)))}</p><p>${pct>=90?'Excellent! Naipakita mo ang matibay na pag-unawa.':pct>=80?'Malapit ka na sa mastery. Balikan ang ilang konsepto para lalo pang tumibay.':pct>=70?'Magandang progreso! May ilang bahagi pa na dapat sanayin.':'Ipagpatuloy ang pagsasanay. Ang bawat pagkakamali ay pagkakataong matuto.'}</p><div id="badges"></div><div class="btn-row" id="masterBtns"></div></section>`;document.getElementById('badges').innerHTML=state.badges.map(b=>`<span class="badge">🏆 ${esc(b)}</span>`).join('');const row=document.getElementById('masterBtns');if(miss.length)injectNav(row,'🔄 Practice My Mistakes',()=>renderMissed(miss,9));injectNav(row,'Tingnan ang Lesson Summary →',()=>setPhase(9));}
 show();
}

function renderMissed(items,next){
 let qs=shuffle(items).map(shuffledQuestion),i=0;
 function show(){if(i>=qs.length){setPhase(next);return}const q=qs[i];app.innerHTML=`<section class="card"><span class="eyebrow">🔄 PRACTICE MY MISTAKES</span><p class="muted">Balikan natin ito nang dahan-dahan. ${i+1}/${qs.length}</p><h2>${esc(q.q)}</h2><p class="english"><strong>Review:</strong> ${esc(q.why||'Balikan ang pangunahing ideya ng lesson.')}</p>${choiceButtons(q)}<div id="mf"></div></section>`;attachChoices(app,q,(btn,ch)=>{if(app.querySelector('.choice.correct,.choice.wrong'))return;const bs=[...app.querySelectorAll('.choice')];bs.forEach(x=>x.disabled=true);if(ch===q.answer){btn.classList.add('correct');addStar();document.getElementById('mf').innerHTML='<div class="feedback good">🌟 Mahusay! Mas malinaw na ngayon.</div>'}else{btn.classList.add('wrong');bs[q.answer].classList.add('correct');document.getElementById('mf').innerHTML='<div class="feedback try">💡 Basahin muli ang review at subukan ulit sa susunod.</div>'}const row=document.createElement('div');row.className='btn-row';row.appendChild(nextButton(i===qs.length-1?'Tapos na →':'Susunod →',()=>{i++;show()}));document.getElementById('mf').appendChild(row)})}
 show();
}

function renderCelebrate(){
 app.innerHTML=`<section class="hero result"><span class="eyebrow">LEVEL 10 • CELEBRATE</span><h1>🎉 Natapos mo ang Aralin 10!</h1><div class="big">${state.best||0}%</div><p class="lead">Natutuhan mo na ang mahahalagang ideya tungkol sa mga katutubong kanta.</p><div>${state.badges.map(b=>`<span class="badge">🏆 ${esc(b)}</span>`).join('')||'<span class="badge">⭐ Great Effort</span>'}</div><div class="grid" style="margin-top:18px"><div class="mini"><strong>📌 Tandaan</strong><p>Maraming katutubong awit ang mga pamayanang Pilipino.</p></div><div class="mini"><strong>🎵 Gamit ng awit</strong><p>Maaaring magpahayag ng damdamin o maglahad ng kuwento.</p></div><div class="mini"><strong>❤️ Pagpapahalaga</strong><p>Ang mga lokal na katutubong awit ay bahagi ng kultura at dapat pahalagahan.</p></div></div><div class="btn-row" id="celebrateBtns"></div></section><section class="card"><h2>📚 Mga Larawang Sanggunian</h2><div class="source-grid"><figure><img src="assets/page152.jpg" alt="Pahina 152"><figcaption>Aralin 10 at mga layunin</figcaption></figure><figure><img src="assets/page153.jpg" alt="Pahina 153"><figcaption>Dandansoy at Atin Cu Pung Singsing</figcaption></figure><figure><img src="assets/page156.jpg" alt="Pahina 156"><figcaption>Pasyon</figcaption></figure><figure><img src="assets/page157.jpg" alt="Pahina 157"><figcaption>Alalahanin Natin at Pagnilayan Natin</figcaption></figure></div></section><section class="card"><h2>💭 Think About It</h2><p>Aling ideya ang gusto mong mas maalala?</p><div class="reflection"><button data-r="Damdamin">💗 Damdamin</button><button data-r="Kuwento">📖 Kuwento</button><button data-r="Okasyon">📅 Panahon / Okasyon</button><button data-r="Pagpapahalaga">❤️ Pagpapahalaga</button></div><p class="muted" id="finalReflect"></p></section>`;
 const row=document.getElementById('celebrateBtns');injectNav(row,'🔄 Balikan mula sa Simula',()=>{setPhase(0)});if(state.missed.length)injectNav(row,'🔄 Practice My Mistakes',()=>{const known=masteryQs.filter(q=>state.missed.includes(q.q));renderMissed(known.length?known:masteryQs.slice(0,2),9)},'btn light');
 document.querySelectorAll('.reflection button').forEach(b=>b.addEventListener('click',()=>{state.reflection=b.dataset.r;save();document.getElementById('finalReflect').textContent=`Pinili mo: ${b.dataset.r}. Magandang hakbang iyan para maalala ang lesson!`}));
}

function render(){updateHeader();const renders=[renderConnect,renderTeach,renderModel,renderGuided,renderIndependent,renderGame,renderReview,renderApply,renderMastery,renderCelebrate];renders[state.phase]();}

document.getElementById('soundBtn').addEventListener('click',()=>{soundOn=!soundOn;state.soundOn=soundOn;save();document.getElementById('soundBtn').textContent=soundOn?'🔊':'🔇';});
document.getElementById('fsBtn').addEventListener('click',async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch{}});
document.getElementById('resetBtn').addEventListener('click',()=>{if(confirm('I-reset ang lahat ng progress, stars, badges at scores para sa Aralin 10?')){localStorage.removeItem(STORE);state=defaultState();soundOn=true;document.getElementById('soundBtn').textContent='🔊';render()}});
document.getElementById('homeLink').addEventListener('click',e=>{e.preventDefault();setPhase(0)});

document.getElementById('soundBtn').textContent=soundOn?'🔊':'🔇';
render();

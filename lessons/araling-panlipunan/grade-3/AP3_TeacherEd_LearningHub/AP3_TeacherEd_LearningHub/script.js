'use strict';

const levels = [
  {id:1, icon:'🌱', title:'Warm-Up', subtitle:'Quick Pick', desc:'Balikan ang mahahalagang salita at ideya.', type:'quick', questions:[
    {q:'Ano ang tawag sa lugar kung saan naninirahan at nagtutulungan ang mga tao?',o:['Pamayanan','Kultura','Kasaysayan','Pagdiriwang'],a:0,e:'Ang pamayanan ay lugar kung saan naninirahan at nakikipag-ugnayan ang mga tao.'},
    {q:'Ano ang tumutukoy sa mga pangyayari at kuwento tungkol sa nakaraan?',o:['Kultura','Kasaysayan','Hanapbuhay','Kapaligiran'],a:1,e:'Ang kasaysayan ay tumutukoy sa mga pangyayari at kuwento tungkol sa nakaraan.'},
    {q:'Alin ang maaaring gamitin upang malaman kung ano ang itsura ng pamayanan noon?',o:['Bagong laruan','Bagong damit','Lumang larawan','Bagong cellphone'],a:2,e:'Ang lumang larawan ay maaaring magpakita kung ano ang itsura ng pamayanan noon.'},
    {q:'Alin ang halimbawa ng materyal na kultura?',o:['Pagmamano','Barong Tagalog','Paggalang','Wika'],a:1,e:'Ang Barong Tagalog ay isang bagay na nakikita at nahahawakan kaya materyal na kultura.'},
    {q:'Alin ang halimbawa ng di-materyal na kultura?',o:['Bahay Kubo','Pagkain','Pagmamano','Kasuotan'],a:2,e:'Ang pagmamano ay kaugalian at hindi bagay na nahahawakan.'}
  ]},
  {id:2, icon:'🔎', title:'Knowledge Quest', subtitle:'True or False', desc:'Suriin kung tama ang mga pahayag.', type:'tf', questions:[
    {q:'Ang mga nakatatanda ay maaaring maging pinagmumulan ng kuwento tungkol sa nakaraan.',a:true,e:'Tama. Maaari nilang maibahagi ang kanilang mga karanasan at alaala.'},
    {q:'Ang pagbabago ay nangangahulugang nananatiling pareho ang isang bagay sa paglipas ng panahon.',a:false,e:'Ang pananatili ay pagpapatuloy. Ang pagbabago ay may pagkakaiba sa dating kalagayan.'},
    {q:'Ang pag-iingat sa lumang larawan at dokumento ay paraan ng pangangalaga sa kasaysayan.',a:true,e:'Tama. Nakakatulong ang mga ito sa pag-alala at pag-aaral ng nakaraan.'},
    {q:'Ang kultura ay binubuo lamang ng mga bagay na maaaring hawakan.',a:false,e:'May materyal at di-materyal na kultura.'},
    {q:'Maaaring maimpluwensiyahan ng kapaligiran ang kultura ng isang pamayanan.',a:true,e:'Tama. Ang kapaligiran ay maaaring makaapekto sa pagkain, pananamit at pamumuhay.'}
  ]},
  {id:3, icon:'🧩', title:'Practice Challenge', subtitle:'Match It & Sort It', desc:'Ipares ang konsepto at halimbawa, pagkatapos ay uriin ang kultura.', type:'matchsort', questions:[
    {left:'Pamayanan',right:'Lugar na tinitirhan at pinamumuhayan ng mga tao'},
    {left:'Kasaysayan',right:'Mga pangyayari at kuwento tungkol sa nakaraan'},
    {left:'Lumang larawan',right:'Maaaring magbigay ng impormasyon tungkol sa nakaraan'},
    {left:'Pagmamano',right:'Halimbawa ng di-materyal na kultura'},
    {left:'Barong Tagalog',right:'Halimbawa ng materyal na kultura'}
  ]},
  {id:4, icon:'🧠', title:'Brain Challenge', subtitle:'Arrange & Apply', desc:'Mag-isip, maghambing, at piliin ang pinakamainam na sagot.', type:'apply', questions:[
    {q:'Ang palayan ay ginawang paaralan. Ano ang ipinapakita nito?',o:['Pagpapatuloy','Pagbabago','Paniniwala','Pagdiriwang'],a:1,e:'May nagbago sa gamit ng lugar, kaya ito ay halimbawa ng pagbabago.'},
    {q:'Ang isang tradisyon ay patuloy na ginagawa bawat taon. Ano ang ipinapakita nito?',o:['Pagbabago','Pagpapatuloy','Pagkawala','Paglalakbay'],a:1,e:'Ang pagpapatuloy ay mga bagay na nananatili o patuloy na ginagawa sa paglipas ng panahon.'},
    {q:'Bakit mahalagang pag-aralan ang kasaysayan ng pamayanan?',o:['Para makalimutan ang nakaraan','Para makilala at mapahalagahan ang pinagmulan','Para sirain ang lumang bagay','Para baguhin ang lahat'],a:1,e:'Tinutulungan tayo ng kasaysayan na makilala at mapahalagahan ang ating pinagmulan.'},
    {q:'Bakit maaaring magkakaiba ang kultura ng mga pamayanan?',o:['Pareho ang lahat ng karanasan','Magkakaiba ang kapaligiran, kasaysayan, tao at paniniwala','Walang kultura ang pamayanan','Dahil sa kulay ng gusali'],a:1,e:'Maraming salik ang nakaaapekto sa kultura, kabilang ang kapaligiran, kasaysayan, mga tao at paniniwala.'},
    {q:'Alin ang pinakamahusay na paraan upang pahalagahan ang kulturang Pilipino?',o:['Kalimutan ang tradisyon','Igalang at pangalagaan ang kultura','Sirain ang lumang bagay','Huwag pag-usapan ang kultura'],a:1,e:'Mahalagang igalang, pangalagaan at ipagmalaki ang kultura.'}
  ]},
  {id:5, icon:'🏆', title:'Master Challenge', subtitle:'Final Boss', desc:'Pinagsamang hamon sa dalawang aralin.', type:'final', questions:[
    {q:'Alin ang maaaring maging pinagmumulan ng kasaysayan?',o:['Mga nakatatanda','Laruan lamang','Bagong damit','Paboritong pagkain'],a:0,e:'Maaaring magkuwento ang mga nakatatanda tungkol sa kanilang karanasan at sa nakaraan.'},
    {q:'Alin ang nagpapakita ng pagbabago sa pamayanan?',o:['Patuloy na pagdiriwang','Lumang tradisyon','Lumang tindahan na naging malaking gusali','Kuwento ng lolo'],a:2,e:'Nagbago ang anyo ng lugar kaya ito ay pagbabago.'},
    {q:'Alin ang nagpapakita ng pagpapatuloy?',o:['Tradisyong patuloy na ginagawa','Palayan na naging gusali','Lumang daan na pinalawak','Lumang bahay na pinalitan'],a:0,e:'Ang pagpapatuloy ay bagay na nananatili o patuloy na ginagawa.'},
    {q:'Alin ang materyal na kultura?',o:['Wika','Pagmamano','Barong Tagalog','Paniniwala'],a:2,e:'Ang Barong Tagalog ay nakikita at nahahawakan.'},
    {q:'Alin ang di-materyal na kultura?',o:['Paggalang sa nakatatanda','Bahay Kubo','Pagkain','Kasuotan'],a:0,e:'Ang paggalang ay kaugalian o pagpapahalaga, kaya di-materyal.'},
    {q:'Aling pagdiriwang ang kilala sa Cebu?',o:['Sinulog','Pangalay','Buko Pie','Piaya'],a:0,e:'Sa mga halimbawa ng lokal na kultura, ang Sinulog ay kaugnay ng Cebu.'},
    {q:'Alin ang halimbawa ng kulturang lokal sa Laguna?',o:['Piaya','Buko Pie','Pangalay','Sinulog'],a:1,e:'Ang Buko Pie ay halimbawa ng lokal na kultura sa Laguna.'},
    {q:'Alin ang maaaring makaapekto sa kultura?',o:['Kapaligiran, kasaysayan, mga tao at paniniwala','Laki ng sapatos lamang','Kulay ng lapis','Bilang ng laruan'],a:0,e:'Ang mga salik na ito ay maaaring humubog sa kultura ng isang pamayanan.'},
    {q:'Ano ang dapat gawin sa mga lumang larawan at dokumento?',o:['Itapon','Ingatan at pangalagaan','Punitin','Itago at kalimutan'],a:1,e:'Ang pag-iingat sa mga ito ay nakakatulong sa pangangalaga ng kasaysayan.'},
    {q:'Ano ang mahalagang naibibigay ng kultura sa isang pangkat?',o:['Pagkakakilanlan','Pagkalimot','Pagkawala ng tradisyon','Pagkakahiwalay'],a:0,e:'Ang kultura ay nagbibigay ng pagkakakilanlan at nagpapakita ng paraan ng pamumuhay.'}
  ]}
];

const badges = [
  {id:'explorer',emoji:'🧭',name:'History Explorer',desc:'Natapos ang Warm-Up.'},
  {id:'truth',emoji:'🔎',name:'Truth Finder',desc:'Natapos ang True or False.'},
  {id:'matcher',emoji:'🧩',name:'Culture Matcher',desc:'Natapos ang Match & Sort.'},
  {id:'thinker',emoji:'🧠',name:'Brain Explorer',desc:'Natapos ang Brain Challenge.'},
  {id:'master',emoji:'🏆',name:'Lesson Master',desc:'Natapos ang Final Boss.'},
  {id:'perfect',emoji:'🌟',name:'Perfect Score',desc:'Nakakuha ng 100% sa isang level.'},
  {id:'streak',emoji:'🔥',name:'Streak Star',desc:'Nakakuha ng 5 sunod-sunod na tamang sagot.'},
  {id:'all',emoji:'🚀',name:'AP Superstar',desc:'Natapos ang lahat ng levels.'}
];

const defaultState={score:0,stars:0,attempted:0,correct:0,completed:[],best:{},badges:[],mistakes:[]};
let state=loadState();
let currentLevel=null,currentQuestions=[],currentIndex=0,levelScore=0,levelCorrect=0,levelMistakes=[],streak=0,selectedMatch=null,matchPairs=[],sortDone=false,soundOn=true;

function loadState(){try{return {...defaultState,...JSON.parse(localStorage.getItem('edjayAP3State')||'{}')}}catch{return {...defaultState}}}
function save(){localStorage.setItem('edjayAP3State',JSON.stringify(state));updateStats();}
function updateStats(){
  document.getElementById('headerStars').textContent=state.stars; document.getElementById('headerScore').textContent=state.score;
  document.getElementById('gameStars').textContent=state.stars; document.getElementById('gameScore').textContent=state.score;
  document.getElementById('dashScore').textContent=state.score;document.getElementById('dashStars').textContent=state.stars;document.getElementById('dashBadges').textContent=state.badges.length;
  document.getElementById('dashAccuracy').textContent=(state.attempted?Math.round(state.correct/state.attempted*100):0)+'%';
}
function show(screen){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); document.getElementById(screen).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.screen===screen)); window.scrollTo({top:0,behavior:'smooth'}); updateMap(); updateRewards(); updateProgress();
}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2300)}
function celebrate(){const box=document.getElementById('confetti');box.innerHTML='';for(let i=0;i<45;i++){const p=document.createElement('i');p.className='piece';p.style.left=Math.random()*100+'%';p.style.top=(-Math.random()*30)+'%';p.style.animationDelay=(Math.random()*.4)+'s';p.style.background=['#f8b91f','#1677d2','#43b77b','#ef6a6a','#9d6de5'][i%5];box.appendChild(p)}setTimeout(()=>box.innerHTML='',2200)}
function award(id){if(!state.badges.includes(id)){state.badges.push(id);save();toast('🏆 Badge unlocked: '+badges.find(b=>b.id===id).name);celebrate()}}
function levelUnlocked(i){return i===0||state.completed.includes(levels[i-1].id)}
function updateMap(){
  const grid=document.getElementById('levelGrid');if(!grid)return;grid.innerHTML='';
  levels.forEach((l,i)=>{const unlocked=levelUnlocked(i),done=state.completed.includes(l.id),best=state.best[l.id]??null;const card=document.createElement('div');card.className='level-card'+(unlocked?'':' locked');card.innerHTML=`<div class="level-icon">${l.icon}</div><span class="${done?'completed':'lock'}">${done?'✓ Complete':unlocked?'':'🔒'}</span><h3>Level ${l.id}: ${l.title}</h3><p><b>${l.subtitle}</b><br>${l.desc}${best!==null?`<br><small>Best: ${best}%</small>`:''}</p><button class="level-btn" ${unlocked?'':'disabled'}>${done?'PLAY AGAIN':'START LEVEL'}</button>`;card.querySelector('button').addEventListener('click',()=>startLevel(i));grid.appendChild(card)});
  const done=state.completed.length;const pct=Math.round(done/levels.length*100);document.getElementById('mapPercent').textContent=pct+'%';document.getElementById('mapProgress').style.width=pct+'%';
}
function updateRewards(){const g=document.getElementById('badgeGrid');if(!g)return;g.innerHTML=badges.map(b=>{const on=state.badges.includes(b.id);return `<div class="badge ${on?'unlocked':''}"><div class="emoji">${b.emoji}</div><h3>${b.name} ${on?'✓':''}</h3><p>${b.desc}</p></div>`}).join('')}
function updateProgress(){const rows=document.getElementById('progressRows');if(!rows)return;rows.innerHTML=levels.map(l=>{const done=state.completed.includes(l.id);const best=state.best[l.id]??0;return `<div class="progress-row"><b>${l.icon} Level ${l.id}: ${l.title}</b><div class="progress"><i style="width:${done?100:best}%"></i></div><span>${done?'✓':best+'%'}</span></div>`}).join('')}

function startLevel(i){if(!levelUnlocked(i)){toast('🔒 Tapusin muna ang naunang level.');return}currentLevel=levels[i];currentQuestions=shuffle([...currentLevel.questions]);currentIndex=0;levelScore=0;levelCorrect=0;levelMistakes=[];streak=0;selectedMatch=null;sortDone=false;show('game');document.getElementById('gameLevelLabel').textContent='LEVEL '+currentLevel.id;document.getElementById('gameTitle').textContent=currentLevel.title;renderQuestion()}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function renderQuestion(){
  document.getElementById('questionCount').textContent=`Challenge ${currentIndex+1} of ${currentQuestions.length}`;document.getElementById('streakText').textContent=`🔥 ${streak} streak`;document.getElementById('questionProgress').style.width=(currentIndex/currentQuestions.length*100)+'%';
  const box=document.getElementById('gameContent');box.innerHTML='';
  if(currentLevel.type==='matchsort'){renderMatchSort(box);return}
  const q=currentQuestions[currentIndex];
  const wrap=document.createElement('div');wrap.innerHTML=`<p class="game-instruction">${currentLevel.type==='tf'?'Piliin ang TAMA o MALI.':'Basahin at piliin ang pinakamainam na sagot.'}</p><div class="question">${q.q}</div>`;
  const grid=document.createElement('div');grid.className='choice-grid';
  if(currentLevel.type==='tf'){['TAMA','MALI'].forEach((x,i)=>{const b=document.createElement('button');b.className='choice';b.textContent=x;b.addEventListener('click',()=>checkTF(b,i===0,q));grid.appendChild(b)})}
  else {q.o.forEach((x,i)=>{const b=document.createElement('button');b.className='choice';b.textContent=x;b.addEventListener('click',()=>checkMC(b,i,q)) ;grid.appendChild(b)})}
  wrap.appendChild(grid);const actions=document.createElement('div');actions.className='game-actions';const hint=document.createElement('button');hint.className='secondary-btn hint';hint.textContent='💡 Hint';hint.addEventListener('click',()=>giveHint(q));actions.appendChild(hint);wrap.appendChild(actions);box.appendChild(wrap);
}
function giveHint(q){let text='Isipin ang kahulugan ng mga pangunahing salita sa tanong.';if(q.e)text='💡 '+q.e.split('. ')[0]+'.';toast(text)}
function checkMC(btn,i,q){const buttons=[...btn.parentElement.children];buttons.forEach(b=>b.disabled=true);const ok=i===q.a;mark(btn,ok,buttons,q);}
function checkTF(btn,val,q){const buttons=[...btn.parentElement.children];buttons.forEach(b=>b.disabled=true);const ok=val===q.a;mark(btn,ok,buttons,q)}
function mark(btn,ok,buttons,q){
  if(ok){btn.classList.add('correct');levelCorrect++;levelScore+=10;state.correct++;streak++;if(streak>=5)award('streak');toast('🎉 Great job! +10 points');if(soundOn)beep(660)}
  else{btn.classList.add('wrong');streak=0;levelMistakes.push(q);state.mistakes.push({level:currentLevel.id,q:q.q});toast('💡 Not quite! Let’s think again.');if(soundOn)beep(220);}
  state.attempted++;state.score+=ok?10:0;save();
  const fb=document.createElement('div');fb.className='feedback '+(ok?'good':'try');fb.innerHTML=(ok?'🎉 <b>Tama!</b> ':'💡 <b>Subukan nating isipin.</b> ')+(q.e||'');btn.parentElement.parentElement.appendChild(fb);
  const act=document.createElement('div');act.className='game-actions';const next=document.createElement('button');next.className='primary-btn';next.textContent=currentIndex===currentQuestions.length-1?'TAPUSIN LEVEL →':'NEXT →';next.addEventListener('click',()=>{currentIndex++;if(currentIndex<currentQuestions.length)renderQuestion();else finishLevel()});act.appendChild(next);if(!ok){const retry=document.createElement('button');retry.className='secondary-btn';retry.textContent='🔁 Balikan';retry.addEventListener('click',()=>renderQuestion());act.appendChild(retry)}fb.after(act);
  document.getElementById('questionProgress').style.width=((currentIndex+1)/currentQuestions.length*100)+'%';document.getElementById('streakText').textContent=`🔥 ${streak} streak`;
}
function renderMatchSort(box){
  if(currentIndex===0){matchPairs=shuffle([...currentQuestions]);}
  if(currentIndex<matchPairs.length){
    const p=matchPairs[currentIndex];box.innerHTML=`<p class="game-instruction">MATCH IT • Ipares ang konsepto sa tamang kahulugan.</p><div class="question">${p.left}</div><div class="match-items" id="matchOptions"></div><div class="game-actions"><button class="secondary-btn hint" id="matchHint">💡 Hint</button></div>`;
    const opts=shuffle(matchPairs.map(x=>x.right));const area=box.querySelector('#matchOptions');opts.forEach(x=>{const b=document.createElement('button');b.className='match-item';b.textContent=x;b.addEventListener('click',()=>{const ok=x===p.right;b.classList.add(ok?'matched':'selected');state.attempted++;if(ok){levelCorrect++;levelScore+=10;state.correct++;state.score+=10;state.stars++;streak++;toast('🧩 Match correct! +10');if(soundOn)beep(660);setTimeout(()=>{currentIndex++;renderQuestion()},650)}else{streak=0;toast('💡 Hindi pa. Hanapin ang kahulugang tugma.');if(soundOn)beep(220)}save()});area.appendChild(b)});box.querySelector('#matchHint').addEventListener('click',()=>toast('💡 Hanapin ang sagot na nagpapaliwanag sa salitang nasa itaas.'));return;
  }
  renderSort(box);
}
function renderSort(box){
  const items=shuffle([{t:'Barong Tagalog',cat:'Materyal'},{t:'Pagmamano',cat:'Di-materyal'},{t:'Bahay Kubo',cat:'Materyal'},{t:'Wika',cat:'Di-materyal'},{t:'Pagkain',cat:'Materyal'},{t:'Paggalang sa nakatatanda',cat:'Di-materyal'}]);
  box.innerHTML=`<p class="game-instruction">SORT IT • I-tap ang item, pagkatapos ay i-tap ang tamang kahon.</p><div class="sort-grid"><div class="sort-box"><h3>🧱 Materyal</h3><div id="matBox"></div></div><div class="sort-box"><h3>💭 Di-materyal</h3><div id="nonBox"></div></div></div><div id="sortItems" class="match-items" style="max-width:700px;margin:18px auto 0"></div><div class="game-actions"><button class="secondary-btn hint" id="sortHint">💡 Hint</button></div>`;
  const source=box.querySelector('#sortItems');let chosen=null;items.forEach(item=>{const b=document.createElement('button');b.className='sort-item';b.textContent=item.t;b.addEventListener('click',()=>{if(chosen)chosen.classList.remove('selected');chosen={el:b,item};b.classList.add('selected')});source.appendChild(b)});
  const place=(id,cat)=>box.querySelector(id).addEventListener('click',()=>{if(!chosen){toast('Pili muna ng item.');return}const ok=chosen.item.cat===cat;if(ok){chosen.el.remove();const span=document.createElement('div');span.className='sort-item';span.textContent=chosen.item.t;box.querySelector(id).appendChild(span);levelCorrect++;levelScore+=10;state.correct++;state.score+=10;state.attempted++;state.stars++;streak++;toast('🎯 Tama! +10');if(soundOn)beep(660);chosen=null}else{state.attempted++;state.mistakes.push({level:3,q:chosen.item.t});streak=0;toast('💡 Hindi pa. Isipin kung nahahawakan o kaugalian ito.');if(soundOn)beep(220)}save();if(source.children.length===0)finishLevel()});
  place('#matBox','Materyal');place('#nonBox','Di-materyal');box.querySelector('#sortHint').addEventListener('click',()=>toast('💡 Materyal = nakikita at nahahawakan. Di-materyal = kaugalian, wika, paniniwala o pagpapahalaga.'));
}
function finishLevel(){
  const total=currentQuestions.length;const pct=Math.round(levelCorrect/total*100);const prev=state.best[currentLevel.id]??0;state.best[currentLevel.id]=Math.max(prev,pct);if(!state.completed.includes(currentLevel.id))state.completed.push(currentLevel.id);state.stars+=levelCorrect>=Math.ceil(total*.7)?1:0;
  award(currentLevel.id===1?'explorer':currentLevel.id===2?'truth':currentLevel.id===3?'matcher':currentLevel.id===4?'thinker':'master');if(pct===100)award('perfect');if(state.completed.length===levels.length)award('all');save();celebrate();
  document.getElementById('resultTitle').textContent=pct>=90?'🏆 Lesson Master!':pct>=80?'🌟 Super Learner!':pct>=70?'⭐ Great Progress!':pct>=60?'🎯 Keep Practicing!':'💡 Learning Explorer!';document.getElementById('resultScore').textContent=pct+'%';document.getElementById('resultCorrect').textContent=`${levelCorrect}/${total} correct`;document.getElementById('resultBadge').textContent=pct>=90?'🏆':pct>=80?'🌟':pct>=70?'⭐':'💡';document.getElementById('resultMessage').textContent=pct>=70?'Ang galing! Handa ka na sa susunod na challenge.':'Great effort! Balikan ang level at subukang dagdagan ang iyong score.';document.getElementById('resultNext').style.display=currentLevel.id<levels.length?'inline-block':'none';document.getElementById('resultNext').textContent=currentLevel.id<levels.length?'NEXT LEVEL →':'FINISH';show('results');
}
function nextLevel(){const i=levels.findIndex(l=>l.id===currentLevel.id);if(i<levels.length-1)startLevel(i+1);else show('rewards')}
function beep(freq){try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const c=new A();const o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(.05,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.13);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.13)}catch{}}

document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click',()=>show(b.dataset.screen)));
document.getElementById('startBtn').addEventListener('click',()=>show('mission'));
document.getElementById('missionBtn').addEventListener('click',()=>show('map'));
document.getElementById('backMap').addEventListener('click',()=>show('map'));
document.getElementById('resultNext').addEventListener('click',nextLevel);
document.getElementById('resultRetry').addEventListener('click',()=>{const i=levels.findIndex(l=>l.id===currentLevel.id);startLevel(i)});
document.getElementById('resultMap').addEventListener('click',()=>show('map'));
document.getElementById('resetBtn').addEventListener('click',()=>{if(confirm('Sigurado ka bang buburahin ang lahat ng progress, stars, at badges?')){localStorage.removeItem('edjayAP3State');state=loadState();updateStats();updateMap();updateRewards();updateProgress();toast('Progress reset. Tara, magsimula ulit!')}});
document.getElementById('soundBtn').addEventListener('click',e=>{soundOn=!soundOn;e.target.textContent=soundOn?'🔊':'🔇';toast(soundOn?'Sound ON':'Sound OFF')});
document.getElementById('menuBtn').addEventListener('click',()=>document.getElementById('nav').classList.toggle('open'));
updateStats();updateMap();updateRewards();updateProgress();

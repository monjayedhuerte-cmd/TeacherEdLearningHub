'use strict';

const rounds = [
  {title:'Kilalanin ang Tungkulin', label:'MISYON 1', type:'mcq', questions:[
    {q:'Sino-sino ang may kani-kaniyang tungkulin sa pamilya?', c:['Bawat kasapi ng pamilya','Mga magulang lamang','Mga bisita lamang'], a:0, e:'Bawat kasapi ng pamilya ay may kani-kaniyang tungkulin.'},
    {q:'Ano ang isang tungkulin natin sa mga magulang?', c:['Igalang at mahalin sila','Palaging sumigaw sa kanila','Huwag silang pakinggan'], a:0, e:'Tungkulin nating igalang at mahalin ang ating mga magulang.'},
    {q:'Ano ang dapat nating gawin sa ating mga kapatid?', c:['Igalang at mahalin sila','Awayin sila palagi','Huwag silang tulungan'], a:0, e:'Mahalaga ang paggalang at pagmamahal sa mga kapatid.'},
    {q:'Ano ang dapat nating gawin bilang mag-aaral?', c:['Mag-aral nang mabuti','Iwasan ang pag-aaral','Maglaro buong araw'], a:0, e:'Dapat tayong mag-aral nang mabuti.'},
    {q:'Ano ang dapat nating gawin sa ating tahanan?', c:['Tumulong sa mga gawaing-bahay','Magkalat sa bahay','Iwan ang kalat sa sahig'], a:0, e:'Maaari tayong tumulong sa mga gawaing-bahay.'}
  ]},
  {title:'Tama o Hindi?', label:'MISYON 2', type:'mcq', questions:[
    {q:'Si Ana ay gumagamit ng “po” at “opo” kapag nakikipag-usap sa kaniyang lolo. Tama ba ito?', c:['Tama','Hindi','Hindi ko alam'], a:0, e:'Ang “po” at “opo” ay ginagamit bilang paggalang sa nakatatanda.'},
    {q:'Pag-alis ng bahay, nagpapaalam si Ben kina Nanay at Tatay. Tama ba ito?', c:['Tama','Hindi','Hindi mahalaga'], a:0, e:'Dapat magpaalam sa mga magulang kung lalabas ng bahay.'},
    {q:'Naglalaro muna si Carlo at saka lang ginagawa ang kaniyang takdang-aralin. Tama ba ito?', c:['Hindi','Tama','Laging tama'], a:0, e:'Dapat tapusin muna ang takdang-aralin bago gumamit ng gadget o maglaro.'},
    {q:'Inililigpit ni Mia ang kaniyang mga damit sa wastong lagayan. Ano ang ipinapakita niya?', c:['Pagiging maayos','Pagiging makalat','Pagiging pabaya'], a:0, e:'Ang paglalagay ng damit sa wastong lagayan ay nakatutulong sa pagiging maayos ng tahanan.'},
    {q:'Tumutulong si Leo sa mga gawaing-bahay lalo na kapag Sabado at Linggo. Tama ba ito?', c:['Tama','Hindi','Hindi kailangan'], a:0, e:'Maaari tayong tumulong sa mga gawaing-bahay, lalo na sa mga araw na may oras para rito.'}
  ]},
  {title:'Piliin ang Mabuting Gawain', label:'MISYON 3', type:'mcq', questions:[
    {q:'May bisita at kausap ni Nanay ang isang nakatatanda. Ano ang magalang na pananalita?', c:['“Po” at “opo”','“Hoy!”','“Ayoko!”'], a:0, e:'Gamitin ang “po” at “opo” sa pakikipag-usap sa nakatatanda.'},
    {q:'Pagkatapos kumain, nakita mong may kalat sa mesa. Ano ang maaari mong gawin?', c:['Tumulong magligpit','Iwan ang kalat','Magkalat pa'], a:0, e:'Ang pagtulong sa pagliligpit ay isang mabuting paraan ng pagtulong sa tahanan.'},
    {q:'May takdang-aralin ka ngunit gusto mong maglaro. Ano ang dapat unahin?', c:['Takdang-aralin','Laro','Gadget'], a:0, e:'Tapusin muna ang takdang-aralin bago maglaro o gumamit ng gadget.'},
    {q:'Alin ang nagpapakita ng pagmamahal sa kapatid?', c:['Pagtulong at paggalang','Panunukso','Pananakit'], a:0, e:'Ang pagtulong at paggalang ay nagpapakita ng pagmamahal.'},
    {q:'Ano ang makatutulong upang manatiling maayos ang tahanan?', c:['Pagliligpit at paglilinis','Pag-iwan ng kalat','Pagsira ng gamit'], a:0, e:'Panatilihing malinis at maayos ang tahanan.'}
  ]},
  {title:'Huling Hamon: Sitwasyon', label:'FINAL CHALLENGE', type:'mcq', questions:[
    {q:'Sinabi ni Tatay: “Anak, tapusin mo muna ang iyong takdang-aralin.” Ano ang mabuting sagot?', c:['“Opo, Tatay.”','“Ayoko!”','“Mamaya na lang kahit hindi matapos.”'], a:0, e:'Ang pagsunod sa mga alituntunin sa pamilya ay isang mahalagang tungkulin.'},
    {q:'Lalabas ka ng bahay upang pumunta sa kaibigan. Ano ang dapat mong gawin?', c:['Magpaalam muna sa magulang','Umalis nang palihim','Huwag magsabi'], a:0, e:'Dapat tayong magpaalam kina Nanay at Tatay kapag lalabas ng bahay.'},
    {q:'Nakikita mong pagod si Nanay sa gawaing-bahay. Ano ang maaari mong gawin?', c:['Tumulong sa kaya mong gawin','Magkalat pa','Manood lamang at tumawa'], a:0, e:'Ang pagtulong sa gawaing-bahay ay isang paraan ng pagtupad sa tungkulin.'},
    {q:'May nakatatandang kapatid na tumutulong sa iyo. Ano ang magandang gawin?', c:['Igalang at pasalamatan siya','Sigawan siya','Huwag pansinin'], a:0, e:'Igalang at mahalin ang mga kapatid at pahalagahan ang kanilang tulong.'},
    {q:'Alin ang pinagsamang mabubuting tungkulin sa pamilya at tahanan?', c:['Mag-aral, gumalang, tumulong at sumunod sa alituntunin','Maglaro lamang at huwag tumulong','Magkalat at huwag makinig'], a:0, e:'Ang mabuting kasapi ng pamilya ay nagsisikap na gampanan ang kaniyang tungkulin at sumunod sa mga alituntunin.'}
  ]}
];

const state={round:0,q:0,score:0,correct:0,streak:0,badges:0,answered:false,sound:true};
const $=id=>document.getElementById(id);
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));$(id).classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}
function save(){localStorage.setItem('ap1Aralin11Progress',JSON.stringify({score:state.score,correct:state.correct,badges:state.badges}));}
function load(){try{const d=JSON.parse(localStorage.getItem('ap1Aralin11Progress'));if(d){state.score=d.score||0;state.correct=d.correct||0;state.badges=d.badges||0;}}catch(e){/* ignore corrupted local data */}}
function beep(ok=true){if(!state.sound)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const a=new C(),o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.value=ok?660:220;g.gain.value=.04;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.12)}catch(e){}}
function toast(t){const el=$('toast');el.textContent=t;el.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('show'),1800)}
function updateStats(){ $('score').textContent=state.score; $('streak').textContent=state.streak; $('badges').textContent=state.badges; }
function render(){
  const r=rounds[state.round], item=r.questions[state.q]; state.answered=false;
  $('roundLabel').textContent=r.label; $('roundTitle').textContent=r.title;
  $('questionCounter').textContent=`${state.q+1} / ${r.questions.length}`;
  const total=rounds.reduce((n,x)=>n+x.questions.length,0); const done=rounds.slice(0,state.round).reduce((n,x)=>n+x.questions.length,0)+state.q;
  $('progressBar').style.width=`${Math.round((done/total)*100)}%`; updateStats();
  $('gameCard').innerHTML=`<div class="question-number">Tanong ${state.q+1}</div><div class="question">${item.q}</div><div class="choices">${item.c.map((x,i)=>`<button class="choice" data-i="${i}" type="button">${String.fromCharCode(65+i)}. ${x}</button>`).join('')}</div>`;
  document.querySelectorAll('.choice').forEach(b=>b.addEventListener('click',()=>answer(Number(b.dataset.i))));
}
function answer(i){if(state.answered)return;state.answered=true;const item=rounds[state.round].questions[state.q];const buttons=[...document.querySelectorAll('.choice')];buttons.forEach(b=>b.disabled=true);buttons[item.a].classList.add('correct');
  if(i===item.a){state.correct++;state.streak++;state.score+=10+Math.min(state.streak,5);beep(true);toast('⭐ Tama! Napakagaling!');if(state.streak===3||state.streak===5){state.badges++;toast('🏅 Nakakuha ka ng badge!');}}
  else{state.streak=0;buttons[i].classList.add('wrong');beep(false);toast('💡 Subukan mong tandaan ang aralin.');}
  const f=document.createElement('div');f.className=`feedback ${i===item.a?'ok':'bad'}`;f.innerHTML=`${i===item.a?'✅':'📘'} ${item.e}`;$('gameCard').appendChild(f);
  const next=document.createElement('button');next.className='primary-btn next-btn';next.type='button';next.textContent=state.q<rounds[state.round].questions.length-1?'➡️ Susunod':'🏁 Tapusin ang Misyon';next.addEventListener('click',nextStep);$('gameCard').appendChild(next);updateStats();save();
}
function nextStep(){if(state.q<rounds[state.round].questions.length-1){state.q++;render();}else if(state.round<rounds.length-1){state.round++;state.q=0;render();toast('🔓 Bagong misyon ang nabuksan!');}else finish();}
function finish(){const total=rounds.reduce((n,x)=>n+x.questions.length,0);const pct=Math.round(state.correct/total*100);const stars=pct>=90?5:pct>=75?4:pct>=60?3:pct>=40?2:1;$('finalScore').textContent=state.score;$('finalCorrect').textContent=`${state.correct}/${total}`;$('finalStars').textContent='⭐'.repeat(stars);$('resultMessage').textContent=pct>=90?'Kahanga-hanga! Mahusay mong natutuhan ang mga tungkulin sa pamilya at tahanan!':pct>=60?'Magaling! Ipagpatuloy ang pagsasanay at pagsunod sa mabubuting tungkulin.':'Magandang pagsubok! Balikan ang aralin at subukan muli.';$('badgeDisplay').textContent=state.badges?`🏅 Mga Badge: ${state.badges}`:'🌱 Patuloy na magsanay para makakuha ng badge!';save();show('resultScreen');}
function start(){state.round=0;state.q=0;state.score=0;state.correct=0;state.streak=0;state.badges=0;render();show('gameScreen');}
function review(){show('homeScreen');}
$('startBtn').addEventListener('click',start);$('playAgainBtn').addEventListener('click',start);$('reviewBtn').addEventListener('click',review);$('homeBtn').addEventListener('click',()=>show('homeScreen'));
$('soundBtn').addEventListener('click',()=>{state.sound=!state.sound;$('soundBtn').textContent=state.sound?'🔊':'🔇';toast(state.sound?'Tunog: Bukas':'Tunog: Patay');});
$('resetBtn').addEventListener('click',()=>{if(confirm('I-reset ang na-save na progreso?')){localStorage.removeItem('ap1Aralin11Progress');state.score=0;state.correct=0;state.badges=0;state.streak=0;toast('Na-reset na ang progreso.');updateStats();show('homeScreen');}});
load();

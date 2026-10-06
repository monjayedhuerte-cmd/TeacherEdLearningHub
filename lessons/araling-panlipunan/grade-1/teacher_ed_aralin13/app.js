const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={mission:1,gameScore:0,quizScore:0,quizIndex:0,quizAnswered:false,gameRound:0,scenarioIndex:0,correct:0,total:0};
const photos=[
 ['share-toys.jpg','Pagbabahagi ng laruan','Magpaalam at magbahagi ng mga laruan.'],
 ['help-grandparents.jpg','Pagtulong kina Lolo at Lola','Tumulong sa pag-aalaga ng mga halaman sa hardin.'],
 ['share-food.jpg','Pagbabahagi ng pagkain','Ibahagi ang pagkain sa mga kapatid.'],
 ['care-younger-sibling.jpg','Pag-aalaga kay Bunso','Tumulong sa pag-aalaga sa nakababatang kapatid.'],
 ['care-sick-family.jpg','Pag-aalaga sa may sakit','Tumulong sa pag-aalaga sa kapamilyang may sakit.'],
 ['listen-parents.jpg','Pakikinig sa magulang','Pakinggan ang mga alituntuning ibinibigay nina Nanay at Tatay.'],
 ['clean-house.jpg','Pagtutulungan sa bahay','Sama-samang gumawa ng mga gawaing-bahay.'],
 ['family-tv.jpg','Sama-samang oras','Sama-samang manood ng telebisyon tuwing gabi.'],
 ['family-games.jpg','Pakikipaglaro','Makipaglaro sa Nanay at Tatay tuwing Sabado.'],
 ['family-outdoor.jpg','Paglalaro sa labas','Maglaro kasama ang pamilya kapag may pagkakataon.'],
 ['family-together.jpg','Pagsasama-sama','Ang pagsasama-sama ay nagpapakita ng pagpapahalaga sa isa’t isa.'],
 ['family-beach.jpg','Pamamasyal','Magkaroon ng masayang pagsasama-sama ng pamilya.']
];
const scenarios=[
 ['Nakita mong nahihirapan si Lolo sa pagdidilig ng mga halaman. Ano ang maaari mong gawin?',['Tulungan si Lolo.','Iwan si Lolo at maglaro.','Itago ang pandilig.'],0],
 ['Gusto mong gamitin ang laruan ng iyong Ate. Ano ang dapat mong gawin?',['Agawin ito.','Magpaalam muna.','Itago ito.'],1],
 ['May kapamilyang may sakit. Ano ang mabuting gawin?',['Tulungan at alagaan siya.','Huwag siyang pansinin.','Ingay-ingayan sa tabi niya.'],0],
 ['May pagkain ka at may kapatid kang wala pa. Ano ang magandang gawin?',['Itago ang pagkain.','Kainin lahat agad.','Magbahagi.'],2]
];
const gameRounds=[
 ['Si Bunso ay nangangailangan ng tulong habang naglalaro ka.',['Tulungan si Bunso.','Sabihin “Ayoko!”','Itago ang kaniyang gamit.'],0],
 ['Nais mong gamitin ang gamit ng kapatid mo.',['Agawin ito.','Magpaalam at makihati.','Itapon ito.'],1],
 ['May gawain sa bahay na kaya mong gawin.',['Tumulong sa gawain.','Magkunwaring hindi nakita.','Iwan ang kalat.'],0],
 ['Nagbibigay ng payo sina Nanay at Tatay.',['Makinig at sumunod sa mabuting payo.','Sumigaw.','Tumalikod.'],0],
 ['May pagkakataon kayong magsama-sama bilang pamilya.',['Makilahok at magsaya kasama sila.','Umalis agad nang walang paalam.','Huwag pansinin ang lahat.'],0]
];
const pictureTasks=[
 ['share-food.jpg','Ano ang magandang kilos sa larawan?',['Magbahagi ng pagkain.','Agawin ang pagkain.'],0],
 ['clean-house.jpg','Ano ang ipinapakita ng pamilya?',['Pagtutulungan.','Pag-aaway.'],0],
 ['listen-parents.jpg','Ano ang ipinapakitang pagpapahalaga?',['Pakikinig sa magulang.','Hindi pakikinig.'],0],
 ['help-grandparents.jpg','Ano ang magandang gawin?',['Tumulong kina Lolo at Lola.','Iwasan sila.'],0]
];
function goTo(id){document.getElementById(id).scrollIntoView({behavior:'smooth',block:'start'});}
function setMission(n){state.mission=Math.max(state.mission,n);const pct=Math.min(100,Math.round(state.mission/10*100));$('#progressBar').style.width=pct+'%';$('#progressText').textContent=pct+'%';$('#missionLabel').textContent=`Misyon ${Math.min(state.mission,10)} sa 10`;}
function mark(correct){state.total++;if(correct)state.correct++;}
// Engage mystery
let mysteryIndex=0; const mysteries=[['share-toys.jpg','May dalawang magkapatid na naglalaro. Ano ang magandang gawin kapag nais mong gamitin ang laruan ng iyong kapatid?',['Magpaalam muna.','Agawin ang laruan.','Itago ang laruan.'],0],['help-grandparents.jpg','Nakita mong nag-aalaga ng halaman sina Lolo at Lola. Ano ang maaari mong gawin?',['Tumulong.','Tumakbo palayo.','Guluhin ang mga halaman.'],0],['share-food.jpg','May pagkain ka at may kapatid kang wala pa. Ano ang magandang gawin?',['Magbahagi.','Itago lahat.','Agawin ang pagkain niya.'],0]];
function loadMystery(){const m=mysteries[mysteryIndex];$('#mysteryImg').src='assets/images/'+m[0];$('#mysteryPrompt').textContent=m[1];$('#mysteryFeedback').textContent='';$('#mysteryChoices').innerHTML=m[2].map((x,i)=>`<button data-correct="${i===m[3]}">${x}</button>`).join('');$$('#mysteryChoices button').forEach(b=>b.onclick=()=>{const ok=b.dataset.correct==='true';mark(ok);b.classList.add(ok?'revealed':'');$('#mysteryFeedback').className='feedback '+(ok?'good':'bad');$('#mysteryFeedback').textContent=ok?'Mahusay! Iyan ay nagpapakita ng pagmamahal at paggalang.':'Subukan muli. Isipin kung alin ang nagpapakita ng pagmamahal at paggalang.';});}
function nextMystery(){mysteryIndex=(mysteryIndex+1)%mysteries.length;loadMystery();setMission(2);goTo('explore');}
// photos
$('#photoGrid').innerHTML=photos.map(p=>`<article class="photo-card" tabindex="0"><img src="assets/images/${p[0]}" alt="${p[1]}"><div class="photo-copy"><h3>${p[1]}</h3><p>${p[2]}</p></div></article>`).join('');
$$('.photo-card').forEach(c=>c.addEventListener('click',()=>{c.classList.toggle('revealed')}));
// guided scenario
function renderScenario(){const s=scenarios[state.scenarioIndex];$('#scenarioNum').textContent=state.scenarioIndex+1;$('#scenarioText').textContent=s[0];$('#scenarioOptions').innerHTML=s[1].map((x,i)=>`<button>${x}</button>`).join('');$('#scenarioFeedback').textContent='';$$('#scenarioOptions button').forEach((b,i)=>b.onclick=()=>{const ok=i===s[2];mark(ok);$('#scenarioFeedback').className='feedback '+(ok?'good':'bad');$('#scenarioFeedback').textContent=ok?'Tama! Iyan ay mabuting paraan ng pagmamahal at pagtulong.':'Balikan ang tanong. Alin ang nagpapakita ng pagmamahal, paggalang, o pagtutulungan?';b.classList.add(ok?'revealed':'');});}
$('#scenarioNext').onclick=()=>{state.scenarioIndex=(state.scenarioIndex+1)%scenarios.length;renderScenario();setMission(4)};
// game
function renderGame(){const r=gameRounds[state.gameRound];$('#gameRound').innerHTML=`<div class="round-card"><span class="eyebrow">ROUND ${state.gameRound+1}</span><h3>${r[0]}</h3><div class="round-options">${r[1].map((x,i)=>`<button data-i="${i}">${x}</button>`).join('')}</div><div id="gameFeedback" class="feedback"></div></div>`;$$('.round-options button').forEach(b=>b.onclick=()=>{if(b.disabled)return;const ok=+b.dataset.i===r[2];mark(ok);b.disabled=true;if(ok){state.gameScore+=10;$('#gameScore').textContent=state.gameScore}$('#gameFeedback').className='feedback '+(ok?'good':'bad');$('#gameFeedback').textContent=ok?'Excellent! Tama ang kilos.':'Hindi ito ang pinakamainam na kilos. Isipin kung paano makatutulong sa pamilya.';setTimeout(()=>{state.gameRound=(state.gameRound+1)%gameRounds.length;renderGame();setMission(6)},650);});}
// picture challenge
$('#pictureChallenge').innerHTML=pictureTasks.map((p,idx)=>`<div class="picture-box"><img src="assets/images/${p[0]}" alt="Larawan"><div class="picture-body"><h3>${p[1]}</h3>${p[2].map((x,i)=>`<button data-correct="${i===p[3]}">${x}</button>`).join('')}<div id="picFb${idx}" class="feedback"></div></div></div>`).join('');$$('.picture-box button').forEach(b=>b.onclick=()=>{const ok=b.dataset.correct==='true';mark(ok);const fb=b.parentElement.querySelector('.feedback');fb.className='feedback '+(ok?'good':'bad');fb.textContent=ok?'Tama!':'Subukan muli at tingnan ang ipinapakitang kilos sa larawan.'});
function thinkAnswer(ok,b){mark(ok);$$('.think-options button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');$('#thinkFeedback').className='feedback '+(ok?'good':'bad');$('#thinkFeedback').textContent=ok?'Tama! Ang pag-aalaga ay malinaw na pagpapakita ng pagmamahal.':'Isipin kung ano ang makatutulong sa kapamilyang may sakit.';setMission(8)}
function masterAnswer(ok,b){mark(ok);$$('.master-options button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');$('#masterFeedback').className='feedback '+(ok?'good':'bad');$('#masterFeedback').textContent=ok?'Mastery evidence: Naipili mo ang kilos na nagpapakita ng paggalang at pagbabahagi.':'Balikan ang ideya ng pagmamahal at paggalang sa bawat kasapi ng pamilya.';setMission(10)}
// timer
let timerHandle;$('#startTimer').onclick=()=>{clearInterval(timerHandle);let n=30;$('#timer').textContent=n;$('#timerMessage').textContent='Magsimula!';timerHandle=setInterval(()=>{n--;$('#timer').textContent=n;if(n<=0){clearInterval(timerHandle);$('#timerMessage').className='feedback good';$('#timerMessage').textContent='Tapos na! Ibahagi ang iyong 3 sagot sa klase.'}},1000)};
// quiz
const quiz=[
 ['Ano ang mahalaga sa bawat kasapi ng pamilya?',['Pagmamahalan','Pag-aaway','Pag-iwas'],0],
 ['Ano ang dapat gawin sa kapwa kasapi ng pamilya?',['Igalang','Sigawan','Pabayaan'],0],
 ['Alin ang nagpapakita ng pagtutulungan?',['Sama-samang paglilinis ng bahay','Pag-iiwan ng kalat','Pag-aagawan'],0],
 ['Ano ang magandang gawin kapag gusto mong gamitin ang gamit ng kapatid?',['Magpaalam','Agawin','Itago'],0],
 ['Ano ang magandang gawin sa kapamilyang may sakit?',['Alagaan','Pagtawanan','Huwag pansinin'],0],
 ['Ano ang nagpapakita ng pakikinig sa magulang?',['Pakikinig sa kanilang payo','Pagtalikod','Pagsigaw'],0],
 ['Bakit mahalaga ang malapit na ugnayan sa pamilya?',['Nagpapakita ito ng pagpapahalaga sa isa’t isa','Para laging makuha ang gusto','Para hindi tumulong'],0],
 ['Ano ang isang paraan ng pagmamahal sa kapatid?',['Magbahagi','Mang-agaw','Mang-asar'],0]
];
function renderQuiz(){const q=quiz[state.quizIndex];$('#quizCount').textContent=`Tanong ${state.quizIndex+1} sa ${quiz.length}`;$('#quizScore').textContent=`Puntos: ${state.quizScore}`;$('#quizQuestion').textContent=q[0];$('#quizFeedback').textContent='';$('#quizOptions').innerHTML=q[1].map((x,i)=>`<button data-i="${i}">${x}</button>`).join('');state.quizAnswered=false;$$('#quizOptions button').forEach(b=>b.onclick=()=>{if(state.quizAnswered)return;state.quizAnswered=true;const ok=+b.dataset.i===q[2];mark(ok);if(ok)state.quizScore++;b.classList.add('selected');$('#quizFeedback').className='feedback '+(ok?'good':'bad');$('#quizFeedback').textContent=ok?'Tama! Naipakita mo ang tamang konsepto.':'Balikan ang aralin at hanapin ang kilos na nagpapakita ng pagmamahal o paggalang.';$('#quizScore').textContent=`Puntos: ${state.quizScore}`;});}
$('#quizNext').onclick=()=>{if(!state.quizAnswered){$('#quizFeedback').className='feedback bad';$('#quizFeedback').textContent='Pumili muna ng sagot.';return}if(state.quizIndex<quiz.length-1){state.quizIndex++;renderQuiz()}else{setMission(10);$('#quizFeedback').className='feedback good';$('#quizFeedback').textContent=`Tapos na! Nakakuha ka ng ${state.quizScore}/${quiz.length}.`;}};
function showTeacherReport(){const acc=state.total?Math.round(state.correct/state.total*100):0;$('#reportAccuracy').textContent=acc+'%';$('#reportGame').textContent=state.gameScore;$('#reportMastery').textContent=state.quizScore>=7&&state.correct>=8?'MASTERED':state.quizScore>=5?'DEVELOPING':'NEEDS PRACTICE';$('#teacherReport').classList.remove('hidden')}
function closeModal(){$('#teacherReport').classList.add('hidden')}
function attentionSignal(){document.body.classList.remove('attention');void document.body.offsetWidth;document.body.classList.add('attention');setTimeout(()=>document.body.classList.remove('attention'),1600)}
$('#largeTextBtn').onclick=()=>document.body.classList.toggle('large-text');$('#contrastBtn').onclick=()=>document.body.classList.toggle('high-contrast');
loadMystery();renderScenario();renderGame();renderQuiz();setMission(1);

const data=[
['Grade 1','Math','Eyes on Me','Teacher: “Math minds, eyes on me!”','Students: “Ready to think!”','Use before modeling a new number idea.','Whole-class instruction'],
['Grade 1','English','Hocus Pocus','Teacher: “Hocus pocus!”','Students: “Everybody focus!”','Pause until the response is complete, then begin reading.','Reading / phonics'],
['Grade 1','Science','Scientists Ready','Teacher: “Scientists…”','Students: “Observe!”','Point to an object and ask students to prepare their eyes and ears.','Science observation'],
['Grade 1','Filipino','Makinig Tayo','Guro: “Mga batang handa…”','Mag-aaral: “Makikinig!”','Use before storytelling, vocabulary, or oral practice.','Talakayan'],
['Grade 1','Araling Panlipunan','Mga Historyador','Guro: “Mga historyador!”','Mag-aaral: “Handa!”','Use when shifting into community, family, or history content.','AP discussion'],
['Grade 1','Transition','5–4–3–2–1','Teacher: “5…4…3…2…1…”','Students: “Ready!”','Give a concrete action: pencils down, turn, eyes front.','Transitions'],
['Grade 1','Group Work','Team Check','Teacher: “Teams, check!”','Students: “Ready to learn!”','Use before giving the next group-work direction.','Collaborative work'],
['Grade 1','Noisy Class Reset','Hands on Top','Teacher: “Hands on top!”','Students: “That means stop!”','Raise both hands; wait for hands and voices to settle.','High-noise moments'],
['Grade 2','Math','Number Sense','Teacher: “Number minds…”','Students: “Think!”','Use before posing a mental-math question.','Math discussion'],
['Grade 2','English','Word Detectives','Teacher: “Word detectives…”','Students: “Ready to find!”','Use before vocabulary, context clues, or grammar.','English'],
['Grade 2','Science','Science Signal','Teacher: “Ready, scientists?”','Students: “Ready to discover!”','Pair with a visual or object students must inspect.','Science'],
['Grade 2','Filipino','Wika Tayo','Guro: “Mga batang mahusay sa wika…”','Mag-aaral: “Handa nang magsalita!”','Use before sentence building or oral language practice.','Filipino'],
['Grade 2','Araling Panlipunan','Bayanihan Beat','Guro: “Bayanihan!”','Mag-aaral: “Sama-sama!”','Great for civic/community lessons and cooperative tasks.','AP / values'],
['Grade 2','Transition','Freeze Like a Statue','Teacher: “Freeze like a statue!”','Students: “Freeze!”','Use a playful freeze, then give the next direction.','Movement transition'],
['Grade 2','Group Work','1–2–3 Check','Teacher: “One, two, three—check!”','Students: “Team is ready!”','Students check materials, roles, and voices.','Group work'],
['Grade 2','Noisy Class Reset','Clap Copy','Teacher: clap a short rhythm','Students: repeat the exact rhythm','Change the pattern occasionally; wait for silence after the echo.','Noisy / energetic class'],
['Grade 3','Math','Solve It Signal','Teacher: “Problem solvers…”','Students: “Think before you speak!”','Excellent before word problems and multi-step reasoning.','Math problem solving'],
['Grade 3','English','Eyes, Ears, Mind','Teacher: “Eyes, ears…”','Students: “Mind ready!”','Use before a complex text or explanation.','English discussion'],
['Grade 3','Science','Observe–Think','Teacher: “Observe…”','Students: “Think!”','Hold up an image, specimen, or demonstration.','Science inquiry'],
['Grade 3','Filipino','Salita at Diwa','Guro: “Salita…”','Mag-aaral: “Diwa!”','Use before discussing meaning, context, or author’s message.','Filipino reading'],
['Grade 3','Araling Panlipunan','Lakbay Kasaysayan','Guro: “Biyahe sa kasaysayan!”','Mag-aaral: “Handa!”','Use to signal a story, timeline, or historical source.','AP history'],
['Grade 3','Transition','Ready, Set… Learn!','Teacher: “Ready, set…”','Students: “Learn!”','Use between stations, subjects, or learning phases.','Transitions'],
['Grade 3','Group Work','Team Signal','Teacher: “Team, team!”','Students: “Yes, team!”','Use once; teams stop and look before the next instruction.','Group work'],
['Grade 3','Noisy Class Reset','Waterfall','Teacher: “Waterfall…”','Students: make a soft “shhhhh” sound','Use sparingly; it should end in complete silence.','Noisy reset'],
['Grade 1','Math','Show Me Ready','Teacher: “Show me you’re ready for math.”','Students: eyes forward, hands ready','Make readiness observable rather than asking “Are you listening?”','Math transition'],
['Grade 2','English','If You Hear Me','Teacher: “If you hear me, touch your head.”','Students: follow the cue','Move from simple actions to eyes-on-teacher.','English / reset'],
['Grade 1','Science','Curious Minds','Teacher: “Curious minds…”','Students: “Look, listen, learn!”','Use before a demonstration or prediction.','Science'],
['Grade 2','Filipino','Makinig, Isipin, Sabihin','Guro: “Makinig…”','Mag-aaral: “Isipin, saka sabihin!”','Builds a habit of thinking before answering.','Oral recitation'],
['Grade 3','Araling Panlipunan','Eyes on the Evidence','Teacher: “Eyes on the evidence!”','Students: “Ready to investigate!”','Use before maps, photos, primary sources, or charts.','AP inquiry'],
['Grade 3','Noisy Class Reset','Quiet Challenge','Teacher: “Can this class get ready in 5?”','Students: silently reset before 1','Turn attention into a timed challenge without yelling.','Noisy reset']
];
let selected=0,favs=JSON.parse(localStorage.getItem('edjay_attention_favs')||'[]');
const $=id=>document.getElementById(id);function filtered(){const g=$('grade').value,c=$('category').value,q=$('search').value.toLowerCase();return data.map((x,i)=>({x,i})).filter(o=>(g==='All'||o.x[0]===g)&&(c==='All'||o.x[1]===c)&&(!q||o.x.join(' ').toLowerCase().includes(q)));}
function render(){const list=filtered();$('visibleCount').textContent=list.length;$('cards').innerHTML=list.map(o=>card(o.x,o.i)).join('');document.querySelectorAll('.card[data-index]').forEach(el=>el.addEventListener('click',()=>select(+el.dataset.index)));if(!list.some(o=>o.i===selected)&&list[0])select(list[0].i);else if(!list.length){$('cards').innerHTML='<div class="panel">No attention getters match your filters.</div>';}}
function card(x,i){return `<article class="card ${i===selected?'active':''}" data-index="${i}"><div class="card-top"><span class="day">DAY ${i+1}</span><span class="tag">${x[0]} • ${x[1]}</span></div><h3>${x[2]}</h3><p>${x[3]}</p></article>`}
function select(i){selected=i;const x=data[i];$('selectedTitle').textContent=`Day ${i+1} • ${x[2]}`;$('dayLabel').textContent=`Day ${i+1} of 30`;$('teacherCue').textContent=x[3].replace(/^Teacher: |^Guro: /,'');$('studentCue').textContent=x[4].replace(/^Students: |^Mag-aaral: /,'');$('teacherMove').textContent=x[5];$('bestFor').textContent=x[6];$('favBtn').textContent=favs.includes(i)?'★ Favorited':'☆ Favorite';renderCardsOnly();}
function renderCardsOnly(){$('cards').innerHTML=filtered().map(o=>card(o.x,o.i)).join('');document.querySelectorAll('.card[data-index]').forEach(el=>el.addEventListener('click',()=>select(+el.dataset.index)));}
function move(n){const list=filtered();if(!list.length)return;let pos=list.findIndex(o=>o.i===selected);pos=(pos+n+list.length)%list.length;select(list[pos].i)}
$('grade').addEventListener('change',render);$('category').addEventListener('change',render);$('search').addEventListener('input',render);$('prevBtn').onclick=()=>move(-1);$('nextBtn').onclick=()=>move(1);$('randomBtn').onclick=()=>{const l=filtered();if(l.length)select(l[Math.floor(Math.random()*l.length)].i)};
$('favBtn').onclick=()=>{if(favs.includes(selected))favs=favs.filter(x=>x!==selected);else favs.push(selected);localStorage.setItem('edjay_attention_favs',JSON.stringify(favs));select(selected)};
$('copyBtn').onclick=async()=>{const x=data[selected];const t=`${x[2]}\n${x[3]}\n${x[4]}`;try{await navigator.clipboard.writeText(t);$('copyBtn').textContent='Copied!';setTimeout(()=>$('copyBtn').textContent='Copy Cue',1200)}catch(e){alert(t)}};
$('speakBtn').onclick=()=>{if(!('speechSynthesis'in window))return alert('Speech is not supported in this browser.');const x=data[selected];speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(`${x[3]}. ${x[4]}`))};
$('printBtn').onclick=()=>window.print();
const present=$('present');function updatePresent(){const x=data[selected];$('presentDay').textContent=`DAY ${selected+1} • ${x[0]} • ${x[1]}`;$('presentTeacher').textContent=x[3].replace(/^Teacher: |^Guro: /,'');$('presentStudent').textContent=x[4].replace(/^Students: |^Mag-aaral: /,'');$('presentTip').textContent=x[5]}
$('presentBtn').onclick=()=>{updatePresent();present.classList.remove('hidden')};$('closePresent').onclick=()=>present.classList.add('hidden');$('presentNext').onclick=()=>{move(1);updatePresent()};document.addEventListener('keydown',e=>{if(!present.classList.contains('hidden')&&e.key==='Escape')present.classList.add('hidden');});
render();select(0);

const stages=[
{name:"Welcome to Math World",cue:"Welcome learners and preview the predictable mission sequence."},
{name:"The Shopping Hook",cue:"Ask the hook question before teaching the procedure. Let learners predict."},
{name:"Math Vocabulary",cue:"Say, point, and use each word. Keep definitions short."},
{name:"The Regrouping Lab",cue:"Make regrouping visible: 10 ones become 1 ten."},
{name:"LINE → START → ADD → REGROUP → CHECK",cue:"Model one step at a time. Keep the five-step routine visible."},
{name:"Guided Practice",cue:"Pause after each column. Ask learners to show the current column."},
{name:"Team Shop",cue:"Give each learner a clear group role: reader, aligner, calculator, checker."},
{name:"Mastery Mission",cue:"Increase the number size gradually. Ask for reasoning, not only answers."},
{name:"Generalize",cue:"Ask learners to explain when and why regrouping happens."},
{name:"Exit Mission",cue:"Allow quiet processing time. Check accuracy and the student's process."}
];

let page=0,xp=0,checks=0,sound=true;
const app=document.getElementById("app");

function nav(){return `<div class="nav"><button class="secondary" onclick="prev()" ${page===0?"disabled":""}>← Previous</button><button class="primary" onclick="next()">${page===stages.length-1?"Finish Mission":"Next →"}</button></div>`}
function shell(title,sub,body){return `<section class="screen active"><div class="section-head"><h2>${title}</h2><p>${sub}</p></div>${body}${nav()}</section>`}
function render(){
let c="";
if(page===0)c=`<section class="screen active">
<div class="world-hero"><div class="kicker">GRADE 2 • MATH WORLD • MISSION 03</div><h2>Adding Numbers<br>with Regrouping</h2><p>Welcome, Math Explorer. Today we enter the Regrouping Lab, where numbers can “move” into a new place-value home.</p><div class="target-box"><strong>Mission Target:</strong> I can add 4- to 6-digit numbers, up to four addends, with regrouping.</div></div>
<div class="mission-map">${["🚀","🛒","🔤","🧪","🧭"].map((x,i)=>`<div class="map-node ${i===0?"current":""}"><span class="map-icon">${x}</span>${["Hook","Vocabulary","Regroup","Practice","Mastery"][i]}</div>`).join("")}</div>
<div class="card-grid"><div class="card"><h3>Our Math Code</h3><p><b>LINE → START → ADD → REGROUP → CHECK</b></p></div><div class="card"><h3>What You Will Learn</h3><p>Add 4- to 6-digit numbers, including up to four addends, when regrouping is needed.</p></div><div class="card"><h3>Explorer Support</h3><p>Visual steps, short directions, response actions, processing time, and Focus Mode are built into the lesson.</p></div></div>${nav()}</section>`;

if(page===1)c=shell("The Big Hook: Math Shopping Mission","Imagine your class is preparing a new Math Supply Station. Your team must choose items and find the total cost.",`
<div class="hook"><div class="coin">₱</div><h3>TEAM MISSION</h3><p>Four teammates each choose a classroom item.</p>
<div class="number-sentence">₱65 + ₱254 + ₱140 + ₱200 = ?</div>
<div class="question">Can you find the total without letting the numbers “overflow” into the wrong place?</div>
<div class="choice-grid"><button class="choice" onclick="pick(this,true,'hookfb')">Yes — I will line up the place values.</button><button class="choice" onclick="pick(this,false,'hookfb')">I will just add the digits anywhere.</button></div><div id="hookfb" class="feedback"></div>
<div class="challenge"><b>Teacher Hook:</b> “Something special happens when a column reaches 10. Today you will discover where the extra value goes.”</div></div>
<div class="panel"><h3>Quick Prediction</h3><p>Ask: “What do you think happens when 8 + 7 gives 15? Can 15 fit in one ones column?”</p><p><b>Do not explain yet.</b> Let learners predict first.</p></div>`);

if(page===2)c=shell("Math Vocabulary Vault","These words are tools for thinking. Have learners say them, point to examples, and use them.",`
<div class="vault">
<div class="word"><div class="term">Addend</div><div class="definition">A number that is being added.</div><div class="example">65 is an addend.</div></div>
<div class="word"><div class="term">Sum</div><div class="definition">The answer to an addition problem.</div><div class="example">65 + 25 = 90. The sum is 90.</div></div>
<div class="word"><div class="term">Place Value</div><div class="definition">The value a digit has because of its position.</div><div class="example">The 5 in 65 is 5 ones.</div></div>
<div class="word"><div class="term">Regroup</div><div class="definition">Exchange 10 of one place value for 1 of the next place value.</div><div class="example">10 ones = 1 ten.</div></div>
<div class="word"><div class="term">Column</div><div class="definition">Digits arranged vertically in the same place-value position.</div><div class="example">Ones stay in the ones column.</div></div>
<div class="word"><div class="term">Number Sentence</div><div class="definition">A mathematical sentence using numbers, operation symbols and an equality/inequality relationship.</div><div class="example">65 + 25 = 90</div></div>
</div>
<div class="panel"><b>Teacher prompt:</b> “Which word tells us the answer? Which word tells us a number being added? Which word tells us what happens when we make a group of ten?”</div>`);

if(page===3)c=shell("The Regrouping Lab","Watch what happens when a column reaches 10. This is the key idea behind today's lesson.",`
<div class="math-board"><h3>LAB 1 — TEN ONES BECOME ONE TEN</h3>
<div class="equation">8 + 7 = 15</div>
<div id="regroupVisual" class="represent"><div class="unit-group"><b>15</b><small>ones</small></div></div>
<div class="choice-grid"><button class="choice" onclick="regroupStep(1)">Show 10 ones</button><button class="choice" onclick="regroupStep(2)">Regroup</button><button class="choice" onclick="regroupStep(3)">Show the result</button></div>
<div id="labFeedback" class="feedback"></div>
</div>
<div class="panel"><h3>The Big Idea</h3><p><b>10 ones = 1 ten.</b> We write the 5 ones in the ones column and move the 1 ten to the tens column.</p><div class="number-sentence">15 ones = 1 ten + 5 ones</div></div>`);

if(page===4)c=shell("The Math World Navigation Code","Use the same five steps every time. Predictability makes a difficult skill easier to remember.",`
<div class="steps">
<div class="step"><div class="step-num">1</div><strong>LINE</strong><small>Align place values.</small></div>
<div class="step"><div class="step-num">2</div><strong>START</strong><small>Begin at ones.</small></div>
<div class="step"><div class="step-num">3</div><strong>ADD</strong><small>Add the column.</small></div>
<div class="step"><div class="step-num">4</div><strong>REGROUP</strong><small>Move the extra value.</small></div>
<div class="step"><div class="step-num">5</div><strong>CHECK</strong><small>Check every column.</small></div>
</div>
<div class="math-board"><h3>Teacher Modeling</h3><div class="equation">     1  1
   3,482
+  2,759
---------
   6,241</div><p><b>Teacher language:</b> “LINE. START at ones. ADD. If the column is 10 or more, REGROUP. Then CHECK.”</p><p>Point to the current column as you speak. Do not give all five instructions at once.</p></div>`);

if(page===5)c=shell("Guided Practice: You Are the Co-Pilot","Solve with the teacher. Stop after each column and show your thinking.",`
<div class="math-board"><h3>Mission Problem</h3><div class="equation">   4,682
   2,759
+  1,436
---------
      ?</div><p>What is the sum?</p><div class="input-row"><input id="guided" class="answer" inputmode="numeric" placeholder="Type answer"><button class="primary" onclick="checkAnswer('guided','8877','guidedFb')">Check</button></div><div id="guidedFb" class="feedback"></div></div>
<div class="panel"><h3>Teacher Questioning Sequence</h3><ol><li>“Which column are we working on?”</li><li>“What is the column sum?”</li><li>“Is it 10 or more?”</li><li>“What do we write?”</li><li>“What do we regroup?”</li><li>“Where does it go?”</li></ol></div>`);

if(page===6)c=shell("Team Shop: Build the Best Bundle","Choose four items. Then calculate the total. Give every learner a role.",`
<div class="shop"><div class="selected-count">Selected: <span id="selectedCount">0</span> / 4</div>
<div class="items" id="items">
${[
["📓","Notebook",65],["📘","Dictionary",254],["✏️","Color Pencils",140],["📄","Bond Paper",200],
["🖍️","Marker",33],["📏","Ruler",22],["📁","Envelope",18],["🧰","Pencil Case",45]
].map((a,i)=>`<button class="item" data-price="${a[2]}" onclick="toggleItem(this)"><div class="emoji">${a[0]}</div><b>${a[1]}</b><div class="price">₱${a[2]}</div></button>`).join("")}</div>
<div class="challenge"><b>Team Roles:</b> Reader • Aligner • Calculator • Checker</div>
<button class="primary" onclick="calculateShop()">Calculate My Bundle</button><div id="shopResult" class="feedback"></div></div>
<div class="panel"><h3>Number Sentence</h3><p>After finding the total, write it as a number sentence:</p><div id="shopSentence" class="number-sentence">Choose four items first.</div></div>`);

if(page===7)c=shell("Mastery Mission","Level up from a 4-digit problem to a 6-digit, four-addend problem.",`
<div class="assess-grid">
<div class="problem"><h3>Level 1 — 4 Digits</h3><div class="equation">  3,456
+ 2,789
-------
    ?</div><input id="l1" class="answer" placeholder="Answer"><button class="primary" onclick="checkAnswer('l1','6245','l1fb')">Check</button><div id="l1fb" class="feedback"></div></div>
<div class="problem"><h3>Level 2 — 3 Addends</h3><div class="equation">  4,682
  2,759
+ 1,436
-------
    ?</div><input id="l2" class="answer" placeholder="Answer"><button class="primary" onclick="checkAnswer('l2','8877','l2fb')">Check</button><div id="l2fb" class="feedback"></div></div>
<div class="problem"><h3>Level 3 — 4 Addends</h3><div class="equation">  124,321
  213,112
  132,221
+ 110,314
---------
       ?</div><input id="l3" class="answer" placeholder="Answer"><button class="primary" onclick="checkAnswer('l3','579968','l3fb')">Check</button><div id="l3fb" class="feedback"></div></div>
</div>
<div class="challenge"><b>Advanced Explorer:</b> Create a 4-addend problem that requires regrouping in at least two columns. Explain why regrouping occurs.</div>`);

if(page===8)c=shell("Generalize: Become the Math Teacher","The strongest evidence of learning is explaining the idea.",`
<div class="panel"><div class="question">When do we regroup?</div><div class="choice-grid"><button class="choice" onclick="pick(this,true,'gen')">When a column has a sum of 10 or more.</button><button class="choice" onclick="pick(this,false,'gen')">Whenever the numbers are 4 digits.</button></div><div id="gen" class="feedback"></div></div>
<div class="panel"><div class="question">Why do we align the numbers?</div><div class="choice-grid"><button class="choice" onclick="pick(this,true,'align')">So the same place values are in the same column.</button><button class="choice" onclick="pick(this,false,'align')">So the biggest number is on top.</button></div><div id="align" class="feedback"></div></div>
<div class="panel"><h3>Teach-back challenge</h3><p>Ask one learner to explain <b>LINE → START → ADD → REGROUP → CHECK</b> while another learner points to each step.</p></div>`);

if(page===9)c=shell("Exit Mission","Work independently. The teacher checks both the answer and the process.",`
<div class="assess-grid">
<div class="problem"><h3>1. Add</h3><div class="equation">  23,214
  12,321
+ 14,132
--------
      ?</div><input id="e1" class="answer" placeholder="Answer"><button class="primary" onclick="checkAnswer('e1','49667','e1fb')">Check</button><div id="e1fb" class="feedback"></div></div>
<div class="problem"><h3>2. Add Four Addends</h3><div class="equation">  124,321
  213,112
  132,221
+ 110,314
---------
       ?</div><input id="e2" class="answer" placeholder="Answer"><button class="primary" onclick="checkAnswer('e2','579968','e2fb')">Check</button><div id="e2fb" class="feedback"></div></div>
</div>
<div class="panel"><h3>Explain</h3><p>Why does regrouping happen?</p><textarea id="explain" placeholder="Write or explain your answer to your teacher..."></textarea></div>
<button class="primary" onclick="finishMission()">Complete Mission</button>`);

app.innerHTML=c;updateUI();
}

function updateUI(){
document.getElementById("stageTitle").textContent=stages[page].name;
document.getElementById("teacherCue").textContent=stages[page].cue;
document.getElementById("xpText").textContent=xp+" XP";
document.getElementById("xpBar").style.width=Math.min(100,xp/10)+"%";
document.querySelectorAll(".mission-map .map-node").forEach((n,i)=>{n.classList.toggle("current",i===Math.min(page,4));n.classList.toggle("done",i<page)});
window.scrollTo({top:0,behavior:"smooth"});
}

function next(){if(page<stages.length-1){page++;render()}else finishMission()}
function prev(){if(page>0){page--;render()}}
function award(points=10){xp+=points;updateUI();beep()}
function clean(v){return String(v).replace(/,/g,"").replace(/\s/g,"").trim()}
function checkAnswer(id,target,fb){
const v=clean(document.getElementById(id).value),f=document.getElementById(fb);
if(v===clean(target)){f.textContent="Correct. Now explain the regrouping step.";f.className="feedback ok";checks++;award(10)}
else{f.textContent="Not yet. Start at the ones column and check each place value.";f.className="feedback no"}
}
function pick(el,ok,id){
el.parentElement.querySelectorAll(".choice").forEach(b=>b.classList.remove("correct","wrong"));
el.classList.add(ok?"correct":"wrong");const f=document.getElementById(id);
f.textContent=ok?"Correct. Explain why.":"Think about place value and the purpose of regrouping.";
f.className="feedback "+(ok?"ok":"no");if(ok){checks++;award(5)}
}
function regroupStep(step){
const v=document.getElementById("regroupVisual"),f=document.getElementById("labFeedback");
if(step===1){v.innerHTML='<div class="unit-group"><b>10</b><small>ones</small></div><div class="unit-group"><b>5</b><small>ones</small></div>';f.textContent="We can make one group of 10 ones and have 5 ones left.";f.className="feedback ok"}
if(step===2){v.innerHTML='<div class="unit-group"><b>1</b><small>ten</small></div><div class="unit-group"><b>5</b><small>ones</small></div>';f.textContent="Regroup 10 ones as 1 ten.";f.className="feedback ok";award(5)}
if(step===3){v.innerHTML='<div class="unit-group"><b>1</b><small>ten</small></div><div class="unit-group"><b>5</b><small>ones</small></div>';f.innerHTML="<b>15 = 1 ten + 5 ones.</b> The 1 moves to the tens column.";f.className="feedback ok"}
}
function toggleItem(btn){
const selected=document.querySelectorAll(".item.selected");
if(!btn.classList.contains("selected")&&selected.length>=4)return;
btn.classList.toggle("selected");document.getElementById("selectedCount").textContent=document.querySelectorAll(".item.selected").length;
}
function calculateShop(){
const selected=[...document.querySelectorAll(".item.selected")];
if(selected.length!==4){document.getElementById("shopResult").textContent="Choose exactly four items for your team mission.";document.getElementById("shopResult").className="feedback no";return}
const prices=selected.map(x=>Number(x.dataset.price)),sum=prices.reduce((a,b)=>a+b,0);
document.getElementById("shopResult").textContent="Team total: ₱"+sum.toLocaleString()+" — check your place values!";
document.getElementById("shopResult").className="feedback ok";
document.getElementById("shopSentence").textContent=prices.map(p=>"₱"+p).join(" + ")+" = ₱"+sum.toLocaleString();
checks++;award(15);
}
function finishMission(){
document.getElementById("finalMessage").innerHTML="<b>"+xp+" XP earned</b><br>"+checks+" interactive checks completed.<br><br>Teacher: use your observations and exit answers to identify learners who need another guided example or an enrichment challenge.";
document.getElementById("finishModal").classList.remove("hidden");beep();
}
function beep(){
if(!sound)return;
try{const C=window.AudioContext||window.webkitAudioContext,c=new C,o=c.createOscillator(),g=c.createGain();o.frequency.value=620;g.gain.value=.035;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.08)}catch(e){}
}

document.getElementById("focusBtn").onclick=()=>document.body.classList.toggle("focus");
document.getElementById("soundBtn").onclick=()=>{sound=!sound;document.getElementById("soundBtn").textContent=sound?"Sound On":"Sound Off"};
document.getElementById("resetBtn").onclick=()=>{page=0;xp=0;checks=0;render()};
document.getElementById("teacherNotes").onclick=()=>{
document.getElementById("teacherContent").innerHTML=`
<h3>${stages[page].name}</h3>
<ul>
<li><b>Predictability:</b> keep the five-step routine visible: LINE → START → ADD → REGROUP → CHECK.</li>
<li><b>Autism support:</b> use short, concrete language; preview transitions; reduce visual distractions with Focus Mode; allow processing time; accept pointing, writing, or verbal responses.</li>
<li><b>ADHD support:</b> alternate explanation with an action; let learners point to columns, use response cards, or take a defined group role; give one instruction at a time.</li>
<li><b>Advanced learners:</b> ask for explanations, create four-addend problems, and compare two solution methods.</li>
<li><b>Do not lower the target automatically:</b> differentiate the presentation, pacing, response method, and amount of practice while keeping the mathematical goal meaningful.</li>
</ul>`;
document.getElementById("teacherModal").classList.remove("hidden")
};
document.getElementById("closeTeacher").onclick=()=>document.getElementById("teacherModal").classList.add("hidden");
document.getElementById("closeFinish").onclick=()=>document.getElementById("finishModal").classList.add("hidden");
document.addEventListener("keydown",e=>{if(e.key==="ArrowRight")next();if(e.key==="ArrowLeft")prev();if(e.key==="Escape"){document.getElementById("teacherModal").classList.add("hidden");document.getElementById("finishModal").classList.add("hidden")}});

render();

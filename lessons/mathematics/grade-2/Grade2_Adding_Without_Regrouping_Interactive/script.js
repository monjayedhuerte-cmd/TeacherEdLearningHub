const lessons=[
["Mission Briefing","Welcome learners and preview the predictable sequence."],
["Motivation","Use the tree-planting story. Ask before explaining."],
["Discover","Let learners notice place-value alignment."],
["Math Vocabulary","Say, point, and use the words in context."],
["Learn the Strategy","Model LINE → START → ADD → CHECK."],
["Guided Practice","Pause after each column and ask learners to show their work."],
["Develop Mastery","Move from 4–5 digit to 6-digit and four-addend problems."],
["Real-Life Application","Connect the skill back to the tree-planting mission."],
["Generalize","Have learners explain the four-step routine."],
["Exit Check","Give quiet independent work and check process as well as answers."]
];
let page=0,checks=0,sound=true;
const app=document.getElementById("app");

function nav(){return `<div class="nav"><button class="secondary" onclick="prev()" ${page===0?"disabled":""}>Previous</button><button class="primary" onclick="next()">${page===lessons.length-1?"Finish":"Next"}</button></div>`}
function render(){
let c="";
if(page===0)c=`<section class="screen active"><div class="hero"><div class="eyebrow">GRADE 2 MATHEMATICS • LESSON 2</div><h1>Adding Numbers<br>Without Regrouping</h1><p>Today you are the Math Mission Team. You will add 4- to 6-digit numbers, using up to four addends, without regrouping.</p><div class="target"><b>Learning Target:</b> I can line up the place values, add from right to left, and check my answer.</div></div><div class="grid"><div class="card"><h3>Lesson Routine</h3><p><b>LINE → START → ADD → CHECK</b></p></div><div class="card"><h3>Success Looks Like</h3><p>I can add accurately and explain why my digits must be aligned.</p></div><div class="card"><h3>Learning Supports</h3><p>Visual steps, short directions, processing time, response actions, and Focus Mode.</p></div></div>${nav()}</section>`;
if(page===1)c=`<section class="screen active"><h2>Motivation: How Many Trees?</h2><p class="sub">Create a real reason to add before teaching the procedure.</p><div class="scene"><div class="tree">🌳</div><div class="data"><h3>Tree-Planting Day</h3><div class="row"><span>Group 1</span><span>12,341</span></div><div class="row"><span>Group 2</span><span>23,112</span></div><div class="row"><span>Group 3</span><span>14,221</span></div><div class="row"><span>Group 4</span><span>10,314</span></div></div></div><div class="card"><div class="prompt">Can we find the total number of trees planted?</div><p><b>Ask:</b> “What do we need to do?” Then: “How can we organize four numbers so adding is easy?”</p><div class="choices"><button class="choice" onclick="pick(this,true,'mot')">Add the numbers</button><button class="choice" onclick="pick(this,false,'mot')">Subtract the numbers</button><button class="choice" onclick="pick(this,false,'mot')">Multiply the numbers</button></div><div id="mot" class="feedback"></div><div class="challenge"><b>Teacher hook:</b> “You are the Tree-Planting Math Team. Your mission is to find the total without regrouping.”</div></div>${nav()}</section>`;
if(page===2)c=`<section class="screen active"><h2>Discover: What Do You Notice?</h2><p class="sub">Do not give the rule immediately. Let learners observe.</p><div class="math"><div class="equation">   12,341
   23,112
   14,221
+  10,314
──────────
   59,988</div><div class="grid"><div class="card"><h3>Notice</h3><p>Ones line up with ones.</p></div><div class="card"><h3>Notice</h3><p>Tens line up with tens.</p></div><div class="card"><h3>Notice</h3><p>Each column has the same place value.</p></div></div><div class="prompt">Why must the digits be lined up this way?</div><div class="choices"><button class="choice" onclick="pick(this,true,'disc')">Same place values belong in the same column.</button><button class="choice" onclick="pick(this,false,'disc')">All digits have the same value.</button></div><div id="disc" class="feedback"></div></div>${nav()}</section>`;
if(page===3)c=`<section class="screen active"><h2>Math Vocabulary</h2><p class="sub">Have learners say each word and use it in a sentence.</p><div class="grid"><div class="card"><h3>Place Value</h3><p>The value of a digit based on its position.</p></div><div class="card"><h3>Addend</h3><p>A number that is being added.</p></div><div class="card"><h3>Sum</h3><p>The answer in an addition problem.</p></div><div class="card"><h3>Regrouping</h3><p>Changing a group from one place value to another. Today we do not regroup.</p></div><div class="card"><h3>Column</h3><p>A vertical group of digits in the same place-value position.</p></div><div class="card"><h3>Align</h3><p>Place numbers in their correct place-value positions.</p></div></div><div class="math"><b>Teacher prompt:</b> “Use one vocabulary word to describe what we are doing.”<div class="chips"><span>addend</span><span>sum</span><span>place value</span><span>align</span><span>column</span></div></div>${nav()}</section>`;
if(page===4)c=`<section class="screen active"><h2>Learn the Strategy</h2><p class="sub">Use the same routine for every problem.</p><div class="steps"><div class="step"><div class="num">1</div><strong>LINE</strong><small>Align by place value.</small></div><div class="step"><div class="num">2</div><strong>START</strong><small>Begin at ones.</small></div><div class="step"><div class="num">3</div><strong>ADD</strong><small>Move right to left.</small></div><div class="step"><div class="num">4</div><strong>CHECK</strong><small>Check the answer.</small></div></div><div class="math"><h3>Worked Example</h3><div class="equation">   21,432
   12,321
+  13,214
──────────
   46,967</div><p><b>Teacher language:</b> “First LINE. Next START at the ones. Then ADD each column from right to left. Finally CHECK.”</p></div>${nav()}</section>`;
if(page===5)c=`<section class="screen active"><h2>Guided Practice</h2><p class="sub">Solve one column at a time. Ask learners to show each column.</p><div class="math"><div class="equation">   32,142
   14,321
+  21,213
──────────
      ?</div><div class="prompt">What is the sum?</div><input id="g" class="answer" inputmode="numeric" placeholder="Type the sum"> <button class="primary" onclick="check('g','67676','gf')">Check</button><div id="gf" class="feedback"></div><div class="challenge"><b>Teacher cue:</b> “Show me your ones column. Now show me your tens column.”</div></div>${nav()}</section>`;
if(page===6)c=`<section class="screen active"><h2>Develop Mastery</h2><p class="sub">The numbers increase in size. Ask learners to explain why no regrouping is needed.</p><div class="grid"><div class="card"><h3>Level 1</h3><div class="equation">12,321 + 21,112 + 13,221</div><input id="m1" class="answer" placeholder="Answer"><button class="primary" onclick="check('m1','46654','m1f')">Check</button><div id="m1f" class="feedback"></div></div><div class="card"><h3>Level 2</h3><div class="equation">124,321 + 213,112 + 132,221 + 110,314</div><input id="m2" class="answer" placeholder="Answer"><button class="primary" onclick="check('m2','579968','m2f')">Check</button><div id="m2f" class="feedback"></div></div><div class="card"><h3>Reasoning</h3><p>Why is no regrouping needed?</p><button class="choice" onclick="document.getElementById('why').innerHTML='Correct reasoning: every place-value column has a total of 9 or less, so no regrouping is necessary.'">Reveal reasoning</button><div id="why" class="feedback"></div></div></div>${nav()}</section>`;
if(page===7)c=`<section class="screen active"><h2>Real-Life Application</h2><p class="sub">Return to the tree-planting mission.</p><div class="scene"><div class="tree">🌱</div><div class="data"><h3>Tree-Planting Report</h3><div class="row"><span>Group 1</span><span>12,341</span></div><div class="row"><span>Group 2</span><span>23,112</span></div><div class="row"><span>Group 3</span><span>14,221</span></div><div class="row"><span>Group 4</span><span>10,314</span></div></div></div><div class="math"><div class="prompt">How many trees did the four groups plant altogether?</div><input id="real" class="answer" placeholder="Answer"><button class="primary" onclick="check('real','59988','rf')">Check</button><div id="rf" class="feedback"></div></div>${nav()}</section>`;
if(page===8)c=`<section class="screen active"><h2>Generalize: Teach the Teacher</h2><p class="sub">Let learners explain the strategy in their own words.</p><div class="math"><div class="prompt">What are the four steps for adding without regrouping?</div><div class="steps"><div class="step"><div class="num">1</div><strong>LINE</strong><small>Align by place value.</small></div><div class="step"><div class="num">2</div><strong>START</strong><small>Begin at ones.</small></div><div class="step"><div class="num">3</div><strong>ADD</strong><small>Move right to left.</small></div><div class="step"><div class="num">4</div><strong>CHECK</strong><small>Check the answer.</small></div></div><div class="challenge"><b>Teacher move:</b> One learner explains while another points to each step. Keep the routine visible.</div></div>${nav()}</section>`;
if(page===9)c=`<section class="screen active"><h2>Exit Check</h2><p class="sub">Work independently. Give processing time. Check both answer and process.</p><div class="math"><h3>1. Add</h3><div class="equation">   23,214
   12,321
+  14,132
──────────
      ?</div><input id="e1" class="answer" placeholder="Answer"><button class="primary" onclick="check('e1','49667','e1f')">Check</button><div id="e1f" class="feedback"></div><hr><h3>2. Add</h3><div class="equation">   124,321
   213,112
   132,221
+  110,314
──────────
      ?</div><input id="e2" class="answer" placeholder="Answer"><button class="primary" onclick="check('e2','579968','e2f')">Check</button><div id="e2f" class="feedback"></div><div class="challenge"><b>Reasoning:</b> Why is it important to align digits before adding?</div><button class="primary" onclick="finish()">Finish Mission</button></div></section>`;
app.innerHTML=c;update();
}
function update(){document.getElementById("bar").style.width=((page+1)/lessons.length*100)+"%";document.getElementById("counter").textContent=lessons[page][0]+" — "+(page+1)+"/"+lessons.length;document.getElementById("cue").textContent=lessons[page][1];window.scrollTo({top:0,behavior:"smooth"})}
function next(){if(page<lessons.length-1){page++;render()}else finish()}
function prev(){if(page>0){page--;render()}}
function clean(x){return String(x).replace(/,/g,"").replace(/\s/g,"").trim()}
function check(id,ans,fb){let v=clean(document.getElementById(id).value),f=document.getElementById(fb);if(v===clean(ans)){f.textContent="Correct. Now explain how you aligned and added the columns.";f.className="feedback ok";checks++;beep()}else{f.textContent="Not yet. Start at the ones column and check each place value.";f.className="feedback no"}}
function pick(el,ok,id){document.querySelectorAll(".choices .choice").forEach(b=>b.classList.remove("correct","wrong"));el.classList.add(ok?"correct":"wrong");let f=document.getElementById(id);f.textContent=ok?"Correct. We add the four amounts to find the total.":"Think about which operation finds a total.";f.className="feedback "+(ok?"ok":"no");if(ok){checks++;beep()}}
function finish(){document.getElementById("score").innerHTML="<b>Lesson screens completed:</b> 10<br><b>Interactive checks completed:</b> "+checks+"<br><br>Teacher: use the exit answers and observations to decide who needs remediation or enrichment.";document.getElementById("done").classList.remove("hidden");beep()}
function beep(){if(!sound)return;try{let C=window.AudioContext||window.webkitAudioContext,c=new C,o=c.createOscillator(),g=c.createGain();o.frequency.value=620;g.gain.value=.04;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.08)}catch(e){}}
document.getElementById("reset").onclick=()=>{page=0;checks=0;render()}
document.getElementById("focus").onclick=()=>document.body.classList.toggle("focus")
document.getElementById("sound").onclick=()=>{sound=!sound;document.getElementById("sound").textContent=sound?"Sound On":"Sound Off"}
document.getElementById("notes").onclick=()=>{document.getElementById("notesText").innerHTML="<ul><li>Use short, predictable directions: <b>LINE → START → ADD → CHECK</b>.</li><li>For learners with autism: keep the sequence visible, reduce visual clutter, allow processing time, and preview transitions.</li><li>For learners with ADHD: alternate explanation with an action; use response boards/cards and short work periods.</li><li>Do not lower the mathematical target automatically. Adjust presentation, pacing, environment, and response method.</li><li>Ask process questions: “Which column?” “Why?” “Show me.”</li><li>For advanced learners, ask them to explain why no regrouping is necessary or create their own four-addend problem.</li></ul>";document.getElementById("modal").classList.remove("hidden")}
document.getElementById("close").onclick=()=>document.getElementById("modal").classList.add("hidden")
document.getElementById("closeDone").onclick=()=>document.getElementById("done").classList.add("hidden")
document.addEventListener("keydown",e=>{if(e.key==="ArrowRight")next();if(e.key==="ArrowLeft")prev();if(e.key==="Escape"){document.getElementById("modal").classList.add("hidden");document.getElementById("done").classList.add("hidden")}})
render()

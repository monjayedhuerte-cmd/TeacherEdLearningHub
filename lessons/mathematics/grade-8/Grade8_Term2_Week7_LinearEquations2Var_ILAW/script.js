const app=document.getElementById("app"), tabs=[...document.querySelectorAll(".tab")], toast=document.getElementById("toast");
let day=0, score=0, answered=0;
const lessons=[
{title:"What Is a Linear Equation in Two Variables?",ilaw:"I — Introduce",time:"50 minutes",content:`
<div class="hero"><div class="eyebrow">Week 7 • Term 2 • Day 1</div><h1>Two Variables, One Relationship</h1><p>Today we discover how a linear equation in two variables describes a relationship between two quantities—and how its solutions can be written as ordered pairs.</p><div class="chips"><span class="chip">🎯 Define</span><span class="chip">🧩 Illustrate</span><span class="chip">📍 Ordered pairs</span></div></div>
<div class="card"><h2>🎯 Learning Targets</h2><p>By the end of today, you can:</p><ul><li>describe a linear equation in two variables;</li><li>identify the variables, coefficients, and constant;</li><li>test whether an ordered pair is a solution.</li></ul></div>
<div class="card"><h2>⚡ I — Introduce: The Mystery Machine</h2><p>A school club charges ₱50 registration plus ₱20 for each activity. Let <b>x</b> be the number of activities and <b>y</b> the total cost.</p><div class="formula">y = 20x + 50</div><p>What changes? What stays fixed? Click to reveal the idea.</p><button class="btn" onclick="reveal('r1')">Reveal</button><div id="r1" class="answer">x and y are variables. 20 is the coefficient of x, and 50 is the constant.</div></div>
<div class="card"><h2>📘 L — Learn</h2><p>A <b>linear equation in two variables</b> is an equation that can be written in a form such as:</p><div class="formula">Ax + By = C</div><p>where A, B, and C are constants and x and y are variables. A solution is an ordered pair <b>(x, y)</b> that makes the equation true.</p>
<div class="example"><b>Example:</b> Is (2, 3) a solution of x + y = 5?<div class="step"><span class="num">1</span><span>Substitute x = 2 and y = 3.</span></div><div class="step"><span class="num">2</span><span>2 + 3 = 5 ✓</span></div><b>Yes, (2, 3) is a solution.</b></div></div>
<div class="card"><h2>🎮 Check Your Thinking</h2>${mc("d1","Which ordered pair satisfies x + y = 7?",["(2,4)","(3,4)","(5,3)","(7,7)"],1)}</div>
<div class="card"><h2>🧠 A — Apply</h2><p>Test the pair <b>(4, 2)</b> in 2x + y = 10.</p><button class="btn" onclick="reveal('r2')">Show solution</button><div id="r2" class="answer">2(4) + 2 = 8 + 2 = 10 ✓. Therefore (4, 2) is a solution.</div></div>
<div class="card"><h2>🌟 W — Wrap Up</h2><p>Complete: “An ordered pair is a solution when ______.”</p><button class="btn" onclick="reveal('r3')">Reveal key idea</button><div id="r3" class="answer">the substitution makes the equation true.</div></div>`},
{title:"Generating and Representing Solutions",ilaw:"L — Learn + A — Apply",time:"50 minutes",content:`
<div class="hero"><div class="eyebrow">Week 7 • Term 2 • Day 2</div><h1>Build a Solution Table</h1><p>Today we turn equations into tables of ordered pairs. Think of every valid pair as a coordinate that belongs to the relationship.</p></div>
<div class="card"><h2>🔁 Warm-Up</h2><p>For y = x + 2, if x = 3, what is y?</p>${mc("d2","Choose the value of y.",["1","5","6","9"],1)}</div>
<div class="card"><h2>📘 L — Learn: Substitute Step by Step</h2><div class="example"><b>Equation: y = 2x − 1</b><div class="step"><span class="num">1</span><span>Choose x = 0.</span></div><div class="step"><span class="num">2</span><span>y = 2(0) − 1 = −1 → (0, −1)</span></div><div class="step"><span class="num">3</span><span>Choose x = 1: y = 2(1) − 1 = 1 → (1, 1)</span></div><div class="step"><span class="num">4</span><span>Choose x = 2: y = 2(2) − 1 = 3 → (2, 3)</span></div></div><p>Notice: one x-value gives one y-value. Repeating this process creates a table of solutions.</p></div>
<div class="card"><h2>🎮 Interactive Table Challenge</h2><p>For <b>y = 3x − 2</b>, enter y when x = 4.</p><div class="inputrow"><input id="in2" type="number" placeholder="y value"><button class="btn" onclick="checkInput('in2',10,'f2','Correct! y = 10.')">Check</button></div><div id="f2" class="feedback"></div></div>
<div class="card"><h2>🧩 A — Apply: Which Pair Belongs?</h2>${mc("d2b","Which pair is a solution of y = 2x + 1?",["(1,2)","(2,5)","(3,5)","(0,0)"],1)}</div>
<div class="card"><h2>🌟 W — Wrap Up</h2><p>Exit thought: Why is substitution useful?</p><button class="btn" onclick="reveal('r4')">Reveal</button><div id="r4" class="answer">It lets us test an ordered pair or generate a missing coordinate accurately.</div></div>`},
{title:"From Equation to Graph",ilaw:"A — Apply",time:"50 minutes",content:`
<div class="hero"><div class="eyebrow">Week 7 • Term 2 • Day 3</div><h1>Plot the Solutions</h1><p>Every solution (x, y) can be represented as a point on the Cartesian plane. Today we connect the equation, table, ordered pairs, and graph.</p></div>
<div class="card"><h2>📍 A Coordinate Reminder</h2><p>In (x, y), move <b>x</b> units horizontally first, then <b>y</b> units vertically.</p><div class="formula">(x, y) = (horizontal, vertical)</div></div>
<div class="card"><h2>📘 Worked Example</h2><p>Graph y = x + 1 using x = −2, −1, 0, 1, 2.</p><div class="example"><b>Solutions:</b> (−2,−1), (−1,0), (0,1), (1,2), (2,3).<br><br>Plot these points. They line up because they all satisfy the same linear relationship.</div><button class="btn" onclick="reveal('g1')">Show the connection</button><div id="g1" class="answer">A linear equation produces ordered pairs; ordered pairs become points; the points form a straight line.</div></div>
<div class="card"><h2>🎯 Quick Check</h2>${mc("d3","Which point is on y = x + 2?",["(0,1)","(1,3)","(2,5)","(−1,−2)"],1)}</div>
<div class="card"><h2>🧠 Apply: Predict Before You Calculate</h2><p>For y = −x + 4, if x increases by 1, what happens to y?</p>${mc("d3b","Choose.",["It increases by 1.","It decreases by 1.","It stays the same.","It becomes zero."],1)}</div>
<div class="card"><h2>🌟 W — Wrap Up</h2><p>Say it aloud: “A graph of a linear equation in two variables is made from ______.”</p><button class="btn" onclick="reveal('r5')">Reveal</button><div id="r5" class="answer">points representing its ordered-pair solutions.</div></div>`},
{title:"Solve, Verify, and Explain",ilaw:"A — Apply + W — Wrap Up",time:"50 minutes",content:`
<div class="hero"><div class="eyebrow">Week 7 • Term 2 • Day 4</div><h1>Be the Equation Detective</h1><p>Today you will investigate claims, verify solutions, and explain your reasoning instead of only giving an answer.</p></div>
<div class="card"><h2>🕵️ Case 1: True or False?</h2><p>A student says (3, 1) solves 2x + y = 7.</p>${mc("d4","Is the student correct?",["Yes, because 2(3)+1=7.","No, because 2(3)+1=8.","Yes, because 3+1=4.","No, because x must be 0."],0)}</div>
<div class="card"><h2>🕵️ Case 2: Find the Missing Coordinate</h2><p>Find y if (5, y) is a solution of x + 2y = 11.</p><div class="formula">5 + 2y = 11 → 2y = 6 → y = 3</div><p>So the ordered pair is <b>(5, 3)</b>.</p><button class="btn" onclick="reveal('r6')">Verify</button><div id="r6" class="answer">5 + 2(3) = 11 ✓.</div></div>
<div class="card"><h2>🎮 Your Turn</h2><p>Find y if (2, y) satisfies 3x + y = 9.</p><div class="inputrow"><input id="in4" type="number" placeholder="y"><button class="btn" onclick="checkInput('in4',3,'f4','Correct! y = 3.')">Check</button></div><div id="f4" class="feedback"></div></div>
<div class="card"><h2>💬 Explain It</h2><p>Why should we verify an answer by substitution?</p><button class="btn" onclick="reveal('r7')">Model answer</button><div id="r7" class="answer">Verification confirms that the ordered pair actually makes the original equation true.</div></div>`},
{title:"Master the Competency",ilaw:"W — Wrap Up",time:"50 minutes",content:`
<div class="hero"><div class="eyebrow">Week 7 • Term 2 • Day 5</div><h1>Mission: Master Linear Equations</h1><p>Review the whole chain: equation → substitution → ordered pair → table → graph → explanation.</p></div>
<div class="card"><h2>🧠 5-Step Mastery Routine</h2><div class="grid3"><div class="example"><b>1. Identify</b><br>Find x and y.</div><div class="example"><b>2. Substitute</b><br>Replace variables with values.</div><div class="example"><b>3. Simplify</b><br>Calculate both sides.</div><div class="example"><b>4. Decide</b><br>True = solution.</div><div class="example"><b>5. Represent</b><br>Write/plot the ordered pair.</div></div></div>
<div class="card"><h2>⚡ Final Practice</h2>${mc("d5","Which pair satisfies 2x + y = 8?",["(1,5)","(2,4)","(3,3)","(4,1)"],1)}${mc("d5b","For y = −2x + 5, what is y when x = 2?",["−1","1","3","9"],2)}</div>
<div class="card"><h2>🏆 W — Wrap Up</h2><p>Rate your confidence:</p><button class="btn" onclick="toastMsg('🌟 Great! Keep practicing!')">I can do it!</button><button class="btn secondary" onclick="toastMsg('💪 That is okay—review the examples and try again!')">I need more practice</button></div>`}
];

function mc(id,q,opts,ans){return `<div class="q"><b>${q}</b><div class="options">${opts.map((o,i)=>`<button onclick="choose(this,'${id}',${i},${ans})">${o}</button>`).join("")}</div><div id="fb-${id}" class="feedback"></div></div>`}
function render(){if(day===5){renderAssessment();return}app.innerHTML=`<section class="slide active"><div class="card"><b>${lessons[day].ilaw}</b> • ⏱ ${lessons[day].time}</div>${lessons[day].content}<div class="navrow"><button class="btn secondary" onclick="go(${Math.max(0,day-1)})">← Previous</button><button class="btn" onclick="go(${Math.min(5,day+1)})">${day===4?"Go to Assessment":"Next Day →"}</button></div></section>`}
function renderAssessment(){const qs=[
["Which is a linear equation in two variables?",["x+y=6","x²+y=6","xy=6","x/y=6"],0],
["Which ordered pair satisfies x+y=5?",["(1,3)","(2,3)","(4,2)","(5,5)"],1],
["For y=2x+1, when x=3, y is…",["4","6","7","8"],2],
["In (−2,5), the x-coordinate is…",["−2","2","5","−5"],0],
["A solution of an equation makes the equation…",["longer","true","false","undefined"],1],
["For 2x+y=9, is (4,1) a solution?",["Yes","No","Only sometimes","Cannot tell"],0],
["For x+2y=10, if x=4, y=…",["2","3","4","6"],1],
["The graph of a linear equation is made from its…",["solutions","constants only","titles","symbols"],0],
["Which pair satisfies y=x−2?",["(2,4)","(3,1)","(4,1)","(0,2)"],1],
["If y=−x+5 and x=2, y=…",["−3","2","3","7"],2],
["Which is an ordered pair?",["x+y","(3,−1)","3−1","3/1"],1],
["Substitution means…",["erasing variables","replacing variables with values","drawing axes","adding coordinates"],1],
["For 3x+y=12, (2,6) is…",["a solution","not a solution","a graph","a variable"],0],
["If x increases by 1 in y=3x+2, y increases by…",["1","2","3","4"],2],
["For y=4−2x, x=0 gives y=…",["−4","0","2","4"],3],
["Which pair satisfies 2x−y=1?",["(1,1)","(2,3)","(3,5)","(0,2)"],0],
["Why verify a solution?",["To decorate the graph","To confirm the equation is true","To change the equation","To remove x"],1],
["The first coordinate in (x,y) tells movement…",["vertical","horizontal","diagonal","circular"],1],
["For x+y=0, which pair works?",["(2,2)","(−3,3)","(1,2)","(4,1)"],1],
["A table of solutions can help us…",["plot points","avoid equations","remove variables","change constants"],0]
]; app.innerHTML=`<section class="slide active"><div class="hero"><div class="eyebrow">Week 7 • Term 2 • Mastery Assessment</div><h1>🏆 20-Item Challenge</h1><p>Read carefully. Choose the best answer. Your score updates as you work.</p></div><div class="assessment-score" id="scorebox">Score: 0 / 20</div>${qs.map((x,i)=>`<div class="q"><b>${i+1}. ${x[0]}</b><div class="options">${x[1].map((o,j)=>`<button onclick="assess(this,${i},${j},${x[2]})">${o}</button>`).join("")}</div></div>`).join("")}</section>`}
function assess(btn,q,choice,ans){if(btn.parentElement.dataset.done)return;btn.parentElement.dataset.done="1";answered++;if(choice===ans){btn.classList.add("correct");score++}else{btn.classList.add("wrong");[...btn.parentElement.children][ans].classList.add("correct")}document.getElementById("scorebox").textContent=`Score: ${score} / 20 • ${Math.round(score/20*100)}%`;toastMsg(choice===ans?"✅ Correct!":"📘 Review the highlighted answer.");}
function choose(btn,id,c,a){if(btn.parentElement.dataset.done)return;btn.parentElement.dataset.done="1";const fb=document.getElementById("fb-"+id);if(c===a){btn.classList.add("correct");fb.textContent="✅ Excellent! Your reasoning is correct.";toastMsg("⭐ Correct!")}else{btn.classList.add("wrong");[...btn.parentElement.children][a].classList.add("correct");fb.textContent="🔎 Not quite. Review the highlighted answer.";toastMsg("💡 Try the explanation again.")}}
function reveal(id){document.getElementById(id)?.classList.add("show")}
function checkInput(id,ans,fb,msg){const v=Number(document.getElementById(id).value);const el=document.getElementById(fb);el.textContent=v===ans?"✅ "+msg:"❌ Not yet. Check your substitution and try again.";el.style.color=v===ans?"#16803c":"#c22"}
function go(n){day=n;tabs.forEach((t,i)=>t.classList.toggle("active",i===n));render();window.scrollTo({top:0,behavior:"smooth"})}
function toastMsg(s){toast.textContent=s;toast.style.display="block";clearTimeout(window.tt);window.tt=setTimeout(()=>toast.style.display="none",1800)}
tabs.forEach(t=>t.onclick=()=>go(Number(t.dataset.day)));
document.getElementById("fs").onclick=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.()};
document.addEventListener("keydown",e=>{if(e.key==="ArrowRight")go(Math.min(5,day+1));if(e.key==="ArrowLeft")go(Math.max(0,day-1));if(e.key.toLowerCase()==="f")document.getElementById("fs").click()});
render();
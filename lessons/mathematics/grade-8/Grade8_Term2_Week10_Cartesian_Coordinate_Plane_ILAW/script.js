const lessonArea=document.getElementById("lessonArea");
const days=[...document.querySelectorAll(".day")];
const prevBtn=document.getElementById("prevBtn"), nextBtn=document.getElementById("nextBtn"), progressText=document.getElementById("progressText");
let currentDay=0;

const lessons=[
{
title:"Day 1 — See the Coordinate Plane",
subtitle:"Introduce and Learn • 50 minutes",
map:"5 min Hook • 10 min I • 20 min L • 10 min Guided Practice • 5 min W",
content:`<div class="kicker">I — INTRODUCE</div>
<h3>Where are you on a map?</h3>
<p>Imagine a map of a school. Instead of saying “the library is over there,” we can describe an exact location using two numbers. The Cartesian coordinate plane does the same thing for mathematics.</p>
<div class="callout"><b>Think first:</b> If a point is 3 steps right and 2 steps up from the center, how could we record its location?</div>
<div class="question" data-answer="1"><h4>Quick Check 1</h4><p>Which pair best represents a location on a coordinate plane?</p><div class="choices"><button class="choice">A. 5 only</button><button class="choice">B. (5, 2)</button><button class="choice">C. 5 + 2</button><button class="choice">D. x = y</button></div><div class="feedback"></div></div>
<div class="kicker" style="margin-top:25px">L — LEARN</div>
<h3>The four parts of the Cartesian plane</h3>
<div class="example"><div class="box"><b>x-axis</b><p>The horizontal number line. Positive x-values go right; negative x-values go left.</p></div><div class="box"><b>y-axis</b><p>The vertical number line. Positive y-values go up; negative y-values go down.</p></div><div class="box"><b>Origin</b><p>The point where the axes meet: <b>(0, 0)</b>.</p></div><div class="box"><b>Quadrants</b><p>The four regions are numbered I, II, III, IV counterclockwise from the upper-right.</p></div></div>
<div class="callout note"><b>Coordinate order matters:</b> always read <b>(x, y)</b> — move horizontally first, then vertically.</div>
<div class="question" data-answer="2"><h4>Quick Check 2</h4><p>In which quadrant is (−4, 3)?</p><div class="choices"><button class="choice">I</button><button class="choice">II</button><button class="choice">III</button><button class="choice">IV</button></div><div class="feedback"></div></div>
<div class="kicker" style="margin-top:25px">W — WRAP-UP</div>
<ul><li>Horizontal = x.</li><li>Vertical = y.</li><li>Origin = (0, 0).</li><li>Coordinates are written (x, y).</li></ul>`
},
{
title:"Day 2 — Read and Plot Ordered Pairs",
subtitle:"Learn and Apply • 50 minutes",
map:"5 min Recall • 10 min I • 15 min L • 15 min A • 5 min W",
content:`<div class="kicker">I — INTRODUCE</div><h3>The “walk” rule</h3>
<p>To plot <b>(−3, 2)</b>, start at the origin. First walk 3 units left because x = −3. Then walk 2 units up because y = 2.</p>
<div class="callout"><b>Memory trick:</b> <b>x comes first</b>. Think “across, then up/down.”</div>
<div class="kicker">L — LEARN</div><h3>Quadrant sign patterns</h3>
<div class="example"><div class="box"><b>I</b><p>(+, +) → right and up</p></div><div class="box"><b>II</b><p>(−, +) → left and up</p></div><div class="box"><b>III</b><p>(−, −) → left and down</p></div><div class="box"><b>IV</b><p>(+, −) → right and down</p></div></div>
<div class="stepbox"><b>Example:</b> Plot A(4, −2).<br>1. Start at (0,0).<br>2. Move 4 units right.<br>3. Move 2 units down.<br>4. Mark A. It lies in Quadrant IV.</div>
<div class="question" data-answer="0"><h4>Check Your Thinking</h4><p>Which point is on the y-axis?</p><div class="choices"><button class="choice">(0, 5)</button><button class="choice">(5, 0)</button><button class="choice">(3, 4)</button><button class="choice">(−2, 6)</button></div><div class="feedback"></div></div>
<div class="activity"><div class="box"><h3>Apply: Identify the quadrant</h3><p>Point P(−7, −1) is in:</p><div class="choices"><button class="choice" onclick="inlinePick(this,'III')">I</button><button class="choice" onclick="inlinePick(this,'III')">II</button><button class="choice" onclick="inlinePick(this,'III')">III</button><button class="choice" onclick="inlinePick(this,'III')">IV</button></div><div class="feedback"></div></div>
<div class="box"><h3>Apply: Name the location</h3><p>What is the coordinate of a point 6 units right and 3 units down?</p><div class="input-row"><input id="d2x" type="number" placeholder="x"><input id="d2y" type="number" placeholder="y"><button class="check" onclick="checkInputs(['d2x','d2y'],[6,-3],'d2r')">Check</button></div><div id="d2r" class="result"></div></div></div>
<div class="kicker" style="margin-top:22px">W — WRAP-UP</div><p>Say it aloud: “I read <b>x first</b>, then <b>y</b>.”</p>`
},
{
title:"Day 3 — Patterns, Distance, and the Pythagorean Connection",
subtitle:"Introduce and Apply • 50 minutes",
map:"5 min Hook • 10 min I • 15 min L • 15 min A • 5 min W",
content:`<div class="kicker">I — INTRODUCE</div><h3>What happens when a point moves?</h3>
<p>Look at the sequence: (1, 2), (2, 2), (3, 2), (4, 2). The x-coordinate increases by 1 while y stays 2. Patterns help us predict the next location.</p>
<div class="question" data-answer="2"><h4>Pattern Challenge</h4><p>What comes next: (2,5), (3,5), (4,5), ___?</p><div class="choices"><button class="choice">(4,6)</button><button class="choice">(5,4)</button><button class="choice">(5,5)</button><button class="choice">(6,5)</button></div><div class="feedback"></div></div>
<div class="kicker" style="margin-top:25px">L — LEARN</div><h3>Distance between two points</h3>
<p>If two points are not on the same horizontal or vertical line, imagine a right triangle between them. The horizontal change is <b>Δx = x₂ − x₁</b> and the vertical change is <b>Δy = y₂ − y₁</b>.</p>
<div class="callout"><b>Distance Formula:</b><br><strong>d = √[(x₂ − x₁)² + (y₂ − y₁)²]</strong></div>
<div class="stepbox"><b>Example: A(1,2) and B(4,6)</b><br>Δx = 4−1 = 3<br>Δy = 6−2 = 4<br>d = √(3²+4²) = √25 = <b>5 units</b>.</div>
<div class="question" data-answer="1"><h4>Distance Check</h4><p>What is the distance between (0,0) and (3,4)?</p><div class="choices"><button class="choice">4</button><button class="choice">5</button><button class="choice">6</button><button class="choice">7</button></div><div class="feedback"></div></div>
<div class="kicker" style="margin-top:25px">A — APPLY</div>
<div class="activity"><div class="box"><h3>Try It</h3><p>Find the distance between (2,1) and (2,7).</p><div class="input-row"><input id="d3a" type="number" placeholder="distance"><button class="check" onclick="checkInputs(['d3a'],[6],'d3ar')">Check</button></div><div id="d3ar" class="result"></div></div><div class="box"><h3>Explain</h3><p>Why can a horizontal/vertical distance sometimes be found by subtraction alone?</p><button class="reveal" onclick="this.nextElementSibling.classList.toggle('show')">Reveal an explanation</button><div class="answer">When the two points share the same x or the same y, one change is 0. The distance is simply the absolute value of the nonzero change.</div></div></div>
<div class="kicker" style="margin-top:22px">W — WRAP-UP</div><p>Distance measures <b>how far apart</b> two points are, not which direction they face.</p>`
},
{
title:"Day 4 — Midpoint: Finding the Exact Middle",
subtitle:"Learn and Apply • 50 minutes",
map:"5 min Review • 10 min I • 15 min L • 15 min A • 5 min W",
content:`<div class="kicker">I — INTRODUCE</div><h3>Where is the exact halfway point?</h3>
<p>Suppose two friends meet halfway between two locations. We need a point that is exactly in the middle in both the horizontal and vertical directions.</p>
<div class="kicker">L — LEARN</div><h3>The midpoint formula</h3>
<div class="callout"><b>Midpoint:</b><br><strong>M = ((x₁+x₂)/2, (y₁+y₂)/2)</strong></div>
<div class="stepbox"><b>Example: A(2,4) and B(8,10)</b><br>1. Add x-values: 2+8=10 → 10/2=5.<br>2. Add y-values: 4+10=14 → 14/2=7.<br>3. Midpoint = <b>(5,7)</b>.</div>
<div class="question" data-answer="0"><h4>Midpoint Check</h4><p>What is the midpoint of (1,3) and (5,7)?</p><div class="choices"><button class="choice">(3,5)</button><button class="choice">(2,4)</button><button class="choice">(4,6)</button><button class="choice">(6,10)</button></div><div class="feedback"></div></div>
<div class="activity"><div class="box"><h3>Apply</h3><p>Find the midpoint of (−4, 2) and (6, 8).</p><div class="input-row"><input id="d4x" type="number" placeholder="x"><input id="d4y" type="number" placeholder="y"><button class="check" onclick="checkInputs(['d4x','d4y'],[1,5],'d4r')">Check</button></div><div id="d4r" class="result"></div></div><div class="box"><h3>Reason</h3><p>What does “midpoint” tell us about the two pieces of the segment?</p><button class="reveal" onclick="this.nextElementSibling.classList.toggle('show')">Reveal</button><div class="answer">The midpoint divides the line segment into two congruent (equal-length) parts.</div></div></div>
<div class="kicker" style="margin-top:22px">W — WRAP-UP</div><ul><li>Average the x-values.</li><li>Average the y-values.</li><li>Keep the order (x, y).</li></ul>`
},
{
title:"Day 5 — Solve Coordinate-Plane Problems",
subtitle:"Apply and Wrap-Up • 50 minutes",
map:"5 min Warm-up • 10 min I • 15 min L • 15 min A • 5 min W",
content:`<div class="kicker">I — INTRODUCE</div><h3>Be the coordinate detective</h3>
<p>Real problems can ask: How far? Where is the middle? Which quadrant? What pattern continues? Your job is to choose the right tool and explain why.</p>
<div class="kicker">L — LEARN</div><h3>Choose your strategy</h3>
<div class="example"><div class="box"><b>Need a location?</b><p>Use ordered pairs and the (x,y) rule.</p></div><div class="box"><b>Need a quadrant?</b><p>Check the signs of x and y.</p></div><div class="box"><b>Need how far?</b><p>Use the distance formula or subtraction when aligned.</p></div><div class="box"><b>Need the exact middle?</b><p>Use the midpoint formula.</p></div></div>
<div class="stepbox"><b>Worked Problem:</b> A(−2,1) and B(4,9).<br>Δx=6, Δy=8. Distance = √(36+64)=√100=<b>10 units</b>.<br>Midpoint = ((−2+4)/2,(1+9)/2)=<b>(1,5)</b>.</div>
<div class="question" data-answer="3"><h4>Strategy Check</h4><p>Which formula should you use to find the exact center of two points?</p><div class="choices"><button class="choice">Slope formula</button><button class="choice">Distance formula</button><button class="choice">Quadrant rule</button><button class="choice">Midpoint formula</button></div><div class="feedback"></div></div>
<div class="activity"><div class="box"><h3>Challenge A</h3><p>Find the distance from (−1,−2) to (2,2).</p><div class="input-row"><input id="d5a" type="number" placeholder="distance"><button class="check" onclick="checkInputs(['d5a'],[5],'d5ar')">Check</button></div><div id="d5ar" class="result"></div></div><div class="box"><h3>Challenge B</h3><p>Find the midpoint of (−3,−1) and (7,5).</p><div class="input-row"><input id="d5x" type="number" placeholder="x"><input id="d5y" type="number" placeholder="y"><button class="check" onclick="checkInputs(['d5x','d5y'],[2,2],'d5br')">Check</button></div><div id="d5br" class="result"></div></div></div>
<div class="kicker" style="margin-top:22px">W — WRAP-UP</div><div class="callout"><b>Mastery sentence:</b> “I can describe a point, plot it, calculate how far two points are apart, and find the exact middle of a segment.”</div>`
}
];

const assessment=[
["Which point is the origin?",["(1,0)","(0,1)","(0,0)","(1,1)"],2],
["Which coordinate is written first in (x,y)?",["y","x","quadrant","origin"],1],
["What is the quadrant of (3,−5)?",["I","II","III","IV"],3],
["What is the quadrant of (−2,4)?",["I","II","III","IV"],1],
["Which point lies on the x-axis?",["(0,6)","(6,0)","(2,3)","(−1,5)"],1],
["Which point lies on the y-axis?",["(0,−7)","(−7,0)","(4,4)","(3,−2)"],0],
["What is the distance from (0,0) to (6,8)?",["8","10","12","14"],1],
["What is the distance between (2,1) and (2,6)?",["4","5","6","7"],1],
["What is the midpoint of (2,4) and (6,8)?",["(4,6)","(8,12)","(2,2)","(6,4)"],0],
["What is the midpoint of (−2,3) and (4,7)?",["(1,5)","(2,5)","(1,4)","(−1,5)"],0],
["In Quadrant III, the signs are…",["(+,+)","(−,+)","(−,−)","(+,−)"],2],
["In Quadrant IV, the signs are…",["(+,+)","(−,+)","(−,−)","(+,−)"],3],
["If x increases by 1 and y stays 4, what comes after (5,4)?",["(5,5)","(6,4)","(4,5)","(6,5)"],1],
["What is the next point in (−2,1),(−1,1),(0,1),(1,1),…?",["(1,2)","(2,1)","(2,2)","(0,2)"],1],
["Distance formula uses the square root of…",["Δx + Δy","Δx² + Δy²","Δx² − Δy²","x+y"],1],
["For points sharing the same x-coordinate, the segment is…",["horizontal","vertical","diagonal only","undefined"],1],
["For points sharing the same y-coordinate, the segment is…",["horizontal","vertical","diagonal only","none"],0],
["What is the midpoint of (−6,−2) and (2,4)?",["(−2,1)","(−4,2)","(−2,2)","(2,1)"],0],
["The Cartesian plane is formed by…",["two perpendicular number lines","one number line","three circles","four triangles"],0],
["A point 4 units left and 3 units up from the origin is…",["(4,3)","(−4,3)","(−3,4)","(4,−3)"],1]
];

function renderDay(){
  days.forEach((b,i)=>b.classList.toggle("active",i===currentDay));
  if(currentDay<5){
    const L=lessons[currentDay];
    lessonArea.innerHTML=`<div class="lesson-shell"><div class="lesson-head"><span class="label">WEEK 10 • DAY ${currentDay+1}</span><h2>${L.title}</h2><p>${L.subtitle}</p><div class="timebar">${L.map.split(" • ").map(x=>`<span>${x}</span>`).join("")}</div></div><div class="ilaw"><div class="stage"><b>I — Introduce</b><small>Connect the idea to a real situation.</small></div><div class="stage"><b>L — Learn</b><small>Understand the rule, vocabulary, and examples.</small></div><div class="stage"><b>A — Apply</b><small>Answer, calculate, explain, and check.</small></div><div class="stage"><b>W — Wrap-Up</b><small>Summarize and prepare for mastery.</small></div></div><div class="slide active">${L.content}</div></div>`;
    attachQuestions();
  }else renderAssessment();
  progressText.textContent=`${currentDay<5?"Day "+(currentDay+1):"Assessment"} of 6`;
  prevBtn.disabled=currentDay===0; nextBtn.disabled=currentDay===5;
  window.scrollTo({top:0,behavior:"smooth"});
}
function attachQuestions(){
 document.querySelectorAll(".question").forEach(q=>{
  const ans=Number(q.dataset.answer);
  q.querySelectorAll(".choice").forEach((btn,i)=>btn.addEventListener("click",()=>{
    q.querySelectorAll(".choice").forEach(x=>x.classList.remove("correct","wrong"));
    const f=q.querySelector(".feedback");
    if(i===ans){btn.classList.add("correct");f.textContent="✓ Correct! Great thinking.";f.className="feedback good"}
    else{btn.classList.add("wrong");f.textContent="Try again. Look at the signs, order, or rule.";f.className="feedback bad"}
  }));
 });
}
function inlinePick(btn,answer){
 const wrap=btn.parentElement, f=wrap.nextElementSibling;
 [...wrap.querySelectorAll(".choice")].forEach(x=>x.classList.remove("correct","wrong"));
 if(btn.textContent===answer){btn.classList.add("correct");f.textContent="✓ Correct!";f.className="feedback good"}else{btn.classList.add("wrong");f.textContent="Not yet—check the signs of x and y.";f.className="feedback bad"}
}
function checkInputs(ids,answers,outId){
 const vals=ids.map(id=>Number(document.getElementById(id).value));
 const ok=vals.length===answers.length && vals.every((v,i)=>v===answers[i]);
 const out=document.getElementById(outId);
 out.textContent=ok?"✓ Correct! You got it.":"Try again. Check your calculation and coordinate order.";
 out.style.color=ok?"var(--good)":"var(--bad)";
}
function renderAssessment(){
 lessonArea.innerHTML=`<div class="lesson-shell"><div class="lesson-head"><span class="label">WEEK 10 • MASTERY CHECK</span><h2>20-Item Assessment</h2><p>Answer every item. Read each question carefully, then submit when you are ready.</p></div><div class="assessment"><div class="assessment-top"><div><b>Topics:</b> coordinate plane • ordered pairs • quadrants • patterns • distance • midpoint</div><div class="score" id="scoreBox">Not submitted</div></div><form id="quiz">${assessment.map((q,i)=>`<div class="qcard"><p>${i+1}. ${q[0]}</p>${q[1].map((o,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${String.fromCharCode(65+j)}. ${o}</label>`).join("")}</div>`).join("")}<button class="submit-assessment" type="submit">Submit Assessment</button></form><div id="review" class="review"></div></div></div>`;
 document.getElementById("quiz").addEventListener("submit",e=>{
   e.preventDefault(); let score=0, missed=[];
   assessment.forEach((q,i)=>{const pick=document.querySelector(`input[name="q${i}"]:checked`); if(pick && Number(pick.value)===q[2])score++; else missed.push(i+1)});
   const pct=Math.round(score/assessment.length*100);
   document.getElementById("scoreBox").textContent=`${score}/20 • ${pct}%`;
   let msg=pct>=90?"Excellent mastery!":pct>=75?"Good work! Review the missed items.":"Keep practicing—you can improve with another try.";
   document.getElementById("review").innerHTML=`<div class="callout"><b>${msg}</b><br>Missed items: ${missed.length?missed.join(", "):"None — perfect score!"}</div>`;
   window.scrollTo({top:0,behavior:"smooth"});
 });
}
days.forEach((b,i)=>b.addEventListener("click",()=>{currentDay=i;renderDay()}));
prevBtn.addEventListener("click",()=>{if(currentDay>0){currentDay--;renderDay()}});
nextBtn.addEventListener("click",()=>{if(currentDay<5){currentDay++;renderDay()}});

const fsBtn=document.getElementById("fullscreenBtn");
async function enterFullscreen(){
 try{
   if(document.fullscreenElement){await document.exitFullscreen();return}
   if(document.documentElement.requestFullscreen){
     await document.documentElement.requestFullscreen({navigationUI:"hide"});
     document.body.classList.add("presentation-mode");
   }else document.body.classList.toggle("presentation-mode");
 }catch(e){document.body.classList.toggle("presentation-mode")}
}
fsBtn.addEventListener("click",enterFullscreen);
document.addEventListener("fullscreenchange",()=>document.body.classList.toggle("presentation-mode",!!document.fullscreenElement));
document.addEventListener("keydown",e=>{
 if(e.key==="ArrowRight" && !e.target.matches("input")) nextBtn.click();
 if(e.key==="ArrowLeft" && !e.target.matches("input")) prevBtn.click();
 if(e.key.toLowerCase()==="f") enterFullscreen();
});
renderDay();

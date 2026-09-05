const lessons = {
1:{
 title:"Day 1 — Meet the Number Line",
 phase:"I — INTRODUCE + L — LEARN",
 target:"Explain what a number line shows and identify the position of positive and negative integers.",
 intro:`Imagine an elevator in a building. Floor 0 can be our reference floor. Floors above it can be represented by positive numbers, while floors below it can be represented by negative numbers. A number line works in a similar way: 0 is the reference point, positive integers are to the right, and negative integers are to the left.`,
 steps:[
 "Find 0 first. Zero is the center/reference point.",
 "Count equal spaces to the right for positive integers.",
 "Count equal spaces to the left for negative integers.",
 "Remember that the number line continues forever in both directions."
 ],
 examples:[
 ["Example 1","Locate +4.","Start at 0 and move 4 units to the right. You land on +4."],
 ["Example 2","Locate −5.","Start at 0 and move 5 units to the left. You land on −5."],
 ["Example 3","Which is farther right: −2 or +3?","+3 is farther right, so +3 is greater."],
 ["Example 4","What is the integer at the origin?","The origin is 0. It is neither positive nor negative."]
 ],
 tasks:[
 ["Which integer is 3 units to the left of 0?",["−3","+3","0"],0],
 ["Which direction represents greater numbers?",["Left","Right","Neither"],1],
 ["Where is −7 located?",["7 units right of 0","7 units left of 0","At 0"],1],
 ["Which is the origin?",["−1","0","+1"],1]
 ]
},
2:{
 title:"Day 2 — Locate Integers Accurately",
 phase:"L — LEARN + A — APPLY",
 target:"Locate given integers on a number line and determine the integer represented by a position.",
 intro:`To locate an integer, use its distance and direction from zero. The sign tells the direction: + means right of zero and − means left of zero. The number tells how many units to move.`,
 steps:[
 "Read the sign of the integer.",
 "Find 0 on the number line.",
 "Use the absolute value as the number of spaces to move.",
 "Move right for positive and left for negative.",
 "Check the label to make sure you stopped at the correct point."
 ],
 examples:[
 ["Locate +6","0 → 1 → 2 → 3 → 4 → 5 → 6","Move six spaces right."],
 ["Locate −4","0 → −1 → −2 → −3 → −4","Move four spaces left."],
 ["A point is 8 spaces left of 0","The integer is −8.","Left of zero means negative."],
 ["A point is 2 spaces right of 0","The integer is +2.","Right of zero means positive."]
 ],
 tasks:[
 ["Locate +8. It is:",["8 spaces left","8 spaces right","at zero"],1],
 ["Locate −6. It is:",["6 spaces left","6 spaces right","6 spaces from 10"],0],
 ["Which integer is 5 spaces right of 0?",["−5","+5","0"],1],
 ["Which integer is 9 spaces left of 0?",["+9","−9","−8"],1]
 ]
},
3:{
 title:"Day 3 — Compare Integers",
 phase:"L — LEARN + A — APPLY",
 target:"Compare two integers using the number line and the symbols <, >, and =.",
 intro:`Comparing integers means deciding which number is greater, which is less, or whether they are equal. The number line gives a powerful visual rule: the integer farther to the RIGHT is GREATER. The integer farther to the LEFT is LESS.`,
 steps:[
 "Place or imagine both integers on the same number line.",
 "Look at which integer is farther to the right.",
 "Write > if the left number is greater.",
 "Write < if the left number is smaller.",
 "Write = if the two numbers are exactly the same."
 ],
 examples:[
 ["Positive vs. negative","+4 > −3","Every positive integer is greater than every negative integer."],
 ["Two negatives","−2 > −7","−2 is farther right than −7."],
 ["Negative and zero","−5 < 0","−5 is left of zero."],
 ["Same integer","−6 = −6","Both numbers occupy the same position."]
 ],
 tasks:[
 ["Complete: +5 ___ −2",["<",">","="],1],
 ["Complete: −8 ___ −3",["<",">","="],0],
 ["Complete: −4 ___ 0",["<",">","="],0],
 ["Complete: +7 ___ +7",["<",">","="],2]
 ]
},
4:{
 title:"Day 4 — Order Integers",
 phase:"A — APPLY",
 target:"Arrange a group of integers from least to greatest and from greatest to least.",
 intro:`Ordering means putting numbers in a specific sequence. On a horizontal number line, numbers increase as you move from left to right. Therefore, to arrange integers from LEAST to GREATEST, start with the number farthest LEFT. To arrange from GREATEST to LEAST, start with the number farthest RIGHT.`,
 steps:[
 "Draw or imagine a number line.",
 "Mark the given integers.",
 "For least to greatest, read from left to right.",
 "For greatest to least, read from right to left.",
 "Double-check the negative numbers: a larger negative number is actually closer to zero."
 ],
 examples:[
 ["Least → greatest","−8, −3, 0, +2, +6","This is the left-to-right order."],
 ["Greatest → least","+6, +2, 0, −3, −8","Reverse the previous order."],
 ["Compare −10 and −4","−10 < −4","−10 is farther left."],
 ["A common mistake","−2 is NOT less than −8","Actually −2 > −8 because −2 is farther right."]
 ],
 tasks:[
 ["Least to greatest: −4, +1, −7",["−7, −4, +1","+1, −4, −7","−4, −7, +1"],0],
 ["Greatest to least: −2, +5, 0",["+5, 0, −2","−2, 0, +5","0, +5, −2"],0],
 ["Least to greatest: −1, −9, +3",["−9, −1, +3","−1, −9, +3","+3, −1, −9"],0],
 ["Greatest to least: −6, −1, −10",["−10, −6, −1","−1, −6, −10","−6, −1, −10"],1]
 ]
},
5:{
 title:"Day 5 — Integer Navigator: Real Life + Wrap-Up",
 phase:"A — APPLY + W — WRAP-UP",
 target:"Apply locating, comparing, and ordering integers to real-life situations and explain the answer.",
 intro:`Integers are useful because many real situations have opposite directions or changes. Temperatures can be above or below zero. Elevations can be above or below sea level. A score can increase or decrease. A floor can be above or below a reference floor. Once you choose the reference point, the number line helps you compare and order the situations.`,
 steps:[
 "Identify the reference point.",
 "Decide which direction/change is positive and which is negative.",
 "Write the integer for each situation.",
 "Compare positions on the number line.",
 "Explain your answer using words, not only symbols."
 ],
 examples:[
 ["Temperature","−3°C and +4°C","+4°C is warmer because +4 is farther right than −3."],
 ["Elevation","−80 m and +120 m","+120 m is higher. The difference in position is 200 m."],
 ["Game scores","−6 points and +9 points","+9 represents the greater score/change."],
 ["Floors","Floor −2 and Floor +3","+3 is higher because it is farther right on the number line."]
 ],
 tasks:[
 ["A diver is 12 m below sea level. Which integer?",["+12","−12","0"],1],
 ["Which temperature is colder?",["+2°C","−5°C","+1°C"],1],
 ["Order from least to greatest: +4, −6, 0",["−6, 0, +4","+4, 0, −6","0, −6, +4"],0],
 ["A student gains 8 points then loses 3. Which change is greater?",["+8","−3","They are equal"],0],
 ["Which is higher: −20 m or −5 m?",["−20 m","−5 m","They are equal"],1]
 ]
}
};

const lessonArea=document.getElementById("lessonArea");
const tabs=[...document.querySelectorAll(".day-tab")];
let completed=new Set(JSON.parse(localStorage.getItem("integerOrderDays")||"[]"));

function renderDay(day){
 const l=lessons[day];
 lessonArea.innerHTML=`
 <article class="lesson-card">
  <div class="lesson-head">
   <div><span class="phase">${l.phase}</span><h3>${l.title}</h3></div>
   <b>Day ${day} of 5</b>
  </div>
  <div class="progress"><i style="width:${completed.has(day)?"100%":"0%"}"></i></div>
  <div class="target"><b>🎯 Learning Target:</b> ${l.target}</div>
  <div class="explain"><b>Teacher Ed explains:</b><br>${l.intro}</div>
  <h3>🪜 Step-by-Step Guide</h3>
  <div class="step-list">${l.steps.map(s=>`<div>${s}</div>`).join("")}</div>
  <h3 style="margin-top:28px">📚 Worked Examples</h3>
  <div class="example-grid">${l.examples.map(e=>`<div class="example"><h4>${e[0]}</h4><div class="math">${e[1]}</div><p class="why">${e[2]}</p></div>`).join("")}</div>
  <div class="numberline-box">
    <b>👀 Visual Reminder</b>
    <div class="interactive-line">${[-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6].map(n=>`<div class="point ${n===0?"zero-dot":""}"><span>${n>0?"+"+n:n}</span></div>`).join("")}</div>
    <p><b>Read it from left to right:</b> numbers get greater. Read it from right to left: numbers get smaller.</p>
  </div>
  <div class="tip"><b>⭐ Student Tip:</b> When comparing negative numbers, do not rely only on the size of the digits. Use their positions on the number line. For example, <b>−2 &gt; −8</b> because −2 is farther right.</div>
  <div class="practice"><h3>🎮 Interactive Practice</h3>
   ${l.tasks.map((t,i)=>`<div class="task"><p class="question">${i+1}. ${t[0]}</p><div class="choices">${t[1].map((c,j)=>`<button class="choice" data-q="${day}-${i}" data-correct="${j===t[2]}">${c}</button>`).join("")}</div><div class="feedback" id="fb-${day}-${i}"></div></div>`).join("")}
   <button class="check complete" id="completeDay">✓ Mark Day ${day} Complete</button>
  </div>
 </article>`;
 lessonArea.querySelectorAll(".choice").forEach(btn=>{
   btn.addEventListener("click",()=>{
    const key=btn.dataset.q, fb=document.getElementById("fb-"+key);
    lessonArea.querySelectorAll(`[data-q="${key}"]`).forEach(b=>b.classList.remove("correct","wrong"));
    if(btn.dataset.correct==="true"){btn.classList.add("correct");fb.textContent="✅ Correct! Your reasoning is on track."}
    else{btn.classList.add("wrong");fb.textContent="❌ Not quite. Use the number line and check which number is farther right or left."}
   });
 });
 document.getElementById("completeDay").addEventListener("click",()=>{
   completed.add(day); localStorage.setItem("integerOrderDays",JSON.stringify([...completed])); renderDay(day);
   window.scrollTo({top:document.getElementById("lesson").offsetTop-75,behavior:"smooth"});
 });
 tabs.forEach(t=>t.classList.toggle("active",+t.dataset.day===day));
}
tabs.forEach(t=>t.addEventListener("click",()=>renderDay(+t.dataset.day)));
renderDay(1);

const quizData=[
["Which integer is 6 units left of 0?",["+6","−6","0"],1],
["Which integer is farther right?",["−9","−3","+1"],2],
["Complete: −4 ___ +2",["<",">","="],0],
["Complete: −7 ___ −10",["<",">","="],1],
["Which is least?",["−2","−11","+4"],1],
["Order least to greatest: +3, −5, 0",["−5, 0, +3","+3, 0, −5","0, −5, +3"],0],
["Order greatest to least: −1, +6, −4",["+6, −1, −4","−4, −1, +6","−1, +6, −4"],0],
["Which is colder?",["+3°C","−2°C","0°C"],1],
["A building is 15 m below sea level. Which integer?",["+15","−15","0"],1],
["Which statement is true?",["−8 > −2","−8 < −2","−8 = −2"],1],
["What is the greatest integer in {−6, −1, 0, +5}?",["−6","0","+5"],2],
["What is the least integer in {−3, −9, +2, 0}?",["−3","−9","+2"],1]
];

function renderQuiz(){
 const q=document.getElementById("quiz");
 q.innerHTML=`<div class="quiz-card"><form id="quizForm">${quizData.map((x,i)=>`
 <div class="quiz-item"><b>${i+1}. ${x[0]}</b>${x[1].map((c,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${c}</label>`).join("")}</div>`).join("")}
 <button class="check" type="submit">Check My Score</button><div class="quiz-result" id="quizResult"></div></form></div>`;
 document.getElementById("quizForm").addEventListener("submit",e=>{
  e.preventDefault(); let score=0;
  quizData.forEach((x,i)=>{const a=document.querySelector(`input[name="q${i}"]:checked`);if(a&&+a.value===x[2])score++;});
  let msg=score>=10?"🏆 Outstanding! You are an Integer Navigator!":score>=8?"🌟 Great work! You have strong integer skills.":score>=6?"👍 Good effort! Review the number-line rules and try again.":"💪 Keep practicing. Go back through Days 1–5 and try again.";
  document.getElementById("quizResult").textContent=`Score: ${score}/12 — ${msg}`;
 });
}
renderQuiz();

const fs=document.getElementById("fullscreenBtn");
fs.addEventListener("click",async()=>{
 try{
  if(!document.fullscreenElement){await document.documentElement.requestFullscreen();document.body.classList.add("fullscreen-mode");fs.innerHTML="⛶ <span>Exit Full Screen</span>";}
  else await document.exitFullscreen();
 }catch(err){alert("Full Screen could not be activated. Please check your browser permissions.");}
});
document.addEventListener("fullscreenchange",()=>{
 if(!document.fullscreenElement){document.body.classList.remove("fullscreen-mode");fs.innerHTML="⛶ <span>Full Screen</span>";}
});
document.getElementById("menuBtn").addEventListener("click",()=>document.querySelector(".nav").classList.toggle("open"));

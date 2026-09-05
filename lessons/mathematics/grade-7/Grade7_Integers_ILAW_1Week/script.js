const lessons={
1:{title:"Day 1 — Meet the Integers",phase:"I — INTRODUCE + L — LEARN",goal:"Describe the set of integers and recognize positive, negative, and zero.",explain:`Integers are whole numbers and their opposites, including zero. They have no fractional or decimal parts. The set of integers continues forever in both directions. Positive integers are greater than zero; negative integers are less than zero; and zero is neither positive nor negative.`,examples:[["Positive integers","+1, +2, +3, +4, …","They are to the right of 0 on a number line."],["Negative integers","−1, −2, −3, −4, …","They are to the left of 0."],["Zero","0","Zero is the point that separates positive and negative integers."],["Not integers","2.5, 1/2, −3.7","These are not integers because they contain fractional/decimal values."]],tasks:[["Which is an integer?","−8",["−8","2.5","1/3"],0],["Which number is neither positive nor negative?","0",["−1","0","+1"],1],["Which is NOT an integer?","4.2",["−4","0","4.2"],2]]},
2:{title:"Day 2 — Integers on the Number Line",phase:"L — LEARN",goal:"Locate and compare integers using a number line.",explain:`A number line gives integers a position. Zero is the reference point. Moving right means the numbers become greater; moving left means the numbers become smaller. For example, +3 is greater than −2 because +3 is farther to the right.`,examples:[["Locate −4","Start at 0 → move 4 units left.","You land on −4."],["Locate +5","Start at 0 → move 5 units right.","You land on +5."],["Compare −2 and +1","−2 is left of +1.","Therefore −2 < +1."],["Compare −5 and −2","−5 is farther left.","Therefore −5 < −2."]],tasks:[["Which is greater?","+4",["−4","+4","−6"],1],["Complete: −3 ___ −7","−3 > −7",["−3 < −7","−3 > −7","−3 = −7"],1],["Which is farthest left?","−9",["−2","+3","−9"],2]]},
3:{title:"Day 3 — Opposites and Absolute Distance",phase:"L — LEARN + A — APPLY",goal:"Identify opposites and understand how integers describe opposite positions.",explain:`Opposite integers are the same distance from zero but on opposite sides. The opposite of +6 is −6, and the opposite of −9 is +9. The opposite of 0 is 0. Absolute value tells how far a number is from zero, without considering direction. Thus |−7| = 7 and |+7| = 7.`,examples:[["Opposite of +8","−8","Both are 8 units from zero."],["Opposite of −12","+12","The sign changes while the distance stays 12."],["Opposite of 0","0","Zero has no direction."],["Absolute value","|−5| = 5","Distance cannot be negative."]],tasks:[["Opposite of −7?","+7",["−7","+7","0"],1],["|−11| = ?","11",["−11","11","0"],1],["Opposite of +15?","−15",["+15","−15","15"],1]]},
4:{title:"Day 4 — Integers in Real Life",phase:"A — APPLY",goal:"Use positive and negative numbers to describe directions or opposites in real-life situations.",explain:`Integers help us describe changes from a reference point. A gain, increase, rise, deposit, upward movement, or eastward movement can be represented as positive. A loss, decrease, withdrawal, drop, downward movement, or westward movement can be represented as negative. The correct sign depends on the chosen reference and direction.`,examples:[["Temperature","−3°C","Three degrees below 0°C."],["Elevation","+120 m","120 meters above sea level."],["Money","−₱50","A loss or ₱50 decrease."],["Elevator","−2 floors","Two floors below the ground/reference floor."]],tasks:[["A hiker descends 40 m. Which integer?","−40",["+40","−40","0"],1],["A bank account receives ₱500. Which change?","+500",["−500","+500","0"],1],["A submarine is 30 m below sea level.","−30",["+30","−30","30"],1]]},
5:{title:"Day 5 — Integer Mastery Mission",phase:"W — WRAP-UP",goal:"Demonstrate mastery by describing, representing, and interpreting integers.",explain:`Today you connect everything: identify integers, locate them on a number line, find opposites, compare positions, and translate real-life situations into positive or negative numbers. Always ask: What is the reference point? What direction or change happened? What sign represents it?`,examples:[["Temperature","Morning: −2°C; afternoon: +5°C","The afternoon temperature is higher because +5 is to the right of −2."],["Elevation","Valley: −80 m; hill: +150 m","The hill is 230 m higher than the valley."],["Game score","+10 then −6","The net change is +4."],["Direction","5 km east = +5 km; 5 km west = −5 km","Choose one direction as positive and its opposite as negative."]],tasks:[["Which is greatest?","+9",["−10","−2","+9"],2],["Opposite of −20?","+20",["−20","+20","0"],1],["A temperature falls 7°C. Change?","−7",["+7","−7","0"],1]]}
};

const area=document.getElementById("lessonArea");
const tabs=[...document.querySelectorAll(".day-tab")];
let completed=new Set(JSON.parse(localStorage.getItem("integerDays")||"[]"));

function renderDay(n){
 const l=lessons[n];
 area.innerHTML=`<article class="lesson-card">
 <div class="lesson-title"><div><span class="phase">${l.phase}</span><h3>${l.title}</h3></div><span>Day ${n} of 5</span></div>
 <div class="progress"><i style="width:${completed.has(n)?'100%':'0%'}"></i></div>
 <p><b>Learning Target:</b> ${l.goal}</p>
 <div class="explain"><b>Teacher Ed explains:</b><br>${l.explain}</div>
 <h3>📚 Worked Examples</h3><div class="example-grid">${l.examples.map(e=>`<div class="example"><h4>${e[0]}</h4><div class="formula">${e[1]}</div><p>${e[2]}</p></div>`).join("")}</div>
 <div class="tip"><b>⭐ Remember:</b> Always identify the reference point first. Then decide whether the situation moves above/below, increases/decreases, or goes in the chosen positive/negative direction.</div>
 <div class="exercise"><h3>🎯 Interactive Practice</h3>${l.tasks.map((t,i)=>`<div class="task"><p class="question">${i+1}. ${t[0]}</p><div class="choices">${t[2].map((c,j)=>`<button class="choice" data-answer="${j===t[3]}" data-q="${n}-${i}">${c}</button>`).join("")}</div><div class="feedback" id="fb-${n}-${i}"></div></div>`).join("")}
 <button class="check" id="completeDay">✓ Mark Day ${n} Complete</button></div></article>`;
 area.querySelectorAll(".choice").forEach(btn=>btn.onclick=()=>{const fb=document.getElementById("fb-"+btn.dataset.q); area.querySelectorAll(`[data-q="${btn.dataset.q}"]`).forEach(x=>x.classList.remove("correct","wrong")); if(btn.dataset.answer==="true"){btn.classList.add("correct");fb.textContent="✅ Correct! Great reasoning."}else{btn.classList.add("wrong");fb.textContent="❌ Try again. Think about the reference point and the number line."}});
 document.getElementById("completeDay").onclick=()=>{completed.add(n);localStorage.setItem("integerDays",JSON.stringify([...completed]));renderDay(n);};
 tabs.forEach(t=>t.classList.toggle("active",t.dataset.day==n));
}
tabs.forEach(t=>t.onclick=()=>renderDay(+t.dataset.day)); renderDay(1);

const quizData=[
["Which set contains only integers?",["{−3, −1, 0, 4}","{1/2, 0, 2}","{−2.5, 3, 4}"],0],
["Which integer represents 6 meters below sea level?",["+6","−6","0"],1],
["Which is greater?",["−8","−3","−10"],1],
["What is the opposite of +14?",["−14","+14","0"],0],
["What is |−9|?",["−9","0","9"],2],
["A temperature rises 5°C. Represent the change.",["−5","+5","0"],1],
["Which number is farthest left?",["−1","−12","+3"],1],
["The opposite of 0 is:",["−1","0","+1"],1],
["A bank account loses ₱200. Represent the change.",["+200","−200","0"],1],
["Which statement is true?",["−4 > +2","−7 < −2","+5 < −1"],1]
];
function renderQuiz(){
 const q=document.getElementById("quiz");
 q.innerHTML=`<div class="quiz-card"><form id="quizForm">${quizData.map((x,i)=>`<div class="quiz-item"><b>${i+1}. ${x[0]}</b>${x[1].map((c,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${c}</label>`).join("")}</div>`).join("")}<button class="check" type="submit">Check My Score</button><div class="quiz-result" id="quizResult"></div></form></div>`;
 document.getElementById("quizForm").onsubmit=e=>{e.preventDefault();let score=0;quizData.forEach((x,i)=>{const a=document.querySelector(`input[name=q${i}]:checked`);if(a&&+a.value===x[2])score++});document.getElementById("quizResult").textContent=`You scored ${score}/10. ${score>=8?"🏆 Excellent! You are an Integer Expert!":"💪 Keep practicing. Review the five days and try again."}`};
}
renderQuiz();

const fs=document.getElementById("fullscreenBtn");
fs.onclick=async()=>{try{if(!document.fullscreenElement){await document.documentElement.requestFullscreen();document.body.classList.add("fullscreen-mode");fs.innerHTML="⛶ <span>Exit Full Screen</span>"}else{await document.exitFullscreen()}}catch(e){alert("Full screen is not available in this browser.");}};
document.addEventListener("fullscreenchange",()=>{if(!document.fullscreenElement){document.body.classList.remove("fullscreen-mode");fs.innerHTML="⛶ <span>Full Screen</span>"}});

const menu=document.getElementById("menuBtn");menu.onclick=()=>document.querySelector(".nav").classList.toggle("open");

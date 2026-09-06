const app=document.getElementById("app");
const navLinks=document.getElementById("navLinks");
const menuBtn=document.getElementById("menuBtn");
const prevBtn=document.getElementById("prevBtn");
const nextBtn=document.getElementById("nextBtn");
const locationLabel=document.getElementById("locationLabel");
const fsBtn=document.getElementById("fsBtn");

const days=[
{
id:"d1", label:"Day 1", title:"Probability: Measuring Chance", date:"Monday • Date: __________",
target:"Explain probability as a measure of the chance of an event occurring and connect probability language to possible outcomes.",
intro:"Today we begin with a simple question: How likely is something to happen? Probability gives us a mathematical way to describe chance. We will connect words such as impossible, unlikely, equally likely, likely, and certain to events we meet in everyday life.",
motivation:["If you toss a fair coin, is heads guaranteed?","Can an ordinary six-sided die show 9?","Which is more likely: drawing a red card from a bag with 8 red and 2 blue cards, or drawing a blue card?"],
learn:[
["Key idea","Probability is a measure of the chance that an event will occur. An event is a result or collection of results we are interested in."],
["Chance language","Impossible means the event cannot happen. Unlikely means it has a small chance. Equally likely means outcomes/events have the same chance. Likely means there is a large chance. Certain means the event must happen."],
["Scale of probability","Probability is between 0 and 1. A probability of 0 represents impossible; 1 represents certain. Values closer to 0 mean less chance, while values closer to 1 mean greater chance."],
["Important distinction","A probability describes chance; it does not guarantee what will happen in one trial. A fair coin has probability 1/2 of heads, but one toss can still be tails."]
],
example:{title:"Example: A classroom spinner",body:"A spinner has 4 equal sections: red, blue, green, and yellow. The event “landing on red” is possible. Because all 4 sections are equal in size, red has the same chance as each other color.",math:"P(red) = 1 out of 4 = 1/4 = 0.25 = 25%"},
explore:"Sort the situations by chance. Think first, then check.",
activity:{type:"chanceSort",items:[
["Rolling a 7 on a standard six-sided die","Impossible"],
["The sun rising tomorrow","Certain"],
["Getting heads on one toss of a fair coin","Equally likely"],
["Picking a blue marble from a bag with 1 blue and 9 red marbles","Unlikely"],
["Picking a red marble from a bag with 9 red and 1 blue marble","Likely"]
]},
master:"A student says, “If an event has probability 1/2, it will happen every other time for sure.” Is that statement correct? Explain why or why not.",
check:[
["Which probability represents an impossible event?","0","1/2","1","2",0],
["Which probability represents a certain event?","0","1/4","1/2","1",3],
["Probability measures the…","size of an object","chance an event occurs","number of equations","length of a line",1],
["A fair coin gives heads and tails with…","equal chances","no chance","certain heads","certain tails",0],
["Which is closest to an unlikely event?","0.02","0.50","0.80","1.00",0]
]
},
{
id:"d2", label:"Day 2", title:"Theoretical Probability by Listing Outcomes", date:"Tuesday • Date: __________",
target:"Calculate the theoretical probability of a single event by listing all possible outcomes.",
intro:"Yesterday we described chance. Today we make that description precise. For equally likely outcomes, theoretical probability compares the number of favorable outcomes with the total number of possible outcomes.",
motivation:["What are all possible results when a standard die is rolled?","How many of those results are even?","If 3 of the 6 outcomes are favorable, what fraction represents the chance?"],
learn:[
["Step 1 — Describe the sample space","List every possible outcome for the experiment. The complete list is called the sample space."],
["Step 2 — Identify favorable outcomes","The favorable outcomes are the outcomes that make the event happen."],
["Step 3 — Use the formula","For equally likely outcomes: P(E) = number of favorable outcomes ÷ total number of possible outcomes."],
["Step 4 — Simplify and interpret","Write the probability in simplest fraction form when appropriate. You may also express it as a decimal or percent to explain the chance."]
],
example:{title:"Example: Rolling an even number",body:"A fair six-sided die has sample space S = {1,2,3,4,5,6}. The event E = rolling an even number has favorable outcomes {2,4,6}. There are 3 favorable outcomes out of 6 possible outcomes.",math:"P(E) = 3/6 = 1/2 = 0.5 = 50%"},
explore:"Complete the outcome investigation. Then use the buttons to reveal the reasoning.",
activity:{type:"probBuild",questions:[
["A fair die is rolled. Event: rolling a number greater than 4.","{1,2,3,4,5,6}","{5,6}","2/6 = 1/3",["{5,6}","2/6 = 1/3"]],
["A fair die is rolled. Event: rolling a prime number.","{2,3,5}","{2,3,5}","3/6 = 1/2",["{2,3,5}","3/6 = 1/2"]],
["A fair coin is tossed. Event: tails.","{H,T}","{T}","1/2",["{T}","1/2"]]
]},
master:"Why must we list or account for all possible outcomes before using the theoretical probability formula? What could go wrong if some possible outcomes were left out?",
check:[
["For a fair die, the total number of possible outcomes is…","4","5","6","12",2],
["If 2 of 6 equally likely outcomes are favorable, P(E) is…","1/6","1/3","1/2","2/3",1],
["The favorable outcomes are…","all outcomes","outcomes that make the event happen","only impossible outcomes","outcomes that were not listed",1],
["Sample space means…","the complete set of possible outcomes","only favorable outcomes","the probability formula","the final answer",0],
["A fair coin has how many possible outcomes?","1","2","3","4",1]
]
},
{
id:"d3", label:"Day 3", title:"From Fraction to Decimal and Percent", date:"Wednesday • Date: __________",
target:"Compute and interpret theoretical probability of a single event and communicate the result as a fraction, decimal, and percent.",
intro:"A probability is more useful when we can explain what it means. Today we will move between fractions, decimals, and percentages, then use those forms to compare chances.",
motivation:["Which sounds clearer: 1/4, 0.25, or 25%?","If a game says you have a 75% chance of winning, what does that mean?","Is 0.8 greater or less than 0.35?"],
learn:[
["Fraction form","P(E) = favorable outcomes / total outcomes. Keep the fraction exact and simplify when possible."],
["Decimal form","Divide the numerator by the denominator. Example: 1/4 = 0.25."],
["Percent form","Multiply the decimal by 100%. Example: 0.25 = 25%."],
["Interpretation","P(E)=25% means that, in a large number of repeated trials under the same equally likely conditions, the event is expected to occur about 25% of the time. It does not promise the next result."]
],
example:{title:"Example: Choosing a card",body:"A box contains 10 cards: 4 are marked A and 6 are marked B. One card is chosen at random. The event is choosing A.",math:"P(A) = 4/10 = 2/5 = 0.40 = 40%"},
explore:"Try the conversion challenge. Start with the fraction, then verify the equivalent forms.",
activity:{type:"convert",questions:[
["2/5","0.4","40%"],
["3/4","0.75","75%"],
["1/10","0.1","10%"],
["4/5","0.8","80%"]
]},
master:"Two students disagree. Ana says 2/5 and Ben says 40%. Who is correct? Explain why both can represent the same probability.",
check:[
["1/4 as a decimal is…","0.14","0.20","0.25","0.40",2],
["0.6 as a percent is…","6%","16%","60%","600%",2],
["75% as a fraction in simplest form is…","1/4","3/4","4/5","7/5",1],
["Which probability is greatest?","0.2","1/5","40%","0.75",3],
["A probability of 0.10 means…","10% chance","1% chance","90% chance","100% chance",0]
]
},
{
id:"d4", label:"Day 4", title:"Solve Real-Life Single-Event Probability Problems", date:"Thursday • Date: __________",
target:"Solve and explain real-life problems involving the theoretical probability of a single event by listing possible outcomes.",
intro:"Probability appears in games, quality checks, weather descriptions, selection processes, and many everyday decisions. Today you will turn a situation into a sample space, identify favorable outcomes, calculate probability, and explain what the answer means.",
motivation:["A prize wheel has 8 equal sections and 3 are prizes. Would you call winning likely or unlikely?","If a bag has 12 counters and 5 are blue, what information do you need before calculating the chance of blue?","Why should we read the situation carefully before choosing a formula?"],
learn:[
["Problem-solving routine","1) Identify the experiment. 2) List possible outcomes or count them carefully. 3) Identify favorable outcomes. 4) Calculate P(E). 5) Simplify. 6) Interpret the answer in words."],
["Check the conditions","The theoretical formula used here assumes the possible outcomes are equally likely. A fair die and equally sized spinner sections are common examples."],
["Interpret, don't just calculate","If P(E)=3/8, say: “The probability of the event is 3/8, or 37.5%, so the event is less likely than not.”"],
["Reasonableness check","A probability cannot be negative or greater than 1. If your answer is 8/3 for a probability, something went wrong."]
],
example:{title:"Example: Prize wheel",body:"A fair wheel has 8 equal sections. Three sections give a prize. Let E = winning a prize. There are 8 possible sections and 3 favorable sections.",math:"P(E)=3/8=0.375=37.5%. Interpretation: the chance of winning is 37.5%, so winning is less likely than not winning."},
explore:"Work through each scenario. Choose the best probability and then explain the meaning.",
activity:{type:"scenario",questions:[
["A bag contains 5 red and 5 blue marbles. One is chosen at random. P(red) = ?","1/2","1/5","5/10","Both A and C",3],
["A fair die is rolled. P(rolling 1 or 2) = ?","1/6","1/3","1/2","2/3",1],
["A spinner has 10 equal sections, 7 green. P(green) = ?","3/10","7/10","7/3","10/7",1],
["A box has 12 cards, 4 marked WIN. P(WIN) = ?","1/4","1/3","2/3","3/4",1]
]},
master:"A student calculates 9/5 as a probability. What does that immediately tell you about the calculation? Identify the likely type of error and describe how to fix it.",
check:[
["A bag has 3 red and 7 blue counters. P(red) is…","3/7","7/10","3/10","10/3",2],
["A fair die: P(number less than 3) is…","1/6","1/3","1/2","2/3",1],
["If 4 of 12 equally likely outcomes are favorable, the probability is…","1/12","1/4","1/3","2/3",2],
["Which is a valid probability?","-0.2","1.4","0.75","2",2],
["A probability of 20% means…","20 favorable outcomes in every single trial","about 20% of outcomes in many repeated trials under the same conditions are expected to be favorable","the event must happen exactly once in five trials","the event is certain",1]
]
},
{
id:"d5", label:"Day 5", title:"Integrate, Explain, and Prepare for Mastery", date:"Friday • Date: __________",
target:"Integrate the Week 9 process: list possible outcomes, identify favorable outcomes, calculate theoretical probability of a single event, and explain the result.",
intro:"Today we bring the whole week together. Your goal is not just to get a number. A strong mathematician can show the possible outcomes, identify which outcomes are favorable, calculate accurately, and explain what the probability means.",
motivation:["Without looking back, name the 5 steps for a theoretical probability problem.","What is the difference between a possible outcome and a favorable outcome?","What two values must always be true of a probability?"],
learn:[
["The Week 9 method","LIST → IDENTIFY → CALCULATE → SIMPLIFY → INTERPRET."],
["LIST","Describe the sample space or count the complete set of equally likely outcomes."],
["IDENTIFY","Mark the outcomes that satisfy the event."],
["CALCULATE & SIMPLIFY","Use P(E)=favorable/total and simplify when possible."],
["INTERPRET","State the chance using a fraction, decimal, or percent and explain what it means in context."]
],
example:{title:"Capstone example: Classroom raffle",body:"A fair raffle uses 20 equally likely tickets. Maya has 5 tickets. Let E = Maya wins when one ticket is selected.",math:"P(E)=5/20=1/4=0.25=25%. Interpretation: Maya has a 25% chance of being selected. Her chance is less than 50%, but it is not impossible."},
explore:"Complete the “Probability Detective” challenge. For each case, identify the total outcomes, favorable outcomes, and probability.",
activity:{type:"detective",questions:[
["A fair die: event = rolling an odd number.","6","3","1/2"],
["A bag has 2 yellow, 3 green, and 5 red equally likely counters: event = green.","10","3","3/10"],
["A spinner has 12 equal sections, 4 labeled WIN: event = WIN.","12","4","1/3"],
["A fair coin is tossed: event = tails.","2","1","1/2"]
]},
master:"Explain in your own words why “probability is a measure of chance” does not mean probability predicts one single trial with certainty.",
check:[
["The correct first step in a theoretical probability problem is to…","guess the answer","list/identify all possible outcomes","multiply favorable outcomes by 100","choose the largest number",1],
["If 6 of 10 equally likely outcomes are favorable, P(E) = …","3/5","2/5","6/4","5/3",0],
["Which statement is always true?","P(E) can be 1.5","P(E) can be -1","0 ≤ P(E) ≤ 1","P(E) must equal 0.5",2],
["3/8 as a percent is…","12.5%","25%","37.5%","62.5%",2],
["A probability of 1/4 is best described as…","certain","impossible","unlikely/25% chance","more likely than not",2]
]
}
];

const assessment=[
["Multiple Choice","A fair six-sided die is rolled. What is the probability of rolling a 4?",["1/2","1/3","1/6","4/6"],2],
["Multiple Choice","A fair coin is tossed. What is the sample space?",["{H}","{T}","{H,T}","{1,2}"],2],
["Multiple Choice","A fair die is rolled. What is P(rolling an even number)?",["1/6","1/3","1/2","2/3"],2],
["Multiple Choice","A bag contains 3 red and 7 blue counters. One is selected at random. What is P(red)?",["3/10","7/10","3/7","7/3"],0],
["Multiple Choice","Which probability represents a certain event?",["0","0.25","0.75","1"],3],
["True or False","A probability can be greater than 1.",["True","False"],1],
["Multiple Choice","A fair die is rolled. What is P(rolling a number greater than 4)?",["1/6","1/3","1/2","2/3"],1],
["Multiple Choice","Which is the set of favorable outcomes for the event “rolling a prime number” on a fair die?",["{1,2,3}","{2,3,5}","{2,4,6}","{1,3,5}"],1],
["Multiple Choice","What is 2/5 as a percent?",["20%","25%","40%","50%"],2],
["Multiple Choice","What is 0.75 as a fraction in simplest form?",["1/4","2/3","3/4","4/5"],2],
["True or False","The favorable outcomes are the outcomes that make the event happen.",["True","False"],0],
["Multiple Choice","A spinner has 8 equal sections and 3 are green. What is P(green)?",["3/8","5/8","3/5","8/3"],0],
["Multiple Choice","A fair die is rolled. What is P(rolling 1 or 2)?",["1/6","1/3","1/2","2/3"],1],
["Multiple Choice","A box has 12 equally likely cards and 4 are marked WIN. What is P(WIN)?",["1/4","1/3","2/3","3/4"],1],
["Identification","Write the probability of an impossible event as a number.",["0","1/2","1","2"],0],
["Problem Solving","A fair die is rolled. The event is rolling a number less than 5. What is P(E)?",["1/6","1/3","2/3","5/6"],3],
["Application","A prize wheel has 10 equal sections, 7 prizes and 3 blanks. Which statement is correct?",["P(prize)=3/10","P(prize)=7/10","P(prize)=7/3","P(prize)=10/7"],1],
["True or False","A probability of 50% guarantees the event will happen on exactly half of the next 2 trials.",["True","False"],1],
["Higher-Order Thinking","A student says P(E)=8/3 for a probability problem. What is the best response?",["The answer is valid because 8 is larger than 3","The answer must be checked because a probability cannot be greater than 1","The answer is always 0","The answer must be 3/8 without checking"],1],
["Problem Solving","A bag has 5 yellow, 2 green, and 3 red equally likely counters. What is P(green)?",["1/10","1/5","2/5","1/2"],1],
["Multiple Choice","Which is the best sequence for theoretical probability?",["Interpret → calculate → list → identify","List → identify favorable → calculate → simplify → interpret","Guess → calculate → interpret → list","Calculate → list → ignore favorable outcomes"],1],
["Multiple Choice","If P(E)=0.25, which equivalent form is correct?",["2.5%","25%","40%","75%"],1],
["Application","A class chooses one of 20 equally likely raffle tickets. A student owns 5 tickets. What is the student's probability of being selected?",["1/20","1/5","1/4","5/4"],2],
["Multiple Choice","Which statement best describes theoretical probability?",["It describes chance using all possible equally likely outcomes","It guarantees the next outcome","It ignores favorable outcomes","It can only be written as a percent"],0],
["Higher-Order Thinking","Why is listing all possible outcomes important?",["It makes the problem longer","It ensures the denominator represents the complete set of possible equally likely outcomes","It guarantees a favorable result","It removes the need to interpret the answer"],1]
];

let slides=["home",...days.map(d=>d.id),"assessment"];
let current=0;

function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function phase(title,time,content,cls=""){
 return `<section class="phase ${cls}"><div class="phase-title"><h2>${title}</h2><span class="time">⏱️ ${time} minutes</span></div>${content}</section>`;
}
function options(qid,arr,correct){
 return `<div class="option-list">${arr.map((x,i)=>`<button class="option" data-q="${qid}" data-i="${i}" data-c="${correct}" type="button">${esc(x)}</button>`).join("")}</div><div class="feedback" id="fb-${qid}" aria-live="polite"></div>`;
}
function quickCheck(items,prefix){
 return items.map((q,i)=>`<div class="interactive"><strong>${i+1}. ${esc(q[0])}</strong>${options(`${prefix}-${i}`,q.slice(1,5),q[5])}</div>`).join("");
}
function learnCards(items){
 return `<div class="grid">${items.map((x,i)=>`<article class="card"><h3>${i+1}. ${esc(x[0])}</h3><p>${esc(x[1])}</p></article>`).join("")}</div>`;
}
function exampleCard(ex){
 return `<article class="example"><h3>${esc(ex.title)}</h3><p>${esc(ex.body)}</p><div class="math">${esc(ex.math)}</div></article>`;
}
function activityHTML(a,dayId){
 if(a.type==="chanceSort"){
   return `<div class="interactive"><p><strong>How likely?</strong> Click a statement, then choose its chance category.</p>
   ${a.items.map((it,i)=>`<div class="card" style="margin:10px 0"><strong>${esc(it[0])}</strong><div class="option-list">${["Impossible","Unlikely","Equally likely","Likely","Certain"].map(c=>`<button class="option sort-option" data-answer="${esc(it[1])}" data-choice="${c}" type="button">${c}</button>`).join("")}</div><div class="feedback sort-fb"></div></div>`).join("")}</div>`;
 }
 if(a.type==="probBuild"){
   return a.questions.map((q,i)=>`<div class="interactive" style="margin:10px 0"><strong>${esc(q[0])}</strong><p>Sample space:</p><div class="math">${esc(q[1])}</div><p>Favorable outcomes:</p><button class="reveal-btn" data-reveal="pb-${dayId}-${i}" type="button">Show favorable outcomes</button><div class="answer" id="pb-${dayId}-${i}">${esc(q[4][0])}</div><p>Probability:</p><button class="reveal-btn" data-reveal="pbc-${dayId}-${i}" type="button">Show probability</button><div class="answer" id="pbc-${dayId}-${i}">${esc(q[3])}</div></div>`).join("");
 }
 if(a.type==="convert"){
   return a.questions.map((q,i)=>`<div class="interactive" style="margin:10px 0"><strong>${q[0]} = ?</strong><div class="input-row"><input id="cv-${i}" aria-label="decimal answer for ${q[0]}" placeholder="decimal"><input id="cp-${i}" aria-label="percent answer for ${q[0]}" placeholder="percent"><button class="check-btn" data-convert="${i}" type="button">Check</button></div><div class="feedback" id="cvfb-${i}"></div><div class="answer" id="cvans-${i}">Answer: ${q[1]} = ${q[2]}</div></div>`).join("");
 }
 if(a.type==="scenario"){
   return a.questions.map((q,i)=>`<div class="interactive" style="margin:10px 0"><strong>${i+1}. ${esc(q[0])}</strong>${options(`sc-${dayId}-${i}`,q.slice(1,5),q[5])}</div>`).join("");
 }
 if(a.type==="detective"){
   return a.questions.map((q,i)=>`<div class="interactive" style="margin:10px 0"><strong>${i+1}. ${esc(q[0])}</strong><div class="grid"><div class="card"><b>Total outcomes</b><div class="math">${q[1]}</div></div><div class="card"><b>Favorable outcomes</b><div class="math">${q[2]}</div></div><div class="card"><b>Probability</b><div class="math">${q[3]}</div></div></div><button class="reveal-btn" data-reveal="det-${dayId}-${i}" type="button">Reveal reasoning</button><div class="answer" id="det-${dayId}-${i}">Check: total outcomes = ${q[1]}; favorable outcomes = ${q[2]}; probability = ${q[3]}.</div></div>`).join("");
 }
 return "";
}
function renderHome(){
 app.innerHTML=`<section class="hero">
  <span class="kicker">TEACHER ED LEARNING HUB • GRADE 8 MATHEMATICS</span>
  <h1>Grade 8 – Term 3 – Week 9</h1>
  <p><strong>Theoretical Probability of a Single Event</strong></p>
  <p>This classroom-ready interactive lesson develops the exact Week 9 competencies from the Grade 8 Mathematics Budget of Work: calculate the theoretical probability of a single event by listing all possible outcomes, and describe probability as a measure of the chance of an event occurring.</p>
  <div class="flow"><div><b>DAY 1</b><br>Probability & Chance</div><div><b>DAY 2</b><br>List Outcomes & Calculate</div><div><b>DAY 3</b><br>Fractions, Decimals & Percent</div><div><b>DAY 4–5</b><br>Applications & Mastery</div></div>
 </section>
 <div class="grid">
  <article class="card"><h2>🎯 Week 9 Learning Competencies</h2><ul class="standard-list"><li>Calculate the theoretical probability of a single event by listing all possible outcomes.</li><li>Describe probability as a measure of the chance of an event occurring.</li></ul></article>
  <article class="card"><h2>🧠 Know • Understand • Do</h2><ul class="standard-list"><li><b>KNOW:</b> sample space, favorable outcomes, event, theoretical probability.</li><li><b>UNDERSTAND:</b> probability measures chance and lies from 0 to 1.</li><li><b>DO:</b> list outcomes, count favorable outcomes, calculate, simplify, and interpret.</li></ul></article>
  <article class="card"><h2>📚 Content Standard Connection</h2><p>The Third Term includes experimental and theoretical probability and the Fundamental Counting Principle. Week 9 focuses specifically on theoretical probability of a single event.</p></article>
  <article class="card"><h2>🏁 Performance Connection</h2><p>The term performance expectations include calculating probability of a single event and simple combined events. This week builds the single-event foundation needed before the next probability work.</p></article>
 </div>
 <article class="card" style="margin-top:20px"><h2>🧭 ILAW Lesson Flow</h2><div class="flow"><div><b>I – LEARN</b><br>Build the concept with teacher-style explanations and worked examples.</div><div><b>L – EXPLORE</b><br>Investigate outcomes, patterns, and situations.</div><div><b>A – APPLY / PRACTICE-PLAY</b><br>Use interactive questions and challenges.</div><div><b>W – THINK / CHECK / MASTER</b><br>Explain reasoning, correct errors, and show mastery.</div></div></article>`;
}
function renderDay(d){
 app.innerHTML=`<section class="day-head">
  <div><div class="day-number">${d.label} • GRADE 8 – TERM 3 – WEEK 9</div><h1>${esc(d.title)}</h1><div class="meta"><span class="pill">${d.date}</span><span class="pill">50-minute class</span><span class="pill">Mathematics • Data & Probability</span></div></div>
  <div class="target"><strong>🎯 Daily Learning Target</strong><br>${esc(d.target)}</div>
 </section>
 ${phase("A. Motivation / Warm-Up","5",`<div class="card"><p>${esc(d.intro)}</p><div class="callout blue-callout"><b>🔥 Warm-Up — Your Turn!</b><ul class="standard-list">${d.motivation.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><p><b>Teacher move:</b> Let learners answer orally or with fingers/mini-whiteboards before revealing formal language.</p></div></div>`)}
 ${phase("I – LEARN","10",`<div class="card"><p><b>Teacher explanation:</b> We will build the idea carefully before asking you to calculate. Watch for the difference between <em>all possible outcomes</em> and <em>favorable outcomes</em>.</p>${learnCards(d.learn)}${exampleCard(d.example)}</div>`)}
 ${phase("L – EXPLORE","10",`<div class="card"><div class="callout"><b>🔎 Think About It!</b><br>${esc(d.explore)}</div>${activityHTML(d.activity,d.id)}</div>`)}
 ${phase("A – APPLY / PRACTICE-PLAY","15",`<div class="card"><h3>🎮 Guided Practice → Challenge</h3><p>Work independently first. Then compare your reasoning with a partner. Click an answer for immediate feedback.</p>${quickCheck(d.check,"day")}</div>`)}
 ${phase("W – THINK / CHECK / MASTER","10",`<div class="card"><div class="mastery"><h3>🧠 Mastery Question</h3><p>${esc(d.master)}</p><p><b>Strong response should include:</b> a mathematical reason, not only a yes/no answer.</p></div><div class="callout green-callout"><b>Exit Ticket</b><br>Write one sentence completing: “Today I learned that probability ______ because ______.”</div></div>`)}
 <section class="phase"><div class="phase-title"><h2>✅ End-of-Day Check</h2><span class="time">5 questions</span></div><div class="grid">${d.check.map((q,i)=>`<div class="card">${quickCheck([q],`eod-${d.id}`)}</div>`).join("")}</div></section>`;
}
function renderAssessment(){
 app.innerHTML=`<section class="hero"><span class="kicker">WEEK 9 • MASTERY ASSESSMENT</span><h1>25-Item Theoretical Probability Assessment</h1><p>Show what you can do: describe chance, list possible outcomes, identify favorable outcomes, calculate theoretical probability of a single event, and interpret your answer.</p></section>
 <section class="assessment-shell" style="margin-top:20px"><div class="callout blue-callout"><b>Directions:</b> Read each item carefully. For multiple-choice questions, select one answer. For True/False and Identification items, select the best answer. When finished, click <b>Check Answers</b>.</div><div id="assessment"></div><button class="primary-btn" id="submitAssessment" type="button">✓ Check Answers</button> <button class="reset-btn" id="resetAssessment" type="button">↻ Reset</button><div class="result" id="result"></div></section>`;
 const box=document.getElementById("assessment");
 box.innerHTML=assessment.map((q,i)=>`<article class="q" id="aq-${i}"><h3>${i+1}. <span class="pill">${q[0]}</span> ${esc(q[1])}</h3>${q[2].map((o,j)=>`<label><input type="radio" name="aq${i}" value="${j}"> ${String.fromCharCode(65+j)}. ${esc(o)}</label>`).join("")}</article>`).join("");
 document.getElementById("submitAssessment").addEventListener("click",scoreAssessment);
 document.getElementById("resetAssessment").addEventListener("click",()=>{document.querySelectorAll("#assessment input").forEach(x=>x.checked=false);document.querySelectorAll(".q").forEach(x=>x.classList.remove("correct","incorrect"));document.getElementById("result").classList.remove("show");window.scrollTo({top:0,behavior:"smooth"});});
}
function scoreAssessment(){
 let correct=0;
 assessment.forEach((q,i)=>{
   const chosen=document.querySelector(`input[name="aq${i}"]:checked`);
   const card=document.getElementById(`aq-${i}`);
   card.classList.remove("correct","incorrect");
   if(chosen && Number(chosen.value)===q[3]){correct++;card.classList.add("correct")}
   else card.classList.add("incorrect");
 });
 const pct=Math.round(correct/assessment.length*100);
 let msg=pct>=90?"🌟 Outstanding! You demonstrated excellent mastery of Week 9."
 :pct>=80?"👏 Great job! You demonstrated good understanding of theoretical probability."
 :pct>=75?"👍 Good work! Review the items you missed and strengthen your reasoning."
 :"💪 Keep going! Review Days 1–4, especially listing outcomes, identifying favorable outcomes, and using P(E)=favorable/total.";
 const result=document.getElementById("result");
 result.innerHTML=`<div class="score-big">${correct}/${assessment.length} • ${pct}%</div><h2>${msg}</h2><p><b>Review guide:</b> If you missed items about chance language, revisit Day 1. If you missed sample-space or favorable-outcome items, revisit Day 2. If you missed conversions, revisit Day 3. If you missed word problems or interpretation, revisit Day 4.</p>`;
 result.classList.add("show");
 result.scrollIntoView({behavior:"smooth",block:"center"});
}
function buildNav(){
 const items=[["home","Home"],...days.map(d=>[d.id,d.label]),["assessment","Assessment"]];
 navLinks.innerHTML=items.map(([id,label])=>`<button type="button" data-go="${id}">${label}</button>`).join("");
 navLinks.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>{goTo(b.dataset.go);navLinks.classList.remove("open");menuBtn.setAttribute("aria-expanded","false");}));
}
function goTo(id){
 current=Math.max(0,slides.indexOf(id));
 if(id==="home")renderHome(); else if(id==="assessment")renderAssessment(); else renderDay(days.find(d=>d.id===id));
 updateUI();
 window.scrollTo({top:0,behavior:"smooth"});
}
function updateUI(){
 const id=slides[current];
 navLinks.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b.dataset.go===id));
 locationLabel.textContent=id==="home"?"Home":id==="assessment"?"Assessment":days.find(d=>d.id===id).label;
 prevBtn.disabled=current===0; nextBtn.disabled=current===slides.length-1;
 prevBtn.style.opacity=prevBtn.disabled?".45":"1";nextBtn.style.opacity=nextBtn.disabled?".45":"1";
 document.querySelector(".progress-bar")?.style.setProperty("width",`${(current/(slides.length-1))*100}%`);
}
prevBtn.addEventListener("click",()=>{if(current>0)goTo(slides[current-1]);});
nextBtn.addEventListener("click",()=>{if(current<slides.length-1)goTo(slides[current+1]);});
menuBtn.addEventListener("click",()=>{const open=navLinks.classList.toggle("open");menuBtn.setAttribute("aria-expanded",String(open));});
fsBtn.addEventListener("click",async()=>{
 try{
   if(!document.fullscreenElement){await document.documentElement.requestFullscreen();document.body.classList.remove("presentation");}
   else await document.exitFullscreen();
 }catch(e){document.body.classList.toggle("presentation");toast("Presentation mode toggled.");}
});
document.addEventListener("fullscreenchange",()=>{fsBtn.textContent=document.fullscreenElement?"⛶ EXIT FULL SCREEN":"⛶ FULL SCREEN";});
function toast(msg){
 let t=document.querySelector(".toast");if(!t){t=document.createElement("div");t.className="toast";document.body.appendChild(t);}
 t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800);
}
document.addEventListener("click",e=>{
 const b=e.target.closest(".option");
 if(b){
   const q=b.dataset.q;
   if(q){
     const same=document.querySelectorAll(`.option[data-q="${q}"]`);
     same.forEach(x=>x.classList.remove("correct","wrong"));
     const correct=Number(b.dataset.i)===Number(b.dataset.c);
     b.classList.add(correct?"correct":"wrong");
     const fb=document.getElementById(`fb-${q}`);
     if(fb)fb.textContent=correct?"✅ Correct! Great thinking!":"❌ Not quite. Let's review the concept and try again.";
   }
 }
 const r=e.target.closest(".reveal-btn");
 if(r){document.getElementById(r.dataset.reveal)?.classList.toggle("show");}
 const so=e.target.closest(".sort-option");
 if(so){
   const card=so.closest(".card"),fb=card.querySelector(".sort-fb"),answer=so.dataset.answer;
   card.querySelectorAll(".sort-option").forEach(x=>x.classList.remove("correct","wrong"));
   const ok=so.dataset.choice===answer;so.classList.add(ok?"correct":"wrong");
   fb.textContent=ok?"✅ Correct! You classified the chance well.":"❌ Not quite. Think about how large the chance is compared with other outcomes.";
 }
 const cv=e.target.closest("[data-convert]");
 if(cv){
   const i=Number(cv.dataset.convert),q=days[2].activity.questions[i];
   const d=document.getElementById(`cv-${i}`).value.trim().replace("%","");
   const p=document.getElementById(`cp-${i}`).value.trim().replace("%","");
   const ok=(Math.abs(Number(d)-Number(q[1]))<0.0001)&&(Math.abs(Number(p)-Number(q[2].replace("%","")))<0.01);
   const fb=document.getElementById(`cvfb-${i}`);
   fb.textContent=ok?"✅ Correct! The forms are equivalent.":"❌ Check the conversion: divide for decimal, then multiply by 100 for percent.";
   if(ok)document.getElementById(`cvans-${i}`).classList.add("show");
 }
});
document.addEventListener("keydown",e=>{
 if(e.key==="ArrowRight" && !["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) nextBtn.click();
 if(e.key==="ArrowLeft" && !["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) prevBtn.click();
});
buildNav();
app.insertAdjacentHTML("afterend",'<div class="progress-wrap"><div class="progress-bar"></div></div>');
renderHome();updateUI();

const app = document.getElementById("app");
const navLinks = document.getElementById("navLinks");
const menuBtn = document.getElementById("menuBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const locationLabel = document.getElementById("locationLabel");
const fsBtn = document.getElementById("fsBtn");

const days = [
{
 id:"d1", label:"Day 1", title:"What Is a Combined Event?", date:"Monday • Date: __________",
 target:"Describe a simple combined event, identify its component events, and represent possible outcomes using an organized list or possibility diagram.",
 intro:"Week 9 focused on the probability of one event. Today we take the next step: what happens when a situation involves two simple choices or conditions? A combined event brings two or more simple events together, so we need a careful way to list every possible outcome.",
 motivation:[
  "If you toss a coin and roll a die, how many different outcomes might you get?",
  "What information must be recorded so that no possible outcome is forgotten?",
  "How is 'getting heads' different from 'getting heads and rolling an even number'?"
 ],
 learn:[
  ["Simple event","A simple event describes one outcome or one condition of an experiment. Example: getting Heads on one coin toss."],
  ["Combined event","A combined event involves two or more simple events or stages in one experiment. Example: tossing a coin and rolling a die."],
  ["Outcome as an ordered result","When two stages occur, keep the order clear. In (H,4), H came from the coin and 4 came from the die."],
  ["Why organize outcomes?","An organized list, possibility diagram, or tree diagram helps us account for every possible outcome exactly once."],
  ["Week 10 focus","We will use these representations to calculate the probability of simple combined events."]
 ],
 example:{title:"Worked Example: Coin + Die", body:"A fair coin is tossed and a fair six-sided die is rolled. The coin has 2 outcomes (H,T) and the die has 6 outcomes (1–6). Every coin result can be paired with every die result.", math:"Possible outcomes: H1,H2,H3,H4,H5,H6,T1,T2,T3,T4,T5,T6  →  12 outcomes"},
 explore:"Build the sample space mentally. Click the choices that correctly describe the combined experiment.",
 activity:{type:"choiceSet", questions:[
  ["How many total outcomes are possible when one coin is tossed and one die is rolled?","6","8","12","18",2],
  ["Which is a complete outcome?","H only","4 only","H and 4 together","even",2],
  ["Which pair is possible?","(T,5)","(H,8)","(T,9)","(H,0)",0]
 ]},
 master:"A learner lists H1–H6 but forgets T1–T6. Is the list complete? Explain how the missing outcomes affect a probability calculation.",
 check:[
  ["A combined event usually involves…","only one possible outcome","two or more simple events/stages","no outcomes","only impossible events",1],
  ["A coin has…","1 outcome","2 outcomes","3 outcomes","6 outcomes",1],
  ["A standard die has…","4 outcomes","5 outcomes","6 outcomes","8 outcomes",2],
  ["Coin + die gives how many equally likely outcomes?","8","10","12","14",2],
  ["Why organize outcomes?","To remove outcomes","To make sure all possible outcomes are accounted for","To guarantee the event","To change the probability",1]
 ]
},
{
 id:"d2", label:"Day 2", title:"Listing Combined Outcomes with Possibility Diagrams", date:"Tuesday • Date: __________",
 target:"List the possible outcomes of a two-stage experiment using an organized list or possibility diagram and count the outcomes relevant to an event.",
 intro:"Today we make combined outcomes easier to see. Possibility diagrams show how each choice in the first stage can be paired with each choice in the second stage.",
 motivation:[
  "A café offers 3 sandwich choices and 2 drink choices. How many meal combinations can you make?",
  "What if each sandwich can be paired with every drink?",
  "How could a diagram help you avoid missing a combination?"
 ],
 learn:[
  ["Two-stage experiment","The first stage has its own outcomes and the second stage has its own outcomes. A complete combined outcome records one choice from each stage."],
  ["Possibility diagram","Start with each first-stage choice. From each one, connect every possible second-stage choice."],
  ["Organized listing","You can write AB, AC, AD… or use ordered pairs such as (Red,1). The key is consistency and completeness."],
  ["Counting favorable outcomes","After listing all outcomes, identify only those that satisfy the event. Those are the favorable outcomes."],
  ["Equal likelihood","When each basic choice is equally likely and the stages are independent in the model, the combined outcomes can be treated as equally likely."]
 ],
 example:{title:"Worked Example: Shirt + Shorts", body:"Suppose a student chooses 2 shirts (Blue, White) and 3 pairs of shorts (Black, Gray, Khaki). Every shirt can be paired with every pair of shorts.", math:"(B,Bk),(B,G),(B,K),(W,Bk),(W,G),(W,K)  →  6 combinations"},
 explore:"Use the interactive diagram to practice pairing every first-stage choice with every second-stage choice.",
 activity:{type:"pairing", left:["Red","Blue","Green"], right:["1","2"], questions:[
  ["How many complete outcomes are possible?","5","6","7","8",1],
  ["Which is a valid outcome?","Red-1","1-Red-Blue","Green-3","Blue only",0],
  ["Event: choose Green and an even number. How many favorable outcomes?","0","1","2","3",1]
 ]},
 master:"Why is 'Red-1, Red-2, Blue-1, Blue-2, Green-1, Green-2' better than an unordered list such as 'Red, Blue, Green, 1, 2'?",
 check:[
  ["A possibility diagram is useful because it…","hides choices","organizes combinations","removes favorable outcomes","changes sample space",1],
  ["If Stage 1 has 3 choices and Stage 2 has 2 choices, total combinations are…","5","6","8","9",1],
  ["For the event 'Blue-2', how many favorable outcomes are there?","0","1","2","6",1],
  ["A favorable outcome is one that…","is impossible","satisfies the event","is always the largest number","is not in the sample space",1],
  ["A complete list should contain each possible outcome…","zero times","exactly once","at least three times","only when favorable",1]
 ]
},
{
 id:"d3", label:"Day 3", title:"Probability of a Combined Event", date:"Wednesday • Date: __________",
 target:"Calculate the probability of a simple combined event by listing all possible outcomes and counting the favorable outcomes.",
 intro:"Now we connect the representation to probability. Once the complete sample space is known, the same idea from Week 9 applies: favorable outcomes divided by total equally likely outcomes.",
 motivation:[
  "If a coin-and-die experiment has 12 equally likely outcomes, what is the probability of one specific pair such as (H,4)?",
  "How many outcomes satisfy 'Heads and even number'?",
  "Why must the denominator include every possible combined outcome?"
 ],
 learn:[
  ["The formula","For equally likely outcomes: P(E) = number of favorable combined outcomes ÷ total number of possible combined outcomes."],
  ["AND means both conditions","For an event such as 'Heads and even', an outcome must satisfy the coin condition AND the die condition."],
  ["Count carefully","First build or reason from the complete sample space. Then mark the outcomes that satisfy both conditions."],
  ["Simplify and interpret","Reduce the fraction when possible, then explain the chance in words, decimal, or percent."],
  ["Check the result","A probability must be between 0 and 1. If your answer is greater than 1, revisit your favorable and total counts."]
 ],
 example:{title:"Worked Example: Heads AND Even", body:"Toss a fair coin and roll a fair die. There are 12 equally likely outcomes. The event 'Heads and even' has H2, H4, H6: 3 favorable outcomes.", math:"P(Heads AND Even) = 3/12 = 1/4 = 0.25 = 25%"},
 explore:"Choose the probability for each combined event. Think of the complete 12-outcome sample space.",
 activity:{type:"choiceSet", questions:[
  ["P(Tails AND odd)","1/12","1/4","1/3","1/2",1],
  ["P(Heads AND rolling 5)","1/12","1/6","1/4","1/2",0],
  ["P(rolling an even number, regardless of coin)","1/6","1/4","1/2","3/4",2]
 ]},
 master:"A student calculates P(Heads AND Even) = 3/6 = 1/2. The favorable count is 3. What did the student probably use incorrectly as the denominator?",
 check:[
  ["For coin + die, the denominator is…","2","6","8","12",3],
  ["Heads and even has favorable outcomes…","2","3","4","6",1],
  ["P(Heads AND Even) equals…","1/12","1/4","1/2","3/4",1],
  ["A probability of 1/4 means…","0% chance","25% chance","50% chance","100% chance",1],
  ["If an event has 0 favorable outcomes, its probability is…","0","1/4","1/2","1",0]
 ]
},
{
 id:"d4", label:"Day 4", title:"Tree Diagrams and Real-Life Combined Events", date:"Thursday • Date: __________",
 target:"Use a tree diagram or organized listing to solve simple combined-event probability problems in real-life situations.",
 intro:"Combined events appear in everyday choices: outfits, menus, routes, game moves, and two-stage chance experiments. Today we use tree diagrams to show every path from the first choice to the second choice.",
 motivation:[
  "A school kiosk offers 2 sandwich choices and 3 drinks. How many different meal pairs are possible?",
  "If every meal pair is equally likely, what fraction would represent one particular pair?",
  "What advantage does a tree diagram have when there are several choices?"
 ],
 learn:[
  ["Tree diagram","A tree diagram begins with branches for the first stage. Each branch then splits into the possible second-stage choices."],
  ["Each path is an outcome","Follow one complete path from the starting point to the final choice. Each complete path represents one combined outcome."],
  ["Event conditions","A problem may ask for outcomes satisfying one or both conditions, such as 'red shirt and black shorts'."],
  ["Real-life interpretation","After calculating, translate the fraction back into the situation. A probability of 2/6 means 2 favorable combinations out of 6 equally likely combinations."],
  ["Avoid double counting","Each complete path should be counted once. Do not count the first-stage choice and second-stage choice separately as if they were complete outcomes."]
 ],
 example:{title:"Worked Example: Lunch Choices", body:"A school café offers 2 meals (Rice Meal, Pasta) and 3 drinks (Water, Juice, Milk). If every meal-drink combination is equally likely, there are 6 possible combinations. The event 'Pasta and Juice' has 1 favorable outcome.", math:"P(Pasta AND Juice) = 1/6 ≈ 16.67%"},
 explore:"Follow the paths mentally. Then answer the real-life questions.",
 activity:{type:"scenario", questions:[
  ["A shop has 2 cap colors (Black, White) and 3 shirt colors (Blue, Green, Yellow). If all 6 pairs are equally likely, what is P(White AND Green)?","1/6","1/3","1/2","2/3",0],
  ["A game has 3 first moves and 2 second moves for every first move. How many complete move sequences are possible?","5","6","8","9",1],
  ["A meal has 2 mains and 3 drinks. What is P(selecting a specific main AND a specific drink), assuming all 6 combinations are equally likely?","1/2","1/3","1/6","2/6",2]
 ]},
 master:"A learner says, 'There are 2 mains and 3 drinks, so there are 5 possible meals.' Explain why 5 is not the number of complete combinations.",
 check:[
  ["A tree diagram represents…","only first choices","complete paths of choices","only favorable outcomes","probabilities greater than 1",1],
  ["2 choices followed by 3 choices gives…","5","6","8","9",1],
  ["One specific combination among 6 equally likely combinations has probability…","1/6","1/3","1/2","6/1",0],
  ["If 2 of 6 combinations satisfy an event, probability is…","1/6","1/3","1/2","2/3",1],
  ["The best final step after a word problem is to…","ignore units and meaning","interpret the probability in context","change the denominator","guess",1]
 ]
},
{
 id:"d5", label:"Day 5", title:"Solve, Explain, and Master Combined Events", date:"Friday • Date: __________",
 target:"Integrate listing, possibility diagrams, and tree diagrams to calculate and explain probabilities of simple combined events.",
 intro:"Today you become the probability problem-solver. You will decide how to organize outcomes, calculate the probability, check whether the answer makes sense, and explain the result clearly.",
 motivation:[
  "Which representation would you choose for 2 coin tosses: an organized list, possibility diagram, or tree diagram?",
  "What makes a probability solution convincing?",
  "How can you detect a wrong denominator before submitting an answer?"
 ],
 learn:[
  ["A reliable problem-solving routine","1) Identify the stages. 2) List or diagram all outcomes. 3) Identify favorable outcomes. 4) Use P(E)=favorable/total. 5) Simplify. 6) Interpret and check."],
  ["Representation choice","Use an organized list for a small sample space, a possibility diagram for two choice sets, and a tree diagram when stages branch naturally."],
  ["Reasonableness check","The numerator cannot exceed the denominator. The answer must be from 0 to 1, and its meaning should fit the situation."],
  ["Explain, don't just calculate","A strong solution names the sample space, identifies favorable outcomes, shows the probability, and interprets the result."],
  ["Mastery goal","By the end of today, you should be able to solve a simple combined-event probability problem independently and defend your answer."]
 ],
 example:{title:"Full Worked Example: Two Coin Tosses", body:"Two fair coins are tossed. The organized sample space is HH, HT, TH, TT. Event: exactly one Head. Favorable outcomes are HT and TH, so there are 2 favorable outcomes out of 4.", math:"P(exactly one Head) = 2/4 = 1/2 = 50%"},
 explore:"Probability Detective: choose the correct solution strategy for each situation.",
 activity:{type:"detective", questions:[
  ["Two coins are tossed. Event: exactly two Heads. What probability is correct?","1/4","1/2","3/4","1",0],
  ["A spinner has 3 equal colors and a coin is tossed. How many combined outcomes?","3","4","5","6",3],
  ["A bag has 2 red and 1 blue marble, and a fair coin is tossed. If one marble and one coin result are recorded, how many basic outcomes?","3","4","5","6",2]
 ]},
 master:"Write the six-step routine in your own words. Then explain why 'listing outcomes' is more than simply writing some examples.",
 check:[
  ["What should you identify first?","The final percentage","The experiment stages and event","A random answer","Only the favorable outcomes",1],
  ["For two fair coin tosses, total outcomes are…","2","3","4","6",2],
  ["Exactly one Head has how many favorable outcomes?","1","2","3","4",1],
  ["P(exactly one Head) is…","1/4","1/3","1/2","3/4",2],
  ["A correct probability must be…","less than 0","between 0 and 1 inclusive","greater than 1","always 1/2",1]
 ]
}
];

const assessment = [
 ["Multiple Choice","A coin is tossed and a die is rolled. How many total outcomes are in the sample space?",["6","8","12","18"],2],
 ["Multiple Choice","Which is a complete combined outcome for a coin-and-die experiment?",["Heads","4","(T,5)","Even"],2],
 ["Multiple Choice","What is P(Heads AND rolling an even number) for a fair coin and fair die?",["1/12","1/6","1/4","1/2"],2],
 ["Multiple Choice","Which list is complete for two fair coin tosses?",["H,T","HH, HT, TH, TT","HH, TT","H,H,T,T"],1],
 ["True or False","A combined event can involve two stages of an experiment.",["True","False"],0],
 ["Multiple Choice","A shirt is available in 3 colors and shorts in 2 colors. How many complete outfit combinations are possible?",["5","6","8","9"],1],
 ["Multiple Choice","In a possibility diagram, each complete path represents…",["a partial choice","one combined outcome","only the first stage","the denominator only"],1],
 ["Multiple Choice","Two fair coins are tossed. What is P(exactly one Head)?",["1/4","1/3","1/2","3/4"],2],
 ["Identification","For equally likely outcomes, theoretical probability is favorable outcomes divided by what?",["total possible outcomes","number of trials","number of branches only","largest outcome"],0],
 ["Multiple Choice","A café has 2 meals and 3 drinks. Assuming all combinations are equally likely, what is P(specific meal AND specific drink)?",["1/2","1/3","1/6","2/3"],2],
 ["True or False","The outcomes 'Red' and '2' by themselves form one complete combined outcome.",["True","False"],1],
 ["Multiple Choice","A spinner has 3 equal colors and a coin is tossed. How many combined outcomes are possible?",["3","5","6","9"],2],
 ["Multiple Choice","For two fair coin tosses, which outcomes represent exactly one Head?",["HH and TT","HT and TH","HH and HT","TH and TT"],1],
 ["Problem Solving","A fair coin is tossed and a fair die is rolled. What is P(Tails AND rolling a number greater than 4)?",["1/12","1/6","1/4","1/3"],1],
 ["Application","A school shop offers 2 cap colors and 3 shirt colors. If all 6 combinations are equally likely, what is P(White cap AND Green shirt)?",["1/6","1/3","1/2","2/3"],0],
 ["Multiple Choice","Which is the best first step in a combined-event probability problem?",["Guess the probability","Identify the stages and possible outcomes","Divide immediately","Choose only favorable outcomes"],1],
 ["Higher-Order Thinking","A learner says a coin-and-die experiment has 8 outcomes because 2+6=8. What is the best correction?",["Add 2 and 6","Multiply 2×6 because each coin result can pair with each die result","Subtract 2 from 6","Use 6 only"],1],
 ["Problem Solving","A game has 4 first-stage choices and 2 second-stage choices for each first choice. How many complete outcomes are possible?",["6","8","10","12"],1],
 ["Multiple Choice","If 3 of 12 equally likely combined outcomes are favorable, the probability is…",["1/12","1/4","1/3","3/4"],1],
 ["True or False","A probability of 5/4 can be correct for an ordinary event.",["True","False"],1],
 ["Application","Two fair coins are tossed. What is P(at least one Head)?",["1/4","1/2","3/4","1"],2],
 ["Multiple Choice","Which representation is especially useful when choices branch in stages?",["Tree diagram","Number line","Bar graph only","Frequency table only"],0],
 ["Problem Solving","A spinner has 2 equal sections, Red and Blue, and a die is rolled. What is P(Blue AND an odd number)?",["1/12","1/4","1/3","1/2"],1],
 ["Higher-Order Thinking","Why must the sample space be complete before calculating theoretical probability?",["To make the problem longer","So the denominator represents all possible equally likely outcomes","So every answer becomes 1/2","To avoid identifying favorable outcomes"],1],
 ["Multiple Choice","A student gets 2 favorable outcomes out of 8 total outcomes. Which interpretation is correct?",["25% chance","50% chance","75% chance","80% chance"],0]
];

const slides = ["home", ...days.map(d=>d.id), "assessment"];
let current = 0;

function esc(s){
 return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
function phase(title,time,content){
 return `<section class="phase"><div class="phase-title"><h2>${title}</h2><span class="time">⏱️ ${time} minutes</span></div>${content}</section>`;
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
 if(a.type==="choiceSet"){
  return a.questions.map((q,i)=>`<div class="interactive activity-block"><strong>${i+1}. ${esc(q[0])}</strong>${options(`act-${dayId}-${i}`,q.slice(1,5),q[5])}</div>`).join("");
 }
 if(a.type==="pairing"){
  return `<div class="pair-board"><div><h4>Stage 1</h4>${a.left.map(x=>`<span class="choice-chip">${esc(x)}</span>`).join("")}</div><div class="arrow-big">→</div><div><h4>Stage 2</h4>${a.right.map(x=>`<span class="choice-chip">${esc(x)}</span>`).join("")}</div></div>
  <div class="callout"><b>Build the outcomes:</b> ${a.left.map(l=>a.right.map(r=>`${l}-${r}`)).flat().map(esc).join(" • ")}</div>
  ${a.questions.map((q,i)=>`<div class="interactive activity-block"><strong>${i+1}. ${esc(q[0])}</strong>${options(`pair-${dayId}-${i}`,q.slice(1,5),q[5])}</div>`).join("")}`;
 }
 if(a.type==="scenario"){
  return a.questions.map((q,i)=>`<div class="interactive activity-block"><strong>${i+1}. ${esc(q[0])}</strong>${options(`sc-${dayId}-${i}`,q.slice(1,5),q[5])}</div>`).join("");
 }
 if(a.type==="detective"){
  return a.questions.map((q,i)=>`<div class="interactive activity-block"><strong>${i+1}. ${esc(q[0])}</strong><div class="detective-row"><span>Sample space idea: <b>${esc(q[1])}</b></span><span>Favorable: <b>${esc(q[2])}</b></span><span>Probability: <b>${esc(q[3])}</b></span></div><button class="reveal-btn" data-reveal="det-${dayId}-${i}" type="button">Reveal reasoning</button><div class="answer" id="det-${dayId}-${i}">${esc(q[4])}</div></div>`).join("");
 }
 return "";
}
function renderHome(){
 app.innerHTML = `
 <section class="hero">
  <span class="kicker">TEACHER ED LEARNING HUB • GRADE 8 MATHEMATICS</span>
  <h1>Grade 8 – Term 3 – Week 10</h1>
  <p><strong>Simple Combined Events: Listing, Possibility Diagrams, and Tree Diagrams</strong></p>
  <p>This week extends the Week 9 work on theoretical probability. Learners calculate the probability of simple combined events by listing outcomes or organizing them with possibility and tree diagrams.</p>
  <div class="flow">
   <div><b>DAY 1</b><br>Combined Events</div>
   <div><b>DAY 2</b><br>Possibility Diagrams</div>
   <div><b>DAY 3</b><br>Calculate Probability</div>
   <div><b>DAY 4</b><br>Tree Diagrams & Context</div>
   <div><b>DAY 5</b><br>Mastery & Explain</div>
  </div>
 </section>
 <div class="grid">
  <article class="card"><h2>🎯 Week 10 Learning Competency</h2><ul class="standard-list"><li>Calculate the probability of simple combined events by listing, or by possibility diagrams or tree diagrams.</li></ul></article>
  <article class="card"><h2>🧠 KNOW • UNDERSTAND • DO</h2><ul class="standard-list">
   <li><b>KNOW:</b> combined event, outcome, sample space, favorable outcome, possibility diagram, tree diagram.</li>
   <li><b>UNDERSTAND:</b> a combined experiment creates complete outcomes from two or more stages.</li>
   <li><b>DO:</b> list/diagram all outcomes, identify favorable outcomes, calculate and interpret probability.</li>
  </ul></article>
  <article class="card"><h2>📘 Content Standard</h2><p>The Third Term includes experimental and theoretical probability and the Fundamental Counting Principle. Week 10 applies this probability work to simple combined events.</p></article>
  <article class="card"><h2>🏁 Performance Connection</h2><p>By the end of the term, learners are expected to calculate the probability of a single event and simple combined events. This week focuses on the simple combined-event part of that expectation.</p></article>
 </div>
 <article class="card" style="margin-top:20px"><h2>🧭 ILAW Lesson Flow</h2><div class="flow">
  <div><b>I – LEARN</b><br>Introduce the concept with clear examples.</div>
  <div><b>L – EXPLORE</b><br>Investigate outcomes and representations.</div>
  <div><b>A – APPLY / PRACTICE-PLAY</b><br>Solve interactive probability challenges.</div>
  <div><b>W – THINK / CHECK / MASTER</b><br>Explain, check, correct, reflect, and master.</div>
 </div></article>
 <article class="card" style="margin-top:20px"><h2>🔑 The Core Formula</h2><div class="math">P(E) = favorable combined outcomes ÷ total possible combined outcomes</div><p>Use this when the combined outcomes are equally likely. Always make the sample space complete before counting favorable outcomes.</p></article>`;
}
function renderDay(d){
 const labels=["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"];
 app.innerHTML = `
 <section class="day-head">
  <div><div class="day-number">${d.label} • GRADE 8 – TERM 3 – WEEK 10</div><h1>${esc(d.title)}</h1>
  <div class="meta"><span class="pill">${d.date}</span><span class="pill">50-minute class</span><span class="pill">Data & Probability</span></div></div>
  <div class="target"><strong>🎯 Daily Learning Target</strong><br>${esc(d.target)}</div>
 </section>
 ${phase("A. MOTIVATION / WARM-UP","5",`<div class="card"><p>${esc(d.intro)}</p><div class="callout blue-callout"><b>🔥 Your Turn!</b><ul class="standard-list">${d.motivation.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><p><b>Teacher move:</b> Let learners predict before formal explanation. Accept oral answers, mini-whiteboards, or quick pair discussion.</p></div></div>`)}
 ${phase("I – LEARN","10",`<div class="card"><p><b>Teacher explanation:</b> Follow the concept → example → reasoning pattern. Stop after each card and ask learners to restate the idea.</p>${learnCards(d.learn)}${exampleCard(d.example)}</div>`)}
 ${phase("L – EXPLORE","10",`<div class="card"><div class="callout"><b>🔎 Think About It!</b><br>${esc(d.explore)}</div>${activityHTML(d.activity,d.id)}</div>`)}
 ${phase("A – APPLY / PRACTICE-PLAY","15",`<div class="card"><h3>🎮 Guided Practice → Challenge</h3><p>Answer independently first, then compare reasoning with a partner. Click an option to receive immediate feedback.</p>${quickCheck(d.check,"apply-"+d.id)}</div>`)}
 ${phase("W – THINK / CHECK / MASTER","10",`<div class="card"><div class="mastery"><h3>🧠 Mastery Question</h3><p>${esc(d.master)}</p><p><b>Strong response:</b> include the sample space idea, favorable outcomes, and a reason for the denominator when appropriate.</p></div><div class="callout green-callout"><b>Exit Ticket</b><br>Complete: “A simple combined-event probability can be solved by ______ because ______.”</div></div>`)}
 <section class="phase"><div class="phase-title"><h2>✅ End-of-Day Check</h2><span class="time">5 questions</span></div><div class="grid">${d.check.map((q,i)=>`<div class="card">${quickCheck([q],`eod-${d.id}`)}</div>`).join("")}</div></section>`;
}
function renderAssessment(){
 app.innerHTML = `
 <section class="hero"><span class="kicker">WEEK 10 • MASTERY ASSESSMENT</span><h1>25-Item Simple Combined Events Assessment</h1>
 <p>Demonstrate that you can list combined outcomes, use possibility or tree diagrams, identify favorable outcomes, calculate theoretical probability, and explain your answer.</p></section>
 <section class="assessment-shell" style="margin-top:20px">
  <div class="callout blue-callout"><b>Directions:</b> Read every item carefully. Select one answer for each item. When finished, click <b>Check Answers</b>. Review any missed item and revisit the suggested lesson day.</div>
  <div id="assessment"></div>
  <button class="primary-btn" id="submitAssessment" type="button">✓ Check Answers</button>
  <button class="reset-btn" id="resetAssessment" type="button">↻ Reset</button>
  <div class="result" id="result"></div>
 </section>`;
 const box = document.getElementById("assessment");
 box.innerHTML = assessment.map((q,i)=>`<article class="q" id="aq-${i}"><h3>${i+1}. <span class="pill">${q[0]}</span> ${esc(q[1])}</h3>${q[2].map((o,j)=>`<label><input type="radio" name="aq${i}" value="${j}"> ${String.fromCharCode(65+j)}. ${esc(o)}</label>`).join("")}<div class="assessment-feedback" id="af-${i}"></div></article>`).join("");
 document.getElementById("submitAssessment").addEventListener("click",scoreAssessment);
 document.getElementById("resetAssessment").addEventListener("click",()=>{
  document.querySelectorAll("#assessment input").forEach(x=>x.checked=false);
  document.querySelectorAll(".q").forEach(x=>x.classList.remove("correct","incorrect"));
  document.querySelectorAll(".assessment-feedback").forEach(x=>x.textContent="");
  document.getElementById("result").classList.remove("show");
  window.scrollTo({top:0,behavior:"smooth"});
 });
}
function scoreAssessment(){
 let correct=0;
 assessment.forEach((q,i)=>{
  const chosen=document.querySelector(`input[name="aq${i}"]:checked`);
  const card=document.getElementById(`aq-${i}`);
  const fb=document.getElementById(`af-${i}`);
  card.classList.remove("correct","incorrect");
  if(chosen && Number(chosen.value)===q[3]){
   correct++; card.classList.add("correct"); fb.textContent="✅ Correct! Great thinking!";
  } else {
   card.classList.add("incorrect");
   fb.textContent=`❌ Not quite. Correct answer: ${String.fromCharCode(65+q[3])}. ${q[2][q[3]]}`;
  }
 });
 const pct=Math.round(correct/assessment.length*100);
 let msg=pct>=90?"🌟 Outstanding! You demonstrated excellent mastery of Week 10."
  :pct>=80?"👏 Great job! You demonstrated strong understanding of simple combined events."
  :pct>=75?"👍 Good work! Review the items you missed and strengthen your outcome-listing and diagram skills."
  :"💪 Keep going! Review Days 1–4, especially complete sample spaces, favorable outcomes, and probability of combined events.";
 const result=document.getElementById("result");
 result.innerHTML=`<div class="score-big">${correct}/${assessment.length} • ${pct}%</div><h2>${msg}</h2><p><b>Review guide:</b> Missed sample-space/combined-event items → Day 1. Missed possibility-diagram items → Day 2. Missed probability calculations → Day 3. Missed tree-diagram/context items → Day 4. Missed integration/explanation items → Day 5.</p>`;
 result.classList.add("show");
 result.scrollIntoView({behavior:"smooth",block:"center"});
}
function buildNav(){
 const items=[["home","Home"],...days.map(d=>[d.id,d.label]),["assessment","Assessment"]];
 navLinks.innerHTML=items.map(([id,label])=>`<button type="button" data-go="${id}">${label}</button>`).join("");
 navLinks.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>{
  goTo(b.dataset.go); navLinks.classList.remove("open"); menuBtn.setAttribute("aria-expanded","false");
 }));
}
function goTo(id){
 current=Math.max(0,slides.indexOf(id));
 if(id==="home") renderHome();
 else if(id==="assessment") renderAssessment();
 else renderDay(days.find(d=>d.id===id));
 updateUI();
 window.scrollTo({top:0,behavior:"smooth"});
}
function updateUI(){
 const id=slides[current];
 navLinks.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b.dataset.go===id));
 locationLabel.textContent=id==="home"?"Home":id==="assessment"?"Assessment":days.find(d=>d.id===id).label;
 prevBtn.disabled=current===0; nextBtn.disabled=current===slides.length-1;
 prevBtn.style.opacity=prevBtn.disabled?".45":"1"; nextBtn.style.opacity=nextBtn.disabled?".45":"1";
 const pct=(current/(slides.length-1))*100;
 const bar=document.getElementById("progressBar");
 if(bar) bar.style.width=`${pct}%`;
}
prevBtn.addEventListener("click",()=>{if(current>0)goTo(slides[current-1]);});
nextBtn.addEventListener("click",()=>{if(current<slides.length-1)goTo(slides[current+1]);});
menuBtn.addEventListener("click",()=>{
 const open=navLinks.classList.toggle("open");
 menuBtn.setAttribute("aria-expanded",String(open));
});
fsBtn.addEventListener("click",async()=>{
 try{
  if(!document.fullscreenElement){
   await document.documentElement.requestFullscreen();
   document.body.classList.remove("presentation");
  } else {
   await document.exitFullscreen();
  }
 }catch(e){
  document.body.classList.toggle("presentation");
  toast("Presentation focus mode toggled.");
 }
});
document.addEventListener("fullscreenchange",()=>{
 fsBtn.textContent=document.fullscreenElement?"⛶ EXIT FULL SCREEN":"⛶ FULL SCREEN";
});
function toast(msg){
 let t=document.querySelector(".toast");
 if(!t){t=document.createElement("div");t.className="toast";document.body.appendChild(t);}
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
   if(fb) fb.textContent=correct?"✅ Correct! Great thinking!":"❌ Not quite. Let's review the example and try again.";
  }
 }
 const r=e.target.closest(".reveal-btn");
 if(r){
  const target=document.getElementById(r.dataset.reveal);
  if(target){
   target.classList.toggle("show");
   r.textContent=target.classList.contains("show")?"Hide reasoning":"Reveal reasoning";
  }
 }
});
document.addEventListener("keydown",e=>{
 if(e.key==="ArrowRight" && !["INPUT","TEXTAREA"].includes(document.activeElement.tagName) && current<slides.length-1) goTo(slides[current+1]);
 if(e.key==="ArrowLeft" && !["INPUT","TEXTAREA"].includes(document.activeElement.tagName) && current>0) goTo(slides[current-1]);
});
buildNav();
renderHome();
updateUI();


const screens=["home","lesson","day1","day2","day3","day4","day5","assessment"];
const labels=["Home","Lesson Map","Day 1","Day 2","Day 3","Day 4","Day 5","Assessment"];
let currentIndex=0;
const completed=new Set();

const days={
day1:{
title:"Describe the Sample Space",
subtitle:"From one experiment to a complete list of possible outcomes",
target:"By the end of today, you can identify an experiment, distinguish an outcome from a sample space, and describe a complete sample space for simple experiments.",
date:"Monday • Date: __________",
times:["Motivation • 5 min","I – Learn • 10 min","L – Explore • 10 min","A – Practice-Play • 15 min","W – Check-Master • 10 min"],
intro:"Imagine you are about to play a game. Before you play, you want to know every result that could happen. In mathematics, we organize those possibilities in a sample space. Today we will learn how to make that list complete and accurate.",
learn:`<p><b>Experiment</b> means an action or process that produces an observable result. An <b>outcome</b> is one possible result of the experiment.</p>
<p>The <b>sample space</b> is the set of <em>all possible outcomes</em>. We often write a sample space using braces.</p>
<div class="formula">Sample Space = the set of ALL possible outcomes.</div>
<div class="example"><h4>Example 1 — Toss one coin</h4><p>Experiment: toss one coin once.</p><p>Possible outcomes: Head (H) or Tail (T).</p><p><b>S = {H, T}</b></p><p>There are 2 outcomes in the sample space.</p></div>
<div class="example"><h4>Example 2 — Roll one standard die</h4><p>Experiment: roll a six-sided die once.</p><p>Possible outcomes are 1, 2, 3, 4, 5, and 6.</p><p><b>S = {1, 2, 3, 4, 5, 6}</b></p></div>
<div class="example"><h4>Example 3 — Choose a school-day activity</h4><p>If the choices are reading, drawing, or playing chess:</p><p><b>S = {reading, drawing, chess}</b></p></div>
<div class="warning"><b>Teacher tip:</b> A sample space is not a list of what you <em>expect</em> to happen. It is a list of what <em>can</em> happen.</div>
<div class="teacher-note"><b>Check the list:</b> Ask three questions: (1) Did I include every possible result? (2) Did I include anything impossible? (3) Did I accidentally repeat or combine different outcomes?</div>`,
explore:`<div class="activity"><h3>🔎 Guided Discovery: Complete or Incomplete?</h3><p>A spinner has four sections labeled A, B, C, and D. A student writes <b>{A, B, C}</b>. Is the sample space complete?</p><button class="choice" onclick="mc(this,false,'d1e1')">A. Yes, because three outcomes are enough.</button><button class="choice" onclick="mc(this,true,'d1e1')">B. No, because D is a possible outcome and is missing.</button><button class="choice" onclick="mc(this,false,'d1e1')">C. No, because letters cannot be outcomes.</button><div id="d1e1" class="feedback"></div></div>
<div class="activity"><h3>🤝 Think-Pair-Share</h3><p>Work with a partner. For a traffic light showing one color, describe the sample space if the light can be <b>red, yellow, or green</b>. Then explain why your list is complete.</p><button class="reveal" onclick="toggleAnswer('d1e2')">Reveal a model response</button><div id="d1e2" class="answer">S = {red, yellow, green}. These are all the colors that can appear when the experiment is defined as observing one traffic-light color.</div></div>
<div class="activity"><h3>🧠 Spot the Mistake</h3><p>For a standard die, Carlo writes S = {1,2,3,4,5,6,7}. What is wrong?</p><button class="reveal" onclick="toggleAnswer('d1e3')">Show explanation</button><div id="d1e3" class="answer">7 is not a possible result on a standard six-sided die. The sample space must contain possible outcomes only.</div></div>`,
apply:`<div class="game-grid">
<div class="activity"><h3>🎯 Quick Pick 1</h3><p>Which is the complete sample space for one coin toss?</p><button class="choice" onclick="mc(this,false,'d1a1')">A. {H}</button><button class="choice" onclick="mc(this,false,'d1a1')">B. {T}</button><button class="choice" onclick="mc(this,true,'d1a1')">C. {H,T}</button><button class="choice" onclick="mc(this,false,'d1a1')">D. {1,2}</button><div id="d1a1" class="feedback"></div></div>
<div class="activity"><h3>🎯 Quick Pick 2</h3><p>How many outcomes are in the sample space of one standard die roll?</p><button class="choice" onclick="mc(this,false,'d1a2')">A. 4</button><button class="choice" onclick="mc(this,false,'d1a2')">B. 5</button><button class="choice" onclick="mc(this,true,'d1a2')">C. 6</button><button class="choice" onclick="mc(this,false,'d1a2')">D. 7</button><div id="d1a2" class="feedback"></div></div>
<div class="activity"><h3>🎯 Quick Pick 3</h3><p>If a bag contains only red, blue, and yellow balls, what is the sample space for selecting one ball?</p><button class="choice" onclick="mc(this,true,'d1a3')">A. {red, blue, yellow}</button><button class="choice" onclick="mc(this,false,'d1a3')">B. {3}</button><button class="choice" onclick="mc(this,false,'d1a3')">C. {ball}</button><button class="choice" onclick="mc(this,false,'d1a3')">D. {red}</button><div id="d1a3" class="feedback"></div></div>
<div class="activity"><h3>🎯 Quick Pick 4</h3><p>Which is NOT a possible outcome when rolling a standard die?</p><button class="choice" onclick="mc(this,false,'d1a4')">A. 2</button><button class="choice" onclick="mc(this,false,'d1a4')">B. 5</button><button class="choice" onclick="mc(this,false,'d1a4')">C. 6</button><button class="choice" onclick="mc(this,true,'d1a4')">D. 8</button><div id="d1a4" class="feedback"></div></div></div>`,
think:`<div class="activity"><h3>🏆 Challenge Yourself!</h3><p>A box contains cards labeled <b>Math, Science, Filipino, English</b>. One card is selected. Type a complete sample space using the four labels.</p><div class="input-row"><input id="d1input" placeholder="{Math, Science, Filipino, English}"><button class="small-btn" onclick="textCheck('d1input',['math','science','filipino','english'],'d1fb')">Check</button></div><div id="d1fb" class="feedback"></div></div>
<div class="success-box"><b>Exit Ticket:</b> Complete this sentence: “A sample space is complete when __________.”</div>`,
check:[["Which set is the sample space for a coin toss?",["{H}","{T}","{H,T}","{1,2}"],2],["A standard die has how many possible outcomes?",["4","5","6","8"],2],["An outcome is…",["the entire list","one possible result","the probability","the average"],1],["A complete sample space should…",["include all possible outcomes","include impossible outcomes","omit uncommon outcomes","contain only one result"],0],["Which is not possible on a standard die?",["1","3","6","9"],3]]
},
day2:{
title:"Organize Sample Spaces for Multi-Stage Experiments",
subtitle:"Use tables, tree diagrams, and ordered outcomes",
target:"By the end of today, you can systematically describe the sample space of a two-stage experiment and explain why order matters in an ordered outcome.",
date:"Tuesday • Date: __________",
times:["Warm-Up • 5 min","I – Learn • 11 min","L – Explore • 10 min","A – Practice-Play • 14 min","W – Check-Master • 10 min"],
intro:"Yesterday we described simple sample spaces. But what happens when an experiment has two or more stages? We need a reliable way to organize the outcomes so that we do not miss any possibilities.",
learn:`<p>A <b>multi-stage experiment</b> has two or more steps. We can describe each complete result by recording the outcome of each stage in order.</p>
<div class="formula">Two-stage outcome = (result of Stage 1, result of Stage 2)</div>
<div class="example"><h4>Example 1 — Two coin tosses</h4><p>Stage 1: H or T. Stage 2: H or T.</p><p>Complete sample space:</p><p><b>S = {HH, HT, TH, TT}</b></p><p>Notice that <b>HT</b> and <b>TH</b> are different ordered outcomes because the results happen in different stages.</p></div>
<div class="example"><h4>Example 2 — Shirt and shorts</h4><p>Shirts: blue, white. Shorts: black, gray.</p><p>Outcomes:</p><p><b>(blue, black), (blue, gray), (white, black), (white, gray)</b></p><p>A table or tree diagram makes the organization easier to check.</p></div>
<div class="example"><h4>Example 3 — Coin then die</h4><p>Stage 1 has 2 outcomes and Stage 2 has 6 outcomes. We can represent outcomes as <b>(H,1), (H,2), …, (H,6), (T,1), …, (T,6)</b>.</p></div>`,
explore:`<div class="activity"><h3>🌳 Tree Diagram Thinking</h3><p>A café offers 2 breads: roll and loaf, and 3 fillings: egg, tuna, cheese. Start with each bread and branch to each filling. How many complete sandwich outcomes should appear?</p><button class="reveal" onclick="toggleAnswer('d2e1')">Reveal organized list</button><div id="d2e1" class="answer">(roll, egg), (roll, tuna), (roll, cheese), (loaf, egg), (loaf, tuna), (loaf, cheese). There are 6 outcomes.</div></div>
<div class="activity"><h3>🔍 Missing Outcome Detective</h3><p>Two coins are tossed. A learner lists HH, HT, TH. Which outcome is missing?</p><button class="choice" onclick="mc(this,false,'d2e2')">A. HH</button><button class="choice" onclick="mc(this,false,'d2e2')">B. HT</button><button class="choice" onclick="mc(this,false,'d2e2')">C. TH</button><button class="choice" onclick="mc(this,true,'d2e2')">D. TT</button><div id="d2e2" class="feedback"></div></div>
<div class="activity"><h3>💬 Explain to a Partner</h3><p>Why are (2,5) and (5,2) different when they represent first-roll and second-roll results?</p><button class="reveal" onclick="toggleAnswer('d2e3')">Show a strong explanation</button><div id="d2e3" class="answer">The first number records Stage 1 and the second records Stage 2. In (2,5), the first roll is 2 and the second is 5; in (5,2), the order is reversed.</div></div>`,
apply:`<div class="game-grid">
<div class="activity"><h3>🎮 Count the Outcomes</h3><p>2 shirts and 3 pairs of shorts. How many complete outfits?</p><button class="choice" onclick="mc(this,false,'d2a1')">A. 5</button><button class="choice" onclick="mc(this,true,'d2a1')">B. 6</button><button class="choice" onclick="mc(this,false,'d2a1')">C. 8</button><button class="choice" onclick="mc(this,false,'d2a1')">D. 9</button><div id="d2a1" class="feedback"></div></div>
<div class="activity"><h3>🎮 Ordered or Not?</h3><p>For first die roll then second die roll, is (1,6) the same as (6,1)?</p><button class="choice" onclick="mc(this,true,'d2a2')">A. No. They are different ordered outcomes.</button><button class="choice" onclick="mc(this,false,'d2a2')">B. Yes. Order never matters.</button><button class="choice" onclick="mc(this,false,'d2a2')">C. Only if both dice are fair.</button><button class="choice" onclick="mc(this,false,'d2a2')">D. Neither is possible.</button><div id="d2a2" class="feedback"></div></div>
<div class="activity"><h3>🎮 Three-Choice Outfit</h3><p>There are 3 shirt choices and 2 pants choices. Which is a possible ordered outcome?</p><button class="choice" onclick="mc(this,false,'d2a3')">A. (3,2) only</button><button class="choice" onclick="mc(this,true,'d2a3')">B. (blue, black)</button><button class="choice" onclick="mc(this,false,'d2a3')">C. {blue, black}</button><button class="choice" onclick="mc(this,false,'d2a3')">D. 6 only</button><div id="d2a3" class="feedback"></div></div></div>`,
think:`<div class="activity"><h3>🧩 Build It</h3><p>Imagine a school ID has a first letter chosen from {A,B} and a number chosen from {1,2,3}. Write the six possible codes.</p><button class="reveal" onclick="toggleAnswer('d2t1')">Reveal the six outcomes</button><div id="d2t1" class="answer">A1, A2, A3, B1, B2, B3.</div></div>
<div class="success-box"><b>Exit Ticket:</b> What tool would you choose to organize many two-stage outcomes—table, tree diagram, or list? Explain why.</div>`,
check:[["Two coin tosses have how many outcomes?",["2","3","4","6"],2],["Which is a complete sample space for two coin tosses?",["{HH,HT,TH,TT}","{H,T}","{HH,TT}","{HT,TH}"],0],["A two-stage outcome can be represented by…",["an ordered result","a mean","a range","a single number only"],0],["A table or tree diagram helps us…",["organize outcomes systematically","remove outcomes","change the experiment","calculate a mean"],0],["For two die rolls, (1,6) and (6,1) are…",["always identical","different ordered outcomes","impossible","the same stage"],1]]
},
day3:{
title:"Discover the Fundamental Counting Principle",
subtitle:"Move from listing outcomes to counting them efficiently",
target:"By the end of today, you can use the Fundamental Counting Principle (FCP) to determine the number of possible outcomes in a multi-stage experiment.",
date:"Wednesday • Date: __________",
times:["Motivation • 5 min","I – Learn • 12 min","L – Explore • 10 min","A – Practice-Play • 13 min","W – Check-Master • 10 min"],
intro:"Listing outcomes is useful for small sample spaces. But imagine 5 shirt choices, 4 pants choices, and 3 shoe choices. Listing every outfit would take time. The Fundamental Counting Principle gives us a fast and reliable way to count them.",
learn:`<p>The <b>Fundamental Counting Principle (FCP)</b> tells us how to count complete outcomes in a multi-stage experiment when each choice in one stage can be paired with the choices in the next stage.</p>
<div class="formula">Total number of outcomes = choices in Stage 1 × choices in Stage 2 × choices in Stage 3 × …</div>
<div class="example"><h4>Example 1 — Two stages</h4><p>3 shirts × 2 pants = <b>3 × 2 = 6</b> outfits.</p><p>Each shirt can be paired with each pair of pants.</p></div>
<div class="example"><h4>Example 2 — Three stages</h4><p>2 drinks × 3 sandwiches × 2 desserts</p><p><b>2 × 3 × 2 = 12</b> complete meal choices.</p></div>
<div class="example"><h4>Example 3 — Coin then die</h4><p>2 coin outcomes × 6 die outcomes = <b>12</b> ordered outcomes.</p></div>
<div class="teacher-note"><b>Professional problem-solving routine:</b> First identify the stages. Second count the choices at each stage. Third multiply. Fourth interpret the answer in the context of the problem.</div>
<div class="warning"><b>Common mistake:</b> Do not automatically add the choices. Addition is used for different alternatives in many situations; FCP uses multiplication when choices are made across successive stages.</div>`,
explore:`<div class="activity"><h3>🔎 Why Multiplication?</h3><p>Suppose you have 3 shirts. For <em>each</em> shirt, you can choose 2 pants. How many outfits can one shirt make? How many can all three shirts make?</p><button class="reveal" onclick="toggleAnswer('d3e1')">Reveal the reasoning</button><div id="d3e1" class="answer">Each shirt makes 2 outfits. With 3 shirts: 2 + 2 + 2 = 6, which is the same as 3 × 2 = 6. Multiplication is a shortcut for equal groups of choices.</div></div>
<div class="activity"><h3>🧠 Predict Before Calculating</h3><p>A menu has 4 main dishes and 3 drinks. Will the number of complete meal choices be closer to 7 or 12? Explain your prediction before calculating.</p><button class="reveal" onclick="toggleAnswer('d3e2')">Show reasoning</button><div id="d3e2" class="answer">It is 12 because each of the 4 main dishes can be paired with each of the 3 drinks: 4 × 3 = 12.</div></div>
<div class="activity"><h3>🤝 Explain the Rule</h3><p>Complete: “We multiply because every choice from one stage can be combined with ______.”</p><button class="reveal" onclick="toggleAnswer('d3e3')">Reveal</button><div id="d3e3" class="answer">…every choice from the next stage (when the problem allows every combination).</div></div>`,
apply:`<div class="game-grid">
<div class="activity"><h3>⚡ FCP Challenge 1</h3><p>4 notebook designs and 3 cover colors. One design and one color are chosen. How many choices?</p><button class="choice" onclick="mc(this,false,'d3a1')">A. 7</button><button class="choice" onclick="mc(this,false,'d3a1')">B. 9</button><button class="choice" onclick="mc(this,true,'d3a1')">C. 12</button><button class="choice" onclick="mc(this,false,'d3a1')">D. 16</button><div id="d3a1" class="feedback"></div></div>
<div class="activity"><h3>⚡ FCP Challenge 2</h3><p>2 letters, 5 numbers, and 3 symbols are available for a three-stage code. If one is selected from each stage, how many codes?</p><button class="choice" onclick="mc(this,false,'d3a2')">A. 10</button><button class="choice" onclick="mc(this,true,'d3a2')">B. 30</button><button class="choice" onclick="mc(this,false,'d3a2')">C. 15</button><button class="choice" onclick="mc(this,false,'d3a2')">D. 60</button><div id="d3a2" class="feedback"></div></div>
<div class="activity"><h3>⚡ FCP Challenge 3</h3><p>A café has 3 breads and 4 fillings. How many sandwiches are possible?</p><button class="choice" onclick="mc(this,false,'d3a3')">A. 7</button><button class="choice" onclick="mc(this,true,'d3a3')">B. 12</button><button class="choice" onclick="mc(this,false,'d3a3')">C. 16</button><button class="choice" onclick="mc(this,false,'d3a3')">D. 24</button><div id="d3a3" class="feedback"></div></div>
<div class="activity"><h3>⚡ FCP Challenge 4</h3><p>5 shirt choices and 2 shoe choices. How many shirt-shoe combinations?</p><button class="choice" onclick="mc(this,false,'d3a4')">A. 7</button><button class="choice" onclick="mc(this,false,'d3a4')">B. 8</button><button class="choice" onclick="mc(this,true,'d3a4')">C. 10</button><button class="choice" onclick="mc(this,false,'d3a4')">D. 12</button><div id="d3a4" class="feedback"></div></div></div>`,
think:`<div class="activity"><h3>🏆 Challenge Yourself</h3><p>A student says: “There are 3 shirts and 4 pants, so there are 7 outfits.” Is the student correct? Explain the error and give the correct answer.</p><button class="reveal" onclick="toggleAnswer('d3t1')">Show model reasoning</button><div id="d3t1" class="answer">The student added the choices, but an outfit requires one shirt AND one pair of pants. Every shirt can pair with every pants choice, so 3 × 4 = 12 outfits.</div></div>
<div class="success-box"><b>Exit Ticket:</b> Write your own two-stage FCP example and solve it.</div>`,
check:[["What does FCP do?",["Counts choices across stages by multiplying","Finds averages","Adds all numbers","Finds a probability automatically"],0],["3 shirts and 2 pants give…",["5","6","8","9"],1],["4 main dishes and 3 drinks give…",["7","10","12","14"],2],["For 2 × 5 × 3, the total is…",["10","20","30","60"],2],["The first step in an FCP problem is to…",["multiply immediately","identify the stages","guess the answer","find the mean"],1]]
},
day4:{
title:"Apply FCP to Real-Life Counting Problems",
subtitle:"Translate situations into stages, calculate, and interpret",
target:"By the end of today, you can solve real-life counting problems by identifying stages, applying FCP, and explaining what the result means.",
date:"Thursday • Date: __________",
times:["Motivation • 5 min","I – Learn • 10 min","L – Explore • 10 min","A – Problem-Solving Lab • 15 min","W – Check-Master • 10 min"],
intro:"Mathematics becomes powerful when it helps us make decisions. Today we will use the Fundamental Counting Principle in situations involving meals, outfits, school choices, codes, and activities.",
learn:`<p>When you see a word problem, do not rush to multiply. Read the situation like a mathematician.</p>
<div class="formula">READ → IDENTIFY STAGES → COUNT CHOICES → MULTIPLY → INTERPRET</div>
<div class="steps">
<div class="step"><b>Step 1 — READ:</b> What is being chosen or arranged?</div>
<div class="step"><b>Step 2 — IDENTIFY STAGES:</b> What happens first, second, third, and so on?</div>
<div class="step"><b>Step 3 — COUNT:</b> How many choices are available at each stage?</div>
<div class="step"><b>Step 4 — MULTIPLY:</b> Apply FCP.</div>
<div class="step"><b>Step 5 — INTERPRET:</b> State what the number means in the situation.</div>
</div>
<div class="example"><h4>Example 1 — School lunch</h4><p>A canteen offers 3 main dishes, 2 drinks, and 2 fruits. A learner chooses one from each category.</p><p>Calculation: <b>3 × 2 × 2 = 12</b>.</p><p><b>Interpretation:</b> There are 12 possible complete lunch selections.</p></div>
<div class="example"><h4>Example 2 — School outfit</h4><p>A student can choose 4 shirts, 3 pants, and 2 pairs of shoes.</p><p><b>4 × 3 × 2 = 24</b> possible complete outfits.</p></div>
<div class="warning"><b>Important condition:</b> FCP applies directly when the choices at one stage can be paired with the choices at the other stages. If a condition restricts certain combinations, we must account for that restriction instead of blindly multiplying.</div>`,
explore:`<div class="activity"><h3>🧭 Problem Map</h3><p>A school fair offers 2 game booths and 4 snack choices. A learner chooses one game and one snack. Identify the stages and calculate the number of combinations.</p><button class="reveal" onclick="toggleAnswer('d4e1')">Reveal solution</button><div id="d4e1" class="answer">Stage 1: game = 2 choices. Stage 2: snack = 4 choices. FCP: 2 × 4 = 8 combinations.</div></div>
<div class="activity"><h3>🧠 Add or Multiply?</h3><p>A learner can choose one of 3 buses AND one of 2 meal choices for a trip. Should we add or multiply? Why?</p><button class="reveal" onclick="toggleAnswer('d4e2')">Reveal</button><div id="d4e2" class="answer">Multiply because the learner makes a choice from both stages: bus AND meal. There are 3 × 2 = 6 combinations.</div></div>
<div class="activity"><h3>💬 Interpret the Answer</h3><p>If a calculation gives 18, is “18” a complete mathematical answer? What should you add?</p><button class="reveal" onclick="toggleAnswer('d4e3')">Show a strong answer</button><div id="d4e3" class="answer">Add an interpretation: “There are 18 possible complete choices.” The interpretation tells the reader what the number represents.</div></div>`,
apply:`<div class="game-grid">
<div class="activity"><h3>🧩 Lab 1 — Meal Builder</h3><p>3 sandwiches × 2 drinks × 2 fruits. How many complete meals?</p><button class="choice" onclick="mc(this,false,'d4a1')">A. 7</button><button class="choice" onclick="mc(this,false,'d4a1')">B. 10</button><button class="choice" onclick="mc(this,true,'d4a1')">C. 12</button><button class="choice" onclick="mc(this,false,'d4a1')">D. 14</button><div id="d4a1" class="feedback"></div></div>
<div class="activity"><h3>🧩 Lab 2 — School Code</h3><p>A code has 3 first-letter choices, 4 second-letter choices, and 2 number choices. How many codes?</p><button class="choice" onclick="mc(this,false,'d4a2')">A. 9</button><button class="choice" onclick="mc(this,false,'d4a2')">B. 12</button><button class="choice" onclick="mc(this,true,'d4a2')">C. 24</button><button class="choice" onclick="mc(this,false,'d4a2')">D. 36</button><div id="d4a2" class="feedback"></div></div>
<div class="activity"><h3>🧩 Lab 3 — Activity Choices</h3><p>A club day has 4 activity choices and 3 time slots. One activity and one slot are chosen. How many possibilities?</p><button class="choice" onclick="mc(this,false,'d4a3')">A. 7</button><button class="choice" onclick="mc(this,true,'d4a3')">B. 12</button><button class="choice" onclick="mc(this,false,'d4a3')">C. 16</button><button class="choice" onclick="mc(this,false,'d4a3')">D. 24</button><div id="d4a3" class="feedback"></div></div>
<div class="activity"><h3>🧩 Lab 4 — Explain It</h3><p>A learner calculates 5 × 2 × 3 = 30. Which final sentence is best?</p><button class="choice" onclick="mc(this,false,'d4a4')">A. “30 is the answer.”</button><button class="choice" onclick="mc(this,true,'d4a4')">B. “There are 30 possible complete choices.”</button><button class="choice" onclick="mc(this,false,'d4a4')">C. “30 is a probability.”</button><button class="choice" onclick="mc(this,false,'d4a4')">D. “30 is the first stage.”</button><div id="d4a4" class="feedback"></div></div></div>`,
think:`<div class="activity"><h3>🏆 Challenge Problem</h3><p>A school trip offers 3 buses, 2 lunch options, and 2 souvenir choices. Each bus can be paired with each lunch and souvenir choice. How many complete trip packages are possible? Explain your stages.</p><button class="reveal" onclick="toggleAnswer('d4t1')">Reveal solution</button><div id="d4t1" class="answer">Stages: 3 buses, 2 lunches, 2 souvenirs. FCP: 3 × 2 × 2 = <b>12</b>. Interpretation: There are 12 possible complete trip packages.</div></div>
<div class="success-box"><b>Exit Ticket:</b> In one sentence, explain why “identify the stages” is an important step before multiplying.</div>`,
check:[["What should you do before multiplying?",["Identify the stages","Guess","Find the mean","Write a probability"],0],["3 buses and 2 meals give…",["5","6","8","9"],1],["3 × 2 × 2 equals…",["7","10","12","14"],2],["Why interpret the final number?",["To explain what was counted","To change the answer","To avoid multiplication","To make it longer"],0],["Which routine is strongest?",["Read → stages → count → multiply → interpret","Guess → add → stop","Multiply without reading","List one result only"],0]]
},
day5:{
title:"Integrate Sample Space and FCP",
subtitle:"Connect listing, organizing, counting, and explaining",
target:"By the end of today, you can connect a sample space with the Fundamental Counting Principle, verify a count, solve mixed problems, and explain your reasoning clearly.",
date:"Friday • Date: __________",
times:["Review Warm-Up • 5 min","I – Learn • 10 min","L – Explore • 10 min","A – Mastery Lab • 15 min","W – Think-Check-Master • 10 min"],
intro:"This week we moved from naming possible outcomes to organizing multi-stage outcomes and then counting them efficiently. Today you will connect all of those ideas and prepare to demonstrate mastery.",
learn:`<p>Think of the two main ideas as partners:</p>
<div class="grid-2">
<div class="mini-card"><h3>📋 Sample Space</h3><p>Describes the possible outcomes of an experiment.</p><p>It answers: <b>“What can happen?”</b></p></div>
<div class="mini-card"><h3>✖️ FCP</h3><p>Counts possible outcomes across stages efficiently.</p><p>It answers: <b>“How many can happen?”</b></p></div>
</div>
<div class="example"><h4>Connecting the ideas</h4><p>Suppose there are 2 shirts and 3 pants. A sample space can list all 6 outfits. FCP can count them without listing every outfit:</p><p><b>2 × 3 = 6</b>.</p><p>The count from FCP should agree with the number of complete outcomes in a correctly organized sample space.</p></div>
<div class="example"><h4>Verification strategy</h4><p>If a small problem gives a manageable sample space, list the outcomes and count them. Then apply FCP. If both counts agree, you have a useful check.</p></div>
<div class="warning"><b>Remember:</b> A number alone is not enough in a word problem. Show the stages, calculation, and interpretation.</div>`,
explore:`<div class="activity"><h3>🔗 Connect the Ideas</h3><p>For 2 shirts and 2 pants, how many outcomes should a complete sample space contain?</p><button class="choice" onclick="mc(this,false,'d5e1')">A. 2</button><button class="choice" onclick="mc(this,false,'d5e1')">B. 3</button><button class="choice" onclick="mc(this,true,'d5e1')">C. 4</button><button class="choice" onclick="mc(this,false,'d5e1')">D. 6</button><div id="d5e1" class="feedback"></div></div>
<div class="activity"><h3>🔍 Verify</h3><p>FCP says 3 × 2 = 6. A learner lists 6 complete outcomes. What does that tell you?</p><button class="reveal" onclick="toggleAnswer('d5e2')">Reveal</button><div id="d5e2" class="answer">The list and the FCP count agree, so the sample space is consistent with the counting principle for this situation.</div></div>
<div class="activity"><h3>💬 Explain the Difference</h3><p>Finish: “A sample space describes ______, while FCP helps us ______.”</p><button class="reveal" onclick="toggleAnswer('d5e3')">Show model answer</button><div id="d5e3" class="answer">A sample space describes possible outcomes, while FCP helps us count possible outcomes efficiently across stages.</div></div>`,
apply:`<div class="game-grid">
<div class="activity"><h3>🏁 Mastery 1</h3><p>2 colors × 3 sizes × 2 designs. How many complete choices?</p><button class="choice" onclick="mc(this,false,'d5a1')">A. 7</button><button class="choice" onclick="mc(this,false,'d5a1')">B. 10</button><button class="choice" onclick="mc(this,true,'d5a1')">C. 12</button><button class="choice" onclick="mc(this,false,'d5a1')">D. 14</button><div id="d5a1" class="feedback"></div></div>
<div class="activity"><h3>🏁 Mastery 2</h3><p>Which statement is true?</p><button class="choice" onclick="mc(this,true,'d5a2')">A. FCP can count multi-stage outcomes by multiplying stage choices.</button><button class="choice" onclick="mc(this,false,'d5a2')">B. FCP lists only one outcome.</button><button class="choice" onclick="mc(this,false,'d5a2')">C. A sample space contains impossible results.</button><button class="choice" onclick="mc(this,false,'d5a2')">D. FCP and sample spaces are unrelated.</button><div id="d5a2" class="feedback"></div></div>
<div class="activity"><h3>🏁 Mastery 3</h3><p>Which answer is best for 4 main dishes × 2 drinks?</p><button class="choice" onclick="mc(this,false,'d5a3')">A. 6 choices</button><button class="choice" onclick="mc(this,true,'d5a3')">B. 8 complete meal choices</button><button class="choice" onclick="mc(this,false,'d5a3')">C. 8 probabilities</button><button class="choice" onclick="mc(this,false,'d5a3')">D. 2 stages only</button><div id="d5a3" class="feedback"></div></div>
<div class="activity"><h3>🏁 Mastery 4</h3><p>What is the best first move when solving a new FCP word problem?</p><button class="choice" onclick="mc(this,false,'d5a4')">A. Multiply every number you see.</button><button class="choice" onclick="mc(this,true,'d5a4')">B. Identify the stages and choices.</button><button class="choice" onclick="mc(this,false,'d5a4')">C. Guess the largest number.</button><button class="choice" onclick="mc(this,false,'d5a4')">D. Add all choices.</button><div id="d5a4" class="feedback"></div></div></div>`,
think:`<div class="activity"><h3>🏆 Capstone Challenge</h3><p>A student has 3 shirts, 2 pants, and 2 pairs of shoes. She claims there are 7 possible outfits. You must respond like a math teacher: identify the error, calculate correctly, and interpret the answer.</p><button class="reveal" onclick="toggleAnswer('d5t1')">Reveal model response</button><div id="d5t1" class="answer">The error is adding choices from separate stages. An outfit needs one shirt AND one pants choice AND one shoe choice. Therefore 3 × 2 × 2 = <b>12</b>. There are 12 possible complete outfits.</div></div>
<div class="success-box"><h3>🎓 Before the Assessment</h3><p>Ask yourself: Can I describe a sample space? Can I organize outcomes? Can I identify stages? Can I multiply choices correctly? Can I explain what my answer means?</p></div>`,
check:[["A sample space tells us…",["what can happen","the average","the cost only","the probability only"],0],["FCP tells us…",["how many multi-stage outcomes are possible","which outcome must happen","the mean","the range"],0],["2 × 3 × 2 equals…",["7","10","12","14"],2],["For a small problem, listing outcomes can help us…",["verify an FCP count","change the experiment","avoid reading","find a mean"],0],["The strongest final answer to a word problem includes…",["only a number","calculation and interpretation","a guess","an unrelated example"],1]]
}
};


const elaborations={
 day1:`
 <div class="teacher-note"><b>👨‍🏫 Teacher Talk — Think Aloud</b><p>“Mathematicians do not begin by guessing. We first define the experiment. Then we ask: <em>What are all the results that are possible?</em> If even one possible result is missing, our sample space is incomplete.”</p><p>Emphasize the difference between <b>possible</b> and <b>likely</b>. A sample space records what can happen, not what we predict will happen most often.</p></div>
 <div class="example"><h4>Worked Example — Selecting a Number</h4><p>Suppose a card is selected from cards numbered 2, 4, 6, and 8.</p><p><b>Step 1:</b> Identify the experiment — select one card.</p><p><b>Step 2:</b> List every possible result — 2, 4, 6, 8.</p><p><b>Step 3:</b> Write the sample space — <b>S = {2, 4, 6, 8}</b>.</p><p><b>Step 4:</b> Check completeness — no possible number is missing and no impossible number is included.</p></div>
 <div class="activity"><h3>🧠 Guided Question</h3><p>A bag contains red, blue, green, and yellow marbles. If one marble is selected, why is <b>{red, blue, green}</b> incomplete?</p><button class="reveal" onclick="toggleAnswer('d1extra1')">Reveal reasoning</button><div id="d1extra1" class="answer">Yellow is also a possible outcome, so the list is incomplete. A complete sample space must include red, blue, green, and yellow.</div></div>
 <div class="warning"><b>Common misconception:</b> “The sample space is what probably happens.” No. Probability comes later. First, identify every possible outcome.</div>`,
 day2:`
 <div class="teacher-note"><b>👨‍🏫 Teacher Talk — Organize Before You Count</b><p>“When an experiment has more than one stage, our biggest danger is missing an outcome. A table or tree diagram gives every choice a place. We build branches systematically instead of listing randomly.”</p></div>
 <div class="example"><h4>Worked Example — Spinner Then Coin</h4><p>A spinner has <b>Red (R)</b> and <b>Blue (B)</b>. Then a coin is tossed.</p><p><b>Stage 1:</b> R or B.</p><p><b>Stage 2:</b> H or T.</p><p>Complete ordered outcomes:</p><p><b>(R,H), (R,T), (B,H), (B,T)</b></p><p>There are <b>4</b> complete outcomes. Notice that each Stage 1 choice branches to both Stage 2 choices.</p></div>
 <div class="activity"><h3>🌳 Branch-and-Check</h3><p>Imagine 3 ice-cream flavors {vanilla, chocolate, mango} and 2 cone choices {cup, cone}. How many branches should a complete tree diagram have at the end?</p><button class="reveal" onclick="toggleAnswer('d2extra1')">Reveal</button><div id="d2extra1" class="answer">There should be 3 × 2 = <b>6</b> complete outcomes: vanilla-cup, vanilla-cone, chocolate-cup, chocolate-cone, mango-cup, mango-cone.</div></div>
 <div class="warning"><b>Common misconception:</b> Do not treat an ordered pair as two unrelated numbers. The first entry belongs to Stage 1 and the second belongs to Stage 2.</div>`,
 day3:`
 <div class="teacher-note"><b>👨‍🏫 Teacher Talk — Why Multiplication Works</b><p>“Suppose one shirt has 3 possible pairs of pants. Then that one shirt creates 3 outfits. If there are 4 shirts and each shirt can be paired with all 3 pants, we have 3 + 3 + 3 + 3, or 4 × 3. Multiplication is a compact way to count equal groups of combinations.”</p></div>
 <div class="example"><h4>Worked Example — Three Stages</h4><p>A school ID design uses 2 background colors, 3 badge shapes, and 2 border styles.</p><p><b>Stage 1:</b> 2 choices.</p><p><b>Stage 2:</b> 3 choices.</p><p><b>Stage 3:</b> 2 choices.</p><p>Apply FCP:</p><p><b>2 × 3 × 2 = 12</b></p><p>Therefore, there are <b>12 possible complete ID designs</b>, assuming every choice can be combined with every choice in the next stage.</p></div>
 <div class="activity"><h3>🔎 Multiplication or Addition?</h3><p>A learner says: “There are 5 shirts and 4 pants, so there are 9 outfits.” What question should you ask to help correct the reasoning?</p><button class="reveal" onclick="toggleAnswer('d3extra1')">Reveal teacher response</button><div id="d3extra1" class="answer">Ask: “For each shirt, can you choose any of the 4 pants?” If yes, each shirt has 4 possible pairings, so 5 × 4 = <b>20</b> outfits. The choices occur across stages, so multiplication is appropriate.</div></div>
 <div class="warning"><b>FCP condition:</b> Multiplication applies when the stages are successive choices and the choices can be combined as described. Always read the situation before multiplying.</div>`,
 day4:`
 <div class="teacher-note"><b>👨‍🏫 Teacher Talk — Translate the Situation</b><p>“The hardest part of many counting problems is not the multiplication. It is reading the words and identifying what counts as one complete outcome. Ask: <em>What must I choose or do, one stage after another, to create one complete result?</em>”</p></div>
 <div class="example"><h4>Worked Example — School Fair Ticket</h4><p>A school fair lets a learner choose 2 entry gates, 3 activity booths, and 2 snack options.</p><p><b>Step 1 — Read:</b> One complete choice includes a gate, a booth, and a snack.</p><p><b>Step 2 — Identify stages:</b> 2, 3, and 2 choices.</p><p><b>Step 3 — Multiply:</b> 2 × 3 × 2 = <b>12</b>.</p><p><b>Step 4 — Interpret:</b> There are <b>12 possible complete fair combinations</b>.</p></div>
 <div class="activity"><h3>🛑 Error Analysis</h3><p>A learner calculates 3 + 2 + 4 = 9 for a menu with 3 sandwiches, 2 drinks, and 4 desserts. What does the 9 represent, and why is it not the number of complete meals?</p><button class="reveal" onclick="toggleAnswer('d4extra1')">Reveal analysis</button><div id="d4extra1" class="answer">The 9 is only the total number of individual choices across the categories. A complete meal needs one sandwich AND one drink AND one dessert. Therefore use FCP: 3 × 2 × 4 = <b>24</b> complete meals.</div></div>
 <div class="success-box"><b>Problem-solving sentence frame:</b> “There are ___ stages. The numbers of choices are ___. Using FCP, ___ × ___ × ___ = ___. Therefore, there are ___ possible complete outcomes.”</div>`,
 day5:`
 <div class="teacher-note"><b>👨‍🏫 Teacher Talk — Connect and Verify</b><p>“Today you are not learning a new trick. You are learning to choose the right mathematical representation and defend your answer. A strong mathematician can list a small sample space, count the same situation with FCP, and explain why the two results agree.”</p></div>
 <div class="example"><h4>Worked Example — Verify with Two Methods</h4><p>A student chooses 2 shirt colors and 3 pants colors.</p><p><b>Method 1: List</b> — S1-P1, S1-P2, S1-P3, S2-P1, S2-P2, S2-P3 → <b>6</b> outcomes.</p><p><b>Method 2: FCP</b> — 2 × 3 = <b>6</b>.</p><p>Because both methods give 6, the result is verified for this situation.</p></div>
 <div class="activity"><h3>🎓 Master Teacher Challenge</h3><p>A classmate says, “FCP and sample spaces are different topics, so I only need to learn one.” How would you respond?</p><button class="reveal" onclick="toggleAnswer('d5extra1')">Reveal a strong response</button><div id="d5extra1" class="answer">They work together. A sample space describes the possible outcomes, while FCP provides an efficient way to count complete outcomes in multi-stage situations. For small problems, a list can verify an FCP count.</div></div>
 <div class="card"><h2>📚 What We Learned This Week</h2><div class="summary-grid"><div class="mini-card"><h3>Key Concepts</h3><ul><li>Experiment and outcome</li><li>Complete sample space</li><li>Multi-stage experiment</li><li>Ordered outcomes</li><li>Fundamental Counting Principle</li></ul></div><div class="mini-card"><h3>Key Process</h3><ol><li>Identify the experiment.</li><li>Identify the stages.</li><li>Count choices in each stage.</li><li>Multiply for FCP.</li><li>Interpret the result.</li></ol></div></div><div class="warning"><b>Common mistakes to avoid:</b> omitting an outcome, adding stage choices when multiplication is required, multiplying numbers that are not stages, and giving a number without explaining what it counts.</div><div class="success-box"><h3>Competency Checklist</h3><p>☐ I can describe the sample space of an experiment.</p><p>☐ I can organize outcomes for multi-stage experiments.</p><p>☐ I can identify the choices at each stage.</p><p>☐ I can use the Fundamental Counting Principle.</p><p>☐ I can solve a real-life counting problem.</p><p>☐ I can explain and check my answer.</p></div></div>`
};

function $(id){return document.getElementById(id)}

function buildStatic(){
  $("app").innerHTML=`
  <section id="home" class="screen active">
    <div class="hero">
      <span class="eyebrow">GRADE 8 • TERM 3 • WEEK 8</span>
      <h1>Sample Space & Fundamental Counting Principle</h1>
      <p>Welcome, mathematicians! This week you will learn how to describe all possible outcomes of an experiment and use the Fundamental Counting Principle to count multi-stage outcomes efficiently.</p>
      <div class="hero-grid">
        <div class="mini-card"><h3>📋 KNOW</h3><p>Experiment, outcome, sample space, stages, ordered outcomes, FCP.</p></div>
        <div class="mini-card"><h3>💡 UNDERSTAND</h3><p>A complete sample space describes what can happen; FCP counts choices across stages.</p></div>
        <div class="mini-card"><h3>🧮 DO</h3><p>Describe, organize, count, solve, verify, and explain real-life counting situations.</p></div>
      </div>
    </div>
    <div class="card">
      <span class="eyebrow">CURRICULUM TARGET</span>
      <h2>Grade 8 – Term 3 – Week 8</h2>
      <p><b>Learning Competencies:</b></p>
      <ul>
        <li>Describe the sample space of an experiment.</li>
        <li>Use the Fundamental Counting Principle to determine the number of possible outcomes of an experiment.</li>
      </ul>
      <div class="teacher-note"><b>Professional teacher focus:</b> We will move from concrete examples → organized representations → multiplication as efficient counting → real-life problem solving → mastery and explanation.</div>
    </div>
    <div class="card">
      <span class="eyebrow">5-DAY ROADMAP</span>
      <div class="grid-3">
        ${Object.entries(days).map(([id,d],i)=>`<button class="mini-card" onclick="go('${id}')" style="text-align:left;cursor:pointer"><span class="pill">DAY ${i+1}</span><h3>${d.title}</h3><p>${d.target}</p></button>`).join("")}
      </div>
    </div>
    <div class="card">
      <h2>How We Will Think Like Mathematicians</h2>
      <div class="steps">
        <div class="step"><b>1. Identify the experiment.</b> What action or choice is being made?</div>
        <div class="step"><b>2. Describe outcomes.</b> What results can happen?</div>
        <div class="step"><b>3. Organize.</b> Use lists, tables, or tree diagrams when helpful.</div>
        <div class="step"><b>4. Count efficiently.</b> When stages are involved, apply FCP.</div>
        <div class="step"><b>5. Explain.</b> State what the number means in context.</div>
      </div>
    </div>
  </section>

  <section id="lesson" class="screen">
    <div class="card">
      <span class="eyebrow">LESSON MAP • GRADE 8 – TERM 3 – WEEK 8</span>
      <h1>From “What Can Happen?” to “How Many Can Happen?”</h1>
      <p>This is the central idea of the week. A <b>sample space</b> describes possible outcomes. The <b>Fundamental Counting Principle</b> gives us an efficient way to count possible outcomes when an experiment has stages.</p>
      <div class="grid-2">
        <div class="mini-card"><h3>📋 Sample Space</h3><p>All possible outcomes.</p><p><b>Question:</b> What can happen?</p></div>
        <div class="mini-card"><h3>✖️ FCP</h3><p>Product of choices across stages.</p><p><b>Question:</b> How many can happen?</p></div>
      </div>
    </div>
    <div class="card">
      <h2>Weekly Progression</h2>
      <div class="steps">
        <div class="step"><b>Day 1 — Foundation:</b> identify experiments, outcomes, and complete sample spaces.</div>
        <div class="step"><b>Day 2 — Organization:</b> describe multi-stage sample spaces using ordered outcomes, tables, and tree thinking.</div>
        <div class="step"><b>Day 3 — Discovery:</b> develop the Fundamental Counting Principle and connect multiplication to repeated combinations.</div>
        <div class="step"><b>Day 4 — Application:</b> solve authentic counting problems using the read → stages → count → multiply → interpret routine.</div>
        <div class="step"><b>Day 5 — Integration:</b> connect sample spaces and FCP, verify results, explain reasoning, and prepare for mastery.</div>
      </div>
    </div>
    <div class="card">
      <h2>Important Vocabulary</h2>
      <div class="vocab-grid">
        <div class="mini-card"><b>Experiment</b><p>An action or process that produces an observable result.</p></div>
        <div class="mini-card"><b>Outcome</b><p>One possible result of an experiment.</p></div>
        <div class="mini-card"><b>Sample Space</b><p>The set of all possible outcomes.</p></div>
        <div class="mini-card"><b>Stage</b><p>One step or part of a multi-step experiment.</p></div>
        <div class="mini-card"><b>Ordered Outcome</b><p>A result recorded according to the order of stages.</p></div>
        <div class="mini-card"><b>FCP</b><p>Multiply the number of choices available at each successive stage.</p></div>
      </div>
    </div>
  </section>

  ${Object.keys(days).map(id=>`<section id="${id}" class="screen"></section>`).join("")}

  <section id="assessment" class="screen">
    <div class="assessment-card">
      <span class="eyebrow">GRADE 8 • TERM 3 • WEEK 8</span>
      <h1>Week 8 Mastery Assessment</h1>
      <p><b>Directions:</b> Answer all 25 items. Read each situation carefully. Select the best answer. Your score will measure your understanding of sample spaces and the Fundamental Counting Principle.</p>
      <div class="teacher-note"><b>Assessment strategy:</b> Items move from basic identification to multi-stage counting, interpretation, and reasoning.</div>
      <div id="result" class="result"></div>
      <div id="assessmentItems"></div>
      <div class="actions"><button class="primary" onclick="submitAssessment()">✓ Check Answers</button><button class="secondary" onclick="resetAssessment()">↻ Reset</button></div>
    </div>
  </section>`;
  Object.entries(days).forEach(([id,d])=>renderDay(id,d));
}

function renderDay(id,d){
  const sec=$(id);
  const checkHtml=d.check.map((q,i)=>`
    <div class="activity">
      <h3>Check ${i+1}</h3>
      <p><b>${q[0]}</b></p>
      ${q[1].map((o,j)=>`<button class="choice" onclick="mc(this,${j===q[2]},'${id}c${i}')">${String.fromCharCode(65+j)}. ${o}</button>`).join("")}
      <div id="${id}c${i}" class="feedback"></div>
    </div>`).join("");
  sec.innerHTML=`
    <div class="day-card">
      <div class="day-head">
        <div>
          <span class="eyebrow">GRADE 8 – TERM 3 – WEEK 8 • ${id.toUpperCase()}</span>
          <h1>${d.title}</h1>
          <p><b>${d.subtitle}</b></p>
          <p class="badge">${d.date}</p>
        </div>
        <div class="pill">⏱️ 50 MINUTES</div>
      </div>
      <div class="target"><b>🎯 Daily Learning Target</b><br>${d.target}</div>
      <div class="progress-wrap"><div class="progress-track"><div class="progress-fill" id="${id}-progress"></div></div><small>Complete activities and checks as you learn.</small></div>
      <div class="time-grid">${d.times.map(t=>`<div class="time-chip">${t}</div>`).join("")}</div>

      <div class="card">
        <div class="section-title"><span class="letter">★</span><h2>Motivation / Warm-Up</h2></div>
        <p>${d.intro}</p>
        <div class="activity"><h3>💬 Your Turn!</h3><p>Before we begin, tell a partner or the class: <b>Where might it be useful to know all possible choices or outcomes?</b></p><button class="reveal" onclick="toggleAnswer('${id}-warm')">Reveal sample connections</button><div id="${id}-warm" class="answer">Examples include choosing outfits, building meals, selecting codes, planning activities, or listing results of simple experiments.</div></div>
      </div>

      <div class="card">
        <div class="section-title"><span class="letter">I</span><h2>I – LEARN</h2></div>
        <p><span class="pill">Teacher Explanation</span> ${d.subtitle}</p>
        ${d.learn}
      </div>

      <div class="card">
        <div class="section-title"><span class="letter">L</span><h2>L – EXPLORE</h2></div>
        <p>Do not rush to the answer. Observe the pattern, discuss your reasoning, and then reveal or check the model explanation.</p>
        ${d.explore}
      </div>

      <div class="card">
        <div class="section-title"><span class="letter">A</span><h2>A – APPLY / PRACTICE-PLAY</h2></div>
        <p><b>Your Turn!</b> Solve progressively. Immediate feedback will help you decide whether to continue or review.</p>
        ${d.apply}
      </div>

      <div class="card">
        <div class="section-title"><span class="letter">W</span><h2>W – THINK / CHECK / MASTER</h2></div>
        ${d.think}
        <div class="card elaborated-teacher-section">
          <div class="section-title"><span class="letter">+</span><h2>Professional Teacher Elaboration</h2></div>
          ${elaborations[id] || ""}
        </div>
        <div class="daily-check">
          <h3>📝 End-of-Day Check — 5 Questions</h3>
          <p>Choose an answer for each question. Your goal is not only to be correct but to understand why.</p>
          ${checkHtml}
        </div>
        <button class="primary" onclick="completeDay('${id}')">✓ Mark Day Complete</button>
        <div id="${id}-complete" class="feedback"></div>
      </div>
    </div>`;
}

const assessment=[
["MC","Which set is the complete sample space when one coin is tossed?",["{H}","{T}","{H,T}","{1,2}"],2],
["MC","A standard die is rolled. How many outcomes are in its sample space?",["4","5","6","8"],2],
["ID","What is the name for the set of all possible outcomes of an experiment?",["Sample space","Mean","Range","Frequency"],0],
["TF","A sample space should contain every possible outcome of the experiment.",["True","False"],0],
["MC","A spinner has sections A, B, C, and D. Which is its sample space?",["{A,B}","{A,C,D}","{A,B,C,D}","{1,2,3,4}"],2],
["MC","Two coins are tossed. Which is a complete sample space?",["{HH,HT,TH,TT}","{H,T}","{HH,TT}","{HT,TH}"],0],
["MC","A student chooses 2 shirts and 3 pairs of pants. How many complete outfits are possible?",["5","6","8","9"],1],
["MC","A two-stage experiment has 4 choices in Stage 1 and 2 choices in Stage 2. How many outcomes are possible?",["6","8","10","12"],1],
["MC","Which expression correctly applies FCP to 3 choices followed by 5 choices?",["3+5","3−5","3×5","5÷3"],2],
["TF","The Fundamental Counting Principle multiplies the number of choices at each successive stage.",["True","False"],0],
["MC","A meal has 3 main dishes, 2 drinks, and 4 desserts. How many complete meals are possible?",["9","12","18","24"],3],
["APP","A code uses 2 possible first letters and 6 possible second letters. How many two-letter codes are possible?",["8","10","12","16"],2],
["MC","For two die rolls, (2,5) and (5,2) are best treated as…",["the same ordered outcome","different ordered outcomes","impossible outcomes","one outcome only"],1],
["MC","What should you do FIRST in a multi-stage FCP problem?",["Multiply immediately","Identify the stages","Find the mean","List only one outcome"],1],
["APP","A learner has 4 notebook designs and 3 cover colors. One of each is chosen. How many choices?",["7","10","12","16"],2],
["HOT","Why can a tree diagram help describe a sample space?",["It removes outcomes","It organizes branches of choices systematically","It changes the experiment","It gives the mean"],1],
["SITUATION","A school trip offers 3 buses and 2 meal choices. If every bus can be paired with every meal, how many bus-meal combinations exist?",["5","6","8","9"],1],
["HOT","Ana says 4 shirt choices and 3 pants choices make 7 outfits. Ben says 12. Who is correct?",["Ana, because choices are added","Ben, because every shirt can pair with every pair of pants","Both","Neither"],1],
["APP","A learner chooses 2 colors, 3 sizes, and 2 badge designs. How many complete choices are possible?",["7","10","12","14"],2],
["ID","What principle counts possible outcomes by multiplying choices across stages?",["Fundamental Counting Principle","Pythagorean Theorem","Distributive Property","Mean"],0],
["MC","Which statement best describes the relationship between a sample space and FCP?",["A sample space describes possible outcomes; FCP can count multi-stage outcomes efficiently.","They are unrelated.","FCP removes outcomes from the sample space.","A sample space is only used after probability is calculated."],0],
["APP","A menu offers 3 sandwiches, 2 drinks, and 2 fruit choices. How many complete selections are possible?",["7","10","12","14"],2],
["TF","If a stage has zero possible choices, there are zero complete outcomes.",["True","False"],0],
["HOT","Why should a final FCP answer include an interpretation?",["So the number has context and tells what was counted","To make the answer longer","Because multiplication is not enough","To replace the calculation"],0],
["SYN","Which is the strongest routine for an FCP problem?",["Identify stages → count choices → multiply → interpret","Guess → add → stop","Find one outcome → divide","Multiply without reading the situation"],0]
];

function buildAssessment(){
  $("assessmentItems").innerHTML=assessment.map((q,i)=>{
    return `<div class="question" data-answer="${q[3]}">
      <div class="qnum">${i+1}. <span class="pill">${q[0]}</span> ${q[1]}</div>
      <div class="choices">${q[2].map((o,j)=>`<button type="button" class="choice assess-choice" data-q="${i}" data-a="${j}">${String.fromCharCode(65+j)}. ${o}</button>`).join("")}</div>
      <div id="assfb-${i}" class="feedback"></div>
    </div>`;
  }).join("");
  document.querySelectorAll(".assess-choice").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const q=Number(btn.dataset.q);
      document.querySelectorAll(`.assess-choice[data-q="${q}"]`).forEach(b=>b.classList.remove("selected"));
      btn.classList.add("selected");
      $("assfb-"+q).textContent="Answer selected. You can change it before submitting.";
      $("assfb-"+q).className="feedback";
    });
  });
}

function submitAssessment(){
  let score=0;
  assessment.forEach((q,i)=>{
    const selected=document.querySelector(`.assess-choice[data-q="${i}"].selected`);
    const fb=$("assfb-"+i);
    document.querySelectorAll(`.assess-choice[data-q="${i}"]`).forEach(b=>b.classList.remove("correct","wrong"));
    if(selected && Number(selected.dataset.a)===q[3]){
      score++;
      selected.classList.add("correct");
      fb.className="feedback correct-text";
      fb.textContent="✅ Correct! Great mathematical thinking.";
    }else if(selected){
      selected.classList.add("wrong");
      fb.className="feedback wrong-text";
      fb.textContent=`❌ Not quite. The correct answer is ${String.fromCharCode(65+q[3])}. Review the related lesson and try again.`;
    }else{
      fb.className="feedback wrong-text";
      fb.textContent="⚠️ No answer selected.";
    }
  });
  const pct=Math.round(score/assessment.length*100);
  let msg;
  if(pct>=90) msg="🌟 Outstanding! You demonstrated strong mastery of Week 8.";
  else if(pct>=75) msg="👏 Great job! You demonstrated good understanding. Review any missed items.";
  else if(pct>=60) msg="👍 Good effort! Review sample spaces, stages, and FCP before trying again.";
  else msg="💪 Keep going! Review Days 1–4 carefully, especially identifying stages and multiplying choices.";
  $("result").innerHTML=`<div class="score-big">${score}/${assessment.length} – ${pct}%</div><p>${msg}</p><p><b>Correct:</b> ${score} &nbsp; <b>Incorrect:</b> ${assessment.length-score}</p>`;
  $("result").classList.add("show");
  window.scrollTo({top:0,behavior:"smooth"});
}
function resetAssessment(){
  document.querySelectorAll(".assess-choice").forEach(b=>b.classList.remove("selected","correct","wrong"));
  document.querySelectorAll('[id^="assfb-"]').forEach(f=>{f.textContent="";f.className="feedback"});
  $("result").classList.remove("show");$("result").innerHTML="";
}

function mc(btn,isCorrect,feedbackId){
  const parent=btn.parentElement;
  parent.querySelectorAll(".choice").forEach(b=>b.classList.remove("correct","wrong","selected"));
  btn.classList.add(isCorrect?"correct":"wrong");
  const fb=$(feedbackId);
  if(isCorrect){
    fb.className="feedback correct-text";
    fb.textContent="✅ Correct! Great thinking — explain why your choice works.";
  }else{
    fb.className="feedback wrong-text";
    fb.textContent="❌ Not quite. Review the example above, then try the question again.";
  }
}
function toggleAnswer(id){
  const el=$(id);
  if(el) el.classList.toggle("show");
}
function normalize(s){
  return s.toLowerCase().replace(/[{}\[\]()]/g," ").replace(/[.,]/g," ").replace(/\s+/g," ").trim();
}
function textCheck(inputId,expected,feedbackId){
  const value=normalize($(inputId).value);
  const ok=expected.every(word=>value.includes(word));
  const fb=$(feedbackId);
  fb.className=ok?"feedback correct-text":"feedback wrong-text";
  fb.textContent=ok?"✅ Correct! Your sample space includes all required outcomes.":"❌ Not quite. Check that every possible label is included.";
}
function completeDay(id){
  completed.add(id);
  const p=$(id+"-progress");
  if(p) p.style.width="100%";
  const fb=$(id+"-complete");
  fb.className="feedback correct-text";
  fb.textContent="✅ Day completed! You are ready to move to the next lesson.";
}
function go(id){
  const idx=screens.indexOf(id);
  if(idx<0) return;
  currentIndex=idx;
  screens.forEach(s=>$(s).classList.toggle("active",s===id));
  document.querySelectorAll(".nav-btn").forEach((b,i)=>b.classList.toggle("active",i===idx));
  $("locationLabel").textContent=labels[idx];
  $("prevBtn").disabled=idx===0;
  $("nextBtn").disabled=idx===screens.length-1;
  $("navLinks").classList.remove("open");
  $("menuBtn").setAttribute("aria-expanded","false");
  window.scrollTo({top:0,behavior:"smooth"});
}
function navBuild(){
  $("navLinks").innerHTML=screens.map((s,i)=>`<button class="nav-btn ${i===0?"active":""}" onclick="go('${s}')">${labels[i]}</button>`).join("");
}
$("prevBtn").addEventListener("click",()=>go(screens[Math.max(0,currentIndex-1)]));
$("nextBtn").addEventListener("click",()=>go(screens[Math.min(screens.length-1,currentIndex+1)]));
$("menuBtn").addEventListener("click",()=>{
  const open=$("navLinks").classList.toggle("open");
  $("menuBtn").setAttribute("aria-expanded",String(open));
});
function fullscreen(){
  if(!document.fullscreenElement){
    if(document.documentElement.requestFullscreen){
      document.documentElement.requestFullscreen().catch(()=>document.body.classList.add("presentation"));
    }else document.body.classList.add("presentation");
  }else if(document.exitFullscreen) document.exitFullscreen();
}
$("fsBtn").addEventListener("click",fullscreen);
document.addEventListener("fullscreenchange",()=>{
  $("fsBtn").textContent=document.fullscreenElement?"⛶ EXIT FULL SCREEN":"⛶ FULL SCREEN";
});
buildStatic();
buildAssessment();
navBuild();
go("home");

(() => {
"use strict";

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();

  // Mobile navigation
  $("#menuBtn").addEventListener("click", () => $("#navLinks").classList.toggle("open"));
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => $("#navLinks").classList.remove("open")));

  // Working fullscreen button with browser fallback handling.
  $("#fullscreenBtn").addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        document.body.classList.add("fullscreen-mode");
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      document.body.classList.toggle("fullscreen-mode");
      alert("Browser full-screen permission was unavailable, so Focus View was enabled instead.");
    }
  });
  document.addEventListener("fullscreenchange", () => {
    const active = !!document.fullscreenElement;
    document.body.classList.toggle("fullscreen-mode", active);
    $("#fullscreenBtn").innerHTML = active ? "⛶ <span>Exit Full Screen</span>" : "⛶ <span>Full Screen</span>";
  });

  // Reading progress
  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    $("#progressBar").style.width = max > 0 ? `${(scrollY / max) * 100}%` : "0%";
  });

  const dayData = {
    1:{ilaw:"I",title:"The Data Detective",subtitle:"Introduce • What is statistical data?",learn:`Data are facts, numbers, measurements, or observations collected about people, objects, events, or situations. Statistical data help us answer questions using evidence instead of guesses. A data set is a collection of related observations. For example, if 8 learners record the number of books they read this month, the answers 2, 4, 1, 3, 2, 5, 3, 2 form a data set.`,bullets:["Identify the statistical question before collecting data.","Distinguish a population, a sample, a variable, and an observation.","Recognize raw data as information that has not yet been organized.","Understand that data can be numerical or categorical."],example:`<strong>Example:</strong> Question: “How do Grade 7 learners travel to school?” Possible answers: walking, jeepney, tricycle, motorcycle. These are <strong>categorical data</strong>. Question: “How many minutes does each learner travel?” gives <strong>numerical data</strong>.`,steps:["Ask a question that can have different answers.","Collect observations fairly and consistently.","Record the raw responses without changing them.","Organize the data so patterns become easier to see."],exercises:[{q:"Which is a data set?",opts:["The word mathematics","12, 15, 12, 18, 20","A blank notebook","A classroom rule"],a:1,exp:"A data set is a collection of related observations."},{q:"Which is categorical data?",opts:["Height in centimeters","Number of siblings","Favorite school club","Test score"],a:2,exp:"Favorite school club uses names or categories rather than numerical measurements."},{q:"Why do we organize data?",opts:["To make it disappear","To make patterns and comparisons easier to see","To change the answers","To avoid counting"],a:1,exp:"Organization makes the information easier to summarize, represent, and interpret."}],activity:"Data Detective Mission: Ask yourself, “What question could these answers help me answer?” Data: 25, 30, 20, 45, 25, 35. Write one possible question and identify whether the data are numerical or categorical.",teacher:"Think like a detective: before making a graph, first identify the question and the kind of data you have."},
    2:{ilaw:"L",title:"Frequency: How Often?",subtitle:"Learn • Counting occurrences accurately",learn:`Frequency tells how many times a value or category occurs. If the number 4 appears five times in a data set, its frequency is 5. A frequency distribution table places each value or category beside its frequency. The total of all frequencies must equal the total number of observations.`,bullets:["Frequency means ‘how many times.’","Tally marks help prevent counting mistakes.","Each observation should be counted exactly once.","The sum of frequencies must equal the number of observations."],example:`<strong>Example:</strong> Data: 2, 4, 3, 2, 5, 4, 2, 3, 4, 2. Value 2 occurs <strong>4 times</strong>, value 3 occurs 2 times, value 4 occurs 3 times, and value 5 occurs 1 time. Check: 4 + 2 + 3 + 1 = <strong>10 observations</strong>.`,steps:["Choose a value or category.","Count each occurrence using tally marks.","Write the frequency.","Repeat for every value/category.","Add all frequencies and compare with the original data count."],exercises:[{q:"What is the frequency of 3 in 3, 5, 3, 2, 3, 4, 5?",opts:["1","2","3","4"],a:2,exp:"The number 3 appears three times."},{q:"Data: A, B, A, C, B, A. What is the frequency of B?",opts:["1","2","3","4"],a:1,exp:"B appears twice."},{q:"Frequencies are 5, 4, 6, and 3. How many observations are there?",opts:["15","16","18","20"],a:2,exp:"5 + 4 + 6 + 3 = 18."}],activity:"Tally Challenge: Data = 2, 4, 3, 2, 5, 4, 2, 3, 4, 2. Before looking at the answer, make tally marks for each value and compute all frequencies.",teacher:"Always perform a frequency check. If the frequency total does not equal the number of raw observations, recount."},
    3:{ilaw:"L",title:"Building a Frequency Distribution Table",subtitle:"Learn • From raw data to an organized table",learn:`A frequency distribution table transforms a messy list into an organized summary. For simple numerical data, list the distinct values in logical order and count each one. For a larger range, grouped intervals such as 10–19, 20–29, and 30–39 may be useful. A good table has a clear title and labeled columns.`,bullets:["List every value or category that appears.","Put numerical values in ascending order when appropriate.","Use tally marks before writing final frequencies.","Include a total frequency row.","For grouped intervals, make sure every observation belongs to one interval."],example:`<strong>Worked Example:</strong> Scores = 6, 8, 7, 6, 9, 8, 6, 10, 7, 8. Distinct scores are 6, 7, 8, 9, 10. Frequencies are 3, 2, 3, 1, 1. Total = 10.`,steps:["Write the raw data.","Sort or identify distinct values.","Create Value/Category and Frequency columns.","Count using tallies.","Add frequencies to verify the total."],exercises:[{q:"For 4, 5, 4, 6, 5, 4, 7, what is the frequency of 4?",opts:["1","2","3","4"],a:2,exp:"4 appears three times."},{q:"Which values should appear in the table for 2, 4, 2, 5, 4, 2?",opts:["2, 4, 5","2, 2, 4, 4, 5","1, 2, 3, 4, 5","Only 2"],a:0,exp:"The distinct values are 2, 4, and 5."},{q:"A table has frequencies 2, 3, 4, 1. How many raw observations should there be?",opts:["8","9","10","11"],a:2,exp:"2 + 3 + 4 + 1 = 10."}],activity:"Table Builder Practice: Create a frequency table for 5, 6, 5, 8, 7, 6, 5, 9, 8, 6, 7, 5. Then identify the mode and total number of observations.",teacher:"A frequency table should be both accurate and readable. Sort numerical values so a reader can see the distribution quickly."},
    4:{ilaw:"A",title:"Data Organization Challenge",subtitle:"Apply • Detect errors and improve a table",learn:`Applying your knowledge means checking whether an organized table really matches the raw data. A reliable analyst checks the categories, recounts frequencies, verifies the total, and looks for missing or duplicated observations. Accuracy matters because every later graph depends on the table.`,bullets:["Compare the table categories with the original data.","Recount at least one frequency independently.","Check the total frequency.","Look for missing categories, duplicate counting, or impossible values.","Explain how you know a table is correct."],example:`<strong>Error Check:</strong> A student records frequencies 2, 5, 1, 4. The total is 12. If the raw data contain 12 observations, the total passes the first check. But the analyst must still verify each individual frequency.`,steps:["Read the raw data carefully.","Read the proposed frequency table.","Recount each category.","Compare totals.","Correct the table and explain the correction."],exercises:[{q:"A table totals 14, but the raw data contain 16 observations. What is most likely needed?",opts:["Ignore the difference","Recount and find missing observations","Delete two raw values","Change the title"],a:1,exp:"The total frequencies must match the number of observations."},{q:"A value appears 5 times, but the table says frequency 4. What should you do?",opts:["Keep 4","Change the raw data","Correct the frequency to 5","Remove the value"],a:2,exp:"The frequency must match the actual number of occurrences."},{q:"Why is checking the total useful?",opts:["It proves every frequency is correct by itself","It can reveal missing or extra counts","It changes the mode","It makes a graph colorful"],a:1,exp:"A mismatch in totals is a warning that the data may have been counted incorrectly."}],activity:"Fix the Table: Raw data = 1, 2, 2, 3, 3, 3, 4, 4, 5, 5. A student wrote frequencies 1→1, 2→2, 3→2, 4→2, 5→2. Find the error, correct it, and state the new total.",teacher:"Do not trust a table just because it looks neat. Good analysts verify the numbers."},
    5:{ilaw:"W",title:"Week 1 Wrap-Up: Organize Like an Analyst",subtitle:"Wrap-Up • Consolidate frequency skills",learn:`This day connects the week’s learning. You should now be able to explain what data are, identify numerical and categorical data, count frequencies, create a frequency distribution table, and check whether the table is accurate.`,bullets:["I can identify a statistical question.","I can distinguish numerical and categorical data.","I can calculate frequency using careful counting.","I can create and verify a frequency distribution table.","I can identify the mode from organized data."],example:`<strong>Mini Worked Example:</strong> Favorite fruits: Mango, Apple, Mango, Banana, Apple, Mango, Orange. Frequencies: Mango = 3, Apple = 2, Banana = 1, Orange = 1. Total = 7. Mode = Mango.`,steps:["Review the data question.","Organize the observations.","Count frequencies.","Check the total.","State one conclusion supported by the table."],exercises:[{q:"Data: 3, 5, 3, 4, 5, 5, 2, 3, 4, 3. What is the frequency of 3?",opts:["2","3","4","5"],a:2,exp:"3 appears four times."},{q:"What is the mode of the same data?",opts:["2","3","4","5"],a:1,exp:"3 occurs four times, more than any other value."},{q:"What is the total frequency?",opts:["8","9","10","11"],a:2,exp:"There are 10 observations."}],activity:"Exit Task: Build the complete frequency table for 3, 5, 3, 4, 5, 5, 2, 3, 4, 3. Then write one sentence describing the most common value.",teacher:"Next week, your organized table becomes a visual story through graphs."},
    6:{ilaw:"I",title:"Which Graph Tells the Story?",subtitle:"Introduce • Match a graph to a purpose",learn:`A graph is a visual way of communicating data. The correct graph depends on the question and the kind of data. Bar graphs compare categories. Line graphs emphasize change or trends, especially across time. Pie graphs show how categories make up one whole. Stem-and-leaf plots display numerical data while keeping individual values visible.`,bullets:["Bar graph → compare separate categories.","Line graph → show change or trend across an ordered scale.","Pie graph → show parts of one whole.","Stem-and-leaf plot → display numerical distribution while preserving data values."],example:`<strong>Graph Match:</strong> Favorite sports → bar graph. Temperature from Monday to Friday → line graph. How a family budget is divided into percentages → pie graph. Quiz scores such as 62, 65, 67, 71, 71, 74 → stem-and-leaf plot.`,steps:["Identify what the variable represents.","Ask whether you need comparison, trend, proportion, or distribution.","Choose the graph that communicates that purpose best.","Check whether the graph can show the data accurately."],exercises:[{q:"Best graph for monthly rainfall from January to June?",opts:["Line graph","Pie graph","Stem-and-leaf only","Bar graph only"],a:0,exp:"A line graph is useful for showing change over time."},{q:"Best graph for favorite school clubs?",opts:["Line graph","Bar graph","Stem-and-leaf","Number line"],a:1,exp:"A bar graph compares separate categories well."},{q:"Best graph for percentage shares of one budget?",opts:["Pie graph","Line graph","Stem-and-leaf","Scatter plot"],a:0,exp:"A pie graph shows parts of one whole."}],activity:"Graph Match Challenge: Match these situations to a graph: favorite subject, daily temperature, class budget percentages, and a list of test scores. Explain why you chose each.",teacher:"A graph is a communication tool. Choose it because of what you need to communicate, not because it looks attractive."},
    7:{ilaw:"L",title:"Four Ways to Represent Data",subtitle:"Learn • Bar, line, pie, and stem-and-leaf plots",learn:`Each representation has a special strength. A bar graph uses separate bars and is excellent for category comparisons. A line graph plots points and connects them to emphasize movement or trends. A pie graph divides a circle into sectors; the sectors represent portions of a total, so the frequencies or percentages must form one whole. A stem-and-leaf plot separates each value into a stem and leaf, such as 72 becoming stem 7 and leaf 2.`,bullets:["Bar graphs need categories, a scale, and clear bars.","Line graphs need an ordered horizontal variable and plotted values.","Pie graphs require a meaningful whole and sectors proportional to the data.","Stem-and-leaf plots need a key so readers know what a stem and leaf mean."],example:`<strong>Stem-and-Leaf Example:</strong> Data = 21, 23, 24, 25, 31, 34. Plot: 2 | 1 3 4 5 and 3 | 1 4. Key: 2|1 = 21. The original values can be reconstructed from the plot.`,steps:["Give the representation a title.","Label axes or categories when needed.","Use an appropriate and consistent scale.","For pie graphs, make sure all parts represent the whole.","For stem-and-leaf plots, arrange leaves in order and include a key."],exercises:[{q:"What does a stem-and-leaf plot preserve?",opts:["Only percentages","Individual numerical values","Only categories","Only totals"],a:1,exp:"The original numerical values remain visible."},{q:"In 4 | 7, what value does it represent if the key is 4|7 = 47?",opts:["11","40","47","74"],a:2,exp:"The key tells us that stem 4 and leaf 7 represent 47."},{q:"What must all parts of a pie graph represent together?",opts:["One whole","Two unrelated totals","Only the largest value","A time trend"],a:0,exp:"Pie sectors represent parts of one whole."}],activity:"Representation Lab: For each data situation, name the most appropriate graph and list the parts the graph must include (title, labels, scale, key, or sectors).",teacher:"A graph without labels or a key can be technically drawn but still be difficult to understand."},
    8:{ilaw:"A",title:"Build & Read Graphs",subtitle:"Apply • Turn organized data into visual information",learn:`To build a graph, begin with a reliable frequency table. Select the representation that matches the purpose, then construct it accurately. To read a graph, use its title, labels, scale, and exact values. Compare categories by subtracting their values when a question asks “how many more” or “how many fewer.”`,bullets:["Start with an organized table.","Choose the appropriate representation.","Add a title and labels.","Use a consistent scale.","Check that every graph value matches the table."],example:`<strong>Worked Reading Example:</strong> A class survey gives Mathematics 12, Science 17, English 9, AP 14, Arts 7. Highest = Science (17). Lowest = Arts (7). Difference = 17 − 7 = <strong>10 students</strong>.`,steps:["Read the table before drawing.","Choose the graph.","Transfer every value accurately.","Read the graph and compare values.","Explain what the differences mean in context."],exercises:[{q:"Using 12, 17, 9, 14, 7, what is the highest value?",opts:["7","9","14","17"],a:3,exp:"Science has 17, the largest value."},{q:"How many more is 17 than 7?",opts:["8","9","10","12"],a:2,exp:"17 − 7 = 10."},{q:"If a bar is twice as high as another bar, what must you check before concluding the value is twice as large?",opts:["The color","The graph scale","The title length","The font"],a:1,exp:"The scale determines how bar heights correspond to numerical values."}],activity:"Graph Reader: Mathematics = 12, Science = 17, English = 9, AP = 14, Arts = 7. Find the highest, lowest, difference between highest and lowest, and total students represented.",teacher:"Read the scale first. A visual comparison is only reliable when the scale is clear and consistent."},
    9:{ilaw:"A",title:"Interpret Like a Data Analyst",subtitle:"Apply • Make evidence-based statements",learn:`Interpreting data means explaining what the numbers and visual patterns tell us. A strong interpretation can identify the highest or lowest category, compare two values, describe a trend, identify a common value, and make a conclusion supported by evidence. Avoid opinions or predictions that the graph cannot prove.`,bullets:["State what you observe.","Use exact values when possible.","Compare values using differences or ratios when appropriate.","Describe trends carefully.","Make conclusions that are supported by the displayed data."],example:`<strong>Strong interpretation:</strong> “Science was selected by 17 students, while Arts was selected by 7. Therefore, Science had 10 more selections than Arts.” <strong>Weak interpretation:</strong> “Science is the best subject.” The second statement is an opinion and is not proven by the graph.`,steps:["Read the title and labels.","Identify the important pattern.","Find the exact values involved.","Make a comparison or conclusion.","Support your statement with evidence from the graph."],exercises:[{q:"Which is evidence-based?",opts:["Science is the best subject.","Everyone loves Science.","Science has 17 selections, the highest in the survey.","Science will always be highest."],a:2,exp:"This statement reports a fact directly supported by the data."},{q:"If a line graph rises from 20 to 35, what happened?",opts:["It decreased by 15","It increased by 15","It stayed the same","It became zero"],a:1,exp:"35 − 20 = 15, so the quantity increased by 15."},{q:"Why should interpretations avoid unsupported predictions?",opts:["Graphs are only for decoration","The data may not provide enough evidence for a prediction","Predictions are always wrong","Numbers cannot be compared"],a:1,exp:"A graph supports only conclusions justified by the data shown."}],activity:"Analyst Report: Use the class-subject data from Day 8. Write three sentences: (1) highest/lowest, (2) a numerical comparison, and (3) one conclusion supported by the data.",teacher:"Strong analysts do not simply say what they think. They point to evidence and explain what it means."},
    10:{ilaw:"W",title:"Two-Week Data Analyst Mission",subtitle:"Wrap-Up • Organize, represent, and interpret",learn:`Today you connect the entire data cycle: question → raw data → frequency distribution → appropriate graph → interpretation → conclusion. Your goal is to demonstrate not only that you can calculate, but also that you can communicate what the data mean.`,bullets:["Organize data accurately in a frequency table.","Select an appropriate graph for a purpose.","Read titles, labels, scales, and keys correctly.","Compare and describe patterns using evidence.","Communicate a clear conclusion."],example:`<strong>Complete Example:</strong> Data = 2, 3, 2, 4, 3, 2, 5, 4, 3, 2. Frequencies: 2→4, 3→3, 4→2, 5→1. For comparing these categories, a bar graph is appropriate. The interpretation: 2 is the most common value, occurring 4 times.`,steps:["Organize the raw data.","Verify the frequency total.","Choose the best graph.","Represent the data accurately.","Interpret the pattern and write a conclusion."],exercises:[{q:"What is the first step in the complete data cycle?",opts:["Interpret the graph","Ask a clear question or identify the purpose","Draw a pie graph","Calculate a percentage"],a:1,exp:"A clear question or purpose guides what data should be collected and how they should be represented."},{q:"Which graph is best for comparing frequencies of separate categories?",opts:["Bar graph","Line graph","Pie graph only","Stem-and-leaf only"],a:0,exp:"Bar graphs are designed for category comparisons."},{q:"What makes a conclusion strong?",opts:["It sounds confident","It is supported by evidence from the data","It is very long","It uses many colors"],a:1,exp:"A statistical conclusion should be grounded in the data."}],activity:"Final Mission: Complete the mastery test, then create a mini data story from any small data set: organize it, choose a graph, and write two evidence-based conclusions.",teacher:"If you miss an item, revisit the related day. Mastery comes from checking your reasoning and improving it."}
  };

  const progress = JSON.parse(localStorage.getItem("grade7DataProgress") || "{}");

  function renderDay(day, containerId) {
    const d = dayData[day];
    const container = $(containerId);
    const exerciseHTML = d.exercises.map((ex,i)=>`
      <div class="exercise-card" data-exercise="${i}">
        <div class="exercise-title">Practice ${i+1}</div>
        <p><strong>${ex.q}</strong></p>
        <div class="exercise-options">${ex.opts.map((o,j)=>`<button type="button" data-answer="${j}">${String.fromCharCode(65+j)}. ${o}</button>`).join("")}</div>
        <p class="exercise-feedback" aria-live="polite"></p>
      </div>`).join("");
    container.innerHTML = `
      <article class="lesson-card">
        <div class="lesson-top">
          <div class="ilaw-letter">${d.ilaw}</div>
          <div><h3>Day ${day}: ${d.title}</h3><p>${d.subtitle}</p></div>
        </div>
        <div class="lesson-layout">
          <div class="lesson-content">
            <h4>📘 Teacher Explanation</h4>
            <p>${d.learn}</p>
            <ul>${d.bullets.map(x=>`<li>${x}</li>`).join("")}</ul>
            <div class="example-box"><h4>💡 Worked Example</h4><p>${d.example}</p></div>
            <div class="steps-box"><h4>🪜 Step-by-Step Method</h4><ol>${d.steps.map(x=>`<li>${x}</li>`).join("")}</ol></div>
            <div class="teacher-note"><strong>Teacher Ed Tip:</strong> ${d.teacher}</div>
          </div>
          <aside class="activity-box">
            <h4>🎯 Student Activity</h4>
            <p>${d.activity}</p>
            <div class="student-work"><label for="work-${day}">My answer / explanation:</label><textarea id="work-${day}" placeholder="Type your solution or explanation here..."></textarea></div>
          </aside>
        </div>
        <div class="practice-section">
          <div class="practice-heading"><span>🧠</span><div><h4>Practice & Check</h4><p>Answer each item. Immediate feedback explains why.</p></div></div>
          ${exerciseHTML}
        </div>
        <div class="lesson-check"><button class="complete-btn ${progress[day] ? "done":""}" data-complete="${day}" type="button">${progress[day] ? "✓ Day Completed" : "Mark Day Complete"}</button></div>
      </article>`;

    $$(".complete-btn", container).forEach(btn => btn.addEventListener("click", () => {
      const n = btn.dataset.complete; progress[n] = !progress[n];
      localStorage.setItem("grade7DataProgress", JSON.stringify(progress));
      btn.classList.toggle("done", progress[n]);
      btn.textContent = progress[n] ? "✓ Day Completed" : "Mark Day Complete";
      updateWeekProgress();
    }));

    $$(".exercise-card", container).forEach((card,i)=>{
      $$("button",card).forEach(btn=>btn.addEventListener("click",()=>{
        const selected=Number(btn.dataset.answer), ex=d.exercises[i], fb=$(".exercise-feedback",card);
        $$("button",card).forEach(b=>b.classList.remove("selected","correct-choice","wrong-choice"));
        btn.classList.add("selected");
        if(selected===ex.a){
          btn.classList.add("correct-choice");
          fb.textContent="✓ Correct! "+ex.exp;
          fb.className="exercise-feedback correct";
        }else{
          btn.classList.add("wrong-choice");
          fb.textContent="✗ Not quite. Try again. Hint: "+ex.exp;
          fb.className="exercise-feedback wrong";
        }
      }));
    });
  }

  let active1 = 1, active2 = 6;
  function showWeek(week, day) {
    if (week === 1) { active1 = day; renderDay(day, "#week1Lessons"); $$("#week1 .day-tab").forEach(b=>b.classList.toggle("active", Number(b.dataset.day)===day)); }
    else { active2 = day; renderDay(day, "#week2Lessons"); $$("#week2 .day-tab").forEach(b=>b.classList.toggle("active", Number(b.dataset.day)===day)); }
  }
  $$("#week1 .day-tab").forEach(b=>b.addEventListener("click",()=>showWeek(1,Number(b.dataset.day))));
  $$("#week2 .day-tab").forEach(b=>b.addEventListener("click",()=>showWeek(2,Number(b.dataset.day))));
  showWeek(1,1); showWeek(2,6);

  function updateWeekProgress(){
    const a=[1,2,3,4,5].filter(d=>progress[d]).length, b=[6,7,8,9,10].filter(d=>progress[d]).length;
    $("#week1Progress").textContent=`${a} / 5 days`; $("#week2Progress").textContent=`${b} / 5 days`;
    $("#week1Bar").style.width=`${a*20}%`; $("#week2Bar").style.width=`${b*20}%`;
  }
  updateWeekProgress();

  // Frequency table builder
  $("#buildFrequency").addEventListener("click", () => {
    const nums = $("#rawData").value.split(",").map(x=>Number(x.trim())).filter(x=>Number.isFinite(x));
    const out = $("#frequencyOutput");
    if (!nums.length){ out.innerHTML='<p class="feedback wrong">Enter comma-separated numbers first.</p>'; return; }
    const counts = new Map();
    nums.forEach(n=>counts.set(n,(counts.get(n)||0)+1));
    const rows=[...counts.entries()].sort((a,b)=>a[0]-b[0]);
    out.innerHTML=`<table><thead><tr><th>Value</th><th>Frequency</th></tr></thead><tbody>${rows.map(([v,f])=>`<tr><td>${v}</td><td>${f}</td></tr>`).join("")}</tbody><tfoot><tr><th>Total</th><th>${nums.length}</th></tr></tfoot></table>`;
  });

  // Graph choice
  $$("#graphChoice button").forEach(btn=>btn.addEventListener("click",()=>{
    const correct=btn.dataset.answer==="bar"; const fb=$("#graphFeedback");
    fb.textContent=correct?"✓ Correct! A bar graph is excellent for comparing category frequencies.":"Try again. Think about a graph that compares separate categories.";
    fb.className=`feedback ${correct?"correct":"wrong"}`;
  }));

  // Bar reader
  $$("#miniBars button").forEach(btn=>btn.addEventListener("click",()=>{
    $$("#miniBars button").forEach(b=>b.classList.remove("selected")); btn.classList.add("selected");
    $("#barReadout").textContent=`${btn.querySelector("span").textContent}: ${btn.dataset.value} students.`;
  }));

  // Stem mode
  $("#stemQuestion").addEventListener("click",()=>{
    $("#stemFeedback").textContent="✓ The mode is 23 because 23 appears twice; all other values appear once.";
    $("#stemFeedback").className="feedback correct";
  });

  // Quick challenge
  $("#quickChallenge").addEventListener("click",()=>$("#challengeModal").classList.remove("hidden"));
  $("#closeModal").addEventListener("click",()=>$("#challengeModal").classList.add("hidden"));
  $("#challengeModal").addEventListener("click",e=>{if(e.target.id==="challengeModal")e.currentTarget.classList.add("hidden")});
  $$("#challengeModal [data-quick]").forEach(btn=>btn.addEventListener("click",()=>{
    const ok=btn.dataset.quick==="3"; $("#quickFeedback").textContent=ok?"✓ Correct! 8 appears three times.":"✗ Count the number 8 carefully.";
    $("#quickFeedback").className=`feedback ${ok?"correct":"wrong"}`;
  }));

  // Final quiz
  const questions=[
    ["What does frequency mean?","How often a value or category occurs.",["The largest value","How often a value or category occurs.","The average","The range"]],
    ["A frequency table has frequencies 4, 6, 3, and 7. How many observations are there?","20",["17","18","20","24"]],
    ["Which graph is best for comparing the number of students in different clubs?","Bar graph",["Line graph","Bar graph","Pie graph only","Stem-and-leaf only"]],
    ["Which graph is especially useful for showing change over time?","Line graph",["Line graph","Pie graph","Bar graph only","Stem-and-leaf"]],
    ["Which representation shows parts of a whole?","Pie graph",["Line graph","Pie graph","Stem-and-leaf","Frequency list"]],
    ["Which graph preserves individual numerical values while showing their distribution?","Stem-and-leaf plot",["Pie graph","Bar graph","Stem-and-leaf plot","Line graph"]],
    ["Data: 2, 3, 2, 4, 5, 2. What is the frequency of 2?","3",["2","3","4","5"]],
    ["A graph has values 12, 17, 9, 14, 7. Which is the highest?","17",["7","9","14","17"]],
    ["In the same data, how many more is 17 than 7?","10",["8","9","10","11"]],
    ["Which is an essential part of a clear graph?","Title and labels",["Random colors only","Title and labels","3D effects","Decorations"]],
    ["If a frequency table totals 25 but the raw data contain 27 observations, what should you do?","Check the counting/table for missing observations.",["Ignore the difference","Change the raw data","Add random frequency","Delete two observations"]],
    ["Which statement is a valid interpretation?","Science was chosen by 17 students, which is 10 more than Arts.",["Science is the best subject.","Everyone likes Science.","Science was chosen by 17 students, which is 10 more than Arts.","Students will always choose Science."]]
  ];
  let qi=0, answers=Array(questions.length).fill(null);
  function renderQuiz(){
    const [q,a,opts]=questions[qi]; $("#quizCount").textContent=`Question ${qi+1} of ${questions.length}`;
    $("#quizBar").style.width=`${((qi+1)/questions.length)*100}%`;
    $("#quizArea").innerHTML=`<div class="quiz-q"><h3>${q}</h3><div class="quiz-options">${opts.map((o,i)=>`<button class="quiz-option ${answers[qi]===i?"selected":""}" data-i="${i}" type="button">${String.fromCharCode(65+i)}. ${o}</button>`).join("")}</div></div>`;
    $$(".quiz-option").forEach(b=>b.addEventListener("click",()=>{answers[qi]=Number(b.dataset.i);renderQuiz();}));
    $("#prevQ").disabled=qi===0; $("#nextQ").textContent=qi===questions.length-1?"Finish Test →":"Next →";
    $("#quizScore").textContent=`Score: ${answers.reduce((s,x,i)=>s+(x===null?0:(questions[i][2][x]===questions[i][1]?1:0)),0)}`;
  }
  $("#prevQ").addEventListener("click",()=>{if(qi>0){qi--;renderQuiz()}});
  $("#nextQ").addEventListener("click",()=>{
    if(answers[qi]===null){alert("Choose an answer first.");return;}
    if(qi<questions.length-1){qi++;renderQuiz();return;}
    const score=answers.reduce((s,x,i)=>s+(questions[i][2][x]===questions[i][1]?1:0),0);
    const result=$("#masteryResult"); result.classList.remove("hidden");
    const pct=Math.round(score/questions.length*100);
    result.innerHTML=`<h3>${pct>=80?"🎉 Excellent Data Analyst Work!":"📚 Keep Practicing!"}</h3><p>You scored <strong>${score}/${questions.length}</strong> (${pct}%). ${pct>=80?"You are ready to explain and interpret statistical graphs.":"Review the lesson days connected to the items you missed, then try again."}</p>`;
    result.scrollIntoView({behavior:"smooth",block:"center"});
  });
  renderQuiz();

  // Reflection
  const saved=JSON.parse(localStorage.getItem("grade7DataReflection")||"{}");
  $("#reflect1").value=saved.a||""; $("#reflect2").value=saved.b||""; $("#reflect3").value=saved.c||"";
  $("#saveReflection").addEventListener("click",()=>{
    localStorage.setItem("grade7DataReflection",JSON.stringify({a:$("#reflect1").value,b:$("#reflect2").value,c:$("#reflect3").value}));
    $("#reflectionSaved").textContent="✓ Reflection saved on this device.";
  });
});
})();

const days = [
{
 title:"Reading the Spread: What Does Variability Tell Us?",
 target:"Explain why variability matters and calculate the range of an ungrouped data set.",
 motivation:"Two classes can have the same average test score but feel very different. Today we investigate why.",
 times:["5 min","10 min","10 min","15 min","10 min"],
 learn:`
 <p>Welcome, mathematician! This week we move beyond asking <b>“What is the center?”</b> and ask <b>“How spread out are the values?”</b></p>
 <h3>Key Terms</h3>
 <ul><li><b>Variability</b> – how much the values in a data set differ or spread out.</li><li><b>Range</b> – the difference between the greatest and least values.</li><li><b>Ungrouped data</b> – individual observations listed separately rather than placed into class intervals.</li></ul>
 <div class="formula math">Range = Maximum value − Minimum value</div>
 <div class="example"><b>Example:</b> Scores: 12, 15, 15, 18, 20<br>Maximum = 20; Minimum = 12<br><b>Range = 20 − 12 = 8</b></div>
 <button class="reveal" onclick="toggleAnswer(this)">Show the teacher's thinking</button><div class="answer">A range of 8 means the distance from the lowest score to the highest score is 8 points. It does not tell us exactly how the middle values are arranged.</div>
 `,
 explore:`
 <p><b>Look at the data:</b> Team A scores: 8, 9, 10, 10, 11. Team B scores: 2, 6, 10, 14, 16.</p>
 <p>Both have a center around 10, but Team B is much more spread out.</p>
 <div class="interactive"><b>Your Turn!</b><p>Which team has the greater range?</p><div class="choice-grid">
 <button class="choice" onclick="mc(this,false,'d1e')">Team A</button><button class="choice" onclick="mc(this,true,'d1e')">Team B</button>
 </div><div id="d1e" class="feedback"></div></div>
 <div class="callout"><b>Think-Pair-Share:</b> If two learners have the same mean, what additional information would help you compare how consistent their scores are?</div>
 `,
 apply:`
 <p><b>Range Race:</b> Find the range of each data set before checking the answer.</p>
 <div class="interactive"><p>A: 14, 16, 17, 19, 20</p><button class="reveal" onclick="toggleAnswer(this)">Reveal</button><div class="answer">Range = 20 − 14 = <b>6</b>.</div></div>
 <div class="interactive"><p>B: 45, 52, 48, 60, 55</p><button class="reveal" onclick="toggleAnswer(this)">Reveal</button><div class="answer">Range = 60 − 45 = <b>15</b>.</div></div>
 <div class="interactive"><p>C: 7, 7, 7, 7, 7</p><button class="reveal" onclick="toggleAnswer(this)">Reveal</button><div class="answer">Range = 7 − 7 = <b>0</b>. Every value is identical.</div></div>
 `,
 think:`
 <div class="interactive"><b>Challenge Yourself!</b><p>Data set X has range 4. Data set Y has range 20. Which set is more variable based on range alone?</p>
 <div class="choice-grid"><button class="choice" onclick="mc(this,true,'d1w')">Y</button><button class="choice" onclick="mc(this,false,'d1w')">X</button></div><div id="d1w" class="feedback"></div></div>
 <div class="callout"><b>Exit Ticket:</b> In one sentence, explain what a larger range usually tells us about a data set.</div>
 `,
 check:[
  ["What is variability?",["How spread out values are","The largest value only","The smallest value only","The number of variables"],0],
  ["Find the range: 4, 8, 9, 12.",["4","8","12","16"],1],
  ["A range of 0 means…",["All values are equal","There are no data","The mean is zero","The maximum is zero"],0],
  ["Which pair has greater spread by range?",["10,11,12","3,10,17","8,9,10","20,21,22"],1],
  ["Range is calculated using…",["Mean + median","Maximum − minimum","Minimum − maximum only","Sum ÷ n"],1]
 ]
},
{
 title:"Mean Deviation: Measuring Typical Distance",
 target:"Calculate and interpret the mean deviation of an ungrouped data set.",
 motivation:"If the mean is the center, how far are the values from that center on average?",
 times:["5 min","10 min","10 min","15 min","10 min"],
 learn:`
 <p><b>Mean deviation</b> tells us the average distance of the data values from the mean.</p>
 <div class="formula math">Mean Deviation = Σ|x − x̄| ÷ n</div>
 <p><b>Important:</b> We use absolute values so distances are positive. A value 3 points below the mean is still 3 units away.</p>
 <div class="example"><b>Example:</b> 4, 5, 6<br>Mean = (4+5+6)/3 = 5<br>Distances: |4−5|=1, |5−5|=0, |6−5|=1<br>Mean deviation = (1+0+1)/3 = <b>2/3 ≈ 0.67</b>.</div>
 <div class="step"><span class="step-num">1</span><div>Find the mean.</div></div><div class="step"><span class="step-num">2</span><div>Find each absolute deviation from the mean.</div></div><div class="step"><span class="step-num">3</span><div>Add the deviations.</div></div><div class="step"><span class="step-num">4</span><div>Divide by the number of values.</div></div>
 `,
 explore:`
 <div class="interactive"><b>Guided Discovery:</b><p>For 2, 4, 6, the mean is 4. Which list shows the correct absolute deviations?</p>
 <div class="choice-grid"><button class="choice" onclick="mc(this,true,'d2e')">2, 0, 2</button><button class="choice" onclick="mc(this,false,'d2e')">−2, 0, 2</button><button class="choice" onclick="mc(this,false,'d2e')">2, 4, 6</button><button class="choice" onclick="mc(this,false,'d2e')">0, 2, 4</button></div><div id="d2e" class="feedback"></div></div>
 <div class="callout"><b>Talk with a partner:</b> Why do we use absolute values instead of allowing negative deviations to cancel positive ones?</div>
 `,
 apply:`
 <div class="interactive"><p><b>Practice:</b> Find the mean deviation of 3, 4, 5.</p><button class="reveal" onclick="toggleAnswer(this)">Reveal steps</button><div class="answer">Mean = 4. Deviations = 1, 0, 1. Sum = 2. Mean deviation = 2/3 ≈ <b>0.67</b>.</div></div>
 <div class="interactive"><p><b>Practice:</b> Find the mean deviation of 5, 5, 5, 5.</p><button class="reveal" onclick="toggleAnswer(this)">Reveal</button><div class="answer">Mean = 5. Every deviation is 0. Mean deviation = <b>0</b>.</div></div>
 <div class="interactive"><b>Mini-game: Error Detective</b><p>A learner says the deviations from mean 10 for 7, 10, 13 are −3, 0, 3, so the mean deviation is 0. What went wrong?</p><button class="reveal" onclick="toggleAnswer(this)">Reveal</button><div class="answer">They forgot absolute value. The distances are 3, 0, 3, so the mean deviation is 6/3 = <b>2</b>.</div></div>
 `,
 think:`
 <div class="interactive"><b>Challenge:</b> Set A has mean deviation 1.2. Set B has mean deviation 4. Which set is more consistent around its mean?</p>
 <div class="choice-grid"><button class="choice" onclick="mc(this,true,'d2w')">Set A</button><button class="choice" onclick="mc(this,false,'d2w')">Set B</button></div><div id="d2w" class="feedback"></div></div>
 <div class="callout"><b>Exit Ticket:</b> Complete: “A smaller mean deviation generally means the values are ________ from the mean.”</div>
 `,
 check:[
  ["What does mean deviation measure?",["Average absolute distance from the mean","Highest value","Lowest value","Number of values"],0],
  ["For 2,4,6, the mean is…",["2","3","4","6"],2],
  ["For 2,4,6, the absolute deviations are…",["−2,0,2","2,0,2","2,4,6","0,2,4"],1],
  ["Mean deviation of 5,5,5 is…",["0","1","5","15"],0],
  ["Why use absolute value?",["To keep distances nonnegative","To make the mean larger","To remove the data","To change the maximum"],0]
 ]
},
{
 title:"Standard Deviation: A Deeper Measure of Spread",
 target:"Calculate and interpret the standard deviation of an ungrouped data set using the population formula.",
 motivation:"Range uses only two values. Mean deviation uses distances. Today we build a measure that emphasizes larger deviations.",
 times:["5 min","12 min","10 min","13 min","10 min"],
 learn:`
 <p><b>Standard deviation</b> measures how far data values typically spread from the mean. In this lesson, we use the <b>population standard deviation</b> for the complete data set provided.</p>
 <div class="formula math">σ = √[Σ(x − x̄)² ÷ n]</div>
 <p>We square the deviations so negative and positive values do not cancel. Squaring also gives more weight to larger distances.</p>
 <div class="example"><b>Worked Example:</b> Data = 2, 4, 6<br>Mean = 4<br>Deviations = −2, 0, 2<br>Squared deviations = 4, 0, 4<br>Sum = 8; n = 3<br>Variance = 8/3 ≈ 2.67<br>Standard deviation = √(8/3) ≈ <b>1.63</b>.</div>
 <div class="step"><span class="step-num">1</span><div>Find the mean.</div></div><div class="step"><span class="step-num">2</span><div>Subtract the mean from each value.</div></div><div class="step"><span class="step-num">3</span><div>Square every deviation.</div></div><div class="step"><span class="step-num">4</span><div>Find the average of the squared deviations.</div></div><div class="step"><span class="step-num">5</span><div>Take the square root.</div></div>
 `,
 explore:`
 <div class="interactive"><b>Choose the correct sequence.</b><p>After finding deviations, what comes next?</p>
 <div class="choice-grid"><button class="choice" onclick="mc(this,false,'d3e')">Add the deviations and stop</button><button class="choice" onclick="mc(this,true,'d3e')">Square the deviations</button><button class="choice" onclick="mc(this,false,'d3e')">Find the median</button><button class="choice" onclick="mc(this,false,'d3e')">Subtract the maximum</button></div><div id="d3e" class="feedback"></div></div>
 <div class="callout"><b>Observe:</b> Compare 1 and 5. Squared deviations are 1 and 25. Which deviation has a much stronger effect after squaring?</div>
 `,
 apply:`
 <div class="interactive"><p><b>Guided Practice:</b> For 4, 5, 6, the mean is 5. What is the sum of squared deviations?</p><button class="reveal" onclick="toggleAnswer(this)">Reveal</button><div class="answer">Deviations: −1, 0, 1. Squares: 1, 0, 1. Sum = <b>2</b>.</div></div>
 <div class="interactive"><p><b>Guided Practice:</b> For 4, 5, 6, what is the population standard deviation?</p><button class="reveal" onclick="toggleAnswer(this)">Reveal</button><div class="answer">Variance = 2/3 ≈ 0.67. Standard deviation = √(2/3) ≈ <b>0.82</b>.</div></div>
 <div class="interactive"><b>Calculator Challenge</b><p>For 10, 10, 10, 10, what should the standard deviation be?</p><div class="choice-grid"><button class="choice" onclick="mc(this,true,'d3a')">0</button><button class="choice" onclick="mc(this,false,'d3a')">1</button><button class="choice" onclick="mc(this,false,'d3a')">10</button><button class="choice" onclick="mc(this,false,'d3a')">100</button></div><div id="d3a" class="feedback"></div></div>
 `,
 think:`
 <div class="interactive"><b>Challenge Yourself!</b><p>Two data sets have the same mean. Set P has SD 1.1; Set Q has SD 5.4. Which is more tightly clustered around the mean?</p>
 <div class="choice-grid"><button class="choice" onclick="mc(this,true,'d3w')">P</button><button class="choice" onclick="mc(this,false,'d3w')">Q</button></div><div id="d3w" class="feedback"></div></div>
 <div class="callout"><b>Exit Ticket:</b> Why does a larger standard deviation generally indicate greater variability?</div>
 `,
 check:[
  ["Standard deviation measures…",["Spread around the mean","Only the maximum","Only the median","The number of categories"],0],
  ["For 2,4,6, the squared deviations from mean 4 are…",["4,0,4","−2,0,2","2,0,2","4,4,4"],0],
  ["The population formula divides by…",["n","n−1","2n","The maximum"],0],
  ["SD of identical values is…",["0","1","The common value","Undefined"],0],
  ["Which generally indicates more variability?",["Larger SD","Smaller SD","Smaller mean","Larger sample label"],0]
 ]
},
{
 title:"From Numbers to Conclusions: Comparing Data Sets",
 target:"Use range, mean deviation, and standard deviation to draw conclusions from ungrouped data.",
 motivation:"A number alone is not the conclusion. Today we turn measures of variability into meaningful statements.",
 times:["5 min","10 min","10 min","15 min","10 min"],
 learn:`
 <p>Measures of variability help us compare <b>consistency</b> and <b>spread</b>.</p>
 <div class="mastery"><div><b>Range</b><br>Quick spread from minimum to maximum.</div><div><b>Mean Deviation</b><br>Average absolute distance from the mean.</div><div><b>Standard Deviation</b><br>Spread around the mean using squared deviations.</div><div><b>Interpretation</b><br>Use context and units. Do not report a measure without explaining what it means.</div></div>
 <div class="example"><b>Example:</b> Two classes have the same mean score of 80. Class A has SD = 2.1; Class B has SD = 8.4. Class A's scores are more tightly clustered around 80, so Class A is more consistent.</div>
 <div class="callout"><b>Remember:</b> Smaller variability usually means values are more consistent; larger variability means values are more spread out.</div>
 `,
 explore:`
 <div class="interactive"><b>Data Detective:</b><p>Set A: 48, 49, 50, 51, 52<br>Set B: 30, 40, 50, 60, 70</p><p>Which set is more consistent?</p>
 <div class="choice-grid"><button class="choice" onclick="mc(this,true,'d4e')">Set A</button><button class="choice" onclick="mc(this,false,'d4e')">Set B</button></div><div id="d4e" class="feedback"></div></div>
 <div class="callout"><b>Think-Pair-Share:</b> Can two sets have the same mean but different variability? Explain using an example.</div>
 `,
 apply:`
 <div class="interactive"><p><b>Interpretation Practice:</b> A school records quiz scores with range 18. What does 18 mean?</p><button class="reveal" onclick="toggleAnswer(this)">Reveal</button><div class="answer">The highest quiz score is <b>18 points above the lowest quiz score</b>.</div></div>
 <div class="interactive"><p><b>Interpretation Practice:</b> A data set has mean deviation 2.5. What does this tell you?</p><button class="reveal" onclick="toggleAnswer(this)">Reveal</button><div class="answer">The values are, on average, <b>2.5 units away from the mean</b>.</div></div>
 <div class="interactive"><p><b>Comparison Challenge:</b> Which is more consistent: SD = 1.8 or SD = 6.2?</p><div class="choice-grid"><button class="choice" onclick="mc(this,true,'d4a')">SD = 1.8</button><button class="choice" onclick="mc(this,false,'d4a')">SD = 6.2</button></div><div id="d4a" class="feedback"></div></div>
 `,
 think:`
 <div class="interactive"><b>Higher-Order Thinking:</b><p>Two basketball players both average 20 points. Player A has a much smaller SD than Player B. What is a reasonable conclusion?</p>
 <div class="choice-grid"><button class="choice" onclick="mc(this,true,'d4w')">Player A's scores are more consistent around 20.</button><button class="choice" onclick="mc(this,false,'d4w')">Player A always scores exactly 20.</button><button class="choice" onclick="mc(this,false,'d4w')">Player B has the higher mean.</button><button class="choice" onclick="mc(this,false,'d4w')">The two players have identical scores.</button></div><div id="d4w" class="feedback"></div></div>
 <div class="callout"><b>Exit Ticket:</b> Complete: “When comparing two data sets with the same center, a smaller variability measure suggests ________.”</div>
 `,
 check:[
  ["A smaller spread generally indicates…",["More consistency","More randomness","A larger mean","More observations"],0],
  ["Range tells the distance between…",["Maximum and minimum","Mean and median","Two means","First and last entries only"],0],
  ["Mean deviation is reported in…",["The same units as the data","Squared units","No units","Always percentages"],0],
  ["If two classes have the same mean but different SDs…",["Their spreads can differ","Their data must be identical","Their ranges must be equal","Their medians cannot exist"],0],
  ["Best conclusion uses…",["Measure + context","A measure alone","A guess","Only the maximum"],0]
 ]
},
{
 title:"Data Story Challenge: Analyze and Explain",
 target:"Calculate, compare, and communicate measures of variability from an ungrouped data set and prepare for mastery.",
 motivation:"You are the data analyst today. Your job is not only to calculate, but also to explain what the numbers mean.",
 times:["5 min","10 min","10 min","15 min","10 min"],
 learn:`
 <p>Today we combine the week's skills. Use a reliable sequence:</p>
 <div class="step"><span class="step-num">1</span><div><b>Organize</b> the ungrouped data.</div></div>
 <div class="step"><span class="step-num">2</span><div><b>Find the mean</b> when needed.</div></div>
 <div class="step"><span class="step-num">3</span><div><b>Calculate variability</b>: range, mean deviation, or standard deviation.</div></div>
 <div class="step"><span class="step-num">4</span><div><b>Interpret</b> the value using the situation and units.</div></div>
 <div class="example"><b>Quick review:</b> Data = 8, 9, 10, 11, 12. Mean = 10; Range = 4. Deviations from mean are 2,1,0,1,2, so mean deviation = 6/5 = 1.2. SD = √(10/5) = √2 ≈ 1.41.</div>
 `,
 explore:`
 <div class="interactive"><b>Which measure fits the question?</b><p>“What is the difference between the highest and lowest score?”</p>
 <div class="choice-grid"><button class="choice" onclick="mc(this,true,'d5e')">Range</button><button class="choice" onclick="mc(this,false,'d5e')">Mean deviation</button><button class="choice" onclick="mc(this,false,'d5e')">Standard deviation</button><button class="choice" onclick="mc(this,false,'d5e')">Mean</button></div><div id="d5e" class="feedback"></div></div>
 <div class="callout"><b>Partner prompt:</b> Explain the difference between “calculate” and “interpret.” Why do we need both?</div>
 `,
 apply:`
 <div class="interactive"><b>Capstone Data Set</b><p>Study hours of five learners: <b>2, 3, 3, 4, 8</b></p><button class="reveal" onclick="toggleAnswer(this)">Reveal complete analysis</button><div class="answer">Mean = 20/5 = 4. Range = 8−2 = <b>6</b>. Absolute deviations = 2,1,1,0,4; mean deviation = 8/5 = <b>1.6</b>. Squared deviations = 4,1,1,0,16; variance = 22/5 = 4.4; SD ≈ <b>2.10</b>. Interpretation: the 8-hour value increases the spread.</div></div>
 <div class="interactive"><b>Mini-game: Spot the Strong Conclusion</b><p>Which statement is best?</p><div class="choice-grid"><button class="choice" onclick="mc(this,false,'d5a')">The SD is 2.1, so everything is exactly 2.1.</button><button class="choice" onclick="mc(this,true,'d5a')">The SD is about 2.1 hours, indicating the study times show noticeable spread around the mean.</button><button class="choice" onclick="mc(this,false,'d5a')">The mean is 2.1 hours.</button><button class="choice" onclick="mc(this,false,'d5a')">Range and SD always have the same value.</button></div><div id="d5a" class="feedback"></div></div>
 `,
 think:`
 <div class="interactive"><b>Mastery Challenge:</b><p>A teacher wants to identify which class has more consistent scores. Both classes have mean 75. Class A SD = 3.2; Class B SD = 7.9. Which should the teacher describe as more consistent?</p>
 <div class="choice-grid"><button class="choice" onclick="mc(this,true,'d5w')">Class A</button><button class="choice" onclick="mc(this,false,'d5w')">Class B</button><button class="choice" onclick="mc(this,false,'d5w')">Neither can be compared</button><button class="choice" onclick="mc(this,false,'d5w')">Both are equally consistent</button></div><div id="d5w" class="feedback"></div></div>
 <div class="callout"><b>Reflection:</b> Which measure of variability do you find easiest to explain? Which requires the most steps? Why?</div>
 `,
 check:[
  ["Which measure uses maximum − minimum?",["Range","Mean deviation","Standard deviation","Mean"],0],
  ["Mean deviation uses…",["Absolute deviations","Squared deviations only","Only the maximum","Only the minimum"],0],
  ["Standard deviation requires a square root after…",["Averaging squared deviations","Finding the range","Finding the median","Sorting only"],0],
  ["If SD is smaller, values are generally…",["More tightly clustered","More spread out","All equal","Always larger"],0],
  ["Best data conclusion should include…",["The measure and its meaning in context","Only a decimal","Only the mean","A guess"],0]
 ]
}
];

const assessment = [
["MC","Which measure is the difference between the maximum and minimum values?",["Range","Mean","Mean deviation","Standard deviation"],0],
["TF","A range of 0 means all values in the data set are equal.",["True","False"],0],
["MC","Find the range of 6, 9, 11, 15, 18.",["9","12","15","24"],1],
["MC","Which data set has the greater range?",["20,21,22","10,15,20","8,9,10","30,31,32"],1],
["ID","Mean deviation measures the average ______ distance from the mean.",["absolute","maximum","minimum","squared"],0],
["MC","For 2, 4, 6, the mean is…",["2","3","4","6"],2],
["MC","For 2, 4, 6, the absolute deviations from the mean are…",["−2,0,2","2,0,2","2,4,6","0,2,4"],1],
["TF","Negative deviations should be allowed to cancel positive deviations when finding mean deviation.",["True","False"],1],
["MC","Find the mean deviation of 3, 4, 5.",["0","0.67","1","2"],1],
["MC","Which set has mean deviation 0?",["2,2,2","1,2,3","2,3,4","0,1,2"],0],
["MC","For population standard deviation, after finding deviations from the mean, the next major step is to…",["Square them","Find the median","Subtract the maximum","Stop"],0],
["MC","For 2, 4, 6, the sum of squared deviations from mean 4 is…",["2","4","8","12"],2],
["MC","The population standard deviation of 2, 4, 6 is approximately…",["0.82","1.63","2.67","4.00"],1],
["TF","The standard deviation of identical values is 0.",["True","False"],0],
["MC","Which generally indicates greater variability?",["SD = 1.2","SD = 2.4","SD = 5.8","SD = 0.4"],2],
["APP","Two classes have the same mean of 80. Class A has SD 2.5; Class B has SD 7.0. Which is more consistent?",["Class A","Class B","Both equally","Cannot compare"],0],
["MC","A mean deviation of 3.5 points means the values are, on average…",["3.5 points from the mean","3.5 points above the mean","3.5 points below the mean","3.5 points from zero"],0],
["MC","A score set has maximum 98 and minimum 72. Its range is…",["20","24","26","170"],2],
["HOT","Why can two data sets have the same mean but different variability?",["Their values can be spread differently around the same center","A mean always changes randomly","Range must equal mean","SD is unrelated to data"],0],
["APP","Study hours are 2, 3, 3, 4, 8. What is the range?",["4","5","6","20"],2],
["HOT","If a teacher wants the quickest measure of total spread from lowest to highest score, which is best?",["Range","Mean deviation","Standard deviation","Mean"],0],
["MC","Which measure uses squared deviations before averaging and taking a square root?",["Range","Mean","Mean deviation","Standard deviation"],3],
["SITUATION","A class has mean score 75 and SD 2.1. Which interpretation is best?",["Scores are relatively clustered around 75","Every score is 2.1","The range is 2.1","The mean is 2.1"],0],
["SYN","Which sequence is most reliable for a variability problem?",["Identify data → choose measure → calculate → interpret","Guess → calculate → ignore units","Find maximum → stop","Find mean → automatically conclude"],0]
];

let screens = ["home","lesson","day1","day2","day3","day4","day5","assessment"];
let currentIndex = 0;
let completed = new Set();

function $(id){return document.getElementById(id)}
function safeText(v){return String(v).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}

function build(){
  const app=$("app");
  app.innerHTML = `
  <section id="home" class="screen on">
    <div class="hero">
      <div>
        <span class="eyebrow">DATA AND PROBABILITY • WEEKLY MISSION</span>
        <h1>Grade 8 – Term 3 – Week 6</h1>
        <h2>Measures of Variability for Ungrouped Data</h2>
        <p class="lead">This week you will learn how range, mean deviation, and standard deviation describe the spread of data—and how to use those measures to draw meaningful conclusions.</p>
        <div class="actions"><button class="primary" onclick="go('lesson')">Start Week 6 →</button><button class="secondary" onclick="go('assessment')">Preview Assessment</button></div>
      </div>
      <div class="mission"><div class="big-symbol">σ</div><h3>Your Data Analyst Mission</h3><p><b>KNOW:</b> range, mean deviation, standard deviation, and variability.</p><p><b>UNDERSTAND:</b> a measure of spread helps us describe consistency.</p><p><b>DO:</b> calculate, compare, interpret, and communicate conclusions.</p></div>
    </div>
    <div class="card">
      <span class="eyebrow">CURRICULUM ALIGNMENT</span>
      <h2>What should I KNOW, UNDERSTAND, and DO?</h2>
      <div class="align">
        <div class="card"><b>KNOW</b><h3>Key ideas</h3><ul><li>Measures of variability</li><li>Range</li><li>Mean deviation</li><li>Standard deviation</li><li>Ungrouped data</li></ul></div>
        <div class="card"><b>UNDERSTAND</b><h3>Big ideas</h3><ul><li>Variability describes spread.</li><li>Smaller spread generally means more consistency.</li><li>Different measures describe spread in different ways.</li><li>Numbers need context to become conclusions.</li></ul></div>
        <div class="card"><b>DO</b><h3>Demonstrate</h3><ul><li>Calculate range.</li><li>Calculate mean deviation.</li><li>Calculate standard deviation.</li><li>Compare data sets.</li><li>Draw conclusions from data.</li></ul></div>
      </div>
      <div class="callout"><b>Uploaded BOW competency:</b> “Calculate the measures of variability (range, mean deviation, and standard deviation) for ungrouped data.” and “Draw conclusions from statistical data using the measures of variability.”</div>
    </div>
    <div class="card"><h3>📊 Visual Warm-Up: Same Center, Different Spread</h3><p>Look at the two score patterns. Which group appears more consistent?</p>
      <div class="bar-chart">
        <div class="bar" style="--h:45%"><i></i><span>A1</span></div><div class="bar" style="--h:50%"><i></i><span>A2</span></div><div class="bar" style="--h:55%"><i></i><span>A3</span></div><div class="bar" style="--h:50%"><i></i><span>A4</span></div><div class="bar" style="--h:48%"><i></i><span>A5</span></div>
      </div>
      <div class="interactive"><b>Your Turn!</b><p>What does a tightly clustered group of values usually suggest?</p><div class="choice-grid"><button class="choice" onclick="mc(this,true,'homeq')">Less variability / more consistency</button><button class="choice" onclick="mc(this,false,'homeq')">More variability</button><button class="choice" onclick="mc(this,false,'homeq')">No data</button><button class="choice" onclick="mc(this,false,'homeq')">A larger maximum only</button></div><div id="homeq" class="feedback"></div></div>
    </div>
    <div class="progress card"><div class="progline"><span>Week Progress</span><span id="pct">0% complete</span></div><div class="track"><div id="fill" class="fill"></div></div><small>Complete daily checks and the final assessment to build mastery.</small></div>
  </section>
  <section id="lesson" class="screen">
    <div class="card"><span class="eyebrow">ONE-WEEK LEARNING MAP</span><h2>Our 5-Day Journey</h2><p>Each day is planned for approximately 50 minutes and follows the ILAW flow.</p><div class="journey">${days.map((d,i)=>`<button onclick="go('day${i+1}')">DAY ${i+1}<small>${d.title}</small></button>`).join("")}</div></div>
    <div class="card"><h3>ILAW in Action</h3><div class="mastery"><div><b>I – Learn</b><br>Introduce and explain the new concept clearly.</div><div><b>L – Explore</b><br>Investigate examples, patterns, and questions.</div><div><b>A – Apply / Practice-Play</b><br>Practice skills through challenges and interactive tasks.</div><div><b>W – Think / Check / Master</b><br>Explain, check, correct, reflect, and demonstrate mastery.</div></div></div>
  </section>`;

  days.forEach((d,i)=>app.insertAdjacentHTML("beforeend",dayScreen(d,i+1)));
  app.insertAdjacentHTML("beforeend",assessmentScreen());
  buildNav();
  updatePager();
}

function dayScreen(d,n){
 const labels=["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"];
 const times = `<div class="times">${d.times.map((t,i)=>`<div><b>${["Motivation","I – Learn","L – Explore","A – Apply / Practice-Play","W – Think / Check / Master"][i]}</b><span>⏱️ ${t}</span></div>`).join("")}</div>`;
 const checks = d.check.map((q,i)=>`<div class="q"><p><b>${i+1}.</b> ${q[0]}</p>${q[1].map((o,k)=>`<label><input type="radio" name="day${n}q${i}" value="${k}"> ${safeText(o)}</label>`).join("")}</div>`).join("");
 return `<section id="day${n}" class="screen">
   <div class="day-hero"><div><span class="eyebrow">DAY ${n} • ${labels[n-1]}</span><small style="display:block;opacity:.8">Date: __________________</small><h2>Grade 8 – Term 3 – Week 6</h2><h3>${d.title}</h3><p>${d.target}</p></div><div class="time">⏱️ 50 minutes</div></div>
   ${times}
   <div class="card"><span class="pill">A. MOTIVATION • 5 MINUTES</span><h3>🔥 Let's Get Started!</h3><p>${d.motivation}</p><div class="interactive"><b>Think About It!</b><p>What do you already know about how data can be spread out?</p><button class="reveal" onclick="toggleAnswer(this)">Show a possible response</button><div class="answer">Different data sets can have different amounts of spread even when their centers are similar.</div></div></div>
   <div class="card"><div class="section-head"><span class="pill">I – LEARN</span><h3>Understand the Concept</h3></div>${d.learn}</div>
   <div class="card"><div class="section-head"><span class="pill">L – EXPLORE</span><h3>Investigate and Discover</h3></div>${d.explore}</div>
   <div class="card"><div class="section-head"><span class="pill">A – APPLY / PRACTICE-PLAY</span><h3>Use What You Learned</h3></div>${d.apply}</div>
   <div class="card"><div class="section-head"><span class="pill">W – THINK / CHECK / MASTER</span><h3>Explain, Check, and Master</h3></div>${d.think}</div>
   <div class="card quiz-list"><span class="pill">END-OF-DAY CHECK • 5 ITEMS</span><h2>Can You Master Today's Target?</h2>${checks}<div class="actions"><button class="check" onclick="gradeDay(${n})">Check Day ${n}</button><button class="reset" onclick="resetDay(${n})">Reset</button></div><div id="dayResult${n}" class="result"></div></div>
 </section>`;
}

function assessmentScreen(){
 const items=assessment.map((q,i)=>`<div class="assessment-item"><h3>${i+1}. ${q[1]}</h3>${q[2].map((o,k)=>`<label class="qopt"><input type="radio" name="a${i}" value="${k}"> <b>${String.fromCharCode(65+k)}.</b> ${safeText(o)}</label>`).join("")}</div>`).join("");
 return `<section id="assessment" class="screen"><div class="card"><span class="eyebrow">FINAL WEEK 6 ASSESSMENT</span><h2>Grade 8 – Term 3 – Week 6</h2><p><b>Measures of Variability for Ungrouped Data</b> • 25 items</p><div class="callout"><b>Directions:</b> Read each item carefully. Choose the best answer. For computation items, work on paper if needed before selecting an answer.</div>${items}<div class="actions"><button class="primary" onclick="gradeAssessment()">Submit / Check Answers</button><button class="reset" onclick="resetAssessment()">Reset Assessment</button></div><div id="assessmentResult" class="result"></div></div></section>`;
}

function buildNav(){
 const nav=$("navLinks");
 screens.forEach(id=>{
   const b=document.createElement("button");
   b.type="button"; b.dataset.id=id;
   b.textContent=id==="home"?"Home":id==="lesson"?"Lesson":id==="assessment"?"Assessment":`Day ${id.slice(3)}`;
   b.onclick=()=>{go(id);nav.classList.remove("open");$("menuBtn").setAttribute("aria-expanded","false")};
   nav.appendChild(b);
 });
 $("menuBtn").onclick=()=>{nav.classList.toggle("open");$("menuBtn").setAttribute("aria-expanded",nav.classList.contains("open"))};
}

function go(id){
 currentIndex=screens.indexOf(id);
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("on"));
 const target=$(id); if(target) target.classList.add("on");
 document.querySelectorAll("#navLinks button").forEach(b=>b.classList.toggle("active",b.dataset.id===id));
 $("locationLabel").textContent=id==="home"?"Home":id==="lesson"?"Lesson":id==="assessment"?"Assessment":`Day ${id.slice(3)}`;
 updatePager(); window.scrollTo({top:0,behavior:"smooth"});
}

function updatePager(){
 $("prevBtn").disabled=currentIndex===0;
 $("nextBtn").disabled=currentIndex===screens.length-1;
 $("prevBtn").onclick=()=>go(screens[currentIndex-1]);
 $("nextBtn").onclick=()=>go(screens[currentIndex+1]);
}
function mc(btn,correct,target){
 const box=$(target);
 box.className="feedback "+(correct?"good":"bad");
 box.textContent=correct?"✅ Correct! Great thinking!":"❌ Not quite. Let's review the idea and try again.";
 if(correct){completed.add(target);updateProgress();}
}
function toggleAnswer(btn){const ans=btn.nextElementSibling;if(ans){ans.classList.toggle("show");btn.textContent=ans.classList.contains("show")?"Hide answer":"Reveal answer";}}
function gradeDay(n){
 const data=days[n-1].check; let score=0, answered=0;
 data.forEach((q,i)=>{const pick=document.querySelector(`input[name="day${n}q${i}"]:checked`);if(pick){answered++;if(Number(pick.value)===q[2])score++;}});
 const pct=Math.round(score/data.length*100), r=$(`dayResult${n}`);
 r.classList.add("show"); r.innerHTML=`<div class="score-big">${score}/${data.length} – ${pct}%</div><p>${score===data.length?"🌟 Excellent! You mastered today's target.":"💪 Good effort! Review the day's examples, then try the check again."}</p><p>Answered: ${answered}/${data.length}. Correct: ${score}. Incorrect or unanswered: ${data.length-score}.</p>`;
 completed.add("day"+n); updateProgress();
}
function resetDay(n){document.querySelectorAll(`input[name^="day${n}q"]`).forEach(x=>x.checked=false);$(`dayResult${n}`).classList.remove("show");}
function gradeAssessment(){
 let score=0, answered=0, wrong=[];
 assessment.forEach((q,i)=>{const pick=document.querySelector(`input[name="a${i}"]:checked`);if(pick){answered++;if(Number(pick.value)===q[3])score++;else wrong.push(i+1)}});
 const pct=Math.round(score/assessment.length*100), r=$("assessmentResult");
 let msg=pct>=90?"🌟 Outstanding! You demonstrated strong mastery of the Week 6 competency.":pct>=80?"👏 Great job! You showed good understanding of variability and interpretation.":pct>=75?"👍 Good work! Review a few sections and strengthen the skills you missed.":"💪 Keep going! Review Days 1–5, especially the measures and interpretation steps, then try again.";
 r.classList.add("show");r.innerHTML=`<div class="score-big">${score}/${assessment.length} – ${pct}%</div><p>${msg}</p><p><b>Correct:</b> ${score} &nbsp; <b>Incorrect:</b> ${assessment.length-score} &nbsp; <b>Answered:</b> ${answered}/${assessment.length}</p>${wrong.length?`<p><b>Review these item numbers:</b> ${wrong.join(", ")}. Suggested sections: Range (Day 1), Mean Deviation (Day 2), Standard Deviation (Day 3), Comparison & Interpretation (Day 4), Integration (Day 5).</p>`:"<p>✅ All items correct. You are ready to explain your reasoning to others!</p>"}`;
 completed.add("assessment");updateProgress();r.scrollIntoView({behavior:"smooth",block:"center"});
}
function resetAssessment(){document.querySelectorAll('#assessment input[type="radio"]').forEach(x=>x.checked=false);$("assessmentResult").classList.remove("show");}
function updateProgress(){
 const total=7; const count=[...completed].filter(x=>screens.includes(x)||x.startsWith("day")).length;
 const pct=Math.min(100,Math.round(count/total*100));
 const fill=$("fill"), label=$("pct"); if(fill)fill.style.width=pct+"%";if(label)label.textContent=pct+"% complete";
}
function initFullscreen(){
 $("fsBtn").onclick=async()=>{
  try{
   if(!document.fullscreenElement){await document.documentElement.requestFullscreen();document.body.classList.add("presentation");}
   else{await document.exitFullscreen();document.body.classList.remove("presentation");}
  }catch(e){document.body.classList.toggle("presentation");}
  $("fsBtn").textContent=document.body.classList.contains("presentation")?"⛶ EXIT FULL SCREEN":"⛶ FULL SCREEN";
 };
 document.addEventListener("fullscreenchange",()=>{if(!document.fullscreenElement){document.body.classList.remove("presentation");$("fsBtn").textContent="⛶ FULL SCREEN"}});
}
build();initFullscreen();

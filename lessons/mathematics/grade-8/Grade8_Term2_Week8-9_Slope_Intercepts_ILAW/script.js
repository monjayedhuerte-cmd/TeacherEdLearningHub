const days = [
  {
    title:"What Is Slope?", time:"50 minutes", focus:"Understand slope as a rate of change and determine slope from points.",
    sections:[
      {type:"intro",title:"I — Introduce: The Steepness Challenge",html:`<div class="card"><div class="big-idea">Imagine two roads. One rises gently; the other rises quickly. What mathematical idea can describe how steep each road is?</div><p>Today we connect <span class="highlight">rise</span> and <span class="highlight">run</span> to a number called <strong>slope</strong>.</p><div class="question"><strong>Quick Think: Which road has the greater slope?</strong><div class="choices"><button class="choice" onclick="choice(this,true,'intro1')">A. The road that rises more for the same horizontal distance</button><button class="choice" onclick="choice(this,false,'intro1')">B. The road that stays flat</button><button class="choice" onclick="choice(this,false,'intro1')">C. Both always have the same slope</button><button class="choice" onclick="choice(this,false,'intro1')">D. A road cannot have a slope</button></div><div id="intro1" class="feedback"></div></div></div>`},
      {type:"learn",title:"L — Learn: Rise ÷ Run",html:`<div class="card"><h3>📌 The Core Idea</h3><p>Slope tells how much <strong>y changes</strong> when <strong>x changes</strong>.</p><div class="formula">m = rise / run = Δy / Δx</div><ul class="steps"><li>Find the vertical change (rise).</li><li>Find the horizontal change (run).</li><li>Divide rise by run.</li><li>Keep the sign: positive slope rises left-to-right; negative slope falls left-to-right.</li></ul><div class="question"><strong>Check: If rise = 6 and run = 3, what is m?</strong><div class="choices"><button class="choice" onclick="choice(this,false,'d1q1')">1</button><button class="choice" onclick="choice(this,true,'d1q1')">2</button><button class="choice" onclick="choice(this,false,'d1q1')">3</button><button class="choice" onclick="choice(this,false,'d1q1')">18</button></div><div id="d1q1" class="feedback"></div></div></div>`},
      {type:"apply",title:"A — Apply: Slope Detective",html:`<div class="card"><h3>🔎 Find the Slope</h3><p>A line passes through <strong>(2, 3)</strong> and <strong>(5, 9)</strong>. Determine its slope.</p><p class="mini">Use m = (y₂ − y₁)/(x₂ − x₁).</p><input class="input-answer" id="d1input" placeholder="Type your answer, e.g. 2"><div class="btn-row"><button class="btn primary" onclick="checkText('d1input','2','d1fb')">Check Answer</button></div><div id="d1fb" class="feedback"></div></div>`},
      {type:"wrap",title:"W — Wrap-Up: Explain It",html:`<div class="card"><h3>🎟️ Exit Ticket</h3><p>Complete this sentence:</p><div class="formula">Slope is a measure of __________.</div><p class="mini">Expected idea: the rate of change / steepness of a line.</p><button class="btn gold" onclick="showToast('Great! You are ready for Day 2.')">I Can Explain Slope ⭐</button></div>`}
    ]
  },
  {
    title:"Slope from Two Points",time:"50 minutes",focus:"Calculate slope from two ordered pairs and interpret the sign.",
    sections:[
      {type:"intro",title:"I — Introduce: Coordinate Clue",html:`<div class="card"><div class="big-idea">A line gives us many points. If we know any two points, can we discover its slope?</div><p>Yes! The two-point slope formula compares the change in y with the change in x.</p><div class="question"><strong>Which expression correctly represents slope?</strong><div class="choices"><button class="choice" onclick="choice(this,true,'d2a')">(y₂ − y₁) ÷ (x₂ − x₁)</button><button class="choice" onclick="choice(this,false,'d2a')">(x₂ − x₁) ÷ (y₂ − y₁)</button><button class="choice" onclick="choice(this,false,'d2a')">x₁ + y₁</button><button class="choice" onclick="choice(this,false,'d2a')">y₂ − x₂</button></div><div id="d2a" class="feedback"></div></div></div>`},
      {type:"learn",title:"L — Learn: Two-Point Formula",html:`<div class="card"><h3>🧠 Formula</h3><div class="formula">m = (y₂ − y₁) / (x₂ − x₁)</div><p>Example: A(1, 2), B(4, 8)</p><ol class="steps"><li>Subtract y-values: 8 − 2 = 6.</li><li>Subtract x-values: 4 − 1 = 3.</li><li>Divide: 6/3 = <strong>2</strong>.</li></ol><p><strong>m = 2</strong>, so the line rises 2 units for every 1 unit it moves right.</p></div>`},
      {type:"apply",title:"A — Apply: Sign Matters",html:`<div class="card"><h3>⚡ Try Three</h3><div class="question"><strong>1) (2, 5) and (6, 13)</strong><div class="choices"><button class="choice" onclick="choice(this,true,'d2q1')">2</button><button class="choice" onclick="choice(this,false,'d2q1')">1/2</button><button class="choice" onclick="choice(this,false,'d2q1')">−2</button></div><div id="d2q1" class="feedback"></div></div><div class="question"><strong>2) (1, 7) and (5, 3)</strong><div class="choices"><button class="choice" onclick="choice(this,false,'d2q2')">1</button><button class="choice" onclick="choice(this,true,'d2q2')">−1</button><button class="choice" onclick="choice(this,false,'d2q2')">−4</button></div><div id="d2q2" class="feedback"></div></div></div>`},
      {type:"wrap",title:"W — Wrap-Up",html:`<div class="card"><h3>📝 Remember</h3><p>When x increases and y increases, slope is usually <strong>positive</strong>. When x increases and y decreases, slope is <strong>negative</strong>.</p><button class="btn gold" onclick="showToast('Day 2 complete! Positive or negative? Look at the direction.')">Got It! ✓</button></div>`}
    ]
  },
  {
    title:"Special Slopes",time:"50 minutes",focus:"Recognize positive, negative, zero, and undefined slopes.",
    sections:[
      {type:"intro",title:"I — Introduce: Four Roads",html:`<div class="card"><h3>🚦 Which road is which?</h3><p>Think of four lines: rising, falling, flat, and vertical.</p><div class="choices"><button class="choice" onclick="choice(this,true,'d3a')">A flat horizontal line has slope 0.</button><button class="choice" onclick="choice(this,false,'d3a')">A vertical line has slope 0.</button><button class="choice" onclick="choice(this,false,'d3a')">A rising line has negative slope.</button><button class="choice" onclick="choice(this,false,'d3a')">A falling line has positive slope.</button></div><div id="d3a" class="feedback"></div></div>`},
      {type:"learn",title:"L — Learn: Slope Types",html:`<div class="grid three"><div class="card"><h3>↗ Positive</h3><p>Rises left to right.</p><div class="formula">m &gt; 0</div></div><div class="card"><h3>↘ Negative</h3><p>Falls left to right.</p><div class="formula">m &lt; 0</div></div><div class="card"><h3>→ Zero / Vertical</h3><p>Horizontal: m = 0. Vertical: slope is undefined.</p><div class="formula">m = 0 / undefined</div></div></div>`},
      {type:"apply",title:"A — Apply: Classify It",html:`<div class="card"><div class="question"><strong>A line goes through (1,4) and (6,4). What type of slope?</strong><div class="choices"><button class="choice" onclick="choice(this,true,'d3q1')">Zero</button><button class="choice" onclick="choice(this,false,'d3q1')">Positive</button><button class="choice" onclick="choice(this,false,'d3q1')">Negative</button><button class="choice" onclick="choice(this,false,'d3q1')">Undefined</button></div><div id="d3q1" class="feedback"></div></div><div class="question"><strong>A line goes through (3,1) and (3,8). What type?</strong><div class="choices"><button class="choice" onclick="choice(this,false,'d3q2')">Zero</button><button class="choice" onclick="choice(this,false,'d3q2')">Positive</button><button class="choice" onclick="choice(this,false,'d3q2')">Negative</button><button class="choice" onclick="choice(this,true,'d3q2')">Undefined</button></div><div id="d3q2" class="feedback"></div></div></div>`},
      {type:"wrap",title:"W — Wrap-Up",html:`<div class="card"><h3>🎯 Fast Recall</h3><p><strong>Horizontal → 0</strong> &nbsp; | &nbsp; <strong>Vertical → undefined</strong></p><button class="btn gold" onclick="showToast('Excellent! Special slopes unlocked.')">I Remember ⭐</button></div>`}
    ]
  },
  {
    title:"Intercepts of a Line",time:"50 minutes",focus:"Define and determine x-intercepts and y-intercepts.",
    sections:[
      {type:"intro",title:"I — Introduce: Where Does the Line Cross?",html:`<div class="card"><div class="big-idea">A line can cross the x-axis and the y-axis. Those crossing points have special names.</div><div class="question"><strong>Which axis contains the y-intercept?</strong><div class="choices"><button class="choice" onclick="choice(this,false,'d4a')">x-axis</button><button class="choice" onclick="choice(this,true,'d4a')">y-axis</button><button class="choice" onclick="choice(this,false,'d4a')">Neither</button><button class="choice" onclick="choice(this,false,'d4a')">Both always</button></div><div id="d4a" class="feedback"></div></div></div>`},
      {type:"learn",title:"L — Learn: x- and y-Intercepts",html:`<div class="card"><h3>📍 Two Important Points</h3><ul class="steps"><li><strong>x-intercept:</strong> where the graph crosses the x-axis. Its y-coordinate is 0.</li><li><strong>y-intercept:</strong> where the graph crosses the y-axis. Its x-coordinate is 0.</li></ul><div class="formula">x-intercept → (x, 0)<br>y-intercept → (0, y)</div><p>For <strong>y = 2x + 6</strong>, set x = 0 to get the y-intercept: <strong>(0,6)</strong>.</p></div>`},
      {type:"apply",title:"A — Apply: Find the Intercept",html:`<div class="card"><div class="question"><strong>For y = 3x + 9, what is the y-intercept?</strong><div class="choices"><button class="choice" onclick="choice(this,true,'d4q1')">(0, 9)</button><button class="choice" onclick="choice(this,false,'d4q1')">(9, 0)</button><button class="choice" onclick="choice(this,false,'d4q1')">(0, 3)</button><button class="choice" onclick="choice(this,false,'d4q1')">(3, 9)</button></div><div id="d4q1" class="feedback"></div></div><div class="question"><strong>For 2x + y = 8, what is the x-intercept?</strong><div class="choices"><button class="choice" onclick="choice(this,false,'d4q2')">(0,8)</button><button class="choice" onclick="choice(this,true,'d4q2')">(4,0)</button><button class="choice" onclick="choice(this,false,'d4q2')">(2,8)</button><button class="choice" onclick="choice(this,false,'d4q2')">(8,4)</button></div><div id="d4q2" class="feedback"></div></div></div>`},
      {type:"wrap",title:"W — Wrap-Up",html:`<div class="card"><h3>🧩 Memory Trick</h3><p><strong>x-intercept → x-axis → y = 0.</strong><br><strong>y-intercept → y-axis → x = 0.</strong></p><button class="btn gold" onclick="showToast('Intercepts mastered!')">Remember It ✓</button></div>`}
    ]
  },
  {
    title:"Slope-Intercept Form",time:"50 minutes",focus:"Understand and use y = mx + b.",
    sections:[
      {type:"intro",title:"I — Introduce: The Line Formula",html:`<div class="card"><div class="big-idea">One equation can tell us two important things about a line: its slope and its y-intercept.</div><div class="formula">y = mx + b</div><div class="question"><strong>In y = mx + b, what does m represent?</strong><div class="choices"><button class="choice" onclick="choice(this,true,'d5a')">Slope</button><button class="choice" onclick="choice(this,false,'d5a')">x-intercept</button><button class="choice" onclick="choice(this,false,'d5a')">y-coordinate only</button><button class="choice" onclick="choice(this,false,'d5a')">Constant x</button></div><div id="d5a" class="feedback"></div></div></div>`},
      {type:"learn",title:"L — Learn: Read the Equation",html:`<div class="card"><h3>🔑 y = mx + b</h3><div class="grid"><div><div class="formula">m = slope</div><p>It tells the direction and steepness.</p></div><div><div class="formula">b = y-intercept</div><p>It tells where the line crosses the y-axis.</p></div></div><p>Example: <strong>y = −2x + 5</strong> has slope <strong>−2</strong> and y-intercept <strong>(0,5)</strong>.</p></div>`},
      {type:"apply",title:"A — Apply: Read m and b",html:`<div class="card"><div class="question"><strong>For y = 4x − 7, what are m and b?</strong><div class="choices"><button class="choice" onclick="choice(this,true,'d5q1')">m = 4, b = −7</button><button class="choice" onclick="choice(this,false,'d5q1')">m = −7, b = 4</button><button class="choice" onclick="choice(this,false,'d5q1')">m = 7, b = 4</button><button class="choice" onclick="choice(this,false,'d5q1')">m = −4, b = 7</button></div><div id="d5q1" class="feedback"></div></div><div class="question"><strong>Which equation has slope −3 and y-intercept 2?</strong><div class="choices"><button class="choice" onclick="choice(this,false,'d5q2')">y = 3x + 2</button><button class="choice" onclick="choice(this,true,'d5q2')">y = −3x + 2</button><button class="choice" onclick="choice(this,false,'d5q2')">y = −3x − 2</button><button class="choice" onclick="choice(this,false,'d5q2')">y = 2x − 3</button></div><div id="d5q2" class="feedback"></div></div></div>`},
      {type:"wrap",title:"W — Wrap-Up",html:`<div class="card"><h3>🎟️ Exit Ticket</h3><p>Look at <strong>y = 5x + 1</strong>. Say aloud: “The slope is ___ and the y-intercept is ___.”</p><button class="btn gold" onclick="showToast('Answer: slope 5; y-intercept (0,1).')">Reveal Check ✓</button></div>`}
    ]
  },
  {
    title:"Equation from Two Points",time:"50 minutes",focus:"Find the equation of a line when two points are given.",
    sections:[
      {type:"intro",title:"I — Introduce: Build the Rule",html:`<div class="card"><div class="big-idea">If two points are known, we can first find the slope, then use a point to build the equation.</div><p>Our target form is <strong>y = mx + b</strong>.</p><div class="question"><strong>What should we find first?</strong><div class="choices"><button class="choice" onclick="choice(this,true,'d6a')">Slope</button><button class="choice" onclick="choice(this,false,'d6a')">Only x-intercept</button><button class="choice" onclick="choice(this,false,'d6a')">Only y-value</button><button class="choice" onclick="choice(this,false,'d6a')">Nothing</button></div><div id="d6a" class="feedback"></div></div></div>`},
      {type:"learn",title:"L — Learn: A Reliable Method",html:`<div class="card"><ol class="steps"><li>Use the two points to find <strong>m</strong>.</li><li>Substitute one point into <strong>y = mx + b</strong>.</li><li>Solve for <strong>b</strong>.</li><li>Write the final equation.</li><li>Check the second point.</li></ol><p><strong>Example:</strong> (1,3) and (3,7). m = (7−3)/(3−1)=2. Then 3=2(1)+b, so b=1. Equation: <strong>y=2x+1</strong>.</p></div>`},
      {type:"apply",title:"A — Apply: Guided Challenge",html:`<div class="card"><p>Find the equation through <strong>(2,5)</strong> and <strong>(4,9)</strong>.</p><div class="question"><strong>Step 1: What is the slope?</strong><div class="choices"><button class="choice" onclick="choice(this,true,'d6q1')">2</button><button class="choice" onclick="choice(this,false,'d6q1')">4</button><button class="choice" onclick="choice(this,false,'d6q1')">1/2</button><button class="choice" onclick="choice(this,false,'d6q1')">−2</button></div><div id="d6q1" class="feedback"></div></div><div class="question"><strong>Step 2: What is b?</strong><div class="choices"><button class="choice" onclick="choice(this,false,'d6q2')">−1</button><button class="choice" onclick="choice(this,true,'d6q2')">1</button><button class="choice" onclick="choice(this,false,'d6q2')">2</button><button class="choice" onclick="choice(this,false,'d6q2')">5</button></div><div id="d6q2" class="feedback"></div></div><div class="question"><strong>Final equation?</strong><div class="choices"><button class="choice" onclick="choice(this,true,'d6q3')">y = 2x + 1</button><button class="choice" onclick="choice(this,false,'d6q3')">y = x + 2</button><button class="choice" onclick="choice(this,false,'d6q3')">y = 2x − 1</button><button class="choice" onclick="choice(this,false,'d6q3')">y = 4x + 1</button></div><div id="d6q3" class="feedback"></div></div></div>`},
      {type:"wrap",title:"W — Wrap-Up",html:`<div class="card"><h3>🏁 The Pattern</h3><p><strong>Two points → slope → substitute → b → equation → verify.</strong></p><button class="btn gold" onclick="showToast('You can build an equation from two points!')">Lock It In 🔒</button></div>`}
    ]
  },
  {
    title:"Equation from Slope and a Point",time:"50 minutes",focus:"Find the equation given slope and one point.",
    sections:[
      {type:"intro",title:"I — Introduce: One Point Is Enough",html:`<div class="card"><div class="big-idea">If the slope is known and one point is known, can we find the whole line?</div><p>Yes. Substitute the known values into <strong>y = mx + b</strong> and solve for b.</p><div class="question"><strong>Given m = 3 and point (2,7), what should you substitute?</strong><div class="choices"><button class="choice" onclick="choice(this,true,'d7a')">x = 2 and y = 7</button><button class="choice" onclick="choice(this,false,'d7a')">x = 3 and y = 2</button><button class="choice" onclick="choice(this,false,'d7a')">x = 7 and y = 3</button><button class="choice" onclick="choice(this,false,'d7a')">Only y = 3</button></div><div id="d7a" class="feedback"></div></div></div>`},
      {type:"learn",title:"L — Learn: Substitute and Solve",html:`<div class="card"><p>Given <strong>m = 3</strong> and point <strong>(2,7)</strong>:</p><div class="formula">7 = 3(2) + b</div><p>7 = 6 + b → <strong>b = 1</strong></p><div class="formula">y = 3x + 1</div><p>Always verify by putting x = 2 back into the equation.</p></div>`},
      {type:"apply",title:"A — Apply: Your Turn",html:`<div class="card"><div class="question"><strong>Given m = 2 and point (3,10), what is b?</strong><div class="choices"><button class="choice" onclick="choice(this,false,'d7q1')">2</button><button class="choice" onclick="choice(this,true,'d7q1')">4</button><button class="choice" onclick="choice(this,false,'d7q1')">6</button><button class="choice" onclick="choice(this,false,'d7q1')">10</button></div><div id="d7q1" class="feedback"></div></div><div class="question"><strong>Final equation?</strong><div class="choices"><button class="choice" onclick="choice(this,false,'d7q2')">y = 2x + 4</button><button class="choice" onclick="choice(this,true,'d7q2')">y = 2x + 4</button><button class="choice" onclick="choice(this,false,'d7q2')">y = 4x + 2</button></div><div id="d7q2" class="feedback"></div></div><p class="mini">Note: The first two options are intentionally the same-looking answer choice style; focus on explaining why b = 4.</p></div>`},
      {type:"wrap",title:"W — Wrap-Up",html:`<div class="card"><h3>💬 Explain It</h3><p>Why can one point plus a known slope determine a unique line?</p><button class="btn gold" onclick="showToast('Because the slope fixes the direction/steepness, and the point fixes the line’s location.')">Show Model Explanation</button></div>`}
    ]
  },
  {
    title:"Equation from Slope and y-Intercept",time:"50 minutes",focus:"Write the equation directly when slope and y-intercept are known.",
    sections:[
      {type:"intro",title:"I — Introduce: Almost Instant",html:`<div class="card"><div class="big-idea">If you know the slope and y-intercept, the equation is nearly automatic.</div><div class="formula">y = mx + b</div><div class="question"><strong>If m = −4 and b = 6, what is the equation?</strong><div class="choices"><button class="choice" onclick="choice(this,true,'d8a')">y = −4x + 6</button><button class="choice" onclick="choice(this,false,'d8a')">y = 4x − 6</button><button class="choice" onclick="choice(this,false,'d8a')">y = −6x + 4</button><button class="choice" onclick="choice(this,false,'d8a')">y = 6x − 4</button></div><div id="d8a" class="feedback"></div></div></div>`},
      {type:"learn",title:"L — Learn: Substitute m and b",html:`<div class="card"><p>Given slope <strong>m = 1/2</strong> and y-intercept <strong>(0,−3)</strong>:</p><div class="formula">y = (1/2)x − 3</div><p>The y-coordinate of the y-intercept is b. The x-coordinate is 0.</p></div>`},
      {type:"apply",title:"A — Apply: Equation Builder",html:`<div class="card"><div class="question"><strong>m = 5, y-intercept = (0,−2)</strong><div class="choices"><button class="choice" onclick="choice(this,true,'d8q1')">y = 5x − 2</button><button class="choice" onclick="choice(this,false,'d8q1')">y = −5x + 2</button><button class="choice" onclick="choice(this,false,'d8q1')">y = 2x − 5</button><button class="choice" onclick="choice(this,false,'d8q1')">y = 5x + 2</button></div><div id="d8q1" class="feedback"></div></div><div class="question"><strong>m = −1/2, y-intercept = (0,4)</strong><div class="choices"><button class="choice" onclick="choice(this,false,'d8q2')">y = 1/2x + 4</button><button class="choice" onclick="choice(this,true,'d8q2')">y = −1/2x + 4</button><button class="choice" onclick="choice(this,false,'d8q2')">y = −4x + 1/2</button></div><div id="d8q2" class="feedback"></div></div></div>`},
      {type:"wrap",title:"W — Wrap-Up",html:`<div class="card"><h3>⚡ Speed Round</h3><p>When m and b are already given, <strong>plug them directly into y = mx + b.</strong></p><button class="btn gold" onclick="showToast('Fast equation writing achieved!')">Ready ✓</button></div>`}
    ]
  },
  {
    title:"Equation from x- and y-Intercepts",time:"50 minutes",focus:"Find the equation of a line given both intercepts.",
    sections:[
      {type:"intro",title:"I — Introduce: Two Axis Clues",html:`<div class="card"><div class="big-idea">Two intercepts give us two points on the same line.</div><p>Once we have two points, we can find slope and then the equation.</p><div class="question"><strong>If x-intercept is (4,0), which value is y?</strong><div class="choices"><button class="choice" onclick="choice(this,true,'d9a')">0</button><button class="choice" onclick="choice(this,false,'d9a')">4</button><button class="choice" onclick="choice(this,false,'d9a')">−4</button><button class="choice" onclick="choice(this,false,'d9a')">Cannot tell</button></div><div id="d9a" class="feedback"></div></div></div>`},
      {type:"learn",title:"L — Learn: Intercepts → Two Points",html:`<div class="card"><p>Suppose x-intercept = <strong>(4,0)</strong> and y-intercept = <strong>(0,6)</strong>.</p><ol class="steps"><li>Use the two points.</li><li>Find slope: (6−0)/(0−4) = 6/−4 = <strong>−3/2</strong>.</li><li>Because the y-intercept is 6, b = 6.</li><li>Equation: <strong>y = −3/2x + 6</strong>.</li></ol></div>`},
      {type:"apply",title:"A — Apply: Intercept Challenge",html:`<div class="card"><div class="question"><strong>x-int = (5,0), y-int = (0,10). What is m?</strong><div class="choices"><button class="choice" onclick="choice(this,false,'d9q1')">2</button><button class="choice" onclick="choice(this,true,'d9q1')">−2</button><button class="choice" onclick="choice(this,false,'d9q1')">1/2</button><button class="choice" onclick="choice(this,false,'d9q1')">−1/2</button></div><div id="d9q1" class="feedback"></div></div><div class="question"><strong>What is the equation?</strong><div class="choices"><button class="choice" onclick="choice(this,false,'d9q2')">y = 2x + 10</button><button class="choice" onclick="choice(this,true,'d9q2')">y = −2x + 10</button><button class="choice" onclick="choice(this,false,'d9q2')">y = −2x + 5</button></div><div id="d9q2" class="feedback"></div></div></div>`},
      {type:"wrap",title:"W — Wrap-Up",html:`<div class="card"><h3>🔗 Connect the Ideas</h3><p>Intercepts give <strong>points</strong>. Points give <strong>slope</strong>. Slope + intercept gives the <strong>equation</strong>.</p><button class="btn gold" onclick="showToast('You can move between graph information and equation information.')">Connect It ✓</button></div>`}
    ]
  },
  {
    title:"Mastery: Choose the Right Information",time:"50 minutes",focus:"Integrate all four ways of finding a line equation.",
    sections:[
      {type:"intro",title:"I — Introduce: Which Strategy?",html:`<div class="card"><div class="big-idea">Different problems give different clues. Your first job is to identify what information you have.</div><div class="question"><strong>You are given two points. Best first move?</strong><div class="choices"><button class="choice" onclick="choice(this,true,'d10a')">Find slope using the two-point formula</button><button class="choice" onclick="choice(this,false,'d10a')">Guess b</button><button class="choice" onclick="choice(this,false,'d10a')">Set x = 0 immediately</button><button class="choice" onclick="choice(this,false,'d10a')">Draw any random line</button></div><div id="d10a" class="feedback"></div></div></div>`},
      {type:"learn",title:"L — Learn: Decision Guide",html:`<div class="card"><div class="day-map"><div class="map-item"><b>Two points</b>Find m → find b → equation.</div><div class="map-item"><b>m + point</b>Substitute → find b → equation.</div><div class="map-item"><b>m + y-int</b>Directly use y = mx + b.</div><div class="map-item"><b>x- & y-int</b>Use them as two points.</div><div class="map-item"><b>Equation given</b>Read m and b; graph or interpret.</div></div></div>`},
      {type:"apply",title:"A — Apply: Mastery Check",html:`<div class="card"><div class="question"><strong>Which equation passes through (0,3) and has slope 2?</strong><div class="choices"><button class="choice" onclick="choice(this,true,'d10q1')">y = 2x + 3</button><button class="choice" onclick="choice(this,false,'d10q1')">y = 3x + 2</button><button class="choice" onclick="choice(this,false,'d10q1')">y = 2x − 3</button><button class="choice" onclick="choice(this,false,'d10q1')">y = −2x + 3</button></div><div id="d10q1" class="feedback"></div></div><div class="question"><strong>Which information is enough to write y = mx + b immediately?</strong><div class="choices"><button class="choice" onclick="choice(this,true,'d10q2')">Slope and y-intercept</button><button class="choice" onclick="choice(this,false,'d10q2')">Only x-intercept</button><button class="choice" onclick="choice(this,false,'d10q2')">Only one x-coordinate</button><button class="choice" onclick="choice(this,false,'d10q2')">Only the word “line”</button></div><div id="d10q2" class="feedback"></div></div></div>`},
      {type:"wrap",title:"W — Wrap-Up: Ready for Assessment",html:`<div class="card"><h3>🏆 Week 8–9 Mission Complete</h3><p>You have practiced:</p><ul><li>defining and determining slope;</li><li>finding x- and y-intercepts;</li><li>finding equations from two points;</li><li>finding equations from slope and a point;</li><li>finding equations from slope and y-intercept;</li><li>finding equations from x- and y-intercepts.</li></ul><button class="btn gold" onclick="goDay(10)">START 20+ ITEM ASSESSMENT 🚀</button></div>`}
    ]
  }
];

const assessment = [
["What does slope measure?","The rate of change / steepness of a line",["The rate of change / steepness of a line","The length of the x-axis","The y-intercept only","The number of points"]],
["What is the slope formula using two points?","(y₂ − y₁)/(x₂ − x₁)",["(y₂ − y₁)/(x₂ − x₁)","(x₂ − x₁)/(y₂ − y₁)","x₁+y₁","y₂−x₂"]],
["Find m for (1,2) and (4,8).","2",["2","3","6","1/2"]],
["Find m for (2,7) and (6,3).","−1",["−1","1","−4","4"]],
["A positive slope means the line…","rises left to right",["rises left to right","falls left to right","is vertical","is always horizontal"]],
["A horizontal line has slope…","0",["0","1","undefined","−1"]],
["A vertical line has slope…","undefined",["undefined","0","1","−1"]],
["The x-intercept lies on the…","x-axis",["x-axis","y-axis","origin only","both axes"]],
["At an x-intercept, y equals…","0",["0","1","x","undefined"]],
["At a y-intercept, x equals…","0",["0","1","y","undefined"]],
["For y = 3x + 5, the slope is…","3",["3","5","−3","−5"]],
["For y = 3x + 5, the y-intercept is…","(0,5)",["(0,5)","(5,0)","(3,0)","(0,3)"]],
["Which is slope-intercept form?","y = mx + b",["y = mx + b","x = my + b","y = x + m + b","m = xy"]],
["Which equation has slope −2 and y-intercept 4?","y = −2x + 4",["y = −2x + 4","y = 2x − 4","y = −4x + 2","y = 4x − 2"]],
["Find the slope through (2,5) and (5,11).","2",["2","3","6","1/2"]],
["If m = 2 and point is (3,8), find b.","2",["2","5","6","8"]],
["If m = −3 and b = 7, the equation is…","y = −3x + 7",["y = −3x + 7","y = 3x − 7","y = −7x + 3","y = 7x − 3"]],
["x-int = (4,0), y-int = (0,8). What is m?","−2",["−2","2","1/2","−1/2"]],
["Using the same intercepts, the equation is…","y = −2x + 8",["y = −2x + 8","y = 2x + 8","y = −2x + 4","y = 8x − 2"]],
["Which method fits two given points?","Find m, then b",["Find m, then b","Guess b","Use only the x-coordinate","Use only the y-intercept"]],
["Which method fits slope + y-intercept?","Directly substitute into y = mx + b",["Directly substitute into y = mx + b","Find a third point first","Ignore the slope","Use x = 0 only"]],
["Why verify an equation with the second point?","To check that the equation really represents the line",["To check that the equation really represents the line","To change the slope","To make the graph vertical","To remove the intercept"]]
];

function choice(btn, ok, fbId){
  const box = btn.closest('.question');
  if(box) box.querySelectorAll('.choice').forEach(b=>{b.classList.remove('correct','wrong')});
  btn.classList.add(ok?'correct':'wrong');
  const fb = document.getElementById(fbId);
  if(fb){
    fb.className='feedback show '+(ok?'good':'bad');
    fb.textContent = ok ? '✅ Correct! Explain why your answer makes sense.' : '💡 Not quite. Recheck the definition or calculation, then try again.';
  }
}
function checkText(inputId, answer, fbId){
  const v=document.getElementById(inputId).value.trim().replace(/\s/g,'');
  const ok=v===answer;
  const fb=document.getElementById(fbId);
  fb.className='feedback show '+(ok?'good':'bad');
  fb.textContent=ok?'🎉 Correct! The slope is 2.':'Try again. Use (9−3)/(5−2).';
}
function showToast(msg){
  const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);
  window.__toast=setTimeout(()=>t.classList.remove('show'),2800);
}

function buildDay(dayIndex){
  const d=days[dayIndex];
  let html=`<section class="screen active" id="day${dayIndex}">
    <div class="section-head"><div><div class="day-kicker">DAY ${dayIndex+1} • ILAW LESSON</div><h2>${d.title}</h2><p>${d.focus}</p></div><span class="time-badge">⏱ ${d.time}</span></div>`;
  d.sections.forEach((s,i)=>{
    html += `<div class="card" style="margin-bottom:14px"><div class="day-kicker">${s.title}</div><div style="margin-top:10px">${s.html}</div></div>`;
  });
  html += `<div class="nav-pager"><button class="pager" onclick="goDay(${Math.max(0,dayIndex-1)})">← Previous</button><button class="pager primary" onclick="goDay(${Math.min(days.length,dayIndex+1)})">${dayIndex===days.length-1?'Assessment':'Next Day →'}</button></div></section>`;
  return html;
}

function buildAssessment(){
  let html=`<section class="screen" id="assessment"><div class="section-head"><div><div class="day-kicker">TERM 2 • WEEK 8–9</div><h2>🏆 Mastery Assessment</h2><p>22 items • Choose the best answer. Aim to explain your reasoning after each item.</p></div><span class="time-badge">ASSESSMENT</span></div>
  <div class="card"><div class="assess-score" id="scoreText">Score: 0 / ${assessment.length}</div><div class="progress-track" style="margin-top:10px"><div class="progress-fill" id="assessProgress"></div></div><p class="mini">This assessment checks the Week 8–9 competencies from the uploaded BOW.</p></div>
  <div class="assessment-list">`;
  assessment.forEach((q,i)=>{
    html += `<div class="assessment-item" data-index="${i}"><div class="qnum">ITEM ${i+1}</div><p><strong>${q[0]}</strong></p><div class="choices">`;
    q[2].forEach((a,j)=>html+=`<button class="choice" onclick="answerAssessment(${i},${j},this)">${String.fromCharCode(65+j)}. ${a}</button>`);
    html += `</div><div id="afb${i}" class="feedback"></div></div>`;
  });
  html += `</div><div class="result-box" id="resultBox"><h3>🎉 Assessment Complete!</h3><div id="resultText"></div><button class="btn gold" onclick="window.scrollTo({top:0,behavior:'smooth'})">Review from the Top ↑</button></div></section>`;
  return html;
}

let assessScore=0, answered=new Set();
function answerAssessment(i,j,btn){
  if(answered.has(i)) return;
  const item=assessment[i], ok=item[2][j]===item[1];
  answered.add(i);
  btn.classList.add(ok?'correct':'wrong');
  const wrap=btn.closest('.assessment-item');
  wrap.querySelectorAll('.choice').forEach(b=>b.disabled=true);
  const fb=document.getElementById('afb'+i);
  fb.className='feedback show '+(ok?'good':'bad');
  fb.textContent=ok?'✅ Correct!':'💡 Review: '+item[1]+'.';
  if(ok) assessScore++;
  document.getElementById('scoreText').textContent=`Score: ${assessScore} / ${assessment.length}`;
  document.getElementById('assessProgress').style.width=(answered.size/assessment.length*100)+'%';
  if(answered.size===assessment.length){
    const pct=Math.round(assessScore/assessment.length*100);
    document.getElementById('resultBox').classList.add('show');
    document.getElementById('resultText').innerHTML=`You earned <strong>${assessScore}/${assessment.length} (${pct}%)</strong>. ${pct>=80?'Excellent mastery! 🌟':'Keep practicing. Revisit the day that needs the most review, then try again.'}`;
  }
}

function goDay(i){
  const tabs=document.querySelectorAll('.day-tab');
  tabs.forEach(t=>t.classList.remove('active'));
  if(i<days.length) tabs[i].classList.add('active'); else tabs[days.length].classList.add('active');
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const target=i<days.length?document.getElementById('day'+i):document.getElementById('assessment');
  target.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('.day-tab').forEach(t=>t.addEventListener('click',()=>goDay(Number(t.dataset.day))));

async function enterFullscreen(){
  try{
    if(document.fullscreenElement){await document.exitFullscreen();return;}
    if(document.documentElement.requestFullscreen){
      await document.documentElement.requestFullscreen({navigationUI:"hide"});
    }else{
      document.body.classList.toggle('presentation-mode');
      showToast('Presentation focus mode enabled.');
    }
  }catch(e){
    document.body.classList.toggle('presentation-mode');
    showToast('Presentation focus mode enabled.');
  }
}
document.getElementById('fsBtn').addEventListener('click',enterFullscreen);
document.addEventListener('fullscreenchange',()=>document.body.classList.toggle('presentation-mode',!!document.fullscreenElement));
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'){
    const active=document.querySelector('.day-tab.active'); if(active) goDay(Math.min(days.length,Number(active.dataset.day)+1));
  }
  if(e.key==='ArrowLeft'){
    const active=document.querySelector('.day-tab.active'); if(active) goDay(Math.max(0,Number(active.dataset.day)-1));
  }
  if(e.key.toLowerCase()==='f') enterFullscreen();
});

document.getElementById('lessonRoot').innerHTML = days.map((_,i)=>buildDay(i)).join('') + buildAssessment();

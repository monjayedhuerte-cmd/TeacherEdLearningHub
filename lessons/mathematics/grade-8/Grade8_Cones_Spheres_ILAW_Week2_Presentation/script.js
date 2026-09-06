const DAYS = [
{
  day:1,
  title:"Discovering the Cone",
  focus:"Parts, dimensions, volume, and the cylinder connection",
  slides:[
    {
      ilaw:"I — INTRODUCE", title:"Welcome, Volume Explorers! 🚀",
      html:`<p class="subtitle">Today we begin with a simple question: <b>How much space can a cone hold?</b></p>
      <div class="big-idea">Look around: ice-cream cones, party hats, funnels, road cones, and some containers have a cone-like shape.</div>
      <div class="question-box"><p class="q">Think first: If a cone is filled with water, what are we measuring?</p>
      <div class="choice-row">
        <button class="choice-btn" onclick="answerChoice(this,true,'d1s1')">The amount of space inside</button>
        <button class="choice-btn" onclick="answerChoice(this,false,'d1s1')">The outside color</button>
        <button class="choice-btn" onclick="answerChoice(this,false,'d1s1')">Only its height</button>
      </div><p id="d1s1" class="feedback"></p></div>`
    },
    {
      ilaw:"L — LEARN", title:"Know the Parts of a Cone",
      html:`<div class="slide-grid">
      <div class="info-card"><strong>Base</strong><p>The circular face at the bottom.</p><strong>Radius (r)</strong><p>Distance from the center of the circular base to its edge.</p></div>
      <div class="info-card"><strong>Vertex</strong><p>The pointed top of the cone.</p><strong>Height (h)</strong><p>The <b>perpendicular</b> distance from the vertex to the base.</p></div>
      </div>
      <div class="big-idea"><b>Important:</b> Volume uses the perpendicular height, not the slant height.</div>
      <div class="question-box"><p class="q">If the diameter is 14 cm, what is the radius?</p>
      <div class="choice-row">
      <button class="choice-btn" onclick="answerChoice(this,true,'d1s2')">7 cm</button>
      <button class="choice-btn" onclick="answerChoice(this,false,'d1s2')">14 cm</button>
      <button class="choice-btn" onclick="answerChoice(this,false,'d1s2')">28 cm</button>
      </div><p id="d1s2" class="feedback"></p></div>`
    },
    {
      ilaw:"L — LEARN", title:"Where Does Cone Volume Come From?",
      html:`<p class="subtitle">A cone and a cylinder can have the <b>same circular base</b> and the <b>same height</b>.</p>
      <div class="example-box"><b>Imagine filling a matching cylinder and cone with the same material.</b><br>
      Repeated comparison shows that about <b>three cone-fulls</b> are needed to fill the cylinder.</div>
      <div class="formula">V<sub>cone</sub> = ⅓ V<sub>cylinder</sub></div>
      <p>Since the cylinder volume is <b>B × h</b>, where B is base area:</p>
      <div class="formula">V = ⅓Bh</div>
      <p>For a circular base, <b>B = πr²</b>. Therefore:</p>
      <div class="formula">V = ⅓πr²h</div>`
    },
    {
      ilaw:"A — APPLY", title:"Let's Calculate a Cone",
      html:`<div class="example-box"><b>Example:</b> r = 3 cm, h = 10 cm, use π = 3.14.</div>
      <div class="steps">
        <div>Write the formula: V = ⅓πr²h</div>
        <div>Substitute: V = ⅓(3.14)(3²)(10)</div>
        <div>Square the radius: 3² = 9</div>
        <div>Multiply: V = 94.2 cm³</div>
      </div>
      <div class="question-box"><p class="q">Why do we write cm³ instead of cm?</p>
      <div class="choice-row"><button class="choice-btn" onclick="answerChoice(this,true,'d1s4')">Volume measures 3-dimensional space</button>
      <button class="choice-btn" onclick="answerChoice(this,false,'d1s4')">Because the number is large</button></div>
      <p id="d1s4" class="feedback"></p></div>`
    },
    {
      ilaw:"W — WRAP-UP", title:"Day 1 Exit Ticket 🎟️",
      html:`<p class="subtitle">Before leaving today's lesson, complete the three statements.</p>
      <div class="info-card"><b>1.</b> The radius is half the __________.</div>
      <div class="info-card"><b>2.</b> Cone volume is __________ of the matching cylinder's volume.</div>
      <div class="info-card"><b>3.</b> The formula is V = __________.</div>
      <button class="reveal" onclick="toggleReveal('d1rev')">Reveal Answers</button>
      <div id="d1rev" class="hidden-answer">1. diameter &nbsp; • &nbsp; 2. one-third &nbsp; • &nbsp; 3. ⅓πr²h</div>`
    }
  ]
},
{
  day:2,
  title:"Deriving the Cone Formula",
  focus:"Inductive discovery of V = ⅓πr²h",
  slides:[
    {ilaw:"I — INTRODUCE",title:"Can We Predict the Formula? 🔎",html:`<p class="subtitle">Do not memorize yet. Let's <b>discover</b> why the formula has ⅓.</p>
      <div class="question-box"><p class="q">A cylinder has the same base and height as a cone. Which is larger?</p>
      <div class="choice-row"><button class="choice-btn" onclick="answerChoice(this,true,'d2s1')">The cylinder</button><button class="choice-btn" onclick="answerChoice(this,false,'d2s1')">The cone</button><button class="choice-btn" onclick="answerChoice(this,false,'d2s1')">They are always equal</button></div><p id="d2s1" class="feedback"></p></div>`},
    {ilaw:"L — LEARN",title:"Step 1: Start With What We Know",html:`<div class="big-idea">For any prism-like solid with a constant cross-section, volume can be understood as <b>base area × height</b>.</div>
      <p>A cylinder has a circular base. The area of that base is:</p><div class="formula">B = πr²</div>
      <p>So the matching cylinder has:</p><div class="formula">V<sub>cyl</sub> = πr²h</div>`},
    {ilaw:"L — LEARN",title:"Step 2: Compare Cone and Cylinder",html:`<p class="subtitle">Inductive reasoning uses repeated observations to identify a pattern.</p>
      <div class="steps"><div>Use a cone and cylinder with the same radius and height.</div><div>Fill the cone and transfer its contents into the cylinder.</div><div>After repeated trials, about three equal cone volumes fill the cylinder.</div><div>Therefore, one cone is <b>one-third</b> of the cylinder.</div></div>
      <div class="formula">V<sub>cone</sub> = ⅓V<sub>cyl</sub></div>`},
    {ilaw:"L — LEARN",title:"Step 3: Substitute the Cylinder Formula",html:`<div class="formula">V<sub>cone</sub> = ⅓V<sub>cyl</sub></div>
      <p>Replace V<sub>cyl</sub> with πr²h:</p><div class="formula">V = ⅓(πr²h)</div>
      <p>So the final formula is:</p><div class="formula">V = ⅓πr²h</div>
      <div class="big-idea"><b>Meaning:</b> base area × height gives the matching cylinder volume; the cone takes one-third of that amount.</div>`},
    {ilaw:"A — APPLY",title:"Formula Detective",html:`<div class="question-box"><p class="q">A cone has B = 20 cm² and h = 9 cm. What is V?</p>
      <input id="d2input" class="number-input" type="number" placeholder="cm³">
      <button class="primary-btn" onclick="checkNumber('d2input',60,'d2fb')">Check</button><p id="d2fb" class="feedback"></p></div>
      <div class="example-box"><b>Hint:</b> Use V = ⅓Bh.</div>`},
    {ilaw:"W — WRAP-UP",title:"Explain It in Your Own Words",html:`<p class="subtitle">A strong mathematician can explain a formula, not just recite it.</p>
      <div class="question-box"><p class="q">Complete: “The ⅓ in the cone formula appears because…”</p>
      <button class="reveal" onclick="toggleReveal('d2rev')">Reveal a Model Explanation</button>
      <div id="d2rev" class="hidden-answer">A cone with the same base and height as a cylinder has one-third the cylinder's volume. Since the cylinder is πr²h, the cone is ⅓πr²h.</div></div>`}
  ]
},
{
  day:3,
  title:"Discovering the Sphere",
  focus:"Sphere volume and the cylinder relationship",
  slides:[
    {ilaw:"I — INTRODUCE",title:"The Sphere Challenge ⚽",html:`<p class="subtitle">A sphere has no flat base like a cone. So how can we find its volume?</p>
      <div class="big-idea">Think of a ball, marble, globe, or orange. We need a relationship with a solid whose volume we already know.</div>
      <div class="question-box"><p class="q">Which cylinder is naturally connected to a sphere of radius r?</p>
      <div class="choice-row"><button class="choice-btn" onclick="answerChoice(this,false,'d3s1')">Radius 2r, height r</button><button class="choice-btn" onclick="answerChoice(this,true,'d3s1')">Radius r, height 2r</button><button class="choice-btn" onclick="answerChoice(this,false,'d3s1')">Radius 2r, height 2r</button></div><p id="d3s1" class="feedback"></p></div>`},
    {ilaw:"L — LEARN",title:"Step 1: Build a Matching Cylinder",html:`<p class="subtitle">Imagine a sphere of radius <b>r</b> inside a cylinder.</p>
      <div class="slide-grid"><div class="info-card"><strong>Cylinder radius:</strong><p>r</p><strong>Cylinder height:</strong><p>2r</p></div>
      <div class="info-card"><strong>Cylinder volume:</strong><p>V = πr²(2r)</p><strong>So:</strong><p>V = 2πr³</p></div></div>
      <div class="big-idea">The cylinder is exactly as wide as the sphere and exactly twice the sphere's radius in height.</div>`},
    {ilaw:"L — LEARN",title:"Step 2: The Sphere–Cylinder Relationship",html:`<p class="subtitle">A classic volume comparison gives the sphere a <b>two-thirds</b> relationship with this matching cylinder.</p>
      <div class="formula">V<sub>sphere</sub> = ⅔V<sub>cylinder</sub></div>
      <p>Substitute V<sub>cylinder</sub> = 2πr³:</p>
      <div class="formula">V = ⅔(2πr³)</div>
      <p>Multiply the factors:</p><div class="formula">V = ⁴⁄₃πr³</div>`},
    {ilaw:"L — LEARN",title:"Why Is the Radius Cubed?",html:`<p>Look at the matching cylinder:</p>
      <div class="steps"><div>Base area contains r² because the circular area is πr².</div><div>The height is 2r, which adds another factor of r.</div><div>Therefore r² × r = r³.</div></div>
      <div class="big-idea"><b>Remember:</b> a 3-dimensional volume naturally uses cubic units, and the sphere formula contains r³.</div>`},
    {ilaw:"A — APPLY",title:"Quick Sphere Check",html:`<div class="question-box"><p class="q">If r = 3 cm and π = 3.14, which answer is closest?</p>
      <div class="choice-row"><button class="choice-btn" onclick="answerChoice(this,false,'d3s5')">28.26 cm³</button><button class="choice-btn" onclick="answerChoice(this,false,'d3s5')">84.78 cm³</button><button class="choice-btn" onclick="answerChoice(this,true,'d3s5')">113.04 cm³</button></div><p id="d3s5" class="feedback"></p></div>
      <div class="example-box">V = ⁴⁄₃(3.14)(3³) = 113.04 cm³.</div>`},
    {ilaw:"W — WRAP-UP",title:"Two Formulas, Two Ideas",html:`<div class="slide-grid"><div class="info-card"><strong>Cone</strong><p class="formula">V = ⅓πr²h</p><p>One-third of a matching cylinder.</p></div>
      <div class="info-card"><strong>Sphere</strong><p class="formula">V = ⁴⁄₃πr³</p><p>Two-thirds of a cylinder with radius r and height 2r.</p></div></div>`}
  ]
},
{
  day:4,
  title:"Calculate & Solve",
  focus:"Substitution, computation, units, and real-life problems",
  slides:[
    {ilaw:"I — INTRODUCE",title:"Math in the Real World 🌎",html:`<p class="subtitle">Volume helps us answer practical questions: How much can a container hold? How much material is needed? How much space does an object occupy?</p>
      <div class="question-box"><p class="q">Which information must you identify before choosing a volume formula?</p>
      <div class="choice-row"><button class="choice-btn" onclick="answerChoice(this,true,'d4s1')">The solid and its dimensions</button><button class="choice-btn" onclick="answerChoice(this,false,'d4s1')">Only the largest number</button><button class="choice-btn" onclick="answerChoice(this,false,'d4s1')">The object's color</button></div><p id="d4s1" class="feedback"></p></div>`},
    {ilaw:"L — LEARN",title:"The 6-Step Volume Routine",html:`<div class="steps"><div><b>Identify</b> the solid.</div><div><b>Check</b> whether the given measurement is radius or diameter.</div><div><b>Choose</b> the correct formula.</div><div><b>Substitute</b> values carefully.</div><div><b>Calculate</b> and round only when appropriate.</div><div><b>Write</b> cubic units and check whether the answer is reasonable.</div></div>`},
    {ilaw:"A — APPLY",title:"Guided Example: Cone",html:`<div class="example-box"><b>Problem:</b> A cone-shaped container has diameter 10 cm and height 12 cm. Find its volume using π = 3.14.</div>
      <div class="steps"><div>d = 10, so r = 5 cm.</div><div>V = ⅓πr²h.</div><div>V = ⅓(3.14)(5²)(12).</div><div>V = <b>314 cm³</b>.</div></div>
      <div class="question-box"><p class="q">What common mistake should we avoid?</p><div class="choice-row"><button class="choice-btn" onclick="answerChoice(this,true,'d4s3')">Using 10 as r instead of changing d to r</button><button class="choice-btn" onclick="answerChoice(this,false,'d4s3')">Writing the unit</button></div><p id="d4s3" class="feedback"></p></div>`},
    {ilaw:"A — APPLY",title:"Guided Example: Sphere",html:`<div class="example-box"><b>Problem:</b> A spherical ball has diameter 12 cm. Find its volume using π = 3.14.</div>
      <div class="steps"><div>r = 12 ÷ 2 = 6 cm.</div><div>V = ⁴⁄₃πr³.</div><div>V = ⁴⁄₃(3.14)(6³).</div><div>V ≈ <b>904.32 cm³</b>.</div></div>`},
    {ilaw:"A — APPLY",title:"Your Turn! 🎯",html:`<div class="question-box"><p class="q">A cone has r = 4 cm and h = 6 cm. Use π = 3.14. What is the volume?</p>
      <input id="d4input" class="number-input" type="number" step="0.01" placeholder="cm³">
      <button class="primary-btn" onclick="checkNumber('d4input',100.48,'d4fb',0.5)">Check Answer</button>
      <p id="d4fb" class="feedback"></p></div>
      <div class="example-box">Show your solution on paper before checking.</div>`},
    {ilaw:"W — WRAP-UP",title:"Reasonableness Check",html:`<p class="subtitle">A calculated answer is not finished until you ask whether it makes sense.</p>
      <div class="question-box"><p class="q">A cone and cylinder have the same r and h. If the cylinder is 300 cm³, the cone should be:</p>
      <div class="choice-row"><button class="choice-btn" onclick="answerChoice(this,false,'d4s6')">300 cm³</button><button class="choice-btn" onclick="answerChoice(this,true,'d4s6')">100 cm³</button><button class="choice-btn" onclick="answerChoice(this,false,'d4s6')">900 cm³</button></div><p id="d4s6" class="feedback"></p></div>`}
  ]
},
{
  day:5,
  title:"Review, Explain & Master",
  focus:"Mixed practice, formula recall, explanation, and mastery",
  slides:[
    {ilaw:"I — INTRODUCE",title:"Beat the Formula Challenge! 🏆",html:`<p class="subtitle">You have one mission today: <b>understand the formulas well enough to explain them to someone else.</b></p>
      <div class="slide-grid"><div class="info-card"><strong>Cone</strong><p>Think: <b>one-third of a matching cylinder</b>.</p></div><div class="info-card"><strong>Sphere</strong><p>Think: <b>two-thirds of a cylinder with height 2r</b>.</p></div></div>`},
    {ilaw:"L — LEARN",title:"Formula Memory Map",html:`<div class="slide-grid"><div class="info-card"><strong>CONES</strong><p>Base area = πr²</p><p>Matching cylinder = πr²h</p><p>Take ⅓ → <b>V = ⅓πr²h</b></p></div>
      <div class="info-card"><strong>SPHERES</strong><p>Matching cylinder = πr²(2r) = 2πr³</p><p>Take ⅔ → <b>V = ⁴⁄₃πr³</b></p></div></div>
      <div class="big-idea">If you forget a formula, rebuild the relationship instead of guessing.</div>`},
    {ilaw:"A — APPLY",title:"Mixed Challenge 1",html:`<div class="question-box"><p class="q">A sphere has r = 5 cm. Using π = 3.14, which is closest?</p>
      <div class="choice-row"><button class="choice-btn" onclick="answerChoice(this,false,'d5s3')">261.67 cm³</button><button class="choice-btn" onclick="answerChoice(this,true,'d5s3')">523.33 cm³</button><button class="choice-btn" onclick="answerChoice(this,false,'d5s3')">785 cm³</button></div><p id="d5s3" class="feedback"></p></div>`},
    {ilaw:"A — APPLY",title:"Mixed Challenge 2",html:`<div class="question-box"><p class="q">A cone has diameter 14 cm and h = 9 cm. What must you do first?</p>
      <div class="choice-row"><button class="choice-btn" onclick="answerChoice(this,true,'d5s4')">Find r = 7 cm</button><button class="choice-btn" onclick="answerChoice(this,false,'d5s4')">Cube 14</button><button class="choice-btn" onclick="answerChoice(this,false,'d5s4')">Use 14 as r</button></div><p id="d5s4" class="feedback"></p></div>`},
    {ilaw:"W — WRAP-UP",title:"Teach-Back Challenge 🎤",html:`<p class="subtitle">Turn to a partner. Explain one formula without reading it.</p>
      <div class="question-box"><p class="q">Which explanation is strongest?</p>
      <div class="choice-row"><button class="choice-btn" onclick="answerChoice(this,true,'d5s5')">“I can explain the relationship that creates the formula.”</button>
      <button class="choice-btn" onclick="answerChoice(this,false,'d5s5')">“I only memorized the symbols.”</button></div><p id="d5s5" class="feedback"></p></div>
      <div class="big-idea"><b>Ready?</b> Complete the 20-item assessment below. Show your solution on paper for computation items.</div>`}
  ]
}
];

let currentDay = 0;
let currentSlide = 0;

function renderDayPicker(){
  const picker = document.getElementById("dayPicker");
  picker.innerHTML = DAYS.map((d,i)=>`
    <button class="day-btn ${i===0?'active':''}" type="button" onclick="selectDay(${i})">
      DAY ${d.day}<small>${d.title}</small>
    </button>`).join("");
}

function selectDay(index){
  currentDay=index;
  currentSlide=0;
  document.querySelectorAll(".day-btn").forEach((b,i)=>b.classList.toggle("active",i===index));
  renderSlide();
}

function renderSlide(){
  const d=DAYS[currentDay], s=d.slides[currentSlide];
  document.getElementById("slideDay").textContent=`DAY ${d.day}`;
  document.getElementById("slideILAW").textContent=s.ilaw;
  document.getElementById("slideNumber").textContent=currentSlide+1;
  document.getElementById("slideTotal").textContent=d.slides.length;
  document.getElementById("slideArea").innerHTML=`
    <article class="slide">
      <h2>${s.title}</h2>
      ${s.html}
    </article>`;
  document.getElementById("slideProgress").style.width=((currentSlide+1)/d.slides.length*100)+"%";
  document.getElementById("prevSlide").disabled=currentSlide===0;
  document.getElementById("nextSlide").textContent=currentSlide===d.slides.length-1?"Finish Day ✓":"Next →";
}

function nextSlide(){
  if(currentSlide<DAYS[currentDay].slides.length-1){currentSlide++;renderSlide();return;}
  alert(`Excellent! Day ${DAYS[currentDay].day} is complete. 🌟`);
}
function prevSlide(){if(currentSlide>0){currentSlide--;renderSlide();}}

function answerChoice(btn,correct,id){
  const fb=document.getElementById(id);
  if(!fb)return;
  fb.textContent=correct?"Correct! Great thinking. 🎉":"Not quite. Think about the relationship and try again.";
  fb.className="feedback "+(correct?"correct":"wrong");
  btn.parentElement.querySelectorAll("button").forEach(b=>b.disabled=true);
}
function toggleReveal(id){document.getElementById(id).classList.toggle("show")}
function checkNumber(inputId,expected,feedbackId,tolerance=.05){
  const value=Number(document.getElementById(inputId).value);
  const fb=document.getElementById(feedbackId);
  if(Number.isFinite(value) && Math.abs(value-expected)<=tolerance){
    fb.textContent="Correct! Excellent calculation. 🎉";
    fb.className="feedback correct";
  }else{
    fb.textContent="Not yet. Recheck the formula, substitution, and arithmetic.";
    fb.className="feedback wrong";
  }
}
function updateLabs(){
  const r=Number(document.getElementById("coneR").value);
  const h=Number(document.getElementById("coneH").value);
  const sr=Number(document.getElementById("sphereR").value);
  document.getElementById("coneROut").value=r;
  document.getElementById("coneHOut").value=h;
  document.getElementById("sphereROut").value=sr;
  document.getElementById("coneLabResult").textContent=(Math.PI*r*r*h/3).toFixed(2)+" cm³";
  document.getElementById("sphereLabResult").textContent=(4*Math.PI*sr*sr*sr/3).toFixed(2)+" cm³";
}

const QUESTIONS=[
["Which formula gives the volume of a cone?",["V=πr²h","V=⅓πr²h","V=πr²","V=2πr"],1],
["Which formula gives the volume of a sphere?",["V=πr²","V=⅓πr²h","V=⁴⁄₃πr³","V=2πr"],2],
["A cone and cylinder have the same base and height. The cone is what fraction of the cylinder?",["1/2","1/3","2/3","3"],1],
["In V=⅓Bh, what does B represent?",["Base area","Diameter","Slant height","Circumference"],0],
["A diameter of 14 cm gives a radius of:",["14 cm","28 cm","7 cm","3.5 cm"],2],
["The perpendicular distance from a cone's vertex to its base is the:",["slant height","radius","height","diameter"],2],
["What unit is appropriate for volume?",["cm","cm²","cm³","cm⁴"],2],
["In V=⅓πr²h, which quantity is squared?",["h","r","π","V"],1],
["In V=⁴⁄₃πr³, which quantity is cubed?",["r","d","π","4"],0],
["A cone has r=3 cm and h=10 cm. Using π=3.14, V is:",["94.2 cm³","282.6 cm³","47.1 cm³","31.4 cm³"],0],
["A sphere has r=3 cm. Using π=3.14, V is:",["28.26 cm³","56.52 cm³","113.04 cm³","84.78 cm³"],2],
["A cone has r=4 cm and h=6 cm. Using π=3.14, V is:",["50.24 cm³","100.48 cm³","150.72 cm³","301.44 cm³"],1],
["A sphere has r=5 cm. Using π=3.14, V is closest to:",["157.00 cm³","261.67 cm³","523.33 cm³","785.00 cm³"],2],
["Why does the cone formula contain 1/3?",["Because a matching cone has one-third the volume of its cylinder","Because every solid uses 1/3","Because radius is divided by 3","Because π=3"],0],
["A matching cylinder for a sphere of radius r has height:",["r","2r","3r","4r"],1],
["The volume of that matching cylinder is:",["πr³","2πr³","4πr³","⅓πr³"],1],
["A sphere has diameter 12 cm. Using π=3.14, its volume is:",["113.04 cm³","226.08 cm³","904.32 cm³","452.16 cm³"],2],
["If the radius of a sphere doubles, its volume becomes:",["2 times","4 times","6 times","8 times"],3],
["A cone has diameter 10 cm and h=12 cm. Its volume using π=3.14 is:",["157 cm³","314 cm³","471 cm³","628 cm³"],1],
["Which is the best volume-solving routine?",["Guess → answer","Formula → ignore units","Identify → check dimensions → formula → substitute → calculate → unit → check","Multiply all given numbers"],2]
];

function renderAssessment(){
  document.getElementById("assessmentForm").innerHTML=QUESTIONS.map((q,i)=>`
    <div class="assessment-item" id="item${i}">
      <p>${i+1}. ${q[0]}</p>
      ${q[1].map((a,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${a}</label>`).join("")}
    </div>`).join("");
}
function gradeAssessment(){
  let score=0,answered=0;
  QUESTIONS.forEach((q,i)=>{
    const picked=document.querySelector(`input[name="q${i}"]:checked`);
    const box=document.getElementById("item"+i);
    box.classList.remove("correct-item","wrong-item");
    if(picked){
      answered++;
      if(Number(picked.value)===q[2]){score++;box.classList.add("correct-item")}
      else box.classList.add("wrong-item");
    }
  });
  document.getElementById("score").textContent=score;
  let msg=score>=18?"Excellent mastery! 🏆":score>=15?"Very good! Review the missed items. 🌟":score>=11?"Good progress. Practice the formulas again. 💪":"Keep learning. Return to the presentation and Formula Lab. 📘";
  document.getElementById("scoreMessage").textContent=msg;
  document.getElementById("assessmentFeedback").textContent=`You answered ${answered}/20. Score: ${score}/20 (${Math.round(score/20*100)}%). Green items are correct; red items need review.`;
  document.getElementById("assessment").scrollIntoView({behavior:"smooth",block:"start"});
}
function resetAssessment(){
  document.getElementById("assessmentForm").reset();
  document.querySelectorAll(".assessment-item").forEach(x=>x.classList.remove("correct-item","wrong-item"));
  document.getElementById("score").textContent="0";
  document.getElementById("scoreMessage").textContent="Ready?";
  document.getElementById("assessmentFeedback").textContent="";
}

async function toggleFullscreen(){
  try{
    if(!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  }catch(e){
    alert("Full Screen could not be started here. You can also use F11 in your browser.");
  }
}
function updateFullscreenLabel(){
  const b=document.getElementById("fullscreenBtn");
  b.innerHTML=document.fullscreenElement?"⛶ <span>Exit Full Screen</span>":"⛶ <span>Full Screen</span>";
}

document.addEventListener("DOMContentLoaded",()=>{
  renderDayPicker(); renderAssessment(); renderSlide(); updateLabs();
  document.getElementById("year").textContent=new Date().getFullYear();
  document.getElementById("prevSlide").addEventListener("click",prevSlide);
  document.getElementById("nextSlide").addEventListener("click",nextSlide);
  document.getElementById("submitAssessment").addEventListener("click",gradeAssessment);
  document.getElementById("resetAssessment").addEventListener("click",resetAssessment);
  document.getElementById("fullscreenBtn").addEventListener("click",toggleFullscreen);
  document.addEventListener("fullscreenchange",updateFullscreenLabel);
  document.getElementById("menuBtn").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));
  document.querySelectorAll(".main-nav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));
  document.getElementById("coneR").addEventListener("input",updateLabs);
  document.getElementById("coneH").addEventListener("input",updateLabs);
  document.getElementById("sphereR").addEventListener("input",updateLabs);
});

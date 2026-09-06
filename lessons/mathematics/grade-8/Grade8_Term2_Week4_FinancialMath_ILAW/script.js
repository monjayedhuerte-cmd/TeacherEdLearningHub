const navLinks=[...document.querySelectorAll(".nav-link")];
const sections=[...document.querySelectorAll(".slide")];

function jumpTo(id){
  const el=document.getElementById(id);
  if(el) el.scrollIntoView({behavior:"smooth",block:"start"});
}
document.querySelectorAll("[data-jump]").forEach(btn=>btn.addEventListener("click",()=>jumpTo(btn.dataset.jump)));

document.querySelectorAll(".choice-row[data-quiz]").forEach(row=>{
  row.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click",()=>{
      row.querySelectorAll("button").forEach(b=>b.classList.remove("selected-correct","selected-wrong"));
      const good=btn.dataset.answer==="correct";
      btn.classList.add(good?"selected-correct":"selected-wrong");
      const fb=document.getElementById(row.dataset.quiz+"-feedback");
      if(fb){fb.className="feedback "+(good?"good":"bad");fb.textContent=good?"✓ Correct! Explain why to a classmate.":"✗ Not quite. Think again, then try another choice.";}
    });
  });
});

function checkInput(inputId,expected,feedbackId){
  const input=document.getElementById(inputId), fb=document.getElementById(feedbackId);
  const value=Number(input.value);
  if(input.value!=="" && Math.abs(value-expected)<0.000001){
    fb.className="feedback good";fb.textContent="✓ Correct! Great work.";
  }else{
    fb.className="feedback bad";fb.textContent="✗ Try again. Recheck the operation and units.";
  }
}

const assessment=[
 ["A worker earns ₱120 per hour for 5 hours. How much does the worker earn?",["₱500","₱600","₱620","₱720"],1],
 ["A student earns ₱900 in 6 hours. What is the hourly rate?",["₱120","₱135","₱150","₱180"],2],
 ["At ₱85 per hour, how much is earned in 8 hours?",["₱640","₱680","₱720","₱760"],1],
 ["A seller buys an item for ₱300 and sells it for ₱380. What is the result?",["₱80 loss","₱80 profit","₱680 profit","No profit/loss"],1],
 ["CP = ₱950 and SP = ₱875. What is the loss?",["₱65","₱75","₱85","₱125"],1],
 ["CP = ₱1,200 and SP = ₱1,450. What is the profit?",["₱150","₱200","₱250","₱300"],2],
 ["An item costs ₱650. A seller wants a ₱150 profit. What SP should be used?",["₱500","₱700","₱800","₱900"],2],
 ["An item with CP ₱900 is sold for ₱900. What happens?",["₱900 profit","₱900 loss","No profit or loss","Cannot determine"],2],
 ["Which is the best buy: 5 pens for ₱75 or 8 pens for ₱112?",["5 for ₱75","8 for ₱112","Same unit price","Not enough information"],1],
 ["What is the unit price of 6 notebooks for ₱150?",["₱20","₱25","₱30","₱36"],1],
 ["Which has the lower unit price: 4 items for ₱100 or 10 items for ₱270?",["4 for ₱100","10 for ₱270","Same","Neither"],0],
 ["Why should unit prices be compared when choosing a best buy?",["To compare package colors","To compare cost per unit","To choose the largest box","To avoid division"],1],
 ["A TV has a ₱5,000 down payment and 6 payments of ₱2,000. What is the total instalment cost?",["₱7,000","₱12,000","₱17,000","₱20,000"],2],
 ["A cash price is ₱15,000 and the instalment total is ₱16,200. How much more is paid?",["₱800","₱1,000","₱1,200","₱1,500"],2],
 ["A bicycle costs ₱8,500 cash or ₱1,500 down + 4×₱1,900. Which is cheaper?",["Cash","Instalment","Same cost","Cannot tell"],0],
 ["What should be calculated before judging an instalment offer?",["Monthly payment only","Down payment only","Total amount paid","Product color"],2],
 ["A bag costs ₱2,400 cash or ₱500 down + 4×₱500. What is the instalment total?",["₱2,000","₱2,400","₱2,500","₱3,000"],2],
 ["A seller buys 20 bottles for ₱600 and sells each for ₱40. What is the total selling price?",["₱800","₱600","₱400","₱1,200"],0],
 ["Using the previous item, what is the profit?",["₱100","₱150","₱200","₱400"],2],
 ["A smart buyer sees a low monthly payment. What should the buyer do next?",["Buy immediately","Calculate total cost","Ignore cash price","Choose the most expensive plan"],1]
];

function buildAssessment(){
  const form=document.getElementById("assessmentForm");
  form.innerHTML=assessment.map((q,i)=>`
    <article class="assessment-item">
      <h4>${i+1}. ${q[0]}</h4>
      <div class="assessment-options">
        ${q[1].map((opt,j)=>`<label><input type="radio" name="q${i}" value="${j}"> <span>${opt}</span></label>`).join("")}
      </div>
    </article>`).join("");
}
buildAssessment();

document.getElementById("submitAssessment").addEventListener("click",()=>{
  let score=0,answered=0;
  assessment.forEach((q,i)=>{
    const checked=document.querySelector(`input[name="q${i}"]:checked`);
    if(checked){answered++;if(Number(checked.value)===q[2])score++;}
  });
  const result=document.getElementById("assessmentResult");
  const percent=Math.round(score/assessment.length*100);
  let message=percent>=90?"Outstanding! You are ready for the next challenge.":percent>=75?"Great job! Review the items you missed and keep practicing.":percent>=60?"Good effort! Revisit the examples before trying again.":"Keep going! Review each ILAW day and try the assessment again.";
  result.classList.remove("hidden");
  result.innerHTML=`<h3>${score} / ${assessment.length}</h3><p><strong>${percent}%</strong> • ${answered} of ${assessment.length} answered.</p><p>${message}</p>`;
  result.scrollIntoView({behavior:"smooth",block:"center"});
});
document.getElementById("resetAssessment").addEventListener("click",()=>{
  document.querySelectorAll("#assessmentForm input").forEach(i=>i.checked=false);
  document.getElementById("assessmentResult").classList.add("hidden");
  window.scrollTo({top:document.getElementById("assessment").offsetTop-120,behavior:"smooth"});
});

const fullscreenBtn=document.getElementById("fullscreenBtn");
fullscreenBtn.addEventListener("click",async()=>{
  try{
    if(!document.fullscreenElement){
      await document.documentElement.requestFullscreen();
      document.body.classList.add("presentation-mode");
      fullscreenBtn.innerHTML="⛶ <span>Exit Full Screen</span>";
    }else{
      await document.exitFullscreen();
    }
  }catch(e){
    document.body.classList.toggle("presentation-mode");
    fullscreenBtn.innerHTML=document.body.classList.contains("presentation-mode")?"⛶ <span>Exit View</span>":"⛶ <span>Full Screen</span>";
  }
});
document.addEventListener("fullscreenchange",()=>{
  const active=!!document.fullscreenElement;
  document.body.classList.toggle("presentation-mode",active);
  fullscreenBtn.innerHTML=active?"⛶ <span>Exit Full Screen</span>":"⛶ <span>Full Screen</span>";
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navLinks.forEach(a=>a.classList.toggle("active",a.dataset.target===entry.target.id));
    }
  });
},{rootMargin:"-25% 0px -60% 0px",threshold:0});
sections.forEach(s=>observer.observe(s));

document.addEventListener("keydown",e=>{
  if(e.key==="ArrowRight"||e.key==="PageDown"){
    const current=sections.findIndex(s=>s.getBoundingClientRect().top>=-80 && s.getBoundingClientRect().top<window.innerHeight*.5);
    if(current>=0 && current<sections.length-1) jumpTo(sections[current+1].id);
  }
  if(e.key==="ArrowLeft"||e.key==="PageUp"){
    const current=sections.findIndex(s=>s.getBoundingClientRect().top>=-80 && s.getBoundingClientRect().top<window.innerHeight*.5);
    if(current>0) jumpTo(sections[current-1].id);
  }
});

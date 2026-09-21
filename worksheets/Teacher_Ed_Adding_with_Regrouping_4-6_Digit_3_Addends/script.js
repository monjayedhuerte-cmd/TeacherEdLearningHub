const sets = {
  A: [
    ["1,248 + 2,376 + 1,589",5213],
    ["3,456 + 1,789 + 2,678",7923],
    ["2,735 + 3,468 + 1,927",8130],
    ["4,286 + 1,759 + 2,845",8890],
    ["5,347 + 2,688 + 1,976",10011]
  ],
  B: [
    ["12,486 + 23,759 + 14,688",50933],
    ["34,675 + 18,928 + 26,749",80352],
    ["45,786 + 12,659 + 23,875",82320],
    ["56,438 + 27,695 + 14,867",99000],
    ["72,586 + 18,749 + 36,875",128210]
  ],
  C: [
    ["A school library received 12,485 books in one shipment, 23,769 in another, and 14,688 in a third shipment. How many books were received altogether?",50942],
    ["A farmer harvested 34,675 mangoes, 18,928 bananas, and 26,749 oranges. How many fruits were harvested in all?",80352],
    ["Three classes collected 45,786, 12,659, and 23,875 recyclable materials. How many items did they collect altogether?",82320],
    ["A store sold 56,438 items in January, 27,695 in February, and 14,867 in March. How many items were sold in all?",99000],
    ["A community raised ₱72,586, ₱18,749, and ₱36,875 for three projects. How much money was raised altogether?",128210]
  ],
  M: [
    ["124,568 + 235,789 + 146,875",507232],
    ["348,675 + 126,948 + 215,789",691412],
    ["456,786 + 128,659 + 237,875",823320],
    ["575,438 + 217,695 + 148,867",942000],
    ["672,586 + 118,749 + 236,875",1028210]
  ]
};

function makeNumeric(containerId, items, prefix){
  const el=document.getElementById(containerId);
  el.innerHTML=items.map((q,i)=>`
    <div class="question">
      <div class="question-number">${i+1}. ${q[0]}</div>
      <div class="math-stack">
        ${q[0].split(" + ").map((n,i)=>`<div>${i===0 ? "  " : i===q[0].split(" + ").length-1 ? "+ " : "  "}${n}</div>`).join("")}
        <div class="line">────────</div>
      </div>
      <input class="answer-input" id="${prefix}${i}" type="number" inputmode="numeric" aria-label="Answer ${i+1}">
      <div class="feedback" id="f${prefix}${i}"></div>
    </div>`).join("");
}
function makeWord(containerId, items, prefix){
  const el=document.getElementById(containerId);
  el.innerHTML=items.map((q,i)=>`
    <div class="question">
      <div class="question-number">${i+1}. ${q[0]}</div>
      <label>Answer: <input class="answer-input" id="${prefix}${i}" type="number" inputmode="numeric"></label>
      <div class="feedback" id="f${prefix}${i}"></div>
    </div>`).join("");
}
makeNumeric("practiceA",sets.A,"a");
makeNumeric("practiceB",sets.B,"b");
makeWord("practiceC",sets.C,"c");
makeNumeric("mastery",sets.M,"m");

document.getElementById("dateField").valueAsDate=new Date();

function checkGuided(){
  const answers=[23,3,2,8283], ids=["g1","g2","g3","g4"];
  const ok=ids.every((id,i)=>Number(document.getElementById(id).value.replace(/,/g,""))===answers[i]);
  const box=document.getElementById("guidedFeedback");
  box.className="feedback "+(ok?"correct":"incorrect");
  box.textContent=ok
    ?"✅ Excellent! You correctly added three 4-digit addends and regrouped."
    :"💡 Add the ones first: 8 + 9 + 6 = 23. Write 3 ones and regroup 2 tens.";
}
function collectScore(showFeedback=false){
  let correct=0, total=20;
  const groups=[["a",sets.A],["b",sets.B],["c",sets.C],["m",sets.M]];
  groups.forEach(([p,arr])=>arr.forEach((q,i)=>{
    const input=document.getElementById(p+i), fb=document.getElementById("f"+p+i);
    const ok=input && Number(String(input.value).replace(/[,\s₱]/g,''))===q[1];
    if(ok) correct++;
    if(showFeedback){
      fb.className="feedback "+(ok?"correct":"incorrect");
      fb.textContent=ok?"✅ Correct!":"❌ Not quite. Try again.";
    }
  }));
  return {correct,total};
}
function checkWorksheet(){
  const s=collectScore(true);
  const pct=Math.round(s.correct/s.total*100);
  document.getElementById("scoreDisplay").textContent=`${s.correct} / ${s.total}`;
  const name=document.getElementById("studentName").value.trim() || "Learner";
  let msg=pct>=90?"🌟 Excellent work!":pct>=80?"⭐ Great job!":pct>=70?"👍 Good work!":"💪 Keep practicing—you can do it!";
  const result=document.getElementById("result");
  result.classList.remove("hidden");
  result.innerHTML=`<h2>🎉 ${name}, you completed the worksheet!</h2><p><strong>Score: ${s.correct} / ${s.total}</strong> (${pct}%)</p><p>${msg}</p>`;
  result.scrollIntoView({behavior:"smooth",block:"center"});
}
function showAnswerKey(){
  const all=[...sets.A,...sets.B,...sets.C,...sets.M];
  document.getElementById("answers").innerHTML=`<ol>${all.map(q=>`<li><strong>${q[1]}</strong></li>`).join("")}</ol>`;
  document.getElementById("answerKey").classList.remove("hidden");
  document.getElementById("answerKey").scrollIntoView({behavior:"smooth"});
}
function resetWorksheet(){
  document.querySelectorAll("input").forEach(i=>{
    if(i.type==="radio"||i.type==="checkbox") i.checked=false;
    else if(i.type!=="date") i.value="";
  });
  document.getElementById("dateField").valueAsDate=new Date();
  document.querySelectorAll(".feedback").forEach(x=>{x.textContent="";x.className="feedback"});
  document.getElementById("scoreDisplay").textContent="0 / 20";
  document.getElementById("result").classList.add("hidden");
  document.getElementById("answerKey").classList.add("hidden");
}

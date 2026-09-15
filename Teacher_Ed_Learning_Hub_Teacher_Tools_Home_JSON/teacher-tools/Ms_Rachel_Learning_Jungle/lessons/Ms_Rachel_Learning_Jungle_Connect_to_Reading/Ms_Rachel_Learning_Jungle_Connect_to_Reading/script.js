let soundOn=true;
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

function speak(text){
  if(!soundOn || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.rate=.88; u.pitch=1.04;
  speechSynthesis.speak(u);
}
function feedback(el,text,good=true){
  el.textContent=text;
  el.style.color=good?"#28733f":"#b44e3a";
}

$("#soundBtn").addEventListener("click",()=>{
  soundOn=!soundOn;
  $("#soundBtn").textContent=soundOn?"🔊 Sound":"🔇 Sound Off";
});

$$(".vocab-card").forEach(b=>b.addEventListener("click",()=>speak(b.dataset.say)));

let bookScore=0;
$$(".book").forEach(card=>{
  card.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{
    card.querySelectorAll("button").forEach(x=>x.classList.remove("correct","wrong"));
    const result=card.querySelector(".book-result");
    if(btn.dataset.choice===card.dataset.answer){
      btn.classList.add("correct");
      result.textContent="✅ Correct!";
      result.style.color="#28733f";
      bookScore++;
      $("#bookScore").textContent=`🌟 Score: ${bookScore} / 10`;
      speak("Correct!");
    }else{
      btn.classList.add("wrong");
      result.textContent="❌ Try again!";
      result.style.color="#b44e3a";
      speak("Try again.");
    }
  }));
});

const visuals=[
 {text:"Mia stood under a big red umbrella. Rain fell around her as she waited for the yellow school bus.",choices:[["☂️ Big red umbrella + rain + yellow bus",true],["☀️ Sunny beach + blue boat",false],["🏀 Gym + basketball + red door",false]]},
 {text:"The boy opened the wooden door and walked into a quiet library. Tall shelves were filled with colorful books.",choices:[["📚 Wooden door + quiet library + tall colorful books",true],["☂️ Red umbrella + rain + yellow bus",false],["🐕 Brown dog + green grass + blue ball",false]]},
 {text:"A small brown dog ran across green grass. It jumped over a puddle and chased a blue ball.",choices:[["🐕 Brown dog + green grass + puddle + blue ball",true],["📚 Library + tall shelves + books",false],["🚌 Yellow bus + umbrella + rain",false]]}
];
function loadVisual(i){
  $("#visualText").textContent="“"+visuals[i].text+"”";
  $("#visualChoices").innerHTML=visuals[i].choices.map(c=>`<button data-correct="${c[1]}">${c[0]}</button>`).join("");
  $$("#visualChoices button").forEach(b=>b.addEventListener("click",()=>{
    $$("#visualChoices button").forEach(x=>x.classList.remove("correct","wrong"));
    if(b.dataset.correct==="true"){
      b.classList.add("correct");
      feedback($("#visualFeedback"),"🎨 Excellent! You used details from the sentence to make a picture in your mind.");
    }else{
      b.classList.add("wrong");
      feedback($("#visualFeedback"),"Look closely. Which details are actually in the sentence?",false);
    }
  }));
}
loadVisual(0);
$$(".visual-tab").forEach(t=>t.addEventListener("click",()=>{
  $$(".visual-tab").forEach(x=>x.classList.remove("active"));
  t.classList.add("active");
  loadVisual(+t.dataset.story);
}));

$$(".place-card").forEach(card=>{
  card.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{
    card.querySelectorAll("button").forEach(x=>x.classList.remove("correct","wrong"));
    const result=card.querySelector(".place-result");
    if(btn.dataset.place===card.dataset.answer){
      btn.classList.add("correct"); result.textContent="✅ Correct!";
    }else{
      btn.classList.add("wrong"); result.textContent="❌ Look again!";
    }
  }));
});

$$(".spell-card").forEach(card=>{
  card.querySelector("button").addEventListener("click",()=>{
    const input=card.querySelector("input"), out=card.querySelector("span");
    const typed=input.value.trim().toLowerCase().replace(/\s+/g,"");
    if(typed===input.dataset.answer){
      input.classList.add("correct"); input.classList.remove("wrong");
      out.textContent="✅ Correct spelling!";
      out.style.color="#28733f";
    }else{
      input.classList.add("wrong"); input.classList.remove("correct");
      out.textContent="❌ Check the letters and try again.";
      out.style.color="#b44e3a";
    }
  });
});

$$(".talk-grid button").forEach(b=>b.addEventListener("click",()=>{
  $("#talkDisplay").textContent="💬 "+b.dataset.talk;
  speak(b.dataset.talk);
}));

$("#storyReminder").addEventListener("click",()=>{
  $("#storyReminder").textContent="📖 Read your Maria Is Lost book with Ms. Rachel";
  speak("I am ready to read Maria Is Lost.");
});

$("#readAloud").addEventListener("click",()=>{
  speak("School is a place for learning and fun. At school, children learn in many places. They can read books in the library, learn with classmates in the classroom, and play on the playground. Each place helps children learn and enjoy school.");
});

$$(".main-choices button").forEach(b=>b.addEventListener("click",()=>{
  $$(".main-choices button").forEach(x=>x.classList.remove("correct","wrong"));
  if(b.dataset.correct==="true"){
    b.classList.add("correct");
    feedback($("#mainFeedback"),"🌟 Great job! You found what the whole text is mostly about.");
  }else{
    b.classList.add("wrong");
    feedback($("#mainFeedback"),"Think about ALL the places and what children do there.",false);
  }
}));

$$(".sentence-item").forEach(item=>{
  item.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{
    item.querySelectorAll("button").forEach(x=>x.classList.remove("correct","wrong"));
    const correct=btn.textContent===item.dataset.correct;
    const out=item.querySelector("span");
    if(correct){btn.classList.add("correct");out.textContent="✅ Correct!";out.style.color="#28733f";}
    else{btn.classList.add("wrong");out.textContent="❌ Try again.";out.style.color="#b44e3a";}
  }));
});

$("#bigIdeaRead").addEventListener("click",()=>{
  speak("I learn at school. I have fun at school.");
});

$("#finishBtn").addEventListener("click",()=>{
  $("#finishMessage").textContent="🎉 Congratulations, Explorer! You completed the Reading Mission with Ms. Rachel. Keep reading, thinking, talking, and growing!";
  speak("Congratulations, Explorer! You completed the Reading Mission with Ms. Rachel.");
});

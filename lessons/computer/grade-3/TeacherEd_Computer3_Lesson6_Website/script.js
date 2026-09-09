const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const KEY="teacherEdComputer3Lesson6";
let state=JSON.parse(localStorage.getItem(KEY)||'{"completed":[],"stars":0,"badges":[],"missed":[],"best":0}');
const save=()=>{localStorage.setItem(KEY,JSON.stringify(state));updateProgress()};
const toast=(msg)=>{const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window._toast);window._toast=setTimeout(()=>t.classList.remove("show"),2200)};
function updateProgress(){
  const total=9, done=new Set(state.completed).size, pct=Math.round(done/total*100);
  $("#progressBar").style.width=pct+"%";$("#progressText").textContent=pct+"%";
  $("#stars").textContent=state.stars;$("#badges").textContent=state.badges.length;
  $("#level").textContent=Math.min(5,Math.max(1,Math.floor(pct/20)+1));
}
function complete(id,stars=1){if(!state.completed.includes(id)){state.completed.push(id);state.stars+=stars;save();toast("Great job! ⭐ +"+stars)}else updateProgress()}
function showSection(id){
  $$(".lesson-section").forEach(s=>s.classList.toggle("active-section",s.id===id));
  $$(".map-item").forEach(b=>b.classList.toggle("active",b.dataset.section===id));
  document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
}
$$(".map-item").forEach(b=>b.addEventListener("click",()=>showSection(b.dataset.section)));
$$(".next-btn").forEach(b=>b.addEventListener("click",()=>showSection(b.dataset.next)));

let soundOn=true;
function beep(ok=true){if(!soundOn)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.value=ok?660:220;g.gain.value=.035;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.12)}catch(e){}}
$("#soundBtn").addEventListener("click",()=>{soundOn=!soundOn;$("#soundBtn").textContent=soundOn?"🔊 Sound On":"🔇 Sound Off"});
$("#resetBtn").addEventListener("click",()=>{if(confirm("Reset all lesson progress, stars, badges, and saved mistakes?")){localStorage.removeItem(KEY);location.reload()}});

function setupChoiceCards(){
  $$(".choices").forEach(group=>{
    group.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{
      const fb=$("#"+group.dataset.q+"-feedback");
      group.querySelectorAll("button").forEach(x=>x.disabled=true);
      if(btn.dataset.answer==="correct"){btn.classList.add("correct");fb.className="feedback good";fb.textContent="✓ Excellent! That is the best answer.";beep(true);complete(group.dataset.q)}
      else{btn.classList.add("wrong");fb.className="feedback try";fb.textContent="💡 Let's think again. Remember the key idea from the lesson.";beep(false)}
    }))
  })
}
setupChoiceCards();

let modelStep=0;
const modelSteps=$$(".step");
function renderModel(){modelSteps.forEach((s,i)=>s.classList.toggle("active",i===modelStep));$("#modelPrev").disabled=modelStep===0;$("#modelNext").textContent=modelStep===modelSteps.length-1?"✓ Model Complete":"Show Next Step →"}
$("#modelNext").addEventListener("click",()=>{if(modelStep<modelSteps.length-1){modelStep++;renderModel()}else complete("model",1)});
$("#modelPrev").addEventListener("click",()=>{if(modelStep>0){modelStep--;renderModel()}});renderModel();

const guidedQs=[
 {q:"Which term names the software that manages computer hardware and software resources?",a:"Operating system",opts:["Operating system","Keyboard","Throughput"],hint:"It is the main system software that manages resources."},
 {q:"Which term means performing two or more tasks at the same time?",a:"Multitasking",opts:["Multitasking","Platform","Taskbar"],hint:"Think: MULTI = many; TASKING = doing tasks."},
 {q:"Which system-software type helps clean/rearrange files and fix problems?",a:"Utility program",opts:["Utility program","Monitor","WIMP"],hint:"It is a helper program for maintaining the computer."},
 {q:"What is the amount of work a computer can do at a certain time called?",a:"Throughput",opts:["Throughput","Platform","Window"],hint:"The lesson connects this term with the amount of work done."}
];
const practiceQs=[
 {q:"Which is a type of operating system described in the lesson?",a:"Graphic-based operating system",opts:["Graphic-based operating system","Printer-based operating system","Keyboard-based hardware"],hint:"It uses WIMP and a graphical user interface."},
 {q:"Which interface concept uses windows, icons, menus, and pointers/pull-down menus?",a:"WIMP",opts:["WIMP","POST","ROM"],hint:"Look at the first letters of Windows, Icons, Menus, Pointers."},
 {q:"Which operating system example was popular during the 1970s and 1980s?",a:"MS-DOS",opts:["MS-DOS","Mac OS","Linux"],hint:"It uses typed text commands."},
 {q:"What do we call the computer architecture that uses a particular operating system?",a:"Platform",opts:["Platform","Throughput","Taskbar"],hint:"It helps identify what software will run on the computer."},
 {q:"What happens when a computer starts and checks memory and attached external devices?",a:"Power-on self-test (POST)",opts:["Power-on self-test (POST)","Multitasking","Taskbar"],hint:"The abbreviation is POST."}
];
function initPractice(prefix,data){
 let i=0,score=0,answered=false,usedHint=false;
 const box=$("#"+prefix+"Box"),fb=$("#"+prefix+"Feedback"),hint=$("#"+prefix+"Hint"),hintText=$("#"+prefix+"HintText"),next=$("#"+prefix+"Next"),prog=$("#"+prefix+"Progress");
 function render(){const x=data[i];answered=false;usedHint=false;next.disabled=true;hintText.textContent="";fb.className="feedback";fb.textContent="";box.innerHTML=`<div class="mini-label">QUESTION ${i+1} OF ${data.length}</div><h3>${x.q}</h3><div class="question-options">${x.opts.map((o,n)=>`<button data-o="${n}">${o}</button>`).join("")}</div>`;prog.textContent=`${i+1} / ${data.length}`;box.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>answer(+b.dataset.o)))}
 function answer(n){if(answered)return;answered=true;const x=data[i],choice=x.opts[n];box.querySelectorAll("button").forEach(b=>b.disabled=true);if(choice===x.a){score++;fb.className="feedback good";fb.textContent="✓ That's right! Good thinking.";beep(true);next.disabled=false;state.stars+=usedHint?0:1;save()}else{fb.className="feedback try";fb.textContent="💡 Let's think again. Try the idea in the hint.";beep(false);state.missed.push({section:prefix,q:x.q,a:x.a});state.missed=state.missed.slice(-30);save();next.disabled=false}if(i===data.length-1)next.textContent="Finish Practice ✓"}
 hint.addEventListener("click",()=>{hintText.textContent="💡 "+data[i].hint;usedHint=true});
 next.addEventListener("click",()=>{if(i<data.length-1){i++;render()}else{complete(prefix,2);toast(`Practice complete! ${score}/${data.length} correct.`);}})
 render();
}
initPractice("guided",guidedQs);initPractice("practice",practiceQs);

const quickQs=[
 {q:"Which is system software?",a:"Operating system",opts:["Operating system","Keyboard","Monitor"]},
 {q:"Which helps maintain files and fix computer problems?",a:"Utility program",opts:["Utility program","Mouse","Window"]},
 {q:"Which term means doing two or more tasks at the same time?",a:"Multitasking",opts:["Multitasking","Platform","POST"]},
 {q:"Which is a command-driven OS example?",a:"MS-DOS",opts:["MS-DOS","Mac OS","WIMP"]}
];
let qi=0,qscore=0;
function renderQuick(){
  const x=quickQs[qi];
  $("#quickBox").textContent=x.q;
  $("#quickOptions").innerHTML=x.opts.map(o=>`<button>${o}</button>`).join("");
  $("#quickFeedback").textContent="";
  $("#quickFeedback").className="feedback";
  $("#quickOptions").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
    const ok=b.textContent===x.a;
    $("#quickOptions").querySelectorAll("button").forEach(z=>z.disabled=true);
    b.classList.add(ok?"correct":"wrong");
    $("#quickFeedback").className="feedback "+(ok?"good":"try");
    $("#quickFeedback").textContent=ok?"✓ Great!":"💡 Let's think again: "+x.a;
    beep(ok);
    if(ok){qscore++;state.stars++;save()}
    else{state.missed.push({section:"quick",q:x.q,a:x.a});save()}
    $("#quickScore").textContent=qscore;
    $("#quickTotal").textContent=quickQs.length;
    setTimeout(()=>{qi=(qi+1)%quickQs.length;renderQuick()},700);
  }));
}
renderQuick();

const pairs=[
 ["System software","Programs that manage, maintain, and control the computer."],
 ["Operating system","System software that manages hardware/software resources."],
 ["Utility program","Helps clean/rearrange files and fix problems."],
 ["Multitasking","Performing two or more tasks at the same time."]
];
let matchCards=[],selected=null,matched=0;
function initMatch(){matchCards=[];pairs.forEach((p,i)=>{matchCards.push({id:i,type:"word",text:p[0]});matchCards.push({id:i,type:"meaning",text:p[1]})});matchCards.sort(()=>Math.random()-.5);$("#matchGrid").innerHTML=matchCards.map((c,i)=>`<button class="match-card" data-i="${i}">${c.text}</button>`).join("");$$(".match-card").forEach(b=>b.addEventListener("click",()=>matchClick(+b.dataset.i)))}
function matchClick(i){const cards=$$(".match-card"),b=cards[i];if(b.classList.contains("matched"))return;if(selected===null){selected=i;b.classList.add("selected");return}if(selected===i)return;const a=matchCards[selected],c=matchCards[i];if(a.id===c.id&&a.type!==c.type){cards[selected].classList.add("matched");b.classList.add("matched");matched++;$("#matchFeedback").className="feedback good";$("#matchFeedback").textContent="✓ Match!";beep(true);state.stars++;save();if(matched===pairs.length){complete("match",2);toast("All matches found! 🧩")}}else{$("#matchFeedback").className="feedback try";$("#matchFeedback").textContent="💡 Not a match. Try another pair.";beep(false);cards[selected].classList.remove("selected")}selected=null}
initMatch();

const sortQs=[
 ["Operating system","os"],["Utility program","utility"],["Platform","other"],["WIMP","other"],["MS-DOS","os"],["Multitasking","other"]
];let si=0,sscore=0;
function renderSort(){const x=sortQs[si];$("#sortItem").textContent=x[0];$("#sortTotal").textContent=sortQs.length;$("#sortFeedback").textContent="";$$(".sort-groups button").forEach(b=>b.disabled=false)}
$("#sortItem").addEventListener("click",()=>{toast("Choose the group below.")});
$$(".sort-groups button").forEach(b=>b.addEventListener("click",()=>{const x=sortQs[si],ok=b.dataset.group===x[1];$$(".sort-groups button").forEach(z=>z.disabled=true);$("#sortFeedback").className="feedback "+(ok?"good":"try");$("#sortFeedback").textContent=ok?"✓ Correct group!":"💡 Let's think: "+x[0]+" belongs in the "+(x[1]==="os"?"Operating System":x[1]==="utility"?"Utility Program":"Other / Term")+" group.";beep(ok);if(ok){sscore++;state.stars++;save()}else{state.missed.push({section:"sort",q:x[0],a:x[1]});save()}$("#sortScore").textContent=sscore;setTimeout(()=>{si=(si+1)%sortQs.length;renderSort()},750)}));
renderSort();

const unlockQs=[
 {q:"What does OS stand for?",a:"Operating System",opts:["Operating System","Online Screen","Open Storage"]},
 {q:"Which type uses text commands?",a:"Command-driven",opts:["Command-driven","Graphic-based","Touch-based"]},
 {q:"What does WIMP refer to?",a:"Windows, Icons, Menus, Pointers",opts:["Windows, Icons, Menus, Pointers","Words, Images, Music, Pictures","Windows, Internet, Mouse, Printer"]},
 {q:"What helps keep files organized and problems fixed?",a:"Utility programs",opts:["Utility programs","Monitors","Keyboards"]}
];let ui=0,unlockScore=0;
function renderUnlock(){
  const x=unlockQs[ui];
  $("#unlockBox").innerHTML=`<div class="game-question">${x.q}</div>`;
  $("#unlockOptions").innerHTML=x.opts.map(o=>`<button>${o}</button>`).join("");
  $("#unlockFeedback").textContent="";
  $("#unlockOptions").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
    const ok=b.textContent===x.a;
    $("#unlockOptions").querySelectorAll("button").forEach(z=>z.disabled=true);
    b.classList.add(ok?"correct":"wrong");
    $("#unlockFeedback").className="feedback "+(ok?"good":"try");
    $("#unlockFeedback").textContent=ok?"✓ Door code accepted!":"💡 Try again on the next challenge.";
    beep(ok);
    if(ok){unlockScore++;state.stars++;save()}
    setTimeout(()=>{
      if(ui<unlockQs.length-1){ui++;renderUnlock()}
      else{$("#door").textContent="🔓";complete("unlock",3);toast("The lab is unlocked! 🗝️")}
    },650);
  }));
}

renderUnlock();

$$(".game-tab").forEach(t=>t.addEventListener("click",()=>{$$(".game-tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");$$(".game-panel").forEach(p=>p.classList.remove("active-game"));$("#game-"+t.dataset.game).classList.add("active-game")}));

const spiralQs=[
 {q:"Which one is hardware?",a:"Keyboard",opts:["Keyboard","Operating system","Utility program"]},
 {q:"Which term means the amount of work a computer can do at a certain time?",a:"Throughput",opts:["Throughput","Platform","WIMP"]},
 {q:"Which OS type uses a graphical user interface with icons?",a:"Graphic-based",opts:["Graphic-based","Command-driven","Utility-based"]},
 {q:"Which program is mainly used to manage, maintain, and control the computer?",a:"System software",opts:["System software","A printer","A mouse"]}
];let spi=0,sps=0;
function renderSpiral(){
  const x=spiralQs[spi];
  $("#spiralBox").innerHTML=`<div class="mini-label">MIXED QUESTION ${spi+1} OF ${spiralQs.length}</div><h3>${x.q}</h3>`;
  $("#spiralOptions").innerHTML=x.opts.map(o=>`<button>${o}</button>`).join("");
  $("#spiralFeedback").textContent="";
  $("#spiralOptions").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
    const ok=b.textContent===x.a;
    $("#spiralOptions").querySelectorAll("button").forEach(z=>z.disabled=true);
    b.classList.add(ok?"correct":"wrong");
    $("#spiralFeedback").className="feedback "+(ok?"good":"try");
    $("#spiralFeedback").textContent=ok?"✓ Nice retrieval!":"💡 Remember: "+x.a;
    beep(ok);
    if(ok){sps++;state.stars++;save()}
    else{state.missed.push({section:"spiral",q:x.q,a:x.a});save()}
    setTimeout(()=>{
      if(spi<spiralQs.length-1){spi++;renderSpiral()}
      else{complete("review",2);toast(`Brain Challenge complete! ${sps}/${spiralQs.length}`)}
    },650);
  }));
}

renderSpiral();

const masteryQs=[
 {q:"Which is the best description of system software?",a:"Programs that manage, maintain, and control the computer.",opts:["Programs that manage, maintain, and control the computer.","A collection of physical computer parts.","Only programs used for drawing."]},
 {q:"Which software manages hardware and software resources?",a:"Operating system",opts:["Operating system","Utility program only","Keyboard"]},
 {q:"Which activity is multitasking?",a:"Playing music while working in a document.",opts:["Playing music while working in a document.","Turning off the computer.","Cleaning the monitor with a cloth."]},
 {q:"What does throughput describe?",a:"The amount of work a computer can do at a certain time.",opts:["The amount of work a computer can do at a certain time.","The size of the monitor.","The name of a keyboard key."]},
 {q:"Which OS type uses WIMP and a graphical user interface?",a:"Graphic-based operating system",opts:["Graphic-based operating system","Command-driven operating system","Hardware operating system"]},
 {q:"Which example is command-driven?",a:"MS-DOS",opts:["MS-DOS","Mac OS","Linux"]},
 {q:"What does POST do when the computer starts?",a:"Checks memory and attached external devices.",opts:["Checks memory and attached external devices.","Creates a new keyboard.","Prints every file automatically."]},
 {q:"What is a platform in the lesson?",a:"Computer architecture that uses a particular operating system.",opts:["Computer architecture that uses a particular operating system.","A physical desk for a computer.","A type of printer ink."]},
 {q:"Which tool can help clean/rearrange files and fix problems?",a:"Utility program",opts:["Utility program","Taskbar","Monitor"]},
 {q:"Which statement about the taskbar is correct?",a:"It is an access point for programs displayed on the desktop.",opts:["It is an access point for programs displayed on the desktop.","It is the computer's processor.","It is a type of virus."]}
];
let mi=0,ms=0,masteryStarted=false,masteryMissed=[];
function startMastery(){mi=0;ms=0;masteryMissed=[];masteryStarted=true;$("#masteryIntro").classList.add("hidden");$("#results").classList.add("hidden");$("#masteryQuiz").classList.remove("hidden");renderMastery()}
function renderMastery(){
  const x=masteryQs[mi];
  $("#masteryNum").textContent=`Question ${mi+1} of ${masteryQs.length}`;
  $("#masteryLiveScore").textContent=ms;
  $("#masteryQuestion").textContent=x.q;
  $("#masteryFeedback").textContent="";
  $("#masteryFeedback").className="feedback";
  $("#masteryNext").disabled=true;
  $("#masteryNext").textContent=mi===masteryQs.length-1?"Finish Challenge ✓":"Next Question →";
  $("#masteryOptions").innerHTML=x.opts.map(o=>`<button>${o}</button>`).join("");
  $("#masteryOptions").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
    const ok=b.textContent===x.a;
    $("#masteryOptions").querySelectorAll("button").forEach(z=>z.disabled=true);
    b.classList.add(ok?"correct":"wrong");
    $("#masteryFeedback").className="feedback "+(ok?"good":"try");
    $("#masteryFeedback").textContent=ok?"✓ Excellent!":"💡 Let's think again. The best answer is: "+x.a;
    beep(ok);
    if(ok)ms++;
    else masteryMissed.push({q:x.q,a:x.a});
    $("#masteryLiveScore").textContent=ms;
    $("#masteryNext").disabled=false;
  }));
}
$("#startMastery").addEventListener("click",startMastery);
$("#masteryNext").addEventListener("click",()=>{if(mi<masteryQs.length-1){mi++;renderMastery()}else finishMastery()});
function finishMastery(){const pct=Math.round(ms/masteryQs.length*100);state.best=Math.max(state.best,pct);state.missed=[...state.missed,...masteryMissed].slice(-50);if(pct>=90&&!state.badges.includes("Lesson Master"))state.badges.push("Lesson Master");else if(pct>=80&&!state.badges.includes("Almost There"))state.badges.push("Almost There");else if(pct>=70&&!state.badges.includes("Good Progress"))state.badges.push("Good Progress");save();complete("mastery",3);$("#masteryQuiz").classList.add("hidden");$("#results").classList.remove("hidden");$("#resultScore").textContent=pct+"%";$("#resultCorrect").textContent=`${ms} / ${masteryQs.length} correct`;$("#achievement").textContent=pct>=90?"🏆 Lesson Master":pct>=80?"⭐ Almost There":pct>=70?"💡 Good Progress":"🌱 Keep Practicing";$("#mistakesArea").classList.add("hidden");if(pct>=90)toast("Outstanding! You mastered the lesson! 🏆");else toast("Great effort! Practice makes progress.") }
$("#retryMastery").addEventListener("click",startMastery);
$("#mistakesBtn").addEventListener("click",()=>{const area=$("#mistakesArea");area.classList.toggle("hidden");if(!state.missed.length){area.innerHTML="<b>🎉 No saved mistakes!</b> Keep up the great work."}else{const list=state.missed.slice(-10).reverse();area.innerHTML="<h3>🔄 Practice My Mistakes</h3><p>Review these ideas, then try the Final Challenge again.</p>"+list.map((m,i)=>`<div style="padding:10px;border-top:1px solid var(--line)"><b>${i+1}. ${m.q}</b><br><span style="color:var(--green)">Best answer: ${m.a}</span></div>`).join("")}});
$("#backMap").addEventListener("click",()=>showSection("games"));

$$(".reflection-choices button").forEach(b=>b.addEventListener("click",()=>{$("#reflectionMessage").textContent="✓ "+b.dataset.reflection+" Keep learning!";$("#reflectionMessage").style.marginTop="10px";$("#reflectionMessage").style.fontWeight="900";complete("reflection",1)}));

updateProgress();

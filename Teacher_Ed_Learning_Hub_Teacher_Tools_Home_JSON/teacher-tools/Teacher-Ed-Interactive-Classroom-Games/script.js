const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const games = [
  {id:"mystery",name:"Mystery Box",icon:"📦",grades:"1-6",duration:"3–5 minutes",energy:"Moderate",purpose:"Guess the Topic",tags:["Curiosity","Activate Prior Knowledge"],desc:"Reveal clues one at a time and let students discover the lesson topic.",tip:"Keep clues short. Ask students to explain what evidence helped them make their prediction."},
  {id:"picture",name:"Guess the Picture",icon:"🖼️",grades:"1-6",duration:"3–5 minutes",energy:"Moderate",purpose:"Curiosity",tags:["Prediction","Visual"],desc:"Hide an image behind tiles and reveal it gradually as students make predictions.",tip:"Use a picture strongly connected to the lesson. Ask, “What makes you think that?”"},
  {id:"corners",name:"Four Corners",icon:"🔵",grades:"1-6",duration:"5–10 minutes",energy:"High Energy",purpose:"Movement",tags:["Movement","Participation"],desc:"Students move to the classroom corner representing their answer.",tip:"Tell students they must be ready to explain why they chose their corner."},
  {id:"thisthat",name:"This or That",icon:"⚖️",grades:"1-6",duration:"3–5 minutes",energy:"Moderate",purpose:"Activate Prior Knowledge",tags:["Voting","Prediction"],desc:"Present two choices and let students vote before revealing the answer.",tip:"Choose choices that expose misconceptions or invite comparison."},
  {id:"truefalse",name:"True or False",icon:"✅",grades:"1-6",duration:"3–5 minutes",energy:"Calm",purpose:"Review",tags:["Recall","Quick"],desc:"Students decide whether a statement is true or false, then discuss the evidence.",tip:"Use one or two statements that connect directly to your learning target."},
  {id:"fastfive",name:"Fast Five",icon:"⚡",grades:"1-6",duration:"5–10 minutes",energy:"High Energy",purpose:"Review",tags:["Speed","Recall"],desc:"Challenge the class with five quick prompts before the timer ends.",tip:"Keep questions short and focus on retrieval of previously learned ideas."},
  {id:"scramble",name:"Word Scramble",icon:"🔤",grades:"1-6",duration:"3–5 minutes",energy:"Moderate",purpose:"Vocabulary",tags:["Vocabulary","Language"],desc:"Unscramble an important lesson word, with optional hints.",tip:"Use words students will encounter in the lesson so the game builds vocabulary readiness."},
  {id:"whatami",name:"What Am I?",icon:"❓",grades:"1-6",duration:"5–10 minutes",energy:"Calm",purpose:"Guess the Topic",tags:["Clues","Critical Thinking"],desc:"Reveal clues one by one while students predict the mystery answer.",tip:"Ask for complete-sentence reasoning after a correct guess."},
  {id:"hidden",name:"Hidden Word",icon:"🔎",grades:"1-6",duration:"5–10 minutes",energy:"Calm",purpose:"Vocabulary",tags:["Word Search","Vocabulary"],desc:"Search a letter grid for the target vocabulary word.",tip:"Have students pronounce the word and predict how it relates to today's topic."},
  {id:"jeopardy",name:"Classroom Jeopardy",icon:"🏆",grades:"1-6",duration:"10–15 minutes",energy:"High Energy",purpose:"Review",tags:["Teams","Challenge"],desc:"Choose point-value tiles from categories and track team scores.",tip:"Use categories that move from recall to higher-level challenge."},
  {id:"wheel",name:"Spin the Wheel",icon:"🎡",grades:"1-6",duration:"3–5 minutes",energy:"High Energy",purpose:"Team Building",tags:["Random","Participation"],desc:"Spin a wheel to randomly select a question, challenge, picture, action, or mystery task.",tip:"Prepare seven quick prompts that all connect to the lesson."},
  {id:"picker",name:"Random Student Picker",icon:"🎲",grades:"1-6",duration:"3–5 minutes",energy:"Moderate",purpose:"Participation",tags:["Fair Turns","Whole Class"],desc:"Enter student names and randomly choose a learner. Fair Mode prevents repeats.",tip:"Use the picker to distribute opportunities to participate—not to embarrass students."},
  {id:"team",name:"Team Challenge",icon:"👥",grades:"1-6",duration:"5–10 minutes",energy:"High Energy",purpose:"Team Building",tags:["Teams","Scores"],desc:"Create teams and award points with simple score controls.",tip:"Praise teamwork and reasoning, not only speed."},
  {id:"hotseat",name:"Hot Seat",icon:"🔥",grades:"2-6",duration:"5–10 minutes",energy:"High Energy",purpose:"Vocabulary",tags:["Speaking","Clues"],desc:"One student sits in the hot seat while classmates give clues without saying the mystery word.",tip:"Model respectful clue-giving before beginning."},
  {id:"lock",name:"Open the Lock",icon:"🔐",grades:"1-6",duration:"5–10 minutes",energy:"Moderate",purpose:"Guess the Topic",tags:["Challenge","Transition"],desc:"Answer a sequence of questions to unlock the digital lock and transition into the lesson.",tip:"End with the question, “What do you think we are going to learn next?”"}
];

let state = {
  currentGame:null, config:{grade:"Grade 3",subject:"General",topic:"",teams:1,timer:0,difficulty:"Easy",participation:"Whole Class"},
  sound:false, animation:true, timerSound:false, dark:false, reducedMotion:false,
  pictureDataUrl:"", pictureFileName:"",
  timerId:null, timerEnd:0, pickerPool:[], scores:[0,0,0,0,0,0], teams:["Team A","Team B","Team C","Team D"]
};

function toast(msg,type=""){const t=document.createElement("div");t.className="toast "+type;t.textContent=msg;$("#toastContainer").appendChild(t);setTimeout(()=>t.remove(),2400)}
function openModal(id){$(id).classList.add("open");$(id).setAttribute("aria-hidden","false")}
function closeModal(id){$(id).classList.remove("open");$(id).setAttribute("aria-hidden","true")}
function escapeHTML(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function navigate(page){
  $$(".page").forEach(p=>p.classList.remove("active"));
  const el=$("#"+page+"Page"); if(el) el.classList.add("active");
  $$("nav a").forEach(a=>a.classList.toggle("active",a.dataset.page===page));
  $("#mainNav").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
}
function renderGames(){
  const q=$("#gameSearch").value.toLowerCase().trim();
  const grade=$("#gradeFilter").value;
  const subject=$("#subjectFilter").value;
  const duration=$("#durationFilter").value;
  const energy=$("#energyFilter").value;

  const list=games.filter(g=>{
    const searchable=(g.name+" "+g.desc+" "+g.purpose+" "+g.tags.join(" ")).toLowerCase();
    const gradeOk=grade==="all"||g.grades.includes(grade.replace("Grade ",""));
    const subjectOk=subject==="all"||subject==="General"||(
      subject==="English" && (g.tags.includes("Language")||g.tags.includes("Vocabulary"))
    )||(
      subject==="Filipino" && (g.tags.includes("Language")||g.tags.includes("Vocabulary"))
    )||(
      subject==="Mathematics" && (g.tags.includes("Recall")||g.tags.includes("Challenge")||g.tags.includes("Prediction"))
    )||(
      subject==="Science" && (g.purpose==="Curiosity"||g.purpose==="Guess the Topic"||g.tags.includes("Visual"))
    )||(
      subject==="Araling Panlipunan" && (g.purpose==="Curiosity"||g.purpose==="Review"||g.tags.includes("Prediction"))
    )||(
      subject==="ESP/GMRC" && (g.purpose==="Participation"||g.purpose==="Team Building"||g.tags.includes("Discussion"))
    )||(
      subject==="MAPEH" && (g.energy==="High Energy"||g.tags.includes("Movement")||g.tags.includes("Speaking"))
    );
    return searchable.includes(q)&&gradeOk&&subjectOk&&
      (duration==="all"||g.duration===duration)&&
      (energy==="all"||g.energy===energy);
  });

  const countEl=$("#gameCount");
  if(countEl) countEl.textContent=list.length;

  $("#gameGrid").innerHTML=list.length
    ? list.map((g,i)=>gameCard(g,i)).join("")
    : `<div class="empty empty-card"><div>🔎</div><strong>No games found</strong><span>Try another filter or search term.</span></div>`;

  $$("#gameGrid .play-game").forEach(b=>b.addEventListener("click",()=>beginSetup(b.dataset.id)));
}

function gameCard(g,index=0){
  const colors=["blue","gold","green","pink","purple","teal"];
  const tone=colors[index%colors.length];
  return `<article class="game-card ${tone}">
    <div class="game-card-top">
      <div class="game-number">${String(index+1).padStart(2,"0")}</div>
      <div class="game-icon">${g.icon}</div>
    </div>
    <div class="game-purpose">${escapeHTML(g.purpose)}</div>
    <h3>${escapeHTML(g.name)}</h3>
    <p>${escapeHTML(g.desc)}</p>
    <div class="badges">${g.tags.slice(0,2).map(x=>`<span class="badge">${escapeHTML(x)}</span>`).join("")}</div>
    <div class="game-meta"><span>⏱ ${escapeHTML(g.duration)}</span><span>⚡ ${escapeHTML(g.energy)}</span></div>
    <button class="btn primary play-game" data-id="${g.id}">Play Now <span>→</span></button>
  </article>`;
}
function beginSetup(id){
  state.currentGame=games.find(g=>g.id===id);
  $("#setupTitle").textContent=`Prepare: ${state.currentGame.name}`;
  $("#setupTopic").value=state.config.topic||"";
  $("#setupGrade").value=state.config.grade;
  $("#setupSubject").value=state.config.subject;
  $("#setupTeams").value=String(state.config.teams);
  $("#setupTimer").value=String(state.config.timer);
  $("#setupDifficulty").value=state.config.difficulty;
  $("#setupParticipation").value=state.config.participation;
  renderCustomFields(id);
  if(id==="picture") setupPictureUploadUI();
  openModal("#setupModal");
}
function renderCustomFields(id){
  const box=$("#customFields");
  if(id==="mystery") box.innerHTML=`<div class="field full"><label>Clues (one per line)</label><textarea id="customClues" placeholder="I help the plant stand.\nI absorb water.\nI can be found underground."></textarea></div>`;
  else if(id==="picture") box.innerHTML=`
    <div class="picture-setup-card setup-picture-card">
      <div class="picture-upload-zone" id="pictureUploadZone">
        <input
    id="pictureFile"
    type="file"
    accept="image/*,.jpg,.jpeg,.jfif,.png,.webp,.gif,.bmp"
    hidden
    >
        <button type="button" class="upload-button" id="choosePicture">📤 Choose Picture</button>
        <strong>Upload your own lesson picture</strong>
        <small>JPG, PNG, WEBP or GIF • maximum 8 MB</small>
        <small>Click the button or drag and drop an image here.</small>
      </div>
      <div class="picture-preview setup-preview" id="picturePreview">
        <div class="preview-placeholder">🖼️<span>Your selected picture will appear here.</span></div>
      </div>
    </div>`;
  else if(id==="scramble") box.innerHTML=`<div class="field full"><label>Words (one per line)</label><textarea id="customWords" placeholder="PLANT\nSUNLIGHT\nROOT"></textarea></div>`;
  else if(id==="whatami") box.innerHTML=`<div class="field full"><label>Clues (one per line)</label><textarea id="customClues" placeholder="I am found in the sky.\nI give light.\nI appear during the day."></textarea></div><div class="field"><label>Answer</label><input id="customAnswer" placeholder="SUN"></div>`;
  else if(id==="hidden") box.innerHTML=`<div class="field"><label>Target Word</label><input id="customWord" placeholder="PLANT"></div>`;
  else if(id==="truefalse") box.innerHTML=`<div class="field full"><label>Statement</label><textarea id="customStatement" placeholder="The Sun is a star."></textarea></div><div class="field"><label>Correct Answer</label><select id="customTF"><option>TRUE</option><option>FALSE</option></select></div>`;
  else if(id==="thisthat") box.innerHTML=`<div class="field full"><label>Question</label><input id="customQuestion" placeholder="Which is heavier?"></div><div class="custom-row"><input id="choiceA" placeholder="Choice A"><input id="choiceB" placeholder="Choice B"></div><div class="field"><label>Correct Choice</label><select id="customCorrect"><option>A</option><option>B</option></select></div>`;
  else if(id==="corners") box.innerHTML=`<div class="field full"><label>Question</label><textarea id="customQuestion" placeholder="What do plants need to grow?"></textarea></div><div class="custom-row"><input id="cornerA" placeholder="A. Candy"><input id="cornerB" placeholder="B. Sunlight"></div><div class="custom-row"><input id="cornerC" placeholder="C. Toys"><input id="cornerD" placeholder="D. Shoes"></div><div class="field"><label>Correct Corner</label><select id="customCorrect"><option>A</option><option>B</option><option>C</option><option>D</option></select></div>`;
  else if(id==="fastfive") box.innerHTML=`<div class="field full"><label>Five Prompts (one per line)</label><textarea id="customPrompts" placeholder="What is 5 + 3?\nWhat is 10 + 4?\nWhat number comes after 19?\nWhich is greater: 8 or 5?\nWhat is 7 + 2?"></textarea></div>`;
  else if(id==="hotseat") box.innerHTML=`<div class="field"><label>Mystery Word</label><input id="customWord" placeholder="PLANT"></div>`;
  else if(id==="lock") box.innerHTML=`<div class="field full"><label>Unlock Questions (one per line)</label><textarea id="customPrompts" placeholder="Question 1\nQuestion 2\nQuestion 3"></textarea></div>`;
  else if(id==="wheel") box.innerHTML=`<div class="field full"><label>Wheel Challenges (one per line)</label><textarea id="customPrompts" placeholder="Question\nChallenge\nPicture\nAct It Out\nTrue or False\nBonus\nMystery"></textarea></div>`;
  else if(id==="picker") box.innerHTML=`<div class="field full"><label>Student Names (one per line)</label><textarea id="customNames" placeholder="Ana\nBen\nCarlo\nDana"></textarea></div><label class="switch-row"><span>Fair Mode</span><input id="fairMode" type="checkbox" checked><i></i></label>`;
  else if(id==="jeopardy") box.innerHTML=`<div class="field full"><label>Optional Topic / Category Focus</label><input id="customTopic" placeholder="e.g., Fractions"></div>`;
  else box.innerHTML="";
}
function setupPictureUploadUI(){
  const input = $("#pictureFile");
  const choose = $("#choosePicture");
  const zone = $("#pictureUploadZone");
  const preview = $("#picturePreview");

  if(!input || !zone || !preview) return;

  function isImageFile(file){
    if(!file) return false;

    const fileName = file.name.toLowerCase();

    // Accept common image extensions, including JFIF
    const validExtension =
      /\.(jpg|jpeg|jfif|png|webp|gif|bmp)$/i.test(fileName);

    // Some browsers provide image/* while others may return an unusual MIME type.
    const validMime =
      file.type && file.type.toLowerCase().startsWith("image/");

    return validExtension || validMime;
  }

  function showPreview(src, name){
    preview.innerHTML = `
      <img
        src="${src}"
        alt="Selected lesson picture"
        class="setup-picture-preview-img"
      >

      <div class="preview-info">
        <strong>✅ Picture Ready!</strong>
        <small>${escapeHTML(name || "Selected image")}</small>
      </div>
    `;

    preview.classList.add("has-picture");
  }

  function showPlaceholder(){
    preview.innerHTML = `
      <div class="preview-placeholder">
        <span>🖼️</span>
        <strong>No picture selected</strong>
        <small>Your uploaded picture will appear here.</small>
      </div>
    `;

    preview.classList.remove("has-picture");
  }

  async function processPictureFile(file){

    if(!file){
      return;
    }

    // Validate image
    if(!isImageFile(file)){
      toast(
        "Please choose an image file such as JPG, JPEG, JFIF, PNG, WEBP, or GIF.",
        "bad"
      );
      return;
    }

    // Maximum 8 MB
    if(file.size > 8 * 1024 * 1024){
      toast(
        "The image is too large. Please choose an image smaller than 8 MB.",
        "bad"
      );
      return;
    }

    try{

      toast("Loading your picture...", "");

      const dataURL = await fileToDataURL(file);

      // Make sure the FileReader actually returned an image
      if(!dataURL || !dataURL.startsWith("data:image")){
        throw new Error("Invalid image data.");
      }

      // Store the image in application state
      state.config.pictureDataUrl = dataURL;
      state.config.pictureFileName = file.name;

      // Display preview
      showPreview(dataURL, file.name);

      toast(
        "✅ Picture loaded successfully!",
        "good"
      );

    }catch(error){

      console.error("Picture upload error:", error);

      toast(
        "Unable to read this picture. Please try another image.",
        "bad"
      );

      showPlaceholder();
    }
  }

  // Show previously selected image
  if(state.config.pictureDataUrl){

    showPreview(
      state.config.pictureDataUrl,
      state.config.pictureFileName || "Previously selected image"
    );

  }else{

    showPlaceholder();

  }

  // Choose Picture button
  choose.onclick = function(event){
    event.preventDefault();
    event.stopPropagation();

    input.click();
  };

  // Clicking the upload area
  zone.addEventListener("click", function(event){

    if(
      event.target === zone ||
      event.target.closest(".picture-upload-zone") &&
      !event.target.closest("#choosePicture")
    ){
      input.click();
    }

  });

  // Drag over
  zone.addEventListener("dragenter", function(event){
    event.preventDefault();
    event.stopPropagation();

    zone.classList.add("dragover");
  });

  zone.addEventListener("dragover", function(event){
    event.preventDefault();
    event.stopPropagation();

    zone.classList.add("dragover");
  });

  // Drag leave
  zone.addEventListener("dragleave", function(event){
    event.preventDefault();
    event.stopPropagation();

    zone.classList.remove("dragover");
  });

  // Drop image
  zone.addEventListener("drop", function(event){

    event.preventDefault();
    event.stopPropagation();

    zone.classList.remove("dragover");

    const files = event.dataTransfer.files;

    if(files && files.length > 0){

      processPictureFile(files[0]);

    }

  });

  // Normal file selection
  input.addEventListener("change", function(){

    const file = input.files && input.files[0];

    if(file){

      processPictureFile(file);

    }

  });
}

function readConfig(){
  state.config={grade:$("#setupGrade").value,subject:$("#setupSubject").value,topic:$("#setupTopic").value.trim()||"Today's Lesson",teams:+$("#setupTeams").value,timer:+$("#setupTimer").value,difficulty:$("#setupDifficulty").value,participation:$("#setupParticipation").value};
}
function isPictureFile(file){

  if(!file) return false;

  const name =
    file.name.toLowerCase();

  const validExtension =
    /\.(jpg|jpeg|jfif|png|webp|gif|bmp)$/i.test(name);

  const validMime =
    file.type &&
    file.type.toLowerCase().startsWith("image/");

  return validExtension || validMime;
}
async function startConfigured(){
  readConfig();
  const gameId=state.currentGame?.id;
  if(gameId==="picture"){
    const file=$("#pictureFile")?.files?.[0];
    if(file){
      if(!file.type.startsWith("image/")){toast("Please choose a valid image file.","bad");return;}
      if(file.size>8*1024*1024){toast("Please choose an image smaller than 8 MB.","bad");return;}
      try{
        state.config.pictureDataUrl=await fileToDataURL(file);
        state.config.pictureFileName=file.name;
      }catch(err){toast("The picture could not be loaded. Please try again.","bad");return;}
    }else if(!state.config.pictureDataUrl){
      state.config.pictureFileName="";
    }
  }
  closeModal("#setupModal"); openModal("#gameModal"); renderGame(gameId);
} 
function fileToDataURL(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(String(reader.result||""));
    reader.onerror=()=>reject(reader.error||new Error("Unable to read image"));
    reader.readAsDataURL(file);
  });
}
function gameHeader(g,title=g.name){
  return `<div class="game-ui"><span class="game-topic">${escapeHTML(state.config.grade)} • ${escapeHTML(state.config.subject)} • ${escapeHTML(state.config.topic)}</span><h2>${g.icon} ${title}</h2>`;
}
function endGame(message="Great job!"){
  stopTimer();
  const g=state.currentGame;
  $("#gameContent").innerHTML=gameHeader(g,"🎉 Game Complete!")+
    `<div class="answer-reveal">${message}</div><p class="game-instruction">${transitionFor(g.purpose)}</p>
    <div class="game-controls"><button class="btn primary" id="playAgain">🔄 Play Again</button><button class="btn secondary" id="chooseAnother">🎮 Choose Another Game</button><button class="btn secondary" id="continueLesson">➡️ Continue to Lesson</button></div>
    <div class="tip-card" style="margin-top:20px;text-align:left"><b>💡 Teacher Tip</b><p>${g.tip}</p></div></div>`;
  $("#playAgain").onclick=()=>renderGame(g.id);
  $("#chooseAnother").onclick=()=>{closeModal("#gameModal");navigate("games")};
  $("#continueLesson").onclick=()=>{closeModal("#gameModal");toast("Ready for the lesson!","good")};
  celebrate();
}
function transitionFor(p){
  const m={ "Activate Prior Knowledge":"You already know more than you think! Let’s build on what you already know.","Guess the Topic":"You made your predictions. Now let’s investigate whether your ideas are correct.","Vocabulary":"You discovered an important word. Now let’s explore why it matters in today’s lesson.","Curiosity":"You made some great observations! Now let’s discover how they connect to today’s lesson.","Review":"Let’s use what you remembered as a bridge to today’s new learning.","Movement":"You made your choice—now let’s find out what the evidence tells us.","Team Building":"Great teamwork! Now let’s connect your ideas to today’s learning."};
  return m[p]||"Now let’s connect what you discovered to today’s lesson.";
}
function teacherTip(g){return `<button class="btn secondary" id="tipBtn">💡 Teacher Tip</button><button class="btn secondary" id="saveGameBtn">💾 Save Setup</button>`}
function renderGame(id){
  stopTimer(); const g=games.find(x=>x.id===id); state.currentGame=g;
  const topic=escapeHTML(state.config.topic||"Today's Lesson");
  if(id==="mystery") renderMystery(g,topic);
  else if(id==="picture") renderPicture(g,topic);
  else if(id==="corners") renderCorners(g,topic);
  else if(id==="thisthat") renderThisThat(g,topic);
  else if(id==="truefalse") renderTrueFalse(g,topic);
  else if(id==="fastfive") renderFastFive(g,topic);
  else if(id==="scramble") renderScramble(g,topic);
  else if(id==="whatami") renderWhatAmI(g,topic);
  else if(id==="hidden") renderHidden(g,topic);
  else if(id==="jeopardy") renderJeopardy(g,topic);
  else if(id==="wheel") renderWheel(g,topic);
  else if(id==="picker") renderPicker(g,topic);
  else if(id==="team") renderTeam(g,topic);
  else if(id==="hotseat") renderHotseat(g,topic);
  else if(id==="lock") renderLock(g,topic);
}
function bindTip(g){
  $("#tipBtn")?.addEventListener("click",()=>{toast(`💡 ${g.tip}`)});
  $("#saveGameBtn")?.addEventListener("click",saveGameLocal);
}
function timerStart(seconds, onDone){
  stopTimer(); if(!seconds)return;
  const timerEl=$("#activeTimer"); if(!timerEl)return;
  state.timerEnd=Date.now()+seconds*1000;
  const tick=()=>{const left=Math.max(0,Math.ceil((state.timerEnd-Date.now())/1000));timerEl.textContent=`⏱ ${left}s`;timerEl.classList.toggle("urgent",left<=5);if(left<=0){stopTimer();if(state.timerSound)beep(220,.2);onDone?.()}};
  tick();state.timerId=setInterval(tick,100);
}
function stopTimer(){if(state.timerId){clearInterval(state.timerId);state.timerId=null}}
function beep(freq=520,duration=.08){if(!state.sound)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;o.connect(g);g.connect(c.destination);g.gain.value=.04;o.start();o.stop(c.currentTime+duration)}catch{}}
function celebrate(){if(!state.animation||state.reducedMotion)return;for(let i=0;i<65;i++){const s=document.createElement("span");s.textContent=["🎉","⭐","✨","🎊"][Math.floor(Math.random()*4)];s.style.cssText=`position:fixed;left:${Math.random()*100}vw;top:-5vh;z-index:300;font-size:${14+Math.random()*18}px;animation:fall ${1.4+Math.random()*1.8}s linear forwards;pointer-events:none`;document.body.appendChild(s);setTimeout(()=>s.remove(),3500)}}
const style=document.createElement("style");style.textContent="@keyframes fall{to{transform:translateY(110vh) rotate(540deg);opacity:.2}}";document.head.appendChild(style);

function renderMystery(g,topic){
  const clues=($("#customClues")?.value||"I help the plant stand.\nI absorb water.\nI can be found underground.").split("\n").map(x=>x.trim()).filter(Boolean);
  let i=0;
  $("#gameContent").innerHTML=gameHeader(g)+`<div class="mystery-box">📦</div><div class="clue-box" id="clueBox">Your mystery topic is waiting...</div><div class="progress"><span id="clueProgress"></span></div><div class="timer" id="activeTimer"></div><div class="game-controls"><button class="btn primary" id="revealClue">Reveal Clue</button><button class="btn secondary" id="revealAnswer">Reveal Topic</button>${teacherTip(g)}</div></div>`;
  $("#revealClue").onclick=()=>{if(i<clues.length){$("#clueBox").textContent=clues[i++];$("#clueProgress").style.width=(i/clues.length*100)+"%";beep();if(i===clues.length)$("#revealClue").disabled=true}else toast("All clues are revealed.")};
  $("#revealAnswer").onclick=()=>{$("#clueBox").innerHTML=`🎉 <strong>${topic}</strong>`;celebrate();beep(760,.14)};
  bindTip(g); timerStart(state.config.timer,()=>toast("⏰ Time's up! Make your best prediction.","bad"));
}
function pictureSvg(type){
  const bg = {
    plant:["#dff7e8","#1f9d62"],
    sun:["#fff1bd","#f5a900"],
    book:["#e5efff","#0d438f"],
    apple:["#ffe1e1","#e34242"]
  }[type] || ["#e5efff","#0d438f"];
  const common=`<rect width="900" height="520" rx="34" fill="${bg[0]}"/>`;
  let art="";
  if(type==="plant"){
    art=`<rect x="0" y="390" width="900" height="130" fill="#9ed36a"/>
      <rect x="432" y="300" width="36" height="120" rx="18" fill="#7a4b2a"/>
      <path d="M450 310 C350 245 285 290 335 345 C380 375 425 350 450 320Z" fill="#39a95b"/>
      <path d="M450 325 C555 235 630 285 570 350 C520 380 480 355 450 330Z" fill="#2c8d4e"/>
      <path d="M450 300 C415 210 485 190 505 250 C512 275 490 292 450 300Z" fill="#55c96d"/>
      <circle cx="150" cy="120" r="52" fill="#f7c843"/>
      <g stroke="#f7c843" stroke-width="12" stroke-linecap="round"><path d="M150 45v-28"/><path d="M150 223v28"/><path d="M75 120H47"/><path d="M253 120h-28"/><path d="M96 66 76 46"/><path d="M204 174l20 20"/></g>`;
  } else if(type==="sun"){
    art=`<circle cx="450" cy="260" r="125" fill="#ffd34f"/>
      <circle cx="450" cy="260" r="92" fill="#ffb300"/>
      <g stroke="#f5a900" stroke-width="18" stroke-linecap="round">${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;const x1=450+150*Math.cos(a),y1=260+150*Math.sin(a),x2=450+205*Math.cos(a),y2=260+205*Math.sin(a);return `<path d="M${x1} ${y1} L${x2} ${y2}"/>`;}).join("")}</g>
      <path d="M0 410 Q220 340 450 410 T900 410 V520 H0Z" fill="#8bd0ef"/>
      <circle cx="150" cy="110" r="35" fill="#fff" opacity=".8"/><circle cx="205" cy="105" r="48" fill="#fff" opacity=".8"/>`;
  } else if(type==="book"){
    art=`<path d="M110 160 Q290 105 445 180 L445 420 Q280 350 110 410Z" fill="#ffffff" stroke="${bg[1]}" stroke-width="10"/>
      <path d="M790 160 Q610 105 455 180 L455 420 Q620 350 790 410Z" fill="#ffffff" stroke="${bg[1]}" stroke-width="10"/>
      <path d="M450 180 V420" stroke="${bg[1]}" stroke-width="10"/>
      <path d="M180 215 Q300 185 400 225 M180 270 Q300 240 400 280 M500 225 Q610 185 720 215 M500 280 Q610 240 720 270" fill="none" stroke="#8aa9d6" stroke-width="12" stroke-linecap="round"/>`;
  } else {
    art=`<path d="M450 145 C390 105 320 130 300 195 C270 300 350 400 450 445 C550 400 630 300 600 195 C580 130 510 105 450 145Z" fill="#ef4d4d"/>
      <path d="M450 145 C420 100 430 70 470 45" fill="none" stroke="#6f4b2a" stroke-width="18" stroke-linecap="round"/>
      <path d="M470 75 C535 45 575 80 590 125 C535 130 495 115 470 75Z" fill="#4caf50"/>
      <circle cx="385" cy="245" r="12" fill="#ff8989" opacity=".7"/><circle cx="520" cy="300" r="12" fill="#ff8989" opacity=".7"/>`;
  }
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520">${common}${art}<text x="450" y="485" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="800" fill="#0d438f">Teacher Ed • Guess the Picture</text></svg>`)}`;
}

function renderPicture(g, topic){

  const uploaded =
    state.config.pictureDataUrl || "";

  const fileName =
    state.config.pictureFileName || "";

  const defaultType =
    "plant";

  const fallbackImage =
    pictureSvg(defaultType);

  const imageSrc =
    uploaded || fallbackImage;

  const imageLabel =
    uploaded
      ? `Uploaded: ${fileName}`
      : "Built-in sample picture";


  $("#gameContent").innerHTML = `
    
    ${gameHeader(g)}

    <div class="picture-game-shell">

      <!-- IMAGE SOURCE -->
      <div class="picture-source-banner">

        <span>
          ${uploaded ? "📸" : "🌱"}
        </span>

        <strong>
          ${escapeHTML(imageLabel)}
        </strong>

        <button
          class="btn secondary"
          id="changePictureBtn"
          type="button"
        >
          🔄 Change Picture
        </button>

      </div>


      <!-- PICTURE -->
      <div
        class="picture-stage"
        id="pictureStage"
      >

        <img
          id="uploadedPicture"
          src="${imageSrc}"
          alt="Guess the Picture image"
        >

        <!-- COVER TILES -->
        <div
          class="picture-cover"
          id="pictureCover"
        ></div>

        <!-- CENTER MESSAGE -->
        <div
          class="picture-center-message"
          id="pictureCenterMessage"
        >
          🖼️
          <span>What is it?</span>
        </div>

        <!-- LOADING -->
        <div
          class="picture-loading"
          id="pictureLoading"
        >
          <div class="loading-spinner"></div>
          <strong>Loading picture...</strong>
        </div>

      </div>


      <!-- PROGRESS -->
      <div class="picture-progress">

        <span
          id="pictureProgress"
        ></span>

      </div>


      <!-- TIMER -->
      <div
        class="timer"
        id="activeTimer"
      ></div>


      <!-- STATUS -->
      <p
        id="pictureStatus"
        class="game-instruction"
      >
        Reveal a few tiles, invite predictions,
        and ask students to explain their clues.
      </p>


      <!-- CONTROLS -->
      <div class="game-controls">

        <button
          class="btn primary"
          id="reveal1"
          type="button"
        >
          👁️ Reveal 1 Tile
        </button>

        <button
          class="btn secondary"
          id="reveal3"
          type="button"
        >
          🔍 Reveal 3 Tiles
        </button>

        <button
          class="btn secondary"
          id="revealAll"
          type="button"
        >
          🖼️ Reveal All
        </button>

        <button
          class="btn primary"
          id="pictureCorrect"
          type="button"
        >
          🎉 I Know the Answer!
        </button>

        ${teacherTip(g)}

      </div>

    </div>
  `;


  // ------------------------------------------------
  // GET ELEMENTS
  // ------------------------------------------------

  const img =
    $("#uploadedPicture");

  const cover =
    $("#pictureCover");

  const message =
    $("#pictureCenterMessage");

  const loading =
    $("#pictureLoading");


  let revealed = 0;

  const total = 12;


  // ------------------------------------------------
  // IMAGE LOAD
  // ------------------------------------------------

  function imageLoaded(){

    console.log(
      "Guess the Picture image loaded successfully."
    );

    console.log(
      "Image source:",
      img.src.substring(0,100)
    );

    // THIS IS THE CRITICAL FIX
    img.classList.add("ready");

    // Hide loading
    loading.classList.add("hidden");

    // Show actual picture
    img.style.opacity = "1";

    // Make sure picture is visible
    img.style.visibility = "visible";

  }


  // ------------------------------------------------
  // IMAGE ERROR
  // ------------------------------------------------

  function imageFailed(){

    console.error(
      "Guess the Picture image failed to load."
    );

    console.error(
      "Image source:",
      img.src.substring(0,100)
    );

    loading.classList.add("hidden");

    // If uploaded image failed,
    // use the built-in fallback.
    if(uploaded){

      toast(
        "The uploaded image could not be displayed. Please choose another picture.",
        "bad"
      );

      img.src = fallbackImage;

      img.onload = function(){

        img.classList.add("ready");

        img.style.opacity = "1";

        img.style.visibility = "visible";

      };

      return;

    }

    img.classList.add("ready");

    img.style.opacity = "1";

    img.style.visibility = "visible";

  }


  // Attach events BEFORE forcing the browser
  // to use the image.

  img.onload =
    imageLoaded;

  img.onerror =
    imageFailed;


  // In some browsers the image may already be cached.
  if(img.complete){

    if(img.naturalWidth > 0){

      imageLoaded();

    }else{

      imageFailed();

    }

  }


  // ------------------------------------------------
  // DRAW TILES
  // ------------------------------------------------

  function drawTiles(){

    cover.innerHTML = "";

    for(let i = 0; i < total; i++){

      const tile =
        document.createElement("button");

      tile.className =
        "picture-tile";

      tile.type =
        "button";

      tile.setAttribute(
        "aria-label",
        `Reveal tile ${i + 1}`
      );

      tile.innerHTML =
        `<span>${i + 1}</span>`;

      tile.addEventListener(
        "click",
        () => reveal(1, [tile])
      );

      cover.appendChild(tile);

    }

    revealed = 0;

    updatePictureProgress();

  }


  // ------------------------------------------------
  // UPDATE PROGRESS
  // ------------------------------------------------

  function updatePictureProgress(){

    const percent =
      (revealed / total) * 100;

    $("#pictureProgress").style.width =
      percent + "%";


    const status =
      $("#pictureStatus");


    if(revealed === 0){

      status.textContent =
        "Reveal a few tiles, invite predictions, and ask students to explain their clues.";

    }
    else if(revealed < total){

      status.textContent =
        `${revealed} of ${total} tiles revealed. What do you think the picture shows?`;

    }
    else{

      status.textContent =
        "The picture is fully revealed! Ask students to connect it to today's lesson.";

    }


    message.classList.toggle(
      "hidden",
      revealed === total
    );

    cover.classList.toggle(
      "finished",
      revealed === total
    );

  }


  // ------------------------------------------------
  // REVEAL TILES
  // ------------------------------------------------

  function reveal(
    number,
    specificTiles
  ){

    let tiles;


    if(specificTiles){

      tiles =
        specificTiles.slice(0, number);

    }else{

      tiles =
        [
          ...cover.querySelectorAll(
            ".picture-tile:not(.revealed)"
          )
        ]
        .sort(
          () => Math.random() - 0.5
        )
        .slice(0, number);

    }


    tiles.forEach(tile => {

      if(
        tile.classList.contains("revealed")
      ){

        return;

      }


      tile.classList.add(
        "revealed"
      );

      tile.disabled =
        true;

      revealed++;

    });


    updatePictureProgress();

    beep(650, .08);


    if(revealed === total){

      celebrate();

    }

  }


  // ------------------------------------------------
  // CHANGE PICTURE
  // ------------------------------------------------

  $("#changePictureBtn").onclick =
    function(){

      closeModal("#gameModal");

      beginSetup("picture");

      requestAnimationFrame(() => {

        $("#pictureFile")?.focus();

      });

    };


  // ------------------------------------------------
  // BUTTONS
  // ------------------------------------------------

  $("#reveal1").onclick =
    () => reveal(1);

  $("#reveal3").onclick =
    () => reveal(3);

  $("#revealAll").onclick =
    () => reveal(total);


  $("#pictureCorrect").onclick =
    () => {

      endGame(
        `Excellent! You identified the picture and connected it to <strong>${escapeHTML(topic)}</strong>.`
      );

    };


  bindTip(g);


  // ------------------------------------------------
  // CREATE TILES
  // ------------------------------------------------

  drawTiles();


  // ------------------------------------------------
  // TIMER
  // ------------------------------------------------

  timerStart(
    state.config.timer,
    () => toast(
      "⏰ Time's up! Make your best guess.",
      "bad"
    )
  );

}
function renderCorners(g,topic){
  const q=$("#customQuestion")?.value||"What do plants need to grow?";const opts=[$("#cornerA")?.value||"A. Candy",$("#cornerB")?.value||"B. Sunlight",$("#cornerC")?.value||"C. Toys",$("#cornerD")?.value||"D. Shoes"];const correct=$("#customCorrect")?.value||"B";
  $("#gameContent").innerHTML=gameHeader(g)+`<h3>${escapeHTML(q)}</h3><div class="big-choice-grid">${opts.map((x,i)=>`<button class="choice corner-choice" data-letter="${"ABCD"[i]}">${escapeHTML(x)}</button>`).join("")}</div><div class="timer" id="activeTimer"></div><div class="game-controls">${teacherTip(g)}<button class="btn secondary" id="showCorrect">Show Correct Corner</button></div></div>`;
  $$(".corner-choice").forEach(b=>b.onclick=()=>{const ok=b.dataset.letter===correct;b.classList.add(ok?"correct":"wrong");toast(ok?"Correct corner!":"Think again.",ok?"good":"bad");if(ok)beep(760,.12)});
  $("#showCorrect").onclick=()=>{$$(".corner-choice").find(b=>b.dataset.letter===correct)?.classList.add("correct");toast(`Correct answer: Corner ${correct}`,"good")};bindTip(g);timerStart(state.config.timer,()=>toast("Time's up!","bad"));
}
function renderThisThat(g,topic){
  const q=$("#customQuestion")?.value||"Which is heavier?";const a=$("#choiceA")?.value||"🪶 Feather",b=$("#choiceB")?.value||"🪨 Rock",c=$("#customCorrect")?.value||"B";
  $("#gameContent").innerHTML=gameHeader(g)+`<h3>${escapeHTML(q)}</h3><div class="big-choice-grid"><button class="choice" data-v="A">${escapeHTML(a)}</button><button class="choice" data-v="B">${escapeHTML(b)}</button></div><div class="timer" id="activeTimer"></div><div class="game-controls"><button class="btn secondary" id="revealThisThat">Reveal Answer</button>${teacherTip(g)}</div></div>`;
  $$(".choice").forEach(b=>b.onclick=()=>b.style.transform="scale(.98)");
  $("#revealThisThat").onclick=()=>{$$(".choice").find(x=>x.dataset.v===c)?.classList.add("correct");toast(`Correct: ${c==="A"?a:b}`,"good");beep(760,.12)};bindTip(g);timerStart(state.config.timer,()=>toast("Time's up!","bad"));
}
function renderTrueFalse(g,topic){
  const st=$("#customStatement")?.value||"The Sun is a star.";const correct=$("#customTF")?.value||"TRUE";
  $("#gameContent").innerHTML=gameHeader(g)+`<div class="clue-box">${escapeHTML(st)}</div><div class="big-choice-grid"><button class="choice" data-v="TRUE">TRUE</button><button class="choice" data-v="FALSE">FALSE</button></div><div class="timer" id="activeTimer"></div><div class="game-controls">${teacherTip(g)}<button class="btn secondary" id="tfReveal">Reveal Answer</button></div></div>`;
  $$(".choice").forEach(b=>b.onclick=()=>{const ok=b.dataset.v===correct;b.classList.add(ok?"correct":"wrong");toast(ok?"Excellent!":"Think again.",ok?"good":"bad");if(ok)beep(760,.12)});
  $("#tfReveal").onclick=()=>{const b=$$(".choice").find(x=>x.dataset.v===correct);b?.classList.add("correct");toast(`Correct answer: ${correct}`,"good")};bindTip(g);timerStart(state.config.timer,()=>toast("Time's up!","bad"));
}
function renderFastFive(g,topic){
  let prompts=($("#customPrompts")?.value||"What is 5 + 3?\nWhat is 10 + 4?\nWhat number comes after 19?\nWhich is greater: 8 or 5?\nWhat is 7 + 2?").split("\n").map(x=>x.trim()).filter(Boolean).slice(0,5);
  let i=0;
  $("#gameContent").innerHTML=gameHeader(g)+`<div class="progress"><span id="fastProgress"></span></div><div class="clue-box" id="fastPrompt">${escapeHTML(prompts[0]||"Add prompts in setup.")}</div><div class="timer" id="activeTimer"></div><div class="game-controls"><button class="btn primary" id="fastNext">Next Prompt</button><button class="btn secondary" id="fastDone">Finish</button>${teacherTip(g)}</div></div>`;
  const next=()=>{i++;if(i>=prompts.length)endGame("You completed all five quick prompts!");else{$("#fastPrompt").textContent=prompts[i];$("#fastProgress").style.width=(i/prompts.length*100)+"%";beep()}};
  $("#fastNext").onclick=next;$("#fastDone").onclick=()=>endGame("Fast Five complete!");bindTip(g);timerStart(state.config.timer||60,()=>endGame("Time's up!"));
}
function shuffleWord(word){return word.split("").sort(()=>Math.random()-.5).join("")}
function renderScramble(g,topic){
  let words=($("#customWords")?.value||"PLANT\nSUNLIGHT\nROOT").split("\n").map(x=>x.trim().toUpperCase()).filter(Boolean),i=0,word=words[0]||"PLANT";
  $("#gameContent").innerHTML=gameHeader(g)+`<div class="word" id="scrambled">${shuffleWord(word)}</div><div class="clue-box">Unscramble the word!</div><div class="game-controls"><button class="btn secondary" id="shuffleWord">Shuffle</button><button class="btn secondary" id="scrambleHint">Show Hint</button><button class="btn primary" id="scrambleReveal">Reveal Answer</button><button class="btn primary" id="scrambleNext">Next Word</button>${teacherTip(g)}</div></div>`;
  const set=()=>{word=words[i];$("#scrambled").textContent=shuffleWord(word);};$("#shuffleWord").onclick=set;$("#scrambleHint").onclick=()=>toast(`Hint: starts with ${word[0]}`);$("#scrambleReveal").onclick=()=>toast(`Answer: ${word}`,"good");$("#scrambleNext").onclick=()=>{i++;if(i>=words.length)endGame("All vocabulary words completed!");else set()};bindTip(g);
}
function renderWhatAmI(g,topic){
  const clues=($("#customClues")?.value||"I am found in the sky.\nI give light.\nI appear during the day.").split("\n").map(x=>x.trim()).filter(Boolean);const ans=$("#customAnswer")?.value||"SUN";let i=0;
  $("#gameContent").innerHTML=gameHeader(g)+`<div class="clue-box" id="whatClue">Clue 1 is hidden. Make a prediction!</div><div class="progress"><span id="whatProgress"></span></div><div class="game-controls"><button class="btn primary" id="whatReveal">Reveal Clue</button><button class="btn secondary" id="whatAnswer">Reveal Answer</button>${teacherTip(g)}</div></div>`;
  $("#whatReveal").onclick=()=>{if(i<clues.length){$("#whatClue").textContent=clues[i++];$("#whatProgress").style.width=(i/clues.length*100)+"%";if(i===clues.length)$("#whatReveal").disabled=true}};$("#whatAnswer").onclick=()=>{$("#whatClue").innerHTML=`🎉 ${escapeHTML(ans)}`;celebrate()};bindTip(g);
}
function renderHidden(g,topic){
  const target=($("#customWord")?.value||"PLANT").toUpperCase().replace(/[^A-Z]/g,"");const letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ";const size=70;const arr=Array.from({length:size},()=>letters[Math.floor(Math.random()*26)]);
  const start=Math.floor(Math.random()*(size-target.length-2));target.split("").forEach((ch,i)=>arr[start+i]=ch);
  $("#gameContent").innerHTML=gameHeader(g)+`<div class="clue-box">Find the hidden word: <strong>${escapeHTML(target)}</strong></div><div class="letter-grid" id="letterGrid"></div><div class="game-controls"><button class="btn secondary" id="hiddenReset">New Grid</button><button class="btn primary" id="hiddenCheck">Check Word</button>${teacherTip(g)}</div></div>`;
  const grid=$("#letterGrid");arr.forEach((ch,i)=>{const b=document.createElement("button");b.textContent=ch;b.dataset.i=i;b.onclick=()=>b.classList.toggle("selected");grid.appendChild(b)});
  $("#hiddenCheck").onclick=()=>{const selected=$$("#letterGrid button.selected").map(b=>+b.dataset.i).sort((a,b)=>a-b);const expected=Array.from({length:target.length},(_,j)=>start+j);if(selected.join(",")===expected.join(",")){selected.forEach(i=>grid.children[i].classList.add("found"));toast("Word found!","good");celebrate()}else toast("Not quite—try another sequence.","bad")};
  $("#hiddenReset").onclick=()=>renderGame("hidden");bindTip(g);
}
function renderJeopardy(g,topic){
  const cats=["What I Know","Vocabulary","Picture Clues","Challenge","Mystery"],vals=[100,200,300,400,500],used=new Set();
  $("#gameContent").innerHTML=gameHeader(g)+`<div class="big-choice-grid" style="grid-template-columns:repeat(5,1fr)" id="jeopardyBoard">${cats.map((c,ci)=>`<div class="jeopardy-category" style="font-weight:900;color:var(--navy);padding:8px">${c}</div>${vals.map(v=>`<button class="choice jeopardy-cell" data-key="${ci}-${v}">${v}</button>`).join("")}`).join("")}</div><div id="jeopardyQuestion" class="clue-box">Choose a point value.</div><div class="game-controls">${teacherTip(g)}<button class="btn secondary" id="jeopardyCorrect">Correct + Points</button><button class="btn secondary" id="jeopardyBack">Back to Board</button></div></div>`;
  let selected=null; $$(".jeopardy-cell").forEach(b=>b.onclick=()=>{selected=b.dataset.key;b.classList.add("wrong");const [ci,v]=selected.split("-");$("#jeopardyQuestion").innerHTML=`<strong>${cats[ci]}</strong><br><br>Teacher: ask a ${v}-point question about <strong>${escapeHTML(topic)}</strong>.`});
  $("#jeopardyCorrect").onclick=()=>{if(!selected)return toast("Choose a tile first.");const v=+selected.split("-")[1];toast(`Award ${v} points to the active team.`,"good");beep(760,.1);used.add(selected)};$("#jeopardyBack").onclick=()=>{$("#jeopardyQuestion").textContent="Choose a point value.";};bindTip(g);
}
function renderWheel(g,topic){
  const prompts=($("#customPrompts")?.value||"Question\nChallenge\nPicture\nAct It Out\nTrue or False\nBonus\nMystery").split("\n").map(x=>x.trim()).filter(Boolean).slice(0,7);
  let rotation=0;
  $("#gameContent").innerHTML=gameHeader(g)+`<div class="wheel-wrap"><div class="wheel-pointer">🔻</div><div class="wheel" id="wheel"></div><div class="wheel-labels">QUESTION • CHALLENGE • PICTURE • ACT • TRUE/FALSE • BONUS • MYSTERY</div></div><div class="answer-reveal" id="wheelResult">Spin to choose a challenge.</div><div class="game-controls"><button class="btn primary" id="spinWheel">🎡 SPIN</button>${teacherTip(g)}</div></div>`;
  $("#spinWheel").onclick=()=>{const idx=Math.floor(Math.random()*prompts.length);rotation+=1440+(idx*(360/prompts.length));$("#wheel").style.transform=`rotate(${rotation}deg)`;setTimeout(()=>{$("#wheelResult").textContent=`🎯 Your challenge: ${prompts[idx]}`;beep(760,.12)},4000)};
  bindTip(g);
}
function renderPicker(g,topic){
  const names=($("#customNames")?.value||"").split("\n").map(x=>x.trim()).filter(Boolean);state.pickerPool=[...names];
  $("#gameContent").innerHTML=gameHeader(g)+`<div class="clue-box" style="min-height:150px;font-size:2rem" id="pickedStudent">Ready to pick!</div><p class="game-instruction">Fair Mode: ${$("#fairMode")?.checked?"ON":"OFF"}</p><div class="game-controls"><button class="btn primary" id="pickStudent">🎲 Pick a Student</button><button class="btn secondary" id="resetPicker">Reset Names</button>${teacherTip(g)}</div></div>`;
  $("#pickStudent").onclick=()=>{if(!state.pickerPool.length){state.pickerPool=[...names];if(!names.length)return toast("Add student names first.","bad");toast("Everyone has had a turn—pool reset.","good")}let idx=Math.floor(Math.random()*state.pickerPool.length);const chosen=state.pickerPool.splice(idx,1)[0];$("#pickedStudent").textContent=`🎉 ${chosen} — You’re Up!`;celebrate();beep(760,.1)};
  $("#resetPicker").onclick=()=>{state.pickerPool=[...names];$("#pickedStudent").textContent="Ready to pick!"};bindTip(g);
}
function renderTeam(g,topic){
  state.scores=[0,0,0,0,0,0];const n=state.config.teams;const teams=state.teams.slice(0,n);
  $("#gameContent").innerHTML=gameHeader(g)+`<div class="scoreboard" id="activeScores">${teams.map((t,i)=>`<div class="score-card"><b>${escapeHTML(t)}</b><div class="score" id="activeScore${i}">0</div><div class="score-controls"><button data-i="${i}" data-p="1">+1</button><button data-i="${i}" data-p="2">+2</button><button data-i="${i}" data-p="5">+5</button><button data-i="${i}" data-p="-1">−1</button></div></div>`).join("")}</div><div class="game-controls"><button class="btn primary" id="teamWinner">🏆 Show Winner</button>${teacherTip(g)}</div></div>`;
  $$("#activeScores button").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;state.scores[i]=Math.max(0,state.scores[i]+(+b.dataset.p));$(`#activeScore${i}`).textContent=state.scores[i];beep()});
  $("#teamWinner").onclick=()=>{let max=Math.max(...state.scores.slice(0,n));let winners=teams.filter((_,i)=>state.scores[i]===max);endGame(`🏆 ${winners.join(" & ")} wins with ${max} point${max===1?"":"s"}!`)};bindTip(g);
}
function renderHotseat(g,topic){
  const word=$("#customWord")?.value||"PLANT";
  $("#gameContent").innerHTML=gameHeader(g)+`<div class="hotseat" style="background:#fff4d1;border-radius:22px;padding:28px;margin:20px auto;max-width:700px"><div style="font-size:5rem">🔥</div><h2>HOT SEAT</h2><p class="game-instruction">The student in the Hot Seat must guess the mystery word from classmates’ clues.</p><div class="word" style="font-size:2.2rem;filter:blur(12px)" id="hotWord">${escapeHTML(word)}</div></div><div class="timer" id="activeTimer">30s</div><div class="game-controls"><button class="btn primary" id="hotCorrect">Correct</button><button class="btn secondary" id="hotPass">Pass</button><button class="btn danger" id="hotTime">Time’s Up</button>${teacherTip(g)}</div></div>`;
  $("#hotCorrect").onclick=()=>endGame("🔥 Hot Seat solved! Great communication.");$("#hotPass").onclick=()=>toast("Pass! Give the next clue.","bad");$("#hotTime").onclick=()=>endGame(`Time's up! The word was <strong>${escapeHTML(word)}</strong>.`);bindTip(g);timerStart(state.config.timer||30,()=>endGame(`Time's up! The word was <strong>${escapeHTML(word)}</strong>.`));
}
function renderLock(g,topic){
  const qs=($("#customPrompts")?.value||"Question 1\nQuestion 2\nQuestion 3").split("\n").map(x=>x.trim()).filter(Boolean).slice(0,5);let i=0;
  $("#gameContent").innerHTML=gameHeader(g)+`<div class="lock" id="lockIcon">🔒</div><div class="locks">${qs.map((_,j)=>`<span class="lock-dot" id="lockDot${j}"></span>`).join("")}</div><div class="clue-box" id="lockQuestion">${escapeHTML(qs[0]||"Add questions in setup.")}</div><div class="game-controls"><button class="btn primary" id="lockCorrect">Answer Correct</button><button class="btn secondary" id="lockWrong">Try Again</button>${teacherTip(g)}</div></div>`;
  $("#lockCorrect").onclick=()=>{if(i<qs.length){$(`#lockDot${i}`)?.classList.add("done");i++;if(i>=qs.length){$("#lockIcon").textContent="🔓";$("#lockQuestion").innerHTML=`🎉 UNLOCKED!<br><small>Now let's discover why this connects to <strong>${escapeHTML(topic)}</strong>.</small>`;celebrate();setTimeout(()=>endGame("The lock is open! You are ready for the lesson."),700)}else $("#lockQuestion").textContent=qs[i]}};$("#lockWrong").onclick=()=>toast("Try again—discuss the answer with your team.","bad");bindTip(g);
}

function renderRecommendations(need){
  const map={quick:["thisthat","truefalse","picker","mystery"],thinking:["whatami","mystery","corners"],review:["truefalse","fastfive","jeopardy"],participate:["corners","thisthat","picker"],energy:["wheel","team","corners"],topic:["mystery","picture","whatami","lock"]};
  const list=(map[need]||[]).map(id=>games.find(g=>g.id===id)).filter(Boolean);
  $("#recommendations").classList.remove("hidden");
  $("#recommendations").innerHTML=`<div class="section-head"><div><span class="eyebrow">RECOMMENDED FOR YOU</span><h2>Best matches</h2></div></div><div class="recommend-list">${list.map(g=>`<article class="recommend-card"><div class="game-icon">${g.icon}</div><h3>${g.name}</h3><p>${g.desc}</p><span class="badge">Why: ${g.purpose}</span><br><br><button class="btn primary rec-play" data-id="${g.id}">Play Now →</button></article>`).join("")}</div>`;
  $$(".rec-play").forEach(b=>b.onclick=()=>beginSetup(b.dataset.id));$("#recommendations").scrollIntoView({behavior:"smooth",block:"start"});
}
function renderScoreboard(){
  $("#scoreboard").innerHTML=state.teams.map((t,i)=>`<div class="score-card"><b>${escapeHTML(t)}</b><div class="score" id="score${i}">${state.scores[i]||0}</div><div class="score-controls"><button data-i="${i}" data-p="1">+1</button><button data-i="${i}" data-p="2">+2</button><button data-i="${i}" data-p="5">+5</button><button data-i="${i}" data-p="-1">−1</button></div></div>`).join("");
  $$("#scoreboard button").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;state.scores[i]=Math.max(0,(state.scores[i]||0)+(+b.dataset.p));$(`#score${i}`).textContent=state.scores[i];toast("Score updated!","good")});
}
function saveSettings(){
  localStorage.setItem("teacherEdGameSettings",JSON.stringify({sound:state.sound,animation:state.animation,timerSound:state.timerSound,dark:state.dark,reducedMotion:state.reducedMotion}));
}
function loadSettings(){
  const s=JSON.parse(localStorage.getItem("teacherEdGameSettings")||"{}");Object.assign(state,{sound:!!s.sound,animation:s.animation!==false,timerSound:!!s.timerSound,dark:!!s.dark,reducedMotion:!!s.reducedMotion});
  applySettings();$("#soundSetting").checked=state.sound;$("#animationSetting").checked=state.animation;$("#timerSoundSetting").checked=state.timerSound;$("#darkSetting").checked=state.dark;$("#motionSetting").checked=state.reducedMotion;
}
function applySettings(){document.body.classList.toggle("dark",state.dark);$("#soundBtn").textContent=state.sound?"🔊":"🔇";document.documentElement.style.setProperty("--reduce",state.reducedMotion?"0":"1")}
function saveTeams(){state.teams=[1,2,3,4].map(i=>$("#team"+i+"Name").value.trim()||`Team ${String.fromCharCode(64+i)}`);renderScoreboard();toast("Teams updated!","good")}
function saveGameLocal(){
  const g=state.currentGame;if(!g)return;
  const safeConfig={...state.config,pictureDataUrl:"",pictureFileName:state.config.pictureFileName||""};
  const payload={name:g.name,id:g.id,config:safeConfig,savedAt:new Date().toLocaleString()};
  const saved=JSON.parse(localStorage.getItem("teacherEdSavedGames")||"[]");saved.unshift(payload);localStorage.setItem("teacherEdSavedGames",JSON.stringify(saved.slice(0,20)));renderSavedGames();toast("Game saved!","good");
}
function renderSavedGames(){
  const saved=JSON.parse(localStorage.getItem("teacherEdSavedGames")||"[]");
  $("#savedGames").innerHTML=saved.length?saved.map((s,i)=>`<div class="saved-item"><div><b>${escapeHTML(s.name)}</b><small>${escapeHTML(s.config.topic||"No topic")} • ${escapeHTML(s.savedAt)}</small></div><div class="saved-actions"><button data-load="${i}">Load</button><button data-delete="${i}">Delete</button></div></div>`).join(""):`<p style="color:var(--muted)">No saved games yet. Start a game and save its setup.</p>`;
  $$("[data-load]").forEach(b=>b.onclick=()=>{const s=saved[+b.dataset.load];state.config=s.config;beginSetup(s.id)});$$("[data-delete]").forEach(b=>b.onclick=()=>{saved.splice(+b.dataset.delete,1);localStorage.setItem("teacherEdSavedGames",JSON.stringify(saved));renderSavedGames();toast("Saved game deleted.")});
}

function init(){
  loadSettings();renderGames();renderScoreboard();renderSavedGames();
  const daily=games[new Date().getDate()%games.length];$("#dailyGameName").textContent=daily.name;$("#dailyGamePurpose").textContent=daily.desc;$("#dailyPlay").onclick=()=>beginSetup(daily.id);
  $("#heroStart").onclick=()=>navigate("games");$("#heroExplore").onclick=()=>navigate("games");
  $$(".need-card").forEach(b=>b.onclick=()=>renderRecommendations(b.dataset.need));
  $$("nav a").forEach(a=>a.onclick=e=>{e.preventDefault();navigate(a.dataset.page)});
  $("#menuToggle").onclick=()=>$("#mainNav").classList.toggle("open");
  ["gameSearch","gradeFilter","subjectFilter","durationFilter","energyFilter"].forEach(id=>$("#"+id).addEventListener(id==="gameSearch"?"input":"change",renderGames));
  $("#resetFilters").onclick=()=>{
    $("#gameSearch").value="";
    $("#gradeFilter").value="all";
    $("#subjectFilter").value="all";
    $("#durationFilter").value="all";
    $("#energyFilter").value="all";
    renderGames();
    toast("Filters reset!","good");
  };
  $("#closeGame").onclick=()=>{stopTimer();closeModal("#gameModal")};$("#closeSetup").onclick=()=>closeModal("#setupModal");
  $("#startConfiguredGame").onclick=startConfigured;
  $("#soundBtn").onclick=()=>{$("#soundSetting").click()};$("#fullscreenBtn").onclick=()=>document.documentElement.requestFullscreen?.();
  $("#saveTeams").onclick=saveTeams;
  $("#printTips").onclick=()=>window.print();
  $("#soundSetting").onchange=e=>{state.sound=e.target.checked;saveSettings();applySettings();toast(state.sound?"Sound ON":"Sound OFF")};
  $("#animationSetting").onchange=e=>{state.animation=e.target.checked;saveSettings();toast("Animation setting saved.")};
  $("#timerSoundSetting").onchange=e=>{state.timerSound=e.target.checked;saveSettings();toast("Timer sound setting saved.")};
  $("#darkSetting").onchange=e=>{state.dark=e.target.checked;saveSettings();applySettings();toast("Appearance updated.")};
  $("#motionSetting").onchange=e=>{state.reducedMotion=e.target.checked;saveSettings();toast("Motion setting saved.")};
  $("#fullscreenSetting").onclick=()=>document.documentElement.requestFullscreen?.();
  $("#resetSettings").onclick=()=>{if(confirm("Reset all settings and saved games?")){localStorage.removeItem("teacherEdGameSettings");localStorage.removeItem("teacherEdSavedGames");location.reload()}};
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal("#gameModal");closeModal("#setupModal");stopTimer()}});
  window.addEventListener("beforeunload",stopTimer);
}
init();

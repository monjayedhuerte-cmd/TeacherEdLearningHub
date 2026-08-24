const stages=[
["Get the program","Use a trusted source or a legitimate CD/DVD. Never open unknown files."],
["Open Setup","The installer starts and prepares the application for installation."],
["Choose options","The setup may ask for language, license agreement, location, or installation type."],
["Install files","The installer copies and prepares the files needed by the program."],
["Finish","When complete, choose Finish or Close. Some programs may request a restart."],
["Ready to use","The program can now be opened from the Start menu or another shortcut."]
];
let current=0;
const stageList=document.getElementById("stageList");
function renderStages(){
 stageList.innerHTML=stages.map((s,i)=>`<div class="stage ${i===current?'active ':''}${i<current?'done':''}"><b>${i+1}. ${s[0]}</b><br><small>${s[1]}</small></div>`).join("");
}
function updateInstall(){
 document.getElementById("simTitle").textContent=stages[current][0];
 document.getElementById("simText").textContent=stages[current][1];
 document.getElementById("simProgress").style.width=((current)/(stages.length-1)*100)+"%";
 document.getElementById("backBtn").disabled=current===0;
 document.getElementById("nextBtn").textContent=current===stages.length-1?"Done":"Next";
 renderStages();
}
function installNext(){if(current<stages.length-1){current++;updateInstall()}else{alert("Installation simulation complete! No real software was installed.")}}
function installBack(){if(current>0){current--;updateInstall()}}
function resetInstall(){current=0;updateInstall()}
updateInstall();

function reveal(btn,answer,explanation){
 btn.classList.add("revealed");
 btn.querySelector("strong").textContent=answer;
 btn.querySelector("small").textContent=explanation;
}
function startCD(){
 document.getElementById("cdSteps").innerHTML=`
 <ol>
 <li><b>Insert the disc</b> into the computer's disc drive.</li>
 <li><b>Wait for AutoPlay.</b> If it does not appear, open the disc drive and find Setup or Install.</li>
 <li><b>Run Install or Setup.</b> Read the prompts carefully.</li>
 <li><b>Accept the license</b> when required and choose the appropriate options.</li>
 <li><b>Click Next/Continue</b> through the setup instructions.</li>
 <li><b>Click Finish/Close</b> when installation is complete.</li>
 </ol>`;
}
const questions=[
["What is software installation?","a","The process of preparing and setting up a program so it can work on a computer."],
["Which source is generally safer for downloading software?","b","The official developer or trusted organization website."],
["What should you NOT do to uninstall a program?","c","Simply delete the program folder or desktop shortcut."],
["What may an installer ask you to choose?","a","Language, license agreement, installation type, or location."],
["What should you do when unsure about installing a program?","b","Ask a teacher, parent, or trusted adult."]
];
function buildQuiz(){
 document.getElementById("quiz").innerHTML=questions.map((q,i)=>`
 <div class="question"><b>${i+1}. ${q[0]}</b>
 <label><input type="radio" name="q${i}" value="a"> A. ${["Delete the monitor","A random website","Open the folder","Change the keyboard"][i]}</label>
 <label><input type="radio" name="q${i}" value="b"> B. ${["Preparing and setting up a program","Official/trusted source","Use the proper uninstall process","Ask a trusted adult"][i]||"Read the instructions"}</label>
 <label><input type="radio" name="q${i}" value="c"> C. ${["Turn off the computer","Unknown pop-up site","Delete the program folder only","Install everything automatically"][i]||"Ignore the warning"}</label>
 </div>`).join("");
}
function gradeQuiz(){
 let score=0;
 questions.forEach((q,i)=>{let x=document.querySelector(`input[name=q${i}]:checked`);if(x&&x.value===q[1])score++});
 const r=document.getElementById("quizResult");
 r.className="result";
 r.textContent=`Your score: ${score}/${questions.length}. ${score===5?"Excellent! You are ready to explain the process.":score>=3?"Good work! Review the explanations and try again.":"Keep exploring. Review the lesson and try the challenge again."}`;
}
function scrollToId(id){document.getElementById(id).scrollIntoView({behavior:"smooth"})}
buildQuiz();
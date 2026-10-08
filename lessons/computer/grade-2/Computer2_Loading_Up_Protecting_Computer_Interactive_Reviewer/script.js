const state={
 xp:+localStorage.getItem("c2xp")||0,
 badges:+localStorage.getItem("c2badges")||0,
 done:JSON.parse(localStorage.getItem("c2done")||"[]"),
 game:null
};

const Q={
loading:[
["You want to install a new program. What is the safest first step?",["Download it from any pop-up","Use a trusted source","Turn off security tools","Open an unknown attachment"],1,"A trusted source reduces the risk of downloading harmful or fake software."],
["What is an installer mainly used for?",["Deleting the monitor","Installing software on a computer","Making a backup copy","Printing a document"],1,"An installer helps place and set up a software program on the computer."],
["Which is commonly associated with starting a program or installation?",["Executable","Recycle Bin","Firewall","Monitor"],0,"An executable can contain instructions that the computer runs to start a program or installation."],
["Why check storage space before installing software?",["To make the keyboard faster","To make sure there is enough space","To make the screen brighter","To make the mouse move farther"],1,"Software needs storage space. Checking first helps avoid installation problems."],
["A downloaded file is compressed. What may you need to do before using its contents?",["Decompress it","Defragment the monitor","Print it","Shut down the keyboard"],0,"Compressed files may need to be decompressed so their contents can be accessed."],
["An email attachment looks suspicious. What is the safest choice?",["Open it immediately","Forward it to everyone","Do not open or download it","Disable antivirus protection"],2,"Suspicious attachments can contain malware. Avoid opening or downloading them."],
["During installation, what is a responsible action?",["Accept every unknown option","Review settings and choose appropriate options","Delete all configuration files","Turn off the computer"],1,"Reviewing settings helps you understand what the software will install or change."],
["Which shows responsible software use?",["Trusted source + safe setup","Cracked software + unknown site","Ignore warnings","Share an unknown installer"],0,"Responsible software use combines a trusted source, careful downloading, and safe installation."]
],
protecting:[
["What is malware?",["A backup device","Software designed to damage a computer or gain unauthorized access","A printer","A file-organizing tool"],1,"Malware is software designed to damage a computer or gain unauthorized access to personal information."],
["Which tool helps prevent malware and can remove malware?",["Antivirus software","Calculator","Paint","Printer driver"],0,"Antivirus software helps prevent malware and can remove malware."],
["Which is a strong security habit?",["Click suspicious links","Use a weak password","Be cautious with websites and email attachments","Share passwords publicly"],2,"Staying alert when browsing or using email is an important protection habit."],
["Why are backups important?",["They make the monitor larger","They provide copies that can be recovered if files are lost","They remove every virus","They replace the operating system"],1,"Backups protect important files by keeping recoverable copies."],
["Which is an example of a backup location?",["External hard drive","Keyboard cable","Monitor stand","Mouse pad"],0,"The lesson identifies an external hard drive as a place to keep backup copies."],
["What is one benefit of an online backup service?",["Files can be recovered through an Internet connection","It makes passwords public","It removes the need for security","It guarantees free unlimited storage"],0,"Online backup services store files in the cloud so they can be recovered through an Internet connection."],
["What can Disk Cleanup help you do?",["Create a keyboard","Find temporary and other files that can be deleted to free space","Install a printer physically","Increase screen size"],1,"Disk Cleanup scans for temporary and other removable files so space can be freed."],
["Which action best protects personal information on a network?",["Use passwords and user IDs to identify and authenticate users","Post passwords beside the computer","Use the same simple password everywhere","Leave accounts signed in"],0,"User IDs and passwords help authenticate users so access can be controlled."]
],
master:[
["A free software link comes from an unknown website. What should you do?",["Install it immediately","Check the source and avoid suspicious downloads","Disable antivirus","Share it"],1,"Verify the source and avoid suspicious downloads."],
["Important school files are stored only on a computer that suddenly fails. What would have helped most?",["A backup","A brighter monitor","A new mouse","A larger wallpaper"],0,"A backup provides another copy of important files."],
["Which pair is best for computer protection?",["Antivirus + cautious online behavior","Unknown downloads + weak passwords","Public passwords + suspicious links","No backups + random attachments"],0,"Security software plus safe user behavior provides stronger protection."],
["A hard drive is becoming full because of unwanted files. What is appropriate?",["Ignore it","Use Disk Cleanup and remove unnecessary files","Delete important documents randomly","Turn off antivirus"],1,"Disk Cleanup can identify temporary and other files that can be removed."],
["Which statement about an external hard drive is correct?",["It cannot be lost","It can store backups but should be kept secure","It is only for sound","It blocks every virus"],1,"An external drive can hold backups, but it can be lost, damaged, or stolen."],
["A suspicious email attachment arrives. What is safest?",["Open it","Download it and scan later","Avoid opening or downloading it","Send it to a friend"],2,"Suspicious attachments may contain malware."],
["Why should personal information not be disclosed to just anyone?",["It helps prevent unauthorized access and identity theft","It makes the computer slower","It changes screen resolution","It fills the Recycle Bin"],0,"Personal information is sensitive. Limiting access helps protect identity and accounts."],
["Which sequence shows the strongest computer-care routine?",["Download anything → ignore warnings","Trusted source → safe installation → antivirus → backup → maintenance","Disable security → weak passwords","Open suspicious files → share passwords"],1,"The safest routine combines careful installation, protection, backups, and maintenance."]
]
};

const names={loading:"Loading Up Your Computer",protecting:"Protecting Your Computer",master:"Cyber Guardian Challenge"};

function save(){localStorage.setItem("c2xp",state.xp);localStorage.setItem("c2badges",state.badges);localStorage.setItem("c2done",JSON.stringify(state.done))}
function go(id){document.getElementById(id).scrollIntoView({behavior:"smooth",block:"start"})}
function toast(s){const t=document.getElementById("toast");t.textContent=s;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2200)}
function hud(){
 document.getElementById("xp").textContent=state.xp;
 document.getElementById("level").textContent=Math.max(1,Math.floor(state.xp/250)+1);
 document.getElementById("badges").textContent=state.badges;
 document.getElementById("finalXP").textContent=state.xp;
 document.getElementById("finalBadges").textContent=state.badges;
 document.getElementById("done").textContent=state.done.length+"/3";
 const p=Math.round(state.done.length/3*100);
 document.getElementById("progressBar").style.width=p+"%";
 document.getElementById("progressText").textContent=p+"%";
 const b=document.getElementById("masterBtn");
 if(state.done.includes("loading")&&state.done.includes("protecting")){
  b.disabled=false;b.textContent="Enter Final Mission";document.getElementById("masterCard").classList.remove("locked");
 }
}
function start(type){
 if(type==="master"&&!(state.done.includes("loading")&&state.done.includes("protecting"))){toast("Complete Missions 01 and 02 first.");return}
 state.game={type,i:0,score:0,answered:false};
 document.getElementById("gameTitle").textContent=names[type];
 go("game");render();
}
function render(){
 const g=state.game,q=Q[g.type][g.i];
 document.getElementById("score").textContent=g.score;
 document.getElementById("gamePanel").className="panel";
 document.getElementById("gamePanel").innerHTML=
 `<div class="qTop"><div class="qCount">Question ${g.i+1} of ${Q[g.type].length}</div><div class="points">+25 XP correct</div></div>
 <div class="question"><h3>${q[0]}</h3><div class="hint">Choose the safest or most accurate answer.</div>
 <div class="options">${q[1].map((x,i)=>`<button class="option" onclick="answer(${i})">${String.fromCharCode(65+i)}. ${x}</button>`).join("")}</div>
 <div id="feedback"></div><div class="nextRow"><button id="next" class="btn primary" style="display:none" onclick="next()">Next Question →</button></div></div>`;
}
function answer(i){
 const g=state.game;if(g.answered)return;g.answered=true;
 const q=Q[g.type][g.i],bs=[...document.querySelectorAll(".option")];
 bs.forEach(b=>b.disabled=true);bs[q[2]].classList.add("correct");
 const f=document.getElementById("feedback");
 if(i===q[2]){
  g.score+=25;state.xp+=25;f.className="feedback good";f.innerHTML="🎉 Correct! "+q[3];toast("+25 XP — Excellent choice!");
 }else{
  bs[i].classList.add("wrong");f.className="feedback bad";f.innerHTML="💡 Not quite. "+q[3];toast("Keep going — learn from the explanation!");
 }
 document.getElementById("score").textContent=g.score;document.getElementById("next").style.display="inline-block";hud();save();
}
function next(){
 const g=state.game;if(g.i<Q[g.type].length-1){g.i++;g.answered=false;render()}else finish(g.type)
}
function finish(type){
 const g=state.game,total=Q[type].length*25,pct=Math.round(g.score/total*100),first=!state.done.includes(type);
 if(first){state.done.push(type);state.xp+=pct>=80?75:25;state.badges++;save();toast("Mission complete! Bonus XP unlocked.");}
 hud();
 document.getElementById("gamePanel").innerHTML=
 `<div class="placeholder"><div>${pct>=80?"🏆":"🔧"}</div><p class="eyebrow">${pct>=80?"MISSION CLEARED":"MISSION COMPLETE"}</p>
 <h3>${names[type]}</h3><p>You scored <strong>${g.score}/${total}</strong> (${pct}%). ${pct>=80?"Excellent work—you are ready for the next mission.":"Review the Quick Review cards and strengthen the concepts you missed."}</p>
 <button class="btn primary" onclick="${type==="master"?"finalStatus()":"go('missions')"}">${type==="master"?"View Final Status":"Choose Next Mission"}</button></div>`;
 if(type==="master")finalStatus();
}
function finalStatus(){
 const all=state.done.length===3;
 document.getElementById("resultTitle").textContent=all?"CYBER GUARDIAN ACHIEVED!":"Keep Training, Guardian!";
 document.getElementById("resultMessage").textContent=all?"You completed both lessons and the final challenge. You are ready for the next topic.":"Complete all three missions to earn the final achievement.";
 document.getElementById("achievement").textContent=all?"🏆 COMPUTER 2 CYBER GUARDIAN — Loading Up + Protecting mastered!":"🔒 Final achievement unlocks after all missions are complete.";
 go("results");hud();
}
function flip(el){el.classList.toggle("flipped")}
function resetProgress(){
 if(!confirm("Reset your Computer 2 reviewer progress?"))return;
 localStorage.removeItem("c2xp");localStorage.removeItem("c2badges");localStorage.removeItem("c2done");
 state.xp=0;state.badges=0;state.done=[];state.game=null;hud();toast("Progress reset.");
}
hud();

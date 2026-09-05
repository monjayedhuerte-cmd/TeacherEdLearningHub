const tools=[["student-participation","Student Participation","🎯","manage","CLASSROOM MANAGEMENT","Pick students fairly and make participation more exciting.","Student_Participation_Hub_Teacher_Ed/index.html"],

["classroom-timer","Classroom Timer","⏱️","manage","CLASSROOM MANAGEMENT","Keep activities, group work, discussions, and transitions on time.","Classroom_Timer_Tool_Teacher_Ed/index.html"],

["attention-getter","Attention Getter","🔔","manage","CLASSROOM MANAGEMENT","Use fun visual and sound cues to bring the class back together.","Classroom_Attention_Getter_Tool_Teacher_Ed/index.html"],

["noise-meter","Noise Meter","🔊","manage","CLASSROOM MANAGEMENT","Help students see the classroom noise level and know when to lower voices.","Classroom_Noise_Meter_Tool_Teacher_Ed/index.html"],

["exit-ticket","Exit Ticket","🎟️","assess","ASSESSMENT","Collect quick reflections and understanding checks before students leave.","Classroom_Exit_Ticket_Tool_Teacher_Ed/index.html"],

["brain-break","Brain Break","🧠","engage","ENGAGEMENT","Reset energy, refocus attention, and give learners a short break.","Classroom_Brain_Break_Tool_Teacher_Ed/index.html"],

["quick-class-poll","Quick Class Poll","📊","assess","ASSESSMENT","Ask a question and instantly visualize class responses.","Quick_Class_Poll_Tool_Teacher_Ed/index.html"]];

let cat="all";const grid=document.getElementById("toolsGrid"),none=document.getElementById("none");
function render(){let q=document.getElementById("search").value.toLowerCase().trim();let a=tools.filter(t=>(cat==="all"||t[3]===cat)&&(!q||(t[1]+" "+t[5]+" "+t[4]).toLowerCase().includes(q)));grid.innerHTML=a.map(t=>`<article class="card"><div class="icon">${t[2]}</div><h3>${t[1]}</h3><p>${t[5]}</p><div class="cardfoot"><span class="badge">${t[4]}</span><a class="open" href="${t[6]}">OPEN TOOL →</a></div></article>`).join("");none.style.display=a.length?"none":"block"}
document.querySelectorAll(".cats button").forEach(b=>b.onclick=()=>{cat=b.dataset.cat;document.querySelectorAll(".cats button").forEach(x=>x.classList.remove("active"));b.classList.add("active");render()});function go(id){document.getElementById(id).scrollIntoView({behavior:"smooth"})}document.getElementById("year").textContent=new Date().getFullYear();render();
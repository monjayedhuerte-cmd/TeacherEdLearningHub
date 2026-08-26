const activities=[
{icon:"🕺",title:"Freeze Dance",cat:"movement",tag:"ACTIVE",desc:"Move safely while the teacher claps or plays music. When the sound stops, freeze like a statue!",challenge:"Move, freeze, and hold your pose!"},
{icon:"🪞",title:"Mirror Me",cat:"movement",tag:"ACTIVE",desc:"Choose a leader. Everyone copies the leader's slow movements without touching anyone.",challenge:"Can the class move together like one giant mirror?"},
{icon:"🦁",title:"Move Like an Animal",cat:"movement",tag:"ACTIVE",desc:"The teacher calls an animal. Move in place like that animal for a few seconds.",challenge:"Show your best safe animal movement!"},
{icon:"🙆",title:"Stretch & Reach",cat:"movement",tag:"CALM MOVE",desc:"Reach up, reach side to side, roll your shoulders, and take a deep breath.",challenge:"Stretch tall like you are reaching for the sky."},
{icon:"👏",title:"Copy the Beat",cat:"fun",tag:"FUN",desc:"The teacher makes a short clap pattern. Students listen carefully and copy it.",challenge:"Listen first. Then copy the pattern perfectly!"},
{icon:"🗿",title:"Statue Challenge",cat:"fun",tag:"FUN",desc:"Move around your personal space. When the teacher says STATUE, freeze in a creative pose.",challenge:"Freeze without laughing or moving!"},
{icon:"🧠",title:"Memory Chain",cat:"brain",tag:"BRAIN",desc:"Teacher says three words. Students repeat them in order. Add one word each round.",challenge:"How many words can the class remember?"},
{icon:"🔢",title:"Number Ninja",cat:"brain",tag:"BRAIN",desc:"Teacher gives quick mental-number challenges. Students show the answer with fingers or silently.",challenge:"Think fast—but stay silent!"},
{icon:"👀",title:"Focus Detective",cat:"focus",tag:"FOCUS",desc:"Look around the room. Find three things that match the teacher's clues without leaving your seat.",challenge:"Find them before the countdown reaches zero."},
{icon:"👂",title:"Sound Detective",cat:"focus",tag:"FOCUS",desc:"Close or soften your eyes. Listen carefully for sounds inside and outside the classroom.",challenge:"Name three different sounds you noticed."},
{icon:"🌬️",title:"Box Breathing",cat:"calm",tag:"RESET",desc:"Breathe in for 4, hold for 4, breathe out for 4, and hold for 4.",challenge:"Calm body. Calm mind. Ready to learn."},
{icon:"☁️",title:"Cloud Stretch",cat:"calm",tag:"RESET",desc:"Imagine you are a cloud. Slowly stretch your arms, breathe deeply, and let your body relax.",challenge:"Move slowly and quietly."},
{icon:"🤪",title:"Would You Rather?",cat:"fun",tag:"FUN",desc:"Teacher gives two silly choices. Students point left or right to choose—no shouting!",challenge:"Choose quickly and be ready to explain why."},
{icon:"🎯",title:"Left or Right",cat:"focus",tag:"FOCUS",desc:"Teacher calls left, right, up, or down. Students respond with only their hands.",challenge:"Can you follow every direction correctly?"},
{icon:"😄",title:"Silent Laugh",cat:"fun",tag:"FUN",desc:"Try to make a funny face without making a sound. Classmates must keep their voices off too.",challenge:"Can you make everyone smile without making noise?"},
{icon:"🌳",title:"Tree Pose",cat:"calm",tag:"BALANCE",desc:"Stand beside your desk if safe. Balance on one foot for a few seconds, then switch.",challenge:"Find your balance and breathe slowly."}
];
let current=-1,filter="all",last=-1,seconds=60,total=60,timer=null,running=false,sound=true;
const $=id=>document.getElementById(id);
function filtered(){return filter==="all"?activities:activities.filter(a=>a.cat===filter)}
function renderCards(){const arr=filtered();$("count").textContent=arr.length+" activities";$("cards").innerHTML=arr.map((a,i)=>`<div class="card" data-i="${activities.indexOf(a)}"><span class="cicon">${a.icon}</span><b>${a.title}</b><small>${a.desc}</small><span class="ctag">${a.tag}</span></div>`).join("");document.querySelectorAll(".card").forEach(c=>c.onclick=()=>select(Number(c.dataset.i)))}
function select(i){current=i;last=i;const a=activities[i];$("emoji").textContent=a.icon;$("title").textContent=a.title;$("categoryLabel").textContent=a.tag;$("tag").textContent=a.tag;$("description").textContent=a.desc;$("challenge").textContent=a.challenge;renderCards();resetTimer()}
function pick(){const arr=filtered().map(a=>activities.indexOf(a));if(!arr.length)return;let n=arr[Math.floor(Math.random()*arr.length)];if(arr.length>1)while(n===last)n=arr[Math.floor(Math.random()*arr.length)];select(n);spark()}
function spark(){if(sound){try{const c=new (window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.frequency.value=520;g.gain.value=.035;o.connect(g);g.connect(c.destination);o.start();setTimeout(()=>{o.frequency.value=780},80);setTimeout(()=>{o.stop();c.close()},170)}catch(e){}}}
function resetTimer(){clearInterval(timer);timer=null;running=false;seconds=total;updateTime();$("startBtn").textContent="▶ START BREAK";$("pauseBtn").disabled=true;document.body.classList.remove("running")}
function updateTime(){let m=Math.floor(seconds/60),s=seconds%60;$("time").textContent=String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");$("progress").style.width=((total-seconds)/total*100)+"%"}
function start(){if(running)return;running=true;$("startBtn").textContent="▶ RUNNING";$("pauseBtn").disabled=false;document.body.classList.add("running");spark();timer=setInterval(()=>{seconds--;updateTime();if(seconds<=0){clearInterval(timer);timer=null;running=false;$("pauseBtn").disabled=true;$("startBtn").textContent="✓ BREAK COMPLETE";document.body.classList.remove("running");if(sound)alert("Brain break complete! Great job, everyone.");}},1000)}
function pause(){if(!running)return;clearInterval(timer);timer=null;running=false;$("pauseBtn").disabled=true;$("startBtn").textContent="▶ RESUME";document.body.classList.remove("running")}
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{filter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");renderCards()});
document.querySelectorAll(".timer-controls button").forEach(b=>b.onclick=()=>{total=seconds=Number(b.dataset.sec);document.querySelectorAll(".timer-controls button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");updateTime();resetTimer()});
$("randomBtn").onclick=pick;$("nextBtn").onclick=pick;$("startBtn").onclick=start;$("pauseBtn").onclick=pause;
$("lowBtn").onclick=()=>{filter="calm";document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("selected",x.dataset.filter==="calm"));pick()};
$("highBtn").onclick=()=>{filter="movement";document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("selected",x.dataset.filter==="movement"));pick()};
$("soundBtn").onclick=()=>{sound=!sound;$("soundBtn").textContent=sound?"🔊 Sound On":"🔇 Sound Off"};
$("fullBtn").onclick=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.()};
select(0);

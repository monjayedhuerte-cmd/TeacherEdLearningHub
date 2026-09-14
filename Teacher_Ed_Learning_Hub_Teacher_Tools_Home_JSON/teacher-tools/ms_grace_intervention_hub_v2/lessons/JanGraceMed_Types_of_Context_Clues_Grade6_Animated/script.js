const G={
easy:[
["“Mia was famished, which means she was extremely hungry.” What type of clue is used?","Definition",["Definition","Synonym","Antonym","Example"],"The phrase directly explains famished."],
["“The puppy was timid, or shy, when it entered the room.”","Synonym",["Antonym","Example","Synonym","Inference"],"Shy is similar in meaning to timid."],
["“Unlike his gregarious brother, Carlo was quiet and preferred to be alone.”","Antonym",["Definition","Antonym","Example","Synonym"],"Unlike signals a contrast."],
["“Nocturnal animals, such as owls and bats, are active at night.”","Example",["Example","Inference","Antonym","Definition"],"Owls and bats are examples."],
["“Lena forgot her umbrella. Dark clouds filled the sky, and raindrops began tapping.”","Inference",["Synonym","Definition","Inference","Example"],"Several details let you infer the meaning."]
],
average:[
["“The museum was filled with artifacts, such as ancient coins, pottery, tools, and jewelry.” What does artifacts mean?","objects from the past",["objects from the past","a type of food","a modern machine","a place to sleep"],"The listed objects are examples."],
["“The path was treacherous; it was dangerous because of loose rocks and steep drops.”","dangerous",["beautiful","dangerous","quiet","short"],"The sentence directly defines treacherous."],
["“Unlike the generous donor, the miser counted every coin and refused to share.”","unwilling to spend or give money",["a generous person","unwilling to spend or give money","a coin collector","a borrower"],"The contrast with generous provides the clue."],
["“Ana was diligent. She worked carefully every day and never left an assignment unfinished.”","hardworking and careful",["sleepy and careless","hardworking and careful","loud and playful","confused and late"],"Her actions support the inferred meaning."],
["“The road was narrow, meaning it was not wide enough for two vehicles to pass comfortably.”","not wide",["very long","not wide","very smooth","crowded"],"Meaning introduces a direct definition."]
],
difficult:[
["“The old house looked dilapidated. Its cracked walls, broken windows, and sagging roof showed it had not been maintained for years.”","in poor condition from age or neglect",["new and modern","in poor condition from age or neglect","bright and colorful","large and comfortable"],"The details allow an inference."],
["“The speaker's argument was plausible: the evidence made his explanation seem reasonable.”","reasonable or believable",["impossible","reasonable or believable","angry","unrelated"],"The sentence explains plausible."],
["“The river was tranquil, unlike the turbulent stream downstream.”","calm and peaceful",["calm and peaceful","very deep","dirty","fast"],"Tranquil contrasts with turbulent."],
["“The habitat supports organisms, including insects, birds, reptiles, and small mammals.”","natural home or environment",["natural home or environment","an organism","weather","a tool"],"The examples help reveal habitat."],
["“The judge studied evidence and statements. Her decision was impartial. She did not favor either side.”","fair and unbiased",["strict and angry","fair and unbiased","quick and careless","confused"],"The details support the inference."]
],
master:[
["“The benevolent nurse donated food and clothing to families in need.” What type of clue is strongest?","Inference",["Definition","Synonym","Antonym","Inference"],"Her actions allow you to infer benevolent."],
["“The canyon was immense, or enormous, stretching for miles.”","Synonym",["Example","Antonym","Synonym","Inference"],"Enormous is a synonym."],
["“The child was reluctant to speak; she was eager to talk earlier, but now stayed silent.”","Antonym",["Antonym","Definition","Example","Synonym"],"Eager contrasts with reluctant."],
["“A peninsula is a piece of land almost surrounded by water, such as Florida.”","Definition",["Inference","Definition","Antonym","Synonym"],"The sentence directly defines peninsula."],
["“The campsite was secluded. No people were nearby, the road was far away, and only birds could be heard.”","Inference",["crowded","private or away from other people","dangerous","noisy"],"Several details support the inferred meaning."]
]};
const names={easy:["🔎","LEVEL 1","Clue Scout"],average:["🧩","LEVEL 2","Clue Puzzle"],difficult:["🚪","LEVEL 3","Evidence Escape"],master:["🏆","FINAL","Clue Master"]};
let mode="",i=0,score=0,streak=0,done=JSON.parse(localStorage.jgTypesDone||"[]");
const $=x=>document.getElementById(x);
function progress(){$("prog").textContent=`${done.length} / 4 challenges completed`;$("bar").style.width=done.length*25+"%"}
function start(m){mode=m;i=0;score=0;streak=0;$("menu").classList.add("hidden");$("panel").classList.remove("hidden");$("icon").textContent=names[m][0];$("name").textContent=names[m][2];$("total").textContent=G[m].length;load()}
function load(){let x=G[mode][i];$("num").textContent=i+1;$("qbar").style.width=i/G[mode].length*100+"%";$("q").textContent=x[0];$("choices").innerHTML="";$("feedback").className="feedback hidden";$("next").classList.add("hidden");x[2].forEach(o=>{let b=document.createElement("button");b.className="choice";b.textContent=o;b.onclick=()=>answer(o,b,x);$("choices").appendChild(b)})}
function answer(o,b,x){if(document.querySelector(".choice.correct,.choice.wrong"))return;let ok=o===x[1];b.classList.add(ok?"correct":"wrong");if(!ok)[...document.querySelectorAll(".choice")].find(z=>z.textContent===x[1])?.classList.add("correct");streak=ok?streak+1:0;score+=ok?100+25*(streak-1):0;$("score").textContent=score;$("streak").textContent=streak;$("feedback").className="feedback "+(ok?"good":"bad");$("feedback").innerHTML=ok?"🎉 <b>Excellent!</b> "+x[3]:"💡 <b>Keep investigating.</b> Best answer: <b>"+x[1]+"</b>. "+x[3];$("next").classList.remove("hidden")}
function next(){i++;if(i<G[mode].length){load()}else{if(!done.includes(mode)){done.push(mode);localStorage.jgTypesDone=JSON.stringify(done)}$("q").textContent=`🏆 ${names[mode][2]} complete! Score: ${score}`;$("choices").innerHTML="";$("feedback").className="feedback good";$("feedback").textContent="⭐ Great work! Try another level to strengthen your context-clue skills.";$("next").textContent="Back to Challenges →";$("next").onclick=exit;progress()}}
function exit(){$("panel").classList.add("hidden");$("menu").classList.remove("hidden");$("next").onclick=next;$("next").textContent="Next →";progress();scrollTo({top:$("menu").offsetTop-90,behavior:"smooth"})}
const guide=[["📖","Definition","The sentence directly explains the meaning."],["🔁","Synonym","A similar word gives the clue."],["↔️","Antonym","An opposite or contrasting word helps."],["💡","Example","Examples show what the word refers to."],["🕵️","Inference","Combine details and reason out the meaning."]];
$("guide").innerHTML=guide.map(x=>`<button><strong>${x[0]} ${x[1]}</strong><br><small>${x[2]}</small></button>`).join("");
$("levels").innerHTML=[["easy","🔎","LEVEL 1","Clue Scout","Spot the clue type in friendly examples."],["average","🧩","LEVEL 2","Clue Puzzle","Use context to solve meaning and clue questions."],["difficult","🚪","LEVEL 3","Evidence Escape","Crack harder clues and unlock the challenge."],["master","🏆","FINAL","Clue Master","Mixed mastery challenge with all clue types."]].map(x=>`<button class="level" onclick="start('${x[0]}')"><span class="ico">${x[1]}</span><small>${x[2]}</small><h3>${x[3]}</h3><p>${x[4]}</p><b>Play →</b></button>`).join("");
$("exit").onclick=exit;$("next").onclick=next;progress();
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function goTo(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
}
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>goTo(b.dataset.go)));

const nav = $$(".nav-pill");
const sections = ["motivation","explore","discuss","practice","familytree","check","values"];
window.addEventListener("scroll",()=>{
  let current="motivation";
  sections.forEach(id=>{
    const el=document.getElementById(id);
    if(el && window.scrollY >= el.offsetTop-160) current=id;
  });
  nav.forEach(n=>n.classList.toggle("active",n.dataset.go===current));
});

$$(".choice").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const fb=$("#motivationFeedback");
    if(btn.dataset.answer==="family"){
      fb.textContent="🎉 Tama! Sila ay PAMILYA! Handa ka na bang tuklasin ang ating aralin?";
      fb.style.color="#4c9a69";
      btn.style.background="#e9f7ed";
    }else{
      fb.textContent="😊 Subukan muli. Isipin ang mga taong nagmamahalan at nagtutulungan sa bahay.";
      fb.style.color="#d1783d";
    }
  });
});

const memberData={
  tatay:{icon:"👨",title:"Tatay – Haligi ng tahanan",text:"Ang tatay ay karaniwang tumutulong sa pagtugon sa mga pangangailangan ng pamilya. Gumagabay at nagmamalasakit siya sa mga anak."},
  nanay:{icon:"👩",title:"Nanay – Ilaw ng tahanan",text:"Ang nanay ay nag-aalaga at gumagabay sa mga kasapi ng pamilya at tumutulong sa pang-araw-araw na pangangailangan."},
  kuya:{icon:"👦",title:"Kuya – Nakatatandang kapatid",text:"Si kuya ay maaaring tumulong sa mga magulang at gumabay o tumulong sa nakababatang kapatid."},
  ate:{icon:"👧",title:"Ate – Nakatatandang kapatid",text:"Si ate ay maaaring tumulong sa mga magulang at gumabay sa nakababatang kapatid."},
  bunso:{icon:"👶",title:"Bunso – Pinakabatang kasapi",text:"Si bunso ang pinakabatang kasapi ng pamilya at karaniwang nagbibigay ng saya at sigla sa tahanan."},
  lolo:{icon:"👴",title:"Lolo",text:"Si lolo ay maaaring magbigay ng pag-aalaga, payo at pagmamahal sa pamilya. Siya ay magulang ng ating tatay o nanay."},
  lola:{icon:"👵",title:"Lola",text:"Si lola ay maaaring tumulong sa pag-aalaga at magbigay ng payo at pagmamahal. Siya ay magulang ng ating tatay o nanay."},
  tito:{icon:"🧔",title:"Tito",text:"Si tito ay kapatid ng ating mga magulang. Siya ay maaaring maging katuwang at gabay ng pamilya."},
  tita:{icon:"👩‍🦱",title:"Tita",text:"Si tita ay kapatid ng ating mga magulang. Siya ay maaaring maging katuwang at gabay ng pamilya."},
  pinsan:{icon:"🧒",title:"Pinsan",text:"Ang pinsan ay anak ng ating tito o tita. Maaari natin silang makasama at makalaro."}
};
$$(".member-card").forEach(card=>{
  card.addEventListener("click",()=>{
    $$(".member-card").forEach(c=>c.classList.remove("selected"));
    card.classList.add("selected");
    const d=memberData[card.dataset.member];
    $("#memberInfo").innerHTML=`<div class="info-icon">${d.icon}</div><div><h3>${d.title}</h3><p>${d.text}</p></div>`;
  });
});

const matches=[
 {q:"Sino ang tinatawag na haligi ng tahanan?",opts:["Tatay","Pinsan","Bunso"],a:"Tatay"},
 {q:"Sino ang tinatawag na ilaw ng tahanan?",opts:["Kuya","Nanay","Tito"],a:"Nanay"},
 {q:"Sino ang nakatatandang kapatid na lalaki?",opts:["Lolo","Kuya","Bunso"],a:"Kuya"},
 {q:"Sino ang pinakabatang kasapi ng pamilya?",opts:["Bunso","Ate","Lola"],a:"Bunso"},
 {q:"Sino ang mga magulang ng ating tatay o nanay?",opts:["Lolo at Lola","Tito at Tita","Ate at Kuya"],a:"Lolo at Lola"}
];
let mi=0,ms=0,answeredMatch=false;
function renderMatch(){
  const item=matches[mi];
  $("#matchQuestion").textContent=item.q;
  $("#matchOptions").innerHTML=item.opts.map(o=>`<button data-o="${o}">${o}</button>`).join("");
  $("#matchFeedback").textContent="";
  $("#nextMatch").classList.add("hidden");
  answeredMatch=false;
  $$("#matchOptions button").forEach(b=>b.addEventListener("click",()=>{
    if(answeredMatch)return;
    answeredMatch=true;
    if(b.dataset.o===item.a){
      ms++; $("#matchScore").textContent=ms;
      $("#matchFeedback").textContent="🎉 Magaling! Tama ang sagot!";
      $("#matchFeedback").style.color="#4c9a69";
    }else{
      $("#matchFeedback").textContent=`💡 Balikan ang paliwanag. Ang tamang sagot ay ${item.a}.`;
      $("#matchFeedback").style.color="#d1783d";
    }
    if(mi<matches.length-1)$("#nextMatch").classList.remove("hidden");
    else $("#matchFeedback").textContent += " 🏆 Natapos mo ang matching game!";
  }));
}
$("#nextMatch").addEventListener("click",()=>{mi++;renderMatch()});
renderMatch();

$("#buildTree").addEventListener("click",()=>{
  const vals=["parent1","parent2","sibling1","me","sibling2"].map(id=>$("#"+id).value.trim());
  const names=vals.map((v,i)=>v||["Nanay/Magulang","Tatay/Magulang","Kapatid","Ako","Kapatid"][i]);
  $("#customTree").innerHTML=`
    <div class="tree-demo">
      <div class="generation middle"><div class="person">👩<span>${names[0]}</span></div><div class="person">👨<span>${names[1]}</span></div></div>
      <div class="branch-line"></div>
      <div class="generation children">
        <div class="person">👦<span>${names[2]}</span></div>
        <div class="person special">🧒<span>${names[3]}</span></div>
        <div class="person">👧<span>${names[4]}</span></div>
      </div>
    </div>`;
});

const quiz=[
 {q:"Ano ang pinakamaliit na grupo ng mga tao sa pamayanan?",o:["Pamilya","Palengke","Paaralan"],a:0},
 {q:"Sino ang karaniwang tinatawag na haligi ng tahanan?",o:["Tatay","Bunso","Pinsan"],a:0},
 {q:"Sino ang tinatawag na ilaw ng tahanan?",o:["Kuya","Nanay","Tito"],a:1},
 {q:"Ano ang tawag sa mga anak ng ating mga magulang?",o:["Magkakapatid","Magpipinsan","Magtito"],a:0},
 {q:"Ano ang family tree?",o:["Larawan ng bahay","Ilustrasyon ng ugnayan ng pamilya","Larawan ng paaralan"],a:1},
 {q:"Alin ang nagpapakita ng pagmamahal sa pamilya?",o:["Pagtulong sa gawaing-bahay","Pagsigaw sa kapatid","Hindi pagsunod"],a:0},
 {q:"Bakit mahalaga ang bawat kasapi ng pamilya?",o:["Dahil lahat ay may ambag at dapat pahalagahan","Dahil pare-pareho ang lahat","Dahil kailangan silang sundin palagi"],a:0}
];
let qi=0,qs=0,qAnswered=false;
function renderQuiz(){
  const item=quiz[qi];
  $("#quizNumber").textContent=`Tanong ${qi+1} ng ${quiz.length}`;
  $("#quizScore").textContent=qs;
  $("#quizProgressBar").style.width=`${(qi/quiz.length)*100}%`;
  $("#quizFeedback").textContent="";
  $("#nextQuiz").classList.add("hidden");
  qAnswered=false;
  $("#quizContent").innerHTML=`<div class="quiz-question">${item.q}</div><div class="quiz-options">${item.o.map((o,i)=>`<button data-i="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join("")}</div>`;
  $$("#quizContent .quiz-options button").forEach(b=>b.addEventListener("click",()=>{
    if(qAnswered)return;
    qAnswered=true;
    const chosen=+b.dataset.i;
    $$("#quizContent .quiz-options button").forEach(x=>x.disabled=true);
    if(chosen===item.a){qs++;b.classList.add("correct");$("#quizFeedback").textContent="🎉 Tama!";$("#quizFeedback").style.color="#4c9a69"}
    else {b.classList.add("wrong");$("#quizFeedback").textContent=`💡 Hindi iyon. Ang tamang sagot ay ${item.o[item.a]}.`;$("#quizFeedback").style.color="#d1783d"}
    $("#quizScore").textContent=qs;
    if(qi<quiz.length-1)$("#nextQuiz").classList.remove("hidden");
    else{
      $("#quizProgressBar").style.width="100%";
      $("#quizFeedback").textContent += ` 🏆 Natapos mo ang quiz! Iskor: ${qs}/${quiz.length}.`;
      showQuizResult();
    }
  }));
}
function showQuizResult(){
  setTimeout(()=>{
    let message=qs>=6?"🌟 Napakahusay! Family Champion ka!":qs>=4?"👏 Magaling! Kaunti na lang, kaya mo yan!":"💪 Huwag sumuko! Balikan natin ang lesson at subukan muli.";
    $("#quizContent").insertAdjacentHTML("beforeend",`<div class="note-card" style="margin-top:20px"><span>🏆</span><p><strong>${message}</strong></p></div>`);
  },200);
}
$("#nextQuiz").addEventListener("click",()=>{qi++;renderQuiz()});
renderQuiz();

$$(".sentence-buttons button").forEach(b=>b.addEventListener("click",()=>{
  $("#sentenceBlank").textContent=b.dataset.sentence;
  $("#celebration").textContent="💖 Napakaganda! Ipinakita mo kung paano pahalagahan ang pamilya!";
}));

$("#teacherModeBtn").addEventListener("click",()=>{
  const panel=$("#teacherPanel");
  panel.classList.toggle("hidden");
  if(!panel.classList.contains("hidden")) panel.scrollIntoView({behavior:"smooth"});
});

$("#modalClose").addEventListener("click",()=>$("#modal").classList.add("hidden"));

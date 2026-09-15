let allLessons=[];
async function loadLessons(){
 const grid=document.getElementById("lessonGrid");
 try{const r=await fetch("lessons.json");if(!r.ok)throw Error();const d=await r.json();allLessons=d.lessons||[];renderLessons(allLessons)}
 catch(e){grid.innerHTML='<div class="loading">🌿 Could not load lessons.json. Use VS Code Live Server when testing.</div>'}
}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function renderLessons(items){
 const g=document.getElementById("lessonGrid");
 if(!items.length){g.innerHTML='<div class="loading">🐾 No lessons found yet.</div>';return}
 g.innerHTML=items.map(l=>`<a class="lesson-card" href="${l.url}"><div class="lesson-top">🌿</div><div class="lesson-body"><span class="badge">${esc(l.subject||"Learning")} • ${esc(l.grade||"")}</span><h3>${esc(l.title)}</h3><p>${esc(l.description||"Explore this learning adventure.")}</p><span class="open">Open Adventure →</span></div></a>`).join("")
}
document.getElementById("searchInput").addEventListener("input",e=>{let q=e.target.value.toLowerCase();renderLessons(allLessons.filter(l=>[l.title,l.subject,l.grade,l.description,l.type].join(" ").toLowerCase().includes(q)))});
loadLessons();
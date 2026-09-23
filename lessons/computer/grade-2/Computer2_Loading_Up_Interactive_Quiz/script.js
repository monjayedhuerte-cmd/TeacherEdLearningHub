const state={all:[],questions:[],index:0,score:0,answers:[],quick:false,sound:true};
const $=id=>document.getElementById(id);
fetch('quiz.json').then(r=>r.json()).then(data=>{state.all=data.questions;bind();}).catch(()=>alert('Quiz data could not be loaded. Keep quiz.json beside index.html.'));
function bind(){$('startBtn').onclick=()=>start(false);$('quickBtn').onclick=()=>start(true);$('nextBtn').onclick=next;$('hintBtn').onclick=()=>$('hintText').classList.toggle('hidden');$('retryBtn').onclick=()=>start(state.quick);$('reviewBtn').onclick=showReview;$('reviewHome').onclick=()=>{$('review').classList.add('hidden');$('result').classList.remove('hidden')};$('homeBtn').onclick=home;$('quitBtn').onclick=home;$('fsBtn').onclick=fullscreen;$('soundBtn').onclick=()=>{state.sound=!state.sound;$('soundBtn').textContent=state.sound?'🔊 Sound':'🔇 Sound'}}
function shuffleOptions(q){
  const items=q.options.map((text,i)=>({text,correct:i===q.answer}));
  for(let i=items.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [items[i],items[j]]=[items[j],items[i]];
  }
  return {
    ...q,
    options:items.map(x=>x.text),
    answer:items.findIndex(x=>x.correct)
  };
}

function start(quick){
  state.quick=quick;
  state.index=0;
  state.score=0;
  state.answers=[];

  // Shuffle the answer choices for every question on every new attempt.
  // This prevents the correct answer from always appearing as choice A.
  const pool=[...state.all].sort(()=>Math.random()-.5);
  state.questions=(quick?pool.slice(0,10):pool).map(q=>shuffleOptions({
    ...q,
    options:[...q.options]
  }));

  $('home').classList.add('hidden');
  $('result').classList.add('hidden');
  $('review').classList.add('hidden');
  $('quiz').classList.remove('hidden');
  render();
  scrollTo(0,0);
}
function render(){const q=state.questions[state.index],total=state.questions.length;$('questionNumber').textContent=`Question ${state.index+1}`;$('progressText').textContent=`${state.index+1} of ${total}`;$('percentText').textContent=`${Math.round((state.index+1)/total*100)}%`;$('progressBar').style.width=`${(state.index+1)/total*100}%`;$('liveScore').textContent=state.score;$('difficulty').textContent=q.difficulty;$('questionText').textContent=q.question;$('feedback').className='feedback hidden';$('feedback').textContent='';$('hintText').classList.add('hidden');$('hintText').textContent=hintFor(q);$('nextBtn').disabled=true;$('nextBtn').textContent=state.index===total-1?'See Results →':'Next Question →';const wrap=$('options');wrap.innerHTML='';q.options.forEach((text,i)=>{const b=document.createElement('button');b.className='option';const letter=document.createElement('span');letter.className='letter';letter.textContent=String.fromCharCode(65+i);const label=document.createElement('span');label.textContent=text;b.append(letter,label);b.onclick=()=>choose(i,b);wrap.appendChild(b)})}
function choose(choice,button){const q=state.questions[state.index];if(state.answers[state.index]!==undefined)return;state.answers[state.index]=choice;const buttons=[...document.querySelectorAll('.option')];buttons.forEach((b,i)=>{b.disabled=true;if(i===q.answer)b.classList.add('correct')});if(choice===q.answer){state.score++;button.classList.add('correct');feedback(q.explanation,true);beep(660)}else{button.classList.add('wrong');feedback(`The correct answer is: ${q.options[q.answer]}. ${q.explanation}`,false);beep(220)}$('liveScore').textContent=state.score;$('nextBtn').disabled=false}
function feedback(text,good){$('feedback').className=`feedback ${good?'good':'bad'}`;$('feedback').textContent=text}
function next(){if(state.index<state.questions.length-1){state.index++;render();scrollTo({top:0,behavior:'smooth'})}else finish()}
function finish(){const total=state.questions.length,pct=Math.round(state.score/total*100);$('quiz').classList.add('hidden');$('result').classList.remove('hidden');$('finalScore').textContent=state.score;$('correctCount').textContent=state.score;$('wrongCount').textContent=total-state.score;$('finalPercent').textContent=`${pct}%`;let title='Keep exploring!',msg='Review the missed questions and try again. Every question is a chance to learn!',icon='💻';if(pct>=90){title='Excellent, Computer Explorer!';msg='You showed strong understanding of safe software installation and computer care.';icon='🏆'}else if(pct>=75){title='Great work!';msg='You have a good understanding. Review a few ideas and you will be even stronger.';icon='🌟'}else if(pct>=60){title='Nice effort!';msg='You are building your skills. Use the review section to strengthen the concepts.';icon='🚀'}$('resultTitle').textContent=title;$('resultMessage').textContent=msg;$('resultIcon').textContent=icon;scrollTo(0,0)}
function showReview(){$('result').classList.add('hidden');$('review').classList.remove('hidden');const wrap=$('reviewList');wrap.innerHTML='';state.questions.forEach((q,i)=>{if(state.answers[i]===q.answer)return;const d=document.createElement('article');d.className='review-item';const h=document.createElement('h3');h.textContent=`${i+1}. ${q.question}`;const a=document.createElement('div');a.className='review-answer';a.textContent=`Answer: ${q.options[q.answer]}`;const x=document.createElement('div');x.className='review-explain';x.textContent=q.explanation;d.append(h,a,x);wrap.appendChild(d)});if(!wrap.children.length)wrap.innerHTML='<article class="review-item"><h3>🎉 No missed questions!</h3><div class="review-explain">You answered every question correctly in this attempt.</div></article>';scrollTo(0,0)}
function home(){$('quiz').classList.add('hidden');$('result').classList.add('hidden');$('review').classList.add('hidden');$('home').classList.remove('hidden');scrollTo(0,0)}
function fullscreen(){if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.()}
function hintFor(q){if(q.difficulty==='Easy')return'Think about the main job of the computer tool or term described in the question.';if(q.difficulty==='Practice')return'Look for the choice that follows a safe and careful computer-use habit.';return'Imagine you are the learner responsible for keeping the computer and its files safe.'}
function beep(freq){if(!state.sound)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;o.connect(g);g.connect(c.destination);g.gain.setValueAtTime(.05,c.currentTime);o.start();o.stop(c.currentTime+.08)}catch(e){}}

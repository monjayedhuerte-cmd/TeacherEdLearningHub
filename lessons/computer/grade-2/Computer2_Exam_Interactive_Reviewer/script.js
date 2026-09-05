function go(id){document.getElementById(id).scrollIntoView({behavior:'smooth'})}
function info(n,t){document.getElementById('info').innerHTML='<b>'+n+'</b><br>'+t}
let qn=0;
function answer(a){let r=document.getElementById('dr');if(a==='Printer'){r.textContent='✓ Correct! A printer produces a hard copy on paper.';qn++}else r.textContent='Try again. Think about which device puts information on paper.'}
const bootData=[
['POWER ON','The power button is pressed. Electricity starts the computer.','Power is supplied to the computer.'],
['BIOS / POST','The startup firmware begins and POST performs an initial check of important hardware.','The computer checks essential hardware.'],
['FIND BOOT DEVICE','The computer looks for a device containing the files needed to start the operating system.','It finds where the system can boot from.'],
['LOAD OPERATING SYSTEM','The operating system is loaded into memory and begins managing the computer.','The system prepares the computer for use.'],
['DESKTOP / LOGIN','The login screen or desktop appears. The computer is ready for the user.','You can now use programs.']
];
function boot(i){document.getElementById('bootText').innerHTML='<b>'+bootData[i][0]+'</b><p>'+bootData[i][1]+'</p><small>'+bootData[i][2]+'</small><div class="bar"><div id="fill"></div></div>';document.getElementById('fill').style.width=((i+1)*20)+'%'}
function runComputer(){let i=0;boot(0);let t=setInterval(()=>{i++;if(i>=bootData.length){clearInterval(t);return}boot(i)},900)}
const qs=[
['Which is an output device?','a','Monitor','Keyboard','Mouse'],
['What does a printer produce?','b','Sound','A hard copy on paper','Internet'],
['What is booting?','c','Typing a document','Printing a page','Starting the computer and loading the operating system'],
['What does POST do?','a','Checks important hardware during startup','Prints a picture','Opens a game'],
['What happens after the operating system loads?','b','The computer turns off','The computer becomes ready for use','The printer starts automatically'],
['Which is a warm boot?','c','Starting from a powered-off state','Turning on a monitor','Restarting a computer that is already running'],
['Which sequence is correct?','a','Input → Process → Output','Output → Input → Process','Process → Output → Input'],
['What does a speaker do?','b','Prints paper','Produces sound','Displays pictures']
];
document.getElementById('quiz').innerHTML=qs.map((q,i)=>'<div class="question"><b>'+(i+1)+'. '+q[0]+'</b><label><input type="radio" name="q'+i+'" value="a"> A. '+q[2]+'</label><label><input type="radio" name="q'+i+'" value="b"> B. '+q[3]+'</label><label><input type="radio" name="q'+i+'" value="c"> C. '+q[4]+'</label></div>').join('');
function check(){let s=0;qs.forEach((q,i)=>{let a=document.querySelector('input[name=q'+i+']:checked');if(a&&a.value===q[1])s++});document.getElementById('score').className='score';document.getElementById('score').textContent='Score: '+s+'/'+qs.length+' — '+(s>=7?'Excellent! You are ready for the exam!':s>=5?'Good job! Review the items you missed.':'Keep reviewing and try again.') }
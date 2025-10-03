/* lightweight animated background (matrix-like lines + soft glow) */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;
window.addEventListener('resize', ()=>{W=canvas.width=innerWidth;H=canvas.height=innerHeight;});
const lines = [];
for(let i=0;i<60;i++){
  lines.push({x:Math.random()*W, y:Math.random()*H, len: 50+Math.random()*180, vx:(Math.random()*0.6)-0.3, hue: Math.random()*360, speed:0.2+Math.random()*0.6});
}
function drawBg(){
  ctx.clearRect(0,0,W,H);
  for(const l of lines){
    l.x += l.vx * (1 + Math.sin(Date.now()/500 + l.hue)*0.2);
    l.y += l.speed;
    if(l.y > H + l.len) { l.y = -l.len; l.x = Math.random()*W; }
    ctx.beginPath();
    const grad = ctx.createLinearGradient(l.x, l.y, l.x + l.len, l.y + l.len);
    grad.addColorStop(0, 'rgba(0,240,234,0.06)');
    grad.addColorStop(0.5, 'rgba(155,89,255,0.04)');
    grad.addColorStop(1, 'rgba(255,59,107,0.03)');
    ctx.fillStyle = grad;
    ctx.fillRect(l.x, l.y, 2, l.len);
  }
  requestAnimationFrame(drawBg);
}
drawBg();

/* toast helper */
function showToast(msg, t=2000){
  const el = document.getElementById('toast');
  el.innerText = msg;
  el.style.display = 'block';
  setTimeout(()=> el.style.display='none', t);
}

/* resend last via AJAX */
async function resendLast(){
  try{
    const r = await fetch('/resend_last', {method:'POST'});
    const j = await r.json();
    if(j.ok) showToast('تمت إعادة الإرسال');
    else showToast('لا يوجد توكن لإعادة الإرسال');
  } catch(e){
    showToast('فشل إعادة الإرسال');
  }
}

/* countdowns */
function updateCountdowns(){
  const now = Math.floor(Date.now()/1000);
  document.querySelectorAll('.countdown').forEach(el=>{
    const ts = Number(el.dataset.ts)||0;
    const remain = Math.max(0, Math.floor((ts + {{ expiry }}) - now));
    const h = Math.floor(remain/3600), m = Math.floor((remain%3600)/60), s = remain%60;
    el.innerText = remain>0 ? `${h}س ${m}د ${s}ث` : 'منتهي';
  });
}
setInterval(updateCountdowns, 1000);
updateCountdowns();

/* lightweight terminal log append (visual only) */
function addTerminalLine(txt){
  const t = document.getElementById('terminal');
  const d = document.createElement('div');
  d.innerText = txt;
  t.appendChild(d);
  t.scrollTop = t.scrollHeight;
}

/* enhance forms UX: show quick toast */
document.getElementById('formAdd')?.addEventListener('submit', ()=>{ showToast('جاري تسجيل التوكن...'); addTerminalLine('> إرسال توكن...'); });
document.getElementById('formBio')?.addEventListener('submit', ()=>{ showToast('جاري تحديث البايو...'); addTerminalLine('> إرسال بايو...'); });

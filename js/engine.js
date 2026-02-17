/* ============================================
   AFC PRAXIS — Engine v1.0
   Motor reutilizable de ejercicios
   ============================================ */

(function(){
'use strict';

// ===== SVG ICONS =====
const ICO = {
  back:'<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>',
  book:'<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  check:'<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
  info:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  target:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  zap:'<svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  moon:'<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  sun:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  undo:'<svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
  clock:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  flask:'<svg viewBox="0 0 24 24"><path d="M9 3h6v5l4 9H5l4-9V3z"/><line x1="9" y1="3" x2="15" y2="3"/></svg>',
  download:'<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  x:'<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  brain:'<svg viewBox="0 0 24 24"><path d="M12 2C9.2 2 7 4.2 7 7c0 1.1.4 2.2 1 3-1.2.8-2 2.2-2 3.7 0 2 1.3 3.6 3 4.1V22h6v-4.2c1.7-.5 3-2.1 3-4.1 0-1.5-.8-2.9-2-3.7.6-.8 1-1.9 1-3 0-2.8-2.2-5-5-5z"/></svg>',
  bar:'<svg viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
  refresh:'<svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
  home:'<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
};

// ===== CONSTANTS =====
const MASTERY_THRESHOLD = 0.8;
const STORE_PREFIX = 'afcpraxis_';
const LEVEL_NAMES = ['Discriminación','Transformación','Micro-situaciones','Integración','Simulación'];
const LEVEL_ICONS = ['🎯','🔄','💬','🧩','🏥'];

// ===== GLOBAL STATE =====
let MOD = null;       // Module data (set by each module page)
let $app = null;      // App DOM element
let S = {             // Runtime state
  view: 'home',       // home | theory | levels | exercise | gate | level-sum | mod-sum
  level: 0,           // Current level index (0-4)
  exIdx: 0,           // Current exercise index within pool
  seqIdx: 0,          // Sub-question index (for seq/classify)
  pool: [],           // Randomized exercise indices for current level
  answers: {},        // { globalIdx: true/false }
  theoryOpen: false
};

// ===== PERSISTENT STATE =====
function storeKey(){ return STORE_PREFIX + (MOD ? MOD.id : 'global'); }
let P = {};  // Persistent data: { scores:{}, errors:{}, skills:{}, timeSpent:0 }

function loadP(){
  try { const d = localStorage.getItem(storeKey()); if(d) P = JSON.parse(d); } catch(e){}
  if(!P.scores) P.scores = {};
  if(!P.errors) P.errors = {};
  if(!P.skills) P.skills = {};
  if(!P.timeSpent) P.timeSpent = 0;
}
function saveP(){ try { localStorage.setItem(storeKey(), JSON.stringify(P)); } catch(e){} }

// Global progress (across all modules)
function loadGlobal(){
  try { const d = localStorage.getItem(STORE_PREFIX+'global'); return d ? JSON.parse(d) : {}; } catch(e){ return {}; }
}
function saveGlobal(data){
  try { localStorage.setItem(STORE_PREFIX+'global', JSON.stringify(data)); } catch(e){}
}

// ===== DARK MODE =====
function initTheme(){
  const t = localStorage.getItem(STORE_PREFIX+'theme');
  if(t) document.documentElement.setAttribute('data-theme', t);
}
function toggleTheme(){
  const h = document.documentElement;
  const d = h.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  h.setAttribute('data-theme', d);
  localStorage.setItem(STORE_PREFIX+'theme', d);
  render();
}
initTheme();

// ===== UTILITIES =====
const $ = id => document.getElementById(id);
function qs(sel, el){ return (el||document).querySelector(sel); }
function qsa(sel, el){ return (el||document).querySelectorAll(sel); }
function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]} return a; }
function ico(name){ return ICO[name] || ''; }
function isDark(){ return document.documentElement.getAttribute('data-theme') === 'dark'; }

// ===== CONFETTI (only on level completion >= 80%) =====
function fireConfetti(){
  const w = document.getElementById('confWrap');
  if(!w) return;
  const colors = ['#059669','#2563eb','#d97706','#db2777','#7c3aed'];
  for(let i = 0; i < 20; i++){
    const c = document.createElement('div');
    c.style.cssText = `position:absolute;width:${4+Math.random()*6}px;height:${4+Math.random()*6}px;left:${Math.random()*100}%;background:${colors[i%5]};border-radius:2px;animation:confDrop 1.2s ease-out ${Math.random()*0.3}s forwards;opacity:0;`;
    w.appendChild(c);
    setTimeout(() => c.remove(), 1600);
  }
}

// ===== TOPBAR BUILDER =====
function topbar(title, sub, backAction, progress){
  let progHtml = '';
  if(progress !== undefined){
    progHtml = `<div class="topbar-prog"><div class="topbar-prog-bar"><div class="topbar-prog-fill" style="width:${progress}%"></div></div><div class="topbar-prog-txt">${Math.round(progress)}%</div></div>`;
  }
  const theoryBtn = S.view === 'exercise' ? `<div class="topbar-btn" onclick="AFC.toggleTheory()" title="Consultar teoría">${ico('book')}</div>` : '';
  return `<div class="topbar">
    <div class="topbar-back" onclick="${backAction}" tabindex="0" role="button" aria-label="Volver">${ico('back')}</div>
    <div class="topbar-info"><div class="topbar-title">${title}</div><div class="topbar-sub">${sub}</div></div>
    ${progHtml}
    <div class="topbar-actions">
      ${theoryBtn}
      <div class="topbar-btn" onclick="AFC.toggleTheme()" title="Tema">${isDark()?ico('sun'):ico('moon')}</div>
    </div>
  </div>`;
}

// ===== THEORY PANEL =====
function theoryPanel(){
  if(!MOD || !MOD.levels) return '';
  const lvl = MOD.levels[S.level];
  if(!lvl || !lvl.theory) return '';
  let items = '';
  lvl.theory.forEach(t => {
    items += `<div class="accord open"><div class="accord-head" onclick="this.parentElement.classList.toggle('open')"><div class="accord-icon" style="background:var(--accent-g)">${t.icon||'📖'}</div><div class="accord-label">${t.title}</div><div class="accord-arrow">▼</div></div><div class="accord-body"><div class="accord-inner">${t.body}</div></div></div>`;
  });
  return `<div class="theory-overlay ${S.theoryOpen?'open':''}" onclick="AFC.toggleTheory()"></div>
  <div class="theory-panel ${S.theoryOpen?'open':''}">
    <button class="theory-panel-close" onclick="AFC.toggleTheory()">${ico('x')}</button>
    <div class="tag tag-blue" style="margin-bottom:12px">${ico('book')} Referencia teórica</div>
    <h3 style="font-family:'Fraunces',serif;font-size:17px;font-weight:700;color:var(--bright);margin-bottom:12px">${lvl.title}</h3>
    ${items}
  </div>`;
}

// ===== NAVIGATION =====
function go(view, opts){
  Object.assign(S, opts || {}, {view});
  if(view === 'exercise'){
    S.answers = {};
    S.seqIdx = 0;
    // Build randomized pool
    const lvl = MOD.levels[S.level];
    const total = lvl.exercises.length;
    const show = lvl.showCount || total;
    S.pool = shuffle([...Array(total).keys()]).slice(0, show);
    S.exIdx = 0;
  }
  S.theoryOpen = false;
  saveP();
  render();
}

// ===== RENDER DISPATCH =====
function render(){
  if(!$app) return;
  const v = S.view;
  if(v === 'home') rHome();
  else if(v === 'theory') rTheory();
  else if(v === 'levels') rLevels();
  else if(v === 'exercise') rExercise();
  else if(v === 'gate') rGate();
  else if(v === 'level-sum') rLevelSum();
  else if(v === 'mod-sum') rModSum();
  // Scroll to top
  requestAnimationFrame(() => {
    const c = qs('.content', $app);
    if(c) c.scrollTop = 0;
  });
}

// ===== MODULE HOME =====
function rHome(){
  const m = MOD;
  let levels = '';
  m.levels.forEach((lvl, i) => {
    const done = isLvlDone(i);
    const unlocked = i === 0 || isLvlDone(i-1);
    const cls = done ? 'done' : (!unlocked ? 'locked' : '');
    const sc = P.scores[`lvl${i}`];
    let mastery = '';
    if(sc){
      const pct = Math.round((sc.correct/sc.total)*100);
      mastery = `<div class="lvl-mastery"><div class="lvl-mastery-fill ${pct>=80?'high':(pct>=50?'mid':'low')}" style="width:${pct}%"></div></div>`;
    }
    levels += `<div class="lvl-card ${cls}" onclick="${unlocked?`AFC.go('theory',{level:${i}})`:'void(0)'}" tabindex="${unlocked?0:-1}" role="button">
      <div class="lvl-num">${done?'✓':(i+1)}</div>
      <div style="flex:1"><div class="lvl-name">${LEVEL_ICONS[i]} ${LEVEL_NAMES[i]}</div><div class="lvl-sub">${lvl.title} · ${lvl.exercises.length} ejercicios</div>${mastery}</div>
      <div class="lvl-arrow">›</div></div>`;
  });

  const totalLvls = m.levels.length;
  let doneLvls = 0;
  for(let i=0;i<totalLvls;i++) if(isLvlDone(i)) doneLvls++;
  const pct = Math.round((doneLvls/totalLvls)*100);
  const totalEx = m.levels.reduce((s,l) => s + l.exercises.length, 0);

  $app.innerHTML = `${topbar(m.phase, m.title, "window.location.href='../'")}
  <div class="content">
    <div class="anim" style="text-align:center;margin-bottom:16px">
      <div class="landing-logo" style="background:linear-gradient(135deg,${m.color||'var(--accent)'},${m.colorB||'var(--accent-b)'})">
        <span style="font-size:28px">${m.icon||'📘'}</span>
      </div>
      <div class="card-title" style="font-size:24px;margin-top:12px">${m.title}</div>
      <div class="card-desc" style="max-width:360px;margin:6px auto 0">${m.description||''}</div>
    </div>
    <div style="display:flex;align-items:center;justify-content:center;gap:20px;margin-bottom:16px" class="anim d1">
      <div class="prog-ring"><svg width="72" height="72"><circle cx="36" cy="36" r="30" fill="none" stroke="var(--border)" stroke-width="5"/><circle cx="36" cy="36" r="30" fill="none" stroke="var(--accent)" stroke-width="5" stroke-dasharray="${2*Math.PI*30}" stroke-dashoffset="${2*Math.PI*30*(1-pct/100)}" stroke-linecap="round"/></svg><div class="prog-ring-val">${pct}%</div></div>
      <div class="dash-grid" style="grid-template-columns:1fr;gap:4px;margin:0">
        <div class="dash-stat" style="padding:8px 14px"><b>${doneLvls}/${totalLvls}</b><span>Niveles</span></div>
        <div class="dash-stat" style="padding:8px 14px"><b>${totalEx}</b><span>Ejercicios</span></div>
      </div>
    </div>
    <div style="font-family:'Space Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);margin:16px 0 8px" class="anim d2">Niveles</div>
    <div class="anim d3">${levels}</div>
  </div>`;
}

function isLvlDone(i){
  const sc = P.scores[`lvl${i}`];
  return sc && (sc.correct / sc.total) >= MASTERY_THRESHOLD;
}
function isLvlAttempted(i){ return !!P.scores[`lvl${i}`]; }

// ===== THEORY =====
function rTheory(){
  const lvl = MOD.levels[S.level];
  let acc = '';
  (lvl.theory||[]).forEach((t,i) => {
    acc += `<div class="accord ${i===0?'open':''}" onclick="this.classList.toggle('open')">
      <div class="accord-head"><div class="accord-icon" style="background:var(--${t.color||'accent'}-g)">${t.icon||'📖'}</div><div class="accord-label">${t.title}</div><div class="accord-arrow">▼</div></div>
      <div class="accord-body"><div class="accord-inner prose">${t.body}</div></div></div>`;
  });

  $app.innerHTML = `${topbar(`Nivel ${S.level+1}`, lvl.title, "AFC.go('home')")}
  <div class="content">
    <div class="anim">
      <div class="card"><div class="tag tag-blue">${ico('book')} Nivel ${S.level+1} — ${LEVEL_NAMES[S.level]}</div>
      <div class="card-title">${lvl.title}</div>
      <div class="card-desc">${lvl.description||'Lee la teoría y luego pasa a los ejercicios.'}</div></div>
      ${acc}
    </div>
  </div>
  <div class="bottombar">
    <button class="btn btn-primary" onclick="AFC.go('exercise')">Comenzar ejercicios ›</button>
  </div>`;
}

// ===== EXERCISE RENDERER =====
function rExercise(){
  const lvl = MOD.levels[S.level];
  const poolIdx = S.pool[S.exIdx];
  const ex = lvl.exercises[poolIdx];
  const total = S.pool.length;
  const prog = total ? Math.round(((S.exIdx)/total)*100) : 0;

  // Count for seq/classify sub-items
  let flatTotal = 0, flatCur = 0;
  S.pool.forEach((pi, idx) => {
    const e = lvl.exercises[pi];
    const cnt = e.type==='seq' ? e.questions.length : (e.type==='classify' ? e.items.length : 1);
    if(idx < S.exIdx) flatCur += cnt;
    else if(idx === S.exIdx) flatCur += S.seqIdx;
    flatTotal += cnt;
  });

  // Pips
  let pips = '<div class="ex-pips" role="progressbar">';
  let pipIdx = 0;
  S.pool.forEach((pi, idx) => {
    const e = lvl.exercises[pi];
    const cnt = e.type==='seq' ? e.questions.length : (e.type==='classify' ? e.items.length : 1);
    for(let s=0; s<cnt; s++){
      const key = `${idx}-${s}`;
      const ans = S.answers[key];
      let cls = '';
      if(idx === S.exIdx && s === S.seqIdx) cls = 'cur';
      else if(ans === true) cls = 'ok';
      else if(ans === false) cls = 'fail';
      pips += `<div class="ex-pip ${cls}"></div>`;
      pipIdx++;
    }
  });
  pips += '</div>';

  // Exercise body
  let body = '';
  if(ex.type === 'tf') body = mkTF(ex);
  else if(ex.type === 'single') body = mkSingle(ex);
  else if(ex.type === 'multi') body = mkMulti(ex);
  else if(ex.type === 'classify') body = mkClassify(ex);
  else if(ex.type === 'order') body = mkOrder(ex);
  else if(ex.type === 'seq') body = mkSeq(ex);
  else if(ex.type === 'fib') body = mkFib(ex);
  else if(ex.type === 'build') body = mkBuild(ex);
  else if(ex.type === 'match') body = mkMatch(ex);

  $app.innerHTML = `${topbar(`Nivel ${S.level+1}`, lvl.title, "AFC.go('home')", prog)}
  <div class="content">${pips}<div id="exWrap" class="anim">${body}</div></div>
  <div class="bottombar" id="botBar"></div>
  ${theoryPanel()}`;
}

// ===== ANSWER KEY =====
function curKey(){ return `${S.exIdx}-${S.seqIdx}`; }

// ===== RECORD ANSWER + SKILL =====
function recordAnswer(ok, ex){
  S.answers[curKey()] = ok;
  // Skill tracking
  if(ex && ex.skill){
    if(!P.skills[ex.skill]) P.skills[ex.skill] = {c:0,t:0};
    P.skills[ex.skill].t++;
    if(ok) P.skills[ex.skill].c++;
  }
  // Error logging
  if(!ok && ex){
    if(!P.errors[S.level]) P.errors[S.level] = [];
    const q = ex.text || ex.s || (ex.questions ? ex.questions[S.seqIdx]?.text : '') || '';
    const correct = typeof ex.c === 'number' && ex.opts ? ex.opts[ex.c] : '';
    P.errors[S.level].push({ q: q.substring(0,100), a: (typeof correct==='string'?correct:'').substring(0,100) });
  }
  saveP();
}

// ===== SHOW NEXT BUTTON =====
function showNext(){
  const bot = $('botBar');
  if(bot) bot.innerHTML = `<button class="btn btn-primary" onclick="AFC.nextEx()">Siguiente ›</button>`;
}

// ===== FEEDBACK =====
function showFB(ok, text, hint){
  const fb = $('fb');
  if(!fb) return;
  fb.className = `fb show ${ok?'ok':'fail'}`;
  let hintHtml = '';
  if(!ok && hint) hintHtml = `<div class="fb-hint show">💡 ${hint}</div>`;
  fb.innerHTML = `<strong>${ok?'✓ Correcto':'✗ Incorrecto'}</strong>${text}${hintHtml}`;
  if(!ok){
    const w = $('exWrap');
    if(w){ w.classList.add('shake'); setTimeout(()=>w.classList.remove('shake'),400); }
  }
}

// ===== TF =====
function mkTF(ex){
  return `<div class="card"><div class="q-header"><span class="q-type">${ico('zap')} V / F</span><span class="q-count">${S.exIdx+1}/${S.pool.length}</span></div>
  <div class="q-text">${ex.s}</div>
  <div class="tf-wrap"><div class="tf-btn" id="tfV" onclick="AFC._chkTF(true)" tabindex="0">✓ Verdadero</div><div class="tf-btn" id="tfF" onclick="AFC._chkTF(false)" tabindex="0">✗ Falso</div></div>
  <div class="fb" id="fb"></div></div>`;
}
function chkTF(v){
  const ex = curEx();
  const ok = v === ex.c;
  $('tf'+(v?'V':'F')).classList.add(ok?'correct':'wrong','disabled');
  $('tf'+(v?'F':'V')).classList.add('disabled');
  if(!ok) $(ex.c?'tfV':'tfF').classList.add('correct');
  showFB(ok, ok?ex.ok:ex.fail, ex.hint);
  recordAnswer(ok, ex);
  showNext();
}

// ===== SINGLE =====
function mkSingle(ex){
  let opts = '';
  ex.opts.forEach((o,i) => {
    opts += `<div class="opt" id="so${i}" onclick="AFC._chkSingle(${i})" tabindex="0"><div class="opt-mark">${String.fromCharCode(65+i)}</div><div class="opt-txt">${o}</div></div>`;
  });
  return `<div class="card"><div class="q-header"><span class="q-type">${ico('target')} Selección</span><span class="q-count">${S.exIdx+1}/${S.pool.length}</span></div>
  ${ex.context?`<div class="q-context">${ex.context}</div>`:''}
  <div class="q-text">${ex.text}</div>${opts}<div class="fb" id="fb"></div></div>`;
}
function chkSingle(i){
  const ex = curEx();
  const ok = i === ex.c;
  qsa('.opt').forEach((o,j) => { o.classList.add('disabled'); if(j===i) o.classList.add(ok?'correct':'wrong'); if(j===ex.c&&!ok) o.classList.add('reveal'); });
  showFB(ok, ok?ex.ok:ex.fail, ex.hint);
  recordAnswer(ok, ex);
  showNext();
}

// ===== MULTI =====
let _multiSel = [];
function mkMulti(ex){
  _multiSel = [];
  let opts = '';
  ex.opts.forEach((o,i) => {
    opts += `<div class="opt" id="mo${i}" onclick="AFC._togMulti(${i})" tabindex="0"><div class="opt-mark chk">☐</div><div class="opt-txt">${o}</div></div>`;
  });
  return `<div class="card"><div class="q-header"><span class="q-type">${ico('check')} Multi-selección</span><span class="q-count">${S.exIdx+1}/${S.pool.length}</span></div>
  <div class="q-text">${ex.text}</div>${opts}<div class="fb" id="fb"></div></div>
  <div style="text-align:center;margin-top:6px"><button class="btn btn-primary btn-sm" onclick="AFC._chkMulti()">Comprobar</button></div>`;
}
function togMulti(i){
  const el = $('mo'+i); if(!el || el.classList.contains('disabled')) return;
  const idx = _multiSel.indexOf(i);
  if(idx === -1){ _multiSel.push(i); el.classList.add('picked'); el.querySelector('.opt-mark').textContent='☑'; }
  else { _multiSel.splice(idx,1); el.classList.remove('picked'); el.querySelector('.opt-mark').textContent='☐'; }
}
function chkMulti(){
  const ex = curEx();
  const ok = JSON.stringify(_multiSel.sort()) === JSON.stringify([...ex.c].sort());
  qsa('.opt').forEach((o,i) => { o.classList.add('disabled'); if(ex.c.includes(i)) o.classList.add('correct'); else if(_multiSel.includes(i)) o.classList.add('wrong'); });
  showFB(ok, ok?ex.ok:ex.fail, ex.hint);
  recordAnswer(ok, ex);
  _multiSel = [];
  showNext();
}

// ===== CLASSIFY =====
function mkClassify(ex){
  const item = ex.items[S.seqIdx];
  let cats = '<div class="cl-cats">';
  ex.categories.forEach(c => { cats += `<div class="cl-cat" onclick="AFC._chkCl('${c}')" tabindex="0">${c}</div>`; });
  cats += '</div>';
  return `<div class="card"><div class="q-header"><span class="q-type">${ico('target')} Clasifica</span><span class="q-count">${S.seqIdx+1}/${ex.items.length}</span></div>
  <div class="q-text">"${item.text}"</div>${cats}<div class="fb" id="fb"></div></div>`;
}
function chkCl(cat){
  const ex = curEx();
  const item = ex.items[S.seqIdx];
  const ok = cat === item.cat;
  qsa('.cl-cat').forEach(c => { c.classList.add('disabled'); if(c.textContent===item.cat) c.classList.add('correct'); else if(c.textContent===cat&&!ok) c.classList.add('wrong'); });
  const fb = ok ? `"${item.text}" → ${item.cat}.` : `"${item.text}" → ${item.cat}, no ${cat}.`;
  showFB(ok, fb);
  S.answers[curKey()] = ok;
  if(!ok){
    if(!P.errors[S.level]) P.errors[S.level] = [];
    P.errors[S.level].push({q:item.text.substring(0,80), a:item.cat});
  }
  saveP();
  // Auto-advance sub-items
  setTimeout(() => {
    if(S.seqIdx < ex.items.length - 1){ S.seqIdx++; render(); }
    else { S.seqIdx = 0; advanceEx(); }
  }, 1500);
}

// ===== ORDER =====
let _ordSel = [];
function mkOrder(ex){
  _ordSel = [];
  const sh = ex.items.map((t,i) => ({t,i}));
  // Shuffle but keep ref
  const shuffled = shuffle(sh);
  let pool = '';
  shuffled.forEach((s,i) => { pool += `<div class="ord-item" id="oi${i}" data-text="${s.t}" data-orig="${s.i}" onclick="AFC._pickOrd(${i})" tabindex="0">${s.t}</div>`; });
  return `<div class="card"><div class="q-header"><span class="q-type">${ico('target')} Ordena</span><span class="q-count">${S.exIdx+1}/${S.pool.length}</span></div>
  <div class="q-text">${ex.prompt || 'Ordena de peor a mejor operacionalización.'}</div>
  <div class="ord-seq" id="ordSeq"></div>
  <div style="margin-bottom:6px"><span class="ord-undo" id="ordUndo" onclick="AFC._undoOrd()">${ico('undo')} Deshacer</span></div>
  <div class="ord-pool" id="ordPool">${pool}</div>
  <div class="fb" id="fb"></div></div>`;
}
function pickOrd(i){
  const el = $('oi'+i); if(!el || el.classList.contains('placed')) return;
  el.classList.add('placed');
  _ordSel.push({i, text:el.dataset.text});
  updOrdDisplay();
  const ex = curEx();
  if(_ordSel.length === ex.items.length){
    const ok = _ordSel.every((o,j) => o.text === ex.items[j]);
    qsa('.ord-placed').forEach((p,j) => p.classList.add(_ordSel[j].text===ex.items[j]?'correct':'wrong'));
    qsa('.ord-item,.ord-undo').forEach(e => e.style.pointerEvents='none');
    showFB(ok, ok?ex.ok:ex.fail);
    recordAnswer(ok, ex);
    showNext();
  }
}
function undoOrd(){
  if(!_ordSel.length) return;
  const last = _ordSel.pop();
  $('oi'+last.i).classList.remove('placed');
  updOrdDisplay();
}
function updOrdDisplay(){
  const seq = $('ordSeq');
  if(seq) seq.innerHTML = _ordSel.map((o,i) => `<div class="ord-placed"><span class="ord-n">${i+1}.</span>${o.text}</div>`).join('');
  const u = $('ordUndo');
  if(u) u.classList.toggle('show', _ordSel.length > 0);
}

// ===== SEQ (Clinical sequences) =====
function mkSeq(ex){
  const q = ex.questions[S.seqIdx];
  let opts = '';
  q.opts.forEach((o,i) => {
    opts += `<div class="opt" id="sq${i}" onclick="AFC._chkSeq(${i})" tabindex="0"><div class="opt-mark">${String.fromCharCode(65+i)}</div><div class="opt-txt">${o}</div></div>`;
  });
  let patHtml = '';
  if(ex.patient){
    const p = ex.patient;
    patHtml = `<div class="patient"><div class="patient-head"><div class="patient-avatar ${p.gender}">${p.initial}</div><div class="patient-meta"><div class="patient-name">${p.name}</div><div class="patient-age">${p.age}</div></div><div class="patient-badge">${p.badge}</div></div><div class="patient-quote">${ex.quote}</div></div>`;
  }
  return `${patHtml}<div class="card"><div class="q-header"><span class="q-type">${ico('target')} Caso clínico</span><span class="q-count">${S.seqIdx+1}/${ex.questions.length}</span></div>
  <div class="q-text">${q.text}</div>${opts}<div class="fb" id="fb"></div></div>`;
}
function chkSeq(i){
  const ex = curEx();
  const q = ex.questions[S.seqIdx];
  const ok = i === q.c;
  qsa('.opt').forEach((o,j) => { o.classList.add('disabled'); if(j===i) o.classList.add(ok?'correct':'wrong'); if(j===q.c&&!ok) o.classList.add('reveal'); });
  showFB(ok, q.fb, q.hint);
  S.answers[curKey()] = ok;
  if(!ok){
    if(!P.errors[S.level]) P.errors[S.level]=[];
    P.errors[S.level].push({q:q.text.substring(0,80), a:q.opts[q.c].substring(0,80)});
  }
  if(ex.questions[S.seqIdx].skill){
    const sk = ex.questions[S.seqIdx].skill;
    if(!P.skills[sk]) P.skills[sk]={c:0,t:0};
    P.skills[sk].t++; if(ok) P.skills[sk].c++;
  }
  saveP();
  // Manual advance via Next button
  const bot = $('botBar');
  if(bot){
    const isLast = S.seqIdx >= ex.questions.length - 1;
    if(isLast){
      bot.innerHTML = `<button class="btn btn-primary" onclick="AFC._seqNext(true)">Siguiente ›</button>`;
    } else {
      bot.innerHTML = `<button class="btn btn-primary" onclick="AFC._seqNext(false)">Siguiente pregunta ›</button>`;
    }
  }
}
function seqNext(isLast){
  if(isLast){ S.seqIdx = 0; advanceEx(); }
  else { S.seqIdx++; render(); }
}

// ===== FIB (Fill in blanks) =====
let _fibState = {};
let _fibActive = null;
function mkFib(ex){
  _fibState = {};
  _fibActive = null;
  // Build text with blanks
  let txt = ex.text;
  ex.blanks.forEach((b,i) => {
    txt = txt.replace(`{${i}}`, `<span class="fib-blank" id="fb${i}" data-idx="${i}" onclick="AFC._fibSelect(${i})">${b.placeholder||'___'}</span>`);
  });
  // Options bank
  let bank = '<div class="fib-bank">';
  const allOpts = shuffle(ex.blanks.map(b=>b.options).flat());
  allOpts.forEach((o,i) => {
    bank += `<span class="fib-opt" id="fo${i}" data-val="${o}" onclick="AFC._fibPick(${i},'${o.replace(/'/g,"\\'")}')">${o}</span>`;
  });
  bank += '</div>';
  return `<div class="card"><div class="q-header"><span class="q-type">${ico('target')} Completa</span><span class="q-count">${S.exIdx+1}/${S.pool.length}</span></div>
  <div class="fib-text">${txt}</div>${bank}
  <div style="text-align:center;margin-top:6px"><button class="btn btn-primary btn-sm" onclick="AFC._chkFib()">Comprobar</button></div>
  <div class="fb" id="fb"></div></div>`;
}
function fibSelect(idx){
  _fibActive = idx;
  qsa('.fib-blank').forEach(b => b.style.outline = b.dataset.idx == idx ? '2px solid var(--accent)' : 'none');
}
function fibPick(optIdx, val){
  if(_fibActive === null) return;
  const blank = $('fb'+_fibActive);
  if(blank){ blank.textContent = val; blank.classList.add('filled'); }
  _fibState[_fibActive] = val;
  $('fo'+optIdx).classList.add('used');
  _fibActive = null;
  qsa('.fib-blank').forEach(b => b.style.outline = 'none');
}
function chkFib(){
  const ex = curEx();
  let allOk = true;
  ex.blanks.forEach((b,i) => {
    const blank = $('fb'+i);
    if(!blank) return;
    const val = _fibState[i];
    const ok = b.correct.includes(val);
    blank.classList.add(ok ? 'correct' : 'wrong');
    if(!ok){ allOk = false; blank.textContent = b.correct[0]; }
  });
  qsa('.fib-opt').forEach(o => o.style.pointerEvents = 'none');
  showFB(allOk, allOk ? ex.ok : ex.fail, ex.hint);
  recordAnswer(allOk, ex);
  showNext();
}

// ===== BUILD (assemble sequence) =====
let _buildState = {};
let _buildActive = null;
function mkBuild(ex){
  _buildState = {};
  _buildActive = null;
  let slots = '<div class="build-slots">';
  ex.slots.forEach((sl,i) => {
    slots += `<div class="build-slot" id="bs${i}" onclick="AFC._buildSlotClick(${i})"><div class="build-slot-label">${sl.label}</div><div class="build-slot-val" id="bsv${i}"></div></div>`;
  });
  slots += '</div>';
  const pieces = shuffle([...ex.pieces]);
  let pool = '<div class="build-pool">';
  pieces.forEach((p,i) => {
    pool += `<span class="build-piece" id="bp${i}" data-val="${p}" onclick="AFC._buildPick(${i},'${p.replace(/'/g,"\\'")}')">${p}</span>`;
  });
  pool += '</div>';
  return `<div class="card"><div class="q-header"><span class="q-type">${ico('target')} Construye</span><span class="q-count">${S.exIdx+1}/${S.pool.length}</span></div>
  <div class="q-text">${ex.text}</div>${slots}${pool}
  <div style="text-align:center;margin-top:8px"><button class="btn btn-primary btn-sm" onclick="AFC._chkBuild()">Comprobar</button></div>
  <div class="fb" id="fb"></div></div>`;
}
function buildSlotClick(i){
  _buildActive = i;
  qsa('.build-slot').forEach((s,j) => s.style.outline = j===i ? '2px solid var(--accent)' : 'none');
}
function buildPick(idx, val){
  if(_buildActive === null) return;
  const sv = $('bsv'+_buildActive);
  const sl = $('bs'+_buildActive);
  if(sv){ sv.textContent = val; sv.style.display = 'block'; }
  if(sl) sl.classList.add('filled');
  _buildState[_buildActive] = val;
  $('bp'+idx).classList.add('used');
  _buildActive = null;
  qsa('.build-slot').forEach(s => s.style.outline = 'none');
}
function chkBuild(){
  const ex = curEx();
  let allOk = true;
  ex.slots.forEach((sl,i) => {
    const el = $('bs'+i);
    const val = _buildState[i];
    const ok = sl.correct.includes(val);
    if(el) el.classList.add(ok?'correct':'wrong');
    if(!ok) allOk = false;
  });
  qsa('.build-piece').forEach(p => p.style.pointerEvents = 'none');
  showFB(allOk, allOk ? ex.ok : ex.fail, ex.hint);
  recordAnswer(allOk, ex);
  showNext();
}

// ===== MATCH =====
let _matchLeft = null;
let _matchPairs = {};
let _matchCount = 0;
function mkMatch(ex){
  _matchLeft = null;
  _matchPairs = {};
  _matchCount = 0;
  const leftShuf = shuffle(ex.pairs.map((p,i) => ({...p, idx:i})));
  const rightShuf = shuffle(ex.pairs.map((p,i) => ({...p, idx:i})));
  let left = '<div class="match-col">';
  leftShuf.forEach(p => { left += `<div class="match-item" id="ml${p.idx}" data-idx="${p.idx}" onclick="AFC._matchL(${p.idx})">${p.left}</div>`; });
  left += '</div>';
  let right = '<div class="match-col">';
  rightShuf.forEach(p => { right += `<div class="match-item" id="mr${p.idx}" data-idx="${p.idx}" onclick="AFC._matchR(${p.idx})">${p.right}</div>`; });
  right += '</div>';
  return `<div class="card"><div class="q-header"><span class="q-type">${ico('target')} Empareja</span><span class="q-count">${S.exIdx+1}/${S.pool.length}</span></div>
  <div class="q-text">${ex.text}</div>
  <div class="match-wrap">${left}${right}</div>
  <div class="fb" id="fb"></div></div>`;
}
function matchL(idx){
  qsa('.match-col:first-child .match-item').forEach(m => m.classList.remove('selected'));
  $('ml'+idx).classList.add('selected');
  _matchLeft = idx;
  if(_matchPairs._pendingR !== undefined) tryMatch();
}
function matchR(idx){
  if(_matchLeft === null){ _matchPairs._pendingR = idx; $('mr'+idx).classList.add('selected'); return; }
  delete _matchPairs._pendingR;
  const ok = _matchLeft === idx;
  const ml = $('ml'+_matchLeft);
  const mr = $('mr'+idx);
  if(ml) ml.classList.add(ok?'correct':'wrong','disabled');
  if(mr) mr.classList.add(ok?'correct':'wrong','disabled');
  if(!ok){
    setTimeout(()=>{ if(ml)ml.classList.remove('wrong','disabled'); if(mr)mr.classList.remove('wrong','disabled'); },800);
  } else {
    _matchCount++;
    const ex = curEx();
    if(_matchCount === ex.pairs.length){
      showFB(true, ex.ok || 'Todos los pares correctos.');
      recordAnswer(true, ex);
      showNext();
    }
  }
  _matchLeft = null;
  qsa('.match-item').forEach(m => m.classList.remove('selected'));
}
function tryMatch(){}

// ===== ADVANCE =====
function curEx(){
  return MOD.levels[S.level].exercises[S.pool[S.exIdx]];
}
function advanceEx(){
  if(S.exIdx < S.pool.length - 1){
    S.exIdx++;
    S.seqIdx = 0;
    render();
  } else {
    // Level complete — tally
    let correct = 0, total = 0;
    for(const [k,v] of Object.entries(S.answers)){
      if(typeof v === 'boolean'){ total++; if(v) correct++; }
    }
    P.scores[`lvl${S.level}`] = { correct, total };
    // Update global
    const g = loadGlobal();
    if(!g[MOD.id]) g[MOD.id] = {};
    g[MOD.id][`lvl${S.level}`] = { correct, total };
    saveGlobal(g);
    saveP();
    // Check mastery
    const pct = total ? correct/total : 0;
    if(pct >= MASTERY_THRESHOLD){
      fireConfetti();
      go('level-sum');
    } else {
      go('gate');
    }
  }
}
function nextEx(){
  const ex = curEx();
  if(ex.type === 'classify' || ex.type === 'seq') return; // handled internally
  advanceEx();
}

// ===== MASTERY GATE =====
function rGate(){
  const sc = P.scores[`lvl${S.level}`];
  const pct = sc ? Math.round((sc.correct/sc.total)*100) : 0;
  const needed = Math.ceil(sc.total * MASTERY_THRESHOLD);
  $app.innerHTML = `${topbar(`Nivel ${S.level+1}`, MOD.levels[S.level].title, "AFC.go('home')")}
  <div class="content">
    <div class="gate anim">
      <div class="gate-icon">🔒</div>
      <div class="gate-title">Criterio no alcanzado</div>
      <div class="gate-sub">Necesitas al menos <strong>80%</strong> (${needed}/${sc.total}) para avanzar al siguiente nivel. Has obtenido ${sc.correct}/${sc.total}.</div>
      <div class="gate-bar"><div class="gate-bar-fill" style="width:${pct}%;background:${pct>=80?'var(--green)':(pct>=50?'var(--gold)':'var(--red)')}"></div></div>
      <div class="gate-score" style="color:${pct>=80?'var(--green)':(pct>=50?'var(--gold)':'var(--red)')}">${pct}%</div>
      ${renderErrors()}
      <p style="font-size:13px;color:var(--dim);margin-top:12px">Los ejercicios aparecerán en orden diferente. Se priorizarán los que fallaste.</p>
    </div>
  </div>
  <div class="bottombar">
    <button class="btn btn-ghost" onclick="AFC.go('home')">← Módulo</button>
    <button class="btn btn-warn" onclick="AFC.retryLevel()">Reintentar</button>
  </div>`;
}

function retryLevel(){
  delete P.scores[`lvl${S.level}`];
  P.errors[S.level] = [];
  saveP();
  go('exercise');
}

// ===== LEVEL SUMMARY =====
function rLevelSum(){
  const sc = P.scores[`lvl${S.level}`];
  const pct = sc ? Math.round((sc.correct/sc.total)*100) : 0;
  const cls = pct >= 80 ? 'great' : (pct >= 50 ? 'ok' : 'low');
  const msg = pct >= 90 ? '¡Excelente dominio!' : (pct >= 80 ? '¡Nivel superado!' : 'Buen progreso');
  const lvl = MOD.levels[S.level];
  const hasNext = S.level < MOD.levels.length - 1;

  // Skills
  let skillsHtml = renderSkills();
  let errHtml = renderErrors();

  // Cheatsheet
  let cheatHtml = '';
  if(lvl.cheat){
    cheatHtml = `<div class="cheat"><div class="cheat-title">${ico('download')} Conceptos clave</div>`;
    lvl.cheat.forEach(c => { cheatHtml += `<div class="cheat-item">• ${c}</div>`; });
    cheatHtml += '</div>';
  }

  let nextBtn = '';
  if(hasNext) nextBtn = `<button class="btn btn-primary" onclick="AFC.go('theory',{level:${S.level+1}})">Nivel ${S.level+2} ›</button>`;
  else nextBtn = `<button class="btn btn-success" onclick="AFC.go('mod-sum')">Resumen del módulo ›</button>`;

  $app.innerHTML = `${topbar(`Nivel ${S.level+1}`, 'Resultados', "AFC.go('home')")}
  <div class="content" style="text-align:center">
    <div class="anim">
      <div class="sum-circle ${cls}"><div class="sum-score">${sc.correct}</div><div class="sum-total">de ${sc.total}</div></div>
      <div class="sum-msg">${msg}</div>
      <div class="sum-sub">${LEVEL_NAMES[S.level]}: ${lvl.title} — ${pct}%</div>
    </div>
    <div style="text-align:left" class="anim d1">${skillsHtml}</div>
    <div style="text-align:left" class="anim d2">${errHtml}</div>
    <div style="text-align:left" class="anim d3">${cheatHtml}</div>
  </div>
  <div class="bottombar">
    <button class="btn btn-icon btn-ghost" onclick="AFC.retryLevel()" title="Repetir">${ico('refresh')}</button>
    ${nextBtn}
  </div>`;
}

// ===== MODULE SUMMARY =====
function rModSum(){
  let tc=0, tt=0, rows='';
  MOD.levels.forEach((lvl,i) => {
    const sc = P.scores[`lvl${i}`];
    if(sc){ tc+=sc.correct; tt+=sc.total;
      const p = Math.round((sc.correct/sc.total)*100);
      rows += `<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border2)">
        <span style="font-size:14px">${p>=80?'✅':(p>=50?'🟡':'🔴')}</span>
        <span style="flex:1;font-size:13px">${LEVEL_NAMES[i]}: ${lvl.title}</span>
        <span style="font-family:'Space Mono',monospace;font-size:12px;font-weight:700;color:${p>=80?'var(--green)':(p>=50?'var(--gold)':'var(--red)')}">${p}%</span></div>`;
    }
  });
  const pct = tt ? Math.round((tc/tt)*100) : 0;
  let skillsHtml = renderSkills();

  $app.innerHTML = `${topbar(MOD.phase, MOD.title, "AFC.go('home')")}
  <div class="content" style="text-align:center">
    <div class="anim"><div style="font-size:40px;margin-bottom:6px">${pct>=80?'🎉':'💪'}</div>
    <div class="sum-circle ${pct>=80?'great':(pct>=50?'ok':'low')}"><div class="sum-score">${tc}</div><div class="sum-total">de ${tt}</div></div>
    <div class="sum-msg">${pct>=80?'¡Módulo completado!':'Sigue practicando'}</div>
    <div class="sum-sub">${MOD.title} — ${pct}%</div></div>
    <div class="card anim d1" style="text-align:left">${rows}</div>
    <div style="text-align:left" class="anim d2">${skillsHtml}</div>
  </div>
  <div class="bottombar">
    <button class="btn btn-ghost" onclick="window.location.href='../'">← Plataforma</button>
  </div>`;
}

// ===== RENDER HELPERS =====
function renderSkills(){
  const skills = P.skills;
  const keys = Object.keys(skills);
  if(!keys.length) return '';
  let html = '<div style="font-family:\'Space Mono\',monospace;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin:12px 0 6px">Habilidades</div><div class="skills-grid">';
  keys.forEach(k => {
    const s = skills[k];
    const pct = s.t ? Math.round((s.c/s.t)*100) : 0;
    const col = pct>=80?'var(--green)':(pct>=50?'var(--gold)':'var(--red)');
    const label = k.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase());
    html += `<div class="skill-row"><span class="skill-name">${label}</span><div class="skill-bar"><div class="skill-bar-fill" style="width:${pct}%;background:${col}"></div></div><span class="skill-pct" style="color:${col}">${pct}%</span></div>`;
  });
  html += '</div>';
  return html;
}

function renderErrors(){
  const errs = P.errors[S.level];
  if(!errs || !errs.length) return '';
  let html = '<div style="font-family:\'Space Mono\',monospace;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin:12px 0 6px">Preguntas a revisar</div>';
  const unique = [];
  const seen = new Set();
  errs.forEach(e => { if(!seen.has(e.q)){ seen.add(e.q); unique.push(e); }});
  unique.slice(0,8).forEach(e => {
    html += `<div class="review-card"><div class="review-q">${e.q}</div><div class="review-a">✓ ${e.a}</div></div>`;
  });
  return html;
}

// ===== THEORY TOGGLE =====
function toggleTheory(){
  S.theoryOpen = !S.theoryOpen;
  const panel = qs('.theory-panel');
  const overlay = qs('.theory-overlay');
  if(panel) panel.classList.toggle('open', S.theoryOpen);
  if(overlay) overlay.classList.toggle('open', S.theoryOpen);
}

// ===== PUBLIC API =====
window.AFC = {
  init(moduleData, appEl){
    MOD = moduleData;
    $app = appEl;
    loadP();
    render();
  },
  go, render,
  toggleTheme,
  toggleTheory,
  retryLevel,
  nextEx,
  // Exercise handlers (prefixed with _ for internal use)
  _chkTF: chkTF,
  _chkSingle: chkSingle,
  _togMulti: togMulti,
  _chkMulti: chkMulti,
  _chkCl: chkCl,
  _pickOrd: pickOrd,
  _undoOrd: undoOrd,
  _chkSeq: chkSeq,
  _seqNext: seqNext,
  _fibSelect: fibSelect,
  _fibPick: fibPick,
  _chkFib: chkFib,
  _buildSlotClick: buildSlotClick,
  _buildPick: buildPick,
  _chkBuild: chkBuild,
  _matchL: matchL,
  _matchR: matchR,
  // Utilities exposed
  ico,
  ICO,
  loadGlobal,
  saveGlobal,
  MASTERY_THRESHOLD
};

})();

import { buildPrintMarkup } from './print-document.js';
import { makeSession, gradeQuestion, scoreSession } from './exam-core.js';
import { newTimer, elapsedTime, displayTime, formatTime, pauseTimer } from './timer.js';
import { ANALYSIS_QUESTIONS, ANALYSIS_SHORT, ANALYSIS_SOURCES } from './analysis-bank.js';

const app = document.querySelector('#app');
const KEY = 'mobilelab-v1';
let session = null, sceneCleanup = null, viewVersion = 0, timerInterval = null;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = selector => document.querySelector(selector);
const SOURCE_MAP = { ...SOURCES, ...ANALYSIS_SOURCES };
const topicsData = [
  ['BLE', 'Bluetooth & BLE', 'การเชื่อมต่อไร้สาย, GATT, services และ characteristics'],
  ['BLE code', 'BLE in practice', 'อ่านโค้ดแอป BLE และขั้นตอนเชื่อมต่ออุปกรณ์'],
  ['Sensors', 'Motion & sensors', 'Accelerometer, gyroscope และ Expo Sensors'],
  ['Android', 'Build for Android', 'พัฒนา ทดสอบ และ build แอปบน Android'],
  ['iOS', 'Build for iOS', 'Simulator, อุปกรณ์จริง และขั้นตอน build บน iOS'],
  ['Environment', 'Development environment', 'เครื่องมือและสภาพแวดล้อมในการพัฒนาแอป'],
  ['Commands', 'Command practice', 'ฝึกเขียนคำสั่งที่ใช้ในการพัฒนาแอป']
];
function load() {
  try { const value = JSON.parse(localStorage.getItem(KEY)); return value?.questions?.length && value.answers && Number.isInteger(value.index) && value.index >= 0 && value.index < value.questions.length ? value : null; }
  catch { return null; }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(session)); const status = $('#save-status'); if (status) status.textContent = 'บันทึกในเบราว์เซอร์นี้แล้ว'; return true; }
  catch { const status = $('#save-status'); if (status) { status.textContent = 'บันทึกไม่ได้ กรุณาอย่าปิดหน้านี้จนกว่าจะทบทวนเสร็จ'; status.classList.add('save-warning'); } return false; }
}
function page(html, name = '') {
  clearInterval(timerInterval); timerInterval = null;
  sceneCleanup?.(); sceneCleanup = null; viewVersion++;
  app.innerHTML = html;
  document.querySelectorAll('nav [data-view]').forEach(b => b.setAttribute('aria-current', b.dataset.view === name ? 'page' : 'false'));
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function confirmAction(title, copy, label, action) {
  const dialog = $('#confirm-dialog');
  $('#dialog-title').textContent = title; $('#dialog-copy').textContent = copy;
  $('#dialog-ok').textContent = label;
  $('#dialog-cancel').onclick = () => dialog.close();
  $('#dialog-ok').onclick = () => { dialog.close(); action(); };
  dialog.showModal();
}
function source(q) {
  const s = SOURCE_MAP[q.source];
  return `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)} · ${['ble', 'code', 'sensor'].includes(q.source) ? 'slide ' : ''}${esc(q.ref)} ↗</a>`;
}
function topicRows() {
  return topicsData.map(([key, name, description], index) => `<div class="topic-row"><span class="topic-number">${String(index + 1).padStart(2, '0')}</span><div><h3>${name}</h3><p>${description}</p></div><span class="topic-count">${key === 'Commands' ? COMMANDS.length : QUESTIONS.filter(q => q.topic === key).length} QUESTIONS</span><button class="btn small" data-topic="${esc(key)}" aria-label="เริ่มฝึก ${name}">เริ่มฝึก ↗</button></div>`).join('');
}
function analysisModeCard() {
  return `<section class="analysis-mode" aria-labelledby="analysis-title"><div><span class="eyebrow">SECOND EXAM MODE / SCENARIO PRACTICE</span><h2 id="analysis-title">ชุดวิเคราะห์ <span>คิดจากสถานการณ์จริง</span></h2><p>ฝึกตัดสินใจจากโจทย์ BLE, sensors และการ build แอป พร้อมเติมโค้ดกับคำสั่งตั้งโปรเจกต์ใน Part 2</p><p class="analysis-note">โจทย์จำลองจากเนื้อหาเรียน · ไม่ใช่ข้อสอบจริงหรือผลงานของ Gemini</p></div><div class="analysis-action"><span>50 multiple choice<br>6 code blanks + 6 commands<br><strong>62 ข้อ · 74 คะแนน</strong></span><button class="btn primary" id="start-analysis">เริ่มชุดวิเคราะห์ ↗</button></div></section>`;
}
function bindTopics() { document.querySelectorAll('[data-topic]').forEach(b => b.onclick = () => start('practice', b.dataset.topic)); }
function home() {
  const saved = load();
  page(`<section class="hero"><div class="hero-copy"><div class="eyebrow">MOBILE APPLICATION DEVELOPMENT</div><h1>ฝึกก่อนสอบ<span>ปลายภาค</span></h1><p class="lead">ตั้งแต่เซนเซอร์ในโทรศัพท์ ไปจนถึงคำสั่งพัฒนาแอป<br>ฝึกจากเนื้อหาในห้องเรียน แล้วทบทวนจุดที่ยังไม่แม่น</p><div class="actions"><button class="btn primary" id="start">เริ่มสอบ 62 ข้อ ↗</button><button class="btn" id="practice">ฝึกแยกหัวข้อ →</button></div>${saved ? `<div class="actions"><button class="btn small" id="resume">${saved.submitted ? 'ดูผลครั้งล่าสุด' : `ทำต่อ · ข้อ ${saved.index + 1}/${saved.questions.length}`} ↗</button></div>` : ''}<p class="micro">ENGLISH QUESTIONS / คำอธิบายภาษาไทย</p></div><div class="visual"><div class="orbit" aria-hidden="true"></div><div class="orbit second" aria-hidden="true"></div><div class="model-stage" id="model-stage" role="img" aria-label="โมเดลโทรศัพท์ 3D สีกราไฟต์"><div class="model-fallback"><div class="fallback-phone"><span>MOBILE LAB</span><strong>m/</strong><span>SENSOR STUDIO</span></div></div></div><span class="sensor-tag tag-a">BLUETOOTH</span><span class="sensor-tag tag-b">SENSORS</span><span class="sensor-tag tag-c">&gt; COMMANDS</span><p class="model-status" id="model-status">กำลังเตรียมโมเดล 3D</p><div class="model-controls" aria-label="ควบคุมโมเดล"><button id="rotate-left" aria-label="หมุนซ้าย" disabled>↶</button><button id="rotate-right" aria-label="หมุนขวา" disabled>↷</button><button id="reset-model" disabled>รีเซ็ต</button><button id="motion-model" disabled>หยุดหมุน</button><button id="touch-model" hidden>เปิดการลาก</button></div></div></section><section class="exam-strip" aria-label="รูปแบบข้อสอบ"><div><strong>50</strong><span><b>Multiple choice</b><br>ข้อละ 1 คะแนน</span></div><div><strong>12</strong><span><b>Short answer</b><br>คำสั่ง · ข้อละ 2 คะแนน</span></div><div><strong>74</strong><span>คะแนนเต็ม<br>รวม 62 ข้อ</span></div></section><section class="section" id="topics"><div class="section-head"><div><div class="eyebrow">THE SYLLABUS / 07 TOPICS</div><h2>เริ่มจากบทที่อยากทบทวน</h2></div><p>สุ่มครั้งละไม่เกิน 10 ข้อ · เปิดเฉลยได้ทันที</p></div>${topicRows()}</section>`, 'home');
  $('#start').onclick = () => start('exam');
  $('.exam-strip').insertAdjacentHTML('afterend', analysisModeCard());
  $('#start-analysis').onclick = () => start('analysis');
  $('#practice').onclick = topics;
  if (saved) $('#resume').onclick = () => { session = load(); if (session) session.submitted ? results() : renderExam(); };
  bindTopics();
  const version = viewVersion, stage = $('#model-stage');
  import('./scene.js').then(module => { if (version === viewVersion && stage.isConnected) sceneCleanup = module.mountScene(stage); }).catch(() => { if (stage.isConnected) $('#model-status').textContent = 'ภาพสำรอง · ไม่สามารถโหลด 3D ได้'; });
}
function topics() {
  page(`<section class="workspace"><div class="eyebrow">TOPIC PRACTICE</div><h1 class="page-title">เลือกบทที่อยากฝึก</h1><p class="lead">เริ่มทีละหัวข้อ แล้วค่อยรวมเป็นชุดสอบเต็ม 62 ข้อ<br>แต่ละชุดสุ่มไม่เกิน 10 ข้อ พร้อมเฉลยและแหล่งอ้างอิง</p><div class="section">${topicRows()}</div></section>`);
  bindTopics();
}
function start(mode, topic) {
  const create = () => {
    const old = load();
    if (old) { try { localStorage.setItem(`${KEY}-previous`, JSON.stringify(old)); } catch { /* Main save reports failures. */ } }
    session = mode === 'analysis' ? makeSession(ANALYSIS_QUESTIONS, ANALYSIS_SHORT, mode) : makeSession(QUESTIONS, COMMANDS, mode, topic);
    save(); renderExam();
  };
  const saved = load();
  if (saved && !saved.submitted) confirmAction('เริ่มชุดใหม่?', 'มีชุดที่ยังทำไม่เสร็จ ชุดใหม่จะเป็นชุดที่เปิดทำต่อได้จากหน้าหลัก ระบบจะสำรองชุดก่อนหน้าไว้ในเบราว์เซอร์นี้', 'เริ่มชุดใหม่', create);
  else create();
}
function navButton(q, i) {
  const answered = Boolean(session.answers[q.id]?.trim());
  return `<button data-index="${i}" class="${answered ? 'done' : ''}" aria-current="${i === session.index}" aria-label="ข้อ ${i + 1}${answered ? ' ตอบแล้ว' : ''}">${i + 1}</button>`;
}
function mountTimer() {
  const timer = session.timer || newTimer();
  const host = document.createElement('div');
  host.className = 'timer-wrap';
  host.innerHTML = `<details class="timer-panel"><summary><span class="timer-icon" aria-hidden="true">◷</span><span>จับเวลา</span><span class="timer-readout" id="timer-summary">${formatTime(displayTime(timer))}</span><span class="timer-chevron" aria-hidden="true">⌄</span></summary><div class="timer-controls"><label for="timer-mode">รูปแบบ</label><select id="timer-mode"><option value="elapsed">เวลาที่ใช้ไป</option><option value="countdown">นับถอยหลัง</option></select><div id="timer-duration-row"><label for="timer-minutes">กำหนดเวลา (นาที)</label><input id="timer-minutes" type="number" min="1" max="1440" step="1" inputmode="numeric" value="${timer.duration / 60000}"></div><p class="timer-help">เปลี่ยนรูปแบบหรือเวลาได้หลังรีเซ็ต</p><div class="timer-actions"><button class="btn small primary" id="timer-start" type="button">เริ่มจับเวลา</button><button class="btn small" id="timer-reset" type="button">รีเซ็ต</button></div><p id="timer-message" class="timer-message" role="status"></p></div></details>`;
  const alert = document.createElement('p'); alert.className = 'timer-alert'; alert.setAttribute('role', 'status'); host.append(alert);
  $('.topline').after(host);
  const mode = $('#timer-mode'), minutes = $('#timer-minutes'), row = $('#timer-duration-row'), start = $('#timer-start'), message = $('#timer-message');
  message.hidden = true; // The persistent alert below the panel announces expiry, including when collapsed.
  mode.value = timer.mode;
  const paint = () => {
    const hasRun = timer.startedAt !== null || timer.elapsed > 0;
    row.hidden = timer.mode !== 'countdown'; mode.disabled = hasRun; minutes.disabled = hasRun;
    start.textContent = timer.startedAt === null ? (timer.elapsed > 0 ? 'จับเวลาต่อ' : 'เริ่มจับเวลา') : 'หยุดชั่วคราว';
    $('#timer-summary').textContent = formatTime(displayTime(timer));
    if (timer.mode === 'countdown' && elapsedTime(timer) >= timer.duration && hasRun) {
      if (!timer.expired) { timer.expired = true; session.timer = timer; save(); }
      message.textContent = 'หมดเวลาแล้ว คุณยังทำข้อสอบต่อและส่งเองได้';
      alert.textContent = 'หมดเวลาแล้ว คุณยังทำข้อสอบต่อและส่งเองได้';
      host.classList.add('timer-expired');
    } else { message.textContent = ''; alert.textContent = ''; host.classList.remove('timer-expired'); }
  };
  mode.onchange = () => { timer.mode = mode.value; timer.expired = false; session.timer = timer; save(); paint(); };
  minutes.onchange = () => {
    const value = Number(minutes.value);
    if (!Number.isInteger(value) || value < 1 || value > 1440) { minutes.setCustomValidity('กรุณากรอกเวลา 1–1440 นาที'); minutes.reportValidity(); return; }
    minutes.setCustomValidity(''); timer.duration = value * 60000; timer.expired = false; session.timer = timer; save(); paint();
  };
  minutes.oninput = () => minutes.setCustomValidity('');
  start.onclick = () => {
    if (timer.startedAt !== null) pauseTimer(timer);
    else {
      if (timer.mode === 'countdown') { const value = Number(minutes.value); if (!Number.isInteger(value) || value < 1 || value > 1440) { minutes.setCustomValidity('กรุณากรอกเวลา 1–1440 นาที'); minutes.reportValidity(); return; } timer.duration = value * 60000; }
      timer.startedAt = Date.now();
    }
    session.timer = timer; save(); paint();
  };
  $('#timer-reset').onclick = () => { timer.elapsed = 0; timer.startedAt = null; timer.expired = false; session.timer = timer; save(); paint(); };
  paint(); timerInterval = setInterval(paint, 1000);
}
function renderExam() {
  const n = session.questions.length;
  page(`<section class="workspace"><div class="topline"><span class="eyebrow">${session.mode === 'exam' ? 'FINAL EXAM / 62 QUESTIONS / 74 POINTS' : 'TOPIC PRACTICE'}</span><button class="btn small map-toggle" id="map-toggle" aria-expanded="false" aria-controls="question-map">รายการข้อสอบ</button><button class="btn small" id="leave">บันทึกและออก ↗</button></div><div class="exam-layout"><div class="exam-main"><div class="progress" role="progressbar" aria-label="จำนวนข้อที่ตอบแล้ว" aria-valuemin="0" aria-valuemax="${n}" id="progress"><i></i></div><div id="question-body" class="question"></div><div class="exam-controls"><button class="btn" id="prev">← ก่อนหน้า</button><button class="btn primary" id="next">ข้อถัดไป →</button></div><p class="hint" id="save-status" role="status">บันทึกคำตอบอัตโนมัติในเบราว์เซอร์นี้</p></div><aside class="map-panel" id="question-map" aria-label="รายการข้อสอบ"><h3>รายการข้อสอบ</h3><p class="hint" id="answered-count" aria-live="polite"></p>${[true, false].map(mc => { const rows = session.questions.map((q, i) => ({ q, i })).filter(({ q }) => Boolean(q.options) === mc); return rows.length ? `<p class="map-part">${mc ? 'PART 1 / MULTIPLE CHOICE' : 'PART 2 / COMMANDS'}</p><div class="gridnav">${rows.map(({ q, i }) => navButton(q, i)).join('')}</div>` : ''; }).join('')}<p class="hint">● ตอบแล้ว · กรอบเขียวคือข้อปัจจุบัน</p><button class="btn small finish-link" id="finish">จบชุดและดูเฉลย</button></aside></div></section>`);
  if (session.mode === 'analysis') {
    $('.topline .eyebrow').textContent = 'ANALYTICAL EXAM / 62 QUESTIONS / 74 POINTS';
    document.querySelectorAll('.map-part')[1].textContent = 'PART 2 / CODE & COMMANDS';
  }
  mountTimer();
  $('#prev').onclick = () => moveTo(session.index - 1);
  $('#next').onclick = () => session.index < n - 1 ? moveTo(session.index + 1) : finish();
  $('#leave').onclick = () => { save(); home(); };
  $('#finish').onclick = finish;
  $('#map-toggle').onclick = () => { const open = $('#question-map').classList.toggle('open'); $('#map-toggle').setAttribute('aria-expanded', open); };
  document.querySelectorAll('[data-index]').forEach(b => b.onclick = () => moveTo(Number(b.dataset.index)));
  renderQuestion(false); updateAnswerStatus();
}
function partLabel(q) {
  return q.options ? 'PART 1 · MULTIPLE CHOICE' : q.kind === 'code' ? 'PART 2 · CODE COMPLETION' : 'PART 2 · COMMANDS';
}
function codeSnippet(q) {
  return `<pre class="code-prompt"><code lang="en">${esc(q.snippet).replaceAll('____', '<span class="code-gap">____</span>')}</code></pre>`;
}
function answerInput(q, answer) {
  if (q.options) return `<fieldset aria-labelledby="question-heading">${q.options.map((option, i) => `<label class="option"><input type="radio" name="answer" value="${esc(option)}" ${answer === option ? 'checked' : ''}><span class="option-letter" aria-hidden="true">${String.fromCharCode(65 + i)}</span><span class="option-copy" lang="en">${esc(option)}</span></label>`).join('')}</fieldset>`;
  if (q.kind === 'code') return `<div class="code-completion"><div class="terminal-bar"><span>CODE / FILL THE BLANK</span><span aria-hidden="true">&gt;_</span></div>${codeSnippet(q)}<label for="answer">เติมเฉพาะคำที่หายไปในช่องว่าง</label><input id="answer" type="text" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="Your answer" value="${esc(answer)}" lang="en"></div><p class="hint">พิมพ์เฉพาะส่วนที่แทน ____ ระบบตรวจตัวพิมพ์เล็ก–ใหญ่ตามโค้ด</p>`;
  return `<div class="terminal"><div class="terminal-bar"><span>TERMINAL / COMMAND INPUT</span><span aria-hidden="true">&gt;_</span></div><label for="answer">พิมพ์คำสั่งของคุณ</label><textarea id="answer" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="$ your command here" lang="en">${esc(answer)}</textarea></div><p class="hint">คำสั่งที่ตรงกับเฉลยจะได้ 2 คะแนน คำตอบอื่นจะรอตรวจทานและให้คะแนนเองได้</p>`;
}
function renderQuestion(focus) {
  const q = session.questions[session.index], answer = session.answers[q.id] || '';
  $('#question-body').innerHTML = `<div class="question-meta"><span>${partLabel(q)} · ข้อ ${session.index + 1}/${session.questions.length}</span><span class="points">${q.options ? 1 : 2} คะแนน</span></div><p class="eyebrow">${esc(q.topic)}</p><h2 id="question-heading" tabindex="-1" lang="en">${esc(q.question)}</h2>${answerInput(q, answer)}<div class="check-actions"><button class="btn primary check-button" id="reveal" type="button" aria-haspopup="dialog" aria-controls="review-dialog">ตรวจคำตอบ <span aria-hidden="true">↗</span></button><span class="check-caption" role="status" aria-live="polite">แสดงผลของข้อนี้ โดยไม่เปลี่ยนข้อ</span></div>`;
  document.querySelectorAll('input[name="answer"]').forEach(input => input.onchange = () => recordAnswer(q, input.value));
  if ($('#answer')) $('#answer').oninput = event => recordAnswer(q, event.target.value);
  $('#reveal').onclick = () => checkCurrentAnswer(q);
  $('#prev').disabled = session.index === 0;
  $('#next').textContent = session.index === session.questions.length - 1 ? 'จบชุดและดูเฉลย →' : 'ข้อถัดไป →';
  document.querySelectorAll('[data-index]').forEach(b => b.setAttribute('aria-current', Number(b.dataset.index) === session.index));
  if (focus) {
    const heading = $('#question-heading');
    heading.focus({ preventScroll: true });
    // Never push the viewport down after Next. Only recover a heading above the viewport.
    const top = heading.getBoundingClientRect().top;
    if (top < 24) window.scrollBy({ top: top - 24, behavior: 'instant' });
  }
}
// Keep the inputs mounted: replacing the page here loses scroll, focus and text selection.
function recordAnswer(q, value) {
  session.answers[q.id] = value;
  if (session.reviews) delete session.reviews[q.id];
  save(); updateAnswerStatus();
  const caption = $('.check-caption');
  const wasReviewed = caption.dataset.reviewed === 'true';
  if (!wasReviewed && caption.dataset.state !== 'empty') return;
  $('#reveal').innerHTML = `${wasReviewed ? 'ตรวจคำตอบใหม่' : 'ตรวจคำตอบ'} <span aria-hidden="true">↗</span>`;
  caption.textContent = wasReviewed ? 'เปลี่ยนคำตอบแล้ว กดตรวจอีกครั้ง' : 'แสดงผลของข้อนี้ โดยไม่เปลี่ยนข้อ';
  caption.dataset.state = '';
  caption.dataset.reviewed = 'false';
}
function checkCurrentAnswer(q) {
  const answer = session.answers[q.id]?.trim();
  const caption = $('.check-caption');
  if (!answer) {
    caption.textContent = 'กรุณาเลือกหรือพิมพ์คำตอบก่อนกดตรวจ';
    caption.dataset.state = 'empty';
    return;
  }
  const grade = gradeQuestion(q, session);
  caption.textContent = grade.pending ? 'รอตรวจทาน · เปิดเฉลยอีกครั้งได้' : grade.points ? 'ตอบถูก · เปิดคำอธิบายอีกครั้งได้' : 'ควรทบทวน · เปิดเฉลยอีกครั้งได้';
  caption.dataset.state = grade.pending ? 'pending' : grade.points ? 'correct' : 'incorrect';
  caption.dataset.reviewed = 'true';
  $('#reveal').innerHTML = 'ดูเฉลยอีกครั้ง <span aria-hidden="true">↗</span>';
  openReview(q);
}
let reviewOrigin = null, reviewScrollY = 0;
function openReview(q) {
  const dialog = $('#review-dialog');
  reviewOrigin = $('#reveal');
  reviewScrollY = window.scrollY;
  $('#review-dialog-meta').textContent = `${partLabel(q)} · ข้อ ${session.index + 1}/${session.questions.length}`;
  $('#review-dialog-body').innerHTML = inlineFeedback(q);
  $('#review-dialog-body').scrollTop = 0;
  $('#review-next').textContent = session.index === session.questions.length - 1 ? 'จบชุด →' : 'ข้อถัดไป →';
  dialog.returnValue = '';
  dialog.showModal();
}
function inlineFeedback(q) {
  const grade = gradeQuestion(q, session);
  const state = grade.pending ? 'pending' : grade.points ? 'correct' : 'incorrect';
  const title = grade.pending ? 'รอตรวจทานคำตอบสั้น' : grade.points ? 'ตอบถูก' : 'ควรทบทวนข้อนี้';
  const note = grade.pending ? 'คำตอบนี้ไม่ตรงกับข้อความที่ระบบยอมรับ โปรดเทียบกับเฉลยและให้คะแนนเองเมื่อจบชุด' : grade.points ? 'ตรงกับคำตอบที่ยอมรับ' : 'ดูคำตอบอ้างอิงและคำอธิบายด้านล่าง';
  return `<section class="check-result ${state}" aria-label="ผลตรวจคำตอบข้อปัจจุบัน"><div class="check-result-head"><span class="check-symbol" aria-hidden="true">${grade.pending ? '◇' : grade.points ? '✓' : '!'}</span><div><strong>${title}</strong><p>${note}</p></div><span class="check-score">${grade.pending ? 'รอตรวจ' : `${grade.points}/${q.options ? 1 : 2}`}</span></div>${q.snippet ? codeSnippet(q) : ''}<div class="check-comparison"><div><span>คำตอบของคุณ</span><code lang="en">${esc(session.answers[q.id].trim())}</code></div><div><span>คำตอบอ้างอิง</span><code lang="en">${esc(q.correct)}</code></div></div><div class="check-explanation"><span>ทำความเข้าใจ</span><p>${esc(q.explanation)}</p><p class="reference">แหล่งอ้างอิง · ${source(q)}</p></div></section>`;
}
function updateAnswerStatus() {
  const count = session.questions.filter(q => session.answers[q.id]?.trim()).length;
  $('#answered-count').textContent = `ตอบแล้ว ${count} / ${session.questions.length} ข้อ`;
  $('#progress').setAttribute('aria-valuenow', count);
  $('#progress i').style.width = `${count / session.questions.length * 100}%`;
  document.querySelectorAll('[data-index]').forEach(b => { const yes = Boolean(session.answers[session.questions[+b.dataset.index].id]?.trim()); b.classList.toggle('done', yes); b.setAttribute('aria-label', `ข้อ ${+b.dataset.index + 1}${yes ? ' ตอบแล้ว' : ''}`); });
}
function moveTo(index) {
  if (index < 0 || index >= session.questions.length) return;
  session.index = index; save();
  $('#question-map').classList.remove('open'); $('#map-toggle').setAttribute('aria-expanded', 'false');
  renderQuestion(true);
  const body = $('#question-body'); body.classList.remove('question-enter'); void body.offsetWidth; body.classList.add('question-enter');
}
function finish() {
  const missing = session.questions.filter(q => !session.answers[q.id]?.trim()).length;
  confirmAction('จบชุดและเปิดเฉลย?', missing ? `ยังไม่ได้ตอบ ${missing} ข้อ เมื่อเปิดเฉลยแล้วจะไม่เปลี่ยนคำตอบในชุดนี้ แต่ยังตรวจทานคะแนนคำตอบสั้นได้` : 'ระบบจะสรุปคะแนนปรนัยและตรวจคำตอบสั้นเบื้องต้น พร้อมแสดงเฉลยและแหล่งอ้างอิง', 'เปิดเฉลย', () => { if (session.timer) pauseTimer(session.timer); session.submitted = true; save(); results(); });
}
function gradeLabel(q) {
  const grade = gradeQuestion(q, session);
  return grade.pending ? 'รอตรวจทาน · ยังไม่รวมคะแนนข้อนี้' : `${grade.points} / ${q.options ? 1 : 2} คะแนน · ${grade.kind === 'auto' ? 'ตรงกับคำตอบที่ยอมรับ' : grade.kind === 'manual' ? 'ตรวจด้วยตนเอง' : grade.points ? 'ตอบถูก' : 'ทบทวนอีกครั้ง'}`;
}
function feedback(q) {
  const grade = gradeQuestion(q, session);
  return `<div class="answer ${grade.pending ? 'pending' : ''}">${q.snippet ? codeSnippet(q) : ''}<strong>${grade.pending ? 'รอตรวจทาน' : q.options ? (grade.points ? 'ตอบถูก ✓' : 'คำตอบอ้างอิง') : grade.kind === 'auto' ? 'คำตอบที่ยอมรับ ✓' : 'คำตอบอ้างอิง · ตรวจทานแล้ว'}</strong><p><code lang="en">${esc(q.correct)}</code></p><p>${esc(q.explanation)}</p><p class="reference">แหล่งอ้างอิง · ${source(q)}</p></div>`;
}
function scoreMarkup() {
  const s = scoreSession(session);
  return `<div class="result-head"><div><div class="eyebrow">${session.mode === 'analysis' ? 'ANALYTICAL EXAM' : session.mode === 'exam' ? 'FINAL EXAM' : 'TOPIC PRACTICE'} / SESSION REVIEW</div><h1>ทบทวนคำตอบ</h1><p class="hint">${s.pending ? `คะแนนเบื้องต้น · มีคำตอบสั้นรอตรวจทาน ${s.pending} ข้อ` : 'ตรวจครบแล้ว · คะแนนชุดฝึกนี้'}${session.timer ? ` · เวลาที่จับ ${formatTime(elapsedTime(session.timer))}` : ''}</p></div><div class="result-total">${s.total}<span> / ${s.max}</span></div></div><div class="score-breakdown"><div><strong>${s.mc} / ${s.mcMax}</strong><span>ปรนัย · Multiple choice</span></div><div><strong>${s.short} / ${s.shortMax}</strong><span>คำตอบสั้น · ${session.mode === 'analysis' ? 'Code & commands' : 'Commands'}</span></div><div><strong>${String(s.pending).padStart(2, '0')}</strong><span>คำตอบสั้นรอตรวจทาน</span></div></div>`;
}
function results() {
  page(`<section class="workspace"><div id="score-summary" aria-live="polite">${scoreMarkup()}</div><div class="actions"><button class="btn primary" id="printQ">พิมพ์โจทย์ / PDF ↗</button><button class="btn" id="printA">พิมพ์เฉลย / PDF</button><button class="btn" id="again">สุ่มชุดสอบใหม่</button></div><p class="hint" id="save-status">คำตอบสั้นตรวจเทียบข้อความกับเฉลย คำสั่งทางเลือกต้องตรวจทานเอง ไม่ถือว่าผิดโดยอัตโนมัติ</p><div class="review-list"><div class="section-head"><h2>เฉลยทีละข้อ</h2><span class="hint">กดที่โจทย์เพื่อเปิดคำอธิบาย</span></div>${session.questions.map((q, i) => { const grade = gradeQuestion(q, session); return `<details class="review-item" ${i === 0 || grade.pending ? 'open' : ''}><summary><span class="review-number">${String(i + 1).padStart(2, '0')}</span><h3><span lang="en">${esc(q.question)}</span><span class="review-label ${grade.pending ? 'pending' : ''}" id="grade-${q.id}">${gradeLabel(q)}</span></h3></summary><div class="review-body"><p class="user-answer">คำตอบของคุณ · <code lang="en">${esc(session.answers[q.id] || '— ยังไม่ได้ตอบ')}</code></p>${feedback(q)}${!q.options && grade.kind !== 'auto' ? `<fieldset class="manual-review"><legend>ตรวจเทียบเฉลยและให้คะแนนข้อ ${i + 1} ด้วยตนเอง</legend>${[0, 1, 2].map(points => `<label><input type="radio" name="review-${q.id}" data-review="${q.id}" value="${points}" ${session.reviews?.[q.id] === points ? 'checked' : ''}>${points} คะแนน</label>`).join('')}</fieldset>` : ''}</div></details>`; }).join('')}</div></section>`);
  if (session.mode === 'analysis') $('#again').textContent = 'สุ่มชุดวิเคราะห์ใหม่';
  if (session.mode === 'analysis') $('#save-status').textContent = 'คำตอบเติมโค้ดและคำสั่งตรวจเทียบข้อความกับเฉลย คำตอบทางเลือกต้องตรวจทานเอง ไม่ถือว่าผิดโดยอัตโนมัติ';
  $('#again').onclick = () => start(session.mode === 'analysis' ? 'analysis' : 'exam'); $('#printQ').onclick = () => printExam(false); $('#printA').onclick = () => printExam(true);
  document.querySelectorAll('[data-review]').forEach(input => input.onchange = () => {
    session.reviews ||= {}; session.reviews[input.dataset.review] = Number(input.value); save();
    const q = session.questions.find(q => q.id === input.dataset.review);
    const label = $(`#grade-${q.id}`); label.textContent = gradeLabel(q); label.classList.remove('pending');
    const answer = input.closest('.review-body').querySelector('.answer'); answer.classList.remove('pending'); answer.querySelector('strong').textContent = 'คำตอบอ้างอิง · ตรวจทานแล้ว';
    $('#score-summary').innerHTML = scoreMarkup();
  });
}
async function printExam(key) {
  $('#print').innerHTML = buildPrintMarkup(session, SOURCE_MAP, key);
  await document.fonts.ready;
  window.print();
}
function sources() {
  page(`<section class="workspace"><div class="eyebrow">COURSE REFERENCES</div><h1 class="page-title">กลับไปอ่านต้นฉบับ</h1><p class="lead">เนื้อหาหลักอ้างอิงสไลด์และวิดีโอที่โพสต์หลัง 3 ก.ย. ชุดวิเคราะห์เพิ่มเอกสาร Expo ทางการเฉพาะคำสั่งสร้างและเริ่มโปรเจกต์</p><ul class="source-list">${Object.values(SOURCE_MAP).map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)} ↗</a></li>`).join('')}</ul><p class="hint">เว็บนี้เป็นเครื่องมือฝึกทบทวน ไม่ใช่ข้อสอบจริงของอาจารย์</p></section>`, 'sources');
}
const reviewDialog = $('#review-dialog');
$('#review-close').onclick = () => reviewDialog.close('back');
$('#review-back').onclick = () => reviewDialog.close('back');
$('#review-next').onclick = () => {
  const last = session.index === session.questions.length - 1;
  reviewDialog.close(last ? 'finish' : 'next');
  if (last) finish();
  else moveTo(session.index + 1);
};
reviewDialog.addEventListener('close', () => {
  if (['next', 'finish'].includes(reviewDialog.returnValue)) return;
  if (reviewOrigin?.isConnected) reviewOrigin.focus({ preventScroll: true });
  window.scrollTo({ top: reviewScrollY, behavior: 'instant' });
});
reviewDialog.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const controls = [...reviewDialog.querySelectorAll('button:not([disabled]), a[href]')];
  const first = controls[0], last = controls.at(-1);
  if (!first || !last) return;
  if (event.shiftKey && (document.activeElement === first || !reviewDialog.contains(document.activeElement))) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && (document.activeElement === last || !reviewDialog.contains(document.activeElement))) {
    event.preventDefault(); first.focus();
  }
});
document.querySelectorAll('[data-view]').forEach(button => button.onclick = event => { event.preventDefault(); button.dataset.view === 'sources' ? sources() : home(); });
const themeButton = document.createElement('button');
themeButton.type = 'button'; themeButton.className = 'theme-toggle';
document.querySelector('header nav').append(themeButton);
function updateThemeButton() { const light = document.documentElement.dataset.theme === 'light'; themeButton.innerHTML = `<span aria-hidden="true">${light ? '☾' : '☼'}</span> ${light ? 'ธีมมืด' : 'ธีมสว่าง'}`; themeButton.setAttribute('aria-label', light ? 'เปลี่ยนเป็นธีมมืด' : 'เปลี่ยนเป็นธีมสว่าง'); }
themeButton.onclick = () => { const root = document.documentElement; root.classList.add('theme-transition'); root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light'; try { localStorage.setItem('mobilelab-theme', root.dataset.theme); } catch {} updateThemeButton(); window.setTimeout(() => root.classList.remove('theme-transition'), 400); };
updateThemeButton();
home();


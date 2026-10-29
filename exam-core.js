export function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
export function makeSession(bank, commands, mode = 'exam', topic) {
  const choose = (topics, count) => {
    const pool = bank.filter(q => topics.includes(q.topic));
    if (pool.length < count) throw new Error('คลังข้อสอบไม่ครบตามจำนวนที่กำหนด');
    return shuffle(pool).slice(0, count);
  };
  if (!['exam', 'analysis', 'practice'].includes(mode)) throw new Error('ไม่รู้จักรูปแบบข้อสอบ');
  if (mode !== 'practice' && commands.length < 12) throw new Error('คลังคำตอบสั้นไม่ครบ 12 ข้อ');
  let shortQuestions = [];
  if (mode === 'analysis') {
    const code = commands.filter(q => q.kind === 'code');
    const terminal = commands.filter(q => q.kind === 'command');
    const required = ['create', 'android', 'build'].map(category => shuffle(terminal.filter(q => q.category === category))[0]);
    if (code.length < 6 || terminal.length < 6 || required.some(q => !q)) throw new Error('คลังโจทย์วิเคราะห์ไม่ครบตามหมวด');
    const extras = shuffle(terminal.filter(q => !required.includes(q))).slice(0, 3);
    shortQuestions = shuffle([...shuffle(code).slice(0, 6), ...required, ...extras]);
  } else if (mode === 'exam') shortQuestions = shuffle(commands).slice(0, 12);
  const questions = mode !== 'practice'
    ? [...shuffle([...choose(['BLE', 'BLE code'], 18), ...choose(['Sensors'], 14), ...choose(['Android'], 7), ...choose(['iOS'], 7), ...choose(['Environment'], 4)]), ...shortQuestions]
    : shuffle(topic === 'Commands' ? commands : bank.filter(q => q.topic === topic)).slice(0, 10);
  if (!questions.length || new Set(questions.map(q => q.id)).size !== questions.length) throw new Error('ไม่สามารถสร้างชุดข้อสอบได้');
  return { mode, questions: questions.map(q => ({ ...q, options: q.wrong ? shuffle([q.correct, ...q.wrong]) : null })), answers: {}, reviews: {}, index: 0, submitted: false, started: Date.now() };
}
// Only outer whitespace is ignored. Case, flags, internal spaces and shell syntax remain significant.
export const matchesCommand = (q, answer) => [q.correct, ...(q.acceptedAnswers || [])].some(a => a.trim() === String(answer || '').trim());
export function gradeQuestion(q, session) {
  if (q.options) return { points: session.answers[q.id] === q.correct ? 1 : 0, pending: false, kind: 'multiple' };
  if (matchesCommand(q, session.answers[q.id])) return { points: 2, pending: false, kind: 'auto' };
  const manual = session.reviews?.[q.id];
  if ([0, 1, 2].includes(manual)) return { points: manual, pending: false, kind: 'manual' };
  return { points: 0, pending: true, kind: 'pending' };
}
export function scoreSession(session) {
  const result = { mc: 0, short: 0, mcMax: 0, shortMax: 0, pending: 0, total: 0, max: 0 };
  for (const q of session.questions) {
    const grade = gradeQuestion(q, session);
    if (q.options) { result.mc += grade.points; result.mcMax++; }
    else { result.short += grade.points; result.shortMax += 2; }
    result.pending += Number(grade.pending);
  }
  result.total = result.mc + result.short;
  result.max = result.mcMax + result.shortMax;
  return result;
}

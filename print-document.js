import { scoreSession } from './exam-core.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function buildPrintMarkup(session, sources, key = false) {
  const score = scoreSession(session);
  const analytical = session.mode === 'analysis';
  const title = key ? 'Answer Key' : 'Practice Exam';
  const heading = `<div class="print-heading"><h1>Mobile Lab / ${analytical ? 'Analytical ' : ''}${title}</h1><p>${score.mcMax} multiple choice × 1 point + ${score.shortMax / 2} ${analytical ? 'code and command answers' : 'commands'} × 2 points = ${score.max} points</p><p>ชื่อ ___________________________________ วันที่ __________________</p></div>`;
  return heading + session.questions.map((q, i) => {
    const newPart = i === 0 || Boolean(q.options) !== Boolean(session.questions[i - 1].options);
    const part = newPart ? `<h2 class="print-part">${q.options ? 'Part 1 · Multiple choice' : analytical ? 'Part 2 · Code and commands' : 'Part 2 · Commands'}</h2>` : '';
    const options = q.options ? q.options.map((option, j) => `<p lang="en">${String.fromCharCode(65 + j)}. ${esc(option)}</p>`).join('') : '<div class="answer-space">Answer:</div>';
    const snippet = q.snippet ? `<pre class="print-code"><code lang="en">${esc(q.snippet)}</code></pre>` : '';
    const answer = key ? `<div class="print-answer"><b>Answer: <code>${esc(q.correct)}</code></b><p>${esc(q.explanation)}</p><p class="print-reference">${esc(sources[q.source].name)} · ${esc(q.ref)}<br>${esc(sources[q.source].url)}</p></div>` : '';
    return `${part}<div class="print-question"><h3 lang="en">${i + 1}. ${esc(q.question)} (${q.options ? 1 : 2} ${q.options ? 'point' : 'points'})</h3>${snippet}${options}${answer}</div>`;
  }).join('');
}

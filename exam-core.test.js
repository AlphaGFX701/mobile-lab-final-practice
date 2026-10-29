import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { makeSession, scoreSession, gradeQuestion } from './exam-core.js';
import { buildPrintMarkup } from './print-document.js';
const data = vm.runInNewContext(`${fs.readFileSync(new URL('./bank.js', import.meta.url), 'utf8')};({QUESTIONS,COMMANDS,SOURCES})`);
test('1000 exam draws have exactly 50 MC + 12 commands, unique IDs, valid options and 74 points', () => {
  for (let i = 0; i < 1000; i++) {
    const s = makeSession(data.QUESTIONS, data.COMMANDS);
    assert.equal(s.questions.length, 62);
    assert.equal(s.questions.filter(q => q.options).length, 50);
    assert.equal(new Set(s.questions.map(q => q.id)).size, 62);
    assert.ok(s.questions.slice(50).every(q => !q.options));
    for (const q of s.questions) { s.answers[q.id] = q.correct; if (q.options) assert.equal(new Set(q.options).size, 4); }
    assert.deepEqual(scoreSession(s), { mc: 50, short: 24, mcMax: 50, shortMax: 24, pending: 0, total: 74, max: 74 });
  }
});
test('unrecognized commands remain pending; manual 0/1/2 changes total and survives serialization', () => {
  const s = makeSession(data.QUESTIONS, data.COMMANDS);
  const q = s.questions[50];
  s.answers[q.id] = `${q.correct} --unrecognized`;
  assert.equal(gradeQuestion(q, s).pending, true);
  for (const p of [0, 1, 2]) { s.reviews[q.id] = p; const restored = JSON.parse(JSON.stringify(s)); assert.equal(gradeQuestion(q, restored).points, p); assert.equal(scoreSession(restored).pending, 11); assert.equal(scoreSession(restored).short, p); }
});
test('command matching preserves case and shell syntax; no global whitespace collapse', () => {
  const q = { id: 's-test', correct: 'npm install buffer', options: null };
  const s = { answers: { 's-test': '  npm install buffer  ' }, reviews: {} };
  assert.equal(gradeQuestion(q, s).points, 2);
  for (const value of ['NPM install buffer', 'npm\ninstall buffer', 'npm install buffer && env', 'npm uninstall buffer']) { s.answers[q.id] = value; assert.equal(gradeQuestion(q, s).pending, true); }
});
test('legacy sessions without reviews retain every answer and can be scored', () => {
  const s = makeSession(data.QUESTIONS, data.COMMANDS); delete s.reviews;
  for (const q of s.questions) s.answers[q.id] = q.correct;
  assert.equal(scoreSession(JSON.parse(JSON.stringify(s))).total, 74);
});
test('topic mode stays within its bank and uses actual available counts', () => {
  for (const topic of ['BLE', 'BLE code', 'Sensors', 'Android', 'iOS', 'Environment', 'Commands']) {
    const s = makeSession(data.QUESTIONS, data.COMMANDS, 'practice', topic);
    assert.ok(s.questions.every(q => q.topic === topic));
    assert.ok(s.questions.length <= 10);
    assert.equal(new Set(s.questions.map(q => q.id)).size, s.questions.length);
  }
});
test('print question paper has 62 questions, 12 command blanks and no answer key; key has 62 sources', () => {
  const s = makeSession(data.QUESTIONS, data.COMMANDS);
  const paper = buildPrintMarkup(s, data.SOURCES), key = buildPrintMarkup(s, data.SOURCES, true);
  assert.equal((paper.match(/class="print-question"/g) || []).length, 62);
  assert.equal((paper.match(/class="answer-space"/g) || []).length, 12);
  assert.equal((paper.match(/class="print-answer"/g) || []).length, 0);
  assert.ok(paper.includes('74 points'));
  assert.equal((key.match(/class="print-reference"/g) || []).length, 62);
  assert.equal((key.match(/class="print-answer"/g) || []).length, 62);
});

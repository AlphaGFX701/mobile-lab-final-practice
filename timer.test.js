import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newTimer, elapsedTime, displayTime, formatTime, pauseTimer } from './timer.js';
test('running timers use wall clock through reload and pause preserves elapsed time', () => {
  const t = newTimer(); t.startedAt = 1000;
  const resumed = JSON.parse(JSON.stringify(t));
  assert.equal(elapsedTime(resumed, 11000), 10000);
  pauseTimer(resumed, 11000);
  assert.equal(elapsedTime(resumed, 99000), 10000);
  resumed.startedAt = 99000;
  assert.equal(elapsedTime(resumed, 101000), 12000);
});
test('countdown displays zero after expiration without losing elapsed practice time', () => {
  const t = newTimer(); t.mode = 'countdown'; t.duration = 60000; t.startedAt = 1000;
  assert.equal(displayTime(t, 31000), 30000);
  assert.equal(displayTime(t, 71000), 0);
  assert.equal(elapsedTime(t, 71000), 70000);
  assert.equal(formatTime(3661000), '01:01:01');
});

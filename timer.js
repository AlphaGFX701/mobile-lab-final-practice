export const newTimer = () => ({ mode: 'elapsed', duration: 60 * 60 * 1000, elapsed: 0, startedAt: null, expired: false });
export function elapsedTime(timer, now = Date.now()) {
  if (!timer) return 0;
  return Math.max(0, (timer.elapsed || 0) + (timer.startedAt == null ? 0 : Math.max(0, now - timer.startedAt)));
}
export function displayTime(timer, now = Date.now()) {
  const elapsed = elapsedTime(timer, now);
  return timer.mode === 'countdown' ? Math.max(0, timer.duration - elapsed) : elapsed;
}
export function formatTime(ms) {
  const seconds = Math.floor(Math.max(0, ms) / 1000);
  return `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(Math.floor(seconds / 60) % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
export function pauseTimer(timer, now = Date.now()) {
  timer.elapsed = elapsedTime(timer, now); timer.startedAt = null;
}

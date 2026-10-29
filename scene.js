import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function disposeObject(root) {
  const textures = new Set(), materials = new Set(), geometries = new Set();
  root.traverse(object => { if (object.geometry) geometries.add(object.geometry); for (const material of [object.material].flat().filter(Boolean)) { materials.add(material); Object.values(material).forEach(value => { if (value?.isTexture) textures.add(value); }); } });
  textures.forEach(t => t.dispose()); materials.forEach(m => m.dispose()); geometries.forEach(g => g.dispose());
}
function screenTexture() {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 1024;
  const c = canvas.getContext('2d'); c.fillStyle = '#101810'; c.fillRect(0, 0, 512, 1024);
  c.strokeStyle = '#33492b'; c.lineWidth = 2;
  for (let y = 120; y < 940; y += 60) { c.beginPath(); c.moveTo(40, y); c.lineTo(472, y); c.stroke(); }
  c.fillStyle = '#b5f36a'; c.font = '22px monospace'; c.fillText('MOBILE LAB', 44, 85);
  c.font = 'bold 110px monospace'; c.fillText('m/', 50, 345);
  c.font = '18px monospace'; c.fillText('SENSOR STUDIO', 48, 410);
  c.strokeStyle = '#b5f36a'; c.lineWidth = 4; c.beginPath();
  for (let x = 44; x < 470; x++) { const y = 590 + Math.sin(x / 36) * 42 * Math.sin(x / 120); x === 44 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
  c.font = '20px monospace'; c.fillText('50 + 12', 48, 790); c.fillText('FINAL EXAM / 74 PT', 48, 845);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
}
export function mountScene(stage, { modelUrl = '/smartphone.glb' } = {}) {
  const root = stage.closest('.visual'), status = root.querySelector('#model-status');
  const buttons = Object.fromEntries(['rotate-left', 'rotate-right', 'reset-model', 'motion-model', 'touch-model'].map(id => [id, root.querySelector(`#${id}`)]));
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
  catch { status.textContent = 'ภาพสำรอง · อุปกรณ์นี้ไม่รองรับ 3D'; return () => {}; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  stage.appendChild(renderer.domElement);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(33, 1, .01, 10);
  camera.position.set(.19, .06, .54);
  scene.add(new THREE.HemisphereLight(0xd8f4c4, 0x10150f, 2.3));
  const key = new THREE.DirectionalLight(0xffffff, 3); key.position.set(2, 4, 3); scene.add(key);
  const rim = new THREE.DirectionalLight(0xb5f36a, 5); rim.position.set(-2, 1, -1); scene.add(rim);
  const controls = new OrbitControls(camera, renderer.domElement); controls.enableZoom = false; controls.enablePan = false; controls.enableDamping = false; controls.update(); controls.saveState();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)'), coarse = matchMedia('(pointer: coarse)');
  let alive = true, visible = true, paused = reduced.matches, model, raf = 0, last = 0;
  const setTouch = enabled => { controls.enabled = enabled; renderer.domElement.style.touchAction = enabled ? 'none' : 'pan-y'; buttons['touch-model'].textContent = enabled ? 'ปิดการลาก' : 'เปิดการลาก'; buttons['touch-model'].setAttribute('aria-pressed', enabled); };
  setTouch(!coarse.matches); buttons['touch-model'].hidden = !coarse.matches;
  const draw = () => { if (alive && visible && !document.hidden) renderer.render(scene, camera); };
  function tick(time) { raf = 0; if (!alive || !visible || document.hidden || paused || !model) return; model.rotation.y += Math.min((time - last) / 1000 || 0, .05) * .12; last = time; draw(); raf = requestAnimationFrame(tick); }
  function schedule() { cancelAnimationFrame(raf); raf = 0; last = performance.now(); draw(); if (alive && visible && !document.hidden && !paused && model) raf = requestAnimationFrame(tick); }
  function setPaused(value) { paused = value; buttons['motion-model'].textContent = value ? 'เริ่มหมุน' : 'หยุดหมุน'; buttons['motion-model'].setAttribute('aria-pressed', value); schedule(); }
  const resize = () => { if (!alive || !stage.clientWidth || !stage.clientHeight) return; renderer.setSize(stage.clientWidth, stage.clientHeight, false); camera.aspect = stage.clientWidth / stage.clientHeight; camera.updateProjectionMatrix(); draw(); };
  const ro = new ResizeObserver(resize); ro.observe(stage); resize();
  const io = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }); io.observe(stage);
  const visibility = () => schedule(); const preference = () => setPaused(reduced.matches);
  document.addEventListener('visibilitychange', visibility); reduced.addEventListener('change', preference);
  controls.addEventListener('change', draw); controls.addEventListener('start', () => setPaused(true));
  buttons['rotate-left'].onclick = () => { if (model) { setPaused(true); model.rotation.y -= .3; draw(); } };
  buttons['rotate-right'].onclick = () => { if (model) { setPaused(true); model.rotation.y += .3; draw(); } };
  buttons['reset-model'].onclick = () => { controls.reset(); if (model) model.rotation.set(0, 0, -.17); draw(); };
  buttons['motion-model'].onclick = () => setPaused(!paused);
  buttons['touch-model'].onclick = () => setTouch(!controls.enabled);
  const fail = () => { if (!alive) return; paused = true; root.querySelector('.model-fallback').hidden = false; renderer.domElement.hidden = true; status.textContent = 'ภาพสำรอง · ไม่สามารถแสดงโมเดล 3D ได้'; Object.values(buttons).forEach(b => b.disabled = true); cancelAnimationFrame(raf); };
  renderer.domElement.addEventListener('webglcontextlost', fail);
  new GLTFLoader().load(modelUrl, gltf => {
    if (!alive) { disposeObject(gltf.scene); return; }
    const phone = gltf.scene;
    phone.traverse(object => { if (!object.isMesh) return; const mats = [object.material].flat(); mats.forEach(material => {
      if (material.name.includes('tile')) { object.visible = false; return; }
      if (material.map) { material.map.dispose(); material.map = null; }
      material.color.set(material.name.includes('body') ? '#343c34' : '#101810'); material.metalness = material.name.includes('body') ? .65 : .15; material.roughness = .3;
    }); });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(.057, .12), new THREE.MeshBasicMaterial({ map: screenTexture(), side: THREE.DoubleSide })); screen.rotation.x = -Math.PI / 2; screen.position.y = .0106; phone.add(screen);
    const bounds = new THREE.Box3().setFromObject(phone), size = bounds.getSize(new THREE.Vector3()); phone.position.sub(bounds.getCenter(new THREE.Vector3()));
    const oriented = new THREE.Group(); oriented.add(phone); oriented.rotation.x = Math.PI / 2;
    model = new THREE.Group(); model.add(oriented); model.scale.setScalar(.32 / Math.max(size.x, size.y, size.z)); model.rotation.z = -.17; scene.add(model);
    root.querySelector('.model-fallback').hidden = true; Object.values(buttons).forEach(b => b.disabled = false); status.textContent = coarse.matches ? 'แตะเปิดการลากเพื่อหมุนโมเดล' : 'ลากเพื่อหมุน · หรือใช้ปุ่มควบคุม'; setPaused(paused); resize();
  }, undefined, fail);
  return () => { alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', visibility); reduced.removeEventListener('change', preference); controls.dispose(); disposeObject(scene); renderer.dispose(); renderer.domElement.remove(); };
}

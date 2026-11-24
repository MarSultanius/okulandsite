/* 3D шаңырақ — процедурная модель купола юрты на Three.js (подход img2threejs: модель собрана кодом из примитивов).
   Запускается только когда блок виден, на паузе вне экрана, статичен при prefers-reduced-motion. */
import * as THREE from '../vendor/three.module.min.js';

const host = document.querySelector('[data-shanyrak3d]');
if (host) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { renderer = null; }
  if (renderer) {
    host.classList.add('has-3d');
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 2.6, 7.2);
    camera.lookAt(0, 0.2, 0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x0a3d66, 1.6));
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 5, 4); scene.add(key);
    const rim = new THREE.DirectionalLight(0x9fe0ff, 1.2); rim.position.set(-4, 2, -3); scene.add(rim);

    const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.05 });
    const wood = new THREE.MeshStandardMaterial({ color: 0xF6D9A8, roughness: 0.55 });
    const blue = new THREE.MeshStandardMaterial({ color: 0x0b6fb8, roughness: 0.4 });

    const model = new THREE.Group();
    // обод шаңырақа
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.11, 24, 96), white);
    ring.rotation.x = Math.PI / 2; model.add(ring);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.05, 16, 96), blue);
    ring2.rotation.x = Math.PI / 2; ring2.position.y = -0.12; model.add(ring2);
    // перекрещенные дуги (күлдіреуіш): по три в двух направлениях
    const arcGeo = (r) => new THREE.TorusGeometry(r, 0.055, 12, 64, Math.PI);
    [-0.45, 0, 0.45].forEach((off) => {
      for (const ang of [0, Math.PI / 2]) {
        const r = Math.sqrt(1.25 * 1.25 - off * off);
        const a = new THREE.Mesh(arcGeo(r), white);
        a.scale.y = 0.55;
        a.rotation.y = ang;
        if (ang === 0) a.position.z = off; else a.position.x = off;
        model.add(a);
      }
    });
    // уықтар — жерди купола, расходятся вниз
    const poles = new THREE.Group();
    const N = 28;
    const up = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      const top = new THREE.Vector3(Math.cos(t) * 1.3, -0.05, Math.sin(t) * 1.3);
      const bot = new THREE.Vector3(Math.cos(t) * 2.7, -1.35, Math.sin(t) * 2.7);
      const dir = bot.clone().sub(top);
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.045, dir.length(), 8), wood);
      p.position.copy(top).add(bot).multiplyScalar(0.5);
      p.quaternion.setFromUnitVectors(up, dir.normalize());
      poles.add(p);
    }
    model.add(poles);
    model.rotation.x = 0.18;
    scene.add(model);

    const size = () => {
      const w = host.clientWidth, h = host.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    size(); addEventListener('resize', size);

    let mx = 0, my = 0;
    host.addEventListener('pointermove', (e) => {
      const r = host.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5; my = (e.clientY - r.top) / r.height - 0.5;
    });
    let visible = false, raf = 0;
    const tick = (t) => {
      model.rotation.y = t * 0.00025;
      model.rotation.x += ((0.18 + my * 0.3) - model.rotation.x) * 0.05;
      model.rotation.z += ((mx * 0.2) - model.rotation.z) * 0.05;
      renderer.render(scene, camera);
      if (visible) raf = requestAnimationFrame(tick);
    };
    if (reduce) { renderer.render(scene, camera); }
    else {
      new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) raf = requestAnimationFrame(tick);
      }).observe(host);
    }
    renderer.render(scene, camera);
  }
}

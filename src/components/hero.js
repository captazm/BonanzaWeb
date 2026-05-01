import { t } from '../i18n.js';

export function renderHero() {
  return `
    <section class="hero" id="hero">
      <canvas id="hero-three-canvas"></canvas>

      <div class="hero-content">
        <div class="hero-text">
          <div class="hero-badge">
            <span class="hero-badge-dot"></span>
            ${t('hero_badge')}
          </div>
          <h1>
            ${t('hero_title_1')}<br />
            <span class="highlight">${t('hero_title_2')}</span>
          </h1>
          <p class="hero-description">${t('hero_description')}</p>
          <div class="hero-cta">
            <a href="#products" class="btn btn-primary">
              ${t('hero_cta_explore')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#about" class="btn btn-secondary">${t('hero_cta_story')}</a>
          </div>
          <div class="hero-stats">
            <div class="stat"><div class="stat-value">6+</div><div class="stat-label">${t('hero_stat_years')}</div></div>
            <div class="stat"><div class="stat-value">8+</div><div class="stat-label">${t('hero_stat_models')}</div></div>
            <div class="stat"><div class="stat-value">1000+</div><div class="stat-label">${t('hero_stat_customers')}</div></div>
          </div>
        </div>
      </div>

      <div id="hero-device-info">
        <div id="hero-device-pill">
          <span id="hero-device-name">BOOX Note Air 5C</span>
          <span class="hero-pill-sep">·</span>
          <span id="hero-device-price">2,322,000 MMK</span>
        </div>
        <div class="hero-dot-nav" id="hero-dot-nav">
          <button class="hero-dot active" data-idx="0"></button>
          <button class="hero-dot" data-idx="1"></button>
          <button class="hero-dot" data-idx="2"></button>
        </div>
      </div>

      <div class="hero-drag-hint">drag · scroll to zoom</div>
    </section>
  `;
}

export function initHero() {
  // ── Config: ပုံနဲ့ ဈေးနှုန်း ဒီနေရာမှာပဲ ပြောင်းရုံ ──
  const devices = [
    { name: 'BOOX Note Air 5C', price: '2,322,000 MMK', url: '/images/products/noteair5c.jpg',  aspect: 0.72 },
    { name: 'BOOX Go 10.3',     price: '1,806,000 MMK', url: '/images/products/go103.jpg',      aspect: 0.82 },
    { name: 'BOOX Palma 2 Pro', price: '1,763,000 MMK', url: '/images/products/palma2pro.png',  aspect: 0.52 },
  ];
  // ──────────────────────────────────────────────────────

  const canvas = document.getElementById('hero-three-canvas');
  if (!canvas) return;

  if (window.THREE) { buildScene(canvas, devices); return; }
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  script.onload = () => buildScene(canvas, devices);
  document.head.appendChild(script);
}

function buildScene(canvas, devices) {
  const THREE = window.THREE;
  const section = document.getElementById('hero');
  const W = () => section.clientWidth;
  const H = () => section.clientHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W(), H());
  renderer.setClearColor(0x07060f, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W() / H(), 0.1, 100);
  camera.position.set(0, 0, 7);

  // Lights
  scene.add(new THREE.AmbientLight(0x6b21a8, 0.8));
  const pl1 = new THREE.PointLight(0xa855f7, 4, 20);
  pl1.position.set(4, 3, 4); scene.add(pl1);
  const pl2 = new THREE.PointLight(0x06d6a0, 2, 15);
  pl2.position.set(-3, -2, 3); scene.add(pl2);
  const dl = new THREE.DirectionalLight(0xffffff, 0.5);
  dl.position.set(0, 2, 5); scene.add(dl);

  // Main device group
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);
  mainGroup.position.set(W() < 768 ? 0 : 1.6, 0, 0);

  // Halo glow behind device
  const haloMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.07 });
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.8), haloMat);
  halo.position.z = -0.15;
  mainGroup.add(halo);

  // Frame border
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0xa855f7, emissive: 0xa855f7, emissiveIntensity: 0.5, transparent: true, opacity: 0.2
  });
  const frame = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 2.3), frameMat);
  frame.position.z = -0.05;
  mainGroup.add(frame);

  // Load device images
  const loader = new THREE.TextureLoader();
  const planes = [];

  devices.forEach((d, i) => {
    const h = 2.1, w = h * d.aspect;
    loader.load(d.url, tex => {
      tex.minFilter = THREE.LinearFilter;
      const mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.4, metalness: 0.1 });
      if (i !== 0) mat.opacity = 0;
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
      mesh.visible = i === 0;
      mainGroup.add(mesh);
      planes[i] = mesh;
    }, undefined, () => {
      const mat = new THREE.MeshStandardMaterial({ color: 0x2a1040, metalness: 0.7, roughness: 0.3, transparent: true });
      if (i !== 0) mat.opacity = 0;
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w * 0.9, h * 0.9, 0.06), mat);
      mesh.visible = i === 0;
      mainGroup.add(mesh);
      planes[i] = mesh;
    });
  });

  // Orbit rings
  function makeRing(r, tube, col, op, rx, ry, rz) {
    const m = new THREE.Mesh(
      new THREE.TorusGeometry(r, tube, 8, 90),
      new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.4, transparent: true, opacity: op })
    );
    m.rotation.set(rx, ry, rz);
    return m;
  }
  const ring1 = makeRing(2.4, 0.007, 0xa855f7, 0.4, 1.2, 0.3, 0);
  const ring2 = makeRing(3.2, 0.004, 0x7c3aed, 0.2, 1.0, 0.0, 0.6);
  scene.add(ring1); scene.add(ring2);

  // Floating wireframe cubes
  const cubes = [];
  [[-2.6,-1.0,0.3,0.10,0xa855f7],[-2.2,1.4,-0.2,0.07,0x06d6a0],[2.8,-1.5,0.1,0.08,0xc084fc],[2.4,1.6,-0.3,0.06,0x7c3aed]].forEach(([x,y,z,s,c]) => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(s,s,s),
      new THREE.MeshStandardMaterial({ color:c, emissive:c, emissiveIntensity:0.8, transparent:true, opacity:0.6, wireframe:true })
    );
    m.position.set(x,y,z); scene.add(m);
    cubes.push({ mesh:m, ry:(Math.random()-.5)*.018, rx:(Math.random()-.5)*.012, iy:y, fs:Math.random()*.02+.01 });
  });

  // Particles
  const pN = 220, pPos = new Float32Array(pN*3), pV = [];
  for (let i = 0; i < pN; i++) {
    pPos[i*3]=(Math.random()-.5)*14; pPos[i*3+1]=(Math.random()-.5)*9; pPos[i*3+2]=(Math.random()-.5)*7;
    pV.push({ x:(Math.random()-.5)*.002, y:(Math.random()-.5)*.002 });
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color:0xa855f7, size:0.035, transparent:true, opacity:0.65 }));
  scene.add(particles);

  // UI refs
  const nameEl  = document.getElementById('hero-device-name');
  const priceEl = document.getElementById('hero-device-price');
  const dots    = document.querySelectorAll('.hero-dot');
  let current = 0, transitioning = false, autoTimer = null;

  function switchDevice(idx) {
    if (transitioning || idx === current || !planes[idx]) return;
    transitioning = true;
    clearInterval(autoTimer);
    const old = planes[current], next = planes[idx];
    let fo = 0;
    const outInt = setInterval(() => {
      fo += 0.1;
      if (old?.material) old.material.opacity = Math.max(0, 1 - fo);
      if (fo >= 1) {
        clearInterval(outInt);
        if (old) old.visible = false;
        current = idx;
        if (nameEl)  nameEl.textContent  = devices[idx].name;
        if (priceEl) priceEl.textContent = devices[idx].price;
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        frame.scale.set((2.1 * devices[idx].aspect + 0.15) / 1.7, 1, 1);
        if (next) { next.material.opacity = 0; next.visible = true; }
        let fi = 0;
        const inInt = setInterval(() => {
          fi += 0.1;
          if (next?.material) next.material.opacity = Math.min(1, fi);
          if (fi >= 1) { clearInterval(inInt); transitioning = false; startAuto(); }
        }, 20);
      }
    }, 20);
  }

  function startAuto() { autoTimer = setInterval(() => switchDevice((current+1) % devices.length), 3200); }
  setTimeout(startAuto, 3200);

  dots.forEach(dot => dot.addEventListener('click', () => switchDevice(parseInt(dot.dataset.idx))));

  // Drag & parallax
  let drag=false, px=0, py=0, rotX=0.08, rotY=-0.25, mxN=0, myN=0;
  canvas.addEventListener('mousedown', e => { drag=true; px=e.clientX; py=e.clientY; });
  window.addEventListener('mouseup', () => { drag=false; });
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mxN = ((e.clientX-r.left)/r.width-.5)*2;
    myN = -((e.clientY-r.top)/r.height-.5)*2;
    if (drag) { rotY+=(e.clientX-px)*.006; rotX+=(e.clientY-py)*.006; px=e.clientX; py=e.clientY; }
  });
  canvas.addEventListener('wheel', e => {
    camera.position.z = Math.max(3, Math.min(10, camera.position.z + e.deltaY*.01));
  }, { passive: true });
  let tpx=0, tpy=0;
  canvas.addEventListener('touchstart', e => { tpx=e.touches[0].clientX; tpy=e.touches[0].clientY; });
  canvas.addEventListener('touchmove', e => {
    rotY+=(e.touches[0].clientX-tpx)*.006; rotX+=(e.touches[0].clientY-tpy)*.006;
    tpx=e.touches[0].clientX; tpy=e.touches[0].clientY;
  });

  // Animate loop
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.012;
    mainGroup.rotation.y = rotY + Math.sin(t*.4)*.06 + mxN*.05;
    mainGroup.rotation.x = rotX + Math.sin(t*.3)*.03 + myN*.03;
    mainGroup.position.y = Math.sin(t*.5)*.12;
    ring1.rotation.z += .003; ring2.rotation.y += .002;
    cubes.forEach(c => {
      c.mesh.rotation.x += c.rx; c.mesh.rotation.y += c.ry;
      c.mesh.position.y = c.iy + Math.sin(t*c.fs*5)*.15;
    });
    const p = pGeo.attributes.position.array;
    for (let i = 0; i < pN; i++) {
      p[i*3]+=pV[i].x; p[i*3+1]+=pV[i].y;
      if (Math.abs(p[i*3])>7) pV[i].x*=-1;
      if (Math.abs(p[i*3+1])>4.5) pV[i].y*=-1;
    }
    pGeo.attributes.position.needsUpdate = true;
    particles.rotation.y += .0005;
    pl1.intensity = 4 + Math.sin(t*1.5)*.6;
    halo.material.opacity = 0.06 + Math.sin(t*2)*.02;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(W(), H());
    camera.aspect = W() / H();
    camera.updateProjectionMatrix();
    mainGroup.position.x = W() < 768 ? 0 : 1.6;
  });
}

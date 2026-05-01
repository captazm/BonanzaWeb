import { t } from '../i18n.js';

export function renderHero() {
  return `
    <section class="hero" id="hero">
      <canvas id="hero-space-canvas" style="position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;"></canvas>
      <div class="hero-bg-orb hero-orb-1"></div>
      <div class="hero-bg-orb hero-orb-2"></div>
      <div class="hero-particles" id="hero-particles"></div>

      <div class="hero-inner">
        <div class="hero-text">
          <div class="hero-badge">
            <span class="hero-badge-dot"></span>
            <span>${t('hero_badge')}</span>
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

        <div class="hero-device-showcase">
          <div class="hero-device-glow"></div>
          <div class="hero-device-ring hero-ring-1"></div>
          <div class="hero-device-ring hero-ring-2"></div>

          <div class="hero-device-slider" id="hero-slider">
            <div class="hero-device-slide active" data-idx="0">
              <img src="/images/products/noteair5c.png" alt="BOOX Note Air 5C" />
            </div>
            <div class="hero-device-slide" data-idx="1">
              <img src="/images/products/go103.png" alt="BOOX Go 10.3" />
            </div>
            <div class="hero-device-slide" data-idx="2">
              <img src="/images/products/palma2pro.png" alt="BOOX Palma 2 Pro" />
            </div>
          </div>

          <div class="hero-device-info-card" id="hero-info-card">
            <div class="hero-info-name" id="hero-info-name">BOOX Note Air 5C</div>
            <div class="hero-info-price" id="hero-info-price">2,322,000 MMK</div>
          </div>

          <div class="hero-dot-nav">
            <button class="hero-dot active" data-idx="0"></button>
            <button class="hero-dot" data-idx="1"></button>
            <button class="hero-dot" data-idx="2"></button>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initHero() {
  // ── Milky Way Space Background ──────────────────────────────
  const spaceCanvas = document.getElementById('hero-space-canvas');
  if (spaceCanvas) {
    const ctx = spaceCanvas.getContext('2d');
    let stars = [], shooters = [], t = 0;

    function initSpace() {
      spaceCanvas.width  = spaceCanvas.offsetWidth;
      spaceCanvas.height = spaceCanvas.offsetHeight;
      const W = spaceCanvas.width, H = spaceCanvas.height;
      stars = [];
      const count = window.innerWidth < 768 ? 120 : 250;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.4 + 0.2,
          a: Math.random() * 0.85 + 0.15,
          speed: Math.random() * 1.8 + 0.4,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function spawnShooter() {
      if (shooters.length > 3) return;
      const W = spaceCanvas.width;
      shooters.push({
        x: Math.random() * W * 0.7,
        y: Math.random() * spaceCanvas.height * 0.45,
        vx: 5 + Math.random() * 4,
        vy: 2 + Math.random() * 2.5,
        len: 90 + Math.random() * 70,
        life: 1,
      });
    }

    function drawSpace() {
      const W = spaceCanvas.width, H = spaceCanvas.height;
      ctx.clearRect(0, 0, W, H);

      // Deep space base
      ctx.fillStyle = '#04030a';
      ctx.fillRect(0, 0, W, H);

      // Milky Way band
      const band = ctx.createLinearGradient(0, H * 0.15, W, H * 0.85);
      band.addColorStop(0,   'transparent');
      band.addColorStop(0.2, 'rgba(90,50,150,0.05)');
      band.addColorStop(0.45,'rgba(110,70,180,0.09)');
      band.addColorStop(0.6, 'rgba(80,40,140,0.06)');
      band.addColorStop(1,   'transparent');
      ctx.fillStyle = band;
      ctx.fillRect(0, 0, W, H);

      // Nebula glow (purple, right side)
      const neb = ctx.createRadialGradient(W * 0.75, H * 0.4, 0, W * 0.75, H * 0.4, W * 0.35);
      neb.addColorStop(0,   'rgba(120,40,200,0.07)');
      neb.addColorStop(0.5, 'rgba(80,20,160,0.04)');
      neb.addColorStop(1,   'transparent');
      ctx.fillStyle = neb;
      ctx.fillRect(0, 0, W, H);

      // Second nebula (blue-ish, left)
      const neb2 = ctx.createRadialGradient(W * 0.15, H * 0.65, 0, W * 0.15, H * 0.65, W * 0.25);
      neb2.addColorStop(0,   'rgba(30,60,180,0.05)');
      neb2.addColorStop(1,   'transparent');
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, W, H);

      // Twinkling stars
      stars.forEach(s => {
        const alpha = s.a * (0.55 + 0.45 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      // Shooting stars
      if (Math.random() < 0.008) spawnShooter();
      shooters = shooters.filter(s => {
        s.x += s.vx; s.y += s.vy; s.life -= 0.016;
        if (s.life <= 0) return false;
        const angle = Math.atan2(s.vy, s.vx);
        const tail = ctx.createLinearGradient(
          s.x, s.y,
          s.x - Math.cos(angle) * s.len,
          s.y - Math.sin(angle) * s.len
        );
        tail.addColorStop(0, `rgba(255,255,255,${s.life * 0.9})`);
        tail.addColorStop(0.4, `rgba(180,120,255,${s.life * 0.4})`);
        tail.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(angle) * s.len, s.y - Math.sin(angle) * s.len);
        ctx.strokeStyle = tail;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        return true;
      });

      t += 0.018;
      requestAnimationFrame(drawSpace);
    }

    initSpace();
    drawSpace();
    window.addEventListener('resize', initSpace);
  }
  // ─────────────────────────────────────────────────────────────
  const devices = [
    { name: 'BOOX Note Air 5C', price: '2,322,000 MMK' },
    { name: 'BOOX Go 10.3',     price: '1,806,000 MMK' },
    { name: 'BOOX Palma 2 Pro', price: '1,763,000 MMK' },
  ];

  const slides  = document.querySelectorAll('.hero-device-slide');
  const dots    = document.querySelectorAll('.hero-dot');
  const nameEl  = document.getElementById('hero-info-name');
  const priceEl = document.getElementById('hero-info-price');
  const card    = document.getElementById('hero-info-card');
  let current = 0, autoTimer = null;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = idx;
    slides[current].classList.add('active');
    dots[current].classList.add('active');

    card.classList.add('info-fade');
    setTimeout(() => {
      nameEl.textContent  = devices[idx].name;
      priceEl.textContent = devices[idx].price;
      card.classList.remove('info-fade');
    }, 200);
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo((current + 1) % devices.length), 3000);
  }
  startAuto();

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(autoTimer);
      goTo(parseInt(dot.dataset.idx));
      startAuto();
    });
  });

  // Particles — space-float effect
  const container = document.getElementById('hero-particles');
  if (container) {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 15 : 50;
    const styles = ['', 'particle-style-2', 'particle-style-3', 'particle-style-4'];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      const style = styles[Math.floor(Math.random() * styles.length)];
      p.className = 'hero-particle' + (style ? ' ' + style : '');
      const size = Math.random() * 4 + 1;
      p.style.cssText = `
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        width:${size}px;
        height:${size}px;
        animation-delay:${Math.random()*8}s;
        animation-duration:${Math.random()*7+5}s;
        opacity:${Math.random()*0.6+0.15};
      `;
      container.appendChild(p);
    }
  }
}

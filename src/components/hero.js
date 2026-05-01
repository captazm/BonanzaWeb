import { t } from '../i18n.js';

export function renderHero() {
  return `
    <section class="hero" id="hero">
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
    const styles = ['', 'particle-style-2', 'particle-style-3', 'particle-style-4'];
    for (let i = 0; i < 80; i++) {
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

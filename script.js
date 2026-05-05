// PRO-1 RENO — script.js

document.addEventListener('DOMContentLoaded', function () {

  /* ── Mobile Menu ─────────────────────────────────── */
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks   = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    document.querySelectorAll('.nav-links a').forEach(a =>
      a.addEventListener('click', () => navLinks.classList.remove('active'))
    );
  }

  /* ── Smooth scroll ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const t = document.querySelector(this.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ── Sawdust canvas particles ────────────────────── */
  (function () {
    const canvas = document.createElement('canvas');
    canvas.id = 'sawdust-canvas';
    Object.assign(canvas.style, {
      position: 'fixed', inset: '0', width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: '0', opacity: '0.45'
    });
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let W, H, particles;
    const COLS = [
      'rgba(210,175,120,', 'rgba(195,155,95,', 'rgba(175,130,75,',
      'rgba(230,200,155,', 'rgba(160,115,65,', 'rgba(220,190,140,',
    ];
    const rand = (a, b) => a + Math.random() * (b - a);

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function make() {
      return {
        x: rand(0, W), y: rand(0, H),
        vx: rand(-0.15, 0.15), vy: rand(0.1, 0.45),
        angle: rand(0, Math.PI * 2), va: rand(-0.01, 0.01),
        len: rand(4, 12), w: rand(1, 2.5),
        col: COLS[Math.floor(Math.random() * COLS.length)],
        alpha: rand(0.2, 0.65), curve: rand(-0.35, 0.35),
        wb: rand(0, Math.PI * 2), wbs: rand(0.005, 0.018),
      };
    }

    function init() {
      const isGallery = !!document.querySelector('.gallery-grid');
      const count = Math.min(Math.floor((W * H) / (isGallery ? 7000 : 3500)), isGallery ? 60 : 160);
      particles = Array.from({ length: count }, make);
    }

    let last = 0;
    function draw(ts) {
      requestAnimationFrame(draw);
      if (ts - last < 33) return;
      last = ts;
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.wb += p.wbs;
        p.x  += p.vx + Math.sin(p.wb) * 0.1;
        p.y  += p.vy;
        p.angle += p.va;
        if (p.y > H + 16) { p.y = -16; p.x = rand(0, W); }
        if (p.x < -16)    p.x = W + 16;
        if (p.x > W + 16) p.x = -16;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        ctx.moveTo(-p.len / 2, 0);
        ctx.quadraticCurveTo(0, p.curve * p.len, p.len / 2, 0);
        ctx.lineWidth   = p.w;
        ctx.strokeStyle = p.col + p.alpha + ')';
        ctx.lineCap     = 'round';
        ctx.stroke();
        ctx.restore();
      }
    }

    resize();
    init();
    requestAnimationFrame(draw);
    window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
  })();

  /* ── Hero paint drip ─────────────────────────────── */
  const hero = document.querySelector('.hero');
  if (hero) {
    const drip = document.createElement('div');
    drip.className = 'hero-drip';
    drip.innerHTML = `<svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,0 L0,10 Q60,40 120,15 Q180,0 240,20 Q300,38 360,12 Q420,0 480,22 Q540,42 600,14 Q660,0 720,24 Q780,44 840,16 Q900,0 960,20 Q1020,40 1080,12 Q1140,0 1200,22 Q1260,42 1320,14 Q1380,0 1440,18 L1440,0 Z" fill="#ffffff"/>
    </svg>`;
    hero.appendChild(drip);
  }

  /* ── Section dividers & ruler ────────────────────── */
  const servicesPreview = document.querySelector('.services-preview');
  if (servicesPreview) {
    const d = document.createElement('div');
    d.className = 'hazard-divider';
    servicesPreview.parentNode.insertBefore(d, servicesPreview);
  }
  const ctaSection = document.querySelector('.cta-section');
  if (ctaSection) {
    const d = document.createElement('div');
    d.className = 'hazard-divider';
    ctaSection.parentNode.insertBefore(d, ctaSection);
  }
  const footer = document.querySelector('footer');
  if (footer) {
    const r = document.createElement('div');
    r.className = 'ruler-border';
    footer.parentNode.insertBefore(r, footer);
  }

  /* ── Scroll reveal ───────────────────────────────── */
  document.querySelectorAll(
    '.service-card, .feature, .value-card, .credential-item, .service-card-pro, .process-step, .commitment-item'
  ).forEach(el => {
    el.classList.add('scroll-reveal');
    new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { el.classList.add('visible'); obs.disconnect(); }
      });
    }, { threshold: 0.1 }).observe(el);
  });

  /* ── Heading reveal ──────────────────────────────── */
  document.querySelectorAll(
    '.services-preview h2, .why-choose-us h2, .gallery-section h1, .process-title, .values-title, .credentials-title'
  ).forEach(el => {
    new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { el.classList.add('reveal-active'); obs.disconnect(); }
      });
    }, { threshold: 0.3 }).observe(el);
  });

  /* ── Stat counters ───────────────────────────────── */
  document.querySelectorAll('.stat-number').forEach(el => {
    new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        obs.disconnect();
        const raw = el.textContent.trim();
        const num = parseFloat(raw.replace(/[^\d.]/g, ''));
        if (isNaN(num)) return;
        const hasStar = raw.includes('★'), hasPct = raw.includes('%');
        const start = /^\d{4}$/.test(raw) ? num - 8 : 0;
        const t0 = performance.now();
        (function tick(now) {
          const p = Math.min((now - t0) / 1400, 1);
          const v = start + (num - start) * (1 - Math.pow(1 - p, 3));
          el.textContent = hasStar ? v.toFixed(1) + '★' : hasPct ? Math.round(v) + '%' : Math.round(v);
          if (p < 1) requestAnimationFrame(tick); else el.textContent = raw;
        })(t0);
      });
    }, { threshold: 0.5 }).observe(el);
  });

  /* ── Contact form ────────────────────────────────── */
  const form       = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  if (form && typeof emailjs !== 'undefined') {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Honeypot check — bots fill hidden fields, real users don't
      if (form.querySelector('[name="_honeypot"]') && form.querySelector('[name="_honeypot"]').value) return;
      const btn = form.querySelector('button[type="submit"]'), orig = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      formStatus.innerHTML = '';
      emailjs.sendForm('service_m1twssd', 'template_vlq9xyg', this)
        .then(
          () => {
            formStatus.innerHTML = '<div class="form-success" style="display:block;">Thank you! We\'ll get back to you within 24 hours.</div>';
            form.reset();
            setTimeout(() => formStatus.innerHTML = '', 5000);
          },
          () => {
            formStatus.innerHTML = '<div class="form-error" style="display:block;">Oops! Please call us at (647) 719-0089.</div>';
            setTimeout(() => formStatus.innerHTML = '', 5000);
          }
        )
        .finally(() => { btn.textContent = orig; btn.disabled = false; });
    });
  }

  /* ════════════════════════════════════════════════════
     GALLERY LIGHTBOX — swipe, arrow buttons, keyboard
  ════════════════════════════════════════════════════ */
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;

  // Wrap each image in .img-wrap for the hover overlay effect
  Array.from(galleryGrid.querySelectorAll('img')).forEach(img => {
    if (img.parentElement.classList.contains('img-wrap')) return;
    const wrap = document.createElement('div');
    wrap.className = 'img-wrap';
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
  });

  const imgs = Array.from(galleryGrid.querySelectorAll('img'));
  if (!imgs.length) return;

  /* ── Lightbox CSS ────────────────────────────────── */
  const lbStyle = document.createElement('style');
  lbStyle.textContent = `
    #lb {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(8,8,8,.96);
      display: none; flex-direction: column;
      align-items: center; justify-content: center;
      overflow: hidden;
      opacity: 0; transition: opacity .22s ease;
    }
    #lb.open { opacity: 1; }

    #lb-track {
      position: relative; flex: 1; width: 100%;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden; user-select: none; cursor: grab;
    }
    #lb-track:active { cursor: grabbing; }

    #lb-img {
      max-width: 92vw; max-height: 80vh;
      object-fit: contain; display: block;
      border-bottom: 3px solid #d95f1a;
      box-shadow: 0 0 50px rgba(217,95,26,.3);
      pointer-events: none;
      will-change: transform;
    }
    #lb-img.sl { animation: sl .3s cubic-bezier(.22,1,.36,1) both; }
    #lb-img.sr { animation: sr .3s cubic-bezier(.22,1,.36,1) both; }
    @keyframes sl { from{opacity:0;transform:translateX(55px) scale(.97)} to{opacity:1;transform:none} }
    @keyframes sr { from{opacity:0;transform:translateX(-55px) scale(.97)} to{opacity:1;transform:none} }

    #lb-caption {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 13px; font-weight: 600; letter-spacing: .12em;
      text-transform: uppercase; color: rgba(255,255,255,.5);
      text-align: center; padding: 14px 20px 4px; max-width: 600px;
    }
    #lb-counter {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 13px; font-weight: 700; letter-spacing: .2em;
      color: #d95f1a; padding-bottom: 14px;
    }
    #lb-dots {
      display: flex; gap: 6px; padding-bottom: 22px;
      flex-wrap: wrap; justify-content: center; max-width: 80vw;
    }
    .lb-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: rgba(255,255,255,.2); cursor: pointer;
      transition: background .2s, transform .2s; flex-shrink: 0;
    }
    .lb-dot.on { background: #d95f1a; transform: scale(1.5); }

    .lb-arrow {
      position: absolute; top: 50%; transform: translateY(-50%);
      background: rgba(217,95,26,.85); border: none; color: #fff;
      width: 48px; height: 48px; display: flex;
      align-items: center; justify-content: center;
      cursor: pointer; z-index: 2;
      box-shadow: 4px 4px 0 rgba(0,0,0,.4);
      transition: background .2s;
    }
    .lb-arrow:hover { background: #b84d12; }
    #lb-prev { left: 16px; }
    #lb-next { right: 16px; }

    #lb-close {
      position: absolute; top: 14px; right: 14px;
      background: rgba(255,255,255,.08);
      border: 1px solid rgba(255,255,255,.15);
      color: #fff; width: 40px; height: 40px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; z-index: 3; transition: background .2s;
    }
    #lb-close:hover { background: rgba(217,95,26,.7); }

    #lb-hint {
      position: absolute; bottom: 84px;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 12px; letter-spacing: .15em; text-transform: uppercase;
      color: rgba(255,255,255,.28); pointer-events: none;
      animation: hf 2.8s ease .6s both;
    }
    @keyframes hf { 0%{opacity:0} 20%{opacity:1} 80%{opacity:1} 100%{opacity:0} }

    @media (max-width: 600px) {
      .lb-arrow { width: 38px; height: 38px; }
      #lb-prev  { left: 6px; }
      #lb-next  { right: 6px; }
      #lb-img   { max-width: 96vw; max-height: 72vh; }
    }
  `;
  document.head.appendChild(lbStyle);

  /* ── Build lightbox DOM ──────────────────────────── */
  const mkSvg = (pts) =>
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="${pts}"/></svg>`;

  const lb       = document.createElement('div');    lb.id       = 'lb';
  const track    = document.createElement('div');    track.id    = 'lb-track';
  const lbImg    = document.createElement('img');    lbImg.id    = 'lb-img';
  const cap      = document.createElement('div');    cap.id      = 'lb-caption';
  const ctr      = document.createElement('div');    ctr.id      = 'lb-counter';
  const dotsEl   = document.createElement('div');    dotsEl.id   = 'lb-dots';
  const prev     = document.createElement('button'); prev.id     = 'lb-prev'; prev.className = 'lb-arrow'; prev.innerHTML = mkSvg('15 18 9 12 15 6');
  const next     = document.createElement('button'); next.id     = 'lb-next'; next.className = 'lb-arrow'; next.innerHTML = mkSvg('9 18 15 12 9 6');
  const closeBtn = document.createElement('button'); closeBtn.id = 'lb-close';
  const hint     = document.createElement('div');    hint.id     = 'lb-hint'; hint.textContent = '← swipe to browse →';

  closeBtn.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  imgs.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'lb-dot';
    d.addEventListener('click', () => show(i, i > cur ? 'left' : 'right'));
    dotsEl.appendChild(d);
  });

  track.append(prev, lbImg, next, hint);
  lb.append(closeBtn, track, cap, ctr, dotsEl);
  document.body.appendChild(lb);

  /* ── State ───────────────────────────────────────── */
  let cur = 0, busy = false, hintShown = false;

  function updateUI() {
    dotsEl.querySelectorAll('.lb-dot').forEach((d, i) => d.classList.toggle('on', i === cur));
    const active = dotsEl.children[cur];
    if (active) active.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    ctr.textContent = `${cur + 1} / ${imgs.length}`;
  }

  function show(i, dir) {
    if (busy) return;
    busy = true;
    cur = (i + imgs.length) % imgs.length;
    lbImg.classList.remove('sl', 'sr');
    void lbImg.offsetWidth;
    lbImg.src = imgs[cur].src;
    lbImg.alt = imgs[cur].alt;
    if (dir === 'left')  lbImg.classList.add('sl');
    if (dir === 'right') lbImg.classList.add('sr');
    updateUI();
    setTimeout(() => busy = false, 320);
  }

  function openLb(i) {
    cur = i;
    lbImg.src = imgs[i].src;
    lbImg.alt = imgs[i].alt;
    lbImg.classList.remove('sl', 'sr');
    updateUI();
    document.body.style.overflow = 'hidden';
    lb.style.display = 'flex';
    requestAnimationFrame(() => lb.classList.add('open'));
    if (!hintShown && window.innerWidth < 768) {
      hintShown = true;
      hint.style.display = 'block';
      setTimeout(() => hint.style.display = 'none', 3200);
    } else {
      hint.style.display = 'none';
    }
  }

  function closeLb() {
    lb.classList.remove('open');
    setTimeout(() => { lb.style.display = 'none'; document.body.style.overflow = ''; }, 230);
  }

  /* ── Gallery click to open ───────────────────────── */
  imgs.forEach((img, i) => {
    const el = img.closest('.img-wrap') || img;
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => openLb(i));
  });

  /* ── Controls ────────────────────────────────────── */
  prev.addEventListener('click',     e => { e.stopPropagation(); show(cur - 1, 'right'); });
  next.addEventListener('click',     e => { e.stopPropagation(); show(cur + 1, 'left');  });
  closeBtn.addEventListener('click', closeLb);
  lb.addEventListener('click',       e => { if (e.target === lb) closeLb(); });

  document.addEventListener('keydown', e => {
    if (lb.style.display !== 'flex') return;
    if (e.key === 'ArrowLeft')  show(cur - 1, 'right');
    if (e.key === 'ArrowRight') show(cur + 1, 'left');
    if (e.key === 'Escape')     closeLb();
  });

  /* ── Touch swipe ─────────────────────────────────── */
  let tx = 0, ty = 0, tdx = 0;

  track.addEventListener('touchstart', e => {
    tx = e.touches[0].clientX;
    ty = e.touches[0].clientY;
    tdx = 0;
  }, { passive: true });

  track.addEventListener('touchmove', e => {
    tdx = e.touches[0].clientX - tx;
    const tdy = e.touches[0].clientY - ty;
    if (Math.abs(tdx) > Math.abs(tdy)) {
      e.preventDefault();
      lbImg.style.transform = `translateX(${tdx * 0.3}px)`;
    }
  }, { passive: false });

  track.addEventListener('touchend', () => {
    lbImg.style.transform = '';
    if (tdx < -50)     show(cur + 1, 'left');
    else if (tdx > 50) show(cur - 1, 'right');
    tdx = 0;
  }, { passive: true });

  /* ── Mouse drag to swipe ─────────────────────────── */
  track.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    const startX = e.clientX;

    function move(e) {
      lbImg.style.transform = `translateX(${(e.clientX - startX) * 0.25}px)`;
    }
    function up(e) {
      const dx = e.clientX - startX;
      lbImg.style.transform = '';
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      if (dx < -60)     show(cur + 1, 'left');
      else if (dx > 60) show(cur - 1, 'right');
    }
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  });

});
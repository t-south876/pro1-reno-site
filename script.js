// PRO-1 RENO — script.js

document.addEventListener('DOMContentLoaded', function () {

  /* ── Mobile Menu ─────────────────────────────────── */
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks   = document.querySelector('.nav-links');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
  }
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
  });

  /* ── Smooth scroll ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── Sawdust particles (throttled to 30fps) ──────── */
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
    const COLS = ['rgba(210,175,120,','rgba(195,155,95,','rgba(175,130,75,',
                  'rgba(230,200,155,','rgba(160,115,65,','rgba(220,190,140,'];
    const rand = (a, b) => a + Math.random() * (b - a);

    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

    function make() {
      return { x: rand(0,W), y: rand(0,H), vx: rand(-0.15,0.15), vy: rand(0.1,0.45),
               angle: rand(0,Math.PI*2), va: rand(-0.01,0.01), len: rand(4,12), w: rand(1,2.5),
               col: COLS[Math.floor(Math.random()*COLS.length)], alpha: rand(0.2,0.65),
               curve: rand(-0.35,0.35), wb: rand(0,Math.PI*2), wbs: rand(0.005,0.018) };
    }

    function init() {
      const isGallery = !!document.querySelector('.gallery-grid');
      const count = Math.min(Math.floor((W * H) / (isGallery ? 6000 : 3500)), isGallery ? 80 : 180);
      particles = Array.from({ length: count }, make);
    }

    let last = 0;
    function draw(ts) {
      requestAnimationFrame(draw);
      if (ts - last < 33) return; // ~30fps cap
      last = ts;
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.wb += p.wbs; p.x += p.vx + Math.sin(p.wb) * 0.1; p.y += p.vy; p.angle += p.va;
        if (p.y > H + 16) { p.y = -16; p.x = rand(0,W); }
        if (p.x < -16) p.x = W + 16;
        if (p.x > W + 16) p.x = -16;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        ctx.moveTo(-p.len/2, 0);
        ctx.quadraticCurveTo(0, p.curve * p.len, p.len/2, 0);
        ctx.lineWidth = p.w;
        ctx.strokeStyle = p.col + p.alpha + ')';
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
      }
    }

    resize(); init(); requestAnimationFrame(draw);
    window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
  })();

  /* ── Hero extras ─────────────────────────────────── */
  const hero = document.querySelector('.hero');
  if (hero) {
    const pc = document.createElement('div');
    pc.className = 'hero-particles';
    for (let i = 0; i < 10; i++) pc.appendChild(document.createElement('span'));
    hero.prepend(pc);
    const drip = document.createElement('div');
    drip.className = 'hero-drip';
    drip.innerHTML = `<svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,0 L0,10 Q60,40 120,15 Q180,0 240,20 Q300,38 360,12 Q420,0 480,22 Q540,42 600,14 Q660,0 720,24 Q780,44 840,16 Q900,0 960,20 Q1020,40 1080,12 Q1140,0 1200,22 Q1260,42 1320,14 Q1380,0 1440,18 L1440,0 Z" fill="#ffffff"/></svg>`;
    hero.appendChild(drip);
  }

  /* ── Section dividers & ruler ────────────────────── */
  const servicesPreview = document.querySelector('.services-preview');
  if (servicesPreview) {
    const d = document.createElement('div'); d.className = 'hazard-divider';
    servicesPreview.parentNode.insertBefore(d, servicesPreview);
  }
  const ctaSection = document.querySelector('.cta-section');
  if (ctaSection) {
    const d = document.createElement('div'); d.className = 'hazard-divider';
    ctaSection.parentNode.insertBefore(d, ctaSection);
  }
  const footer = document.querySelector('footer');
  if (footer) {
    const r = document.createElement('div'); r.className = 'ruler-border';
    footer.parentNode.insertBefore(r, footer);
  }

  /* ── Scroll reveal ───────────────────────────────── */
  document.querySelectorAll('.service-card,.feature,.value-card,.credential-item,.service-card-pro,.process-step,.commitment-item')
    .forEach(el => {
      el.classList.add('scroll-reveal');
      new IntersectionObserver((entries, obs) => {
        entries.forEach(en => { if (en.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } });
      }, { threshold: 0.1 }).observe(el);
    });

  /* ── Heading reveal ──────────────────────────────── */
  document.querySelectorAll('.services-preview h2,.why-choose-us h2,.gallery-section h1,.process-title,.values-title,.credentials-title')
    .forEach(el => {
      new IntersectionObserver((entries, obs) => {
        entries.forEach(en => { if (en.isIntersecting) { el.classList.add('reveal-active'); obs.disconnect(); } });
      }, { threshold: 0.3 }).observe(el);
    });

  /* ── Stat counters ───────────────────────────────── */
  document.querySelectorAll('.stat-number').forEach(el => {
    new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        obs.disconnect();
        const raw = el.textContent.trim();
        const num = parseFloat(raw.replace(/[^\d.]/g,''));
        if (isNaN(num)) return;
        const hasStar = raw.includes('★'), hasPct = raw.includes('%');
        const start = /^\d{4}$/.test(raw) ? num - 8 : 0;
        const t0 = performance.now();
        (function tick(now) {
          const p = Math.min((now-t0)/1400,1), v = start+(num-start)*(1-Math.pow(1-p,3));
          el.textContent = hasStar ? v.toFixed(1)+'★' : hasPct ? Math.round(v)+'%' : Math.round(v);
          if (p < 1) requestAnimationFrame(tick); else el.textContent = raw;
        })(t0);
      });
    }, { threshold: 0.5 }).observe(el);
  });

  /* ── Contact form ────────────────────────────────── */
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  if (form && typeof emailjs !== 'undefined') {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]'), orig = btn.textContent;
      btn.textContent = 'Sending...'; btn.disabled = true; formStatus.innerHTML = '';
      emailjs.sendForm('service_m1twssd','template_vlq9xyg',this)
        .then(() => { formStatus.innerHTML = '<div class="form-success" style="display:block;">Thank you! We\'ll get back to you within 24 hours.</div>'; form.reset(); setTimeout(()=>formStatus.innerHTML='',5000); },
              () => { formStatus.innerHTML = '<div class="form-error" style="display:block;">Oops! Please call us at (647) 719-0089.</div>'; setTimeout(()=>formStatus.innerHTML='',5000); })
        .finally(() => { btn.textContent = orig; btn.disabled = false; });
    });
  }

  /* ════════════════════════════════════════════════════
     GALLERY LIGHTBOX — swipe + zoom
  ════════════════════════════════════════════════════ */
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;

  // Wrap images in .img-wrap
  Array.from(galleryGrid.querySelectorAll('img')).forEach(img => {
    if (img.parentElement.classList.contains('img-wrap')) return;
    const wrap = document.createElement('div');
    wrap.className = 'img-wrap';
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
  });

  const imgs = Array.from(galleryGrid.querySelectorAll('img'));

  /* Inject CSS */
  const lbCSS = document.createElement('style');
  lbCSS.textContent = `
    #lb{position:fixed;inset:0;z-index:9999;background:rgba(8,8,8,.96);
        display:none;flex-direction:column;align-items:center;justify-content:center;
        overflow:hidden;opacity:0;transition:opacity .22s ease;}
    #lb.open{opacity:1;}
    #lb-track{position:relative;flex:1;width:100%;display:flex;align-items:center;
              justify-content:center;overflow:hidden;user-select:none;}
    #lb-img{max-width:92vw;max-height:80vh;object-fit:contain;display:block;
            border-bottom:3px solid #2563eb;box-shadow:0 0 50px rgba(37,99,235,.3);
            touch-action:none;}
    #lb-img.al{animation:al .3s cubic-bezier(.22,1,.36,1) both;}
    #lb-img.ar{animation:ar .3s cubic-bezier(.22,1,.36,1) both;}
    @keyframes al{from{opacity:0;transform:translateX(55px) scale(.97)}to{opacity:1;transform:none}}
    @keyframes ar{from{opacity:0;transform:translateX(-55px) scale(.97)}to{opacity:1;transform:none}}
    .lba{position:absolute;top:50%;transform:translateY(-50%);background:rgba(37,99,235,.85);
         border:none;color:#fff;width:46px;height:46px;display:flex;align-items:center;
         justify-content:center;cursor:pointer;transition:background .15s;}
    .lba:hover{background:#1e40af;}
    #lb-prev{left:14px;}#lb-next{right:14px;}
    #lb-close{position:absolute;top:14px;right:14px;z-index:3;
              background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);
              color:#fff;width:38px;height:38px;display:flex;align-items:center;
              justify-content:center;cursor:pointer;transition:background .15s;}
    #lb-close:hover{background:rgba(37,99,235,.7);}
    #lb-zbar{position:absolute;top:14px;left:50%;transform:translateX(-50%);z-index:3;
             display:flex;align-items:center;gap:8px;background:rgba(0,0,0,.65);
             border:1px solid rgba(255,255,255,.1);padding:6px 12px;
             backdrop-filter:blur(6px);white-space:nowrap;}
    .lbzb{background:none;border:none;color:#fff;width:28px;height:28px;display:flex;
          align-items:center;justify-content:center;cursor:pointer;
          transition:background .15s;border-radius:2px;}
    .lbzb:hover{background:rgba(37,99,235,.75);}
    .lbzb:disabled{opacity:.25;cursor:default;}
    .lbzb:disabled:hover{background:none;}
    #lb-zlvl{font-family:"Barlow Condensed",sans-serif;font-size:13px;font-weight:700;
             letter-spacing:.1em;color:#60a5fa;min-width:42px;text-align:center;}
    #lb-zrst{font-family:"Barlow Condensed",sans-serif;font-size:11px;font-weight:700;
             letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);
             background:none;border:none;border-left:1px solid rgba(255,255,255,.12);
             padding-left:10px;margin-left:2px;cursor:pointer;transition:color .15s;}
    #lb-zrst:hover{color:#60a5fa;}
    #lb-cap{font-family:"Barlow Condensed",sans-serif;font-size:12px;font-weight:600;
            letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.5);
            text-align:center;padding:12px 16px 4px;}
    #lb-ctr{font-family:"Barlow Condensed",sans-serif;font-size:13px;font-weight:700;
            letter-spacing:.18em;color:#2563eb;padding-bottom:16px;}
    #lb-dots{display:flex;gap:6px;padding-bottom:20px;flex-wrap:wrap;
             justify-content:center;max-width:80vw;}
    .lb-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.2);
            cursor:pointer;transition:background .2s,transform .2s;flex-shrink:0;}
    .lb-dot.on{background:#2563eb;transform:scale(1.5);}
    #lb-img.zoomed{cursor:grab;}
    #lb-img.panning{cursor:grabbing!important;}
    @media(max-width:600px){
      .lba{width:36px;height:36px;}
      #lb-prev{left:4px;}#lb-next{right:4px;}
      #lb-img{max-width:96vw;max-height:72vh;}
    }
  `;
  document.head.appendChild(lbCSS);

  /* Build DOM */
  const lb      = document.createElement('div');    lb.id = 'lb';
  const track   = document.createElement('div');    track.id = 'lb-track';
  const lbImg   = document.createElement('img');    lbImg.id = 'lb-img'; lbImg.alt = '';
  const prev    = document.createElement('button'); prev.id = 'lb-prev';   prev.className = 'lba';
  const next    = document.createElement('button'); next.id = 'lb-next';   next.className = 'lba';
  const close   = document.createElement('button'); close.id = 'lb-close';
  const zbar    = document.createElement('div');    zbar.id = 'lb-zbar';
  const zout    = document.createElement('button'); zout.className = 'lbzb';
  const zlvl    = document.createElement('span');   zlvl.id = 'lb-zlvl'; zlvl.textContent = '100%';
  const zin     = document.createElement('button'); zin.className  = 'lbzb';
  const zrst    = document.createElement('button'); zrst.id = 'lb-zrst'; zrst.textContent = 'Reset';
  const cap     = document.createElement('div');    cap.id = 'lb-cap';
  const ctr     = document.createElement('div');    ctr.id = 'lb-ctr';
  const dotsEl  = document.createElement('div');    dotsEl.id = 'lb-dots';

  const ico = d => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  prev.innerHTML  = ico('<polyline points="15 18 9 12 15 6"/>');
  next.innerHTML  = ico('<polyline points="9 18 15 12 9 6"/>');
  close.innerHTML = ico('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>');
  zout.innerHTML  = ico('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>');
  zin.innerHTML   = ico('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>');

  zbar.append(zout, zlvl, zin, zrst);
  track.append(prev, lbImg, next);
  lb.append(close, zbar, track, cap, ctr, dotsEl);
  document.body.appendChild(lb);

  imgs.forEach((_, i) => {
    const d = document.createElement('div'); d.className = 'lb-dot';
    d.addEventListener('click', () => go(i));
    dotsEl.appendChild(d);
  });

  /* State */
  let cur = 0, busy = false, sc = 1, px = 0, py = 0;
  const SMIN=1, SMAX=4, STEP=0.5;

  /* Zoom */
  function applyZ() {
    lbImg.style.transform = sc === 1 ? '' : `scale(${sc}) translate(${px/sc}px,${py/sc}px)`;
    zlvl.textContent = Math.round(sc*100) + '%';
    lbImg.classList.toggle('zoomed', sc > 1);
    zin.disabled  = sc >= SMAX;
    zout.disabled = sc <= SMIN;
    prev.style.opacity = next.style.opacity = sc > 1 ? '0' : '';
    prev.style.pointerEvents = next.style.pointerEvents = sc > 1 ? 'none' : '';
  }

  function clampPan() {
    if (sc <= 1) { px = py = 0; return; }
    const mx = Math.max(0,(lbImg.offsetWidth*sc - lbImg.offsetWidth)/2);
    const my = Math.max(0,(lbImg.offsetHeight*sc - lbImg.offsetHeight)/2);
    px = Math.max(-mx, Math.min(mx, px));
    py = Math.max(-my, Math.min(my, py));
  }

  function resetZ(anim) {
    if (anim) lbImg.style.transition = 'transform .22s ease';
    sc=1; px=py=0; applyZ();
    if (anim) setTimeout(() => lbImg.style.transition='', 230);
  }

  function zoomTo(ns, ox, oy) {
    lbImg.style.transition = '';
    const r = lbImg.getBoundingClientRect();
    const cx = (ox ?? r.left+r.width/2) - r.left - r.width/2;
    const cy = (oy ?? r.top+r.height/2) - r.top  - r.height/2;
    const ratio = ns/sc;
    px = (px+cx)*ratio - cx;
    py = (py+cy)*ratio - cy;
    sc = Math.max(SMIN, Math.min(SMAX, ns));
    clampPan(); applyZ();
  }

  zin.addEventListener('click',      e => { e.stopPropagation(); zoomTo(sc+STEP); });
  zout.addEventListener('click',     e => { e.stopPropagation(); zoomTo(sc-STEP); });
  zrst.addEventListener('click',     e => { e.stopPropagation(); resetZ(true); });
  lbImg.addEventListener('dblclick', e => { e.stopPropagation(); sc>1 ? resetZ(true) : zoomTo(2.5,e.clientX,e.clientY); });
  track.addEventListener('wheel',    e => { e.preventDefault(); zoomTo(sc+(-Math.sign(e.deltaY)*STEP),e.clientX,e.clientY); }, { passive:false });

  /* Nav */
  function updateUI() {
    cap.textContent = imgs[cur].alt;
    ctr.textContent = `${cur+1} / ${imgs.length}`;
    dotsEl.querySelectorAll('.lb-dot').forEach((d,i) => d.classList.toggle('on', i===cur));
    const ad = dotsEl.children[cur];
    if (ad) ad.scrollIntoView({ inline:'center', block:'nearest', behavior:'smooth' });
  }

  function show(i, dir) {
    if (busy) return; busy = true;
    resetZ(false);
    cur = (i + imgs.length) % imgs.length;
    lbImg.classList.remove('al','ar');
    void lbImg.offsetWidth;
    lbImg.src = imgs[cur].src;
    lbImg.alt = imgs[cur].alt;
    if (dir) lbImg.classList.add(dir==='left' ? 'al' : 'ar');
    updateUI();
    setTimeout(() => busy=false, 320);
  }

  function go(i) { show(i, i>cur ? 'left' : 'right'); }

  function openLb(i) {
    cur = i; resetZ(false);
    lbImg.src = imgs[i].src; lbImg.alt = imgs[i].alt;
    lbImg.classList.remove('al','ar');
    updateUI(); applyZ();
    document.body.style.overflow = 'hidden';
    lb.style.display = 'flex';
    requestAnimationFrame(() => lb.classList.add('open'));
  }

  function closeLb() {
    resetZ(false); lb.classList.remove('open');
    setTimeout(() => { lb.style.display='none'; document.body.style.overflow=''; }, 230);
  }

  /* Wire up gallery clicks */
  imgs.forEach((img, i) => {
    const el = img.closest('.img-wrap') || img;
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => openLb(i));
  });

  prev.addEventListener('click',  e => { e.stopPropagation(); show(cur-1,'right'); });
  next.addEventListener('click',  e => { e.stopPropagation(); show(cur+1,'left');  });
  close.addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target===lb) closeLb(); });

  document.addEventListener('keydown', e => {
    if (lb.style.display !== 'flex') return;
    if (e.key==='ArrowLeft'  && sc===1) show(cur-1,'right');
    if (e.key==='ArrowRight' && sc===1) show(cur+1,'left');
    if (e.key==='Escape') closeLb();
    if (e.key==='+'||e.key==='=') zoomTo(sc+STEP);
    if (e.key==='-') zoomTo(sc-STEP);
    if (e.key==='0') resetZ(true);
  });

  /* Touch */
  let tx=0,ty=0,tdx=0,pinch=false,pinchD=0,tpx0=0,tpy0=0,tppx=0,tppy=0;

  track.addEventListener('touchstart', e => {
    if (e.touches.length===2) {
      pinch=true;
      pinchD=Math.hypot(e.touches[1].clientX-e.touches[0].clientX,e.touches[1].clientY-e.touches[0].clientY);
    } else {
      pinch=false; tx=e.touches[0].clientX; ty=e.touches[0].clientY; tdx=0;
      if (sc>1) { tpx0=tx; tpy0=ty; tppx=px; tppy=py; }
    }
  }, { passive:true });

  track.addEventListener('touchmove', e => {
    if (e.touches.length===2 && pinch) {
      e.preventDefault();
      const d=Math.hypot(e.touches[1].clientX-e.touches[0].clientX,e.touches[1].clientY-e.touches[0].clientY);
      zoomTo(sc*(d/pinchD),(e.touches[0].clientX+e.touches[1].clientX)/2,(e.touches[0].clientY+e.touches[1].clientY)/2);
      pinchD=d;
    } else if (e.touches.length===1 && !pinch) {
      if (sc>1) {
        e.preventDefault();
        px=tppx+(e.touches[0].clientX-tpx0); py=tppy+(e.touches[0].clientY-tpy0);
        clampPan(); applyZ();
      } else {
        tdx=e.touches[0].clientX-tx;
        if (Math.abs(tdx)>Math.abs(e.touches[0].clientY-ty)) {
          e.preventDefault();
          lbImg.style.transform=`translateX(${tdx*0.3}px)`;
        }
      }
    }
  }, { passive:false });

  track.addEventListener('touchend', () => {
    if (pinch) { pinch=false; return; }
    if (sc<=1) {
      lbImg.style.transform='';
      if (tdx<-50) show(cur+1,'left'); else if (tdx>50) show(cur-1,'right');
      tdx=0;
    }
  }, { passive:true });

  /* Mouse drag */
  track.addEventListener('mousedown', e => {
    if (e.button!==0) return;
    let mx=e.clientX, my=e.clientY;
    const isPan = sc>1;
    if (isPan) lbImg.classList.add('panning');

    function move(e) {
      if (isPan) {
        px+=e.clientX-mx; py+=e.clientY-my;
        mx=e.clientX; my=e.clientY;
        clampPan(); applyZ();
      } else {
        lbImg.style.transform=`translateX(${(e.clientX-mx)*0.25}px)`;
      }
    }
    function up(e) {
      const dx=e.clientX-mx;
      lbImg.classList.remove('panning');
      window.removeEventListener('mousemove',move);
      window.removeEventListener('mouseup',up);
      if (!isPan) {
        lbImg.style.transform='';
        if (dx<-60) show(cur+1,'left'); else if (dx>60) show(cur-1,'right');
      }
    }
    window.addEventListener('mousemove',move);
    window.addEventListener('mouseup',up);
  });

});
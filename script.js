/* ============================================================
   SHIVA SAINI PORTFOLIO — script.js  v3.0
   Space Theme | Hero Animations | Full Functionality
   ============================================================ */

'use strict';

/* ═══════════════ PARTICLES.JS CONFIG ═══════════════ */
function initParticles() {
  if (typeof particlesJS === 'undefined') return;

  particlesJS('particles-js', {
    particles: {
      number: { value: 90, density: { enable: true, value_area: 1000 } },
      color: { value: ['#ffffff', '#aaaacc', '#8888bb'] },
      shape: { type: 'circle' },
      opacity: {
        value: 0.35,
        random: true,
        anim: { enable: true, speed: 0.4, opacity_min: 0.05, sync: false }
      },
      size: {
        value: 1.8,
        random: true,
        anim: { enable: false }
      },
      line_linked: {
        enable: true,
        distance: 140,
        color: '#444466',
        opacity: 0.08,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.6,
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: 'grab' },
        onclick: { enable: true, mode: 'push' },
        resize: true
      },
      modes: {
        grab: { distance: 140, line_linked: { opacity: 0.2 } },
        push: { particles_nb: 2 }
      }
    },
    retina_detect: true
  });
}


/* ═══════════════ SCROLL PROGRESS BAR ═══════════════ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct       = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
  }, { passive: true });
}


/* ═══════════════ NAVBAR ═══════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Active link via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}


/* ═══════════════ HAMBURGER MENU ═══════════════ */
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-nav');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

window.closeMobileNav = function () {
  const menu = document.getElementById('mobile-nav');
  const btn  = document.getElementById('hamburger');
  if (menu) menu.classList.remove('open');
  if (btn)  { btn.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
};


/* ═══════════════ HERO ENTRANCE ANIMATIONS ═══════════════ */
function initHeroAnimations() {
  if (typeof gsap === 'undefined') {
    // Fallback: show everything immediately
    document.querySelectorAll('#anim-logo, #anim-name, #anim-subtitle, #anim-desc, #anim-cta, #anim-socials')
      .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }

  // Set initial states
  gsap.set('#anim-logo',     { opacity: 0, scale: 0.6, y: 20 });
  gsap.set('#anim-name',     { opacity: 0, y: 40, letterSpacing: '20px' });
  gsap.set('#anim-subtitle', { opacity: 0, y: 20 });
  gsap.set('#anim-desc',     { opacity: 0, y: 20 });
  gsap.set('#anim-cta',      { opacity: 0, y: 20, scale: 0.95 });
  gsap.set('#anim-socials',  { opacity: 0, y: 16 });
  gsap.set('.hero-planet',   { opacity: 0, scale: 0.85, x: 60 });

  // Master timeline
  const tl = gsap.timeline({ delay: 0.15 });

  // Planet slides in first
  tl.to('.hero-planet', {
    opacity: 1,
    scale: 1,
    x: 0,
    duration: 1.6,
    ease: 'power3.out'
  })

  // Logo pops in
  .to('#anim-logo', {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.9,
    ease: 'back.out(1.8)'
  }, '-=1.0')

  // Name reveals with letter-spacing collapse
  .to('#anim-name', {
    opacity: 1,
    y: 0,
    letterSpacing: 'clamp(4px, 1.5vw, 10px)',
    duration: 0.9,
    ease: 'power4.out'
  }, '-=0.5')

  // Subtitle fades in
  .to('#anim-subtitle', {
    opacity: 1,
    y: 0,
    duration: 0.65,
    ease: 'power3.out'
  }, '-=0.3')

  // Description
  .to('#anim-desc', {
    opacity: 1,
    y: 0,
    duration: 0.65,
    ease: 'power3.out'
  }, '-=0.2')

  // CTA button
  .to('#anim-cta', {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.55,
    ease: 'back.out(1.4)'
  }, '-=0.2')

  // Social icons stagger
  .to('#anim-socials .h-social', {
    opacity: 1,
    y: 0,
    duration: 0.45,
    stagger: 0.1,
    ease: 'power3.out'
  }, '-=0.1');

  // Set social icons initial state for stagger
  gsap.set('#anim-socials .h-social', { opacity: 0, y: 14 });
}


/* ═══════════════ TYPING EFFECT (subtitle) ═══════════════ */
function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'FULL STACK DEVELOPER',
    'FRONTEND ENGINEER',
    'AI EXPLORER',
    'CREATIVE CODER',
    'UI/UX ENTHUSIAST'
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;
  let started = false;

  // Start typing after hero animation finishes (~2.5s)
  setTimeout(() => {
    started = true;
    tick();
  }, 2600);

  function tick() {
    if (!started) return;
    const current = phrases[phraseIdx];

    el.textContent = deleting
      ? current.slice(0, charIdx--)
      : current.slice(0, charIdx++);

    let delay = deleting ? 55 : 95;

    if (!deleting && charIdx === current.length + 1) {
      delay = 2400;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay     = 350;
    }

    setTimeout(tick, delay);
  }
}


/* ═══════════════ GSAP SCROLL ANIMATIONS ═══════════════ */
function initGSAP() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Section reveals
  document.querySelectorAll('.section').forEach(sec => {
    gsap.from(sec, {
      scrollTrigger: { trigger: sec, start: 'top 88%', once: true },
      opacity: 0,
      y: 40,
      duration: 0.75,
      ease: 'power3.out'
    });
  });

  // Project cards stagger
  gsap.from('.project-card', {
    scrollTrigger: { trigger: '.project-container', start: 'top 82%', once: true },
    opacity: 0,
    y: 50,
    stagger: 0.1,
    duration: 0.7,
    ease: 'power3.out'
  });

  // Skill groups stagger
  gsap.from('.skill-group', {
    scrollTrigger: { trigger: '.skills-wrapper', start: 'top 84%', once: true },
    opacity: 0,
    y: 36,
    stagger: 0.1,
    duration: 0.65,
    ease: 'power3.out'
  });

  // Highlight cards
  gsap.from('.highlight-card', {
    scrollTrigger: { trigger: '.highlight-container', start: 'top 90%', once: true },
    opacity: 0,
    scale: 0.9,
    stagger: 0.1,
    duration: 0.55,
    ease: 'back.out(1.4)'
  });

  // Cert cards
  gsap.from('.certificate-card', {
    scrollTrigger: { trigger: '.cert-grid', start: 'top 82%', once: true },
    opacity: 0,
    y: 30,
    stagger: 0.08,
    duration: 0.6,
    ease: 'power3.out'
  });

  // Stat items slide in
  gsap.from('.stat-item', {
    scrollTrigger: { trigger: '.about-stats', start: 'top 84%', once: true },
    opacity: 0,
    x: 30,
    stagger: 0.12,
    duration: 0.6,
    ease: 'power3.out'
  });

  // Social links stagger
  gsap.from('.social-link', {
    scrollTrigger: { trigger: '.social-grid', start: 'top 85%', once: true },
    opacity: 0,
    x: -20,
    stagger: 0.1,
    duration: 0.5,
    ease: 'power3.out'
  });

  // Offer cards
  gsap.from('.offer-card', {
    scrollTrigger: { trigger: '.offer-gallery', start: 'top 84%', once: true },
    opacity: 0,
    y: 24,
    stagger: 0.1,
    duration: 0.55,
    ease: 'power3.out'
  });
}


/* ═══════════════ CERTIFICATE LIGHTBOX ═══════════════ */
function initLightbox() {
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (!lightbox || !lightboxImg) return;

  window.openImg = function (card) {
    const img = card.querySelector('img');
    if (!img || !img.src || img.naturalWidth === 0) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function () {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeLightbox();
  });

  document.querySelectorAll('.certificate-card').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.openImg(card);
      }
    });
  });
}


/* ═══════════════ TOAST ═══════════════ */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}


/* ═══════════════ AI CHAT ═══════════════ */
function initAiChat() {
  const messagesBox = document.getElementById('chat-messages');
  const input       = document.getElementById('chat-input');
  const sendBtn     = document.getElementById('send-btn');
  const clearBtn    = document.getElementById('clearChat');

  if (!messagesBox || !input || !sendBtn) return;

  function appendMsg(text, role) {
    const div     = document.createElement('div');
    div.className = `chat-msg ${role}`;
    div.textContent = text;
    messagesBox.appendChild(div);
    messagesBox.scrollTop = messagesBox.scrollHeight;
    return div;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    input.value      = '';
    input.disabled   = true;
    sendBtn.disabled = true;
    sendBtn.textContent = '...';

    appendMsg(text, 'user');
    const typing = appendMsg('Typing…', 'typing');

    try {
      const res  = await fetch('/api/ask', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: text })
      });

      const data = await res.json();
      messagesBox.removeChild(typing);

      const reply = data.reply || data.error || 'Sorry, something went wrong.';
      appendMsg(reply, 'ai');
    } catch {
      messagesBox.removeChild(typing);
      appendMsg('⚠️ Network error — please try again.', 'ai');
    } finally {
      input.disabled      = false;
      sendBtn.disabled    = false;
      sendBtn.textContent = 'Send ↗';
      input.focus();
    }
  }

  sendBtn.addEventListener('click', sendMessage);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      messagesBox.innerHTML = '';
      appendMsg('👋 Chat cleared! Ask me anything about Shiva.', 'ai');
    });
  }
}

// Suggestion chips
window.useChip = function (btn) {
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = btn.textContent;
    input.focus();
  }
};


/* ═══════════════ FOOTER YEAR ═══════════════ */
function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}


/* ═══════════════ IMAGE ERROR FALLBACKS ═══════════════ */
function initImageFallbacks() {
  document.querySelectorAll('.project-img-wrap img').forEach(img => {
    img.addEventListener('error', () => {
      img.parentElement.classList.add('img-fallback');
    });
  });

  document.querySelectorAll('.certificate-card img').forEach(img => {
    img.addEventListener('error', () => {
      img.closest('.certificate-card').classList.add('cert-fallback');
    });
  });
}


/* ═══════════════ SMOOTH CURSOR GLOW (desktop only) ═══════════════ */
function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return; // skip touch devices

  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = `
    position: fixed;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX  = 0, glowY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = `${glowX}px`;
    glow.style.top  = `${glowY}px`;
    requestAnimationFrame(animateGlow);
  }

  animateGlow();
}


/* ═══════════════ BOOT ═══════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbar();
  initHamburger();
  initHeroAnimations();
  initTyping();
  initLightbox();
  initAiChat();
  initFooterYear();
  initImageFallbacks();
  initCursorGlow();
});

// GSAP + Particles after full load
window.addEventListener('load', () => {
  initParticles();
  initGSAP();
});

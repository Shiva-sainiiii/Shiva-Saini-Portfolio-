/* ============================================================
   SHIVA SAINI PORTFOLIO — script.js  v2.1
   Bug fixes: GSAP mobile visibility + duplicate-send guard
   ============================================================ */

'use strict';

/* ═══════════════ PARTICLES.JS CONFIG ═══════════════ */
function initParticles() {
  if (typeof particlesJS === 'undefined') return;

  particlesJS('particles-js', {
    particles: {
      number: { value: 72, density: { enable: true, value_area: 900 } },
      color: { value: ['#8a2be2', '#00d4ff', '#a855f7'] },
      shape: { type: 'circle' },
      opacity: {
        value: 0.45,
        random: true,
        anim: { enable: true, speed: 0.6, opacity_min: 0.1, sync: false }
      },
      size: { value: 2.8, random: true, anim: { enable: false } },
      line_linked: { enable: true, distance: 150, color: '#8a2be2', opacity: 0.12, width: 1 },
      move: {
        enable: true, speed: 1.2, direction: 'none',
        random: true, straight: false, out_mode: 'out', bounce: false
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
        grab: { distance: 160, line_linked: { opacity: 0.35 } },
        push: { particles_nb: 3 }
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
    const pct = document.documentElement.scrollHeight - window.innerHeight > 0
      ? (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      : 0;
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
  }, { threshold: 0.4 });

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

/* ═══════════════ TYPING EFFECT ═══════════════ */
function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = ['Frontend Developer', 'UI/UX Enthusiast', 'AI Explorer', 'Creative Coder', 'Problem Solver'];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const current = phrases[phraseIdx];
    el.textContent = deleting ? current.slice(0, charIdx--) : current.slice(0, charIdx++);
    let delay = deleting ? 60 : 100;
    if (!deleting && charIdx === current.length + 1) { delay = 1800; deleting = true; }
    else if (deleting && charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; delay = 400; }
    setTimeout(tick, delay);
  }
  tick();
}

/* ═══════════════ GSAP SCROLL ANIMATIONS ═══════════════ */
function initGSAP() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // ─── KEY FIX: Detect mobile BEFORE setting any GSAP from() states ─────────
  // gsap.from() immediately sets opacity:0 as inline style.
  // If ScrollTrigger never fires on mobile, the element is stuck invisible.
  // Solution: skip stagger animations on mobile, use CSS for visibility instead.
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  // Generic section reveals — safe threshold for all devices
  document.querySelectorAll('.section').forEach(sec => {
    gsap.from(sec, {
      scrollTrigger: {
        trigger: sec,
        start: isMobile ? 'top 100%' : 'top 85%',
        once: true
      },
      opacity: 0, y: 30,
      duration: 0.65,
      ease: 'power3.out',
      clearProps: 'opacity,transform'  // ← Remove inline style after animation
    });
  });

  // ─── Project cards ──────────────────────────────────────────────────────
  // FIX: Skip GSAP animation on mobile entirely.
  // CSS already sets opacity:1 — cards are visible without GSAP.
  // Desktop: run stagger animation, then clear inline styles so
  // CSS hover transitions keep working correctly.
  if (!isMobile) {
    gsap.from('.project-card', {
      scrollTrigger: {
        trigger: '.project-container',
        start: 'top 82%',
        once: true,
        invalidateOnRefresh: true
      },
      opacity: 0, y: 50,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power3.out',
      clearProps: 'opacity,transform'
    });
  }

  // ─── Skill groups ────────────────────────────────────────────────────────
  if (!isMobile) {
    gsap.from('.skill-group', {
      scrollTrigger: {
        trigger: '.skills-wrapper',
        start: 'top 82%',
        once: true,
        invalidateOnRefresh: true
      },
      opacity: 0, y: 36,
      stagger: 0.1,
      duration: 0.65,
      ease: 'power3.out',
      clearProps: 'opacity,transform'
    });
  }

  // ─── Highlight cards — safe on all devices ───────────────────────────────
  gsap.from('.highlight-card', {
    scrollTrigger: {
      trigger: '.highlight-container',
      start: isMobile ? 'top 100%' : 'top 88%',
      once: true,
      invalidateOnRefresh: true
    },
    opacity: 0, scale: 0.92,
    stagger: 0.1,
    duration: 0.55,
    ease: 'back.out(1.4)',
    clearProps: 'opacity,transform'
  });

  // ─── Certificate cards ───────────────────────────────────────────────────
  gsap.from('.certificate-card', {
    scrollTrigger: {
      trigger: '.cert-grid',
      start: isMobile ? 'top 100%' : 'top 80%',
      once: true,
      invalidateOnRefresh: true
    },
    opacity: 0, y: 30,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power3.out',
    clearProps: 'opacity,transform'
  });

  // ─── Stat items ──────────────────────────────────────────────────────────
  gsap.from('.stat-item', {
    scrollTrigger: {
      trigger: '.about-stats',
      start: isMobile ? 'top 100%' : 'top 82%',
      once: true,
      invalidateOnRefresh: true
    },
    opacity: 0, x: 30,
    stagger: 0.12,
    duration: 0.6,
    ease: 'power3.out',
    clearProps: 'opacity,transform'
  });

  // ─── KEY FIX: Refresh ScrollTrigger after layout settles ─────────────────
  // Without this, trigger positions computed before images load are wrong —
  // especially on mobile where layout reflows are common.
  setTimeout(() => ScrollTrigger.refresh(), 400);
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
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.openImg(card); }
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
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ═══════════════ AI CHAT ═══════════════ */
function initAiChat() {
  const messagesBox = document.getElementById('chat-messages');
  const input       = document.getElementById('chat-input');
  const sendBtn     = document.getElementById('send-btn');
  const clearBtn    = document.getElementById('clearChat');

  if (!messagesBox || !input || !sendBtn) return;

  function appendMsg(text, role) {
    const div = document.createElement('div');
    div.className   = `chat-msg ${role}`;
    div.textContent = text;
    messagesBox.appendChild(div);
    messagesBox.scrollTop = messagesBox.scrollHeight;
    return div;
  }

  let isSending = false;  // Duplicate-send guard

  async function sendMessage() {
    if (isSending) return;               // Prevent double-submission
    const text = input.value.trim();
    if (!text) return;

    isSending        = true;
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
      const data  = await res.json();
      messagesBox.removeChild(typing);
      appendMsg(data.reply || data.error || 'Sorry, something went wrong.', 'ai');
    } catch {
      messagesBox.removeChild(typing);
      appendMsg('⚠️ Network error — please try again.', 'ai');
    } finally {
      isSending           = false;
      input.disabled      = false;
      sendBtn.disabled    = false;
      sendBtn.textContent = 'Send ↗';
      input.focus();
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      messagesBox.innerHTML = '';
      appendMsg('👋 Chat cleared! Ask me anything about Shiva.', 'ai');
    });
  }
}

window.useChip = function (btn) {
  const input = document.getElementById('chat-input');
  if (input) { input.value = btn.textContent; input.focus(); }
};

/* ═══════════════ YEAR IN FOOTER ═══════════════ */
function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ═══════════════ IMAGE ERROR FALLBACKS ═══════════════ */
function initImageFallbacks() {
  document.querySelectorAll('.project-img-wrap img').forEach(img => {
    img.addEventListener('error', () => img.parentElement.classList.add('img-fallback'));
  });
  document.querySelectorAll('.certificate-card img').forEach(img => {
    img.addEventListener('error', () => img.closest('.certificate-card').classList.add('cert-fallback'));
  });
}

/* ═══════════════ BOOT ═══════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbar();
  initHamburger();
  initTyping();
  initLightbox();
  initAiChat();
  initFooterYear();
  initImageFallbacks();
});

window.addEventListener('load', () => {
  initParticles();
  initGSAP();
});

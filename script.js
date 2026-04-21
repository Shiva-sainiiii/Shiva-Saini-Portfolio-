/* ============================================================
   SHIVA SAINI PORTFOLIO — script.js
   Production-ready, modular, all bugs fixed
   ============================================================ */

"use strict";

/* ─────────────────────────────────────────
   1. PARTICLES.JS INIT
───────────────────────────────────────── */
window.addEventListener("load", () => {
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: { value: 70, density: { enable: true, value_area: 900 } },
        color: { value: ["#8a2be2", "#00d4ff"] },
        shape: { type: "circle" },
        opacity: { value: 0.45, random: true },
        size: { value: 2.5, random: true },
        line_linked: {
          enable: true,
          distance: 140,
          color: "#8a2be2",
          opacity: 0.25,
          width: 1
        },
        move: { enable: true, speed: 1.6, random: true, out_mode: "out" }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" }
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 0.5 } },
          push: { particles_nb: 3 }
        }
      },
      retina_detect: true
    });
  }
});


/* ─────────────────────────────────────────
   2. TYPING EFFECT
───────────────────────────────────────── */
(function initTyping() {
  const el = document.querySelector(".typing");
  if (!el) return;

  const roles = [
    "Full Stack Developer",
    "AI Enthusiast",
    "Creative Coder",
    "MERN Stack Dev"
  ];

  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;

  function tick() {
    const current = roles[roleIdx];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        return setTimeout(tick, 1600);   // pause at end
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
        return setTimeout(tick, 400);    // pause before next
      }
    }

    setTimeout(tick, deleting ? 45 : 95);
  }

  setTimeout(tick, 600);
})();


/* ─────────────────────────────────────────
   3. GSAP SCROLL ANIMATIONS
───────────────────────────────────────── */
window.addEventListener("load", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  // Fade-in sections on scroll — use from() so sections are visible by default
  gsap.utils.toArray(".section").forEach(section => {
    gsap.from(section, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 82%",
        once: true
      }
    });
  });

  // Staggered project cards
  gsap.from(".project-card", {
    opacity: 0,
    y: 60,
    duration: 0.7,
    stagger: 0.12,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".projects",
      start: "top 78%",
      once: true
    }
  });

  // Skill tags
  gsap.from(".skill-tags span", {
    opacity: 0,
    scale: 0.8,
    duration: 0.4,
    stagger: 0.05,
    ease: "back.out(1.4)",
    scrollTrigger: {
      trigger: ".skills",
      start: "top 80%",
      once: true
    }
  });

  // Highlight cards
  gsap.from(".highlight-card", {
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.15,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".highlights",
      start: "top 85%",
      once: true
    }
  });
});


/* ─────────────────────────────────────────
   4. NAVBAR — SCROLL STYLE + ACTIVE LINKS
───────────────────────────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById("navbar");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  if (!navbar) return;

  const onScroll = () => {
    // Scrolled style
    navbar.classList.toggle("scrolled", window.scrollY > 50);

    // Scroll progress
    const doc      = document.documentElement;
    const progress = (window.scrollY / (doc.scrollHeight - doc.clientHeight)) * 100;
    const bar      = document.getElementById("scroll-progress");
    if (bar) bar.style.width = Math.min(progress, 100) + "%";

    // Active nav link
    let current = "";
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ─────────────────────────────────────────
   5. HAMBURGER MOBILE MENU
───────────────────────────────────────── */
(function initHamburger() {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  // Close on any mobile link click
  mobileNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  // Close on outside click
  document.addEventListener("click", e => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });
})();


/* ─────────────────────────────────────────
   6. SMOOTH SCROLL
───────────────────────────────────────── */
document.querySelectorAll("a[href^='#']").forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const offset = 70; // navbar height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});


/* ─────────────────────────────────────────
   7. TOAST NOTIFICATION
───────────────────────────────────────── */
function showToast(msg, duration = 3000) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), duration);
}


    

/* ─────────────────────────────────────────
   8. AI CHAT — SHARED CORE
───────────────────────────────────────── */
function appendMsg(boxId, role, text) {
  const box = document.getElementById(boxId);
  if (!box) return null;

  const p    = document.createElement("p");
  p.className = "chat-msg " + role;

  if (role === "user") {
    p.textContent = "You: " + text;
  } else if (role === "ai") {
    p.textContent = "Shiva AI: " + text;
  } else {
    p.textContent = text; // typing indicator
  }

  box.appendChild(p);
  box.scrollTop = box.scrollHeight;
  return p;
}

async function sendChat(boxId, inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const message = input.value.trim();
  if (!message) return;

  input.value   = "";
  input.disabled = true;

  appendMsg(boxId, "user", message);
  const typingEl = appendMsg(boxId, "typing", "⏳ Thinking…");

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!res.ok) throw new Error("Server error: " + res.status);

    const data = await res.json();
    typingEl && typingEl.remove();

    const reply = data.reply || "Sorry, I couldn't respond to that.";
    appendMsg(boxId, "ai", reply);

    // Save to Firestore if available
    if (typeof window.saveChat === "function") {
      window.saveChat(message, reply).catch(console.warn);
    }

  } catch (err) {
    typingEl && typingEl.remove();
    appendMsg(boxId, "ai", "⚠️ Connection error. Please try again.");
    console.warn("Chat error:", err);
  } finally {
    input.disabled = false;
    input.focus();
  }
}

// ─── EXPOSED GLOBAL (called from popup HTML onclick) ───
function sendMessagePopup() { sendChat("chatBoxPopup", "userInputPopup"); }


/* ─────────────────────────────────────────
   9. FLOATING AI CHAT TOGGLE
───────────────────────────────────────── */
(function initFloatingChat() {
  const toggleBtn     = document.getElementById("ai-toggle");
  const chatContainer = document.getElementById("ai-chat-container");
  const closeBtn      = document.getElementById("close-chat");
  if (!toggleBtn || !chatContainer) return;

  toggleBtn.addEventListener("click", () => {
    const isActive = chatContainer.classList.toggle("active");
    chatContainer.setAttribute("aria-hidden", !isActive);
    if (isActive) {
      setTimeout(() => {
        const input = document.getElementById("userInputPopup");
        if (input) input.focus();
      }, 320);
    }
  });

  closeBtn && closeBtn.addEventListener("click", () => {
    chatContainer.classList.remove("active");
    chatContainer.setAttribute("aria-hidden", "true");
  });

  // Close on Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && chatContainer.classList.contains("active")) {
      chatContainer.classList.remove("active");
      chatContainer.setAttribute("aria-hidden", "true");
    }
  });
})();



/* ─────────────────────────────────────────
   10. SNAKE GAME
───────────────────────────────────────── */
(function initSnakeGame() {
  const canvas = document.getElementById("gameCanvas");
  if (!canvas) return;

  const ctx   = canvas.getContext("2d");
  const BOX   = 15;
  const COLS  = Math.floor(canvas.width  / BOX);
  const ROWS  = Math.floor(canvas.height / BOX);

  let snake, dir, nextDir, food, score, highScore, gameLoop;
  // States: "idle" | "running" | "over"
  let state = "idle";

  try {
    highScore = parseInt(localStorage.getItem("snakeHS") || "0");
  } catch { highScore = 0; }

  function updateScoreUI() {
    const scoreEl = document.getElementById("score");
    const hsEl    = document.getElementById("highScore");
    if (scoreEl) scoreEl.textContent = "Score: " + score;
    if (hsEl)    hsEl.textContent    = "Best: "  + highScore;
  }

  function randomFood() {
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * COLS) * BOX,
        y: Math.floor(Math.random() * ROWS) * BOX
      };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
  }

  // ─── DRAW BACKGROUND + GRID ───
  function drawBg() {
    ctx.fillStyle = "#08080f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255,255,255,0.025)";
    ctx.lineWidth   = 0.5;
    for (let x = 0; x <= canvas.width; x += BOX) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += BOX) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
  }

  // ─── START SCREEN (shown on load, not game-over) ───
  function drawStartScreen() {
    drawBg();
    ctx.textAlign = "center";

    // Icon
    ctx.font      = "40px serif";
    ctx.fillText("🐍", canvas.width / 2, canvas.height / 2 - 44);

    ctx.fillStyle = "#00d4ff";
    ctx.font      = "bold 20px 'Syne', sans-serif";
    ctx.fillText("SNAKE", canvas.width / 2, canvas.height / 2 - 8);

    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font      = "13px 'Space Grotesk', sans-serif";
    ctx.fillText("Press Start or Space to play", canvas.width / 2, canvas.height / 2 + 18);

    if (highScore > 0) {
      ctx.fillStyle = "rgba(255, 215, 0, 0.6)";
      ctx.font      = "12px 'Space Grotesk', sans-serif";
      ctx.fillText("Best: " + highScore, canvas.width / 2, canvas.height / 2 + 40);
    }
  }

  // ─── START GAME ───
  function startGame() {
    snake   = [{ x: Math.floor(COLS / 2) * BOX, y: Math.floor(ROWS / 2) * BOX }];
    dir     = "RIGHT";
    nextDir = "RIGHT";
    food    = randomFood();
    score   = 0;
    state   = "running";
    updateScoreUI();
    clearInterval(gameLoop);
    gameLoop = setInterval(tick, 110);
  }

  // ─── MAIN TICK ───
  function tick() {
    if (state !== "running") return;

    drawBg();
    dir = nextDir;

    const head = { ...snake[0] };
    if (dir === "UP")    head.y -= BOX;
    if (dir === "DOWN")  head.y += BOX;
    if (dir === "LEFT")  head.x -= BOX;
    if (dir === "RIGHT") head.x += BOX;

    // Collision check
    if (
      head.x < 0 || head.y < 0 ||
      head.x >= canvas.width || head.y >= canvas.height ||
      snake.some(s => s.x === head.x && s.y === head.y)
    ) {
      clearInterval(gameLoop);
      state = "over";
      drawGameOverScreen();
      return;
    }

    if (head.x === food.x && head.y === food.y) {
      score++;
      if (score > highScore) {
        highScore = score;
        try { localStorage.setItem("snakeHS", highScore); } catch {}
      }
      food = randomFood();
      updateScoreUI();
    } else {
      snake.pop();
    }

    snake.unshift(head);

    // Draw food
    ctx.shadowBlur  = 14;
    ctx.shadowColor = "#ff4d8d";
    ctx.fillStyle   = "#ff4d8d";
    ctx.beginPath();
    ctx.arc(food.x + BOX / 2, food.y + BOX / 2, BOX / 2 - 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake
    snake.forEach((seg, i) => {
      const ratio   = i / snake.length;
      ctx.fillStyle = i === 0
        ? "#00d4ff"
        : `hsl(${270 + ratio * 60}, 80%, ${65 - ratio * 20}%)`;
      ctx.shadowBlur  = i === 0 ? 10 : 0;
      ctx.shadowColor = "#00d4ff";
      ctx.beginPath();
      ctx.roundRect(seg.x + 1, seg.y + 1, BOX - 2, BOX - 2, 3);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }

  // ─── GAME OVER SCREEN (on canvas, no popup/toast) ───
  function drawGameOverScreen() {
    // Dim overlay
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";
    ctx.fillStyle = "#ff4d8d";
    ctx.font      = "bold 22px 'Syne', sans-serif";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 28);

    ctx.fillStyle = "#fff";
    ctx.font      = "16px 'Space Grotesk', sans-serif";
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 2);

    if (score === highScore && score > 0) {
      ctx.fillStyle = "rgba(255, 215, 0, 0.85)";
      ctx.font      = "12px 'Space Grotesk', sans-serif";
      ctx.fillText("🏆 New Best!", canvas.width / 2, canvas.height / 2 + 22);
    }

    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font      = "12px 'Space Grotesk', sans-serif";
    ctx.fillText("Click Restart to play again", canvas.width / 2, canvas.height / 2 + 44);
  }

  // ─── KEYBOARD CONTROLS ───
  const opposite = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
  const keyMap   = {
    ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
    w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT"
  };

  document.addEventListener("keydown", e => {
    // Space starts game from idle
    if (e.key === " " && state === "idle") {
      startGame();
      return;
    }
    const newDir = keyMap[e.key];
    if (newDir && newDir !== opposite[dir] && state === "running") {
      nextDir = newDir;
      if (e.key.startsWith("Arrow")) e.preventDefault();
    }
  });

  // ─── MOBILE TOUCH CONTROLS ───
  const btnMap = {
    upBtn: "UP", downBtn: "DOWN", leftBtn: "LEFT", rightBtn: "RIGHT"
  };

  Object.entries(btnMap).forEach(([id, newDir]) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    ["touchstart", "mousedown"].forEach(evt => {
      btn.addEventListener(evt, e => {
        e.preventDefault();
        if (state === "running" && newDir !== opposite[dir]) nextDir = newDir;
      }, { passive: false });
    });
  });

  // ─── RESTART BUTTON ───
  const restartBtn = document.getElementById("restartBtn");
  if (restartBtn) restartBtn.addEventListener("click", startGame);

  // ─── CLICK CANVAS TO START (idle state) ───
  canvas.addEventListener("click", () => {
    if (state === "idle") startGame();
  });

  // ─── SHOW START SCREEN (no auto-start) ───
  drawStartScreen();
})();


/* ─────────────────────────────────────────
   11. FEEDBACK FORM
───────────────────────────────────────── */
(function initFeedback() {
  const form    = document.getElementById("feedbackForm");
  const nameEl  = document.getElementById("feedName");
  const msgEl   = document.getElementById("feedMessage");
  const list    = document.getElementById("feedback-list");
  if (!form) return;

  function addFeedbackToUI(name, message) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${escapeHTML(name)}</strong>${escapeHTML(message)}`;
    list.prepend(li);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name    = nameEl.value.trim();
    const message = msgEl.value.trim();
    if (!name || !message) return;

    const btn = form.querySelector("button[type='submit']");
    btn.disabled    = true;
    btn.textContent = "Submitting…";

    try {
      if (typeof window.saveFeedback === "function") {
        await window.saveFeedback(name, message);
      }
      addFeedbackToUI(name, message);
      form.reset();
      showToast("Thanks for your feedback! 🎉");
    } catch (err) {
      showToast("Failed to submit. Please try again.");
      console.warn("Feedback error:", err);
    } finally {
      btn.disabled    = false;
      btn.innerHTML   = '<i class="fas fa-paper-plane"></i> Submit Feedback';
    }
  });
})();


/* ─────────────────────────────────────────
   12. LOAD FEEDBACK FROM FIRESTORE
───────────────────────────────────────── */
window.renderFeedback = function(items) {
  const list = document.getElementById("feedback-list");
  if (!list || !items) return;
  list.innerHTML = "";
  items.forEach(({ name, message }) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${escapeHTML(name)}</strong>${escapeHTML(message)}`;
    list.appendChild(li);
  });
};


/* ─────────────────────────────────────────
   UTILITY: HTML ESCAPE
───────────────────────────────────────── */
function escapeHTML(str) {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

// ==============================
// ✨ PARTICLES INIT
// ==============================
particlesJS("particles-js", {
  particles: {
    number: { value: 80 },
    size: { value: 3 },
    move: { speed: 2 },
    line_linked: { enable: true },
    color: { value: "#8a2be2" }
  }
});


// ==============================
// ⌨️ TYPING EFFECT
// ==============================
const roles = ["Full Stack Developer", "AI Enthusiast", "Creative Coder"];
let i = 0;
let j = 0;
let currentRole = "";
let isDeleting = false;

function type() {
  currentRole = roles[i];

  if (!isDeleting) {
    document.querySelector(".typing").textContent = currentRole.substring(0, j++);
    if (j > currentRole.length) {
      isDeleting = true;
      setTimeout(type, 1000);
      return;
    }
  } else {
    document.querySelector(".typing").textContent = currentRole.substring(0, j--);
    if (j < 0) {
      isDeleting = false;
      i = (i + 1) % roles.length;
    }
  }

  setTimeout(type, isDeleting ? 50 : 100);
}

type();


// ==============================
// 🎬 GSAP ANIMATIONS
// ==============================
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".section").forEach(section => {
  gsap.to(section, {
    opacity: 1,
    y: 0,
    duration: 1,
    scrollTrigger: {
      trigger: section,
      start: "top 80%"
    }
  });
});

// PROJECT ANIMATION
gsap.from(".project-card", {
  opacity: 0,
  y: 80,
  duration: 1,
  stagger: 0.2,
  scrollTrigger: {
    trigger: ".projects",
    start: "top 80%"
  }
});
// ==============================
// 🤖 TOGGLE CHAT
// ==============================
const toggleBtn = document.getElementById("ai-toggle");
const chatContainer = document.getElementById("ai-chat-container");
const closeBtn = document.getElementById("close-chat");

toggleBtn.addEventListener("click", () => {
  chatContainer.classList.toggle("active");
});

closeBtn.addEventListener("click", () => {
  chatContainer.classList.remove("active");
});


// ==============================
// 🤖 UPGRADED AI CHAT
// ==============================
async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");

  const message = input.value.trim();
  if (!message) return;

  // USER MESSAGE
  chatBox.innerHTML += `<p class="user">You: ${message}</p>`;
  input.value = "";

  // Typing indicator
  const typing = document.createElement("p");
  typing.textContent = "AI is typing...";
  chatBox.appendChild(typing);

  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    typing.remove();

    // AI MESSAGE
    chatBox.innerHTML += `<p class="ai">AI: ${data.reply}</p>`;

    if (window.saveChat) {
      saveChat(message, data.reply);
    }

  } catch (err) {
    typing.textContent = "Error connecting...";
  }

  chatBox.scrollTop = chatBox.scrollHeight;
  }


// ==============================
// 🎮 MINI GAME (CLICK SPEED)
// ==============================
let score = 0;

const gameBtn = document.getElementById("gameBtn");
const scoreDisplay = document.getElementById("score");

gameBtn.addEventListener("click", () => {
  score++;
  scoreDisplay.textContent = "Score: " + score;
});


// ==============================
// 📩 FEEDBACK FORM
// ==============================
const form = document.getElementById("feedbackForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;

  if (window.saveFeedback) {
    saveFeedback(name, message);
  }

  alert("Thanks for your feedback!");

  form.reset();
});


// ==============================
// 🎯 OPTIONAL: SMOOTH SCROLL
// ==============================
document.querySelectorAll("a[href^='#']").forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

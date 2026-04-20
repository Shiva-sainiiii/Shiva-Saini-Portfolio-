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
// 🐍 SNAKE GAME
// ==============================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let box = 15;
let snake;
let direction;
let food;
let score;
let game;

// INIT GAME
function initGame() {
  snake = [{ x: 150, y: 150 }];
  direction = "RIGHT";
  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
  score = 0;
  document.getElementById("score").textContent = "Score: 0";

  if (game) clearInterval(game);
  game = setInterval(draw, 100);
}

// CONTROL
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// DRAW
function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, 300, 300);

  // Snake
  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? "#00d4ff" : "#8a2be2";
    ctx.fillRect(s.x, s.y, box, box);
  });

  // Food
  ctx.fillStyle = "#ff0080";
  ctx.fillRect(food.x, food.y, box, box);

  // Move
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;
  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;

  // Eat food
  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById("score").textContent = "Score: " + score;

    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  } else {
    snake.pop();
  }

  let newHead = { x: headX, y: headY };

  // Game Over
  if (
    headX < 0 || headY < 0 ||
    headX >= 300 || headY >= 300 ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert("Game Over 😢 Score: " + score);
  }

  snake.unshift(newHead);
}

// Collision check
function collision(head, body) {
  return body.some(segment => segment.x === head.x && segment.y === head.y);
}

// Restart
document.getElementById("restartBtn").addEventListener("click", initGame);

// Start game
initGame();


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
    

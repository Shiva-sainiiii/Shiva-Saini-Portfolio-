// 🔥 IMPORT FIREBASE
import { saveChat } from "./firebase.js";

// 🔵 Loader
window.addEventListener("load", () => {
setTimeout(() => {
document.getElementById("loader").style.display = "none";
}, 2000);
});

// ✍️ Typing Effect
const text = "I build smart & interactive web experiences 🚀";
let index = 0;

function typeEffect() {
if (index < text.length) {
document.querySelector(".typing").innerHTML += text.charAt(index);
index++;
setTimeout(typeEffect, 50);
}
}
typeEffect();

// 🖱️ Custom Cursor
const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
cursor.style.top = e.clientY + "px";
cursor.style.left = e.clientX + "px";
});

// 🔽 Scroll
function scrollToProjects() {
document.querySelector(".projects").scrollIntoView({
behavior: "smooth"
});
}

// ==============================
// 🤖 AI CHAT SYSTEM (UPDATED)
// ==============================
const input = document.getElementById("ai-input");
const messages = document.querySelector(".ai-messages");

// Add message UI
function addMessage(text) {
let div = document.createElement("div");
div.innerText = text;
messages.appendChild(div);
messages.scrollTop = messages.scrollHeight;
}

// 🔥 REAL AI (Vercel API)
async function getAIResponse(msg) {
try {
const res = await fetch("/api/ask", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ message: msg })
});

const data = await res.json();
return data.choices[0].message.content;

} catch (err) {
return "⚠️ Error connecting AI...";
}
}

// Enter press
input.addEventListener("keypress", async function(e) {
if (e.key === "Enter") {

let userText = input.value.trim();
if (!userText) return;

addMessage("You: " + userText);
input.value = "";

// Loading
addMessage("AI is typing...");

const reply = await getAIResponse(userText);

// Remove "typing..."
messages.lastChild.remove();

addMessage("AI: " + reply);

// 🔥 SAVE CHAT
saveChat(userText, reply);

}
});

// ==============================
// 🎛️ AI OPEN / CLOSE
// ==============================
const openBtn = document.getElementById("openAI");
const closeBtn = document.getElementById("closeAI");
const chatBox = document.querySelector(".ai-chat");

openBtn.addEventListener("click", () => {
chatBox.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
chatBox.classList.add("hidden");
});

// ==============================
// 🎮 GAME
// ==============================
function startGame() {
let number = Math.floor(Math.random() * 5) + 1;
let guess = prompt("Guess number (1-5)");

if (guess == number) {
document.getElementById("game-result").innerText = "🔥 You won!";
} else {
document.getElementById("game-result").innerText = "😅 Try again!";
}
}
const feedbackForm = document.getElementById('feedbackForm');
const status = document.getElementById('feedback-status');

if (feedbackForm) {
  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Abhi ke liye console me log kar rahe hain
    console.log({ name, email, message });
    
    status.textContent = "Thanks for your feedback, " + name + "!";
    feedbackForm.reset();
    
    // Yaha Firebase ya EmailJS integrate kar sakte ho data save karne ke liye
  });
}
// ==============================
// 🔊 SOUND
// ==============================
const sound = document.getElementById("clickSound");

document.querySelectorAll("button").forEach(btn => {
btn.addEventListener("click", () => {
sound.currentTime = 0;
sound.play();
});
});

// ==============================
// 🎬 GSAP ANIMATIONS
// ==============================
gsap.from(".hero h1", {
y: -50,
opacity: 0,
duration: 1
});

gsap.from(".typing", {
opacity: 0,
delay: 1,
duration: 1
});

gsap.from(".buttons button", {
y: 50,
opacity: 0,
delay: 1.5,
stagger: 0.2
});

gsap.from(".project-card", {
scrollTrigger: ".projects",
y: 100,
opacity: 0,
stagger: 0.2
});

// ==============================
// ✨ PARTICLES
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

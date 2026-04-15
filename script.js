document.addEventListener('DOMContentLoaded', () => {

    // --- 1. AI Chat Toggle Logic ---
    const chatLauncher = document.getElementById('ai-chat-launcher');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeChat = document.getElementById('close-chat');

    chatLauncher.addEventListener('click', () => {
        chatWindow.classList.remove('hidden');
    });

    closeChat.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    // --- 2. AI Chat Interaction ---
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add(sender === 'user' ? 'user-msg' : 'bot-msg');
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
    }

    sendBtn.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message !== "") {
            addMessage(message, 'user');
            userInput.value = "";
            
            // Simulating AI Response
            setTimeout(() => {
                addMessage("Thanks! Abhi main sirf ek demo hu, jald hi backend connect hoga.", 'bot');
            }, 1000);
        }
    });

    // Enter key support for Chat
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendBtn.click();
    });

    // --- 3. Feedback Form Handling ---
    const feedbackForm = document.getElementById('feedback-form');
    
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Yahan tum EmailJS ya Formspree ka logic daal sakte ho
        const formData = new FormData(feedbackForm);
        alert(`Message received from ${formData.get('name')}! Main jaldi contact karunga.`);
        
        feedbackForm.reset();
    });

    // --- 4. Game Initialization (Basic) ---
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('start-game-btn');

    startBtn.addEventListener('click', () => {
        startBtn.style.display = 'none';
        initGame();
    });

    function initGame() {
        // Game ka basic logic yahan start hoga
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(50, 50, 50, 50); // Sample square
        console.log("Game started!");
        
        // Example: Game Loop
        function gameLoop() {
            // Animation logic yahan aayega
            requestAnimationFrame(gameLoop);
        }
        gameLoop();
    }
});
                               

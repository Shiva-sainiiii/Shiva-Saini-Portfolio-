const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Variables
let box = 20; // Size of one square
let snake = [];
let food = {};
let score = 0;
let direction = "";
let gameInterval;

// Initialize Snake position
function resetGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    };
    score = 0;
    direction = "";
}

// Control the Snake
document.addEventListener("keydown", (event) => {
    let key = event.keyCode;
    if (key == 37 && direction != "RIGHT") direction = "LEFT";
    else if (key == 38 && direction != "DOWN") direction = "UP";
    else if (key == 39 && direction != "LEFT") direction = "RIGHT";
    else if (key == 40 && direction != "UP") direction = "DOWN";
});

// Collision Function
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

// Draw everything to canvas
function draw() {
    // Canvas Background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        // Snake Body Color (Indigo Gradient)
        ctx.fillStyle = (i == 0) ? "#6366f1" : "#a855f7"; 
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#6366f1";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "#0f172a";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw Food (Neon Purple)
    ctx.fillStyle = "#f43f5e";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#f43f5e";
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2, box/2, 0, Math.PI * 2);
    ctx.fill();

    // Old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Move direction
    if (direction == "LEFT") snakeX -= box;
    if (direction == "UP") snakeY -= box;
    if (direction == "RIGHT") snakeX += box;
    if (direction == "DOWN") snakeY += box;

    // Snake eats food
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop(); // Remove tail
    }

    // New Head
    let newHead = { x: snakeX, y: snakeY };

    // Game Over Rules
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(gameInterval);
        alert("Game Over! Score: " + score);
        document.getElementById('start-game-btn').style.display = 'block'; // Show start button again
    }

    snake.unshift(newHead);

    // Score Text
    ctx.shadowBlur = 0;
    ctx.fillStyle = "white";
    ctx.font = "20px Inter";
    ctx.fillText("Score: " + score, 10, 30);
}

// This function is called from script.js
function initGame() {
    // Set canvas internal size
    canvas.width = 400;
    canvas.height = 400;
    
    resetGame();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(draw, 120); // Adjust speed here (lower = faster)
      }
                          

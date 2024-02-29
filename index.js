// Define HTML elements
const board = document.getElementById('game-board');
const instruction = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');


// Define variables
const gridSize = 20;
let snake = [{ x:10, y:10 }];
let food = generateFood();
let direction = 'right';
let highScore = 0;
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;


// Draw game map, snake, food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Draw snake
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Set the position of snake or the food
function setPosition(element, position) {
    element.style.gridColumn = (position.x % gridSize + gridSize) % gridSize + 1;
    element.style.gridRow = (position.y % gridSize + gridSize) % gridSize + 1;
}

draw();

// Draw food function
function drawFood() {
    if(gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

// Generate Food
// function generateFood() {
//     const x = Math.floor(Math.random() * gridSize) + 1;
//     const y = Math.floor(Math.random() * gridSize) + 1;
//     return {x, y};
// }


// Generate Food
function generateFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * gridSize) + 1;
        y = Math.floor(Math.random() * gridSize) + 1;
    } while (isOnSnake({ x, y }) || isOnBorder({ x, y }));

    return { x, y };
}

// Check if a position is on the snake
function isOnSnake(position) {
    return snake.some(segment => segment.x === position.x && segment.y === position.y);
}

// Check if a position is on the border
function isOnBorder(position) {
    return position.x === 1 || position.x === gridSize || position.y === 1 || position.y === gridSize;
}

// Move the Snake
function move() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    snake.unshift(head);

    // Check if snake eats food
    if(head.x === food.x && head.y === food.y){
        food = generateFood();
        increaseSpeed();
    }else{
        snake.pop();
    }

    // Wrap snake around borders
    if (head.x <= 0) head.x = gridSize;
    if (head.x > gridSize) head.x = 1;
    if (head.y <= 0) head.y = gridSize;
    if (head.y > gridSize) head.y = 1;
}

// Start game function
function gameStart() {
    gameStarted = true;
    instruction.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
       move();
       checkCollision();
       draw(); 
    }, gameSpeedDelay);
}

// Keypress event listener
function handleKeyPress(event) {
    if((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === ' ') ){
        gameStart();
    }else{
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;  
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

// Increase game speed
function increaseSpeed() {
    if(gameSpeedDelay > 150){
        gameSpeedDelay -= 5;
    }else if(gameSpeedDelay > 100){
        gameSpeedDelay -= 3;
    }else if(gameSpeedDelay > 50){
        gameSpeedDelay -= 2;
    }else if(gameSpeedDelay > 25){
        gameSpeedDelay -= 1;
    }
}

// Check collision with borders and self
function checkCollision() {
    const head = snake[0];

    // Check if snake touches itself
    for (let i = 1; i < snake.length; i++) {
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
            return;
        }
    }
}


// Reset game
function resetGame() {
    updateHighScore();
    stopGame();
    const currentScore = snake.length - 1;
    const message = `Game Over!\n\nYour Score: ${currentScore}\nHighest Score: ${highScore}`;
    alert(message);
    snake = [{ x:10, y:10 }];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}


// Update score
function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

// Stop game
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instruction.style.display = 'block';
    logo.style.display = 'block';
}

// Update high score
function updateHighScore() {
    const currentScore = snake.length - 1;
    if(currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3,'0');
    }
    highScoreText.style.display = 'block';
}

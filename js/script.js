const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const ground = new Image();
ground.src = 'img/ground.png';

const foodImg = new Image();
foodImg.src = 'img/food.png';

let box = 32;

let score = 0;

let food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * 17 + 1) * box,
        y: Math.floor(Math.random() * 15 + 3) * box
    }
}

let snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box
}

document.addEventListener('keydown', direction);

let direct;
let moving = false;

function direction(event) {
    if (moving) return;
    moving = true;

    if (event.keyCode === 37 && direct !== 'right') {
        direct = 'left';
    } else if (event.keyCode === 38 && direct !== 'down') {
        direct = 'up';
    } else if (event.keyCode === 39 && direct !== 'left') {
        direct = 'right';
    } else if (event.keyCode === 40 && direct !== 'up') {
        direct = 'down';
    }
}

function drawGame() {
    ctx.drawImage(ground, 0, 0);

    ctx.drawImage(foodImg, food.x, food.y);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = 'black';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    moving = false;

    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.fillText(score, box * 3, box * 1.6)

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    snake.pop();

    if (direct === 'left') {
        snakeX -= box;
        if (snakeX < box) snakeX = 17 * box;
    }
    if (direct === 'right') {
        snakeX += box;
        if (snakeX > 17 * box) snakeX = box;
    }
    if (direct === 'up') {
        snakeY -= box;
        if (snakeY < 3 * box) snakeY = 17 * box;
    }
    if (direct === 'down') {
        snakeY += box;
        if (snakeY > 17 * box) snakeY = 3 * box;
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    snake.unshift(newHead);
}

setInterval(drawGame, 150);

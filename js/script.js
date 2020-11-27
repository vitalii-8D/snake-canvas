const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const ground = new Image();
ground.src = 'img/ground.png';

const foodImg = new Image();
foodImg.src = 'img/food.png';

let box = 32;

let score = 0;

// initial snake
let snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box
}

// initial food
let food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
}

function generateFood() {
    let isTrueCoordinates;
    while (!isTrueCoordinates) {
        food = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box
        }

        isTrueCoordinates = !snake.find(chain => {
            return chain.x === food.x && chain.y === food.y;
        })
    }
}

// Direction
document.addEventListener('keydown', direction);

let direct;
let moving = false;

function direction(event) {
    if (moving) return;

    if (event.keyCode === 37 && direct !== 'right') {
        direct = 'left';
    } else if (event.keyCode === 38 && direct !== 'down') {
        direct = 'up';
    } else if (event.keyCode === 39 && direct !== 'left') {
        direct = 'right';
    } else if (event.keyCode === 40 && direct !== 'up') {
        direct = 'down';
    }

    moving = true;
}
// The same for clicks
const scrWidth = window.innerWidth;
const scrHeight = window.innerHeight;

document.addEventListener('click', directionByClick);
function directionByClick(event) {
    if (moving) return;
    const x = event.clientX;
    const y = event.clientY;

    if (x < scrWidth * 0.25 && (y > scrHeight * 0.25 && y < (scrHeight - scrHeight * 0.25)) && direct !== 'right') {
        direct = 'left';
    } else if ((x > scrWidth * 0.25 && x < (scrWidth - scrWidth * 0.25)) && y < scrHeight * 0.25 && direct !== 'down') {
        direct = 'up';
    } else if (x > (scrWidth - scrWidth * 0.25) && (y > scrHeight * 0.25 && y < (scrHeight - scrHeight * 0.25)) && direct !== 'left') {
        direct = 'right';
    } else if ((x > scrWidth * 0.25 && x < (scrWidth - scrWidth * 0.25)) && y > (scrHeight - scrHeight * 0.25) && direct !== 'up') {
        direct = 'down';
    }

    moving = true;
}

function drawGame() {
    ctx.drawImage(ground, 0, 0);

    ctx.drawImage(foodImg, food.x, food.y);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = 'black';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.fillText(score, box * 3, box * 1.6)

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Check end
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snakeX && snake[i].y === snakeY) {
            ctx.fillStyle = 'red';
            ctx.fillRect(snake[0].x, snake[0].y, box, box);

            ctx.fillStyle = 'red';
            ctx.font = '50px Arial';
            ctx.fillText('Game over!', box * 6, box * 1.6)

            intervalManager.clear();
        }
    }

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

    if (snakeX === food.x && snakeY === food.y) {
        let newBodyPart = {
            x: snake[snake.length - 1],
            y: snake[snake.length - 1]
        }
        snake.push(newBodyPart);

        score++;
        intervalManager.reset(10);
        generateFood();
    }

    snake.unshift(newHead);
    moving = false;
}

// Control of the game`s speed
function intervalSeter(startTime) {
    let timeout = startTime;
    let interval;

    function clear() {
        clearInterval(interval)
    }
    function set() {
        interval = setInterval(drawGame, timeout)
    }
    function reset(sub) {
        clearInterval(interval);
        timeout -= sub;
        this.set();
    }

    return {
        clear,
        set,
        reset
    }
}

let intervalManager = intervalSeter(300);
intervalManager.set();

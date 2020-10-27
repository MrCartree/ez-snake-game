const board_border = "black";
const board_background = "white";
const snake_col = "lightblue";
const snake_border = "dakblue";
const food_col = "lightgreen";
const food_border = "darkgreen";

let paused = false;

let snake = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 }
];

let score = 0;

let foodX;
let foodY;

// true if changing direction..
let changingDirection = false;
// horizontal velocity
let dx = 10;
// vertical velocity
let dy = 0;

// Gets the canvas which will hold the game
const snakeboard = document.getElementById("game-canvas");
// returns a 2 dimensional drawing context
const snakeboard_ctx = snakeboard.getContext("2d");

// starts the game
main();

genFood();

document.addEventListener("keydown", function(event) {
    if (event.keyCode === 80) {
        paused = !paused
    } else {
        changeDirection(event);
    }
});

// main function being written and called to keep game running.
function main() {

    if (gameHasEnded()) return;

    changingDirection = false

    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        if (!paused) {
            moveSnake();
        }
        drawSnake();

        main();
    }, 100)
}

function gameHasPaused() {
    return paused;
}

// draws the border of the canvas
function clearCanvas() {
    // sets background color of canvas
    snakeboard_ctx.fillStyle = board_background;
    // sets the border color around canvas
    snakeboard_ctx.strokestyle = board_border;
    // draw a "filled" rectangle to cover canvas
    snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
    // draw a "border" around the entire canvas
    snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

// draws the snake on the canvas.
function drawSnake() {
    // draws each part
    snake.forEach(drawSnakePart);
}

function drawFood() {
    snakeboard_ctx.fillStyle = food_col;
    snakeboard_ctx.strokestyle = food_border;
    snakeboard_ctx.fillRect(foodX, foodY, 10, 10);
    snakeboard_ctx.strokeRect(foodX, foodY, 10, 10);
}

// draws individual parts of snake
function drawSnakePart(snakepart) {
    // set the color of snake part
    snakeboard_ctx.fillStyle = snake_col;
    // set the border color of snake part
    snakeboard_ctx.strokestyle = snake_border;
    // draw a "filled" rectangle to represent the snake part at the coordinates
    snakeboard_ctx.fillRect(snakepart.x, snakepart.y, 10, 10);
    // draw a boarder around that snake part.
    snakeboard_ctx.strokeRect(snakepart.x, snakepart.y, 10, 10);
}

// determines if/when the game ends
function gameHasEnded() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > snakeboard.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakeboard.height -10;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
}

function randomFood(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}

function genFood() {
    // generate random number for the food x-coordinate
    foodX = randomFood(0, snakeboard.width - 10);
    // generates randome number for the food y-coordinate
    foodY = randomFood(0, snakeboard.height - 10);
    // if the food is where the snake currently is.. create a new food
    snake.forEach(function hasSnakeEatenFood(part) {
        const hasEaten = part.x == foodX && part.y == foodY;
        if (hasEaten) genFood();
    });
}


// function to change snake direction
function changeDirection(event) {
    const leftKey = 37;
    const upKey = 38;
    const rightKey = 39;
    const downKey = 40;

    // prevent the snake from reversing

    if(changingDirection) return;
    changingDirection = true;
    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === leftKey && !goingRight) {
        dx = -10;
        dy = 0;
    }

    if (keyPressed === upKey && !goingDown) {
        dx = 0;
        dy = -10;
    }

    if (keyPressed === rightKey && !goingLeft) {
        dx = 10;
        dy = 0;
    }

    if (keyPressed === downKey && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

// function to make the snake move continuously.
function moveSnake() {
    // creates new head for the snake and puts it at the top of the array
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    const hasEatenFood = snake[0].x === foodX && snake[0].y === foodY;
    if (hasEatenFood) {
        // add ten to score
        score += 10;
        // display score
        document.getElementById("score").innerHTML = score;
        // generate new foods
        genFood();
    } else {
        // removes last element from snake array.
        snake.pop();
    }
}

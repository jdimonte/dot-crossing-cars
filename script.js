/* global fill, textSize, collideRectCircle, rect, ellipse, keyCode, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, textSize, text, createCanvas, colorMode, HSB, random, width, height, background */

let backgroundColor, //color of background
  frogX, //horizontal position of frog
  frogY, //vertical position of frog
  score, //score of game
  lives, //number of lives left
  gameIsOver, //if game is over or not
  car1X,
  car1Y,
  car1V,
  car2X,
  car2Y,
  car2V,
  car3X,
  car3Y,
  car3V,
  car4X,
  car4Y,
  car4V,
  car5X,
  car5Y,
  car5V,
  carWidth,
  carHeight,
  frogDiameter,
  time,
  globalS,
  globalB,
  haveBoost,
  highScore,
  restartPossible;

function setup() {
  // Canvas & color settings
  createCanvas(500, 500);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 95;
  frogX = width / 2;
  frogY = height - 20;
  frogDiameter = 20;
  score = 0;
  lives = 3;
  gameIsOver = false;
  car1X = 0;
  car1Y = 100;
  car1V = 5;
  car2X = 0;
  car2Y = 270;
  car2V = 7;
  car3X = 0;
  car3Y = 430;
  car3V = 2;
  carWidth = 40;
  carHeight = 30;
  car4X = width;
  car4Y = 150;
  car4V = 6;
  car5X = width;
  car5Y = 350;
  car5V = 4;
  time = 0;
  haveBoost = false;
  globalS = 80;
  globalB = 100;
  highScore = 0;
  restartPossible = false;
}

function draw() {
  background(backgroundColor);
  drawGoalLine();
  drawFrog();
  moveCars();
  drawCars();
  drawBoost();
  checkCollisions();
  checkRoundWin();
  checkGameWin();
  checkIfGameOver();
  displayScores();
}

function keyPressed() {
  if (!gameIsOver) {
    if (keyCode === UP_ARROW) {
      frogY -= 15;
    }
    if (keyCode === DOWN_ARROW) {
      frogY += 15;
    }
    if (keyCode === RIGHT_ARROW) {
      frogX += 15;
    }
    if (keyCode === LEFT_ARROW) {
      frogX -= 15;
    }
    if (keyCode === 32 && haveBoost) {
      frogY -= 30;
    }
  }
  if (restartPossible) {
    if (keyCode === 82) {
      lives = 3;
      gameIsOver = false;
      background(backgroundColor);
      drawGoalLine();
      drawFrog();
      moveCars();
      drawCars();
      drawBoost();
      checkCollisions();
      checkRoundWin();
      checkGameWin();
      checkIfGameOver();
      displayScores();
    }
  }
}

// Our functions

function drawGoalLine() {
  fill(60, globalS, globalB);
  rect(0, 0, width, 50);
}

function drawFrog() {
  fill(120, globalS, globalB);
  ellipse(frogX, frogY, frogDiameter);
}

function drawBoost() {
  if (!haveBoost) {
    fill(200, 80, 100);
    rect(width / 4, height / 2 - 10, 20, 20);
  }
  if (
    collideRectCircle(
      width / 4,
      height / 2 - 10,
      20,
      20,
      frogX,
      frogY,
      frogDiameter
    )
  ) {
    haveBoost = true;
  }
}

function moveCars() {
  // Move the car
  car1X += car1V;
  // Reset if it moves off screen
  if (car1X > width) {
    car1X = -carWidth;
  }

  car2X += car2V;
  if (car2X > width) {
    car2X = -carWidth;
  }

  car3X += car3V;
  if (car3X > width) {
    car3X = -carWidth;
  }

  car4X -= car4V;
  if (car4X < 0) {
    car4X = width + carWidth;
  }

  car5X -= car5V;
  if (car5X < 0) {
    car5X = width + carWidth;
  }
}

function drawCars() {
  // Code for car 1
  fill(0, 80, 100);
  rect(car1X, car1Y, carWidth, carHeight);
  // Code for additional cars
  fill(50, 80, 100);
  rect(car2X, car2Y, carWidth, carHeight);
  //car3
  fill(280, 80, 100);
  rect(car3X, car3Y, carWidth, carHeight);
  if (score >= 1) {
    fill(180, 80, 100);
    rect(car4X, car4Y, carWidth, carHeight);
  }
  if (score >= 2) {
    fill(240, 80, 100);
    rect(car5X, car5Y, carWidth, carHeight);
  }
}

function checkCollisions() {
  // If the frog collides with the car, reset the frog and subtract a life.
  //let hasCarCollidedWithFrog = collideRectCircle(car1X, car1Y, carWidth, carHeight, frogX, frogY, frogDiameter);
  //if(hasCarCollidedWithFrog) {
  if (
    collideRectCircle(
      car1X,
      car1Y,
      carWidth,
      carHeight,
      frogX,
      frogY,
      frogDiameter
    ) ||
    collideRectCircle(
      car2X,
      car2Y,
      carWidth,
      carHeight,
      frogX,
      frogY,
      frogDiameter
    ) ||
    collideRectCircle(
      car3X,
      car3Y,
      carWidth,
      carHeight,
      frogX,
      frogY,
      frogDiameter
    )
  ) {
    resetFrog();
    lives--;
  }
  if (score >= 1) {
    if (
      collideRectCircle(
        car4X,
        car4Y,
        carWidth,
        carHeight,
        frogX,
        frogY,
        frogDiameter
      )
    ) {
      resetFrog();
      lives--;
    }
  }
  if (score >= 2) {
    if (
      collideRectCircle(
        car5X,
        car5Y,
        carWidth,
        carHeight,
        frogX,
        frogY,
        frogDiameter
      )
    ) {
      resetFrog();
      lives--;
    }
  }
}

function checkRoundWin() {
  // If the frog makes it into the yellow gold zone, increment the score
  if (frogY < 50) {
    score++;
    resetFrog();
  }
  // and move the frog back down to the bottom.
  textSize(12);
  fill(0);
  if (score === 0) {
    text("ROUND 1", width / 2 - 40, 30);
  } else if (score === 1) {
    text("ROUND 2", width / 2 - 40, 30);
  } else if (score === 2) {
    text("ROUND 3", width / 2 - 40, 30);
  }
}

function checkGameWin() {
  if (score < 3) {
    time++;
    restartPossible = true;
  }
  if (score >= 3) {
    handleHighScore(time);
    background(95);
    fill(0);
    textSize(50);
    text("You Won!", 10, 80);
    //text("High Score: " + highScore, 10, 120);
    text("Your Time: " + time, 10, 160);
    //text("Press R to Play Again!", 10, 200);
  }
  if (lives === 0) {
    background(95);
    fill(0);
    textSize(50);
    text("Press R to Play Again!", 140, height / 2 + 300);
  }
}

function checkIfGameOver() {
  if (lives <= 0) {
    restartPossible = true;
    gameIsOver = true;
  }
}

function resetFrog() {
  frogX = width / 2;
  frogY = height - 20;
}

function handleHighScore(yourScore) {
  if (yourScore > highScore) {
    highScore = yourScore;
  }
}

function displayScores() {
  if (lives > 0 && score < 3) {
    textSize(12);
    fill(0);
    // Display Lives
    text(`Lives: ${lives}`, 10, 20);
    // Display Score
    text(`Time: ${time}`, 10, 40);
    // Display game over message if the game is over
  }
  if (gameIsOver) {
    text("Game Over!", 10, 80);
    text("Press R to Play Again!", 10, 120);
  }
}

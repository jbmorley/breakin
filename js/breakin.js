/*
 * BreakIn
 * Copyright (c) 2006, Jason Barrie Morley
 */

/* Global Varibles */

// Game settings.
var gridHeight; var gridWidth;
var blockWidth; var blockHeight;
var blockSeparator; var ballSize;
var screenWidth; var screenHeight;
var batHeight; var batWidth;

// Current Game State.
var dragX; var dragY;
var incX; var incY;
var ballPrevX1; var ballPrevX2;
var ballPrevY1; var ballPrevY2;
var batX; var batY;
var started;

// Keyboard.
var keyLeft = false;
var keyRight = false;
var keySpeed = false;

// Score.
var points; var score; var multiplier; var lives;

// Array to store the state of the grid.
var state = new Array();

/* Initialization */

// Set the key handler.
document.onkeypress = keyHandler;
document.onkeydown = keyDown;
document.onkeyup = keyUp;

/* Public Functions */

function BreakIn(aGridHeight, aGridWidth, aBlockHeight, aBlockWidth, aBlockSep, aBallSize, aBatHeight, aBatWidth) {

    // Set up the initial game parameters.
    gridHeight = aGridHeight;
    gridWidth = aGridWidth;
    blockHeight = aBlockHeight;
    blockWidth = aBlockWidth;
    blockSeparator = aBlockSep;
    ballSize = aBallSize;
    batHeight = aBatHeight;
    batWidth = aBatWidth;

    // Set up the calculated parameters.
    screenWidth = ((blockWidth + blockSeparator) * gridWidth) + blockSeparator;
    screenHeight = (((blockHeight + blockSeparator) * gridHeight) + blockSeparator) * 2.5;

    // Set up all the initial state.
    ResetScore();
    ResetBall();
    ResetBat();

    // Draw all the bricks.
    DrawBricks();
    ResetBricks();

    // Display the score etc.
    DisplayInfo();
    DisplayText("Press 'space' to continue.");

}

/* Private Functions */

/*
Reset Functions.
These functions are used to set and reset the state of the game.
There is a reset function for each individual aspect of the game.  This is done
so that different elements may be reset at different stages.  For example, some
elements will not need resetting if a life is lost, but would need resetting for
a new game...
*/

// Set the starting parameters for the ball.
// This function should be called every time a life is lost
// and the game restarted.
function ResetBall() {

    // Set the ball's initial position.
    dragX = (screenWidth / 2) - (ballSize / 2);
    dragY = (screenHeight / 2) - (ballSize / 2);

    // Set the ball's initial direction.
    incX = 1;
    incY = 1;

    // Information relating to the initial position.
    ballPrevX1 = getBlockX(dragX);
    ballPrevX2 = getBlockX(dragX + ballSize);
    ballPrevY1 = getBlockY(dragY);
    ballPrevY2 = getBlockY(dragY + ballSize);

    // Actually put the ball in it's initial position.
    var ball = document.getElementById('ball');
    if (ball) {
        ball.style.top = dragY;
        ball.style.left = dragX;
    }
        
}

// Set the initial scoring parameters.
function ResetScore() {
    points = 100;
    score = 0;
    multiplier = 1;
    lives = 3;
}

// Set the initial bat position.
function ResetBat() {

    // Calculate the bat's position.
    batX = (screenWidth / 2) - (batWidth / 2);
    batY = screenHeight - blockSeparator - batHeight;

    // Set the bat's position.
    var bat = document.getElementById('bat');
    if (bat) {
        bat.style.left = batX
        bat.style.top = batY;
    }

}

function ResetBricks() {
    for(y=0; y<gridHeight; y++) {
        state[y] = new Array();
        for(x=0; x<gridWidth; x++) {
            state[y][x] = 1;
            var brick = document.getElementById(x + ',' + y);
            brick.style.left = ((blockWidth + blockSeparator) * x) + blockSeparator;
            brick.style.top = ((blockHeight + blockSeparator) * y) + blockSeparator;
            brick.style.visibility = 'visible';
        }
    }
}

/*
Drawing Functions.
*/

function DrawBricks() {
    var bricks = document.getElementById('bricks');
    bricks.style.height = screenHeight + 2;;
    bricks.style.width = screenWidth + 2;
    
    for(y=0; y<gridHeight; y++) {
        for(x=0; x<gridWidth; x++) {
            bricks.innerHTML = bricks.innerHTML + '<div class="brick" id="' + x + ',' + y + '"></div>';
        }
    }
}

// Drawing function - recursively called.
function Bounce() {

    // Move the bat.
    var batMultiplier = 1;
    if (keySpeed) { batMultiplier = 2; }
    
    if (keyLeft && !keyRight) {
        moveBat(-1 * batMultiplier);    
    } else if (keyRight && !keyLeft) {
        moveBat(1 * batMultiplier);
    }

    var item = document.getElementById('ball');
    dragX += incX; dragY += incY;
    if (dragX <= 0 || dragX + ballSize >= screenWidth) {
        incX = incX * -1;
    }
    if (dragY <= 0) {
        incY = incY * -1;
    }
    brickCollision();
    batCollision();
    item.style.top = dragY;
    item.style.left = dragX;
    if (dragY + ballSize < screenHeight) {
        setTimeout('Bounce();',10);
    } else {
        lives--;
        if (lives > 0) {

        } else {
            ResetBall();
            ResetBat();
            ResetBricks();
            ResetScore();
        }
        DisplayInfo();
        DisplayText("Press 'space' to continue.");        
        started = 0;
    }
}

/* Collision Functions */

// These functions are called every time the ball is moved to calculate any neccessary bouncing.

function batCollision() {

    // We only need to handle the bottom two corners here.
    // TODO: This is a lie... all four corners will need to be handled at some
    // point.
    var ballX1 = dragX;
    var ballX2 = dragX + ballSize;
    var ballY2 = dragY + ballSize;

    // However, let's initially consider the middle of the ball
    // as this is the easiest way to work out appropriate deflection angle.
    var ballXMid = dragX + (ballSize / 2);

    // Check the middle.
    if ((ballY2 >= batY) && (ballY2 <= batY + 1) && (incY > 0) && (ballX2 >= batX) && (ballX1 <= (batX + batWidth))) {

        incY = incY * -1;
        
        // Work out the offset of the middle from the edge of the bat.
        var batXMid = batX + (batWidth / 2);
        var fromMiddle = batXMid - ballXMid;
        var normalize = Math.abs(fromMiddle / ((batWidth / 2) + (ballSize / 2)));
        
        var acceleration = 1;
        var fractionAdd = normalize * acceleration;
        var fractionMin = acceleration - fractionAdd;

        // Now, use this to accelerate the ball as appropriate.
        // Obviously, if the bat hits in the middle, it makes no difference.
        if (fromMiddle < 0) {
            // Hit on the right side.
            if (incX > 0) {
                // Acceleration.
                incX = incX + (incX * fractionAdd);
            } else if (incX < 0) {
                // Decceleration.
                incX = incX - (incX * fractionMin);
            }
        } else if (fromMiddle > 0) {
            // Hit on the left side.
            if (incX > 0) {
                // Decceleration.
                incX = incX - (incX * fractionMin);
            } else if (incX < 0) {
                // Acceleration.
                incX = incX + (incX * fractionAdd);
            }
        }

        // TODO Remove this line at some point?
        // incX = incX * ((Math.abs(batX + (batWidth / 2) - ballX1) / batWidth) * 20);
        
    }
}

function brickCollision() {

    var boxX = dragX;
    var boxY = dragY;

    // There are four corners which need to be checked for collision.
    // There is a potential for some optimisation here by taking into consideration
    // which direction the ball is travelling and then only checking at most 2 corners.
    
    // Firstly, convert the position of the box to brick co-ordinates.
    var intX = getBlockX(boxX);
    var intY = getBlockY(boxY);

    // Get the coordinates for all four corners.
    var ballX1 = getBlockX(boxX);
    var ballX2 = getBlockX(boxX + ballSize);
    var ballY1 = getBlockY(boxY);
    var ballY2 = getBlockY(boxY + ballSize);

    // Write this information for feedback.
    // var feedback = document.getElementById('feedback');
    // feedback.innerHTML = 'Top Left: ' + ballX1 + ',' + ballY1 + '<br/>' + 'Bottom Left: ' + ballX1 + ',' + ballY2 + '<br/>' + 'Top Right: ' + ballX2 + ',' + ballY1 + '<br/>' + 'Bottom Right: ' + ballX2 + ',' + ballY2;
    
    // First, check to see if the top corner is in a visible
    // block. If so, then work out which of the two directions
    // needs changing.  N.B. It may sometimes be neccessary to change
    // both!
    var brick = getBrick(ballX1, ballY1);
    if ((brick) && (state[ballY1][ballX1] == 1)) {
        brick.style.visibility = 'hidden';
        state[ballY1][ballX1] = 0;
        incrementScore();

        // Works out which transition caused the 'hit'.
        if (ballX1 != ballPrevX1) {
            incX = incX * -1;
        }
        if (ballY1 != ballPrevY1) {
            incY = incY * -1;
        }
    }

    ballPrevX1 = ballX1;
    ballPrevX2 = ballX2;
    ballPrevY1 = ballY1;
    ballPrevY2 = ballY2;

}

function getBlockX(x) {
    var realX = (x - blockSeparator) / (blockWidth + blockSeparator);
    return parseInt(realX);
}

function getBlockY(y) {
    var realY = (y - blockSeparator) / (blockHeight + blockSeparator);
    return parseInt(realY);
}

function getBrick(x,y) {
    var brick = document.getElementById(x + ',' + y);
    return brick;
}

function incrementScore() {
    score = score + (points * multiplier);
    DisplayInfo();
}

function DisplayInfo() {
    var info = document.getElementById('info');
    if (info) {
        info.innerHTML = '<table><tr><th>Score</th><td>' + score + '</td></tr><tr><th>Lives</th><td>' + lives + '</td></tr></table>';
    }
}

function DisplayText(string) {
    var text = document.getElementById('text');
    if (text) {
        text.innerHTML = string;    
    }
}

function keyHandler(e) {
    var key;
    try {
      key = e.which;
    } catch (error) {
      try {
        key = e.keyCode;
      } catch (error) {
        key = event.keyCode;
      }
    }
    if (!started && (key == 32)) {
        started = 1;
        ResetBall();
        ResetBat();        
        DisplayText("Hold down 's' for more speed.");
        Bounce();
    }
}

function keyDown(e) {
    var key;
    try {
      key = e.which;
    } catch (error) {
      try {
        key = e.keyCode;
      } catch (error) {
        key = event.keyCode;
      }
    }
    if (key == 63234 || key == 37) {
        // Left.
        keyLeft = true;
    } else if (key == 63235 || key == 39) {
        // Right.
        keyRight = true;
    } else if (key == 83 || key == 115) {
        // Speed (s).
        keySpeed = true;
    }
}

function keyUp(e) {
    var key;
    try {
      key = e.which;
    } catch (error) {
      try {
        key = e.keyCode;
      } catch (error) {
        key = event.keyCode;
      }
    }
    if (key == 63234 || key == 37) {
        // Left.
        keyLeft = false;
    } else if (key == 63235 || key == 39) {
        // Right.
        keyRight = false;
    } else if (key == 83 || key == 115) {
        // Speed (s).
        keySpeed = false;
    }}

function moveBat(amount) {
    if (((batX + amount) >= 0) && ((batX + amount) <= (screenWidth - batWidth))) {
        batX = batX + amount;
        var bat = document.getElementById('bat');
        if (bat) {
            bat.style.left = batX;
        }
    }
}

/*

P5 is being used.

p5 calls preload as the page loads,
setup once when the page loads,
and draw once every frame.

*/

// Global variables

let score;
let lives;
/**
 * @type { "running" | "gameOver"}
 */
let state;
let fallingObjects;
let fallingObjectSpawnTimeout;

let player;
let stars;

let fallingObjectImage;
let spaceshipImage;

const starCount = 256;

function resetGame() {
    score = 0;
    lives = 5;
    state = "running"
    fallingObjects = [];
    fallingObjectSpawnTimeout = Date.now() + random(0, 500);
}

function preload() {
    // load assets for main game - fuel, spaceship pngs
    fallingObjectImage = loadImage("assets/fuel.png");
    spaceshipImage = loadImage("assets/spaceship.png");
}

function setup() {
    createCanvas(800, 600);

    // reset all game values to defaults
    resetGame();

    // initialise star array
    stars = new Array();

    // populate star array
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star(Math.random() * width, Math.random() * height));
    }

    // Create player
    player = new Player(spaceshipImage);
}

function draw() {

    // main game-loop
    // 1) process inputs
    // 2) update game world
    // 3) draw objects

    stars.forEach(star => {
        star.update();
    });

    player.update();

    if (state === "running") {
        if (fallingObjectSpawnTimeout <= Date.now()) {
            fallingObjects.push(new FallingObject(Math.random() * (width - objectFallingSize * 2) + objectFallingSize, fallingObjectImage));
            fallingObjectSpawnTimeout = Date.now() + random(1500, 3000);
        }

        // Update falling objects
        fallingObjects = fallingObjects.filter((object) => {
            object.update()
            // If offscreen, remove a live, check for 0 lives, die.
            if (object.position.y > height + objectFallingSize) {
                lives -= 1;
                if (lives < 0) {
                    state = "gameOver";
                }
                return false;
            }

            // Check for collisions with the player, add score
            if (
                ( // Object is within the X coordinates of the player
                    (player.position.x < (object.position.x + objectFallingSize)) &&
                    ((player.position.x + playerSize) > object.position.x)
                ) &&
                ( // Object is touching the Y coordinates of the player
                    (player.position.y < (object.position.y + objectFallingSize)) &&
                    ((player.position.y + playerSize) > object.position.y)
                )
            ) {
                score += 1;
                return false;
            }
            return true;
        })
    }



    // 3) draw objects
    background("#2d2d2d");

    stars.forEach(star => {
        star.draw();
    });

    fallingObjects.forEach((object) => {
        object.draw();
    })

    player.draw();



    // draw score
    if (state === "running") {
        push();

        textAlign(LEFT, TOP);
        textSize(20);
        strokeWeight(1.5);
        fill("#5050FF");
        text("Score: " + score, 15, 40)
        text("Lives: " + lives + "/5", 15, 15);
        text("A/D to move horizontally", width - 228, 15);

        pop();
    }

    // draw death screen
    if (state === "gameOver") {
        push();

        textAlign(CENTER, CENTER);
        textSize(32);
        strokeWeight(2);
        fill("#FF5050");
        text("YOU DIED!", width / 2, height / 3);


        textAlign(CENTER, CENTER);
        textSize(24);
        strokeWeight(2);
        fill("#50F050");
        text("Score: " + score, width / 2, height / 2);

        textAlign(CENTER, CENTER);
        textSize(24);
        strokeWeight(2);
        fill("#F0F0F0");
        text("SPACE TO RESTART", width / 2, (height / 3) * 2);


        pop()

    }

}

function keyPressed() {
    if (key == ' ') {
        if (state === "gameOver") {
            resetGame();
            state = "running";
        }
    }
}
const starMaxSize = 4;
const starVerticalSpeed = 2;

class Star {
    constructor(x, y) {
        this.position = new Vector2(x, y);
        this.size = Math.random() * starMaxSize;
    }

    update() {

        // move the star down based on its size for parallax effect
        // (a larger star is "closer" so it moves faster)
        this.position.y += starVerticalSpeed * (this.size / starMaxSize);

        // teleport star to top of screen to reuse if out of bounds
        if (this.position.y > height + starMaxSize) {
            this.position.y = -starMaxSize;
        }
    }

    draw() {
        push();

        noStroke();
        // colour the star based on its size - the larger (the closer), the brighter
        fill(this.size / starMaxSize * 255);
        circle(this.position.x, this.position.y, this.size);
        // draw a secondary (closer) smaller circle just above the star for a droplet effect
        circle(this.position.x, this.position.y - 2, this.size / 2);

        pop();
    }
}
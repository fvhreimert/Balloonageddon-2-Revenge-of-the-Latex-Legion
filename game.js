// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Function to update canvas size
function updateCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Set initial canvas size
updateCanvasSize();

// Listen for window resize events
window.addEventListener("resize", updateCanvasSize);

// Game parameters
const FPS = 60;
const BALLOON_RISE_SPEED = 2; // Pixels per frame
const BALLOON_SPAWN_INTERVAL = 100; // Frames between spawns
let poppedCount = 476823;
let frameCount = 0;

// Balloon images (replace with your image paths)
const balloonImages = [];
for (let i = 1; i <= 6; i++) {
    const img = new Image();
    img.src = `assets/balloon${i}.png`; // Replace with actual paths
    img.onload = () => {
        // Scale images to 180x240
        const scaledWidth = 180;
        const scaledHeight = 240;
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = scaledWidth;
        tempCanvas.height = scaledHeight;
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
        balloonImages.push(tempCanvas);
    };
}

// Pop sound (replace with your sound file)
const popSound = new Audio("assets/pop_sound.wav"); // Replace with actual path

// List to hold active balloons
let balloons = [];

// Function to spawn a new balloon
function spawnBalloon() {
    const balloonImg = balloonImages[Math.floor(Math.random() * balloonImages.length)];
    const rect = {
        x: Math.random() * (canvas.width - balloonImg.width),
        y: canvas.height,
        width: balloonImg.width,
        height: balloonImg.height
    };
    balloons.push({ image: balloonImg, rect });
}

// Main game loop
function gameLoop() {
    // 1. Handle events (mouse clicks)
    canvas.addEventListener("click", (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        for (let i = balloons.length - 1; i >= 0; i--) {
            const balloon = balloons[i];
            if (
                mouseX >= balloon.rect.x &&
                mouseX <= balloon.rect.x + balloon.rect.width &&
                mouseY >= balloon.rect.y &&
                mouseY <= balloon.rect.y + balloon.rect.height
            ) {
                balloons.splice(i, 1);
                poppedCount++;
                popSound.play();
                break; // Pop only one balloon per click
            }
        }
    });

    // 2. Spawn balloons at regular intervals
    frameCount++;
    if (frameCount >= BALLOON_SPAWN_INTERVAL) {
        spawnBalloon();
        frameCount = 0;
    }

    // 3. Update balloon positions (move upward)
    for (let i = balloons.length - 1; i >= 0; i--) {
        balloons[i].rect.y -= BALLOON_RISE_SPEED;
        // Remove balloon if it moves off the top of the screen
        if (balloons[i].rect.y + balloons[i].rect.height < 0) {
            balloons.splice(i, 1);
        }
    }

    // 4. Draw everything
    ctx.fillStyle = "#191919"; // Dark grey background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const balloon of balloons) {
        ctx.drawImage(balloon.image, balloon.rect.x, balloon.rect.y);
    }

    // Render the score
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText(`Popped: ${poppedCount}`, 10, 40);

    // 5. Request the next frame
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Function to update canvas size and handle device pixel ratio
function updateCanvasSize() {
    const dpr = window.devicePixelRatio || 1;

    // Set the canvas size in CSS pixels
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    // Set the canvas size in device pixels
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    // Scale the context to account for the device pixel ratio
    ctx.scale(dpr, dpr);
}

// Set initial canvas size
updateCanvasSize();

// Listen for window resize events
window.addEventListener("resize", updateCanvasSize);

// Game parameters
const FPS = 60;
const BALLOON_RISE_SPEED = 2; // Pixels per frame
const BALLOON_SPAWN_INTERVAL = 110; // Frames between spawns
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
        x: Math.random() * (window.innerWidth - balloonImg.width),
        y: window.innerHeight,
        width: balloonImg.width,
        height: balloonImg.height,
        wobbleOffset: Math.random() * 100 // Random starting point for wobble
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

    // 3. Update balloon positions (move upward and wobble)
    for (let i = balloons.length - 1; i >= 0; i--) {
        const balloon = balloons[i];
        balloon.rect.y -= BALLOON_RISE_SPEED;

        // Wobble effect: Adjust x position using a sine wave
        balloon.rect.wobbleOffset += 0.05; // Speed of wobble
        balloon.rect.x += Math.sin(balloon.rect.wobbleOffset) * 0.5; // Wobble intensity

        // Remove balloon if it moves off the top of the screen
        if (balloon.rect.y + balloon.rect.height < 0) {
            balloons.splice(i, 1);
        }
    }

    // 4. Draw everything
    ctx.fillStyle = "#191919"; // Dark grey background
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

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
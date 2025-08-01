const bird = document.getElementById("bird");
const container = document.querySelector(".game-container");
const scoreEl = document.getElementById("score");
const message = document.getElementById("message");

let birdTop = 250;
let gravity = 2;
let isGameOver = false;
let gameStarted = false;
let score = 0;
let pipes = [];

function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  message.style.display = "none";
  birdTop = 250;
  bird.style.top = birdTop + "px";
  score = 0;
  scoreEl.textContent = score;
  pipes.forEach(p => p.remove());
  pipes = [];

  gameLoop();
  pipeGenerator = setInterval(addPipe, 1500);
}

function gameLoop() {
  if (isGameOver) return;

  birdTop += gravity;
  bird.style.top = birdTop + "px";

  if (birdTop > 560 || birdTop < 0) {
    endGame();
    return;
  }

  pipes.forEach(pipe => {
    const pipeLeft = parseInt(pipe.style.left);
    pipe.style.left = pipeLeft - 2 + "px";

    if (pipeLeft < -60) {
      pipe.remove();
      pipes = pipes.filter(p => p !== pipe);
      if (pipe.classList.contains("top")) score++;
    }

    const birdRect = bird.getBoundingClientRect();
    const pipeRect = pipe.getBoundingClientRect();

    if (
      birdRect.left < pipeRect.right &&
      birdRect.right > pipeRect.left &&
      birdRect.top < pipeRect.bottom &&
      birdRect.bottom > pipeRect.top
    ) {
      endGame();
    }
  });

  scoreEl.textContent = score;
  requestAnimationFrame(gameLoop);
}

function addPipe() {
  const gap = 150;
  const minHeight = 50;
  const maxHeight = 300;
  const topHeight = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
  const bottomHeight = 600 - gap - topHeight;

  const topPipe = document.createElement("div");
  topPipe.classList.add("pipe", "top");
  topPipe.style.height = topHeight + "px";
  topPipe.style.left = "360px";

  const bottomPipe = document.createElement("div");
  bottomPipe.classList.add("pipe", "bottom");
  bottomPipe.style.height = bottomHeight + "px";
  bottomPipe.style.left = "360px";

  container.appendChild(topPipe);
  container.appendChild(bottomPipe);
  pipes.push(topPipe, bottomPipe);
}

function flap() {
  if (!gameStarted) return startGame();
  if (isGameOver) return;
  birdTop -= 40;
}

function endGame() {
  isGameOver = true;
  clearInterval(pipeGenerator);
  message.textContent = `Game Over! Score: ${score}. Press Space or Tap to Restart.`;
  message.style.display = "inline-block";
  gameStarted = false;
  isGameOver = false;
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") flap();
});

document.addEventListener("click", flap);

const batata = document.getElementById("batata");
const knife = document.getElementById("knife");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const gameOverScreen = document.getElementById("gameOverScreen");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hamburgerMenu = document.getElementById("hamburgerMenu");
const pauseMenu = document.getElementById("pauseMenu");
const livesDisplay = document.getElementById("lives");

const deathSound = new Audio('sounds/killsound.mp3');
const bgSound = new Audio('sounds/sound.mp3');
bgSound.loop = true;
bgSound.volume = 0.4;

bgSound.play().catch(() => {});
document.addEventListener('click', () => bgSound.play());
document.addEventListener('keydown', () => bgSound.play());

let isJumping = false;
let score = 0;
let knifeSpeed = 12;
let knifeInterval;
let isPaused = false;
let lives = 3;
let highScore = localStorage.getItem("batataHighScore") || 0;
highScoreDisplay.textContent = "High Score : " + highScore;

const jumpHeight = 199;
const jumpSpeed = 8;
const intervalTime = 20;

function updateLivesDisplay() {
    livesDisplay.textContent = "Vies : " + "❤️".repeat(lives);
}

function jump() {
    if (isJumping || isPaused) return;
    isJumping = true;
    let position = parseInt(batata.style.bottom) || 0;

    // Change image en mode saut
    batata.style.background = "url('batatajump.png') no-repeat center/cover";

    batata.style.transform = "rotate(-20deg)";
    const upInterval = setInterval(() => {
        if (position >= jumpHeight) {
            clearInterval(upInterval);
            const downInterval = setInterval(() => {
                if (position <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                    batata.style.transform = "rotate(0deg)";
                    // Revenir en mode run
                    batata.style.background = "url('batatarun.png') no-repeat center/cover";
                } else {
                    position -= jumpSpeed;
                    batata.style.bottom = position + "px";
                    batata.style.transform = `rotate(${position / jumpHeight * 20}deg)`;
                }
            }, intervalTime);
        } else {
            position += jumpSpeed;
            batata.style.bottom = position + "px";
        }
    }, intervalTime);
}

function moveKnife() {
    let knifePosition = 1000;
    knife.style.left = knifePosition + "px";
    knifeInterval = setInterval(() => {
        if (isPaused) return;
        knifePosition -= knifeSpeed;
        knife.style.left = knifePosition + "px";
        const batataRect = batata.getBoundingClientRect();
        const knifeRect = knife.getBoundingClientRect();
        if (
            knifeRect.left < batataRect.right &&
            knifeRect.right > batataRect.left &&
            knifeRect.top < batataRect.bottom &&
            knifeRect.bottom > batataRect.top
        ) {
            if (lives > 1) {
                lives--;
                updateLivesDisplay();
                knifePosition = 1000;
            } else {
                clearInterval(knifeInterval);
                gameOver();
            }
        }
        if (knifePosition < -50) {
            knifePosition = 1000;
            score++;
            scoreDisplay.textContent = "Score : " + score;
            checkLevel(score);
        }
    }, 20);
}

function checkLevel(score) {
    if (score === 10) {
        knifeSpeed += 2;
        document.body.style.backgroundImage = "url('garden.jpg')";
    }
    if (score === 20) {
        knifeSpeed += 2;
        document.body.style.backgroundImage = "url('lab.jpg')";
    }
    if (score === 30) {
        knifeSpeed += 3;
        document.body.style.backgroundImage = "url('hell.jpg')";
    }
}

function gameOver() {
    bgSound.pause();
    bgSound.currentTime = 0;
    deathSound.currentTime = 0;
    deathSound.play();
    // Image spéciale ou batatajump.png
    batata.style.background = "url('batatajump.png') no-repeat center/cover";
    batata.style.width = "80px";
    batata.style.height = "80px";
    batata.style.bottom = "0px";
    gameOverScreen.style.display = "flex";
    updateHighScore();
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("batataHighScore", highScore);
        highScoreDisplay.textContent = "High Score : " + highScore;
    }
}

noBtn.addEventListener('click', () => {
    window.location.href = 'home.html';
});

yesBtn.addEventListener('click', () => {
    gameOverScreen.style.display = 'none';
    score = 0;
    knifeSpeed = 12;
    lives = 3;
    scoreDisplay.textContent = "Score : 0";
    batata.style.bottom = "0px";
    batata.style.width = "80px";
    batata.style.height = "80px";
    batata.style.background = "url('batatarun.png') no-repeat center/cover";
    document.body.style.backgroundImage = "url('kitchen.jpg')";
    updateLivesDisplay();
    moveKnife();
    bgSound.play();
});

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") jump();
    if (e.code === "Escape") {
        if (pauseMenu.style.display === "flex") {
            resumeGame();
        } else {
            showPauseMenu();
        }
    }
});
batata.addEventListener("click", jump);
batata.addEventListener("touchstart", jump);

batata.style.bottom = "0px";
knife.style.left = "1000px";
updateLivesDisplay();
moveKnife();

function toggleHamburgerMenu() {
    const isVisible = hamburgerMenu.style.display === "flex";
    hamburgerMenu.style.display = isVisible ? "none" : "flex";
    isPaused = !isVisible;
}

function goHome() {
    window.location.href = "home.html";
}

function toggleMode() {
    alert("Changement de mode activé !");
}

function showPauseMenu() {
    isPaused = true;
    pauseMenu.style.display = "flex";
    bgSound.pause();
}

function resumeGame() {
    isPaused = false;
    pauseMenu.style.display = "none";
    bgSound.play();
}

function restartGame() {
    location.reload();
}

function quitGame() {
    window.location.href = "home.html";
}
// 자동차 점프 게임
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 캔버스 크기 설정
function resizeCanvas() {
    const wrapper = canvas.parentElement;
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 게임 변수
let gameRunning = false;
let gamePaused = false;
let score = 0;
let highScore = localStorage.getItem('jumpGameHighScore') || 0;
let gameSpeed = 5;
let frameCount = 0;

// 최고 점수 표시
document.getElementById('highScore').textContent = highScore;

// 자동차 객체
const car = {
    x: 100,
    y: 0,
    width: 60,
    height: 40,
    velocityY: 0,
    gravity: 0.6,
    jumpPower: -12,
    isJumping: false,
    rotation: 0,
    
    get groundY() {
        return canvas.height - 80 - this.height;
    },
    
    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.font = `${this.width}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🚗', 0, 0);
        ctx.restore();
    },
    
    update() {
        // 중력 적용
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        
        // 지면 체크
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.velocityY = 0;
            this.isJumping = false;
            this.rotation = 0;
        } else {
            // 공중에서 회전
            this.rotation = Math.min(this.velocityY * 0.05, Math.PI / 6);
        }
    },
    
    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpPower;
            this.isJumping = true;
        }
    },
    
    reset() {
        this.y = this.groundY;
        this.velocityY = 0;
        this.isJumping = false;
        this.rotation = 0;
    }
};

// 장애물 배열
let obstacles = [];

class Obstacle {
    constructor() {
        this.width = 40;
        this.height = 40;
        this.x = canvas.width;
        this.y = canvas.height - 80 - this.height;
        this.passed = false;
    }
    
    draw() {
        ctx.font = `${this.width}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🪨', this.x + this.width / 2, this.y + this.height / 2);
    }
    
    update() {
        this.x -= gameSpeed;
    }
    
    isOffScreen() {
        return this.x + this.width < 0;
    }
    
    collidesWith(car) {
        return (
            car.x < this.x + this.width - 10 &&
            car.x + car.width > this.x + 10 &&
            car.y < this.y + this.height - 10 &&
            car.y + car.height > this.y + 10
        );
    }
}

// 구름 배열 (배경 장식)
let clouds = [];

class Cloud {
    constructor() {
        this.x = canvas.width + Math.random() * 200;
        this.y = Math.random() * (canvas.height / 2 - 50);
        this.speed = 1 + Math.random() * 2;
        this.emoji = ['☁️', '☁️', '⛅'][Math.floor(Math.random() * 3)];
    }
    
    draw() {
        ctx.font = '40px Arial';
        ctx.fillText(this.emoji, this.x, this.y);
    }
    
    update() {
        this.x -= this.speed;
        if (this.x < -50) {
            this.x = canvas.width + 50;
            this.y = Math.random() * (canvas.height / 2 - 50);
        }
    }
}

// 초기 구름 생성
function initClouds() {
    clouds = [];
    for (let i = 0; i < 5; i++) {
        const cloud = new Cloud();
        cloud.x = Math.random() * canvas.width;
        clouds.push(cloud);
    }
}

// 배경 그리기
function drawBackground() {
    // 하늘 (그라디언트)
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height / 2);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#98D8E8');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
    
    // 땅 (그라디언트)
    const groundGradient = ctx.createLinearGradient(0, canvas.height / 2, 0, canvas.height);
    groundGradient.addColorStop(0, '#90EE90');
    groundGradient.addColorStop(1, '#7CCD7C');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
    
    // 도로 (지면)
    ctx.fillStyle = '#555';
    ctx.fillRect(0, canvas.height - 80, canvas.width, 10);
    
    // 도로 중앙선
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 15]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 75);
    ctx.lineTo(canvas.width, canvas.height - 75);
    ctx.stroke();
    ctx.setLineDash([]);
}

// 점수 표시
function drawScore() {
    ctx.fillStyle = '#2d3436';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`점수: ${Math.floor(score)}`, canvas.width - 20, 40);
}

// 게임 시작
function startGame() {
    if (gameRunning) return;
    
    gameRunning = true;
    gamePaused = false;
    score = 0;
    gameSpeed = 5;
    frameCount = 0;
    obstacles = [];
    
    car.reset();
    initClouds();
    
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('pauseBtn').style.display = 'inline-block';
    document.getElementById('gameOverOverlay').classList.remove('show');
    
    gameLoop();
}

// 게임 재시작
function restartGame() {
    startGame();
}

// 일시정지 토글
function togglePause() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    const pauseBtn = document.getElementById('pauseBtn');
    
    if (gamePaused) {
        pauseBtn.textContent = '▶️ 계속하기';
    } else {
        pauseBtn.textContent = '⏸️ 일시정지';
        gameLoop();
    }
}

// 게임 오버
function gameOver() {
    gameRunning = false;
    
    // 최고 점수 업데이트
    if (score > highScore) {
        highScore = Math.floor(score);
        localStorage.setItem('jumpGameHighScore', highScore);
        document.getElementById('highScore').textContent = highScore;
        
        showFeedback('🎉 우리야 최고 기록 달성! 대단해요! 🎉', 'correct');
    } else {
        showFeedback('😊 우리야 다시 한번 도전해봐!', 'incorrect');
    }
    
    // 게임 오버 화면 표시
    document.getElementById('finalScore').textContent = Math.floor(score);
    document.getElementById('finalHighScore').textContent = highScore;
    document.getElementById('gameOverOverlay').classList.add('show');
    document.getElementById('startBtn').style.display = 'inline-block';
    document.getElementById('pauseBtn').style.display = 'none';
}

// 피드백 메시지
function showFeedback(message, type) {
    const feedbackDiv = document.getElementById('feedback');
    feedbackDiv.innerHTML = message;
    feedbackDiv.className = `feedback ${type}`;
    
    setTimeout(() => {
        feedbackDiv.innerHTML = '';
        feedbackDiv.className = 'feedback';
    }, 2000);
}

// 게임 루프
function gameLoop() {
    if (!gameRunning || gamePaused) return;
    
    // 배경 그리기
    drawBackground();
    
    // 구름 업데이트 및 그리기
    clouds.forEach(cloud => {
        cloud.update();
        cloud.draw();
    });
    
    // 자동차 업데이트 및 그리기
    car.update();
    car.draw();
    
    // 장애물 생성
    frameCount++;
    if (frameCount % 90 === 0) {
        obstacles.push(new Obstacle());
    }
    
    // 장애물 업데이트 및 그리기
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.update();
        obstacle.draw();
        
        // 충돌 체크
        if (obstacle.collidesWith(car)) {
            gameOver();
            return;
        }
        
        // 장애물 통과 시 점수 증가
        if (!obstacle.passed && obstacle.x + obstacle.width < car.x) {
            obstacle.passed = true;
            score += 10;
        }
        
        // 화면 밖으로 나간 장애물 제거
        if (obstacle.isOffScreen()) {
            obstacles.splice(i, 1);
        }
    }
    
    // 점수에 따라 속도 증가
    gameSpeed = 5 + Math.floor(score / 100);
    
    // 점수 표시 업데이트
    document.getElementById('currentScore').textContent = Math.floor(score);
    
    // 점수 그리기
    drawScore();
    
    requestAnimationFrame(gameLoop);
}

// 점프 이벤트 리스너
canvas.addEventListener('click', () => {
    if (gameRunning && !gamePaused) {
        car.jump();
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameRunning && !gamePaused) {
        car.jump();
    }
});

// 키보드 입력 (스페이스바)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameRunning && !gamePaused) {
        e.preventDefault();
        car.jump();
    }
});

// 초기 구름 생성
initClouds();

// 초기 화면 그리기
drawBackground();
clouds.forEach(cloud => cloud.draw());
car.reset();
car.draw();

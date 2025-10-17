// 색깔 맞추기 게임
let score = 0;
let currentColor = '';

const colors = [
    { name: '빨강', color: '#FF5252', emoji: '❤️' },
    { name: '파랑', color: '#2196F3', emoji: '💙' },
    { name: '노랑', color: '#FFEB3B', emoji: '💛' },
    { name: '초록', color: '#4CAF50', emoji: '💚' },
    { name: '보라', color: '#9C27B0', emoji: '💜' },
    { name: '주황', color: '#FF9800', emoji: '🧡' },
    { name: '분홍', color: '#E91E63', emoji: '💗' },
    { name: '하늘', color: '#00BCD4', emoji: '🩵' }
];

function startGame() {
    // 랜덤하게 정답 색 선택
    const randomIndex = Math.floor(Math.random() * colors.length);
    currentColor = colors[randomIndex];
    
    // 타겟 색 표시
    const targetColorDiv = document.getElementById('targetColor');
    targetColorDiv.style.backgroundColor = currentColor.color;
    
    // 옵션 생성 (정답 1개 + 랜덤 3개)
    createOptions();
}

function createOptions() {
    const optionsDiv = document.getElementById('colorOptions');
    optionsDiv.innerHTML = '';
    
    // 정답과 랜덤 색깔 3개 선택
    const options = [currentColor];
    const availableColors = colors.filter(c => c.color !== currentColor.color);
    
    // 랜덤하게 3개 더 추가
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * availableColors.length);
        options.push(availableColors[randomIndex]);
        availableColors.splice(randomIndex, 1);
    }
    
    // 섞기
    options.sort(() => Math.random() - 0.5);
    
    // 옵션 버튼 생성
    options.forEach(colorOption => {
        const button = document.createElement('button');
        button.className = 'color-option';
        button.style.backgroundColor = colorOption.color;
        button.innerHTML = `<div class="color-emoji">${colorOption.emoji}</div><div class="color-name">${colorOption.name}</div>`;
        
        // 터치 최적화: 터치와 클릭 모두 지원
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            checkAnswer(colorOption);
        });
        button.onclick = () => checkAnswer(colorOption);
        
        optionsDiv.appendChild(button);
    });
}

function checkAnswer(selectedColor) {
    const feedbackDiv = document.getElementById('feedback');
    
    if (selectedColor.color === currentColor.color) {
        // 정답!
        score += 10;
        document.getElementById('score').textContent = score;
        feedbackDiv.innerHTML = '🎉 우리야 정답이에요! 잘했어요! 🎉';
        feedbackDiv.className = 'feedback correct';
        
        // 축하 효과음 (효과음 대신 애니메이션)
        celebrateCorrect();
        
        // 1초 후 다음 문제
        setTimeout(() => {
            feedbackDiv.innerHTML = '';
            feedbackDiv.className = 'feedback';
            startGame();
        }, 1500);
    } else {
        // 오답
        feedbackDiv.innerHTML = '😊 우리야 다시 한번 생각해봐!';
        feedbackDiv.className = 'feedback incorrect';
        
        setTimeout(() => {
            feedbackDiv.innerHTML = '';
            feedbackDiv.className = 'feedback';
        }, 1000);
    }
}

function celebrateCorrect() {
    // 화면에 별 애니메이션 추가
    const targetDiv = document.getElementById('targetColor');
    targetDiv.style.transform = 'scale(1.2) rotate(5deg)';
    setTimeout(() => {
        targetDiv.style.transform = 'scale(1) rotate(0deg)';
    }, 300);
}

function restartGame() {
    score = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('feedback').innerHTML = '';
    document.getElementById('feedback').className = 'feedback';
    startGame();
}

// 게임 시작
startGame();

// 자동차 종류 맞추기 게임 (건설기계, 특수차량)
let score = 0;
let currentCar = null;

const cars = [
    { name: '지게차', icon: '🚜', hint: '짐을 들어올리는 특수차량이에요' },
    { name: '덤프트럭', icon: '🚛', hint: '흙이나 돌을 옮기는 큰 트럭이에요' },
    { name: '트럭', icon: '🚚', hint: '짐을 실어 나르는 차예요' },
    { name: '건설현장 차', icon: '🏗️', hint: '건물을 짓는 곳에서 일해요' },
    { name: '자동차', icon: '🚙', hint: '가족과 함께 타는 차예요' },
    { name: '소방차', icon: '🚒', hint: '불을 끄는 빨간 특수차량이에요' }
];

function startGame() {
    // 랜덤하게 차량 선택
    const randomIndex = Math.floor(Math.random() * cars.length);
    currentCar = cars[randomIndex];
    
    // 차량 힌트 표시
    const carDiv = document.getElementById('carImage');
    carDiv.innerHTML = `
        <div class="car-icon">${currentCar.icon}</div>
        <p class="car-hint">"${currentCar.hint}"<br>우리야 이게 뭘까?</p>
    `;
    
    // 옵션 생성
    createOptions();
}

function createOptions() {
    const optionsDiv = document.getElementById('carOptions');
    optionsDiv.innerHTML = '';
    
    // 정답과 랜덤 차량 3개 선택
    const options = [currentCar];
    const availableCars = cars.filter(c => c.name !== currentCar.name);
    
    // 랜덤하게 최대 3개 더 추가
    const optionCount = Math.min(3, availableCars.length);
    for (let i = 0; i < optionCount; i++) {
        const randomIndex = Math.floor(Math.random() * availableCars.length);
        options.push(availableCars[randomIndex]);
        availableCars.splice(randomIndex, 1);
    }
    
    // 섞기
    options.sort(() => Math.random() - 0.5);
    
    // 옵션 버튼 생성
    options.forEach(car => {
        const button = document.createElement('button');
        button.className = 'car-option';
        button.innerHTML = `
            <div class="option-icon">${car.icon}</div>
            <div class="option-name">${car.name}</div>
        `;
        
        // 터치 최적화
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            checkAnswer(car);
        });
        button.onclick = () => checkAnswer(car);
        
        optionsDiv.appendChild(button);
    });
}

function checkAnswer(selectedCar) {
    const feedbackDiv = document.getElementById('feedback');
    
    if (selectedCar.name === currentCar.name) {
        // 정답!
        score += 10;
        document.getElementById('score').textContent = score;
        feedbackDiv.innerHTML = `🎉 우리야 대단해! ${currentCar.name}! 정답이에요! 🎉`;
        feedbackDiv.className = 'feedback correct';
        
        // 1.5초 후 다음 문제
        setTimeout(() => {
            feedbackDiv.innerHTML = '';
            feedbackDiv.className = 'feedback';
            startGame();
        }, 2000);
    } else {
        // 오답
        feedbackDiv.innerHTML = '😊 우리야 힌트를 잘 읽어봐!';
        feedbackDiv.className = 'feedback incorrect';
        
        setTimeout(() => {
            feedbackDiv.innerHTML = '';
            feedbackDiv.className = 'feedback';
        }, 1500);
    }
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

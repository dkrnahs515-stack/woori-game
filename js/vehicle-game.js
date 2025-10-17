// 탱크 찾기 게임
let score = 0;
let currentVehicle = null;

const vehicles = [
    { name: '탱크', icon: '🪖', description: '크고 무거운 군용 차량이에요' },
    { name: '군용트럭', icon: '🚚', description: '군인들을 태우는 차예요' },
    { name: '지프차', icon: '🚐', description: '작고 튼튼한 군용차예요' },
    { name: '헬리콥터', icon: '🚁', description: '하늘을 나는 군용 비행기예요' },
    { name: '경찰차', icon: '🚓', description: '나쁜 사람을 잡는 차예요' },
    { name: '소방차', icon: '🚒', description: '불을 끄는 빨간 차예요' },
    { name: '구급차', icon: '🚑', description: '아픈 사람을 병원에 데려가요' },
    { name: '버스', icon: '🚌', description: '많은 사람을 태우는 큰 차예요' },
    { name: '택시', icon: '🚕', description: '돈을 내고 타는 노란 차예요' },
    { name: '트럭', icon: '🚛', description: '짐을 많이 실을 수 있어요' }
];

function startGame() {
    // 랜덤하게 차량 선택
    const randomIndex = Math.floor(Math.random() * vehicles.length);
    currentVehicle = vehicles[randomIndex];
    
    // 차량 표시
    const questionDiv = document.getElementById('questionVehicle');
    questionDiv.innerHTML = `
        <div class="vehicle-icon">${currentVehicle.icon}</div>
        <p class="vehicle-question">"${currentVehicle.description}"<br>이것은 무엇일까요?</p>
    `;
    
    // 옵션 생성
    createOptions();
}

function createOptions() {
    const optionsDiv = document.getElementById('vehicleOptions');
    optionsDiv.innerHTML = '';
    
    // 정답과 랜덤 차량 3개 선택
    const options = [currentVehicle];
    const availableVehicles = vehicles.filter(v => v.name !== currentVehicle.name);
    
    // 랜덤하게 3개 더 추가
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * availableVehicles.length);
        options.push(availableVehicles[randomIndex]);
        availableVehicles.splice(randomIndex, 1);
    }
    
    // 섞기
    options.sort(() => Math.random() - 0.5);
    
    // 옵션 버튼 생성
    options.forEach(vehicle => {
        const button = document.createElement('button');
        button.className = 'vehicle-option';
        button.innerHTML = `
            <div class="option-icon">${vehicle.icon}</div>
            <div class="option-name">${vehicle.name}</div>
        `;
        
        // 터치 최적화
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            checkAnswer(vehicle);
        });
        button.onclick = () => checkAnswer(vehicle);
        
        optionsDiv.appendChild(button);
    });
}

function checkAnswer(selectedVehicle) {
    const feedbackDiv = document.getElementById('feedback');
    
    if (selectedVehicle.name === currentVehicle.name) {
        // 정답!
        score += 10;
        document.getElementById('score').textContent = score;
        feedbackDiv.innerHTML = `🎉 우리야 정답! ${currentVehicle.name}을(를) 찾았어요! 🎉`;
        feedbackDiv.className = 'feedback correct';
        
        // 1.5초 후 다음 문제
        setTimeout(() => {
            feedbackDiv.innerHTML = '';
            feedbackDiv.className = 'feedback';
            startGame();
        }, 2000);
    } else {
        // 오답
        feedbackDiv.innerHTML = '😊 우리야 다시 한번 생각해봐!';
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

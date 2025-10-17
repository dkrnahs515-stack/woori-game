// 비행기 종류 맞추기 게임
let score = 0;
let currentAirplane = null;

const airplanes = [
    { name: '여객기', icon: '✈️', hint: '많은 사람들을 태우고 멀리 날아가요' },
    { name: '전투기', icon: '🛩️', hint: '빠르게 날아다니는 군용 비행기예요' },
    { name: '헬리콥터', icon: '🚁', hint: '프로펠러가 위에 있고 제자리에서 날 수 있어요' },
    { name: '이륙하는 비행기', icon: '🛫', hint: '공항에서 하늘로 올라가고 있어요' },
    { name: '로켓', icon: '🚀', hint: '우주로 가는 아주 빠른 비행체예요' },
    { name: '열기구', icon: '🎈', hint: '뜨거운 공기로 천천히 하늘을 날아요' }
];

function startGame() {
    // 랜덤하게 비행기 선택
    const randomIndex = Math.floor(Math.random() * airplanes.length);
    currentAirplane = airplanes[randomIndex];
    
    // 비행기 힌트 표시
    const airplaneDiv = document.getElementById('airplaneImage');
    airplaneDiv.innerHTML = `
        <div class="airplane-icon">${currentAirplane.icon}</div>
        <p class="airplane-hint">"${currentAirplane.hint}"<br>우리야 이게 뭘까?</p>
    `;
    
    // 옵션 생성
    createOptions();
}

function createOptions() {
    const optionsDiv = document.getElementById('airplaneOptions');
    optionsDiv.innerHTML = '';
    
    // 정답과 랜덤 비행기 3개 선택
    const options = [currentAirplane];
    const availableAirplanes = airplanes.filter(a => a.name !== currentAirplane.name);
    
    // 랜덤하게 최대 3개 더 추가 (옵션이 부족하면 있는 만큼만)
    const optionCount = Math.min(3, availableAirplanes.length);
    for (let i = 0; i < optionCount; i++) {
        const randomIndex = Math.floor(Math.random() * availableAirplanes.length);
        options.push(availableAirplanes[randomIndex]);
        availableAirplanes.splice(randomIndex, 1);
    }
    
    // 섞기
    options.sort(() => Math.random() - 0.5);
    
    // 옵션 버튼 생성
    options.forEach(airplane => {
        const button = document.createElement('button');
        button.className = 'airplane-option';
        button.innerHTML = `
            <div class="option-icon">${airplane.icon}</div>
            <div class="option-name">${airplane.name}</div>
        `;
        
        // 터치 최적화
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            checkAnswer(airplane);
        });
        button.onclick = () => checkAnswer(airplane);
        
        optionsDiv.appendChild(button);
    });
}

function checkAnswer(selectedAirplane) {
    const feedbackDiv = document.getElementById('feedback');
    
    if (selectedAirplane.name === currentAirplane.name) {
        // 정답!
        score += 10;
        document.getElementById('score').textContent = score;
        feedbackDiv.innerHTML = `🎉 우리야 정답! ${currentAirplane.name}! 잘했어요! 🎉`;
        feedbackDiv.className = 'feedback correct';
        
        // 1.5초 후 다음 문제
        setTimeout(() => {
            feedbackDiv.innerHTML = '';
            feedbackDiv.className = 'feedback';
            startGame();
        }, 2000);
    } else {
        // 오답
        feedbackDiv.innerHTML = '😊 우리야 힌트를 다시 읽어봐!';
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

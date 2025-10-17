// 동물 소리 맞추기 게임
let score = 0;
let currentAnimal = null;

const animals = [
    { name: '강아지', icon: '🐶', sound: '멍멍!' },
    { name: '고양이', icon: '🐱', sound: '야옹~' },
    { name: '소', icon: '🐮', sound: '음메~' },
    { name: '돼지', icon: '🐷', sound: '꿀꿀!' },
    { name: '양', icon: '🐑', sound: '매애~' },
    { name: '오리', icon: '🦆', sound: '꽥꽥!' },
    { name: '닭', icon: '🐔', sound: '꼬끼오!' },
    { name: '사자', icon: '🦁', sound: '어흥!' },
    { name: '코끼리', icon: '🐘', sound: '뿌우~' },
    { name: '개구리', icon: '🐸', sound: '개굴개굴!' }
];

function startGame() {
    // 랜덤하게 동물 선택
    const randomIndex = Math.floor(Math.random() * animals.length);
    currentAnimal = animals[randomIndex];
    
    // 소리 텍스트 숨기기
    document.getElementById('soundText').textContent = '어떤 동물 소리일까요?';
    
    // 옵션 생성
    createOptions();
}

function playSound() {
    if (currentAnimal) {
        const soundText = document.getElementById('soundText');
        soundText.textContent = `"${currentAnimal.sound}"`;
        soundText.style.fontSize = '2rem';
        soundText.style.color = '#FF6B9D';
        soundText.style.fontWeight = '800';
        
        // 사운드 버튼 애니메이션
        const soundButton = document.getElementById('soundButton');
        soundButton.style.transform = 'scale(1.1)';
        setTimeout(() => {
            soundButton.style.transform = 'scale(1)';
        }, 300);
    }
}

function createOptions() {
    const optionsDiv = document.getElementById('animalOptions');
    optionsDiv.innerHTML = '';
    
    // 정답과 랜덤 동물 3개 선택
    const options = [currentAnimal];
    const availableAnimals = animals.filter(a => a.name !== currentAnimal.name);
    
    // 랜덤하게 3개 더 추가
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * availableAnimals.length);
        options.push(availableAnimals[randomIndex]);
        availableAnimals.splice(randomIndex, 1);
    }
    
    // 섞기
    options.sort(() => Math.random() - 0.5);
    
    // 옵션 버튼 생성
    options.forEach(animal => {
        const button = document.createElement('button');
        button.className = 'animal-option';
        button.innerHTML = `
            <div class="animal-icon">${animal.icon}</div>
            <div class="animal-name">${animal.name}</div>
        `;
        
        // 터치 최적화
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            checkAnswer(animal);
        });
        button.onclick = () => checkAnswer(animal);
        
        optionsDiv.appendChild(button);
    });
}

function checkAnswer(selectedAnimal) {
    const feedbackDiv = document.getElementById('feedback');
    
    if (selectedAnimal.name === currentAnimal.name) {
        // 정답!
        score += 10;
        document.getElementById('score').textContent = score;
        feedbackDiv.innerHTML = `🎉 우리야 맞았어! ${currentAnimal.name}가 "${currentAnimal.sound}" 소리를 내지! 🎉`;
        feedbackDiv.className = 'feedback correct';
        
        // 1.5초 후 다음 문제
        setTimeout(() => {
            feedbackDiv.innerHTML = '';
            feedbackDiv.className = 'feedback';
            startGame();
        }, 2000);
    } else {
        // 오답
        feedbackDiv.innerHTML = '😊 우리야 다시 들어봐! 소리 듣기 버튼을 눌러봐!';
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

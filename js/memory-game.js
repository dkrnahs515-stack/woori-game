// 메모리 카드 게임
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;
let difficulty = 'easy';

const cardIcons = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'];

function setDifficulty(level) {
    difficulty = level;
    
    // 버튼 활성화 상태 변경
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 게임 재시작
    restartGame();
}

function initGame() {
    let pairCount;
    
    switch(difficulty) {
        case 'easy':
            pairCount = 4;
            break;
        case 'medium':
            pairCount = 6;
            break;
        case 'hard':
            pairCount = 8;
            break;
        default:
            pairCount = 4;
    }
    
    // 카드 쌍 생성
    const selectedIcons = cardIcons.slice(0, pairCount);
    cards = [...selectedIcons, ...selectedIcons];
    
    // 카드 섞기
    cards.sort(() => Math.random() - 0.5);
    
    // 카드 렌더링
    renderCards();
}

function renderCards() {
    const cardsDiv = document.getElementById('memoryCards');
    cardsDiv.innerHTML = '';
    
    // 난이도에 따라 그리드 조정
    let columns = 4;
    if (difficulty === 'easy') columns = 4;
    if (difficulty === 'medium') columns = 4;
    if (difficulty === 'hard') columns = 4;
    
    cardsDiv.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    
    cards.forEach((icon, index) => {
        const card = document.createElement('button');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.innerHTML = '<div class="card-back">🎴</div>';
        
        // 터치 최적화
        card.addEventListener('touchstart', (e) => {
            e.preventDefault();
            flipCard(index, card);
        });
        card.onclick = () => flipCard(index, card);
        
        cardsDiv.appendChild(card);
    });
}

function flipCard(index, cardElement) {
    if (!canFlip || flippedCards.length >= 2) return;
    if (cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) return;
    
    // 카드 뒤집기
    cardElement.classList.add('flipped');
    cardElement.innerHTML = `<div class="card-front">${cards[index]}</div>`;
    
    flippedCards.push({ index, element: cardElement, icon: cards[index] });
    
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    canFlip = false;
    const [card1, card2] = flippedCards;
    
    if (card1.icon === card2.icon) {
        // 매치 성공!
        setTimeout(() => {
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            
            matchedPairs++;
            document.getElementById('pairs').textContent = matchedPairs;
            
            // 피드백
            showFeedback('🎉 우리야 잘했어! 짝을 찾았어요! 🎉', 'correct');
            
            flippedCards = [];
            canFlip = true;
            
            // 게임 완료 체크
            if (matchedPairs === cards.length / 2) {
                setTimeout(() => {
                    showFeedback(`🎊 우리야 대단해! 모두 ${moves}번 만에 찾았어요! 🎊`, 'correct');
                }, 500);
            }
        }, 500);
    } else {
        // 매치 실패
        setTimeout(() => {
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
            card1.element.innerHTML = '<div class="card-back">🎴</div>';
            card2.element.innerHTML = '<div class="card-back">🎴</div>';
            
            showFeedback('😊 우리야 다시 한번 해봐!', 'incorrect');
            
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

function showFeedback(message, type) {
    const feedbackDiv = document.getElementById('feedback');
    feedbackDiv.innerHTML = message;
    feedbackDiv.className = `feedback ${type}`;
    
    setTimeout(() => {
        feedbackDiv.innerHTML = '';
        feedbackDiv.className = 'feedback';
    }, 2000);
}

function restartGame() {
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    canFlip = true;
    
    document.getElementById('pairs').textContent = '0';
    document.getElementById('moves').textContent = '0';
    document.getElementById('feedback').innerHTML = '';
    document.getElementById('feedback').className = 'feedback';
    
    initGame();
}

// 게임 시작
initGame();

// 자동차 퍼즐 게임
let score = 0;
let moves = 0;
let difficulty = 'easy';
let gridSize = 3;
let puzzlePieces = [];
let emptyIndex = 0;
let selectedPiece = null;

// 난이도별 자동차 이모지
const puzzleThemes = {
    easy: {
        size: 3,
        pieces: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '']
    },
    medium: {
        size: 4,
        pieces: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🏗️', '🚔', '']
    }
};

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
    moves = 0;
    document.getElementById('moves').textContent = moves;
    selectedPiece = null;
    
    // 난이도에 따른 설정
    const theme = puzzleThemes[difficulty];
    gridSize = theme.size;
    puzzlePieces = [...theme.pieces];
    emptyIndex = puzzlePieces.length - 1;
    
    // 퍼즐 섞기
    shufflePuzzle();
    
    // 그리드 렌더링
    renderPuzzle();
    renderPreview();
}

function shufflePuzzle() {
    // 정답 상태에서 시작
    const correctOrder = [...puzzlePieces];
    
    // 랜덤하게 유효한 이동을 여러 번 수행하여 섞기
    const shuffleMoves = difficulty === 'easy' ? 50 : 100;
    
    for (let i = 0; i < shuffleMoves; i++) {
        const validMoves = getValidMoves(emptyIndex);
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        
        // 조각 교환
        [puzzlePieces[emptyIndex], puzzlePieces[randomMove]] = 
        [puzzlePieces[randomMove], puzzlePieces[emptyIndex]];
        emptyIndex = randomMove;
    }
    
    // 섞은 후 정답인 경우 한 번 더 섞기
    if (checkWin()) {
        shufflePuzzle();
    }
}

function getValidMoves(index) {
    const validMoves = [];
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    
    // 위
    if (row > 0) validMoves.push(index - gridSize);
    // 아래
    if (row < gridSize - 1) validMoves.push(index + gridSize);
    // 왼쪽
    if (col > 0) validMoves.push(index - 1);
    // 오른쪽
    if (col < gridSize - 1) validMoves.push(index + 1);
    
    return validMoves;
}

function renderPreview() {
    const previewGrid = document.getElementById('previewGrid');
    previewGrid.innerHTML = '';
    previewGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    
    const theme = puzzleThemes[difficulty];
    theme.pieces.forEach((piece) => {
        const div = document.createElement('div');
        div.className = 'preview-piece';
        div.textContent = piece;
        previewGrid.appendChild(div);
    });
}

function renderPuzzle() {
    const puzzleGrid = document.getElementById('puzzleGrid');
    puzzleGrid.innerHTML = '';
    puzzleGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    
    puzzlePieces.forEach((piece, index) => {
        const div = document.createElement('div');
        div.className = piece === '' ? 'puzzle-piece empty' : 'puzzle-piece';
        div.textContent = piece;
        div.dataset.index = index;
        
        if (piece !== '') {
            // 터치 최적화
            div.addEventListener('touchstart', (e) => {
                e.preventDefault();
                handlePieceClick(index);
            });
            div.onclick = () => handlePieceClick(index);
        }
        
        puzzleGrid.appendChild(div);
    });
}

function handlePieceClick(index) {
    const validMoves = getValidMoves(emptyIndex);
    
    if (validMoves.includes(index)) {
        // 빈 칸과 인접한 조각 클릭 - 이동
        movePiece(index);
    } else if (selectedPiece === null) {
        // 첫 번째 조각 선택
        selectedPiece = index;
        highlightPiece(index, true);
    } else if (selectedPiece === index) {
        // 같은 조각 다시 클릭 - 선택 해제
        selectedPiece = null;
        highlightPiece(index, false);
    } else {
        // 두 번째 조각 선택 - 교환 시도
        if (canSwap(selectedPiece, index)) {
            swapPieces(selectedPiece, index);
            highlightPiece(selectedPiece, false);
            selectedPiece = null;
        } else {
            // 교환 불가 - 새로운 조각 선택
            highlightPiece(selectedPiece, false);
            selectedPiece = index;
            highlightPiece(index, true);
        }
    }
}

function highlightPiece(index, highlight) {
    const pieces = document.querySelectorAll('.puzzle-piece');
    if (pieces[index]) {
        if (highlight) {
            pieces[index].classList.add('selected');
        } else {
            pieces[index].classList.remove('selected');
        }
    }
}

function canSwap(index1, index2) {
    // 같은 행 또는 같은 열에 있는지 확인
    const row1 = Math.floor(index1 / gridSize);
    const col1 = index1 % gridSize;
    const row2 = Math.floor(index2 / gridSize);
    const col2 = index2 % gridSize;
    
    return (row1 === row2 || col1 === col2);
}

function swapPieces(index1, index2) {
    // 두 조각 교환
    [puzzlePieces[index1], puzzlePieces[index2]] = 
    [puzzlePieces[index2], puzzlePieces[index1]];
    
    // 빈 칸 위치 업데이트
    if (puzzlePieces[index1] === '') emptyIndex = index1;
    if (puzzlePieces[index2] === '') emptyIndex = index2;
    
    moves++;
    document.getElementById('moves').textContent = moves;
    
    renderPuzzle();
    checkWin();
}

function movePiece(index) {
    // 조각을 빈 칸으로 이동
    [puzzlePieces[emptyIndex], puzzlePieces[index]] = 
    [puzzlePieces[index], puzzlePieces[emptyIndex]];
    
    emptyIndex = index;
    moves++;
    document.getElementById('moves').textContent = moves;
    
    renderPuzzle();
    checkWin();
}

function checkWin() {
    const theme = puzzleThemes[difficulty];
    const correctOrder = theme.pieces;
    
    const isWin = puzzlePieces.every((piece, index) => piece === correctOrder[index]);
    
    if (isWin) {
        // 승리!
        score += (difficulty === 'easy' ? 50 : 100);
        document.getElementById('score').textContent = score;
        
        const feedbackDiv = document.getElementById('feedback');
        feedbackDiv.innerHTML = `🎉 우리야 대단해! ${moves}번 만에 완성했어요! 🎉`;
        feedbackDiv.className = 'feedback correct';
        
        setTimeout(() => {
            feedbackDiv.innerHTML = '';
            feedbackDiv.className = 'feedback';
            
            // 새로운 퍼즐 시작
            if (confirm('우리야 정말 잘했어! 다시 한 번 해볼까?')) {
                initGame();
            }
        }, 3000);
    }
    
    return isWin;
}

function restartGame() {
    score = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('feedback').innerHTML = '';
    document.getElementById('feedback').className = 'feedback';
    initGame();
}

// 게임 시작
initGame();

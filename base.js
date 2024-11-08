const statusDisplay = document.querySelector('.game--status');

function resetScoreBoard() {
    xScore = 0;
    oScore = 0;
    document.getElementById('xScore').innerText = xScore;
    document.getElementById('oScore').innerText = oScore;
}

document.getElementById('resetScoreButton').addEventListener('click', resetScoreBoard);

let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let xScore = 0;
let oScore = 0;

statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;

const winSound = new Audio('game-start.mp3');
const tieSound = new Audio('match-cave.mp3');
const clickSound = new Audio('mouse-click.mp3');

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;

    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerHTML = "";
        cell.classList.remove('winning-cell');
    });
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) return;

    clickSound.currentTime = 0;
    clickSound.play();

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;

    const xImagePath = 'close.png';
    const oImagePath = 'o.png';

    if (currentPlayer === "X") {
        clickedCell.innerHTML = `<img src="${xImagePath}" alt="X" width="100" height="100">`;
    } else {
        clickedCell.innerHTML = `<img src="${oImagePath}" alt="O" width="100" height="100">`;
    }
}

function handleResultValidation() {
    let roundWon = false;
    let winningCombination = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') continue;

        if (a === b && b === c) {
            roundWon = true;
            winningCombination = winCondition;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = `Player ${currentPlayer} has won!`;
        winSound.play();
        highlightWinningCells(winningCombination);
        gameActive = false;

        // Update score and check if celebration should be shown
        if (currentPlayer === "X") {
            xScore++;
            document.getElementById('xScore').innerText = xScore;
        } else {
            oScore++;
            document.getElementById('oScore').innerText = oScore;
        }

        // Check for celebration
        checkWinner();
        setTimeout(handleRestartGame, 2000);
        return;
    }

    if (!gameState.includes('')) {
        statusDisplay.innerHTML = `Game ended in a draw!`;
        tieSound.play();
        gameActive = false;
        setTimeout(handleRestartGame, 2000);
        return;
    }

    setTimeout(handlePlayerChange, 100);
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;
}

function highlightWinningCells(winningCombination) {
    winningCombination.forEach(index => {
        const cell = document.querySelector(`.cell[data-cell-index='${index}']`);
        cell.classList.add('winning-cell');
    });
}

function checkWinner() {
    if (xScore === 5) {
        showCelebration("X"); // Show celebration for X
    } else if (oScore === 5) {
        showCelebration("O"); // Show celebration for O
    }
}

function showCelebration(player) {
    const celebrationElement = document.getElementById('celebration');
    celebrationElement.innerHTML = `Congratulations! ${player} wins with 5 points! 🎉`;
    celebrationElement.style.display = 'block';

    setTimeout(() => {
        celebrationElement.style.display = 'none';
        resetScoreBoard(); // Reset scores after celebration
    }, 5000);
}
function goToMainMenu() {
    window.location.href = 'indexpage.html'; // Change this to your main menu page URL
}

// Add event listeners
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);

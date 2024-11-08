// Tic-Tac-Toe Game

const BOARD_SIZE = 3;
const HUMAN_PLAYER = 'X';
const AI_PLAYER = 'O';

// Function to initialize the game board with empty cells
function initializeBoard() {
  const board = new Array(BOARD_SIZE).fill(null).map(() => new Array(BOARD_SIZE).fill(' '));
  return board;
}

// Function to display the current game board
function displayBoard(board) {
  console.log('\nCurrent Board:');
  for (let row of board) {
    console.log(row.join(' | '));
    console.log('-'.repeat(BOARD_SIZE * 4 - 1));
  }
}

// Function to check if the game is over (win or draw)
function isGameOver(board) {
  return isWinningMove(board, HUMAN_PLAYER) || isWinningMove(board, AI_PLAYER) || isBoardFull(board);
}

// Function to check if a player has won the game
function isWinningMove(board, player) {
  // Check rows, columns, and diagonals for a win
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
      return true; // Check rows
    }
    if (board[0][i] === player && board[1][i] === player && board[2][i] === player) {
      return true; // Check columns
    }
  }
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
    return true; // Check diagonal (top-left to bottom-right)
  }
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
    return true; // Check diagonal (top-right to bottom-left)
  }
  return false;
}

// Function to check if the game board is full (draw)
function isBoardFull(board) {
  return board.every(row => row.every(cell => cell !== ' '));
}

// Function to get all possible moves (empty cells) on the board
function getPossibleMoves(board) {
  const moves = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === ' ') {
        moves.push({ row: i, col: j });
      }
    }
  }
  return moves;
}

// Function to make the AI move using the Minimax algorithm
function makeAIMove(board) {
  const bestMove = minimax(board, AI_PLAYER).move;
  board[bestMove.row][bestMove.col] = AI_PLAYER;
}

// Minimax algorithm implementation
function minimax(board, currentPlayer) {
  if (isWinningMove(board, HUMAN_PLAYER)) {
    return { score: -10 }; // Human wins, so AI gets a negative score
  } else if (isWinningMove(board, AI_PLAYER)) {
    return { score: 10 }; // AI wins, so AI gets a positive score
  } else if (isBoardFull(board)) {
    return { score: 0 }; // Draw, no one gets a score
  }

  const possibleMoves = getPossibleMoves(board);

  if (currentPlayer === AI_PLAYER) {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let move of possibleMoves) {
      board[move.row][move.col] = AI_PLAYER;
      const score = minimax(board, HUMAN_PLAYER).score;
      board[move.row][move.col] = ' ';

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove = null;

    for (let move of possibleMoves) {
      board[move.row][move.col] = HUMAN_PLAYER;
      const score = minimax(board, AI_PLAYER).score;
      board[move.row][move.col] = ' ';

      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return { score: bestScore, move: bestMove };
  }
}

// Function to start the game loop
function startGame() {
  const board = initializeBoard();

  console.log('Welcome to Tic-Tac-Toe! You are X, and the AI is O.');
  displayBoard(board);

  while (!isGameOver(board)) {
    // Human's turn
    const readlineSync = require('readline-sync');
    const row = readlineSync.questionInt('Enter row (0 to 2): ');
    const col = readlineSync.questionInt('Enter column (0 to 2): ');

    if (board[row][col] === ' ') {
      board[row][col] = HUMAN_PLAYER;
      displayBoard(board);
    } else {
      console.log('Cell is already occupied. Try again.');
    }

    if (!isGameOver(board)) {
      // AI's turn
      makeAIMove(board);
      displayBoard(board);
    }
  }

  // Game is over
  if (isWinningMove(board, HUMAN_PLAYER)) {
    console.log('Congratulations! You win!');
  } else if (isWinningMove(board, AI_PLAYER)) {
    console.log('AI wins! Better luck next time!');
  } else {
    console.log("It's a draw!");
  }
}

// Start the game
startGame();

const cells = document.querySelectorAll(".cell");

const statusText = document.getElementById("status");

const restartBtn = document.getElementById("restartBtn");

const playerModeBtn = document.getElementById("playerMode");

const aiModeBtn = document.getElementById("aiMode");


let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];


let currentPlayer = "X";

let gameOver = false;

let playAgainstAI = false;


/* Winning combinations */

const winningCombinations = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];


/* Cell click */

cells.forEach(function (cell) {

    cell.addEventListener("click", function () {

        const index = cell.dataset.index;

        if (board[index] !== "" || gameOver) {
            return;
        }

        if (playAgainstAI && currentPlayer === "O") {
            return;
        }

        makeMove(index, currentPlayer);

        if (!gameOver && playAgainstAI && currentPlayer === "O") {

            setTimeout(function () {
                aiMove();
            }, 400);

        }

    });

});


/* Make a move */

function makeMove(index, player) {

    board[index] = player;

    cells[index].textContent = player;

    cells[index].classList.add(player.toLowerCase());


    if (checkWinner(player)) {

        statusText.textContent = `Player ${player} Wins!`;

        gameOver = true;

        return;
    }


    if (board.every(function (cell) {
        return cell !== "";
    })) {

        statusText.textContent = "It's a Draw!";

        gameOver = true;

        return;
    }


    currentPlayer = currentPlayer === "X" ? "O" : "X";


    if (playAgainstAI && currentPlayer === "O") {

        statusText.textContent = "AI's Turn";

    } else {

        statusText.textContent = `Player ${currentPlayer}'s Turn`;

    }

}


/* Check winner */

function checkWinner(player) {

    return winningCombinations.some(function (combination) {

        return combination.every(function (index) {

            return board[index] === player;

        });

    });

}


/* AI move */

function aiMove() {

    if (gameOver) {
        return;
    }


    const emptyCells = [];


    board.forEach(function (cell, index) {

        if (cell === "") {
            emptyCells.push(index);
        }

    });


    if (emptyCells.length === 0) {
        return;
    }


    /*
       First try to win
    */

    for (let index of emptyCells) {

        board[index] = "O";

        if (checkWinner("O")) {

            board[index] = "";

            makeMove(index, "O");

            return;
        }

        board[index] = "";

    }


    /*
       Then block player X
    */

    for (let index of emptyCells) {

        board[index] = "X";

        if (checkWinner("X")) {

            board[index] = "";

            makeMove(index, "O");

            return;
        }

        board[index] = "";

    }


    /*
       Otherwise choose random cell
    */

    const randomIndex =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];


    makeMove(randomIndex, "O");

}


/* Restart game */

restartBtn.addEventListener("click", function () {

    resetGame();

});


/* Two-player mode */

playerModeBtn.addEventListener("click", function () {

    playAgainstAI = false;

    playerModeBtn.classList.add("active");

    aiModeBtn.classList.remove("active");

    resetGame();

});


/* AI mode */

aiModeBtn.addEventListener("click", function () {

    playAgainstAI = true;

    aiModeBtn.classList.add("active");

    playerModeBtn.classList.remove("active");

    resetGame();

});


/* Reset game */

function resetGame() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];


    currentPlayer = "X";

    gameOver = false;


    cells.forEach(function (cell) {

        cell.textContent = "";

        cell.classList.remove("x");

        cell.classList.remove("o");

    });


    statusText.textContent = "Player X's Turn";

}
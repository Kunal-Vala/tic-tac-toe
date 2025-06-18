const Gameboard = (() => {
    const board = Array(9).fill(""); // ["", "", ..., ""]

    const placeMarker = (index, symbol) => {
        if (board[index] === "") {
            board[index] = symbol;
            return true;
        }
        return false; // spot already taken
    };

    const getBoard = () => board;

    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    return { placeMarker, getBoard, reset };
})();




const Player = (name, symbol) => {
    return { name, symbol };
};




const GameController = (() => {

    const player1 = Player("Player One", "X");
    const player2 = Player("Player Two", "O");

    let currentPlayer = player1;
    let gameOver = false;
    const getCurrentPlayer = () => currentPlayer;


    const playRound = (index) => {
        if (gameOver) return { status: "over" };

        const valid = Gameboard.placeMarker(index, currentPlayer.symbol);

        if (valid) {
            const result = checkWin();
            if (result) {
                gameOver = true;
                return { status: "win", winner: currentPlayer.symbol };
            } else if (isDraw()) {
                gameOver = true;
                return { status: "draw" };
            } else {
                switchPlayer();
                return { status: "next", nextPlayer: currentPlayer.symbol };
            }
        }

        return { status: "invalid" };
    };



    const checkWin = () => {
        // check all winning combinations
        const board = Gameboard.getBoard();

        const winPatterns = [
            [0, 1, 2], // rows
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6], // columns
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8], // diagonals
            [2, 4, 6]
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return true; // current player wins
            }
        }
        return false;

    };

    const isDraw = () => {
        const board = Gameboard.getBoard();
        return board.every(cell => cell !== "");
    };


    const switchPlayer = () => {
        // toggle currentPlayer
        currentPlayer = currentPlayer === player1 ? player2 : player1;

    };

    const resetGame = () => {
        Gameboard.reset();
        gameOver = false;
        currentPlayer = player1;
    };

    const printBoard = () => {
        const board = Gameboard.getBoard();
        console.log(`
    ${board[0]} | ${board[1]} | ${board[2]}
    ---------
    ${board[3]} | ${board[4]} | ${board[5]}
    ---------
    ${board[6]} | ${board[7]} | ${board[8]}
    `);
    };


    return { playRound, resetGame, printBoard, checkWin, getCurrentPlayer };

})();



const start = document.querySelector(".start-game");
const gameboardContainer = document.querySelector(".gameboard");

start.addEventListener('click', function () {
    if (playerOneType === "" || playerTwoType === "") {
        alert("Please select player types for both players!");
        return;
    }

    console.log("Start Button Clicked");

    const container = document.querySelector(".container");
    if (container) {
        container.style.display = "none";
    }

    // Move the declaration and initialization of boardContainer here
    const boardContainer = document.querySelector(".board");
    boardContainer.innerHTML = `
    <div class = "game-cell" id="cell-0"> </div>
    <div class = "game-cell" id="cell-1"> </div>
    <div class = "game-cell" id="cell-2"> </div>
    <div class = "game-cell" id="cell-3"> </div>
    <div class = "game-cell" id="cell-4"> </div>
    <div class = "game-cell" id="cell-5"> </div>
    <div class = "game-cell" id="cell-6"> </div>
    <div class = "game-cell" id="cell-7"> </div>
    <div class = "game-cell" id="cell-8"> </div>  `;

    if (gameboardContainer) {
        gameboardContainer.style.display = "flex";
    }

    const player1 = p1Humanbtn || p1Botbtn;
    const player2 = p2Humanbtn || p2Botbtn;


    const cells = document.querySelectorAll(".game-cell");

    cells.forEach((cell) => {
        cell.addEventListener("click", () => {
            const index = parseInt(cell.id.split('-')[1]);
            const board = Gameboard.getBoard();
            const message = document.querySelector(".display-message");

            if (board[index] !== "") return; // already filled

            const result = GameController.playRound(index);
            cell.textContent = board[index];
            cell.style.pointerEvents = "none";

            if (result.status === "win") {
                message.textContent = `${result.winner} wins!`;
                showModal(`${GameController.getCurrentPlayer().name} wins!`);


            } else if (result.status === "draw") {
                message.textContent = "It's a draw!";
                showModal("It's a draw!");

            } else if (result.status === "next") {
                message.textContent = `Next turn: ${result.nextPlayer}`;
                const isBotTurn = (result.nextPlayer === "X" && playerOneType === "Bot") ||
                    (result.nextPlayer === "O" && playerTwoType === "Bot");

                if (isBotTurn) {
                    setTimeout(botMove, 500); // small delay for better UX
                }
            } else if (result.status === "invalid") {
                message.textContent = "Invalid move!";
            }

        });

    });
    const message = document.querySelector(".display-message");
    message.textContent = `Next turn: ${GameController.getCurrentPlayer().symbol}`;

    if ((GameController.getCurrentPlayer().symbol === "X" && playerOneType === "Bot") ||
        (GameController.getCurrentPlayer().symbol === "O" && playerTwoType === "Bot")) {
        setTimeout(botMove, 500);
    }



});


let playerOneType = "";
let playerTwoType = "";

const p1Humanbtn = document.querySelector(".player-one .human");
const p1Botbtn = document.querySelector(".player-one .bot");
const p2Humanbtn = document.querySelector(".player-two .human");
const p2Botbtn = document.querySelector(".player-two .bot");

p1Humanbtn.addEventListener("click", () => {
    playerOneType = "Human";
    p1Humanbtn.classList.add("selected");
    p1Botbtn.classList.remove("selected");
});

p1Botbtn.addEventListener("click", () => {
    playerOneType = "Bot";
    p1Humanbtn.classList.remove("selected");
    p1Botbtn.classList.add("selected");
});

p2Humanbtn.addEventListener("click", () => {
    playerTwoType = "Human";
    p2Humanbtn.classList.add("selected");
    p2Botbtn.classList.remove("selected");
});

p2Botbtn.addEventListener("click", () => {
    playerTwoType = "Bot";
    p2Humanbtn.classList.remove("selected");
    p2Botbtn.classList.add("selected");
});

const modal = document.getElementById("gameOverModal");
const modalMessage = document.querySelector(".modal-message");

function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = "flex";
}

const restartBtn = document.querySelector(".restart-btn");

restartBtn.addEventListener("click", () => {
    modal.style.display = "none";
    GameController.resetGame();
    document.querySelector(".container").style.display = "block";
    document.querySelector(".display-message").textContent = ""; // ✅ reset message
    document.querySelector(".board").innerHTML = ""; // ✅ clear board
    document.querySelector(".gameboard").style.display = "none"; // ✅ hide gameboard
});

function botMove() {
    const board = Gameboard.getBoard();
    const emptyCells = board
        .map((cell, index) => (cell === "" ? index : null))
        .filter(index => index !== null);

    if (emptyCells.length === 0) return;

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    document.getElementById(`cell-${randomIndex}`).click();
}

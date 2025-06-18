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

    const playRound = (index) => {
        if (gameOver) return;

        const valid = Gameboard.placeMarker(index, currentPlayer.symbol);

        if (valid) {
            console.log(`${currentPlayer.name} & ${currentPlayer.symbol} moves to ${index} `);
            console.log(printBoard());

            const result = checkWin();
            if (result) {
                gameOver = true;
                console.log(`${currentPlayer.name} wins!`);
            } else if (isDraw()) {
                gameOver = true;
                console.log("It's a draw!");
            } else {
                switchPlayer();
            }
        } else {
            console.log("Invalid move! Cell already taken.");
        }
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


    return { playRound, resetGame, printBoard };

})();


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

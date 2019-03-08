pragma solidity ^0.5.0;

contract Game {
    uint8 public boardSize = 3; 
    uint8 guessCounter;
    address[3][3] board;

    address public playerOne;
    address public playerTwo;
    address public winner;

    address activePlayer;

    bool gameActive;

    constructor () public {
        playerOne = msg.sender;
    }
 
    function joinGame() public {
        assert(playerTwo == address(0));
        gameActive = true;
        playerTwo = msg.sender;
        activePlayer = playerTwo;
    }

    function getBoard() public view returns(address[3][3] memory){
        return board;
    }

    function setWinner(address player) private {
        gameActive = false;
        return;
    }

    function SetPosition(uint8 x, uint8 y) public {
        //assert to ensure that no input is larger than the board size
        assert(x < boardSize);
        assert(y < boardSize);

        //ensures the player's turn
        require(msg.sender == playerOne, "It is not the player's turn");

        //position is assigned to the sender
        board[x][y] = msg.sender; 
    }

    function FindPosition(uint8 x, uint8 y) public {
        guessCounter++;
        require(guessCounter < 8, "There are no more turns left");
        if(board[x][y] == playerOne){
            setWinner(activePlayer);
        }

    }


}
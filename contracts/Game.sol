pragma solidity ^0.5.0;

contract Game {
    //board game parameters
    uint8 public boardSize = 3; 
    address[3][3] board;
    uint8 guessCounter;
    uint8 mineCounter;
    // uint constant public cost = 0.1 ether;

    //game players
    address public setter;
    address public miner;

    address public winner;
    bool gameActive;

    constructor () public payable{
        setter = msg.sender;
        // require(msg.value == cost, "must provide 0.1 ether");
    }
 
    function joinGame() public {
        assert(miner == address(0)); 
        gameActive = true;
        miner = msg.sender;
    }

    function getBoard() public view returns(address[3][3] memory){
        return board;
    }
    function setMinerWin(address player) private {
        gameActive = false;
        // player.send(address(this).balance);
        return;
    }

    function setMinerLose(address player) private {
        gameActive = false;
        // player.send(address(this).balance);
        return;
    }

    function SetPosition(uint8 x, uint8 y) public {
        //assert to ensure that no input is larger than the board size
        assert(x < boardSize);
        assert(y < boardSize);

        //ensures that the setter is the miner
        require(msg.sender == setter, "You are not the setter, so you cannot set the mines!");

        //ensures no more than 3 mines set
        require(mineCounter <= 3, "You have alreadys set 3 mines!");

        //position is assigned to the sender
        board[x][y] = msg.sender;
        mineCounter++;
    }

    function FindPosition(uint8 x, uint8 y) public {
        guessCounter++;
        require(guessCounter < 6, "There are no more turns left");
        if(board[x][y] == setter){
            setMinerLose(setter);
        }

        if(guessCounter == 6){
            setMinerWin(miner);
        }

    }
}
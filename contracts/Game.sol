pragma solidity ^0.5.0;

contract Game {
    //board game parameters
    uint8 public boardSize = 3; 
    address[3][3] board;
    uint8 guessCounter;
    uint8 mineCounter;
    uint constant public cost = 0.1 ether;

    //game players
    address payable public setter;
    address payable public miner;
    address public winner;
    address public player;
    bool gameActive;

    //events 
    event GameOverWithWin(address winner);
    event GameOverWithLoss(address loser);

    constructor () public payable{
        setter = msg.sender;
        require(msg.value == cost, "must provide 0.1 ether");
    }
 

    function getBoard() public view returns(address[3][3] memory){
        return board;
    }
    function setMinerWin() private {
        gameActive = false;
        emit GameOverWithWin(player);
        miner.transfer(address(this).balance);
        return;
    }

    function setMinerLose() private {
        gameActive = false;
        emit GameOverWithLoss(player);
        setter.transfer(address(this).balance);
        return;
    }

    function SetPosition(uint8 x, uint8 y) public {
        //assert to ensure that no input is larger than the board size
        assert(x < boardSize);
        assert(y < boardSize);

        //ensures no more than 3 mines set
        require(mineCounter <= 3, "You have already set 3 mines!");

        //position is assigned to the sender
        board[x][y] = msg.sender;
        mineCounter++;
    }

    function FindPosition(uint8 x, uint8 y) public payable {
        miner = msg.sender;
        require(msg.value == cost, "must provide 0.1 ether");
        guessCounter++;
        require(guessCounter < 6, "There are no more turns left");
        if(board[x][y] == setter){
            setMinerLose();
        }

        if(guessCounter == 6){
            setMinerWin();
        }

    }
}
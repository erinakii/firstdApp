pragma solidity ^0.5.0;

contract Paint {
    //initial board
    uint public boardSize = 20;
    address[20][20] board;
    string public color;
    uint constant public cost = 0.1 ether;

    //painter 
    address payable public painter;

    constructor() public payable {
        painter = msg.sender;
        require(msg.value == cost, "must provide 0.1 ether");

    }

    function getBoard() public view returns(address[20][20] memory){
        return board;
    }

    function setColor(string memory clr) public {
        color = clr;
    }

    function setPaint(uint8 x, uint8 y) public {
        assert(x < boardSize);
        assert(y < boardSize);

        board[x][y] = msg.sender;
    }
}
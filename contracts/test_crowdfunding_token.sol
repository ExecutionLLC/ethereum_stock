pragma solidity ^0.4.11;

import "erc20_token.sol";
import "owned.sol";

contract TestCrowdfundingToken is ERC20BaseToken, Owned {
    string constant public name = "Test";
    string constant public symbol = "TST";
    uint8 constant public decimals = 0;
    
    uint public tokenPrice;
    uint public availableSupply;
    
    mapping (address => uint) public changeBalances;
    
    event TokensBought(
        address indexed _buyer,
        address indexed _recipient,
        uint _change,
        uint _tokens,
        uint _availableSupply
    );
    
    // our crowdfunding goal is _tokenPrice*_tokenSupply
    function TestCrowdfundingToken(uint _tokenPrice, uint _tokenSupply)
    {
        require(_tokenPrice > 0 && _tokenSupply > 0);
        tokenPrice = _tokenPrice;
        _totalSupply = _tokenSupply;
        availableSupply = _tokenSupply;
    }

    function () payable {
        buyFor(msg.sender);
    }
    
    function buyFor(address _recipient) payable {
        require(availableSupply > 0);
        require(msg.value >= tokenPrice);
        uint n = msg.value/tokenPrice;
        if (n > availableSupply) {
            n = availableSupply;
        }

        uint donated = tokenPrice*n;
        uint change = msg.value - donated;
        availableSupply -= n;
        balances[_recipient] += n;
        changeBalances[msg.sender] += change;
        
        owner.transfer(donated);
        
        TokensBought(msg.sender, _recipient, change, n, availableSupply);
    }
    
    function withdrawChange() {
        require(changeBalances[msg.sender] > 0);
        
        uint change = changeBalances[msg.sender];
        changeBalances[msg.sender] = 0;
        
        msg.sender.transfer(change);
    }
    
    function progress() returns(uint _goal, uint _bought) {
        return (_totalSupply, _totalSupply - availableSupply);
    }
}

pragma solidity ^0.4.11;

import "erc20_token.sol";
import "owned.sol";

contract TestCrowdfundingToken is ERC20BaseToken, Owned {
    string constant public name = "Test";
    string constant public symbol = "TST";
    uint8 constant public decimals = 0;
    
    uint public tokenPrice;
    uint public maxSupply;
    
    mapping (address => uint) public pendingWithdrawals;
    
    event TokensBought(
        address indexed _buyer,
        address indexed _recipient,
        uint _change,
        uint _tokens,
        uint _availableSupply
    );
    
    // our crowdfunding goal is _tokenPrice*_maxSupply
    function TestCrowdfundingToken(uint _tokenPrice, uint _maxSupply)
    {
        require(_tokenPrice > 0 && _maxSupply > 0);
        tokenPrice = _tokenPrice;
        maxSupply = _maxSupply;
    }

    function () payable {
        buyFor(msg.sender);
    }
    
    function buyFor(address _recipient) payable {
        require(_totalSupply < maxSupply);
        require(msg.value >= tokenPrice);
        
        uint n = msg.value/tokenPrice;
        if (_totalSupply + n > maxSupply) {
            n = maxSupply - _totalSupply;
        }

        uint donated = tokenPrice*n;
        uint change = msg.value - donated;
        
        _totalSupply += n;
        balances[_recipient] += n;
        pendingWithdrawals[msg.sender] += change;
        
        owner.transfer(donated);
        
        Transfer(0x0, _recipient, n);
        TokensBought(msg.sender, _recipient, change, n, maxSupply - _totalSupply);
    }
    
    function withdrawChange() {
        require(pendingWithdrawals[msg.sender] > 0);
        
        uint change = pendingWithdrawals[msg.sender];
        pendingWithdrawals[msg.sender] = 0;
        
        msg.sender.transfer(change);
    }
    
    function progress() constant returns(uint _goal, uint _bought) {
        return (maxSupply, _totalSupply);
    }
}

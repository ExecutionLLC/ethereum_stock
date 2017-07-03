pragma solidity ^0.4.8;


contract Owner {
    address owner;
    
    function Owner(address _owner) {
        owner = _owner;
    }
    
    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }
    
    function changeOwner(address _newOwner) ownerOnly {
        owner = _newOwner;
    }

    function destruct() ownerOnly {
        selfdestruct(owner);
    }
}


contract TokenFactory is Owner {
    mapping (address => uint) public clientTokens;
    mapping (address => uint) clientReward;
    
    uint totalTokens;
    uint public availableTokens;
    uint public tokenPrice;

    event priceChanged(uint _newPrice);
    event availableTokensChanged(uint _availableTokens);
    event tokenAcquired(address indexed _client, uint _n, uint _currentTokenPrice);
    event tokenReturned(address indexed _client, uint _n, uint _currentTokenPrice);
    
    function TokenFactory(uint _n, uint _price) Owner(msg.sender) { 
        setPrice(_price);
        emitTokens(_n);
    }
    
    function emitTokens(uint _n) ownerOnly {
        require(_n > 0);
        
        totalTokens += _n;
        availableTokens += _n;
        availableTokensChanged(availableTokens);
    }
    
    function burn(uint _n) ownerOnly {
        require(_n > 0);
        require(availableTokens > 0);
        
        if (_n < availableTokens) {
            totalTokens -= _n;
            availableTokens -= _n;
        } else {
            totalTokens -= availableTokens;
            availableTokens = 0;
        }
        availableTokensChanged(availableTokens);
    }
    
    function setPrice(uint _price) ownerOnly {
        require(_price > 0);
        
        if (_price != tokenPrice) {
            tokenPrice = _price;
            priceChanged(tokenPrice);
        }
    }
    
    function buy() payable {
        require(msg.value >= tokenPrice);
        uint n = msg.value/tokenPrice;
        require(availableTokens >= n);
        
        availableTokens -= n;
        availableTokensChanged(availableTokens);
        
        clientTokens[msg.sender] += n;
        clientReward[msg.sender] += msg.value%tokenPrice;
        tokenAcquired(msg.sender, n, tokenPrice);
    }
    
    function returnToken(uint _n) {
        require(clientTokens[msg.sender] > 0);
        require(clientTokens[msg.sender] >= _n);

        availableTokens += _n;
        availableTokensChanged(availableTokens);
        
        clientTokens[msg.sender] -= _n;
        clientReward[msg.sender] += _n*tokenPrice;
        tokenReturned(msg.sender, _n, tokenPrice);
    }
    
    function returnAllTokens() {
        uint n = clientTokens[msg.sender];
        returnToken(n);
    }
    
    function withdraw() {
        uint amount = clientReward[msg.sender];
        clientReward[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
}

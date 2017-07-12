pragma solidity ^0.4.11;

// https://github.com/ethereum/EIPs/issues/20
contract ERC20Interface {
    function totalSupply() constant returns (uint totalSupply);
    function balanceOf(address _owner) constant returns (uint balance);
    function transfer(address _to, uint _value) returns (bool success);
    function transferFrom(address _from, address _to, uint _value) returns (bool success);
    function approve(address _spender, uint _value) returns (bool success);
    function allowance(address _owner, address _spender) constant returns (uint remaining);
    
    event Transfer(address indexed _from, address indexed _to, uint _value);
    event Approval(address indexed _owner, address indexed _spender, uint _value);
}

contract ERC20BaseToken is ERC20Interface {
    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;
    uint256 _totalSupply;
    
    modifier whenCanTransfer(address _from, uint256 _value) {
        if (balances[_from] >= _value) { 
            _;
        }
    }

    modifier whenCanReceive(address _recipient, uint256 _value) {
        if (balances[_recipient] + _value > balances[_recipient]) {
            _;
        }
    }

    modifier whenIsAllowed(address _from, address _delegate, uint256 _value) {
        if (allowed[_from][_delegate] >= _value) {
            _;
        }
    }

    function totalSupply() constant returns (uint totalSupply) {
        totalSupply = _totalSupply;
    }
    
    /// @dev Transfers sender's tokens to a given address. Returns success.
    /// @param _recipient Address of token receiver.
    /// @param _value Number of tokens to transfer.
    function transfer(address _recipient, uint256 _value)
        whenCanTransfer(msg.sender, _value)
        whenCanReceive(_recipient, _value)
        returns (bool success)
    {
        balances[msg.sender] -= _value;
        balances[_recipient] += _value;
        Transfer(msg.sender, _recipient, _value);
        return true;
    }

    /// @dev Allows allowed third party to transfer tokens from one address to another. Returns success.
    /// @param _from Address from where tokens are withdrawn.
    /// @param _recipient Address to where tokens are sent.
    /// @param _value Number of tokens to transfer.
    function transferFrom(address _from, address _recipient, uint256 _value)
        whenCanTransfer(_from, _value)
        whenCanReceive(_recipient, _value)
        whenIsAllowed(_from, msg.sender, _value)
        returns (bool success)
    {
        allowed[_from][msg.sender] -= _value;
        balances[_from] -= _value;
        balances[_recipient] += _value;
        Transfer(_from, _recipient, _value);
        return true;
    }

    /// @dev Returns number of tokens owned by given address.
    /// @param _owner Address of token owner.
    function balanceOf(address _owner) constant returns (uint256 balance) {
        return balances[_owner];
    }

    /// @dev Sets approved amount of tokens for spender. Returns success.
    /// @param _spender Address of allowed account.
    /// @param _value Number of approved tokens.
    function approve(address _spender, uint256 _value) returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    /// @dev Returns number of allowed tokens for given address.
    /// @param _owner Address of token owner.
    /// @param _spender Address of token spender
    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
}

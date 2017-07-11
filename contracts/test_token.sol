pragma solidity ^0.4.10;

import "erc20_token.sol";
import "safe_math.sol";

contract TestToken is ERC20BaseToken, SafeMath {
    address public founder;
    address public minter;
    
    string constant public name = "Test";
    string constant public symbol = "TST";
    uint8 constant public decimals = 8;
    
    event Issuance(address indexed _recipient, uint256 _value);
    
    function TestToken() {
        founder = msg.sender;
        minter = msg.sender;
    }
    
    // Prevents accidental sending of ether
    function () {
        throw;
    }

    modifier onlyFounder() {
        // Only founder is allowed to do this action.
        require(msg.sender == founder);
        _;
    }
    
    modifier onlyMinter() {
        // Only minter is allowed to do this action.
        require(msg.sender == minter);
        _;
    }

    /// @dev Crowdfunding contract issues new tokens for address. Returns success.
    /// @param _recipient Address of receiver.
    /// @param _value Number of tokens to issue.
    function issueTokens(address _recipient, uint _value) 
        onlyMinter
        returns (bool success)
    {
        if (_value == 0) {
            return false;
        }
        
        _totalSupply = add(_totalSupply, _value);
        balances[_recipient] = add(balances[_recipient], _value);
        Issuance(_recipient, _value);
        return true;
    }

    /// @dev Function to change address that is allowed to do emission.
    /// @param _newMinter Address of new emission contract.
    function changeMinter(address _newMinter)
        public
        onlyFounder
        returns (bool success)
    {   
        minter = _newMinter;
        return true;
    }

    /// @dev Function to change founder address.
    /// @param _newFounder Address of new founder.
    function changeFounder(address _newFounder)
        public
        onlyFounder
        returns (bool success)
    {   
        founder = _newFounder;
        return true;
    }
}

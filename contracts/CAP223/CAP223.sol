// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ICAP223.sol";

library Address {
    /// @dev Returns true if `account` is a contract.

    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }
}

abstract contract ICAP223Recipient {
    /// @notice Function to handle the receipt of ERC223 tokens.
    /// @param _from Address of the sender.
    /// @param _value Amount of tokens sent.
    /// @param _data Additional data sent with the transaction.
    /// @return A bytes4 value indicating successful receipt.
    function tokenReceived(
        address _from,
        uint256 _value,
        bytes memory _data
    ) public virtual returns (bytes4);
}

abstract contract CAP223 is ICAP223, ICAP223Recipient {
    using Address for address;

    /// @notice Mapping to keep track of balances.
    mapping(address => uint256) private _balances;
    /// @notice Name of the token.
    string private _name;
    /// @notice Symbol of the token.
    string private _symbol;
    /// @notice Total supply of the token.
    uint256 private _totalSupply;
    /// @notice Number of decimals the token uses.
    uint8 private _decimals;

    /// @notice Constructor to initialize the ERC223 token.
    /// @param name_ Name of the token.
    /// @param symbol_ Symbol of the token.
    /// @param decimals_ Number of decimals the token uses.
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_
    ) {
        _name = name_;
        _symbol = symbol_;
        _decimals = decimals_;
    }

    /// @notice Returns the name of the token.
    /// @return Name of the token.
    function name() public view returns (string memory) {
        return _name;
    }

    /// @notice Returns the symbol of the token.
    /// @return Symbol of the token.
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /// @notice Returns the number of decimals the token uses.
    /// @return Number of decimals.
    function decimals() public view returns (uint8) {
        return _decimals;
    }

    /// @notice Returns the total supply of the token.
    /// @return Total supply.
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    /// @notice Returns the balance of a specific address.
    /// @param _owner The address to query the balance of.
    /// @return The balance of the specified address.
    function balanceOf(address _owner) public view returns (uint256) {
        return _balances[_owner];
    }

    /// @notice Transfers tokens to a specified address with additional data.
    /// @param _to The address to transfer to.
    /// @param _value The amount to be transferred.
    /// @param _data Additional data to send with the transfer.
    /// @return success A boolean indicating whether the operation was successful.
    function transfer(
        address _to,
        uint256 _value,
        bytes calldata _data
    ) public returns (bool success) {
        _balances[msg.sender] -= _value;
        _balances[_to] += _value;
        if (_to.isContract()) {
            ICAP223Recipient(_to).tokenReceived(msg.sender, _value, _data);
        }
        emit Transfer(msg.sender, _to, _value, _data);
        return true;
    }

    /// @notice Transfers tokens to a specified address without additional data.
    /// @param _to The address to transfer to.
    /// @param _value The amount to be transferred.
    /// @return success A boolean indicating whether the operation was successful.
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        bytes memory _empty = hex"00000000";
        _balances[msg.sender] -= _value;
        _balances[_to] += _value;
        if (_to.isContract()) {
            ICAP223Recipient(_to).tokenReceived(msg.sender, _value, _empty);
        }
        emit Transfer(msg.sender, _to, _value, _empty);
        return true;
    }

    /// @notice Internal function to mint new tokens.
    /// @param account The address to which the minted tokens will be credited.
    /// @param amount The amount of tokens to mint.
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "ERC223: mint to the zero address");

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount, "");
    }

    /// @notice Internal function to burn tokens.
    /// @param account The address from which tokens will be burned.
    /// @param amount The amount of tokens to burn.
    function _burn(address account, uint256 amount) internal {
        require(account != address(0), "ERC223: burn from the zero address");

        _balances[account] -= amount;
        _totalSupply -= amount;
        emit Transfer(account, address(0), amount, "");
    }
}

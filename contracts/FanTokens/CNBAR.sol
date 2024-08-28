// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// Note: Fan Tokens have been created by the ChilizNexus team specifically for testing purposes as part of ETHOnline 2024.
/// @custom:security-contact mujahidshaik2002@gmail.com
contract CNFCBarcelona is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    constructor()
        ERC20("CN FC Barcelona", "CNBAR")
        Ownable(_msgSender())
    {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public onlyOwner{
        _burn(from,amount);
    }

    // Override
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}

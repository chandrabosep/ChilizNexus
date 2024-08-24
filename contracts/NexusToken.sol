// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC223, IERC223} from "./ERC223/ERC223.sol";

/// Nexus Token Contract
/// @dev A contract creates interoperable for platform tokens using fan tokens, including minting and redeeming operations.

// Custom errors for more efficient error handling
error Nexus__InvalidAddress();
error Nexus__UnsupportedToken();
error Nexus__InsufficientAllowance();
error Nexus__InsufficientBalance();
error Nexus__TransferFailed();
error Nexus__RedemptionFailed();

/// @notice Nexus contract extending ERC223
contract Nexus is ERC223 {

    /// @notice Mapping to track supported fan tokens
    mapping(address => bool) private s_supportedFanTokens;

    /// @notice Mapping to track the supply of each fan token
    mapping(address => uint256) private s_fanTokenSupply;

    /// @notice Nested mapping to track user deposits of each fan token
    mapping(address => mapping(address => uint256)) private s_userDeposits;

    /// @notice Event emitted when tokens are minted
    event TokenMinted(address indexed from, address indexed token, uint256 value);

    /// @notice Event emitted when tokens are redeemed
    event TokenRedeemed(address indexed from, address indexed token, uint256 value);

    /// @notice Constructor to initialize the contract with supported fan tokens
    constructor() ERC223("ChilizNexusToken", "CNT", 0) {
        // Initialize the supported tokens mapping with predefined fan tokens
        s_supportedFanTokens[0xa4bf4104ec0109591077Ee5F4a2bFD13dEE1Bdf8] = true; // testPSG
        s_supportedFanTokens[0x63667746A7A005E45B1fffb13a78d0331065Ff7f] = true; // testBAR
        s_supportedFanTokens[0x1ED7858225dF2a3365d07dD7C08d165D6A399bE6] = true; // testJUV
    }

    /// @notice Function to mint Nexus tokens by depositing supported fan tokens
    /// @param tokenAddress The address of the supported fan token
    /// @param amount The amount of the fan token to deposit
    function mintToken(address tokenAddress, uint256 amount) public {
        // Revert if the token is not supported
        if (!isSupportedFanToken(tokenAddress)) revert Nexus__UnsupportedToken();

        // Revert if the user's allowance is insufficient
        if (IERC20(tokenAddress).allowance(msg.sender, address(this)) < amount) revert Nexus__InsufficientAllowance();

        // Attempt to transfer the fan tokens from the user to this contract
        bool success = IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        // Revert if the transfer fails
        if (!success) revert Nexus__TransferFailed();

        // Call internal function to mint Nexus tokens
        _mintToken(msg.sender, tokenAddress, amount);

        // Emit the TokenMinted event
        emit TokenMinted(msg.sender, tokenAddress, amount);
    }

    /// @notice Internal function to handle the minting logic
    /// @param user The address of the user receiving the Nexus tokens
    /// @param tokenAddress The address of the supported fan token
    /// @param amount The amount of the fan token to deposit
    function _mintToken(address user, address tokenAddress, uint256 amount) internal {
        // Increment the user's deposit balance for the specified fan token
        s_userDeposits[user][tokenAddress] += amount;
        // Increment the total supply of the specified fan token
        s_fanTokenSupply[tokenAddress] += amount;
        // Mint the equivalent amount of Nexus tokens to the user
        _mint(user, amount);
    }

    /// @notice Function to redeem Nexus tokens for the original fan tokens
    /// @param tokenAddress The address of the supported fan token
    /// @param amount The amount of Nexus tokens to redeem
    function redeemToken(address tokenAddress, uint256 amount) public {
        // Revert if the token is not supported
        if (!isSupportedFanToken(tokenAddress)) revert Nexus__UnsupportedToken();

        // Revert if the user has insufficient Nexus tokens
        if (balanceOf(msg.sender) < amount) revert Nexus__InsufficientBalance();

        // Revert if the user has insufficient deposit balance of the fan token
        if (s_userDeposits[msg.sender][tokenAddress] < amount) revert Nexus__InsufficientBalance();

        // Call internal function to handle the redemption logic
        _redeem(tokenAddress, amount);

        // Burn the equivalent amount of Nexus tokens from the user
        _burn(msg.sender, amount);

        // Emit the TokenRedeemed event
        emit TokenRedeemed(msg.sender, tokenAddress, amount);
    }

    /// @notice Internal function to handle the redemption logic
    /// @param tokenAddress The address of the supported fan token
    /// @param amount The amount of Nexus tokens to redeem
    function _redeem(address tokenAddress, uint256 amount) internal {
        // Decrement the user's deposit balance for the specified fan token
        s_userDeposits[msg.sender][tokenAddress] -= amount;
        // Decrement the total supply of the specified fan token
        s_fanTokenSupply[tokenAddress] -= amount;

        // Attempt to transfer the fan tokens from this contract to the user
        bool success = IERC20(tokenAddress).transfer(msg.sender, amount);
        // Revert if the transfer fails
        if (!success) revert Nexus__RedemptionFailed();
    }

    /// @notice Function to add a supported token after deployment
    /// @param tokenAddress The address of the token to add
    function addSupportedToken(address tokenAddress) public {
        // Revert if the token is already supported
        if (isSupportedFanToken(tokenAddress)) revert("Token already supported");
        // Add the token to the supported tokens mapping
        s_supportedFanTokens[tokenAddress] = true;
    }

    /// @notice Function to remove a supported token after deployment
    /// @param tokenAddress The address of the token to remove
    function removeSupportedToken(address tokenAddress) public {
        // Revert if the token is not supported
        if (!isSupportedFanToken(tokenAddress)) revert("Token not supported");
        // Remove the token from the supported tokens mapping
        s_supportedFanTokens[tokenAddress] = false;
    }

    /// @notice Implementation of tokenReceived function required by ERC223
    /// @param _from The address from which tokens are sent
    /// @param _value The amount of tokens sent
    /// @param _data Additional data sent with the tokens
    /// @return A magic value that confirms the receipt of tokens
    function tokenReceived(address _from, uint _value, bytes memory _data) public override returns (bytes4) {
        // Basic implementation that just returns the magic value
        return 0x8943ec02;
    }

    /// @notice Function to check if a token is supported
    /// @param tokenAddress The address of the token to check
    /// @return A boolean indicating whether the token is supported
    function isSupportedFanToken(address tokenAddress) public view returns (bool) {
        return s_supportedFanTokens[tokenAddress];
    }

    /// @notice Function to get the total supply of a specific fan token
    /// @param fanTokenAddress The address of the fan token
    /// @return The total supply of the specified fan token
    function getFanTokenSupply(address fanTokenAddress) public view returns (uint256) {
        return s_fanTokenSupply[fanTokenAddress];
    }

    /// @notice Function to get the deposit balance of a user for a specific fan token
    /// @param fanTokenAddress The address of the fan token
    /// @param userAddress The address of the user
    /// @return The deposit balance of the specified user for the specified fan token
    function getUserDeposits(address fanTokenAddress, address userAddress) public view returns (uint256) {
        return s_userDeposits[fanTokenAddress][userAddress];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CAP223, ICAP223} from "./CAP223.sol";

/// NexusToken Contract
/// @dev A contract creates interoperable for platform tokens using fan tokens, including minting and redeeming operations.

// Custom errors for more efficient error handling
error NexusToken__InvalidAddress();
error NexusToken__UnsupportedToken();
error NexusToken__InsufficientAllowance();
error NexusToken__InsufficientBalance();
error NexusToken__TransferFailed();
error NexusToken__RedemptionFailed();

/// @notice NexusToken contract extending CAP223
contract NexusToken is CAP223 {
    /// @notice Mapping to track supported fan tokens
    mapping(address => bool) private s_supportedFanTokens;

    /// @notice Mapping to track the supply of each fan token
    mapping(address => uint256) private s_fanTokenSupply;

    /// @notice Nested mapping to track user deposits of each fan token
    mapping(address => mapping(address => uint256)) private s_userDeposits;

    /// @notice Event emitted when tokens are minted
    event TokenMinted(
        address indexed from,
        address indexed token,
        uint256 value
    );

    /// @notice Event emitted when tokens are redeemed
    event TokenRedeemed(
        address indexed from,
        address indexed token,
        uint256 value
    );

    /// @notice Constructor to initialize the contract with supported fan tokens
    constructor() CAP223("ChilizNexusTokenToken", "CNT", 0) {
        // Initialize the supported tokens mapping with predefined fan tokens
        s_supportedFanTokens[0x63667746A7A005E45B1fffb13a78d0331065Ff7f] = true; // testBAR
        s_supportedFanTokens[0xa4bf4104ec0109591077Ee5F4a2bFD13dEE1Bdf8] = true; // testPSG
        s_supportedFanTokens[0x1ED7858225dF2a3365d07dD7C08d165D6A399bE6] = true; // testJUV
    }

    /// @notice Function to mint NexusToken tokens by depositing supported fan tokens
    /// @param fanTokenAddress The address of the supported fan token
    /// @param amount The amount of the fan token to deposit
    function mintToken(address fanTokenAddress, uint256 amount) public {
        // Revert if the token is not supported
        if (!isSupportedFanToken(fanTokenAddress))
            revert NexusToken__UnsupportedToken();

        if (!checkUserOwnFanTokens(fanTokenAddress, msg.sender)) revert();

        // Revert if the user's allowance is insufficient
        if (
            IERC20(fanTokenAddress).allowance(msg.sender, address(this)) <
            amount
        ) revert NexusToken__InsufficientAllowance();

        // Attempt to transfer the fan tokens from the user to this contract
        bool success = IERC20(fanTokenAddress).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        // Revert if the transfer fails
        if (!success) revert NexusToken__TransferFailed();

        // Call internal function to mint NexusToken tokens
        _mintToken(msg.sender, fanTokenAddress, amount);

        // Emit the TokenMinted event
        emit TokenMinted(msg.sender, fanTokenAddress, amount);
    }

    /// @notice Internal function to handle the minting logic
    /// @param user The address of the user receiving the NexusToken tokens
    /// @param fanTokenAddress The address of the supported fan token
    /// @param amount The amount of the fan token to deposit
    function _mintToken(
        address user,
        address fanTokenAddress,
        uint256 amount
    ) internal {
        // Increment the user's deposit balance for the specified fan token
        s_userDeposits[user][fanTokenAddress] += amount;
        // Increment the total supply of the specified fan token
        s_fanTokenSupply[fanTokenAddress] += amount;
        // Mint the equivalent amount of NexusToken tokens to the user
        _mint(user, amount);
    }

    /// @notice Function to redeem NexusToken tokens for the original fan tokens
    /// @param fanTokenAddress The address of the supported fan token
    /// @param amount The amount of NexusToken tokens to redeem
    function redeemToken(address fanTokenAddress, uint256 amount) public {
        // Revert if the token is not supported
        if (!isSupportedFanToken(fanTokenAddress))
            revert NexusToken__UnsupportedToken();

        // Revert if the user has insufficient NexusToken tokens
        if (balanceOf(msg.sender) < amount) revert NexusToken__InsufficientBalance();

        // Revert if the user has insufficient deposit balance of the fan token
        if (s_userDeposits[msg.sender][fanTokenAddress] < amount)
            revert NexusToken__InsufficientBalance();

        // Call internal function to handle the redemption logic
        _redeem(fanTokenAddress, amount);

        // Burn the equivalent amount of NexusToken tokens from the user
        _burn(msg.sender, amount);

        // Emit the TokenRedeemed event
        emit TokenRedeemed(msg.sender, fanTokenAddress, amount);
    }

    /// @notice Internal function to handle the redemption logic
    /// @param fanTokenAddress The address of the supported fan token
    /// @param amount The amount of NexusToken tokens to redeem
    function _redeem(address fanTokenAddress, uint256 amount) internal {
        // Decrement the user's deposit balance for the specified fan token
        s_userDeposits[msg.sender][fanTokenAddress] -= amount;
        // Decrement the total supply of the specified fan token
        s_fanTokenSupply[fanTokenAddress] -= amount;

        // Attempt to transfer the fan tokens from this contract to the user
        bool success = IERC20(fanTokenAddress).transfer(msg.sender, amount);
        // Revert if the transfer fails
        if (!success) revert NexusToken__RedemptionFailed();
    }

    /// @notice Function to add a supported token after deployment
    /// @param fanTokenAddress The address of the token to add
    function addSupportedToken(address fanTokenAddress) public {
        // Revert if the token is already supported
        if (isSupportedFanToken(fanTokenAddress))
            revert("Token already supported");
        // Add the token to the supported tokens mapping
        s_supportedFanTokens[fanTokenAddress] = true;
    }

    /// @notice Function to remove a supported token after deployment
    /// @param fanTokenAddress The address of the token to remove
    function removeSupportedToken(address fanTokenAddress) public {
        // Revert if the token is not supported
        if (!isSupportedFanToken(fanTokenAddress))
            revert("Token not supported");
        // Remove the token from the supported tokens mapping
        s_supportedFanTokens[fanTokenAddress] = false;
    }

    /// @notice Implementation of tokenReceived function required by CAP223
    /// @param _from The address from which tokens are sent
    /// @param _value The amount of tokens sent
    /// @param _data Additional data sent with the tokens
    /// @return A magic value that confirms the receipt of tokens
    function tokenReceived(
        address _from,
        uint256 _value,
        bytes memory _data
    ) public override returns (bytes4) {
        // Basic implementation that just returns the magic value
        return 0x8943ec02;
    }

    function checkUserOwnFanTokens(address fanTokenAddress, address userAddress)
        public
        view
        returns (bool)
    {
        return IERC20(fanTokenAddress).balanceOf(userAddress) > 0;
    }

    /// @notice Function to check if a token is supported
    /// @param fanTokenAddress The address of the token to check
    /// @return A boolean indicating whether the token is supported
    function isSupportedFanToken(address fanTokenAddress)
        public
        view
        returns (bool)
    {
        return s_supportedFanTokens[fanTokenAddress];
    }

    /// @notice Function to get the total supply of a specific fan token
    /// @param fanfanTokenAddress The address of the fan token
    /// @return The total supply of the specified fan token
    function getFanTokenSupply(address fanfanTokenAddress)
        public
        view
        returns (uint256)
    {
        return s_fanTokenSupply[fanfanTokenAddress];
    }

    /// @notice Function to get the deposit balance of a user for a specific fan token
    /// @param fanfanTokenAddress The address of the fan token
    /// @param userAddress The address of the user
    /// @return The deposit balance of the specified user for the specified fan token
    function getUserDeposits(address fanfanTokenAddress, address userAddress)
        public
        view
        returns (uint256)
    {
        return s_userDeposits[fanfanTokenAddress][userAddress];
    }
}

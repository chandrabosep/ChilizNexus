// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC223 {
    /// @notice Returns the balance of the specified address.
    /// @param account The address to query the balance of.
    /// @return The balance of the specified address.
    function balanceOf(address account) external view returns (uint256);

    /// @notice Transfers tokens to a specified address.
    /// @param to The address to transfer to.
    /// @param amount The amount to be transferred.
    /// @return A boolean indicating whether the operation was successful.
    function transfer(address to, uint256 amount) external returns (bool);

    /// @notice Transfers tokens to a specified address with additional data.
    /// @param to The address to transfer to.
    /// @param amount The amount to be transferred.
    /// @param data Additional data to send with the transfer.
    /// @return A boolean indicating whether the operation was successful.
    function transfer(address to, uint256 amount, bytes calldata data) external returns (bool);

    /// @notice Returns the total supply of the token.
    /// @return The total supply.
    function totalSupply() external view returns (uint256);

    /// @notice Event emitted when tokens are transferred.
    /// @param from The address from which the tokens were transferred.
    /// @param to The address to which the tokens were transferred.
    /// @param value The amount of tokens transferred.
    /// @param data Additional data sent with the transfer.
    event Transfer(address indexed from, address indexed to, uint256 value, bytes indexed data);
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol"; // Importing the ERC1155 contract from OpenZeppelin
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol"; // Importing the ERC1155Supply extension from OpenZeppelin
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol"; // Importing the Ownable contract for owner-restricted access
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol"; // Importing ReentrancyGuard to protect functions from reentrancy attacks
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol"; // Importing Strings utility to handle string conversions

// Custom Errors for improved gas efficiency instead of revert messages
error NexusEventGate__AccessLevelAlreadyExists(); // Error thrown when an access level already exists
error NexusEventGate__AccessLevelDoesNotExists(); // Error thrown when an access level does not exist
error NexusEventGate__InvalidInputAddress(); // Error thrown for invalid input addresses
error NexusEventGate__InvalidFanTokenAddress(); // Error thrown for unsupported fan token addresses
error NexusEventGate__NoUserAddressesProvided(); // Error thrown if no user addresses are provided
error NexusEventGate__EventIdAlreadyExists(); // Error thrown if the event ID already exists
error NexusEventGate__TokenIdAlreadyExists(); // Error thrown if the token ID already exists
error NexusEventGate__TokenIdDoesNotExists(); // Error thrown if the token ID does not exist
error NexusEventGate__UnmatchedArrayLength(); // Error thrown when array lengths do not match
error NexusEventGate__UserIsNotAnEventManager(); // Error thrown if a user is not an event manager
error NexusEventGate__TransactionFailed(); // Error thrown when a transaction fails
error NexusEventGate__UserDoesNotHoldFanTokens(); // Error thrown if the user does not hold required fan tokens
error NexusEventGate__TicketLimitExceeded(); // Error thrown when ticket limits are exceeded
error NexusEventGate__EventEnded(); // Error thrown when the event has already ended
error NexusEventGate__IncorrectTicketPrice(); // Error thrown for incorrect ticket prices
error NexusEventGate__ZeroAmountForTokenDrop(); // Error thrown if there is no amount to distribute for token drops
error NexusEventGate__InsufficientBalanceForTokenDrop(); // Error thrown for insufficient balance for token drops
error NexusEventGate__UnableToCallNexusTokenContract(); // Error thrown while calling Nexus Token Contract

contract NexusEventGate is ERC1155, ERC1155Supply, Ownable, ReentrancyGuard {
    /// @notice Name of the contract
    string public _name;

    /// @notice Symbol of the contract
    string public _symbol;

    /// @notice Address of the Nexus Token Contract used for fan tokens and other checks
    address private s_nexusTokenContract;

    /// @notice Mapping from event ID to array of token IDs
    mapping(uint64 => uint256[]) private s_eventIdToTokenIds;

    /// @notice Mapping from event ID to array of access levels
    mapping(uint64 => string[]) private s_eventIdToAccessLevels;

    /// @notice Mapping from token ID to ticket price
    mapping(uint256 => uint256) private s_tokenIdToTicketPrice;

    /// @notice Mapping from event ID to collected amount for event-specific activities
    mapping(uint64 => uint256) private s_collectedAmountForEventId;

    /// @notice Mapping from token ID to ticket limit per token ID
    mapping(uint256 => uint8) private s_tokenIdToTicketLimit;

    /// @notice Mapping from event ID to event end timestamp
    mapping(uint64 => uint64) private s_eventIdToEndTimestamp;

    /// @notice Mapping from event ID to amount collected for Nexus drops
    mapping(uint64 => uint256) private s_eventIdToNexusDrop;

    /// @notice Event emitted when a transfer attempt is made, indicating transfer details
    /// @param recipient Address of the user who received the token
    /// @param amount Amount of native tokens sent during the transfer
    event TransferAttempt(address indexed recipient, uint256 indexed amount);

    /// @notice Event emitted when a live event is registered
    /// @param eventId The ID of the registered live event
    /// @param manager The address of the event manager registering the event
    /// @param endTimestamp The timestamp when the event will end
    event EventRegistered(
        uint64 indexed eventId,
        address indexed manager,
        uint64 indexed endTimestamp
    );

    /// @notice Constructor to initialize the contract
    constructor()
        ERC1155("https://chiliz-nexus/")
        Ownable(0x02C8345B2DF9Ff6122b0bE7B79cB219d956bd701)
    {
        _name = "NexusEventGate"; // Initialize contract name
        _symbol = "NEGT"; // Initialize contract symbol
        s_nexusTokenContract = 0xc01C4824339814edA70EB4639d6A7Ad23629f009; // Set the Nexus Token contract address
    }

    /*****************************
        STATE UPDATE FUNCTIONS
    ******************************/

    /// @notice Function to set the base URI for the token metadata
    /// @param newuri The new base URI to be set
    /// @dev Only callable by the contract owner
    function setBaseURI(string memory newuri) public onlyOwner {
        _setURI(newuri); // Update the base URI for token metadata
    }

    /// @notice Function to add native tokens to the Nexus drop for a specific event
    /// @param eventId The ID of the event
    function nexusDrop(uint64 eventId) public payable nonReentrant {
        s_eventIdToNexusDrop[eventId] += msg.value; // Add the value of the native tokens to the event's Nexus drop
    }

    /// @notice Function to distribute the collected drop amount equally to the provided user addresses
    /// @param eventId The ID of the event
    /// @param userAddresses The array of addresses to receive the drop
    /// @dev The drop is distributed equally; only callable by the contract owner
    function distributeDrop(uint64 eventId, address[] calldata userAddresses)
        public
        onlyOwner
    {
        uint256 collectedAmount = s_eventIdToNexusDrop[eventId];
        if (collectedAmount == 0)
            revert NexusEventGate__ZeroAmountForTokenDrop();
        if (address(this).balance < collectedAmount)
            revert NexusEventGate__InsufficientBalanceForTokenDrop();

        uint256 len = userAddresses.length;
        if (len == 0) {
            revert NexusEventGate__NoUserAddressesProvided();
        }

        uint256 amountPerUser = (collectedAmount) / len;
        if (amountPerUser == 0)
            revert NexusEventGate__InsufficientBalanceForTokenDrop();

        // Update state first to prevent reentrancy
        s_eventIdToNexusDrop[eventId] = 0;

        for (uint256 i = 0; i < len; ++i) {
            if (userAddresses[i] == address(0)) {
                revert NexusEventGate__InvalidInputAddress();
            }

            (bool check, ) = userAddresses[i].call{value: amountPerUser}("");
            if (!check) revert NexusEventGate__TransactionFailed();
            emit TransferAttempt(userAddresses[i], amountPerUser);
        }
    }

    /// @notice Function to register a live event with access levels and ticket prices
    /// @param eventId The ID of the event
    /// @param fanTokenAddress The address of the fan token contract
    /// @param to The address of the event manager
    /// @param endTimestamp The end timestamp of the event
    /// @param accessLevels Array of access levels for the event
    /// @param ticketPrices Array of ticket prices corresponding to access levels
    /// @param ticketLimits Array of ticket limits corresponding to access levels
    /// @dev Only callable by the contract owner
    function registerLiveEvent(
        uint64 eventId,
        address fanTokenAddress,
        address to,
        uint64 endTimestamp,
        string[] calldata accessLevels,
        uint256[] calldata ticketPrices,
        uint8[] calldata ticketLimits
    ) public onlyOwner {
        if (!isSupportedFanToken(fanTokenAddress))
            revert NexusEventGate__InvalidFanTokenAddress(); // Check if fan token address is valid

        if (getTokenIdsFromEventId(eventId).length > 0)
            revert NexusEventGate__EventIdAlreadyExists(); // Check if the event ID already exists
        uint256 len = accessLevels.length;

        if (len != ticketPrices.length || len != ticketLimits.length)
            revert NexusEventGate__UnmatchedArrayLength(); // Ensure access levels, ticket prices, and ticket limits have matching array lengths

        uint256[] memory tokenIdsGeneration = new uint256[](len); // Generate token IDs for each access level

        for (uint256 i = 0; i < len; ++i) {
            uint256 tokenId = generateTokenId(eventId, accessLevels[i]); // Generate token ID based on event ID and access level
            tokenIdsGeneration[i] = tokenId;
        }

        for (uint256 i = 0; i < len; ++i) {
            uint256 tokenId = tokenIdsGeneration[i]; // Set values for token ID
            s_eventIdToTokenIds[eventId].push(tokenId);
            s_eventIdToAccessLevels[eventId].push(accessLevels[i]);
            s_tokenIdToTicketPrice[tokenId] = ticketPrices[i];
            s_tokenIdToTicketLimit[tokenId] = ticketLimits[i];
        }

        s_eventIdToEndTimestamp[eventId] = endTimestamp; // Set the end timestamp for the event

        uint256 eventManagerTokenId = getTokenIdOfAnEventManager(eventId); // Get the token ID for the event manager
        _mint(to, eventManagerTokenId, 1, ""); // Mint the event manager's token

        emit EventRegistered(eventId, to, endTimestamp); // Emit the event registration details
    }

    /// @notice Function to register a community event
    /// @param eventId The ID of the event
    /// @param fanTokenAddress The address of the fan token contract
    /// @param to The address of the event manager
    /// @param endTimestamp The end timestamp of the event
    /// @param ticketLimit The limit on the number of tickets
    /// @dev Only callable by the contract owner
    function registerCommunityEvent(
        uint64 eventId,
        address fanTokenAddress,
        address to,
        uint64 endTimestamp,
        uint8 ticketLimit
    ) public {
        if (!isSupportedFanToken(fanTokenAddress))
            revert NexusEventGate__InvalidFanTokenAddress(); // Check if the fan token is supported

        if (getTokenIdsFromEventId(eventId).length > 0)
            revert NexusEventGate__EventIdAlreadyExists(); // Check if the event ID already exists

        if (!checkUserOwnFanTokens(fanTokenAddress, _msgSender()))
            revert NexusEventGate__UserDoesNotHoldFanTokens(); // Check if the user holds the required fan tokens

        uint256 tokenId = generateTokenId(eventId, "COMMUNITY"); // Generate token ID for community access

        s_eventIdToTokenIds[eventId].push(tokenId); // Add the token ID to the event
        s_eventIdToEndTimestamp[eventId] = endTimestamp; // Set the end timestamp for the event
        s_tokenIdToTicketLimit[tokenId] = ticketLimit; // Set the ticket limit for the token
        _mint(to, tokenId, 1, ""); // Mint the token for the community event

        emit EventRegistered(eventId, to, endTimestamp); // Emit the event registration details
    }

    /// @notice Function to mint a live event ticket for a specific token ID
    /// @param to The address of the user to mint the ticket for
    /// @param tokenId The ID of the token (ticket) to be minted
    /// @param eventId The ID of the event for which the ticket is being minted
    function mintLiveTicket(
        uint64 eventId,
        uint256 tokenId,
        address to
    ) public payable nonReentrant {
        validateMint(to, tokenId, uint64(eventId)); // Validate minting conditions

        uint256 ticketPrice = getTicketPriceFromTokenId(tokenId); // Get the price of the ticket
        if (ticketPrice == 0 || ticketPrice != msg.value)
            revert NexusEventGate__IncorrectTicketPrice(); // Ensure the ticket price is correct

        s_collectedAmountForEventId[eventId] += msg.value; // Collect the amount paid for the ticket

        _mint(to, tokenId, 1, ""); // Mint the ticket for the user
    }

    /// @notice Function to mint a community event ticket for a specific token ID
    /// @param to The address of the user to mint the ticket for
    /// @param tokenId The ID of the token (ticket) to be minted
    /// @param eventId The ID of the event for which the ticket is being minted
    function mintCommunityTicket(
        uint64 eventId,
        uint256 tokenId,
        address to
    ) public {
        validateMint(to, tokenId, eventId); // Validate minting conditions

        uint256 ticketPrice = getTicketPriceFromTokenId(tokenId); // Get the price of the ticket
        if (ticketPrice != 0) revert NexusEventGate__IncorrectTicketPrice(); // Ensure community event tickets are free

        _mint(to, tokenId, 1, ""); // Mint the ticket for the user
    }

    /// @notice Function for event managers to mint live event tickets
    /// @param eventId The ID of the event
    /// @param tokenId The ID of the token (ticket) to be minted
    /// @param to The address to mint the ticket to
    function mintLiveTicketByEventManager(
        uint64 eventId,
        uint256 tokenId,
        address to
    ) public {
        validateMint(to, tokenId, eventId); // Validate minting conditions

        if (!checkIfCallerIsEventManager(eventId, _msgSender())) {
            revert NexusEventGate__UserIsNotAnEventManager(); // Ensure the caller is the event manager
        }

        _mint(to, tokenId, 1, ""); // Mint the ticket for the recipient
    }

    /// @notice Function to register a new access level for an event
    /// @param eventId The ID of the event
    /// @param newAccessLevel The new access level to register
    /// @param newTicketPrice The price for the new access level
    /// @param newTicketLimit The ticket limit for the new access level
    function registerNewAccessLevel(
        uint64 eventId,
        string calldata newAccessLevel,
        uint256 newTicketPrice,
        uint8 newTicketLimit
    ) public {
        if (!checkIfCallerIsEventManager(eventId, _msgSender())) {
            revert NexusEventGate__UserIsNotAnEventManager(); // Ensure the caller is the event manager
        }

        if (checkAccessLevelExists(eventId, newAccessLevel)) {
            revert NexusEventGate__AccessLevelAlreadyExists(); // Check if the access level already exists
        }

        uint256 tokenId = generateTokenId(eventId, newAccessLevel); // Generate a new token ID for the access level

        s_eventIdToTokenIds[eventId].push(tokenId); // Add the new token ID to the event
        s_eventIdToAccessLevels[eventId].push(newAccessLevel); // Add the new access level to the event
        s_tokenIdToTicketPrice[tokenId] = newTicketPrice; // Set the ticket price for the new access level
        s_tokenIdToTicketLimit[tokenId] = newTicketLimit; // Set the ticket limit for the new access level
    }

    /// @notice Function to withdraw the collected amount for an event ID by the event manager
    /// @param eventId The ID of the event
    /// @dev Only the event manager can call this function
    function withdrawCollectedAmountForEventId(uint64 eventId)
        public
        nonReentrant
    {
        if (!checkIfCallerIsEventManager(eventId, _msgSender()))
            revert NexusEventGate__UserIsNotAnEventManager(); // Ensure the caller is the event manager

        uint256 _amountToTransfer = getCollectedAmountForEventId(eventId); // Get the collected amount for the event

        s_collectedAmountForEventId[eventId] = 0; // Reset the collected amount

        (bool check, ) = _msgSender().call{value: _amountToTransfer}(""); // Transfer the collected amount to the event manager
        if (!check) revert NexusEventGate__TransactionFailed(); // Revert if the transaction fails
    }

    /// @notice Function to update the address of the Nexus Token Contract
    /// @param newNexusTokenAddress The new address to be set
    /// @dev Only callable by the contract owner
    function updateNexusTokenContractAddress(address newNexusTokenAddress)
        public
        onlyOwner
    {
        s_nexusTokenContract = newNexusTokenAddress; // Update the Nexus Token contract address
    }

    /*****************************
        HELPER VIEW FUNCTIONS
    ******************************/

    /// @notice Function to generate a token ID based on event ID, event registerer, and access level
    /// @param eventId The ID of the event
    /// @param accessLevel The access level for the token
    /// @return uint256 The generated token ID
    function generateTokenId(uint64 eventId, string memory accessLevel)
        public
        view
        returns (uint256)
    {
        uint256 tokenId = uint256(
            keccak256(abi.encodePacked(eventId, accessLevel))
        ); // Generate a unique token ID using keccak256 hash of event ID and access level

        if (checkTokenIdExistsForEventId(eventId, tokenId))
            revert NexusEventGate__TokenIdAlreadyExists(); // Ensure the token ID does not already exist

        return tokenId;
    }

    /// @notice Function to validate minting of tickets
    /// @param to The address of the user to mint the ticket for
    /// @param tokenId The ID of the token (ticket) to be minted
    /// @param eventId The ID of the event for which the ticket is being minted
    function validateMint(
        address to,
        uint256 tokenId,
        uint64 eventId
    ) public view {
        if (to == address(0)) revert NexusEventGate__InvalidInputAddress(); // Ensure the recipient address is valid
        if (getTicketLimit(tokenId) <= uint8(totalSupply(tokenId)))
            revert NexusEventGate__TicketLimitExceeded(); // Check if the ticket limit is exceeded
        if (getEventEndTimestamp(eventId) < uint64(block.timestamp))
            revert NexusEventGate__EventEnded(); // Ensure the event is still ongoing
    }

    /// @notice Function to get the token ID of an event manager
    /// @param eventId The ID of the event
    /// @return uint256 The token ID of the event manager
    function getTokenIdOfAnEventManager(uint64 eventId)
        public
        view
        returns (uint256)
    {
        return s_eventIdToTokenIds[eventId][0]; // Return the first token ID, which belongs to the event manager
    }

    /// @notice Function to get the token ID associated with an access level
    /// @param eventId The ID of the event
    /// @param _accessLevel The access level to query
    /// @return uint256 The token ID associated with the access level
    function getTokenIdOfAccessLevel(
        uint64 eventId,
        string calldata _accessLevel
    ) public view returns (uint256) {
        uint256 _tokenId;
        uint256[] memory tokenIds = getTokenIdsFromEventId(eventId); // Retrieve all token IDs for the event
        string[] memory accessLevels = getAccessLevelsFromEventId(eventId); // Retrieve all access levels for the event

        for (
            uint256 i = 0;
            i < tokenIds.length && i < accessLevels.length;
            ++i
        ) {
            if (
                keccak256(bytes(_accessLevel)) ==
                keccak256(bytes(accessLevels[i]))
            ) {
                _tokenId = tokenIds[i]; // Match the access level and return the corresponding token ID
                break;
            }
        }

        if (_tokenId == 0) {
            revert NexusEventGate__TokenIdDoesNotExists(); // Revert if no token ID is found for the access level
        }
        return _tokenId;
    }

    /// @notice Function to check if a fan token is supported
    /// @param fanTokenAddress The address of the fan token contract
    /// @return bool True if the fan token is supported, false otherwise
    function isSupportedFanToken(address fanTokenAddress)
        public
        view
        returns (bool)
    {
        (bool success, bytes memory boolInBytes) = s_nexusTokenContract
            .staticcall(
                abi.encodeWithSignature(
                    "isSupportedFanToken(address)",
                    fanTokenAddress
                )
            ); // Call the Nexus token contract to check if the fan token is supported
        if (!success) revert NexusEventGate__UnableToCallNexusTokenContract();
        return abi.decode(boolInBytes, (bool)); // Return the result of the static call
    }

    /// @notice Function to check if a user owns fan tokens
    /// @param fanTokenAddress The address of the fan token contract
    /// @param userAddress The address of the user
    /// @return bool True if the user owns fan tokens, false otherwise
    function checkUserOwnFanTokens(address fanTokenAddress, address userAddress)
        public
        view
        returns (bool)
    {
        (bool success, bytes memory boolInBytes) = s_nexusTokenContract
            .staticcall(
                abi.encodeWithSignature(
                    "checkUserOwnFanTokens(address,address)",
                    fanTokenAddress,
                    userAddress
                )
            ); // Call the Nexus token contract to check if the user owns fan tokens
        if (!success) revert NexusEventGate__TransactionFailed(); // Revert if the call fails
        return abi.decode(boolInBytes, (bool)); // Return the result of the static call
    }

    /// @notice Function to check if the caller is an event manager
    /// @param eventId The ID of the event
    /// @param _callerAddress The address of the caller
    /// @return bool True if the caller is an event manager, false otherwise
    function checkIfCallerIsEventManager(uint64 eventId, address _callerAddress)
        public
        view
        returns (bool)
    {
        uint256 _tokenId = getTokenIdOfAnEventManager(eventId); // Retrieve the token ID of the event manager
        return balanceOf(_callerAddress, _tokenId) >= 1; // Return true if the caller has the event manager token
    }

    /// @notice Function to check if a token ID exists for an event ID
    /// @param eventId The ID of the event
    /// @param _tokenId The token ID to check
    /// @return bool True if the token ID exists for the event ID, false otherwise
    function checkTokenIdExistsForEventId(uint64 eventId, uint256 _tokenId)
        public
        view
        returns (bool)
    {
        uint256[] memory _tokenIds = getTokenIdsFromEventId(eventId); // Retrieve all token IDs for the event
        for (uint256 i = 0; i < _tokenIds.length; ++i) {
            if (_tokenIds[i] == _tokenId) {
                return true; // Return true if the token ID exists
            }
        }
        return false; // Return false if the token ID does not exist
    }

    /// @notice Function to check if an access level exists for an event
    /// @param eventId The ID of the event
    /// @param _accessLevel The access level to check
    /// @return bool True if the access level exists for the event, false otherwise
    function checkAccessLevelExists(
        uint64 eventId,
        string calldata _accessLevel
    ) public view returns (bool) {
        string[] memory _accessLevels = getAccessLevelsFromEventId(eventId); // Retrieve all access levels for the event
        for (uint256 i = 0; i < _accessLevels.length; ++i) {
            if (
                keccak256(bytes(_accessLevel)) ==
                keccak256(bytes(_accessLevels[i]))
            ) {
                return true; // Return true if the access level exists
            }
        }
        return false; // Return false if the access level does not exist
    }

    /*****************************
        GETTER VIEW FUNCTIONS
    ******************************/

    function getNexusTokenAddress() public view returns(address){
        return s_nexusTokenContract;
    }

    /// @notice Function to get the total amount collected for Nexus drop for an event
    /// @param eventId The ID of the event
    /// @return uint256 The amount collected for the Nexus drop
    function getCollectedAmountForNexusDrop(uint64 eventId)
        public
        view
        returns (uint256)
    {
        return s_eventIdToNexusDrop[eventId]; // Return the collected amount for Nexus drops for a specific event
    }

    /// @notice Function to get the token IDs for an event ID
    /// @param eventId The ID of the event
    /// @return uint256[] Array of token IDs for the event
    function getTokenIdsFromEventId(uint64 eventId)
        public
        view
        returns (uint256[] memory)
    {
        return s_eventIdToTokenIds[eventId]; // Return the array of token IDs for the event
    }

    /// @notice Function to get the access levels for an event ID
    /// @param eventId The ID of the event
    /// @return string[] Array of access levels for the event
    function getAccessLevelsFromEventId(uint64 eventId)
        public
        view
        returns (string[] memory)
    {
        return s_eventIdToAccessLevels[eventId]; // Return the array of access levels for the event
    }

    /// @notice Function to get the ticket price for a token ID
    /// @param _tokenId The token ID to query
    /// @return uint256 The ticket price for the token ID
    function getTicketPriceFromTokenId(uint256 _tokenId)
        public
        view
        returns (uint256)
    {
        return s_tokenIdToTicketPrice[_tokenId]; // Return the ticket price for the token ID
    }

    /// @notice Function to get the collected amount for an event ID
    /// @param eventId The ID of the event
    /// @return uint256 The collected amount for the event ID
    function getCollectedAmountForEventId(uint64 eventId)
        public
        view
        returns (uint256)
    {
        return s_collectedAmountForEventId[eventId]; // Return the collected amount for the event ID
    }

    /// @notice Function to get the event end timestamp for an event ID
    /// @param eventId The ID of the event
    /// @return uint64 The end timestamp for the event ID
    function getEventEndTimestamp(uint64 eventId) public view returns (uint64) {
        return s_eventIdToEndTimestamp[eventId]; // Return the end timestamp for the event
    }

    /// @notice Function to get the ticket limit for a token ID
    /// @param tokenId The token ID to query
    /// @return uint8 The ticket limit for the token ID
    function getTicketLimit(uint256 tokenId) public view returns (uint8) {
        return s_tokenIdToTicketLimit[tokenId]; // Return the ticket limit for the token ID
    }

    /*****************************
    CONTRACT OVERRIDE FUNCTIONS
    ******************************/

    /// @notice Function to get the URI for a token ID
    /// @param tokenId The token ID to query
    /// @return string The URI for the token ID
    function uri(uint256 tokenId)
        public
        view
        virtual
        override(ERC1155)
        returns (string memory)
    {
        return string.concat(super.uri(tokenId), Strings.toString(tokenId)); // Return the URI for the token ID
    }

    /// @notice Override to prevent the transfer of tickets (Soul Bound Tokens)
    function safeTransferFrom(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual override {
        revert("NexusEventGate: Tickets are Soul Bound"); // Prevent transfer of tickets, as they are soul-bound
    }

    /// @notice Override to prevent the batch transfer of tickets (Soul Bound Tokens)
    function safeBatchTransferFrom(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual override {
        revert("NexusEventGate: Tickets are Soul Bound"); // Prevent batch transfer of tickets, as they are soul-bound
    }

    /// @notice Default Override Function: Internal function to update balances after a transfer (overrides ERC1155 and ERC1155Supply)
    /// @param from The address to transfer from
    /// @param to The address to transfer to
    /// @param ids Array of token IDs to transfer
    /// @param values Array of amounts to transfer
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values); // Call the parent class update function to manage token supply
    }

    /// @notice Fallback function to receive native token into the contract
    receive() external payable {}
}

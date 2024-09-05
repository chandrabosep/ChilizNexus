// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

// Custom Errors
error NexusEventGate__AccessLevelAlreadyExists();
error NexusEventGate__AccessLevelDoesNotExists();
error NexusEventGate__InvalidInputAddress();
error NexusEventGate__InvalidFanTokenAddress();
error NexusEventGate__NoUserAddressesProvided();
error NexusEventGate__EventIdAlreadyExists();
error NexusEventGate__TokenIdAlreadyExists();
error NexusEventGate__TokenIdDoesNotExists();
error NexusEventGate__UnmatchedArrayLength();
error NexusEventGate__UserIsNotAnEventManager();
error NexusEventGate__TransactionFailed();
error NexusEventGate__UserDoesNotHoldFanTokens();
error NexusEventGate__TicketLimitExceeded();
error NexusEventGate__EventEnded();
error NexusEventGate__IncorrectTicketPrice();
error NexusEventGate__ZeroAmountForTokenDrop();
error NexusEventGate__InsufficientBalanceForTokenDrop();

contract NexusEventGate is ERC1155, ReentrancyGuard, Ownable, ERC1155Supply {
    /// @notice Name of the contract
    string private _name;

    /// @notice Symbol of the contract
    string private _symbol;

    /// @notice Address of the Nexus Token Contract
    address private s_nexusTokenContract;

    /// @notice Mapping from event ID to array of token IDs
    mapping(uint64 => uint256[]) private s_eventIdToTokenIds;

    /// @notice Mapping from event ID to array of access levels
    mapping(uint64 => string[]) private s_eventIdToAccessLevels;

    /// @notice Mapping from token ID to ticket price
    mapping(uint256 => uint256) private s_tokenIdToTicketPrice;

    /// @notice Mapping from event ID to collected amount
    mapping(uint64 => uint256) private s_collectedAmountForEventId;

    /// @notice Mapping from token ID to ticket limit
    mapping(uint256 => uint8) private s_tokenIdToTicketLimit;

    /// @notice Mapping from event ID to event end timestamp
    mapping(uint64 => uint64) private s_eventIdToEndTimestamp;

    /// @notice Mapping from event ID to amount collected for Nexus drop
    mapping(uint64 => uint256) private s_eventIdToNexusDrop;

    /// @notice Event emitted when a transfer attempt is made
    /// @param recipient Address of the user who received the token
    /// @param amount Amount of native tokens sent
    event TransferAttempt(address indexed recipient, uint256 indexed amount);

    /// @notice Event emitted when the base URI is updated
    /// @param newURI The new URI that has been set
    event BaseURIUpdated(string newURI);

    /// @notice Event emitted when a live event is registered
    /// @param eventId The ID of the registered live event
    /// @param manager The address of the event manager
    /// @param endTimestamp The timestamp when the event will end
    event EventRegistered(
        uint64 indexed eventId,
        address indexed manager,
        uint64 indexed endTimestamp
    );

    /// @notice Constructor to initialize the contract
    constructor() ERC1155("https://chiliz-nexus/") Ownable(_msgSender()) {
        _name = "NexusEventGate";
        _symbol = "NEGT";
        s_nexusTokenContract = 0xc01C4824339814edA70EB4639d6A7Ad23629f009;
    }

    /*****************************
        STATE UPDATE FUNCTIONS
    ******************************/

    /// @notice Function to set the base URI for the token metadata
    /// @param newuri The new base URI to be set
    /// @dev Only callable by the contract owner
    function setBaseURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
        emit BaseURIUpdated(newuri);
    }

    /// @notice Function to add native tokens to the Nexus drop for a specific event
    /// @param eventId The ID of the event
    function nexusDrop(uint64 eventId) public payable {
        s_eventIdToNexusDrop[eventId] += msg.value;
    }

    /// @notice Function to distribute the collected drop amount equally to the provided user addresses
    /// @param eventId The ID of the event
    /// @param userAddresses The array of addresses to receive the drop
    /// @dev The drop is distributed equally; only callable by the contract owner
    function distributeDrop(uint64 eventId, address[] calldata userAddresses)
        public
        onlyOwner
        nonReentrant
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

    /// @notice Function to get the total amount collected for Nexus drop for an event
    /// @param eventId The ID of the event
    /// @return uint256 The amount collected for the Nexus drop
    function getCollectedAmountForNexusDrop(uint64 eventId)
        public
        view
        returns (uint256)
    {
        return s_eventIdToNexusDrop[eventId];
    }

    /// @notice Function to register a live event with access levels and ticket prices
    /// @param eventId The ID of the event
    /// @param fanTokenAddress The address of the fan token contract
    /// @param userAddress The address of the event manager
    /// @param endTimestamp The end timestamp of the event
    /// @param accessLevels Array of access levels for the event
    /// @param ticketPrices Array of ticket prices corresponding to access levels
    /// @param ticketLimits Array of ticket limits corresponding to access levels
    /// @dev Only callable by the contract owner
    function registerLiveEvent(
        uint64 eventId,
        address fanTokenAddress,
        address userAddress,
        uint64 endTimestamp,
        string[] calldata accessLevels,
        uint256[] calldata ticketPrices,
        uint8[] calldata ticketLimits
    ) public onlyOwner {
        // Check if the fan token address is supported
        if (!isSupportedFanToken(fanTokenAddress))
            revert NexusEventGate__InvalidFanTokenAddress();

        // Check if the event ID already exists
        if (
            getTokenIdsFromEventId(eventId).length > 0 ||
            getAccessLevelsFromEventId(eventId).length > 0
        ) {
            revert NexusEventGate__EventIdAlreadyExists();
        }
        uint256 len = accessLevels.length;

        // Check if the lengths of the accessLevels, ticketPrices, and ticketLimits arrays match
        if (
            len != ticketPrices.length ||
            len != ticketLimits.length ||
            ticketLimits.length != ticketPrices.length
        ) {
            revert NexusEventGate__UnmatchedArrayLength();
        }

        uint256[] memory tokenIdsGeneration = new uint256[](len);

        for (uint256 i = 0; i < len; ++i) {
            uint256 tokenId = generateTokenId(
                eventId,
                userAddress,
                accessLevels[i]
            );

            tokenIdsGeneration[i] = tokenId;
        }

        for (uint256 i = 0; i < len; ++i) {
            uint256 tokenId = tokenIdsGeneration[i];
            s_eventIdToTokenIds[eventId].push(tokenId);
            s_eventIdToAccessLevels[eventId].push(accessLevels[i]);
            s_tokenIdToTicketPrice[tokenId] = ticketPrices[i];
            s_tokenIdToTicketLimit[tokenId] = ticketLimits[i];
        }
        s_eventIdToEndTimestamp[eventId] = uint64(block.timestamp + 1 weeks);
        // s_eventIdToEndTimestamp[eventId] = endTimestamp;

        uint256 eventManagerTokenId = getTokenIdOfAnEventManager(eventId);
        _mint(userAddress, eventManagerTokenId, 1, "");

        emit EventRegistered(eventId, userAddress, endTimestamp);
    }

    /// @notice Function to register a community event
    /// @param eventId The ID of the event
    /// @param fanTokenAddress The address of the fan token contract
    /// @param userAddress The address of the event manager
    /// @param endTimestamp The end timestamp of the event
    /// @param ticketLimit The limit on the number of tickets
    /// @dev Only callable by the contract owner
    function registerCommunityEvent(
        uint64 eventId,
        address fanTokenAddress,
        address userAddress,
        uint64 endTimestamp,
        uint8 ticketLimit
    ) public {
        // Check if the fan token address is supported
        if (!isSupportedFanToken(fanTokenAddress))
            revert NexusEventGate__InvalidFanTokenAddress();

        // Check if the event ID already exists
        if (
            getTokenIdsFromEventId(eventId).length > 0 ||
            getAccessLevelsFromEventId(eventId).length > 0
        ) {
            revert NexusEventGate__EventIdAlreadyExists();
        }

        // Check if the user owns fan tokens
        if (!checkUserOwnFanTokens(fanTokenAddress, userAddress))
            revert NexusEventGate__UserDoesNotHoldFanTokens();

        uint256 tokenId = generateTokenId(eventId, userAddress, "COMMUNITY");

        s_eventIdToTokenIds[eventId].push(tokenId);
        s_eventIdToEndTimestamp[eventId] = uint64(block.timestamp + 1 weeks);
        // s_eventIdToEndTimestamp[eventId] = endTimestamp;
        s_tokenIdToTicketLimit[tokenId] = ticketLimit;
        _mint(userAddress, tokenId, 1, "");

        emit EventRegistered(eventId, userAddress, endTimestamp);
    }

    /// @notice Function to withdraw the collected amount for an event ID by the event manager
    /// @param eventId The ID of the event
    /// @dev Only the event manager can call this function
    function withdrawCollectedAmountForEventId(uint64 eventId)
        public
        nonReentrant
    {
        // Check if the caller is the event manager
        if (!checkIfCallerIsEventManager(eventId, _msgSender()))
            revert NexusEventGate__UserIsNotAnEventManager();

        uint256 _amountToTransfer = getCollectedAmountForEventId(eventId);

        s_collectedAmountForEventId[eventId] = 0;

        // Transfer the collected amount to the event manager
        (bool check, ) = _msgSender().call{value: _amountToTransfer}("");
        if (!check) revert NexusEventGate__TransactionFailed();
    }

    /// @notice Function to update the address of the Nexus Token Contract
    /// @param newNexusTokenAddress The new address to be set
    /// @dev Only callable by the contract owner
    function updateNexusTokenContractAddress(address newNexusTokenAddress)
        public
        onlyOwner
    {
        s_nexusTokenContract = newNexusTokenAddress;
    }

    /*****************************
        HELPER VIEW FUNCTIONS
    ******************************/

    /// @notice Function to generate a token ID based on event ID, event registerer, and access level
    /// @param eventId The ID of the event
    /// @param eventRegisterer The address of the event registerer
    /// @param accessLevel The access level for the token
    /// @return uint256 The generated token ID
    function generateTokenId(
        uint64 eventId,
        address eventRegisterer,
        string memory accessLevel
    ) public view returns (uint256) {
        string memory addressToString = Strings.toHexString(
            uint256(uint160(eventRegisterer)),
            20
        );
        string memory concatenatedString = string(
            abi.encodePacked(eventId, addressToString, accessLevel)
        );

        uint256 tokenId = uint256(keccak256(bytes(concatenatedString)));

        if (checkTokenIdExistsForEventId(eventId, tokenId))
            revert NexusEventGate__TokenIdAlreadyExists();

        return tokenId;
    }

    /// @notice Function to get the token ID of an event manager
    /// @param eventId The ID of the event
    /// @return uint256 The token ID of the event manager
    function getTokenIdOfAnEventManager(uint64 eventId)
        public
        view
        returns (uint256)
    {
        return s_eventIdToTokenIds[eventId][0];
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
        uint256[] memory tokenIds = getTokenIdsFromEventId(eventId);
        string[] memory accessLevels = getAccessLevelsFromEventId(eventId);

        for (
            uint256 i = 0;
            i < tokenIds.length && i < accessLevels.length;
            ++i
        ) {
            if (
                keccak256(bytes(_accessLevel)) ==
                keccak256(bytes(accessLevels[i]))
            ) {
                _tokenId = tokenIds[i];
                break;
            }
        }

        if (_tokenId == 0) {
            revert NexusEventGate__TokenIdDoesNotExists();
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
            );
        if (!success) revert NexusEventGate__TransactionFailed();
        return abi.decode(boolInBytes, (bool));
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
            );
        if (!success) revert NexusEventGate__TransactionFailed();
        return abi.decode(boolInBytes, (bool));
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
        uint256 _tokenId = getTokenIdOfAnEventManager(eventId);
        return balanceOf(_callerAddress, _tokenId) >= 1;
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
        uint256[] memory _tokenIds = getTokenIdsFromEventId(eventId);
        for (uint256 i = 0; i < _tokenIds.length; ++i) {
            if (_tokenIds[i] == _tokenId) {
                return true;
            }
        }
        return false;
    }

    /// @notice Function to check if an access level exists for an event
    /// @param eventId The ID of the event
    /// @param _accessLevel The access level to check
    /// @return bool True if the access level exists for the event, false otherwise
    function checkAccessLevelExists(
        uint64 eventId,
        string calldata _accessLevel
    ) public view returns (bool) {
        string[] memory _accessLevels = getAccessLevelsFromEventId(eventId);
        for (uint256 i = 0; i < _accessLevels.length; ++i) {
            if (
                keccak256(bytes(_accessLevel)) ==
                keccak256(bytes(_accessLevels[i]))
            ) {
                return true;
            }
        }
        return false;
    }

    /*****************************
        GETTER VIEW FUNCTIONS
    ******************************/

    /// @notice Function to get the token IDs for an event ID
    /// @param eventId The ID of the event
    /// @return uint256[] Array of token IDs for the event
    function getTokenIdsFromEventId(uint64 eventId)
        public
        view
        returns (uint256[] memory)
    {
        return s_eventIdToTokenIds[eventId];
    }

    /// @notice Function to get the access levels for an event ID
    /// @param eventId The ID of the event
    /// @return string[] Array of access levels for the event
    function getAccessLevelsFromEventId(uint64 eventId)
        public
        view
        returns (string[] memory)
    {
        return s_eventIdToAccessLevels[eventId];
    }

    /// @notice Function to get the ticket price for a token ID
    /// @param _tokenId The token ID to query
    /// @return uint256 The ticket price for the token ID
    function getTicketPriceFromTokenId(uint256 _tokenId)
        public
        view
        returns (uint256)
    {
        return s_tokenIdToTicketPrice[_tokenId];
    }

    /// @notice Function to get the collected amount for an event ID
    /// @param eventId The ID of the event
    /// @return uint256 The collected amount for the event ID
    function getCollectedAmountForEventId(uint64 eventId)
        public
        view
        returns (uint256)
    {
        return s_collectedAmountForEventId[eventId];
    }

    /// @notice Function to get the event end timestamp for an event ID
    /// @param eventId The ID of the event
    /// @return uint64 The end timestamp for the event ID
    function getEventEndTimestamp(uint64 eventId) public view returns (uint64) {
        return s_eventIdToEndTimestamp[eventId];
    }

    /// @notice Function to get the ticket limit for a token ID
    /// @param tokenId The token ID to query
    /// @return uint8 The ticket limit for the token ID
    function getTicketLimit(uint256 tokenId) public view returns (uint8) {
        return s_tokenIdToTicketLimit[tokenId];
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
        return string.concat(super.uri(tokenId), Strings.toString(tokenId));
    }

    /// @notice Override to prevent the transfer of tickets (Soul Bound Tokens)
    /// @param from The address transferring the token
    /// @param to The address receiving the token
    /// @param id The token ID being transferred
    /// @param value The number of tokens being transferred
    /// @param data Additional data sent along with the transfer
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 value,
        bytes memory data
    ) public virtual override {
        revert("NexusEventGate: Tickets are Soul Bound");
    }

    /// @notice Override to prevent the batch transfer of tickets (Soul Bound Tokens)
    /// @param from The address transferring the tokens
    /// @param to The address receiving the tokens
    /// @param ids Array of token IDs being transferred
    /// @param values Array of the number of tokens being transferred
    /// @param data Additional data sent along with the batch transfer
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values,
        bytes memory data
    ) public virtual override {
        revert("NexusEventGate: Tickets are Soul Bound");
    }

    /// @notice Internal function to update balances after a transfer (overrides ERC1155 and ERC1155Supply)
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
        super._update(from, to, ids, values);
    }

    // Function to receive Ether into the contract
    receive() external payable {}
}

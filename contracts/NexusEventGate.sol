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

    mapping(uint64 => uint256) private s_eventIdToNexusDrop;

    /// @notice Constructor to initialize the contract
    constructor() ERC1155("https://chiliz-nexus/") Ownable(_msgSender()) {
        _name = "NexusEventGate";
        _symbol = "NEGT";
    }

    /*****************************
        STATE UPDATE FUNCTIONS
    ******************************/

    /// @notice Function to set the base URI for the token metadata
    /// @param newuri The new base URI to be set
    function setBaseURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function nexusDrop(uint64 eventId) public payable {
        s_eventIdToNexusDrop[eventId] += msg.value;
    }

    function trnasferAmount(uint64 eventId, address[] calldata userAddresses)
        public
        onlyOwner
    {
        if (!checkIfCallerIsEventManager(eventId, _msgSender())) revert();
        uint256 collectedAmount = s_eventIdToNexusDrop[eventId];
        if (collectedAmount == 0)
            revert NexusEventGate__ZeroAmountForTokenDrop();
        uint256 len = userAddresses.length;
        uint256 amountPerUser = (collectedAmount * (10**18)) / len;
        if (amountPerUser == 0)
            revert NexusEventGate__InsufficientBalanceForTokenDrop();

        for (uint256 i; i < len; ++i) {
            (bool check, ) = userAddresses[i].call{value: amountPerUser}("");
            if (!check) revert NexusEventGate__TransactionFailed();
        }
    }

    /// @notice Function to register a live event
    /// @param eventId The ID of the event
    /// @param fanTokenAddress The address of the fan token contract
    /// @param userAddress The address of the event manager
    /// @param endTimestamp The end timestamp of the event
    /// @param accessLevels Array of access levels for the event
    /// @param ticketPrices Array of ticket prices corresponding to access levels
    /// @param ticketLimits Array of ticket limits corresponding to access levels
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
            revert NexusEventGate__InvalidInputAddress();

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
        s_eventIdToEndTimestamp[eventId] = endTimestamp;

        uint256 eventManagerTokenId = getTokenIdOfAnEventManager(eventId);
        _mint(userAddress, eventManagerTokenId, 1, "");
    }

    /// @notice Function to register a community event
    /// @param eventId The ID of the event
    /// @param fanTokenAddress The address of the fan token contract
    /// @param userAddress The address of the event manager
    /// @param endTimestamp The end timestamp of the event
    /// @param ticketLimit The limit on the number of tickets
    function registerCommunityEvent(
        uint64 eventId,
        address fanTokenAddress,
        address userAddress,
        uint64 endTimestamp,
        uint8 ticketLimit
    ) public {
        // Check if the fan token address is supported
        if (!isSupportedFanToken(fanTokenAddress))
            revert NexusEventGate__InvalidInputAddress();

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
        s_eventIdToEndTimestamp[eventId] = endTimestamp;
        s_tokenIdToTicketLimit[tokenId] = ticketLimit;
        _mint(userAddress, tokenId, 1, "");
    }

    /// @notice Function to mint a live event ticket
    /// @param eventId The ID of the event
    /// @param fanTokenAddress The address of the fan token contract
    /// @param to The address to mint the ticket to
    /// @param accessLevel The access level for the ticket
    function mintLiveTicket(
        uint64 eventId,
        address fanTokenAddress,
        address to,
        string calldata accessLevel
    ) public payable nonReentrant {
        // Check if the provided recipient address is valid
        if (to == address(0)) {
            revert NexusEventGate__InvalidInputAddress();
        }
        // Check if the provided fanToken is supported
        if (!isSupportedFanToken(fanTokenAddress)) {
            revert NexusEventGate__InvalidInputAddress();
        }

        // Check if the user owns fan tokens
        if (!checkUserOwnFanTokens(fanTokenAddress, _msgSender()))
            revert NexusEventGate__UserDoesNotHoldFanTokens();

        // Generate or fetch the token ID associated with the event and access level
        uint256 tokenId = getTokenIdOfAccessLevel(eventId, accessLevel);
        if (tokenId == getTokenIdOfAnEventManager(eventId))
            revert NexusEventGate__UserIsNotAnEventManager();
        if (getTicketLimit(tokenId) < uint8(totalSupply(tokenId)) + 1)
            revert NexusEventGate__TicketLimitExceeded();
        if (getEventEndTimestamp(eventId) < uint64(block.timestamp))
            revert NexusEventGate__EventEnded();

        // Check if the correct ticket price was paid
        if (getTicketPriceFromTokenId(tokenId) != msg.value)
            revert NexusEventGate__IncorrectTicketPrice();

        s_collectedAmountForEventId[eventId] += msg.value;

        // Mint the ticket to the recipient
        _mint(to, tokenId, 1, "");
    }

    /// @notice Function for event managers to mint live event tickets
    /// @param eventId The ID of the event
    /// @param fanTokenAddress The address of the fan token contract
    /// @param to The address to mint the ticket to
    /// @param accessLevel The access level for the ticket
    function mintLiveTicketByEventManager(
        uint64 eventId,
        address fanTokenAddress,
        address to,
        string calldata accessLevel
    ) public {
        // Check if the provided recipient address is valid
        if (to == address(0)) {
            revert NexusEventGate__InvalidInputAddress();
        }
        // Check if the provided fanToken is supported
        if (!isSupportedFanToken(fanTokenAddress))
            revert NexusEventGate__InvalidInputAddress();

        if (!checkAccessLevelExists(eventId, accessLevel))
            revert NexusEventGate__AccessLevelDoesNotExists();

        // Check if the caller is the event manager
        if (!checkIfCallerIsEventManager(eventId, _msgSender())) {
            revert NexusEventGate__UserIsNotAnEventManager();
        }
        // Check if the user owns fan tokens
        if (!checkUserOwnFanTokens(fanTokenAddress, _msgSender()))
            revert NexusEventGate__UserDoesNotHoldFanTokens();

        uint256 tokenId = getTokenIdOfAccessLevel(eventId, accessLevel);
        if (getTicketLimit(tokenId) < uint8(totalSupply(tokenId)) + 1)
            revert NexusEventGate__TicketLimitExceeded();
        if (getEventEndTimestamp(eventId) < uint64(block.timestamp))
            revert NexusEventGate__EventEnded();

        // Mint the ticket to the recipient
        _mint(to, tokenId, 1, "");
    }

    /// @notice Function to mint a community event ticket
    /// @param eventId The ID of the event
    /// @param fanTokenAddress The address of the fan token contract
    /// @param to The address to mint the ticket to
    function mintCommunityTicket(
        uint64 eventId,
        address fanTokenAddress,
        address to
    ) public {
        // Check if the provided recipient address is valid
        if (to == address(0)) revert NexusEventGate__InvalidInputAddress();

        // Check if the provided fanToken is supported
        if (!isSupportedFanToken(fanTokenAddress))
            revert NexusEventGate__InvalidInputAddress();

        // Check if the user owns fan tokens
        if (!checkUserOwnFanTokens(fanTokenAddress, _msgSender()))
            revert NexusEventGate__UserDoesNotHoldFanTokens();

        uint256 tokenId = getTokenIdOfAnEventManager(eventId);

        if (getTicketLimit(tokenId) < uint8(totalSupply(tokenId)) + 1)
            revert NexusEventGate__TicketLimitExceeded();
        if (getEventEndTimestamp(eventId) < uint64(block.timestamp))
            revert NexusEventGate__EventEnded();

        // Mint the ticket to the recipient
        _mint(to, tokenId, 1, "");
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
        // Check if the caller is the event manager for the specified event
        if (!checkIfCallerIsEventManager(eventId, _msgSender())) {
            revert NexusEventGate__UserIsNotAnEventManager();
        }

        // Check if the access level already exists for the event
        if (checkAccessLevelExists(eventId, newAccessLevel)) {
            revert NexusEventGate__AccessLevelAlreadyExists();
        }

        // Generate a new token ID for the provided access level
        uint256 tokenId = generateTokenId(
            eventId,
            _msgSender(),
            newAccessLevel
        );

        // Update the mappings with the new access level and its corresponding data
        s_eventIdToTokenIds[eventId].push(tokenId);
        s_eventIdToAccessLevels[eventId].push(newAccessLevel);
        s_tokenIdToTicketPrice[tokenId] = newTicketPrice;
        s_tokenIdToTicketLimit[tokenId] = newTicketLimit;
    }

    /// @notice Function for event managers to withdraw the collected amount for an event
    /// @param eventId The ID of the event
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
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC721, ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {IERC721} from "@openzeppelin/contracts/interfaces/IERC721.sol";
import {ISP, Attestation} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {ISPHook, IERC20} from "@ethsign/sign-protocol-evm/src/interfaces/ISPHook.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Error triggered when the attester is not an official.
error NexusEventHook__AttesterMustBeAnOfficial();

/// @notice Error triggered when the event type must be Virtual or Community.
error NexusEventHook__EventMustBeVirtualOrCommunity();

/// @notice Error triggered when the event must be at least one week in the future.
error NexusEventHook__EventMustBeAtLeastOneWeekInFuture();

/// @notice Error triggered when the event timestamp is too far in the future.
error NexusEventHook__EventTimestampTooFarInFuture();

/// @notice Error triggered when the event already exists.
error NexusEventHook__DuplicateEvent();

/// @notice Error triggered when the attestation data length is invalid.
error NexusEventHook__InvalidAttestationDataLength();

/// @notice Error triggered when the event type is invalid.
error NexusEventHook__InvalidEventType();

/// @notice Error triggered when a role already exists for a fan token.
error NexusEventHook__RoleAlreadyExists();

/// @notice Error triggered when the role does not exist.
error NexusEventHook__RoleDoesNotExist();

/// @notice Error triggered when no official is assigned to a role.
error NexusEventHook__NoOfficialAssigned();

/// @notice Error triggered when the attester is invalid.
error NexusEventHook__InvalidAttester();

/// @notice Error triggered when NFT transfers are not allowed.
error NexusEventHook__TransferNotAllowed();

/// @notice Error triggered when the token drop amount is zero.
error NexusEventHook__ZeroAmountForTokenDrop();

/// @notice Error triggered when the contract balance is insufficient for token drop.
error NexusEventHook__InsufficientBalanceForTokenDrop();

/// @notice Error triggered when the transaction failed.
error NexusEventHook__TransactionFailed();

/// @notice Error triggered when the input address is invalid.
error NexusEventHook__InvalidInputAddress();

/// @notice Error triggered when no user addresses are provided for the token drop.
error NexusEventHook__NoUserAddressesProvided();

/// @title NexusEventHook - A contract for managing event-based NFTs and distributing token drops.
/// @dev Extends ERC721Enumerable and implements ISPHook.
contract NexusEventHook is ERC721Enumerable, ISPHook, Ownable {
    /// @notice Enum defining the types of events: LIVE, VIRTUAL, and COMMUNITY.
    enum EventType {
        LIVE, // Live event type
        VIRTUAL, // Virtual event type
        COMMUNITY // Community event type
    }

    /// @notice ISP contract used to manage attestations.
    ISP private s_baseIspContract;

    /// @notice Mapping between fan token address and the associated role.
    mapping(address => bytes32) private s_fanTokenAddressToRole;

    /// @notice Mapping between role and the official address for the role.
    mapping(bytes32 => address) private s_roleToOfficial;

    /// @notice Mapping from event ID to the collected drop amount.
    mapping(uint64 => uint256) private s_eventIdToNexusDrop;

    string private s_baseURI;

    /// @notice Event emitted when a transfer attempt is made.
    /// @param recipient The address of the recipient of the token drop.
    /// @param amount The amount of native tokens distributed.
    event TransferAttempt(address indexed recipient, uint256 indexed amount);

    /// @notice Event emitted when a Nexus drop is added.
    /// @param eventId The ID of the event.
    /// @param amountAdded The amount of funds added.
    event NexusDropAdded(uint64 indexed eventId, uint256 amountAdded);

    /// @notice Event emitted when a Nexus drop is distributed.
    /// @param eventId The ID of the event.
    /// @param recipients The array of recipient addresses.
    /// @param amountPerUser The amount distributed per user.
    event NexusDropDistributed(
        uint64 indexed eventId,
        address[] recipients,
        uint256 amountPerUser
    );

    /// @notice Event emitted when an official is updated for a role.
    /// @param fanTokenAddress The address of the fan token.
    /// @param newOfficial The address of the new official.
    event OfficialUpdated(address indexed fanTokenAddress, address newOfficial);

    /// @notice Event emitted when a role is added for a fan token.
    /// @param fanTokenAddress The address of the fan token.
    /// @param role The new role.
    /// @param official The address of the official.
    event RoleAdded(
        address indexed fanTokenAddress,
        bytes32 role,
        address official
    );

    /// @notice Event emitted when an attestation is received and NFT minted.
    /// @param attester The address of the attester.
    /// @param attestationId The ID of the attestation.
    event AttestationReceived(
        address indexed attester,
        uint64 indexed attestationId
    );

    /// @notice Event emitted when an attestation is revoked and the NFT burned.
    /// @param attester The address of the attester.
    /// @param attestationId The ID of the attestation.
    event AttestationRevoked(
        address indexed attester,
        uint64 indexed attestationId
    );

    /// @notice Constructor to initialize the contract.
    /// @dev The contract deployer is assigned as the official for the defined roles.
    constructor() ERC721("ChilizNexusEvent", "CNE") Ownable(_msgSender()) {
        /// Initialize the ISP contract address.
        s_baseIspContract = ISP(0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD);

        s_baseURI = "https://chiliz-nexus/events/";

        /// Define roles for BAR, JUV, and PSG official fan tokens.
        bytes32 BAR_OFFICIAL_ROLE = keccak256("BAR_OFFICIAL_ROLE");
        bytes32 JUV_OFFICIAL_ROLE = keccak256("JUV_OFFICIAL_ROLE");
        bytes32 PSG_OFFICIAL_ROLE = keccak256("PSG_OFFICIAL_ROLE");

        /// Map fan token addresses to their respective roles.
        s_fanTokenAddressToRole[
            0xE2E39B1A5eFe07743F9E0E8408F1B7aAB6B7f832
        ] = BAR_OFFICIAL_ROLE;
        s_fanTokenAddressToRole[
            0xA4e42B23B86DF349c91a5F87701C4c575b58DBD5
        ] = JUV_OFFICIAL_ROLE;
        s_fanTokenAddressToRole[
            0x5E36A22751f56aECE9A970beac728De684E7Bd1E
        ] = PSG_OFFICIAL_ROLE;

        /// Assign the contract deployer as the official for each role.
        s_roleToOfficial[
            BAR_OFFICIAL_ROLE
        ] = 0x02C8345B2DF9Ff6122b0bE7B79cB219d956bd701;
        s_roleToOfficial[
            JUV_OFFICIAL_ROLE
        ] = 0x02C8345B2DF9Ff6122b0bE7B79cB219d956bd701;
        s_roleToOfficial[
            PSG_OFFICIAL_ROLE
        ] = 0x02C8345B2DF9Ff6122b0bE7B79cB219d956bd701;
    }

    /*****************************
        STATE UPDATE FUNCTIONS
    ******************************/

    /// @notice Function to add funds to an event's Nexus drop.
    /// @param eventId The ID of the event to add the drop amount to.
    function nexusDrop(uint64 eventId) public payable {
        s_eventIdToNexusDrop[eventId] += msg.value;
        emit NexusDropAdded(eventId, msg.value);
    }

    /// @notice Function to distribute the collected drop amount equally to the provided user addresses.
    /// @param eventId The ID of the event.
    /// @param userAddresses The array of addresses to receive the drop.
    /// @dev The drop is distributed equally and can only be called by the contract owner.
    function distributeDrop(uint64 eventId, address[] calldata userAddresses)
        public
        onlyOwner
    {
        uint256 collectedAmount = s_eventIdToNexusDrop[eventId];
        if (collectedAmount == 0)
            revert NexusEventHook__ZeroAmountForTokenDrop();
        if (address(this).balance < collectedAmount)
            revert NexusEventHook__InsufficientBalanceForTokenDrop();

        uint256 len = userAddresses.length;
        if (len == 0) {
            revert NexusEventHook__NoUserAddressesProvided();
        }

        uint256 amountPerUser = (collectedAmount) / len;
        if (amountPerUser == 0)
            revert NexusEventHook__InsufficientBalanceForTokenDrop();

        // Update state first to prevent reentrancy
        s_eventIdToNexusDrop[eventId] = 0;

        for (uint256 i = 0; i < len; ++i) {
            if (userAddresses[i] == address(0)) {
                revert NexusEventHook__InvalidInputAddress();
            }

            (bool check, ) = userAddresses[i].call{value: amountPerUser}("");
            if (!check) revert NexusEventHook__TransactionFailed();
            emit TransferAttempt(userAddresses[i], amountPerUser);
        }

        emit NexusDropDistributed(eventId, userAddresses, amountPerUser);
    }

    /// @notice Function to update the official assigned to a role.
    /// @param fanTokenAddress The address of the fan token.
    /// @param newOfficial The address of the new official for the role.
    function updateOfficial(address fanTokenAddress, address newOfficial)
        public
        onlyOwner
    {
        bytes32 role = s_fanTokenAddressToRole[fanTokenAddress];
        if (role == bytes32(0)) revert NexusEventHook__RoleDoesNotExist();
        s_roleToOfficial[role] = newOfficial;
        emit OfficialUpdated(fanTokenAddress, newOfficial);
    }

    /// @notice Function to add a new role and assign an official.
    /// @param fanTokenAddress The address of the fan token.
    /// @param newRole The name of the new role.
    /// @param official The address of the official for the role.
    function addRole(
        address fanTokenAddress,
        string calldata newRole,
        address official
    ) public onlyOwner {
        if (doesRoleExistForFanToken(fanTokenAddress))
            revert NexusEventHook__RoleAlreadyExists();
        bytes32 role = keccak256(bytes(newRole));
        s_fanTokenAddressToRole[fanTokenAddress] = role;
        s_roleToOfficial[role] = official;
        emit RoleAdded(fanTokenAddress, role, official);
    }

    /// @notice Function to update the ISP contract address.
    /// @param newIspContract The new ISP contract address.
    function updateIspContract(address newIspContract) public onlyOwner {
        s_baseIspContract = ISP(newIspContract);
    }

    function updateBaseURI(string calldata newBaseURI) public onlyOwner {
        s_baseURI = newBaseURI;
    }

    /*****************************
        HELPER VIEW FUNCTIONS
    ******************************/

    function _baseURI() internal view virtual override returns (string memory) {
        return s_baseURI;
    }

    function getBaseURI() public view returns (string memory) {
        return _baseURI();
    }

    /// @notice Function to check if an event exists by verifying the owner of the NFT.
    /// @param attestationId The ID of the attestation.
    /// @return bool Returns true if the event exists, false otherwise.
    function checkEventExists(uint64 attestationId) public view returns (bool) {
        try this.ownerOf(attestationId) returns (address owner) {
            return owner != address(0);
        } catch {
            return false;
        }
    }

    /// @notice Function to check if a given address is the attester for a specific event.
    /// @param attestationId The ID of the attestation.
    /// @param userAddress The address to check.
    /// @return bool Returns true if the user is the attester, false otherwise.
    function checkAttester(uint64 attestationId, address userAddress)
        public
        view
        returns (bool)
    {
        try this.ownerOf(attestationId) returns (address owner) {
            return owner == userAddress;
        } catch {
            // In case ownerOf reverts (e.g., attestation does not exist), return false
            return false;
        }
    }

    /// @notice Function to get all hosted events by a user.
    /// @param userAddress The address of the user.
    /// @return uint64[] Returns an array of attestation IDs hosted by the user.
    function getHostedEvents(address userAddress)
        public
        view
        returns (uint64[] memory)
    {
        /// Get the total number of events hosted by the user.
        uint256 totalUserEvents = balanceOf(userAddress);
        uint64[] memory eventIds = new uint64[](totalUserEvents);

        /// Loop through each event hosted by the user and populate the event IDs.
        for (uint256 i = 0; i < totalUserEvents; ++i) {
            eventIds[i] = uint64(tokenOfOwnerByIndex(userAddress, i));
        }

        return eventIds;
    }

    /// @notice Getter function to retrieve the role associated with a fan token address.
    /// @param fanTokenAddress The address of the fan token.
    /// @return bytes32 The role associated with the fan token.
    function getRoleForFanToken(address fanTokenAddress)
        public
        view
        returns (bytes32)
    {
        return s_fanTokenAddressToRole[fanTokenAddress];
    }

    /// @notice Getter function to retrieve the official associated with a specific role.
    /// @param role The role to query.
    /// @return address The official assigned to the role.
    function getOfficialAddressForRole(bytes32 role)
        public
        view
        returns (address)
    {
        return s_roleToOfficial[role];
    }

    /// @notice Function to check if a role exists for a fan token address.
    /// @param fanTokenAddress The address of the fan token.
    /// @return bool Returns true if the role exists, false otherwise.
    function doesRoleExistForFanToken(address fanTokenAddress)
        public
        view
        returns (bool)
    {
        return s_fanTokenAddressToRole[fanTokenAddress] != bytes32(0);
    }

    /// @notice Function to check if an official is assigned to a given role.
    /// @param role The role to check.
    /// @return bool Returns true if an official is assigned, false otherwise.
    function isOfficialAssigned(bytes32 role) public view returns (bool) {
        return s_roleToOfficial[role] != address(0);
    }

    /// @notice Function to check if a specific user is an official for a fan token.
    /// @param fanTokenAddress The address of the fan token.
    /// @param userAddress The address of the user.
    /// @return bool Returns true if the user is an official, false otherwise.
    function isOfficial(address fanTokenAddress, address userAddress)
        public
        view
        returns (bool)
    {
        bytes32 role = s_fanTokenAddressToRole[fanTokenAddress];
        return s_roleToOfficial[role] == userAddress;
    }

    /*****************************
        HELPER HOOK FUNCTIONS
    ******************************/

    /// @notice Function to check the attestation and validate the event and attester.
    /// @param attestationId The ID of the attestation.
    /// @param attester The address of the attester.
    function checkAttestationHook(uint64 attestationId, address attester)
        public
        view
    {
        /// Get attestation details from the ISP contract.
        Attestation memory attestationInfo = s_baseIspContract.getAttestation(
            attestationId
        );

        (
            address fanTokenAddress,
            string memory eventName,
            uint256 eventTypeUint,
            string memory eventLocation,
            uint256 eventTimestamp,
            uint256 ticketLimit,
            string memory metadata
        ) = abi.decode(
                attestationInfo.data,
                (address, string, uint256, string, uint256, uint256, string)
            );

        /// Convert eventTypeUint into an EventType enum.
        EventType eventType = EventType(eventTypeUint);

        /// Ensure that the eventTypeUint is within a valid range for the EventType enum.
        if (eventTypeUint > uint256(EventType.COMMUNITY))
            revert NexusEventHook__InvalidEventType();

        uint256 currentTime = block.timestamp;

        /// Check if the event is at least one week in the future.
        if (eventTimestamp < currentTime + 1 weeks)
            revert NexusEventHook__EventMustBeAtLeastOneWeekInFuture();

        /// Check if the event is not too far in the future (more than 52 weeks).
        if (eventTimestamp > currentTime + 52 weeks)
            revert NexusEventHook__EventTimestampTooFarInFuture();

        /// Check if the event already exists.
        if (checkEventExists(attestationId))
            revert NexusEventHook__DuplicateEvent();

        /// Check if the event type is LIVE and the attester is an official.
        if (eventType == EventType.LIVE) {
            if (!isOfficial(fanTokenAddress, attester))
                revert NexusEventHook__AttesterMustBeAnOfficial();
            /// If event type is neither VIRTUAL nor COMMUNITY, revert.
        } else if (
            eventType != EventType.VIRTUAL && eventType != EventType.COMMUNITY
        ) {
            /// If the event type is neither VIRTUAL nor COMMUNITY, revert.
            revert NexusEventHook__EventMustBeVirtualOrCommunity();
        }
    }

    /// @notice Function to check the revocation of an attestation.
    /// @param attestationId The ID of the attestation.
    /// @param attester The address of the attester.
    function checkRevocationHook(uint64 attestationId, address attester)
        public
        view
    {
        checkEventExists(attestationId);
        checkAttester(attestationId, attester);
    }

    /*****************************
        ISP HOOK FUNCTIONS
    ******************************/

    /// @notice Function to handle received attestations and mint the corresponding NFT.
    /// @param attester The address of the attester.
    /// @param attestationId The ID of the attestation.
    function didReceiveAttestation(
        address attester,
        uint64,
        uint64 attestationId,
        bytes calldata
    ) public payable {
        checkAttestationHook(attestationId, attester);
        _mint(attester, attestationId);
        emit AttestationReceived(attester, attestationId);
    }

    /// @notice Fallback function to handle attestations with ERC20 tokens.
    /// @param attester The address of the attester.
    /// @param attestationId The ID of the attestation.
    function didReceiveAttestation(
        address attester,
        uint64,
        uint64 attestationId,
        IERC20,
        uint256,
        bytes calldata
    ) public view {
        checkAttestationHook(attestationId, attester);
    }

    /// @notice Function to handle attestation revocation and burn the corresponding NFT.
    /// @param attester The address of the attester.
    /// @param attestationId The ID of the attestation.
    function didReceiveRevocation(
        address attester,
        uint64,
        uint64 attestationId,
        bytes calldata
    ) public payable {
        checkRevocationHook(attestationId, attester);
        _burn(attestationId);
        emit AttestationRevoked(attester, attestationId);
    }

    /// @notice Fallback function to handle revocation with ERC20 tokens.
    /// @param attester The address of the attester.
    /// @param attestationId The ID of the attestation.
    function didReceiveRevocation(
        address attester,
        uint64,
        uint64 attestationId,
        IERC20,
        uint256,
        bytes calldata
    ) public view {
        checkRevocationHook(attestationId, attester);
    }

    /// @notice Function to return the total number of events by querying the ISP contract's attestation counter.
    /// @return uint64 The total number of events.
    function totalEvents() public view returns (uint64) {
        return s_baseIspContract.attestationCounter();
    }

    /*****************************
        OVERRIDE FUNCTIONS
    ******************************/

    /// @notice Override to disable token transfers for event NFTs.
    function _safeTransfer(
        address,
        address,
        uint256,
        bytes memory
    ) internal virtual override {
        revert NexusEventHook__TransferNotAllowed();
    }

    /// @notice Override to disable safe transfer of NFTs.
    function safeTransferFrom(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override(ERC721, IERC721) {
        revert NexusEventHook__TransferNotAllowed();
    }

    /// @notice Override to disable direct transfer of NFTs.
    function transferFrom(
        address,
        address,
        uint256
    ) public virtual override(ERC721, IERC721) {
        revert NexusEventHook__TransferNotAllowed();
    }

    /// @notice Override to retrieve the token URI for a given NFT.
    /// @param tokenId The ID of the token to retrieve the URI for.
    /// @return string The token URI.
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}

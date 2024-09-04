// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC721, ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {IERC721} from "@openzeppelin/contracts/interfaces/IERC721.sol";
import {ISP, Attestation} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {ISPHook, IERC20} from "@ethsign/sign-protocol-evm/src/interfaces/ISPHook.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// Error triggered when the attester is not an official.
error NexusEventHook__AttesterMustBeAnOfficial();
/// Error triggered when the event type must be Virtual or Community.
error NexusEventHook__EventMustBeVirtualOrCommunity();
/// Error triggered when the event must be at least one week in the future.
error NexusEventHook__EventMustBeAtLeastOneWeekInFuture();
/// Error triggered when the event timestamp is too far in the future.
error NexusEventHook__EventTimestampTooFarInFuture();
/// Error triggered when the event already exists.
error NexusEventHook__DuplicateEvent();
/// Error triggered when the attestation data length is invalid.
error NexusEventHook__InvalidAttestationDataLength();
/// Error triggered when the event type is invalid.
error NexusEventHook__InvalidEventType();
/// Error triggered when a role already exists for a fan token.
error NexusEventHook__RoleAlreadyExists();
/// Error triggered when the role does not exist.
error NexusEventHook__RoleDoesNotExist();
/// Error triggered when no official is assigned to a role.
error NexusEventHook__NoOfficialAssigned();
/// Error triggered when the attester is invalid.
error NexusEventHook__InvalidAttester();
/// Error triggered when NFT transfers are not allowed.
error NexusEventHook__TransferNotAllowed();

/// Contract NexusEventHook for managing event-based NFTs, extending ERC721Enumerable and implementing ISPHook.
contract NexusEventHook is ERC721Enumerable, ISPHook, Ownable {
    /// Enum defining the event types: LIVE, VIRTUAL, and COMMUNITY.
    enum EventType {
        LIVE,
        VIRTUAL,
        COMMUNITY
    }

    /// ISP contract used to manage attestations.
    ISP private s_baseIspContract;

    /// Mapping between fan token address and the associated role.
    mapping(address => bytes32) private s_fanTokenAddressToRole;

    /// Mapping between role and the official address for the role.
    mapping(bytes32 => address) private s_roleToOfficial;

    /// Constructor that initializes the contract with the initial roles and assigns the deployer as the official.
    constructor() ERC721("NexusBasedEvent", "NBE") Ownable(_msgSender()) {
        /// Initialize the ISP contract address.
        s_baseIspContract = ISP(0x2b3224D080452276a76690341e5Cfa81A945a985);

        /// Define roles for BAR, JUV, and PSG official fan tokens.
        bytes32 BAR_OFFICIAL_ROLE = keccak256("BAR_OFFICIAL_ROLE");
        bytes32 JUV_OFFICIAL_ROLE = keccak256("JUV_OFFICIAL_ROLE");
        bytes32 PSG_OFFICIAL_ROLE = keccak256("PSG_OFFICIAL_ROLE");

        /// Map fan token addresses to their respective roles.
        s_fanTokenAddressToRole[
            0x2b3224D080452276a76690341e5Cfa81A945a985
        ] = BAR_OFFICIAL_ROLE;
        s_fanTokenAddressToRole[
            0x2b3224D080452276a76690341e5Cfa81A945a985
        ] = JUV_OFFICIAL_ROLE;
        s_fanTokenAddressToRole[
            0x2b3224D080452276a76690341e5Cfa81A945a985
        ] = PSG_OFFICIAL_ROLE;

        /// Assign the contract deployer as the official for each role.
        s_roleToOfficial[BAR_OFFICIAL_ROLE] = _msgSender();
        s_roleToOfficial[JUV_OFFICIAL_ROLE] = _msgSender();
        s_roleToOfficial[PSG_OFFICIAL_ROLE] = _msgSender();
    }

    /// Function to check if an event exists by checking if an NFT is owned by an address.
    function checkEventExists(uint64 attestationId) public view returns (bool) {
        return ownerOf(attestationId) != address(0);
    }

    /// Function to check if a given address is the attester for a specific event.
    function checkAttester(uint64 attestationId, address userAddress)
        public
        view
        returns (bool)
    {
        return ownerOf(attestationId) == userAddress;
    }

    /// Function to get all hosted events by a user, returning an array of attestation IDs.
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

    /// Getter function to retrieve the role associated with a fan token address.
    function getFanTokenAddressToRole(address fanTokenAddress)
        public
        view
        returns (bytes32)
    {
        return s_fanTokenAddressToRole[fanTokenAddress];
    }

    /// Getter function to retrieve the official associated with a specific role.
    function getRoleToOfficial(bytes32 role) public view returns (address) {
        return s_roleToOfficial[role];
    }

    /// Function to check if a role exists for a fan token address.
    function doesRoleExist(address fanTokenAddress) public view returns (bool) {
        return s_fanTokenAddressToRole[fanTokenAddress] != bytes32(0);
    }

    /// Function to check if an official is assigned to a given role.
    function isOfficialAssigned(bytes32 role) public view returns (bool) {
        return s_roleToOfficial[role] != address(0);
    }

    /// Function to update the official assigned to a role, only callable by the contract owner.
    function updateRole(address fanTokenAddress, address newOfficial)
        public
        onlyOwner
    {
        bytes32 role = s_fanTokenAddressToRole[fanTokenAddress];
        if (role == bytes32(0)) revert NexusEventHook__RoleDoesNotExist();
        s_roleToOfficial[role] = newOfficial;
    }

    /// Function to add a new role and assign an official, only callable by the contract owner.
    function addRole(
        address fanTokenAddress,
        string calldata newRole,
        address official
    ) public onlyOwner {
        if (doesRoleExist(fanTokenAddress))
            revert NexusEventHook__RoleAlreadyExists();
        bytes32 role = keccak256(bytes(newRole));
        s_fanTokenAddressToRole[fanTokenAddress] = role;
        s_roleToOfficial[role] = official;
    }

    /// Function to check if a specific user is an official for a fan token.
    function isOfficial(address fanTokenAddress, address userAddress)
        public
        view
        returns (bool)
    {
        bytes32 role = s_fanTokenAddressToRole[fanTokenAddress];
        return s_roleToOfficial[role] == userAddress;
    }

    /// Function to check the attestation and validate the event and attester.
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

        /// Check if the event is at least one week in the future.
        if (eventTimestamp < block.timestamp + 1 weeks)
            revert NexusEventHook__EventMustBeAtLeastOneWeekInFuture();
        /// Check if the event is not too far in the future (more than 52 weeks).
        if (eventTimestamp > block.timestamp + 52 weeks)
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
            !(eventType == EventType.VIRTUAL ||
                eventType == EventType.COMMUNITY)
        ) {
            revert NexusEventHook__EventMustBeVirtualOrCommunity();
        }
    }

    /// Function to check the revocation of an attestation.
    function checkRevocationHook(uint64 attestationId, address attester)
        public
        view
    {
        checkEventExists(attestationId);
        checkAttester(attestationId, attester);
    }

    /// Function to handle received attestations and mint the corresponding NFT.
    function didReceiveAttestation(
        address attester,
        uint64,
        uint64 attestationId,
        bytes calldata
    ) public payable {
        checkAttestationHook(attestationId, attester);
        _mint(attester, attestationId);
    }

    /// Fallback function to handle attestations with ERC20 tokens.
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

    /// Function to handle attestation revocation and burn the corresponding NFT.
    function didReceiveRevocation(
        address attester,
        uint64,
        uint64 attestationId,
        bytes calldata
    ) public payable {
        checkRevocationHook(attestationId, attester);
        _burn(attestationId);
    }

    /// Fallback function to handle revocation with ERC20 tokens.
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

    /// Function to return the total number of events by querying the ISP contract's attestation counter.
    function totalEvents() public view returns (uint64) {
        return s_baseIspContract.attestationCounter();
    }

    /// Override to disable token transfers for event NFTs.
    function _safeTransfer(
        address,
        address,
        uint256,
        bytes memory
    ) internal virtual override {
        revert NexusEventHook__TransferNotAllowed();
    }

    /// Override to disable safe transfer of NFTs.
    function safeTransferFrom(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override(ERC721, IERC721) {
        revert NexusEventHook__TransferNotAllowed();
    }

    /// Override to disable direct transfer of NFTs.
    function transferFrom(
        address,
        address,
        uint256
    ) public virtual override(ERC721, IERC721) {
        revert NexusEventHook__TransferNotAllowed();
    }

    /// Override to retrieve the token URI for a given NFT.
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}

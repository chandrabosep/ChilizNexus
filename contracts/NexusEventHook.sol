// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ISPHook} from "@ethsign/sign-protocol-evm/src/interfaces/ISPHook.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

error NexusEventHook__AttesterMustBeAnOfficial();
error NexusEventHook__EventMustBeVirtualOrCommunity();
error NexusEventHook__EventMustBeAtLeastOneWeekInFuture();
error NexusEventHook__EventTimestampTooFarInFuture();
error NexusEventHook__DuplicateEvent();
error NexusEventHook__InvalidExtraDataLength();
error NexusEventHook__InvalidEventType();

contract NexusEventHook is ISPHook, AccessControl {
    using Strings for string;

    bytes32 public constant BAR_OFFICIAL_ROLE = keccak256("BAR_OFFICIAL_ROLE");
    bytes32 public constant JUV_OFFICIAL_ROLE = keccak256("JUV_OFFICIAL_ROLE");
    bytes32 public constant PSG_OFFICIAL_ROLE = keccak256("PSG_OFFICIAL_ROLE");

    enum EventType {
        LIVE,
        VIRTUAL,
        COMMUNITY
    }

    // 32 bytes for fanTokenAddress, 1 byte for eventType, 8 bytes for eventTimestamp
    uint256 private constant EXPECTED_EXTRA_DATA_LENGTH = 41;

    mapping(uint64 => bool) private s_eventExists;
    mapping(address => bytes32) private s_fanTokenAddressToRole;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(BAR_OFFICIAL_ROLE, _msgSender());
        _grantRole(JUV_OFFICIAL_ROLE, _msgSender());
        _grantRole(PSG_OFFICIAL_ROLE, _msgSender());
    }

    function getRoleInBytes(address fanTokenAddress)
        public
        view
        returns (bytes32)
    {
        return s_fanTokenAddressToRole[fanTokenAddress];
    }

    function didReceiveAttestation(
        address attester,
        uint64 schemaId,
        uint64 attestationId,
        bytes calldata extraData
    ) public payable {
        (
            address fanTokenAddress,
            uint8 eventTypeUint,
            uint64 eventTimestamp
        ) = abi.decode(extraData, (address, uint8, uint64));

        // Convert the uint8 value to the corresponding EventType enum
        EventType eventType = EventType(eventTypeUint);
        if (uint8(eventType) >= uint8(EventType.COMMUNITY) + 1) {
            revert NexusEventHook__InvalidEventType();
        }

        if (extraData.length == EXPECTED_EXTRA_DATA_LENGTH)
            revert NexusEventHook__InvalidExtraDataLength();
        // Check if the event is at least one week in the future
        if (eventTimestamp < uint64(block.timestamp + 1 weeks))
            revert NexusEventHook__EventMustBeAtLeastOneWeekInFuture();
        if (eventTimestamp > uint64(block.timestamp + 52 weeks))
            revert NexusEventHook__EventTimestampTooFarInFuture();

        if (s_eventExists[attestationId])
            revert NexusEventHook__DuplicateEvent();
        s_eventExists[attestationId] = true;
        // Check if the event type is "Live"
        if (eventType == EventType.LIVE) {
            // Check if the attester is the official for this fan token
            if (!hasRole(getRoleInBytes(fanTokenAddress), attester))
                revert NexusEventHook__AttesterMustBeAnOfficial();
        }
        // Check if the event type is "Virtual" or "Community"
        else if (
            !(eventType == EventType.VIRTUAL ||
                eventType == EventType.COMMUNITY)
        ) {
            revert NexusEventHook__EventMustBeVirtualOrCommunity();
        } else {
            revert NexusEventHook__InvalidEventType();
        }
    }

    function didReceiveAttestation(
        address attester,
        uint64 schemaId,
        uint64 attestationId,
        IERC20 resolverFeeERC20Token,
        uint256 resolverFeeERC20Amount,
        bytes calldata extraData
    ) external {
        revert();
        // Uncomment and implement if needed
        // return
        //     super.didReceiveAttestation(
        //         attester,
        //         schemaId,
        //         attestationId,
        //         resolverFeeERC20Token,
        //         resolverFeeERC20Amount,
        //         extraData
        //     );
    }

    function didReceiveRevocation(
        address attester,
        uint64 schemaId,
        uint64 attestationId,
        bytes calldata extraData
    ) external payable {
        revert();
        // Uncomment and implement if needed
        // return
        //     super.didReceiveRevocation(
        //         attester,
        //         schemaId,
        //         attestationId,
        //         extraData
        //     );
    }

    function didReceiveRevocation(
        address attester,
        uint64 schemaId,
        uint64 attestationId,
        IERC20 resolverFeeERC20Token,
        uint256 resolverFeeERC20Amount,
        bytes calldata extraData
    ) external view {
        revert();
        // Uncomment and implement if needed
        // return
        //     super.didReceiveRevocation(
        //         attester,
        //         schemaId,
        //         attestationId,
        //         resolverFeeERC20Token,
        //         resolverFeeERC20Amount,
        //         extraData
        //     );
    }
}

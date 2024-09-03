// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ISP} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {ISPHook} from "@ethsign/sign-protocol-evm/src/interfaces/ISPHook.sol";
import {Attestation} from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

error NexusEventHook__AttesterMustBeAnOfficial();
error NexusEventHook__EventMustBeVirtualOrCommunity();
error NexusEventHook__EventMustBeAtLeastOneWeekInFuture();
error NexusEventHook__EventTimestampTooFarInFuture();
error NexusEventHook__DuplicateEvent();
error NexusEventHook__InvalidAttestationDataLength();
error NexusEventHook__InvalidEventType();

contract NexusEventHook is ISPHook, Ownable{
    using Strings for string;

    enum EventType {
        LIVE,
        VIRTUAL,
        COMMUNITY
    }

    ISP private s_baseIspContract;

    bytes32[] s_roles;

    mapping(uint64 => bool) private s_eventExists;
    mapping(address => bytes32) private s_fanTokenAddressToRole;

    constructor() Ownable(_msgSender()){
        s_baseIspContract = ISP(0x2b3224D080452276a76690341e5Cfa81A945a985); // Base ISP contract from Sign Protocol
        s_roles.push(keccak256("BAR_OFFICIAL_ROLE"));
        s_roles.push(keccak256("JUV_OFFICIAL_ROLE"));
        s_roles.push(keccak256("PSG_OFFICIAL_ROLE"));
        // _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        // _grantRole(s_roles[0], _msgSender());
        // _grantRole(s_roles[1], _msgSender());
        // _grantRole(s_roles[2], _msgSender());
        // s_fanTokenAddressToRole[]
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
        Attestation memory attestationInfo = s_baseIspContract.getAttestation(
            attestationId
        );
        // attestationInfo=getAttestation(attestationId);
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

        // Convert the uint8 value to the corresponding EventType enum
        EventType eventType = EventType(eventTypeUint);
        // if (eventType>= EventType.COMMUNITY + 1) {
        //     revert NexusEventHook__InvalidEventType();
        // }

        // if (attestationInfo.data.length == EXPECTED_EXTRA_DATA_LENGTH)
        //     revert NexusEventHook__InvalidAttestationDataLength();
        // Check if the event is at least one week in the future
        if (eventTimestamp < block.timestamp + 1 weeks)
            revert NexusEventHook__EventMustBeAtLeastOneWeekInFuture();
        if (eventTimestamp > block.timestamp + 52 weeks)
            revert NexusEventHook__EventTimestampTooFarInFuture();

        if (s_eventExists[attestationId])
            revert NexusEventHook__DuplicateEvent();
        s_eventExists[attestationId] = true;
        // Check if the event type is "Live"
        if (eventType == EventType.LIVE) {
            // Check if the attester is the official for this fan token
            // if (!hasRole(getRoleInBytes(fanTokenAddress), attester))
            //     revert NexusEventHook__AttesterMustBeAnOfficial();
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

    function totalEvents() public view returns (uint64) {
        return s_baseIspContract.attestationCounter();
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

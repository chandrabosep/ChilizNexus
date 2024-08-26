// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import {ISPHook} from "@ethsign/sign-protocol-evm/src/interfaces/ISPHook.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

error NexusEventHook__ShouldBeAnOfficial();
error NexusEventHook__ShouldBeACommunityEvent();
error NexusEventHook__InvalidEvent();

contract NexusEventHook is ISPHook, Ownable {
    using Strings for string;
    mapping(address =>address) private s_fanTokenToOfficial;
    constructor() Ownable(_msgSender()) {}

    function checkAttestaterStatusIsOfficial(address fanTokenAddress, address officialAddress) public view returns(bool)
    {
        return s_fanTokenToOfficial[fanTokenAddress]==officialAddress;
    }

    function didReceiveAttestation(
        address attester,
        uint64 schemaId,
        uint64 attestationId,
        bytes calldata extraData
    ) public payable {
        (address fanTokenAddress, string memory eventType)=abi.decode(extraData, (address, string));
        // Check if the event type is "Live"
        if (eventType.equal("Live")) {
            // Check if the attester is the official for this fan token
            if (!checkAttestaterStatusIsOfficial(fanTokenAddress, attester)) revert NexusEventHook__ShouldBeAnOfficial();
        }
        // Check if the event type is "Virtual" or "Community"
        else if (!eventType.equal("Virtual") || !eventType.equal("Community")) revert NexusEventHook__ShouldBeACommunityEvent();
        else revert NexusEventHook__InvalidEvent();

    }

    function didReceiveAttestation(
        address attester,
        uint64 schemaId,
        uint64 attestationId,
        IERC20 resolverFeeERC20Token,
        uint256 resolverFeeERC20Amount,
        bytes calldata extraData
    ) external view {
        revert();
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

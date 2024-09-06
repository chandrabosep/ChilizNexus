export const EventGateAbi = {
	address: "0x996eFcF698c4a15C7CA48b55d280D0849C658Da2",
	abi: [
		{
			inputs: [],
			stateMutability: "nonpayable",
			type: "constructor",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "sender",
					type: "address",
				},
				{
					internalType: "uint256",
					name: "balance",
					type: "uint256",
				},
				{
					internalType: "uint256",
					name: "needed",
					type: "uint256",
				},
				{
					internalType: "uint256",
					name: "tokenId",
					type: "uint256",
				},
			],
			name: "ERC1155InsufficientBalance",
			type: "error",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "approver",
					type: "address",
				},
			],
			name: "ERC1155InvalidApprover",
			type: "error",
		},
		{
			inputs: [
				{
					internalType: "uint256",
					name: "idsLength",
					type: "uint256",
				},
				{
					internalType: "uint256",
					name: "valuesLength",
					type: "uint256",
				},
			],
			name: "ERC1155InvalidArrayLength",
			type: "error",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "operator",
					type: "address",
				},
			],
			name: "ERC1155InvalidOperator",
			type: "error",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "receiver",
					type: "address",
				},
			],
			name: "ERC1155InvalidReceiver",
			type: "error",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "sender",
					type: "address",
				},
			],
			name: "ERC1155InvalidSender",
			type: "error",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "operator",
					type: "address",
				},
				{
					internalType: "address",
					name: "owner",
					type: "address",
				},
			],
			name: "ERC1155MissingApprovalForAll",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusEventGate__AccessLevelAlreadyExists",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusEventGate__EventEnded",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusEventGate__EventIdAlreadyExists",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusEventGate__IncorrectTicketPrice",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusEventGate__InsufficientBalanceForTokenDrop",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusEventGate__InvalidFanTokenAddress",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusEventGate__InvalidInputAddress",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusEventGate__NoUserAddressesProvided",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusEventGate__TicketLimitExceeded",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusEventGate__TokenIdAlreadyExists",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusEventGate__TokenIdDoesNotExists",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusEventGate__TransactionFailed",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusEventGate__UnableToCallNexusTokenContract",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusEventGate__UnmatchedArrayLength",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusEventGate__UserDoesNotHoldFanTokens",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusEventGate__UserIsNotAnEventManager",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusEventGate__ZeroAmountForTokenDrop",
			type: "error",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "owner",
					type: "address",
				},
			],
			name: "OwnableInvalidOwner",
			type: "error",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "account",
					type: "address",
				},
			],
			name: "OwnableUnauthorizedAccount",
			type: "error",
		},
		{
			inputs: [],
			name: "ReentrancyGuardReentrantCall",
			type: "error",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "account",
					type: "address",
				},
				{
					indexed: true,
					internalType: "address",
					name: "operator",
					type: "address",
				},
				{
					indexed: false,
					internalType: "bool",
					name: "approved",
					type: "bool",
				},
			],
			name: "ApprovalForAll",
			type: "event",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
				{
					indexed: true,
					internalType: "address",
					name: "manager",
					type: "address",
				},
				{
					indexed: true,
					internalType: "uint64",
					name: "endTimestamp",
					type: "uint64",
				},
			],
			name: "EventRegistered",
			type: "event",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "previousOwner",
					type: "address",
				},
				{
					indexed: true,
					internalType: "address",
					name: "newOwner",
					type: "address",
				},
			],
			name: "OwnershipTransferred",
			type: "event",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "recipient",
					type: "address",
				},
				{
					indexed: true,
					internalType: "uint256",
					name: "amount",
					type: "uint256",
				},
			],
			name: "TransferAttempt",
			type: "event",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "operator",
					type: "address",
				},
				{
					indexed: true,
					internalType: "address",
					name: "from",
					type: "address",
				},
				{
					indexed: true,
					internalType: "address",
					name: "to",
					type: "address",
				},
				{
					indexed: false,
					internalType: "uint256[]",
					name: "ids",
					type: "uint256[]",
				},
				{
					indexed: false,
					internalType: "uint256[]",
					name: "values",
					type: "uint256[]",
				},
			],
			name: "TransferBatch",
			type: "event",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "operator",
					type: "address",
				},
				{
					indexed: true,
					internalType: "address",
					name: "from",
					type: "address",
				},
				{
					indexed: true,
					internalType: "address",
					name: "to",
					type: "address",
				},
				{
					indexed: false,
					internalType: "uint256",
					name: "id",
					type: "uint256",
				},
				{
					indexed: false,
					internalType: "uint256",
					name: "value",
					type: "uint256",
				},
			],
			name: "TransferSingle",
			type: "event",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: false,
					internalType: "string",
					name: "value",
					type: "string",
				},
				{
					indexed: true,
					internalType: "uint256",
					name: "id",
					type: "uint256",
				},
			],
			name: "URI",
			type: "event",
		},
		{
			inputs: [],
			name: "_name",
			outputs: [
				{
					internalType: "string",
					name: "",
					type: "string",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [],
			name: "_symbol",
			outputs: [
				{
					internalType: "string",
					name: "",
					type: "string",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "account",
					type: "address",
				},
				{
					internalType: "uint256",
					name: "id",
					type: "uint256",
				},
			],
			name: "balanceOf",
			outputs: [
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address[]",
					name: "accounts",
					type: "address[]",
				},
				{
					internalType: "uint256[]",
					name: "ids",
					type: "uint256[]",
				},
			],
			name: "balanceOfBatch",
			outputs: [
				{
					internalType: "uint256[]",
					name: "",
					type: "uint256[]",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
				{
					internalType: "string",
					name: "_accessLevel",
					type: "string",
				},
			],
			name: "checkAccessLevelExists",
			outputs: [
				{
					internalType: "bool",
					name: "",
					type: "bool",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
				{
					internalType: "address",
					name: "_callerAddress",
					type: "address",
				},
			],
			name: "checkIfCallerIsEventManager",
			outputs: [
				{
					internalType: "bool",
					name: "",
					type: "bool",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
				{
					internalType: "uint256",
					name: "tokenId",
					type: "uint256",
				},
			],
			name: "checkTokenIdExistsForEventId",
			outputs: [
				{
					internalType: "bool",
					name: "",
					type: "bool",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "fanTokenAddress",
					type: "address",
				},
				{
					internalType: "address",
					name: "userAddress",
					type: "address",
				},
			],
			name: "checkUserOwnFanTokens",
			outputs: [
				{
					internalType: "bool",
					name: "",
					type: "bool",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
				{
					internalType: "address[]",
					name: "userAddresses",
					type: "address[]",
				},
			],
			name: "distributeDrop",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint256",
					name: "id",
					type: "uint256",
				},
			],
			name: "exists",
			outputs: [
				{
					internalType: "bool",
					name: "",
					type: "bool",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
				{
					internalType: "string",
					name: "accessLevel",
					type: "string",
				},
			],
			name: "generateTokenId",
			outputs: [
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
			],
			name: "getAccessLevelsFromEventId",
			outputs: [
				{
					internalType: "string[]",
					name: "",
					type: "string[]",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
			],
			name: "getCollectedAmountForEventId",
			outputs: [
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
			],
			name: "getCollectedAmountForNexusDrop",
			outputs: [
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
			],
			name: "getEventEndTimestamp",
			outputs: [
				{
					internalType: "uint64",
					name: "",
					type: "uint64",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [],
			name: "getNexusTokenAddress",
			outputs: [
				{
					internalType: "address",
					name: "",
					type: "address",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint256",
					name: "tokenId",
					type: "uint256",
				},
			],
			name: "getTicketLimit",
			outputs: [
				{
					internalType: "uint8",
					name: "",
					type: "uint8",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint256",
					name: "tokenId",
					type: "uint256",
				},
			],
			name: "getTicketPriceFromTokenId",
			outputs: [
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
			],
			name: "getTicketPricesFromEventId",
			outputs: [
				{
					internalType: "uint256[]",
					name: "",
					type: "uint256[]",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
				{
					internalType: "string",
					name: "_accessLevel",
					type: "string",
				},
			],
			name: "getTokenIdOfAccessLevel",
			outputs: [
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
			],
			name: "getTokenIdOfAnEventManager",
			outputs: [
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
			],
			name: "getTokenIdsFromEventId",
			outputs: [
				{
					internalType: "uint256[]",
					name: "",
					type: "uint256[]",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "account",
					type: "address",
				},
				{
					internalType: "address",
					name: "operator",
					type: "address",
				},
			],
			name: "isApprovedForAll",
			outputs: [
				{
					internalType: "bool",
					name: "",
					type: "bool",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "fanTokenAddress",
					type: "address",
				},
			],
			name: "isSupportedFanToken",
			outputs: [
				{
					internalType: "bool",
					name: "",
					type: "bool",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
				{
					internalType: "uint256",
					name: "tokenId",
					type: "uint256",
				},
				{
					internalType: "address",
					name: "to",
					type: "address",
				},
			],
			name: "mintCommunityTicket",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
				{
					internalType: "uint256",
					name: "tokenId",
					type: "uint256",
				},
				{
					internalType: "address",
					name: "to",
					type: "address",
				},
			],
			name: "mintLiveTicket",
			outputs: [],
			stateMutability: "payable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
				{
					internalType: "uint256",
					name: "tokenId",
					type: "uint256",
				},
				{
					internalType: "address",
					name: "to",
					type: "address",
				},
			],
			name: "mintLiveTicketByEventManager",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
			],
			name: "nexusDrop",
			outputs: [],
			stateMutability: "payable",
			type: "function",
		},
		{
			inputs: [],
			name: "owner",
			outputs: [
				{
					internalType: "address",
					name: "",
					type: "address",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
				{
					internalType: "address",
					name: "fanTokenAddress",
					type: "address",
				},
				{
					internalType: "address",
					name: "to",
					type: "address",
				},
				{
					internalType: "uint64",
					name: "endTimestamp",
					type: "uint64",
				},
				{
					internalType: "uint8",
					name: "ticketLimit",
					type: "uint8",
				},
			],
			name: "registerCommunityEvent",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
				{
					internalType: "address",
					name: "fanTokenAddress",
					type: "address",
				},
				{
					internalType: "address",
					name: "to",
					type: "address",
				},
				{
					internalType: "uint64",
					name: "endTimestamp",
					type: "uint64",
				},
				{
					internalType: "string[]",
					name: "accessLevels",
					type: "string[]",
				},
				{
					internalType: "uint256[]",
					name: "ticketPrices",
					type: "uint256[]",
				},
				{
					internalType: "uint8[]",
					name: "ticketLimits",
					type: "uint8[]",
				},
			],
			name: "registerLiveEvent",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
				{
					internalType: "string",
					name: "newAccessLevel",
					type: "string",
				},
				{
					internalType: "uint256",
					name: "newTicketPrice",
					type: "uint256",
				},
				{
					internalType: "uint8",
					name: "newTicketLimit",
					type: "uint8",
				},
			],
			name: "registerNewAccessLevel",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [],
			name: "renounceOwnership",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "",
					type: "address",
				},
				{
					internalType: "address",
					name: "",
					type: "address",
				},
				{
					internalType: "uint256[]",
					name: "",
					type: "uint256[]",
				},
				{
					internalType: "uint256[]",
					name: "",
					type: "uint256[]",
				},
				{
					internalType: "bytes",
					name: "",
					type: "bytes",
				},
			],
			name: "safeBatchTransferFrom",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "",
					type: "address",
				},
				{
					internalType: "address",
					name: "",
					type: "address",
				},
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
				{
					internalType: "bytes",
					name: "",
					type: "bytes",
				},
			],
			name: "safeTransferFrom",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "operator",
					type: "address",
				},
				{
					internalType: "bool",
					name: "approved",
					type: "bool",
				},
			],
			name: "setApprovalForAll",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "string",
					name: "newuri",
					type: "string",
				},
			],
			name: "setBaseURI",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "bytes4",
					name: "interfaceId",
					type: "bytes4",
				},
			],
			name: "supportsInterface",
			outputs: [
				{
					internalType: "bool",
					name: "",
					type: "bool",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [],
			name: "totalSupply",
			outputs: [
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint256",
					name: "id",
					type: "uint256",
				},
			],
			name: "totalSupply",
			outputs: [
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "newOwner",
					type: "address",
				},
			],
			name: "transferOwnership",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "newNexusTokenAddress",
					type: "address",
				},
			],
			name: "updateNexusTokenContractAddress",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint256",
					name: "tokenId",
					type: "uint256",
				},
			],
			name: "uri",
			outputs: [
				{
					internalType: "string",
					name: "",
					type: "string",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "to",
					type: "address",
				},
				{
					internalType: "uint256",
					name: "tokenId",
					type: "uint256",
				},
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
			],
			name: "validateMint",
			outputs: [],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint64",
					name: "eventId",
					type: "uint64",
				},
			],
			name: "withdrawCollectedAmountForEventId",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			stateMutability: "payable",
			type: "receive",
		},
	],
};

export const NexusTokenAbi = {
	address: "0xc01C4824339814edA70EB4639d6A7Ad23629f009",
	
	abi: [
		{
			inputs: [],
			stateMutability: "nonpayable",
			type: "constructor",
		},
		{
			inputs: [],
			name: "NexusToken__InsufficientAllowance",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusToken__InsufficientBalance",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusToken__RedemptionFailed",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusToken__TransferFailed",
			type: "error",
		},
		{
			inputs: [],
			name: "NexusToken__UnsupportedToken",
			type: "error",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "from",
					type: "address",
				},
				{
					indexed: true,
					internalType: "address",
					name: "token",
					type: "address",
				},
				{
					indexed: false,
					internalType: "uint256",
					name: "value",
					type: "uint256",
				},
			],
			name: "TokenMinted",
			type: "event",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "from",
					type: "address",
				},
				{
					indexed: true,
					internalType: "address",
					name: "token",
					type: "address",
				},
				{
					indexed: false,
					internalType: "uint256",
					name: "value",
					type: "uint256",
				},
			],
			name: "TokenRedeemed",
			type: "event",
		},
		{
			anonymous: false,
			inputs: [
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
					name: "value",
					type: "uint256",
				},
				{
					indexed: true,
					internalType: "bytes",
					name: "data",
					type: "bytes",
				},
			],
			name: "Transfer",
			type: "event",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "fanTokenAddress",
					type: "address",
				},
			],
			name: "addSupportedToken",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "_owner",
					type: "address",
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
			inputs: [],
			name: "decimals",
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
					internalType: "address",
					name: "fanTokenAddress",
					type: "address",
				},
			],
			name: "getFanTokenSupply",
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
					name: "fanTokenAddress",
					type: "address",
				},
				{
					internalType: "address",
					name: "userAddress",
					type: "address",
				},
			],
			name: "getUserDeposits",
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
					internalType: "address",
					name: "fanTokenAddress",
					type: "address",
				},
				{
					internalType: "uint256",
					name: "amount",
					type: "uint256",
				},
			],
			name: "mintToken",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [],
			name: "name",
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
					name: "fanTokenAddress",
					type: "address",
				},
				{
					internalType: "uint256",
					name: "amount",
					type: "uint256",
				},
			],
			name: "redeemToken",
			outputs: [],
			stateMutability: "nonpayable",
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
			name: "removeSupportedToken",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [],
			name: "symbol",
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
					name: "_from",
					type: "address",
				},
				{
					internalType: "uint256",
					name: "_value",
					type: "uint256",
				},
				{
					internalType: "bytes",
					name: "_data",
					type: "bytes",
				},
			],
			name: "tokenReceived",
			outputs: [
				{
					internalType: "bytes4",
					name: "",
					type: "bytes4",
				},
			],
			stateMutability: "nonpayable",
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
					internalType: "address",
					name: "_to",
					type: "address",
				},
				{
					internalType: "uint256",
					name: "_value",
					type: "uint256",
				},
			],
			name: "transfer",
			outputs: [
				{
					internalType: "bool",
					name: "success",
					type: "bool",
				},
			],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "_to",
					type: "address",
				},
				{
					internalType: "uint256",
					name: "_value",
					type: "uint256",
				},
				{
					internalType: "bytes",
					name: "_data",
					type: "bytes",
				},
			],
			name: "transfer",
			outputs: [
				{
					internalType: "bool",
					name: "success",
					type: "bool",
				},
			],
			stateMutability: "nonpayable",
			type: "function",
		},
	],
};

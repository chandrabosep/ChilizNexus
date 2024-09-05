require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.23",
  networks: {
    chilizSpicy: {
      url: "https://spicy-rpc.chiliz.com",
      accounts: [process.env.PRIVATE_KEY],
      timeout: 200000,
    },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 84532,
      timeout: 10000,
      confirmations: 2,
    },
  },
  etherscan: {
    apiKey: {
      chilizSpicy: "mujahid002",
      baseSepolia: process.env.BASE_SEPOLIA_API_KEY,
    },
    customChains: [
      {
        network: "chilizSpicy",
        chainId: 88882,
        urls: {
          apiURL:
            "https://api.routescan.io/v2/network/testnet/evm/88882/etherscan",
          browserURL: "https://testnet.chiliscan.com",
        },
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
  sourcify: {
    enabled: true,
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 10000,
    },
  },
};

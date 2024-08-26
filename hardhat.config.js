require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.23",
  networks: {
    chilizSpicy: {
      url: "https://spicy-rpc.chiliz.com",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: "mujahid002",
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

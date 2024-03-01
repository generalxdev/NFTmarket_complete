// import { HardhatUserConfig } from "hardhat/config";
require("@nomiclabs/hardhat-waffle");
// require("@nomicfoundation/hardhat-toolbox");
const privateKey = "4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318";

module.exports = {
  defaultNetwork:'mantle-testnet',
  networks: {
    hardhat: {
      chainId: 5001
    },
    "mantle-testnet": {
      url: "https://rpc.testnet.mantle.xyz/",
      ethNetwork: 'goerli',
      accounts: [privateKey], // Uses the private key from the .env file
    }
  },
  solidity: {
    version: "0.8.3",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};


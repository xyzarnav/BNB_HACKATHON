import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

// If not set, it uses the hardhat account 0 private key.
const deployerPrivateKey = process.env.PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
// If not set, it uses BSCScan default API key
const bscscanApiKey = process.env.BSCSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  defaultNetwork: "bscTestnet",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    hardhat: {
      chainId: 97, // BSC Testnet chainId for local testing
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 97,
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: [deployerPrivateKey],
      gasPrice: 20000000000, // 20 Gwei
      verify: {
        etherscan: {
          apiUrl: "https://api-testnet.bscscan.com",
        },
      },
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: [deployerPrivateKey],
      gasPrice: 5000000000, // 5 Gwei
      verify: {
        etherscan: {
          apiUrl: "https://api.bscscan.com",
        },
      },
    },
  },
  etherscan: {
    apiKey: {
      bscTestnet: bscscanApiKey,
      bsc: bscscanApiKey,
    },
    customChains: [
      {
        network: "bscTestnet",
        chainId: 97,
        urls: {
          apiURL: "https://api-testnet.bscscan.com/api",
          browserURL: "https://testnet.bscscan.com",
        },
      },
      {
        network: "bsc",
        chainId: 56,
        urls: {
          apiURL: "https://api.bscscan.com/api",
          browserURL: "https://bscscan.com",
        },
      },
    ],
  },
  verify: {
    etherscan: {
      apiKey: bscscanApiKey,
    },
  },
  sourcify: {
    enabled: false,
  },
};

export default config;
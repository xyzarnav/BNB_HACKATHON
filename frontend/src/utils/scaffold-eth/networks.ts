import { Chain } from "wagmi";

export const targetNetworks = {
  hardhat: {
    id: 31337,
    name: "Hardhat",
    network: "hardhat",
    nativeCurrency: {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    },
    rpcUrls: {
      default: { http: ["http://127.0.0.1:8545"] },
      public: { http: ["http://127.0.0.1:8545"] },
    },
  },
  bsc: {
    id: 56,
    name: "BNB Smart Chain",
    network: "bsc",
    nativeCurrency: {
      decimals: 18,
      name: "BNB",
      symbol: "BNB",
    },
    rpcUrls: {
      default: { http: ["https://bsc-dataseed1.binance.org"] },
      public: { http: ["https://bsc-dataseed1.binance.org"] },
    },
    blockExplorers: {
      default: { name: "BscScan", url: "https://bscscan.com" },
    },
  },
  bscTestnet: {
    id: 97,
    name: "BNB Smart Chain Testnet",
    network: "bsc-testnet",
    nativeCurrency: {
      decimals: 18,
      name: "BNB",
      symbol: "tBNB",
    },
    rpcUrls: {
      default: { http: ["https://data-seed-prebsc-1-s1.binance.org:8545"] },
      public: { http: ["https://data-seed-prebsc-1-s1.binance.org:8545"] },
    },
    blockExplorers: {
      default: { name: "BscScan", url: "https://testnet.bscscan.com" },
    },
  },
} as const;

export type TargetNetwork = keyof typeof targetNetworks;

export const getTargetNetwork = (): Chain => {
  const targetNetwork = process.env.NEXT_PUBLIC_TARGET_NETWORK as TargetNetwork;
  const network = targetNetworks[targetNetwork || "hardhat"];
  
  if (!network) {
    throw new Error(`Target network ${targetNetwork} not found`);
  }
  
  return network;
};



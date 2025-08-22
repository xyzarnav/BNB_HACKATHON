import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, hardhat, sepolia } from 'wagmi/chains';
import { bscTestnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'TrustChain DApp',
  projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID', // Get from https://cloud.walletconnect.com
  chains: [sepolia, hardhat, mainnet, bscTestnet], // Added sepolia as primary chain
  ssr: true,
});
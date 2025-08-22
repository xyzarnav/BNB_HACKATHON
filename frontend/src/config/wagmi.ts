import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet, hardhat } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'TrustChain DApp',
  projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID', // Get from https://cloud.walletconnect.com
  chains: [hardhat, sepolia, mainnet],
  ssr: true,
});


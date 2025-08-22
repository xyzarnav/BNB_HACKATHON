import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { bsc, bscTestnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'TrustChain DApp',
  projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || 'YOUR_WALLET_CONNECT_PROJECT_ID',
  chains: [bscTestnet, bsc], // BSC Testnet as primary chain, BSC Mainnet as secondary
  ssr: true,
});
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { bsc, bscTestnet } from 'wagmi/chains';

// Get environment variables using Vite's import.meta.env
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
const network = import.meta.env.VITE_NETWORK || 'bscTestnet';

if (!projectId) {
  console.warn('WalletConnect Project ID not found. Please set VITE_WALLET_CONNECT_PROJECT_ID in your .env file');
}

export const config = getDefaultConfig({
  appName: 'TrustChain DApp',
  projectId: projectId || 'YOUR_WALLET_CONNECT_PROJECT_ID', // Fallback for development
  chains: network === 'bscTestnet' ? [bscTestnet, bsc] : [bsc, bscTestnet],
  ssr: true,
});
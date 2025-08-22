// Block explorer utility functions for BNB Smart Chain

export const BLOCK_EXPLORER_BASE_URL = 'https://testnet.bscscan.com';

export const generateBlockExplorerUrl = (type: 'tx' | 'address' | 'block', value: string): string => {
  switch (type) {
    case 'tx':
      return `${BLOCK_EXPLORER_BASE_URL}/tx/${value}`;
    case 'address':
      return `${BLOCK_EXPLORER_BASE_URL}/address/${value}`;
    case 'block':
      return `${BLOCK_EXPLORER_BASE_URL}/block/${value}`;
    default:
      return BLOCK_EXPLORER_BASE_URL;
  }
};

export const generateProjectExplorerUrl = (projectId: number): string => {
  // For projects, we'll link to the contract address with the project ID in the URL fragment
  // This helps users find the specific project in the contract
  return `${BLOCK_EXPLORER_BASE_URL}/address/${getContractAddress()}#readContract`;
};

export const generateTransactionExplorerUrl = (txHash: string): string => {
  return generateBlockExplorerUrl('tx', txHash);
};

// Get the deployed contract address from deployed contracts
const getContractAddress = (): string => {
  // Use the actual deployed contract address
  return '0x3a479b0c6fAc1F2908F5302CeaA23C126295Dba1';
};

export const formatTransactionHash = (hash: string): string => {
  if (!hash) return '';
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
};

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

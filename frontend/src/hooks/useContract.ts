import { useReadContract } from 'wagmi';
import { deployedContracts } from '../contracts/deployedContracts';

export interface Project {
  id: number;
  creator: string;
  title: string;
  description: string;
  timePeriod: bigint;
  deadline: bigint;
  budget: bigint;
  posted: boolean;
  projectType: number;
  auditor: string;
  hasAuditor: boolean;
}

export interface Bid {
  bidId: number;
  projectId: number;
  bidder: string;
  amount: bigint;
  proposalIPFHash: string;
  accepted: boolean;
}

export const useProjectCount = () => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'projectId',
    args: [],
  });
};

export const useBidCount = () => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'bidCount',
    args: [],
  });
};

export const useProject = (projectId: number) => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'projects',
    args: [BigInt(projectId)],
  });
};

export const useBid = (bidId: number) => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'bids',
    args: [BigInt(bidId)],
  });
};

// Note: projectBids function is not available in the current contract version
// We'll need to implement this later when the contract is updated

export const formatBigIntToEther = (value: bigint | undefined): string => {
  if (!value) return '0';
  return (Number(value) / 1e18).toFixed(2);
};

export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatTimestamp = (timestamp: bigint | undefined): string => {
  if (!timestamp) return new Date().toLocaleDateString();
  return new Date(Number(timestamp) * 1000).toLocaleDateString();
};
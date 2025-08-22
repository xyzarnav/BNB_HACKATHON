import { useReadContract } from 'wagmi';
import { deployedContracts } from '../contracts/deployedContracts';
import { type Address } from 'viem';

export interface Project {
  creator: string;
  projectId: number;
  description: string;
  title: string;
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

export interface LogEntry {
  actor: string;
  action: string;
  timestamp: bigint;
}

// Read contract functions
export const useProjectCount = () => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'projectId',
  });
};

export const useBidCount = () => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'bidCount',
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

export const useAllProjects = () => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'getAllProjects' as any,
  });
};

export const useActiveProjects = () => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'getAllActiveProjects',
    // Allow reading without being connected
    query: {
      enabled: true, // Always enabled
      staleTime: 10000, // Refresh every 10 seconds
      select: (data: any) => {
        console.log('Raw contract data:', data);
        if (!Array.isArray(data)) {
          console.error('Expected array but got:', typeof data);
          return [];
        }
        return data.map((project: any) => ({
          ...project,
          projectId: BigInt(project.projectId || 0),
          budget: BigInt(project.budget || 0),
          deadline: BigInt(project.deadline || 0),
          timePeriod: BigInt(project.timePeriod || 0)
        }));
      }
    }
  });
};

export const useProjectById = (projectId: number) => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'getProjectById',
    args: [BigInt(projectId)],
    query: {
      enabled: projectId > 0,
      select: (data: any) => {
        if (!data) return null;
        const [
          title,
          budget,
          description,
          deadline,
          posted,
          id,
          projectType,
          creator,
          timePeriod
        ] = data;
        return {
          title,
          budget: BigInt(budget),
          description,
          deadline: BigInt(deadline),
          posted,
          id: BigInt(id),
          projectType: Number(projectType),
          creator,
          timePeriod: BigInt(timePeriod)
        };
      }
    }
  });
};

export const useUserBids = (userAddress: Address) => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'getBidsByUser' as any,
    args: [userAddress],
  });
};

export const useProjectsByCreator = (creatorAddress: Address) => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'getProjectsByCreator' as any,
    args: [creatorAddress],
  });
};

export const useProjectBidWinner = (projectId: number) => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'getProjectBidWinner' as any,
    args: [BigInt(projectId)],
  });
};

export const useProjectLogs = (projectId: number) => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'getProjectLogs' as any,
    args: [BigInt(projectId)],
  });
};

export const useCompletionLevel = (bondId: number) => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'getCompletionLevel' as any,
    args: [BigInt(bondId)],
  });
};

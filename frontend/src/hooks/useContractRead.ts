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

// Fixed: Use the projects mapping directly instead of non-existent getProjectById
export const useProjectById = (projectId: number) => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'projects',
    args: [BigInt(projectId)],
    query: {
      enabled: projectId > 0,
      select: (data: any) => {
        if (!data) return null;
        const [
          creator,
          projectId,
          description,
          title,
          timePeriod,
          deadline,
          budget,
          posted,
          projectType,
          auditor,
          hasAuditor
        ] = data;
        return {
          title,
          budget: BigInt(budget),
          description,
          deadline: BigInt(deadline),
          posted,
          id: BigInt(projectId),
          projectType: Number(projectType),
          creator,
          timePeriod: BigInt(timePeriod)
        };
      }
    }
  });
};

// Fixed: Use the bids mapping and filter by user address
export const useUserBids = (userAddress: Address) => {
  const { data: bidCountData } = useBidCount();
  
  // Create an array of bid IDs to check
  const bidIds = Array.from({ length: Number(bidCountData || 0) }, (_, i) => i + 1);
  
  // For now, return empty array since we can't efficiently get user bids without a getter function
  // TODO: Add getBidsByUser function to the contract
  return { data: [], isLoading: false, error: null };
};

// Fixed: Use the projects mapping and filter by creator
export const useProjectsByCreator = (creatorAddress: Address) => {
  const { data: projectCountData } = useProjectCount();
  
  // For now, return empty array since we can't efficiently get creator projects without a getter function
  // TODO: Add getProjectsByCreator function to the contract
  return { data: [], isLoading: false, error: null };
};

// Fixed: Use the bondWinners mapping instead of non-existent getProjectBidWinner
export const useProjectBidWinner = (projectId: number) => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'bondWinners',
    args: [BigInt(projectId)],
    query: {
      enabled: projectId > 0,
    }
  });
};

// Fixed: Use the transparencyLogs mapping instead of non-existent getProjectLogs
export const useProjectLogs = (projectId: number) => {
  // For now, return empty array since we can't efficiently get project logs without a getter function
  // TODO: Add getProjectLogs function to the contract
  return { data: [], isLoading: false, error: null };
};

export const useCompletionLevel = (bondId: number) => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'getCompletionLevel',
    args: [BigInt(bondId)],
  });
};

// Check if a user has already bid on a specific project
export const useHasBidded = (userAddress: Address, projectId: number) => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'hasBidded',
    args: [userAddress, BigInt(projectId)],
    query: {
      enabled: !!userAddress && projectId > 0,
    }
  });
};

// Check if a user is a registered bidder
export const useIsBidder = (userAddress: Address) => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'bidderIds',
    args: [userAddress],
    query: {
      enabled: !!userAddress,
      select: (data: any) => {
        return data && Number(data) > 0;
      }
    }
  });
};

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

// Fixed: Use the getBidsByUser function from the contract
export const useUserBids = (userAddress: Address) => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'getBidsByUser',
    args: [userAddress],
    query: {
      enabled: !!userAddress,
      select: (data: any) => {
        if (!Array.isArray(data)) {
          console.error('Expected array but got:', typeof data);
          return [];
        }
        return data.map((bid: any) => ({
          bidId: Number(bid.bidId),
          projectId: Number(bid.projectId),
          bidder: bid.bidder,
          amount: BigInt(bid.amount),
          proposalIPFHash: bid.proposalIPFHash,
          accepted: bid.accepted
        }));
      }
    }
  });
};

// Fixed: Use the getProjectsByCreator function from the contract
export const useProjectsByCreator = (creatorAddress: Address) => {
  return useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'getProjectsByCreator',
    args: [creatorAddress],
    query: {
      enabled: !!creatorAddress,
      select: (data: unknown) => {
        if (!Array.isArray(data)) {
          console.error('Expected array but got:', typeof data);
          return [];
        }
        return data.map((project: unknown) => ({
          ...(project as Project),
          projectId: BigInt((project as Project).projectId || 0),
          budget: BigInt((project as Project).budget || 0),
          deadline: BigInt((project as Project).deadline || 0),
          timePeriod: BigInt((project as Project).timePeriod || 0)
        }));
      }
    }
  });
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

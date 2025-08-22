import { useReadContract } from 'wagmi';
import { deployedContracts } from '../contracts/deployedContracts';
import { useProjectById, useProjectLogs, useProjectBidWinner, type LogEntry } from './useContractRead';
import { useMemo } from 'react';

export interface ProjectDetails {
  title: string;
  budget: bigint;
  description: string;
  deadline: bigint;
  posted: boolean;
  id: bigint;
  projectType: number;
  creator: string;
  timePeriod: bigint;
  logs?: LogEntry[];
  bidWinner?: bigint;
  isLate?: boolean;
}

export const useProjectDetails = (projectId: number) => {
  // Get basic project details
  const { data: projectData, isLoading: isProjectLoading, error: projectError } = useProjectById(projectId);

  // Get project logs
  const { data: logsData, isLoading: isLogsLoading } = useProjectLogs(projectId);

  // Get bid winner
  const { data: bidWinnerData, isLoading: isBidWinnerLoading } = useProjectBidWinner(projectId);

  // Check if project is late
  const { data: isLateData, isLoading: isLateLoading } = useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'isProjectLate',
    args: [BigInt(projectId)],
  });

  // Combine all data into a single object
  const projectDetails = useMemo(() => {
    if (!projectData || isProjectLoading) return null;

    return {
      ...projectData,
      logs: logsData,
      bidWinner: bidWinnerData,
      isLate: isLateData,
    } as ProjectDetails;
  }, [projectData, logsData, bidWinnerData, isLateData]);

  const isLoading = isProjectLoading || isLogsLoading || isBidWinnerLoading || isLateLoading;

  return {
    projectDetails,
    isLoading,
    error: projectError
  };
};

// Helper function to format project type
export const getProjectTypeString = (projectType: number): string => {
  switch (projectType) {
    case 0:
      return 'Max Rate';
    case 1:
      return 'Fix Rate';
    case 2:
      return 'Min Rate';
    default:
      return 'Unknown';
  }
};

// Helper function to format completion status
export const getCompletionStatusString = (completion: number): string => {
  switch (completion) {
    case 0:
      return 'Signed (20%)';
    case 1:
      return 'Quarter (40%)';
    case 2:
      return 'Half (60%)';
    case 3:
      return 'Three Quarters (80%)';
    case 4:
      return 'Full (100%)';
    default:
      return 'Unknown';
  }
};

// Helper function to format project status
export const getProjectStatusString = (status: number): string => {
  switch (status) {
    case 0:
      return 'Approved';
    case 1:
      return 'Completed';
    case 2:
      return 'Disputed';
    default:
      return 'Unknown';
  }
};

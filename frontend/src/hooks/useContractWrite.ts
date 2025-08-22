import { useWriteContract } from 'wagmi';
import { deployedContracts } from '../contracts/deployedContracts';

// Write contract functions
export const useCreateBidder = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const createBidder = async () => {
    try {
      await writeContract({
        address: deployedContracts.TrustChain.address as `0x${string}`,
        abi: deployedContracts.TrustChain.abi,
        functionName: 'createBidder',
      });
      return { hash };
    } catch (err) {
      console.error('Error creating bidder:', err);
      throw err;
    }
  };

  return { createBidder, isPending, error };
};

export const useCreateProject = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const createProject = async (
    title: string,
    description: string,
    timePeriod: number,
    budget: bigint,
    projectType: number
  ) => {
    try {
      await writeContract({
        address: deployedContracts.TrustChain.address as `0x${string}`,
        abi: deployedContracts.TrustChain.abi,
        functionName: 'createProject',
        args: [title, description, BigInt(timePeriod), budget, projectType],
      });
      // The hash will be available through the hook's data property
      return { success: true };
    } catch (err) {
      console.error('Error creating project:', err);
      throw err;
    }
  };

  return { createProject, isPending, error, hash };
};

export const useAssignAuditor = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const assignAuditor = async (projectId: number) => {
    try {
      await writeContract({
        address: deployedContracts.TrustChain.address as `0x${string}`,
        abi: deployedContracts.TrustChain.abi,
        functionName: 'assignAuditor',
        args: [BigInt(projectId)],
      });
      return { hash };
    } catch (err) {
      console.error('Error assigning auditor:', err);
      throw err;
    }
  };

  return { assignAuditor, isPending, error };
};

export const useCreateBid = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const createBid = async (projectId: number, proposalIPFHash: string, amount: bigint) => {
    try {
      await writeContract({
        address: deployedContracts.TrustChain.address as `0x${string}`,
        abi: deployedContracts.TrustChain.abi,
        functionName: 'createBid',
        args: [BigInt(projectId), proposalIPFHash, amount],
      });
      return { hash };
    } catch (err) {
      console.error('Error creating bid:', err);
      throw err;
    }
  };

  return { createBid, isPending, error };
};

export const useBidEvaluation = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const evaluateBid = async (projectId: number) => {
    try {
      await writeContract({
        address: deployedContracts.TrustChain.address as `0x${string}`,
        abi: deployedContracts.TrustChain.abi,
        functionName: 'bidEvaluation',
        args: [BigInt(projectId)],
      });
      return { hash };
    } catch (err) {
      console.error('Error evaluating bid:', err);
      throw err;
    }
  };

  return { evaluateBid, isPending, error };
};

export const useAwardBond = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const awardBond = async (projectId: number, bidWinner: number, value: bigint) => {
    try {
      await writeContract({
        address: deployedContracts.TrustChain.address as `0x${string}`,
        abi: deployedContracts.TrustChain.abi,
        functionName: 'awardBond',
        args: [BigInt(projectId), BigInt(bidWinner)],
        value,
      });
      return { hash };
    } catch (err) {
      console.error('Error awarding bond:', err);
      throw err;
    }
  };

  return { awardBond, isPending, error };
};

export const useApproveCompletion = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const approveCompletion = async (bondId: number, milestone: number) => {
    try {
      await writeContract({
        address: deployedContracts.TrustChain.address as `0x${string}`,
        abi: deployedContracts.TrustChain.abi,
        functionName: 'approveCompletion',
        args: [BigInt(bondId), milestone],
      });
      return { hash };
    } catch (err) {
      console.error('Error approving completion:', err);
      throw err;
    }
  };

  return { approveCompletion, isPending, error };
};

export const useReleasePayment = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const releasePayment = async (bondId: number, newCompletion: number) => {
    try {
      await writeContract({
        address: deployedContracts.TrustChain.address as `0x${string}`,
        abi: deployedContracts.TrustChain.abi,
        functionName: 'releasePayment',
        args: [BigInt(bondId), newCompletion],
      });
      return { hash };
    } catch (err) {
      console.error('Error releasing payment:', err);
      throw err;
    }
  };

  return { releasePayment, isPending, error };
};

export const useCreateDispute = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const createDispute = async (bondId: number, evidence: string) => {
    try {
      await writeContract({
        address: deployedContracts.TrustChain.address as `0x${string}`,
        abi: deployedContracts.TrustChain.abi,
        functionName: 'createDispute',
        args: [BigInt(bondId), evidence],
      });
      return { hash };
    } catch (err) {
      console.error('Error creating dispute:', err);
      throw err;
    }
  };

  return { createDispute, isPending, error };
};

export const useReportCorruption = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const reportCorruption = async (projectId: number, evidence: string) => {
    try {
      await writeContract({
        address: deployedContracts.TrustChain.address as `0x${string}`,
        abi: deployedContracts.TrustChain.abi,
        functionName: 'reportCorruption',
        args: [BigInt(projectId), evidence],
      });
      return { hash };
    } catch (err) {
      console.error('Error reporting corruption:', err);
      throw err;
    }
  };

  return { reportCorruption, isPending, error };
};

// Hook for bidders to submit completion milestone for approval
export const useSubmitMilestone = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const submitMilestone = async (bondId: number, milestone: number) => {
    try {
      // For now, we'll use the approveCompletion function
      // In a real implementation, you might want to add a separate function for bidders to submit milestones
      await writeContract({
        address: deployedContracts.TrustChain.address as `0x${string}`,
        abi: deployedContracts.TrustChain.abi,
        functionName: 'approveCompletion',
        args: [BigInt(bondId), milestone],
      });
      return { hash };
    } catch (err) {
      console.error('Error submitting milestone:', err);
      throw err;
    }
  };

  return { submitMilestone, isPending, error };
};

// Hook for auditors to approve milestones
export const useApproveAuditorMilestone = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const approveMilestone = async (bondId: number, milestone: number) => {
    try {
      await writeContract({
        address: deployedContracts.TrustChain.address as `0x${string}`,
        abi: deployedContracts.TrustChain.abi,
        functionName: 'approveCompletion',
        args: [BigInt(bondId), milestone],
      });
      return { hash };
    } catch (err) {
      console.error('Error approving milestone:', err);
      throw err;
    }
  };

  return { approveMilestone, isPending, error };
};

// Hook for project creators to reject/dispute milestones
export const useCreateProjectDispute = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const createDispute = async (bondId: number, evidence: string) => {
    try {
      await writeContract({
        address: deployedContracts.TrustChain.address as `0x${string}`,
        abi: deployedContracts.TrustChain.abi,
        functionName: 'createDispute',
        args: [BigInt(bondId), evidence],
      });
      return { hash };
    } catch (err) {
      console.error('Error creating dispute:', err);
      throw err;
    }
  };

  return { createDispute, isPending, error };
};

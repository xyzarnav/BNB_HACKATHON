import { useReadContract } from 'wagmi';
import { deployedContracts } from '../contracts/deployedContracts';

// Custom hook to get all bids for a specific project
// This uses the projectBids mapping by trying to access different indices
export const useProjectBidsReal = (projectId: number) => {
  // Try to get bid IDs from the projectBids mapping
  // Since it's an array mapping, we need to try different indices
  const bid0 = useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'projectBids',
    args: [BigInt(projectId), BigInt(0)],
    query: {
      enabled: projectId > 0,
    }
  });

  const bid1 = useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'projectBids',
    args: [BigInt(projectId), BigInt(1)],
    query: {
      enabled: projectId > 0,
    }
  });

  const bid2 = useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'projectBids',
    args: [BigInt(projectId), BigInt(2)],
    query: {
      enabled: projectId > 0,
    }
  });

  const bid3 = useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'projectBids',
    args: [BigInt(projectId), BigInt(3)],
    query: {
      enabled: projectId > 0,
    }
  });

  const bid4 = useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'projectBids',
    args: [BigInt(projectId), BigInt(4)],
    query: {
      enabled: projectId > 0,
    }
  });

  // Collect all valid bid IDs
  const bidIds: number[] = [];
  
  if (bid0.data && Number(bid0.data) > 0) bidIds.push(Number(bid0.data));
  if (bid1.data && Number(bid1.data) > 0) bidIds.push(Number(bid1.data));
  if (bid2.data && Number(bid2.data) > 0) bidIds.push(Number(bid2.data));
  if (bid3.data && Number(bid3.data) > 0) bidIds.push(Number(bid3.data));
  if (bid4.data && Number(bid4.data) > 0) bidIds.push(Number(bid4.data));

  const isLoading = bid0.isLoading || bid1.isLoading || bid2.isLoading || bid3.isLoading || bid4.isLoading;
  const error = bid0.error || bid1.error || bid2.error || bid3.error || bid4.error;

  return {
    data: bidIds,
    isLoading,
    error
  };
};

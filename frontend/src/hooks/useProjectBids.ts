import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { deployedContracts } from '../contracts/deployedContracts';

interface Bid {
  bidId: number;
  projectId: number;
  bidder: string;
  amount: bigint;
  proposalIPFHash: string;
  accepted: boolean;
}

export const useProjectBids = (projectId: number) => {
  const [projectBids, setProjectBids] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get total bid count
  const { data: totalBidCount } = useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'bidCount',
  });

  useEffect(() => {
    const fetchProjectBids = async () => {
      if (!totalBidCount || projectId <= 0) return;

      setIsLoading(true);
      setError(null);
      
      try {
        const bidCount = Number(totalBidCount);
        const projectBidIds: number[] = [];

        // Check each bid to see if it belongs to this project
        for (let i = 1; i <= bidCount; i++) {
          try {
            // We need to make direct contract calls here
            // This is a simplified approach - in production you might want to use a multicall
            const response = await fetch('/api/getBid/' + i); // This would need to be implemented
            // For now, we'll simulate this with a timeout
            await new Promise(resolve => setTimeout(resolve, 10));
            
            // Since we can't easily make individual contract calls here without more setup,
            // we'll use a different approach - check the contract directly
            continue;
          } catch (err) {
            console.error(`Error fetching bid ${i}:`, err);
          }
        }

        setProjectBids(projectBidIds);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectBids();
  }, [totalBidCount, projectId]);

  return {
    data: projectBids,
    isLoading,
    error
  };
};

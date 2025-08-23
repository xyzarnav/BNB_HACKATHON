import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { deployedContracts } from '../contracts/deployedContracts';

export const useProjectBidsWorking = (projectId: number) => {
  const [projectBidIds, setProjectBidIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get total bid count
  const { data: totalBidCount } = useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'bidCount',
  });

  // Create individual bid queries for a reasonable number of bids
  const bidQueries = [];
  const maxBids = Math.min(Number(totalBidCount || 0), 20); // Limit to 20 bids to avoid too many calls

  for (let i = 1; i <= maxBids; i++) {
    bidQueries.push(
      useReadContract({
        address: deployedContracts.TrustChain.address as `0x${string}`,
        abi: deployedContracts.TrustChain.abi,
        functionName: 'bids',
        args: [BigInt(i)],
        query: {
          enabled: projectId > 0 && totalBidCount !== undefined,
        }
      })
    );
  }

  useEffect(() => {
    if (!totalBidCount || projectId <= 0) {
      setProjectBidIds([]);
      return;
    }

    setIsLoading(true);
    
    // Filter bids that belong to this project
    const matchingBids: number[] = [];
    
    bidQueries.forEach((query, index) => {
      const bidData = query.data;
      if (bidData && Array.isArray(bidData)) {
        const [bidId, bidProjectId] = bidData;
        if (Number(bidProjectId) === projectId) {
          matchingBids.push(Number(bidId));
        }
      }
    });

    setProjectBidIds(matchingBids);
    setIsLoading(false);
  }, [totalBidCount, projectId, ...bidQueries.map(q => q.data)]);

  const anyLoading = bidQueries.some(q => q.isLoading);
  const anyError = bidQueries.find(q => q.error);

  return {
    data: projectBidIds,
    isLoading: anyLoading || isLoading,
    error: anyError?.error || null
  };
};

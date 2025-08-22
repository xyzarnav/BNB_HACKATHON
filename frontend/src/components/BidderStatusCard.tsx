import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { deployedContracts } from '../contracts/deployedContracts';
import { toast } from 'react-hot-toast';
import { useRetryableTransaction } from '../hooks/useRetryableTransaction';

interface BidderProfile {
  id: number;
  address: string;
  totalBids: number;
  reputationScore: number;
  blacklisted: boolean;
}

interface BidderStatusCardProps {
  showTitle?: boolean;
  compact?: boolean;
  onStatusChange?: (hasBidderProfile: boolean) => void;
}

const BidderStatusCard: React.FC<BidderStatusCardProps> = ({ 
  showTitle = true, 
  compact = false,
  onStatusChange 
}) => {
  const { isConnected, address } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const { executeWithRetry, isRetrying } = useRetryableTransaction();

  const [needsBidderProfile, setNeedsBidderProfile] = useState(false);
  const [bidderProfile, setBidderProfile] = useState<BidderProfile | null>(null);

  // Check if user has a bidder profile
  const { data: bidderId } = useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'bidderIds',
    args: [address as `0x${string}`],
    query: { enabled: !!address && isConnected }
  });

  // Get bidder profile details if user has one
  const { data: bidderData } = useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'bidders',
    args: [bidderId as bigint],
    query: { enabled: !!bidderId && Number(bidderId) > 0 }
  });

  // Check if user needs to create bidder profile
  useEffect(() => {
    if (bidderId !== undefined) {
      const needsProfile = Number(bidderId) === 0;
      setNeedsBidderProfile(needsProfile);
      onStatusChange?.(!needsProfile);
    }
  }, [bidderId, onStatusChange]);

  // Set bidder profile data
  useEffect(() => {
    if (bidderData) {
      const [id, bidderAddress, totalBids, reputationScore, blacklisted] = bidderData as [
        bigint, string, bigint, bigint, boolean
      ];
      setBidderProfile({
        id: Number(id),
        address: bidderAddress,
        totalBids: Number(totalBids),
        reputationScore: Number(reputationScore),
        blacklisted
      });
    }
  }, [bidderData]);

  // Function to create bidder profile
  const createBidderProfile = async () => {
    try {
      toast.loading("Creating bidder profile...", { id: "create-bidder" });
      
      await executeWithRetry(
        async () => {
          return await writeContract({
            address: deployedContracts.TrustChain.address as `0x${string}`,
            abi: deployedContracts.TrustChain.abi,
            functionName: 'createBidder',
            args: [],
          });
        },
        () => {
          toast.success("Bidder profile created successfully!", { id: "create-bidder" });
          setNeedsBidderProfile(false);
          onStatusChange?.(true);
        },
        (error, attempt) => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          return !errorMessage.includes("user rejected") && !errorMessage.includes("execution reverted") && attempt < 2;
        }
      );
    } catch (error: unknown) {
      console.error("Error creating bidder profile:", error);
      toast.dismiss("create-bidder");
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("user rejected")) {
        toast.error("Profile creation cancelled by user.");
      } else if (errorMessage.includes("Bidder already exists")) {
        toast.success("You already have a bidder profile!");
        setNeedsBidderProfile(false);
        onStatusChange?.(true);
      } else {
        toast.error("Failed to create bidder profile. Please try again.");
      }
    }
  };

  if (!isConnected) {
    return null;
  }

  if (compact) {
    // Compact version for use in forms or smaller spaces
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        {needsBidderProfile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-700">Bidder profile required</span>
            </div>
            <button
              onClick={createBidderProfile}
              disabled={isPending || isRetrying}
              className="text-xs px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending || isRetrying ? "Creating..." : "Create"}
            </button>
          </div>
        ) : bidderProfile ? (
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-700">
              Bidder #{bidderProfile.id} • {bidderProfile.totalBids} bids • Score: {bidderProfile.reputationScore}
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-500">Loading...</span>
          </div>
        )}
      </div>
    );
  }

  // Full version for profile page
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      {showTitle && (
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Bidder Status
        </h2>
      )}
      
      {needsBidderProfile ? (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Become a Bidder
              </h3>
              <p className="text-blue-700 mb-4">
                Create your bidder profile to start submitting bids on government projects. 
                This will enable you to participate in the transparent bidding process.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={createBidderProfile}
                  disabled={isPending || isRetrying}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isPending || isRetrying ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {isRetrying ? "Retrying..." : "Creating Profile..."}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Bidder Profile
                    </>
                  )}
                </button>
                <div className="text-sm text-blue-600">
                  <p className="font-medium">Benefits:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Submit bids on government projects</li>
                    <li>Build your reputation score</li>
                    <li>Track your bidding history</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : bidderProfile ? (
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Active Bidder Profile
              </h3>
              <p className="text-green-700 mb-4">
                Your bidder profile is active and ready for project bidding.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Bidder ID</p>
                  <p className="text-xl font-bold text-green-600">#{bidderProfile.id}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Total Bids</p>
                  <p className="text-xl font-bold text-green-600">{bidderProfile.totalBids}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Reputation Score</p>
                  <p className="text-xl font-bold text-green-600">{bidderProfile.reputationScore}</p>
                </div>
              </div>
              {bidderProfile.blacklisted && (
                <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">⚠️ Account Restricted</p>
                  <p className="text-red-700 text-sm">Your bidder account has been restricted. Please contact support.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <p className="text-gray-600">Loading bidder status...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidderStatusCard;

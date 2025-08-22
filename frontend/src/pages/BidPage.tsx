import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { deployedContracts } from "../contracts/deployedContracts";
import { toast } from "react-hot-toast";
import { useRetryableTransaction } from "../hooks/useRetryableTransaction";
import BidderStatusCard from "../components/BidderStatusCard";

interface Project {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  category: string;
  requirements: string;
  status: string;
  bidCount: number;
}

const BidPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const { executeWithRetry, isRetrying } = useRetryableTransaction();

  const [project, setProject] = useState<Project | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasBidderProfile, setHasBidderProfile] = useState(false);

  // Read project details from blockchain
  const { data: projectData } = useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'getProjectById',
    args: [projectId ? BigInt(projectId) : BigInt(0)],
  });

  useEffect(() => {
    if (projectData) {
      // Parse project data from blockchain - getProjectById returns:
      // [title, budget, description, deadline, posted, Id, projectType, creator, timePeriod]
      const [title, budget, description, deadline, posted, id, projectType] = projectData as [
        string, 
        bigint, 
        string, 
        bigint, 
        boolean, 
        bigint, 
        number, 
        string, 
        bigint
      ];
      
      setProject({
        id: id.toString(),
        title,
        description,
        budget: (Number(budget) / 10 ** 18).toFixed(2), // Convert from wei to BNB
        deadline: new Date(Number(deadline) * 1000).toLocaleDateString(),
        category: projectType === 0 ? "Max Rate" : projectType === 1 ? "Fix Rate" : "Min Rate",
        requirements: "", // This field is not returned by getProjectById
        status: posted ? "Open" : "Closed",
        bidCount: 0, // This field is not returned by getProjectById, we'll need to get it separately
      });
      setLoading(false);
    }
  }, [projectData]);

  // Enhanced error handling and retry logic with better gas management
  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    // Check if user needs to create bidder profile first
    if (!hasBidderProfile) {
      toast.error("Please create your bidder profile first");
      return;
    }

    if (!bidAmount || !proposal) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate bid amount
    const bidValue = parseFloat(bidAmount);
    if (bidValue <= 0) {
      toast.error("Bid amount must be greater than 0");
      return;
    }

    try {
      // Convert bid amount to wei with proper precision
      const bidAmountInWei = BigInt(Math.floor(bidValue * 10 ** 18));

      toast.loading("Preparing transaction...", { id: "bid-transaction" });

      // Use retry mechanism for transaction submission
      await executeWithRetry(
        async () => {
          return await writeContract({
            address: deployedContracts.TrustChain.address as `0x${string}`,
            abi: deployedContracts.TrustChain.abi,
            functionName: 'createBid',
            args: [
              BigInt(projectId || "0"),
              proposal,
              bidAmountInWei
            ],
          });
        },
        () => {
          // Success callback
          toast.success("Bid submitted successfully!", { id: "bid-transaction" });
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        },
        (error, attempt) => {
          // Error callback - return true to retry, false to stop
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          // Don't retry on user rejection or contract reverts
          if (
            errorMessage.includes("user rejected") || 
            errorMessage.includes("User denied") ||
            errorMessage.includes("execution reverted")
          ) {
            return false; // Don't retry
          }
          
          // Retry on gas issues, dropped transactions, or nonce issues
          if (
            errorMessage.includes("dropped") ||
            errorMessage.includes("replaced") ||
            errorMessage.includes("nonce") ||
            errorMessage.includes("gas")
          ) {
            return true; // Retry
          }
          
          return attempt < 2; // Retry once for other errors
        }
      );
      
    } catch (error: unknown) {
      console.error("Error submitting bid:", error);
      toast.dismiss("bid-transaction");
      
      // Enhanced error handling with more specific messages
      const errorMessage = error instanceof Error ? error.message : 
                          (typeof error === 'string' ? error : 
                           (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' ? error.message : 
                            "Unknown error occurred"));
      
      if (errorMessage.includes("user rejected") || errorMessage.includes("User denied")) {
        toast.error("Transaction cancelled by user.");
      } else if (errorMessage.includes("insufficient funds")) {
        toast.error("Insufficient funds for gas fees. Please add more BNB to your wallet.");
      } else if (errorMessage.includes("dropped") || errorMessage.includes("replaced")) {
        toast.error("Transaction was dropped due to network congestion. All retries failed.");
      } else if (errorMessage.includes("nonce")) {
        toast.error("Transaction nonce issue. Please refresh the page and try again.");
      } else if (errorMessage.includes("gas")) {
        toast.error("Gas estimation failed repeatedly. Please try again later.");
      } else if (errorMessage.includes("execution reverted")) {
        // Check for common contract revert reasons
        if (errorMessage.includes("Already bidded") || errorMessage.includes("already bid")) {
          toast.error("You have already submitted a bid for this project.");
        } else if (errorMessage.includes("Project not active")) {
          toast.error("This project is no longer accepting bids.");
        } else if (errorMessage.includes("Bidder does not exist")) {
          toast.error("Please create your bidder profile first.");
          setHasBidderProfile(false);
        } else {
          toast.error("Transaction failed. Please check the project details and try again.");
        }
      } else if (errorMessage.includes("network")) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error("Failed to submit bid after multiple attempts. Please try again later.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        
        <div className="pt-20">
          <div className="container py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading project details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        
        <div className="pt-20">
          <div className="container py-16">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Project Not Found
              </h1>
              <p className="text-gray-600 mb-8">
                The project you're looking for doesn't exist.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="btn btn-primary"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        
        <div className="pt-20">
          <div className="container py-16">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Wallet Not Connected
              </h1>
              <p className="text-gray-600 mb-8">
                Please connect your wallet to submit a bid.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="btn btn-primary"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="pt-20">
        <div className="container py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Submit Bid
              </h1>
              <p className="text-xl text-gray-600">
                Submit your proposal for this government project
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Project Details */}
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Title</h3>
                    <p className="text-gray-600">{project.title}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Description</h3>
                    <p className="text-gray-600">{project.description}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Category</h3>
                    <p className="text-gray-600 capitalize">{project.category}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Budget</h3>
                    <p className="text-gray-600">{project.budget} BNB</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Deadline</h3>
                    <p className="text-gray-600">{project.deadline}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Status</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      project.status === "Open" ? "bg-green-100 text-green-800" :
                      project.status === "In Progress" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Current Bids</h3>
                    <p className="text-gray-600">{project.bidCount} bids</p>
                  </div>
                  {project.requirements && (
                    <div>
                      <h3 className="font-semibold text-gray-900">Requirements</h3>
                      <p className="text-gray-600">{project.requirements}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bid Form */}
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Your Bid</h2>
                
                {/* Bidder Profile Status */}
                <div className="mb-6">
                  <BidderStatusCard 
                    compact={true} 
                    showTitle={false}
                    onStatusChange={setHasBidderProfile}
                  />
                </div>
                
                <form onSubmit={handleSubmitBid} className="space-y-6">
                  <div>
                    <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
                      Bid Amount (BNB) *
                    </label>
                    <input
                      type="number"
                      id="bidAmount"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Your bid should be competitive and realistic
                    </p>
                  </div>

                  <div>
                    <label htmlFor="proposal" className="block text-sm font-medium text-gray-700 mb-2">
                      Technical Proposal *
                    </label>
                    <textarea
                      id="proposal"
                      value={proposal}
                      onChange={(e) => setProposal(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your approach, methodology, timeline, and qualifications for this project..."
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isPending || isRetrying || !hasBidderProfile}
                      className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isPending || isRetrying ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          {isRetrying ? "Retrying..." : "Submitting Bid..."}
                        </div>
                      ) : !hasBidderProfile ? (
                        <div className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          Create Bidder Profile First
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Submit Bid
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidPage;


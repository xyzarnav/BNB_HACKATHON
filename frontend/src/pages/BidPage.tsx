import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { deployedContracts } from "../contracts/deployedContracts";
import NewNavbar from "../components/Trustchaincomponents/NewNavbar";
import { toast } from "react-hot-toast";

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
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const [project, setProject] = useState<Project | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(true);

  // Read project details from blockchain
  const { data: projectData } = useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'getProject',
    args: [projectId],
  });

  useEffect(() => {
    if (projectData) {
      // Parse project data from blockchain
      const [id, title, description, budget, deadline, category, requirements, status, bidCount] = projectData as any[];
      
      setProject({
        id: id.toString(),
        title,
        description,
        budget: (Number(budget) / 10 ** 18).toFixed(2), // Convert from wei to BNB
        deadline: new Date(Number(deadline) * 1000).toLocaleDateString(),
        category,
        requirements,
        status: status === 0 ? "Open" : status === 1 ? "In Progress" : "Completed",
        bidCount: Number(bidCount),
      });
      setLoading(false);
    }
  }, [projectData]);

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!bidAmount || !proposal) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Convert bid amount to wei
      const bidAmountInWei = (parseFloat(bidAmount) * 10 ** 18).toString();

      writeContract({
        address: deployedContracts.TrustChain.address as `0x${string}`,
        abi: deployedContracts.TrustChain.abi,
        functionName: 'submitBid',
        args: [
          projectId,
          bidAmountInWei,
          proposal
        ],
      });

      toast.success("Bid submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting bid:", error);
      toast.error("Failed to submit bid. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NewNavbar />
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
        <NewNavbar />
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
        <NewNavbar />
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
      <NewNavbar />
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
                      disabled={isPending}
                      className="w-full btn btn-primary"
                    >
                      {isPending ? "Submitting Bid..." : "Submit Bid"}
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


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useWriteContract } from "wagmi";
import { deployedContracts } from "../contracts/deployedContracts";
import NewNavbar from "../components/Trustchaincomponents/NewNavbar";
import { toast } from "react-hot-toast";

const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    category: "infrastructure",
    requirements: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!formData.title || !formData.description || !formData.budget || !formData.deadline) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Convert budget to wei (assuming BNB has 18 decimals)
      const budgetInWei = (parseFloat(formData.budget) * 10 ** 18).toString();
      
      // Convert deadline to timestamp
      const deadlineTimestamp = Math.floor(new Date(formData.deadline).getTime() / 1000);

      writeContract({
        address: deployedContracts.TrustChain.address as `0x${string}`,
        abi: deployedContracts.TrustChain.abi,
        functionName: 'createProject',
        args: [
          formData.title,
          formData.description,
          budgetInWei,
          deadlineTimestamp,
          formData.category,
          formData.requirements
        ],
      });

      toast.success("Project creation transaction submitted!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    }
  };

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
                Please connect your wallet to create a new project.
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
                Create New Project
              </h1>
              <p className="text-xl text-gray-600">
                Submit a new government project for bidding on the blockchain
              </p>
            </div>

            <div className="card p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter project title"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="infrastructure">Infrastructure</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="technology">Technology</option>
                      <option value="environment">Environment</option>
                      <option value="transportation">Transportation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the project in detail"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                      Budget (BNB) *
                    </label>
                    <input
                      type="number"
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                      Deadline *
                    </label>
                    <input
                      type="date"
                      id="deadline"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements & Specifications
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List project requirements, qualifications, and specifications"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="btn btn-primary"
                  >
                    {isPending ? "Creating Project..." : "Create Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;

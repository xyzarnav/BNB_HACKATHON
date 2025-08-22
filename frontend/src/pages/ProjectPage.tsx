import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { useProjectById } from "../hooks/useContractRead";
import { formatEther } from "viem";

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { address } = useAccount();
  const parsedProjectId = projectId ? parseInt(projectId) : null;
  const { data: project, isLoading } = useProjectById(parsedProjectId || 0);

  if (parsedProjectId === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Invalid Project ID
          </h1>
          <p className="text-gray-600 mb-8">
            Unable to load project details. Please check the URL and try again.
          </p>
          <button
                          onClick={() => navigate("/projects")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Projects
            </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Project Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The project you're looking for doesn't exist.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate("/projects")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              View All Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate("/projects")}
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              ← Back to Projects
            </button>
            <h1 className="text-4xl font-bold text-gray-900 mt-2">{project.title}</h1>
          </div>
          {address && address.toLowerCase() !== project.creator.toLowerCase() && (
            <Link 
              to={`/bid/${projectId}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Bid
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{project.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Project Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Budget</p>
                  <p className="text-lg font-bold text-gray-900">{formatEther(project.budget)} ETH</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Deadline</p>
                  <p className="text-gray-900">{new Date(Number(project.deadline) * 1000).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${
                    project.posted ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {project.posted ? "Active" : "Closed"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Project Type</p>
                  <p className="text-gray-900">
                    {project.projectType === 0 ? "Max Rate" : 
                     project.projectType === 1 ? "Fix Rate" : 
                     project.projectType === 2 ? "Min Rate" : "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created by</p>
                  <p className="text-gray-900 font-mono text-sm">
                    {project.creator.slice(0, 6)}...{project.creator.slice(-4)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;

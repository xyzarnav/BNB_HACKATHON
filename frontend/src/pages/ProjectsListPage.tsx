import React from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { useAllProjects } from "../hooks/useContractRead";
import { formatEther } from "viem";

const ProjectsListPage: React.FC = () => {
  const { address } = useAccount();
  const { data: projects, isLoading } = useAllProjects();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            No Active Projects
          </h1>
          <p className="text-gray-600 mb-8">
            There are currently no active projects available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Active Projects</h1>
          <p className="text-gray-600 mt-2">Browse and participate in available projects</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900 truncate">{project.title}</h2>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    project.posted ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {project.posted ? "Active" : "Closed"}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Budget</p>
                    <p className="text-lg font-bold text-gray-900">{formatEther(project.budget)} ETH</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Deadline</p>
                    <p className="text-gray-900">{new Date(Number(project.deadline) * 1000).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Project Type</p>
                    <p className="text-gray-900">
                      {project.projectType === 0 ? "Max Rate" : 
                       project.projectType === 1 ? "Fix Rate" : 
                       project.projectType === 2 ? "Min Rate" : "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <Link
                    to={`/project/${project.projectId}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Details →
                  </Link>
                  {address && address.toLowerCase() !== project.creator.toLowerCase() && (
                    <Link
                      to={`/bid/${project.projectId}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Submit Bid
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsListPage;

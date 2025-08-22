import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Project {
  id: number;
  title: string;
  description: string;
  budget: string;
  status: string;
  deadline: string;
  bids: number;
  creator: string;
  category: string;
}

const Activeprojects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Mock data - in real app this would come from smart contract
    const mockProjects: Project[] = [
      {
        id: 1,
        title: "Road Infrastructure Development",
        description: "Construction of major highway connecting two cities with modern infrastructure",
        budget: "2,500,000 BNB",
        status: "Active",
        deadline: "2024-12-31",
        bids: 5,
        creator: "0x1234...5678",
        category: "Infrastructure",
      },
      {
        id: 2,
        title: "Smart City Implementation",
        description: "IoT infrastructure for smart city management and monitoring",
        budget: "1,800,000 BNB",
        status: "Bidding",
        deadline: "2024-11-15",
        bids: 3,
        creator: "0x8765...4321",
        category: "Technology",
      },
      {
        id: 3,
        title: "Healthcare Facility Upgrade",
        description: "Modernization of public hospital facilities and equipment",
        budget: "3,200,000 BNB",
        status: "Active",
        deadline: "2024-10-30",
        bids: 7,
        creator: "0x9876...5432",
        category: "Healthcare",
      },
      {
        id: 4,
        title: "Educational Institution Renovation",
        description: "Complete renovation of public school buildings and facilities",
        budget: "1,500,000 BNB",
        status: "Bidding",
        deadline: "2024-12-15",
        bids: 4,
        creator: "0x5432...1098",
        category: "Education",
      },
    ];

    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProjects = projects.filter(project => {
    if (filter === "all") return true;
    return project.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "bidding":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Projects</h1>
          <p className="text-gray-600">Browse and bid on available government projects</p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {["all", "active", "bidding", "completed"].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Budget:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {project.budget}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Category:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {project.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Bids:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {project.bids} bids
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Deadline:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {project.deadline}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Created by: {project.creator}
                    </span>
                    <Link
                      to={`/project/${project.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Submit Bid
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">There are no projects matching your current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activeprojects;




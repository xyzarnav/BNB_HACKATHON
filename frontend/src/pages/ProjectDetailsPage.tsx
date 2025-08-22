import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import ProjectDetails from '../components/ProjectDetails';

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { address } = useAccount();

  if (!projectId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Project ID not found</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/" className="text-blue-600 hover:text-blue-700 flex items-center">
              ← Back to Projects
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mt-2">Project Details</h1>
          </div>
          <div>
            <Link 
              to={`/bid/${projectId}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Bid
            </Link>
          </div>
        </div>

        <ProjectDetails projectId={parseInt(projectId)} />
      </div>
    </div>
  );
};

export default ProjectDetailsPage;

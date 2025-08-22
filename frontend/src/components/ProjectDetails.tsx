import React from 'react';
import { useProjectDetails, getProjectTypeString } from '../hooks/useProjectDetails';
import { formatEther } from 'viem';
import { formatAddress } from '../utils/formatAddress';

interface ProjectDetailsProps {
  projectId: number;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectId }) => {
  const { projectDetails, isLoading, error } = useProjectDetails(projectId);

  if (isLoading) {
    return <div className="p-4">Loading project details...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading project details: {error.message}</div>;
  }

  if (!projectDetails) {
    return <div className="p-4">No project details found</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{projectDetails.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p><span className="font-semibold">Budget:</span> {formatEther(projectDetails.budget)} ETH</p>
          <p><span className="font-semibold">Project Type:</span> {getProjectTypeString(projectDetails.projectType)}</p>
          <p><span className="font-semibold">Creator:</span> {projectDetails.creator}</p>
          <p><span className="font-semibold">Status:</span> {projectDetails.posted ? 'Active' : 'Closed'}</p>
          <p><span className="font-semibold">Time Period:</span> {Number(projectDetails.timePeriod)} seconds</p>
          <p><span className="font-semibold">Deadline:</span> {new Date(Number(projectDetails.deadline) * 1000).toLocaleString()}</p>
          {projectDetails.isLate && <p className="text-red-500">Project is past deadline</p>}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Description:</h3>
          <p className="whitespace-pre-wrap">{projectDetails.description}</p>
          
          {projectDetails.bidWinner && (
            <p className="mt-4">
              <span className="font-semibold">Winning Bid ID:</span> {Number(projectDetails.bidWinner)}
            </p>
          )}
        </div>
      </div>

      {projectDetails.logs && projectDetails.logs.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Project Activity Log:</h3>
          <div className="space-y-2">
            {projectDetails.logs.map((log, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded">
                <p><span className="font-semibold">Action:</span> {log.action}</p>
                <p><span className="font-semibold">By:</span> {log.actor}</p>
                <p><span className="font-semibold">Time:</span> {new Date(Number(log.timestamp) * 1000).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;

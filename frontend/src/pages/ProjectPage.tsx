import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectDetails from "../components/ProjectDetails";

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const parsedProjectId = projectId ? parseInt(projectId) : null;

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => navigate("/projects")}
            className="text-blue-600 hover:text-blue-700 flex items-center"
          >
            ← Back to Projects
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mt-2">Project Details</h1>
        </div>

        <ProjectDetails projectId={parsedProjectId} />
      </div>
    </div>
  );
};

export default ProjectPage;

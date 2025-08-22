import React from 'react';

const AuditDashboardPage: React.FC = () => {
  // Hardcoded audit data for demonstration
  const auditData = [
    {
      id: 1,
      projectName: "Green Energy Bond",
      issuer: "EcoTech Solutions",
      status: "Under Review",
      lastAuditDate: "2024-03-15",
      riskLevel: "Low",
      complianceScore: 95,
    },
    {
      id: 2,
      projectName: "Infrastructure Development Bond",
      issuer: "BuildCorp International",
      status: "Approved",
      lastAuditDate: "2024-03-10",
      riskLevel: "Medium",
      complianceScore: 87,
    },
    {
      id: 3,
      projectName: "Healthcare Facility Bond",
      issuer: "MediCare Holdings",
      status: "Flagged",
      lastAuditDate: "2024-03-08",
      riskLevel: "High",
      complianceScore: 65,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-8">Audit Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Projects</h3>
          <p className="text-3xl font-bold text-blue-600">3</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Average Compliance</h3>
          <p className="text-3xl font-bold text-green-600">82.3%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">High Risk Projects</h3>
          <p className="text-3xl font-bold text-red-600">1</p>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issuer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Audit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance Score</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {auditData.map((project) => (
              <tr key={project.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.projectName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.issuer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${project.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                      project.status === 'Flagged' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.lastAuditDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${project.riskLevel === 'Low' ? 'bg-green-100 text-green-800' : 
                      project.riskLevel === 'High' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {project.riskLevel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${
                          project.complianceScore >= 90 ? 'bg-green-500' :
                          project.complianceScore >= 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${project.complianceScore}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{project.complianceScore}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditDashboardPage;

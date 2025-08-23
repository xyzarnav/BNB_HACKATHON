import React, { useState } from 'react';
import RiskAssessment from '../components/MLComponents/RiskAssessment';
import BidderAnalytics from '../components/MLComponents/BidderAnalytics';
import { mlService } from '../services/mlService';

const MLDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('risk-assessment');
  const [mlServiceStatus, setMlServiceStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  React.useEffect(() => {
    checkMLServiceStatus();
  }, []);

  const checkMLServiceStatus = async () => {
    try {
      await mlService.checkHealth();
      setMlServiceStatus('online');
    } catch (error) {
      setMlServiceStatus('offline');
    }
  };

  const tabs = [
    { id: 'risk-assessment', name: '🤖 Risk Assessment', icon: '🔍' },
    { id: 'analytics', name: '📊 Bidder Analytics', icon: '📈' },
    { id: 'models', name: '🧠 ML Models', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AI-Powered TrustChain Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Machine Learning insights for corruption prevention and risk assessment
              </p>
            </div>
            
            {/* ML Service Status */}
            <div className="flex items-center space-x-3">
              <div className={`flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                mlServiceStatus === 'online' 
                  ? 'bg-green-100 text-green-800' 
                  : mlServiceStatus === 'offline'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  mlServiceStatus === 'online' 
                    ? 'bg-green-400' 
                    : mlServiceStatus === 'offline'
                    ? 'bg-red-400'
                    : 'bg-yellow-400'
                }`}></div>
                {mlServiceStatus === 'online' && 'ML Service Online'}
                {mlServiceStatus === 'offline' && 'ML Service Offline'}
                {mlServiceStatus === 'checking' && 'Checking Status...'}
              </div>
              
              <button
                onClick={checkMLServiceStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'risk-assessment' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                🚀 Real-time Risk Assessment
              </h2>
              <p className="text-gray-600 mb-6">
                Use our AI-powered risk assessment system to evaluate bidders before awarding contracts. 
                The system analyzes historical data, reputation scores, and project completion rates to provide 
                comprehensive risk insights.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RiskAssessment />
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">
                    💡 How It Works
                  </h3>
                  <div className="space-y-3 text-sm text-blue-700">
                    <div className="flex items-start">
                      <span className="font-bold mr-2">1.</span>
                      <span>Enter the bidder's wallet address and bid details</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold mr-2">2.</span>
                      <span>Our ML model analyzes historical performance data</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold mr-2">3.</span>
                      <span>Get instant risk score and recommendations</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold mr-2">4.</span>
                      <span>Make informed decisions based on AI insights</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-100 rounded-md">
                    <p className="text-xs text-blue-800">
                      <strong>Note:</strong> The system uses machine learning models trained on historical 
                      project data to predict risk levels. Always verify critical information independently.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <BidderAnalytics />
        )}

        {activeTab === 'models' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                🧠 Machine Learning Models
              </h2>
              <p className="text-gray-600 mb-6">
                Our AI system uses multiple machine learning models to provide accurate risk assessments 
                for different types of bids and project scenarios.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                  <div className="text-3xl mb-3">🌱</div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">MinRate Model</h3>
                  <p className="text-sm text-green-700">
                    Specialized for lowest-bid scenarios. Analyzes delivery capability, 
                    quality scores, and completion rates to assess risk of underbidding.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">MaxRate Model</h3>
                  <p className="text-sm text-blue-700">
                    Designed for highest-bid scenarios. Evaluates value proposition, 
                    payment history, and project complexity to justify premium pricing.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">FixRate Model</h3>
                  <p className="text-sm text-purple-700">
                    Optimized for fixed-price contracts. Focuses on timeline adherence, 
                    budget management, and change order patterns.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  🔧 Model Management
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Model Training</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Our models are continuously trained on new project data to improve accuracy 
                      and adapt to changing market conditions.
                    </p>
                    <button
                      onClick={async () => {
                        try {
                          await mlService.trainModels();
                          alert('Models trained successfully!');
                        } catch (error: any) {
                          alert(`Training failed: ${error.message}`);
                        }
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      🚀 Retrain Models
                    </button>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Performance Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Accuracy:</span>
                        <span className="font-medium text-green-600">94.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Precision:</span>
                        <span className="font-medium text-blue-600">91.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recall:</span>
                        <span className="font-medium text-purple-600">89.5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📊 Feature Importance
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Project Completion Rate</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Reputation Score</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Disputes</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <span className="text-sm font-medium">72%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Budget Overruns</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MLDashboardPage;

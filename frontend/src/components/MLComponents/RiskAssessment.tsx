import React, { useState } from 'react';
import { mlService, RiskAssessmentRequest, RiskAssessmentResponse } from '../../services/mlService';

interface RiskAssessmentProps {
  onAssessmentComplete?: (assessment: RiskAssessmentResponse) => void;
  className?: string;
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({ onAssessmentComplete, className = '' }) => {
  const [formData, setFormData] = useState<RiskAssessmentRequest>({
    bidder_address: '',
    bid_type: 'MinRate',
    bid_amount: undefined,
    project_budget: undefined
  });
  
  const [assessment, setAssessment] = useState<RiskAssessmentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'bid_amount' || name === 'project_budget' ? parseFloat(value) || undefined : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await mlService.assessRisk(formData);
      setAssessment(result);
      onAssessmentComplete?.(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        🤖 AI Risk Assessment
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bidder Address
          </label>
          <input
            type="text"
            name="bidder_address"
            value={formData.bidder_address}
            onChange={handleInputChange}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bid Type
          </label>
          <select
            name="bid_type"
            value={formData.bid_type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MinRate">MinRate</option>
            <option value="MaxRate">MaxRate</option>
            <option value="FixRate">FixRate</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bid Amount (Optional)
            </label>
            <input
              type="number"
              name="bid_amount"
              value={formData.bid_amount || ''}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Budget (Optional)
            </label>
            <input
              type="number"
              name="project_budget"
              value={formData.project_budget || ''}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '🔍 Assessing Risk...' : '🚀 Assess Risk'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          ❌ {error}
        </div>
      )}

      {assessment && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            Risk Assessment Results
          </h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Risk Score:</span>
              <span className={`text-xl font-bold ${getRiskColor(assessment.risk_score)}`}>
                {assessment.risk_score.toFixed(1)}/100
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Risk Category:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${mlService.getRiskCategoryColor(assessment.risk_category)}`}>
                {mlService.getRiskCategoryIcon(assessment.risk_category)} {assessment.risk_category}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Recommendation:</span>
              <span className="text-sm text-gray-800 max-w-xs text-right">
                {assessment.recommendation}
              </span>
            </div>
            
            <div className="border-t pt-3 mt-3">
              <h5 className="font-medium text-gray-700 mb-2">Bidder Statistics</h5>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Projects:</span>
                  <div className="font-medium">{assessment.bidder_stats.total_projects}</div>
                </div>
                <div>
                  <span className="text-gray-500">Completion:</span>
                  <div className="font-medium">{(assessment.bidder_stats.completion_rate * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-gray-500">Reputation:</span>
                  <div className="font-medium">{assessment.bidder_stats.reputation_score.toFixed(1)}/10</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAssessment;

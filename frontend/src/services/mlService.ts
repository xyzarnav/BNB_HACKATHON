import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface RiskAssessmentRequest {
  bidder_address: string;
  bid_type: 'MinRate' | 'MaxRate' | 'FixRate';
  bid_amount?: number;
  project_budget?: number;
}

export interface RiskAssessmentResponse {
  bidder_address: string;
  bid_type: string;
  risk_score: number;
  risk_category: 'Low' | 'Medium' | 'High';
  recommendation: string;
  bidder_stats: {
    total_projects: number;
    completion_rate: number;
    reputation_score: number;
  };
}

export interface BidderStats {
  bidder_address: string;
  total_projects: number;
  completion_rate: number;
  reputation_score: number;
  quality_score: number;
}

export interface BatchAssessmentRequest {
  bidders: RiskAssessmentRequest[];
}

export interface BatchAssessmentResponse {
  total_assessed: number;
  assessments: Array<RiskAssessmentRequest & { assessment: RiskAssessmentResponse | { error: string } }>;
}

class MLService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api/ml`;
  }

  // Health check for ML service
  async checkHealth(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/health`);
      return response.data;
    } catch (error) {
      throw new Error('ML service health check failed');
    }
  }

  // Assess risk for a single bidder
  async assessRisk(request: RiskAssessmentRequest): Promise<RiskAssessmentResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/assess_risk`, request);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to assess risk');
    }
  }

  // Get statistics for all bidders
  async getBidderStats(): Promise<{ total_bidders: number; bidders: BidderStats[] }> {
    try {
      const response = await axios.get(`${this.baseURL}/bidder_stats`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to get bidder statistics');
    }
  }

  // Train ML models
  async trainModels(): Promise<any> {
    try {
      const response = await axios.post(`${this.baseURL}/train_models`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to train models');
    }
  }

  // Batch risk assessment for multiple bidders
  async batchAssessRisk(request: BatchAssessmentRequest): Promise<BatchAssessmentResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/batch_assess_risk`, request);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to perform batch assessment');
    }
  }

  // Get risk category color
  getRiskCategoryColor(riskCategory: string): string {
    switch (riskCategory) {
      case 'Low':
        return 'text-green-600 bg-green-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'High':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  // Get risk category icon
  getRiskCategoryIcon(riskCategory: string): string {
    switch (riskCategory) {
      case 'Low':
        return '✅';
      case 'Medium':
        return '⚠️';
      case 'High':
        return '❌';
      default:
        return '❓';
    }
  }

  // Format risk score for display
  formatRiskScore(score: number): string {
    if (score < 30) return 'Low Risk';
    if (score < 70) return 'Medium Risk';
    return 'High Risk';
  }
}

export const mlService = new MLService();
export default mlService;

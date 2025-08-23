import { useState, useCallback } from 'react';
import { useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { TrustChain__factory } from '../contracts/typechain-types';
import { mlService, RiskAssessmentRequest, RiskAssessmentResponse } from '../services/mlService';

export const useMLContract = (contractAddress: string) => {
  const [isSubmittingAssessment, setIsSubmittingAssessment] = useState(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);

  // Contract instance
  const contract = TrustChain__factory.connect(contractAddress);

  // Submit ML risk assessment to blockchain
  const submitRiskAssessment = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: contract.interface.fragments,
    functionName: 'submitRiskAssessment',
  });

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransaction({
    hash: submitRiskAssessment.data?.hash,
  });

  // Get risk assessment from blockchain
  const getRiskAssessment = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: contract.interface.fragments,
    functionName: 'getRiskAssessment',
    enabled: false,
  });

  // Get bidder's average risk score
  const getBidderAverageRisk = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: contract.interface.fragments,
    functionName: 'getBidderAverageRisk',
    enabled: false,
  });

  // Get bidder's risk history
  const getBidderRiskHistory = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: contract.interface.fragments,
    functionName: 'getBidderRiskHistory',
    enabled: false,
  });

  // Submit ML assessment and store on blockchain
  const submitAssessmentToBlockchain = useCallback(async (
    bidId: number,
    assessment: RiskAssessmentResponse
  ) => {
    try {
      setIsSubmittingAssessment(true);
      setAssessmentError(null);

      // Convert risk score to number and ensure it's within bounds
      const riskScore = Math.min(100, Math.max(0, Math.round(assessment.risk_score)));
      
      // Submit to blockchain
      const result = await submitRiskAssessment.writeAsync({
        args: [
          BigInt(bidId),
          BigInt(riskScore),
          assessment.risk_category,
          assessment.recommendation,
          'v1.0.0' // ML model version
        ],
      });

      return result;
    } catch (error: any) {
      setAssessmentError(error.message || 'Failed to submit assessment to blockchain');
      throw error;
    } finally {
      setIsSubmittingAssessment(false);
    }
  }, [submitRiskAssessment]);

  // Complete ML assessment workflow
  const performCompleteAssessment = useCallback(async (
    request: RiskAssessmentRequest,
    bidId: number
  ) => {
    try {
      // Step 1: Get ML assessment from backend
      const assessment = await mlService.assessRisk(request);
      
      // Step 2: Submit to blockchain
      await submitAssessmentToBlockchain(bidId, assessment);
      
      return assessment;
    } catch (error: any) {
      setAssessmentError(error.message);
      throw error;
    }
  }, [submitAssessmentToBlockchain]);

  // Fetch risk assessment from blockchain
  const fetchRiskAssessment = useCallback(async (bidId: number) => {
    try {
      const result = await getRiskAssessment.refetch({
        args: [BigInt(bidId)],
      });
      
      if (result.data) {
        const [riskScore, riskCategory, recommendation, timestamp, approved, mlModelVersion] = result.data;
        return {
          riskScore: Number(riskScore),
          riskCategory,
          recommendation,
          timestamp: Number(timestamp),
          approved,
          mlModelVersion
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching risk assessment:', error);
      return null;
    }
  }, [getRiskAssessment]);

  // Fetch bidder risk data
  const fetchBidderRiskData = useCallback(async (bidderAddress: string) => {
    try {
      const [averageRisk, riskHistory] = await Promise.all([
        getBidderAverageRisk.refetch({ args: [bidderAddress] }),
        getBidderRiskHistory.refetch({ args: [bidderAddress] })
      ]);

      return {
        averageRisk: averageRisk.data ? Number(averageRisk.data) : 0,
        riskHistory: riskHistory.data ? riskHistory.data.map(score => Number(score)) : []
      };
    } catch (error) {
      console.error('Error fetching bidder risk data:', error);
      return { averageRisk: 0, riskHistory: [] };
    }
  }, [getBidderAverageRisk, getBidderRiskHistory]);

  return {
    // State
    isSubmittingAssessment,
    isConfirming,
    isConfirmed,
    assessmentError,
    
    // Functions
    submitAssessmentToBlockchain,
    performCompleteAssessment,
    fetchRiskAssessment,
    fetchBidderRiskData,
    
    // Contract functions
    submitRiskAssessment: submitRiskAssessment.writeAsync,
    
    // Reset error
    resetError: () => setAssessmentError(null),
  };
};

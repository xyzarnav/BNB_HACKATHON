const express = require('express');
const router = express.Router();
const axios = require('axios');

// ML Service configuration
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// Health check for ML service
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`);
    res.json({
      success: true,
      ml_service: response.data,
      backend: 'Connected'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'ML service unavailable',
      error: error.message
    });
  }
});

// Assess risk for a bidder
router.post('/assess_risk', async (req, res) => {
  try {
    const { bidder_address, bid_type, bid_amount, project_budget } = req.body;
    
    if (!bidder_address || !bid_type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bidder_address, bid_type'
      });
    }
    
    const response = await axios.post(`${ML_SERVICE_URL}/assess_risk`, {
      bidder_address,
      bid_type,
      bid_amount,
      project_budget
    });
    
    res.json({
      success: true,
      data: response.data
    });
    
  } catch (error) {
    console.error('ML service error:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        error: error.response.data
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to assess risk',
      error: error.response?.data?.error || error.message
    });
  }
});

// Get bidder statistics
router.get('/bidder_stats', async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/get_bidder_stats`);
    
    res.json({
      success: true,
      data: response.data
    });
    
  } catch (error) {
    console.error('ML service error:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to get bidder statistics',
      error: error.response?.data?.error || error.message
    });
  }
});

// Train ML models
router.post('/train_models', async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/train_models`);
    
    res.json({
      success: true,
      data: response.data
    });
    
  } catch (error) {
    console.error('ML service error:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to train models',
      error: error.response?.data?.error || error.message
    });
  }
});

// Batch risk assessment for multiple bidders
router.post('/batch_assess_risk', async (req, res) => {
  try {
    const { bidders } = req.body;
    
    if (!Array.isArray(bidders) || bidders.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Bidders array is required and must not be empty'
      });
    }
    
    const assessments = [];
    
    for (const bidder of bidders) {
      try {
        const response = await axios.post(`${ML_SERVICE_URL}/assess_risk`, bidder);
        assessments.push({
          ...bidder,
          assessment: response.data
        });
      } catch (error) {
        assessments.push({
          ...bidder,
          assessment: {
            error: error.response?.data?.error || 'Assessment failed'
          }
        });
      }
    }
    
    res.json({
      success: true,
      data: {
        total_assessed: assessments.length,
        assessments
      }
    });
    
  } catch (error) {
    console.error('Batch assessment error:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to perform batch assessment',
      error: error.message
    });
  }
});

module.exports = router;

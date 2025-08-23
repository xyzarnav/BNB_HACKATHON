# TrustChain ML Integration Guide

This document provides a comprehensive guide to the Machine Learning (ML) integration in the TrustChain project, which helps prevent corruption and assess bidder risk using AI-powered analytics.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB running
- BSC testnet or mainnet configured

### 1. Start ML Service
```bash
cd bnb/backend/ml
pip install -r requirements.txt
python ml_service.py
```
The ML service will start on port 5001.

### 2. Start Backend
```bash
cd bnb/backend
npm install
npm run dev
```
The backend will start on port 3001.

### 3. Start Frontend
```bash
cd bnb/frontend
npm install
npm run dev
```
The frontend will start on port 5173.

## 🏗️ Architecture Overview

### ML Service (Python Flask)
- **Port**: 5001
- **Purpose**: Provides ML risk assessment APIs
- **Features**:
  - Risk assessment for bidders
  - Model training and management
  - Historical data analysis
  - Real-time predictions

### Backend Integration (Node.js)
- **Port**: 3001
- **Purpose**: Bridges ML service with frontend
- **Features**:
  - ML API proxy endpoints
  - Data validation and transformation
  - Error handling and logging

### Smart Contract Integration
- **Purpose**: Stores ML assessments on blockchain
- **Features**:
  - Risk assessment storage
  - Bidder risk history tracking
  - ML-enhanced bid evaluation

### Frontend Components
- **Risk Assessment**: Real-time AI risk evaluation
- **Bidder Analytics**: Comprehensive performance dashboard
- **ML Dashboard**: Centralized ML management interface

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
ML_SERVICE_URL=http://localhost:5001
MONGODB_URI=mongodb://localhost:27017/trustchain
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3001
VITE_CONTRACT_ADDRESS=your_contract_address_here
```

### ML Model Configuration
The ML service uses pre-trained models stored in the `ml/` directory:
- `risk_model_minrate.pkl`: MinRate bid risk model
- `scaler_minrate.pkl`: Feature scaler for MinRate model
- `dataset.csv`: Training dataset with bidder history

## 📊 ML Features

### 1. Risk Assessment
- **Input**: Bidder address, bid type, amount, budget
- **Output**: Risk score (0-100), category, recommendation
- **Models**: Specialized for MinRate, MaxRate, FixRate bids

### 2. Bidder Analytics
- **Performance Metrics**: Completion rate, reputation, quality scores
- **Risk History**: Historical risk assessment tracking
- **Filtering**: By reputation, completion rate, risk level

### 3. Smart Contract Integration
- **On-chain Storage**: Risk assessments stored on blockchain
- **Automatic Filtering**: High-risk bids automatically flagged
- **Transparency**: All assessments publicly verifiable

## 🧠 ML Models

### Model Types
1. **MinRate Model**: Optimized for lowest-bid scenarios
2. **MaxRate Model**: Designed for highest-bid scenarios  
3. **FixRate Model**: Specialized for fixed-price contracts

### Features Used
- Total projects completed
- Project completion rate
- Average delay days
- Budget overruns percentage
- Quality score
- Reputation score
- Payment disputes
- Days since last project

### Training Process
```bash
# Train models with new data
curl -X POST http://localhost:5001/train_models
```

## 🔌 API Endpoints

### ML Service (Port 5001)
- `GET /health` - Service health check
- `POST /assess_risk` - Risk assessment for bidder
- `GET /bidder_stats` - Get all bidder statistics
- `POST /train_models` - Retrain ML models

### Backend Proxy (Port 3001)
- `GET /api/ml/health` - ML service health check
- `POST /api/ml/assess_risk` - Risk assessment
- `GET /api/ml/bidder_stats` - Bidder statistics
- `POST /api/ml/train_models` - Model training
- `POST /api/ml/batch_assess_risk` - Batch assessment

## 💻 Frontend Usage

### 1. ML Dashboard
Navigate to `/ml-dashboard` to access:
- Real-time risk assessment
- Bidder analytics dashboard
- ML model management

### 2. Risk Assessment in Bidding
When submitting a bid:
1. Fill bid form
2. Submit bid
3. Complete AI risk assessment
4. Assessment stored on blockchain

### 3. Analytics View
Monitor bidder performance with:
- Risk level filtering
- Performance metrics
- Historical trends

## 🔒 Security Features

### Anti-Corruption Measures
- **Transparency**: All assessments publicly visible
- **Immutability**: Blockchain-stored assessments
- **Audit Trail**: Complete history tracking
- **Whistleblower Protection**: Anonymous reporting system

### Data Privacy
- **No PII**: Only wallet addresses stored
- **Aggregated Stats**: Individual data protected
- **Consent-based**: Voluntary participation

## 🚨 Troubleshooting

### Common Issues

#### ML Service Not Starting
```bash
# Check Python dependencies
pip install -r requirements.txt

# Verify port availability
netstat -an | grep 5001
```

#### Backend Connection Issues
```bash
# Check ML service health
curl http://localhost:5001/health

# Verify environment variables
echo $ML_SERVICE_URL
```

#### Frontend Errors
```bash
# Check API connectivity
curl http://localhost:3001/api/ml/health

# Verify contract address
echo $VITE_CONTRACT_ADDRESS
```

### Logs
- **ML Service**: Console output
- **Backend**: `npm run dev` output
- **Frontend**: Browser console

## 📈 Performance Optimization

### ML Model Optimization
- **Batch Processing**: Process multiple assessments
- **Caching**: Cache frequent assessments
- **Model Updates**: Regular retraining with new data

### Blockchain Optimization
- **Gas Efficiency**: Optimized contract functions
- **Batch Operations**: Multiple assessments in single transaction
- **Event Indexing**: Efficient event filtering

## 🔮 Future Enhancements

### Planned Features
1. **Real-time Learning**: Continuous model updates
2. **Advanced Analytics**: Predictive modeling
3. **Multi-chain Support**: Cross-chain risk assessment
4. **API Marketplace**: Third-party ML model integration

### Scalability Improvements
1. **Microservices**: Separate ML service instances
2. **Load Balancing**: Multiple ML service endpoints
3. **Database Optimization**: Efficient data storage
4. **Caching Layer**: Redis integration

## 📚 Additional Resources

### Documentation
- [Smart Contract ABI](./hardhat/artifacts/contracts/TrustChain.sol/TrustChain.json)
- [ML Service API](./backend/ml/ml_service.py)
- [Frontend Components](./frontend/src/components/MLComponents/)

### Support
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Documentation**: This README

## 🎯 Getting Help

If you encounter issues:
1. Check the troubleshooting section
2. Review logs for error messages
3. Verify configuration settings
4. Create a GitHub issue with details

---

**Note**: This ML integration is designed to enhance transparency and prevent corruption in the TrustChain ecosystem. Always verify critical information independently and use ML insights as decision support, not as the sole decision factor.

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import json
from web3 import Web3
from datetime import datetime

class TrustChainRiskML:
    def __init__(self):
        # Add this line for storing historical data
        self.historical_data = None
        
        self.models = {
            'MinRate': None,
            'MaxRate': None,
            'FixRate': None
        }
        self.scalers = {
            'MinRate': StandardScaler(),
            'MaxRate': StandardScaler(),
            'FixRate': StandardScaler()
        }
        self.feature_names = [
            'total_projects', 'completed_projects', 'abandoned_projects',
            'completion_rate', 'average_delay_days', 'budget_overruns_percent',
            'quality_score', 'reputation_score', 'payment_disputes',
            'days_since_last_project'
        ]

    def load_historical_data(self, csv_path):
        """Load and store historical data for user lookups"""
        self.historical_data = pd.read_csv(csv_path)
        return self.historical_data

    def get_bidder_risk_assessment(self, bidder_address, bid_type, bid_amount=None, project_budget=None):
        """Complete risk assessment for a bidder by their address"""
        
        # Step 1: Lookup bidder data
        if self.historical_data is None:
            return {"error": "Historical data not loaded"}
        
        bidder_row = self.historical_data[self.historical_data['bidder_address'] == bidder_address]
        
        if bidder_row.empty:
            return {"error": f"Bidder {bidder_address} not found in dataset"}
        
        # Step 2: Convert to dictionary format
        bidder_data = bidder_row.iloc[0].to_dict()
        
        # Step 3: Predict risk using trained model
        risk_score = self.predict_risk(bidder_data, bid_type, bid_amount, project_budget)
        
        # Step 4: Return complete assessment
        return {
            'bidder_address': bidder_address,
            'bid_type': bid_type,
            'risk_score': float(risk_score),
            'risk_category': 'Low' if risk_score < 30 else 'Medium' if risk_score < 70 else 'High',
            'recommendation': self._get_recommendation(risk_score, bid_type),
            'bidder_stats': {
                'total_projects': int(bidder_data['total_projects']),
                'completion_rate': float(bidder_data['completion_rate']),
                'reputation_score': float(bidder_data['reputation_score'])
            }
        }

    def _get_recommendation(self, score, bid_type):
        """Generate recommendation based on risk score"""
        if score < 30:
            return f"✅ APPROVE - Low risk for {bid_type}"
        elif score < 70:
            return f"⚠️ APPROVE WITH MONITORING - Medium risk for {bid_type}"
        else:
            return f"❌ REJECT - High risk for {bid_type}"

    def extract_blockchain_data(self, contract_address, abi, web3_provider):
        """Extract bidder data from your TrustChain smart contract"""
        w3 = Web3(Web3.HTTPProvider(web3_provider))
        contract = w3.eth.contract(address=contract_address, abi=abi)
       
        bidder_count = contract.functions.bidderCount().call()
        bidders_data = []
       
        for i in range(1, bidder_count + 1):
            bidder = contract.functions.bidders(i).call()
           
            # Extract additional metrics from contract
            bids = self._get_bidder_bids(contract, bidder[1])
            projects = self._get_bidder_projects(contract, bidder)
           
            bidders_data.append({
                'bidder_address': bidder,
                'total_projects': len(projects),
                'completed_projects': len([p for p in projects if p['status'] == 'Completed']),
                'abandoned_projects': len([p for p in projects if p['status'] == 'Disputed']),
                'completion_rate': self._calculate_completion_rate(projects),
                'average_delay_days': self._calculate_average_delay(projects),
                'budget_overruns_percent': self._calculate_budget_overruns(projects),
                'quality_score': bidder[3] / 2,  # Normalize reputation to quality score
                'reputation_score': bidder,
                'payment_disputes': self._count_payment_disputes(contract, bidder),
                'days_since_last_project': self._days_since_last_activity(projects)
            })
       
        return pd.DataFrame(bidders_data)

    def prepare_training_data(self, df, bid_type):
        """Prepare and engineer features specific to each bid type"""
        # Add bid-type specific features
        if bid_type == 'MinRate':
            # MinRate focuses on delivery capability
            df['delivery_risk'] = (df['abandoned_projects'] * 2 +
                                 df['average_delay_days'] / 30 +
                                 df['budget_overruns_percent'] / 100)
            df['quality_risk'] = (10 - df['quality_score']) / 10
        
        return df

    def calculate_risk_labels(self, df, bid_type):
        """Calculate risk scores based on bid type specific factors"""
        risk_scores = []
       
        for _, row in df.iterrows():
            base_risk = 0
           
            # Common risk factors
            base_risk += row['abandoned_projects'] * 25
            base_risk += min(30, row['average_delay_days'] * 0.5)
            base_risk += min(25, row['budget_overruns_percent'] * 0.3)
            base_risk += row['payment_disputes'] * 8
            base_risk -= row['reputation_score'] * 1.5
           
            # Bid-type specific adjustments
            if bid_type == 'MinRate':
                # Higher penalty for delivery issues
                base_risk += (10 - row['quality_score']) * 3
                if row['completion_rate'] < 0.8:
                    base_risk += 20
            
            risk_scores.append(max(0, min(100, base_risk)))
       
        return risk_scores

    def train_models(self, historical_data):
        """Train separate ML models for each bid type"""
       
        for bid_type in ['MinRate']:
            print(f"Training model for {bid_type}...")
           
            # Filter data for specific bid type
            type_data = historical_data[historical_data['bid_type'] == bid_type].copy()
           
            if len(type_data) < 10:
                print(f"Insufficient data for {bid_type}, using general model")
                continue
           
            # Prepare features
            type_data = self.prepare_training_data(type_data, bid_type)
            type_data['risk_score'] = self.calculate_risk_labels(type_data, bid_type)
           
            # Select features
            X = type_data[self.feature_names]
            y = type_data['risk_score']
           
            # Scale features
            X_scaled = self.scalers[bid_type].fit_transform(X)
           
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X_scaled, y, test_size=0.2, random_state=42
            )
           
            # Try different models and select best
            models_to_try = {
                'RandomForest': RandomForestRegressor(n_estimators=100, random_state=42),
                'GradientBoosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
                'Linear': LinearRegression()
            }
           
            best_score = float('inf')
            best_model = None
           
            for name, model in models_to_try.items():
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)
                mse = mean_squared_error(y_test, y_pred)
               
                if mse < best_score:
                    best_score = mse
                    best_model = model
                   
                print(f"{bid_type} - {name}: MSE = {mse:.2f}")
           
            self.models[bid_type] = best_model
           
            # Save model and scaler
            joblib.dump(best_model, f'risk_model_{bid_type.lower()}.pkl')
            joblib.dump(self.scalers[bid_type], f'scaler_{bid_type.lower()}.pkl')

    def predict_risk(self, bidder_data, bid_type, bid_amount=None, project_budget=None):
        """Predict risk score for a specific bidder and bid type"""
       
        if self.models[bid_type] is None:
            return self._fallback_risk_calculation(bidder_data, bid_type)
       
        # Prepare features
        features = {feature: bidder_data.get(feature, 0) for feature in self.feature_names}
        features_df = pd.DataFrame([features])  # DataFrame with correct columns

        # Scale features
        features_scaled = self.scalers[bid_type].transform(features_df)
       
        # Predict
        risk_score = self.models[bid_type].predict(features_scaled)[0]
       
        # Add bid-specific adjustments
        if bid_type == 'MinRate' and bid_amount and project_budget:
            bid_ratio = bid_amount / project_budget
            if bid_ratio < 0.6:
                risk_score += 25  # Unrealistically low bid
            elif bid_ratio < 0.75:
                risk_score += 10  # Suspiciously low bid
               
        elif bid_type == 'MaxRate' and bid_amount:
            # High bid without payment history increases risk
            if bid_amount > bidder_data.get('total_contract_value', 0) * 2:
                risk_score += 20
       
        return max(0, min(100, risk_score))

    def _fallback_risk_calculation(self, bidder_data, bid_type):
        """Fallback rule-based calculation if ML model not available"""
        base_risk = 0
        base_risk += bidder_data.get('abandoned_projects', 0) * 30
        base_risk += min(30, bidder_data.get('average_delay_days', 0) * 0.5)
        base_risk += bidder_data.get('payment_disputes', 0) * 15
        base_risk -= bidder_data.get('reputation_score', 0) * 2
       
        return max(0, min(100, base_risk))

    def load_models(self):
        """Load pre-trained models"""
        for bid_type in ['MinRate', 'MaxRate', 'FixRate']:
            try:
                self.models[bid_type] = joblib.load(f'risk_model_{bid_type.lower()}.pkl')
                self.scalers[bid_type] = joblib.load(f'scaler_{bid_type.lower()}.pkl')
            except FileNotFoundError:
                print(f"Model for {bid_type} not found")

# API Integration
from flask import Flask, request, jsonify

app = Flask(__name__)
risk_ml = TrustChainRiskML()

# UPDATED API endpoint - now uses bidder lookup
@app.route('/assess_risk', methods=['POST'])
def assess_risk():
    data = request.json
    
    bidder_address = data['bidder_address']
    bid_type = data['bid_type']
    bid_amount = data.get('bid_amount')
    project_budget = data.get('project_budget')
    
    # Use the new complete assessment method
    result = risk_ml.get_bidder_risk_assessment(
        bidder_address, bid_type, bid_amount, project_budget
    )
    
    return jsonify(result)

# REMOVED: get_recommendation function (now part of the class)

if __name__ == '__main__':
    # Load and store historical data
    risk_ml.load_historical_data('dataset.csv')
    
    # Train models
    risk_ml.train_models(risk_ml.historical_data)
    
    # Test with a specific bidder
    test_result = risk_ml.get_bidder_risk_assessment('0xBIDDER01', 'MinRate')
    print("Test Result:", test_result)
    
    # Start API
    app.run(debug=True, port=5000)

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['creation', 'update', 'bid', 'completion'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  blockNumber: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending',
  },
});

const projectSchema = new mongoose.Schema({
  projectId: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  creator: {
    type: String, // Ethereum address
    required: true,
  },
  budget: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  transactions: [transactionSchema],
  // Store the initial creation transaction hash
  creationTxHash: {
    type: String,
    required: true,
    unique: true,
  },
});

// Create QR code URL for explorer
projectSchema.methods.getExplorerUrl = function(network = 'testnet') {
  const baseUrl = network === 'mainnet' 
    ? 'https://bscscan.com/tx/'
    : 'https://testnet.bscscan.com/tx/';
  return `${baseUrl}${this.creationTxHash}`;
};

// Get all transaction URLs
projectSchema.methods.getAllTransactionUrls = function(network = 'testnet') {
  const baseUrl = network === 'mainnet' 
    ? 'https://bscscan.com/tx/'
    : 'https://testnet.bscscan.com/tx/';
  
  return this.transactions.map(tx => ({
    type: tx.type,
    url: `${baseUrl}${tx.hash}`,
    timestamp: tx.timestamp,
    status: tx.status,
  }));
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;

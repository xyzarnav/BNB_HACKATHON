const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Create a new project with transaction hash
router.post('/', async (req, res) => {
  try {
    const { projectId, title, description, creator, budget, txHash } = req.body;

    const project = new Project({
      projectId,
      title,
      description,
      creator,
      budget,
      creationTxHash: txHash,
      transactions: [{
        hash: txHash,
        type: 'creation',
        status: 'confirmed',
      }],
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ message: error.message });
  }
});

// Add a new transaction to a project
router.post('/:projectId/transactions', async (req, res) => {
  try {
    const { txHash, type, blockNumber } = req.body;
    const project = await Project.findOne({ projectId: req.params.projectId });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.transactions.push({
      hash: txHash,
      type,
      blockNumber,
      status: 'confirmed',
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get project by ID with all transaction hashes
router.get('/:projectId', async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Get explorer URLs for all transactions
    const transactionUrls = project.getAllTransactionUrls();
    const explorerUrl = project.getExplorerUrl();

    res.json({
      ...project.toJSON(),
      explorerUrl,
      transactionUrls,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require('express');
const Job = require('../models/Job');
const Database = require('../models/Database');

const router = express.Router();

// Initialize database and model
const db = new Database();
const jobModel = new Job(db);

// Create a new job
router.post('/', async (req, res) => {
  try {
    const job = await jobModel.create(req.body);
    res.status(201).json({
      message: 'Job created successfully',
      job: job
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await jobModel.getAll();
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await jobModel.getById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update job
router.put('/:id', async (req, res) => {
  try {
    const job = await jobModel.update(req.params.id, req.body);
    res.json({
      message: 'Job updated successfully',
      job: job
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete job
router.delete('/:id', async (req, res) => {
  try {
    await jobModel.delete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
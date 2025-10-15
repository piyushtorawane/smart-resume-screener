const express = require('express');
const Match = require('../models/Match');
const Resume = require('../models/Resume');
const Job = require('../models/Job');
const Database = require('../models/Database');
const llmService = require('../services/llmService');

const router = express.Router();

// Initialize database and models
const db = new Database();
const matchModel = new Match(db);
const resumeModel = new Resume(db);
const jobModel = new Job(db);

// Create a match between resume and job
router.post('/', async (req, res) => {
  try {
    const { resume_id, job_id } = req.body;

    // Validate input
    if (!resume_id || !job_id) {
      return res.status(400).json({ error: 'resume_id and job_id are required' });
    }

    // Get resume and job data
    const resume = await resumeModel.getById(resume_id);
    const job = await jobModel.getById(job_id);

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Calculate match score using LLM
    const matchResult = await llmService.calculateMatchScore(
      resume.parsed_data, 
      job.description
    );

    // Save match to database
    const matchData = {
      resume_id: resume_id,
      job_id: job_id,
      match_score: matchResult.score,
      justification: matchResult.justification
    };

    const savedMatch = await matchModel.create(matchData);

    res.status(201).json({
      message: 'Match created successfully',
      match: savedMatch
    });
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all matches
router.get('/', async (req, res) => {
  try {
    const matches = await matchModel.getAll();
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get matches by job ID
router.get('/job/:jobId', async (req, res) => {
  try {
    const matches = await matchModel.getByJobId(req.params.jobId);
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get matches by resume ID
router.get('/resume/:resumeId', async (req, res) => {
  try {
    const matches = await matchModel.getByResumeId(req.params.resumeId);
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get match by ID
router.get('/:id', async (req, res) => {
  try {
    const match = await matchModel.getById(req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    res.json(match);
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update match
router.put('/:id', async (req, res) => {
  try {
    const match = await matchModel.update(req.params.id, req.body);
    res.json({
      message: 'Match updated successfully',
      match: match
    });
  } catch (error) {
    console.error('Error updating match:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete match
router.delete('/:id', async (req, res) => {
  try {
    await matchModel.delete(req.params.id);
    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    console.error('Error deleting match:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
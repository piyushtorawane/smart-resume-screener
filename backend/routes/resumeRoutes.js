const express = require('express');
const multer = require('multer');
const path = require('path');
const Resume = require('../models/Resume');
const Database = require('../models/Database');
const resumeParser = require('../services/resumeParser');

const router = express.Router();

// Initialize database and model
const db = new Database();
const resumeModel = new Resume(db);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/resumes'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept only PDF and text files
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'text/plain' || 
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and text files are allowed'));
    }
  }
});

// Upload and parse resume
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse the resume based on file type
    let parsedData;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    
    if (fileExtension === '.pdf') {
      parsedData = await resumeParser.parsePDF(req.file.path);
    } else {
      // For text files, read the content
      const fs = require('fs');
      const text = fs.readFileSync(req.file.path, 'utf8');
      parsedData = resumeParser.parseText(text);
    }

    // Save resume data to database
    const resumeData = {
      filename: req.file.originalname,
      filepath: req.file.path,
      name: parsedData.name,
      email: parsedData.email,
      phone: parsedData.phone,
      skills: parsedData.skills,
      experience: parsedData.experience,
      education: parsedData.education,
      parsed_data: parsedData
    };

    const savedResume = await resumeModel.create(resumeData);

    res.status(201).json({
      message: 'Resume uploaded and parsed successfully',
      resume: savedResume
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all resumes
router.get('/', async (req, res) => {
  try {
    const resumes = await resumeModel.getAll();
    res.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get resume by ID
router.get('/:id', async (req, res) => {
  try {
    const resume = await resumeModel.getById(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update resume
router.put('/:id', async (req, res) => {
  try {
    const resume = await resumeModel.update(req.params.id, req.body);
    res.json({
      message: 'Resume updated successfully',
      resume: resume
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete resume
router.delete('/:id', async (req, res) => {
  try {
    await resumeModel.delete(req.params.id);
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
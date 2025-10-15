# How to Run the Smart Resume Screener

This guide will help you run the Smart Resume Screener application with the simulated LLM.

## Prerequisites

- Node.js (version 12 or higher)
- npm (comes with Node.js)

## Setup Instructions

1. **Install dependencies**:
   Open a terminal in the project directory and run:
   ```bash
   npm install
   ```

2. **Start the backend server**:
   ```bash
   npm start
   ```
   The server will start on http://localhost:3000

3. **Open the application**:
   Open `smart_resume_screener.html` in your web browser

## Using the Application

1. **Upload a resume**:
   - Click "Choose File" to select a resume (PDF or TXT format)
   - Or paste resume text directly into the text area

2. **Enter a job description**:
   - Type or paste a job description in the provided text area

3. **Analyze the match**:
   - Click the "Analyze Match" button
   - View the match score, justification, and matching skills

## API Endpoints (for advanced users)

- `POST /api/resumes/upload` - Upload and parse a resume
- `POST /api/jobs` - Create a new job description
- `POST /api/match` - Create a match between resume and job
- `GET /api/matches/job/:jobId` - Get matches for a specific job
- `GET /api/health` - Health check endpoint

## Sample Files

- `sample_resume.txt` - A sample resume for testing
- `test_resume.txt` - Another sample resume for testing

## Troubleshooting

1. **Server won't start**:
   - Make sure no other application is using port 3000
   - Check that Node.js is properly installed

2. **File upload not working**:
   - Ensure the file is in PDF or TXT format
   - Check that the file is not corrupted

3. **Match analysis seems inaccurate**:
   - The application is currently using a simulated LLM
   - For more accurate results, you can connect a real LLM (see README_CLEAN.md)

## Stopping the Server

To stop the server, press `Ctrl + C` in the terminal where it's running.
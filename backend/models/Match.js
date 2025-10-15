class Match {
  constructor(db) {
    this.db = db;
  }

  // Create a new match
  async create(matchData) {
    const query = `
      INSERT INTO matches (resume_id, job_id, match_score, justification) 
      VALUES (?, ?, ?, ?)
    `;
    
    const params = [
      matchData.resume_id,
      matchData.job_id,
      matchData.match_score,
      matchData.justification
    ];

    try {
      const result = await this.db.run(query, params);
      return { id: result.lastID, ...matchData };
    } catch (error) {
      throw new Error(`Error creating match: ${error.message}`);
    }
  }

  // Get match by ID
  async getById(id) {
    const query = 'SELECT * FROM matches WHERE id = ?';
    try {
      return await this.db.get(query, [id]);
    } catch (error) {
      throw new Error(`Error fetching match: ${error.message}`);
    }
  }

  // Get matches by resume ID
  async getByResumeId(resumeId) {
    const query = 'SELECT * FROM matches WHERE resume_id = ? ORDER BY created_at DESC';
    try {
      return await this.db.all(query, [resumeId]);
    } catch (error) {
      throw new Error(`Error fetching matches for resume: ${error.message}`);
    }
  }

  // Get matches by job ID
  async getByJobId(jobId) {
    const query = `
      SELECT m.*, r.filename as resume_filename, r.name as candidate_name
      FROM matches m
      JOIN resumes r ON m.resume_id = r.id
      WHERE m.job_id = ?
      ORDER BY m.match_score DESC
    `;
    try {
      return await this.db.all(query, [jobId]);
    } catch (error) {
      throw new Error(`Error fetching matches for job: ${error.message}`);
    }
  }

  // Get all matches
  async getAll() {
    const query = `
      SELECT m.*, r.filename as resume_filename, r.name as candidate_name, j.title as job_title
      FROM matches m
      JOIN resumes r ON m.resume_id = r.id
      JOIN jobs j ON m.job_id = j.id
      ORDER BY m.created_at DESC
    `;
    try {
      return await this.db.all(query);
    } catch (error) {
      throw new Error(`Error fetching matches: ${error.message}`);
    }
  }

  // Update match
  async update(id, matchData) {
    const query = `
      UPDATE matches SET 
        match_score = ?, justification = ?
      WHERE id = ?
    `;
    
    const params = [
      matchData.match_score,
      matchData.justification,
      id
    ];

    try {
      await this.db.run(query, params);
      return await this.getById(id);
    } catch (error) {
      throw new Error(`Error updating match: ${error.message}`);
    }
  }

  // Delete match
  async delete(id) {
    const query = 'DELETE FROM matches WHERE id = ?';
    try {
      await this.db.run(query, [id]);
      return { message: 'Match deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting match: ${error.message}`);
    }
  }
}

module.exports = Match;
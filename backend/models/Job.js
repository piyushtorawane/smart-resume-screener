class Job {
  constructor(db) {
    this.db = db;
  }

  // Create a new job
  async create(jobData) {
    const query = `
      INSERT INTO jobs (title, description, requirements) 
      VALUES (?, ?, ?)
    `;
    
    const params = [
      jobData.title,
      jobData.description,
      jobData.requirements ? JSON.stringify(jobData.requirements) : null
    ];

    try {
      const result = await this.db.run(query, params);
      return { id: result.lastID, ...jobData };
    } catch (error) {
      throw new Error(`Error creating job: ${error.message}`);
    }
  }

  // Get job by ID
  async getById(id) {
    const query = 'SELECT * FROM jobs WHERE id = ?';
    try {
      const job = await this.db.get(query, [id]);
      if (job && job.requirements) {
        job.requirements = JSON.parse(job.requirements);
      }
      return job;
    } catch (error) {
      throw new Error(`Error fetching job: ${error.message}`);
    }
  }

  // Get all jobs
  async getAll() {
    const query = 'SELECT * FROM jobs ORDER BY created_at DESC';
    try {
      const jobs = await this.db.all(query);
      return jobs.map(job => {
        if (job.requirements) {
          job.requirements = JSON.parse(job.requirements);
        }
        return job;
      });
    } catch (error) {
      throw new Error(`Error fetching jobs: ${error.message}`);
    }
  }

  // Update job
  async update(id, jobData) {
    const query = `
      UPDATE jobs SET 
        title = ?, description = ?, requirements = ?
      WHERE id = ?
    `;
    
    const params = [
      jobData.title,
      jobData.description,
      jobData.requirements ? JSON.stringify(jobData.requirements) : null,
      id
    ];

    try {
      await this.db.run(query, params);
      return await this.getById(id);
    } catch (error) {
      throw new Error(`Error updating job: ${error.message}`);
    }
  }

  // Delete job
  async delete(id) {
    const query = 'DELETE FROM jobs WHERE id = ?';
    try {
      await this.db.run(query, [id]);
      return { message: 'Job deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting job: ${error.message}`);
    }
  }
}

module.exports = Job;
class Resume {
  constructor(db) {
    this.db = db;
  }

  // Create a new resume
  async create(resumeData) {
    const query = `
      INSERT INTO resumes (
        filename, filepath, name, email, phone, skills, experience, education, parsed_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      resumeData.filename,
      resumeData.filepath,
      resumeData.name || null,
      resumeData.email || null,
      resumeData.phone || null,
      resumeData.skills ? JSON.stringify(resumeData.skills) : null,
      resumeData.experience || null,
      resumeData.education || null,
      resumeData.parsed_data ? JSON.stringify(resumeData.parsed_data) : null
    ];

    try {
      const result = await this.db.run(query, params);
      return { id: result.lastID, ...resumeData };
    } catch (error) {
      throw new Error(`Error creating resume: ${error.message}`);
    }
  }

  // Get resume by ID
  async getById(id) {
    const query = 'SELECT * FROM resumes WHERE id = ?';
    try {
      const resume = await this.db.get(query, [id]);
      if (resume && resume.skills) {
        resume.skills = JSON.parse(resume.skills);
      }
      if (resume && resume.parsed_data) {
        resume.parsed_data = JSON.parse(resume.parsed_data);
      }
      return resume;
    } catch (error) {
      throw new Error(`Error fetching resume: ${error.message}`);
    }
  }

  // Get all resumes
  async getAll() {
    const query = 'SELECT * FROM resumes ORDER BY created_at DESC';
    try {
      const resumes = await this.db.all(query);
      return resumes.map(resume => {
        if (resume.skills) {
          resume.skills = JSON.parse(resume.skills);
        }
        if (resume.parsed_data) {
          resume.parsed_data = JSON.parse(resume.parsed_data);
        }
        return resume;
      });
    } catch (error) {
      throw new Error(`Error fetching resumes: ${error.message}`);
    }
  }

  // Update resume
  async update(id, resumeData) {
    const query = `
      UPDATE resumes SET 
        name = ?, email = ?, phone = ?, skills = ?, experience = ?, education = ?, parsed_data = ?
      WHERE id = ?
    `;
    
    const params = [
      resumeData.name || null,
      resumeData.email || null,
      resumeData.phone || null,
      resumeData.skills ? JSON.stringify(resumeData.skills) : null,
      resumeData.experience || null,
      resumeData.education || null,
      resumeData.parsed_data ? JSON.stringify(resumeData.parsed_data) : null,
      id
    ];

    try {
      await this.db.run(query, params);
      return await this.getById(id);
    } catch (error) {
      throw new Error(`Error updating resume: ${error.message}`);
    }
  }

  // Delete resume
  async delete(id) {
    const query = 'DELETE FROM resumes WHERE id = ?';
    try {
      await this.db.run(query, [id]);
      return { message: 'Resume deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting resume: ${error.message}`);
    }
  }
}

module.exports = Resume;
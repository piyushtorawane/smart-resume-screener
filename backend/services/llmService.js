const fs = require('fs');

class LLMService {
  constructor() {
    // In a real implementation, you would initialize your LLM client here
    this.simulateRealLLM = process.env.USE_REAL_LLM === 'true';
    
    // Check if we're using a real LLM
    if (this.simulateRealLLM && !process.env.OPENAI_API_KEY) {
      console.warn('USE_REAL_LLM is true but OPENAI_API_KEY is not set. Falling back to simulation.');
      this.simulateRealLLM = false;
    }
  }

  /**
   * Calculate match score between resume and job description using LLM
   * @param {Object} resumeData - Parsed resume data
   * @param {string} jobDescription - Job description text
   * @returns {Object} Match result with score and justification
   */
  async calculateMatchScore(resumeData, jobDescription) {
    if (this.simulateRealLLM) {
      return await this.callRealLLM(resumeData, jobDescription);
    } else {
      return this.simulateLLMResponse(resumeData, jobDescription);
    }
  }

  /**
   * Simulate LLM response for demonstration purposes
   * @param {Object} resumeData - Parsed resume data
   * @param {string} jobDescription - Job description text
   * @returns {Object} Simulated match result
   */
  simulateLLMResponse(resumeData, jobDescription) {
    // Extract skills from both resume and job description
    const resumeSkills = resumeData.skills || [];
    const jobSkills = this.extractSkillsFromDescription(jobDescription);
    
    // Calculate match percentage based on skills overlap
    const matchingSkills = resumeSkills.filter(skill => 
      jobSkills.some(jobSkill => 
        jobSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(jobSkill.toLowerCase())
      )
    );
    
    const matchPercentage = Math.min(100, Math.round((matchingSkills.length / jobSkills.length) * 100));
    const scaledScore = Math.round(matchPercentage / 10); // Scale to 1-10
    
    // Generate justification based on match
    let justification;
    if (scaledScore >= 8) {
      justification = `Excellent match! The candidate has ${matchingSkills.length} out of ${jobSkills.length} key skills required. Strong alignment with job requirements.`;
    } else if (scaledScore >= 5) {
      justification = `Good match with ${matchingSkills.length} out of ${jobSkills.length} key skills. The candidate meets many requirements but may need to develop some areas.`;
    } else {
      justification = `Limited match with only ${matchingSkills.length} out of ${jobSkills.length} key skills. Significant gaps between candidate qualifications and job requirements.`;
    }
    
    return {
      score: Math.max(1, scaledScore),
      justification: justification,
      matchingSkills: matchingSkills
    };
  }

  /**
   * Call real LLM API for match analysis
   * @param {Object} resumeData - Parsed resume data
   * @param {string} jobDescription - Job description text
   * @returns {Object} Real LLM match result
   */
  async callRealLLM(resumeData, jobDescription) {
    try {
      // In a real implementation, you would call an actual LLM API
      // Here's an example using OpenAI:
      
      const { OpenAI } = require('openai');
      
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      
      const prompt = `
        Analyze the match between this candidate's resume and the job description.
        
        Candidate Resume:
        Skills: ${resumeData.skills ? resumeData.skills.join(', ') : 'Not specified'}
        Experience: ${resumeData.experience || 'Not specified'}
        Education: ${resumeData.education || 'Not specified'}
        
        Job Description:
        ${jobDescription}
        
        Please provide:
        1. A match score from 1-10 (where 10 is a perfect match)
        2. A brief justification explaining the score (2-3 sentences)
        3. A list of matching skills
        
        Respond in JSON format:
        {
          "score": number,
          "justification": string,
          "matchingSkills": string[]
        }
      `;
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });
      
      const result = JSON.parse(response.choices[0].message.content);
      return {
        score: Math.max(1, Math.min(10, result.score)),
        justification: result.justification,
        matchingSkills: result.matchingSkills
      };
      
    } catch (error) {
      console.error('Error calling real LLM:', error);
      // Fallback to simulation if real LLM fails
      return this.simulateLLMResponse(resumeData, jobDescription);
    }
  }

  /**
   * Extract skills from job description
   * @param {string} description - Job description text
   * @returns {Array} Array of skills found in description
   */
  extractSkillsFromDescription(description) {
    // Simple skill extraction - in reality, you'd use NLP or another LLM for this
    const commonTechSkills = [
      'javascript', 'react', 'node.js', 'python', 'java', 'sql', 'html', 'css',
      'typescript', 'angular', 'vue.js', 'mongodb', 'postgresql', 'docker',
      'kubernetes', 'aws', 'azure', 'git', 'restful apis', 'graphql'
    ];
    
    const skillsFound = commonTechSkills.filter(skill => 
      description.toLowerCase().includes(skill.toLowerCase())
    );
    
    return skillsFound.length > 0 ? skillsFound : ['javascript', 'communication', 'problem solving'];
  }

  /**
   * Parse resume using LLM (placeholder for future enhancement)
   * @param {string} resumeText - Raw resume text
   * @returns {Object} Parsed resume data
   */
  async parseResumeWithLLM(resumeText) {
    // This would be implemented to use an LLM for better resume parsing
    // For now, we're using the regex-based parser in resumeService.js
    throw new Error('LLM-based resume parsing not implemented yet');
  }
}

module.exports = new LLMService();
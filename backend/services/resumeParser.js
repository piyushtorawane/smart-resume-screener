const pdf = require('pdf-parse');
const fs = require('fs');

class ResumeParser {
  // Parse PDF resume
  async parsePDF(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);
      
      // Extract text content
      const text = pdfData.text;
      
      // Extract basic information using regex patterns
      const extractedData = this.extractInfo(text);
      
      return {
        text: text,
        ...extractedData
      };
    } catch (error) {
      throw new Error(`Error parsing PDF: ${error.message}`);
    }
  }

  // Parse text resume
  parseText(text) {
    try {
      // Extract basic information using regex patterns
      const extractedData = this.extractInfo(text);
      
      return {
        text: text,
        ...extractedData
      };
    } catch (error) {
      throw new Error(`Error parsing text: ${error.message}`);
    }
  }

  // Extract information from resume text
  extractInfo(text) {
    // Normalize text for easier parsing
    const normalizedText = text.replace(/\s+/g, ' ').trim();
    
    // Extract name (assumes it's at the beginning of the resume)
    const nameMatch = normalizedText.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/);
    const name = nameMatch ? nameMatch[1] : null;
    
    // Extract email
    const emailMatch = normalizedText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    const email = emailMatch ? emailMatch[0] : null;
    
    // Extract phone number
    const phoneMatch = normalizedText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const phone = phoneMatch ? phoneMatch[0] : null;
    
    // Extract skills section (simplified approach)
    const skillsSection = this.extractSection(normalizedText, 'skills', ['experience', 'education', 'contact']);
    const skills = skillsSection ? this.extractSkills(skillsSection) : [];
    
    // Extract experience section
    const experienceSection = this.extractSection(normalizedText, 'experience', ['education', 'skills', 'contact']);
    
    // Extract education section
    const educationSection = this.extractSection(normalizedText, 'education', ['experience', 'skills', 'contact']);
    
    return {
      name: name,
      email: email,
      phone: phone,
      skills: skills,
      experience: experienceSection,
      education: educationSection
    };
  }

  // Extract a section from the resume text
  extractSection(text, sectionName, stopWords) {
    // Create regex pattern for the section
    const sectionPattern = new RegExp(`${sectionName}[:\\s]*([\\s\\S]*?)(?=${stopWords.join('|')}|$)`, 'i');
    const match = text.match(sectionPattern);
    
    return match ? match[1].trim() : null;
  }

  // Extract skills from skills section
  extractSkills(skillsText) {
    // Common skills keywords (this is a simplified list)
    const skillKeywords = [
      'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'swift', 'kotlin',
      'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
      'sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'firebase',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git',
      'machine learning', 'data science', 'ai', 'tensorflow', 'pytorch',
      'ui/ux', 'design', 'photoshop', 'illustrator', 'figma',
      'project management', 'agile', 'scrum', 'leadership', 'communication'
    ];
    
    const skills = [];
    const lowerText = skillsText.toLowerCase();
    
    skillKeywords.forEach(skill => {
      if (lowerText.includes(skill)) {
        skills.push(skill);
      }
    });
    
    return [...new Set(skills)]; // Remove duplicates
  }
}

module.exports = new ResumeParser();
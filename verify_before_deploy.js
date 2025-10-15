const fs = require('fs');
const path = require('path');

console.log('=== Smart Resume Screener - Pre-Deployment Verification ===\n');

// Check if required files exist
const requiredFiles = [
  'smart_resume_screener.html',
  'README.md',
  'database.sqlite',
  '.git'
];

const requiredBackendFiles = [
  'backend/server.js',
  'backend/package.json'
];

const optionalFiles = [
  'sample_resume.txt',
  'test_resume.txt'
];

console.log('Checking required files...');
let allRequiredFilesPresent = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - FOUND`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allRequiredFilesPresent = false;
  }
});

console.log('\nChecking required backend files...');
requiredBackendFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - FOUND`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allRequiredFilesPresent = false;
  }
});

console.log('\nChecking optional files...');
optionalFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - FOUND`);
  } else {
    console.log(`⚠️  ${file} - NOT FOUND (optional)`);
  }
});

console.log('\nChecking backend structure...');
const backendDirs = ['models', 'routes', 'services'];
let backendStructureOK = true;

backendDirs.forEach(dir => {
  const dirPath = path.join(__dirname, 'backend', dir);
  if (fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()) {
    console.log(`✅ backend/${dir} - FOUND`);
  } else {
    console.log(`❌ backend/${dir} - MISSING`);
    backendStructureOK = false;
  }
});

console.log('\nChecking git repository...');
const gitPath = path.join(__dirname, '.git');
if (fs.existsSync(gitPath)) {
  console.log('✅ Git repository - INITIALIZED');
} else {
  console.log('❌ Git repository - NOT INITIALIZED');
}

console.log('\n=== Verification Summary ===');
if (allRequiredFilesPresent && backendStructureOK) {
  console.log('✅ ALL CHECKS PASSED - Ready for deployment!');
  console.log('\nNext steps:');
  console.log('1. Create a repository on GitHub named "smart-resume-screener"');
  console.log('2. Run deploy_to_github.bat or follow manual deployment instructions');
  console.log('3. Visit your repository at https://github.com/piyushtorawane/smart-resume-screener');
} else {
  console.log('❌ SOME CHECKS FAILED - Please review the issues above');
}

console.log('\n=== End Verification ===');
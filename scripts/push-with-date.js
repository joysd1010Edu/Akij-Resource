// Node.js script for git operations with specific date/time
// April 14, 2026 at 4:28 AM

const { execSync } = require('child_process');
const path = require('path');

const commitDate = '2026-04-14T04:28:00';
const commitMessage = process.argv[2] || 'Docker setup: Backend ready for Docker implementation';

try {
  console.log('📝 Creating commit with date:', commitDate);
  
  // Execute git commit with specific date
  execSync(`git commit --allow-empty -m "${commitMessage}" --date="${commitDate}"`, {
    cwd: __dirname,
    stdio: 'inherit'
  });

  console.log('✓ Commit created successfully');
  
  // Push to remote
  console.log('🚀 Pushing to remote repository...');
  execSync('git push origin main', {
    cwd: __dirname,
    stdio: 'inherit'
  });

  console.log('✓ Changes pushed successfully');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

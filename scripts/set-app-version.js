const fs = require('fs');
const path = require('path');

/**
 * Manually set app version in environment.properties
 * Usage: node scripts/set-app-version.js [version]
 * Example: node scripts/set-app-version.js 26.3.0
 */

const version = process.argv[2];

if (!version) {
  console.error('❌ Error: Version is required');
  console.log('\nUsage: node scripts/set-app-version.js [version]');
  console.log('Example: node scripts/set-app-version.js 26.3.0');
  process.exit(1);
}

// Path to environment.properties
const envFilePath = path.join(__dirname, '..', 'allure-results', 'environment.properties');

// Check if file exists
if (!fs.existsSync(envFilePath)) {
  console.error(`❌ Error: ${envFilePath} not found`);
  console.log('\nPlease run the tests first to generate the environment file:');
  console.log('  npm run test:chromium');
  process.exit(1);
}

// Read the file
let content = fs.readFileSync(envFilePath, 'utf8');

// Update App.Version line
if (content.includes('App.Version=')) {
  content = content.replace(/App\.Version=.*/g, `App.Version=${version}`);
} else {
  // Add App.Version if it doesn't exist
  const lines = content.split('\n');
  // Add after Environment line
  const envIndex = lines.findIndex(line => line.startsWith('Environment='));
  if (envIndex !== -1) {
    lines.splice(envIndex + 1, 0, `App.Version=${version}`);
    content = lines.join('\n');
  }
}

// Write back
fs.writeFileSync(envFilePath, content);

console.log(`✅ App version updated to: ${version}`);
console.log(`📁 File: ${envFilePath}`);
console.log('\nTo see the changes in Allure report:');
console.log('  npm run allure:generate');
console.log('  npm run allure:open');

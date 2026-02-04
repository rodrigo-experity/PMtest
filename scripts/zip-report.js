const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Script to create a ZIP file of the Allure report for email sharing
 */

const REPORT_DIR = 'allure-report';
const ZIP_NAME = `allure-report-${new Date().toISOString().split('T')[0]}.zip`;

console.log('\n📦 Creating ZIP file of Allure report...\n');

// Check if report exists
if (!fs.existsSync(REPORT_DIR)) {
  console.error(`❌ Error: ${REPORT_DIR} directory not found!`);
  console.error('Please run "npm run allure:generate:history" first.\n');
  process.exit(1);
}

try {
  // Create ZIP using PowerShell (works on Windows)
  console.log(`Creating ${ZIP_NAME}...`);

  const command = `powershell Compress-Archive -Path ${REPORT_DIR}/* -DestinationPath ${ZIP_NAME} -Force`;
  execSync(command, { stdio: 'inherit' });

  console.log(`\n✅ Report zipped successfully!`);
  console.log(`📄 File: ${ZIP_NAME}`);
  console.log(`📊 Size: ${(fs.statSync(ZIP_NAME).size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`\n📧 You can now attach this file to your email.\n`);

  // Open the folder in explorer
  execSync(`explorer /select,"${path.resolve(ZIP_NAME)}"`);

} catch (error) {
  console.error('\n❌ Error creating ZIP:', error.message);
  process.exit(1);
}

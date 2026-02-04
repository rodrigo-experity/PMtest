const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Script to publish Allure report to GitHub Pages
 * This script pushes the allure-report directory to the gh-pages branch
 */

const REPORT_DIR = 'allure-report';
const BRANCH = 'gh-pages';

function execute(command, options = {}) {
  try {
    console.log(`\n> ${command}`);
    const output = execSync(command, {
      encoding: 'utf-8',
      stdio: 'inherit',
      ...options
    });
    return output;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    throw error;
  }
}

function checkReportExists() {
  if (!fs.existsSync(REPORT_DIR)) {
    console.error(`\n❌ Error: ${REPORT_DIR} directory not found!`);
    console.error('Please run "npm run allure:report" first to generate the report.\n');
    process.exit(1);
  }
  console.log('✓ Allure report directory found');
}

function publishReport() {
  console.log('\n📊 Publishing Allure Report to GitHub Pages...\n');

  // Check if report exists
  checkReportExists();

  // Check if we're in a git repository
  try {
    execute('git rev-parse --git-dir', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ Error: Not a git repository');
    process.exit(1);
  }

  // Check if there are uncommitted changes in allure-report
  console.log('\n📋 Checking git status...');

  // Get current branch
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  console.log(`✓ Current branch: ${currentBranch}`);

  // Install gh-pages if not already installed
  console.log('\n📦 Ensuring gh-pages package is available...');
  try {
    require.resolve('gh-pages');
    console.log('✓ gh-pages package found');
  } catch (e) {
    console.log('Installing gh-pages package...');
    execute('npm install --save-dev gh-pages');
  }

  // Use gh-pages package to deploy
  console.log(`\n🚀 Deploying ${REPORT_DIR} to ${BRANCH} branch...`);
  const ghpages = require('gh-pages');

  ghpages.publish(REPORT_DIR, {
    branch: BRANCH,
    message: `Update Allure report - ${new Date().toISOString()}`,
  }, (err) => {
    if (err) {
      console.error('\n❌ Error publishing report:', err);
      process.exit(1);
    }

    console.log('\n✅ Report published successfully!');
    console.log('\n📖 To view your report:');
    console.log('   1. Go to your GitHub repository settings');
    console.log('   2. Navigate to Pages section');
    console.log('   3. Set source to "gh-pages" branch');
    console.log('   4. Your report will be available at: https://rodrigo-experity.github.io/PMtest/\n');
  });
}

// Run the script
publishReport();

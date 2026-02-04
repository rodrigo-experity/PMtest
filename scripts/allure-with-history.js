const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Generate Allure report with history preservation
 * This enables the Trend section in Allure reports
 */

const allureResultsDir = path.join(__dirname, '..', 'allure-results');
const allureReportDir = path.join(__dirname, '..', 'allure-report');
const historyDir = path.join(allureReportDir, 'history');
const targetHistoryDir = path.join(allureResultsDir, 'history');

console.log('📊 Generating Allure Report with History...\n');

try {
  // Step 1: Copy history from previous report to results (if exists)
  if (fs.existsSync(historyDir)) {
    console.log('📋 Step 1: Copying history from previous report...');

    // Create history directory in results if it doesn't exist
    if (!fs.existsSync(targetHistoryDir)) {
      fs.mkdirSync(targetHistoryDir, { recursive: true });
    }

    // Copy all history files
    const historyFiles = fs.readdirSync(historyDir);
    let copiedCount = 0;

    historyFiles.forEach(file => {
      const srcPath = path.join(historyDir, file);
      const destPath = path.join(targetHistoryDir, file);
      fs.copyFileSync(srcPath, destPath);
      copiedCount++;
    });

    console.log(`✅ Copied ${copiedCount} history file(s)`);
  } else {
    console.log('📋 Step 1: No previous history found (this is the first run)');
  }

  // Step 2: Generate report WITHOUT --clean flag to preserve history
  console.log('\n📋 Step 2: Generating Allure report...');

  // Use allure generate without --clean
  execSync('allure generate allure-results -o allure-report', {
    stdio: 'inherit',
    env: process.env
  });

  console.log('\n✅ Report generated with history preserved!');
  console.log('\n📊 Trend data will accumulate with each test run.');
  console.log('   Run tests multiple times to see trends appear.\n');

} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}

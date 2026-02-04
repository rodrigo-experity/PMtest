const fs = require('fs');
const path = require('path');

/**
 * Clean allure-results directory before running tests
 * Preserves the history folder if it exists
 */

const allureResultsDir = path.join(__dirname, '..', 'allure-results');
const historyDir = path.join(allureResultsDir, 'history');

console.log('🧹 Cleaning allure-results directory...\n');

if (fs.existsSync(allureResultsDir)) {
  // Get all files and folders in allure-results
  const items = fs.readdirSync(allureResultsDir);

  let deletedCount = 0;

  items.forEach(item => {
    const itemPath = path.join(allureResultsDir, item);

    // Skip the history folder
    if (item === 'history') {
      console.log('✓ Preserving history folder');
      return;
    }

    // Delete everything else
    if (fs.lstatSync(itemPath).isDirectory()) {
      fs.rmSync(itemPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(itemPath);
    }
    deletedCount++;
  });

  console.log(`✅ Cleaned ${deletedCount} items from allure-results`);
  console.log('✓ Ready for new test run\n');
} else {
  console.log('✓ allure-results directory does not exist yet\n');
}

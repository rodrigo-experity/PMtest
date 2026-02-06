const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Generate executor.json file for Allure report
 * This adds timestamp and execution metadata to the trend section
 */

const allureResultsDir = path.join(__dirname, '..', 'allure-results');

// Ensure allure-results directory exists
if (!fs.existsSync(allureResultsDir)) {
  fs.mkdirSync(allureResultsDir, { recursive: true });
}

// Get current timestamp
const now = new Date();
const timestamp = now.getTime(); // Unix timestamp in milliseconds
const buildOrder = timestamp; // Use timestamp as build order for sorting

// Create executor info
const executorInfo = {
  name: "Local Execution",
  type: "local",
  url: process.env.REPORT_URL || "https://rodrigo-experity.github.io/PMtest/",
  buildOrder: buildOrder,
  buildName: `Build #${now.toISOString().split('T')[0]}_${now.toTimeString().split(' ')[0].replace(/:/g, '-')}`,
  buildUrl: process.env.REPORT_URL || "https://rodrigo-experity.github.io/PMtest/",
  reportName: "Test Report",
  reportUrl: process.env.REPORT_URL || "https://rodrigo-experity.github.io/PMtest/"
};

// Write executor.json
const executorPath = path.join(allureResultsDir, 'executor.json');
fs.writeFileSync(executorPath, JSON.stringify(executorInfo, null, 2));

console.log('✅ Executor info generated');
console.log(`   Build Order: ${buildOrder}`);
console.log(`   Build Name: ${executorInfo.buildName}`);
console.log(`   Timestamp: ${now.toISOString()}`);

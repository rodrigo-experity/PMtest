const fs = require('fs');
const path = require('path');
const { getAppVersion } = require('./get-app-version');

/**
 * Generate environment.properties file for Allure report
 * Usage: node scripts/generate-allure-environment.js [environment]
 * Example: node scripts/generate-allure-environment.js production
 */

async function generateEnvironment() {
  // Get environment from command line argument or use default
  const environment = process.argv[2] || process.env.TEST_ENV || 'Development';

  // Map environment names (case-insensitive)
  const envMap = {
    'dev': 'Development',
    'development': 'Development',
    'staging': 'Staging',
    'stage': 'Staging',
    'prod': 'Production',
    'production': 'Production',
  };

  const normalizedEnv = envMap[environment.toLowerCase()] || environment;

  // Get current date
  const currentDate = new Date().toISOString().split('T')[0];

  console.log('🔍 Extracting app version from login page footer...');

  // Get app version from the application
  let appVersion = 'Unknown';
  let serverName = 'Unknown';
  let baseUrl = process.env.BASE_URL || 'https://devpvpm.practicevelocity.com';

  try {
    const { version, server, url } = await getAppVersion();
    appVersion = version;
    serverName = server;
    baseUrl = url.split('/').slice(0, 3).join('/'); // Get base URL
    console.log(`✅ App Version: ${appVersion}`);
    console.log(`✅ Server: ${serverName}`);
  } catch (error) {
    console.warn(`⚠️  Could not extract app version: ${error.message}`);
    console.log('📝 Using "Unknown" as app version');
  }

  // Environment properties
  const properties = {
    'Environment': normalizedEnv,
    'App.Version': appVersion,
    'Server': serverName,
    'Browser': process.env.BROWSER || 'Chromium',
    'Base.URL': baseUrl,
    'Node.Version': process.version,
    'Playwright.Version': '1.58.0',
    'OS': process.platform,
    'Test.Execution.Date': currentDate,
  };

  // Create properties content
  const content = Object.entries(properties)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  // Ensure allure-results directory exists
  const allureResultsDir = path.join(__dirname, '..', 'allure-results');
  if (!fs.existsSync(allureResultsDir)) {
    fs.mkdirSync(allureResultsDir, { recursive: true });
  }

  // Write environment.properties file
  const filePath = path.join(allureResultsDir, 'environment.properties');
  fs.writeFileSync(filePath, content + '\n');

  console.log(`\n✅ Environment file generated: ${filePath}`);
  console.log(`📊 Environment: ${normalizedEnv}`);
  console.log('\nProperties:');
  Object.entries(properties).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });
}

// Run the async function
generateEnvironment().catch(error => {
  console.error('❌ Error generating environment:', error.message);
  process.exit(1);
});

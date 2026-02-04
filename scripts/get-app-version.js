const { chromium } = require('@playwright/test');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

/**
 * Extract app version from the login page footer
 * The version is in: <footer class="login-form__footer">Version: 26.3.9488.204</footer>
 * Returns: { version: string, url: string, server: string }
 */
async function getAppVersion() {
  const baseURL = process.env.APP_URL || 'https://devpvpm.practicevelocity.com/26_3/loginpage.aspx';

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  try {
    // Navigate to login page (no need to login, version is on login page!)
    await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Extract version from footer
    const footerSelector = 'footer.login-form__footer';
    const footerText = await page.locator(footerSelector).textContent({ timeout: 5000 });

    // Extract version number using regex
    const versionMatch = footerText.match(/Version[:\s]*([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/i);
    const version = versionMatch ? versionMatch[1] : 'Unknown';

    // Extract server name
    const serverMatch = footerText.match(/Server[:\s]*([A-Z0-9\-]+)/i);
    const server = serverMatch ? serverMatch[1] : 'Unknown';

    const url = page.url();

    await browser.close();
    return { version, server, url };
  } catch (error) {
    console.error('Error extracting app version:', error.message);
    await browser.close();
    return { version: 'Unknown', server: 'Unknown', url: baseURL };
  }
}

// Run if called directly
if (require.main === module) {
  getAppVersion().then(({ version, server, url }) => {
    console.log(`✅ App Version: ${version}`);
    console.log(`🖥️  Server: ${server}`);
    console.log(`🔗 URL: ${url}`);
  }).catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}

module.exports = { getAppVersion };

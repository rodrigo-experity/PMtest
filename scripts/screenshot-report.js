const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

/**
 * Script to take a screenshot of the Allure report
 * Opens the report, waits for it to load, and captures a screenshot
 */

const REPORT_DIR = 'allure-report';
const SCREENSHOTS_DIR = 'report-screenshots';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
const screenshotPath = path.join(SCREENSHOTS_DIR, `allure-report-${timestamp}.png`);

async function takeScreenshot() {
  console.log('\n📸 Taking screenshot of Allure report...\n');

  // Check if report exists
  if (!fs.existsSync(REPORT_DIR)) {
    console.error(`❌ Error: ${REPORT_DIR} directory not found!`);
    console.error('Please run "npm run allure:generate:history" first.\n');
    process.exit(1);
  }

  // Create screenshots directory if it doesn't exist
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const reportPath = path.resolve(REPORT_DIR, 'index.html');
  const reportUrl = `file:///${reportPath.replace(/\\/g, '/')}`;

  console.log(`📄 Opening report: ${reportPath}`);
  console.log(`🌐 URL: ${reportUrl}\n`);

  let browser;
  try {
    // Launch browser
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 }
    });

    // Navigate to report
    await page.goto(reportUrl, { waitUntil: 'load' });

    // Wait for the report to fully load
    console.log('⏳ Waiting for report to load...');

    // Wait for Allure app to initialize
    await page.waitForTimeout(2000);

    // Wait for specific Allure elements to be visible
    try {
      // Wait for the main content area
      await page.waitForSelector('.content', { timeout: 15000 });
      console.log('✓ Content area loaded');

      // Wait for widgets with actual data (statistics, trends, etc.)
      await page.waitForSelector('.statistic__value', { timeout: 15000 });
      console.log('✓ Statistics loaded');

      // Wait for trend chart or other data visualizations
      await page.waitForFunction(() => {
        const charts = document.querySelectorAll('canvas, svg');
        return charts.length > 0;
      }, { timeout: 15000 });
      console.log('✓ Charts rendered');

      // Wait for any loading spinners to disappear
      await page.waitForFunction(() => {
        const spinner = document.querySelector('.spinner, .loading');
        return !spinner || spinner.style.display === 'none';
      }, { timeout: 5000 }).catch(() => {
        console.log('ℹ️  No spinner found (or already gone)');
      });

      // Final wait for all animations and data to settle
      await page.waitForTimeout(3000);
      console.log('✓ All data loaded and rendered');

    } catch (error) {
      console.log('⚠️  Some elements took longer to load:', error.message);
      console.log('⚠️  Proceeding with screenshot anyway...');
      await page.waitForTimeout(5000);
    }

    // Debug: Log what's on the page
    const hasContent = await page.evaluate(() => {
      return {
        hasWidgets: document.querySelectorAll('.widget').length,
        hasStatistics: document.querySelectorAll('.statistic__value').length,
        hasCharts: document.querySelectorAll('canvas, svg').length,
        bodyText: document.body.innerText.substring(0, 200)
      };
    });
    console.log('📊 Page content:', hasContent);

    // Take full page screenshot
    console.log('📸 Capturing screenshot...');
    await page.screenshot({
      path: screenshotPath,
      fullPage: false // Capture visible viewport
    });

    await browser.close();

    console.log(`\n✅ Screenshot saved successfully!`);
    console.log(`📄 File: ${screenshotPath}`);
    console.log(`📊 Size: ${(fs.statSync(screenshotPath).size / 1024).toFixed(2)} KB`);

    // Open the screenshots folder
    console.log('\n📂 Opening screenshots folder...\n');
    const screenshotsPath = path.resolve(SCREENSHOTS_DIR);
    execSync(`explorer /select,"${screenshotsPath}\\${path.basename(screenshotPath)}"`);

    console.log('✉️  You can now attach this screenshot to your email!\n');

  } catch (error) {
    console.error('\n❌ Error taking screenshot:', error.message);
    if (browser) await browser.close();
    process.exit(1);
  }
}

takeScreenshot();

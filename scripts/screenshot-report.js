const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const http = require('http');
const { createReadStream } = require('fs');

/**
 * Script to take a screenshot of the Allure report
 * Starts a local HTTP server, opens the report, waits for it to load, and captures a screenshot
 */

const REPORT_DIR = 'allure-report';
const SCREENSHOTS_DIR = 'report-screenshots';
const PORT = 8765;
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
const screenshotPath = path.join(SCREENSHOTS_DIR, `allure-report-${timestamp}.png`);

// Simple HTTP server to serve static files
function createServer(rootDir) {
  return http.createServer((req, res) => {
    let filePath = path.join(rootDir, req.url === '/' ? 'index.html' : req.url);

    // Security: prevent directory traversal
    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    const ext = path.extname(filePath);
    const contentTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404);
          res.end('Not found');
        } else {
          res.writeHead(500);
          res.end('Server error: ' + err.code);
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
}

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

  // Start HTTP server
  const reportPath = path.resolve(REPORT_DIR);
  const server = createServer(reportPath);

  await new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`🌐 Started local server at http://localhost:${PORT}`);
      resolve();
    });
  });

  const reportUrl = `http://localhost:${PORT}`;
  console.log(`📄 Report URL: ${reportUrl}\n`);

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
    server.close();

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
    server.close();
    process.exit(1);
  }
}

takeScreenshot();

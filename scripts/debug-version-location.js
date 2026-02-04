const { chromium } = require('@playwright/test');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

/**
 * Debug script to find where the version is displayed on the page
 * This will help us identify the correct selectors
 */
async function debugVersionLocation() {
  const baseURL = process.env.APP_URL || 'https://devpvpm.practicevelocity.com/26_3/loginpage.aspx';
  const loginUsername = process.env.LOGIN_USERNAME || '';
  const loginPassword = process.env.LOGIN_PASSWORD || '';

  console.log('🔍 Starting version location debug...\n');
  console.log(`📍 Base URL: ${baseURL}`);
  console.log(`👤 Username: ${loginUsername}\n`);

  const browser = await chromium.launch({ headless: false }); // Run in headed mode to see
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  try {
    // Login
    console.log('📋 Step 1: Logging in...');
    await page.goto(baseURL, { timeout: 60000 });
    await page.waitForSelector('#txtUserName', { timeout: 10000 });
    await page.fill('#txtUserName', loginUsername);
    await page.click('#btnNext');
    await page.waitForSelector('#txtPassword', { timeout: 10000 });
    await page.fill('#txtPassword', loginPassword);
    await page.click('#btnLogin');
    console.log('✅ Login submitted');

    // Wait for homepage
    console.log('\n📋 Step 2: Waiting for homepage to load...');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await page.waitForTimeout(3000);
    console.log('✅ Homepage loaded');

    const currentUrl = page.url();
    console.log(`🔗 Current URL: ${currentUrl}\n`);

    // Take screenshot
    await page.screenshot({ path: 'debug-homepage.png', fullPage: true });
    console.log('📸 Screenshot saved: debug-homepage.png\n');

    // Search for "Version" text in the entire page
    console.log('🔍 Searching for "Version" text in page...\n');

    const bodyText = await page.textContent('body');
    const versionMatches = bodyText.match(/Version[:\s]+([0-9._]+)/gi);

    if (versionMatches) {
      console.log('✅ Found version patterns:');
      versionMatches.forEach((match, i) => {
        console.log(`   ${i + 1}. "${match}"`);
      });
      console.log('');
    } else {
      console.log('❌ No "Version:" pattern found in page text\n');
    }

    // Check footer elements
    console.log('🔍 Checking footer elements...\n');
    const footerSelectors = [
      'footer',
      '.footer',
      '#footer',
      '[class*="footer"]',
      '[id*="footer"]',
    ];

    for (const selector of footerSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`✅ Found element: ${selector} (${count} element(s))`);
        for (let i = 0; i < count; i++) {
          const text = await page.locator(selector).nth(i).textContent({ timeout: 2000 }).catch(() => '');
          if (text) {
            console.log(`   Text: "${text.substring(0, 200)}..."`);
          }
        }
        console.log('');
      }
    }

    // Check version-specific elements
    console.log('🔍 Checking version-specific elements...\n');
    const versionSelectors = [
      '[class*="version"]',
      '[id*="version"]',
      '.app-version',
      '#app-version',
      '.version-number',
      '#version-number',
      'span:has-text("Version")',
      'div:has-text("Version")',
    ];

    for (const selector of versionSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`✅ Found element: ${selector} (${count} element(s))`);
        for (let i = 0; i < Math.min(count, 3); i++) {
          const text = await page.locator(selector).nth(i).textContent({ timeout: 2000 }).catch(() => '');
          if (text) {
            console.log(`   [${i}] Text: "${text}"`);
          }
        }
        console.log('');
      }
    }

    // Get all elements containing "Version"
    console.log('🔍 Finding all elements containing "Version" text...\n');
    const elementsWithVersion = await page.locator('text=/Version/i').all();
    console.log(`Found ${elementsWithVersion.length} elements containing "Version"\n`);

    for (let i = 0; i < Math.min(elementsWithVersion.length, 5); i++) {
      const el = elementsWithVersion[i];
      const text = await el.textContent().catch(() => '');
      const tagName = await el.evaluate(node => node.tagName).catch(() => '');
      const className = await el.getAttribute('class').catch(() => '');
      const id = await el.getAttribute('id').catch(() => '');

      console.log(`Element ${i + 1}:`);
      console.log(`   Tag: ${tagName}`);
      if (id) console.log(`   ID: ${id}`);
      if (className) console.log(`   Class: ${className}`);
      console.log(`   Text: "${text}"`);
      console.log('');
    }

    // Save page HTML for inspection
    const html = await page.content();
    fs.writeFileSync('debug-homepage.html', html);
    console.log('📄 Page HTML saved: debug-homepage.html\n');

    console.log('⏸️  Pausing for 5 seconds to inspect...\n');
    await page.waitForTimeout(5000);

    console.log('✅ Debug complete!');
    console.log('\nPlease check:');
    console.log('  - debug-homepage.png (screenshot)');
    console.log('  - debug-homepage.html (page source)');
    console.log('\nLook for the version number in these files and share the selector/location.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: 'debug-error.png', fullPage: true });
    console.log('📸 Error screenshot saved: debug-error.png');
  } finally {
    await browser.close();
  }
}

debugVersionLocation().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

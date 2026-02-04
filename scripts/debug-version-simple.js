const { chromium } = require('@playwright/test');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

/**
 * Simplified debug script - uses existing test infrastructure
 */
async function debugVersion() {
  const { config } = require('../config.ts');

  console.log('🔍 Debugging version location using existing config...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000
  });

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  try {
    // Use the same login flow as tests
    console.log('📋 Navigating to login page...');
    await page.goto(config.appUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    console.log('📋 Waiting for page to be ready...');
    await page.waitForTimeout(3000);

    // Take screenshot of login page
    await page.screenshot({ path: 'debug-1-login.png' });
    console.log('📸 Screenshot 1: debug-1-login.png');

    // Try to login
    console.log('\n📋 Attempting login...');
    await page.waitForSelector('#txtUserName', { timeout: 10000 });
    await page.fill('#txtUserName', config.loginUsername);
    await page.click('#btnNext');

    await page.waitForSelector('#txtPassword', { timeout: 10000 });
    await page.fill('#txtPassword', config.loginPassword);

    await page.screenshot({ path: 'debug-2-password.png' });
    console.log('📸 Screenshot 2: debug-2-password.png');

    await page.click('#btnLogin');
    console.log('✅ Login submitted');

    // Wait for navigation
    console.log('\n📋 Waiting for homepage...');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await page.waitForTimeout(3000);

    const url = page.url();
    console.log(`✅ Current URL: ${url}`);

    await page.screenshot({ path: 'debug-3-homepage.png', fullPage: true });
    console.log('📸 Screenshot 3: debug-3-homepage.png (full page)\n');

    // Now search for version
    console.log('🔍 Searching for version in page...\n');

    // Get all text content
    const bodyText = await page.textContent('body');

    // Search for version pattern
    const versionRegex = /Version[:\s]*([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/gi;
    const matches = bodyText.match(versionRegex);

    if (matches) {
      console.log('✅ Found version patterns:');
      matches.forEach((match, i) => {
        console.log(`   ${i + 1}. ${match}`);
        const versionNumber = match.match(/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
        if (versionNumber) {
          console.log(`      → Version Number: ${versionNumber[1]}`);
        }
      });
    }

    // Try to find the exact element
    console.log('\n🔍 Looking for elements containing "Version:"...\n');

    const versionElements = await page.locator(':text("Version")').all();
    console.log(`Found ${versionElements.length} elements with "Version" text`);

    for (let i = 0; i < Math.min(versionElements.length, 5); i++) {
      const el = versionElements[i];
      const text = await el.textContent().catch(() => '');
      const html = await el.evaluate(node => node.outerHTML).catch(() => '');

      console.log(`\nElement ${i + 1}:`);
      console.log(`   Text: ${text}`);
      console.log(`   HTML: ${html.substring(0, 200)}`);
    }

    // Check common footer locations
    console.log('\n🔍 Checking footer area...\n');
    const footerText = await page.locator('footer, .footer, #footer').first().textContent().catch(() => '');
    if (footerText) {
      console.log(`Footer text: ${footerText.substring(0, 300)}`);
    }

    // Save HTML
    const html = await page.content();
    fs.writeFileSync('debug-homepage-source.html', html);
    console.log('\n📄 HTML saved to: debug-homepage-source.html');

    console.log('\n⏸️  Browser will stay open for 10 seconds for manual inspection...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await page.screenshot({ path: 'debug-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\n✅ Debug complete!');
  }
}

debugVersion().catch(console.error);

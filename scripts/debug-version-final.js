const { chromium } = require('@playwright/test');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables directly
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

async function debugVersion() {
  const appUrl = process.env.APP_URL || 'https://devpvpm.practicevelocity.com/26_3/loginpage.aspx';
  const loginUsername = process.env.LOGIN_USERNAME;
  const loginPassword = process.env.LOGIN_PASSWORD;

  console.log('🔍 Version Debug Script\n');
  console.log(`URL: ${appUrl}`);
  console.log(`User: ${loginUsername}\n`);

  const browser = await chromium.launch({
    headless: false,  // Show browser
    slowMo: 500       // Slow down for visibility
  });

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  try {
    console.log('📋 Step 1: Loading login page...');
    await page.goto(appUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'debug-1-login.png' });

    console.log('📋 Step 2: Logging in...');
    await page.fill('#txtUserName', loginUsername);
    await page.click('#btnNext');
    await page.waitForTimeout(1000);

    await page.fill('#txtPassword', loginPassword);
    await page.screenshot({ path: 'debug-2-before-login.png' });
    await page.click('#btnLogin');

    console.log('📋 Step 3: Waiting for homepage...');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await page.waitForTimeout(3000);

    console.log(`✅ Loaded: ${page.url()}\n`);
    await page.screenshot({ path: 'debug-3-homepage.png', fullPage: true });

    // Search for version
    console.log('🔍 Searching for version...\n');

    const bodyText = await page.textContent('body');

    // Look for version pattern
    const versionPattern = /Version[:\s]*([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/gi;
    let match;
    const versions = [];

    while ((match = versionPattern.exec(bodyText)) !== null) {
      versions.push({
        full: match[0],
        number: match[1]
      });
    }

    if (versions.length > 0) {
      console.log('✅ Found versions:');
      versions.forEach((v, i) => {
        console.log(`   ${i + 1}. Full text: "${v.full}"`);
        console.log(`      Version: ${v.number}`);
      });
    } else {
      console.log('❌ No version found with pattern "Version: X.X.X.X"');
    }

    // Find the element
    console.log('\n🔍 Finding version element...\n');

    try {
      // Try to find any text containing "Version:"
      const versionLocator = page.locator('text=/Version/i');
      const count = await versionLocator.count();
      console.log(`Found ${count} elements with "Version"`);

      if (count > 0) {
        for (let i = 0; i < Math.min(count, 3); i++) {
          const el = versionLocator.nth(i);
          const text = await el.textContent();
          const boundingBox = await el.boundingBox().catch(() => null);

          console.log(`\nElement ${i + 1}:`);
          console.log(`   Text: "${text}"`);
          if (boundingBox) {
            console.log(`   Position: x=${boundingBox.x}, y=${boundingBox.y}`);
          }

          // Get parent HTML
          const parent = el.locator('..');
          const parentHtml = await parent.evaluate(node => node.outerHTML).catch(() => '');
          console.log(`   Parent HTML: ${parentHtml.substring(0, 150)}...`);
        }
      }
    } catch (e) {
      console.error('Error finding elements:', e.message);
    }

    // Save HTML for manual inspection
    const html = await page.content();
    const htmlPath = path.join(__dirname, '..', 'debug-page.html');
    fs.writeFileSync(htmlPath, html);
    console.log(`\n📄 Page HTML saved: ${htmlPath}`);

    console.log('\n⏸️  Browser will remain open for 10 seconds...');
    console.log('   Please look at the footer and tell me where you see the version!');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await page.screenshot({ path: 'debug-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\n✅ Done! Check the screenshots and HTML file.');
  }
}

debugVersion();

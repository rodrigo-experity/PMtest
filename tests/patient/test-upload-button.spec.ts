import { test } from '@playwright/test';
import { LoginPage, DashboardPage, BulkScanningPage } from '../../pages';
import { config } from '../../config';
import path from 'path';

test('Test Upload Button Click', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const bulkScanningPage = new BulkScanningPage(page);

  // Login
  await loginPage.goto();
  await loginPage.login(config.loginUsername, config.loginPassword);
  await dashboardPage.logoutButton.waitFor({ state: 'visible' });

  // Navigate
  await bulkScanningPage.navigateToBulkScanning();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  const iframe = page.frameLocator('#content');

  console.log('Looking for Upload button...');
  const uploadButton = iframe.locator('button:has-text("Upload")').first();
  const buttonVisible = await uploadButton.isVisible().catch(() => false);
  console.log(`Upload button visible: ${buttonVisible}`);

  if (buttonVisible) {
    console.log('Clicking Upload button...');
    await uploadButton.click();
    await page.waitForTimeout(2000);

    // Now check for file input again
    console.log('Looking for file input after clicking Upload...');
    const fileInput = iframe.locator('input[type="file"]');
    const inputCount = await fileInput.count();
    console.log(`File inputs found: ${inputCount}`);

    if (inputCount > 0) {
      console.log('✅ File input appeared after clicking Upload!');

      // Try to upload
      const testFile = path.join(process.cwd(), 'fixtures', 'documents', 'test-document.pdf');
      console.log(`Uploading: ${testFile}`);

      await fileInput.first().setInputFiles(testFile);
      await page.waitForTimeout(2000);

      console.log('✅ Upload attempted!');
    }

    // Check for dialog or modal
    const dialog = iframe.locator('[role="dialog"], .modal, .dialog').first();
    const dialogCount = await dialog.count();
    if (dialogCount > 0) {
      console.log('📦 Dialog/Modal appeared');
      const dialogVisible = await dialog.isVisible().catch(() => false);
      console.log(`  Visible: ${dialogVisible}`);

      // Look for file input in dialog
      const dialogFileInput = dialog.locator('input[type="file"]');
      const dialogInputCount = await dialogFileInput.count();
      console.log(`  File inputs in dialog: ${dialogInputCount}`);
    }
  }

  await page.pause();
});

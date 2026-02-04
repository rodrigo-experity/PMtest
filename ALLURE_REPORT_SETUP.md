# Allure Report Setup and Usage Guide

## Overview
Allure reporting has been successfully integrated with Playwright tests. Allure provides beautiful, detailed test reports with comprehensive test analytics, history, and visualizations.

## Installation Status
✅ **Completed:**
- `allure-playwright` - Installed (v3.4.5)
- `allure-commandline` - Installed (v2.36.0)
- Playwright configuration updated
- NPM scripts added
- .gitignore updated

## Configuration

### playwright.config.ts
The configuration now includes both HTML and Allure reporters:
```typescript
reporter: [
  ['html'],
  ['allure-playwright', {
    outputFolder: 'allure-results',
    detail: true,
    suiteTitle: true,
  }]
],
```

### NPM Scripts
The following scripts have been added to `package.json`:

```json
{
  "test": "npx playwright test",
  "test:rcm": "npx playwright test tests/e2e/rcm-dashboard-e2e.spec.ts",
  "test:patient": "npx playwright test tests/e2e/patient-registration-e2e.spec.ts",
  "test:headed": "npx playwright test --headed",
  "test:ui": "npx playwright test --ui",
  "allure:generate": "allure generate allure-results --clean -o allure-report",
  "allure:open": "allure open allure-report",
  "allure:serve": "allure serve allure-results",
  "test:allure": "npm run test && npm run allure:generate && npm run allure:open"
}
```

## Requirements

### Java Installation (Required for Allure Report Generation)
Allure requires Java to generate HTML reports.

**Check if Java is installed:**
```bash
java -version
```

**If Java is not installed, you have two options:**

#### Option 1: Install Java (Recommended)
1. Download and install Java JDK from:
   - [Oracle JDK](https://www.oracle.com/java/technologies/downloads/)
   - [OpenJDK](https://adoptium.net/)

2. After installation, verify:
   ```bash
   java -version
   ```

#### Option 2: Use Allure Docker (Alternative)
If you don't want to install Java, you can use Allure Docker:
```bash
docker run -p 5050:5050 -e CHECK_RESULTS_EVERY_SECONDS=3 -v ${PWD}/allure-results:/app/allure-results frankescobar/allure-docker-service
```
Then open: http://localhost:5050

## Usage

### 1. Run Tests and Generate Allure Results
Every time you run Playwright tests, Allure results are automatically generated in the `allure-results/` folder.

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:rcm

# Run patient registration tests
npm run test:patient
```

### 2. Generate HTML Report (Requires Java)
After running tests, generate the HTML report:
```bash
npm run allure:generate
```

This creates a static HTML report in the `allure-report/` folder.

### 3. View the Report
Open the generated report in your browser:
```bash
npm run allure:open
```

### 4. Quick View (Starts Local Server - Requires Java)
Generate and serve the report in one command:
```bash
npm run allure:serve
```

This command:
- Processes the results
- Starts a local web server
- Opens the report in your browser automatically

### 5. All-in-One Command (Requires Java)
Run tests and immediately view the report:
```bash
npm run test:allure
```

This command:
1. Runs all Playwright tests
2. Generates Allure HTML report
3. Opens the report in your browser

## Allure Report Features

### What's Included in Allure Reports:

1. **Overview Dashboard**
   - Total tests executed
   - Pass/Fail statistics
   - Test duration
   - Success rate trends

2. **Test Suites**
   - Organized by test files
   - Test hierarchy visualization
   - Individual test results

3. **Test Details**
   - Test steps with timing
   - Console logs
   - Network requests (if captured)
   - Screenshots (attached by tests)
   - Error messages and stack traces

4. **Graphs & Charts**
   - Test execution timeline
   - Test duration trends
   - Failed tests distribution
   - Browser distribution

5. **History**
   - Test execution history across runs
   - Trend analysis
   - Flaky test detection

6. **Categories**
   - Failed tests grouped by error type
   - Product defects vs Test defects

## Allure Results Location

- **Raw Results:** `allure-results/` (JSON files)
- **HTML Report:** `allure-report/` (static HTML site)
- Both folders are automatically ignored by Git (added to .gitignore)

## Test Execution Status

✅ Tests have been executed successfully with Allure reporting:
- **6 tests passed** (RCM Dashboard tests across 3 browsers)
- **Execution time:** ~1.1 minutes
- **Allure results generated:** ✓

## Viewing Raw Results Without Java

If Java is not available, you can still view the raw JSON results:

```bash
# View all generated result files
ls -la allure-results/

# Read a specific test result
cat allure-results/*.result.json | jq '.'
```

The raw JSON files contain all test information:
- Test name
- Status (passed/failed)
- Start/stop times
- Steps
- Attachments (console logs, screenshots)

## CI/CD Integration

### GitHub Actions Example:
```yaml
- name: Run Playwright tests
  run: npm test

- name: Generate Allure Report
  if: always()
  run: npm run allure:generate

- name: Upload Allure Report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: allure-report
    path: allure-report
```

### Jenkins Example:
```groovy
stage('Test') {
  steps {
    sh 'npm test'
  }
}
stage('Allure Report') {
  steps {
    allure([
      includeProperties: false,
      jdk: '',
      results: [[path: 'allure-results']]
    ])
  }
}
```

## Troubleshooting

### Issue: "JAVA_HOME is not set"
**Solution:** Install Java (see Requirements section above)

### Issue: "allure-results folder is empty"
**Solution:** Run tests first:
```bash
npm test
```

### Issue: Report shows old data
**Solution:** Clean results and regenerate:
```bash
rm -rf allure-results allure-report
npm test
npm run allure:generate
npm run allure:open
```

### Issue: Port already in use (allure:serve)
**Solution:** Kill the existing process or use a different port:
```bash
allure serve allure-results -p 5051
```

## Current Test Coverage

### RCM Dashboard E2E Tests
✅ **2 Test Scenarios (Run across 3 browsers = 6 tests total)**

#### Test 1: Permission Validation
- **Scenario 1:** Practice WITHOUT RCM Permissions (TEST2) - Dashboard HIDDEN
- **Scenario 2:** Practice WITH RCM Permissions (LOWUC) - Dashboard VISIBLE
- **Scenario 3:** RCM Dashboard iframe validation - Tableau dashboard loads correctly

#### Test 2: Error Handling
- Validates error message when RCM token endpoint fails
- Blocks `/RcmDashboard/getrcmtoken` endpoint
- Validates error element structure and ARIA attributes
- Confirms error message: "The dashboard could not be loaded at this time. Please try again later."

### Browsers Tested
- ✅ Chromium
- ✅ Firefox
- ✅ WebKit (Safari)

## Benefits of Allure Reports

1. **Professional Presentation** - Share reports with stakeholders
2. **Detailed Analytics** - Understand test execution patterns
3. **Historical Trends** - Track test stability over time
4. **Failure Analysis** - Quickly identify and categorize failures
5. **Visual Documentation** - Screenshots and logs integrated
6. **Cross-Browser Insights** - Compare test results across browsers

## Next Steps

1. **Install Java** (if not already installed) to enable full report generation
2. **Run tests** to generate fresh Allure results
3. **Generate and view reports** using the NPM scripts
4. **Integrate with CI/CD** for automated report generation

## Additional Resources

- [Allure Documentation](https://docs.qameta.io/allure/)
- [Allure Playwright Integration](https://www.npmjs.com/package/allure-playwright)
- [Playwright Test Reporters](https://playwright.dev/docs/test-reporters)

---

**Status:** ✅ Allure reporting is configured and ready to use
**Last Updated:** 2026-02-04

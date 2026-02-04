# Publishing Allure Reports to GitHub Pages

This guide explains how to run your Playwright tests locally and publish the Allure reports to GitHub Pages so your team can view them.

## Why This Approach?

Since your application is only accessible via VPN, tests can't run on GitHub Actions cloud runners. Instead, you run tests locally (with VPN access) and publish the generated reports to GitHub Pages for team visibility.

## Prerequisites

- VPN connection to access the application
- Node.js and npm installed
- Git configured with GitHub access
- Allure report already generated locally

## Workflow

### Step 1: Run Tests Locally

Run your tests with your preferred environment:

```bash
# Development environment
npm run test:dev

# Staging environment
npm run test:staging

# Production environment
npm run test:prod

# Or run specific tests
npm run test:chromium
npm run allure:generate:history
```

After tests complete, the Allure report will be generated in the `allure-report/` directory.

### Step 2: Publish Report to GitHub Pages

Once your report is generated, publish it with a single command:

```bash
npm run allure:publish
```

This script will:
- Check that the `allure-report` directory exists
- Install the `gh-pages` package if needed
- Push the report to the `gh-pages` branch
- Provide instructions for enabling GitHub Pages

### Step 3: Enable GitHub Pages (First Time Only)

After your first publish, you need to enable GitHub Pages:

1. Go to your repository: https://github.com/rodrigo-experity/PMtest
2. Click **Settings**
3. Scroll to **Pages** section
4. Under **Source**, select branch: `gh-pages`
5. Click **Save**

GitHub will provide you with the URL where your report is published:
- **URL**: https://rodrigo-experity.github.io/PMtest/

### Step 4: Share with Your Team

Share the GitHub Pages URL with your team. They can view the latest test results without needing VPN access or running tests themselves.

## Complete Workflow Example

```bash
# 1. Connect to VPN
# 2. Run tests with report generation
npm run test:dev

# 3. Publish the report
npm run allure:publish

# 4. Share the URL with your team
# https://rodrigo-experity.github.io/PMtest/
```

## Updating Reports

Every time you run tests and publish:
- The report on GitHub Pages will be automatically updated
- Team members just need to refresh the page to see the latest results
- The `gh-pages` branch stores the report history

## Troubleshooting

### Report Not Found Error
If you get "allure-report directory not found":
```bash
# Generate the report first
npm run allure:generate:history
# Then publish
npm run allure:publish
```

### Git Push Fails
If the push fails, ensure:
- You're logged into Git with GitHub credentials
- You have write access to the repository
- Your internet connection is stable

### Report Not Updating
If the report doesn't update on GitHub Pages:
- Wait 1-2 minutes for GitHub to rebuild the site
- Clear your browser cache
- Check the `gh-pages` branch was updated: https://github.com/rodrigo-experity/PMtest/tree/gh-pages

## Tips

- Run tests regularly and publish reports after each run
- Consider publishing after significant test runs (nightly, before releases, etc.)
- The report includes test history if you use `allure:generate:history`
- Screenshots and videos from failures are included in the report

## Script Details

The publish script (`scripts/publish-report.js`) uses the `gh-pages` npm package to:
- Deploy the `allure-report` directory to the `gh-pages` branch
- Add a commit message with timestamp
- Push changes to GitHub automatically

The script is safe to run multiple times and will always update to the latest report.

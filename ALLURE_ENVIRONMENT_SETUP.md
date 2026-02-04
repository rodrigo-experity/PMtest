# Allure Environment Configuration

This guide explains how to display environment information (Development, Staging, Production) in your Allure reports.

## 📊 What You'll See in Allure Report

The environment information appears in the Allure report under the **"Environment"** section, showing:
- Environment (Development/Staging/Production)
- Browser
- Base URL
- Node Version
- Playwright Version
- Operating System
- Test Execution Date

## 🚀 Quick Start - Run Tests with Environment

### Development Environment
```bash
npm run test:dev
```

### Staging Environment
```bash
npm run test:staging
```

### Production Environment
```bash
npm run test:prod
```

These commands will:
1. Generate environment.properties file with the correct environment
2. Run Chromium tests
3. Generate and open Allure report with environment info

## 🎯 Available Commands

| Command | Environment | What It Does |
|---------|-------------|--------------|
| `npm run test:dev` | Development | Run tests + Allure report with Dev environment |
| `npm run test:staging` | Staging | Run tests + Allure report with Staging environment |
| `npm run test:prod` | Production | Run tests + Allure report with Production environment |
| `npm run allure:env [env]` | Custom | Generate environment file only |

## 📝 Manual Environment Configuration

### Option 1: Use the Generation Script

Generate environment file before running tests:

```bash
# For Development
node scripts/generate-allure-environment.js development

# For Staging
node scripts/generate-allure-environment.js staging

# For Production
node scripts/generate-allure-environment.js production

# Then run tests
npm run test:chromium:allure
```

### Option 2: Edit environment.properties Directly

Edit the file: `allure-results/environment.properties`

```properties
Environment=Development
Browser=Chromium
Base.URL=https://devpvpm.practicevelocity.com
Node.Version=v24.13.0
Playwright.Version=1.58.0
OS=win32
Test.Execution.Date=2026-02-04
```

Change `Environment=Development` to:
- `Environment=Staging` for staging
- `Environment=Production` for production

Then regenerate the Allure report:
```bash
npm run allure:generate
npm run allure:open
```

## 🔧 Customize Environment Properties

Edit `scripts/generate-allure-environment.js` to add more properties:

```javascript
const properties = {
  'Environment': normalizedEnv,
  'Browser': process.env.BROWSER || 'Chromium',
  'Base.URL': process.env.BASE_URL || 'https://devpvpm.practicevelocity.com',
  'Node.Version': process.version,
  'Playwright.Version': '1.58.0',
  'OS': process.platform,
  'Test.Execution.Date': currentDate,
  // Add your custom properties here:
  'Team': 'QA Team',
  'Release.Version': '1.0.0',
  'Build.Number': process.env.BUILD_NUMBER || 'local',
};
```

## 🌍 Using Environment Variables

You can also set the environment using environment variables:

### Windows (Command Prompt):
```cmd
set TEST_ENV=staging
npm run test:chromium:allure
```

### Windows (PowerShell):
```powershell
$env:TEST_ENV="staging"
npm run test:chromium:allure
```

### Linux/Mac:
```bash
TEST_ENV=staging npm run test:chromium:allure
```

### Set Base URL:
```bash
# Windows
set BASE_URL=https://staging.example.com

# Linux/Mac
BASE_URL=https://staging.example.com npm run test:chromium:allure
```

## 📂 File Structure

```
project/
├── scripts/
│   └── generate-allure-environment.js    # Script to generate environment file
├── allure-results/
│   └── environment.properties            # Generated environment file
└── package.json                          # NPM scripts
```

## 🔍 Where to Find Environment Info in Allure Report

1. **Open Allure Report** (it opens automatically or use `npm run allure:open`)
2. **Click on "Environment" in the left sidebar** or look at the Overview page
3. You'll see a section showing all environment properties

Example display:
```
Environment
├─ Environment: Development
├─ Browser: Chromium
├─ Base.URL: https://devpvpm.practicevelocity.com
├─ Node.Version: v24.13.0
├─ Playwright.Version: 1.58.0
├─ OS: win32
└─ Test.Execution.Date: 2026-02-04
```

## 💡 Best Practices

1. **Always set environment before running tests:**
   ```bash
   npm run test:dev        # For dev environment
   npm run test:staging    # For staging environment
   npm run test:prod       # For production environment
   ```

2. **For CI/CD pipelines:**
   ```bash
   # In your CI/CD script
   node scripts/generate-allure-environment.js $ENVIRONMENT
   npm run test:chromium
   npm run allure:generate
   ```

3. **Update Base URL for different environments:**
   ```javascript
   // Edit generate-allure-environment.js
   const baseUrls = {
     'Development': 'https://dev.example.com',
     'Staging': 'https://staging.example.com',
     'Production': 'https://prod.example.com',
   };

   properties['Base.URL'] = baseUrls[normalizedEnv] || properties['Base.URL'];
   ```

## 🎯 CI/CD Integration Examples

### GitHub Actions
```yaml
- name: Set Environment
  run: node scripts/generate-allure-environment.js ${{ github.event.inputs.environment }}

- name: Run Tests
  run: npm run test:chromium

- name: Generate Allure Report
  run: npm run allure:generate
```

### Jenkins
```groovy
stage('Test') {
  steps {
    sh "node scripts/generate-allure-environment.js ${ENVIRONMENT}"
    sh 'npm run test:chromium'
    sh 'npm run allure:generate'
  }
}
```

## 🔄 Workflow Examples

### Test Different Environments Sequentially
```bash
# Test all environments
npm run test:dev
npm run test:staging
npm run test:prod
```

### Custom Workflow
```bash
# 1. Generate environment
node scripts/generate-allure-environment.js production

# 2. Run specific test
npm run test:rcm

# 3. Generate report
npm run allure:serve
```

## ✅ Verification

After running tests with environment configuration:

1. Check the generated file:
   ```bash
   cat allure-results/environment.properties
   ```

2. Open Allure report and verify environment section shows correct information

3. Screenshot/export report for documentation

## 🐛 Troubleshooting

### Environment not showing in report:
- Make sure `environment.properties` exists in `allure-results/` before generating report
- Regenerate the report: `npm run allure:generate`

### Wrong environment displayed:
- Delete old results: `rm -rf allure-results allure-report`
- Generate fresh environment: `node scripts/generate-allure-environment.js [env]`
- Run tests again

### Environment file not generated:
- Check if `scripts/` directory exists
- Verify `generate-allure-environment.js` is in `scripts/` folder
- Run manually: `node scripts/generate-allure-environment.js development`

## 📝 Summary

**To run tests with specific environment:**
- Development: `npm run test:dev`
- Staging: `npm run test:staging`
- Production: `npm run test:prod`

**The environment info will automatically appear in your Allure report!**

---

**Last Updated:** 2026-02-04

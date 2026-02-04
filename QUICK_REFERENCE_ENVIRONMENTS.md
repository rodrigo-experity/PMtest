# Quick Reference - Environment Configuration for Allure Reports

## 🚀 Three Simple Commands

### Development Environment
```bash
npm run test:dev
```
✅ Sets environment to **Development**
✅ Runs all Chromium tests
✅ Opens Allure report automatically

### Staging Environment
```bash
npm run test:staging
```
✅ Sets environment to **Staging**
✅ Runs all Chromium tests
✅ Opens Allure report automatically

### Production Environment
```bash
npm run test:prod
```
✅ Sets environment to **Production**
✅ Runs all Chromium tests
✅ Opens Allure report automatically

## 📊 What You'll See in Allure Report

When you open the Allure report, you'll see the **Environment** section displaying:

```
╔════════════════════════════════════════════════════╗
║                   ENVIRONMENT                      ║
╠════════════════════════════════════════════════════╣
║ Environment          │ Development                 ║
║ Browser              │ Chromium                    ║
║ Base.URL             │ https://devpvpm...          ║
║ Node.Version         │ v24.13.0                    ║
║ Playwright.Version   │ 1.58.0                      ║
║ OS                   │ win32                       ║
║ Test.Execution.Date  │ 2026-02-04                  ║
╚════════════════════════════════════════════════════╝
```

## 🎯 Where to Find It

1. Open Allure report (opens automatically after running tests)
2. Look at the **Overview** page - Environment section is at the top right
3. Or click **"Environment"** in the left sidebar

## 💡 Pro Tips

### Just Want to Change Environment (Without Running Tests)?
```bash
node scripts/generate-allure-environment.js staging
npm run allure:generate
npm run allure:open
```

### Multiple Environments in One Session?
```bash
# Test dev
npm run test:dev

# Test staging
npm run test:staging

# Test production
npm run test:prod
```

## 🔧 Customize Properties

Edit: `allure-results/environment.properties`

```properties
Environment=Development
Browser=Chromium
Base.URL=https://devpvpm.practicevelocity.com
Node.Version=v24.13.0
Playwright.Version=1.58.0
OS=win32
Test.Execution.Date=2026-02-04

# Add your custom properties:
Team=QA Team
Sprint=Sprint-42
Release.Version=1.0.0
```

Then regenerate:
```bash
npm run allure:generate
npm run allure:open
```

## ✅ Current Setup

✅ Environment script created: `scripts/generate-allure-environment.js`
✅ NPM commands configured
✅ Environment properties generated
✅ Ready to use!

---

**That's it! Use `npm run test:dev`, `npm run test:staging`, or `npm run test:prod` and your environment will be displayed in the Allure report!** 🎉

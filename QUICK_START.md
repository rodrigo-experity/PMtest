# Quick Start - Allure Reports

## 🚀 One Command to Rule Them All

### Development Environment:
```bash
npm run test:dev
```

### Staging Environment:
```bash
npm run test:staging
```

### Production Environment:
```bash
npm run test:prod
```

## ✅ What These Commands Do Automatically:

1. **Extract App Version** from login page footer
   - Version: 26.3.9488.204
   - Server: D5-PM2-22

2. **Set Environment** (Dev/Staging/Prod)

3. **Run All Chromium Tests**

4. **Preserve History** for trends

5. **Generate Allure Report**

6. **Open in Browser**

## 📊 What You'll See:

### Environment Section:
```
Environment:         Development
App.Version:         26.3.9488.204  ← Extracted automatically!
Server:              D5-PM2-22      ← Extracted automatically!
Browser:             Chromium
Base.URL:            https://devpvpm...
Test.Execution.Date: 2026-02-04
```

### Trend Section:
Run tests 2-3 times to see trends appear!

```
Run 1: 74 passed - 4.4 min
Run 2: 74 passed - 4.2 min
Run 3: 72 passed - 4.5 min
```

## 💡 Pro Tips:

- **Run multiple times** to build trends
- **Switch environments** by using different commands
- **History persists** automatically
- **Version updates** automatically each run

## That's It! 🎉

Just run `npm run test:dev` and everything happens automatically!

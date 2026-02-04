# Allure Report Trends - History Tracking

## 📊 What is the Trend Section?

The **Trend** section in Allure reports shows test execution history over multiple runs, including:
- Pass/fail rate over time
- Test duration trends
- Test stability (flaky tests)
- Historical comparison

## 🎯 How to Enable Trends

Trends require **historical data** from multiple test runs. The data accumulates over time.

### ✅ Commands with History Enabled:

```bash
# Development environment with history
npm run test:dev

# Staging environment with history
npm run test:staging

# Production environment with history
npm run test:prod

# Chromium tests with history
npm run test:chromium:history

# All tests with history
npm run test:allure:history
```

## 📈 Building Trend Data

### First Run:
```bash
npm run test:dev
```
- ✅ Tests execute
- ✅ Environment captured (App Version, Server, etc.)
- ✅ Results saved
- ℹ️ Trend section will be empty (no history yet)

### Second Run:
```bash
npm run test:dev
```
- ✅ History from run #1 copied
- ✅ Tests execute
- ✅ New results added
- ✅ Trend section shows 2 data points!

### Third+ Runs:
```bash
npm run test:dev
```
- ✅ Trends continue to grow
- ✅ More data = better insights

## 🔍 What You'll See in Trends

After multiple runs, the Trend section displays:

### 1. **Duration Trend**
```
Chart showing test execution time over runs
↗️ Slower tests trend up
↘️ Faster tests trend down
```

### 2. **Success Rate Trend**
```
Pass/Fail percentage over time
100% = All tests passing
<100% = Some failures
```

### 3. **Retries Trend**
```
Number of test retries over time
Helps identify flaky tests
```

### 4. **Test Execution History**
```
Table showing each test's history:
- When it ran
- Pass/Fail status
- Duration
```

## 🎨 Example Trend Display

After 5 runs, you'll see:

```
╔════════════════════════════════════════╗
║           TREND                        ║
╠════════════════════════════════════════╣
║ Run 1: Feb 4  - 74 passed - 4.4 min   ║
║ Run 2: Feb 4  - 74 passed - 4.2 min   ║
║ Run 3: Feb 4  - 72 passed - 4.5 min   ║
║ Run 4: Feb 5  - 74 passed - 4.1 min   ║
║ Run 5: Feb 5  - 74 passed - 4.3 min   ║
╚════════════════════════════════════════╝

Success Rate: 99.5%
Average Duration: 4.3 minutes
```

## 🔧 How It Works

### History Preservation Process:

1. **After Test Execution:**
   ```
   allure-results/
   ├── test-result-1.json
   ├── test-result-2.json
   └── ...
   ```

2. **Copy Previous History:**
   ```javascript
   // Before generating new report:
   Copy: allure-report/history/ → allure-results/history/
   ```

3. **Generate Report:**
   ```bash
   allure generate allure-results -o allure-report
   # Note: NO --clean flag (preserves history)
   ```

4. **New History Created:**
   ```
   allure-report/history/
   ├── history.json
   ├── duration-trend.json
   ├── retry-trend.json
   └── ...
   ```

## 📝 Commands Reference

| Command | Description |
|---------|-------------|
| `npm run test:dev` | Dev tests + history + environment |
| `npm run test:staging` | Staging tests + history + environment |
| `npm run test:prod` | Production tests + history + environment |
| `npm run test:chromium:history` | Chromium tests + history |
| `npm run test:allure:history` | All tests + history |
| `npm run allure:generate:history` | Generate report with history only |

## 🗑️ Clearing History

To start fresh (reset trends):

```bash
# Remove all history
rm -rf allure-report/history
rm -rf allure-results/history

# Or on Windows
rd /s /q allure-report\history
rd /s /q allure-results\history
```

Then run tests again to start building new history.

## 💡 Best Practices

### 1. **Run Tests Regularly**
Run tests multiple times to build meaningful trends:
```bash
# Daily testing
npm run test:dev   # Day 1
npm run test:dev   # Day 2
npm run test:dev   # Day 3
```

### 2. **Don't Clean Too Often**
The `--clean` flag removes history. Use these commands which preserve history:
- ✅ `npm run test:dev`
- ✅ `npm run test:staging`
- ✅ `npm run test:chromium:history`
- ❌ `npm run allure:generate` (uses --clean)

### 3. **CI/CD Integration**
Preserve history across CI builds:

```yaml
# GitHub Actions Example
- name: Download Previous History
  uses: actions/download-artifact@v3
  with:
    name: allure-history
    path: allure-results/history

- name: Run Tests
  run: npm run test:chromium

- name: Generate Report
  run: node scripts/allure-with-history.js

- name: Upload History
  uses: actions/upload-artifact@v3
  with:
    name: allure-history
    path: allure-report/history
```

### 4. **Archive Old History**
For long-term projects, archive history periodically:

```bash
# Archive current history
mkdir history-archives
cp -r allure-report/history history-archives/history-2026-02-04

# Continue with fresh history
rm -rf allure-report/history
```

## 🎯 Quick Start

Want to see trends immediately? Run tests multiple times:

```bash
# Run 1
npm run test:rcm
npm run allure:generate:history
npm run allure:open

# Run 2 (change something or just re-run)
npm run test:rcm
npm run allure:generate:history
npm run allure:open  # You'll see trend start to appear!

# Run 3
npm run test:rcm
npm run allure:generate:history
npm run allure:open  # Trend section now populated!
```

## 📊 What Data is Tracked

### Per Test:
- Test name
- Status (passed/failed/skipped)
- Duration
- Retry count
- Timestamp

### Per Run:
- Total tests
- Pass rate
- Fail rate
- Average duration
- Environment info
- Execution date

## 🔄 Automatic vs Manual

### Automatic (Recommended):
```bash
npm run test:dev
```
- ✅ Automatically preserves history
- ✅ Generates environment
- ✅ Extracts app version
- ✅ Opens report

### Manual:
```bash
# 1. Run tests
npm run test:chromium

# 2. Generate with history
node scripts/allure-with-history.js

# 3. Open report
npm run allure:open
```

## ✅ Verification

Check if history is working:

```bash
# After running tests twice
ls allure-report/history/

# You should see:
# history.json
# duration-trend.json
# retry-trend.json
# history-trend.json
```

## 🎉 Summary

**To enable trends:**
1. Use commands that preserve history: `npm run test:dev`
2. Run tests multiple times
3. History accumulates automatically
4. Trend section populates with data

**Current setup:**
- ✅ History preservation configured
- ✅ All environment commands updated
- ✅ Ready to track trends!

---

**Run tests multiple times using `npm run test:dev` to start seeing trends!**

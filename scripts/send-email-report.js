require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

/**
 * Send email notification with test results summary
 * Reads Allure results and sends email with test summary
 */

async function sendEmailReport() {
  console.log('\n📧 Preparing to send email notification...\n');

  // Email configuration from environment variables
  const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  const recipients = process.env.EMAIL_RECIPIENTS || process.env.EMAIL_USER;
  const reportUrl = process.env.REPORT_URL || 'https://rodrigo-experity.github.io/PMtest/';

  // Validate email configuration
  if (!emailConfig.auth.user || !emailConfig.auth.pass) {
    console.error('❌ Error: Email credentials not configured!');
    console.error('Please set EMAIL_USER and EMAIL_PASSWORD environment variables.');
    console.error('\nExample:');
    console.error('  EMAIL_USER=your-email@gmail.com');
    console.error('  EMAIL_PASSWORD=your-app-password');
    console.error('  EMAIL_RECIPIENTS=recipient1@email.com,recipient2@email.com');
    process.exit(1);
  }

  // Read test results from allure-results
  const allureResultsDir = path.join(__dirname, '..', 'allure-results');

  if (!fs.existsSync(allureResultsDir)) {
    console.error('❌ Error: allure-results directory not found!');
    console.error('Please run tests first to generate results.');
    process.exit(1);
  }

  // Parse test results
  const resultFiles = fs.readdirSync(allureResultsDir)
    .filter(file => file.endsWith('-result.json'));

  let passed = 0;
  let failed = 0;
  let broken = 0;
  let skipped = 0;
  let total = 0;
  const failedTests = [];

  resultFiles.forEach(file => {
    try {
      const content = fs.readFileSync(path.join(allureResultsDir, file), 'utf8');
      const result = JSON.parse(content);
      total++;

      switch (result.status) {
        case 'passed':
          passed++;
          break;
        case 'failed':
          failed++;
          failedTests.push({
            name: result.name,
            fullName: result.fullName || result.name,
            statusDetails: result.statusDetails?.message || 'No details'
          });
          break;
        case 'broken':
          broken++;
          failedTests.push({
            name: result.name,
            fullName: result.fullName || result.name,
            statusDetails: result.statusDetails?.message || 'No details'
          });
          break;
        case 'skipped':
          skipped++;
          break;
      }
    } catch (err) {
      // Ignore parse errors for non-result files
    }
  });

  const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : 0;
  const status = failed > 0 || broken > 0 ? '❌ FAILED' : '✅ PASSED';
  const statusEmoji = failed > 0 || broken > 0 ? '❌' : '✅';

  console.log('📊 Test Results Summary:');
  console.log(`   Total: ${total}`);
  console.log(`   Passed: ${passed}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Broken: ${broken}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Pass Rate: ${passRate}%`);

  // Build failed tests HTML
  let failedTestsHtml = '';
  if (failedTests.length > 0) {
    failedTestsHtml = `
    <h3>Failed Tests:</h3>
    <ul style="color: #d32f2f;">
      ${failedTests.map(test => `
        <li>
          <strong>${test.name}</strong><br/>
          <small style="color: #666;">${test.fullName}</small>
        </li>
      `).join('')}
    </ul>`;
  }

  // Email content
  const subject = `${statusEmoji} Test Report - ${passRate}% Pass Rate (${passed}/${total} passed)`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1976d2; color: white; padding: 20px; text-align: center; border-radius: 5px; }
    .summary { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px; }
    .stat { display: inline-block; margin: 10px 20px; text-align: center; }
    .stat-value { font-size: 32px; font-weight: bold; display: block; }
    .stat-label { font-size: 14px; color: #666; }
    .passed { color: #4caf50; }
    .failed { color: #d32f2f; }
    .button {
      display: inline-block;
      background: #1976d2;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${statusEmoji} Test Execution Report</h1>
      <p>${new Date().toLocaleString()}</p>
    </div>

    <div class="summary">
      <h2>Test Results Summary</h2>
      <div style="text-align: center;">
        <div class="stat">
          <span class="stat-value">${total}</span>
          <span class="stat-label">Total Tests</span>
        </div>
        <div class="stat">
          <span class="stat-value passed">${passed}</span>
          <span class="stat-label">Passed</span>
        </div>
        <div class="stat">
          <span class="stat-value failed">${failed + broken}</span>
          <span class="stat-label">Failed</span>
        </div>
        <div class="stat">
          <span class="stat-value">${skipped}</span>
          <span class="stat-label">Skipped</span>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <h3>Pass Rate: <span class="${passRate >= 90 ? 'passed' : 'failed'}">${passRate}%</span></h3>
      </div>
    </div>

    ${failedTestsHtml}

    <div style="text-align: center;">
      <p>View the complete interactive report:</p>
      <a href="${reportUrl}" class="button">📊 View Full Report</a>
    </div>

    <div class="footer">
      <p>🤖 Generated by Playwright Test Automation</p>
      <p>Allure Report: <a href="${reportUrl}">${reportUrl}</a></p>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
Test Execution Report
${new Date().toLocaleString()}

Status: ${status}

Test Results Summary:
- Total Tests: ${total}
- Passed: ${passed}
- Failed: ${failed}
- Broken: ${broken}
- Skipped: ${skipped}
- Pass Rate: ${passRate}%

${failedTests.length > 0 ? `
Failed Tests:
${failedTests.map(t => `- ${t.name}`).join('\n')}
` : ''}

View Full Report: ${reportUrl}
  `;

  // Create transporter
  const transporter = nodemailer.createTransport(emailConfig);

  // Email options
  const mailOptions = {
    from: `"Test Automation" <${emailConfig.auth.user}>`,
    to: recipients,
    subject: subject,
    text: textContent,
    html: htmlContent,
  };

  // Send email
  try {
    console.log(`\n📤 Sending email to: ${recipients}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📊 Summary: ${passed}/${total} tests passed (${passRate}%)\n`);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    if (error.code === 'EAUTH') {
      console.error('\n⚠️  Authentication failed. If using Gmail:');
      console.error('   1. Enable 2-factor authentication');
      console.error('   2. Generate an App Password');
      console.error('   3. Use the App Password instead of your regular password');
      console.error('   Guide: https://support.google.com/accounts/answer/185833');
    }
    process.exit(1);
  }
}

sendEmailReport();

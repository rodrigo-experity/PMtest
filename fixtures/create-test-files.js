/**
 * Script to create test files for bulk scanning tests
 * Creates: PDF, JPEG, JPG, PNG, GIF, JFIF, TIFF, TIF
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Output directory
const outputDir = path.join(__dirname, 'documents');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Create a test image with text
 */
function createTestImage(text, width = 800, height = 600) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  // Border
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 5;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Text
  ctx.fillStyle = 'black';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(text, width / 2, 100);

  ctx.font = '30px Arial';
  ctx.fillText('Test Document', width / 2, 180);

  ctx.font = '20px Arial';
  ctx.fillText('For Bulk Scanning E2E Tests', width / 2, 240);
  ctx.fillText(`Size: ${width}x${height}`, width / 2, 280);

  // Add some visual elements
  ctx.fillStyle = 'lightblue';
  ctx.fillRect(100, height - 200, width - 200, 100);

  ctx.strokeStyle = 'darkblue';
  ctx.lineWidth = 2;
  ctx.strokeRect(100, height - 200, width - 200, 100);

  ctx.fillStyle = 'darkblue';
  ctx.font = '24px Arial';
  ctx.fillText('Sample Content Area', width / 2, height - 140);

  return canvas;
}

/**
 * Create image file
 */
function createImageFile(filename, format, width = 800, height = 600) {
  const canvas = createTestImage(format.toUpperCase() + ' Test File', width, height);
  const filepath = path.join(outputDir, filename);

  let buffer;
  if (format === 'png') {
    buffer = canvas.toBuffer('image/png');
  } else if (format === 'jpeg' || format === 'jpg' || format === 'jfif') {
    buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  } else {
    buffer = canvas.toBuffer('image/png'); // Default to PNG
  }

  fs.writeFileSync(filepath, buffer);
  const sizeKB = (buffer.length / 1024).toFixed(2);
  console.log(`✓ Created: ${filename} (${sizeKB} KB)`);
}

/**
 * Create a simple PDF-like file
 * Note: This creates a basic structure. For real PDFs, we'd need pdfkit
 */
function createSimplePDF(filename, width = 800, height = 600) {
  const canvas = createTestImage('PDF Test File', width, height);
  const filepath = path.join(outputDir, filename);

  // Save as high-quality JPEG first (fallback)
  const buffer = canvas.toBuffer('image/jpeg', { quality: 1.0 });

  fs.writeFileSync(filepath, buffer);
  const sizeKB = (buffer.length / 1024).toFixed(2);
  console.log(`✓ Created: ${filename} (${sizeKB} KB)`);
}

/**
 * Create large file
 */
function createLargeFile(filename) {
  // Create larger canvas for bigger file size
  const canvas = createTestImage('Large PDF Test File', 2400, 1800);
  const filepath = path.join(outputDir, filename);

  const buffer = canvas.toBuffer('image/jpeg', { quality: 1.0 });

  // If still not large enough, duplicate content
  if (buffer.length < 1050 * 1024) {
    // Create multiple canvases and combine
    const buffers = [];
    for (let i = 0; i < 8; i++) {
      const tempCanvas = createTestImage(`Large File - Page ${i + 1}`, 2400, 1800);
      buffers.push(tempCanvas.toBuffer('image/jpeg', { quality: 1.0 }));
    }
    // Concatenate buffers
    const largeBuffer = Buffer.concat(buffers);
    fs.writeFileSync(filepath, largeBuffer);
    const sizeKB = (largeBuffer.length / 1024).toFixed(2);
    console.log(`✓ Created: ${filename} (${sizeKB} KB)`);
  } else {
    fs.writeFileSync(filepath, buffer);
    const sizeKB = (buffer.length / 1024).toFixed(2);
    console.log(`✓ Created: ${filename} (${sizeKB} KB)`);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Creating test files for bulk scanning tests...\n');

  try {
    // Create standard size files
    console.log('Creating standard test files...');
    createSimplePDF('test-document.pdf');
    createImageFile('test-image.jpg', 'jpeg');
    createImageFile('test-image.jpeg', 'jpeg');
    createImageFile('test-image.png', 'png');
    createImageFile('test-image.jfif', 'jpeg'); // JFIF is JPEG format

    // For GIF, TIFF, TIF - use PNG as base (canvas doesn't support these directly)
    // But save with proper extension
    createImageFile('test-image.gif', 'png');
    createImageFile('test-document.tiff', 'png');
    createImageFile('test-document.tif', 'png');

    // Additional test files
    console.log('\nCreating additional test files...');
    createSimplePDF('document1.pdf');
    createSimplePDF('document2.pdf');
    createSimplePDF('multi-page.pdf', 800, 600);

    // Create large file
    console.log('\nCreating large file (> 1050KB)...');
    createLargeFile('large-document.pdf');

    // Create invalid file
    const invalidPath = path.join(outputDir, 'invalid-file.txt');
    fs.writeFileSync(invalidPath, 'This is a text file, not a valid image or PDF.\nUsed for testing file type validation.\n');
    console.log('✓ Created: invalid-file.txt');

    // List all created files
    console.log('\n' + '='.repeat(60));
    console.log('All test files created successfully!');
    console.log('='.repeat(60));
    console.log('\nFiles created in:', outputDir);
    console.log('\n' + 'Filename'.padEnd(35) + 'Size'.padStart(15));
    console.log('-'.repeat(50));

    const files = fs.readdirSync(outputDir)
      .filter(f => /\.(pdf|jpg|jpeg|png|gif|jfif|tiff|tif|txt)$/i.test(f))
      .sort();

    files.forEach(filename => {
      const filepath = path.join(outputDir, filename);
      const stats = fs.statSync(filepath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(filename.padEnd(35) + (sizeKB + ' KB').padStart(15));
    });

  } catch (error) {
    console.error('Error creating test files:', error.message);
    console.log('\nNote: If canvas module is not installed, run:');
    console.log('npm install canvas');
  }
}

// Run main function
main().catch(console.error);

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create a 2MB (2048KB) PDF file - over the 1050KB limit
function create2MBPDF() {
  const outputPath = path.join(__dirname, 'documents', 'large-file-2mb.pdf');

  const canvas = createCanvas(2000, 2000);
  const ctx = canvas.getContext('2d');

  // Fill with random colored patterns
  for (let i = 0; i < 500; i++) {
    ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    ctx.fillRect(
      Math.random() * 2000,
      Math.random() * 2000,
      Math.random() * 200,
      Math.random() * 200
    );
  }

  // Add text
  ctx.fillStyle = 'black';
  ctx.font = '48px Arial';
  ctx.fillText('Large Test File - 2MB', 100, 100);
  ctx.fillText('File Size Limit Testing', 100, 200);

  const buffer = canvas.toBuffer('image/png');

  // Pad to exactly 2MB
  const targetSize = 2 * 1024 * 1024; // 2MB
  const finalBuffer = Buffer.alloc(targetSize);

  // Copy the image data
  buffer.copy(finalBuffer, 0, 0, Math.min(buffer.length, targetSize));

  // Fill remaining with random data to reach 2MB
  for (let i = buffer.length; i < targetSize; i++) {
    finalBuffer[i] = Math.floor(Math.random() * 256);
  }

  fs.writeFileSync(outputPath, finalBuffer);
  const stats = fs.statSync(outputPath);
  console.log(`✅ Created large-file-2mb.pdf: ${(stats.size / 1024).toFixed(2)} KB (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
}

// Create a JPEG version
function create2MBJPEG() {
  const outputPath = path.join(__dirname, 'documents', 'large-image-2mb.jpg');

  const canvas = createCanvas(2000, 2000);
  const ctx = canvas.getContext('2d');

  // Fill with complex pattern
  for (let i = 0; i < 800; i++) {
    ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    ctx.fillRect(
      Math.random() * 2000,
      Math.random() * 2000,
      Math.random() * 100,
      Math.random() * 100
    );
  }

  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });

  // Pad to 2MB
  const targetSize = 2 * 1024 * 1024;
  const finalBuffer = Buffer.alloc(targetSize);
  buffer.copy(finalBuffer, 0, 0, Math.min(buffer.length, targetSize));

  // Fill rest with data
  for (let i = buffer.length; i < targetSize; i++) {
    finalBuffer[i] = Math.floor(Math.random() * 256);
  }

  fs.writeFileSync(outputPath, finalBuffer);
  const stats = fs.statSync(outputPath);
  console.log(`✅ Created large-image-2mb.jpg: ${(stats.size / 1024).toFixed(2)} KB (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
}

console.log('Creating 2MB files for TC4 testing...\n');
create2MBPDF();
create2MBJPEG();
console.log('\n✅ All 2MB files created successfully!');
console.log('Note: 2MB = 2048KB, which exceeds the 1050KB limit');

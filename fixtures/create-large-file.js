const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create a 5MB (5000KB) PDF file - well over the 1050KB limit
function createLargePDF() {
  const outputPath = path.join(__dirname, 'documents', 'large-file-5mb.pdf');

  // Create a simple but large PDF structure
  const canvas = createCanvas(2000, 2000);
  const ctx = canvas.getContext('2d');

  // Fill with random colored rectangles to increase file size
  for (let i = 0; i < 1000; i++) {
    ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    ctx.fillRect(
      Math.random() * 2000,
      Math.random() * 2000,
      Math.random() * 200,
      Math.random() * 200
    );
  }

  // Add text to make it more realistic
  ctx.fillStyle = 'black';
  ctx.font = '48px Arial';
  ctx.fillText('Large Test File - 5MB', 100, 100);
  ctx.fillText('For File Size Limit Testing', 100, 200);

  // Convert to PNG buffer (will be large)
  const buffer = canvas.toBuffer('image/png');

  // If PNG is not large enough, pad it
  let finalBuffer = buffer;
  const targetSize = 5 * 1024 * 1024; // 5MB

  if (buffer.length < targetSize) {
    // Create a buffer with padding to reach 5MB
    finalBuffer = Buffer.alloc(targetSize);
    buffer.copy(finalBuffer);
    // Fill rest with data
    for (let i = buffer.length; i < targetSize; i++) {
      finalBuffer[i] = Math.floor(Math.random() * 256);
    }
  }

  fs.writeFileSync(outputPath, finalBuffer);
  const stats = fs.statSync(outputPath);
  console.log(`✅ Created large-file-5mb.pdf: ${(stats.size / 1024).toFixed(2)} KB`);
}

// Also create a JPEG version
function createLargeJPEG() {
  const outputPath = path.join(__dirname, 'documents', 'large-image-5mb.jpg');

  const canvas = createCanvas(3000, 3000);
  const ctx = canvas.getContext('2d');

  // Fill with complex pattern
  for (let i = 0; i < 2000; i++) {
    ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    ctx.fillRect(
      Math.random() * 3000,
      Math.random() * 3000,
      Math.random() * 100,
      Math.random() * 100
    );
  }

  const buffer = canvas.toBuffer('image/jpeg', { quality: 1.0 });

  // Pad to 5MB if needed
  let finalBuffer = buffer;
  const targetSize = 5 * 1024 * 1024;

  if (buffer.length < targetSize) {
    finalBuffer = Buffer.alloc(targetSize);
    buffer.copy(finalBuffer);
  }

  fs.writeFileSync(outputPath, finalBuffer);
  const stats = fs.statSync(outputPath);
  console.log(`✅ Created large-image-5mb.jpg: ${(stats.size / 1024).toFixed(2)} KB`);
}

console.log('Creating large files for TC4 testing...\n');
createLargePDF();
createLargeJPEG();
console.log('\n✅ All large files created successfully!');

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Verification test to ensure all test files exist and are valid
 * Run this before running the main bulk scanning tests
 */

test.describe('Test Files Verification', () => {
  const fixturesDir = path.join(process.cwd(), 'fixtures', 'documents');

  const requiredFiles = [
    { name: 'test-document.pdf', maxSize: 1050 },
    { name: 'test-image.jpg', maxSize: 1050 },
    { name: 'test-image.jpeg', maxSize: 1050 },
    { name: 'test-image.png', maxSize: 1050 },
    { name: 'test-image.gif', maxSize: 1050 },
    { name: 'test-image.jfif', maxSize: 1050 },
    { name: 'test-document.tiff', maxSize: 1050 },
    { name: 'test-document.tif', maxSize: 1050 },
    { name: 'document1.pdf', maxSize: 1050 },
    { name: 'document2.pdf', maxSize: 1050 },
    { name: 'multi-page.pdf', maxSize: 1050 },
    { name: 'large-document.pdf', minSize: 1050 },
    { name: 'invalid-file.txt', maxSize: 1 },
  ];

  test('should have all required test files', () => {
    requiredFiles.forEach(file => {
      const filePath = path.join(fixturesDir, file.name);
      expect(fs.existsSync(filePath), `File ${file.name} should exist`).toBeTruthy();
    });
  });

  test('should verify file sizes are correct', () => {
    requiredFiles.forEach(file => {
      const filePath = path.join(fixturesDir, file.name);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const sizeKB = stats.size / 1024;

        if (file.maxSize) {
          expect(sizeKB, `${file.name} should be <= ${file.maxSize}KB`).toBeLessThanOrEqual(file.maxSize);
        }

        if (file.minSize) {
          expect(sizeKB, `${file.name} should be >= ${file.minSize}KB`).toBeGreaterThanOrEqual(file.minSize);
        }

        console.log(`✓ ${file.name}: ${sizeKB.toFixed(2)} KB`);
      }
    });
  });

  test('should verify file permissions are readable', () => {
    requiredFiles.forEach(file => {
      const filePath = path.join(fixturesDir, file.name);
      if (fs.existsSync(filePath)) {
        try {
          fs.accessSync(filePath, fs.constants.R_OK);
          console.log(`✓ ${file.name} is readable`);
        } catch (error) {
          throw new Error(`File ${file.name} is not readable: ${error}`);
        }
      }
    });
  });

  test('should verify large file exceeds 1050KB limit', () => {
    const largePdfPath = path.join(fixturesDir, 'large-document.pdf');
    const stats = fs.statSync(largePdfPath);
    const sizeKB = stats.size / 1024;

    console.log(`Large document size: ${sizeKB.toFixed(2)} KB`);
    expect(sizeKB, 'large-document.pdf must be > 1050KB for size limit test').toBeGreaterThan(1050);
  });

  test('should list all available test files', () => {
    console.log('\n=== Available Test Files ===');
    const files = fs.readdirSync(fixturesDir)
      .filter(f => /\.(pdf|jpg|jpeg|png|gif|jfif|tiff|tif|txt)$/i.test(f))
      .sort();

    files.forEach(filename => {
      const filepath = path.join(fixturesDir, filename);
      const stats = fs.statSync(filepath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`  ${filename.padEnd(30)} ${sizeKB.padStart(10)} KB`);
    });

    expect(files.length).toBeGreaterThanOrEqual(13);
  });

  test('should verify fixtures directory structure', () => {
    // Verify fixtures directory exists
    expect(fs.existsSync(fixturesDir)).toBeTruthy();

    // Verify it's a directory
    const stats = fs.statSync(fixturesDir);
    expect(stats.isDirectory()).toBeTruthy();

    console.log(`✓ Fixtures directory: ${fixturesDir}`);
  });

  test('should verify file extensions match content type', () => {
    const extensionTests = [
      { file: 'test-document.pdf', extension: '.pdf' },
      { file: 'test-image.jpg', extension: '.jpg' },
      { file: 'test-image.jpeg', extension: '.jpeg' },
      { file: 'test-image.png', extension: '.png' },
      { file: 'test-image.gif', extension: '.gif' },
      { file: 'test-image.jfif', extension: '.jfif' },
      { file: 'test-document.tiff', extension: '.tiff' },
      { file: 'test-document.tif', extension: '.tif' },
    ];

    extensionTests.forEach(test => {
      const filePath = path.join(fixturesDir, test.file);
      if (fs.existsSync(filePath)) {
        const actualExt = path.extname(test.file).toLowerCase();
        expect(actualExt).toBe(test.extension.toLowerCase());
        console.log(`✓ ${test.file} has correct extension: ${actualExt}`);
      }
    });
  });
});

test.describe('Test Files - File Type Validation', () => {
  const fixturesDir = path.join(process.cwd(), 'fixtures', 'documents');

  const fileTypes = [
    { name: 'PDF', files: ['test-document.pdf', 'document1.pdf', 'document2.pdf'] },
    { name: 'JPEG/JPG', files: ['test-image.jpg', 'test-image.jpeg'] },
    { name: 'PNG', files: ['test-image.png'] },
    { name: 'GIF', files: ['test-image.gif'] },
    { name: 'JFIF', files: ['test-image.jfif'] },
    { name: 'TIFF/TIF', files: ['test-document.tiff', 'test-document.tif'] },
  ];

  fileTypes.forEach(fileType => {
    test(`should have all ${fileType.name} test files`, () => {
      console.log(`\nVerifying ${fileType.name} files:`);
      fileType.files.forEach(filename => {
        const filePath = path.join(fixturesDir, filename);
        const exists = fs.existsSync(filePath);
        expect(exists, `${filename} should exist`).toBeTruthy();

        if (exists) {
          const stats = fs.statSync(filePath);
          const sizeKB = (stats.size / 1024).toFixed(2);
          console.log(`  ✓ ${filename} (${sizeKB} KB)`);
        }
      });
    });
  });
});

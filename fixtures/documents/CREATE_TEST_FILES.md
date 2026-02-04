# How to Create Test Files for Bulk Scanning Tests

This guide helps you create the necessary test files for the bulk scanning validation tests.

## Required Files

### 1. Standard Size PDF (< 1050KB)
**Filename:** `test-document.pdf`
**Purpose:** Basic upload tests
**Size:** < 1050KB (< 1,075,200 bytes)

**How to create:**
- Use any document and "Print to PDF"
- Download a sample PDF from the internet
- Use online tools like: https://smallpdf.com/compress-pdf

### 2. Image Files - JPG/JPEG
**Filenames:**
- `test-image.jpg`
- `test-image.jpeg`

**How to create:**
- Take a screenshot and save as JPG
- Download any sample image online
- Use Paint to create and save as JPG

**Windows Quick Method:**
```powershell
# Take a screenshot: Win + Shift + S
# Save it to: fixtures/documents/test-image.jpg
```

### 3. PNG Image
**Filename:** `test-image.png`

**How to create:**
- Take a screenshot (Windows: Win + Shift + S)
- Save as PNG format
- Or convert JPG to PNG online

### 4. GIF Image
**Filename:** `test-image.gif`

**How to create:**
- Convert a JPG/PNG to GIF using online tools
- Use GIMP or Paint.NET
- Online: https://convertio.co/jpg-gif/

### 5. JFIF Image
**Filename:** `test-image.jfif`

**How to create:**
- JFIF is a JPEG format variant
- Rename a JPG file to .jfif
- Or use online converter

**Quick method:**
```bash
# Copy JPG and rename
copy test-image.jpg test-image.jfif
```

### 6. TIFF/TIF Files
**Filenames:**
- `test-document.tiff`
- `test-document.tif`

**How to create:**
- Use Paint: Open image → Save As → TIFF
- Convert PDF to TIFF online: https://pdf2tiff.com/
- Convert image to TIFF: https://convertio.co/png-tiff/

### 7. Large File (> 1050KB)
**Filename:** `large-document.pdf`
**Purpose:** Test file size limit validation
**Size:** > 1050KB (> 1,075,200 bytes)

**How to create:**

**Option A - Using existing PDF:**
```bash
# Check if any PDF is large enough
dir *.pdf
# If found, copy it: copy large-file.pdf large-document.pdf
```

**Option B - Combine multiple PDFs:**
- Use online tool: https://www.ilovepdf.com/merge_pdf
- Merge several PDFs until > 1050KB

**Option C - Create programmatically:**
```powershell
# PowerShell - Create a 1.1MB dummy file
fsutil file createnew large-document.pdf 1100000

# Note: This creates a dummy file, not a valid PDF
# For actual testing, use a real PDF > 1050KB
```

**Option D - High-resolution image to PDF:**
- Take a high-resolution screenshot
- Convert to PDF
- Should be > 1050KB

### 8. Multi-page PDF (Optional)
**Filename:** `multi-page.pdf`
**Purpose:** Test page navigation in preview

**How to create:**
- Print multiple pages to PDF
- Use Word document with multiple pages → Save as PDF
- Merge multiple PDFs online

---

## Quick Setup Script

### Windows PowerShell Script

Create a file `setup-test-files.ps1`:

```powershell
# Create test files for bulk scanning tests

$fixturesPath = "fixtures\documents"

# Create directory if it doesn't exist
if (!(Test-Path $fixturesPath)) {
    New-Item -ItemType Directory -Path $fixturesPath -Force
}

Write-Host "Please add the following files to: $fixturesPath"
Write-Host ""
Write-Host "Required files:"
Write-Host "  - test-document.pdf (< 1050KB)"
Write-Host "  - test-image.jpg"
Write-Host "  - test-image.jpeg"
Write-Host "  - test-image.png"
Write-Host "  - test-image.gif"
Write-Host "  - test-image.jfif"
Write-Host "  - test-document.tiff"
Write-Host "  - test-document.tif"
Write-Host "  - large-document.pdf (> 1050KB)"
Write-Host ""
Write-Host "Optional:"
Write-Host "  - multi-page.pdf"
Write-Host ""
Write-Host "Use online tools or the methods in CREATE_TEST_FILES.md"

# Check if any files exist
$files = Get-ChildItem $fixturesPath -Filter "test-*" 2>$null
if ($files) {
    Write-Host ""
    Write-Host "Existing test files found:"
    $files | ForEach-Object {
        $sizeKB = [math]::Round($_.Length / 1KB, 2)
        Write-Host "  - $($_.Name) ($sizeKB KB)"
    }
}
```

Run it:
```powershell
powershell -ExecutionPolicy Bypass -File setup-test-files.ps1
```

---

## Recommended Online Tools

### File Converters
- **Convertio**: https://convertio.co/ (All formats)
- **CloudConvert**: https://cloudconvert.com/ (All formats)

### PDF Tools
- **iLovePDF**: https://www.ilovepdf.com/ (Merge, compress, convert)
- **SmallPDF**: https://smallpdf.com/ (Compress, convert)
- **PDF2TIFF**: https://pdf2tiff.com/

### Image Tools
- **TinyPNG**: https://tinypng.com/ (Compress images)
- **Online Image Editor**: https://www.online-image-editor.com/

### Sample Files
- **Sample PDFs**: https://www.africau.edu/images/default/sample.pdf
- **Sample Images**: https://via.placeholder.com/600x400

---

## Verification Checklist

After creating files, verify:

```bash
# List all files with sizes
dir fixtures\documents

# Check individual file sizes
dir fixtures\documents\test-document.pdf
dir fixtures\documents\large-document.pdf
```

Required:
- [ ] test-document.pdf exists and is < 1050KB
- [ ] test-image.jpg exists
- [ ] test-image.jpeg exists
- [ ] test-image.png exists
- [ ] test-image.gif exists
- [ ] test-image.jfif exists
- [ ] test-document.tiff exists
- [ ] test-document.tif exists
- [ ] large-document.pdf exists and is > 1050KB

---

## File Size Quick Reference

- **1 KB** = 1,024 bytes
- **1050 KB** = 1,075,200 bytes
- **1 MB** = 1,024 KB = 1,048,576 bytes

To check file size:
```powershell
# PowerShell
Get-ChildItem fixtures\documents\large-document.pdf | Select-Object Name, @{Name="SizeKB";Expression={[math]::Round($_.Length/1KB,2)}}
```

---

## Alternative: Using Existing Project Files

If you have existing test files or screenshots in your project:

1. **Find existing PDFs:**
   ```bash
   dir *.pdf /s
   ```

2. **Find existing images:**
   ```bash
   dir *.jpg *.png /s
   ```

3. **Copy and rename:**
   ```bash
   copy path\to\existing-file.pdf fixtures\documents\test-document.pdf
   ```

---

## Troubleshooting

### "File too large" error during test
- Verify file is < 1050KB
- Compress PDF: https://smallpdf.com/compress-pdf
- Reduce image resolution

### "Invalid file format" error
- Verify file extension matches content type
- Try re-saving in the correct format
- Use online converter to ensure valid format

### Test can't find file
- Verify file path is correct
- Check file exists: `Test-Path fixtures\documents\test-document.pdf`
- Verify filename matches exactly (case-sensitive on some systems)

---

## Next Steps

1. Create or download test files
2. Place them in `fixtures/documents/` directory
3. Verify files exist and have correct sizes
4. Run the tests: `npx playwright test tests/patient/bulk-scanning-validation.spec.ts`
5. Check test results

## Need Help?

If you can't create certain file types, you can:
1. Skip those specific tests temporarily
2. Use test.skip() in the test file
3. Comment out file type tests you don't need

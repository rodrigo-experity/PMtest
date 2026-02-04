# Test Documents for Bulk Scanning Tests

This directory contains test documents used in the bulk scanning e2e tests.

## Required Test Files

To run the bulk scanning tests, you'll need to add the following test files to this directory:

1. `test-document.pdf` - A single page PDF document for basic upload tests
2. `document1.pdf` - First PDF for multiple document upload tests
3. `document2.pdf` - Second PDF for multiple document upload tests
4. `multi-page.pdf` - A multi-page PDF document for page navigation tests
5. `invalid-file.txt` - A text file to test file type validation

## Creating Test Files

You can create simple test PDFs using:
- Online PDF generators
- Print to PDF from any document
- Use existing sample documents

## Alternative

If you don't want to create physical files, you can modify the tests to:
1. Mock file uploads
2. Use Playwright's API to create temporary files
3. Skip file-dependent tests and focus on UI interactions

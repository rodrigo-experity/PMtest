#!/usr/bin/env python3
"""
Script to create test files for bulk scanning tests
Creates: PDF, JPEG, JPG, PNG, GIF, JFIF, TIFF, TIF
"""

from PIL import Image, ImageDraw, ImageFont
import io
import os

def create_test_image(text, size=(800, 600), color='white', text_color='black'):
    """Create a simple test image with text"""
    img = Image.new('RGB', size, color=color)
    draw = ImageDraw.Draw(img)

    # Try to use a font, fallback to default if not available
    try:
        font = ImageFont.truetype("arial.ttf", 40)
    except:
        font = ImageFont.load_default()

    # Add text
    text_lines = [
        text,
        "",
        "Test Document",
        "For Bulk Scanning E2E Tests",
        f"Size: {size[0]}x{size[1]}"
    ]

    y_position = 50
    for line in text_lines:
        # Get text size for centering
        bbox = draw.textbbox((0, 0), line, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        x_position = (size[0] - text_width) // 2

        draw.text((x_position, y_position), line, fill=text_color, font=font)
        y_position += text_height + 20

    # Add a simple shape
    draw.rectangle([100, size[1]-200, size[0]-100, size[1]-50], outline='blue', width=3)

    return img

def create_pdf_file(filepath, size=(800, 600)):
    """Create a simple PDF file"""
    img = create_test_image("PDF Test File", size)
    img.save(filepath, "PDF", resolution=100.0)
    print(f"✓ Created: {filepath}")

def create_image_file(filepath, format_name, size=(800, 600)):
    """Create an image file in specified format"""
    img = create_test_image(f"{format_name.upper()} Test File", size)

    # Handle different formats
    if format_name.upper() in ['JPEG', 'JPG', 'JFIF']:
        img = img.convert('RGB')  # JPEG doesn't support transparency
        img.save(filepath, "JPEG", quality=95)
    elif format_name.upper() == 'GIF':
        img = img.convert('P', palette=Image.ADAPTIVE)  # GIF uses palette mode
        img.save(filepath, "GIF")
    elif format_name.upper() in ['TIFF', 'TIF']:
        img.save(filepath, "TIFF")
    elif format_name.upper() == 'PNG':
        img.save(filepath, "PNG")
    else:
        img.save(filepath)

    print(f"✓ Created: {filepath}")

def create_large_pdf(filepath, target_size_kb=1100):
    """Create a large PDF file (> 1050KB)"""
    # Create a higher resolution image
    img = create_test_image("Large PDF Test File", size=(2400, 1800))

    # Save as PDF
    img.save(filepath, "PDF", resolution=100.0)

    # Check size and add more pages if needed
    file_size_kb = os.path.getsize(filepath) / 1024

    if file_size_kb < target_size_kb:
        # Create a multi-page PDF by combining multiple images
        images = []
        for i in range(5):
            page_img = create_test_image(f"Large PDF - Page {i+1}", size=(2400, 1800))
            images.append(page_img.convert('RGB'))

        # Save as multi-page PDF
        images[0].save(filepath, "PDF", resolution=100.0, save_all=True, append_images=images[1:])

    file_size_kb = os.path.getsize(filepath) / 1024
    print(f"✓ Created: {filepath} ({file_size_kb:.2f} KB)")

def main():
    """Create all test files"""
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(script_dir, 'documents')

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    print("Creating test files for bulk scanning tests...\n")

    # Create standard size PDF
    create_pdf_file(os.path.join(output_dir, 'test-document.pdf'), size=(800, 600))

    # Create image files
    create_image_file(os.path.join(output_dir, 'test-image.jpg'), 'JPG')
    create_image_file(os.path.join(output_dir, 'test-image.jpeg'), 'JPEG')
    create_image_file(os.path.join(output_dir, 'test-image.png'), 'PNG')
    create_image_file(os.path.join(output_dir, 'test-image.gif'), 'GIF')
    create_image_file(os.path.join(output_dir, 'test-image.jfif'), 'JFIF')
    create_image_file(os.path.join(output_dir, 'test-document.tiff'), 'TIFF')
    create_image_file(os.path.join(output_dir, 'test-document.tif'), 'TIF')

    # Create additional test files
    create_image_file(os.path.join(output_dir, 'document1.pdf'), 'PDF')
    create_image_file(os.path.join(output_dir, 'document2.pdf'), 'PDF')

    # Create multi-page PDF
    print("\nCreating multi-page PDF...")
    images = []
    for i in range(3):
        page_img = create_test_image(f"Multi-page PDF - Page {i+1}", size=(800, 600))
        images.append(page_img.convert('RGB'))

    multi_page_path = os.path.join(output_dir, 'multi-page.pdf')
    images[0].save(multi_page_path, "PDF", resolution=100.0, save_all=True, append_images=images[1:])
    print(f"✓ Created: {multi_page_path}")

    # Create large PDF (> 1050KB)
    print("\nCreating large PDF (> 1050KB)...")
    create_large_pdf(os.path.join(output_dir, 'large-document.pdf'))

    # Create invalid file for testing
    invalid_file_path = os.path.join(output_dir, 'invalid-file.txt')
    with open(invalid_file_path, 'w') as f:
        f.write("This is a text file, not a valid image or PDF.\n")
        f.write("Used for testing file type validation.\n")
    print(f"✓ Created: {invalid_file_path}")

    print("\n" + "="*60)
    print("All test files created successfully!")
    print("="*60)

    # List all created files with sizes
    print("\nFiles created in:", output_dir)
    print("\n{:<30} {:>15}".format("Filename", "Size"))
    print("-" * 50)

    for filename in sorted(os.listdir(output_dir)):
        if filename.endswith(('.pdf', '.jpg', '.jpeg', '.png', '.gif', '.jfif', '.tiff', '.tif', '.txt')):
            filepath = os.path.join(output_dir, filename)
            size_kb = os.path.getsize(filepath) / 1024
            print("{:<30} {:>12.2f} KB".format(filename, size_kb))

if __name__ == '__main__':
    try:
        from PIL import Image, ImageDraw, ImageFont
        main()
    except ImportError:
        print("Error: Pillow library is required.")
        print("Please install it using: pip install Pillow")
        print("\nOr run: python -m pip install Pillow")

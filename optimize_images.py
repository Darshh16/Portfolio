"""
Image Optimization Script for Portfolio
This script compresses images in the static and media folders to improve website performance.
"""

from PIL import Image
import os
from pathlib import Path

def compress_image(image_path, output_path=None, quality=85, max_width=1920):
    """
    Compress an image file
    
    Args:
        image_path: Path to the input image
        output_path: Path to save compressed image (if None, overwrites original)
        quality: JPEG quality (1-100, default 85)
        max_width: Maximum width in pixels (default 1920)
    """
    try:
        # Open image
        img = Image.open(image_path)
        
        # Convert RGBA to RGB if necessary
        if img.mode == 'RGBA':
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])
            img = background
        
        # Resize if image is too large
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
        
        # Set output path
        if output_path is None:
            output_path = image_path
        
        # Get file extension
        ext = os.path.splitext(image_path)[1].lower()
        
        # Save with optimization
        if ext in ['.jpg', '.jpeg']:
            img.save(output_path, 'JPEG', quality=quality, optimize=True)
        elif ext == '.png':
            img.save(output_path, 'PNG', optimize=True)
        elif ext == '.webp':
            img.save(output_path, 'WEBP', quality=quality)
        else:
            print(f"Skipping unsupported format: {ext}")
            return False
        
        # Get file sizes
        original_size = os.path.getsize(image_path)
        if output_path != image_path:
            new_size = os.path.getsize(output_path)
        else:
            new_size = os.path.getsize(output_path)
        
        reduction = ((original_size - new_size) / original_size) * 100
        print(f"✓ Compressed {os.path.basename(image_path)}: {original_size/1024:.1f}KB → {new_size/1024:.1f}KB ({reduction:.1f}% reduction)")
        return True
        
    except Exception as e:
        print(f"✗ Error compressing {image_path}: {str(e)}")
        return False

def optimize_directory(directory, quality=85, max_width=1920):
    """
    Optimize all images in a directory
    
    Args:
        directory: Path to directory containing images
        quality: JPEG quality (1-100)
        max_width: Maximum width in pixels
    """
    directory = Path(directory)
    
    if not directory.exists():
        print(f"Directory not found: {directory}")
        return
    
    # Supported image extensions
    extensions = ['.jpg', '.jpeg', '.png', '.webp']
    
    print(f"\n🔍 Scanning {directory}...")
    
    # Find all images
    images = []
    for ext in extensions:
        images.extend(directory.rglob(f'*{ext}'))
    
    if not images:
        print("No images found.")
        return
    
    print(f"Found {len(images)} images\n")
    
    # Compress each image
    success_count = 0
    for img_path in images:
        if compress_image(str(img_path), quality=quality, max_width=max_width):
            success_count += 1
    
    print(f"\n✅ Successfully optimized {success_count}/{len(images)} images")

if __name__ == "__main__":
    import sys
    
    print("=" * 60)
    print("Portfolio Image Optimization Tool")
    print("=" * 60)
    
    # Get base directory
    base_dir = Path(__file__).parent
    
    # Optimize static folder
    static_dir = base_dir / "static"
    if static_dir.exists():
        print("\n📁 Optimizing STATIC folder...")
        optimize_directory(static_dir, quality=85, max_width=1920)
    
    # Optimize media folder
    media_dir = base_dir / "media"
    if media_dir.exists():
        print("\n📁 Optimizing MEDIA folder...")
        optimize_directory(media_dir, quality=85, max_width=1920)
    
    print("\n" + "=" * 60)
    print("✨ Optimization complete!")
    print("=" * 60)
    print("\nTips:")
    print("- For hero images: Use WebP format for better compression")
    print("- For thumbnails: Resize to actual display size")
    print("- Consider using a CDN for production")
    print("=" * 60)

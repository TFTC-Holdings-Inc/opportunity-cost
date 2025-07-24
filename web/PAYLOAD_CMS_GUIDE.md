# Payload CMS Blog System Guide

This guide explains how to use the enhanced Payload CMS system for managing blog posts with preview images and rich media content.

## Overview

The Payload CMS has been updated with:

- Enhanced Media collection with multiple image sizes and metadata
- Separate preview and featured images for blog posts
- Improved image processing and optimization
- Better SEO and social media integration
- Organized admin interface with tabs

## Collections

### Media Collection

The Media collection now supports:

#### Image Sizes

- **Thumbnail** (150x150px) - For small previews and admin interface
- **Preview** (400x300px) - For blog post cards and listings
- **Card** (600x400px) - For medium-sized displays
- **Featured** (1200x630px) - For blog post headers and social sharing
- **Hero** (1920x1080px) - For large hero sections

#### Features

- Automatic WebP conversion for better performance
- Focal point selection for better cropping
- Alt text for accessibility
- Caption and description fields
- Media type categorization (image, video, audio, document, other)
- Tagging system for organization
- License and credit information
- Automatic media type detection based on MIME type

### Posts Collection

#### Tabs Organization

1. **Content** - Main blog post content
2. **Images** - All image-related fields
3. **Metadata** - Author, categories, tags, and related posts
4. **SEO & Social** - SEO optimization and social media settings

#### Image Fields

- **Preview Image** - Small image for blog post cards (recommended: 600x400px)
- **Featured Image** - Large image for blog post headers (recommended: 1200x630px)
- **Gallery** - Additional images with captions for the post

#### Key Features

- Auto-generated slugs from titles
- Reading time calculation
- SEO metadata with fallbacks
- Preview URLs for draft posts
- Custom endpoint for fetching posts by slug
- Automatic timestamp management

## Using Preview Images

### In the Admin Interface

1. **Create/Edit a Post**

   - Go to the "Images" tab
   - Upload a **Preview Image** for blog listings and cards
   - Upload a **Featured Image** for the main post header
   - Optionally add gallery images with captions

2. **Image Recommendations**
   - Preview Image: 600x400px (3:2 aspect ratio)
   - Featured Image: 1200x630px (social media optimized)
   - Use high-quality images that will be automatically optimized

### In the Frontend

The blog pages automatically use:

- **Preview images** for blog post cards and listings
- **Featured images** for individual post headers
- Fallback to featured image if no preview image is set

## Image Processing

### Automatic Optimization

- All images are automatically converted to WebP format
- Multiple sizes are generated for responsive design
- 85% quality setting for optimal file size vs quality balance

### Manual Processing

Use the image processing utilities in `/src/lib/image-processing.ts`:

```typescript
import { processImage, generateImageVariants } from "@/lib/image-processing";

// Process a single image
const optimizedBuffer = await processImage(imageBuffer, {
  width: 800,
  height: 600,
  quality: 85,
  format: "webp",
});

// Generate all standard variants
const variants = await generateImageVariants(imageBuffer, "filename.jpg");
```

## SEO and Social Media

### Automatic SEO

- Meta titles default to post titles
- Meta descriptions default to post excerpts
- Social images default to featured images
- Automatic Open Graph and Twitter Card generation

### Manual SEO

Use the "SEO & Social" tab to:

- Override meta titles and descriptions
- Set custom social sharing images
- Add SEO keywords
- Control search engine indexing

## Categories and Tags

### Default Categories

- General
- Technology
- Bitcoin

### Default Tags

- opportunity cost
- bitcoin
- investing
- technology
- web development
- cryptocurrency
- finance
- economics

### Custom Categories/Tags

Create new categories and tags through the admin interface. Categories support:

- Color coding for visual organization
- Featured images
- Descriptions
- Automatic post counting

## API Endpoints

### Custom Endpoints

- `GET /api/posts/slug/:slug` - Fetch post by slug

### Standard Payload API

- `GET /api/posts` - List all posts
- `GET /api/posts/:id` - Get specific post
- `GET /api/media` - List media files
- `GET /api/categories` - List categories
- `GET /api/tags` - List tags

## File Storage

### Upload Directory

- Files are stored in `/public/media`
- Accessible via `/media/filename.ext`

### File Limits

- Maximum file size: 50MB
- Supported formats: JPEG, PNG, WebP, GIF, SVG, MP4, WebM, MP3, WAV, PDF

## Best Practices

### Images

1. Use descriptive alt text for all images
2. Upload high-resolution images (they'll be optimized automatically)
3. Use preview images that work well at small sizes
4. Consider the aspect ratio for better display

### Content

1. Write compelling excerpts for better SEO and previews
2. Use categories and tags consistently
3. Add related posts to improve user engagement
4. Fill out SEO fields for important posts

### Organization

1. Use consistent naming for images
2. Add captions to gallery images
3. Credit sources when using external images
4. Use appropriate licenses for media

## Troubleshooting

### Common Issues

1. **Images not displaying** - Check file permissions and paths
2. **Upload failures** - Verify file size and format
3. **SEO not working** - Ensure meta fields are filled
4. **Preview not loading** - Check NEXT_PUBLIC_SITE_URL environment variable

### Environment Variables

```env
DATABASE_URI=your_postgres_connection_string
PAYLOAD_SECRET=your_secret_key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Development

### Running the CMS

```bash
npm run dev
```

### Accessing Admin

Visit `/admin` to access the Payload CMS admin interface.

### Database Migrations

Payload automatically handles schema changes when you modify collections.

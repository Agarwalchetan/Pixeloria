# Cloudinary Setup Instructions

## Overview
All image uploads in Pixeloria now use Cloudinary instead of local storage. This provides better performance, automatic optimization, and CDN delivery.

## Setup Steps

### 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. After registration, go to your Dashboard

### 2. Get Your Credentials
From your Cloudinary Dashboard, copy these values:
- **Cloud Name**: Found at the top of your dashboard
- **API Key**: Found in the "Account Details" section
- **API Secret**: Found in the "Account Details" section (click "Reveal" to see it)

### 3. Update .env File
Open `backend/.env` and update these values:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

**Important**: Replace the placeholder values with your actual Cloudinary credentials.

### 4. Folder Structure
Images will be organized in Cloudinary folders:
- `pixeloria/team` - Team member photos
- `pixeloria/portfolio` - Portfolio project images
- `pixeloria/blog` - Blog post images
- `pixeloria/labs` - Lab project images

### 5. Image Transformations
Cloudinary automatically applies these optimizations:
- **Team images**: Resized to max 800x800px
- **Quality**: Auto-optimized for web
- **Format**: Auto-converted to best format (WebP, AVIF, etc.)

## Testing
1. Start your backend server
2. Go to admin dashboard → About Content → Meet Our Team
3. Add a team member with an image
4. The image should upload to Cloudinary and display correctly

## Troubleshooting

### Error: "Image upload failed"
- Check your Cloudinary credentials in `.env`
- Ensure your Cloudinary account is active
- Check the browser console for detailed error messages

### Images not displaying
- Verify the image URLs start with `https://res.cloudinary.com/`
- Check if your Cloudinary account has sufficient quota

### Upload timeout
- Large images may take longer to upload
- Consider resizing images before upload if they're very large

## Benefits
- ✅ Automatic image optimization
- ✅ CDN delivery worldwide
- ✅ No server storage needed
- ✅ Better performance
- ✅ Automatic format conversion
- ✅ Responsive image delivery

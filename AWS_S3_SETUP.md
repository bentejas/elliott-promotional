# AWS S3 Setup Guide for Image Uploads

This guide will help you set up AWS S3 for image uploads in the Elliott Promotional Products admin interface.

## 🚀 Quick Setup

### 1. AWS Account & S3 Bucket Setup

1. **Create an AWS Account** (if you don't have one)
   - Go to [aws.amazon.com](https://aws.amazon.com)
   - Sign up for a free account

2. **Create an S3 Bucket**

   ```bash
   # Using AWS CLI (after installing and configuring)
   aws s3 mb s3://elliott-promotional-products-images --region us-east-1
   ```

   Or via AWS Console:
   - Go to S3 in AWS Console
   - Click "Create bucket"
   - Name: `elliott-promotional-products-images` (or your preferred name)
   - Region: `us-east-1` (or your preferred region)
   - Uncheck "Block all public access" (we need public read access for images)
   - Create bucket

3. **Configure Bucket for Public Access**

   **Option A: Bucket Policy (Recommended)**
   - Go to your bucket → Permissions → Bucket Policy
   - Add this policy:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::elliott-promotional-products-images/*"
       }
     ]
   }
   ```

   **Option B: Enable ACLs (Alternative)**
   - Go to your bucket → Permissions → Object Ownership
   - Edit and select "ACLs enabled"
   - Choose "Bucket owner preferred"
   - Save changes

   **Note**: Modern S3 buckets have ACLs disabled by default. We use bucket policies instead.

### 2. IAM User & Permissions

1. **Create IAM User**
   - Go to IAM in AWS Console
   - Users → Add user
   - Name: `elliott-promotional-s3-user`
   - Access type: Programmatic access
   - Next: Permissions

2. **Create Policy**

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:PutObjectAcl",
           "s3:GetObject",
           "s3:DeleteObject"
         ],
         "Resource": "arn:aws:s3:::elliott-promotional-products-images/*"
       }
     ]
   }
   ```

3. **Attach Policy to User**
   - Attach the policy you just created
   - Complete user creation
   - **Save the Access Key ID and Secret Access Key!**

### 3. Environment Variables

Add these to your `.env` file:

```bash
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
S3_BUCKET_NAME=elliott-promotional-products-images

# Optional: CloudFront CDN (for faster image delivery)
CLOUDFRONT_URL=https://your-distribution.cloudfront.net
```

## 🎯 Features Implemented

### ✅ Complete S3 Integration

- **Direct Upload**: Images upload directly to S3
- **Public URLs**: Automatic generation of public image URLs
- **Validation**: File type and size validation
- **Error Handling**: Comprehensive error handling and user feedback

### ✅ Admin Interface Updates

- **Drag & Drop Upload**: Modern drag-and-drop interface
- **Multiple Images**: Support for primary + secondary images
- **Progress Indicators**: Visual upload progress
- **Image Preview**: Preview uploaded images before saving
- **Validation**: Real-time validation with error messages

### ✅ Database Integration

- **Primary Image**: `imgSrc` field stores the main product image
- **Secondary Images**: `secondaryImages` array stores additional images
- **Automatic Updates**: Form handles both create and update operations

## 🛠️ Technical Implementation

### Files Created/Modified:

1. **`app/utils/s3.server.ts`**
   - S3 client configuration
   - Upload, delete, and validation functions
   - Presigned URL generation (for future use)

2. **`app/components/admin/ImageUpload.tsx`**
   - Reusable image upload component
   - Drag & drop functionality
   - Progress tracking and error handling

3. **`app/routes/upload-image.ts`**
   - API endpoint for handling image uploads
   - Server-side validation and S3 integration

4. **`app/components/admin/ProductForm.tsx`**
   - Updated to include image upload fields
   - Form validation for required images
   - Hidden inputs for image URLs

5. **`app/routes/admin.tsx`**
   - Updated to handle image URLs in create/update actions

## 🔧 Optional Enhancements

### CloudFront CDN (Recommended for Production)

1. **Create CloudFront Distribution**
   - Origin: Your S3 bucket
   - Origin Path: Leave empty
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Allowed HTTP Methods: GET, HEAD
   - Cache Based on Selected Request Headers: None

2. **Update Environment Variable**
   ```bash
   CLOUDFRONT_URL=https://d1234567890123.cloudfront.net
   ```

### CORS Configuration (if using presigned URLs)

Add to your S3 bucket CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

## 🚨 Security Considerations

### Production Checklist:

- [ ] Use IAM roles instead of access keys (when deploying to AWS)
- [ ] Restrict S3 bucket policy to specific origins
- [ ] Enable S3 versioning for backup
- [ ] Set up S3 lifecycle policies for cost optimization
- [ ] Monitor S3 usage and costs
- [ ] Consider using presigned URLs for enhanced security

### Image Processing (Future Enhancement):

- Consider adding image resizing/optimization
- Implement image format conversion (WebP)
- Add image compression for better performance

## 🎉 Usage

1. **Go to Admin Interface**: Visit `/admin`
2. **Add/Edit Product**: Click "Add New Product" or edit existing
3. **Upload Images**:
   - Drag images to the upload area OR click "Choose Images"
   - Primary image is required (first image uploaded)
   - Up to 4 additional images can be added
4. **Save Product**: Images are automatically saved with product

## 📋 Troubleshooting

### Common Issues:

1. **Upload Fails**
   - Check AWS credentials in `.env`
   - Verify S3 bucket permissions
   - Check file size (10MB limit)
   - Ensure file type is supported (JPEG, PNG, WebP)

2. **Images Not Displaying**
   - Verify bucket policy allows public read
   - Check CloudFront URL (if using CDN)
   - Ensure CORS is configured correctly

3. **Permission Denied**
   - Verify IAM user has required S3 permissions
   - Check bucket policy syntax
   - Ensure Access Key ID and Secret are correct

### Debug Mode:

Check server logs for detailed error messages. All S3 operations include comprehensive error logging.

## 💰 Cost Considerations

- **S3 Storage**: ~$0.023 per GB/month
- **S3 Requests**: PUT/POST ~$0.005 per 1,000 requests
- **Data Transfer**: First 1GB/month free, then ~$0.09/GB
- **CloudFront**: Free tier includes 50GB/month

For a typical product catalog with hundreds of images, monthly costs should be under $5-10.

---

🎯 **Your S3 integration is now complete and ready for production use!**

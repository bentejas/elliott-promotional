// utils/s3.server.ts
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

// S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL; // Optional: for CDN

// Upload file directly to S3
export async function uploadToS3(
  file: File,
  folder: string = "products"
): Promise<string> {
  const fileExtension = file.name.split(".").pop();
  const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
    // Note: ACL removed - bucket should be configured for public read via bucket policy
  });

  await s3Client.send(command);

  // Return the public URL
  const publicUrl = CLOUDFRONT_URL
    ? `${CLOUDFRONT_URL}/${fileName}`
    : `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

  return publicUrl;
}

// Upload file with organized folder structure: products/{productCode}/{color}/{filename}
export async function uploadProductImage(
  file: File,
  productCode: string,
  color: string
): Promise<string> {
  const fileExtension = file.name.split(".").pop();
  const sanitizedProductCode = productCode.replace(/[^a-zA-Z0-9]/g, "_");
  const sanitizedColor = color.toLowerCase().replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = `products/${sanitizedProductCode}/${sanitizedColor}/${uuidv4()}.${fileExtension}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
    // Note: ACL removed - bucket should be configured for public read via bucket policy
  });

  await s3Client.send(command);

  // Return the public URL
  const publicUrl = CLOUDFRONT_URL
    ? `${CLOUDFRONT_URL}/${fileName}`
    : `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

  return publicUrl;
}

// Generate presigned URL for direct client-side uploads (more secure)
export async function getPresignedUploadUrl(
  fileName: string,
  fileType: string,
  folder: string = "products"
): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  const key = `${folder}/${uuidv4()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: fileType,
    // Note: ACL removed - bucket should be configured for public read via bucket policy
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour

  const publicUrl = CLOUDFRONT_URL
    ? `${CLOUDFRONT_URL}/${key}`
    : `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;

  return { uploadUrl, publicUrl, key };
}

// Delete file from S3
export async function deleteFromS3(fileUrl: string): Promise<void> {
  try {
    // Extract the key from the URL
    let key: string;

    if (CLOUDFRONT_URL && fileUrl.includes(CLOUDFRONT_URL)) {
      key = fileUrl.replace(`${CLOUDFRONT_URL}/`, "");
    } else {
      key = fileUrl.split(".amazonaws.com/")[1];
    }

    if (!key) {
      console.warn("Could not extract S3 key from URL:", fileUrl);
      return;
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
}

// Validate file type and size
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPEG, PNG, and WebP images are allowed",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size must be less than 10MB",
    };
  }

  return { valid: true };
}

// Generate optimized file name
export function generateOptimizedFileName(originalName: string): string {
  const extension = originalName.split(".").pop()?.toLowerCase();
  const baseName = originalName
    .split(".")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${baseName}-${Date.now()}.${extension}`;
}

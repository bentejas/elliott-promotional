// routes/upload-image.ts
import { uploadToS3, validateImageFile } from "~/utils/s3.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "products";

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate the file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    // Upload to S3
    const imageUrl = await uploadToS3(file, folder);

    return Response.json({ imageUrl, success: true });
  } catch (error) {
    console.error("Error uploading image:", error);
    return Response.json(
      { error: "Failed to upload image. Please try again." },
      { status: 500 }
    );
  }
}

// Handle GET requests for presigned URLs (alternative approach)
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const fileName = url.searchParams.get("fileName");
  const fileType = url.searchParams.get("fileType");
  const folder = url.searchParams.get("folder") || "products";

  if (!fileName || !fileType) {
    return Response.json(
      { error: "fileName and fileType are required" },
      { status: 400 }
    );
  }

  try {
    const { getPresignedUploadUrl } = await import("~/utils/s3.server");
    const { uploadUrl, publicUrl, key } = await getPresignedUploadUrl(
      fileName,
      fileType,
      folder
    );

    return Response.json({ uploadUrl, publicUrl, key });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return Response.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}

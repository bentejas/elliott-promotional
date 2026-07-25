// components/admin/ImageUpload.tsx
import React, { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  label: string;
  currentImages?: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  required?: boolean;
  className?: string;
}

interface UploadingImage {
  id: string;
  file: File;
  progress: number;
  error?: string;
}

export default function ImageUpload({
  label,
  currentImages = [],
  onImagesChange,
  maxImages = 5,
  required = false,
  className = "",
}: ImageUploadProps) {
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return "Only JPEG, PNG, and WebP images are allowed";
    }

    if (file.size > maxSize) {
      return "File size must be less than 10MB";
    }

    return null;
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "products");

    const response = await fetch("/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload failed");
    }

    const { imageUrl } = await response.json();
    return imageUrl;
  };

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      const filesToUpload = Array.from(files).slice(
        0,
        maxImages - currentImages.length
      );

      if (filesToUpload.length === 0) return;

      const newUploadingImages: UploadingImage[] = filesToUpload.map(
        (file) => ({
          id: crypto.randomUUID(),
          file,
          progress: 0,
        })
      );

      setUploadingImages((prev) => [...prev, ...newUploadingImages]);

      // Accumulate across the loop — reusing `currentImages` for each file
      // would drop every upload except the last one.
      let accumulatedImages = [...currentImages];

      // Upload files sequentially to avoid overwhelming the server
      for (const uploadingImage of newUploadingImages) {
        try {
          const validationError = validateFile(uploadingImage.file);
          if (validationError) {
            setUploadingImages((prev) =>
              prev.map((img) =>
                img.id === uploadingImage.id
                  ? { ...img, error: validationError }
                  : img
              )
            );
            continue;
          }

          // Simulate progress updates
          const progressInterval = setInterval(() => {
            setUploadingImages((prev) =>
              prev.map((img) =>
                img.id === uploadingImage.id
                  ? { ...img, progress: Math.min(img.progress + 10, 90) }
                  : img
              )
            );
          }, 200);

          const imageUrl = await uploadImage(uploadingImage.file);

          clearInterval(progressInterval);

          // Update progress to 100% and remove from uploading
          setUploadingImages((prev) =>
            prev.map((img) =>
              img.id === uploadingImage.id ? { ...img, progress: 100 } : img
            )
          );

          // Add to current images
          accumulatedImages = [...accumulatedImages, imageUrl];
          onImagesChange(accumulatedImages);

          // Remove from uploading after a short delay
          setTimeout(() => {
            setUploadingImages((prev) =>
              prev.filter((img) => img.id !== uploadingImage.id)
            );
          }, 1000);
        } catch (error) {
          setUploadingImages((prev) =>
            prev.map((img) =>
              img.id === uploadingImage.id
                ? {
                    ...img,
                    error:
                      error instanceof Error ? error.message : "Upload failed",
                  }
                : img
            )
          );
        }
      }
    },
    [currentImages, maxImages, onImagesChange]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files);
      }
    },
    [handleFileUpload]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const removeUploadingImage = (id: string) => {
    setUploadingImages((prev) => prev.filter((img) => img.id !== id));
  };

  const canAddMore = currentImages.length + uploadingImages.length < maxImages;

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Current Images */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {currentImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Product image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploading Images */}
      {uploadingImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadingImages.map((uploadingImage) => (
            <div key={uploadingImage.id} className="relative">
              <div className="w-full h-32 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                {uploadingImage.error ? (
                  <div className="text-center p-2">
                    <div className="text-red-500 text-xs mb-2">
                      {uploadingImage.error}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeUploadingImage(uploadingImage.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto mb-2" />
                    <div className="text-xs text-gray-500">
                      {uploadingImage.progress}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 text-gray-400">
              <ImageIcon className="w-full h-full" />
            </div>

            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Choose Images
              </button>
            </div>

            <div className="text-sm text-gray-500">
              <p>Or drag and drop images here</p>
              <p className="mt-1">
                JPEG, PNG, WebP up to 10MB each
                {maxImages > 1 && ` • Max ${maxImages} images`}
              </p>
              <p className="mt-1">
                {currentImages.length + uploadingImages.length} of {maxImages}{" "}
                images
              </p>
            </div>
          </div>
        </div>
      )}

      {!canAddMore && (
        <div className="text-sm text-gray-500 text-center">
          Maximum number of images reached ({maxImages})
        </div>
      )}
    </div>
  );
}

// components/admin/ColorImageUpload.tsx
import React, { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2, Star } from "lucide-react";

interface ColorImageUploadProps {
  color: string;
  productCode: string;
  currentImages?: string[];
  onImagesChange: (color: string, images: string[]) => void;
  isPrimary?: boolean;
  onSetPrimary?: (color: string) => void;
  maxImages?: number;
}

interface UploadingImage {
  id: string;
  file: File;
  progress: number;
  error?: string;
}

export default function ColorImageUpload({
  color,
  productCode,
  currentImages = [],
  onImagesChange,
  isPrimary = false,
  onSetPrimary,
  maxImages = 3,
}: ColorImageUploadProps) {
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
    formData.append("productCode", productCode);
    formData.append("color", color);

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
          id: `${Date.now()}-${file.name}`,
          file,
          progress: 0,
        })
      );

      setUploadingImages((prev) => [...prev, ...newUploadingImages]);

      // Upload files sequentially
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

          // Update progress to 100%
          setUploadingImages((prev) =>
            prev.map((img) =>
              img.id === uploadingImage.id ? { ...img, progress: 100 } : img
            )
          );

          // Add to current images
          const updatedImages = [...currentImages, imageUrl];
          onImagesChange(color, updatedImages);

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
    [currentImages, maxImages, onImagesChange, color, productCode]
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
    onImagesChange(color, newImages);
  };

  const removeUploadingImage = (id: string) => {
    setUploadingImages((prev) => prev.filter((img) => img.id !== id));
  };

  const canAddMore = currentImages.length + uploadingImages.length < maxImages;

  return (
    <div className="border rounded-lg p-4 space-y-3">
      {/* Color Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="w-6 h-6 rounded-full border-2 border-gray-300"
            style={{ backgroundColor: color.toLowerCase() }}
          />
          <span className="font-medium text-gray-900 capitalize">{color}</span>
          {isPrimary && (
            <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
              <Star className="w-3 h-3 fill-current" />
              <span>Primary</span>
            </div>
          )}
        </div>
        {onSetPrimary && !isPrimary && currentImages.length > 0 && (
          <button
            type="button"
            onClick={() => onSetPrimary(color)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Set as Primary
          </button>
        )}
      </div>

      {/* Current Images */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {currentImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`${color} product image ${index + 1}`}
                className="w-full h-24 object-cover rounded border border-gray-300"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Uploading Images */}
      {uploadingImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {uploadingImages.map((uploadingImage) => (
            <div key={uploadingImage.id} className="relative">
              <div className="w-full h-24 bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
                {uploadingImage.error ? (
                  <div className="text-center p-1">
                    <div className="text-red-500 text-xs mb-1">Error</div>
                    <button
                      type="button"
                      onClick={() => removeUploadingImage(uploadingImage.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500 mx-auto mb-1" />
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
          className={`border-2 border-dashed rounded p-4 text-center transition-colors ${
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

          <div className="space-y-2">
            <ImageIcon className="w-6 h-6 text-gray-400 mx-auto" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
            >
              <Upload className="w-3 h-3 inline mr-1" />
              Add Images
            </button>
            <div className="text-xs text-gray-500">
              {currentImages.length + uploadingImages.length} of {maxImages}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGalleryProps {
  images: string[];
  productTitle: string;
  selectedColor: string;
}

export default function ImageGallery({
  images,
  productTitle,
  selectedColor,
}: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset to first image when images change (color change)
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [images, selectedColor]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="space-y-6">
        <div className="relative w-full max-w-md mx-auto bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm aspect-square flex items-center justify-center">
          <span className="text-gray-400">No image available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm aspect-square">
        <AnimatePresence mode="wait">
          <motion.img
            key={`${selectedColor}-${currentImageIndex}`}
            src={images[currentImageIndex]}
            alt={`${productTitle} - ${selectedColor} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur rounded-full shadow-md hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ArrowLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur rounded-full shadow-md hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ArrowRight className="w-4 h-4 text-gray-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                index === currentImageIndex
                  ? "border-red-500 shadow-lg ring-2 ring-red-200"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`${productTitle} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

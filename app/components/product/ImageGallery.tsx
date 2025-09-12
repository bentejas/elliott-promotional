import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGalleryProps {
  images: Record<string, string[]>;
  productTitle: string;
  selectedColor: string;
}

export default function ImageGallery({
  images,
  productTitle,
  selectedColor,
}: ImageGalleryProps) {
  const [currentColor, setCurrentColor] = useState(selectedColor);

  // track if they have clicked a thumbnail
  const [hasClickedThumbnail, setHasClickedThumbnail] = useState(false);

  // grab all the colours from the images object and join them into an arraay
  const allColors = Object.keys(images);

  const handlePrevImage = () => {
    const previousColor =
      allColors.indexOf(currentColor) === 0
        ? allColors[allColors.length - 1]
        : allColors[allColors.indexOf(currentColor) - 1];
    setCurrentColor(previousColor);
  };

  const handleNextImage = () => {
    const nextColor =
      allColors.indexOf(currentColor) === allColors.length - 1
        ? allColors[0]
        : allColors[allColors.indexOf(currentColor) + 1];
    setCurrentColor(nextColor);
  };

  console.log(
    "currentColor and hasClickedThumbnail",
    currentColor,
    hasClickedThumbnail
  );

  // useEffect if the selectedColor changes, set the currentColor to the selectedColor
  useEffect(() => {
    setCurrentColor(selectedColor);
    setHasClickedThumbnail(false);
  }, [selectedColor]);

  return (
    <div className="space-y-6">
      {/* Main Image - Smaller */}
      <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <AnimatePresence mode="wait">
          <img
            key={currentColor}
            src={
              hasClickedThumbnail
                ? images[currentColor][0]
                : images[selectedColor][0]
            }
            alt={`${productTitle} - Image ${currentColor}`}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        {allColors.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur rounded-full shadow-md hover:bg-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur rounded-full shadow-md hover:bg-white transition-colors"
            >
              <ArrowRight className="w-4 h-4 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Grid */}
      {allColors.length > 1 && (
        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
          {/** this should grab all the image urls from images regardless of the selected color */}
          {Object.values(images)
            .flat()
            .map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentColor(allColors[index]);
                  setHasClickedThumbnail(true);
                }}
                className={`aspect-square rounded-xl overflow-hidden border-3 transition-all duration-200 ${
                  index === allColors.indexOf(currentColor)
                    ? "border-red-500 shadow-lg ring-2 ring-red-200"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
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

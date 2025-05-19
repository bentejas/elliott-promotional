import React from "react";
import { twMerge } from "tailwind-merge";

interface BentoTileProps {
  tileTitle: string;
  href: string;
  className: string;
  tileSize: string;
  backgroundImage?: string;
}

const BentoTile: React.FC<BentoTileProps> = ({
  tileTitle,
  href,
  className,
  tileSize,
  backgroundImage,
}) => {
  const paddingClass = tileSize === "small" ? "p-4 md:p-6" : "p-6 md:p-8";
  const textSizeClass =
    tileSize === "small" ? "text-lg md:text-xl" : "text-xl md:text-3xl";

  const bgStyles = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : {};

  return (
    <a
      href={href}
      className={twMerge(
        "group relative overflow-hidden rounded-lg bg-black cursor-pointer hover:shadow-lg",
        // make the anchor a column-flex that pushes content to its bottom
        "flex flex-col justify-end",
        paddingClass,
        className,
        backgroundImage && "bg-cover bg-center"
      )}
      style={bgStyles}
    >
      {/* hover overlay */}
      <div className="absolute inset-x-0 bottom-0 h-0 bg-zinc-100 transition-all duration-500 group-hover:h-full pointer-events-none" />

      {/* title is now a flex child at the bottom */}
      <p
        className={twMerge(
          textSizeClass,
          "relative z-10 font-bold text-white transition-colors duration-500 group-hover:text-black"
        )}
      >
        <span className="">{tileTitle}</span>
      </p>
    </a>
  );
};

export default BentoTile;

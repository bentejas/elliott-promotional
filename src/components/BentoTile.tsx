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
  const paddingClass = tileSize === "small" ? "p-6" : "p-8";
  const textSizeClass = tileSize === "small" ? "text-xl" : "text-3xl";

  // If a backgroundImage is provided, set it via inline style.
  const bgStyles = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : {};

  return (
    <a
      href={href}
      className={twMerge(
        "group relative overflow-hidden rounded-lg bg-black cursor-pointer hover:shadow-lg",
        paddingClass,
        className,
        backgroundImage && "bg-cover bg-center"
      )}
      style={bgStyles}
    >
      {/* White overlay that grows from the bottom on hover */}
      <div className="absolute bottom-0 left-0 w-full h-0 bg-zinc-100 transition-all duration-500 group-hover:h-full pointer-events-none" />

      <div
        className={twMerge("relative z-10 flex items-end justify-start h-full")}
      >
        <p
          className={twMerge(
            textSizeClass,
            "font-bold text-white transition-colors duration-500 group-hover:text-black"
          )}
        >
          {tileTitle}
        </p>
      </div>
    </a>
  );
};

export default BentoTile;

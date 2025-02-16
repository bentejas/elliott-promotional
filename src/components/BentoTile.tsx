import React from "react";
import { twMerge } from "tailwind-merge";

interface BentoTileProps {
  tileTitle: string;
  href: string;
  className: string;
  tileSize: string;
  onClick: () => void;
}

const BentoTile: React.FC<BentoTileProps> = ({
  tileTitle,
  href,
  className,
  onClick,
  tileSize,
}) => {
  const paddingClass = tileSize === "small" ? "p-6" : "p-8";
  const textSizeClass = tileSize === "small" ? "text-xl" : "text-3xl";

  return (
    <div
      onClick={onClick}
      className={twMerge(
        "group relative overflow-hidden rounded-lg bg-black cursor-pointer",
        paddingClass,
        className
      )}
    >
      {/* White overlay that grows from the bottom on hover */}
      <div className="absolute bottom-0 left-0 w-full h-0 bg-white transition-all duration-500 group-hover:h-full border-4 border-black rounded-lg" />

      <div className="relative z-10 flex items-end justify-start h-full">
        <p
          className={twMerge(
            textSizeClass,
            "font-bold text-white transition-colors duration-500 group-hover:text-black"
          )}
        >
          {tileTitle}
        </p>
      </div>
    </div>
  );
};

export default BentoTile;

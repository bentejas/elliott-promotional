// components/ProductTile.tsx
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

type ProductTileProps = {
  imageSrc: string;
  linkHref: string;
  title: string;
};

export default function ProductTile({
  imageSrc,
  linkHref,
  title,
}: ProductTileProps) {
  return (
    <Link
      to={linkHref}
      className="relative rounded-2xl sm:rounded-4xl w-full aspect-square hover:scale-102 transition-all duration-200"
    >
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-full object-cover rounded-2xl sm:rounded-4xl"
      />
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-0 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 flex items-center space-x-2 w-fit border border-white/20">
        <span className="text-white text-sm sm:text-md font-light flex flex-row items-center gap-1 sm:gap-2">
          {title}{" "}
          <ArrowUpRight strokeWidth={1} className="w-3 h-3 sm:w-4 sm:h-4" />
        </span>
      </div>
    </Link>
  );
}

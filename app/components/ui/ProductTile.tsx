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
      className="relative rounded-4xl w-54 aspect-square hover:scale-102 transition-all duration-200"
    >
      <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
      <div className="absolute bottom-6 left-6 right-0 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2 w-fit border border-white/20">
        <span className="text-white text-md font-light flex flex-row items-center gap-2">
          {title} <ArrowUpRight strokeWidth={1} />
        </span>
      </div>
    </Link>
  );
}

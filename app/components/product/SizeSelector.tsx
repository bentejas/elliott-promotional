interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSizeChange,
}: SizeSelectorProps) {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Size: <span className="font-normal uppercase">{selectedSize}</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size: string) => (
          <button
            key={size}
            onClick={() => onSizeChange(size)}
            aria-pressed={selectedSize === size}
            className={`px-4 py-2 rounded-full border transition-colors uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 ${
              selectedSize === size
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}

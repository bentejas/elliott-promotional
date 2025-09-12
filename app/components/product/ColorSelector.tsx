import { getColorHex } from "~/utils/colors";

interface ColorSelectorProps {
  colors: string[];
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export default function ColorSelector({
  colors,
  selectedColor,
  onColorChange,
}: ColorSelectorProps) {
  if (!colors || colors.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Color:{" "}
        <span className="font-normal">
          {selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}
        </span>
      </h3>
      <div className="flex flex-wrap gap-3">
        {colors.map((color: string) => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-200 capitalize ${
              selectedColor === color
                ? "bg-black text-white border-black shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:shadow-sm"
            }`}
          >
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{
                backgroundColor: getColorHex(color),
              }}
            />
            <span>{color.charAt(0).toUpperCase() + color.slice(1)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

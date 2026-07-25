interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 9999,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    onQuantityChange(Math.max(min, quantity - 1));
  };

  const handleIncrease = () => {
    onQuantityChange(Math.min(max, quantity + 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty input while typing
    if (inputValue === "") {
      return;
    }

    const numValue = parseInt(inputValue, 10);

    // Only update if it's a valid number
    if (!isNaN(numValue)) {
      onQuantityChange(Math.max(min, Math.min(max, numValue)));
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // If input is empty or invalid on blur, set to minimum
    if (inputValue === "" || isNaN(parseInt(inputValue, 10))) {
      onQuantityChange(min);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
      <div className="flex items-center space-x-3 max-w-xs">
        <button
          onClick={handleDecrease}
          disabled={quantity <= min}
          aria-label="Decrease quantity"
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors text-lg font-semibold text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          −
        </button>
        <input
          type="number"
          min={min}
          max={max}
          value={quantity}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          aria-label="Quantity"
          className="w-20 h-10 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
        <button
          onClick={handleIncrease}
          disabled={quantity >= max}
          aria-label="Increase quantity"
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors text-lg font-semibold text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
    </div>
  );
}

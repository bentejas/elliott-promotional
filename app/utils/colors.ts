// Color utilities for product options

/**
 * Maps color names to their corresponding hex values for visual preview
 * @param colorName - The color name to map
 * @returns Hex color value
 */
const colorMap: Record<string, string> = {
  white: "#f8f9fa",
  black: "#1f2937",
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#10b981",
  yellow: "#f59e0b",
  purple: "#8b5cf6",
  pink: "#ec4899",
  orange: "#f97316",
  gray: "#6b7280",
  grey: "#6b7280",
  brown: "#92400e",
  navy: "#1e3a8a",
  maroon: "#991b1b",
  teal: "#14b8a6",
  lime: "#65a30d",
  indigo: "#6366f1",
  cyan: "#06b6d4",
  emerald: "#059669",
  rose: "#f43f5e",
  amber: "#f59e0b",
  violet: "#8b5cf6",
  fuchsia: "#d946ef",
  sky: "#0ea5e9",
  slate: "#64748b",
  zinc: "#71717a",
  neutral: "#737373",
  stone: "#78716c",
  // Common apparel/promo colour names
  charcoal: "#374151",
  graphite: "#4b5563",
  heather: "#9ca3af",
  ash: "#d1d5db",
  natural: "#f0ead6",
  cream: "#f5f0e1",
  ivory: "#f7f4ea",
  beige: "#e8dcc4",
  khaki: "#bdb76b",
  tan: "#d2b48c",
  sand: "#e0cda9",
  royal: "#2563eb",
  cobalt: "#1d4ed8",
  sapphire: "#1e40af",
  carolina: "#7bafd4",
  columbia: "#9bcbeb",
  aqua: "#22d3ee",
  turquoise: "#06b6d4",
  mint: "#a7f3d0",
  forest: "#166534",
  kelly: "#15803d",
  hunter: "#14532d",
  olive: "#556b2f",
  sage: "#9caf88",
  army: "#4b5320",
  military: "#4b5320",
  burgundy: "#7f1d1d",
  wine: "#722f37",
  cardinal: "#b91c1c",
  crimson: "#dc2626",
  scarlet: "#e11d48",
  cherry: "#c2185b",
  berry: "#a21caf",
  plum: "#6b21a8",
  lavender: "#c4b5fd",
  lilac: "#c8a2c8",
  mauve: "#b784a7",
  coral: "#fb7185",
  salmon: "#fa8072",
  peach: "#fdba8c",
  gold: "#d4a017",
  mustard: "#ca8a04",
  lemon: "#fde047",
  copper: "#b87333",
  bronze: "#cd7f32",
  rust: "#b45309",
  chocolate: "#5c3317",
  espresso: "#4b2e2b",
  coffee: "#6f4e37",
  silver: "#c0c0c0",
  platinum: "#e5e4e2",
  steel: "#71797e",
  gunmetal: "#2a3439",
  smoke: "#848884",
  denim: "#3f5f8a",
  midnight: "#191970",
  ice: "#dbeafe",
  blush: "#fbcfe8",
  magenta: "#d946ef",
  safety: "#ccff00",
};

export function getColorHex(colorName: string): string {
  const color = colorName.toLowerCase().trim();

  // Exact match first
  if (colorMap[color]) return colorMap[color];

  // Compound names ("Heather Grey", "Royal Blue", "Navy Heather"): match the
  // most specific known token — check from the last word backwards, since the
  // final word usually carries the base colour.
  const words = color.split(/[\s/-]+/).filter(Boolean);
  for (let i = words.length - 1; i >= 0; i--) {
    if (colorMap[words[i]]) return colorMap[words[i]];
  }

  return "#6b7280"; // default gray for unknown colors
}

/**
 * Determines if a color is considered "light" for text contrast purposes
 * @param colorName - The color name to check
 * @returns true if the color is light, false if dark
 */
export function isLightColor(colorName: string): boolean {
  // Compute luminance from the resolved hex so compound names
  // ("Heather Grey") and the expanded palette are handled consistently
  const hex = getColorHex(colorName).replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 160;
}

/**
 * Gets appropriate text color (black or white) for a given background color
 * @param backgroundColor - The background color name
 * @returns 'text-black' or 'text-white' class
 */
export function getContrastTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? "text-black" : "text-white";
}

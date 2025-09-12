// Color utilities for product options

/**
 * Maps color names to their corresponding hex values for visual preview
 * @param colorName - The color name to map
 * @returns Hex color value
 */
export function getColorHex(colorName: string): string {
  const color = colorName.toLowerCase();

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
  };

  return colorMap[color] || "#6b7280"; // default gray for unknown colors
}

/**
 * Determines if a color is considered "light" for text contrast purposes
 * @param colorName - The color name to check
 * @returns true if the color is light, false if dark
 */
export function isLightColor(colorName: string): boolean {
  const lightColors = ["white", "yellow", "lime", "cyan", "amber", "sky"];
  return lightColors.includes(colorName.toLowerCase());
}

/**
 * Gets appropriate text color (black or white) for a given background color
 * @param backgroundColor - The background color name
 * @returns 'text-black' or 'text-white' class
 */
export function getContrastTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? "text-black" : "text-white";
}

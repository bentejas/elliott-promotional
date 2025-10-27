// Size normalization and mapping utility

export interface SizeMapping {
  normalized: string;
  display: string;
  variants: string[];
}

// Define size mappings with normalized keys, display format, and all possible variants
export const SIZE_MAPPINGS: Record<string, SizeMapping> = {
  // Standard clothing sizes
  xs: {
    normalized: "xs",
    display: "XS",
    variants: ["xs", "XS", "x-small", "X-Small", "extra small", "Extra Small"],
  },
  s: {
    normalized: "s",
    display: "S",
    variants: ["s", "S", "small", "Small"],
  },
  m: {
    normalized: "m",
    display: "M",
    variants: ["m", "M", "medium", "Medium"],
  },
  l: {
    normalized: "l",
    display: "L",
    variants: ["l", "L", "large", "Large"],
  },
  xl: {
    normalized: "xl",
    display: "XL",
    variants: ["xl", "XL", "x-large", "X-Large", "extra large", "Extra Large"],
  },
  "2xl": {
    normalized: "2xl",
    display: "2XL",
    variants: ["2xl", "2XL", "XXL", "xxl", "2x", "2X", "xx-large", "XX-Large"],
  },
  "3xl": {
    normalized: "3xl",
    display: "3XL",
    variants: [
      "3xl",
      "3XL",
      "XXXL",
      "xxxl",
      "3x",
      "3X",
      "xxx-large",
      "XXX-Large",
    ],
  },
  "4xl": {
    normalized: "4xl",
    display: "4XL",
    variants: ["4xl", "4XL", "XXXXL", "xxxxl", "4x", "4X"],
  },
  "5xl": {
    normalized: "5xl",
    display: "5XL",
    variants: ["5xl", "5XL", "XXXXXL", "xxxxxl", "5x", "5X"],
  },
  // Special sizes
  sm: {
    normalized: "sm",
    display: "S/M",
    variants: ["s/m", "S/M", "sm", "SM", "s-m", "S-M"],
  },
  md: {
    normalized: "md",
    display: "SM/MD",
    variants: ["sm/md", "SM/MD", "md", "MD", "s/m/md", "S/M/MD"],
  },
  lxl: {
    normalized: "lxl",
    display: "LXL",
    variants: ["lxl", "LXL"],
  },
  lxi: {
    normalized: "lxi",
    display: "L/XL",
    variants: ["l/xl", "L/XL", "lxi", "LXI", "l-xl", "L-XL"],
  },
  // Special product sizes
  "wall-calendars": {
    normalized: "wall-calendars",
    display: "Wall Calendars",
    variants: [
      "wall calendars",
      "Wall Calendars",
      "wall-calendars",
      "Wall-Calendars",
    ],
  },
};

// Create reverse mapping for quick lookup
const VARIANT_TO_NORMALIZED: Record<string, string> = {};
Object.entries(SIZE_MAPPINGS).forEach(([normalized, mapping]) => {
  mapping.variants.forEach((variant) => {
    VARIANT_TO_NORMALIZED[variant.toLowerCase()] = normalized;
  });
});

/**
 * Normalize a size string to its canonical form
 */
export function normalizeSize(size: string): string {
  if (!size) return "";

  const trimmed = size.trim();
  const normalized = VARIANT_TO_NORMALIZED[trimmed.toLowerCase()];

  return normalized || trimmed.toLowerCase();
}

/**
 * Get display format for a size
 */
export function getSizeDisplay(size: string): string {
  const normalized = normalizeSize(size);
  const mapping = SIZE_MAPPINGS[normalized];

  return mapping?.display || size;
}

/**
 * Get unique normalized sizes from an array of size strings
 */
export function getUniqueSizes(
  sizes: string[]
): Array<{ normalized: string; display: string }> {
  const uniqueNormalized = new Set<string>();
  const result: Array<{ normalized: string; display: string }> = [];

  sizes.forEach((size) => {
    const normalized = normalizeSize(size);
    if (!uniqueNormalized.has(normalized)) {
      uniqueNormalized.add(normalized);
      result.push({
        normalized,
        display: getSizeDisplay(size),
      });
    }
  });

  // Sort sizes in a logical order
  return result.sort((a, b) => {
    // Define the preferred order for sizes
    const sizeOrder = [
      "xs", // XS
      "s", // S
      "m", // M
      "l", // L
      "xl", // XL
      "2xl", // 2XL
      "3xl", // 3XL
      "4xl", // 4XL
      "5xl", // 5XL
      "sm", // S/M
      "md", // SM/MD
      "lxl", // LXL
      "lxi", // L/XL
      "wall-calendars", // Wall Calendars
    ];

    const getOrderIndex = (normalized: string) => {
      const index = sizeOrder.indexOf(normalized);
      return index === -1 ? 999 : index; // Put unknown sizes at the end
    };

    const aIndex = getOrderIndex(a.normalized);
    const bIndex = getOrderIndex(b.normalized);

    // If both have defined order, sort by order
    if (aIndex !== 999 && bIndex !== 999) {
      return aIndex - bIndex;
    }

    // If only one has defined order, prioritize it
    if (aIndex !== 999) return -1;
    if (bIndex !== 999) return 1;

    // If neither has defined order, sort alphabetically by display name
    return a.display.localeCompare(b.display);
  });
}

/**
 * Check if a product size matches a filter size (handles normalization)
 */
export function sizeMatches(productSize: string, filterSize: string): boolean {
  return normalizeSize(productSize) === normalizeSize(filterSize);
}

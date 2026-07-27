// Colour-family grouping for the products-page colour filter.
//
// The catalog's raw colour strings are supplier-entered and messy (110+
// distinct values: case duplicates, compounds like "Black/Red", and
// non-colours like "Cars"). The filter UI groups them into a small set of
// canonical families; selecting a family matches every raw colour that
// contains one of its tokens.

export interface ColorFamily {
  name: string;
  hex: string;
}

// Canonical display order for the filter sidebar.
export const COLOR_FAMILIES: ColorFamily[] = [
  { name: "White", hex: "#f8f9fa" },
  { name: "Grey", hex: "#6b7280" },
  { name: "Black", hex: "#1f2937" },
  { name: "Brown", hex: "#92400e" },
  { name: "Red", hex: "#dc2626" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Orange", hex: "#f97316" },
  { name: "Yellow", hex: "#f59e0b" },
  { name: "Green", hex: "#16a34a" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Purple", hex: "#8b5cf6" },
  { name: "Metallic", hex: "#c0c0c0" },
  { name: "Other", hex: "#9ca3af" },
];

// Token → family. Tokens are matched against words split on space, "/", "-".
// Add new supplier colour words here, not in components.
const TOKEN_FAMILY: Record<string, string> = {
  // White
  white: "White",
  ivory: "White",
  cream: "White",
  natural: "White",
  bone: "White",
  ice: "White",
  // Grey
  grey: "Grey",
  gray: "Grey",
  charcoal: "Grey",
  graphite: "Grey",
  heather: "Grey",
  ash: "Grey",
  slate: "Grey",
  smoke: "Grey",
  gunmetal: "Grey",
  zinc: "Grey",
  stone: "Grey",
  // Black
  black: "Black",
  // Brown
  brown: "Brown",
  tan: "Brown",
  khaki: "Brown",
  sand: "Brown",
  beige: "Brown",
  taupe: "Brown",
  chocolate: "Brown",
  espresso: "Brown",
  coffee: "Brown",
  camel: "Brown",
  caramel: "Brown",
  coyote: "Brown",
  bamboo: "Brown",
  cork: "Brown",
  wood: "Brown",
  // Red
  red: "Red",
  cardinal: "Red",
  crimson: "Red",
  scarlet: "Red",
  cherry: "Red",
  maroon: "Red",
  marron: "Red", // common supplier typo for maroon
  burgundy: "Red",
  wine: "Red",
  // Pink
  pink: "Pink",
  rose: "Pink",
  blush: "Pink",
  coral: "Pink",
  salmon: "Pink",
  raspberry: "Pink",
  magenta: "Pink",
  fuchsia: "Pink",
  // Orange
  orange: "Orange",
  rust: "Orange",
  peach: "Orange",
  // Yellow
  yellow: "Yellow",
  lemon: "Yellow",
  mustard: "Yellow",
  banana: "Yellow",
  amber: "Yellow",
  // Green
  green: "Green",
  forest: "Green",
  kelly: "Green",
  hunter: "Green",
  olive: "Green",
  sage: "Green",
  army: "Green",
  military: "Green",
  mint: "Green",
  emerald: "Green",
  lime: "Green",
  teal: "Green",
  // Blue
  blue: "Blue",
  navy: "Blue",
  royal: "Blue",
  sapphire: "Blue",
  sky: "Blue",
  aqua: "Blue",
  aquatic: "Blue",
  turquoise: "Blue",
  denim: "Blue",
  midnight: "Blue",
  cobalt: "Blue",
  carolina: "Blue",
  columbia: "Blue",
  indigo: "Blue",
  cyan: "Blue",
  water: "Blue",
  // Purple
  purple: "Purple",
  violet: "Purple",
  plum: "Purple",
  lavender: "Purple",
  lilac: "Purple",
  mauve: "Purple",
  berry: "Purple",
  // Metallic
  silver: "Metallic",
  platinum: "Metallic",
  steel: "Metallic",
  stainless: "Metallic",
  chrome: "Metallic",
  nickel: "Metallic",
  bronze: "Metallic",
  copper: "Metallic",
  gold: "Metallic",
};

/**
 * Map a raw colour string to the families it belongs to. Compounds
 * ("Black/Red") map to every matched family; strings with no recognizable
 * colour token ("Cars", "RTXT") map to ["Other"].
 */
export function getColorFamilies(colorName: string): string[] {
  const words = colorName
    .toLowerCase()
    .split(/[\s/-]+/)
    .map((w) => w.replace(/[^a-z]/g, ""))
    .filter(Boolean);

  const families = new Set<string>();
  for (const word of words) {
    const family = TOKEN_FAMILY[word];
    if (family) families.add(family);
  }

  return families.size > 0 ? [...families] : ["Other"];
}

/**
 * Given all raw colours present in a product set, return the families that
 * should appear in the filter, in canonical order.
 */
export function getAvailableColorFamilies(
  rawColours: string[]
): ColorFamily[] {
  const present = new Set(rawColours.flatMap(getColorFamilies));
  return COLOR_FAMILIES.filter((f) => present.has(f.name));
}

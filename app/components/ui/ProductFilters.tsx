// components/ui/ProductFilters.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { getColorHex } from "~/utils/colors";

interface Filters {
  categories: string[];
  subcategories: Record<string, string[]>;
  brands: string[];
  genders: string[];
  colours: string[];
  sizes: string[];
}

interface CurrentFilters {
  category?: string | null;
  subcategories: string[];
  brand?: string | null;
  gender?: string | null;
  // minPrice?: string | null;
  // maxPrice?: string | null;
  search?: string | null;
  colours: string[];
  sizes: string[];
}

interface ProductFiltersProps {
  filters: Filters;
  currentFilters: CurrentFilters;
  onFiltersChange: (filters: any) => void;
}

export default function ProductFilters({
  filters,
  currentFilters,
  onFiltersChange,
}: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState({
    ...currentFilters,
    subcategories: currentFilters.subcategories || [],
  });
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    category: false,
    price: false,
    woman: false,
    size: false,
    colour: false,
  });

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local filters when currentFilters change
  useEffect(() => {
    setLocalFilters({
      ...currentFilters,
      subcategories: currentFilters.subcategories || [],
    });
  }, [currentFilters]);

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Debounced price filter update
  const updatePriceFilter = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);

    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout
    debounceRef.current = setTimeout(() => {
      onFiltersChange(newFilters);
    }, 300);
  };

  const toggleArrayFilter = (key: "colours" | "sizes", value: string) => {
    const currentArray = localFilters[key] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const FilterSection = ({
    title,
    children,
    sectionKey,
  }: {
    title: string;
    children: React.ReactNode;
    sectionKey: string;
  }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${
            expandedSections[sectionKey] ? "rotate-180" : ""
          }`}
        />
      </button>
      {expandedSections[sectionKey] && (
        <div className="mt-3 space-y-2">{children}</div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Filters</h2>

      {/* Category */}
      <FilterSection title="Category" sectionKey="category">
        <div className="space-y-3">
          {filters.categories.map((category) => (
            <div key={category}>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={localFilters.category === category}
                  onChange={(e) => {
                    const newCategory = e.target.value || null;
                    // Clear subcategories when category changes
                    const newFilters = {
                      ...localFilters,
                      category: newCategory,
                      subcategories: [],
                    };
                    setLocalFilters(newFilters);
                    onFiltersChange(newFilters);
                  }}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {category}
                </span>
              </label>

              {/* Subcategories */}
              {localFilters.category === category &&
                filters.subcategories[category] && (
                  <div className="ml-6 mt-2 space-y-1">
                    {filters.subcategories[category].map((subcategory) => (
                      <label key={subcategory} className="flex items-center">
                        <input
                          type="checkbox"
                          value={subcategory}
                          checked={localFilters.subcategories.includes(
                            subcategory
                          )}
                          onChange={(e) => {
                            const newSubcategories = e.target.checked
                              ? [...localFilters.subcategories, subcategory]
                              : localFilters.subcategories.filter(
                                  (s) => s !== subcategory
                                );
                            updateFilter("subcategories", newSubcategories);
                          }}
                          className="h-3 w-3 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <span className="ml-2 text-xs text-gray-600 capitalize">
                          {subcategory}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      {/* <FilterSection title="Price" sectionKey="price">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={localFilters.minPrice || ""}
            onChange={(e) =>
              updatePriceFilter("minPrice", e.target.value || null)
            }
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={localFilters.maxPrice || ""}
            onChange={(e) =>
              updatePriceFilter("maxPrice", e.target.value || null)
            }
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </FilterSection> */}

      {/* Woman (Gender) */}
      <FilterSection title="Gender" sectionKey="woman">
        <div className="space-y-2">
          {filters.genders.map((gender) => (
            <label key={gender} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.gender === gender}
                onChange={(e) =>
                  updateFilter("gender", e.target.checked ? gender : null)
                }
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">
                {gender}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Size */}
      {filters.sizes.length > 0 && (
        <FilterSection title="Size" sectionKey="size">
          <div className="grid grid-cols-4 gap-2">
            {filters.sizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleArrayFilter("sizes", size)}
                className={`p-2 text-sm border rounded text-center ${
                  localFilters.sizes?.includes(size)
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Colour */}
      {filters.colours.length > 0 && (
        <FilterSection title="Colour" sectionKey="colour">
          <div className="flex flex-wrap gap-2">
            {filters.colours.map((colour) => (
              <button
                key={colour}
                onClick={() => toggleArrayFilter("colours", colour)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm border rounded-full transition-all ${
                  localFilters.colours?.includes(colour)
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: getColorHex(colour) }}
                />
                <span className="capitalize whitespace-nowrap">
                  {colour.charAt(0).toUpperCase() + colour.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  );
}

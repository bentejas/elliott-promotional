// components/ui/ProductFilters.tsx
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { sizeMatches } from "~/utils/sizeMapping";
import type { ColorFamily } from "~/utils/colorFamilies";

interface Filters {
  categories: string[];
  subcategories: Record<string, string[]>;
  brands: string[];
  genders: string[];
  colours: ColorFamily[];
  sizes: string[];
}

interface CurrentFilters {
  category?: string | null;
  subcategories: string[];
  brand?: string | null;
  gender?: string | null;
  search?: string | null;
  colours: string[];
  sizes: string[];
}

interface ProductFiltersProps {
  filters: Filters;
  currentFilters: CurrentFilters;
  onFiltersChange: (filters: any) => void;
  hideHeading?: boolean;
}

// Hoisted to module scope — defining this inside the parent render remounts
// the whole section subtree on every state change.
function FilterSection({
  title,
  children,
  expanded,
  onToggle,
  sectionId,
}: {
  title: string;
  children: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  sectionId: string;
}) {
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`filter-section-${sectionId}`}
        className="flex items-center justify-between w-full py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
      >
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>
      {expanded && (
        <div id={`filter-section-${sectionId}`} className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductFilters({
  filters,
  currentFilters,
  onFiltersChange,
  hideHeading = false,
}: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState({
    ...currentFilters,
    subcategories: currentFilters.subcategories || [],
  });
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    category: true,
    gender: true,
    size: true,
    colour: true,
  });

  // Sync local filters when currentFilters change
  useEffect(() => {
    setLocalFilters({
      ...currentFilters,
      subcategories: currentFilters.subcategories || [],
    });
  }, [currentFilters]);

  const hasActiveFilters = Boolean(
    localFilters.category ||
      localFilters.subcategories.length > 0 ||
      localFilters.gender ||
      (localFilters.colours?.length ?? 0) > 0 ||
      (localFilters.sizes?.length ?? 0) > 0
  );

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const cleared = {
      category: null,
      subcategories: [],
      brand: null,
      gender: null,
      search: localFilters.search ?? null,
      colours: [],
      sizes: [],
    };
    setLocalFilters(cleared);
    onFiltersChange(cleared);
  };

  const setCategory = (category: string | null) => {
    // Clear subcategories when category changes
    const newFilters = {
      ...localFilters,
      category,
      subcategories: [],
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleArrayFilter = (key: "colours" | "sizes", value: string) => {
    const currentArray = localFilters[key] || [];

    if (key === "sizes") {
      // For sizes, use normalized matching
      const isSelected = currentArray.some((item) => sizeMatches(item, value));
      const newArray = isSelected
        ? currentArray.filter((item) => !sizeMatches(item, value))
        : [...currentArray, value];
      updateFilter(key, newArray);
    } else {
      // For colours, use exact matching
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      updateFilter(key, newArray);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {!hideHeading && (
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        )}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <FilterSection
        title="Category"
        sectionId="category"
        expanded={expandedSections.category}
        onToggle={() => toggleSection("category")}
      >
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value=""
              checked={!localFilters.category}
              onChange={() => setCategory(null)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">All categories</span>
          </label>
          {filters.categories.map((category) => (
            <div key={category}>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={localFilters.category === category}
                  onChange={(e) => setCategory(e.target.value || null)}
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

      {/* Gender - Only show if there are genders to display */}
      {filters.genders.length > 0 && (
        <FilterSection
          title="Gender"
          sectionId="gender"
          expanded={expandedSections.gender}
          onToggle={() => toggleSection("gender")}
        >
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                checked={!localFilters.gender}
                onChange={() => updateFilter("gender", null)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">All</span>
            </label>
            {filters.genders.map((gender) => (
              <label key={gender} className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  checked={localFilters.gender === gender}
                  onChange={() => updateFilter("gender", gender)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {gender}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Size */}
      {filters.sizes.length > 0 && (
        <FilterSection
          title="Size"
          sectionId="size"
          expanded={expandedSections.size}
          onToggle={() => toggleSection("size")}
        >
          <div className="flex flex-wrap gap-2">
            {filters.sizes.map((size) => {
              const isSelected =
                localFilters.sizes?.some((item) => sizeMatches(item, size)) ||
                false;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleArrayFilter("sizes", size)}
                  aria-pressed={isSelected}
                  className={`min-w-11 px-2 py-2 text-sm border rounded text-center whitespace-nowrap ${
                    isSelected
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}

      {/* Colour */}
      {filters.colours.length > 0 && (
        <FilterSection
          title="Colour"
          sectionId="colour"
          expanded={expandedSections.colour}
          onToggle={() => toggleSection("colour")}
        >
          <div className="flex flex-wrap gap-2">
            {filters.colours.map((family) => {
              const isSelected =
                localFilters.colours?.includes(family.name) ?? false;
              return (
                <button
                  key={family.name}
                  type="button"
                  onClick={() => toggleArrayFilter("colours", family.name)}
                  aria-pressed={isSelected}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm border rounded-full transition-all ${
                    isSelected
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                    style={
                      family.name === "Other"
                        ? {
                            background:
                              "conic-gradient(#ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ef4444)",
                          }
                        : { backgroundColor: family.hex }
                    }
                  />
                  <span className="whitespace-nowrap">{family.name}</span>
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}
    </div>
  );
}

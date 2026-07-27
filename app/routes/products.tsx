// routes/products.tsx
import type { Route } from "./+types/products";
import { useLoaderData, useSearchParams } from "react-router";
import { db, products } from "../../db";
import ProductCard from "~/components/ui/ProductCard";
import ProductFilters from "~/components/ui/ProductFilters";
import Breadcrumbs from "~/components/ui/Breadcrumbs";
import { ChevronDown, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { Header, Footer } from "~/components/layout";
import { getCartCount } from "~/utils/cart";
import {
  getUniqueSizes,
  isRecognizedSize,
  sizeMatches,
} from "~/utils/sizeMapping";
import {
  getAvailableColorFamilies,
  getColorFamilies,
} from "~/utils/colorFamilies";
import { NO_GENDER_CATEGORIES } from "~/utils/categories";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

const PAGE_SIZE = 24;
const SORT_OPTIONS = ["Newest", "Oldest", "Name A-Z"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // Extract filter parameters
  const category = searchParams.get("category");
  const subcategories = searchParams.getAll("subcategory");
  const brand = searchParams.get("brand");
  const gender = searchParams.get("gender");
  const search = searchParams.get("search");
  const colours = searchParams.getAll("colour");
  const sizes = searchParams.getAll("size");
  const sortParam = searchParams.get("sort");
  const sort: SortOption = SORT_OPTIONS.includes(sortParam as SortOption)
    ? (sortParam as SortOption)
    : "Newest";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  // One table scan; every filter and facet below derives from it in memory.
  // (The catalog is a few hundred rows — this beats the previous 5+ scans.)
  const allProducts = await db.select().from(products);

  const matchesText = (haystack: string | null, needle: string) =>
    (haystack ?? "").toLowerCase().includes(needle.toLowerCase());

  let filteredProducts = allProducts;

  if (category) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category?.toLowerCase() === category.toLowerCase()
    );
  }

  if (subcategories.length > 0) {
    // Exact (case-insensitive) match — substring matching made "shirt"
    // also return "sweatshirt" etc.
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.subCategory &&
        subcategories.some(
          (sub) => sub.toLowerCase() === p.subCategory!.toLowerCase()
        )
    );
  }

  if (brand) {
    filteredProducts = filteredProducts.filter((p) =>
      matchesText(p.brand, brand)
    );
  }

  if (gender && gender !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => p.gender?.toLowerCase() === gender.toLowerCase()
    );
  }

  if (search) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        matchesText(p.title, search) ||
        matchesText(p.description, search) ||
        matchesText(p.productCode, search)
    );
  }

  if (colours.length > 0) {
    // `colour` params are family names (e.g. "Blue"); a product matches if
    // any of its raw colours belongs to a selected family.
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.colours &&
        (product.colours as string[]).some((raw) =>
          getColorFamilies(raw).some((family) => colours.includes(family))
        )
    );
  }

  if (sizes.length > 0) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.sizes &&
        sizes.some((filterSize) =>
          (product.sizes as string[]).some((productSize) =>
            sizeMatches(productSize, filterSize)
          )
        )
    );
  }

  // Sort server-side so pagination stays stable
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sort) {
      case "Oldest":
        return (
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
        );
      case "Name A-Z":
        return a.title.localeCompare(b.title);
      case "Newest":
      default:
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
    }
  });

  // Paginate
  const totalProducts = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageProducts = sortedProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Facets are context-aware: options reflect the category/brand/gender
  // filters currently applied.
  let productsForFilters = allProducts;
  if (category) {
    productsForFilters = productsForFilters.filter(
      (p) => p.category?.toLowerCase() === category.toLowerCase()
    );
  }
  if (subcategories.length > 0) {
    productsForFilters = productsForFilters.filter(
      (p) =>
        p.subCategory &&
        subcategories.some(
          (sub) => sub.toLowerCase() === p.subCategory!.toLowerCase()
        )
    );
  }
  if (brand) {
    productsForFilters = productsForFilters.filter((p) =>
      matchesText(p.brand, brand)
    );
  }
  if (gender && gender !== "all") {
    productsForFilters = productsForFilters.filter(
      (p) => p.gender?.toLowerCase() === gender.toLowerCase()
    );
  }

  const categories = [...new Set(allProducts.map((p) => p.category))];

  // Get subcategories grouped by category with case-insensitive deduplication
  const subcategoriesByCategory: Record<string, string[]> = {};
  allProducts.forEach((product) => {
    if (product.category && product.subCategory) {
      if (!subcategoriesByCategory[product.category]) {
        subcategoriesByCategory[product.category] = [];
      }

      // Check if subcategory already exists (case-insensitive)
      const existingSubcategory = subcategoriesByCategory[
        product.category
      ].find(
        (existing) =>
          existing.toLowerCase() === product.subCategory!.toLowerCase()
      );

      if (!existingSubcategory) {
        // Use proper case (capitalize first letter, rest lowercase)
        const normalizedSubcategory =
          product.subCategory.charAt(0).toUpperCase() +
          product.subCategory.slice(1).toLowerCase();
        subcategoriesByCategory[product.category].push(normalizedSubcategory);
      }
    }
  });

  // Sort subcategories alphabetically for each category
  Object.keys(subcategoriesByCategory).forEach((category) => {
    subcategoriesByCategory[category].sort((a, b) => a.localeCompare(b));
  });

  const brands = [...new Set(productsForFilters.map((p) => p.brand))];

  // Categories where gender should not be shown
  const noGenderCategories = NO_GENDER_CATEGORIES;

  // Filter genders based on category and exclude "none"
  const shouldShowGender =
    !category || !noGenderCategories.includes(category.toLowerCase());
  const genders = shouldShowGender
    ? [...new Set(productsForFilters.map((p) => p.gender))].filter(
        (gender) => gender && gender.toLowerCase() !== "none"
      )
    : [];

  // Colour facet is the small set of colour families present, not the
  // 100+ raw supplier colour strings.
  const rawColours = productsForFilters.flatMap((p) => p.colours || []);
  const colourFamilies = getAvailableColorFamilies(rawColours);

  // Size facet: unique normalized sizes, dropping unrecognized free-text
  // entries ("new born to 24 months") that supplier data sneaks in.
  const rawSizes = productsForFilters
    .flatMap((p) => p.sizes || [])
    .filter(isRecognizedSize);
  const uniqueSizes = getUniqueSizes(rawSizes);
  const allSizes = uniqueSizes.map((size) => size.display);

  return {
    products: pageProducts,
    totalProducts,
    totalPages,
    currentPage,
    sort,
    filters: {
      categories,
      subcategories: subcategoriesByCategory,
      brands,
      genders,
      colours: colourFamilies,
      sizes: allSizes,
    },
    currentFilters: {
      category,
      subcategories,
      brand,
      gender,
      search,
      colours,
      sizes,
    },
  };
}

export function meta({}: Route.MetaArgs) {
  const description =
    "Browse our complete catalog of promotional products — apparel, drinkware, bags, hi-vis, and more.";
  return [
    { title: "Products - Elliott Promotional Products" },
    { name: "description", content: description },
    { property: "og:title", content: "Products - Elliott Promotional Products" },
    { property: "og:description", content: description },
  ];
}

export default function Products() {
  const {
    products: productList,
    totalProducts,
    totalPages,
    currentPage,
    sort,
    filters,
    currentFilters,
  } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cartCount, setCartCount] = useState(0);

  // Update cart count on mount and when cart changes
  useEffect(() => {
    setCartCount(getCartCount());

    const handleCartUpdate = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // Rebuild the URL from a filter object, keeping sort and resetting the page
  const handleFiltersChange = (newFilters: Record<string, any>) => {
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Array filters use singular param names (the loader reads
        // getAll("subcategory"/"colour"/"size"))
        const paramKey =
          { subcategories: "subcategory", colours: "colour", sizes: "size" }[
            key
          ] ?? key;
        value.forEach((v: string) => newSearchParams.append(paramKey, v));
      } else if (value) {
        newSearchParams.set(key, String(value));
      }
    });
    if (sort !== "Newest") newSearchParams.set("sort", sort);
    setSearchParams(newSearchParams, { preventScrollReset: true });
  };

  const handleSortChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value === "Newest") {
      newSearchParams.delete("sort");
    } else {
      newSearchParams.set("sort", value);
    }
    newSearchParams.delete("page");
    setSearchParams(newSearchParams, { preventScrollReset: true });
  };

  const goToPage = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (page <= 1) {
      newSearchParams.delete("page");
    } else {
      newSearchParams.set("page", String(page));
    }
    setSearchParams(newSearchParams);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header cartCount={cartCount} />

      {/* Breadcrumb */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", isActive: true },
        ]}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Products</h2>

            <ProductFilters
              filters={filters}
              currentFilters={currentFilters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Products Section */}
          <div className="flex-1 min-w-0">
            {/* Mobile Header with Filter Button */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-80 p-0 overflow-hidden"
                    onWheel={(e) => {
                      // Ensure wheel events are properly handled for scrolling
                      e.stopPropagation();
                    }}
                  >
                    <div className="h-full flex flex-col">
                      <SheetHeader className="px-6 py-6 flex-shrink-0 border-b">
                        <SheetTitle>Filter Products</SheetTitle>
                      </SheetHeader>
                      <div className="flex-1 overflow-y-auto px-6 py-6">
                        <ProductFilters
                          filters={filters}
                          currentFilters={currentFilters}
                          onFiltersChange={handleFiltersChange}
                          hideHeading
                        />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Sort and Product Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-gray-600">
                {totalProducts} product{totalProducts !== 1 ? "s" : ""}
                {totalPages > 1 && (
                  <span className="text-gray-400">
                    {" "}
                    · Page {currentPage} of {totalPages}
                  </span>
                )}
              </p>

              <div className="flex items-center space-x-2">
                <label htmlFor="sort-products" className="text-sm text-gray-600">
                  Sort by:
                </label>
                <div className="relative">
                  <select
                    id="sort-products"
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {productList.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  No products found matching your criteria.
                </p>
                <button
                  onClick={() => handleFiltersChange({})}
                  className="text-red-600 hover:text-red-700 font-medium underline underline-offset-4"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {productList.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Product pages"
                className="mt-10 flex items-center justify-center gap-2"
              >
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  aria-label="Previous page"
                  className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - currentPage) <= 1
                  )
                  .map((p, idx, arr) => (
                    <span key={p} className="flex items-center gap-2">
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="text-gray-400">…</span>
                      )}
                      <button
                        onClick={() => goToPage(p)}
                        aria-current={p === currentPage ? "page" : undefined}
                        className={`min-w-9 px-3 py-1.5 rounded-md text-sm font-medium ${
                          p === currentPage
                            ? "bg-gray-900 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  ))}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  aria-label="Next page"
                  className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// routes/products.tsx
import type { Route } from "./+types/products";
import { useLoaderData, useSearchParams } from "react-router";
import { db, products, type Product } from "../../db";
import { sql, and, ilike, gte, lte, inArray } from "drizzle-orm";
import { Layout, Navbar } from "~/components/layout";
import ProductCard from "~/components/ui/ProductCard";
import ProductFilters from "~/components/ui/ProductFilters";
import Breadcrumbs from "~/components/ui/Breadcrumbs";
import { Search, ShoppingBag, Menu, ChevronDown, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { Header, Footer } from "~/components/layout";
import { getCartCount } from "~/utils/cart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // Extract filter parameters
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const gender = searchParams.get("gender");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const search = searchParams.get("search");
  const colours = searchParams.getAll("colour");
  const sizes = searchParams.getAll("size");

  // Build where conditions
  const conditions = [];

  if (category) {
    conditions.push(ilike(products.category, category));
  }

  if (brand) {
    conditions.push(ilike(products.brand, `%${brand}%`));
  }

  if (gender && gender !== "all") {
    conditions.push(ilike(products.gender, gender));
  }

  if (minPrice) {
    conditions.push(gte(products.priceLow, parseFloat(minPrice)));
  }

  if (maxPrice) {
    conditions.push(lte(products.priceHigh, parseFloat(maxPrice)));
  }

  if (search) {
    conditions.push(
      sql`(${ilike(products.title, `%${search}%`)} OR ${ilike(products.description, `%${search}%`)} OR ${ilike(products.productCode, `%${search}%`)})`
    );
  }

  // Note: JSON array filtering for colours and sizes would need more complex SQL
  // For now, we'll fetch all and filter in memory for simplicity

  const allProducts = await db
    .select()
    .from(products)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  // Filter by colours and sizes in memory (could be optimized with proper JSON queries)
  let filteredProducts = allProducts;

  if (colours.length > 0) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.colours &&
        colours.some((colour) => (product.colours as string[]).includes(colour))
    );
  }

  if (sizes.length > 0) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.sizes &&
        sizes.some((size) => (product.sizes as string[]).includes(size))
    );
  }

  // Get unique values for filters
  const allProductsForFilters = await db.select().from(products);

  const categories = [...new Set(allProductsForFilters.map((p) => p.category))];
  const brands = [...new Set(allProductsForFilters.map((p) => p.brand))];
  const genders = [...new Set(allProductsForFilters.map((p) => p.gender))];
  const allColours = [
    ...new Set(allProductsForFilters.flatMap((p) => p.colours || [])),
  ];
  const allSizes = [
    ...new Set(allProductsForFilters.flatMap((p) => p.sizes || [])),
  ];

  return {
    products: filteredProducts,
    filters: {
      categories,
      brands,
      genders,
      colours: allColours,
      sizes: allSizes,
    },
    currentFilters: {
      category,
      brand,
      gender,
      minPrice,
      maxPrice,
      search,
      colours,
      sizes,
    },
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Products - Elliott Promotional Products" },
    {
      name: "description",
      content: "Browse our complete catalog of promotional products.",
    },
  ];
}

export default function Products() {
  const {
    products: productList,
    filters,
    currentFilters,
  } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("Popularity");
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

  const sortOptions = [
    "Popularity",
    "Price: Low to High",
    "Price: High to Low",
    "Newest",
    "Name A-Z",
  ];

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
        onBackClick={() => window.history.back()}
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
              onFiltersChange={(newFilters: Record<string, any>) => {
                const newSearchParams = new URLSearchParams();
                Object.entries(newFilters).forEach(([key, value]) => {
                  if (Array.isArray(value)) {
                    value.forEach((v: string) =>
                      newSearchParams.append(key, v)
                    );
                  } else if (value) {
                    newSearchParams.set(key, String(value));
                  }
                });
                setSearchParams(newSearchParams);
              }}
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
                          onFiltersChange={(
                            newFilters: Record<string, any>
                          ) => {
                            const newSearchParams = new URLSearchParams();
                            Object.entries(newFilters).forEach(
                              ([key, value]) => {
                                if (Array.isArray(value)) {
                                  value.forEach((v: string) =>
                                    newSearchParams.append(key, v)
                                  );
                                } else if (value) {
                                  newSearchParams.set(key, String(value));
                                }
                              }
                            );
                            setSearchParams(newSearchParams);
                          }}
                        />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Sort and Product Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-gray-600">{productList.length} products</p>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {sortOptions.map((option) => (
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
                <p className="text-gray-500 text-lg">
                  No products found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {productList.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

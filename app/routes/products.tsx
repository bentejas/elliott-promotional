// routes/products.tsx
import type { Route } from "./+types/products";
import { useLoaderData, useSearchParams } from "react-router";
import { db, products, type Product } from "../../db";
import { sql, and, ilike, gte, lte, inArray } from "drizzle-orm";
import { Layout, Navbar } from "~/components/layout";
import ProductCard from "~/components/ui/ProductCard";
import ProductFilters from "~/components/ui/ProductFilters";

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

  return (
    <div className="flex min-h-screen flex-col gap-6 md:gap-8 px-8 pt-6">
      <Navbar />

      <Layout>
        <div className="max-w-7xl mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Our Products
            </h1>
            <p className="text-lg text-gray-600">
              Browse our complete catalog of promotional products
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
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

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="mb-4">
                <p className="text-gray-600">
                  Showing {productList.length} products
                </p>
              </div>

              {productList.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No products found matching your criteria.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {productList.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

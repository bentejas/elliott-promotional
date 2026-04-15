import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("products", "routes/products.tsx"),
  route("products/:productId", "routes/products.$productId.tsx"),
  route("request-quote", "routes/request-quote.tsx"),
  route("quote-success", "routes/quote-success.tsx"),
  route("admin", "routes/admin.tsx"),
  route("admin/login", "routes/admin.login.tsx"),
  route("admin/logout", "routes/admin.logout.tsx"),
  route("admin/suppliers", "routes/admin.suppliers.tsx"),
  route("upload-image", "routes/upload-image.ts"),
] satisfies RouteConfig;

import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("products", "routes/products.tsx"),
  route("admin", "routes/admin.tsx"),
  route("upload-image", "routes/upload-image.ts"),
] satisfies RouteConfig;

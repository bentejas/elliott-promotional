import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { ReactLenis } from "lenis/react";
// Poppins is the site font — load only the weights actually used
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

import type { Route } from "./+types/root";
import "./app.css";
import { Toaster } from "~/components/ui/sonner";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
];

export const meta: Route.MetaFunction = () => [
  { title: "Elliott Promotional Products" },
  {
    name: "description",
    content:
      "Premium promotional products that bring your brand to life. Apparel, drinkware, bags, and more — proudly Canadian.",
  },
  { name: "theme-color", content: "#ffffff" },
  { property: "og:site_name", content: "Elliott Promotional Products" },
  { property: "og:type", content: "website" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <ReactLenis root>
        <Outlet />
      </ReactLenis>
      <Toaster />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Something went wrong";
  let details = "An unexpected error occurred. Please try again.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      message = "Page not found";
      details =
        "The page you're looking for doesn't exist or may have been moved.";
    } else {
      message = `Error ${error.status}`;
      details = error.statusText || details;
    }
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center">
          <Link to="/">
            <img
              src="/images/epp-logo-horizontal.png"
              alt="Elliott Promotional Products"
              className="h-12"
            />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg text-center">
          {isRouteErrorResponse(error) && error.status === 404 && (
            <p className="text-7xl font-bold text-gray-200 mb-4">404</p>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{message}</h1>
          <p className="text-lg text-gray-600 mb-8">{details}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-semibold"
            >
              Back to Home
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-colors font-semibold"
            >
              Browse Products
            </Link>
          </div>
          {stack && (
            <pre className="mt-10 w-full p-4 overflow-x-auto text-left text-xs bg-white border border-gray-200 rounded-lg">
              <code>{stack}</code>
            </pre>
          )}
        </div>
      </div>
    </main>
  );
}

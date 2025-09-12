// components/layout/Header.tsx
import { Search, ShoppingBag, Menu } from "lucide-react";
import { useLocation } from "react-router";

interface HeaderProps {
  onAboutClick?: () => void;
  onContactClick?: () => void;
  cartCount?: number;
}

export function Header({
  onAboutClick,
  onContactClick,
  cartCount = 0,
}: HeaderProps) {
  const location = useLocation();

  // Helper function to determine if a link is active
  const isActiveLink = (path: string) => {
    const currentPath = location.pathname;

    if (path === "/") {
      return currentPath === "/" || currentPath === "/home";
    }

    // For sections on home page, only highlight when specifically on home
    if (path === "/about" || path === "/contact") {
      return false; // These are sections, not separate pages
    }

    return currentPath.startsWith(path);
  };

  // Helper function to get link classes
  const getLinkClasses = (path: string) => {
    return isActiveLink(path)
      ? "text-gray-900 font-semibold"
      : "text-gray-500 hover:text-gray-900";
  };
  return (
    <header className="bg-background border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img
                src="/images/epp-logo-horizontal.png"
                alt="Elliott Promotional Products"
                className="h-20 translate-y-1"
              />
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className={getLinkClasses("/")}>
              Home
            </a>
            <a href="/products" className={getLinkClasses("/products")}>
              Products
            </a>
            {onAboutClick ? (
              <button
                onClick={onAboutClick}
                className={getLinkClasses("/about")}
              >
                About
              </button>
            ) : (
              <a href="/#about" className={getLinkClasses("/about")}>
                About
              </a>
            )}
            {onContactClick ? (
              <button
                onClick={onContactClick}
                className={getLinkClasses("/contact")}
              >
                Contact
              </button>
            ) : (
              <a href="/#contact" className={getLinkClasses("/contact")}>
                Contact
              </a>
            )}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* <button className="p-2 text-gray-400 hover:text-gray-500">
              <Search className="h-6 w-6" />
            </button> */}
            <a
              href="/request-quote"
              className="p-2 text-gray-400 hover:text-gray-500 relative"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </a>
            <button className="p-2 text-gray-400 hover:text-gray-500 md:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

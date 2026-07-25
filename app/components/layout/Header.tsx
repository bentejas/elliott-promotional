// components/layout/Header.tsx
import { ShoppingBag, Menu } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

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
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
            <Link to="/" className="flex items-center">
              <img
                src="/images/epp-logo-horizontal.png"
                alt="Elliott Promotional Products"
                className="h-16"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              aria-current={isActiveLink("/") ? "page" : undefined}
              className={getLinkClasses("/")}
            >
              Home
            </Link>
            <Link
              to="/products"
              aria-current={isActiveLink("/products") ? "page" : undefined}
              className={getLinkClasses("/products")}
            >
              Products
            </Link>
            {onAboutClick ? (
              <button
                onClick={onAboutClick}
                className={getLinkClasses("/about")}
              >
                About
              </button>
            ) : (
              <Link to="/#about-section" className={getLinkClasses("/about")}>
                About
              </Link>
            )}
            {onContactClick ? (
              <button
                onClick={onContactClick}
                className={getLinkClasses("/contact")}
              >
                Contact
              </button>
            ) : (
              <Link
                to="/#contact-section"
                className={getLinkClasses("/contact")}
              >
                Contact
              </Link>
            )}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/request-quote"
              aria-label={`Quote cart, ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
              className="p-2 text-gray-400 hover:text-gray-500 relative"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            {/* Mobile Navigation Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <button
                  aria-label="Open menu"
                  className="p-2 text-gray-400 hover:text-gray-500 md:hidden"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-6">
                  <Link
                    to="/"
                    className={`text-lg py-2 px-3 rounded-lg transition-colors ${getLinkClasses("/")}`}
                    onClick={() => setIsSheetOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/products"
                    className={`text-lg py-2 px-3 rounded-lg transition-colors ${getLinkClasses("/products")}`}
                    onClick={() => setIsSheetOpen(false)}
                  >
                    Products
                  </Link>
                  {onAboutClick ? (
                    <button
                      onClick={() => {
                        onAboutClick();
                        setIsSheetOpen(false);
                      }}
                      className={`text-lg py-2 px-3 rounded-lg transition-colors text-left ${getLinkClasses("/about")}`}
                    >
                      About
                    </button>
                  ) : (
                    <Link
                      to="/#about-section"
                      className={`text-lg py-2 px-3 rounded-lg transition-colors ${getLinkClasses("/about")}`}
                      onClick={() => setIsSheetOpen(false)}
                    >
                      About
                    </Link>
                  )}
                  {onContactClick ? (
                    <button
                      onClick={() => {
                        onContactClick();
                        setIsSheetOpen(false);
                      }}
                      className={`text-lg py-2 px-3 rounded-lg transition-colors text-left ${getLinkClasses("/contact")}`}
                    >
                      Contact
                    </button>
                  ) : (
                    <Link
                      to="/#contact-section"
                      className={`text-lg py-2 px-3 rounded-lg transition-colors ${getLinkClasses("/contact")}`}
                      onClick={() => setIsSheetOpen(false)}
                    >
                      Contact
                    </Link>
                  )}

                  {/* Cart Link in Mobile Menu */}
                  <div className="border-t pt-4 mt-4">
                    <Link
                      to="/request-quote"
                      className="flex items-center text-lg py-2 px-3 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <ShoppingBag className="h-5 w-5 mr-3" />
                      Cart
                      {cartCount > 0 && (
                        <span className="ml-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                          {cartCount > 99 ? "99+" : cartCount}
                        </span>
                      )}
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

// components/Navbar.tsx
import React from "react";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { twMerge } from "tailwind-merge";

type Props = { className?: string };

export const Navbar = ({ className }: Props) => {
  return (
    // absolute so it overlays the hero image inside Layout
    <header className={twMerge("absolute inset-x-0 top-15 z-20", className)}>
      <div className="mx-auto max-w-[84%] px-4 pt-4">
        <nav
          className="
            flex h-20 items-center justify-between
            rounded-full border border-white/50 bg-white/10
            shadow-md backdrop-blur supports-[backdrop-filter]:backdrop-blur
            px-4 md:px-6 md:pl-8
          "
        >
          {/* Brand lockup like the mock */}
          <a href="/" className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white uppercase">
              ELLIOTT Promotional Products
            </span>
            {/* <img
              src="/images/epp-logo-horizontal.png"
              alt="Elliott Logo"
              className="w-52"
            /> */}
          </a>

          {/* Icon actions to match the mock’s minimal right side */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              aria-label="Search"
              className="grid h-12 w-12 place-items-center rounded-full border border-zinc-900/10 bg-white/70 hover:bg-white cursor-pointer"
            >
              <ShoppingBag className="h-6 w-6" />
            </button>
            <button
              aria-label="Menu"
              className="grid h-12 w-12 place-items-center rounded-full border border-zinc-900/10 bg-white/70 hover:bg-white cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

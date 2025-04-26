import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import ActionButton from "./ActionButton";

const NavigationBar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full">
      <nav className="w-full bg-black p-2 flex justify-between items-center px-4 md:px-16">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img
            src="/images/ElliottPromotionalWideWhite.webp"
            alt="Elliott Promotional"
            className="h-12 md:h-18 w-auto translate-y-1"
          />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-16 items-center">
          <a href="/" className="text-white hover:text-gray-400 font-bold">
            Home
          </a>
          <a
            href="/products"
            className="text-white hover:text-gray-400 font-bold"
          >
            Products
          </a>
          <a href="/about" className="text-white hover:text-gray-400 font-bold">
            About us
          </a>
          <a
            href="/contact"
            className="bg-red-800 rounded-md hover:bg-red-700 px-4 py-2 font-bold text-white"
          >
            Get in touch
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* Side Sheet Overlay + Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-transform transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setOpen(false)}
        />

        {/* Drawer */}
        <aside className="relative z-10 w-full h-full bg-black p-6 text-white">
          <button
            className="absolute top-4 right-4"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>

          <nav className="flex flex-col w-full justify-end items-end space-y-6 mt-8">
            <a
              href="/"
              className="font-bold hover:text-gray-400"
              onClick={() => setOpen(false)}
            >
              Home
            </a>
            <a
              href="/products"
              className="font-bold hover:text-gray-400"
              onClick={() => setOpen(false)}
            >
              Products
            </a>
            <a
              href="/about"
              className="font-bold hover:text-gray-400"
              onClick={() => setOpen(false)}
            >
              About us
            </a>
            <a
              href="/contact"
              className="bg-red-800 px-4 py-2 rounded-md font-bold text-white hover:bg-red-700"
              onClick={() => setOpen(false)}
            >
              Get in touch
            </a>
          </nav>
        </aside>
      </div>
    </header>
  );
};

export default NavigationBar;

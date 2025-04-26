// top navigation component
import React from "react";
import ActionButton from "./ActionButton";

const NavigationBar: React.FC = () => {
  return (
    <div className="w-full flex flex-col justify-center items-end">
      <nav className=" w-full bg-black p-2 flex flex-row justify-between items-center px-16">
        <div className="flex items-center">
          <a href="/">
            <img
              src="/images/ElliottPromotionalWideWhite.webp"
              alt="Elliott Promotional"
              className="h-18 w-auto translate-y-1"
            />
          </a>
        </div>
        <div className="flex flex-row space-x-16 items-center justify-center">
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
      </nav>
    </div>
  );
};

export default NavigationBar;

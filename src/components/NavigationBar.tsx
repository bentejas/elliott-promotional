// top navigation component
import React from "react";
import ActionButton from "./ActionButton";

const NavigationBar: React.FC = () => {
  return (
    <nav className="bg-black p-4 flex flex-row justify-between items-center px-16">
      <div className="flex items-center">
        <img
          src="/images/white-logo.png"
          alt="Elliott Promotional"
          className="h-16 w-auto"
        />
      </div>
      <div className="flex flex-row space-x-16 items-center justify-center">
        <a href="#products" className="text-white hover:text-gray-400">
          Products
        </a>
        <a href="#about" className="text-white hover:text-gray-400">
          About us
        </a>
        <ActionButton
          text="Request a Quote"
          onClick={() => (window.location.href = "/request-quote")}
        />
      </div>
    </nav>
  );
};

export default NavigationBar;

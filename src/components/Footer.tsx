import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="w-full mt-10 md:mt-20 flex flex-col justify-center items-center bg-black">
      <div className="w-full px-4 md:px-0 md:w-auto py-6 text-white text-sm md:text-md tracking-wide flex flex-col justify-center md:flex-row space-y-1 md:space-y-0 items-start md:items-center md:space-x-2">
        <p>Elliott Promotional Products</p>
        <p className="hidden md:block">•</p>
        <p>Stratford, ON</p>

        <p className="hidden md:block">•</p>
        <p>
          <a href="mailto:owner@elliottpromotional.ca" className="underline">
            owner@elliottpromotional.ca
          </a>
        </p>
        <p className="hidden md:block">•</p>
        <p>
          <a href="tel:5196144897" className="underline">
            519-614-4897
          </a>
        </p>
      </div>
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-center items-center md:space-x-20">
        <img
          src="/images/white-logo.png"
          alt="elliott promotional products"
          className="w-48 md:w-64"
        />

        <div className="w-full flex flex-row justify-center items-center space-x-12 md:space-x-20">
          <div className="flex flex-col justify-center items-start text-white space-y-1 md:space-y-4">
            <h2 className="text-white font-bold text-lg md:text-xl md:py-2">
              Legal
            </h2>
            <a href="/terms-of-use" className="hover:underline">
              Terms of use
            </a>
            <a href="/privacy-policy" className="hover:underline">
              Privacy policy
            </a>
            <a href="/cookie-policy" className="hover:underline">
              Cookie policy
            </a>
          </div>
          <div className="flex flex-col justify-center items-start text-white space-y-1 md:space-y-4">
            <h2 className="text-white font-bold text-lg md:text-xl md:py-2">
              Support
            </h2>
            <a href="/contact" className="hover:underline">
              Contact us
            </a>
            <a
              href="mailto:owner@elliottpromotional.ca"
              className="hover:underline"
            >
              Send an email
            </a>
            <a href="/contact" className="hover:underline">
              Request a quote
            </a>
          </div>
        </div>
      </div>
      <p className="text-white mt-6 mb-16">Copyright 2025 &copy;</p>
    </div>
  );
};

export default Footer;

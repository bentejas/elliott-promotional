import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapserProps {
  id: string;
  title: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const Collapser: React.FC<CollapserProps> = ({
  id,
  title,
  defaultOpen = false,
  children,
}) => {
  // State to control open/closed status
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  // Ref to the content container for height measurement
  const contentRef = useRef<HTMLDivElement>(null);
  // State to dynamically manage the height for smooth transitions
  const [height, setHeight] = useState<number>(0);

  // Check URL hash on mount: if it matches, open the collapser
  useEffect(() => {
    if (window.location.hash === `#${id}`) {
      setIsOpen(true);
    }
  }, [id]);

  // Update the height whenever the open state or children change
  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, children]);

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      id={id}
      className="collapser border rounded-xl bg-black text-white shadow w-full p-4 my-2 cursor-pointer"
    >
      <div className="collapser-header w-full text-left text-2xl font-bold px-4 py-2 flex flex-row justify-between items-center">
        <p>{title}</p>
        <span className="ml-2">{isOpen ? <ChevronUp /> : <ChevronDown />}</span>
      </div>
      <div
        ref={contentRef}
        className="collapser-content transition-all duration-300 overflow-hidden"
        style={{ height }}
      >
        <div className="p-4">{children}</div>
        <p className="text-xs w-full text-left px-4 text-white">
          Find something you like? Let us know by{" "}
          <a href="/contact" className="underline text-red-800 font-bold">
            requesting a quote
          </a>
          .
        </p>
      </div>
    </button>
  );
};

export default Collapser;

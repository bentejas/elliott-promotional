// components/Timeline.tsx
import React from "react";

export interface Step {
  year: string;
  title: string;
}

export const Timeline: React.FC<{ steps: Step[] }> = ({ steps }) => (
  <div className="relative my-12 flex items-center">
    <div className="absolute h-1 bg-gray-300 w-full top-1/2 transform -translate-y-1/2" />
    <div className="relative flex justify-between w-full">
      {steps.map((s, i) => (
        <div key={i} className="group relative flex flex-col items-center">
          <div className="w-4 h-4 bg-blue-600 rounded-full z-10"></div>
          <div className="mt-2 text-sm font-semibold">{s.year}</div>
          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-white p-2 rounded shadow text-xs w-36 text-center">
            {s.title}
          </div>
        </div>
      ))}
    </div>
  </div>
);

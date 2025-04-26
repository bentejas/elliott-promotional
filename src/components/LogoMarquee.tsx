// components/LogoMarquee.tsx
import React from "react";

export const LogoMarquee: React.FC<{ logos: string[] }> = ({ logos }) => (
  <div className="overflow-hidden whitespace-nowrap py-4">
    <div className="inline-block animate-marquee">
      {logos.concat(logos).map((src, i) => (
        <img
          key={i}
          src={src}
          className="inline-block h-16 mx-8 grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition"
        />
      ))}
    </div>
    <style>
      {`
        @keyframes marquee {
          0% { transform: translateX(0) }
          100% { transform: translateX(-50%) }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}
    </style>
  </div>
);

// components/LogoMarquee.tsx
import React from "react";

export const LogoMarquee: React.FC<{ logos: string[] }> = ({ logos }) => (
  <div className="overflow-hidden whitespace-nowrap py-2 md:py-4">
    <div className="inline-block animate-marquee">
      {logos.concat(logos).map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`logo-${i}`}
          className="
            inline-block 
            h-12 md:h-16 
            mx-4 md:mx-8 
            grayscale opacity-75 
            hover:grayscale-0 hover:opacity-100 
            transition
          "
        />
      ))}
    </div>
    <style>{`
      @keyframes marquee {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-marquee {
        /* mobile: faster so you see multiple logos in 10s */
        animation: marquee 10s linear infinite;
      }
      @media (min-width: 768px) {
        .animate-marquee {
          /* desktop: original 20s pace */
          animation-duration: 20s;
        }
      }
    `}</style>
  </div>
);

// components/FeatureBlock.tsx
import React, { useRef, useEffect, useState } from "react";

export const FeatureBlock: React.FC<{
  children: React.ReactNode;
  bg: string;
}> = ({ children, bg }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    obs.observe(ref.current!);
  }, []);
  return (
    <div
      ref={ref}
      className={`
        relative p-12 rounded-xl mb-12 transition-transform duration-700 
        ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
      `}
      style={{
        background: bg,
        backgroundBlendMode: "multiply",
      }}
    >
      {children}
    </div>
  );
};

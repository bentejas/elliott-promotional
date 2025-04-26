// components/AnimatedStat.tsx
import React, { useEffect, useRef, useState } from "react";

interface AnimatedStatProps {
  end: number;
  label: string;
}

export const AnimatedStat: React.FC<AnimatedStatProps> = ({ end, label }) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const duration = 750;
        const startTime = performance.now();

        const animate = (now: number) => {
          const elapsed = now - startTime;
          // progress ∈ [0, 1]
          const progress = Math.min(elapsed / duration, 1);
          setValue(Math.floor(progress * end));

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
        obs.disconnect();
      },
      { threshold: 0.5 }
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl font-bold">{value}+</div>
      <div className="uppercase tracking-wider text-sm">{label}</div>
    </div>
  );
};

// components/Layout.tsx
import { twMerge } from "tailwind-merge";

type Props = {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  /** when set, Layout renders a full-bleed background image behind the rounded section */
  bgImageSrc?: string; // e.g. "/images/background-image.jpg"
  bgImageWebpSrc?: string; // optional: "/images/background-image.webp"
  bgImageAvifSrc?: string; // optional: "/images/background-image.avif"
  objectPosition?: string; // e.g. "50% 30%" to keep the face in frame
  minH?: string; // e.g. "min-h-[70vh]" for hero
};

export const Layout = ({
  children,
  className,
  id,
  bgImageSrc,
  bgImageWebpSrc,
  bgImageAvifSrc,
  objectPosition = "50% 30%",
  minH,
}: Props) => {
  return (
    <section
      id={id}
      className={twMerge(
        // rounded "card" section look
        "relative isolate w-full mx-auto rounded-4xl p-6 md:p-10",
        "bg-white",
        minH,
        className
      )}
    >
      {bgImageSrc && (
        <>
          <picture>
            {bgImageAvifSrc && (
              <source srcSet={bgImageAvifSrc} type="image/avif" />
            )}
            {bgImageWebpSrc && (
              <source srcSet={bgImageWebpSrc} type="image/webp" />
            )}
            <img
              src={bgImageSrc}
              alt=""
              loading="eager"
              fetchPriority="high"
              className="absolute inset-0 -z-10 h-full w-full object-cover"
              style={{ objectPosition }}
            />
          </picture>
          {/* soft overlays to keep text readable + fade into page bg */}
          {/* <div className="absolute inset-0 -z-10 bg-black/10" /> */}
          {/* <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 -z-10 bg-gradient-to-t from-white/90 to-transparent dark:from-zinc-900/90" />
          allow content to sit above the image */}
          <div className="relative z-0" />
        </>
      )}

      {children}
    </section>
  );
};

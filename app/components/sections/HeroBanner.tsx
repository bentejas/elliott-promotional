export function HeroBanner() {
  return (
    <section className="relative isolate min-h-[68vh] md:min-h-[78vh]">
      {/* Background image with format fallbacks */}
      <picture>
        <source srcSet="/images/background-image.avif" type="image/avif" />
        <source srcSet="/images/background-image.webp" type="image/webp" />
        <img
          src="/images/background-image.png"
          alt=""
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover [object-position:50%_30%]"
        />
      </picture>

      {/* Subtle gradient at top + fade to page bg at bottom */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/15 via-black/5 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 -z-10 bg-gradient-to-t from-white to-transparent dark:from-zinc-950" />

      {/* Your hero content */}
      <div className="mx-auto max-w-6xl px-6 pt-28 md:pt-36">
        {/* put the “Bring your brand to life” block + CTA here */}
      </div>
    </section>
  );
}

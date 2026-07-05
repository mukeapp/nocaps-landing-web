"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GetFeaturedCarouselSlides } from "@/lib/api/section-b/market";

interface CarouselSlide {
  imageUrl: string;
  title?: string;
  subtitle?: string;
  showTitle?: boolean;
  showSubtitle?: boolean;
  order: number;
}

// Mirrors mobile's DEFAULT_SLIDES fallback concept — shown until the backend
// slides load (mobile ships hardcoded slides in core/models/section-b/market/carousel).
const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    imageUrl: "/assets/images/default_banner_image_000.png",
    title: "Healthy Grocery Habits",
    subtitle: "Build a smarter shopping routine",
    order: 1,
  },
];

/**
 * Mirrors mobile's FeaturedCarousel (core/components/section-b-3/
 * habit-market-components/FeaturedCarousel): rounded image banner with dim
 * overlay, dark text block (uppercase subtitle + bold title), side chevrons,
 * bottom dots.
 */
export function FeaturedCarousel() {
  const [slides, setSlides] = useState<CarouselSlide[]>(DEFAULT_SLIDES);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    GetFeaturedCarouselSlides().then((res) => {
      if (Array.isArray(res.data) && res.data.length > 0) {
        setSlides([...res.data].sort((a: CarouselSlide, b: CarouselSlide) => a.order - b.order));
      }
    });
  }, []);

  const active = slides[activeIndex];
  const showTitle = Boolean(active?.title && active?.showTitle !== false);
  const showSubtitle = Boolean(active?.subtitle && active?.showSubtitle !== false);

  return (
    <div className="relative mb-4 h-52 overflow-hidden rounded-xl bg-[rgba(41,41,41,1)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={active?.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/20" />

      {(showTitle || showSubtitle) && (
        <div className="absolute inset-x-0 top-0 bg-black/70 px-4 py-2">
          {showSubtitle ? (
            <p className="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-white/70">
              {active.subtitle}
            </p>
          ) : null}
          {showTitle ? <p className="text-[15px] font-bold text-white">{active.title}</p> : null}
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-between px-2">
        <button
          onClick={() => setActiveIndex((p) => (p - 1 + slides.length) % slides.length)}
          className="p-1 text-white"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <button
          onClick={() => setActiveIndex((p) => (p + 1) % slides.length)}
          className="p-1 text-white"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`rounded-full ${
              index === activeIndex ? "h-2.5 w-2.5 bg-white" : "h-2 w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

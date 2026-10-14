"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { formatImageUrl } from "@/utils/image";

interface SpotlightBanner {
  id: string;
  badge?: string;
  badgeBg?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaTheme: "white" | "accent";
  overlayGradient: string;
  image: string;
  targetUrl: string;
}

// Banners using HelpMate's signature brand colors (#48073d, #801C6E, #A21CAF) and project images
const SPOTLIGHT_BANNERS: SpotlightBanner[] = [
  {
    id: "doorstep-car-wash",
    badge: "New launch",
    badgeBg: "var(--accent, #801C6E)",
    title: "Doorstep car\nfoam wash",
    subtitle: "Starting ₹ 399",
    ctaText: "Book now",
    ctaTheme: "white",
    overlayGradient:
      "linear-gradient(90deg, #48073d 0%, #48073d 44%, rgba(72, 7, 61, 0.92) 62%, rgba(72, 7, 61, 0) 100%)",
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80",
    targetUrl: "/services/car-washing?categoryId=6aa80d87c1c096e4af148665",
  },
  {
    id: "deep-clean-home",
    badge: "Bestseller",
    badgeBg: "var(--primary, #48073d)",
    title: "Deep clean\nyour home",
    subtitle: "Complete multi-room sanitisation",
    ctaText: "Book now",
    ctaTheme: "white",
    overlayGradient:
      "linear-gradient(90deg, #801c6e 0%, #801c6e 44%, rgba(128, 28, 110, 0.92) 62%, rgba(128, 28, 110, 0) 100%)",
    image: "/hero-showcase.png",
    targetUrl: "/services/cleaning?item=deep-cleaning-lux",
  },
  {
    id: "power-jet-ac",
    badge: "Summer special",
    badgeBg: "var(--accent, #801C6E)",
    title: "Power-Jet AC\nfoam service",
    subtitle: "Up to 50% power savings",
    ctaText: "Book now",
    ctaTheme: "white",
    overlayGradient:
      "linear-gradient(90deg, #3d0532 0%, #3d0532 44%, rgba(61, 5, 50, 0.92) 62%, rgba(61, 5, 50, 0) 100%)",
    image: "/ac-technician-promo.png",
    targetUrl: "/services/ac?item=ac-jet-service",
  },
  {
    id: "home-painting",
    badge: "Top rated",
    badgeBg: "var(--accent, #801C6E)",
    title: "Home painting\n& waterproofing",
    subtitle: "Pay after 100% satisfaction",
    ctaText: "Book now",
    ctaTheme: "white",
    overlayGradient:
      "linear-gradient(90deg, #2b0323 0%, #2b0323 44%, rgba(43, 3, 35, 0.92) 62%, rgba(43, 3, 35, 0) 100%)",
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80",
    targetUrl: "/services/painting",
  },
  {
    id: "bathroom-deep-clean",
    badge: "Express pick",
    badgeBg: "var(--primary, #48073d)",
    title: "Deep clean\nyour bathroom",
    subtitle: "Intense bathroom descaling",
    ctaText: "Book now",
    ctaTheme: "white",
    overlayGradient:
      "linear-gradient(90deg, #590d4b 0%, #590d4b 44%, rgba(89, 13, 75, 0.92) 62%, rgba(89, 13, 75, 0) 100%)",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    targetUrl: "/services/cleaning?item=bathroom-deep-clean",
  },
];

function BannerImage({ src, alt }: { src: string; alt: string }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  const resolvedSrc = src.startsWith("/") ? src : formatImageUrl(src);

  if (!imgError && resolvedSrc) {
    return (
      <img
        src={resolvedSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className="w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-700 ease-out"
      />
    );
  }

  // Graceful fallback gradient with HelpMate brand colors
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#48073d] via-[#801C6E] to-[#130310]" />
  );
}

export default function InTheSpotlight() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 390;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleCardClick = (targetUrl: string) => {
    router.push(targetUrl);
  };

  return (
    <section id="spotlight" className="py-8 sm:py-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading - styled like Trending */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-primary-lux dark:text-white mt-1">
              In the Spotlight
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs sm:text-sm">
              Flagship curated experiences and season-special home solutions.
            </p>
          </div>
          <Link
            href="/search?view=spotlight"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-lux hover:underline shrink-0 cursor-pointer"
          >
            View all spotlight <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1"
          >
            {SPOTLIGHT_BANNERS.map((banner) => (
              <div
                key={banner.id}
                onClick={() => handleCardClick(banner.targetUrl)}
                className="group relative w-[310px] sm:w-[370px] md:w-[410px] h-[190px] sm:h-[215px] shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none shadow-md hover:shadow-xl transition-all duration-300 border border-[#48073d]/10 dark:border-white/10 snap-start"
              >
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0">
                  <BannerImage
                    src={banner.image}
                    alt={banner.title.replace("\n", " ")}
                  />
                </div>

                {/* HelpMate Project Palette Gradient Overlay */}
                <div
                  className="absolute inset-0 z-1 pointer-events-none"
                  style={{ background: banner.overlayGradient }}
                />

                {/* Content Overlay */}
                <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col justify-between max-w-[64%] sm:max-w-[60%] text-white">
                  {/* Header: Badge + Title + Subtitle */}
                  <div>
                    {banner.badge && (
                      <div className="mb-2">
                        <span
                          className="inline-block text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-md tracking-wide shadow-xs border border-white/15"
                          style={{ backgroundColor: banner.badgeBg }}
                        >
                          {banner.badge}
                        </span>
                      </div>
                    )}

                    <h3 className="font-extrabold text-lg sm:text-xl md:text-[22px] leading-tight whitespace-pre-line tracking-tight text-white drop-shadow-xs">
                      {banner.title}
                    </h3>

                    <p className="text-xs sm:text-[13px] font-medium mt-1 leading-snug text-pink-100/90">
                      {banner.subtitle}
                    </p>
                  </div>

                  {/* Bottom CTA Button */}
                  <div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(banner.targetUrl);
                      }}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-extrabold tracking-tight transition-all active:scale-95 shadow-md cursor-pointer bg-white text-primary-lux hover:bg-pink-50"
                    >
                      {banner.ctaText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Left Arrow Navigation Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Scroll left"
              className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white dark:bg-[#2b0425] text-primary-lux dark:text-white rounded-full shadow-xl border border-[#48073d]/15 dark:border-white/10 items-center justify-center hover:scale-110 hover:border-accent-lux hover:text-accent-lux active:scale-95 transition-all z-20 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Right Arrow Navigation Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Scroll right"
              className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white dark:bg-[#2b0425] text-primary-lux dark:text-white rounded-full shadow-xl border border-[#48073d]/15 dark:border-white/10 items-center justify-center hover:scale-110 hover:border-accent-lux hover:text-accent-lux active:scale-95 transition-all z-20 cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

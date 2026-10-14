"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { formatImageUrl, getNameInitials } from "@/utils/image";
import { fetchCustomerCategoriesApi } from "@/services/categoryApi";
import { fetchCustomerPackagesApi as fetchGlobalPackagesApi } from "@/services/packageApi";

export interface SimpleServiceCard {
  id: string;
  title: string;
  image: string;
  targetUrl: string;
}

export interface CategorySectionData {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  categorySlug: string;
  seeAllUrl: string;
  services: SimpleServiceCard[];
}

// Exactly 3 Curated Core Project Categories with rich data sets (8-9 services each)
const THREE_PROJECT_CATEGORIES: CategorySectionData[] = [
  {
    id: "home-cleaning-pest",
    title: "Cleaning & Pest Control",
    subtitle: "Varanasi's top-rated deep cleaning, sofa shampoo & herbal disinfection",
    categorySlug: "cleaning",
    seeAllUrl: "/search?view=packages&category=Cleaning&categoryId=6a9e855fddcd6e3b74874759",
    services: [
      {
        id: "deep-cleaning-lux",
        title: "Classic Deep Home Cleaning",
        image: "/hero-showcase.png",
        targetUrl: "/services/cleaning?item=deep-cleaning-lux",
      },
      {
        id: "bathroom-deep-clean",
        title: "Bathroom Deep Scrub",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/cleaning?item=bathroom-deep-clean",
      },
      {
        id: "sofa-shampoo-lux",
        title: "Sofa Shampoo & Sanitization",
        image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/cleaning?item=sofa-shampoo-lux",
      },
      {
        id: "herbal-pest-control",
        title: "Ultra-Quiet Herbal Pest Control",
        image: "https://images.unsplash.com/photo-1587582423116-ec07293f0395?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/pest?item=herbal-pest-control",
      },
      {
        id: "kitchen-deep-clean",
        title: "Kitchen Degreasing & Clean",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/cleaning",
      },
      {
        id: "carpet-cleaning-lux",
        title: "Carpet Foam Extraction",
        image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/cleaning",
      },
      {
        id: "balcony-dusting",
        title: "Balcony & Window Dusting",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/cleaning",
      },
      {
        id: "mattress-sanitization",
        title: "Bed Mattress Sanitization",
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/cleaning",
      },
      {
        id: "full-home-disinfection",
        title: "Full Home Disinfection",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/cleaning",
      },
    ],
  },
  {
    id: "ac-appliances",
    badge: "Cooling & Appliances",
    title: "AC & Appliance Repair",
    subtitle: "Doorstep diagnostic and repairs with 90-day HelpMate guarantee",
    categorySlug: "ac",
    seeAllUrl: "/search?view=packages&category=AC%20Servicessss&categoryId=6a6c8abe39a3352837da4c60",
    services: [
      {
        id: "ac-jet-service",
        title: "Foam & Power Jet AC Service",
        image: "/ac-technician-promo.png",
        targetUrl: "/services/ac?item=ac-jet-service",
      },
      {
        id: "split-ac-gas-refill",
        title: "Split AC Gas Refill & Leak Fix",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/ac",
      },
      {
        id: "refrigerator-smart-repair",
        title: "Smart Refrigerator Repair",
        image: "https://images.unsplash.com/photo-1571175432247-fe063c762567?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/appliances?item=refrigerator-smart-repair",
      },
      {
        id: "washing-machine-repair",
        title: "Washing Machine Repair",
        image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/appliances",
      },
      {
        id: "ro-water-purifier",
        title: "RO Water Purifier Service",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/appliances",
      },
      {
        id: "chimney-microwave",
        title: "Chimney & Microwave Repair",
        image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/appliances",
      },
      {
        id: "geyser-heater-service",
        title: "Geyser & Water Heater Service",
        image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/appliances",
      },
      {
        id: "ac-install-uninstall",
        title: "AC Installation & Uninstallation",
        image: "/hero-showcase.png",
        targetUrl: "/services/ac",
      },
    ],
  },
  {
    id: "quick-home-repairs",
    badge: "Urgent 15-30 Min Visits",
    title: "Quick Home Repairs",
    subtitle: "Certified Electricians, Plumbers & Carpenters at your doorstep",
    categorySlug: "electrician",
    seeAllUrl: "/search?view=packages&category=Electrician&categoryId=6aa80cfec1c096e4af148660",
    services: [
      {
        id: "smart-home-automation",
        title: "Smart Switch & Hub Setup",
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/electrician?item=smart-home-automation",
      },
      {
        id: "switchboard-repair",
        title: "Switchboard & Wiring Fix",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/electrician",
      },
      {
        id: "plumbing-smart-inspection",
        title: "Water Leakage Detection & Fix",
        image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/plumbing?item=plumbing-smart-inspection",
      },
      {
        id: "tap-leakage-fix",
        title: "Tap Leakage & Valve Fix",
        image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/plumbing",
      },
      {
        id: "modular-carpentry-fix",
        title: "Modular Cabinet Restoration",
        image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/carpentry?item=modular-carpentry-fix",
      },
      {
        id: "fan-light-fitting",
        title: "Ceiling Fan & Light Fitting",
        image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/electrician",
      },
      {
        id: "drain-unclogging",
        title: "Drain & Sink Unclogging",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/plumbing",
      },
      {
        id: "door-lock-fix",
        title: "Door Lock & Latch Fix",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/carpentry",
      },
      {
        id: "drill-wall-hanging",
        title: "Drill & Wall Hanging",
        image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
        targetUrl: "/services/carpentry",
      },
    ],
  },
];

// Service Card Image with Letter Initials in HelpMate Project Colors (#48073d, #801C6E)
function ServiceImageCard({ image, title }: { image: string; title: string }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [image]);

  const initials = getNameInitials(title, "S");
  const resolvedUrl = image.startsWith("/") ? image : formatImageUrl(image);

  if (!imgError && resolvedUrl) {
    return (
      <img
        src={resolvedUrl}
        alt={title}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#48073d] via-[#610c52] to-[#801C6E] text-white select-none">
      <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 text-white font-black text-xl flex items-center justify-center shadow-md">
        {initials}
      </div>
    </div>
  );
}

// Category Slider Row matching In The Spotlight's smooth sliding UX & navigation controls
function SectionRow({ section }: { section: CategorySectionData }) {
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

  return (
    <div className="py-7 sm:py-9 border-b border-[#48073d]/8 dark:border-white/5 last:border-0">
      {/* Category Row Header styled like Trending */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary-lux dark:text-white mt-1">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs sm:text-sm">
              {section.subtitle}
            </p>
          )}
        </div>

        <Link
          href={section.seeAllUrl}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-lux hover:underline shrink-0 cursor-pointer"
        >
          View all {section.title.toLowerCase()} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Cards Slider Track: In The Spotlight Sliding Behavior with Image + Title ONLY */}
      <div className="relative group/carousel">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2"
        >
          {section.services.map((service) => (
            <div
              key={service.id}
              onClick={() => router.push(service.targetUrl)}
              className="group w-[155px] sm:w-[195px] md:w-[225px] shrink-0 cursor-pointer select-none text-left snap-start"
            >
              {/* Image Container with HelpMate Border Hover & Glow */}
              <div className="w-full aspect-[4/3] sm:aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xs border border-slate-200/70 dark:border-slate-800 group-hover:border-[#801C6E]/50 group-hover:shadow-[0_12px_28px_-6px_rgba(72,7,61,0.20)] transition-all duration-300 relative">
                <ServiceImageCard image={service.image} title={service.title} />
              </div>

              {/* Title Below - Strictly Nothing Else */}
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mt-2 sm:mt-2.5 line-clamp-2 leading-snug group-hover:text-[#801C6E] dark:group-hover:text-pink-300 transition-colors px-0.5">
                {service.title}
              </h4>
            </div>
          ))}
        </div>

        {/* Left Arrow Navigation Button (Exact In The Spotlight Styling) */}
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

        {/* Right Arrow Navigation Button (Exact In The Spotlight Styling) */}
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
  );
}

export default function CategoryServiceSections() {
  const [sections, setSections] = useState<CategorySectionData[]>(THREE_PROJECT_CATEGORIES);

  // Dynamically merge live packages from backend if available into the 3 core categories
  useEffect(() => {
    async function syncBackendPackages() {
      try {
        const [pkgRes, catRes] = await Promise.all([
          fetchGlobalPackagesApi({ limit: 60 }),
          fetchCustomerCategoriesApi(),
        ]);

        const backendCategories = catRes && catRes.success && Array.isArray(catRes.data) ? catRes.data : [];

        const findMatchedBackendCat = (sec: CategorySectionData) => {
          const s = sec.categorySlug.toLowerCase();
          const t = sec.title.toLowerCase();
          return backendCategories.find((c) => {
            const name = c.categoryName.toLowerCase();
            return (
              name === s ||
              name.includes(s) ||
              s.includes(name) ||
              t.includes(name) ||
              (s.includes("clean") && name.includes("clean")) ||
              ((s.includes("ac") || t.includes("ac")) && (name.includes("ac") || name.includes("appliance"))) ||
              ((s.includes("electric") || t.includes("repair")) && (name.includes("electric") || name.includes("repair") || name.includes("plumb") || name.includes("carpenter")))
            );
          });
        };

        if (backendCategories.length > 0 || (pkgRes && pkgRes.success && Array.isArray(pkgRes.data) && pkgRes.data.length > 0)) {
          // Group backend packages by category name
          const catMap = new Map<string, SimpleServiceCard[]>();
          const catIdMap = new Map<string, string>();

          if (pkgRes && pkgRes.success && Array.isArray(pkgRes.data)) {
            for (const item of pkgRes.data) {
              const catName = item.category?.name || "Other Services";
              const catId = item.category?.id || "";
              if (catId) catIdMap.set(catName.toLowerCase(), catId);

              const card: SimpleServiceCard = {
                id: item.package.id,
                title: item.package.name,
                image: item.package.imageUrl || item.package.thumbnailUrl || "",
                targetUrl: `/services/${catName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}?item=${item.package.id}`,
              };

              const existing = catMap.get(catName) || [];
              if (existing.length < 12) {
                existing.push(card);
                catMap.set(catName, existing);
              }
            }
          }

          // Merge backend packages into the 3 core categories and assign packages seeAllUrl
          const updated = THREE_PROJECT_CATEGORIES.map((sec) => {
            const matchedCat = findMatchedBackendCat(sec);
            const dynamicSeeAllUrl = matchedCat
              ? `/search?view=packages&category=${encodeURIComponent(matchedCat.categoryName)}&categoryId=${encodeURIComponent(matchedCat._id)}`
              : sec.seeAllUrl;

            let mergedServices = sec.services;

            for (const [catName, cards] of Array.from(catMap.entries())) {
              const lowerCat = catName.toLowerCase();
              if (
                sec.categorySlug.includes(lowerCat) ||
                lowerCat.includes(sec.categorySlug) ||
                sec.title.toLowerCase().includes(lowerCat)
              ) {
                const existingIds = new Set(cards.map((c) => c.id));
                const remaining = sec.services.filter((s) => !existingIds.has(s.id));
                mergedServices = [...cards, ...remaining].slice(0, 12);
                break;
              }
            }

            return {
              ...sec,
              seeAllUrl: dynamicSeeAllUrl,
              services: mergedServices,
            };
          });

          setSections(updated);
        }
      } catch (err) {
        // Silently preserve project curated default sections
        console.error("Using curated project sections:", err);
      }
    }

    syncBackendPackages();
  }, []);

  return (
    <section id="category-services" className="py-6 sm:py-10 px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-2">
        {sections.map((section) => (
          <SectionRow key={section.id} section={section} />
        ))}
      </div>
    </section>
  );
}

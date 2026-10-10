"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap, ArrowDown, ChevronRight, Sparkles } from "lucide-react";
import { formatImageUrl, getNameInitials } from "@/utils/image";
import { useStore } from "@/store/useStore";
import { fetchCustomerTrendingApi } from "@/services/trendingApi";
import { fetchCustomerPackagesApi } from "@/services/packageApi";

export interface QuickPackage {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  duration?: number;
  imageUrl?: string;
  rating?: number;
  discountText?: string;
}

// 6 Curated Premier Varanasi Packages for Instant Strip Fallback
const FALLBACK_QUICK_PACKAGES: QuickPackage[] = [
  {
    id: "deep-cleaning-lux",
    name: "Deep Home Clean",
    category: "Home Cleaning",
    categorySlug: "home-cleaning",
    price: 1899,
    originalPrice: 2499,
    duration: 240,
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
  },
  {
    id: "ac-jet-service",
    name: "Power Jet AC Service",
    category: "AC Repair & Service",
    categorySlug: "ac-repair-service",
    price: 599,
    originalPrice: 799,
    duration: 60,
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    rating: 4.88,
  },
  {
    id: "bathroom-deep-clean",
    name: "Bathroom Deep Scrub",
    category: "Home Cleaning",
    categorySlug: "home-cleaning",
    price: 449,
    originalPrice: 599,
    duration: 60,
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    rating: 4.85,
  },
  {
    id: "switchboard-repair",
    name: "Switchboard & Wiring",
    category: "Electrician",
    categorySlug: "electrician",
    price: 199,
    originalPrice: 299,
    duration: 30,
    imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80",
    rating: 4.92,
  },
  {
    id: "tap-leakage-fix",
    name: "Tap Leakage Fix",
    category: "Plumber",
    categorySlug: "plumber",
    price: 149,
    originalPrice: 249,
    duration: 30,
    imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80",
    rating: 4.87,
  },
  {
    id: "sofa-shampoo-lux",
    name: "Sofa Shampoo Clean",
    category: "Home Cleaning",
    categorySlug: "home-cleaning",
    price: 799,
    originalPrice: 1099,
    duration: 90,
    imageUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
    rating: 4.91,
  },
];

// Micro Thumbnail with 2-Letter Initials Fallback
function StripThumbnail({
  imageUrl,
  name,
}: {
  imageUrl?: string;
  name: string;
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  const formattedUrl = formatImageUrl(imageUrl);
  const initials = getNameInitials(name, "P");

  if (formattedUrl && !imgError) {
    return (
      <img
        src={formattedUrl}
        alt={name}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4a0e4e] to-slate-900 text-white font-black text-[10px] tracking-tight uppercase select-none">
      {initials}
    </div>
  );
}

export default function QuickServices({
  onExploreAll,
}: {
  onExploreAll?: () => void;
}) {
  const router = useRouter();
  const { token } = useStore();
  const [packages, setPackages] = useState<QuickPackage[]>(FALLBACK_QUICK_PACKAGES);

  // Smooth scroll down to #categories
  const handleScrollToCategories = () => {
    if (onExploreAll) {
      onExploreAll();
      return;
    }
    const categoriesSection = document.getElementById("categories");
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/#categories");
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadPackages() {
      try {
        const trendingRes = await fetchCustomerTrendingApi(token);
        if (
          isMounted &&
          trendingRes.success &&
          trendingRes.data &&
          Array.isArray(trendingRes.data) &&
          trendingRes.data.length > 0
        ) {
          const list: QuickPackage[] = trendingRes.data.slice(0, 6).map((item) => {
            const catName = item.category?.name || "Service";
            const catSlug = catName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
            return {
              id: item.packageId,
              name: item.packageName,
              category: catName,
              categorySlug: catSlug,
              price: item.price,
              originalPrice: item.originalPrice,
              duration: item.duration || 60,
              imageUrl: item.imageUrl || item.thumbnailUrl,
              rating: 4.9,
            };
          });
          setPackages(list);
          return;
        }

        const pkgRes = await fetchCustomerPackagesApi({ limit: 6 }, token);
        if (
          isMounted &&
          pkgRes.success &&
          pkgRes.data &&
          Array.isArray(pkgRes.data) &&
          pkgRes.data.length > 0
        ) {
          const list: QuickPackage[] = pkgRes.data.slice(0, 6).map((item) => {
            const catName = item.category?.name || "Service";
            const catSlug = catName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
            return {
              id: item.package.id,
              name: item.package.name,
              category: catName,
              categorySlug: catSlug,
              price: item.package.price,
              originalPrice: item.package.originalPrice,
              duration: item.package.duration || 60,
              imageUrl: item.package.imageUrl || item.package.thumbnailUrl,
              rating: 4.9,
            };
          });
          setPackages(list);
        }
      } catch (err) {
        // Fallback default packages are used
      }
    }

    loadPackages();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleCardClick = (pkg: QuickPackage) => {
    router.push(`/services/${pkg.categorySlug}?item=${pkg.id}`);
  };

  return (
    <div className="w-full">
      {/* Sleek, Low-Profile Quick Services Strip */}
      <div className="rounded-2xl sm:rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-md shadow-purple-950/5 py-1.5 px-2.5 sm:px-3 flex items-center justify-between gap-2 sm:gap-3 transition-all">
        
        {/* Left: Quick Label Badge */}
        <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-slate-200/80 dark:border-slate-800">
          <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-accent-lux text-white flex items-center justify-center shadow-xs">
            <Zap className="w-3.5 h-3.5 fill-white" />
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100 hidden sm:inline whitespace-nowrap">
            Quick Services
          </span>
        </div>

        {/* Center: 5-6 Compact Package Chips (Horizontal Scroll on Mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar flex-1 py-0.5">
          {packages.slice(0, 6).map((item, idx) => (
            <button
              key={item.id || idx}
              type="button"
              onClick={() => handleCardClick(item)}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl sm:rounded-full bg-slate-100/80 hover:bg-purple-50 dark:bg-slate-800/60 dark:hover:bg-purple-950/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-accent-lux/60 transition-all duration-200 shrink-0 group cursor-pointer shadow-2xs hover:shadow-xs"
              title={`View ${item.name} (₹${item.price})`}
            >
              {/* Micro Thumbnail with initials fallback */}
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-full overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-700 relative">
                <StripThumbnail imageUrl={item.imageUrl} name={item.name} />
              </div>

              {/* Package Name */}
              <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-accent-lux transition-colors whitespace-nowrap max-w-[95px] sm:max-w-[125px] truncate">
                {item.name}
              </span>

              {/* Price */}
              <span className="text-[11px] font-black text-accent-lux shrink-0">
                ₹{item.price}
              </span>
            </button>
          ))}
        </div>

        {/* Right: Explore All Categories Button (Scrolls Down) */}
        <button
          type="button"
          id="quick-explore-all-btn"
          onClick={handleScrollToCategories}
          className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl sm:rounded-full text-xs font-bold bg-accent-lux text-white hover:bg-accent-lux/90 dark:bg-accent-lux shadow-xs shrink-0 cursor-pointer whitespace-nowrap transition-all duration-200 group"
        >
          <span className="hidden xs:inline">Explore All</span>
          <span className="xs:hidden">All</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        </button>

      </div>
    </div>
  );
}

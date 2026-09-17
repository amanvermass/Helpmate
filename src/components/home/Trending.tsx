"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Heart, Clock, ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { fetchCustomerTrendingApi, TrendingPackageItem } from "@/services/trendingApi";
import { formatImageUrl } from "@/utils/image";

export default function Trending() {
  const { bookmarkedPackageIds, toggleBookmark, addNotification, token } = useStore();
  const [trendingItems, setTrendingItems] = useState<TrendingPackageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadTrending() {
      setLoading(true);
      const res = await fetchCustomerTrendingApi(token);
      if (isMounted && res.success && res.data && res.data.length > 0) {
        setTrendingItems(res.data);
      }
      if (isMounted) {
        setLoading(false);
      }
    }
    loadTrending();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleWishlistToggle = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    const isSaved = bookmarkedPackageIds.includes(id);
    toggleBookmark(id);
    addNotification(
      isSaved ? "Bookmark Removed" : "Bookmarked Package",
      isSaved ? `${name} removed from your saved list.` : `${name} has been saved for fast booking.`,
      "info"
    );
  };

  const displayServices = trendingItems.map((item) => {
    const catName = item.category?.name || "Service";
    const catSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const discountText = item.discountPercentage ? `${item.discountPercentage}% OFF` : "Best Deal";
    return {
      id: item.packageId,
      name: item.packageName,
      category: catName,
      categorySlug: catSlug,
      duration: item.duration || 60,
      price: item.price,
      originalPrice: item.originalPrice || item.price,
      discountText,
      image: formatImageUrl(item.imageUrl || item.thumbnailUrl || ""),
      rating: 4.9,
      reviewsCount: 124,
      description: item.description || item.subtitle || `${item.packageName} in ${catName}.`
    };
  });

  // Duplicate services to ensure a seamless infinite sliding marquee track
  const marqueeServices = [...displayServices, ...displayServices, ...displayServices];

  return (
    <section className="py-20 px-6 max-w-full overflow-hidden font-sans relative">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.3333%, 0, 0); }
        }
        .marquee-container {
          display: flex;
          width: max-content;
          animation: marquee-scroll 45s linear infinite;
        }
        .marquee-container:hover {
          animation-play-state: paused;
        }
        `
      }} />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-accent-lux tracking-widest block mb-3">
            Best Sellers
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-primary-lux dark:text-white mt-1">
            Trending Services This Week
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs sm:text-sm">
            Our most popular deep cleaning and home repair bundles booked by Varanasi residents this week.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-slate-900/60 border border-slate-200/10 dark:border-slate-800 rounded-3xl p-4 space-y-4 animate-pulse"
            >
              <div className="h-44 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 w-full" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-200/80 dark:bg-slate-800/80 rounded w-3/4" />
                <div className="h-3 bg-slate-200/50 dark:bg-slate-800/50 rounded w-full" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 bg-slate-200/80 dark:bg-slate-800/80 rounded w-1/3" />
                <div className="h-8 bg-slate-200/80 dark:bg-slate-800/80 rounded-full w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : displayServices.length === 0 ? (
        <div className="max-w-7xl mx-auto glass-panel p-12 text-center text-slate-500 text-xs rounded-3xl">
          No trending packages available at the moment.
        </div>
      ) : (
        /* Sliding Marquee Track */
        <div className="relative w-full overflow-hidden py-4 select-none">
          {/* Soft blur overlays on left and right borders */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50/70 to-transparent dark:from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50/70 to-transparent dark:from-background to-transparent z-10 pointer-events-none" />

          <div className="marquee-container flex gap-8">
            {marqueeServices.map((service, idx) => {
              const isFavorited = bookmarkedPackageIds.includes(service.id);

              return (
                <div
                  key={`${service.id}-${idx}`}
                  className="w-[280px] sm:w-[320px] shrink-0"
                >
                  <Link
                    href={`/services/${service.categorySlug || service.id}?item=${service.id}`}
                    className="glass-panel overflow-hidden group flex flex-col h-full border border-slate-200/10 hover:shadow-lg transition-all duration-300 cursor-pointer block text-left"
                  >
                    {/* Image & Badges */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={formatImageUrl(service.image)}
                        alt={service.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                      {/* Discount Badge */}
                      <span className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 text-primary-lux dark:text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-md tracking-wider">
                        {service.discountText}
                      </span>

                      {/* Heart Toggle */}
                      <button
                        onClick={(e) => handleWishlistToggle(e, service.id, service.name)}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md dark:bg-slate-900/80 flex items-center justify-center text-slate-700 dark:text-white shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFavorited ? "fill-red-500 text-red-500" : "text-slate-600 dark:text-slate-300"}`} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                          <span className="capitalize">{service.category}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {service.duration} mins
                          </span>
                        </div>

                        <h3 className="text-[13px] sm:text-[14px] font-extrabold text-foreground mt-3 group-hover:text-accent-lux transition-colors leading-snug truncate">
                          {service.name}
                        </h3>

                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                            ★ {service.rating}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({service.reviewsCount} reviews)
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 leading-relaxed line-clamp-2">
                          {service.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider leading-none">Rate</span>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-[13px] font-black text-foreground font-sans">₹{service.price}</span>
                            <span className="text-[10px] text-slate-455 line-through font-sans">₹{service.originalPrice}</span>
                          </div>
                        </div>

                        <div
                          className="inline-flex items-center gap-1 bg-primary-lux hover:bg-slate-800 dark:bg-accent-lux dark:hover:bg-accent-lux/95 text-white font-bold text-[10px] px-4 py-2 rounded-full shadow-md transition-colors cursor-pointer"
                        >
                          Book Now <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

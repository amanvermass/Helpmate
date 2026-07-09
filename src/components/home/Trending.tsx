"use client";

import Link from "next/link";
import { Star, Heart, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { services } from "@/utils/mockData";

export default function Trending() {
  const { wishlist, toggleWishlist, addNotification } = useStore();

  const handleWishlistToggle = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    toggleWishlist(id);
    const isSaved = wishlist.includes(id);
    addNotification(
      isSaved ? "Removed from Wishlist" : "Added to Wishlist",
      isSaved ? `${name} removed from your saved list.` : `${name} has been saved for fast booking.`,
      "info"
    );
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto font-sans relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-accent-lux tracking-widest block mb-3">
            Step 3: Best Sellers
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-primary-lux dark:text-white mt-1">
            Trending Services This Week
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs sm:text-sm">
            Our most popular deep cleaning and home repair bundles booked by Varanasi residents this week.
          </p>
        </div>
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-lux hover:underline cursor-pointer"
        >
          View all trending packages <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.slice(0, 3).map((service, idx) => {
          const isFavorited = wishlist.includes(service.id);

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="glass-panel overflow-hidden group flex flex-col h-full border border-slate-200/10"
            >
              {/* Image & Badges */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
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
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md dark:bg-slate-900/80 flex items-center justify-center text-slate-700 dark:text-white shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : "text-slate-600 dark:text-slate-300"}`} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <span className="capitalize">{service.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {service.duration} mins
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground mt-3 group-hover:text-accent-lux transition-colors leading-snug">
                    {service.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {service.rating}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({service.reviewsCount} reviews)
                    </span>
                  </div>

                  <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-4 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Luxury Deal</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-foreground">₹{service.price}</span>
                      <span className="text-xs text-slate-400 line-through">₹{service.originalPrice}</span>
                    </div>
                  </div>

                  <Link
                    href={`/services/${service.id}`}
                    className="inline-flex items-center gap-1.5 bg-primary-lux hover:bg-slate-800 dark:bg-accent-lux dark:hover:bg-accent-lux/95 text-white font-bold text-xs px-5 py-3 rounded-full shadow-md transition-colors cursor-pointer"
                  >
                    Book Now <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Star, Users, Shield, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { services } from "@/utils/mockData";

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof services>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  // Stats counting simulator
  const [completedCount, setCompletedCount] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    // Stats ticker simulation
    let countInterval = setInterval(() => {
      setCompletedCount((prev) => {
        if (prev >= 45000) {
          clearInterval(countInterval);
          return 45280;
        }
        return prev + 1200;
      });
    }, 30);

    let ratingInterval = setInterval(() => {
      setRatingCount((prev) => {
        if (prev >= 4.9) {
          clearInterval(ratingInterval);
          return 4.92;
        }
        return prev + 0.15;
      });
    }, 40);

    return () => {
      clearInterval(countInterval);
      clearInterval(ratingInterval);
    };
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = services.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 4));
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (id: string) => {
    router.push(`/services/${id}`);
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 px-6 overflow-hidden">
      
      {/* Background Animated Blobs */}
      <div className="blob-container">
        <div className="blob bg-accent-lux w-[400px] h-[400px] -top-20 -left-20 animate-float-blob" />
        <div className="blob bg-secondary-lux w-[400px] h-[400px] bottom-10 right-10" style={{ animationDelay: "4s" }} />
      </div>

      <div className="max-w-4xl mx-auto text-center z-10 font-sans mt-8">
        {/* Subtitle Badge */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[10px] uppercase font-bold text-accent-lux tracking-widest mb-5"
        >
          The Gold Standard of Home Services
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-bold tracking-tight text-primary-lux dark:text-white leading-tight"
        >
          What service do you <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-accent-lux via-secondary-lux to-accent-lux bg-clip-text text-transparent">
            need today?
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-slate-500 dark:text-slate-400 mt-6 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
        >
          Book 5-star certified cleaners, technicians, and therapists. Premium equipment, transparent hourly billing, and post-service warranty.
        </motion.p>

        {/* Large Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 max-w-2xl mx-auto relative"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center p-2 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 shadow-xl dark:shadow-slate-950/50"
          >
            <div className="flex-1 flex items-center pl-4 pr-2">
              <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Search home salon, deep cleaning, smart automation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder-slate-400 py-3"
              />
            </div>
            <button
              type="submit"
              className="bg-primary-lux hover:bg-slate-800 text-white dark:bg-accent-lux dark:hover:bg-accent-lux/90 rounded-[24px] px-6 py-3.5 text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              Search <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute left-0 right-0 mt-3 p-3 glass-panel z-30 shadow-2xl text-left border border-slate-200/20"
              >
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3 mb-2">Live Suggestions</p>
                <div className="space-y-1">
                  {suggestions.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => handleSuggestionClick(item.id)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-xs font-bold text-foreground">{item.name}</p>
                          <p className="text-[10px] text-slate-400 capitalize">{item.category} • {item.duration} mins</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-accent-lux">₹{item.price}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick Recommendation Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 flex flex-wrap gap-2.5 justify-center text-xs text-slate-400"
        >
          <span>Popular:</span>
          {["Deep Cleaning", "AC Service", "Facial Combo", "Smart Switch"].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSearchQuery(tag);
                router.push(`/search?q=${encodeURIComponent(tag)}`);
              }}
              className="text-slate-600 dark:text-slate-300 hover:text-accent-lux dark:hover:text-accent-lux transition-colors font-semibold"
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Live Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.5 }}
          className="grid grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto"
        >
          <div className="glass-panel p-4 flex flex-col items-center">
            <Users className="w-5 h-5 text-accent-lux mb-2" />
            <span className="text-lg font-bold text-foreground tracking-tight">
              {completedCount.toLocaleString()}+
            </span>
            <span className="text-[10px] text-slate-500 uppercase mt-0.5 tracking-wider font-semibold">Jobs Completed</span>
          </div>

          <div className="glass-panel p-4 flex flex-col items-center">
            <Star className="w-5 h-5 text-amber-500 mb-2 fill-amber-500" />
            <span className="text-lg font-bold text-foreground tracking-tight">
              {ratingCount.toFixed(2)}/5
            </span>
            <span className="text-[10px] text-slate-500 uppercase mt-0.5 tracking-wider font-semibold">Service Rating</span>
          </div>

          <div className="glass-panel p-4 flex flex-col items-center">
            <Shield className="w-5 h-5 text-success-lux mb-2" />
            <span className="text-lg font-bold text-foreground tracking-tight">100%</span>
            <span className="text-[10px] text-slate-500 uppercase mt-0.5 tracking-wider font-semibold">Insured Guarantee</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

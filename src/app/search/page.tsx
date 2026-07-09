"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Mic,
  Star,
  Clock,
  Heart,
  SlidersHorizontal,
  X,
  TrendingUp,
  ArrowRight,
  Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { services, categories } from "@/utils/mockData";
import { useStore } from "@/store/useStore";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const { wishlist, toggleWishlist, addNotification } = useStore();

  // Search queries
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCat, setSelectedCat] = useState(searchParams.get("category") || "");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [availability, setAvailability] = useState<string>("");
  const [searchSuggestions, setSearchSuggestions] = useState<typeof services>([]);

  useEffect(() => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      return;
    }
    const filtered = services.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase())
    );
    setSearchSuggestions(filtered.slice(0, 4));
  }, [query]);

  // UI state
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceText, setVoiceText] = useState("Listening for your request...");

  // Smart recommendations list
  const smartRecommendations = [
    { label: "Deep Kitchen Degreasing", query: "cleaning", searchTerm: "Cleaning" },
    { label: "AC Gas Leak Refill", query: "ac", searchTerm: "AC" },
    { label: "Relaxing Hair Spa", query: "beauty", searchTerm: "Hair Spa" },
    { label: "Smart Switch Hub Install", query: "electrician", searchTerm: "Smart Switch" }
  ];

  // Sync URL search queries
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setSelectedCat(searchParams.get("category") || "");
  }, [searchParams]);

  // Voice recognition simulation
  const startVoiceSearch = () => {
    setVoiceActive(true);
    setVoiceText("Listening for your service request...");
    
    // Stage 1: Simulating voice pick-up
    setTimeout(() => {
      setVoiceText('Recognizing: "AC Power Jet wash"...');
    }, 1500);

    // Stage 2: Simulating parsing
    setTimeout(() => {
      setVoiceText('Searching for: "AC Service"');
    }, 2800);

    // Stage 3: Resolve query
    setTimeout(() => {
      setVoiceActive(false);
      setQuery("AC Service");
      router.push(`/search?q=${encodeURIComponent("AC Service")}`);
      addNotification("Voice Request Resolved", 'Filtered results for "AC Service"', "info");
    }, 3800);
  };

  const handleWishlistToggle = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
    const isSaved = wishlist.includes(id);
    addNotification(
      isSaved ? "Removed from Wishlist" : "Saved to Wishlist",
      isSaved ? `${name} removed.` : `${name} saved.`,
      "info"
    );
  };

  // Filter computation
  const filteredServices = services.filter((s) => {
    // Search query check
    const matchesQuery = query
      ? s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase()) ||
        s.category.toLowerCase().includes(query.toLowerCase())
      : true;

    // Category check
    const matchesCategory = selectedCat ? s.category === selectedCat : true;

    // Rating check
    const matchesRating = minRating ? s.rating >= minRating : true;

    // Price check
    const matchesPrice = s.price <= maxPrice;

    return matchesQuery && matchesCategory && matchesRating && matchesPrice;
  });

  return (
    <>
      <Header />

      <main className="flex-1 pt-24 font-sans bg-slate-50/50 dark:bg-background pb-12">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Top Search Banner */}
          <div className="py-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="flex-1 relative">
              <form onSubmit={(e) => { e.preventDefault(); router.push(`/search?q=${encodeURIComponent(query)}`); setSearchSuggestions([]); }}>
                <input
                  type="text"
                  placeholder="What service can we clean, fix, or style today?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:border-accent-lux focus:ring-1 focus:ring-accent-lux text-foreground shadow-sm"
                />
              </form>
              <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
              
              {/* Voice Trigger */}
              <button
                onClick={startVoiceSearch}
                className="absolute right-4 top-3.5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-accent-lux hover:text-white dark:hover:bg-accent-lux text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all duration-300 cursor-pointer"
                title="Voice Search"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Auto Suggestions Dropdown */}
              <AnimatePresence>
                {searchSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute left-0 right-0 mt-2 p-2.5 glass-panel z-50 shadow-2xl text-left border border-slate-200/20"
                  >
                    <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider px-2.5 mb-1.5">Suggestions</p>
                    <div className="space-y-0.5">
                      {searchSuggestions.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSearchSuggestions([]);
                            router.push(`/services/${item.id}`);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                            <div>
                              <p className="text-[11px] font-bold text-foreground line-clamp-1">{item.name}</p>
                              <p className="text-[9px] text-slate-400 capitalize">{item.category} • {item.duration} mins</p>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-accent-lux shrink-0">₹{item.price}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Filters Trigger */}
            <button
              onClick={() => setShowFiltersMobile(true)}
              className="md:hidden flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-accent-lux" /> Filters
            </button>
          </div>

          {/* Smart recommendation chips */}
          <div className="py-4 flex flex-wrap gap-2.5 items-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-accent-lux" /> Smart Recommendations:
            </span>
            {smartRecommendations.map((sug) => (
              <button
                key={sug.label}
                onClick={() => {
                  setQuery(sug.searchTerm);
                  setSelectedCat(sug.query);
                }}
                className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 px-3.5 py-1.5 rounded-full hover:border-accent-lux dark:hover:border-accent-lux hover:text-accent-lux transition-all cursor-pointer shadow-sm"
              >
                {sug.label}
              </button>
            ))}
          </div>

          {/* Core Search Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mt-6">
            
            {/* Left Filter Sidebar (Desktop) */}
            <aside className="hidden md:block md:col-span-3 glass-panel p-6 border border-slate-200/10 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-foreground">Filter Catalog</span>
                <button
                  onClick={() => {
                    setQuery("");
                    setSelectedCat("");
                    setMinRating(null);
                    setMaxPrice(3000);
                  }}
                  className="text-[10px] text-accent-lux hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Service Category</span>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCat("")}
                    className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedCat === ""
                        ? "bg-accent-lux/10 text-accent-lux"
                        : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.slice(0, 7).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCat(cat.id)}
                      className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg font-bold transition-all capitalize cursor-pointer ${
                        selectedCat === cat.id
                          ? "bg-accent-lux/10 text-accent-lux"
                          : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <span>Max Budget</span>
                  <span className="text-foreground">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="3000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-lux"
                />
              </div>

              {/* Ratings */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Minimum Rating</span>
                <div className="flex gap-2">
                  {[4.5, 4.8, 4.9].map((rating) => {
                    const isSel = minRating === rating;
                    return (
                      <button
                        key={rating}
                        onClick={() => setMinRating(isSel ? null : rating)}
                        className={`flex-1 py-1.5 rounded-full border text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          isSel
                            ? "bg-accent-lux text-white border-accent-lux"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {rating}+
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Right Search Grid */}
            <div className="md:col-span-9 space-y-6">
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Showing <span className="font-bold text-foreground">{filteredServices.length}</span> luxury options
                </p>
              </div>

              {/* Grid Result */}
              {filteredServices.length === 0 ? (
                <div className="glass-panel p-12 text-center flex flex-col items-center max-w-lg mx-auto border border-slate-200/10">
                  <SlidersHorizontal className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
                  <h3 className="font-bold text-base text-foreground">No Services Found</h3>
                  <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                    We couldn't find matching luxury items. Try relaxing your budget slider or searching a different key term.
                  </p>
                  <button
                    onClick={() => {
                      setQuery("");
                      setSelectedCat("");
                      setMinRating(null);
                      setMaxPrice(3000);
                    }}
                    className="mt-6 px-6 py-2.5 rounded-full bg-primary-lux hover:bg-slate-800 dark:bg-accent-lux text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Reset Filter View
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service, idx) => {
                    const isFavorited = wishlist.includes(service.id);

                    return (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        onClick={() => router.push(`/services/${service.id}`)}
                        className="glass-panel overflow-hidden group flex flex-col h-full border border-slate-200/10 hover:shadow-xl duration-300 cursor-pointer"
                      >
                        {/* Image Frame */}
                        <div className="relative h-44 overflow-hidden shrink-0">
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-60" />
                          <button
                            onClick={(e) => handleWishlistToggle(e, service.id, service.name)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFavorited ? "fill-red-500 text-red-500" : "text-slate-600 dark:text-slate-300"}`} />
                          </button>
                          <span className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/95 text-primary-lux dark:text-white text-[8px] font-extrabold px-2.5 py-1 rounded-full shadow-md tracking-wider">
                            {service.discountText}
                          </span>
                        </div>

                        {/* Card Info */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                              <span className="capitalize">{service.category}</span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {service.duration} mins</span>
                            </div>
                            
                            <h3 className="text-sm font-bold text-foreground mt-2 group-hover:text-accent-lux transition-colors leading-snug line-clamp-1">
                              {service.name}
                            </h3>

                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {service.rating}
                              </span>
                              <span className="text-[9px] text-slate-400">({service.reviewsCount})</span>
                            </div>

                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 leading-relaxed line-clamp-2">
                              {service.description}
                            </p>
                          </div>

                          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                            <div className="flex items-baseline gap-1">
                              <span className="text-sm font-bold text-foreground">₹{service.price}</span>
                              <span className="text-[10px] text-muted-lux line-through">₹{service.originalPrice}</span>
                            </div>
                            <span
                              className="text-[10px] font-bold text-accent-lux flex items-center gap-0.5 hover:underline cursor-pointer"
                            >
                              Explore <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Voice Search Simulation Overlay */}
      <AnimatePresence>
        {voiceActive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="relative w-full max-w-md glass-panel bg-white/10 border-white/10 p-8 flex flex-col items-center text-center shadow-2xl space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-accent-lux/20 border border-accent-lux/30 flex items-center justify-center text-white relative">
                <Volume2 className="w-8 h-8 animate-pulse text-white" />
                {/* Voice ripples */}
                <div className="absolute inset-0 w-full h-full rounded-full border border-accent-lux/40 animate-ping" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider animate-pulse">Voice Assistant Active</span>
                <p className="text-sm font-bold text-white leading-relaxed">{voiceText}</p>
              </div>

              {/* Dynamic waveform simulation lines */}
              <div className="flex items-center gap-1 pt-4 justify-center h-8">
                {[...Array(8)].map((_, i) => (
                  <span
                    key={i}
                    className="w-1 bg-accent-lux rounded-full animate-pulse"
                    style={{
                      height: `${15 + Math.random() * 20}px`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: `${0.4 + Math.random() * 0.5}s`
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => setVoiceActive(false)}
                className="px-6 py-2 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 text-[10px] font-bold tracking-wider uppercase cursor-pointer"
              >
                Cancel Assistant
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 text-xs">Loading search results...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}

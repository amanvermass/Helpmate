"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
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
  Volume2,
  Package,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Tag,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { formatImageUrl } from "@/utils/image";
import { useStore } from "@/store/useStore";
import {
  fetchCustomerCategoriesApi,
  fetchCustomerSubCategoriesApi,
  CategoryItem,
  SubCategoryItem,
} from "@/services/categoryApi";
import {
  fetchCustomerPackagesApi,
  CustomerPackageItem,
} from "@/services/packageApi";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { wishlist, toggleWishlist, addNotification, addToCart, clearCart, cart } = useStore();

  // Dynamic API Categories & Subcategories State
  const [dynamicCategories, setDynamicCategories] = useState<CategoryItem[]>([]);
  const [activeSubCategories, setActiveSubCategories] = useState<SubCategoryItem[]>([]);
  const [selectedSubCat, setSelectedSubCat] = useState<string>("");

  // Search queries
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCat, setSelectedCat] = useState(searchParams.get("category") || "");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [isBudgetApplied, setIsBudgetApplied] = useState<boolean>(false);
  const [searchSuggestions, setSearchSuggestions] = useState<CustomerPackageItem[]>([]);

  // Fetch dynamic categories from backend API
  useEffect(() => {
    async function loadCategories() {
      const res = await fetchCustomerCategoriesApi();
      if (res.success && res.data) {
        setDynamicCategories(res.data);
      }
    }
    loadCategories();
  }, []);

  // Dynamic Packages State from Backend API
  const [apiPackages, setApiPackages] = useState<CustomerPackageItem[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Fetch subcategories when a category is selected
  useEffect(() => {
    async function loadSubCategories() {
      if (!selectedCat) {
        setActiveSubCategories([]);
        setSelectedSubCat("");
        return;
      }

      const foundCat = dynamicCategories.find(
        (c) => c._id === selectedCat || c.categoryName.toLowerCase().includes(selectedCat.toLowerCase())
      );

      if (foundCat) {
        const res = await fetchCustomerSubCategoriesApi(foundCat._id);
        if (res.success && res.data) {
          setActiveSubCategories(res.data);
        }
      }
    }

    loadSubCategories();
  }, [selectedCat, dynamicCategories]);

  // Fetch packages from GET /api/customer/packages using search/category/subcategory/maxBudget/page filters
  useEffect(() => {
    let isMounted = true;
    async function loadPackages() {
      setIsLoadingPackages(true);
      try {
        const foundCat = selectedCat
          ? dynamicCategories.find(
              (c) => c._id === selectedCat || c.categoryName.toLowerCase().includes(selectedCat.toLowerCase())
            )
          : undefined;

        const foundSubCat = selectedSubCat
          ? activeSubCategories.find(
              (sc) => sc._id === selectedSubCat || sc.name.toLowerCase() === selectedSubCat.toLowerCase()
            )
          : undefined;

        const categoryIdParam = selectedCat ? (foundCat?._id || (selectedCat.length === 24 ? selectedCat : undefined)) : undefined;
        const subCategoryIdParam = selectedSubCat ? (foundSubCat?._id || (selectedSubCat.length === 24 ? selectedSubCat : undefined)) : undefined;

        const res = await fetchCustomerPackagesApi({
          categoryId: categoryIdParam,
          subCategoryId: subCategoryIdParam,
          search: query.trim() || undefined,
          maxBudget: isBudgetApplied ? maxPrice : undefined,
          page: currentPage,
          limit: 12
        });

        if (isMounted && res.success) {
          setApiPackages(res.data || []);
          if (res.pagination) {
            setTotalPages(res.pagination.totalPages);
            setTotalItems(res.pagination.total);
          }
        }
      } catch (err) {
        console.error("Error loading packages from API:", err);
      } finally {
        if (isMounted) setIsLoadingPackages(false);
      }
    }

    loadPackages();
    return () => {
      isMounted = false;
    };
  }, [query, selectedCat, selectedSubCat, maxPrice, isBudgetApplied, currentPage, dynamicCategories, activeSubCategories]);

  // Ref for outside click detection & live search suggestions
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      return;
    }
    const filtered = apiPackages.filter((item) =>
      item.package.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category?.name.toLowerCase().includes(query.toLowerCase()) ||
      item.subCategory?.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchSuggestions(filtered.slice(0, 4));
  }, [query, apiPackages]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setSearchSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // UI state
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceText, setVoiceText] = useState("Listening for your request...");

  // Sync URL search queries
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    const cat = searchParams.get("categoryId") || searchParams.get("category");
    if (cat) setSelectedCat(cat);
    const sub = searchParams.get("subCategoryId") || searchParams.get("sub");
    if (sub) setSelectedSubCat(sub);
  }, [searchParams]);

  // Voice recognition simulation
  const startVoiceSearch = () => {
    setVoiceActive(true);
    setVoiceText("Listening for your service request...");

    setTimeout(() => {
      setVoiceText('Recognizing: "Split AC breakdown repair"...');
    }, 1500);

    setTimeout(() => {
      setVoiceText('Searching live catalog...');
    }, 2800);

    setTimeout(() => {
      setVoiceActive(false);
      setQuery("AC");
      router.push(`/search?q=${encodeURIComponent("AC")}`);
      addNotification("Voice Request Resolved", 'Filtered results for "AC"', "info");
    }, 3800);
  };

  const handleWishlistToggle = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
    const isSaved = wishlist.includes(id);
    addNotification(
      isSaved ? "Removed from Saved" : "Saved Package",
      isSaved ? `${name} removed.` : `${name} saved.`,
      "info"
    );
  };

  const handleAddToCart = (e: React.MouseEvent, item: CustomerPackageItem) => {
    e.preventDefault();
    e.stopPropagation();
    const pkg = item.package;
    addToCart({
      id: pkg.id,
      itemId: pkg.id,
      category: item.category?.name || "Service",
      name: pkg.name,
      price: pkg.price,
      duration: pkg.duration || 60,
      selectedAddons: (item.addons || []).map((a) => ({
        addonId: a._id,
        addonName: a.addonName,
        price: a.price,
        quantity: 1,
        totalPrice: a.price,
      })),
    });
    addNotification("Added to Cart", `${pkg.name} added to your cart.`, "success");
  };

  const handleBookNow = (e: React.MouseEvent, item: CustomerPackageItem) => {
    e.preventDefault();
    e.stopPropagation();
    const pkg = item.package;
    clearCart();
    addToCart({
      id: pkg.id,
      itemId: pkg.id,
      category: item.category?.name || "Service",
      name: pkg.name,
      price: pkg.price,
      duration: pkg.duration || 60,
      selectedAddons: (item.addons || []).map((a) => ({
        addonId: a._id,
        addonName: a.addonName,
        price: a.price,
        quantity: 1,
        totalPrice: a.price,
      })),
    });
    router.push("/booking");
  };

  return (
    <>
      <Header />

      <main className="flex-1 pt-24 font-sans bg-slate-50/50 dark:bg-background pb-16">
        <div className="max-w-7xl mx-auto px-6">

          {/* Page Header */}
          <div className="pt-2 pb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">All Services & Packages</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Browse all verified professional packages delivered by certified specialists</p>
          </div>

          {/* Top Search Banner */}
          <div className="py-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div ref={searchWrapperRef} className="flex-1 relative">
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

              {/* Auto Suggestions Dropdown from live API Packages */}
              <AnimatePresence>
                {searchSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute left-0 right-0 mt-2 p-2.5 glass-panel z-50 shadow-2xl text-left border border-slate-200/20 rounded-2xl"
                  >
                    <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider px-2.5 mb-1.5">Package Suggestions</p>
                    <div className="space-y-0.5">
                      {searchSuggestions.map((item) => {
                        const pkg = item.package;
                        const categorySlug = item.category?.name
                          ? item.category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                          : (item.category?.id || pkg.id);

                        return (
                          <button
                            key={pkg.id}
                            type="button"
                            onClick={() => {
                              setSearchSuggestions([]);
                              router.push(`/services/${categorySlug}?item=${pkg.id}`);
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              {pkg.imageUrl ? (
                                <img src={formatImageUrl(pkg.imageUrl)} alt={pkg.name} className="w-8 h-8 rounded-lg object-cover" />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                  <Package className="w-4 h-4" />
                                </div>
                              )}
                              <div>
                                <p className="text-[11px] font-bold text-foreground line-clamp-1">{pkg.name}</p>
                                <p className="text-[9px] text-slate-400 capitalize">{item.category?.name || "Service"} • {pkg.duration || 60} mins</p>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-accent-lux shrink-0">₹{pkg.price}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Filters Trigger */}
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-accent-lux" /> Filters
            </button>
          </div>

          {/* Dynamic Category Quick-Chips */}
          {dynamicCategories.length > 0 && (
            <div className="py-4 flex flex-wrap gap-2 items-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5 mr-1">
                <TrendingUp className="w-3.5 h-3.5 text-accent-lux" /> Categories:
              </span>
              {dynamicCategories.map((cat) => {
                const isActive = selectedCat === cat._id;
                return (
                  <button
                    key={cat._id}
                    onClick={() => {
                      if (isActive) {
                        setSelectedCat("");
                        setSelectedSubCat("");
                      } else {
                        setSelectedCat(cat._id);
                        setSelectedSubCat("");
                      }
                      setCurrentPage(1);
                    }}
                    className={`text-[11px] font-semibold px-3.5 py-1.5 rounded-full border transition-all cursor-pointer shadow-sm ${
                      isActive
                        ? "bg-[#48073d] text-white dark:bg-accent-lux border-[#48073d] dark:border-accent-lux"
                        : "bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-accent-lux"
                    }`}
                  >
                    {cat.categoryName}
                  </button>
                );
              })}
            </div>
          )}

          {/* Core Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mt-6">

            {/* Left Filter Sidebar */}
            <aside className={`md:block md:col-span-3 glass-panel p-6 border border-slate-200/10 space-y-6 ${showFiltersMobile ? "block" : "hidden"}`}>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-foreground">Filter Catalog</span>
                <button
                  onClick={() => {
                    setQuery("");
                    setSelectedCat("");
                    setSelectedSubCat("");
                    setMinRating(null);
                    setMaxPrice(10000);
                    setIsBudgetApplied(false);
                    setCurrentPage(1);
                  }}
                  className="text-[10px] text-accent-lux font-bold hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Service Category</span>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  <button
                    onClick={() => {
                      setSelectedCat("");
                      setSelectedSubCat("");
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedCat === ""
                        ? "bg-accent-lux/10 text-accent-lux"
                        : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    All Categories
                  </button>

                  {dynamicCategories.map((cat) => {
                    const isSelected = selectedCat === cat._id;
                    return (
                      <button
                        key={cat._id}
                        onClick={() => {
                          setSelectedCat(isSelected ? "" : cat._id);
                          setSelectedSubCat("");
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg font-bold transition-all capitalize cursor-pointer ${
                          isSelected
                            ? "bg-accent-lux/10 text-accent-lux"
                            : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {cat.categoryName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subcategories (Dynamic when category selected) */}
              {activeSubCategories.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-accent-lux tracking-wider">Subcategories</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeSubCategories.map((subCat) => {
                      const isActive = selectedSubCat === subCat._id || selectedSubCat === subCat.name;
                      return (
                        <button
                          key={subCat._id}
                          onClick={() => {
                            if (isActive) {
                              setSelectedSubCat("");
                            } else {
                              setSelectedSubCat(subCat._id);
                            }
                            setCurrentPage(1);
                          }}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                            isActive
                              ? "bg-accent-lux text-white border-accent-lux"
                              : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-accent-lux"
                          }`}
                        >
                          {subCat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price range */}
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <span>Max Budget {isBudgetApplied ? "(Applied)" : "(Off)"}</span>
                  <span className="text-foreground font-sans font-bold">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="10000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setIsBudgetApplied(true);
                  }}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-lux"
                />
                {isBudgetApplied && (
                  <button
                    onClick={() => {
                      setIsBudgetApplied(false);
                      setMaxPrice(10000);
                    }}
                    className="text-[9px] text-accent-lux font-bold hover:underline block"
                  >
                    Remove budget filter
                  </button>
                )}
              </div>
            </aside>

            {/* Right Search Grid */}
            <div className="md:col-span-9 space-y-6">

              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">
                  Showing <span className="font-bold text-foreground font-sans">{totalItems || apiPackages.length}</span> verified packages
                </p>
                {totalPages > 1 && (
                  <p className="text-xs text-slate-400 font-semibold font-sans">
                    Page {currentPage} of {totalPages}
                  </p>
                )}
              </div>

              {/* Loading Skeleton */}
              {isLoadingPackages ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="bg-white dark:bg-slate-900/60 rounded-2xl p-4 space-y-4 border border-slate-100 dark:border-slate-800 animate-pulse">
                      <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                      <div className="flex justify-between items-center pt-2">
                        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : apiPackages.length === 0 ? (
                <div className="glass-panel p-12 text-center flex flex-col items-center max-w-lg mx-auto border border-slate-200/10 rounded-3xl">
                  <Package className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
                  <h3 className="font-bold text-base text-foreground">No Packages Found</h3>
                  <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                    We couldn't find matching packages for this selection. Try clearing your filters or selecting another category.
                  </p>
                  <button
                    onClick={() => {
                      setQuery("");
                      setSelectedCat("");
                      setSelectedSubCat("");
                      setMinRating(null);
                      setMaxPrice(10000);
                      setIsBudgetApplied(false);
                      setCurrentPage(1);
                    }}
                    className="mt-6 px-6 py-2.5 rounded-full bg-[#48073d] text-white dark:bg-accent-lux text-xs font-bold shadow-md cursor-pointer hover:brightness-110"
                  >
                    Reset Filter View
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Dynamic API Package Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apiPackages.map((item, idx) => {
                      const pkg = item.package;
                      const isFavorited = wishlist.includes(pkg.id);
                      const isCartAdded = cart.some(c => c.id === pkg.id || c.itemId === pkg.id);
                      const categorySlug = item.category?.name
                        ? item.category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                        : (item.category?.id || pkg.id);

                      return (
                        <motion.div
                          key={pkg.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.04 }}
                          onClick={() => router.push(`/services/${categorySlug}?item=${pkg.id}`)}
                          className="group relative bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/60 dark:border-slate-800 hover:border-accent-lux/40 dark:hover:border-accent-lux/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer hover:-translate-y-1"
                        >
                          {/* Card Top Banner / Media */}
                          <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                            {pkg.imageUrl ? (
                              <img
                                src={formatImageUrl(pkg.imageUrl)}
                                alt={pkg.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 bg-gradient-to-br from-purple-900/20 via-slate-900 to-slate-950">
                                <Package className="w-10 h-10 text-accent-lux/60 mb-1" />
                                <span className="text-xs font-bold text-slate-300 text-center">{pkg.name}</span>
                              </div>
                            )}

                            {/* Overlay Gradients */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                            {/* Category & Subcategory Pills */}
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 max-w-[80%]">
                              {item.category?.name && (
                                <span className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-850 dark:text-slate-100 backdrop-blur-md shadow-sm">
                                  {item.category.name}
                                </span>
                              )}
                              {item.subCategory?.name && (
                                <span className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#48073d]/90 text-white backdrop-blur-md shadow-sm">
                                  {item.subCategory.name}
                                </span>
                              )}
                            </div>

                            {/* Wishlist / Bookmark Toggle */}
                            <button
                              onClick={(e) => handleWishlistToggle(e, pkg.id, pkg.name)}
                              className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm z-10 ${
                                isFavorited || pkg.isBookmarked
                                  ? "bg-rose-500 text-white"
                                  : "bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-white"
                              }`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isFavorited || pkg.isBookmarked ? "fill-white" : ""}`} />
                            </button>

                            {/* Discount Badge */}
                            {pkg.discountPercentage && pkg.discountPercentage > 0 ? (
                              <span className="absolute bottom-3 left-3 bg-emerald-500 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md tracking-wider">
                                {pkg.discountPercentage}% OFF
                              </span>
                            ) : null}

                            {/* Duration Badge */}
                            {pkg.duration && (
                              <span className="absolute bottom-3 right-3 text-[9px] font-bold text-slate-200 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1 font-sans">
                                <Clock className="w-3 h-3 text-amber-400" /> {pkg.duration} mins
                              </span>
                            )}
                          </div>

                          {/* Card Body */}
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                            <div>
                              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-accent-lux transition-colors leading-snug">
                                {pkg.name}
                              </h3>

                              {pkg.subtitle && (
                                <p className="text-[11px] font-semibold text-accent-lux mt-0.5 line-clamp-1">
                                  {pkg.subtitle}
                                </p>
                              )}

                              {pkg.description && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                                  {pkg.description}
                                </p>
                              )}

                              {/* Service Action details */}
                              {item.serviceAction?.name && (
                                <div className="mt-2.5 flex items-center gap-1">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Action:</span>
                                  <span className="text-[9px] font-extrabold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                    {item.serviceAction.name}
                                  </span>
                                </div>
                              )}

                              {/* Addons List */}
                              {item.addons && item.addons.length > 0 && (
                                <div className="mt-2.5 flex flex-wrap gap-1">
                                  {item.addons.slice(0, 2).map((addon) => (
                                    <span key={addon._id} className="text-[8px] font-bold bg-accent-lux/10 text-accent-lux px-2 py-0.5 rounded-full">
                                      +{addon.addonName} (₹{addon.price})
                                    </span>
                                  ))}
                                  {item.addons.length > 2 && (
                                    <span className="text-[8px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                                      +{item.addons.length - 2} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Card Footer: Price & Both Actions (Add to Cart & Book Now) */}
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                              <div>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-base font-black text-slate-900 dark:text-white font-sans">
                                    ₹{pkg.price}
                                  </span>
                                  {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                                    <span className="text-[11px] font-normal text-slate-400 line-through font-sans">
                                      ₹{pkg.originalPrice}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[9px] text-emerald-600 dark:text-emerald-450 font-bold block">
                                  ✓ Verified Pro Service
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {/* Add to Cart Button */}
                                <button
                                  onClick={(e) => handleAddToCart(e, item)}
                                  disabled={isCartAdded}
                                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer ${
                                    isCartAdded
                                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 cursor-not-allowed opacity-90"
                                      : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                                  }`}
                                >
                                  {isCartAdded ? "Added ✓" : "+ Cart"}
                                </button>

                                {/* Book Now Button -> opens 4-step booking flow at /booking */}
                                <button
                                  onClick={(e) => handleBookNow(e, item)}
                                  className="px-3.5 py-1.5 rounded-xl text-[11px] font-bold bg-accent-lux hover:bg-accent-lux/90 text-white active:scale-95 transition-all shadow-md flex items-center gap-1 cursor-pointer"
                                >
                                  <span>Book Now</span> <ChevronRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <button
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        Previous
                      </button>
                      <span className="text-xs font-bold text-slate-500 font-sans">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="px-4 py-2 rounded-full bg-accent-lux text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-lux/90 transition-colors cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  )}
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
                <div className="absolute inset-0 w-full h-full rounded-full border border-accent-lux/40 animate-ping" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider animate-pulse">Voice Assistant Active</span>
                <p className="text-sm font-bold text-white leading-relaxed">{voiceText}</p>
              </div>

              {/* Dynamic waveform lines */}
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 text-xs font-bold">Loading services catalog...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}

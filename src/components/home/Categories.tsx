"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp, Layers } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { formatImageUrl } from "@/utils/image";
import {
  fetchCustomerCategoriesApi,
  CategoryItem,
} from "@/services/categoryApi";

interface UnifiedCategory {
  _id?: string;
  id: string;
  name: string;
  iconUrl?: string;
}

function CategoryImageDisplay({
  iconUrl,
  name,
}: {
  iconUrl?: string;
  name: string;
  id: string;
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [iconUrl]);

  const formattedUrl = formatImageUrl(iconUrl);

  if (formattedUrl && !imgError) {
    return (
      <img
        src={formattedUrl}
        alt={name || "Category Icon"}
        className="w-full h-full object-contain"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    );
  }

  // Clean fallback placeholder without any hardcoded illustrations/images
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 font-bold text-xs">
      <Layers className="w-8 h-8 text-slate-400" />
    </div>
  );
}

export default function Categories() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [categoriesList, setCategoriesList] = useState<UnifiedCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      setIsLoadingCategories(true);
      const res = await fetchCustomerCategoriesApi();
      if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
        const fetched: UnifiedCategory[] = res.data.map((cat: CategoryItem) => ({
          _id: cat._id,
          id: cat._id,
          name: cat.categoryName,
          iconUrl: cat.iconUrl,
        }));
        setCategoriesList(fetched);
      } else {
        setCategoriesList([]);
      }
      setIsLoadingCategories(false);
    }

    loadCategories();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const handleCategoryClick = (cat: UnifiedCategory) => {
    const categorySlug = cat.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    router.push(`/services/${categorySlug}`);
  };

  const visibleCategories = isExpanded ? categoriesList : categoriesList.slice(0, 8);

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto font-sans relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-accent-lux tracking-widest block mb-3">
            Service Categories
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-primary-lux dark:text-white">
            Explore Services
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs sm:text-sm">
            Browse through our verified service categories to find exactly what you need in Varanasi.
          </p>
        </div>
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-lux hover:underline shrink-0 cursor-pointer"
        >
          View all services <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoadingCategories ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-slate-900/60 border border-slate-200/10 dark:border-slate-800 rounded-3xl p-4 flex flex-col justify-between h-56 animate-pulse"
            >
              <div className="bg-slate-200/70 dark:bg-slate-800/70 rounded-2xl aspect-[4/3] w-full" />
              <div className="space-y-2 mt-4">
                <div className="h-4 bg-slate-200/80 dark:bg-slate-800/80 rounded w-2/3" />
                <div className="h-3 bg-slate-200/50 dark:bg-slate-800/50 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : categoriesList.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-500 text-xs rounded-3xl">
          No categories found.
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {visibleCategories.map((cat) => (
              <motion.div
                key={cat._id || cat.id}
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                layout
                onClick={() => handleCategoryClick(cat)}
                className="bg-white dark:bg-slate-900/60 border border-slate-200/10 dark:border-slate-800 rounded-3xl p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group cursor-pointer h-full relative select-none"
              >
                <div>
                  {/* Icon/Illustration container */}
                  <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl aspect-[4/3] flex items-center justify-center p-4 overflow-hidden">
                    <div className="w-20 h-20 transition-transform duration-500 group-hover:scale-110 flex items-center justify-center">
                      <CategoryImageDisplay iconUrl={cat.iconUrl} name={cat.name} id={cat.id} />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="mt-4 font-bold text-xs sm:text-[13px] text-slate-800 dark:text-slate-100 leading-tight">
                    {cat.name}
                  </h3>
                </div>
                
                {/* Arrow indicator at bottom right */}
                <div className="flex justify-end mt-4">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-accent-lux group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* View More / View Less Toggle Button */}
      {!isLoadingCategories && categoriesList.length > 8 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-6 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-[11px] sm:text-xs font-black tracking-wide text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-3.5 h-3.5 text-accent-lux" />
              </>
            ) : (
              <>
                More Options / Show All Categories <ChevronDown className="w-3.5 h-3.5 text-accent-lux" />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}

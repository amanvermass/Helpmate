"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Grid, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { categories } from "@/utils/mockData";
import CategoryIcon from "@/components/common/CategoryIcon";

export default function Categories() {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  const displayedCategories = showAll ? categories : categories.slice(0, 8);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/search?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto font-sans relative">
      <div className="text-center md:text-left md:flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary-lux dark:text-white">
            Popular Categories
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs sm:text-sm">
            Select a specialized category to find the right luxury professional.
          </p>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {displayedCategories.map((cat) => (
            <motion.div
              key={cat.id}
              variants={itemVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              layout
              onClick={() => handleCategoryClick(cat.id)}
              className="glass-panel glass-panel-hover p-6 flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden group select-none"
            >
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-lux/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 group-hover:bg-accent-lux group-hover:text-white flex items-center justify-center text-slate-700 dark:text-slate-200 transition-all duration-300 shadow-sm shadow-black/5">
                <CategoryIcon name={cat.icon} className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              <h3 className="mt-4 font-bold text-xs sm:text-sm text-foreground group-hover:text-accent-lux transition-colors duration-300">
                {cat.name}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">
                {cat.serviceCount} Options
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* View All Toggle Button */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={() => setShowAll(!showAll)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-accent-lux dark:hover:border-accent-lux/60 transition-all cursor-pointer shadow-sm"
        >
          {showAll ? (
            <>
              Show Less <ChevronUp className="w-4 h-4 text-accent-lux" />
            </>
          ) : (
            <>
              View All Categories <ChevronDown className="w-4 h-4 text-accent-lux" />
            </>
          )}
        </button>
      </div>
    </section>
  );
}

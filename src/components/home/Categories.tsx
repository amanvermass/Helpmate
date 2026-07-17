"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import ServiceIllustration from "./ServiceIllustrations";

// Combined unified category list: 9 main services first, then minor chores
const allCategories = [
  // 9 main services showing first
  { id: "ac", name: "Air Conditioner" },
  { id: "appliances", name: "Appliances" },
  { id: "cleaning", name: "Cleaning" },
  { id: "plumbing", name: "Plumbing" },
  { id: "electrician", name: "Electrician" },
  { id: "carpenter", name: "Carpenter" },
  { id: "painting", name: "Painting" },
  { id: "pest", name: "Pest Control" },

  // Remaining minor chores showing after
  { id: "car-washing", name: "Car Washing" },
  { id: "hourly", name: "Hourly bookings" },
  { id: "bathroom", name: "Bathroom Cleaning" },
  { id: "fridge", name: "Fridge Cleaning" },
  { id: "packing", name: "Packing or Unpacking" },
  { id: "utensils", name: "Utensils" },
  { id: "prep", name: "Kitchen Prep" },
  { id: "dusting", name: "Dusting & Wiping" },
  { id: "mopping", name: "Sweeping & Mopping" },
  { id: "preparty", name: "Pre-Party Express Clean" },
  { id: "wardrobe", name: "Complete Wardrobe Cleaning" },
  { id: "afterparty", name: "After-Party Express Clean" },
  { id: "ironing", name: "Ironing & Folding" },
  { id: "mirror", name: "Mirror cleaning" },
  { id: "laundry", name: "Laundry washing" },
  { id: "sink", name: "Kitchen sink cleaning" },
  { id: "balcony", name: "Balcony cleaning" },
  { id: "fan", name: "Fan cleaning" },
  { id: "cabinet", name: "Cabinet cleaning" }
];

const serviceIdMapping: Record<string, string> = {
  ac: "ac-jet-service",
  appliances: "refrigerator-smart-repair",
  cleaning: "deep-cleaning-lux",
  plumbing: "plumbing-smart-inspection",
  electrician: "smart-home-automation",
  carpenter: "modular-carpentry-fix",
  painting: "luxury-texture-painting",
  pest: "herbal-pest-control",
  "car-washing": "deep-cleaning-lux",

  hourly: "deep-cleaning-lux",
  bathroom: "deep-cleaning-lux",
  fridge: "refrigerator-smart-repair",
  packing: "white-glove-moving",
  utensils: "deep-cleaning-lux",
  prep: "deep-cleaning-lux",
  dusting: "deep-cleaning-lux",
  mopping: "deep-cleaning-lux",
  preparty: "deep-cleaning-lux",
  wardrobe: "deep-cleaning-lux",
  afterparty: "deep-cleaning-lux",
  ironing: "organic-silk-laundry",
  mirror: "deep-cleaning-lux",
  laundry: "organic-silk-laundry",
  sink: "plumbing-smart-inspection",
  balcony: "deep-cleaning-lux",
  fan: "smart-home-automation",
  cabinet: "modular-carpentry-fix"
};

export default function Categories() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleCategoryClick = (id: string) => {
    const targetId = serviceIdMapping[id];
    if (targetId) {
      router.push(`/services/${targetId}`);
    } else {
      router.push("/search");
    }
  };

  const visibleCategories = isExpanded ? allCategories : allCategories.slice(0, 8);

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto font-sans relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-accent-lux tracking-widest block mb-3">
            Step 2: Service Verticals & Tasks
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-primary-lux dark:text-white">
            Explore Services
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs sm:text-sm">
            Browse through our verified service verticals to find exactly what you need in Varanasi.
          </p>
        </div>
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-lux hover:underline shrink-0 cursor-pointer"
        >
          View all services <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

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
              key={cat.id}
              variants={itemVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              layout
              onClick={() => handleCategoryClick(cat.id)}
              className="bg-white dark:bg-slate-900/60 border border-slate-200/10 dark:border-slate-800 rounded-3xl p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group cursor-pointer h-full relative select-none"
            >
              <div>
                {/* Light gray illustration container */}
                <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl aspect-[4/3] flex items-center justify-center p-5">
                  <div className="w-22 h-22 transition-transform duration-500 group-hover:scale-110">
                    <ServiceIllustration id={cat.id} />
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="mt-4 font-bold text-xs sm:text-[13px] text-slate-800 dark:text-slate-100 leading-tight">
                  {cat.name}
                </h3>
              </div>
              
              {/* Arrow at bottom right */}
              <div className="flex justify-end mt-4">
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-accent-lux group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* View More / View Less Toggle Button */}
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
              More Options / Show All Chores <ChevronDown className="w-3.5 h-3.5 text-accent-lux" />
            </>
          )}
        </button>
      </div>

    </section>
  );
}

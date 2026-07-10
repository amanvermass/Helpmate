"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { citiesServed } from "@/utils/mockData";
import Link from "next/link";

const zoneAreas: Record<string, string[]> = {
  "Lanka & Assi Ghat": [
    "Assi Ghat", "Lanka", "Durgakund", "Ravindrapuri", "BHU Campus", 
    "Saket Nagar", "Samne Ghat", "Nagwa", "Jawahar Nagar", "Tulsipur"
  ],
  "Godowlia & Dashashwamedh": [
    "Godowlia", "Dashashwamedh Ghat", "Chowk", "Bansphatak", "Luxa", 
    "Sonarpura", "Madanpura", "Bangali Tola"
  ],
  "Cantonment & Nadesar": [
    "Cantonment", "Nadesar", "Mint House", "Jaiswal Colony", 
    "Orderly Bazar", "Tagore Town", "Varanasi Junction Area"
  ],
  "Sigra & Mahmoorganj": [
    "Sigra", "Mahmoorganj", "Vidyapeeth Road", "Shastri Nagar", 
    "Sidhgiribagh", "Rath Yatra", "Kamachha", "Gandhi Nagar"
  ],
  "Sarnath & Ashapur": [
    "Sarnath", "Ashapur", "Mavaiya", "Hiramanpur", 
    "Panchkroshi Road", "Sarnath Archeological Site"
  ],
  "Pandeypur & Shivpur": [
    "Pandeypur", "Shivpur", "Gilat Bazar", "Hukulganj", 
    "Paharia", "Premchand Nagar"
  ]
};

export default function ServiceAreas() {
  const [activeZone, setActiveZone] = useState("Lanka & Assi Ghat");

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto font-sans relative border-t border-slate-100 dark:border-slate-800/40">
      {/* Background glowing decorations */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-accent-lux/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="text-left mb-12">
        <div>
          <span className="text-[10px] uppercase font-black text-accent-lux tracking-widest block mb-3">
            Where We Serve
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-lux dark:text-white leading-tight">
            Varanasi's Neighborhoods We Cover
          </h2>
          <p className="text-slate-500 dark:text-slate-450 mt-2 text-xs sm:text-sm leading-relaxed">
            Book background-verified, uniformed professionals across active Varanasi municipal zones. 
            Select a zone below to explore the direct areas we support.
          </p>
        </div>
      </div>

      {/* Grid of Varanasi Zones */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {citiesServed.map((city) => {
          const isSelected = activeZone === city.name;
          return (
            <button
              key={city.name}
              onClick={() => setActiveZone(city.name)}
              className={`flex flex-col text-left rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border transition-all duration-300 shadow-sm cursor-pointer select-none group relative ${
                isSelected 
                  ? "border-accent-lux ring-2 ring-accent-lux/10 dark:ring-accent-lux/20 scale-[1.02] shadow-md" 
                  : "border-slate-200/60 dark:border-slate-800/70 hover:border-accent-lux/50 hover:scale-[1.01]"
              }`}
            >
              {/* Image Header */}
              <div className="relative h-28 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
              </div>

              {/* Body Details */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className={`text-[12px] font-black leading-snug transition-colors truncate ${
                    isSelected ? "text-accent-lux" : "text-foreground group-hover:text-accent-lux"
                  }`}>
                    {city.name.split(" & ")[0]}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 capitalize">{city.country}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  <span>{city.activePros} Pros</span>
                  {isSelected && <MapPin className="w-3.5 h-3.5 text-accent-lux" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Zone Neighborhoods List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeZone}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-50/50 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6 sm:p-8 mt-8 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/40 dark:border-slate-800/60">
            <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent-lux" />
              Serving <span className="text-accent-lux font-extrabold">{zoneAreas[activeZone]?.length || 0} Areas</span> in {activeZone}
            </h3>
            <button className="text-[10px] font-extrabold text-accent-lux hover:underline flex items-center gap-1 cursor-pointer">
              Active Support <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {zoneAreas[activeZone]?.map((area) => {
              const slug = area.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
              return (
                <Link
                  key={area}
                  href={`/places/${slug}`}
                  className="bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/80 px-4 py-2 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-350 shadow-sm hover:border-accent-lux/30 transition-all hover:text-accent-lux dark:hover:text-accent-lux cursor-pointer block"
                >
                  {area}
                </Link>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

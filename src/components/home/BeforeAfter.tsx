"use client";

import { useState } from "react";
import { ScanLine } from "lucide-react";
import { motion } from "framer-motion";

export default function BeforeAfter() {
  const [sliderPos, setSliderPos] = useState(50); // percentage

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto font-sans relative">
      <div className="text-center mb-12">
        <span className="text-[10px] uppercase font-bold text-accent-lux tracking-widest block mb-3">
          Quality Proof
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-primary-lux dark:text-white mt-1">
          Before & After Cleaning Results
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs sm:text-sm">
          Drag the slider handle to inspect our actual deep cleaning standards.
        </p>
      </div>

      <div className="max-w-3xl mx-auto relative h-[400px] sm:h-[450px] rounded-[24px] overflow-hidden shadow-2xl border border-slate-200/10">
        
        {/* BEFORE IMAGE (Full Background) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
            alt="Before Cleaning"
            className="w-full h-full object-cover select-none"
          />
          <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-full">
            Before Service
          </span>
        </div>

        {/* AFTER IMAGE (Clipped Overlay) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src="https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=1200&q=80"
            alt="After Cleaning"
            className="absolute inset-0 w-full h-full object-cover max-w-none select-none"
            style={{ width: "768px", height: "450px" }} // Matches parent sizes
          />
          <span className="absolute bottom-4 right-4 bg-accent-lux backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest px-3.5 py-2 rounded-sm border border-white/20 whitespace-nowrap shadow-md select-none">
            After HelpMate
          </span>
        </div>

        {/* Interactive range slider overlay */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        />

        {/* Slider indicator bar and circle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none z-10"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white dark:bg-slate-900 border-2 border-accent-lux flex items-center justify-center shadow-2xl">
            <ScanLine className="w-4 h-4 text-accent-lux animate-pulse" />
          </div>
        </div>

      </div>
    </section>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="w-full relative overflow-hidden aspect-[2.2/1] sm:aspect-[2.4/1] md:aspect-[2.5/1] lg:aspect-[2.7/1] bg-[#FDEFF6]">
      {/* Background Image of workers spanning full width/height (end-to-end, no container card) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/cta-imgbgn.png" 
          alt="HelpMate Technicians Background" 
          className="w-full h-full object-cover object-center pointer-events-none"
        />
        {/* Subtle overlay in dark mode to blend with dark page background and keep text readable */}
        <div className="absolute inset-0 bg-[#FFF5FA]/5 dark:bg-black/45 pointer-events-none" />
      </div>

      {/* Centered Content overlayed directly on the background image (spanning full bleed) */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-3 sm:p-6 md:p-10">
        
        {/* App Subtitle Badge */}
        <span className="text-[6px] sm:text-[9px] md:text-[10px] uppercase font-extrabold text-accent-lux bg-white/75 dark:bg-slate-900/80 px-2 py-0.5 rounded-full shadow-sm block tracking-wider font-sans">
          India's First Quick Service App
        </span>

        {/* Main Heading */}
        <h2 className="text-[10px] sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-[#1B0518] dark:text-white tracking-tight leading-tight mt-1.5 sm:mt-3 max-w-[180px] sm:max-w-md md:max-w-xl lg:max-w-2xl font-sans">
          India's First Quick Service App
        </h2>

        {/* Subtext */}
        <p className="mt-0.5 sm:mt-2 text-[8px] sm:text-xs md:text-sm lg:text-base text-[#6B5F6A] dark:text-slate-300 font-semibold max-w-[160px] sm:max-w-sm md:max-w-lg lg:max-w-xl leading-snug font-sans">
          On-demand home services to empower urban households
        </p>


        {/* Action Button: Book Now */}
        <div className="mt-2.5 sm:mt-5 md:mt-6 flex flex-col items-center gap-1 sm:gap-2">
          <Link
            href="/search?view=categories"
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-8 md:px-10 py-1.5 sm:py-3 rounded-full bg-gradient-to-r from-accent-lux to-[#6b1257] hover:from-accent-lux/95 hover:to-[#570e46] text-white font-bold sm:font-extrabold text-[9px] sm:text-sm md:text-base shadow-lg sm:shadow-xl shadow-purple-950/20 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
          >
            <span>Book Now</span>
            <ArrowRight className="w-2.5 h-2.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      {/* Bottom Gradient Strip */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent-lux via-secondary-lux to-primary-lux" />
    </section>
  );
}

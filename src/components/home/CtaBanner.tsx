"use client";

import React from "react";

// Clean, custom SVG icons for Play Store and Apple Store
const PlayStoreBadge: React.FC = () => (
  <a 
    href="https://play.google.com/store" 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-1.5 sm:gap-3 px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-black text-white hover:bg-slate-900 transition-all hover:scale-[1.03] active:scale-[0.98] shadow-md border border-white/10 shrink-0"
  >
    <img src="/play-store.svg" alt="Google Play Icon" className="w-4.5 h-4.5 sm:w-6 sm:h-6 shrink-0" />
    <div className="flex flex-col text-left">
      <span className="text-[6px] sm:text-[8px] text-slate-350 uppercase tracking-wider font-semibold leading-none font-sans">GET IT ON</span>
      <span className="text-[9px] sm:text-xs md:text-sm font-bold mt-0.5 leading-none font-sans">Google Play</span>
    </div>
  </a>
);

const AppStoreBadge: React.FC = () => (
  <a 
    href="https://www.apple.com/app-store/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-1.5 sm:gap-3 px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-black text-white hover:bg-slate-900 transition-all hover:scale-[1.03] active:scale-[0.98] shadow-md border border-white/10 shrink-0"
  >
    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 sm:w-6 sm:h-6 fill-current text-white shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.62.71-1.16 1.85-1.01 2.96 1.1.09 2.23-.55 2.96-1.4z" />
    </svg>
    <div className="flex flex-col text-left">
      <span className="text-[6px] sm:text-[8px] text-slate-350 uppercase tracking-wider font-semibold leading-none font-sans">Download on the</span>
      <span className="text-[9px] sm:text-xs md:text-sm font-bold mt-0.5 leading-none font-sans">App Store</span>
    </div>
  </a>
);

export default function CtaBanner() {
  return (
    <section className="w-full relative overflow-hidden aspect-[2.2/1] sm:aspect-[2.4/1] md:aspect-[2.5/1] lg:aspect-[2.7/1] bg-[#FDEFF6]">
      {/* Background Image of workers spanning full width/height (end-to-end, no container card) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/cta-imgbg.png" 
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

        {/* Rating and Stars */}
        <div className="mt-1 sm:mt-3 flex flex-col items-center">
          <div className="flex items-center gap-1 sm:gap-1.5 text-[8px] sm:text-xs md:text-sm">
            <span className="text-[#EC4899] font-black tracking-wide text-[9px] sm:text-sm md:text-base">★★★★★</span>
            <span className="font-extrabold text-[#1B0518] dark:text-white ml-0.5 font-sans">4.8</span>
            <span className="text-[#6B5F6A] dark:text-slate-400 font-medium font-sans ml-1">- 74,712 Ratings Combined</span>
          </div>
        </div>

        {/* Download Badges */}
        <div className="mt-3 sm:mt-6 md:mt-8 flex justify-center gap-1.5 sm:gap-4 w-full">
          <PlayStoreBadge />
          <AppStoreBadge />
        </div>

      </div>

      {/* Bottom Gradient Strip */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent-lux via-secondary-lux to-primary-lux" />
    </section>
  );
}

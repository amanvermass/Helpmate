"use client";

import { useState, useEffect } from "react";
import { X, Phone, Mail, Globe, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

let hasSeenPromoGlobal = false;

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (hasSeenPromoGlobal) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1200); // Small natural delay after load
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    hasSeenPromoGlobal = true;
  };

  const featuredAcServices = [
    "Gas Filling",
    "AC Repairing",
    "Duct Cleaning",
    "Electrical Control Setup",
    "Compressor Cleaning",
    "Installation",
    "Uninstallation",
    "AC Shifting",
    "Filter Replacement",
    "Thermostat & Capacitor Replacement"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
          {/* Background overlay mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-100 dark:border-slate-800 z-10 max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-y-visible"
          >
            {/* Close Trigger Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close advertisement"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Column: Custom Technician Image with Stamps */}
            <div className="relative w-full md:w-[45%] h-56 md:h-auto min-h-[240px] md:min-h-[460px] overflow-hidden bg-slate-950 shrink-0">
              <img
                src="/ac-technician-promo.png"
                alt="HelpMate AC Specialist"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              {/* Floating Free 45 Days Warranty Stamp */}
              <div className="absolute top-4 left-4 bg-red-650 text-white p-3 rounded-full shadow-lg border-2 border-dashed border-white/60 animate-pulse text-center select-none w-20 h-20 flex flex-col items-center justify-center rotate-[-12deg]">
                <span className="text-[6px] font-black uppercase tracking-widest leading-none">FREE</span>
                <span className="text-xs font-black my-0.5 leading-none">45 DAYS</span>
                <span className="text-[6px] font-bold uppercase tracking-widest leading-none">WARRANTY</span>
              </div>

              {/* Company Logo overlay at bottom */}
              <div className="absolute bottom-4 left-6 text-left flex flex-col gap-1.5">
                <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm w-fit flex items-center justify-center">
                  <img src="/logo.png" alt="HelpMate Logo" className="h-7 w-auto object-contain" />
                </div>
                <p className="text-[10px] text-slate-300 font-semibold tracking-wider italic">Helpmate for your home care</p>
              </div>
            </div>

            {/* Right Column: Advertisement Flyers Fields */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between text-left space-y-6">

              {/* Header: Slogan & Play store link */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-4">
                <div>
                  <span className="text-[8px] uppercase font-black text-accent-lux tracking-widest block">Book verified support</span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200 font-extrabold mt-1">
                    <Phone className="w-3.5 h-3.5 text-accent-lux" />
                    <span>0542-2974740 • 7705004040</span>
                  </div>
                </div>

                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-1.5 bg-slate-950 text-white hover:bg-black px-3.5 py-1.5 rounded-lg text-[9px] font-bold transition-transform hover:scale-105 active:scale-95 shadow-md w-fit cursor-pointer"
                >
                  <span className="text-accent-lux text-xs">▶</span> Get it on Google Play
                </a>
              </div>

              {/* Special Offer Highlight Banner */}
              <div className="p-4 bg-accent-lux/5 border border-accent-lux/20 rounded-[20px] relative overflow-hidden flex flex-col justify-center">
                <span className="text-[9px] uppercase font-black text-accent-lux tracking-widest block mb-0.5">Special Offer</span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                  15% OFF ON YOUR SECOND AC SERVICE
                </h3>
                <div className="flex gap-2.5 mt-2.5 text-[8px] font-black uppercase tracking-wider text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-foreground">PRICE</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-foreground">QUALITY</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-foreground">SERVICE</span>
                </div>
              </div>

              {/* Featured Services listing */}
              <div className="space-y-3">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-accent-lux" /> Featured AC Services
                </span>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {featuredAcServices.map((srv, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-success-lux shrink-0" />
                      <span className="truncate">{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

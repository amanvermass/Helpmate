"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  X,
  Wrench,
  Sparkles
} from "lucide-react";

export default function BetaBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedDismissed = sessionStorage.getItem("helpmate_beta_dismissed");
      if (savedDismissed === "true") {
        setIsDismissed(true);
      }
      const savedCollapsed = sessionStorage.getItem("helpmate_beta_collapsed");
      if (savedCollapsed === "true") {
        setIsCollapsed(true);
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const handleToggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    try {
      sessionStorage.setItem("helpmate_beta_collapsed", String(nextState));
    } catch {
      // Ignore storage access errors
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem("helpmate_beta_dismissed", "true");
    } catch {
      // Ignore storage access errors
    }
  };

  if (!isMounted || isDismissed) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="rounded-2xl sm:rounded-full bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-amber-500/15 dark:from-amber-500/20 dark:via-purple-950/50 dark:to-amber-500/15 backdrop-blur-xl border border-amber-500/30 dark:border-amber-500/25 shadow-sm text-slate-800 dark:text-slate-100 font-sans transition-all px-3 sm:px-4 select-none">
        <AnimatePresence initial={false} mode="wait">
          {!isCollapsed ? (
            /* EXPANDED FULL BETA STRIP */
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="py-2 flex items-center justify-between gap-3 overflow-hidden text-xs"
            >
              {/* Left Side: Badge + Description Message */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0 flex-wrap sm:flex-nowrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs shrink-0">
                  <AlertTriangle className="w-3 h-3 fill-slate-950 text-amber-500" />
                  Beta Version
                </span>

                <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-200 leading-snug">
                  <strong className="font-bold text-slate-900 dark:text-white">Notice:</strong>{" "}
                  HelpMate is in early preview. Some features might have temporary glitches or appear broken while we actively push real-time fixes and updates!
                </p>
              </div>

              {/* Right Side: Quick Status Pill, Collapse Button, Close Button */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                  <Wrench className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                  Fixes rolling out daily
                </span>

                {/* Collapse Button */}
                <button
                  type="button"
                  onClick={handleToggleCollapse}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer"
                  title="Collapse beta notice"
                >
                  <span className="hidden sm:inline">Collapse</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>

                {/* Dismiss Button */}
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer"
                  title="Dismiss notice"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ) : (
            /* COLLAPSED MICRO STRIP */
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="py-1 flex items-center justify-between gap-3 overflow-hidden text-[11px]"
            >
              {/* Left Side: Compact Indicator */}
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <span className="font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider text-[10px] shrink-0">
                  Beta Preview
                </span>
                <span className="text-slate-500 dark:text-slate-400 truncate text-[10px] sm:text-[11px]">
                  • Active updates & fixes in progress
                </span>
              </div>

              {/* Right Side: Expand Button + Dismiss Button */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleToggleCollapse}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold text-accent-lux dark:text-purple-300 hover:underline cursor-pointer"
                  title="Expand full notice"
                >
                  <span>Expand details</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  title="Dismiss notice"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

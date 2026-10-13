"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function BetaBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedDismissed = sessionStorage.getItem("helpmate_top_beta_dismissed");
      if (savedDismissed === "true") {
        setIsDismissed(true);
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem("helpmate_top_beta_dismissed", "true");
    } catch {
      // Ignore storage access errors
    }
  };

  if (!isMounted || isDismissed) {
    return null;
  }

  return (
    <aside className="w-full bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-amber-500/15 dark:from-amber-500/20 dark:via-purple-950/40 dark:to-amber-500/15 border-b border-amber-500/25 backdrop-blur-xl text-slate-800 dark:text-slate-100 font-sans transition-all select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 sm:py-2 flex items-center justify-between gap-3 text-xs">
        {/* Left Side: Badge + Description Message */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0 flex-wrap sm:flex-nowrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs shrink-0">
            <AlertTriangle className="w-3 h-3 fill-slate-950 text-amber-500" />
            Beta Version
          </span>

          <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-200 leading-snug">
            <strong className="font-bold text-slate-900 dark:text-white">Notice:</strong>{" "}
            HelpMate is in early preview. Some features might have temporary glitches or appear broken !
          </p>
        </div>

        {/* Right Side: Close / Dismiss Icon Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer"
            title="Dismiss notice"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

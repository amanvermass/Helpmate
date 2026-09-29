"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { X, Lock, LogIn, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ToastContainer() {
  const router = useRouter();
  const { notifications } = useStore();
  const [activeToast, setActiveToast] = useState<any | null>(null);

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const latest = notifications[0];
      setActiveToast(latest);

      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (!activeToast) return null;

  const isLoginNotice =
    activeToast.title?.toLowerCase().includes("login") ||
    activeToast.message?.toLowerCase().includes("log in") ||
    activeToast.message?.toLowerCase().includes("login");

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full px-4 sm:px-0 pointer-events-auto font-sans">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="bg-slate-900/95 dark:bg-slate-900 border border-amber-500/40 text-white p-4 rounded-2xl shadow-2xl backdrop-blur-xl relative flex flex-col gap-2 text-left"
        >
          <button
            onClick={() => setActiveToast(null)}
            className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3 pr-6">
            <div className={`p-2 rounded-xl shrink-0 ${isLoginNotice ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : activeToast.type === "success" ? "bg-emerald-500/20 text-emerald-400" : "bg-accent-lux/20 text-accent-lux"}`}>
              {isLoginNotice ? (
                <Lock className="w-4 h-4" />
              ) : activeToast.type === "success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : activeToast.type === "warning" ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <Info className="w-4 h-4" />
              )}
            </div>

            <div className="flex-1">
              <h4 className="text-xs font-bold text-white tracking-wide">
                {activeToast.title}
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                {activeToast.message}
              </p>
            </div>
          </div>

          {isLoginNotice && (
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveToast(null)}
                className="text-[10px] font-semibold text-slate-400 hover:text-white px-2 py-1 transition-colors cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setActiveToast(null);
                  router.push("/login");
                }}
                className="px-3.5 py-1.5 rounded-full bg-accent-lux hover:bg-accent-lux/90 text-white font-extrabold text-[10px] flex items-center gap-1 shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                <LogIn className="w-3 h-3" />
                Log In Now ↗
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

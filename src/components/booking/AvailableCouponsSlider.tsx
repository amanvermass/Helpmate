"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Tag,
  Percent,
  CheckCircle,
  Calendar,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Lock,
  ChevronRight
} from "lucide-react";
import confetti from "canvas-confetti";

export interface AdminCoupon {
  id: string;
  code: string;
  title: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscount?: number;
  minOrderValue: number;
  validUntil: string;
  applicableCategory: string;
  description: string;
  isPublished: boolean;
  isFeatured?: boolean;
}

export const ADMIN_PUBLISHED_COUPONS: AdminCoupon[] = [
  {
    id: "c-101",
    code: "HELPMATE20",
    title: "Flat 20% OFF on First Service",
    discountType: "percentage",
    discountValue: 20,
    maxDiscount: 300,
    minOrderValue: 399,
    validUntil: "31 Dec 2026",
    applicableCategory: "All Services",
    description: "Get 20% instant discount up to ₹300 on any home service booking.",
    isPublished: true,
    isFeatured: true,
  },
  {
    id: "c-102",
    code: "LUXURY50",
    title: "₹150 Flat Discount on Deep Cleaning",
    discountType: "fixed",
    discountValue: 150,
    minOrderValue: 799,
    validUntil: "15 Oct 2026",
    applicableCategory: "Cleaning & Pest Control",
    description: "Get flat ₹150 OFF on full home, kitchen & bathroom deep cleaning.",
    isPublished: true,
    isFeatured: false,
  },
  {
    id: "c-103",
    code: "COOLING100",
    title: "₹100 OFF on AC Repair & Gas Refill",
    discountType: "fixed",
    discountValue: 100,
    minOrderValue: 599,
    validUntil: "30 Nov 2026",
    applicableCategory: "AC & Appliance Repair",
    description: "Special ₹100 discount on AC jet wash, foam clean & gas leak fix.",
    isPublished: true,
    isFeatured: true,
  },
  {
    id: "c-104",
    code: "SUPERFEST",
    title: "25% OFF Festive Special",
    discountType: "percentage",
    discountValue: 25,
    maxDiscount: 500,
    minOrderValue: 999,
    validUntil: "05 Nov 2026",
    applicableCategory: "All Services",
    description: "Festive home upgrade deal! Save up to ₹500 on orders above ₹999.",
    isPublished: true,
    isFeatured: false,
  },
  {
    id: "c-105",
    code: "WELCOME100",
    title: "₹100 Welcome Gift",
    discountType: "fixed",
    discountValue: 100,
    minOrderValue: 299,
    validUntil: "31 Dec 2026",
    applicableCategory: "All Services",
    description: "Welcome discount for all HelpMate members on first 3 orders.",
    isPublished: true,
    isFeatured: false,
  }
];

interface AvailableCouponsSliderProps {
  isOpen: boolean;
  onClose: () => void;
  cartTotal: number;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
}

export function AvailableCouponsSlider({
  isOpen,
  onClose,
  cartTotal,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}: AvailableCouponsSliderProps) {
  const [manualInput, setManualInput] = useState("");
  const [inputError, setInputError] = useState("");

  // Only display admin published coupons
  const publishedCoupons = ADMIN_PUBLISHED_COUPONS.filter((c) => c.isPublished);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    const cleaned = manualInput.trim().toUpperCase();
    const found = publishedCoupons.find((c) => c.code === cleaned);

    if (!found) {
      // Check preset legacy codes
      if (["LUXURY50", "WELCOME100", "SUPERDEAL"].includes(cleaned)) {
        onApplyCoupon(cleaned);
        setManualInput("");
        setInputError("");
        triggerConfetti();
        onClose();
        return;
      }
      setInputError("Invalid coupon code. Try one from the list below.");
      return;
    }

    if (cartTotal < found.minOrderValue) {
      setInputError(`Minimum order value of ₹${found.minOrderValue} required for ${found.code}.`);
      return;
    }

    onApplyCoupon(found.code);
    setManualInput("");
    setInputError("");
    triggerConfetti();
    onClose();
  };

  const handleSelectCoupon = (coupon: AdminCoupon) => {
    if (cartTotal < coupon.minOrderValue) return;
    onApplyCoupon(coupon.code);
    triggerConfetti();
    onClose();
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden text-left">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800"
            >
              {/* Slider Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#782860]/10 text-[#782860] dark:bg-[#782860]/20 dark:text-purple-300 flex items-center justify-center">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-foreground flex items-center gap-2">
                      Available Coupons
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {publishedCoupons.length} Admin Offers Published
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-2xl text-slate-400 hover:text-foreground hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Slider Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Manual Enter Coupon Form */}
                <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                    Have a promo code?
                  </span>
                  <form onSubmit={handleManualSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER COUPON CODE"
                      value={manualInput}
                      onChange={(e) => {
                        setManualInput(e.target.value);
                        setInputError("");
                      }}
                      className="flex-1 uppercase font-bold text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#782860]/40 text-foreground placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 bg-[#782860] hover:bg-[#652050] text-white text-xs font-black rounded-2xl transition-all cursor-pointer shadow-md shadow-[#782860]/20"
                    >
                      Apply
                    </button>
                  </form>
                  {inputError && (
                    <p className="text-[11px] font-bold text-rose-500">{inputError}</p>
                  )}
                </div>

                {/* Currently Applied Coupon Banner */}
                {appliedCoupon && (
                  <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                          Applied Coupon
                        </span>
                        <span className="text-xs font-black text-foreground">
                          {appliedCoupon}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={onRemoveCoupon}
                      className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Published Admin Coupons List */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Official Admin Published Offers
                  </h4>

                  {publishedCoupons.map((coupon) => {
                    const isEligible = cartTotal >= coupon.minOrderValue;
                    const shortfall = coupon.minOrderValue - cartTotal;
                    const isCurrentlyApplied = appliedCoupon === coupon.code;

                    return (
                      <div
                        key={coupon.id}
                        className={`relative p-5 rounded-3xl border transition-all duration-300 ${
                          isCurrentlyApplied
                            ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/60 shadow-lg"
                            : isEligible
                            ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-[#782860]/50 hover:shadow-xl"
                            : "bg-slate-50/60 dark:bg-slate-950/40 border-slate-200/60 dark:border-slate-800/60 opacity-80"
                        }`}
                      >
                        {/* Coupon Header Pill & Badge */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-xl bg-[#782860]/10 text-[#782860] dark:bg-[#782860]/20 dark:text-purple-300 border border-dashed border-[#782860]/30 font-black text-xs tracking-wider">
                              {coupon.code}
                            </span>
                            {coupon.isFeatured && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-black flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" /> Featured
                              </span>
                            )}
                          </div>

                          {isEligible ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px]">
                              ✓ Eligible
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-[10px] flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> Min order ₹{coupon.minOrderValue}
                            </span>
                          )}
                        </div>

                        {/* Title & Description */}
                        <h5 className="text-sm font-black text-foreground">
                          {coupon.title}
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {coupon.description}
                        </p>

                        {/* Coupon Metadata Badges */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="w-3 h-3 text-[#782860]" />
                            {coupon.applicableCategory}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            Valid till {coupon.validUntil}
                          </span>
                        </div>

                        {/* Action Button & Unlock Bar */}
                        <div className="mt-4">
                          {isCurrentlyApplied ? (
                            <div className="w-full py-2.5 rounded-2xl bg-emerald-500 text-white font-extrabold text-xs text-center flex items-center justify-center gap-1.5 shadow-md">
                              <CheckCircle className="w-4 h-4 fill-white text-emerald-500" /> Currently Applied
                            </div>
                          ) : isEligible ? (
                            <button
                              type="button"
                              onClick={() => handleSelectCoupon(coupon)}
                              className="w-full py-2.5 rounded-2xl bg-[#782860] hover:bg-[#652050] text-white font-black text-xs transition-all cursor-pointer shadow-lg shadow-[#782860]/20 flex items-center justify-center gap-1.5"
                            >
                              Apply Coupon <ChevronRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <div className="space-y-1.5">
                              <div className="w-full py-2 rounded-2xl bg-slate-200/70 dark:bg-slate-800 text-slate-400 font-bold text-xs text-center flex items-center justify-center gap-1 cursor-not-allowed">
                                <Lock className="w-3.5 h-3.5" /> Add ₹{shortfall} more to unlock
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Slider Footer Guarantee */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Guaranteed Admin Verified Discounts
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

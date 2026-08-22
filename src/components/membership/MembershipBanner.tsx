"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  CheckCircle,
  Percent,
  Zap,
  ShieldCheck,
  Gift,
  Sparkles,
  ChevronRight,
  Plus,
  Star,
  Award
} from "lucide-react";
import confetti from "canvas-confetti";
import { useStore } from "@/store/useStore";

interface MembershipBannerProps {
  variant?: "full" | "compact" | "checkout";
  onMemberUpdated?: () => void;
}

export default function MembershipBanner({
  variant = "full",
  onMemberUpdated
}: MembershipBannerProps) {
  const {
    isMember,
    membershipTier,
    membershipExpiry,
    freeServicesAvailable,
    totalMembershipSavings,
    buyMembership,
    claimFreeService,
    addNotification,
    addToCart
  } = useStore();

  const [selectedPlan, setSelectedPlan] = useState<"pass" | "plus">("plus");

  const handlePurchase = (planName: "VIP Pass" | "Helpmate Club Plus") => {
    buyMembership(planName);
    addNotification(
      "Welcome to VIP Club!",
      `Your ${planName} is active! Enjoy 15% OFF and 2 Free Services.`,
      "success"
    );
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
    if (onMemberUpdated) onMemberUpdated();
  };

  const handleClaimFree = (serviceName: string, price: number) => {
    if (freeServicesAvailable <= 0) {
      addNotification("No Free Services Left", "You have used your 2 free annual services.", "warning");
      return;
    }
    claimFreeService();
    addToCart({
      id: `free-${Date.now()}`,
      name: `[FREE VIP] ${serviceName}`,
      price: 0,
      category: "vip-perk",
      duration: 30
    });
    addNotification("Free Service Claimed!", `${serviceName} added to cart for ₹0.`, "success");
  };

  // CHECKOUT/COMPACT VARIANT FOR SIDEBAR & MODAL
  if (variant === "checkout" || variant === "compact") {
    return (
      <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-purple-900/10 to-[#782860]/20 border border-amber-500/30 dark:border-amber-500/20 text-left relative overflow-hidden shadow-lg">
        {/* Decorative Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        {isMember ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
                  <Crown className="w-4 h-4 fill-slate-950" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                    VIP Club Active
                  </span>
                  <h4 className="text-xs font-black text-foreground">
                    {membershipTier || "HelpMate VIP Pass"}
                  </h4>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] border border-emerald-500/20">
                15% OFF Active
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              🎉 VIP discount applied automatically! Total member savings to date: <strong className="text-amber-600 dark:text-amber-400">₹{totalMembershipSavings}</strong>.
            </p>

            {freeServicesAvailable > 0 && (
              <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-500" />
                  <span className="text-[11px] font-bold text-foreground">
                    {freeServicesAvailable} Free Services Available
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleClaimFree("Bio-Disinfection Sanitization", 399)}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black rounded-xl transition-colors cursor-pointer"
                >
                  Claim ₹0
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-black text-amber-950 dark:text-amber-200 uppercase tracking-wider">
                  Save Extra with VIP Pass
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black">
                ONLY ₹299/YR
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Get <strong className="text-[#782860] dark:text-purple-300 font-extrabold">15% EXTRA OFF</strong> on this order + <strong className="text-amber-600 dark:text-amber-400">2 FREE Services</strong> (₹698 value)!
            </p>

            <button
              type="button"
              onClick={() => handlePurchase("Helpmate Club Plus")}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-[#782860] hover:brightness-110 text-white font-black text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              <Crown className="w-4 h-4 fill-white" /> Upgrade to VIP Club @ ₹299 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // FULL PROMOTIONAL BANNER SECTION FOR HOME & PROFILE
  return (
    <section className="w-full py-8 text-left">
      <div className="relative rounded-[32px] bg-gradient-to-br from-[#1a0a20] via-[#2d0e34] to-[#45144f] p-8 sm:p-10 text-white shadow-2xl border border-purple-500/30 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#782860]/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & Key Customer Benefits */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Crown className="w-4 h-4 fill-amber-300" /> Exclusive Membership Program
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                HelpMate <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-200 bg-clip-text text-transparent">VIP Pass</span> Benefits
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/90 max-w-xl leading-relaxed">
                Enjoy priority technician dispatch, instant 15% discount on all home services, free annual maintenance covers, and zero convenience fees!
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Percent className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Flat 15% OFF Every Order</h4>
                  <p className="text-[11px] text-purple-200/70 mt-0.5">Applied automatically on all repair & cleaning services.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">2 FREE Included Services</h4>
                  <p className="text-[11px] text-purple-200/70 mt-0.5">Free Bio-Disinfection (₹399) + AC Checkup (₹299).</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">VIP Priority Dispatch</h4>
                  <p className="text-[11px] text-purple-200/70 mt-0.5">Guaranteed top-rated technician at your door in 30 mins.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Zero Booking Fees</h4>
                  <p className="text-[11px] text-purple-200/70 mt-0.5">No convenience charges or extra dispatch fees ever.</p>
                </div>
              </div>
            </div>

            {/* Included Free Services Banner */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Free Included Annual Services
                </span>
                <span className="text-[11px] font-bold text-amber-200">₹698 Total Gift Value</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-white">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Full Surface Bio-Disinfection (₹399)
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> AC Safety & Health Checkup (₹299)
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing Plans & Membership Card */}
          <div className="lg:col-span-5 bg-white/10 dark:bg-slate-900/60 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-white/20 space-y-5">
            {isMember ? (
              <div className="space-y-5 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-xl">
                  <Crown className="w-8 h-8 fill-slate-950" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/30">
                    ✓ ACTIVE MEMBER
                  </span>
                  <h3 className="text-xl font-black text-white mt-3">
                    {membershipTier || "HelpMate VIP Pass"}
                  </h3>
                  <p className="text-xs text-purple-200 mt-1">
                    Valid until {membershipExpiry || "Aug 22, 2027"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between text-purple-200">
                    <span>Total Member Savings:</span>
                    <strong className="text-amber-300 font-black">₹{totalMembershipSavings}</strong>
                  </div>
                  <div className="flex justify-between text-purple-200">
                    <span>Remaining Free Services:</span>
                    <strong className="text-emerald-300 font-black">{freeServicesAvailable} Available</strong>
                  </div>
                </div>

                {freeServicesAvailable > 0 && (
                  <button
                    type="button"
                    onClick={() => handleClaimFree("Bio-Disinfection Sanitization", 399)}
                    className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    <Gift className="w-4 h-4" /> Claim Free Service (₹0)
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <div>
                    <h3 className="text-base font-black text-white">Select Membership Plan</h3>
                    <p className="text-xs text-purple-200">Cancel or upgrade anytime</p>
                  </div>
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>

                {/* Plan Toggle Cards */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan("plus")}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      selectedPlan === "plus"
                        ? "bg-gradient-to-r from-amber-500/20 to-purple-500/20 border-amber-400 shadow-md ring-2 ring-amber-400/40"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">Helpmate Club Plus</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black">BEST VALUE</span>
                      </div>
                      <p className="text-[11px] text-purple-200 mt-0.5">12 Months Access • 2 Free Services Included</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-amber-300">₹299</span>
                      <span className="text-[10px] text-purple-300 line-through block">₹599</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan("pass")}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      selectedPlan === "pass"
                        ? "bg-gradient-to-r from-amber-500/20 to-purple-500/20 border-amber-400 shadow-md ring-2 ring-amber-400/40"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div>
                      <span className="text-sm font-black text-white">VIP Pass</span>
                      <p className="text-[11px] text-purple-200 mt-0.5">6 Months Access • 15% OFF Services</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-amber-300">₹199</span>
                      <span className="text-[10px] text-purple-300 line-through block">₹399</span>
                    </div>
                  </button>
                </div>

                {/* Purchase Button */}
                <button
                  type="button"
                  onClick={() => handlePurchase(selectedPlan === "plus" ? "Helpmate Club Plus" : "VIP Pass")}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-300 hover:brightness-110 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4 fill-slate-950" />
                  Join VIP Club for {selectedPlan === "plus" ? "₹299" : "₹199"} Now <ChevronRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-center text-purple-200/80">
                  🔒 100% Satisfaction Guarantee • Instant Activation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Sparkles, Check, Clock, ShieldCheck, HelpCircle, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";

interface CalculatorProps {
  onBook: (data: {
    id: string;
    name: string;
    price: number;
    category: string;
    duration: number;
  }) => void;
}

export default function PricingCalculator({ onBook }: CalculatorProps) {
  const [activeTab, setActiveTab] = useState<"deep" | "chores">("deep");
  const { clearCart, addToCart } = useStore();

  // Deep Cleaning states
  const [homeSize, setHomeSize] = useState<"1bhk" | "2bhk" | "3bhk" | "4bhk">("2bhk");
  const [deepAddons, setDeepAddons] = useState<string[]>([]);

  // Chores states
  const [selectedChores, setSelectedChores] = useState<string[]>(["mopping", "dishes"]);

  // Urgency indicator
  const [availablePros, setAvailablePros] = useState(4);
  useEffect(() => {
    const interval = setInterval(() => {
      setAvailablePros((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const next = prev + change;
        return next < 2 ? 2 : next > 7 ? 7 : next;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const deepCleanBHKs = {
    "1bhk": { name: "1 BHK Deep Clean", price: 1899, duration: 180 },
    "2bhk": { name: "2 BHK Deep Clean", price: 2899, duration: 240 },
    "3bhk": { name: "3 BHK Deep Clean", price: 3899, duration: 300 },
    "4bhk": { name: "4 BHK Deep Clean", price: 4899, duration: 360 },
  };

  const deepCleanAddons = [
    { id: "kitchen", label: "Kitchen Degreasing", price: 599, duration: 60 },
    { id: "bathroom", label: "Bathroom Intensive Descaling", price: 399, duration: 45 },
    { id: "balcony", label: "Balcony Scrubbing", price: 299, duration: 30 },
    { id: "fridge", label: "Fridge Interior Sanitizing", price: 199, duration: 20 },
  ];

  const choreOptions = [
    { id: "mopping", label: "Sweeping & Mopping", price: 149, duration: 45 },
    { id: "dishes", label: "Utensil Dishwashing", price: 99, duration: 30 },
    { id: "ironing", label: "Ironing & Folding", price: 120, duration: 45 },
    { id: "chopping", label: "Kitchen Veggie Chopping", price: 149, duration: 45 },
    { id: "dusting", label: "Bathroom Express Dusting", price: 120, duration: 30 },
    { id: "balcony-tidy", label: "Balcony Tidy Up", price: 99, duration: 20 },
  ];

  // Deep Clean calculations
  const baseSelection = deepCleanBHKs[homeSize];
  const deepAddonSum = deepCleanAddons
    .filter((a) => deepAddons.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);
  const deepDurationSum = deepCleanAddons
    .filter((a) => deepAddons.includes(a.id))
    .reduce((sum, a) => sum + a.duration, 0);

  const deepTotalPrice = baseSelection.price + deepAddonSum;
  const deepTotalDuration = baseSelection.duration + deepDurationSum;

  // Chores calculations (Base fare minimum of ₹299 applies)
  const choreSum = choreOptions
    .filter((c) => selectedChores.includes(c.id))
    .reduce((sum, c) => sum + c.price, 0);
  const choreDurationSum = choreOptions
    .filter((c) => selectedChores.includes(c.id))
    .reduce((sum, c) => sum + c.duration, 0);

  const choresTotalPrice = Math.max(299, choreSum);
  const choresTotalDuration = choreDurationSum;

  const toggleDeepAddon = (id: string) => {
    setDeepAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const toggleChore = (id: string) => {
    setSelectedChores((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleBookNow = () => {
    if (activeTab === "deep") {
      const selectedAddonLabels = deepCleanAddons
        .filter((a) => deepAddons.includes(a.id))
        .map((a) => a.label);

      const customServiceName = `${baseSelection.name} ${selectedAddonLabels.length > 0 ? `(+ ${selectedAddonLabels.join(", ")})` : ""
        }`;

      clearCart();
      addToCart({
        id: `custom-deep-${homeSize}`,
        name: customServiceName,
        price: deepTotalPrice,
        category: "cleaning",
        duration: deepTotalDuration,
      });

      onBook({
        id: `custom-deep-${homeSize}`,
        name: customServiceName,
        price: deepTotalPrice,
        category: "cleaning",
        duration: deepTotalDuration,
      });
    } else {
      const selectedChoreLabels = choreOptions
        .filter((c) => selectedChores.includes(c.id))
        .map((c) => c.label);

      if (selectedChoreLabels.length === 0) {
        alert("Please select at least one chore task.");
        return;
      }

      const customServiceName = `Daily Chores Bundle: ${selectedChoreLabels.join(", ")}`;

      clearCart();
      addToCart({
        id: "custom-chores-bundle",
        name: customServiceName,
        price: choresTotalPrice,
        category: "cleaning", // map to generic chores/cleaning category
        duration: choresTotalDuration,
      });

      onBook({
        id: "custom-chores-bundle",
        name: customServiceName,
        price: choresTotalPrice,
        category: "cleaning",
        duration: choresTotalDuration,
      });
    }
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto font-sans relative" id="pricing-calculator">
      <div className="text-left mb-12">
        <span className="text-[10px] uppercase font-bold text-accent-lux tracking-widest block mb-3">
          Step 1: Estimate Price
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-primary-lux dark:text-white mt-1">
          Interactive Pricing Calculator
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs sm:text-sm max-w-md">
          Choose a service model below, select your layout or checklist, and get an instant, transparent price before booking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Interactive Panel */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 flex flex-col justify-between border border-slate-200/10">
          <div>
            {/* Tabs Selector */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8 w-full sm:w-fit">
              <button
                onClick={() => setActiveTab("deep")}
                className={`py-3 px-6 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  activeTab === "deep"
                    ? "bg-accent-lux text-white shadow-md hover:bg-accent-lux/95"
                    : "bg-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-800"
                }`}
              >
                Premium Deep Cleaning
              </button>
              <button
                onClick={() => setActiveTab("chores")}
                className={`py-3 px-6 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  activeTab === "chores"
                    ? "bg-accent-lux text-white shadow-md hover:bg-accent-lux/95"
                    : "bg-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-800"
                }`}
              >
                Daily Hourly Chores
              </button>
            </div>

            {/* TAB CONTENT: DEEP CLEAN */}
            <AnimatePresence mode="wait">
              {activeTab === "deep" ? (
                <motion.div
                  key="deep"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Tab Explainer Text */}
                  <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-left mb-6">
                    <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-accent-lux" /> What is Premium Deep Cleaning?
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      A comprehensive, 3+ hour intense scrub-down of your home by verified experts. Includes specialized machines, bathroom descaling, deep kitchen degreasing, and eco-sanitization. Ideal for monthly refreshers or moving in.
                    </p>
                  </div>

                  {/* Home BHK size grid */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-3">
                      Select Home Layout Size
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(["1bhk", "2bhk", "3bhk", "4bhk"] as const).map((size) => {
                        const isSelected = homeSize === size;
                        return (
                          <button
                            key={size}
                            onClick={() => setHomeSize(size)}
                            className={`py-3.5 px-3 rounded-xl border text-center font-bold text-xs capitalize transition-all cursor-pointer ${isSelected
                                ? "bg-accent-lux border-accent-lux text-white shadow-lg shadow-accent-lux/10"
                                : "bg-slate-50 dark:bg-slate-900 border-slate-200/10 text-slate-700 dark:text-slate-300 hover:border-slate-350"
                              }`}
                          >
                            {size}
                            <span className="block text-[9px] font-normal opacity-80 mt-1">
                              ₹{deepCleanBHKs[size].price}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add-ons Checklist */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-3">
                      Add-on Intensive Care Checklist
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {deepCleanAddons.map((addon) => {
                        const isChecked = deepAddons.includes(addon.id);
                        return (
                          <div
                            key={addon.id}
                            onClick={() => toggleDeepAddon(addon.id)}
                            className={`p-3.5 rounded-xl border cursor-pointer select-none flex items-center justify-between transition-all duration-300 ${isChecked
                                ? "border-accent-lux/60 bg-accent-lux/[0.03]"
                                : "border-slate-200/10 bg-slate-50/40 dark:bg-slate-950/20 hover:border-slate-300"
                              }`}
                          >
                            <div>
                              <span className="text-xs font-bold text-foreground block">
                                {addon.label}
                              </span>
                              <span className="text-[9px] text-slate-400 mt-0.5 block flex items-center gap-1">
                                <Clock className="w-3 h-3" /> +{addon.duration} mins
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-extrabold text-accent-lux">+₹{addon.price}</span>
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${isChecked ? "bg-accent-lux border-accent-lux text-white" : "border-slate-300 dark:border-slate-700"
                                }`}>
                                {isChecked && <Check className="w-3.5 h-3.5" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* TAB CONTENT: CHORES */
                <motion.div
                  key="chores"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Tab Explainer Text */}
                  <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-left mb-6">
                    <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-accent-lux" /> What are Daily Hourly Chores?
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Quick, flexible support for regular daily chores (dishwashing, sweeping & mopping, clothes ironing, veggie chopping). Book a custom checklist as needed without any monthly commitments or long-term contracts.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                        Build Daily Chore Checklist
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold italic">
                        Min. base fare ₹299 applies
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {choreOptions.map((chore) => {
                        const isChecked = selectedChores.includes(chore.id);
                        return (
                          <div
                            key={chore.id}
                            onClick={() => toggleChore(chore.id)}
                            className={`p-3.5 rounded-xl border cursor-pointer select-none flex items-center justify-between transition-all duration-300 ${isChecked
                                ? "border-accent-lux/60 bg-accent-lux/[0.03]"
                                : "border-slate-200/10 bg-slate-50/40 dark:bg-slate-950/20 hover:border-slate-300"
                              }`}
                          >
                            <div>
                              <span className="text-xs font-bold text-foreground block">
                                {chore.label}
                              </span>
                              <span className="text-[9px] text-slate-400 mt-0.5 block flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {chore.duration} mins
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-extrabold text-accent-lux">₹{chore.price}</span>
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${isChecked ? "bg-accent-lux border-accent-lux text-white" : "border-slate-300 dark:border-slate-700"
                                }`}>
                                {isChecked && <Check className="w-3.5 h-3.5" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Summary & Checkout Box */}
        <div className="lg:col-span-5 bg-primary-lux dark:bg-slate-900 text-white rounded-[24px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl border border-white/5">
          <div className="absolute top-0 right-0 w-44 h-44 bg-accent-lux/10 rounded-full blur-3xl" />

          <div className="space-y-6 z-10">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pricing Summary</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-success-lux bg-success-lux/10 px-2 py-0.5 rounded-full font-bold">
                <UserCheck className="w-3.5 h-3.5 text-success-lux" /> {availablePros} Pros Active
              </span>
            </div>

            {/* Calculations List */}
            <div className="space-y-4">
              {activeTab === "deep" ? (
                <>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Base Fare ({baseSelection.name})</span>
                    <span className="font-bold">₹{baseSelection.price}</span>
                  </div>
                  {deepAddons.length > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Add-on Checklist ({deepAddons.length})</span>
                      <span className="font-bold text-accent-lux">+₹{deepAddonSum}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs pt-4 border-t border-white/5">
                    <span className="text-slate-400">Estimated Effort</span>
                    <span className="font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {Math.round(deepTotalDuration / 60)} Hours ({deepTotalDuration} min)
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Chore Checklist Sum</span>
                    <span className="font-bold">₹{choreSum}</span>
                  </div>
                  {choresTotalPrice > choreSum && (
                    <div className="flex justify-between text-xs text-amber-400">
                      <span>Minimum Booking Adjustment</span>
                      <span className="font-bold">+₹{choresTotalPrice - choreSum}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs pt-4 border-t border-white/5">
                    <span className="text-slate-400">Estimated Effort</span>
                    <span className="font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {choresTotalDuration} min work window
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Guarantees Box */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2.5 text-[11px] text-slate-350">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-success-lux shrink-0 mt-0.5" />
                <p><strong>₹1,000 No-Show Penalty:</strong> If our Pro is late or cancels, we refund ₹1,000 instantly.</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-success-lux shrink-0 mt-0.5" />
                <p><strong>3-Tier Vetting:</strong> Providers pass criminal check, Aadhaar matches, and local background audits.</p>
              </div>
            </div>
          </div>

          {/* Pricing display & CTA */}
          <div className="mt-8 pt-6 border-t border-white/10 z-10">
            <div className="flex justify-between items-baseline mb-4">
              <span className="text-xs text-slate-400 uppercase font-bold">Total (All Inclusive)</span>
              <span className="text-3xl font-black text-white">
                ₹{activeTab === "deep" ? deepTotalPrice : choresTotalPrice}
              </span>
            </div>

            <button
              onClick={handleBookNow}
              className="w-full bg-accent-lux hover:bg-accent-lux/95 text-white font-bold text-xs py-4 rounded-full shadow-lg cursor-pointer transition-colors flex items-center justify-center gap-2 group"
            >
              Book Verified Pro Now
              <span className="opacity-70 group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-3">
              No registration charge. Cancel or reschedule anytime up to 2 hours before.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

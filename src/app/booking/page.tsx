"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  Plus,
  Trash2,
  Percent,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Smartphone,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Info,
  Home,
  Briefcase,
  Building,
  Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, Address } from "@/store/useStore";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import confetti from "canvas-confetti";

import { InlineCustomDatePicker, InlineCustomTimePicker } from "@/components/booking/CustomDateTimePickerModal";
import { AvailableCouponsSlider } from "@/components/booking/AvailableCouponsSlider";
import MembershipBanner from "@/components/membership/MembershipBanner";

export default function BookingPage() {
  const router = useRouter();
  const {
    cart,
    addToCart,
    removeFromCart,
    addresses,
    addAddress,
    selectedAddressId,
    setSelectedAddressId,
    selectedDate,
    setSelectedDate,
    selectedTimeSlot,
    setSelectedTimeSlot,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    createBooking,
    addNotification,
    bookings,
    isMember,
    membershipTier
  } = useStore();

  const [step, setStep] = useState(0); // 0: Cart/Add-ons, 1: Schedule, 2: Address, 3: Payment, 4: Success
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showCouponsSlider, setShowCouponsSlider] = useState(false);

  // Custom Date and Time expand state & refs
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [showCustomTime, setShowCustomTime] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);

  // Click outside listener for pickers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setShowCustomDate(false);
      }
      if (timePickerRef.current && !timePickerRef.current.contains(e.target as Node)) {
        setShowCustomTime(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // New address form state
  const [newTag, setNewTag] = useState<Address["tag"]>("Home");
  const [newAddressLine, setNewAddressLine] = useState("");
  const [newCity, setNewCity] = useState("Varanasi");

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "pay_after" | "cod">("pay_after");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Simulated booking tracking
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  // Available Time Slots
  const timeSlots = ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"];

  // Generate next 6 dates starting today
  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        dayNum: d.getDate(),
        fullDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        iso: d.toISOString().split("T")[0]
      });
    }
    return dates;
  };

  const dates = getDates();

  const format24To12 = (time24: string): string => {
    if (!time24) return "";
    const [hStr, mStr] = time24.split(":");
    let hour = parseInt(hStr, 10);
    if (isNaN(hour)) return time24;
    const minutes = mStr || "00";
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
    return `${hourStr}:${minutes} ${ampm}`;
  };

  const format12To24 = (time12: string): string => {
    if (!time12) return "";
    const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return "";
    let [_, hStr, mStr, ampm] = match;
    let hour = parseInt(hStr, 10);
    if (ampm.toUpperCase() === "PM" && hour < 12) hour += 12;
    if (ampm.toUpperCase() === "AM" && hour === 12) hour = 0;
    return `${hour < 10 ? '0' : ''}${hour}:${mStr}`;
  };

  const handleApplyCoupon = () => {
    setCouponError("");
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponInput("");
      addNotification("Coupon Applied", `Promo code ${couponInput} applied successfully.`, "success");
    } else {
      setCouponError("Invalid coupon code. Try LUXURY50");
    }
  };

  const handleAddAddressSubmit = () => {
    if (!newAddressLine.trim()) return;
    addAddress({
      tag: newTag,
      addressLine: newAddressLine.trim(),
      city: newCity
    });
    setNewAddressLine("");
    setShowAddAddress(false);
    addNotification("Address Saved", "A new delivery location was registered.", "info");
  };

  const handleNextStep = () => {
    if (step === 0 && cart.length === 0) {
      alert("Your cart is empty. Please select a service to continue.");
      return;
    }
    if (step === 1 && (!selectedDate || !selectedTimeSlot)) {
      alert("Please select a date and arrival time window.");
      return;
    }
    if (step === 2 && !selectedAddressId) {
      alert("Please select or add a service address.");
      return;
    }
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Create final booking
      const newBk = createBooking();
      if (newBk) {
        setCreatedBookingId(newBk.id);
        setStep(4);
        window.scrollTo({ top: 0, behavior: "smooth" });
        // Blast Confetti
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 }
        });
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Pricing math
  const matchedBooking = step === 4 && createdBookingId 
    ? bookings.find(b => b.id === createdBookingId)
    : null;

  const subtotal = matchedBooking
    ? matchedBooking.totalAmount
    : cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let couponDiscount = 0;
  if (matchedBooking) {
    couponDiscount = matchedBooking.discount;
  } else {
    if (appliedCoupon === "HELPMATE20") couponDiscount = Math.min(300, Math.round(subtotal * 0.20));
    else if (appliedCoupon === "LUXURY50") couponDiscount = 150;
    else if (appliedCoupon === "COOLING100") couponDiscount = 100;
    else if (appliedCoupon === "SUPERFEST") couponDiscount = Math.min(500, Math.round(subtotal * 0.25));
    else if (appliedCoupon === "WELCOME100") couponDiscount = 100;
    else if (appliedCoupon === "SUPERDEAL") couponDiscount = Math.min(1000, Math.round(subtotal * 0.25));
  }

  const memberDiscount = (!matchedBooking && isMember) ? Math.round(subtotal * 0.15) : 0;
  const discount = couponDiscount + memberDiscount;

  const total = matchedBooking
    ? matchedBooking.finalAmount
    : Math.max(0, subtotal - discount);

  return (
    <>
      <Header />

      <main className="flex-1 pt-24 font-sans bg-slate-50/50 dark:bg-background pb-20 relative overflow-hidden min-h-screen">
        {/* Glow Effects */}
        <div className="absolute top-24 left-1/4 -translate-x-1/2 w-96 h-96 bg-accent-lux/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-48 right-1/4 translate-x-1/2 w-96 h-96 bg-accent-lux/[0.03] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 py-6">
          {/* Header Action / Back */}
          {step < 4 && (
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-accent-lux transition-colors mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to details
            </button>
          )}

          {/* Stepper Status Tracker */}
          {step < 4 && (
            <div className="mb-10 max-w-3xl mx-auto">
              <div className="flex items-center justify-between relative">
                {/* Connector line */}
                <div className="absolute left-[18px] right-[18px] top-[18px] h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
                <div 
                  className="absolute left-[18px] top-[18px] h-0.5 bg-accent-lux -translate-y-1/2 transition-all duration-500 z-0"
                  style={{ width: `calc(${(step / 3) * 100}% - ${(step / 3) * 36}px)` }}
                />

                {[
                  { label: "Cart", icon: ShoppingBag },
                  { label: "Schedule", icon: Calendar },
                  { label: "Address", icon: MapPin },
                  { label: "Payment", icon: CreditCard }
                ].map((s, idx) => {
                  const Icon = s.icon;
                  const isActive = step >= idx;
                  const isCurrent = step === idx;
                  return (
                    <div key={idx} className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                          isCurrent
                            ? "bg-accent-lux border-accent-lux text-white scale-110 shadow-lg shadow-accent-lux/20"
                            : isActive
                            ? "bg-background border-accent-lux text-accent-lux"
                            : "bg-background border-slate-200 dark:border-slate-800 text-slate-400"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider mt-2 transition-colors duration-500 ${
                          isActive ? "text-accent-lux" : "text-slate-400"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Panel Stepper Content */}
            <div className="lg:col-span-8 space-y-6">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="glass-panel p-6 sm:p-8 shadow-xl rounded-[32px] text-left"
                >
                  
                  {/* STEP 0: Cart Selection & Recommendations */}
                  {step === 0 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                          <ShoppingBag className="w-5 h-5 text-accent-lux" /> Review Service Selections
                        </h2>
                        <p className="text-xs text-slate-450 mt-1">Review items currently slated for your luxury service window.</p>
                      </div>

                      <div className="space-y-3">
                        {cart.length === 0 ? (
                          <div className="py-12 text-center flex flex-col items-center justify-center text-slate-400 space-y-3 bg-slate-50 dark:bg-slate-950/20 rounded-[24px]">
                            <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-800" />
                            <p className="text-xs font-bold uppercase tracking-wider">Your selection is empty</p>
                          </div>
                        ) : (
                          cart.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800"
                            >
                              <div>
                                <span className="text-xs sm:text-sm font-bold text-foreground">{item.name}</span>
                                <p className="text-[10px] text-slate-450 mt-1.5 capitalize">{item.category} • {item.duration} mins</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm font-bold text-foreground">₹{item.price * item.quantity}</span>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-slate-400 hover:text-red-500 cursor-pointer p-1 rounded-full hover:bg-red-500/5 transition-colors"
                                  title="Remove service"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add-on Recommendation Cards */}
                      {cart.length > 0 && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-accent-lux animate-pulse" /> Popular Pairing Recommendations
                          </span>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <button
                              onClick={() => {
                                addToCart({
                                  id: "addon-disinfect",
                                  name: "Full Shield Bio-Disinfection Treatment",
                                  price: 399,
                                  category: "cleaning",
                                  duration: 30
                                });
                                addNotification("Added to Cart", "Bio-Disinfection Treatment added.", "success");
                              }}
                              className="p-4 bg-white dark:bg-slate-950/20 shadow-md hover:shadow-lg rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between h-28 group"
                            >
                              <div>
                                <span className="text-xs font-bold text-foreground group-hover:text-accent-lux transition-colors">Bio-Disinfection Cover</span>
                                <p className="text-[9px] text-slate-400 mt-1">Full-surface sanitizing mist.</p>
                              </div>
                              <div className="flex justify-between items-end w-full">
                                <span className="text-xs font-black text-accent-lux">+₹399</span>
                                <span className="text-[10px] text-accent-lux font-semibold flex items-center gap-0.5">Add <Plus className="w-3 h-3" /></span>
                              </div>
                            </button>

                            <button
                              onClick={() => {
                                addToCart({
                                  id: "addon-warranty",
                                  name: "Extended 90-Day Satisfaction Warranty",
                                  price: 199,
                                  category: "cleaning",
                                  duration: 0
                                });
                                addNotification("Added to Cart", "Satisfaction Warranty added.", "success");
                              }}
                              className="p-4 bg-white dark:bg-slate-950/20 shadow-md hover:shadow-lg rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between h-28 group"
                            >
                              <div>
                                <span className="text-xs font-bold text-foreground group-hover:text-accent-lux transition-colors">90-Day Extension warranty</span>
                                <p className="text-[9px] text-slate-400 mt-1">Premium coverage for absolute peace of mind.</p>
                              </div>
                              <div className="flex justify-between items-end w-full">
                                <span className="text-xs font-black text-accent-lux">+₹199</span>
                                <span className="text-[10px] text-accent-lux font-semibold flex items-center gap-0.5">Add <Plus className="w-3 h-3" /></span>
                              </div>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 1: Premium Schedule Page UI with Active Highlights & Custom Date/Time State */}
                  {step === 1 && (() => {
                    const todayISO = new Date().toISOString().split("T")[0];
                    const isPresetDate = dates.slice(0, 5).some((d) => d.iso === selectedDate);
                    const isCustomDateActive = !!(selectedDate && (!isPresetDate || showCustomDate));
                    const isPresetTime = timeSlots.includes(selectedTimeSlot || "");
                    const isCustomTimeActive = !!(selectedTimeSlot && (!isPresetTime || showCustomTime));

                    return (
                      <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-8 text-left">
                        {/* Section Header */}
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2.5 py-0.5 rounded-full bg-[#782860]/10 text-[#782860] dark:bg-[#782860]/20 dark:text-purple-300 text-[10px] font-black tracking-wider uppercase">
                                Step 2 of 4
                              </span>
                              <span className="text-xs text-slate-400 font-medium">• Fast Technician Dispatch</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2.5">
                              <Calendar className="w-6 h-6 text-[#782860]" /> Schedule Arrival Slot
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select your preferred date & time window for expert home service.</p>
                          </div>

                          {/* Selected Slot Quick Badge */}
                          {selectedDate && selectedTimeSlot && (
                            <div className="self-start sm:self-auto px-4 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700 rounded-2xl flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <div className="text-left">
                                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Selected Arrival</span>
                                <span className="text-xs font-black text-foreground">
                                  {selectedDate} @ {selectedTimeSlot}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* DATE SELECTION SECTION */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-[#782860]" /> 1. Select Service Date
                            </h3>
                            <span className="text-[11px] font-semibold text-slate-400">Available Next 7 Days</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            {dates.slice(0, 5).map((d) => {
                              const isSelected = selectedDate === d.iso && !showCustomDate && !isCustomDateActive;
                              return (
                                <button
                                  key={d.iso}
                                  type="button"
                                  onClick={() => {
                                    setSelectedDate(d.iso);
                                    setShowCustomDate(false);
                                  }}
                                  className={`relative p-4 rounded-2xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                                    isSelected
                                      ? "bg-gradient-to-br from-[#782860] via-[#8a2f6e] to-[#a03480] text-white border-transparent shadow-lg shadow-[#782860]/25 ring-2 ring-[#782860]/50 scale-105"
                                      : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-[#782860]/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                                  }`}
                                >
                                  {isSelected && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-md">
                                      <CheckCircle className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                                    </span>
                                  )}
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-85">{d.label}</span>
                                  <span className="text-lg font-black mt-1">{d.dayNum}</span>
                                  <span className="text-[10px] font-bold opacity-75 mt-0.5">{d.fullDate.split(",")[0]}</span>
                                </button>
                              );
                            })}

                            {/* Custom Date Card Button with Active Indicator */}
                            <div ref={datePickerRef} className="relative">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowCustomDate((prev) => {
                                    const next = !prev;
                                    if (next) setShowCustomTime(false);
                                    return next;
                                  });
                                  if (!selectedDate || isPresetDate) {
                                    setSelectedDate(todayISO);
                                  }
                                }}
                                className={`w-full h-full p-4 rounded-2xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                                  isCustomDateActive || showCustomDate
                                    ? "bg-gradient-to-br from-[#782860] via-[#8a2f6e] to-[#a03480] text-white border-transparent shadow-lg shadow-[#782860]/25 ring-2 ring-[#782860]/50 scale-105"
                                    : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-[#782860]/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                                }`}
                              >
                                {(isCustomDateActive || showCustomDate) && (
                                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-md">
                                    <CheckCircle className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                                  </span>
                                )}
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4 text-current" />
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider">Custom Date</span>
                                </div>
                                <span className="text-xs font-black mt-1 truncate max-w-full">
                                  {isCustomDateActive && selectedDate ? selectedDate : "Calendar"}
                                </span>
                              </button>

                              {/* Floating Calendar Popover */}
                              <AnimatePresence>
                                {showCustomDate && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                                    transition={{ duration: 0.18 }}
                                    className="absolute top-full right-0 mt-2 z-50 shadow-2xl rounded-3xl"
                                  >
                                    <InlineCustomDatePicker
                                      selectedDate={selectedDate}
                                      onSelectDate={(iso) => {
                                        setSelectedDate(iso);
                                        setShowCustomDate(false);
                                      }}
                                    />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>

                        {/* TIME SELECTION SECTION */}
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                              <Clock className="w-4 h-4 text-[#782860]" /> 2. Select Arrival Time Window
                            </h3>
                            <span className="text-[11px] font-semibold text-slate-400">2-Hour Arrival Slot</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                            {timeSlots.map((slot) => {
                              const isSelected = selectedTimeSlot === slot && !isCustomTimeActive && !showCustomTime;
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => {
                                    setSelectedTimeSlot(slot);
                                    setShowCustomTime(false);
                                  }}
                                  className={`relative p-3.5 rounded-2xl border text-center cursor-pointer text-xs font-black transition-all duration-300 ${
                                    isSelected
                                      ? "bg-gradient-to-br from-[#782860] via-[#8a2f6e] to-[#a03480] text-white border-transparent shadow-lg shadow-[#782860]/25 ring-2 ring-[#782860]/50 scale-105"
                                      : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-[#782860]/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                                  }`}
                                >
                                  {isSelected && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-md">
                                      <CheckCircle className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                                    </span>
                                  )}
                                  {slot}
                                </button>
                              );
                            })}

                            {/* Custom Time Card Button with Active Indicator */}
                            <div ref={timePickerRef} className="relative">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowCustomTime((prev) => {
                                    const next = !prev;
                                    if (next) setShowCustomDate(false);
                                    return next;
                                  });
                                  if (!selectedTimeSlot || isPresetTime) {
                                    setSelectedTimeSlot("09:00 AM");
                                  }
                                }}
                                className={`w-full h-full p-3.5 rounded-2xl border text-center cursor-pointer flex flex-col items-center justify-center transition-all duration-300 ${
                                  isCustomTimeActive || showCustomTime
                                    ? "bg-gradient-to-br from-[#782860] via-[#8a2f6e] to-[#a03480] text-white border-transparent shadow-lg shadow-[#782860]/25 ring-2 ring-[#782860]/50 scale-105"
                                    : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-[#782860]/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                                }`}
                              >
                                {(isCustomTimeActive || showCustomTime) && (
                                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-md">
                                    <CheckCircle className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                                  </span>
                                )}
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <Clock className="w-3.5 h-3.5 text-current" />
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider">Custom Time</span>
                                </div>
                                <span className="text-xs font-black truncate max-w-full">
                                  {isCustomTimeActive && selectedTimeSlot ? selectedTimeSlot : "Clock Dial"}
                                </span>
                              </button>

                              {/* Floating Time Popover */}
                              <AnimatePresence>
                                {showCustomTime && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                                    transition={{ duration: 0.18 }}
                                    className="absolute bottom-full right-0 mb-2 z-50 shadow-2xl rounded-3xl"
                                  >
                                    <InlineCustomTimePicker
                                      selectedTime={selectedTimeSlot}
                                      onSelectTime={(time12) => {
                                        setSelectedTimeSlot(time12);
                                        setShowCustomTime(false);
                                      }}
                                    />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>

                        {/* IMPORTANT AVAILABILITY NOTE BANNER */}
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 bg-amber-50/70 dark:bg-amber-950/25 p-5 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                              <Info className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-amber-950 dark:text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                                Important Availability Note
                              </h4>
                              <p className="text-xs text-amber-900/90 dark:text-amber-300/80 mt-1 leading-relaxed">
                                Please note: Available dates and arrival time slots may vary depending on service type, location, and real-time partner availability. Schedules are updated dynamically and may differ over time.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <span className="px-3.5 py-1.5 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-extrabold text-[11px] rounded-xl flex items-center gap-1.5 border border-amber-500/20 shadow-sm">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Dynamic Slots
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* STEP 2: Premium Address UI & Form */}
                  {step === 2 && (
                    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6 text-left">
                      {/* Section Header */}
                      <div className="border-b border-slate-100 dark:border-slate-800 pb-5 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#782860]/10 text-[#782860] dark:bg-[#782860]/20 dark:text-purple-300 text-[10px] font-black tracking-wider uppercase">
                              Step 3 of 4
                            </span>
                            <span className="text-xs text-slate-400 font-medium">• Service Location</span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2.5">
                            <MapPin className="w-6 h-6 text-[#782860]" /> Select Service Location
                          </h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Specify where our verified professional team will arrive to deliver service.</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowAddAddress(!showAddAddress)}
                          className="px-4 py-2 bg-[#782860]/10 text-[#782860] dark:bg-[#782860]/20 dark:text-purple-300 hover:bg-[#782860] hover:text-white font-extrabold text-xs rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm"
                        >
                          <Plus className="w-4 h-4" /> Add Address
                        </button>
                      </div>

                      {/* Add Address Form Drawer Panel */}
                      <AnimatePresence>
                        {showAddAddress && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-left overflow-hidden shadow-inner"
                          >
                            <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                              <Plus className="w-4 h-4 text-[#782860]" /> Add New Service Location
                            </h4>

                            <div className="flex gap-2.5">
                              {(["Home", "Work", "Other"] as const).map((tag) => {
                                const isTagActive = newTag === tag;
                                const TagIcon = tag === "Home" ? Home : tag === "Work" ? Briefcase : Building;
                                return (
                                  <button
                                    key={tag}
                                    type="button"
                                    onClick={() => setNewTag(tag)}
                                    className={`px-4 py-2 rounded-2xl text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1.5 ${
                                      isTagActive
                                        ? "bg-[#782860] text-white shadow-md shadow-[#782860]/30 scale-105"
                                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                                    }`}
                                  >
                                    <TagIcon className="w-3.5 h-3.5" />
                                    {tag}
                                  </button>
                                );
                              })}
                            </div>
                            
                            <div className="space-y-3">
                              <input
                                type="text"
                                placeholder="House / Flat No., Building Name, Street & Landmark..."
                                value={newAddressLine}
                                onChange={(e) => setNewAddressLine(e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3.5 rounded-2xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-[#782860]/40 transition-all"
                              />
                              <input
                                type="text"
                                placeholder="City"
                                value={newCity}
                                disabled
                                className="w-full bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-750 px-4 py-3 rounded-2xl text-xs text-slate-400 select-none cursor-not-allowed"
                              />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                              <button
                                type="button"
                                onClick={() => setShowAddAddress(false)}
                                className="px-5 py-2.5 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleAddAddressSubmit}
                                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#782860] to-[#a03480] hover:from-[#652050] hover:to-[#8b2d70] text-xs font-black text-white cursor-pointer shadow-lg shadow-[#782860]/25 transition-all"
                              >
                                Save Location
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Existing Address Cards Grid */}
                      <div className="space-y-3">
                        {addresses.map((addr) => {
                          const isSelected = selectedAddressId === addr.id;
                          const TagIcon = addr.tag === "Home" ? Home : addr.tag === "Work" ? Briefcase : Building;

                          return (
                            <div
                              key={addr.id}
                              onClick={() => setSelectedAddressId(addr.id)}
                              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-start justify-between gap-4 select-none ${
                                isSelected
                                  ? "border-[#782860] bg-gradient-to-r from-[#782860]/5 via-purple-500/5 to-transparent shadow-md ring-2 ring-[#782860]/30 scale-[1.01]"
                                  : "border-slate-200 dark:border-slate-800/80 hover:border-[#782860]/40 bg-slate-50/50 dark:bg-slate-950/40"
                              }`}
                            >
                              <div className="flex items-start gap-3.5">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${
                                  isSelected ? "border-[#782860] bg-[#782860]" : "border-slate-300 dark:border-slate-700"
                                }`}>
                                  {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <div className="space-y-1 text-left">
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider ${
                                    isSelected
                                      ? "bg-[#782860] text-white"
                                      : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                  }`}>
                                    <TagIcon className="w-3 h-3" />
                                    {addr.tag}
                                  </span>
                                  <p className="text-sm font-extrabold text-foreground pt-1 leading-snug">{addr.addressLine}</p>
                                  <p className="text-xs text-slate-400 font-medium">{addr.city}, UP</p>
                                </div>
                              </div>

                              {isSelected && (
                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-[10px] rounded-xl flex items-center gap-1 shrink-0 border border-emerald-500/20">
                                  <CheckCircle className="w-3 h-3" /> Selected
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Secure Payment details */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-accent-lux" /> Complete Secure Checkout
                        </h2>
                        <p className="text-xs text-slate-450 mt-1">Select authorization method. No amount will be debited until work is done.</p>
                      </div>

                      {/* Payment Options & Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                        
                        {/* Payment Option Tabs (Left) */}
                        <div className="md:col-span-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/30 border-r border-slate-200 dark:border-slate-800">
                          {(["pay_after", "upi", "card", "cod"] as const).map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setPaymentMethod(method)}
                              className={`py-4 px-4 text-xs font-bold capitalize text-left transition-all cursor-pointer border-b border-slate-200 dark:border-slate-800 last:border-b-0 flex items-center justify-between ${
                                paymentMethod === method
                                  ? "bg-white dark:bg-slate-900 border-l-4 border-l-[#782860] text-[#782860] dark:text-purple-300 font-extrabold"
                                  : "border-l-4 border-l-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                            >
                              <span>
                                {method === "pay_after" && "Pay After Service"}
                                {method === "upi" && "Instant UPI"}
                                {method === "card" && "Credit / Debit Card"}
                                {method === "cod" && "Cash on Delivery"}
                              </span>
                              {method === "pay_after" && (
                                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase">
                                  Popular
                                </span>
                              )}
                            </button>
                          ))}
                        </div>

                        {/* Payment Details Container (Right) */}
                        <div className="md:col-span-2 p-6 bg-white dark:bg-slate-900 flex flex-col justify-center">
                          {paymentMethod === "pay_after" && (
                            <div className="flex flex-col justify-center gap-3 p-6 bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 rounded-2xl text-left h-full">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                                  <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950 dark:text-emerald-200">
                                    Pay After Service Completion
                                  </h4>
                                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                                    Zero Upfront Payment Today
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-emerald-900/90 dark:text-emerald-300/80 mt-1 leading-relaxed">
                                Inspect the completed work first! You can pay comfortably via Cash, UPI, or Card directly to our verified technician after you are 100% satisfied.
                              </p>
                            </div>
                          )}

                          {paymentMethod === "card" && (
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Card Number</label>
                                <input
                                  type="text"
                                  placeholder="4111 2222 3333 4444"
                                  value={cardNumber}
                                  onChange={(e) => setCardNumber(e.target.value)}
                                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-accent-lux"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Expiry Date</label>
                                  <input
                                    type="text"
                                    placeholder="MM/YY"
                                    value={cardExpiry}
                                    onChange={(e) => setCardExpiry(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-accent-lux"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">CVV</label>
                                  <input
                                    type="password"
                                    placeholder="***"
                                    value={cardCvv}
                                    onChange={(e) => setCardCvv(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-accent-lux"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {paymentMethod === "upi" && (
                            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950/20 border border-slate-200/10 rounded-2xl h-full">
                              <Smartphone className="w-12 h-12 text-accent-lux animate-pulse mb-4" />
                              <p className="text-xs font-bold text-foreground text-center">Scan QR Code or Approve UPI Request</p>
                              <p className="text-[10px] text-slate-400 text-center mt-1">A payment request notification will trigger in your UPI application.</p>
                            </div>
                          )}

                          {paymentMethod === "cod" && (
                            <div className="flex items-center gap-3 p-5 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-2xl text-left h-full">
                              <ShieldCheck className="w-5 h-5 shrink-0 text-amber-500" />
                              <div>
                                <p className="text-xs font-bold">Pay Cash or Card After Completion</p>
                                <p className="text-[10px] text-slate-400 mt-1">Pay comfortably to our verified professionals once the services are finished.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Success confirmation screen */}
                  {step === 4 && (
                    <div className="flex flex-col items-center justify-center text-center py-10 space-y-6 max-w-xl mx-auto">
                      <div className="w-16 h-16 rounded-full bg-success-lux/10 border border-success-lux/20 flex items-center justify-center text-success-lux">
                        <CheckCircle className="w-10 h-10 animate-bounce" />
                      </div>
                      
                      <div className="space-y-2">
                        <h2 className="text-2xl font-black text-foreground tracking-tight">Luxury Service Booked!</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                          Your booking ID is <span className="font-extrabold text-foreground">{createdBookingId}</span>. We've assigned a top background-verified partner who will arrive on schedule.
                        </p>
                      </div>

                      <div className="w-full bg-slate-50 dark:bg-slate-950/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 text-left space-y-4 shadow-sm">
                        <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest font-black">
                          <span>Booking Summary</span>
                          <span>Invoice Ready</span>
                        </div>
                        
                        <div className="space-y-2 text-xs text-slate-650 dark:text-slate-350">
                          <p><strong>Scheduled Date:</strong> {selectedDate}</p>
                          <p><strong>Arrival Window:</strong> {selectedTimeSlot}</p>
                          <p><strong>Total Authorized:</strong> ₹{total}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => router.push("/profile?tab=bookings")}
                        className="px-8 py-3.5 bg-accent-lux hover:bg-accent-lux/95 text-white font-bold text-xs rounded-full shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
                      >
                        Track Professional Timeline
                      </button>
                    </div>
                  )}

                  {/* Stepper Navigation Actions */}
                  {step < 4 && (
                    <div className="flex justify-between items-center pt-8 border-t border-slate-100 dark:border-slate-800/80 mt-8 gap-4">
                      {step > 0 ? (
                        <button
                          onClick={handlePrevStep}
                          className="px-5 py-3 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                      ) : (
                        <div />
                      )}
                      
                      <button
                        onClick={handleNextStep}
                        className="px-6 py-3 rounded-full bg-accent-lux hover:bg-accent-lux/95 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-transform duration-300 hover:scale-103 active:scale-97"
                      >
                        {step === 3 ? "Authorize & Book" : "Continue"} <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Sticky Summary Sidebar */}
            {step <= 4 && (
               <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                 
                 {/* Price Breakdown Invoice Card */}
                 <div className="glass-panel p-6 space-y-5 text-left">
                   <div>
                     <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Booking Invoice</h3>
                   </div>
 
                   <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
                     <div className="flex justify-between items-center text-slate-500">
                       <span>Services Base Subtotal</span>
                       <span className="font-bold text-foreground">₹{subtotal}</span>
                     </div>
 
                     {couponDiscount > 0 && (
                        <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold">
                          <span>Promo Coupon ({appliedCoupon})</span>
                          <span>-₹{couponDiscount}</span>
                        </div>
                      )}

                      {memberDiscount > 0 && (
                        <div className="flex justify-between items-center text-amber-600 dark:text-amber-400 font-bold">
                          <span className="flex items-center gap-1">👑 VIP Member Discount (15%)</span>
                          <span>-₹{memberDiscount}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-slate-500">
                        <span>Varanasi Regional Tax (18%)</span>
                        <span className="font-bold text-foreground">₹0</span>
                      </div>

                      <div className="flex justify-between items-center text-slate-500">
                        <span>Luxury Partner Dispatch Fee</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">FREE</span>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-4 text-sm">
                        <span className="font-bold text-foreground">Total Due Now</span>
                        <span className="font-black text-accent-lux text-base">₹{total}</span>
                      </div>

                     {/* Promo Coupon Section inside Summary Card */}
                     <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                       <div className="flex items-center justify-between">
                         <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Discount Coupon</span>
                         <button
                           type="button"
                           onClick={() => setShowCouponsSlider(true)}
                           className="text-[11px] font-extrabold text-[#782860] dark:text-purple-300 hover:underline flex items-center gap-1 cursor-pointer"
                         >
                           <Tag className="w-3 h-3" /> View Offers (5)
                         </button>
                       </div>

                       <div className="flex gap-2">
                         <input
                           type="text"
                           placeholder="Enter coupon code"
                           value={couponInput}
                           onChange={(e) => setCouponInput(e.target.value)}
                           className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-accent-lux animate-fadeIn"
                         />
                         <button
                           onClick={handleApplyCoupon}
                           className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-750 text-xs font-bold text-white cursor-pointer transition-colors"
                         >
                           Apply
                         </button>
                       </div>
                       {couponError && <p className="text-[10px] text-red-500 pl-2 animate-shake">{couponError}</p>}
                       {appliedCoupon && (
                         <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3.5 py-2 rounded-xl text-[11px] font-bold animate-fadeIn">
                           <span className="flex items-center gap-1.5"><Percent className="w-3.5 h-3.5 text-emerald-500" /> Code {appliedCoupon} Active</span>
                           <button onClick={removeCoupon} className="hover:underline text-[10px] text-rose-500 cursor-pointer">Remove</button>
                         </div>
                       )}
                     </div>
 
                     <div className="space-y-3 text-[10px] text-slate-400 dark:text-slate-455 border-t border-slate-100 dark:border-slate-800 pt-4">
                       <div className="flex items-center gap-2">
                         <ShieldCheck className="w-4 h-4 text-emerald-500" /> Flat-rate guaranteed pricing
                       </div>
                       <div className="flex items-center gap-2">
                         <Clock className="w-4 h-4 text-[#782860]" /> Arrives within the scheduling window
                       </div>
                     </div>
                   </div>

                   {/* MEMBERSHIP PROMOTIONAL CARD */}
                   <MembershipBanner variant="checkout" />
                 </div>
                </div>
              )}
            </div>
          </div>
      </main>

      {/* Available Admin Coupons Slider / Drawer */}
      <AvailableCouponsSlider
        isOpen={showCouponsSlider}
        onClose={() => setShowCouponsSlider(false)}
        cartTotal={subtotal}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={(code) => {
          applyCoupon(code);
          addNotification("Coupon Applied!", `Code ${code} discount activated.`, "success");
        }}
        onRemoveCoupon={removeCoupon}
      />

      <Footer />
    </>
  );
}

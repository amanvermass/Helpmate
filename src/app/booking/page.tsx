"use client";

import { useState, useEffect } from "react";
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
  ShoppingBag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, Address } from "@/store/useStore";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import confetti from "canvas-confetti";

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
    bookings
  } = useStore();

  const [step, setStep] = useState(0); // 0: Cart/Add-ons, 1: Schedule, 2: Address, 3: Payment, 4: Success
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [showAddAddress, setShowAddAddress] = useState(false);

  // New address form state
  const [newTag, setNewTag] = useState<Address["tag"]>("Home");
  const [newAddressLine, setNewAddressLine] = useState("");
  const [newCity, setNewCity] = useState("Varanasi");

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");
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

  let discount = 0;
  if (matchedBooking) {
    discount = matchedBooking.discount;
  } else {
    if (appliedCoupon === "LUXURY50") discount = Math.min(500, subtotal * 0.15);
    if (appliedCoupon === "WELCOME100") discount = 100;
    if (appliedCoupon === "SUPERDEAL") discount = Math.min(1000, subtotal * 0.25);
  }

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
                            : "bg-background border-slate-250 dark:border-slate-800 text-slate-400"
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
                              className="flex justify-between items-center p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850"
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
                              className="p-4 bg-white dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800 rounded-2xl text-left hover:border-accent-lux transition-all cursor-pointer flex flex-col justify-between h-28 group"
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
                              className="p-4 bg-white dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800 rounded-2xl text-left hover:border-accent-lux transition-all cursor-pointer flex flex-col justify-between h-28 group"
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

                  {/* STEP 1: Scheduling Calendar Grid */}
                  {step === 1 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-accent-lux" /> Select Arrival Date
                        </h2>
                        <p className="text-xs text-slate-450 mt-1">Select a verified service booking day for our specialists.</p>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {dates.map((d) => {
                          const isSelected = selectedDate === d.iso;
                          return (
                            <button
                              key={d.iso}
                              onClick={() => setSelectedDate(d.iso)}
                              className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                                isSelected
                                  ? "bg-accent-lux text-white border-accent-lux shadow-lg shadow-accent-lux/20 scale-105"
                                  : "bg-slate-50 dark:bg-slate-900 border-slate-150 dark:border-slate-800/80 hover:border-accent-lux/40 text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              <span className="text-[9px] font-bold uppercase tracking-wider opacity-85">{d.label}</span>
                              <span className="text-base font-black mt-1.5">{d.dayNum}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80">
                        <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2 mb-4">
                          <Clock className="w-5 h-5 text-accent-lux" /> Select Arrival Time Window
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {timeSlots.map((slot) => {
                            const isSelected = selectedTimeSlot === slot;
                            return (
                              <button
                                key={slot}
                                onClick={() => setSelectedTimeSlot(slot)}
                                className={`p-4 rounded-2xl border text-center cursor-pointer text-xs font-bold transition-all duration-300 ${
                                  isSelected
                                    ? "bg-accent-lux text-white border-accent-lux shadow-lg shadow-accent-lux/20 scale-105"
                                    : "bg-slate-50 dark:bg-slate-900 border-slate-150 dark:border-slate-800/80 hover:border-accent-lux/40 text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Address List & Add New Address Form */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-accent-lux" /> Select Service Address
                          </h2>
                          <p className="text-xs text-slate-450 mt-1">Specify where our uniformed team will perform the work.</p>
                        </div>
                        <button
                          onClick={() => setShowAddAddress(!showAddAddress)}
                          className="text-xs text-accent-lux font-bold hover:underline flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <Plus className="w-4 h-4" /> Add Address
                        </button>
                      </div>

                      {/* Add Address Form Panel */}
                      <AnimatePresence>
                        {showAddAddress && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-5 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4 overflow-hidden text-left"
                          >
                            <div className="flex gap-2">
                              {(["Home", "Work", "Other"] as const).map((tag) => (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => setNewTag(tag)}
                                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                    newTag === tag
                                      ? "bg-accent-lux text-white"
                                      : "bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800"
                                  }`}
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                            
                            <div className="space-y-3">
                              <input
                                type="text"
                                placeholder="Street Address, Apt/House No., Suite..."
                                value={newAddressLine}
                                onChange={(e) => setNewAddressLine(e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-xs text-foreground focus:outline-none focus:border-accent-lux"
                              />
                              <input
                                type="text"
                                placeholder="City"
                                value={newCity}
                                disabled
                                className="w-full bg-slate-100/80 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 px-4 py-3 rounded-xl text-xs text-slate-400 select-none"
                              />
                            </div>

                            <div className="flex justify-end gap-2.5 pt-2">
                              <button
                                onClick={() => setShowAddAddress(false)}
                                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-750 dark:text-slate-300 cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleAddAddressSubmit}
                                className="px-4 py-2 rounded-xl bg-accent-lux hover:bg-accent-lux/95 text-[10px] font-bold text-white cursor-pointer shadow-md"
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
                          return (
                            <div
                              key={addr.id}
                              onClick={() => setSelectedAddressId(addr.id)}
                              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-start gap-4 select-none ${
                                isSelected
                                  ? "border-accent-lux bg-accent-lux/[0.03] shadow-sm"
                                  : "border-slate-150 dark:border-slate-850 hover:border-accent-lux/40 bg-white dark:bg-slate-950/20"
                              }`}
                            >
                              <div className="w-5 h-5 rounded-full border border-slate-350 dark:border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                                {isSelected && <div className="w-2.5 h-2.5 bg-accent-lux rounded-full animate-pulse" />}
                              </div>
                              <div>
                                <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450 text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                  {addr.tag}
                                </span>
                                <p className="text-xs font-bold text-foreground mt-3 leading-snug">{addr.addressLine}</p>
                                <p className="text-[10px] text-slate-400 mt-1">{addr.city}</p>
                              </div>
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
                          {(["card", "upi", "cod"] as const).map((method) => (
                            <button
                              key={method}
                              onClick={() => setPaymentMethod(method)}
                              className={`py-4 px-4 text-xs font-bold capitalize text-left transition-all cursor-pointer border-b border-slate-200 dark:border-slate-800 last:border-b-0 ${
                                paymentMethod === method
                                  ? "bg-white dark:bg-slate-900 border-l-4 border-l-accent-lux text-accent-lux"
                                  : "border-l-4 border-l-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                            >
                              {method === "card" && "Credit / Debit Card"}
                              {method === "upi" && "Instant UPI"}
                              {method === "cod" && "Cash/UPI After Service"}
                            </button>
                          ))}
                        </div>

                        {/* Payment Details Container (Right) */}
                        <div className="md:col-span-2 p-6 bg-white dark:bg-slate-900">
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
                            <div className="flex items-center gap-3 p-5 bg-amber-550/10 border border-amber-500/10 text-amber-600 dark:text-amber-500 rounded-2xl text-left h-full">
                              <ShieldCheck className="w-5 h-5 shrink-0" />
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

                      <div className="w-full bg-slate-50 dark:bg-slate-950/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 text-left space-y-4 shadow-sm">
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
 
                     {discount > 0 && (
                       <div className="flex justify-between items-center text-success-lux">
                         <span>Coupon ({appliedCoupon})</span>
                         <span className="font-bold">-₹{discount}</span>
                       </div>
                     )}
 
                     <div className="flex justify-between items-center text-slate-500">
                       <span>Varanasi Regional Tax (18%)</span>
                       <span className="font-bold text-foreground">₹0</span>
                     </div>
 
                     <div className="flex justify-between items-center text-slate-500">
                       <span>Luxury Partner Dispatch Fee</span>
                       <span className="text-success-lux font-extrabold">FREE</span>
                     </div>
 
                     <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-4 text-sm">
                       <span className="font-bold text-foreground">Total Due Now</span>
                       <span className="font-black text-accent-lux text-base">₹{total}</span>
                     </div>
                   </div>
 
                   {/* Promo Coupon Section inside Summary Card */}
                   {step === 3 && (
                     <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                       <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Discount Coupon</span>
                       <div className="flex gap-2">
                         <input
                           type="text"
                           placeholder="Enter code"
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
                         <div className="flex items-center justify-between bg-success-lux/10 border border-success-lux/20 text-success-lux px-3.5 py-2 rounded-xl text-[11px] font-bold animate-fadeIn">
                           <span className="flex items-center gap-1.5"><Percent className="w-3.5 h-3.5" /> Code {appliedCoupon} Active</span>
                           <button onClick={removeCoupon} className="hover:underline text-[10px] cursor-pointer">Remove</button>
                         </div>
                       )}
                     </div>
                   )}
 
                   <div className="space-y-3 text-[10px] text-slate-400 dark:text-slate-455 border-t border-slate-100 dark:border-slate-800 pt-4">
                     <div className="flex items-center gap-2">
                       <ShieldCheck className="w-4 h-4 text-success-lux" /> Flat-rate guaranteed pricing
                     </div>
                     <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4 text-accent-lux" /> Arrives within the scheduling window
                     </div>
                   </div>
                 </div>
                </div>
              )}
            </div>
          </div>
      </main>

      <Footer />
    </>
  );
}

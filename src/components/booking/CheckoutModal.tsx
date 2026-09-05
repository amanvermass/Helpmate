"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  X,
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
  Sparkles,
  ShoppingBag,
  Info,
  Home,
  Briefcase,
  Building,
  Tag,
  Users,
  User,
  HeartHandshake,
  Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, Address, CartItem } from "@/store/useStore";
import confetti from "canvas-confetti";
import { InlineCustomDatePicker, InlineCustomTimePicker } from "@/components/booking/CustomDateTimePickerModal";
import { AvailableCouponsSlider } from "@/components/booking/AvailableCouponsSlider";
import MembershipBanner from "@/components/membership/MembershipBanner";
import { AddAddressForm } from "@/components/booking/AddAddressForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceCategory: string;
  serviceDuration: number;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  serviceId,
  serviceName,
  servicePrice,
  serviceCategory,
  serviceDuration
}: Props) {
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
    isMember
  } = useStore();

  const [step, setStep] = useState(0); // 0: Addons/Cart, 1: Schedule, 2: Address, 3: Payment
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [showAddAddress, setShowAddAddress] = useState(false);
  
  // New address form state
  const [newTag, setNewTag] = useState<Address["tag"]>("Home");
  const [newAddressLine, setNewAddressLine] = useState("");
  const [newCity, setNewCity] = useState("Varanasi");

  // Custom Date & Time expand state & refs
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

  // Initialize cart with current service if empty
  useEffect(() => {
    if (isOpen && cart.length === 0) {
      addToCart({
        id: serviceId,
        name: serviceName,
        price: servicePrice,
        category: serviceCategory,
        duration: serviceDuration
      });
    }
  }, [isOpen, serviceId, serviceName, servicePrice, serviceCategory, serviceDuration, cart, addToCart]);

  if (!isOpen) return null;

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
    } else {
      setCouponError("Invalid coupon code.");
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
    } else {
      // Create final booking
      const newBk = createBooking();
      if (newBk) {
        setCreatedBookingId(newBk.id);
        setStep(4);
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<"pay_after" | "upi" | "card" | "cod">("pay_after");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [showCouponsSlider, setShowCouponsSlider] = useState(false);

  // Simulated booking tracking
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  // Pricing math
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let couponDiscount = 0;
  if (appliedCoupon === "HELPMATE20") couponDiscount = Math.min(300, Math.round(subtotal * 0.20));
  else if (appliedCoupon === "LUXURY50") couponDiscount = 150;
  else if (appliedCoupon === "COOLING100") couponDiscount = 100;
  else if (appliedCoupon === "SUPERFEST") couponDiscount = Math.min(500, Math.round(subtotal * 0.25));
  else if (appliedCoupon === "WELCOME100") couponDiscount = 100;
  else if (appliedCoupon === "SUPERDEAL") couponDiscount = Math.min(1000, Math.round(subtotal * 0.25));

  const memberDiscount = isMember ? Math.round(subtotal * 0.15) : 0;
  const discount = couponDiscount + memberDiscount;
  const total = Math.max(0, subtotal - discount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel w-full max-w-3xl rounded-[32px] shadow-2xl overflow-hidden my-8 relative text-left border border-slate-200 dark:border-slate-800"
      >
        {/* Modal Header */}
        <div className="p-6 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-lux/10 flex items-center justify-center text-accent-lux">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-foreground tracking-tight">Express Checkout</h3>
              <p className="text-[11px] text-slate-400">Complete your luxury service reservation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-200/50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-foreground cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Header Bar */}
        {step < 4 && (
          <div className="px-8 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-950/20">
            <div className="flex items-center justify-between relative max-w-lg mx-auto">
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

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          {/* STEP 0: Cart Review */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-accent-lux" /> Review Cart Items
                </h4>
                <p className="text-xs text-slate-400 mt-1">Confirm details of your selected services</p>
              </div>

              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800"
                  >
                    <div>
                      <span className="text-xs font-bold text-foreground">{item.name}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5 capitalize">{item.category} • {item.duration} mins</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-foreground">₹{item.price * item.quantity}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-red-500 cursor-pointer p-1 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* MEMBERSHIP PROMOTIONAL BANNER */}
              <MembershipBanner variant="compact" />
            </div>
          )}

                    {/* STEP 1: Quick Cards with Active Highlight State */}
          {step === 1 && (() => {
            const todayISO = new Date().toISOString().split("T")[0];
            const isPresetDate = dates.slice(0, 5).some((d) => d.iso === selectedDate);
            const isCustomDateActive = !!(selectedDate && (!isPresetDate || showCustomDate));
            const isPresetTime = timeSlots.includes(selectedTimeSlot || "");
            const isCustomTimeActive = !!(selectedTimeSlot && (!isPresetTime || showCustomTime));

            return (
              <div className="space-y-6 text-left">
                <div>
                  <h4 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#782860]" /> Select Booking Date
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Choose a preset day or pick any custom calendar date</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
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
                          className={`relative p-3 rounded-2xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                            isSelected
                              ? "bg-gradient-to-br from-[#782860] via-[#8a2f6e] to-[#a03480] text-white border-transparent shadow-lg shadow-[#782860]/25 ring-2 ring-[#782860]/50 scale-105"
                              : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-[#782860]/40 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-md">
                              <CheckCircle className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                            </span>
                          )}
                          <span className="text-[10px] font-bold uppercase tracking-wider">{d.label}</span>
                          <span className="text-sm font-black mt-1">{d.dayNum}</span>
                        </button>
                      );
                    })}

                    {/* Custom Date Card Button */}
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
                        className={`w-full h-full p-3 rounded-2xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                          isCustomDateActive || showCustomDate
                            ? "bg-gradient-to-br from-[#782860] via-[#8a2f6e] to-[#a03480] text-white border-transparent shadow-lg shadow-[#782860]/25 ring-2 ring-[#782860]/50 scale-105"
                            : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-[#782860]/40 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {(isCustomDateActive || showCustomDate) && (
                          <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-md">
                            <CheckCircle className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                          </span>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-bold uppercase">Custom</span>
                        </div>
                        <span className="text-[11px] font-extrabold mt-1 truncate max-w-full">
                          {isCustomDateActive && selectedDate ? selectedDate : "Calendar"}
                        </span>
                      </button>

                      {/* Floating Popover on Top */}
                      <AnimatePresence>
                        {showCustomDate && (
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.96 }}
                            transition={{ duration: 0.18 }}
                            className="absolute bottom-full right-0 mb-2 z-50 shadow-2xl rounded-2xl"
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

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 relative">
                  <h4 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#782860]" /> Select Arrival Time Window
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mt-4">
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
                          className={`relative p-3 rounded-2xl border text-center cursor-pointer text-xs font-black transition-all duration-300 ${
                            isSelected
                              ? "bg-gradient-to-br from-[#782860] via-[#8a2f6e] to-[#a03480] text-white border-transparent shadow-lg shadow-[#782860]/25 ring-2 ring-[#782860]/50 scale-105"
                              : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-[#782860]/40 text-slate-700 dark:text-slate-300"
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

                    {/* Custom Time Card Button */}
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
                        className={`w-full h-full p-3 rounded-2xl border text-center cursor-pointer flex flex-col items-center justify-center transition-all duration-300 ${
                          isCustomTimeActive || showCustomTime
                            ? "bg-gradient-to-br from-[#782860] via-[#8a2f6e] to-[#a03480] text-white border-transparent shadow-lg shadow-[#782860]/25 ring-2 ring-[#782860]/50 scale-105"
                            : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-[#782860]/40 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {(isCustomTimeActive || showCustomTime) && (
                          <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-md">
                            <CheckCircle className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                          </span>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-bold uppercase">Custom</span>
                        </div>
                        <span className="text-[11px] font-extrabold mt-0.5 truncate max-w-full">
                          {isCustomTimeActive && selectedTimeSlot ? selectedTimeSlot : "Clock Dial"}
                        </span>
                      </button>

                      {/* Floating Popover on Top */}
                      <AnimatePresence>
                        {showCustomTime && (
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.96 }}
                            transition={{ duration: 0.18 }}
                            className="absolute bottom-full right-0 mb-2 z-50 shadow-2xl rounded-2xl"
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
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 bg-amber-50/70 dark:bg-amber-950/25 p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Info className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-amber-950 dark:text-amber-200 uppercase tracking-wider">
                        Important Availability Note
                      </h4>
                      <p className="text-xs text-amber-900/90 dark:text-amber-300/80 mt-0.5 leading-relaxed">
                        Please note: Available dates and arrival time slots may vary depending on service type, location, and real-time partner availability. Schedules are updated dynamically and may differ over time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* STEP 2: Address configuration */}
          {step === 2 && (
            <div className="space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h4 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#782860]" /> Select Service Location
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Specify where our uniformed team will perform the work</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="px-3.5 py-1.5 bg-[#782860]/10 text-[#782860] dark:bg-[#782860]/20 dark:text-purple-300 hover:bg-[#782860] hover:text-white font-extrabold text-xs rounded-2xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Address
                </button>
              </div>

              {/* Add Address Form Accordion */}
              <AnimatePresence>
                {showAddAddress && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AddAddressForm
                      onSave={(newAddr) => {
                        addAddress(newAddr);
                        setShowAddAddress(false);
                      }}
                      onCancel={() => setShowAddAddress(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Existing Address Grid */}
              <div className="space-y-3">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  const TagIcon = addr.tag.toLowerCase().includes("work") || addr.tag.toLowerCase().includes("office") ? Briefcase : addr.tag.toLowerCase().includes("home") ? Home : Building;
                  const RecipientIcon = addr.recipientType === "Family Member" ? Users : addr.recipientType === "Friend / Neighbor" ? HeartHandshake : addr.recipientType === "Office / Work" ? Briefcase : User;

                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4.5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-start justify-between gap-3 select-none ${
                        isSelected
                          ? "border-[#782860] bg-gradient-to-r from-[#782860]/5 via-purple-500/5 to-transparent shadow-md ring-2 ring-[#782860]/30 scale-[1.01]"
                          : "border-slate-200 dark:border-slate-800 hover:border-[#782860]/40 bg-slate-50/50 dark:bg-slate-950/20"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${
                          isSelected ? "border-[#782860] bg-[#782860]" : "border-slate-300 dark:border-slate-700"
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <div className="space-y-1 text-left">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              isSelected
                                ? "bg-[#782860] text-white"
                                : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}>
                              <TagIcon className="w-2.5 h-2.5" />
                              {addr.tag}
                            </span>

                            {addr.recipientType && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                                <RecipientIcon className="w-2.5 h-2.5" />
                                {addr.recipientType}
                              </span>
                            )}

                            {addr.locality && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 font-mono">
                                <MapPin className="w-2.5 h-2.5" />
                                {addr.locality} ({addr.pincode || "Varanasi"})
                              </span>
                            )}
                          </div>

                          <p className="text-xs font-extrabold text-foreground pt-0.5 leading-snug">{addr.addressLine}</p>

                          {(addr.recipientName || addr.recipientPhone) && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2">
                              {addr.recipientName && <span>For: {addr.recipientName}</span>}
                              {addr.recipientPhone && <span className="text-slate-400">| {addr.recipientPhone}</span>}
                            </p>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-[10px] rounded-xl flex items-center gap-1 shrink-0 border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3" /> Selected
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Payment & Coupon checkout */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Coupon Code Section */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Discount Coupon</span>
                  <button
                    type="button"
                    onClick={() => setShowCouponsSlider(true)}
                    className="text-[11px] font-extrabold text-[#782860] dark:text-purple-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Tag className="w-3 h-3" /> View Admin Offers (5)
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Enter code (HELPMATE20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-accent-lux"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-5 py-2.5 rounded-xl bg-primary-lux dark:bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[10px] text-red-500 mt-2 pl-2">{couponError}</p>}
                {appliedCoupon && (
                  <div className="mt-3 flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3.5 py-2 rounded-xl text-[11px] font-bold">
                    <span className="flex items-center gap-1.5"><Percent className="w-3.5 h-3.5 text-emerald-500" /> Code {appliedCoupon} Applied!</span>
                    <button type="button" onClick={removeCoupon} className="hover:underline text-[10px] text-rose-500 cursor-pointer">Remove</button>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="text-left">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5 mb-4">
                  <CreditCard className="w-4 h-4 text-[#782860]" /> Select Payment Method
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                  {(["pay_after", "upi", "card", "cod"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-2xl text-xs font-extrabold capitalize text-center transition-all cursor-pointer border flex flex-col items-center justify-center gap-1 ${
                        paymentMethod === method
                          ? "bg-gradient-to-br from-[#782860] via-[#8a2f6e] to-[#a03480] text-white border-transparent shadow-md ring-2 ring-[#782860]/40 scale-105"
                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-[#782860]/40"
                      }`}
                    >
                      <span>
                        {method === "pay_after" && "Pay After Service"}
                        {method === "upi" && "Instant UPI"}
                        {method === "card" && "Credit / Debit Card"}
                        {method === "cod" && "Cash on Delivery"}
                      </span>
                      {method === "pay_after" && (
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full ${
                          paymentMethod === "pay_after" ? "bg-white/20 text-white" : "bg-emerald-500/10 text-emerald-600"
                        }`}>
                          Popular
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Method Details */}
                {paymentMethod === "pay_after" && (
                  <div className="flex flex-col justify-center gap-3 p-5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 rounded-2xl text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950 dark:text-emerald-200">
                          Pay After Service Completion
                        </h4>
                        <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                          Zero Upfront Payment Required Today
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-emerald-900/90 dark:text-emerald-300/80 mt-0.5 leading-relaxed">
                      Inspect the completed work first! Pay comfortably via Cash, UPI, or Card directly to our verified professional after you are 100% satisfied.
                    </p>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Card Number</label>
                      <input
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-accent-lux"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-accent-lux"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">CVV</label>
                        <input
                          type="password"
                          placeholder="***"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-accent-lux"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950/20 border border-slate-200/10 rounded-2xl">
                    <Smartphone className="w-12 h-12 text-accent-lux animate-bounce mb-4" />
                    <p className="text-xs font-bold text-foreground text-center">Scan QR Code or Approve UPI Request</p>
                    <p className="text-[10px] text-slate-400 text-center mt-1">A payment request will be sent to your UPI app on checkout.</p>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="flex items-center gap-3 p-5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 rounded-2xl text-left">
                    <ShieldCheck className="w-5 h-5 shrink-0 text-amber-500" />
                    <div>
                      <p className="text-xs font-bold">Pay Cash or Card After Completion</p>
                      <p className="text-[10px] text-slate-400 mt-1">Pay comfortably to our verified professionals once the services are finished.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Success confirmation screen */}
          {step === 4 && (
            <div className="flex flex-col items-center justify-center text-center py-12 space-y-6">
              <div className="w-16 h-16 rounded-full bg-success-lux/10 border border-success-lux/20 flex items-center justify-center text-success-lux">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-foreground">Luxury Service Confirmed!</h4>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  Your booking ID is <span className="font-bold text-foreground">{createdBookingId}</span>. We've assigned a top background-verified partner who will arrive on schedule.
                </p>
              </div>

              <div className="w-full max-w-md bg-slate-50 dark:bg-slate-950/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-left space-y-4">
                <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  <span>Booking details</span>
                  <span>Invoice Ready</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <p><strong>Scheduled Date:</strong> {selectedDate}</p>
                  <p><strong>Arrival Window:</strong> {selectedTimeSlot}</p>
                  <p><strong>Total Authorized:</strong> ₹{total}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  router.push("/profile?tab=bookings");
                }}
                className="w-full max-w-xs bg-primary-lux hover:bg-slate-800 dark:bg-accent-lux dark:hover:bg-accent-lux/95 text-white font-bold text-xs py-3.5 rounded-full shadow-lg cursor-pointer"
              >
                Track Professional Timeline
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer / Navigation Buttons */}
        {step < 4 && (
          <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-4">
            {/* Price Overview */}
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-slate-400">Due Now</span>
              <span className="text-base font-extrabold text-foreground">₹{total}</span>
            </div>

            <div className="flex gap-3">
              {step > 0 && (
                <button
                  onClick={handlePrevStep}
                  className="px-5 py-3 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              <button
                onClick={handleNextStep}
                className="px-6 py-3 rounded-full bg-primary-lux hover:bg-slate-800 dark:bg-accent-lux dark:hover:bg-accent-lux/95 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                {step === 3 ? "Authorize & Book" : "Continue"} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Available Admin Coupons Drawer */}
        <AvailableCouponsSlider
          isOpen={showCouponsSlider}
          onClose={() => setShowCouponsSlider(false)}
          cartTotal={subtotal}
          appliedCoupon={appliedCoupon}
          onApplyCoupon={(code) => {
            applyCoupon(code);
          }}
          onRemoveCoupon={removeCoupon}
        />
      </motion.div>
    </div>
  );
}

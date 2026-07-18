"use client";

import { useState, useEffect } from "react";
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
  Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, Address, CartItem } from "@/store/useStore";
import confetti from "canvas-confetti";

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
    createBooking
  } = useStore();

  const [step, setStep] = useState(0); // 0: Addons/Cart, 1: Schedule, 2: Address, 3: Payment
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
  };

  const handleNextStep = () => {
    if (step === 1 && (!selectedDate || !selectedTimeSlot)) {
      alert("Please select a date and time slot.");
      return;
    }
    if (step === 2 && !selectedAddressId) {
      alert("Please select or add a delivery address.");
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
        // Blast Confetti
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  // Pricing math
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discount = 0;
  if (appliedCoupon === "LUXURY50") discount = Math.min(500, subtotal * 0.15);
  if (appliedCoupon === "WELCOME100") discount = 100;
  if (appliedCoupon === "SUPERDEAL") discount = Math.min(1000, subtotal * 0.25);
  const total = Math.max(0, subtotal - discount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Background Mask */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Main Dialog Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-background/90 dark:bg-slate-900/90 glass-panel shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-accent-lux" /> Booking Concierge
            </h3>
            {step < 4 && (
              <p className="text-[10px] text-slate-400 mt-0.5">
                Step {step + 1} of 4:{" "}
                {step === 0 && "Review Service Cart"}
                {step === 1 && "Select Scheduling Slot"}
                {step === 2 && "Configure Location Address"}
                {step === 3 && "Complete Secure Checkout"}
              </p>
            )}
          </div>
          {step < 4 && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-foreground" />
            </button>
          )}
        </div>

        {/* Modal Body / Steps Scroll area */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {/* STEP 0: Cart list & Add-ons */}
          {step === 0 && (
            <div className="space-y-6">
              <h4 className="font-bold text-sm text-foreground">Confirm Selected Service</h4>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850"
                  >
                    <div>
                      <span className="text-xs font-bold text-foreground">{item.name}</span>
                      <p className="text-[10px] text-slate-400 mt-1 capitalize">{item.category} • {item.duration} mins</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-foreground">₹{item.price * item.quantity}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions for Add-ons */}
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Premium Add-ons</span>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <button
                    onClick={() =>
                      addToCart({
                        id: "addon-disinfect",
                        name: "Full Shield Bio-Disinfection",
                        price: 399,
                        category: "cleaning",
                        duration: 30
                      })
                    }
                    className="p-3 bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-2xl text-left hover:border-accent-lux transition-all cursor-pointer flex flex-col justify-between h-24"
                  >
                    <span className="text-[11px] font-bold text-foreground">Bio-Disinfection</span>
                    <div className="flex justify-between items-end w-full">
                      <span className="text-xs font-bold text-accent-lux">+₹399</span>
                      <Plus className="w-4 h-4 text-slate-400" />
                    </div>
                  </button>
                  <button
                    onClick={() =>
                      addToCart({
                        id: "addon-warranty",
                        name: "Extended 90-Day Warranty Cover",
                        price: 199,
                        category: "cleaning",
                        duration: 0
                      })
                    }
                    className="p-3 bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-2xl text-left hover:border-accent-lux transition-all cursor-pointer flex flex-col justify-between h-24"
                  >
                    <span className="text-[11px] font-bold text-foreground">90-Day Extension</span>
                    <div className="flex justify-between items-end w-full">
                      <span className="text-xs font-bold text-accent-lux">+₹199</span>
                      <Plus className="w-4 h-4 text-slate-400" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Schedule Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-accent-lux" /> Select Booking Date
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4">
                  {dates.map((d) => {
                    const isSelected = selectedDate === d.iso;
                    return (
                      <button
                        key={d.iso}
                        onClick={() => setSelectedDate(d.iso)}
                        className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? "bg-accent-lux text-white border-accent-lux shadow-lg shadow-accent-lux/20"
                            : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-accent-lux/40 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span className="text-[10px] font-semibold">{d.label}</span>
                        <span className="text-sm font-extrabold mt-1">{d.dayNum}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-accent-lux" /> Select Arrival Time Window
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`p-3 rounded-2xl border text-center cursor-pointer text-xs font-bold transition-all duration-300 ${
                          isSelected
                            ? "bg-accent-lux text-white border-accent-lux shadow-lg shadow-accent-lux/20"
                            : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-accent-lux/40 text-slate-700 dark:text-slate-300"
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

          {/* STEP 2: Address configuration */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-accent-lux" /> Select Service Address
                </h4>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="text-xs text-accent-lux font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Address
                </button>
              </div>

              {/* Add Address Form Accordion */}
              <AnimatePresence>
                {showAddAddress && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4 overflow-hidden"
                  >
                    <div className="flex gap-2">
                      {(["Home", "Work", "Other"] as const).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setNewTag(tag)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                            newTag === tag
                              ? "bg-primary-lux text-white"
                              : "bg-white dark:bg-slate-900 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Street Address, Apt, Suite..."
                        value={newAddressLine}
                        onChange={(e) => setNewAddressLine(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-accent-lux"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowAddAddress(false)}
                        className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-[10px] font-bold text-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddAddressSubmit}
                        className="px-4 py-2 rounded-xl bg-accent-lux hover:bg-accent-lux/95 text-[10px] font-bold text-white"
                      >
                        Save Location
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Existing Address Grid */}
              <div className="space-y-3">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-350 flex items-start gap-3 select-none ${
                        isSelected
                          ? "border-accent-lux bg-accent-lux/5 shadow-md shadow-accent-lux/5"
                          : "border-slate-200 dark:border-slate-800 hover:border-accent-lux/40 bg-white dark:bg-slate-950/20"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                        {isSelected && <div className="w-2.5 h-2.5 bg-accent-lux rounded-full" />}
                      </div>
                      <div>
                        <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {addr.tag}
                        </span>
                        <p className="text-xs font-bold text-foreground mt-2">{addr.addressLine}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{addr.city}</p>
                      </div>
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
              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Discount Coupon</span>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Enter code (LUXURY50)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-accent-lux"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-5 py-2.5 rounded-xl bg-primary-lux dark:bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[10px] text-red-500 mt-2 pl-2">{couponError}</p>}
                {appliedCoupon && (
                  <div className="mt-3 flex items-center justify-between bg-success-lux/10 border border-success-lux/20 text-success-lux px-3.5 py-2 rounded-xl text-[11px] font-bold">
                    <span className="flex items-center gap-1.5"><Percent className="w-3.5 h-3.5" /> Code {appliedCoupon} Applied!</span>
                    <button onClick={removeCoupon} className="hover:underline text-[10px]">Remove</button>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div>
                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5 mb-4">
                  <CreditCard className="w-4 h-4 text-accent-lux" /> Select Payment Method
                </h4>
                <div className="flex border-b border-slate-100 dark:border-slate-800 mb-6">
                  {(["card", "upi", "cod"] as const).map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`flex-1 py-3 text-xs font-bold capitalize border-b-2 text-center transition-all ${
                        paymentMethod === method
                          ? "border-accent-lux text-accent-lux"
                          : "border-transparent text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {method === "card" && "Credit / Debit Card"}
                      {method === "upi" && "Instant UPI"}
                      {method === "cod" && "Cash on Delivery"}
                    </button>
                  ))}
                </div>

                {/* Method Details */}
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
                  <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-2xl">
                    <ShieldCheck className="w-5 h-5" />
                    <div>
                      <p className="text-xs font-bold">Pay Cash or Card After Service</p>
                      <p className="text-[10px] text-amber-500 mt-0.5">We will request an approval of the inspection price prior to starting.</p>
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
      </motion.div>
    </div>
  );
}

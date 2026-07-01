"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  User,
  Calendar,
  Wallet,
  Settings,
  MapPin,
  ShieldCheck,
  Star,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Award,
  RefreshCw,
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Smile,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useStore, Booking } from "@/store/useStore";

function ProfilePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const {
    userName,
    userPhone,
    walletBalance,
    loyaltyPoints,
    bookings,
    addresses,
    addAddress,
    removeAddress,
    cancelBooking,
    rescheduleBooking,
    updateBookingStatus,
    addNotification
  } = useStore();

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "dashboard");
  
  // Reschedule state
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleSlot, setRescheduleSlot] = useState("");

  // Review state
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newTag, setNewTag] = useState<"Home" | "Work" | "Other">("Home");
  const [newAddressLine, setNewAddressLine] = useState("");
  const [newCity, setNewCity] = useState("Varanasi");

  // Sync tab from URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  // Address Submit Handler
  const handleAddAddress = () => {
    if (!newAddressLine.trim()) return;
    addAddress({
      tag: newTag,
      addressLine: newAddressLine.trim(),
      city: newCity
    });
    setNewAddressLine("");
    setShowAddressForm(false);
    addNotification("Address Saved", "Your service location was successfully added.", "success");
  };

  // Status Simulation Action
  const advanceSimulatedBooking = (bookingId: string, currentStatus: Booking["status"]) => {
    if (currentStatus === "Assigned") {
      updateBookingStatus(bookingId, "In-Transit");
      addNotification("Professional In-Transit", `Your technician has started traveling. ETA 15 mins.`, "info");
    } else if (currentStatus === "In-Transit") {
      updateBookingStatus(bookingId, "Arrived");
      addNotification("Professional Arrived", `Your HelpMate specialist has arrived at your doorstep.`, "success");
    } else if (currentStatus === "Arrived") {
      updateBookingStatus(bookingId, "In-Progress");
      addNotification("Service Started", `Work has commenced for your booking ${bookingId}.`, "info");
    } else if (currentStatus === "In-Progress") {
      updateBookingStatus(bookingId, "Completed");
      addNotification("Service Completed!", `Your booking has been successfully finalized. Rate your professional!`, "success");
    }
  };

  const handleCancelBooking = (id: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      cancelBooking(id);
    }
  };

  const handleRescheduleSubmit = (id: string) => {
    if (!rescheduleDate || !rescheduleSlot) return;
    rescheduleBooking(id, rescheduleDate, rescheduleSlot);
    setReschedulingId(null);
    setRescheduleDate("");
    setRescheduleSlot("");
  };

  const handleReviewSubmit = () => {
    addNotification(
      "Review Submitted",
      `Thank you for rating ${reviewingBooking?.professional?.name}. You earned 50 loyalty points!`,
      "success"
    );
    setReviewingBooking(null);
    setReviewComment("");
    setReviewRating(5);
  };

  return (
    <>
      <Header />

      <main className="flex-1 pt-24 font-sans bg-slate-50/50 dark:bg-background pb-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Profile Navigation Sidebar */}
          <nav className="lg:col-span-3 glass-panel p-6 border border-slate-200/10 space-y-2 shrink-0">
            <div className="pb-6 border-b border-slate-100 dark:border-slate-800 text-center lg:text-left flex lg:flex-col items-center lg:items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-accent-lux/10 border-2 border-accent-lux text-accent-lux flex items-center justify-center font-bold text-xl">
                AT
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">{userName}</h3>
                <p className="text-[10px] text-slate-400 mt-1">{userPhone}</p>
                <span className="inline-block mt-2 bg-gradient-to-r from-accent-lux to-secondary-lux text-white text-[8px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Elite Member
                </span>
              </div>
            </div>

            <div className="pt-4 space-y-1">
              {[
                { id: "dashboard", label: "Dashboard Overview", icon: <Award className="w-4 h-4" /> },
                { id: "bookings", label: "Booking History", icon: <Calendar className="w-4 h-4" /> },
                { id: "addresses", label: "Manage Locations", icon: <MapPin className="w-4 h-4" /> },
                { id: "wallet", label: "Wallet & Loyalty", icon: <Wallet className="w-4 h-4" /> },
                { id: "settings", label: "Account Settings", icon: <Settings className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    router.push(`/profile?tab=${tab.id}`);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-accent-lux text-white shadow-lg shadow-accent-lux/10"
                      : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Main Panel Content */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* TAB: DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Wallet Card */}
                  <div className="glass-panel p-6 border border-slate-200/10 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-muted-lux tracking-wider">Wallet Balance</span>
                      <h4 className="text-2xl font-black text-foreground mt-2">${walletBalance}</h4>
                    </div>
                    <span className="text-[10px] text-accent-lux font-bold mt-4 flex items-center gap-1">
                      Refer friend, earn $250 <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>

                  {/* Loyalty Card */}
                  <div className="glass-panel p-6 border border-slate-200/10 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-muted-lux tracking-wider">Loyalty Points</span>
                      <h4 className="text-2xl font-black text-foreground mt-2">{loyaltyPoints} pts</h4>
                    </div>
                    <span className="text-[10px] text-success-lux font-bold mt-4">
                      Elite tier bonus active
                    </span>
                  </div>

                  {/* Booking count card */}
                  <div className="glass-panel p-6 border border-slate-200/10 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-muted-lux tracking-wider">Total Bookings</span>
                      <h4 className="text-2xl font-black text-foreground mt-2">{bookings.length} Services</h4>
                    </div>
                    <span className="text-[10px] text-muted-lux mt-4 block font-semibold">
                      Last booked 30 mins ago
                    </span>
                  </div>
                </div>

                {/* Active Tracking Module */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <TrendingUp className="w-4.5 h-4.5 text-accent-lux" /> Real-time Booking Tracker
                  </h3>

                  {bookings.filter((b) => b.status !== "Completed" && b.status !== "Cancelled").length === 0 ? (
                    <div className="glass-panel p-8 text-center border border-slate-250/20 text-slate-400 text-xs">
                      No active bookings in progress. Explore categories to start scheduling.
                    </div>
                  ) : (
                    bookings
                      .filter((b) => b.status !== "Completed" && b.status !== "Cancelled")
                      .map((b) => (
                        <div key={b.id} className="glass-panel p-6 border border-slate-200/10 space-y-6">
                          {/* Top Row */}
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                              <span className="text-[9px] uppercase font-bold text-muted-lux">Active Tracker</span>
                              <h4 className="text-sm font-bold text-foreground mt-0.5">Booking #{b.id}</h4>
                              <p className="text-[10px] text-slate-400 capitalize mt-0.5">{b.items[0]?.name}</p>
                            </div>
                            
                            {/* Simulator Trigger */}
                            <button
                              onClick={() => advanceSimulatedBooking(b.id, b.status)}
                              className="px-4 py-2 bg-gradient-to-r from-accent-lux to-secondary-lux hover:from-accent-lux hover:to-accent-lux text-white text-[10px] font-bold tracking-wider uppercase rounded-xl flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Simulate Partner Progress
                            </button>
                          </div>

                          {/* Professional summary */}
                          {b.professional && (
                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-150/40 dark:border-slate-800">
                              <img src={b.professional.avatar} alt={b.professional.name} className="w-12 h-12 rounded-full object-cover" />
                              <div>
                                <span className="text-xs font-bold text-foreground block">{b.professional.name}</span>
                                <span className="text-[10px] text-muted-lux block mt-0.5">HelpMate Certified Specialist</span>
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                  <span className="text-[10px] font-bold text-foreground">{b.professional.rating}</span>
                                  <span className="text-[10px] text-slate-400">({b.professional.completedJobs} jobs)</span>
                                </div>
                              </div>
                              <span className="ml-auto text-xs font-bold bg-success-lux/10 text-success-lux px-3 py-1 rounded-full">
                                OTP: {b.otp}
                              </span>
                            </div>
                          )}

                          {/* Progress Stepper Timeline */}
                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-2">
                            {b.timeline.map((step, sIdx) => (
                              <div key={step.status} className="flex sm:flex-col items-start sm:items-center text-left sm:text-center relative">
                                {/* Connector line */}
                                {sIdx < b.timeline.length - 1 && (
                                  <div className="hidden sm:block absolute top-3.5 left-[60%] right-[-40%] h-0.5 bg-slate-200 dark:bg-slate-800 z-0" />
                                )}
                                
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                                  step.done
                                    ? "bg-accent-lux text-white shadow-lg shadow-accent-lux/20"
                                    : "bg-slate-100 dark:bg-slate-900 border border-slate-200 text-slate-400"
                                }`}>
                                  <CheckCircle className="w-4 h-4" />
                                </div>

                                <div className="ml-3 sm:ml-0 mt-0.5 sm:mt-3">
                                  <p className="text-[11px] font-bold text-foreground leading-tight">{step.status}</p>
                                  <p className="text-[9px] text-slate-400 mt-1">{step.time}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: BOOKINGS HISTORY */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <h3 className="font-bold text-sm text-foreground">Service Booking History</h3>
                
                {bookings.length === 0 ? (
                  <div className="glass-panel p-12 text-center border border-slate-200/10 text-slate-500 text-xs">
                    No booking records in account. Schedule your first deep clean today.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((b) => (
                      <div key={b.id} className="glass-panel p-6 border border-slate-200/10 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{b.dateCreated}</span>
                            <h4 className="text-xs sm:text-sm font-bold text-foreground mt-0.5 flex items-center gap-2">
                              Booking #{b.id}
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                                b.status === "Completed" && "bg-success-lux/10 text-success-lux"
                              } ${
                                b.status === "Cancelled" && "bg-red-500/10 text-red-500"
                              } ${
                                b.status !== "Completed" && b.status !== "Cancelled" && "bg-accent-lux/10 text-accent-lux"
                              }`}>
                                {b.status}
                              </span>
                            </h4>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs sm:text-sm font-extrabold text-foreground">${b.finalAmount}</span>
                          </div>
                        </div>

                        {/* Invoice & Actions Row */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                          <div className="text-[10px] text-slate-400">
                            <strong>Service Variant:</strong> {b.items[0]?.name}
                          </div>

                          <div className="flex gap-2">
                            {/* Reschedule option */}
                            {b.status !== "Completed" && b.status !== "Cancelled" && (
                              <>
                                <button
                                  onClick={() => setReschedulingId(b.id)}
                                  className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 text-[10px] font-bold rounded-xl cursor-pointer"
                                >
                                  Reschedule
                                </button>
                                <button
                                  onClick={() => handleCancelBooking(b.id)}
                                  className="px-3.5 py-2 border border-red-200 text-red-500 hover:bg-red-500/10 text-[10px] font-bold rounded-xl cursor-pointer"
                                >
                                  Cancel Booking
                                </button>
                              </>
                            )}

                            {/* Completed rating option */}
                            {b.status === "Completed" && (
                              <button
                                onClick={() => setReviewingBooking(b)}
                                className="px-3.5 py-2 bg-accent-lux hover:bg-accent-lux/95 text-white text-[10px] font-bold rounded-xl cursor-pointer flex items-center gap-1"
                              >
                                <Smile className="w-3.5 h-3.5" /> Leave Review
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Rescheduling Form Panel */}
                        {reschedulingId === b.id && (
                          <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 mt-4">
                            <h4 className="text-xs font-bold text-foreground">Select New Slot</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="date"
                                value={rescheduleDate}
                                onChange={(e) => setRescheduleDate(e.target.value)}
                                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl text-xs"
                              />
                              <select
                                value={rescheduleSlot}
                                onChange={(e) => setRescheduleSlot(e.target.value)}
                                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl text-xs text-foreground"
                              >
                                <option value="">Select Time Window</option>
                                <option value="08:00 AM">08:00 AM</option>
                                <option value="10:00 AM">10:00 AM</option>
                                <option value="12:00 PM">12:00 PM</option>
                                <option value="02:00 PM">02:00 PM</option>
                                <option value="04:00 PM">04:00 PM</option>
                              </select>
                            </div>
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setReschedulingId(null)}
                                className="px-4 py-2 rounded-xl bg-slate-200 text-[10px] font-bold text-slate-700"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleRescheduleSubmit(b.id)}
                                className="px-4 py-2 rounded-xl bg-accent-lux text-white text-[10px] font-bold"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: MANAGE LOCATIONS */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <MapPin className="w-4.5 h-4.5 text-accent-lux" /> Vetted Service Locations
                  </h3>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="text-xs text-accent-lux font-bold hover:underline flex items-center gap-1"
                  >
                    Add Address
                  </button>
                </div>

                {showAddressForm && (
                  <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[20px] space-y-4 shadow-sm">
                    <div className="flex gap-2">
                      {(["Home", "Work", "Other"] as const).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setNewTag(tag)}
                          className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            newTag === tag
                              ? "bg-primary-lux text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500"
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
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowAddressForm(false)}
                        className="px-4 py-2 rounded-xl bg-slate-200 text-[10px] font-bold text-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddAddress}
                        className="px-4 py-2 rounded-xl bg-accent-lux text-white text-[10px] font-bold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 bg-white dark:bg-slate-900/40 border border-slate-150/50 dark:border-slate-850 rounded-[20px] flex items-center justify-between gap-4"
                    >
                      <div>
                        <span className="bg-slate-100 dark:bg-slate-800 text-muted-lux text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                          {addr.tag}
                        </span>
                        <p className="text-xs font-bold text-foreground mt-2">{addr.addressLine}</p>
                        <p className="text-[10px] text-muted-lux mt-0.5">{addr.city}</p>
                      </div>
                      <button
                        onClick={() => removeAddress(addr.id)}
                        className="text-red-400 hover:text-red-500 text-xs font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: WALLET & LOYALTY */}
            {activeTab === "wallet" && (
              <div className="space-y-6">
                <div className="glass-panel p-8 bg-gradient-to-tr from-primary-lux to-slate-900 text-white rounded-[24px] overflow-hidden relative shadow-xl">
                  <div className="absolute top-0 right-0 w-44 h-44 bg-accent-lux/10 rounded-full blur-3xl" />
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">HelpMate Luxury Purse</span>
                  <h4 className="text-3xl font-black tracking-tight mt-2">${walletBalance}</h4>
                  <p className="text-xs text-slate-400 mt-2">Authorised for automatic payments & inspection overrides.</p>
                </div>

                {/* Referral Module */}
                <div className="bg-white dark:bg-slate-900/40 border border-slate-150/40 dark:border-slate-800 p-6 rounded-[24px] space-y-4">
                  <h4 className="text-xs uppercase font-extrabold text-muted-lux tracking-wider flex items-center gap-1.5">
                    <Smile className="w-4 h-4 text-accent-lux" /> Invite Friends, Earn Cash
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Share your unique invitation link. When they confirm their first premium cleaning or jet wash service, we will add ₹250 to your wallet balance instantly.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value="https://helpmate.lux/refer/alex50"
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-xs text-slate-500 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("https://helpmate.lux/refer/alex50");
                        addNotification("Referral Link Copied", "Share it with friends to earn credits.", "info");
                      }}
                      className="px-5 py-2.5 rounded-xl bg-accent-lux hover:bg-accent-lux/95 text-xs font-bold text-white cursor-pointer"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === "settings" && (
              <div className="glass-panel p-6 border border-slate-200/10 space-y-6">
                <h3 className="font-bold text-sm text-foreground">Account Settings</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted-lux">Full Name</label>
                      <input
                        type="text"
                        defaultValue={userName}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-xs text-foreground focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted-lux">Mobile Line</label>
                      <input
                        type="text"
                        defaultValue={userPhone}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-xs text-foreground focus:outline-none"
                      />
                    </div>
                  </div>
                  <button className="bg-primary-lux hover:bg-slate-800 dark:bg-accent-lux text-white font-bold text-[10px] uppercase tracking-wider px-6 py-3 rounded-full shadow-md cursor-pointer">
                    Save profile modifications
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Review Modal popup */}
      <AnimatePresence>
        {reviewingBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReviewingBooking(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md glass-panel p-6 shadow-2xl flex flex-col space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-850">
                <h4 className="font-bold text-sm text-foreground">Review service partner</h4>
                <button
                  onClick={() => setReviewingBooking(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-foreground" />
                </button>
              </div>

              {/* Partner Overview */}
              <div className="flex items-center gap-3">
                <img src={reviewingBooking.professional?.avatar} alt={reviewingBooking.professional?.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <span className="font-bold text-xs text-foreground block">{reviewingBooking.professional?.name}</span>
                  <span className="text-[10px] text-muted-lux uppercase block tracking-wider font-semibold">Service Specialist</span>
                </div>
              </div>

              {/* Star selector */}
              <div className="flex items-center justify-center gap-2 py-4 border-y border-slate-50 dark:border-slate-900">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="cursor-pointer hover:scale-110 transition-transform"
                  >
                    <Star className={`w-8 h-8 ${star <= reviewRating ? "fill-amber-500 text-amber-500" : "text-slate-350 dark:text-slate-700"}`} />
                  </button>
                ))}
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-lux">Review Comment</label>
                <textarea
                  placeholder="Share details of your luxury service experience..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-xs text-foreground focus:outline-none"
                />
              </div>

              <button
                onClick={handleReviewSubmit}
                className="w-full bg-accent-lux hover:bg-accent-lux/95 text-white font-bold text-xs py-3 rounded-full cursor-pointer"
              >
                Submit Feedback
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 text-xs">Loading profile dashboard...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}

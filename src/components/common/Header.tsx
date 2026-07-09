"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  MapPin,
  Search,
  Bell,
  User,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  Wallet,
  Calendar,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  X,
  ShoppingCart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { citiesServed, services } from "@/utils/mockData";

function HeaderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const {
    theme,
    toggleTheme,
    userName,
    walletBalance,
    isLoggedIn,
    logout,
    notifications,
    clearNotifications,
    setChatOpen,
    setGuestMode,
    cart,
    removeFromCart
  } = useStore();

  const [scrolled, setScrolled] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Varanasi");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [suggestions, setSuggestions] = useState<typeof services>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = services.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 4));
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setShowLocationModal(false);
    // Notify or filter locally
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 font-sans ${scrolled
          ? "bg-background/80 dark:bg-background/80 backdrop-blur-xl border-b border-border-lux py-3 shadow-sm"
          : "bg-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">

        {/* LOGO */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="HelpMate Logo" className="h-11 w-auto object-contain" />
          </Link>

          {/* Location Picker */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200/10 transition-all duration-300 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-accent-lux" />
            <span>{selectedCity}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-md hidden sm:block relative"
        >
          <input
            type="text"
            placeholder="Search luxury cleaning, AC repair..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200/10 focus:border-accent-lux/30 focus:bg-white dark:focus:bg-slate-900 rounded-full py-2.5 pl-10 pr-4 text-xs focus:outline-none transition-all duration-300 text-foreground"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />

          {/* Auto Suggestions Dropdown */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute left-0 right-0 mt-2 p-2.5 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl z-50 shadow-2xl text-left"
              >
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider px-2.5 mb-1.5">Suggestions</p>
                <div className="space-y-0.5">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSuggestions([]);
                        setSearchQuery("");
                        router.push(`/services/${item.id}`);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <p className="text-[11px] font-bold text-foreground line-clamp-1">{item.name}</p>
                          <p className="text-[9px] text-slate-400 capitalize">{item.category} • {item.duration} mins</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-accent-lux shrink-0">₹{item.price}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Right Nav Options */}
        <div className="flex items-center gap-4">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors text-slate-600 dark:text-slate-300 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Shopping Cart Indicator */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCartDropdown(!showCartDropdown);
                setShowNotifications(false);
                setShowProfileMenu(false);
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors text-slate-600 dark:text-slate-300 relative cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-lux text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white dark:border-slate-900 shadow-md">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Cart Dropdown Menu */}
            <AnimatePresence>
              {showCartDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl z-50 p-3 text-left"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <span className="font-bold text-xs text-foreground">Selected Services</span>
                    {cart.length > 0 && (
                      <span className="text-[10px] text-slate-400 font-bold">{cart.length} items</span>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2 mt-2 no-scrollbar">
                    {cart.length === 0 ? (
                      <div className="py-8 text-center flex flex-col items-center justify-center text-slate-400 space-y-2">
                        <ShoppingCart className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Your cart is empty</span>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                        >
                          <div className="flex-1 min-w-0 pr-3">
                            <h4 className="text-[11px] font-bold text-foreground truncate leading-tight">{item.name}</h4>
                            <p className="text-[9px] text-slate-400 mt-1 capitalize">{item.category} • {item.duration} mins</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-accent-lux">₹{item.price}</span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-slate-400 hover:text-red-500 cursor-pointer p-0.5"
                              title="Remove item"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Total Price</span>
                        <span className="font-black text-foreground">
                          ₹{cart.reduce((sum, item) => sum + item.price, 0)}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => {
                          setShowCartDropdown(false);
                          router.push("/booking");
                        }}
                        className="w-full bg-accent-lux hover:bg-accent-lux/90 text-white font-bold text-[11px] py-2.5 rounded-full shadow-md text-center block cursor-pointer transition-colors"
                      >
                        Proceed to Booking Slot
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          {!isHomePage && isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors text-slate-600 dark:text-slate-300 relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-lux rounded-full animate-pulse" />
                )}
              </button>

              {/* Notifications Menu */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl z-50 p-2"
                  >
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-xs text-foreground">Notifications</span>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-[10px] text-accent-lux hover:underline"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto p-1 mt-1 space-y-1 no-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-[11px] text-slate-400">
                          No new updates
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-2.5 items-start"
                          >
                            <CheckCircle2 className="w-4 h-4 text-success-lux mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-foreground">{notif.title}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* User Profile or Sign In / Signup Button */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-accent-lux/10 border border-accent-lux/20 text-accent-lux flex items-center justify-center font-bold text-xs">
                  {userName ? userName.slice(0, 2).toUpperCase() : "AT"}
                </div>
                <ChevronDown className="w-3 h-3 opacity-60 text-foreground" />
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl z-50 p-2"
                  >
                    <div className="px-3 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-foreground">{userName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Elite Member</p>
                      <div className="mt-2.5 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <Wallet className="w-3 h-3 text-accent-lux" /> Wallet
                        </span>
                        <span className="text-xs font-bold text-foreground">₹{walletBalance}</span>
                      </div>
                    </div>
                    <div className="p-1 space-y-0.5">
                      <Link
                        href="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <User className="w-3.5 h-3.5" /> Dashboard & Address
                      </Link>
                      <Link
                        href="/profile?tab=bookings"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5" /> My Bookings
                      </Link>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setChatOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer text-left"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Live Support Chat
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Log Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => {
                setGuestMode(false);
                router.push("/");
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-accent-lux hover:bg-accent-lux/95 text-white font-bold text-xs shadow-md shadow-accent-lux/25 transition-all cursor-pointer"
            >
              Sign Up / Login
            </button>
          )}
        </div>
      </div>

      {/* Location Selector Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLocationModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl glass-panel p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent-lux" /> Select Varanasi Area
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Select an active Varanasi zone to explore nearby service partners.</p>
                </div>
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                {citiesServed.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => handleCitySelect(city.name)}
                    className="flex flex-col items-start p-4 rounded-[20px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-accent-lux dark:hover:border-accent-lux/60 text-left transition-all duration-300 group cursor-pointer"
                  >
                    <span className="text-sm font-bold text-foreground group-hover:text-accent-lux transition-colors">
                      {city.name}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-success-lux" /> {city.activePros} Luxury Pros Nearby
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<div className="fixed top-0 left-0 w-full h-16 bg-transparent z-40" />}>
      <HeaderContent />
    </Suspense>
  );
}

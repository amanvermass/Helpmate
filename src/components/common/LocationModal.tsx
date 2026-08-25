"use client";

import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  Navigation, 
  Search, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  X, 
  Loader2, 
  Compass,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { citiesServed } from "@/utils/mockData";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoPrompt?: boolean;
}

export default function LocationModal({ isOpen, onClose, autoPrompt = false }: LocationModalProps) {
  const { 
    selectedLocation, 
    setSelectedLocation, 
    locationPermissionDenied, 
    setLocationPermissionDenied,
    addNotification,
    setIsLocationSet
  } = useStore();

  const [mode, setMode] = useState<"prompt" | "detecting" | "manual" | "success">("prompt");
  const [manualInput, setManualInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCloseModal = () => {
    setIsLocationSet(true);
    onClose();
  };

  // If permission was previously denied, default directly to manual input mode when opened
  useEffect(() => {
    if (isOpen) {
      if (locationPermissionDenied) {
        setMode("manual");
      } else {
        setMode("prompt");
      }
      setErrorMessage(null);
    }
  }, [isOpen, locationPermissionDenied]);

  // Request browser Geolocation API
  const handleAllowLocation = () => {
    setMode("detecting");
    setErrorMessage(null);

    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser. Please enter your location manually.");
      setLocationPermissionDenied(true);
      setMode("manual");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Mock reverse-geocoding to nearest Varanasi zone based on coordinates or fallback
        const detectedArea = "Sigra, Varanasi"; // Mock detected address
        
        setSelectedLocation(detectedArea);
        setLocationPermissionDenied(false);
        setIsLocationSet(true);
        setMode("success");

        addNotification(
          "Location Access Granted",
          `Detected location: ${detectedArea}. Showing nearby service partners.`,
          "success"
        );

        setTimeout(() => {
          onClose();
        }, 1200);
      },
      (error) => {
        console.warn("Geolocation permission error:", error);
        setLocationPermissionDenied(true);
        setErrorMessage("Location permission denied or unavailable. Please enter your location manually.");
        setMode("manual");
        
        addNotification(
          "Location Permission Denied",
          "You denied location access. Please enter your location manually.",
          "warning"
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    const formattedLoc = manualInput.trim();
    setSelectedLocation(formattedLoc);
    setIsLocationSet(true);
    addNotification("Location Set", `Service location set to "${formattedLoc}".`, "info");
    onClose();
  };

  const handleSelectQuickCity = (cityName: string) => {
    setSelectedLocation(cityName);
    setIsLocationSet(true);
    addNotification("Location Updated", `Selected zone: ${cityName}`, "success");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Main Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-6 sm:p-8 shadow-2xl z-10 overflow-hidden text-left"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* MODE 1: PROMPT VIEW (FIRST OPEN / ALLOW LOCATION) */}
          {mode === "prompt" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-accent-lux/10 text-accent-lux flex items-center justify-center border border-accent-lux/20 shrink-0">
                  <Navigation className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-accent-lux">
                    Location Permission
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Allow Location Access
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Allowing location access helps us find background-verified specialists &amp; real-time arrival estimates near your home.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleAllowLocation}
                  className="w-full py-3.5 px-6 rounded-2xl bg-accent-lux hover:bg-accent-lux/90 text-primary-lux font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  Allow Location Access
                </button>

                <button
                  onClick={() => setMode("manual")}
                  className="w-full py-3 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  Enter Location Manually Instead
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Your privacy is protected. Location is strictly used for service delivery.</span>
              </div>
            </div>
          )}

          {/* MODE 2: DETECTING / LOADING */}
          {mode === "detecting" && (
            <div className="py-8 flex flex-col items-center text-center space-y-4">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-accent-lux/20 animate-ping" />
                <Loader2 className="w-8 h-8 text-accent-lux animate-spin" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Detecting Your Location...</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Please respond to the browser prompt to allow location permissions.
                </p>
              </div>
            </div>
          )}

          {/* MODE 3: SUCCESS DETECTED */}
          {mode === "success" && (
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                <Check className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Location Detected Successfully!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Set to <strong className="text-slate-900 dark:text-white">{selectedLocation}</strong>
                </p>
              </div>
            </div>
          )}

          {/* MODE 4: MANUAL INPUT VIEW (WHEN DENIED OR SELECTED MANUAL) */}
          {mode === "manual" && (
            <div className="space-y-6">
              <div>
                {locationPermissionDenied && (
                  <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Location access was denied or unavailable. Please enter your location manually below.</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-accent-lux text-[10px] font-bold uppercase tracking-widest">
                  <MapPin className="w-3.5 h-3.5" /> Manual Location Entry
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  Enter Your Service Location
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Type your area name, city, street address or choose from Varanasi active zones.
                </p>
              </div>

              {/* Manual Search Form */}
              <form onSubmit={handleManualSubmit} className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Enter city, area or street address (e.g. Assi Ghat, Sigra)..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-accent-lux font-medium"
                    autoFocus
                  />
                  {manualInput && (
                    <button
                      type="button"
                      onClick={() => setManualInput("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!manualInput.trim()}
                  className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    manualInput.trim()
                      ? "bg-accent-lux text-primary-lux shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Save &amp; Continue <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Quick Select Varanasi Zones */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Popular Varanasi Service Zones
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {citiesServed.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleSelectQuickCity(city.name)}
                      className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                        selectedLocation === city.name
                          ? "bg-accent-lux/10 border-accent-lux text-accent-lux"
                          : "bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-800 hover:border-accent-lux/50 text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      <span className="text-xs font-bold truncate">{city.name}</span>
                      <Check className={`w-3.5 h-3.5 shrink-0 ${selectedLocation === city.name ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Option to retry auto-detection */}
              <div className="text-center pt-1">
                <button
                  onClick={() => setMode("prompt")}
                  className="text-xs text-accent-lux hover:underline font-semibold flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" /> Retry Auto-Detecting Geolocation
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

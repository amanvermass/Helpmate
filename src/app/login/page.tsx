"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || phone.length < 10) {
      setLoginError("Please enter a valid 10-digit mobile number");
      return;
    }
    setLoginError("");
    login(phone);
    
    // Check if there is a pending redirect, otherwise go home
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-6 font-sans relative overflow-hidden">
      {/* Decorative ambient glowing circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-lux/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-lux/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-10 rounded-3xl text-center shadow-xl shadow-slate-200/40 relative z-10"
      >
        {/* Logo (Centered and Big) */}
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="HelpMate Logo" className="h-16 w-auto object-contain" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 dark:text-white mb-2">
          {isSignUp ? "Create Your Elite Account" : "Welcome to HelpMate Elite"}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mb-8 max-w-xs mx-auto leading-relaxed">
          {isSignUp 
            ? "Sign up to access Varanasi's premium background-verified service professionals." 
            : "Sign in with your mobile number to manage bookings and wallet credits."}
        </p>

        <form onSubmit={handleLoginSubmit} className="space-y-5 text-left">
          {isSignUp && (
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 px-4 text-xs focus:outline-none focus:border-accent-lux text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 transition-all"
                required
              />
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-450">+91</span>
              <input
                type="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs focus:outline-none focus:border-accent-lux text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 transition-all font-bold tracking-wider"
                required
              />
            </div>
            {loginError && (
              <p className="text-[10px] text-red-650 mt-2 pl-2 font-semibold">{loginError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-accent-lux hover:bg-accent-lux/95 text-white font-bold text-xs py-4 rounded-2xl shadow-lg transition-all cursor-pointer mt-4 flex items-center justify-center gap-1.5"
          >
            {isSignUp ? "Create Account & Sign In" : "Continue"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setLoginError("");
              setPhone("");
              setName("");
            }}
            className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            {isSignUp ? "Already have an account? Sign In" : "New to HelpMate? Create an Account"}
          </button>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 leading-normal">
            By continuing, you agree to our Terms of Service & Privacy Policy.
          </span>
        </div>
      </motion.div>
    </div>
  );
}

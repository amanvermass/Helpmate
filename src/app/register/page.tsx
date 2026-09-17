"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { registerCustomerApi } from "@/services/authApi";
import { Loader2, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck, User, Phone, Lock, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useStore();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#801C6E", "#48073d", "#A21CAF", "#E879F9"]
    });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanedName = fullName.trim();
    if (!cleanedName || cleanedName.length < 2) {
      setErrorMsg("Please enter your full name (at least 2 characters)");
      return;
    }

    const cleanedMobile = mobile.trim().replace(/\D/g, "");
    if (!cleanedMobile || cleanedMobile.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!password) {
      setErrorMsg("Please enter a password");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please check again.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerCustomerApi({
        fullName: cleanedName,
        mobile: cleanedMobile,
        password: password,
      });

      if (res.success && res.data) {
        triggerConfetti();
        setSuccessMsg("Registration successful! Logging you in...");
        setAuth({
          token: res.data.token,
          customer: res.data.customer,
        });

        setTimeout(() => {
          router.push("/");
        }, 1200);
      } else {
        setErrorMsg(res.message || "Registration failed. Mobile number may already be registered.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-900 px-4 sm:px-6 font-sans relative overflow-hidden py-12">
      {/* Soft background ambient gradient circles */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-purple-100/60 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200/40 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white border border-slate-200 p-8 sm:p-10 rounded-3xl text-left shadow-xl shadow-slate-200/50 relative z-10 space-y-6"
      >
        {/* Header / Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <img
              src="/logo.png"
              alt="HelpMate Logo"
              className="h-12 sm:h-14 w-auto object-contain mx-auto mb-1 cursor-pointer hover:opacity-90 transition-opacity"
            />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Create Account
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Register to book Varanasi's top-rated background verified luxury service specialists.
          </p>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Vivek Singh"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-medium focus:outline-none focus:border-accent-lux focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-500 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> +91
              </span>
              <input
                type="tel"
                placeholder="8840845695"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-16 pr-4 text-xs font-bold tracking-wider focus:outline-none focus:border-accent-lux focus:bg-white text-slate-900 transition-all placeholder:text-slate-400 font-sans"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-11 text-xs font-medium focus:outline-none focus:border-accent-lux focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-11 text-xs font-medium focus:outline-none focus:border-accent-lux focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && (
              <p
                className={`text-[10px] font-bold mt-1.5 pl-2 ${
                  password === confirmPassword ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent-lux hover:bg-accent-lux/95 text-white font-extrabold text-xs py-4 rounded-2xl shadow-lg shadow-accent-lux/20 transition-all cursor-pointer mt-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registering Customer Account...</span>
              </>
            ) : (
              <>
                <span>Register Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle to Login */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2">
          <p className="text-xs text-slate-500">
            Already registered?{" "}
            <Link href="/login" className="text-accent-lux hover:underline font-bold">
              Sign In to Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

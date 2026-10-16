"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { loginCustomerApi } from "@/services/authApi";
import { toast } from "@/components/common/Toast";
import { Loader2, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle, Phone, Lock, ArrowRight, UserPlus } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryRedirect = searchParams.get("redirect");
  const queryMobile = searchParams.get("mobile");
  const [redirectPath, setRedirectPath] = useState<string>("/");
  const { setAuth } = useStore();

  const [phone, setPhone] = useState(queryMobile ? queryMobile.replace(/\D/g, "").slice(0, 10) : "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (queryMobile) {
      setPhone(queryMobile.replace(/\D/g, "").slice(0, 10));
    }
  }, [queryMobile]);

  useEffect(() => {
    // 1. Direct query parameter in URL (highest priority)
    if (queryRedirect && queryRedirect !== "/login" && queryRedirect !== "/register") {
      setRedirectPath(queryRedirect);
      try {
        sessionStorage.setItem("helpmate_redirect", queryRedirect);
      } catch {}
      return;
    }

    // 2. Check sessionStorage fallback
    try {
      const stored = sessionStorage.getItem("helpmate_redirect");
      if (stored && stored !== "/login" && stored !== "/register") {
        setRedirectPath(stored);
        return;
      }
    } catch {}

    // 3. Check document.referrer (browser previous page)
    if (typeof window !== "undefined" && document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        if (refUrl.host === window.location.host) {
          const pathWithSearch = refUrl.pathname + refUrl.search;
          if (refUrl.pathname !== "/login" && refUrl.pathname !== "/register") {
            setRedirectPath(pathWithSearch);
            try {
              sessionStorage.setItem("helpmate_redirect", pathWithSearch);
            } catch {}
          }
        }
      } catch {}
    }
  }, [queryRedirect]);

  const [loginError, setLoginError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setSuccessMsg("");

    const cleanedPhone = phone.trim().replace(/\D/g, "");
    if (!cleanedPhone || cleanedPhone.length !== 10) {
      const err = "Please enter a valid 10-digit mobile number";
      setLoginError(err);
      toast.error("Invalid Mobile Number", err);
      return;
    }

    if (!password) {
      const err = "Please enter your password";
      setLoginError(err);
      toast.error("Password Required", err);
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginCustomerApi({
        mobile: cleanedPhone,
        password: password,
      });

      if (res.success && res.data) {
        setSuccessMsg("Login successful! Welcome back.");
        toast.success("Welcome Back!", "Signed in successfully.");
        await setAuth({
          token: res.data.token,
          customer: res.data.customer,
        });

        try {
          sessionStorage.removeItem("helpmate_redirect");
        } catch {}

        setTimeout(() => {
          router.push(redirectPath || "/");
        }, 600);
      } else {
        const err = res.message || "Invalid mobile number or password.";
        setLoginError(err);
        toast.error("Sign In Failed", err);
      }
    } catch (err: any) {
      const message = err?.message || "An unexpected error occurred. Please check network connection.";
      setLoginError(message);
      toast.error("Connection Error", message);
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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white border border-slate-200 p-8 sm:p-10 rounded-3xl text-left shadow-xl shadow-slate-200/50 relative z-10 space-y-6"
      >
        {/* Header / Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <img
              src="/logo-white.png"
              alt="HelpMate Logo"
              className="h-12 sm:h-14 w-auto object-contain mx-auto mb-1 cursor-pointer hover:opacity-90 transition-opacity"
            />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sign In to HelpMate
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Sign in with your mobile number and password to manage bookings and wallet.
          </p>
        </div>

        {/* Error / Success Alerts */}
        {loginError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{loginError}</span>
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

        {/* Sign In Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Mobile Field */}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-16 pr-4 text-xs font-bold tracking-wider focus:outline-none focus:border-accent-lux focus:bg-white text-slate-900 transition-all placeholder:text-slate-400 font-sans"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                Password
              </label>
              <Link
                href={redirectPath && redirectPath !== "/" ? `/forgot-password?redirect=${encodeURIComponent(redirectPath)}` : "/forgot-password"}
                className="text-[11px] font-bold text-accent-lux hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent-lux hover:bg-accent-lux/95 text-white font-extrabold text-xs py-4 rounded-2xl shadow-lg shadow-accent-lux/20 transition-all cursor-pointer mt-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Register Button Link */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <Link
            href={redirectPath && redirectPath !== "/" ? `/register?redirect=${encodeURIComponent(redirectPath)}` : "/register"}
            className="w-full py-3 px-4 rounded-2xl border border-slate-200 hover:border-accent-lux bg-slate-50 hover:bg-white text-slate-700 hover:text-accent-lux font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <UserPlus className="w-4 h-4 text-accent-lux" />
            <span>Not registered? Create an Account</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center font-sans">Loading authentication page...</div>}>
      <LoginContent />
    </Suspense>
  );
}

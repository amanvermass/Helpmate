"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { registerCustomerApi, sendCustomerSignupOtpApi } from "@/services/authApi";
import { toast } from "@/components/common/Toast";
import {
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User,
  Phone,
  Lock,
  ArrowRight,
  KeyRound,
  RotateCcw,
} from "lucide-react";
import confetti from "canvas-confetti";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryRedirect = searchParams.get("redirect");
  const [redirectPath, setRedirectPath] = useState<string>("/");
  const { setAuth } = useStore();

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

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP Verification State
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [verifiedForMobile, setVerifiedForMobile] = useState<string>("");
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Loading & Feedback
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  // Countdown timer effect for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (otpSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpSent, resendTimer]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#801C6E", "#48073d", "#A21CAF", "#E879F9"],
    });
  };

  // Handle Mobile Input Change
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(val);
    setErrorMsg("");
    setIsAlreadyRegistered(false);

    // If user changes number after OTP was sent to previous number, reset OTP state
    if (otpSent && val !== verifiedForMobile) {
      setOtpSent(false);
      setVerifiedForMobile("");
      setOtpValues(["", "", "", "", "", ""]);
    }
  };

  // Send Signup OTP to Mobile (Triggered by the inline "Verify" button)
  const handleSendOtp = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsAlreadyRegistered(false);

    const cleanedMobile = mobile.trim().replace(/\D/g, "");
    if (!cleanedMobile || cleanedMobile.length !== 10) {
      const err = "Please enter a valid 10-digit mobile number";
      setErrorMsg(err);
      toast.error("Invalid Mobile Number", err);
      return;
    }

    if (!/^[6-9]\d{9}$/.test(cleanedMobile)) {
      const err = "Please enter a valid Indian mobile number starting with 6, 7, 8, or 9";
      setErrorMsg(err);
      toast.error("Invalid Mobile Number", err);
      return;
    }

    setIsSendingOtp(true);

    try {
      const res = await sendCustomerSignupOtpApi({ mobile: cleanedMobile });

      if (res.success) {
        toast.success("OTP Sent Successfully", `6-digit verification code sent to +91 ${cleanedMobile}`);
        setSuccessMsg(`Verification code sent to +91 ${cleanedMobile}`);
        setOtpSent(true);
        setVerifiedForMobile(cleanedMobile);
        setResendTimer(60);
        setCanResend(false);
        setOtpValues(["", "", "", "", "", ""]);

        // Auto-focus first digit of OTP input below
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 300);
      } else {
        const err = res.message || "Failed to send signup OTP. Please try again.";
        setErrorMsg(err);
        if (err.toLowerCase().includes("already exists") || err.toLowerCase().includes("already registered")) {
          setIsAlreadyRegistered(true);
        }
        toast.error("Verification Request Failed", err);
      }
    } catch (err: any) {
      const msg = err.message || "Network connection error. Please try again.";
      setErrorMsg(msg);
      toast.error("Connection Error", msg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend && resendTimer > 0) return;
    setErrorMsg("");
    setSuccessMsg("");
    setIsSendingOtp(true);

    const cleanedMobile = mobile.trim().replace(/\D/g, "");

    try {
      const res = await sendCustomerSignupOtpApi({ mobile: cleanedMobile });

      if (res.success) {
        toast.success("OTP Resent", `A new verification code has been sent to +91 ${cleanedMobile}`);
        setSuccessMsg(`New verification code sent to +91 ${cleanedMobile}`);
        setResendTimer(60);
        setCanResend(false);
        setOtpValues(["", "", "", "", "", ""]);
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      } else {
        const err = res.message || "Failed to resend OTP. Please try again.";
        setErrorMsg(err);
        toast.error("Resend Failed", err);
      }
    } catch (err: any) {
      const msg = "Network connection error. Please try again.";
      setErrorMsg(msg);
      toast.error("Connection Error", msg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // OTP Input Changes
  const handleOtpChange = (index: number, value: string) => {
    const numericVal = value.replace(/\D/g, "");

    // Handle pasted full 6 digit code
    if (numericVal.length >= 6) {
      const pastedDigits = numericVal.slice(0, 6).split("");
      const newOtp = [...otpValues];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedDigits[i] || "";
      }
      setOtpValues(newOtp);
      otpInputRefs.current[5]?.focus();
      return;
    }

    const newOtp = [...otpValues];
    newOtp[index] = numericVal.slice(-1);
    setOtpValues(newOtp);

    // Auto-advance focus to next field if value entered
    if (numericVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pastedData) return;

    const pastedDigits = pastedData.slice(0, 6).split("");
    const newOtp = [...otpValues];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedDigits[i] || "";
    }
    setOtpValues(newOtp);
    const targetFocus = Math.min(pastedDigits.length, 5);
    otpInputRefs.current[targetFocus]?.focus();
  };

  // Submit Final Registration Form
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanedName = fullName.trim();
    if (!cleanedName || cleanedName.length < 2) {
      const err = "Please enter your full name (at least 2 characters)";
      setErrorMsg(err);
      toast.error("Name Required", err);
      return;
    }

    const cleanedMobile = mobile.trim().replace(/\D/g, "");
    if (!cleanedMobile || cleanedMobile.length !== 10) {
      const err = "Please enter a valid 10-digit mobile number";
      setErrorMsg(err);
      toast.error("Invalid Mobile Number", err);
      return;
    }

    if (!/^[6-9]\d{9}$/.test(cleanedMobile)) {
      const err = "Please enter a valid Indian mobile number starting with 6, 7, 8, or 9";
      setErrorMsg(err);
      toast.error("Invalid Mobile Number", err);
      return;
    }

    // Check if OTP was requested
    if (!otpSent) {
      const err = "Please click 'Verify' next to your mobile number to get your verification OTP";
      setErrorMsg(err);
      toast.error("Verification Required", err);
      // Auto-trigger OTP sending if user clicked submit
      handleSendOtp();
      return;
    }

    const fullOtp = otpValues.join("");
    if (fullOtp.length !== 6) {
      const err = "Please enter all 6 digits of the verification code sent to your mobile";
      setErrorMsg(err);
      toast.error("Incomplete OTP", err);
      otpInputRefs.current[fullOtp.length < 6 ? fullOtp.length : 0]?.focus();
      return;
    }

    if (!password) {
      const err = "Please enter a password";
      setErrorMsg(err);
      toast.error("Password Required", err);
      return;
    }

    if (password.length < 8) {
      const err = "Password must be at least 8 characters long";
      setErrorMsg(err);
      toast.error("Weak Password", err);
      return;
    }

    if (password !== confirmPassword) {
      const err = "Passwords do not match. Please check again.";
      setErrorMsg(err);
      toast.error("Password Mismatch", err);
      return;
    }

    setIsRegistering(true);

    try {
      const res = await registerCustomerApi({
        fullName: cleanedName,
        mobile: cleanedMobile,
        password: password,
        otp: fullOtp,
      });

      if (res.success && res.data) {
        triggerConfetti();
        setSuccessMsg("Registration successful! Logging you in...");
        toast.success("Account Created!", "Mobile number verified. Welcome to HelpMate!");

        await setAuth({
          token: res.data.token,
          customer: res.data.customer,
        });

        try {
          sessionStorage.removeItem("helpmate_redirect");
        } catch {}

        setTimeout(() => {
          router.push(redirectPath || "/");
        }, 1200);
      } else {
        const err = res.message || "Invalid or expired verification OTP. Please try again.";
        setErrorMsg(err);
        toast.error("Registration Failed", err);
      }
    } catch (err: any) {
      const msg = err.message || "Network connection error. Please try again.";
      setErrorMsg(msg);
      toast.error("Connection Error", msg);
    } finally {
      setIsRegistering(false);
    }
  };

  const isOtpComplete = otpValues.every((d) => d.trim().length === 1);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-900 px-4 sm:px-6 font-sans relative overflow-hidden py-12">
      {/* Soft background ambient gradient circles */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-purple-100/60 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200/40 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md bg-white border border-slate-200 p-7 sm:p-9 rounded-3xl text-left shadow-xl shadow-slate-200/50 relative z-10 space-y-5"
      >
        {/* Header / Logo */}
        <div className="text-center space-y-1.5">
          <Link href="/" className="inline-block">
            <img
              src="/logo-white.png"
              alt="HelpMate Logo"
              className="h-11 sm:h-12 w-auto object-contain mx-auto mb-1 cursor-pointer hover:opacity-90 transition-opacity"
            />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Create Account
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Register to book Varanasi's top-rated verified home service specialists.
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
            <div className="flex-1">
              <span>{errorMsg}</span>
              {isAlreadyRegistered && (
                <div className="mt-2">
                  <Link
                    href={`/login?mobile=${mobile}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-accent-lux hover:bg-accent-lux/95 px-3 py-1 rounded-xl transition-all shadow-sm"
                  >
                    <span>Sign In Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
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
                disabled={isRegistering}
              />
            </div>
          </div>

          {/* Mobile Number with Inline "Verify" Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Mobile Number
              </label>
              {otpSent && (
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> OTP Sent
                </span>
              )}
            </div>

            <div className="relative">
              <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-500 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> +91
              </span>
              <input
                type="tel"
                placeholder="8840845695"
                value={mobile}
                onChange={handleMobileChange}
                className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-16 text-xs font-bold tracking-wider focus:outline-none focus:border-accent-lux focus:bg-white text-slate-900 transition-all placeholder:text-slate-400 font-sans ${
                  mobile.length === 10 ? "pr-26" : "pr-4"
                }`}
                required
                disabled={isRegistering}
              />

              {/* Show "Verify" button when mobile number is exactly 10 digits */}
              {mobile.length === 10 && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || isRegistering}
                  className={`absolute right-1.5 top-1.5 bottom-1.5 px-3.5 rounded-xl font-extrabold text-[11px] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                    otpSent
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-accent-lux hover:bg-accent-lux/95 text-white"
                  }`}
                  title={otpSent ? "Resend OTP code" : "Verify mobile number with OTP"}
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : otpSent ? (
                    <>
                      <RotateCcw className="w-3 h-3" />
                      <span>Resend</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verify</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {mobile.length > 0 && mobile.length < 10 && (
              <span className="text-[10px] text-slate-400 mt-1 block">
                Enter {10 - mobile.length} more digit{10 - mobile.length > 1 ? "s" : ""} to verify.
              </span>
            )}
          </div>

          {/* 6-DIGIT OTP INPUT FIELD (Opens directly below mobile number when Verify is clicked) */}
          <AnimatePresence>
            {otpSent && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold text-slate-700 tracking-wider flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-accent-lux" />
                      <span>Enter 6-Digit OTP</span>
                    </label>
                    <span className="text-[10px] font-semibold text-emerald-600">
                      Sent to +91 {verifiedForMobile || mobile}
                    </span>
                  </div>

                  {/* 6 Digit OTP Input Boxes */}
                  <div
                    className="flex items-center justify-between gap-1.5 sm:gap-2"
                    onPaste={handleOtpPaste}
                  >
                    {otpValues.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className={`w-10 h-12 sm:w-11 sm:h-13 text-center text-lg font-black bg-white border rounded-xl focus:outline-none focus:border-accent-lux focus:ring-2 focus:ring-accent-lux/20 text-slate-900 transition-all shadow-xs ${
                          digit ? "border-accent-lux bg-purple-50/30" : "border-slate-300"
                        }`}
                        disabled={isRegistering}
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>

                  {/* Timer & Resend Option */}
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-purple-100">
                    <span className="text-slate-500 font-medium">Didn't receive code?</span>
                    {resendTimer > 0 ? (
                      <span className="font-bold text-accent-lux bg-white px-2.5 py-0.5 rounded-lg border border-purple-200 text-[10px]">
                        Resend in {resendTimer}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isSendingOtp}
                        className="font-bold text-accent-lux hover:underline cursor-pointer flex items-center gap-1 text-[11px] disabled:opacity-50"
                      >
                        {isSendingOtp ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <RotateCcw className="w-3 h-3" />
                        )}
                        <span>Resend OTP</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Password */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
              Password (Minimum 8 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-11 text-xs font-medium focus:outline-none focus:border-accent-lux focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
                required
                disabled={isRegistering}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
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
                disabled={isRegistering}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
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
            disabled={isRegistering}
            className={`w-full text-white font-extrabold text-xs py-4 rounded-2xl shadow-lg transition-all cursor-pointer mt-3 flex items-center justify-center gap-2 ${
              otpSent && isOtpComplete
                ? "bg-accent-lux hover:bg-accent-lux/95 shadow-accent-lux/20"
                : otpSent
                ? "bg-slate-800 hover:bg-slate-900 shadow-slate-900/10"
                : "bg-accent-lux hover:bg-accent-lux/95 shadow-accent-lux/20"
            }`}
          >
            {isRegistering ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registering Account...</span>
              </>
            ) : otpSent && isOtpComplete ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Create Account</span>
              </>
            ) : otpSent ? (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Enter 6-Digit OTP to Register</span>
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
        <div className="pt-3 border-t border-slate-100 text-center space-y-2">
          <p className="text-xs text-slate-500">
            Already registered?{" "}
            <Link
              href={
                redirectPath && redirectPath !== "/"
                  ? `/login?redirect=${encodeURIComponent(redirectPath)}`
                  : "/login"
              }
              className="text-accent-lux hover:underline font-bold"
            >
              Sign In to Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center font-sans">
          Loading registration page...
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}

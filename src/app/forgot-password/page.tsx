"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
  Sparkles,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  forgotPasswordApi,
  verifyForgotPasswordOtpApi,
  resetPasswordApi,
} from "@/services/authApi";

function ForgotPasswordContent() {
  const router = useRouter();

  // Step state: 1 = Enter Mobile, 2 = Verify OTP, 3 = Reset Password, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [mobile, setMobile] = useState("");
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI toggle states
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & loading states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Countdown timer for Resend OTP (seconds)
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // References for OTP input fields
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown effect
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (step === 2 && resendTimer > 0) {
      timerInterval = setInterval(() => {
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
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [step, resendTimer]);

  // Handle Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanedMobile = mobile.trim().replace(/\D/g, "");
    if (!cleanedMobile || cleanedMobile.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);

    try {
      const res = await forgotPasswordApi({ mobile: cleanedMobile });

      if (res.success) {
        setSuccessMessage(res.message || "Verification code sent to your mobile.");
        setStep(2);
        setResendTimer(60);
        setCanResend(false);
        // Focus first OTP input on transition
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 300);
      } else {
        setErrorMessage(res.message || "Failed to send verification code. Please check your mobile number.");
      }
    } catch (err: any) {
      setErrorMessage("Network error. Unable to connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP digit input box changes
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

  // Handle Backspace key on OTP input
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const fullOtp = otpValues.join("");
    if (fullOtp.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit OTP code");
      return;
    }

    const cleanedMobile = mobile.trim().replace(/\D/g, "");
    setIsLoading(true);

    try {
      const res = await verifyForgotPasswordOtpApi({
        mobile: cleanedMobile,
        otp: fullOtp,
      });

      if (res.success) {
        // Retrieve resetToken from response
        const token = res.data?.resetToken || res.resetToken;
        if (!token) {
          setErrorMessage("Reset token missing from response. Please try again.");
          return;
        }

        setResetToken(token);
        setSuccessMessage("OTP verified! Please create your new password.");
        setStep(3);
      } else {
        setErrorMessage(res.message || "Invalid or expired OTP code. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage("Network error. Failed to verify OTP code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setErrorMessage("");
    setSuccessMessage("");

    const cleanedMobile = mobile.trim().replace(/\D/g, "");
    setIsLoading(true);

    try {
      const res = await forgotPasswordApi({ mobile: cleanedMobile });
      if (res.success) {
        setSuccessMessage("New OTP code has been sent to your mobile.");
        setResendTimer(60);
        setCanResend(false);
        setOtpValues(Array(6).fill(""));
        otpInputRefs.current[0]?.focus();
      } else {
        setErrorMessage(res.message || "Failed to resend OTP code.");
      }
    } catch (err: any) {
      setErrorMessage("Network error. Unable to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify both fields.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await resetPasswordApi({
        resetToken: resetToken,
        newPassword: newPassword,
      });

      if (res.success) {
        setStep(4);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore confetti error if canvas unavailable
        }
      } else {
        setErrorMessage(res.message || "Failed to reset password. Token may have expired.");
      }
    } catch (err: any) {
      setErrorMessage("Network error. Unable to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate Password Strength score (0-4)
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (!pwd) return score;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const pwdStrength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-900 px-4 sm:px-6 font-sans relative overflow-hidden py-12">
      {/* Ambient soft glow background decorations */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-purple-100/60 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200/40 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md bg-white border border-slate-200 p-8 sm:p-10 rounded-3xl text-left shadow-xl shadow-slate-200/50 relative z-10 space-y-6"
      >
        {/* Header / Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <img
              src="/logo.png"
              alt="HelpMate Logo"
              className="h-12 sm:h-14 w-auto object-contain mx-auto mb-1 cursor-pointer hover:opacity-90 transition-opacity"
            />
          </Link>
          
          {/* Step Indicator Progress Bar */}
          <div className="flex items-center justify-center gap-2 pt-2 pb-1">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === num
                      ? "bg-accent-lux text-white ring-4 ring-purple-100"
                      : step > num
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step > num ? <Check className="w-3.5 h-3.5" /> : num}
                </div>
                {num < 3 && (
                  <div
                    className={`w-8 h-1 rounded-full transition-all ${
                      step > num ? "bg-emerald-500" : "bg-slate-100"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {/* Global Success Banner */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Enter Mobile Number */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-5"
            >
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Forgot Password?
                </h1>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Enter your registered mobile number below to receive a 6-digit OTP code.
                </p>
              </div>

              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
                    Registered Mobile Number
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-16 pr-4 text-xs font-bold tracking-wider focus:outline-none focus:border-accent-lux focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
                      required
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent-lux hover:bg-accent-lux/95 text-white font-extrabold text-xs py-4 rounded-2xl shadow-lg shadow-accent-lux/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending OTP Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send OTP Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Verify OTP Code */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Verify OTP
                  </h1>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className="text-[11px] font-bold text-accent-lux hover:underline"
                  >
                    Change Number
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Enter the 6-digit OTP code sent to{" "}
                  <span className="font-bold text-slate-800">+91 {mobile}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                {/* 6 Digit OTP Input Boxes */}
                <div className="flex items-center justify-between gap-1.5 sm:gap-2">
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
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center text-lg font-black bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-accent-lux focus:bg-white text-slate-900 transition-all shadow-xs"
                      disabled={isLoading}
                    />
                  ))}
                </div>

                {/* Countdown Timer & Resend Button */}
                <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-2xl text-xs">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <KeyRound className="w-4 h-4 text-accent-lux" />
                    <span>OTP Resend Timer</span>
                  </div>
                  {resendTimer > 0 ? (
                    <span className="font-bold text-accent-lux bg-purple-50 px-2.5 py-1 rounded-xl">
                      {resendTimer}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={!canResend || isLoading}
                      className="font-bold text-accent-lux hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                      <span>Resend OTP</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpValues.join("").length !== 6}
                  className="w-full bg-accent-lux hover:bg-accent-lux/95 text-white font-extrabold text-xs py-4 rounded-2xl shadow-lg shadow-accent-lux/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying OTP...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify & Continue</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Mobile Input
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Reset Password */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Set New Password
                </h1>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Please create a strong new password for your account.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* New Password Input */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-11 text-xs font-medium focus:outline-none focus:border-accent-lux focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {newPassword.length > 0 && (
                  <div className="space-y-1.5 pt-0.5">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-500">Password Strength:</span>
                      <span
                        className={
                          pwdStrength <= 1
                            ? "text-red-500"
                            : pwdStrength === 2
                            ? "text-amber-500"
                            : "text-emerald-600"
                        }
                      >
                        {pwdStrength <= 1 ? "Weak" : pwdStrength === 2 ? "Moderate" : "Strong"}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full transition-all duration-300 ${
                          pwdStrength <= 1
                            ? "w-1/3 bg-red-500"
                            : pwdStrength === 2
                            ? "w-2/3 bg-amber-500"
                            : "w-full bg-emerald-500"
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* Confirm Password Input */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
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
                </div>

                {/* Password Match Status */}
                {confirmPassword.length > 0 && (
                  <div className="text-[11px] font-bold">
                    {newPassword === confirmPassword ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                      </span>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !newPassword || newPassword !== confirmPassword}
                  className="w-full bg-accent-lux hover:bg-accent-lux/95 text-white font-extrabold text-xs py-4 rounded-2xl shadow-lg shadow-accent-lux/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Reset Password</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 4: Success Screen */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-4"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Password Reset!
                </h1>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Your password has been successfully updated. You can now sign in with your new credentials.
                </p>
              </div>

              <button
                onClick={() => router.push("/login")}
                className="w-full bg-accent-lux hover:bg-accent-lux/95 text-white font-extrabold text-xs py-4 rounded-2xl shadow-lg shadow-accent-lux/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center font-sans">
          Loading password recovery...
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}

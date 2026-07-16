"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/contexts/AuthContext";
import { sendVerificationCode, verifyEmail } from "@/lib/api/auth";
import { showErrorAlert, showSuccessAlert } from "@/lib/utils/swal";

const OTP_RESEND_COOLDOWN = 60;

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setInterval(() => {
      setOtpCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCountdown]);

  const handleSendOTP = async () => {
    if (!email) {
      await showErrorAlert("Error", "Please enter your email first.");
      return;
    }
    setIsSendingOTP(true);
    try {
      await sendVerificationCode(email);
      await showSuccessAlert("Success", `OTP sent to your email! It expires in 5 minutes.`);
      setOtpCountdown(OTP_RESEND_COOLDOWN);
      setIsEmailVerified(false);
      setOtp("");
    } catch (err: unknown) {
      await showErrorAlert("Error", err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      await showErrorAlert("Error", "Please enter the 6-digit OTP code.");
      return;
    }
    setIsVerifying(true);
    try {
      await verifyEmail({ email, verificationCode: otp });
      await showSuccessAlert("Verified!", "Your email has been verified. You can now complete registration.");
      setIsEmailVerified(true);
    } catch (err: unknown) {
      await showErrorAlert("Verification Failed", err instanceof Error ? err.message : "Invalid OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmailVerified) {
      await showErrorAlert("Error", "Please verify your email first.");
      return;
    }
    if (password !== confirmPassword) {
      await showErrorAlert("Error", "Passwords do not match!");
      return;
    }
    if (!agreedToTerms) {
      await showErrorAlert("Error", "Please agree to the Terms of Service");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        userName: username,
        emailAddress: email,
        password: password,
        confirmPassword: confirmPassword,
      });

      await showSuccessAlert("Registration Successful!", "Welcome to Mystic Journey!");
      router.push("/");
    } catch (err: unknown) {
      await showErrorAlert("Registration Failed", err instanceof Error ? err.message : "Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <Link href="/" className="relative w-32 h-20">
          <Image
            src="/images/logo/logo.png"
            alt="Mystic Journey Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Register</h1>
          <p className="text-white/60 text-sm">Join the adventure today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 outline-none focus:border-[#ffc032] focus:bg-white/10 transition-all duration-200"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
              Email Address
            </label>
            <div className="relative flex items-center">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsEmailVerified(false);
                }}
                placeholder="Enter your email"
                required
                disabled={isEmailVerified}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 outline-none focus:border-[#ffc032] focus:bg-white/10 transition-all duration-200 disabled:opacity-60"
              />
              {isEmailVerified && (
                <span className="absolute right-3 text-green-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </div>
          </div>

          {/* OTP - Step 1: Send & Step 2: Verify */}
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-white/80 mb-2">
              OTP Code
              {isEmailVerified && (
                <span className="ml-2 text-green-400 text-xs font-normal">(Verified)</span>
              )}
            </label>
            <div className="relative flex items-center gap-2">
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                disabled={isEmailVerified}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 outline-none focus:border-[#ffc032] focus:bg-white/10 transition-all duration-200 disabled:opacity-60"
              />
              {isEmailVerified ? (
                <span className="px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-sm font-medium whitespace-nowrap">
                  Verified
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={isSendingOTP || otpCountdown > 0}
                    className="w-8 h-8 flex items-center justify-center text-[#ffc032] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSendingOTP ? (
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <span className="text-xs font-medium whitespace-nowrap">{otpCountdown > 0 ? `${otpCountdown}s` : "Send"}</span>
                    )}
                  </button>
                  {otp.length === 6 && (
                    <button
                      type="button"
                      onClick={handleVerifyOTP}
                      disabled={isVerifying}
                      className="px-3 py-2 bg-[#ffc032] hover:bg-[#e0a800] text-black rounded-xl text-sm font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {isVerifying ? "..." : "Verify"}
                    </button>
                  )}
                </>
              )}
            </div>
            {!isEmailVerified && (
              <p className="text-xs text-white/40 mt-1">
                {otpCountdown > 0
                  ? `Code expires in 5 minutes. Resend in ${otpCountdown}s.`
                  : "Enter your email and click Send OTP to receive a verification code."}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 outline-none focus:border-[#ffc032] focus:bg-white/10 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-white/40 mt-1">Must be 6-100 characters with at least 1 letter and 1 number</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                minLength={8}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 outline-none focus:border-[#ffc032] focus:bg-white/10 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3">
            <input
              id="terms"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-[#ffc032] focus:ring-[#ffc032] focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-white/60 cursor-pointer">
              I agree to the{" "}
              <Link href="/terms" className="text-[#ffc032] hover:text-[#ffd04c]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-[#ffc032] hover:text-[#ffd04c]">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <Button variant="cta" size="lg" fullWidth type="submit" isLoading={isLoading}>
            Register
          </Button>
        </form>
      </div>

      {/* Login Link */}
      <p className="text-center text-white/60 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-[#ffc032] hover:text-[#ffd04c] font-semibold transition-colors">
          Login
        </Link>
      </p>
    </div>
  );
}

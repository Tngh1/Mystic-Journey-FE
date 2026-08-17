"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ScrollText } from "lucide-react";
import AuthField from "@/components/ui/AuthField";
import AuthFrame from "@/components/ui/AuthFrame";
import { useAuth } from "@/lib/contexts/AuthContext";
import { sendVerificationCode, verifyEmail } from "@/lib/api/auth";
import { showErrorAlert, showSuccessAlert } from "@/lib/utils/swal";

const OTP_RESEND_COOLDOWN = 60;

// Renders the register page view component.
// Returns the JSX element hierarchy for the page view.
export default function RegisterPage() {
  const router = useRouter();  // Initialize Next.js router for programmatic navigation
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSendingOTP, setIsSendingOTP] = useState(false);  // Initialize boolean flag as inactive
  const [isVerifying, setIsVerifying] = useState(false);  // Initialize boolean flag as inactive
  const [agreedToTerms, setAgreedToTerms] = useState(false);  // Initialize boolean flag as inactive
  const [isLoading, setIsLoading] = useState(false);  // Track async submission loading state
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isEmailVerified, setIsEmailVerified] = useState(false);  // Initialize boolean flag as inactive

  // Synchronize this effect by updates interval and updates otp countdown whenever its dependencies change.
  useEffect(() => {
    if (otpCountdown <= 0) return;
    // Renders the timer view component.
    // Key functionality: displays interactive alert dialogues for user actions.
    // Returns the JSX element hierarchy for the page view.
    const timer = setInterval(() => {
      setOtpCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCountdown]);

  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  // Sends a 6-digit verification code to the entered email address.
  const handleSendOTP = async () => {
    if (!email) {
      await showErrorAlert("Error", "Please enter your email first."); // Guard against empty email input
      return;
    }
    setIsSendingOTP(true); // Show spinner on Send OTP button
    try {
      await sendVerificationCode(email); // POST to /api/auth/send-verification-code to deliver OTP email
      await showSuccessAlert("Success", `OTP sent to your email! It expires in 5 minutes.`); // Inform user of successful email delivery
      setOtpCountdown(OTP_RESEND_COOLDOWN); // Start 60s cooldown timer before next send
      setIsEmailVerified(false); // Reset verified state if user changed email
      setOtp(""); // Clear previous OTP input
    } catch (err: unknown) {
      await showErrorAlert("Error", err instanceof Error ? err.message : "Failed to send OTP."); // Display backend error
    } finally {
      setIsSendingOTP(false); // Clear sending state
    }
  };

  // Verifies the entered 6-digit OTP against the Redis cache.
  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      await showErrorAlert("Error", "Please enter the 6-digit OTP code."); // Ensure user entered 6 characters
      return;
    }
    setIsVerifying(true); // Show verifying spinner
    try {
      await verifyEmail({ email, verificationCode: otp }); // POST to /api/auth/verify-email to confirm OTP validity
      await showSuccessAlert("Verified!", "Your email has been verified. You can now complete registration."); // Show verification success popup
      setIsEmailVerified(true); // Unlock registration form submission
    } catch (err: unknown) {
      await showErrorAlert("Verification Failed", err instanceof Error ? err.message : "Invalid OTP. Please try again."); // Alert invalid OTP code
    } finally {
      setIsVerifying(false); // Clear verifying state
    }
  };

  // Submits the complete registration payload and signs the user in.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent native browser form submission reload

    if (!isEmailVerified) {
      await showErrorAlert("Error", "Please verify your email first."); // Guard: email must be pre-verified via OTP
      return;
    }
    if (password !== confirmPassword) {
      await showErrorAlert("Error", "Passwords do not match!"); // Guard: ensure passwords match
      return;
    }
    if (!agreedToTerms) {
      await showErrorAlert("Error", "Please agree to the Terms of Service"); // Guard: terms agreement checkbox
      return;
    }

    setIsLoading(true); // Disable submit button and show loading spinner

    try {
      await register({
        userName: username,
        emailAddress: email,
        password: password,
        confirmPassword: confirmPassword,
      }); // Call AuthContext register — creates account, initial profile, and sets JWT cookies

      await showSuccessAlert("Registration Successful!", "Welcome to Mystic Journey!"); // Show welcome message
      router.push("/"); // Navigate user to main home/dashboard page
    } catch (err: unknown) {
      await showErrorAlert("Registration Failed", err instanceof Error ? err.message : "Please try again."); // Display server registration failure
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <AuthFrame
      eyebrow="Muster Roll"
      icon={ScrollText}
      title="Enlist"
      lede="Write your name in the muster roll and join the journey."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-accent hover:text-accent-hover">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} aria-label="Register" className="space-y-4">
        <AuthField
          label="Username"
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          autoComplete="username"
          required
        />

        <AuthField
          label="Email Address"
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setIsEmailVerified(false);
          }}
          placeholder="Enter your email"
          autoComplete="email"
          disabled={isEmailVerified}
          required
          hint={isEmailVerified ? "Verified — this address is locked in." : undefined}
          trailing={
            isEmailVerified ? (
              <span className="absolute right-3 flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-success">
                <Check className="h-4 w-4" aria-hidden="true" />
                Verified
              </span>
            ) : undefined
          }
        />


        <AuthField
          label="OTP Code"
          id="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="Enter 6-digit code"
          maxLength={6}
          disabled={isEmailVerified}
          hint={
            isEmailVerified
              ? "Email sealed. You may complete the roll."
              : otpCountdown > 0
                ? `Code expires in 5 minutes. Resend available in ${otpCountdown}s.`
                : "Enter your email, then send a code to verify it."
          }
          trailing={
            isEmailVerified ? undefined : (
              <>
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={isSendingOTP || otpCountdown > 0}
                  className="pixel-press flex h-11 shrink-0 cursor-pointer items-center border-2 border-black/60 bg-wood px-3 text-xs font-bold uppercase tracking-widest text-parchment hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSendingOTP
                    ? "Sending…"
                    : otpCountdown > 0
                      ? `${otpCountdown}s`
                      : "Send"}
                </button>
                {otp.length === 6 && (
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={isVerifying}
                    className="pixel-press flex h-11 shrink-0 cursor-pointer items-center border-2 border-accent bg-accent px-3 text-xs font-black uppercase tracking-widest text-on-accent hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isVerifying ? "…" : "Verify"}
                  </button>
                )}
              </>
            )
          }
        />

        <AuthField
          label="Password"
          id="password"
          reveal
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          autoComplete="new-password"
          minLength={6}
          hint="6–100 characters, with at least one letter and one number."
          required
        />

        <AuthField
          label="Confirm Password"
          id="confirmPassword"
          reveal
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          autoComplete="new-password"
          error={mismatch ? "The two passwords do not match." : undefined}
          required
        />

        <div className="flex items-start gap-3 border-t-2 border-black/40 pt-4">
          <input
            id="terms"
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[var(--color-accent)]"
          />
          <label htmlFor="terms" className="cursor-pointer text-sm leading-relaxed text-parchment-dim">
            I agree to the{" "}
            <Link href="/terms" className="font-bold text-accent hover:text-accent-hover">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="font-bold text-accent hover:text-accent-hover">
              Privacy Policy
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || mismatch}
          className="pixel-press flex min-h-11 w-full cursor-pointer items-center justify-center border-2 border-accent bg-accent text-sm font-black uppercase tracking-widest text-on-accent shadow-md hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Enlisting…" : "Register"}
        </button>
      </form>
    </AuthFrame>
  );
}

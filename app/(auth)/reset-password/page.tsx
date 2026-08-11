"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useRef } from "react";
import { AlertCircle, ShieldCheck } from "lucide-react";
import AuthField from "@/components/ui/AuthField";
import AuthFrame from "@/components/ui/AuthFrame";
import { resetPassword } from "@/lib/api/auth";
import { showErrorAlert, showSuccessAlert } from "@/lib/utils/swal";

const CODE_LENGTH = 6;

/* Six carved cells for the courier's code. Each is a real input with its own
   label, so a screen reader announces "Digit 3 of 6" rather than one blob. */
function OTPInput({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, char: string) => {
    if (!/^\d?$/.test(char)) return;

    const newValue = value.split("");
    newValue[index] = char;
    onChange(newValue.join(""));

    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    onChange(pasted);
    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };

  return (
    <div className="flex justify-center gap-2" role="group" aria-label="Verification code">
      {Array.from({ length: CODE_LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          aria-label={`Digit ${i + 1} of ${CODE_LENGTH}`}
          className="h-14 w-11 border-2 border-black/60 bg-black/40 text-center text-xl font-bold tabular-nums text-parchment shadow-[inset_2px_2px_0_rgb(0_0_0_/_0.5)] outline-none focus:border-accent"
        />
      ))}
    </div>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      await showErrorAlert("Error", "Email is required. Please go back to Forget Password.");
      return;
    }

    if (!verificationCode.trim()) {
      await showErrorAlert("Error", "Please enter the verification code.");
      return;
    }

    if (newPassword.length < 6) {
      await showErrorAlert("Error", "Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      await showErrorAlert("Error", "Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword({
        email: email,
        verificationCode: verificationCode.trim(),
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });
      await showSuccessAlert("Success!", "Your password has been reset. You can now login.");
      router.push("/login");
    } catch (err: unknown) {
      await showErrorAlert("Error", err instanceof Error ? err.message : "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Landed here without the email in the query — the code has nothing to match.
  if (!email) {
    return (
      <AuthFrame
        eyebrow="Courier"
        icon={AlertCircle}
        title="Invalid Request"
        lede="Go back and enter your email so the reset code can be matched to your record."
      >
        <div role="alert">
          <Link
            href="/forget-password"
            className="pixel-press flex min-h-11 w-full items-center justify-center border-2 border-accent bg-accent text-sm font-black uppercase tracking-widest text-on-accent shadow-md hover:bg-accent-hover"
          >
            Back to Forget Password
          </Link>
        </div>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame
      eyebrow="Warden"
      icon={ShieldCheck}
      title="Reset Password"
      lede={
        <>
          Enter the code sent to <span className="font-bold">{email}</span>.
        </>
      }
      footer={
        <>
          Remember your password?{" "}
          <Link href="/login" className="font-bold text-accent hover:text-accent-hover">
            Log In
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} aria-label="Reset password" className="space-y-4">
        <div>
          <p
            id="code-label"
            className="mb-2 text-center text-[11px] font-bold uppercase tracking-widest text-parchment-dim"
          >
            Verification Code
          </p>
          <OTPInput value={verificationCode} onChange={setVerificationCode} />
        </div>

        <AuthField
          label="New Password"
          id="newPassword"
          reveal
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          autoComplete="new-password"
          minLength={6}
          hint="At least 6 characters, with a letter and a number."
          required
        />

        <AuthField
          label="Confirm Password"
          id="confirmPassword"
          reveal
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          autoComplete="new-password"
          error={mismatch ? "The two passwords do not match." : undefined}
          required
        />

        <button
          type="submit"
          disabled={isLoading || mismatch}
          className="pixel-press flex min-h-11 w-full cursor-pointer items-center justify-center border-2 border-accent bg-accent text-sm font-black uppercase tracking-widest text-on-accent shadow-md hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Resetting…" : "Reset Password"}
        </button>
      </form>
    </AuthFrame>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="border-2 border-black/60 bg-iron-dark p-5">
          <p role="status" className="sr-only">
            Loading reset form…
          </p>
          <div className="space-y-3" aria-hidden="true">
            <span className="block h-11 w-full bg-parchment/10" />
            <span className="block h-11 w-full bg-parchment/8" />
            <span className="block h-11 w-full bg-parchment/8" />
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

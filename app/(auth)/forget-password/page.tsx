"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MailQuestion } from "lucide-react";
import AuthField from "@/components/ui/AuthField";
import AuthFrame from "@/components/ui/AuthFrame";
import { forgetPassword } from "@/lib/api/auth";
import { showErrorAlert } from "@/lib/utils/swal";

// Renders the forget password page view component.
// Key functionality: manages local UI state, pagination, and filter values; displays interactive alert dialogues for user actions.
// Returns the JSX element hierarchy for the page view.
export default function ForgetPasswordPage() {
  const router = useRouter();  // Initialize Next.js router for programmatic navigation
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);  // Track async submission loading state

  // Submits the email address to request a password reset OTP code.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent native form submission reload
    setIsLoading(true); // Disable button and show sending state

    try {
      await forgetPassword(email); // POST email to /api/auth/forget-password — server generates OTP and sends email
      router.push(`/reset-password?email=${encodeURIComponent(email)}`); // Redirect user to the reset password page with email prefilled
    } catch (err: unknown) {
      await showErrorAlert("Error", err instanceof Error ? err.message : "Failed to send reset code. Please try again."); // Display backend error alert
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <AuthFrame
      eyebrow="Courier"
      icon={MailQuestion}
      title="Forget Password"
      lede="Name the address on your record and a reset code will be sent by courier."
      footer={
        <>
          Remember your password?{" "}
          <Link href="/login" className="font-bold text-accent hover:text-accent-hover">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} aria-label="Request a reset code" className="space-y-4">
        <AuthField
          label="Email Address"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          hint="The code is valid for 5 minutes."
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="pixel-press flex min-h-11 w-full cursor-pointer items-center justify-center border-2 border-accent bg-accent text-sm font-black uppercase tracking-widest text-on-accent shadow-md hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Sending…" : "Send Reset Code"}
        </button>
      </form>
    </AuthFrame>
  );
}

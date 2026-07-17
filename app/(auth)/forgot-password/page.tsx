"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { forgotPassword } from "@/lib/api/auth";
import { showErrorAlert } from "@/lib/utils/swal";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await forgotPassword(email);
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      await showErrorAlert("Error", err instanceof Error ? err.message : "Failed to send reset code. Please try again.");
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
          <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
          <p className="text-white/60 text-sm">
            Enter your email and we&apos;ll send you a reset code
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 outline-none focus:border-[#ffc032] focus:bg-white/10 transition-all duration-200"
            />
          </div>

          {/* Submit Button */}
          <Button variant="cta" size="lg" fullWidth type="submit" isLoading={isLoading}>
            Send Reset Code
          </Button>
        </form>
      </div>

      {/* Back to Login */}
      <p className="text-center text-white/60 mt-6">
        Remember your password?{" "}
        <Link href="/login" className="text-[#ffc032] hover:text-[#ffd04c] font-semibold transition-colors">
          Login
        </Link>
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import AuthField from "@/components/ui/AuthField";
import AuthFrame from "@/components/ui/AuthFrame";
import { useAuth } from "@/lib/contexts/AuthContext";
import { showErrorAlert } from "@/lib/utils/swal";

// Renders the login page view component.
// Returns the JSX element hierarchy for the page view.
export default function LoginPage() {
  const { login } = useAuth();  // Pull login function from AuthContext
  const router = useRouter();  // Initialize Next.js router for programmatic navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);  // Track async submission loading state

  // Renders the handle submit view component.
  // Returns the JSX element hierarchy for the page view.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent default HTML form submission and page reload
    setIsLoading(true);  // Disable submit button to prevent duplicate requests
    try {
      const me = await login(email, password);  // Submit credentials and receive authenticated user profile

      const home = me.role === "Admin" ? "/dashboard" : "/";  // Redirect admin users to dashboard, regular users to home

      const wanted = new URLSearchParams(window.location.search).get("redirect");  // Restore intended destination from redirect query parameter
      const destination = wanted?.startsWith("/") && !wanted.startsWith("//") ? wanted : home;
      router.replace(destination);  // Navigate to destination and replace login entry in history
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid credentials. Please try again.";
      await showErrorAlert("Login Failed", message);  // Display styled error alert dialog to the user
    } finally {
      setIsLoading(false);  // Re-enable submit button after operation completes
    }
  };

  return (
    <AuthFrame
      eyebrow="Gatehouse"
      icon={KeyRound}
      title="Login"
      lede="Sign the register to continue your journey."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-accent hover:text-accent-hover">
            Register
          </Link>
        </>
      }
    >

      <form onSubmit={handleSubmit} aria-label="Login" className="space-y-4">
        <AuthField
          label="Email or Username"
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email or username"
          autoComplete="username"
          required
        />

        <AuthField
          label="Password"
          id="password"
          reveal
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        <div className="flex justify-end">
          <Link
            href="/forget-password"
            className="flex min-h-11 items-center text-xs font-bold uppercase tracking-widest text-accent hover:text-accent-hover"
          >
            Forget password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="pixel-press flex min-h-11 w-full cursor-pointer items-center justify-center border-2 border-accent bg-accent text-sm font-black uppercase tracking-widest text-on-accent shadow-md hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Signing in…" : "Login"}
        </button>
      </form>
    </AuthFrame>
  );
}

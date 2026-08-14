"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import AuthField from "@/components/ui/AuthField";
import AuthFrame from "@/components/ui/AuthFrame";
import { useAuth } from "@/lib/contexts/AuthContext";
import { showErrorAlert } from "@/lib/utils/swal";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const me = await login(email, password);

      // Admin is the only non-Player role: the BE seeds just Player/Admin and
      // every [Authorize] there is Roles = "Admin". SuperAdmin was removed, so
      // don't reintroduce a branch for it here.
      const home = me.role === "Admin" ? "/dashboard" : "/";

      // proxy.ts parks the blocked path in ?redirect= when it bounces a guest.
      // Read it here rather than with useSearchParams so the page keeps
      // prerendering without a Suspense boundary. Only same-origin paths are
      // honoured: a leading "//" or "https://evil" would make this an open
      // redirect, and the param is attacker-controlled.
      const wanted = new URLSearchParams(window.location.search).get("redirect");
      const destination = wanted?.startsWith("/") && !wanted.startsWith("//") ? wanted : home;
      router.replace(destination);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid credentials. Please try again.";
      await showErrorAlert("Login Failed", message);
    } finally {
      setIsLoading(false);
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
      {/* Straight on the cloth — the banner is already the surface. */}
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

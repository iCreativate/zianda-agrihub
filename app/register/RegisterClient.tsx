"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

export function RegisterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        const msg = signUpError.message || "Registration failed.";
        setError(
          msg.toLowerCase().includes("signups not allowed")
            ? "Registrations are currently disabled for this Supabase project. Enable Email signups in Supabase Auth settings."
            : msg
        );
        setLoading(false);
        return;
      }
      // If email confirmations are enabled, Supabase returns no session.
      if (!data.session) {
        setSuccess(
          "Account created. Please check your email to confirm your address, then log in."
        );
        setLoading(false);
        return;
      }

      router.push(nextUrl);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed. Check your connection and try again.";
      setError(
        message.includes("environment variables")
          ? "Authentication is not configured yet. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
          : message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-slate-950 px-4 py-12 text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.22),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,118,110,0.16),_transparent_55%)]" />

      <div className="relative mx-auto w-full max-w-sm space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white"
        >
          ← Back to Zianda Agri-Hub
        </Link>

        <div className="card-shell space-y-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
              Create an account
            </h1>
            <p className="text-sm text-slate-300">
              Register to start managing your farm with Zianda Agri-Hub.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/50 bg-red-950/40 px-3 py-2 text-sm text-red-200"
              >
                {error}
              </div>
            )}
            {success && (
              <div
                role="status"
                className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-100"
              >
                {success}{" "}
                <Link
                  href={`/login?next=${encodeURIComponent(nextUrl)}`}
                  className="font-semibold text-emerald-200 underline hover:no-underline"
                >
                  Go to login
                </Link>
                .
              </div>
            )}
            <div>
              <label
                htmlFor="register-email"
                className="block text-sm font-medium text-slate-200"
              >
                Email
              </label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="input-dark mt-1"
                placeholder="you@farm.com"
              />
            </div>
            <div>
              <label
                htmlFor="register-password"
                className="block text-sm font-medium text-slate-200"
              >
                Password
              </label>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
                className="input-dark mt-1"
                placeholder="At least 6 characters"
              />
              <p className="mt-1 text-xs text-slate-400">
                Use at least 6 characters.
              </p>
            </div>
            <div>
              <label
                htmlFor="register-confirm"
                className="block text-sm font-medium text-slate-200"
              >
                Confirm password
              </label>
              <input
                id="register-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
                className="input-dark mt-1"
                placeholder="Repeat your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-300">
            Already have an account?{" "}
            <Link
              href={`/login?next=${encodeURIComponent(nextUrl)}`}
              className="font-semibold text-emerald-300 hover:text-emerald-200"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}


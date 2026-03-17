"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

const DEMO_EMAIL = "demo@zianda-agrihub.com";
const DEMO_PASSWORD = "demo1234";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
        router.push(nextUrl);
        router.refresh();
        setLoading(false);
        return;
      }
      const supabase = getSupabaseClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      router.push(nextUrl);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Sign-in failed. Check your connection and try again.";
      setError(
        message.includes("environment variables")
          ? "Authentication is not configured yet. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, or register first."
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
              Log in
            </h1>
            <p className="text-sm text-slate-300">
              Enter your email and password to access your farm dashboard.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-3 py-2 text-xs text-emerald-100">
            <p className="font-semibold">Demo access</p>
            <p className="mt-0.5 text-emerald-100/90">
              {DEMO_EMAIL} <span className="text-emerald-200/70">/</span> {DEMO_PASSWORD}
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
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-slate-200"
              >
                Email
              </label>
              <input
                id="login-email"
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
                htmlFor="login-password"
                className="block text-sm font-medium text-slate-200"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="input-dark mt-1"
                placeholder="Your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Log in"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-300">
            Don&apos;t have an account?{" "}
            <Link
              href={`/register?next=${encodeURIComponent(nextUrl)}`}
              className="font-semibold text-emerald-300 hover:text-emerald-200"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

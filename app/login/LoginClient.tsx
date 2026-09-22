"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { BrandMark } from "@/components/ui/brand-mark";

const DEMO_EMAIL = "demo@zianda-agrihub.com";
const DEMO_PASSWORD = "demo1234";

export function LoginClient() {
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
    <main className="min-h-screen bg-ivory lg:grid lg:grid-cols-2">
      <div className="relative hidden min-h-screen lg:block">
        <Image
          src="/images/home/hero.jpg"
          alt="AI-generated savanna sunset with cattle"
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/25 to-ink/20" />
        <div className="absolute bottom-10 left-10 right-10 text-paper">
          <BrandMark />
          <p className="mt-8 text-[11px] font-semibold uppercase tracking-eyebrow text-wheat">
            Zianda Agri-Hub
          </p>
          <h1 className="mt-3 max-w-md text-4xl font-semibold tracking-tight">
            Sign in to your farm operations.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/75">
            Livestock, crops, equipment and finances — recorded once, available everywhere.
          </p>
        </div>
      </div>

      <div className="relative flex min-h-screen items-center px-4 py-12">
        <div className="mx-auto w-full max-w-sm space-y-6">
          <Link href="/" className="link-quiet inline-flex items-center gap-2">
            ← Back to Zianda Agri-Hub
          </Link>

          <div className="card-shell space-y-5">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
              <p className="text-sm text-ink-muted">
                Enter your email and password to access your farm dashboard.
              </p>
            </div>

            <div className="rounded-control border border-crop/20 bg-crop-soft px-3 py-2 text-xs text-crop">
              <p className="font-semibold">Demo access</p>
              <p className="mt-0.5">
                {DEMO_EMAIL} <span className="text-ink-subtle">/</span> {DEMO_PASSWORD}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div role="alert" className="alert-error">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="login-email" className="label-field">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="input-field mt-1"
                  placeholder="you@farm.com"
                />
              </div>
              <div>
                <label htmlFor="login-password" className="label-field">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="input-field mt-1"
                  placeholder="Your password"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Signing in…" : "Log in"}
              </button>
            </form>

            <p className="text-center text-sm text-ink-muted">
              Don&apos;t have an account?{" "}
              <Link
                href={`/register?next=${encodeURIComponent(nextUrl)}`}
                className="font-semibold text-ink hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

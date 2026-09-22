"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { BrandMark } from "@/components/ui/brand-mark";

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
    <main className="min-h-screen bg-ivory lg:grid lg:grid-cols-2">
      <div className="relative hidden min-h-screen lg:block">
        <Image
          src="/images/home/farmer.jpg"
          alt="AI-generated farmer in a crop field"
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/25 to-ink/20" />
        <div className="absolute bottom-10 left-10 right-10 text-paper">
          <BrandMark />
          <p className="mt-8 text-[11px] font-semibold uppercase tracking-eyebrow text-wheat">
            Create an account
          </p>
          <h1 className="mt-3 max-w-md text-4xl font-semibold tracking-tight">
            Start recording the farm properly.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/75">
            Register to manage livestock, crops, equipment and finances from one place.
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
              <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
              <p className="text-sm text-ink-muted">
                Register to start managing your farm with Zianda Agri-Hub.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div role="alert" className="alert-error">
                  {error}
                </div>
              )}
              {success && (
                <div role="status" className="alert-success">
                  {success}{" "}
                  <Link
                    href={`/login?next=${encodeURIComponent(nextUrl)}`}
                    className="font-semibold underline hover:no-underline"
                  >
                    Go to login
                  </Link>
                  .
                </div>
              )}
              <div>
                <label htmlFor="register-email" className="label-field">
                  Email
                </label>
                <input
                  id="register-email"
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
                <label htmlFor="register-password" className="label-field">
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
                  className="input-field mt-1"
                  placeholder="At least 6 characters"
                />
                <p className="help-text">Use at least 6 characters.</p>
              </div>
              <div>
                <label htmlFor="register-confirm" className="label-field">
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
                  className="input-field mt-1"
                  placeholder="Repeat your password"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Creating account…" : "Register"}
              </button>
            </form>

            <p className="text-center text-sm text-ink-muted">
              Already have an account?{" "}
              <Link
                href={`/login?next=${encodeURIComponent(nextUrl)}`}
                className="font-semibold text-ink hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

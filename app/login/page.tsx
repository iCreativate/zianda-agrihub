import { Suspense } from "react";
import { LoginClient } from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-ivory px-4 py-12">
          <div className="mx-auto w-full max-w-sm">
            <div className="card-shell">
              <p className="text-sm text-ink-muted">Loading…</p>
            </div>
          </div>
        </main>
      }
    >
      <LoginClient />
    </Suspense>
  );
}

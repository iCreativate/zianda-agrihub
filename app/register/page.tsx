import { Suspense } from "react";
import { RegisterClient } from "./RegisterClient";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-50">
          <div className="mx-auto w-full max-w-sm">
            <div className="card-shell">
              <p className="text-sm text-slate-300">Loading…</p>
            </div>
          </div>
        </main>
      }
    >
      <RegisterClient />
    </Suspense>
  );
}

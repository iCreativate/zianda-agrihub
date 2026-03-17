import { Sidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { MobileShellNav } from "@/components/ui/MobileShellNav";

export default function ShellLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-transparent">
      {/* Left panel nav - fixed on desktop */}
      <div className="hidden md:block md:sticky md:top-0 md:h-dvh">
        <Sidebar />
      </div>
      {/* Main content */}
      <div className="flex min-h-dvh flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800/60 bg-slate-900/80 px-4 py-3 shadow-lg backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <MobileShellNav />
            <Link href="/dashboard" className="text-lg font-semibold text-slate-50">
              Zianda Agri-Hub
            </Link>
          </div>
          <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white">
            Home
          </Link>
        </header>
        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-6xl rounded-3xl border border-slate-800/60 bg-slate-900/40 p-4 shadow-xl shadow-black/30 backdrop-blur-sm md:p-6">
            {props.children}
          </div>
        </main>
      </div>
    </div>
  );
}


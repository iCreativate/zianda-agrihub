import { Sidebar } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/shell/app-header";
import { MobileDock } from "@/components/shell/mobile-dock";
import { OfflineIndicator } from "@/components/ui/offline-indicator";

export default function ShellLayout(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-ivory md:pl-[240px]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] border-r border-stone bg-paper md:flex">
        <Sidebar />
      </aside>

      <div className="flex min-h-dvh min-w-0 flex-col">
        <AppHeader />
        <OfflineIndicator />
        <main className="flex-1 px-4 py-5 pb-28 md:px-6 md:py-6 lg:px-8 lg:pb-10">
          <div className="mx-auto w-full max-w-[1200px]">{props.children}</div>
        </main>
        <MobileDock />
      </div>
    </div>
  );
}

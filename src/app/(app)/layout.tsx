import Link from "next/link";
import Icons from "@/components/global/icons";
import { ReduxProvider } from "@/redux/provider";
import { AppBootstrap } from "@/components/dashboard/app-bootstrap";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

// The whole authenticated dashboard is per-user and behind the Firebase auth
// gate — never statically prerenderable, and middleware already requires a
// session cookie to reach these routes.
export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <AppBootstrap />
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <aside className="hidden w-64 shrink-0 border-r border-border p-4 md:block">
            <Link href="/" className="mb-6 flex items-center gap-2 px-1">
              <Icons.logo className="h-6 w-6" />
              <span className="font-medium">NoCaps</span>
            </Link>
            <SidebarNav />
          </aside>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ReduxProvider>
  );
}

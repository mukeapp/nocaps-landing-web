import localFont from "next/font/local";
import { ReduxProvider } from "@/redux/provider";
import { AppBootstrap } from "@/components/dashboard/app-bootstrap";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DrawerLogo } from "@/components/dashboard/drawer-logo";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

// Mirrors mobile's font registration (nocap-mvp/app/index.tsx useFonts):
// regular/medium/semibold/bold = OpenSans (the app-wide default), Poppins
// available for the poppins_* aliases some components use.
const openSans = localFont({
  src: [
    { path: "../../../public/assets/fonts/OpenSans-Regular.ttf", weight: "400" },
    { path: "../../../public/assets/fonts/OpenSans-Medium.ttf", weight: "500" },
    { path: "../../../public/assets/fonts/OpenSans-SemiBold.ttf", weight: "600" },
    { path: "../../../public/assets/fonts/OpenSans-Bold.ttf", weight: "700" },
  ],
  variable: "--font-opensans",
});

const poppins = localFont({
  src: [
    { path: "../../../public/assets/fonts/Poppins-Regular.ttf", weight: "400" },
    { path: "../../../public/assets/fonts/Poppins-Medium.ttf", weight: "500" },
    { path: "../../../public/assets/fonts/Poppins-SemiBold.ttf", weight: "600" },
    { path: "../../../public/assets/fonts/Poppins-Bold.ttf", weight: "700" },
    { path: "../../../public/assets/fonts/Poppins-Black.ttf", weight: "900" },
  ],
  variable: "--font-poppins",
});

// The whole authenticated dashboard is per-user and behind the Firebase auth
// gate — never statically prerenderable, and middleware already requires a
// session cookie to reach these routes.
export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <AppBootstrap />
      <div
        className={`${openSans.variable} ${poppins.variable} flex min-h-screen flex-col font-[family-name:var(--font-opensans)]`}
      >
        <DashboardHeader />
        <div className="flex flex-1">
          <aside
            className="hidden w-64 shrink-0 overflow-y-auto bg-[rgba(25,25,25,1)] bg-[url('/assets/images/draw.png')] bg-cover p-4 md:block"
          >
            <DrawerLogo />
            <SidebarNav />
          </aside>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ReduxProvider>
  );
}

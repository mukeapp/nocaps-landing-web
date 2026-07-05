"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import Icons from "@/components/global/icons";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { DrawerLogo } from "@/components/dashboard/drawer-logo";
import { UserMenu } from "@/components/global/user-menu";

export function DashboardHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-lg md:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 overflow-y-auto bg-[rgba(25,25,25,1)] bg-[url('/assets/images/draw.png')] bg-cover p-4"
        >
          <DrawerLogo />
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <Link href="/" className="flex items-center gap-2 md:hidden">
        <Icons.logo className="h-6 w-6" />
        <span className="font-medium">NoCaps</span>
      </Link>

      <div className="ml-auto flex items-center gap-3">
        <UserMenu />
      </div>
    </header>
  );
}

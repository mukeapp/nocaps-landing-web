"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DASHBOARD_NAV, LOGOUT_ICON as LogOut } from "@/components/dashboard/nav-config";
import { useAppDispatch } from "@/redux/hooks";
import { UserDataAction } from "@/redux/user-data";
import { setUserRevenuCatLogOut } from "@/redux/user-revenue-cat";
import { signOutOfFirebase } from "@/lib/auth/sign-out";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mirrors mobile's CustomDrawerContent exactly: flat list, no active/selected
// highlight (mobile has none), muted item color (Colors.text_color =
// rgba(242,242,242,0.5)), thin per-item divider (Colors.borderline).
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col">
      {DASHBOARD_NAV.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={onNavigate}
          className="flex items-center gap-3 border-b border-white/[0.04] py-3 text-[15px] text-white/50 transition-colors hover:text-white/80"
        >
          {item.image ? (
            <Image src={item.image} alt="" width={22} height={22} className="shrink-0 opacity-50" />
          ) : item.icon ? (
            <item.icon className="h-[22px] w-[22px] shrink-0" />
          ) : null}
          {item.label}
        </Link>
      ))}
      <LogoutRow />
      <p className="mt-8 pb-2 text-center text-xs text-white/50">NoCaps v0.1.0</p>
    </nav>
  );
}

function LogoutRow() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await signOutOfFirebase();
    dispatch(UserDataAction.setUserLogout());
    dispatch(setUserRevenuCatLogOut());
    router.push("/");
    router.refresh();
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className="flex items-center gap-3 border-b border-white/[0.04] py-3 text-[15px] text-white/50 transition-colors hover:text-white/80">
          <LogOut className="h-[22px] w-[22px] shrink-0" />
          Logout
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Log out?</AlertDialogTitle>
          <AlertDialogDescription>You&apos;ll need to sign in again to access your account.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>Log out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

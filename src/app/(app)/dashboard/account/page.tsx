"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Copy, Plus } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/user-data";
import { selectRevenueCat } from "@/redux/user-revenue-cat";
import { selectCreditPresets } from "@/redux/credit-presets";
import { selectSubscriptionPlans } from "@/redux/subscription-plan";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import {
  DestroyAccountByUserId,
  PurgeHabitStacksByUserId,
  PurgeNoCapPostsByUserId,
} from "@/lib/api/section-b/revenue-cat";
import { signOutOfFirebase } from "@/lib/auth/sign-out";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/dashboard/checkout-button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-white/40">{children}</p>
  );
}

/**
 * Mirrors mobile's AccountScreen (app/src/screens/section-b/section-b-5/
 * AccountScreen) section-for-section: profile card with Edit Profile link,
 * Profile Info (NoCap UserId + copy), NoCap Credits (REMAINING/MONTHLY card
 * with a red Add Credits button opening the credit-presets sheet),
 * Subscription (CURRENT PLAN), and the Danger Zone. Purchases run on the
 * Stripe scaffold since RevenueCat store billing has no web equivalent.
 */
export default function AccountPage() {
  const router = useRouter();
  const userId = useCurrentUserId();
  const { userdata } = useAppSelector(selectUser);
  const user = (userdata as any)?.collectdata ?? userdata ?? {};
  const revenueCat = useAppSelector(selectRevenueCat);
  const creditPresets = useAppSelector(selectCreditPresets);
  const plans = useAppSelector(selectSubscriptionPlans);
  const [copied, setCopied] = useState(false);

  const currentPlan = plans.find((plan) => plan.id === revenueCat.planId);
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || user?.fullName || "Your account";

  function copyUserId() {
    if (!userId) return;
    navigator.clipboard.writeText(userId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  async function handlePurgeHabitStacks() {
    if (!userId) return;
    const res = await PurgeHabitStacksByUserId({ userId });
    res.status >= 200 && res.status < 300
      ? toast.success("All habit stacks purged.")
      : toast.error("Unable to purge habit stacks.");
  }

  async function handleDeletePosts() {
    if (!userId) return;
    const res = await PurgeNoCapPostsByUserId({ userId });
    res.status >= 200 && res.status < 300
      ? toast.success("All posts deleted.")
      : toast.error("Unable to delete posts.");
  }

  async function handleDeleteAccount() {
    if (!userId) return;
    const res = await DestroyAccountByUserId({ userId });
    if (res.status >= 200 && res.status < 300) {
      toast.success("Account deleted.");
      await signOutOfFirebase();
      router.push("/");
      router.refresh();
    } else {
      toast.error("Unable to delete account.");
    }
  }

  return (
    <div className="mx-auto max-w-xl pb-10">
      <h1 className="text-[20px] font-bold text-white">Account</h1>

      {/* Profile card */}
      <div className="mt-4 flex items-center gap-4 rounded-2xl bg-[rgba(25,25,25,1)] p-4">
        <Image
          src={user?.photo || "/assets/images/default-avatar.png"}
          alt=""
          width={56}
          height={56}
          className="h-14 w-14 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-semibold text-white">{fullName}</p>
          <p className="truncate text-[13px] text-white/50">
            @{(user?.username ?? "").replace(/^@/, "")}
          </p>
        </div>
        <Link
          href="/dashboard/profile/edit"
          className="shrink-0 text-[13px] font-semibold text-[rgba(45,156,219,1)] hover:underline"
        >
          Edit Profile →
        </Link>
      </div>

      {/* Profile Info */}
      <SectionLabel>Profile Info</SectionLabel>
      <div className="rounded-2xl bg-[rgba(25,25,25,1)] p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-white/40">NoCap UserId</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="truncate font-mono text-[13px] text-white/80">{userId || "—"}</p>
          <button onClick={copyUserId} className="shrink-0 rounded-full bg-white/5 p-2 text-white/60 hover:text-white">
            {copied ? <Check className="h-3.5 w-3.5 text-[#22c55e]" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
        <Link
          href="/dashboard/profile"
          className="mt-3 inline-block text-[13px] font-semibold text-[rgba(45,156,219,1)] hover:underline"
        >
          Go to Profile Page →
        </Link>
      </div>

      {/* NoCap Credits */}
      <SectionLabel>NoCap Credits</SectionLabel>
      <div className="rounded-2xl bg-[rgba(25,25,25,1)] p-4">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wide text-white/40">Remaining</p>
            <p className="text-[24px] font-bold text-[#f1f5f9]">
              {revenueCat.remainingCredits.toLocaleString()}
            </p>
          </div>
          <div className="h-9 w-px bg-[#374151]" />
          <div className="flex-1 pl-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-white/40">Monthly</p>
            <p className="text-[20px] font-bold text-[#94a3b8]">
              {revenueCat.monthlyCredits.toLocaleString()}
            </p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[rgba(235,87,87,1)] px-3.5 py-2 text-[13px] font-semibold text-white hover:opacity-90">
                <Plus className="h-3.5 w-3.5" />
                Add Credits
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-[#2C2C2E]">
              <SheetHeader>
                <SheetTitle className="text-white">Add Credits</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-2 pb-4">
                {creditPresets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3"
                  >
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: preset.color }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold text-white">{preset.name}</p>
                      <p className="truncate text-[12px] text-white/50">{preset.description}</p>
                    </div>
                    <CheckoutButton size="sm" variant="outline" request={{ kind: "credits", presetId: preset.id }}>
                      ${preset.cost}
                    </CheckoutButton>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Subscription */}
      <SectionLabel>Subscription</SectionLabel>
      <div className="rounded-2xl bg-[rgba(25,25,25,1)] p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-white/40">Current Plan</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="text-[18px] font-bold text-white">
            {currentPlan?.name ?? "Free"}
            <span className="ml-2 text-[13px] font-normal text-white/50">
              {revenueCat.billingType === "business" ? "Business" : "Personal"}
            </span>
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard/subscription">Change plan</Link>
          </Button>
        </div>
        {currentPlan ? <p className="mt-1 text-[12px] text-white/50">{currentPlan.tagline}</p> : null}
      </div>

      {/* Danger Zone */}
      <SectionLabel>Danger Zone</SectionLabel>
      <div className="space-y-2">
        <DangerItem
          label="Purge All HabitStacks"
          description="Deletes every habit stack, habit, link and item you own."
          onConfirm={handlePurgeHabitStacks}
        />
        <DangerItem
          label="Delete All Posts"
          description="Deletes every NoCap post you've published."
          onConfirm={handleDeletePosts}
        />
        <DangerItem
          label="Delete Account"
          description="Permanently deletes your NoCap account and all associated data."
          onConfirm={handleDeleteAccount}
        />
      </div>
    </div>
  );
}

function DangerItem({
  label,
  description,
  onConfirm,
}: {
  label: string;
  description: string;
  onConfirm: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[rgba(235,87,87,0.3)] bg-[rgba(25,25,25,1)] px-4 py-3">
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-white">{label}</p>
        <p className="text-[12px] text-white/50">{description}</p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" className="shrink-0">
            {label.split(" ")[0]}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{label}?</AlertDialogTitle>
            <AlertDialogDescription>{description} This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

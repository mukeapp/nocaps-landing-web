"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/user-data";
import { selectRevenueCat } from "@/redux/user-revenue-cat";
import { selectCreditPresets } from "@/redux/credit-presets";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import {
  DestroyAccountByUserId,
  PurgeHabitStacksByUserId,
  PurgeNoCapPostsByUserId,
} from "@/lib/api/section-b/revenue-cat";
import { signOutOfFirebase } from "@/lib/auth/sign-out";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/dashboard/checkout-button";
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

export default function AccountPage() {
  const router = useRouter();
  const userId = useCurrentUserId();
  const { userdata } = useAppSelector(selectUser);
  const revenueCat = useAppSelector(selectRevenueCat);
  const creditPresets = useAppSelector(selectCreditPresets);

  const creditPercent =
    revenueCat.monthlyCredits > 0 ? Math.round((revenueCat.remainingCredits / revenueCat.monthlyCredits) * 100) : 0;

  async function handlePurgeHabitStacks() {
    if (!userId) return;
    const res = await PurgeHabitStacksByUserId({ userId });
    if (res.status >= 200 && res.status < 300) {
      toast.success("All habit stacks purged.");
    } else {
      toast.error("Unable to purge habit stacks.");
    }
  }

  async function handleDeletePosts() {
    if (!userId) return;
    const res = await PurgeNoCapPostsByUserId({ userId });
    if (res.status >= 200 && res.status < 300) {
      toast.success("All posts deleted.");
    } else {
      toast.error("Unable to delete posts.");
    }
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
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="text-sm text-muted-foreground">Your profile, credits and account settings.</p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4 pt-6">
          <Avatar className="h-14 w-14">
            <AvatarImage src={userdata?.photo} alt={userdata?.fullName ?? "Profile"} />
            <AvatarFallback>{(userdata?.firstName?.[0] ?? "?").toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{userdata?.fullName || userdata?.username || "Your account"}</p>
            <p className="text-sm text-muted-foreground">{userdata?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>NoCap Credits</CardTitle>
          <CardDescription>
            {revenueCat.remainingCredits.toLocaleString()} of {revenueCat.monthlyCredits.toLocaleString()} credits
            remaining this month
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={creditPercent} />
          <div>
            <p className="mb-2 text-sm font-medium">Add credits</p>
            <div className="flex flex-wrap gap-2">
              {creditPresets.map((preset) => (
                <CheckoutButton key={preset.id} variant="outline" size="sm" request={{ kind: "credits", presetId: preset.id }}>
                  {preset.name} — ${preset.cost}
                </CheckoutButton>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>These actions are permanent and can&apos;t be undone.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ConfirmDangerRow
            label="Purge all habit stacks"
            description="Deletes every habit stack, habit, link and item you own."
            onConfirm={handlePurgeHabitStacks}
          />
          <ConfirmDangerRow
            label="Delete all posts"
            description="Deletes every NoCap post you've published."
            onConfirm={handleDeletePosts}
          />
          <ConfirmDangerRow
            label="Delete account"
            description="Permanently deletes your NoCap account and all associated data."
            onConfirm={handleDeleteAccount}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ConfirmDangerRow({
  label,
  description,
  onConfirm,
}: {
  label: string;
  description: string;
  onConfirm: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            {label}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
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

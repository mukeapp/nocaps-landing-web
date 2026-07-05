"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "@/lib/firebase/client";
import { SaveUserInFirestore } from "@/lib/api/section-a/user";
import { buildUserFromTempAndAuth } from "@/lib/utils/build-user";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * Reached when Firebase auth succeeded but the backend has no profile yet
 * (GetUserByEmail 404) — mirrors mobile's TermService/accept-terms onboarding step.
 */
export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) router.replace("/sign-in");
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    if (!firstName || !lastName || !userName) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!acceptedTerms) {
      toast.error("Please accept our Terms of Service & Privacy Policy.");
      return;
    }

    setLoading(true);
    try {
      const loggedUser = buildUserFromTempAndAuth(
        { first: firstName, last: lastName, username: userName },
        { uid: user.uid, email: user.email },
      );
      const idToken = await user.getIdToken();
      await SaveUserInFirestore({ loggedUser, token: idToken });
      router.push("/dashboard/habit-stacks");
      router.refresh();
    } catch {
      toast.error("Unable to complete setup. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <AuthCard title="Complete your profile" subtitle="Just a few more details">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="userName">Username</Label>
          <Input id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} required />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="acceptedTerms"
            checked={acceptedTerms}
            onCheckedChange={(v) => setAcceptedTerms(v === true)}
          />
          <Label htmlFor="acceptedTerms" className="text-sm font-normal text-muted-foreground">
            I accept the Terms of Service & Privacy Policy
          </Label>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Continue"}
        </Button>
      </form>
    </AuthCard>
  );
}

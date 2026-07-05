"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  User,
} from "firebase/auth";
import { toast } from "sonner";
import { auth } from "@/lib/firebase/client";
import { establishSession } from "@/lib/auth/session";
import { SaveUserInFirestore, GetUserByEmail } from "@/lib/api/section-a/user";
import { buildUserFromTempAndAuth } from "@/lib/utils/build-user";
import { isStrongPassword, isValidEmail } from "@/lib/utils/validation";
import { AuthCard } from "@/components/auth/auth-card";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function createBackendProfile(
  user: User,
  temp: { first: string; last: string; username: string },
) {
  const idToken = await user.getIdToken();
  const loggedUser = buildUserFromTempAndAuth(
    { ...temp, fullName: user.displayName ?? undefined, photoUrl: user.photoURL ?? undefined },
    { uid: user.uid, email: user.email },
  );
  await SaveUserInFirestore({ loggedUser, token: idToken });
}

export function SignUpForm() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailSignUp(e: React.FormEvent) {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const uname = userName.trim().toLowerCase();

    if (!firstName || !lastName || !uname || !normalizedEmail || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }
    if (!isValidEmail(normalizedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!isStrongPassword(password)) {
      toast.error(
        "Password must be at least 8 characters and include a capital letter, a number, and a special character.",
      );
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);

      try {
        await sendEmailVerification(cred.user);
      } catch {
        // non-fatal, mirrors mobile
      }

      await establishSession(await cred.user.getIdToken());
      await createBackendProfile(cred.user, { first: firstName, last: lastName, username: uname });

      toast.success("Account created. Check your inbox to verify your email.");
      router.push("/dashboard/habit-stacks");
      router.refresh();
    } catch (err: any) {
      if (err?.code === "auth/email-already-in-use") {
        toast.error("This email is already registered. Please log in instead.");
      } else {
        toast.error(err?.message ?? "Unable to sign up. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      const idToken = await cred.user.getIdToken();
      await establishSession(idToken);

      try {
        await GetUserByEmail({ mail: cred.user.email ?? "" });
        router.push("/dashboard/habit-stacks");
        router.refresh();
      } catch (err: any) {
        if (err?.status === 404) {
          const [first, ...rest] = (cred.user.displayName ?? "").split(" ");
          await createBackendProfile(cred.user, {
            first: first || "",
            last: rest.join(" ") || "",
            username: (cred.user.email ?? "").split("@")[0],
          });
          router.push("/dashboard/habit-stacks");
          router.refresh();
        } else {
          toast.error("Unable to load your profile. Please try again.");
        }
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start tracking with NoCap"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleEmailSignUp} className="space-y-4">
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
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </Button>
      </form>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      <GoogleButton onClick={handleGoogleSignUp} disabled={loading} />
    </AuthCard>
  );
}

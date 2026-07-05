"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from "firebase/auth";
import { toast } from "sonner";
import { auth } from "@/lib/firebase/client";
import { establishSession } from "@/lib/auth/session";
import { GetUserByEmail } from "@/lib/api/section-a/user";
import { isValidEmail } from "@/lib/utils/validation";
import { AuthCard } from "@/components/auth/auth-card";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard/habit-stacks";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function afterFirebaseSignIn(user: User) {
    const idToken = await user.getIdToken();

    try {
      await establishSession(idToken);
      await GetUserByEmail({ mail: user.email ?? email });
      router.push(redirectTo);
      router.refresh();
    } catch (err: any) {
      if (err?.status === 404) {
        router.push("/onboarding");
      } else {
        toast.error(err?.message ?? "Unable to load your profile. Please try again.");
      }
    }
  }

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      toast.error("All fields are required.");
      return;
    }
    if (!isValidEmail(normalizedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      if (!cred.user.emailVerified) {
        await sendEmailVerification(cred.user);
        toast.error("Please verify your email address to continue.");
        return;
      }
      await afterFirebaseSignIn(cred.user);
    } catch {
      toast.error("User not found or wrong credentials.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      await afterFirebaseSignIn(cred.user);
    } catch {
      toast.error("Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your NoCap account"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleEmailSignIn} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/reset-password" className="text-xs text-muted-foreground hover:text-primary">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
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
      <GoogleButton onClick={handleGoogleSignIn} disabled={loading} />
    </AuthCard>
  );
}

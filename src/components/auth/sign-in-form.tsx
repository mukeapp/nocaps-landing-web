"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from "firebase/auth";
import { Circle, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/lib/firebase/client";
import { establishSession } from "@/lib/auth/session";
import { GetUserByEmail } from "@/lib/api/section-a/user";
import { isValidEmail } from "@/lib/utils/validation";
import { AuthInput, AuthButton } from "@/components/auth/auth-input";

/**
 * Mirrors mobile's SigninScreen (app/src/screens/section-a/section-a-1/
 * Signing/SigninScreen.tsx) layout exactly: logo row, "Let's Sign You In",
 * subtitle, email/password rows, Remember me dot + Forgot Password?, white
 * Sign In pill, Sign Up line, "or" divider image, dark Google button,
 * version footer. Reference: that folder's ux-ui/sign-in-screen.png.
 */
export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard/habit-stacks";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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
    <div className="flex min-h-[calc(100vh-3rem)] w-full flex-col justify-center">
      {/* Logo row */}
      <div className="mb-10 flex items-center">
        <Image src="/assets/images/logo.png" alt="" width={23} height={23} className="mr-2" />
        <span className="text-[16px] font-semibold tracking-wider text-[#F2F2F2]">NoCaps</span>
      </div>

      <h1 className="text-[20px] font-bold text-[#F2F2F2]">Let&apos;s Sign You In</h1>
      <p className="mb-10 mt-1 text-[12px] text-[rgba(242,242,242,0.5)]">
        Welcome back, you&apos;ve been missed!
      </p>

      <form onSubmit={handleEmailSignIn}>
        <AuthInput
          icon={Mail}
          type="email"
          placeholder="Enter Email Address"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <AuthInput
          icon={Lock}
          placeholder="Enter Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          withPasswordToggle
        />

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setRememberMe((v) => !v)}
            className="flex items-center"
          >
            <Circle
              className="h-[22px] w-[22px]"
              style={{
                fill: rememberMe ? "#F2F2F2" : "rgba(25,25,25,1)",
                color: rememberMe ? "#F2F2F2" : "rgba(25,25,25,1)",
              }}
            />
            <span className="ml-1.5 text-[14px] font-semibold text-[rgba(242,242,242,0.5)]">
              Remember me
            </span>
          </button>
          <Link href="/reset-password" className="text-[14px] font-semibold text-[#F2F2F2]">
            Forgot Password?
          </Link>
        </div>

        <div className="mt-12 mb-6">
          <AuthButton type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </AuthButton>
        </div>
      </form>

      <p className="text-center text-[11px] text-[rgba(242,242,242,0.5)]">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-[12px] font-bold text-[#F2F2F2]">
          Sign Up
        </Link>
      </p>

      {/* "or" divider — mobile's Images.or graphic, tinted white */}
      <div className="my-4 flex justify-center">
        <Image
          src="/assets/images/or.png"
          alt="or"
          width={320}
          height={34}
          className="h-8 w-4/5 object-contain brightness-0 invert"
        />
      </div>

      {/* Google button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="flex h-[50px] w-full items-center justify-center rounded-lg border border-[#3A3A3A] bg-[rgba(25,25,25,1)] disabled:opacity-60"
      >
        <Image src="/assets/images/google.png" alt="" width={31} height={31} className="mr-3" />
        <span className="text-[16px] font-semibold text-[#F2F2F2]">Continue with Google</span>
      </button>

      <p className="mt-auto pb-4 pt-8 text-center text-[12px] text-[rgba(242,242,242,0.5)] opacity-50">
        NoCaps v0.1.0
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { ArrowLeft, CircleUserRound, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/lib/firebase/client";
import { establishSession } from "@/lib/auth/session";
import { SaveUserInFirestore } from "@/lib/api/section-a/user";
import { buildUserFromTempAndAuth } from "@/lib/utils/build-user";
import { isStrongPassword, isValidEmail } from "@/lib/utils/validation";
import { AuthInput, AuthButton } from "@/components/auth/auth-input";

/**
 * Mirrors mobile's SignUpScreen (app/src/screens/section-a/section-a-1/
 * SignUp/index.tsx) exactly: white circular back button, "Create an account",
 * six icon inputs (First/Last/Username with person icon, Email with mail,
 * Password + Confirm with lock and eye toggles), white Sign Up pill, then the
 * terms confirmation line with bold links. Mobile's sign-up has NO Google
 * button (Google flows through the sign-in screen). Reference:
 * SignUp/ux-ui/sign-up-screen.png.
 */
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
      const loggedUser = buildUserFromTempAndAuth(
        { first: firstName.trim(), last: lastName.trim(), username: uname },
        { uid: cred.user.uid, email: cred.user.email },
      );
      await SaveUserInFirestore({ loggedUser, token: await cred.user.getIdToken() });

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

  return (
    <div className="w-full pb-8">
      {/* Back button — white circle, black arrow */}
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F2F2]"
      >
        <ArrowLeft className="h-5 w-5 text-[rgba(28,28,28,1)]" />
      </button>

      <h1 className="mb-10 text-[20px] font-bold text-[#F2F2F2]">Create an account</h1>

      <form onSubmit={handleEmailSignUp}>
        <AuthInput icon={CircleUserRound} placeholder="First Name" value={firstName} onChange={setFirstName} />
        <AuthInput icon={CircleUserRound} placeholder="Last Name" value={lastName} onChange={setLastName} />
        <AuthInput icon={CircleUserRound} placeholder="Username" value={userName} onChange={setUserName} />
        <AuthInput
          icon={Mail}
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <AuthInput
          icon={Lock}
          placeholder="Password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          withPasswordToggle
        />
        <AuthInput
          icon={Lock}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          withPasswordToggle
        />

        <div className="mb-6 mt-6">
          <AuthButton type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </AuthButton>
        </div>
      </form>

      <p className="text-center text-[11px] text-[rgba(242,242,242,0.5)]">
        By registering, you confirm that you accept our
      </p>
      <p className="mt-1 text-center text-[11px] text-[rgba(242,242,242,0.5)]">
        <Link
          href="https://www.donocap.com/terms-and-conditions"
          target="_blank"
          className="text-[12px] font-bold text-[#F2F2F2]"
        >
          Terms of service
        </Link>{" "}
        and{" "}
        <Link
          href="https://www.donocap.com/privacy-policy"
          target="_blank"
          className="text-[12px] font-bold text-[#F2F2F2]"
        >
          Privacy policy
        </Link>
      </p>
    </div>
  );
}

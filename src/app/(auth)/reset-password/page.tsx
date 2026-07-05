"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import { ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/lib/firebase/client";
import { isValidEmail } from "@/lib/utils/validation";
import { AuthInput, AuthButton } from "@/components/auth/auth-input";

/**
 * Mirrors mobile's RecoverPassword screen exactly: white circular back
 * button, "Password Recovery" title, subtitle, email input row, white
 * "Send Email" pill. Reference: RecoverPassword/ux-ui/recover-password.png.
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, normalizedEmail);
      toast.success("Password reset email sent. Please check your inbox.");
      router.push("/sign-in");
    } catch (err: any) {
      if (err?.code === "auth/user-not-found") {
        toast.error("Email not found.");
      } else {
        toast.error("Unable to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F2F2]"
      >
        <ArrowLeft className="h-5 w-5 text-[rgba(28,28,28,1)]" />
      </button>

      <h1 className="text-[20px] font-bold text-[#F2F2F2]">Password Recovery</h1>
      <p className="mb-10 mt-1 text-[12px] text-[rgba(242,242,242,0.5)]">
        Please enter your email address to recover
      </p>

      <form onSubmit={handleSubmit}>
        <AuthInput
          icon={Mail}
          type="email"
          placeholder="Enter Email Address"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <div className="mt-6">
          <AuthButton type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Email"}
          </AuthButton>
        </div>
      </form>
    </div>
  );
}

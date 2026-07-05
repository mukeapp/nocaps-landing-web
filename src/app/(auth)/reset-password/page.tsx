"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "@/lib/firebase/client";
import { isValidEmail } from "@/lib/utils/validation";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

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
      setSent(true);
      toast.success("Password reset email sent. Please check your inbox.");
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
    <AuthCard
      title="Reset your password"
      subtitle="We'll email you a link to reset it"
      footer={
        <Link href="/sign-in" className="text-primary underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <p className="text-sm text-muted-foreground">
          Check <span className="text-foreground">{email}</span> for a link to reset your password.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}

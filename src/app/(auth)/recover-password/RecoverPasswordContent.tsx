"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/core/firebase";
import { ArrowLeft, Loader2, Mail, Globe, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function RecoverPasswordContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!EMAIL_RE.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await auth.sendPasswordResetEmail(normalizedEmail);
      setSent(true);
    } catch (err: any) {
      if (err?.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else {
        setError("Unable to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [email]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      {/* Background grid pattern */}
      <div className="absolute inset-0 dark:bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md relative border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1 text-center pb-2">
          {/* Back button */}
          <div className="absolute top-4 left-4">
            <button
              onClick={() => router.push("/login")}
              className="w-9 h-9 rounded-full bg-accent/50 hover:bg-accent flex items-center justify-center transition-colors"
              aria-label="Back to login"
            >
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4 mt-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">NoCaps</span>
          </div>

          {sent ? (
            <>
              <div className="mx-auto w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                <CheckCircle className="w-7 h-7 text-green-400" />
              </div>
              <CardTitle className="text-2xl font-semibold">Check Your Inbox</CardTitle>
              <CardDescription className="text-muted-foreground">
                We&apos;ve sent a password reset link to{" "}
                <span className="text-foreground font-medium">{email}</span>
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle className="text-2xl font-semibold">Password Recovery</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your email address and we&apos;ll send you a reset link
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent>
          {sent ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
                If an account exists with that email, you&apos;ll receive a password reset link shortly.
              </div>
              <Button
                className="w-full h-11 text-base font-medium"
                onClick={() => router.push("/login")}
              >
                Back to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 h-11"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}
        </CardContent>

        {!sent && (
          <CardFooter className="justify-center pb-6">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Back to Sign In
              </Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

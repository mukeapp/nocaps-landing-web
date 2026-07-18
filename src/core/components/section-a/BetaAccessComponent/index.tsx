"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckWebBetaAccess } from "@/core/api/section-a/web-beta-access";
import {
  selectWebBetaAccess,
  setWebBetaAccess,
} from "@/core/redux/web-beta-access";
import { ArrowLeft, Globe, Loader2, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

type Props = {
  children: React.ReactNode;
};

/**
 * Gates the auth UI behind web beta access. Until the visitor proves their
 * personal email has beta access, the wrapped login/sign-up UI stays hidden and
 * only the beta-access request form is shown. Once access is granted the value
 * is stored in redux (`webBetaAccess`) and the children render.
 */
export default function BetaAccessComponent({ children }: Props) {
  const dispatch = useDispatch();
  const hasBetaAccess = useSelector(selectWebBetaAccess);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckAccess = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      const normalizedEmail = email.trim().toLowerCase();

      if (!EMAIL_RE.test(normalizedEmail)) {
        setError("Please enter a valid email address.");
        return;
      }

      setLoading(true);
      try {
        const res = await CheckWebBetaAccess({ personalEmail: normalizedEmail });
        if (res?.data?.hasAccess === true) {
          dispatch(setWebBetaAccess(true));
        } else {
          setError(
            "This email doesn't have beta access yet. Please request access or try a different email.",
          );
        }
      } catch {
        setError("Unable to verify beta access right now. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [email, dispatch],
  );

  // Access granted → reveal the wrapped login / sign-up UI.
  if (hasBetaAccess) {
    return <>{children}</>;
  }

  // No access yet → hide the auth UI completely, show the beta-access gate.
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      {/* Background grid pattern */}
      <div className="absolute inset-0 dark:bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md relative border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1 text-center pb-2">
          {/* Back button to home */}
          <div className="absolute top-4 left-4">
            <Link
              href="/"
              className="w-9 h-9 rounded-full bg-accent/50 hover:bg-accent flex items-center justify-center transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">NoCaps</span>
          </div>
          <CardTitle className="text-2xl font-semibold">Beta Access</CardTitle>
          <CardDescription className="text-muted-foreground">
            NoCaps is in private beta. Enter the email you signed up with to
            unlock access.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleCheckAccess} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="beta-email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="beta-email"
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
                  Checking Access...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Check Beta Access
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

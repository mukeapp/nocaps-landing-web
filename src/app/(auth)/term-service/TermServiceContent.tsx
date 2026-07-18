"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SaveUserInFirestore } from "@/core/api/section-a/user";
import { UserDataAction } from "@/core/redux/user-data";
import { useDispatch, useSelector } from "react-redux";
import { Check, Globe, Loader2, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

export default function TermServiceContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tempdata = useSelector((state: any) => state?.user?.tempdata);

  const authParams = useMemo(() => ({
    uid: searchParams.get("uid") || "",
    email: searchParams.get("email") || "",
    accessToken: searchParams.get("accessToken") || "",
    refreshToken: searchParams.get("refreshToken") || "",
  }), [searchParams]);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [wantsNews, setWantsNews] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = useCallback(async () => {
    setError("");

    if (!acceptedTerms) {
      setError("Please accept the Terms of Service & Privacy Policy to continue.");
      return;
    }

    if (!tempdata?.first || !tempdata?.last || !tempdata?.username) {
      setError("Missing profile info. Please sign up again.");
      return;
    }

    if (!authParams.uid || !authParams.accessToken || !authParams.refreshToken) {
      setError("Missing auth data. Please sign in again.");
      return;
    }

    setLoading(true);
    try {
      const { buildUserFromTempAndAuth } = await import("@/core/utils");
      const loggedUser = buildUserFromTempAndAuth(
        {
          first: tempdata.first,
          last: tempdata.last,
          username: tempdata.username,
        },
        { uid: authParams.uid, email: authParams.email }
      );

      const res = await SaveUserInFirestore({
        loggedUser,
        token: authParams.accessToken,
      });

      const collectdata = res?.data;

      dispatch(
        UserDataAction.setUserData({
          idToken: authParams.refreshToken,
          accessToken: authParams.accessToken,
          collectdata,
        })
      );

      document.cookie = "nocap_session=1; path=/; max-age=31536000; samesite=lax";
      router.push("/dashboard");
    } catch (err) {
      setError("Unable to complete setup. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [acceptedTerms, tempdata, authParams, dispatch, router]);

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

          {/* Lock icon */}
          <div className="mx-auto w-14 h-14 rounded-full bg-foreground/10 flex items-center justify-center mb-2">
            <Lock className="w-6 h-6 text-foreground" />
          </div>

          <CardTitle className="text-2xl font-semibold">Terms of Service</CardTitle>
          <CardDescription className="text-muted-foreground">
            Please review and accept our terms to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Required: Terms & Privacy */}
          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              acceptedTerms
                ? "bg-primary border-primary"
                : "border-border group-hover:border-muted-foreground"
            }`}>
              {acceptedTerms && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
            </div>
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="hidden"
            />
            <div className="text-sm text-muted-foreground leading-relaxed">
              I agree with NoCap&apos;s{" "}
              <Link href="/terms-and-conditions" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Terms of Service
              </Link>{" "}and{" "}
              <Link href="/privacy-policy" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Privacy Policy
              </Link>{" "}
              <span className="text-foreground/60">(Required)</span>
            </div>
          </label>

          {/* Optional: Newsletter */}
          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              wantsNews
                ? "bg-primary border-primary"
                : "border-border group-hover:border-muted-foreground"
            }`}>
              {wantsNews && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
            </div>
            <input
              type="checkbox"
              checked={wantsNews}
              onChange={(e) => setWantsNews(e.target.checked)}
              className="hidden"
            />
            <span className="text-sm text-muted-foreground leading-relaxed">
              Send me news from NoCap and its partners
            </span>
          </label>

          <Button
            className="w-full h-11 text-base font-medium"
            onClick={handleContinue}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Setting up...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

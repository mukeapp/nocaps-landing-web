"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/core/firebase";
import { GetUserByEmail } from "@/core/api/section-a/user";
import { UserDataAction } from "@/core/redux/user-data";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Loader2, Mail, Lock, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function LoginPageContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const savedEmail = useSelector((state: any) => state?.user?.email ?? "");

  const [email, setEmail] = useState(savedEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(!!savedEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignIn = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("All fields are required.");
      return;
    }
    if (!EMAIL_RE.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const userCred: any = await auth.signInWithEmailAndPassword(normalizedEmail, password);

      if (userCred?.user?.emailVerified !== true) {
        await userCred.user.sendEmailVerification();
        setError("Please verify your email address to continue.");
        setLoading(false);
        return;
      }

      const refreshToken = userCred.user.refreshToken;
      const accessToken = await userCred.user.getIdToken();

      try {
        const res = await GetUserByEmail({ mail: normalizedEmail });
        const collectdata = res?.data;

        dispatch(UserDataAction.setUserData({ idToken: refreshToken, accessToken, collectdata }));
        dispatch(UserDataAction.setUserAuth(accessToken));

        if (rememberMe) {
          dispatch(UserDataAction.setUserEmail(normalizedEmail));
        }

        router.push("/dashboard");
      } catch (apiErr: any) {
        if (apiErr?.data?.error === "Not Found") {
          router.push(`/term-service?uid=${userCred.user.uid}&email=${normalizedEmail}&refreshToken=${refreshToken}&accessToken=${accessToken}`);
        } else {
          setError("Unable to fetch user profile.");
        }
      }
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [email, password, rememberMe, dispatch, router]);

  const handleGoogleSignIn = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const refreshToken = user.refreshToken;
      const accessToken = await user.getIdToken();
      const email = user.email || "";

      dispatch(
        UserDataAction.setTempData({
          first: user.displayName?.split(" ")[0] || "",
          last: user.displayName?.split(" ").slice(1).join(" ") || "",
          username: email.split("@")[0] || "",
          fullName: user.displayName || "",
          email,
          photoUrl: user.photoURL || "",
        })
      );

      try {
        const res = await GetUserByEmail({ mail: email });
        const collectdata = res?.data;

        dispatch(UserDataAction.setUserData({ idToken: refreshToken, accessToken, collectdata }));
        dispatch(UserDataAction.setUserAuth(accessToken));

        if (rememberMe && email) {
          dispatch(UserDataAction.setUserEmail(email));
        }

        router.push("/dashboard");
      } catch (apiErr: any) {
        if (apiErr?.data?.error === "Not Found") {
          router.push(`/term-service?uid=${user.uid}&email=${email}&refreshToken=${refreshToken}&accessToken=${accessToken}`);
        } else {
          setError("Unable to fetch user profile.");
        }
      }
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [rememberMe, dispatch, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      {/* Background grid pattern */}
      <div className="absolute inset-0 dark:bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md relative border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1 text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">NoCaps</span>
          </div>
          <CardTitle className="text-2xl font-semibold">Let&apos;s Sign You In</CardTitle>
          <CardDescription className="text-muted-foreground">
            Welcome back, you&apos;ve been missed!
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleEmailSignIn} className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary/50 h-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border bg-background accent-primary"
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link
                href="/recover-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 text-base border-border/50 hover:bg-accent/50"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>
        </CardContent>

        <CardFooter className="justify-center pb-6">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

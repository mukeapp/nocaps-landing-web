"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { Lock, Square, SquareCheck } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/lib/firebase/client";
import { SaveUserInFirestore } from "@/lib/api/section-a/user";
import { buildUserFromTempAndAuth } from "@/lib/utils/build-user";
import { AuthButton } from "@/components/auth/auth-input";

/**
 * Mirrors mobile's TermService screen (app/src/screens/section-a/section-a-1/
 * TermService): centered "NoCap" title + logo on the dark background, then a
 * white card with a black lock badge, "Terms of Service" title, the required
 * agreement checkbox with purple underlined links, the newsletter checkbox,
 * and a dark ~40%-width Continue pill. Reached when Firebase auth succeeded
 * but the backend has no profile yet (GetUserByEmail 404). Reference:
 * TermService/ux-ui/term_service.png.
 */
export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [wantsNews, setWantsNews] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u === null) router.replace("/sign-in");
    });
  }, [router]);

  async function handleContinue() {
    if (!user) return;
    if (!acceptedTerms) {
      toast.error("Please check our Terms of Service & Privacy Policy.");
      return;
    }

    // Mobile builds the profile from tempdata (Google displayName / sign-up
    // names); here the Firebase user carries them.
    const [first, ...rest] = (user.displayName ?? "").split(" ");
    const username = (user.email ?? "").split("@")[0] || first.toLowerCase();

    setLoading(true);
    try {
      const loggedUser = buildUserFromTempAndAuth(
        {
          first: first || username,
          last: rest.join(" ") || "",
          username,
          fullName: user.displayName ?? undefined,
          photoUrl: user.photoURL ?? undefined,
        },
        { uid: user.uid, email: user.email },
      );
      const idToken = await user.getIdToken();
      await SaveUserInFirestore({ loggedUser, token: idToken });
      router.push("/dashboard/habit-stacks");
      router.refresh();
    } catch {
      toast.error("Unable to complete setup. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  const CheckIcon = ({ checked }: { checked: boolean }) =>
    checked ? (
      <SquareCheck className="h-5 w-5 shrink-0 text-[rgba(41,41,41,1)]" />
    ) : (
      <Square className="h-5 w-5 shrink-0 text-[rgba(41,41,41,1)]" />
    );

  return (
    <div className="flex w-full flex-col items-center">
      <h1 className="text-[20px] font-semibold text-[#F2F2F2]">NoCap</h1>
      <Image src="/assets/images/logo.png" alt="" width={70} height={70} className="mt-2" />

      <div className="mt-24 w-full rounded-lg bg-[#F2F2F2] px-5 py-4">
        {/* Lock badge */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(28,28,28,1)]">
          <Lock className="h-[23px] w-[23px] text-white" />
        </div>

        <p className="mb-4 text-center text-[18px] font-bold text-black">Terms of Service</p>

        {/* Required agreement */}
        <button
          type="button"
          onClick={() => setAcceptedTerms((v) => !v)}
          className="flex items-start gap-2 text-left"
        >
          <CheckIcon checked={acceptedTerms} />
          <span className="text-[12px] font-medium text-[rgba(28,28,28,1)]">
            I agree with Nocap&apos;s{" "}
            <Link
              href="https://www.donocap.com/terms-and-conditions"
              target="_blank"
              className="font-bold text-[#800080] underline"
              onClick={(e) => e.stopPropagation()}
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="https://www.donocap.com/privacy-policy"
              target="_blank"
              className="font-bold text-[#800080] underline"
              onClick={(e) => e.stopPropagation()}
            >
              Privacy Policy
            </Link>{" "}
            (Required)
          </span>
        </button>

        {/* Newsletter */}
        <button
          type="button"
          onClick={() => setWantsNews((v) => !v)}
          className="mt-2 flex items-start gap-2 text-left"
        >
          <CheckIcon checked={wantsNews} />
          <span className="text-[12px] font-medium text-[rgba(28,28,28,1)]">
            Send me news from NoCap and its partners
          </span>
        </button>

        <div className="mt-5">
          <AuthButton dark widthClass="w-[40%]" onClick={handleContinue} disabled={loading}>
            <span className="text-[14px]">{loading ? "..." : "Continue"}</span>
          </AuthButton>
        </div>
      </div>
    </div>
  );
}

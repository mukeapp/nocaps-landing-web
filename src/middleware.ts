import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, isPlausiblySignedIn } from "@/lib/auth/session-cookie";

export default function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!isPlausiblySignedIn(sessionCookie)) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

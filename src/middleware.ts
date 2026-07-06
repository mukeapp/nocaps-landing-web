import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const session = request.cookies.get("nocap_session");
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/dashboard") && !session) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/dashboard"],
};

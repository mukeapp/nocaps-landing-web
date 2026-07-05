import React from 'react'

// These pages depend on client-side Firebase auth state and search params —
// never statically prerenderable, and shouldn't be attempted at build time.
export const dynamic = "force-dynamic";

interface Props {
    children: React.ReactNode;
}

// Mirrors mobile's MainStyles.root: full dark #0D0D0D screen, content in a
// phone-width column (mobile is a phone screen; the web centers that column).
const AuthLayout = ({ children }: Props) => {
    return (
        <div className="flex min-h-screen justify-center bg-[#0D0D0D]">
            <div className="flex w-full max-w-md flex-col px-4 pt-12">
                {children}
            </div>
        </div>
    )
};

export default AuthLayout

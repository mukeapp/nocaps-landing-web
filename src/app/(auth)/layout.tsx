import React from 'react'

// These pages depend on client-side Firebase auth state and search params —
// never statically prerenderable, and shouldn't be attempted at build time.
export const dynamic = "force-dynamic";

interface Props {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
    return (
        <div className="flex items-center justify-center h-screen">
            {children}
        </div>
    )
};

export default AuthLayout

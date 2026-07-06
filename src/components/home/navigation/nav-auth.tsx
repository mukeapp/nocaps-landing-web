"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/core/firebase";

interface NavUser {
    name: string;
    email: string;
    photo: string | null;
    initial: string;
}

const clearSession = () => {
    document.cookie = "nocap_session=; path=/; max-age=0";
    try {
        for (const key of Object.keys(localStorage)) {
            if (key.startsWith("persist:")) localStorage.removeItem(key);
        }
    } catch {
        // storage unavailable — nothing to clean
    }
};

const NavAuth = () => {
    const [user, setUser] = useState<NavUser | null | undefined>(undefined);
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u: any) => {
            if (u) {
                const email = u.email ?? "";
                const name = u.displayName || email.split("@")[0] || "Account";
                setUser({
                    name,
                    email,
                    photo: u.photoURL ?? null,
                    initial: name.charAt(0).toUpperCase(),
                });
            } else {
                setUser(null);
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!open) return;
        const onClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const onEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onClickOutside);
        document.addEventListener("keydown", onEscape);
        return () => {
            document.removeEventListener("mousedown", onClickOutside);
            document.removeEventListener("keydown", onEscape);
        };
    }, [open]);

    const handleLogout = async () => {
        setOpen(false);
        try {
            await auth.signOut();
        } catch {
            // already signed out server-side; still clear local state
        }
        clearSession();
    };

    // Auth state unresolved — reserve the space, avoid a logged-out flash
    if (user === undefined) {
        return <div className="h-8 w-24" aria-hidden />;
    }

    if (user === null) {
        return (
            <>
                <Link href="/login" className={buttonVariants({ size: "sm", variant: "ghost" })}>
                    Login
                </Link>
                <Link href="/signup" className={buttonVariants({ size: "sm", className: "hidden md:flex" })}>
                    Get Beta Access Now
                </Link>
            </>
        );
    }

    return (
        <>
            <Link href="/dashboard" className={buttonVariants({ size: "sm", className: "hidden md:flex" })}>
                Open Dashboard
            </Link>
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden ring-1 ring-border hover:ring-primary transition-shadow"
                    aria-label="Account menu"
                    aria-expanded={open}
                >
                    {user.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <span
                            className="w-full h-full flex items-center justify-center text-sm font-semibold text-white"
                            style={{ background: "var(--gradient)" }}
                        >
                            {user.initial}
                        </span>
                    )}
                </button>
                {open && (
                    <div className="absolute right-0 mt-2 w-60 rounded-md border border-border bg-background/95 backdrop-blur-lg shadow-lg py-1 z-50">
                        <div className="px-3 py-2 border-b border-border">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <Link
                            href="/dashboard"
                            className="block px-3 py-2 text-sm hover:bg-muted transition-colors"
                            onClick={() => setOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard/profile"
                            className="block px-3 py-2 text-sm hover:bg-muted transition-colors"
                            onClick={() => setOpen(false)}
                        >
                            My Profile
                        </Link>
                        <Link
                            href="/dashboard/setting"
                            className="block px-3 py-2 text-sm hover:bg-muted transition-colors"
                            onClick={() => setOpen(false)}
                        >
                            Settings
                        </Link>
                        <div className="border-t border-border mt-1 pt-1">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-muted transition-colors"
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default NavAuth;

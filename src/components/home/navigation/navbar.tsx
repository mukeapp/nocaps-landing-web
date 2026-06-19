import { Container } from "@/components";
import Icons from "@/components/global/icons";
import { buttonVariants } from "@/components/ui/button";
import { UserButton, } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import the NavLinks component with no SSR
const NavLinks = dynamic(() => import("./nav-links"), { ssr: false });

const Navbar = async () => {

    const user = await currentUser();

    return (
        <header className="px-4 h-14 sticky top-0 inset-x-0 w-full bg-background/40 backdrop-blur-lg border-b border-border z-50">
            <Container reverse>
                <div className="flex items-center justify-between h-full mx-auto md:max-w-screen-xl">
                    <div className="flex items-start">
                        <Link href="/" className="flex items-center gap-2">
                            <Icons.logo className="w-8 h-8" />
                            <span className="text-lg font-medium">
                                NoCaps
                            </span>
                        </Link>
                    </div>
                    <nav className="hidden md:flex flex-1 justify-center">
                        <NavLinks />
                    </nav>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <UserButton />
                        ) : (
                            <>
                                <Link href="/sign-in" className={buttonVariants({ size: "sm", variant: "ghost" })}>
                                    Login
                                </Link>
                                <Link href="/sign-up" className={buttonVariants({ size: "sm", className: "hidden md:flex" })}>
                                Get Beta Access Now
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </header>
    )
};

export default Navbar

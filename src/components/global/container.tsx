"use client";

import { cn } from "@/lib/utils";

interface Props {
    className?: string;
    children: React.ReactNode;
    delay?: number;
    reverse?: boolean;
}

const Container = ({ children, className, delay = 0.2, reverse }: Props) => {
    return (
        <div className={cn("w-full h-full", className)}>
            {children}
        </div>
    );
};

export default Container;
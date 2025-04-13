import { Metadata } from "next";

export const SITE_CONFIG: Metadata = {
    title: {
        // write a default title for NoCap a ai powered Habit Tracker app.
        default: "NoCap - Next-Gen Habit Builder",
        template: `%s | NoCap`
    },
    description: "NoCap is an AI-powered habit tracker that helps you build better habits in minutes. No experience needed. Start your journey for free!",
    icons: {
        icon: [
            {
                url: "/icons/favicon.ico",
                href: "/icons/favicon.ico",
            }
        ]
    },
    openGraph: {
        title: "NoCap - AI Powered Habit Builder",
        description: "NoCap is an AI-powered habit tracker that helps you build better habits in minutes. No experience needed. Start your journey for free!",
        images: [
            {
                url: "/assets/og-image.png",
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        creator: "@shreyassihasane",
        title: "NoCap - AI Powered Habit Builder",
        description: "NoCap is an AI-powered habit tracker that helps you build better habits in minutes. No experience needed. Start your journey for free!",
        images: [
            {
                url: "/assets/og-image.png",
            }
        ]
    },
    metadataBase: new URL("https://nocap-app.vercel.app"),
};

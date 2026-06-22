'use client';

import Link from "next/link";

const Tooltip = () => (
    <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 pointer-events-none z-10 flex flex-col items-center">
        <div className="bg-purple-600 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
            Available soon!
        </div>
        <div className="w-3 h-3 bg-purple-600 rotate-45 -mt-1.5 rounded-sm" />
    </div>
);

const HeroAppButtons = () => (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 w-full">

        {/* iOS */}
        <div className="relative group">
            <Tooltip />
            <button className="flex items-center gap-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] px-5 py-3 text-white transition-colors">
                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="flex flex-col items-start">
                    <span className="text-xs opacity-80">Download the app</span>
                    <span className="text-sm font-bold leading-tight">App Store</span>
                </div>
            </button>
        </div>

        {/* Android */}
        <div className="relative group">
            <Tooltip />
            <button className="flex items-center gap-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] px-5 py-3 text-white transition-colors">
                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.18 23.76c.37.21.8.22 1.2.04L14.76 12 4.38 1.6c-.4-.18-.83-.17-1.2.04C2.56 2.01 2 2.7 2 3.56v17.28c0 .86.56 1.55 1.18 1.92zM16.54 13.78l2.76 2.76-9.4 5.44 6.64-8.2zM19.3 7.46l-2.76 2.76-6.64-8.2 9.4 5.44zM21.5 10.23c.6.35.6 1.19 0 1.54l-2.2 1.27-3.07-3.07 3.07-3.07 2.2 1.33z" />
                </svg>
                <div className="flex flex-col items-start">
                    <span className="text-xs opacity-80">Download the app</span>
                    <span className="text-sm font-bold leading-tight">Google Play</span>
                </div>
            </button>
        </div>

        {/* Discord */}
        <Link
            href="https://discord.gg/RjYcdT7S"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] px-5 py-3 text-sm font-medium text-white transition-colors"
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            Join our Discord Community
        </Link>
    </div>
);

export default HeroAppButtons;

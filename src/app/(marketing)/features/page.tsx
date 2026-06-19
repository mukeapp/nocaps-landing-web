import { Container, Wrapper } from "@/components";
import SectionBadge from "@/components/ui/section-badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const aiFeatures = [
    {
        emoji: "🔄",
        color: "#7C6EF8",
        colorBg: "rgba(124,110,248,0.12)",
        title: "AI Habit Swap Engine",
        description:
            "When a habit is underperforming, NoCaps AI instantly surfaces ranked alternatives — sourced from your preferences, collective wisdom, and proven higher-scoring patterns. One tap to upgrade.",
        image: "/assets/KickStarterNoCapFeatures/images/image11-00.png",
    },
    {
        emoji: "⭐",
        color: "#22C55E",
        colorBg: "rgba(34,197,94,0.1)",
        title: "AI Habit Scoring",
        description:
            "Every habit gets a live 0–100% score. NoCaps AI classifies each component as Bad, Poor, Average, Good, or Excellent — so you always know exactly where you stand.",
        image: "/assets/KickStarterNoCapFeatures/images/image2.png",
    },
    {
        emoji: "✨",
        color: "#F59E0B",
        colorBg: "rgba(245,158,11,0.1)",
        title: "AI Habit Generating",
        description:
            "No idea where to start? NoCaps creates personalized habit plans tailored to your goals, sector, and past performance — building a system designed around your life.",
        image: "/assets/KickStarterNoCapFeatures/images/image47.png",
    },
    {
        emoji: "💬",
        color: "#3B82F6",
        colorBg: "rgba(59,130,246,0.1)",
        title: "AI Habit Chat",
        description:
            "Select any habit for instant, context-aware AI guidance. Chat with AI alone or bring friends in — every conversation is anchored to your specific habits, not generic advice.",
        image: "/assets/KickStarterNoCapFeatures/images/image39.png",
    },
];

const scoreCategories = [
    { range: "0%", label: "Unknown", color: "#6B7280", bg: "rgba(107,114,128,0.12)" },
    { range: "0–49%", label: "Bad", color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
    { range: "50–59%", label: "Poor", color: "#F97316", bg: "rgba(249,115,22,0.12)" },
    { range: "60–79%", label: "Average", color: "#EAB308", bg: "rgba(234,179,8,0.12)" },
    { range: "80–89%", label: "Good", color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
    { range: "90–100%", label: "Excellent", color: "#7C6EF8", bg: "rgba(124,110,248,0.12)" },
];

const architecture = [
    {
        level: "01",
        name: "HabitStack",
        color: "#7C6EF8",
        colorBg: "rgba(124,110,248,0.12)",
        description: "The top-level container that groups all your habits for a specific area of life.",
        example: "e.g. MakeUpHaven, FitnessLife, FinanceOS",
    },
    {
        level: "02",
        name: "Habit",
        color: "#3B82F6",
        colorBg: "rgba(59,130,246,0.12)",
        description: "A core routine inside a HabitStack. Defines a recurring behavior you want to track.",
        example: "e.g. LipSticks, MorningRun, GroceryBudget",
    },
    {
        level: "03",
        name: "HabitLink",
        color: "#22C55E",
        colorBg: "rgba(34,197,94,0.12)",
        description: "A sub-category that groups related items within a Habit.",
        example: "e.g. CheapLipSticks, ExpensiveLipSticks",
    },
    {
        level: "04",
        name: "HabitLinkItem",
        color: "#F59E0B",
        colorBg: "rgba(245,158,11,0.12)",
        description: "A single measurable element — the atomic unit of your routine.",
        example: "e.g. Revlon ($8.99), Walmart Chicken ($6.49)",
    },
];

const sectors = [
    {
        emoji: "💵",
        name: "Finance",
        color: "#22C55E",
        bg: "rgba(34,197,94,0.08)",
        interests: ["Groceries", "Savings", "Bills", "Investments", "Budgeting"],
        image: "/assets/KickStarterNoCapFeatures/images/image5.png",
    },
    {
        emoji: "🏋️",
        name: "Health & Fitness",
        color: "#3B82F6",
        bg: "rgba(59,130,246,0.08)",
        interests: ["Nutrition", "Exercise", "Hydration", "Sleep", "Recovery"],
        image: "/assets/KickStarterNoCapFeatures/images/image7.png",
    },
    {
        emoji: "📚",
        name: "Personal Growth",
        color: "#7C6EF8",
        bg: "rgba(124,110,248,0.08)",
        interests: ["Reading", "Coding", "Creativity", "Writing", "Confidence"],
        image: "/assets/KickStarterNoCapFeatures/images/image49.png",
    },
    {
        emoji: "⚡",
        name: "Productivity",
        color: "#F59E0B",
        bg: "rgba(245,158,11,0.08)",
        interests: ["Work tasks", "Deadlines", "Planning", "Screen time", "Routines"],
        image: "/assets/KickStarterNoCapFeatures/images/image50.png",
    },
    {
        emoji: "❤️",
        name: "Relationships",
        color: "#F97316",
        bg: "rgba(249,115,22,0.08)",
        interests: ["Family time", "Friendships", "Romance", "Parenting", "Community"],
        image: "/assets/KickStarterNoCapFeatures/images/image45.png",
    },
    {
        emoji: "🌍",
        name: "Lifestyle",
        color: "#A855F7",
        bg: "rgba(168,85,247,0.08)",
        interests: ["Travel", "Gaming", "Music", "Sports", "Dining Out"],
        image: "/assets/KickStarterNoCapFeatures/images/image18.png",
    },
];

const trackingModes = [
    {
        icon: "📅",
        mode: "Daily",
        color: "#7C6EF8",
        description: "Mark each day as done, missed, or partial. Build streaks and keep momentum alive.",
    },
    {
        icon: "📆",
        mode: "Weekly",
        color: "#22C55E",
        description: "Track consistency over 7 days. Spot patterns — better on weekdays vs. weekends.",
    },
    {
        icon: "🗓️",
        mode: "Monthly",
        color: "#F59E0B",
        description: "See bigger trends. Ideal for budgeting, weight progress, or reducing screen time.",
    },
    {
        icon: "📊",
        mode: "Yearly",
        color: "#F97316",
        description: "Watch compounding effects. Skills built, money saved, health improved — all visible.",
    },
];

const FeaturesPage = () => {
    return (
        <section className="w-full relative flex items-center justify-center flex-col px-4 md:px-0 py-8">

            {/* Header */}
            <Wrapper className="flex flex-col items-center justify-center py-12 relative">
                <div className="hidden md:block absolute top-0 -right-1/3 w-72 h-72 bg-primary rounded-full blur-[10rem] -z-10 opacity-30" />
                <div className="hidden md:block absolute bottom-0 -left-1/3 w-72 h-72 bg-indigo-600 rounded-full blur-[10rem] -z-10 opacity-30" />
                <Container>
                    <div className="max-w-2xl mx-auto text-center">
                        <SectionBadge title="Features" />
                        <h1 className="text-3xl lg:text-5xl font-semibold mt-6 tracking-tight">
                            Everything NoCaps can do
                        </h1>
                        <p className="text-muted-foreground mt-4 text-base leading-relaxed max-w-xl mx-auto">
                            AI habit scoring, a reverse search engine, purposeful social sharing, and a living marketplace — all in one platform built around your life.
                        </p>
                    </div>
                    <div className="mt-10 w-full rounded-2xl overflow-hidden border border-border">
                        <Image
                            src="/assets/KickStarterNoCapFeatures/images/image43.jpg"
                            alt="NoCaps app — build better habits"
                            width={1200}
                            height={500}
                            className="w-full object-cover"
                            priority
                        />
                    </div>
                </Container>
            </Wrapper>

            {/* Core AI Features */}
            <Wrapper className="flex flex-col items-center justify-center py-8 relative">
                <Container>
                    <div className="max-w-2xl mx-auto text-center mb-10">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Powered by AI</p>
                        <h2 className="text-2xl lg:text-3xl font-semibold">Four AI systems working for you</h2>
                    </div>
                    <div className="flex flex-col gap-5 max-w-4xl mx-auto">
                        {aiFeatures.map((f, index) => (
                            <div
                                key={f.title}
                                className="flex flex-col sm:flex-row rounded-2xl border border-border bg-card overflow-hidden hover:border-border/60 transition-colors"
                            >
                                {f.image && index % 2 === 1 && (
                                    <div className="relative w-full sm:w-72 md:w-80 min-h-[220px] flex-shrink-0">
                                        <Image
                                            src={f.image}
                                            alt={f.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 p-6 md:p-8">
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4"
                                        style={{ background: f.colorBg }}
                                    >
                                        {f.emoji}
                                    </div>
                                    <h3 className="text-base font-semibold mb-2" style={{ color: f.color }}>
                                        {f.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                                </div>
                                {f.image && index % 2 === 0 && (
                                    <div className="relative w-full sm:w-72 md:w-80 min-h-[220px] flex-shrink-0">
                                        <Image
                                            src={f.image}
                                            alt={f.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Container>
            </Wrapper>

            {/* Habit Architecture */}
            <Wrapper className="flex flex-col items-center justify-center py-8 relative">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Data Structure</p>
                            <h2 className="text-2xl lg:text-3xl font-semibold">A system built for real life</h2>
                            <p className="text-muted-foreground mt-3 text-sm max-w-lg mx-auto">
                                NoCaps organizes your life into four nested layers — flexible enough for any habit, powerful enough for every goal.
                            </p>
                        </div>

                        <div className="relative">
                            <div className="hidden md:block absolute left-[27px] top-10 bottom-10 w-px bg-gradient-to-b from-violet-500 via-blue-500 via-green-500 to-amber-500 opacity-30" />
                            <div className="flex flex-col gap-4">
                                {architecture.map((a, i) => (
                                    <div key={a.name} className="flex gap-5 items-start">
                                        <div
                                            className="flex-none w-[56px] h-[56px] rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 z-10"
                                            style={{ background: a.colorBg, color: a.color, border: `1px solid ${a.color}30` }}
                                        >
                                            {a.level}
                                        </div>
                                        <div className="flex-1 bg-card border border-border rounded-xl px-5 py-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-semibold" style={{ color: a.color }}>{a.name}</span>
                                                {i < architecture.length - 1 && (
                                                    <span className="text-[10px] text-muted-foreground">→ contains {architecture[i + 1].name}s</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{a.description}</p>
                                            <p className="text-xs text-muted-foreground/60 mt-1 italic">{a.example}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div
                            className="mt-10 rounded-2xl border border-border overflow-x-auto"
                            style={{ width: '230%', marginLeft: '-45%' }}
                        >
                            <Image
                                src="/assets/KickStarterNoCapFeatures/images/image27.svg"
                                alt="NoCaps Habit Architecture — HabitStack to HabitLinkItem with real app screens"
                                width={2400}
                                height={1200}
                                className="w-full"
                            />
                        </div>
                    </div>
                </Container>
            </Wrapper>

            {/* AI Scoring Scale */}
            <Wrapper className="flex flex-col items-center justify-center py-8 relative">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">AI Scoring</p>
                            <h2 className="text-2xl lg:text-3xl font-semibold">Know exactly where every habit stands</h2>
                            <p className="text-muted-foreground mt-3 text-sm max-w-lg mx-auto">
                                Every habit, HabitLink, and HabitLinkItem gets scored 0–100%. Six clear categories tell you what to keep, improve, or swap.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {scoreCategories.map((s) => (
                                        <div
                                            key={s.label}
                                            className="rounded-xl border border-border bg-card p-4 text-center"
                                            style={{ borderColor: `${s.color}25` }}
                                        >
                                            <div
                                                className="w-8 h-8 rounded-full mx-auto mb-3 flex items-center justify-center text-xs font-bold"
                                                style={{ background: s.bg, color: s.color }}
                                            >
                                                ●
                                            </div>
                                            <div className="text-xs font-semibold mb-1" style={{ color: s.color }}>{s.label}</div>
                                            <div className="text-[10px] text-muted-foreground">{s.range}</div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-5">
                                    Low score? NoCaps Swap steps in with AI-ranked alternatives — swap weak components for stronger ones in one tap.
                                </p>
                            </div>
                            <div className="rounded-2xl overflow-hidden border border-border">
                                <Image
                                    src="/assets/KickStarterNoCapFeatures/images/image28.png"
                                    alt="NoCaps Swap — Habit Calendar going from red to all-green"
                                    width={600}
                                    height={700}
                                    className="w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </Wrapper>

            {/* Reverse Search Engine */}
            <Wrapper className="flex flex-col items-center justify-center py-8 relative">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <div className="rounded-2xl border border-border bg-card overflow-hidden">
                            <div className="grid md:grid-cols-2">
                                <div className="p-8 border-b md:border-b-0 md:border-r border-border">
                                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-400 bg-red-500/10 px-3 py-1 rounded-full mb-5">
                                        ❌ Traditional Search
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Search engines work against you</h3>
                                    <ul className="space-y-3">
                                        {[
                                            "You search endlessly for better alternatives",
                                            "Biased results filled with paid ads",
                                            "No personal context — one size fits all",
                                            "You are the product, not the customer",
                                        ].map((item) => (
                                            <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                                <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-8">
                                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-green-400 bg-green-500/10 px-3 py-1 rounded-full mb-5">
                                        ✅ NoCaps Reverse Search
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-4">NoCaps searches for you — automatically</h3>
                                    <ul className="space-y-3">
                                        {[
                                            "Create your HabitStack once, NoCaps tracks it",
                                            "AI continuously scores and recommends upgrades",
                                            "Real context: your goals, budget, and past data",
                                            "Clarity instead of ads. Insight instead of noise.",
                                        ].map((item) => (
                                            <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                                <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="px-8 py-5 border-t border-border bg-foreground/[0.02] text-sm text-center text-muted-foreground">
                                Just like a stock market updates in real time — NoCaps tracks the evolution of your habits automatically.
                            </div>
                        </div>
                        <div className="mt-6 rounded-2xl overflow-hidden border border-border max-w-xs mx-auto">
                            <Image
                                src="/assets/KickStarterNoCapFeatures/images/image1.jpg"
                                alt="Hand holding phone with NoCaps app open"
                                width={400}
                                height={600}
                                className="w-full object-cover"
                            />
                        </div>
                    </div>
                </Container>
            </Wrapper>

            {/* Life Sectors */}
            <Wrapper className="flex flex-col items-center justify-center py-8 relative">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Life Sectors</p>
                            <h2 className="text-2xl lg:text-3xl font-semibold">Every area of your life, covered</h2>
                            <p className="text-muted-foreground mt-3 text-sm max-w-lg mx-auto">
                                NoCaps organizes habits across six life sectors — and the community can always propose new ones.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sectors.map((s) => (
                                <div
                                    key={s.name}
                                    className="rounded-2xl border border-border bg-card overflow-hidden hover:border-border/60 transition-colors"
                                    style={{ borderColor: `${s.color}20` }}
                                >
                                    {s.image && (
                                        <Image
                                            src={s.image}
                                            alt={`${s.name} habits in NoCaps`}
                                            width={600}
                                            height={800}
                                            className="w-full h-auto"
                                        />
                                    )}
                                    <div className="p-5">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3"
                                            style={{ background: s.bg }}
                                        >
                                            {s.emoji}
                                        </div>
                                        <h3 className="text-sm font-semibold mb-2" style={{ color: s.color }}>{s.name}</h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {s.interests.map((interest) => (
                                                <span
                                                    key={interest}
                                                    className="text-[11px] px-2 py-0.5 rounded-full text-muted-foreground"
                                                    style={{ background: s.bg }}
                                                >
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </Wrapper>

            {/* Tracking Modes */}
            <Wrapper className="flex flex-col items-center justify-center py-8 relative">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Habit Calendar</p>
                            <h2 className="text-2xl lg:text-3xl font-semibold">Track at every time scale</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="grid grid-cols-2 gap-4">
                                {trackingModes.map((t) => (
                                    <div
                                        key={t.mode}
                                        className="rounded-2xl border border-border bg-card p-5 text-center hover:border-border/60 transition-colors"
                                    >
                                        <div className="text-3xl mb-3">{t.icon}</div>
                                        <h3 className="text-sm font-semibold mb-2" style={{ color: t.color }}>{t.mode}</h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="rounded-2xl overflow-hidden border border-border">
                                <Image
                                    src="/assets/KickStarterNoCapFeatures/images/image8.png"
                                    alt="NoCaps Habit Calendar monthly view"
                                    width={600}
                                    height={700}
                                    className="w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </Wrapper>

            {/* Social */}
            <Wrapper className="flex flex-col items-center justify-center py-8 relative">
                <Container>
                    <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="grid md:grid-cols-2">
                            <div className="p-8 md:p-10">
                                <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full mb-5">
                                    🌍 Purposeful Social
                                </div>
                                <h2 className="text-2xl font-semibold text-foreground mb-4">
                                    Every post tied to a habit
                                </h2>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                                    NoCaps isn&apos;t just a tracker — it&apos;s a new kind of social media. Instead of endless noise, every post is anchored to a real habit: progress, swaps, insights, and milestones you can share with friends, family, and the world.
                                </p>
                                <ul className="space-y-2">
                                    {[
                                        "Share your habit journey — not random content",
                                        "Friends & Family feed focused on real growth",
                                        "Posts evolve into marketplace templates",
                                        "Collective wisdom from people like you",
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                            <span className="text-violet-400 mt-0.5 flex-shrink-0">✓</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="relative min-h-[320px]">
                                <Image
                                    src="/assets/KickStarterNoCapFeatures/images/image48.png"
                                    alt="NoCaps social profile and community"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </Wrapper>

            {/* Friends & Family */}
            <Wrapper className="flex flex-col items-center justify-center py-8 relative">
                <Container>
                    <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="grid md:grid-cols-2">
                            <div className="p-8 md:p-10">
                                <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full mb-5">
                                    👨‍👩‍👧 Friends &amp; Family
                                </div>
                                <h2 className="text-2xl font-semibold text-foreground mb-4">
                                    Browse and copy proven habit systems from Friends and Family
                                </h2>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                                    See the real habits the people you trust are actually using — not generic templates from strangers. Browse your inner circle&apos;s HabitStacks and copy what works for them in one tap.
                                </p>
                                <ul className="space-y-2">
                                    {[
                                        "See exactly what habits your friends follow",
                                        "Copy any HabitStack from your network in one tap",
                                        "Trusted recommendations over random advice",
                                        "Stay inspired by people who know your life",
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                            <span className="text-orange-400 mt-0.5 flex-shrink-0">✓</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="relative min-h-[320px]">
                                <Image
                                    src="/assets/KickStarterNoCapFeatures/images/image51.png"
                                    alt="Browse and copy habit systems from friends and family"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </Wrapper>

            {/* Habit Market */}
            <Wrapper className="flex flex-col items-center justify-center py-8 relative">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Habit Market</p>
                            <h2 className="text-2xl lg:text-3xl font-semibold">Browse and Copy proven habit systems from the Community</h2>
                            <p className="text-muted-foreground mt-3 text-sm max-w-lg mx-auto">
                                A community-driven library of HabitStacks shared by real users. Find systems that work — and make them yours in one tap.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4">
                                {[
                                    { icon: "📦", title: "Copy any HabitStack", desc: "Browse stacks shared by friends, influencers, or the community — copy in one tap." },
                                    { icon: "⭐", title: "AI-scored before you copy", desc: "Every marketplace stack is already rated, so you know the quality before you commit." },
                                    { icon: "🔗", title: "Publish your own system", desc: "Built something great? Share it with the world — earn credibility in the community." },
                                ].map((item) => (
                                    <div key={item.title} className="flex gap-4 items-start bg-card border border-border rounded-xl px-5 py-4">
                                        <span className="text-2xl flex-shrink-0">{item.icon}</span>
                                        <div>
                                            <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="rounded-2xl overflow-hidden border border-border">
                                <Image
                                    src="/assets/KickStarterNoCapFeatures/images/image52.png"
                                    alt="NoCaps Habit Market showing Finance and Personal Development stacks"
                                    width={600}
                                    height={600}
                                    className="w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </Wrapper>

            {/* CTA */}
            <Wrapper className="flex flex-col items-center justify-center py-12 relative">
                <Container>
                    <div className="max-w-xl mx-auto text-center">
                        <h2 className="text-2xl lg:text-3xl font-semibold mb-4">Ready to build your habit system?</h2>
                        <p className="text-muted-foreground text-sm mb-8">
                            Join the NoCaps alpha — track, score, swap, and share habits with AI guiding every step.
                        </p>
                        <Button asChild size="lg">
                            <Link href="/sign-in">
                                Get Beta Access Now
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </Container>
            </Wrapper>

        </section>
    );
};

export default FeaturesPage;

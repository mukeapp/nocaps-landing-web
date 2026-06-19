import { Container, Wrapper } from "@/components";
import PricingSection from "@/components/home/pricing-section";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LampContainer } from "@/components/ui/lamp";
import Marquee from "@/components/ui/marquee";
import SectionBadge from "@/components/ui/section-badge";
import { perks, reviews } from "@/constants";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronRight, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HomePage = () => {

    const firstRow = reviews.slice(0, reviews.length / 2);
    const secondRow = reviews.slice(reviews.length / 2);

    return (
        <section className="w-full relative flex items-center justify-center flex-col px-4 md:px-0 py-8">


            {/* hero */}
            <Wrapper>
                <div className="absolute inset-0 dark:bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10 h-[150vh]" />

                <Container>
                    <div className="flex flex-col items-center justify-center py-20 h-full">
                        <button className="group relative grid overflow-hidden rounded-full px-4 py-1 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200">
                            <span>
                                <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
                            </span>
                            <span className="backdrop absolute inset-[1px] rounded-full bg-neutral-950 transition-colors duration-200 group-hover:bg-neutral-900" />
                            <span className="h-full w-full blur-md absolute bottom-0 inset-x-0 bg-gradient-to-tr from-primary/40"></span>
                            <span className="z-10 py-0.5 text-sm text-neutral-100 flex items-center justify-center gap-1.5">
                                <Image src="/icons/sparkles-dark.svg" alt="✨" width={24} height={24} className="w-4 h-4" />
                                Introducing NoCaps
                                <ChevronRight className="w-4 h-4" />
                            </span>
                        </button>

                        <div className="flex flex-col items-center mt-8 max-w-3xl w-11/12 md:w-full">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl md:!leading-snug font-semibold text-center">
                                <span className="text-foreground">Build the future</span>
                                <br />
                                <span className="text-foreground">of </span>
                                <span className="text-blue-500">Habit Intelligence </span>
                            </h1>
                            <p className="text-base md:text-lg text-foreground/80 mt-6 text-center">
                                NoCaps is AI habit tracking + social sharing + a reverse search engine that works for your life — not against it.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                                {[
                                    "AI-powered Habit Swap Engine",
                                    "AI-powered Habit Scoring",
                                    "AI-powered Habit Generating",
                                    "AI-powered Habit Chat",
                                    "Habit Marketplace",
                                    "Habit Stacks",
                                    "Friends & Community",
                                    "Tracks in real units",
                                ].map((tag) => (
                                    <span key={tag} className="rounded-full border border-foreground/20 bg-foreground/5 px-4 py-1.5 text-sm text-foreground/80">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="relative flex items-center py-10 md:py-20 w-full">
                            <div className="absolute top-1/2 left-1/2 -z-10 gradient w-3/4 -translate-x-1/2 h-3/4 -translate-y-1/2 inset-0 blur-[10rem]"></div>
                            <div className="-m-2 rounded-xl p-2 ring-1 ring-inset ring-foreground/20 lg:-m-4 lg:rounded-2xl bg-opacity-50 backdrop-blur-3xl">
                                <Image
                                    src="/assets/nocap-first.png"
                                    alt="banner image"
                                    width={1200}
                                    height={1200}
                                    quality={100}
                                    className="rounded-md lg:rounded-xl bg-foreground/10 shadow-2xl ring-1 ring-border"
                                />

                                <BorderBeam size={250} duration={12} delay={9} />
                            </div>
                        </div>
                    </div>
                </Container>
            </Wrapper>

            {/* what is nocap */}
            <Wrapper id="what-is-nocap" className="flex flex-col items-center justify-center py-12 relative">
                <Container>
                    <div className="max-w-2xl mx-auto text-start md:text-center">
                        <SectionBadge title="What is NoCaps?" />
                        <h2 className="text-3xl lg:text-4xl font-semibold mt-6">
                            A habit intelligence platform
                        </h2>
                        <p className="text-muted-foreground mt-6">
                            NoCaps combines AI, habit tracking, and social sharing to help people build better habits and break free from bad ones.
                        </p>
                    </div>
                </Container>
                <Container>
                    <div className="max-w-3xl mx-auto mt-8 space-y-8">
                        <p className="text-muted-foreground text-base leading-relaxed">
                            NoCaps lets users track habits across every area of life — finance, health, fitness, personal growth, relationships, and more — then uses AI to score those habits and suggest smarter alternatives. Users can share what works through our built-in Habit Marketplace, creating a community-driven library of proven routines and strategies.
                        </p>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                What makes us different
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "AI-powered Habit Swap Engine — finds better alternatives for your current habits across any sector",
                                    "AI-powered Habit Scoring — rates your habits so you always know where you stand",
                                    "AI-powered Habit Generating — creates personalized habit plans tailored to your goals",
                                    "AI-powered Habit Chat — select any habit for instant, context-aware AI guidance",
                                    "Habit Marketplace — where users share and copy each other's habit systems",
                                    "Habit Stacks — organize habits into nested, interlinked systems that reflect real life complexity",
                                    "Friends and Community — share your progress, swap habits, and learn from others in a supportive social environment",
                                    "Tracks in real units that matter — USD, calories, kilograms, percentages, hours ...",
                                ].map((item) => (
                                    <div key={item} className="flex items-start gap-3">
                                        <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                                        <p className="text-muted-foreground text-sm leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-xl border border-border bg-foreground/[0.03] px-6 py-4 text-sm text-muted-foreground">
                            We&apos;re currently in alpha, launching our KickStarter at the end of this month, with Android and iOS beta to follow.
                        </div>
                    </div>
                </Container>
            </Wrapper>

            {/* the problem */}
            <Wrapper className="flex flex-col items-center justify-center py-12 relative">
                <Container>
                    <div className="max-w-md mx-auto text-start md:text-center">
                        <SectionBadge title="The Problem" />
                    </div>
                </Container>
                <Container>
                    <div className="w-full mt-8 rounded-xl border border-border bg-foreground/[0.03] p-6 md:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-bold text-foreground">No real guidance</h3>
                                <p className="text-muted-foreground text-sm">
                                    Apps track habits but never tell you if they&apos;re actually good or bad for you.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-bold text-foreground">Search engines exploit you</h3>
                                <p className="text-muted-foreground text-sm">
                                    You spend hours searching for better routines — ads win, you don&apos;t.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-bold text-foreground">Isolated progress</h3>
                                <p className="text-muted-foreground text-sm">
                                    Social media is noise. There&apos;s nowhere to share meaningful habit growth.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-bold text-foreground">One-size-fits-all</h3>
                                <p className="text-muted-foreground text-sm">
                                    Rigid habit systems don&apos;t adapt to your unique goals and constraints.
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </Wrapper>

            {/* quick features */}
            <Wrapper className="flex flex-col items-center justify-center py-12 relative">
                <Container>
                    <div className="max-w-2xl mx-auto text-center mb-10">
                        <SectionBadge title="Quick Features" />
                        <h2 className="text-3xl lg:text-4xl font-semibold mt-6">
                            A glimpse of what NoCaps can do
                        </h2>
                        <p className="text-muted-foreground mt-4 text-sm max-w-lg mx-auto">
                            From a structured data model to social sharing and a community marketplace — NoCaps gives you everything to build, track, and improve every habit in your life.
                        </p>
                        <div className="flex justify-center mt-6">
                            <Button asChild size="lg">
                                <Link href="/features">
                                    See all features
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                        {/* Card 1 — horizontal, image left */}
                        <div className="rounded-2xl border border-border bg-card overflow-hidden">
                            <div className="grid md:grid-cols-2">
                                <Image
                                    src="/assets/KickStarterNoCapFeatures/images/image27.png"
                                    alt="Built Around a Real Data Model"
                                    width={800}
                                    height={500}
                                    className="w-full h-auto"
                                />
                                <div className="p-8 flex flex-col justify-center">
                                    <h3 className="text-base font-semibold text-foreground mb-2">Built Around a Real Data Model</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">Organize life into HabitStacks, Habits, HabitLinks, and HabitLinkItems — a four-layer system flexible enough for any goal.</p>
                                </div>
                            </div>
                        </div>
                        {/* Card 2 — horizontal, image right */}
                        <div className="rounded-2xl border border-border bg-card overflow-hidden">
                            <div className="grid md:grid-cols-2">
                                <div className="p-8 flex flex-col justify-center order-2 md:order-1">
                                    <h3 className="text-base font-semibold text-foreground mb-2">Track, Share &amp; Discover</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">Log habits on a visual calendar, follow friends&apos; progress, and explore routines across every life sector — all in one place.</p>
                                </div>
                                <Image
                                    src="/assets/KickStarterNoCapFeatures/images/image17.png"
                                    alt="Track, Share & Discover"
                                    width={800}
                                    height={500}
                                    className="w-full h-auto order-1 md:order-2"
                                />
                            </div>
                        </div>
                        {/* Card 3 — vertical, centered */}
                        <div className="rounded-2xl border border-border bg-card overflow-hidden max-w-sm mx-auto w-full">
                            <Image
                                src="/assets/KickStarterNoCapFeatures/images/image53.png"
                                alt="Your Full Habit Hub"
                                width={600}
                                height={900}
                                className="w-full h-auto"
                            />
                            <div className="p-5">
                                <h3 className="text-sm font-semibold text-foreground mb-1">Your Full Habit Hub</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">From your personal library to the community market and friends feed, NoCaps puts your entire habit world in one app.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-10">
                        <Button asChild size="lg">
                            <Link href="/features">
                                Explore all features
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </Container>
            </Wrapper>

            {/* how it works */}
            <Wrapper id="about" className="flex flex-col items-center justify-center py-12 relative scroll-mt-20">
                <Container>
                    <div className="max-w-md mx-auto text-start md:text-center">
                        <SectionBadge title="The Process" />
                        <h2 className="text-3xl lg:text-4xl font-semibold mt-6">
                        Transform Your Life Portfolio in Three Steps
                        </h2>
                        <p className="text-muted-foreground mt-6">
                            Bring your vision to life in just three easy steps:
                        </p>
                    </div>
                </Container>
                <Container>
                    <div className="flex flex-col items-center justify-center py-10 md:py-20 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full divide-x-0 md:divide-x divide-y md:divide-y-0 divide-gray-900 first:border-l-2 lg:first:border-none first:border-gray-900">
                            {perks.map((perk) => (
                                <div key={perk.title} className="flex flex-col items-start px-4 md:px-6 lg:px-8 lg:py-6 py-4">
                                    <div className="flex items-center justify-center">
                                        <perk.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-medium mt-4">
                                        {perk.title}
                                    </h3>
                                    <p className="text-muted-foreground mt-2 text-start lg:text-start">
                                        {perk.info}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </Wrapper>


            {/* how it works */}
            <Wrapper className="flex flex-col items-center justify-center py-12 relative">
                <Container>
                    <div className="max-w-md mx-auto text-start md:text-center">
                        <SectionBadge title="How It Works" />
                    </div>
                </Container>
                <Container>
                    <div className="w-full mt-8 rounded-xl border border-border bg-foreground/[0.03] p-6 md:p-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="flex flex-col gap-2">
                                <span className="text-4xl font-bold text-primary">1</span>
                                <h3 className="text-base font-bold text-foreground">Build your HabitStack</h3>
                                <p className="text-muted-foreground text-sm">
                                    Organize life into Sectors → Habits → HabitLinks → Items
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-4xl font-bold text-primary">2</span>
                                <h3 className="text-base font-bold text-foreground">Get AI scored</h3>
                                <p className="text-muted-foreground text-sm">
                                    Each component is rated 0–100% across six categories from Bad to Excellent
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-4xl font-bold text-primary">3</span>
                                <h3 className="text-base font-bold text-foreground">Swap &amp; upgrade</h3>
                                <p className="text-muted-foreground text-sm">
                                    AI suggests proven replacements for low-scoring habits using collective wisdom
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-4xl font-bold text-primary">4</span>
                                <h3 className="text-base font-bold text-foreground">Track &amp; share</h3>
                                <p className="text-muted-foreground text-sm">
                                    Log daily/weekly/monthly, post progress, and inspire your community
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </Wrapper>

            {/* pricing */}
            <PricingSection />

            {/* testimonials */}
            <Wrapper id="feedback" className="flex flex-col items-center justify-center py-12 relative scroll-mt-20">
                <div className="hidden md:block absolute -top-1/4 -left-1/3 w-72 h-72 bg-indigo-500 rounded-full blur-[10rem] -z-10"></div>
                <Container>
                    <div className="max-w-md mx-auto text-start md:text-center">
                        <SectionBadge title="Our Customers" />
                        <h2 className="text-3xl lg:text-4xl font-semibold mt-6">
                            What people are saying
                        </h2>
                        <p className="text-muted-foreground mt-6">
                            See how NoCaps empowers businesses of all sizes. Here&apos;s what real people are saying on Twitter
                        </p>
                    </div>
                </Container>
                <Container>
                    <div className="py-10 md:py-20 w-full">
                        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden py-10">
                            <Marquee pauseOnHover className="[--duration:20s] select-none">
                                {firstRow.map((review) => (
                                    <figure
                                        key={review.name}
                                        className={cn(
                                            "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                                            "border-zinc-50/[.1] bg-background over:bg-zinc-50/[.15]",
                                        )}
                                    >
                                        <div className="flex flex-row items-center gap-2">
                                            <UserIcon className="w-6 h-6" />
                                            <div className="flex flex-col">
                                                <figcaption className="text-sm font-medium">
                                                    {review.name}
                                                </figcaption>
                                                <p className="text-xs font-medium text-muted-foreground">{review.username}</p>
                                            </div>
                                        </div>
                                        <blockquote className="mt-2 text-sm">{review.body}</blockquote>
                                    </figure>
                                ))}
                            </Marquee>
                            <Marquee reverse pauseOnHover className="[--duration:20s] select-none">
                                {secondRow.map((review) => (
                                    <figure
                                        key={review.name}
                                        className={cn(
                                            "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                                            "border-zinc-50/[.1] bg-background over:bg-zinc-50/[.15]",
                                        )}
                                    >
                                        <div className="flex flex-row items-center gap-2">
                                            <UserIcon className="w-6 h-6" />
                                            <div className="flex flex-col">
                                                <figcaption className="text-sm font-medium">
                                                    {review.name}
                                                </figcaption>
                                                <p className="text-xs font-medium text-muted-foreground">{review.username}</p>
                                            </div>
                                        </div>
                                        <blockquote className="mt-2 text-sm">{review.body}</blockquote>
                                    </figure>
                                ))}
                            </Marquee>
                            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
                            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
                        </div>
                    </div>
                </Container>
            </Wrapper>

            {/* newsletter */}
            <Wrapper className="flex flex-col items-center justify-center py-12 relative">
                <Container>
                    <LampContainer>
                        <div className="flex flex-col items-center justify-center relative w-full text-center">
                            <h2 className="text-4xl lg:text-5xl xl:text-6xl lg:!leading-snug font-semibold mt-8">
                                From Dream to Habit <br /> Achieve Your Goals Swiftly
                            </h2>
                            <p className="text-muted-foreground mt-6 max-w-md mx-auto">
                                Build better habits with NoCaps&apos;s intuitive tracking features and powerful AI suggestions.
                            </p>
                            <Button variant="white" className="mt-6" asChild>
                                <Link href="/sign-in">
                                    Get started for free
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </LampContainer>
                </Container>
                <Container className="relative z-[999999]">
                    <div className="flex items-center justify-center w-full -mt-40">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between w-full px-4 md:px-8 rounded-lg lg:rounded-2xl border border-border/80 py-4 md:py-8">
                            <div className="flex flex-col items-start gap-4 w-full">
                                <h4 className="text-xl md:text-2xl font-semibold">
                                    Join our newsletter
                                </h4>
                                <p className="text-base text-muted-foreground">
                                    Be up to date with everything about NoCaps Habit AI builder
                                </p>
                            </div>
                            <div className="flex flex-col items-start gap-2 md:min-w-80 mt-5 md:mt-0 w-full md:w-max">
                                <form action="#" className="flex flex-col md:flex-row items-center gap-2 w-full md:max-w-xs">
                                    <Input
                                        required
                                        type="email"
                                        placeholder="Enter your email"
                                        className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:border-primary duration-300 w-full"
                                    />
                                    <Button type="submit" size="sm" variant="secondary" className="w-full md:w-max">
                                        Subscribe
                                    </Button>
                                </form>
                                <p className="text-xs text-muted-foreground">
                                    By subscribing you agree with our{" "}
                                    <Link href="/privacy-policy" className="text-red-500 underline">
                                        Privacy Policy
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </Wrapper>

        </section>
    )
};

export default HomePage

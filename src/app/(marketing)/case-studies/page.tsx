import { Container, Wrapper } from "@/components";
import SectionBadge from "@/components/ui/section-badge";
import Image from "next/image";

const CaseStudiesPage = () => {
    return (
        <section className="w-full relative flex items-center justify-center flex-col px-4 md:px-0 py-8">
            <Wrapper className="flex flex-col items-center justify-center py-12 relative scroll-mt-20">
                <Container>
                    <div className="max-w-2xl mx-auto text-start md:text-center">
                        <SectionBadge title="Case Studies" />
                        <h1 className="text-3xl lg:text-4xl font-semibold mt-6">
                            Real features. Real impact.
                        </h1>
                        <p className="text-muted-foreground mt-4">
                            A closer look at how NoCap helps you build smarter habits and make better decisions every day.
                        </p>
                    </div>
                </Container>

                <Container>
                    <div className="max-w-2xl mx-auto py-10 space-y-12 text-muted-foreground">

                        {/* Case Study #1 */}
                        <div className="space-y-8">

                            <div className="space-y-2">
                                <p className="text-sm font-medium text-primary uppercase tracking-widest">Case Study #1</p>
                                <h2 className="text-2xl font-semibold text-foreground">NoCap Swap</h2>
                                <p className="text-base">
                                    How NoCap uses AI to detect underperforming habits and instantly suggest smarter replacements —
                                    so you spend less time starting over and more time leveling up.
                                </p>
                            </div>

                            {/* Hero image — NoCap app screens showing habit stacks in action */}
                            <div className="rounded-xl overflow-hidden border border-border">
                                <Image
                                    src="/assets/nocap-first.png"
                                    alt="NoCap app showing habit stacks and tracking screens"
                                    width={896}
                                    height={600}
                                    className="w-full object-cover"
                                    priority
                                />
                            </div>

                            {/* The Problem */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-foreground">The Problem</h3>
                                <p>
                                    Most habit trackers tell you when you&apos;re failing — but not what to do about it. Users who
                                    build habit stacks around specific items (like meals, routines, or purchases) often get stuck
                                    when a component isn&apos;t working. The only option is to manually research alternatives and
                                    rebuild from scratch, which most people simply don&apos;t do.
                                </p>
                                <p>
                                    NoCap tracks not just whether you completed a habit, but how well it&apos;s performing over time.
                                    When your score dips, the app knows something in your stack needs to change.
                                </p>
                            </div>

                            {/* The Solution */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-foreground">The Solution: NoCap Swap</h3>
                                <p>
                                    When your habit stack score falls below your target, <span className="text-foreground font-medium">NoCap Swap</span> steps in
                                    automatically. Instead of leaving you to figure it out, the AI surfaces a ranked list of
                                    stronger alternatives for any weak component — whether that&apos;s a Habit, a HabitLink, or an
                                    individual HabitLinkItem.
                                </p>
                                <p>Swap suggestions are generated based on three data sources:</p>
                                <ul className="list-disc list-inside space-y-2 pl-2">
                                    <li><span className="text-foreground font-medium">Your personal specifications</span> — your goals, budget, and past preferences</li>
                                    <li><span className="text-foreground font-medium">Collective wisdom</span> — patterns that have worked for other NoCap users in similar situations</li>
                                    <li><span className="text-foreground font-medium">Proven higher-scoring patterns</span> — alternatives verified to produce better habit scores over time</li>
                                </ul>
                            </div>

                            {/* How It Works */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground">How It Works</h3>

                                <div className="space-y-6">
                                    {/* Step 1 — with dashboard image */}
                                    <div className="border border-border rounded-xl overflow-hidden">
                                        <div className="p-5 space-y-2">
                                            <p className="text-sm font-semibold text-foreground uppercase tracking-wide">Step 1 — Score drops</p>
                                            <p>
                                                NoCap monitors each habit stack in real time. The moment a stack&apos;s performance score
                                                falls below threshold, the Swap indicator activates on that stack.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border border-border rounded-xl p-5 space-y-2">
                                        <p className="text-sm font-semibold text-foreground uppercase tracking-wide">Step 2 — Identify the weak component</p>
                                        <p>
                                            Inside the HabitLinks view, each item is scored individually. In the example below,
                                            a user&apos;s <span className="text-foreground font-medium">SteakAndFries</span> and <span className="text-foreground font-medium">PepperoniPizza</span> habit links
                                            are flagged. The AI pinpoints exactly which items — French Fries, Sliced Steak — are
                                            dragging the score down.
                                        </p>
                                    </div>

                                    <div className="border border-border rounded-xl p-5 space-y-2">
                                        <p className="text-sm font-semibold text-foreground uppercase tracking-wide">Step 3 — Review alternatives</p>
                                        <p>
                                            Tapping Swap opens a ranked list of alternatives for that exact item, sourced from
                                            real providers. Each option shows its price and a color-coded AI rating:
                                        </p>
                                        <ul className="mt-2 space-y-1 pl-2">
                                            <li className="flex items-center gap-2">
                                                <span className="inline-block w-3 h-3 rounded-full bg-green-500 shrink-0"></span>
                                                <span>Green — strong match, recommended swap</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="inline-block w-3 h-3 rounded-full bg-red-500 shrink-0"></span>
                                                <span>Red — poor fit for your current goals</span>
                                            </li>
                                        </ul>
                                        <p className="mt-2">
                                            For <span className="text-foreground font-medium">Sliced Steak</span>, the AI surfaced options from Walmart ($9), Target ($10),
                                            and Publix ($9.90) as strong alternatives — versus 7Eleven ($20) and Cosco ($40)
                                            flagged as poor fits. For <span className="text-foreground font-medium">French Fries</span>, Walmart ($0.80) and Publix ($0.90)
                                            ranked highest.
                                        </p>
                                    </div>

                                    <div className="border border-border rounded-xl p-5 space-y-2">
                                        <p className="text-sm font-semibold text-foreground uppercase tracking-wide">Step 4 — Swap and improve</p>
                                        <p>
                                            One tap replaces the weak item with the selected alternative. The habit stack
                                            automatically recalculates its score. No rebuilding, no manual research —
                                            just a faster path to a higher-performing habit.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Outcome */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-foreground">The Result</h3>
                                <p>
                                    NoCap Swap turns a frustrating dead-end into a one-tap fix. Users who engage with Swap
                                    suggestions recover their habit scores faster and are significantly less likely to abandon
                                    a stack entirely. Instead of starting from scratch, they simply swap and upgrade —
                                    keeping their momentum and their streak intact.
                                </p>
                            </div>

                            {/* CTA */}
                            <div className="rounded-xl border border-border bg-muted/30 p-6 space-y-3 text-center">
                                <p className="text-foreground font-semibold text-lg">Try NoCap Swap for yourself</p>
                                <p className="text-sm">
                                    Download the NoCap app and let the AI find the upgrades your habits are missing.
                                </p>
                                <a
                                    href="mailto:franck@donocap.com"
                                    className="inline-block mt-2 text-sm text-foreground underline underline-offset-4"
                                >
                                    Get early access → franck@donocap.com
                                </a>
                            </div>

                        </div>
                    </div>
                </Container>
            </Wrapper>
        </section>
    );
};

export default CaseStudiesPage;

import { Container, Wrapper } from "@/components";
import SectionBadge from "@/components/ui/section-badge";

const AboutPage = () => {
    return (
        <section className="w-full relative flex items-center justify-center flex-col px-4 md:px-0 py-8">
            <Wrapper className="flex flex-col items-center justify-center py-12 relative scroll-mt-20">
                <Container>
                    <div className="max-w-2xl mx-auto text-start md:text-center">
                        <SectionBadge title="About Us" />
                        <h1 className="text-3xl lg:text-4xl font-semibold mt-6">
                            Built for the complexity of life
                        </h1>
                        <p className="text-muted-foreground mt-4">
                            NoCaps is a system for capturing and passing down wisdom — so no one has to face life&apos;s hardships alone or repeat the same mistakes.
                        </p>
                    </div>
                </Container>

                <Container>
                    <div className="max-w-2xl mx-auto py-10 space-y-8 text-muted-foreground">

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">Our Story</h2>
                            <p>
                                NoCaps wasn&apos;t born out of frustration with habit tracker apps.
                                It was born out of frustration with something far bigger — the complexity of life,
                                and the lack of wisdom available to conquer it.
                            </p>
                            <p>
                                The idea came from a deeply personal place: I wanted my children to have what I didn&apos;t always have —
                                the accumulated wisdom of the people around them. The lessons learned through hardship.
                                The patterns that worked. The mistakes that should never have to be repeated.
                            </p>
                            <p>
                                I wanted my children to learn from me, from our family, from friends, from our community,
                                from our country — from anyone who carries positive energy and genuinely wishes success
                                upon others. Regardless of age. Regardless of where they come from.
                            </p>
                            <p>
                                NoCaps is that system. A living record of wisdom — so that no matter what life throws at you,
                                you don&apos;t have to face it alone, and you don&apos;t have to start from zero.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">Our Mission</h2>
                            <p>
                                We believe wisdom is the most powerful habit of all. NoCaps gives everyone —
                                regardless of age or background — access to the habits, systems, and lessons
                                of people who have already walked the path. Learn from others. Build on what works.
                                Pass it forward.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">What We Value</h2>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li><span className="text-foreground font-medium">Honesty</span> — no cap, no fluff. We tell you how you&apos;re really doing.</li>
                                <li><span className="text-foreground font-medium">Simplicity</span> — powerful tools that stay out of your way.</li>
                                <li><span className="text-foreground font-medium">Progress over perfection</span> — missing a day isn&apos;t failure. Getting back on track is.</li>
                                <li><span className="text-foreground font-medium">Privacy</span> — your habits are yours. We never sell your data.</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">Get in Touch</h2>
                            <p>
                                The best way to reach us and connect with the community is through Discord.
                            </p>
                            <a
                                href="https://discord.gg/v9NDUZVD"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground font-medium underline underline-offset-4 hover:text-primary"
                            >
                                Join our Discord → discord.gg/v9NDUZVD
                            </a>
                            <p>
                                Email:{" "}
                                <a
                                    href="mailto:franck@donocap.com"
                                    className="text-foreground font-medium underline underline-offset-4"
                                >
                                    franck@donocap.com
                                </a>
                            </p>
                        </div>

                    </div>
                </Container>
            </Wrapper>
        </section>
    );
};

export default AboutPage;

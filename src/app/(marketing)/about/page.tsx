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
                            Built for people who want to change
                        </h1>
                        <p className="text-muted-foreground mt-4">
                            NoCap is on a mission to make habit-building honest, personal, and actually fun.
                        </p>
                    </div>
                </Container>

                <Container>
                    <div className="max-w-2xl mx-auto py-10 space-y-8 text-muted-foreground">

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">Our Story</h2>
                            <p>
                                NoCap was born out of frustration with habit trackers that felt like chores. We
                                wanted something that met you where you were — no guilt, no gimmicks, just
                                real accountability and a system that works around your life.
                            </p>
                            <p>
                                We are a small, focused team based in the US, building tools that help people
                                show up consistently for the things that matter most to them.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">Our Mission</h2>
                            <p>
                                We believe lasting change comes from small, repeatable actions — not
                                motivation or willpower alone. NoCap gives you the structure, the insights,
                                and the nudges to build habits that actually stick, one day at a time.
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
                                We love hearing from our users. Whether you have feedback, a feature idea, or
                                just want to say hi — drop us a line.
                            </p>
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

import { Container, Wrapper } from "@/components";
import SectionBadge from "@/components/ui/section-badge";

const SupportPage = () => {
    return (
        <section className="w-full relative flex items-center justify-center flex-col px-4 md:px-0 py-8">
            <Wrapper className="flex flex-col items-center justify-center py-12 relative scroll-mt-20">
                <Container>
                    <div className="max-w-2xl mx-auto text-start md:text-center">
                        <SectionBadge title="Support" />
                        <h1 className="text-3xl lg:text-4xl font-semibold mt-6">
                            How can we help?
                        </h1>
                        <p className="text-muted-foreground mt-4">
                            Find answers to common questions or reach out to our team directly.
                        </p>
                    </div>
                </Container>

                <Container>
                    <div className="max-w-2xl mx-auto py-10 space-y-8 text-muted-foreground">

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">Getting Started</h2>
                            <p>
                                NoCap helps you build and track habits that stick. Once you create an account,
                                you can set up habit stacks, define your goals, and let our AI-powered insights
                                guide your progress. Download the app, sign in, and start your first habit stack
                                in under a minute.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">Frequently Asked Questions</h2>

                            <div className="space-y-6 pt-1">
                                <div className="space-y-1">
                                    <h3 className="font-medium text-foreground">How do I reset my password?</h3>
                                    <p>
                                        On the sign-in screen, tap <span className="text-foreground font-medium">Forgot password?</span> and
                                        enter your email address. You will receive a reset link within a few minutes.
                                        Check your spam folder if it doesn&apos;t arrive.
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="font-medium text-foreground">How do I cancel my subscription?</h3>
                                    <p>
                                        Subscriptions are managed through the App Store (iOS) or Google Play (Android).
                                        Go to your device&apos;s subscription settings, find NoCap, and select Cancel.
                                        You will retain access until the end of your current billing period.
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="font-medium text-foreground">How do I delete my account?</h3>
                                    <p>
                                        To permanently delete your account and all associated data, email us at{" "}
                                        <a
                                            href="mailto:franck@donocap.com"
                                            className="text-foreground underline underline-offset-4"
                                        >
                                            franck@donocap.com
                                        </a>{" "}
                                        with the subject line &quot;Account Deletion Request&quot;. We will process your
                                        request within 7 business days.
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="font-medium text-foreground">My habit streak isn&apos;t updating correctly. What should I do?</h3>
                                    <p>
                                        Try closing and reopening the app to force a sync. If the issue persists,
                                        check that your device&apos;s date and time are set automatically. Still stuck?
                                        Contact us and we&apos;ll look into it.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">Contact Us</h2>
                            <p>
                                Can&apos;t find what you&apos;re looking for? We&apos;re happy to help. Reach out and we&apos;ll
                                get back to you as soon as possible.
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

export default SupportPage;

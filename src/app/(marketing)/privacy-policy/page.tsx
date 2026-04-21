import { Container, Wrapper } from "@/components";
import SectionBadge from "@/components/ui/section-badge";

const PrivacyPolicyPage = () => {
    return (
        <section className="w-full relative flex items-center justify-center flex-col px-4 md:px-0 py-8">
            <Wrapper className="flex flex-col items-center justify-center py-12 relative scroll-mt-20">
                <Container>
                    <div className="max-w-2xl mx-auto text-start md:text-center">
                        <SectionBadge title="Legal" />
                        <h1 className="text-3xl lg:text-4xl font-semibold mt-6">
                            Privacy Policy
                        </h1>
                        <p className="text-muted-foreground mt-4">
                            Last updated: April 20, 2026
                        </p>
                    </div>
                </Container>

                <Container>
                    <div className="max-w-2xl mx-auto py-10 space-y-8 text-muted-foreground">

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
                            <p>
                                Welcome to NoCap (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We are committed to protecting your
                                personal information and your right to privacy. This Privacy Policy explains how we
                                collect, use, disclose, and safeguard your information when you use our mobile
                                application and website.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
                            <p>We may collect the following types of information:</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                <li>Account information (name, email address, password)</li>
                                <li>Profile and usage data (habits, stacks, goals, progress)</li>
                                <li>Device information (device type, operating system, unique device identifiers)</li>
                                <li>Log data (IP address, browser type, pages visited, timestamps)</li>
                                <li>Payment information processed securely via third-party providers</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
                            <p>We use the information we collect to:</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                <li>Provide, operate, and maintain the NoCap app and services</li>
                                <li>Personalize your experience and deliver AI-powered habit insights</li>
                                <li>Process transactions and manage subscriptions</li>
                                <li>Send account-related notifications and updates</li>
                                <li>Improve our services and develop new features</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">4. Sharing Your Information</h2>
                            <p>
                                We do not sell your personal information. We may share your information with trusted
                                third-party service providers (such as payment processors and analytics providers)
                                solely to support the operation of our services, subject to confidentiality agreements.
                                We may also disclose information where required by law.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">5. Data Retention</h2>
                            <p>
                                We retain your personal data for as long as your account is active or as needed to
                                provide our services. You may request deletion of your account and associated data
                                at any time by contacting us.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">6. Security</h2>
                            <p>
                                We implement industry-standard security measures to protect your information.
                                However, no method of transmission over the internet is 100% secure, and we
                                cannot guarantee absolute security.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">7. Your Rights</h2>
                            <p>Depending on your location, you may have the right to:</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                <li>Access the personal data we hold about you</li>
                                <li>Request correction or deletion of your data</li>
                                <li>Object to or restrict processing of your data</li>
                                <li>Data portability</li>
                            </ul>
                            <p>To exercise these rights, please contact us at the details below.</p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">8. Children&apos;s Privacy</h2>
                            <p>
                                NoCap is not directed to children under the age of 13. We do not knowingly collect
                                personal information from children. If you believe a child has provided us with
                                personal data, please contact us immediately.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">9. Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy from time to time. We will notify you of any
                                significant changes by updating the date at the top of this page. Continued use of
                                NoCap after changes constitutes your acceptance of the updated policy.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">10. Contact Us</h2>
                            <p>
                                If you have any questions or concerns about this Privacy Policy, please contact us at:
                            </p>
                            <p className="text-foreground font-medium">support@nocap.app</p>
                        </div>

                    </div>
                </Container>
            </Wrapper>
        </section>
    );
};

export default PrivacyPolicyPage;

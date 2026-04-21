import { Container, Wrapper } from "@/components";
import SectionBadge from "@/components/ui/section-badge";

const TermsAndConditionsPage = () => {
    return (
        <section className="w-full relative flex items-center justify-center flex-col px-4 md:px-0 py-8">
            <Wrapper className="flex flex-col items-center justify-center py-12 relative scroll-mt-20">
                <Container>
                    <div className="max-w-2xl mx-auto text-start md:text-center">
                        <SectionBadge title="Legal" />
                        <h1 className="text-3xl lg:text-4xl font-semibold mt-6">
                            Terms &amp; Conditions
                        </h1>
                        <p className="text-muted-foreground mt-4">
                            Last updated: April 21, 2026
                        </p>
                    </div>
                </Container>

                <Container>
                    <div className="max-w-2xl mx-auto py-10 space-y-8 text-muted-foreground">

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
                            <p>
                                By downloading, installing, or using the NoCap application or website (collectively,
                                the &quot;Service&quot;), you agree to be bound by these Terms &amp; Conditions. If you do not
                                agree, please do not use the Service.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">2. Use of the Service</h2>
                            <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You must not:</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                <li>Use the Service in any way that violates applicable laws or regulations</li>
                                <li>Attempt to gain unauthorized access to any part of the Service</li>
                                <li>Interfere with or disrupt the integrity or performance of the Service</li>
                                <li>Transmit any harmful, offensive, or disruptive content</li>
                                <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">3. Accounts</h2>
                            <p>
                                You are responsible for maintaining the confidentiality of your account credentials
                                and for all activity that occurs under your account. You must notify us immediately
                                of any unauthorized use of your account. NoCap reserves the right to suspend or
                                terminate accounts that violate these Terms.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">4. Subscriptions &amp; Payments</h2>
                            <p>
                                Certain features of the Service require a paid subscription. By subscribing, you
                                authorize us to charge the applicable fees to your chosen payment method on a
                                recurring basis. All fees are non-refundable except where required by law.
                                We reserve the right to modify pricing with reasonable advance notice.
                            </p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                <li><strong className="text-foreground">Free plan</strong> — available at no cost, limited features</li>
                                <li><strong className="text-foreground">Monthly plan</strong> — billed monthly at $15.00 after a 2-week free trial</li>
                                <li><strong className="text-foreground">Yearly plan</strong> — billed annually at $160.00 ($13.33/month)</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">5. Free Trials</h2>
                            <p>
                                Where a free trial is offered, you will not be charged until the trial period ends.
                                You may cancel at any time before the trial period expires to avoid being charged.
                                Failure to cancel before the trial ends will result in automatic conversion to the
                                paid subscription.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">6. Intellectual Property</h2>
                            <p>
                                All content, features, and functionality of the Service — including but not limited
                                to text, graphics, logos, and software — are the exclusive property of MUKEAPPS LLC and
                                are protected by applicable intellectual property laws. You may not reproduce,
                                distribute, or create derivative works without our express written consent.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">7. User Content</h2>
                            <p>
                                You retain ownership of any content you create within the Service (e.g., habits,
                                stacks, notes). By submitting content, you grant MUKEAPPS LLC a non-exclusive, worldwide,
                                royalty-free license to use, store, and display that content solely to provide the
                                Service to you.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">8. Disclaimer of Warranties</h2>
                            <p>
                                The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
                                express or implied. MUKEAPPS LLC does not warrant that the Service will be uninterrupted,
                                error-free, or free of viruses or other harmful components.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">9. Limitation of Liability</h2>
                            <p>
                                To the fullest extent permitted by law, MUKEAPPS LLC shall not be liable for any indirect,
                                incidental, special, consequential, or punitive damages arising from your use of
                                the Service, even if we have been advised of the possibility of such damages.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">10. Termination</h2>
                            <p>
                                We reserve the right to suspend or terminate your access to the Service at our
                                sole discretion, without notice, for conduct that we believe violates these Terms
                                or is harmful to other users, us, or third parties, or for any other reason.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">11. Changes to Terms</h2>
                            <p>
                                We may update these Terms from time to time. We will notify you of material changes
                                by updating the date at the top of this page. Continued use of the Service after
                                changes constitutes your acceptance of the revised Terms.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">12. Governing Law</h2>
                            <p>
                                These Terms shall be governed by and construed in accordance with applicable law.
                                Any disputes arising under these Terms shall be subject to the exclusive jurisdiction
                                of the competent courts.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">13. Contact Us</h2>
                            <p>
                                If you have any questions about these Terms &amp; Conditions, please contact us at:
                            </p>
                            <p className="text-foreground font-medium">support@nocap.app</p>
                        </div>

                    </div>
                </Container>
            </Wrapper>
        </section>
    );
};

export default TermsAndConditionsPage;

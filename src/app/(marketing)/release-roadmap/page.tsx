import { Container, Wrapper } from "@/components";
import SectionBadge from "@/components/ui/section-badge";

const phases = [
    {
        color: "#7C6EF8",
        colorBg: "rgba(124,110,248,0.12)",
        date: "July 1, 2026",
        tag: "Phase 1 · KickStarter Prep",
        title: "Apply for KickStarter",
        items: [
            { icon: "📋", text: "Submit KickStarter application" },
            { icon: "🔒", text: "No publishing — app stays private" },
        ],
    },
    {
        color: "#22C55E",
        colorBg: "rgba(34,197,94,0.1)",
        date: "August 1, 2026",
        tag: "Phase 2 · Store Submissions",
        title: "Apply for iOS & Android production build review",
        items: [
            { icon: "🍎", text: "Submit iOS build for App Store production review" },
            { icon: "🤖", text: "Submit Android build for Play Store production review" },
        ],
    },
    {
        color: "#F59E0B",
        colorBg: "rgba(245,158,11,0.1)",
        date: "September 1, 2026",
        tag: "Phase 3 · KickStarter Live + Beta",
        title: "KickStarter publish · Android Beta · iOS Beta",
        items: [
            { icon: "🚀", text: "Publish KickStarter campaign" },
            { icon: "🤖", text: "Android Beta release" },
            { icon: "🍎", text: "iOS Beta release" },
            { icon: "⭐", text: "Pay influencers to promote the app on KickStarter" },
        ],
    },
    {
        color: "#F97316",
        colorBg: "rgba(249,115,22,0.1)",
        date: "December 1, 2026",
        tag: "Phase 4 · Full Launch",
        title: "End of KickStarter · iOS & Android production release",
        items: [
            { icon: "🏁", text: "KickStarter campaign closes" },
            { icon: "🍎", text: "iOS production release on App Store" },
            { icon: "🤖", text: "Android production release on Play Store" },
            { icon: "⭐", text: "Pay influencers to promote the app on iOS & Android" },
        ],
    },
];

const gapLabels = ["1 month", "1 month", "3 months — KickStarter campaign window"];

const ReleaseRoadmapPage = () => {
    return (
        <section className="w-full relative flex items-center justify-center flex-col px-4 md:px-0 py-8">
            <Wrapper className="flex flex-col items-center justify-center py-12 relative">
                <Container>
                    <div className="max-w-2xl mx-auto text-start md:text-center">
                        <SectionBadge title="Release Roadmap" />
                        <h1 className="text-3xl lg:text-4xl font-semibold mt-6">
                            NoCaps <span className="text-primary">2026</span>
                        </h1>
                        <p className="text-muted-foreground mt-4">
                            Four milestones from KickStarter application to production launch.
                        </p>
                    </div>
                </Container>

                <Container>
                    <div className="max-w-[760px] mx-auto py-12">

                        {/* Timeline */}
                        <div className="relative">
                            {/* Vertical line */}
                            <div
                                className="absolute left-[19px] top-0 bottom-0 w-px"
                                style={{
                                    background: "linear-gradient(to bottom, #7C6EF8 0%, rgba(255,255,255,0.07) 100%)",
                                }}
                            />

                            {phases.map((phase, i) => (
                                <div key={phase.date}>
                                    {/* Phase row */}
                                    <div className="flex gap-7 mb-10">
                                        {/* Dot */}
                                        <div className="flex-none w-10 flex flex-col items-center pt-[18px] z-10">
                                            <div
                                                className="w-[14px] h-[14px] rounded-full border-2 bg-background flex-shrink-0"
                                                style={{ borderColor: phase.color }}
                                            />
                                        </div>

                                        {/* Card */}
                                        <div className="flex-1 bg-card border border-border rounded-2xl px-7 py-6 hover:border-border/60 transition-colors">
                                            {/* Meta */}
                                            <div className="flex items-center gap-2.5 mb-3.5 flex-wrap">
                                                <span
                                                    className="text-[13px] font-semibold px-3 py-1 rounded-full"
                                                    style={{ background: phase.colorBg, color: phase.color }}
                                                >
                                                    {phase.date}
                                                </span>
                                                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                                                    {phase.tag}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <p className="text-[18px] font-semibold text-foreground mb-3.5 leading-snug">
                                                {phase.title}
                                            </p>

                                            {/* Items */}
                                            <ul className="flex flex-col gap-2">
                                                {phase.items.map((item) => (
                                                    <li key={item.text} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                                                        <span
                                                            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 text-[11px]"
                                                            style={{ background: phase.colorBg }}
                                                        >
                                                            {item.icon}
                                                        </span>
                                                        {item.text}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Gap label */}
                                    {i < gapLabels.length && (
                                        <div className="flex items-center gap-3 ml-[68px] -mt-4 mb-6 text-[11px] font-medium text-muted-foreground tracking-wide">
                                            <span className="flex-none w-5 h-px bg-border" />
                                            {gapLabels[i]}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Summary card */}
                        <div className="mt-4 bg-card border border-border rounded-2xl overflow-hidden">
                            <div className="px-7 py-5 border-b border-border/50">
                                <h2 className="text-[15px] font-semibold text-foreground">Timeline summary</h2>
                                <p className="text-[13px] text-muted-foreground mt-0.5">Key intervals across the 5-month runway</p>
                            </div>

                            {/* Stats grid */}
                            <div className="grid grid-cols-3 max-sm:grid-cols-1">
                                {[
                                    { val: "1", unit: "mo", label: "KickStarter application to store submissions" },
                                    { val: "1", unit: "mo", label: "Store submissions to beta & KickStarter launch" },
                                    { val: "3", unit: "mo", label: "KickStarter campaign window before prod release" },
                                ].map((stat, i) => (
                                    <div
                                        key={i}
                                        className="px-6 py-5 border-r border-border/50 max-sm:border-r-0 max-sm:border-b last:border-r-0 last:border-b-0"
                                    >
                                        <div className="text-[28px] font-bold text-foreground leading-none mb-1.5">
                                            {stat.val}
                                            <span className="text-base text-muted-foreground font-normal ml-0.5">{stat.unit}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground leading-snug">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Interval rows */}
                            <div className="border-t border-border/50">
                                {[
                                    { label: "Jul 1 → Aug 1", desc: "KickStarter application to store submissions", val: "1 month", highlight: false },
                                    { label: "Aug 1 → Sep 1", desc: "Store submissions to beta & KickStarter launch", val: "1 month", highlight: false },
                                    { label: "Sep 1 → Dec 1", desc: "KickStarter campaign window", val: "3 months", highlight: false },
                                    { label: "Jul 1 → Dec 1", desc: "Total runway to production launch", val: "5 months", highlight: true },
                                ].map((row, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between px-7 py-3.5 border-b border-border/50 last:border-b-0 gap-4"
                                    >
                                        <span className="text-[13px] text-muted-foreground">
                                            <span className="font-medium text-foreground/70">{row.label}</span>
                                            <span className="mx-2 text-border">·</span>
                                            {row.desc}
                                        </span>
                                        <span
                                            className={`text-[13px] font-medium whitespace-nowrap ${row.highlight ? "text-foreground font-semibold" : "text-foreground/80"}`}
                                        >
                                            {row.val}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </Container>
            </Wrapper>
        </section>
    );
};

export default ReleaseRoadmapPage;

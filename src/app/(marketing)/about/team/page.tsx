import { Container, Wrapper } from "@/components";
import SectionBadge from "@/components/ui/section-badge";
import Image from "next/image";

const team = [
    {
        initials: "FM",
        avatarColor: "bg-emerald-600",
        photo: "/assets/team/franck.jpg",
        name: "Franck Mukendi",
        role: "CEO",
        location: "Atlanta, GA",
        bio: "Senior Software engineer and productivity obsessive building NoCap to solve his own problem. Leads company vision, strategy, and overall product direction.",
    },
    {
        initials: "YM",
        avatarColor: "bg-amber-500",
        name: "Yannick M.",
        role: "COO",
        location: "Austin, TX",
        bio: "IT professional with 10+ years at the intersection of people, processes, and technology. Turns ideas into practical, user-focused products and keeps operations running smoothly.",
    },
    {
        initials: "GM",
        avatarColor: "bg-blue-600",
        name: "Geoffrey M.",
        role: "CTO",
        location: "Toronto, Canada",
        bio: "Architects NoCap's technical foundation — from AI infrastructure and backend systems to cross-platform mobile delivery. Translates product vision into scalable, reliable engineering that ships.",
    },
];

const TeamPage = () => {
    return (
        <section className="w-full relative flex items-center justify-center flex-col px-4 md:px-0 py-8">
            <Wrapper className="flex flex-col items-center justify-center py-12 relative scroll-mt-20">
                <Container>
                    <div className="max-w-2xl mx-auto text-start md:text-center">
                        <SectionBadge title="The Team" />
                        <h1 className="text-3xl lg:text-4xl font-semibold mt-6">
                            The people building NoCap
                        </h1>
                        <p className="text-muted-foreground mt-4">
                            A focused team of builders shipping habit intelligence from the US and Canada.
                        </p>
                    </div>
                </Container>

                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 max-w-4xl mx-auto">
                        {team.map((member) => (
                            <div
                                key={member.name}
                                className="flex flex-col items-center text-center rounded-xl border border-border bg-foreground/[0.03] p-8 gap-4"
                            >
                                {'photo' in member && member.photo ? (
                                    <Image
                                        src={member.photo}
                                        alt={member.name}
                                        width={80}
                                        height={80}
                                        className="rounded-full object-cover object-top w-20 h-20"
                                    />
                                ) : (
                                    <div className={`w-16 h-16 rounded-full ${member.avatarColor} flex items-center justify-center`}>
                                        <span className="text-white font-bold text-lg tracking-wide">
                                            {member.initials}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">{member.name}</h2>
                                    <p className="text-sm font-medium text-primary">{member.role}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{member.location}</p>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {member.bio}
                                </p>
                            </div>
                        ))}
                    </div>
                </Container>
            </Wrapper>
        </section>
    );
};

export default TeamPage;

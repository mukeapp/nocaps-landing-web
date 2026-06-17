import { Container, Wrapper } from "@/components";
import SectionBadge from "@/components/ui/section-badge";

const videos = [
    {
        id: "MEjk70x-Y2k",
        title: "First Look & Login",
    },
    {
        id: "OQckfvdCkNg",
        title: "What Is a Habit Stack and a Habit Market?",
    },
    {
        id: "wayZBAQtfcA",
        title: "Habit AI Scoring Explained",
    },
    {
        id: "8OgdLesuFwU",
        title: "Score All Habit Items with One Click",
    },
    {
        id: "CZ6HjRJg9jI",
        title: "Habit Swap: Let AI Replace Your Poor Habits",
    },
    {
        id: "dqLK0Wf19Ps",
        title: "Generate New Habits with AI",
    },
    {
        id: "5VboB05IRcc",
        title: "Share Your Habits with the World",
    },
];

const TechDemoPage = () => {
    return (
        <section className="w-full relative flex items-center justify-center flex-col px-4 md:px-0 py-8">
            <Wrapper className="flex flex-col items-center justify-center py-12 relative">
                <Container>
                    <div className="max-w-2xl mx-auto text-start md:text-center">
                        <SectionBadge title="Tech Demo" />
                        <h1 className="text-3xl lg:text-4xl font-semibold mt-6">
                            See NoCaps in action
                        </h1>
                        <p className="text-muted-foreground mt-4">
                            A step-by-step walkthrough of the core features — from first login to sharing habits with the world.
                        </p>
                    </div>
                </Container>

                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12">
                        {videos.map((video, index) => {
                            const isLastOdd = videos.length % 2 !== 0 && index === videos.length - 1;
                            return (
                                <div
                                    key={video.id}
                                    className={`flex flex-col gap-3 ${isLastOdd ? "md:col-span-2 md:max-w-2xl md:mx-auto w-full" : ""}`}
                                >
                                    <h2 className="text-base font-semibold text-foreground">
                                        <span className="text-primary mr-2">{index + 1}.</span>
                                        {video.title}
                                    </h2>
                                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-border shadow-md">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${video.id}`}
                                            title={video.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-full"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Container>
            </Wrapper>
        </section>
    );
};

export default TechDemoPage;

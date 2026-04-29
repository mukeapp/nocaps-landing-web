"use client";

import { useState } from "react";
import postsData from "@/constants/blog-posts.json";

interface Post {
    id: number;
    date: string;
    tag: string;
    tagColor: string;
    title: string;
    excerpt: string;
    readTime: string;
    status: string;
}

const posts: Post[] = postsData;

const Dot = ({ color, status }: { color: string; status: string }) => (
    <div
        style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 16px ${color}88, 0 0 4px ${color}44`,
            flexShrink: 0,
            position: "relative",
            zIndex: 2,
        }}
    >
        {status === "live" && (
            <div
                style={{
                    position: "absolute",
                    top: -4,
                    left: -4,
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    border: `2px solid ${color}44`,
                    animation: "pulse 2.5s ease-in-out infinite",
                }}
            />
        )}
    </div>
);

const Card = ({
    post,
    hovered,
    setHovered,
}: {
    post: Post;
    hovered: boolean;
    setHovered: (v: boolean) => void;
}) => (
    <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
            background: hovered
                ? `linear-gradient(135deg, ${post.tagColor}08, ${post.tagColor}14)`
                : "#0d1117",
            border: `1px solid ${hovered ? post.tagColor + "55" : "#1c2333"}`,
            borderRadius: 16,
            padding: "24px 28px",
            maxWidth: 380,
            width: "100%",
            cursor: "pointer",
            transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: hovered ? "translateY(-3px)" : "translateY(0)",
            boxShadow: hovered
                ? `0 12px 40px ${post.tagColor}15, 0 0 0 1px ${post.tagColor}22`
                : "0 2px 8px rgba(0,0,0,0.3)",
        }}
    >
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
            }}
        >
            <span
                style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    fontWeight: 700,
                    color: post.tagColor,
                    background: post.tagColor + "18",
                    padding: "4px 10px",
                    borderRadius: 6,
                    letterSpacing: "0.08em",
                }}
            >
                {post.tag}
            </span>
            <span
                style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: "#4a5568",
                }}
            >
                {post.readTime}
            </span>
        </div>
        <h3
            style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: "#e2e8f0",
                margin: "0 0 10px 0",
                lineHeight: 1.35,
                letterSpacing: "-0.01em",
            }}
        >
            {post.title}
        </h3>
        <p
            style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: "#7a8599",
                margin: 0,
                lineHeight: 1.65,
            }}
        >
            {post.excerpt}
        </p>
        <div
            style={{
                marginTop: 18,
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: post.tagColor,
                opacity: hovered ? 1 : 0.7,
                transition: "opacity 0.3s ease",
            }}
        >
            Read post
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                    d="M3 7h8m0 0L8 4m3 3L8 10"
                    stroke={post.tagColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    </div>
);

const PostCard = ({ post, index }: { post: Post; index: number }) => {
    const [hovered, setHovered] = useState(false);
    const isLeft = index % 2 === 0;

    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                position: "relative",
                marginBottom: 0,
            }}
        >
            {/* Left content or spacer */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: 40,
                }}
            >
                {isLeft && (
                    <Card post={post} hovered={hovered} setHovered={setHovered} />
                )}
                {!isLeft && (
                    <div
                        style={{
                            paddingTop: 8,
                            textAlign: "right",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 13,
                            color: "#555e6e",
                            letterSpacing: "0.02em",
                        }}
                    >
                        {post.date}
                    </div>
                )}
            </div>

            {/* Center dot */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 18,
                    flexShrink: 0,
                    paddingTop: 18,
                }}
            >
                <Dot color={post.tagColor} status={post.status} />
            </div>

            {/* Right content or spacer */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "flex-start",
                    paddingLeft: 40,
                }}
            >
                {!isLeft && (
                    <Card post={post} hovered={hovered} setHovered={setHovered} />
                )}
                {isLeft && (
                    <div
                        style={{
                            paddingTop: 8,
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 13,
                            color: "#555e6e",
                            letterSpacing: "0.02em",
                        }}
                    >
                        {post.date}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function BlogPage() {
    const [filter, setFilter] = useState("ALL");
    const tags = ["ALL", ...Array.from(new Set(posts.map((p) => p.tag)))];
    const filtered = filter === "ALL" ? posts : posts.filter((p) => p.tag === filter);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#080c14",
                color: "#e2e8f0",
                position: "relative",
                overflow: "hidden",
                width: "100%",
            }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.5); opacity: 0; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }

        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #080c14; }
        ::-webkit-scrollbar-thumb { background: #1c2333; border-radius: 3px; }
      `}</style>

            {/* Ambient blobs */}
            <div
                style={{
                    position: "fixed",
                    top: -200,
                    right: -200,
                    width: 600,
                    height: 600,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(108,138,255,0.04) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "fixed",
                    bottom: -300,
                    left: -200,
                    width: 700,
                    height: 700,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(0,229,160,0.03) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            {/* Header */}
            <header
                style={{
                    textAlign: "center",
                    padding: "72px 24px 24px",
                    position: "relative",
                    animation: "fadeInUp 0.8s ease-out",
                }}
            >
                <div
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12,
                        color: "#00e5a0",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        marginBottom: 16,
                    }}
                >
                </div>
                <h1
                    style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: 48,
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        background: "linear-gradient(135deg, #e2e8f0 0%, #7a8599 50%, #e2e8f0 100%)",
                        backgroundSize: "200% auto",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        marginBottom: 16,
                        lineHeight: 1.15,
                    }}
                >
                    Blog Roadmap
                </h1>
                <p
                    style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 16,
                        color: "#4a5568",
                        maxWidth: 480,
                        margin: "0 auto",
                        lineHeight: 1.7,
                    }}
                >
                    Follow our progress as we build, ship, and share what we&apos;ve learned along the way.
                </p>
            </header>

            {/* Filter bar */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: 8,
                    padding: "24px 24px 56px",
                    animation: "fadeInUp 0.8s ease-out 0.15s both",
                }}
            >
                {tags.map((tag) => {
                    const tagPost = posts.find((p) => p.tag === tag);
                    const color = tag === "ALL" ? "#e2e8f0" : tagPost?.tagColor;
                    const active = filter === tag;
                    return (
                        <button
                            key={tag}
                            onClick={() => setFilter(tag)}
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 11,
                                fontWeight: 600,
                                letterSpacing: "0.06em",
                                color: active ? "#080c14" : color,
                                background: active ? color : "transparent",
                                border: `1px solid ${active ? color : color + "33"}`,
                                borderRadius: 8,
                                padding: "7px 16px",
                                cursor: "pointer",
                                transition: "all 0.25s ease",
                            }}
                        >
                            {tag}
                        </button>
                    );
                })}
            </div>

            {/* Timeline */}
            <div
                style={{
                    position: "relative",
                    maxWidth: 960,
                    margin: "0 auto",
                    padding: "0 24px 120px",
                }}
            >
                {/* Vertical line */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: 0,
                        bottom: 0,
                        width: 2,
                        background: "linear-gradient(to bottom, #1c233300, #1c2333 5%, #1c2333 95%, #1c233300)",
                        transform: "translateX(-50%)",
                        zIndex: 1,
                    }}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
                    {filtered.map((post, i) => (
                        <div
                            key={post.id}
                            style={{ animation: `fadeInUp 0.6s ease-out ${0.1 * i}s both` }}
                        >
                            <PostCard post={post} index={i} />
                        </div>
                    ))}
                </div>

                {/* End marker */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 56,
                        position: "relative",
                        zIndex: 2,
                    }}
                >
                    <div
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 12,
                            color: "#4a5568",
                            background: "#0d1117",
                            border: "1px solid #1c2333",
                            borderRadius: 20,
                            padding: "8px 20px",
                            letterSpacing: "0.08em",
                        }}
                    >
                        ↑ More coming soon
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react"; // Added Loader2
import Reveal from "@/components/Reveal";
import { motion } from "motion/react";

// 1. Configuration constants
const REPO_USER = "TrackViewOrg";
const REPO_NAME = "TrackView-Data";
const DEFAULT_BRANCH = "main";

export default function Page() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [cdnUrl, setCdnUrl] = useState(
        `https://cdn.jsdelivr.net/gh/${REPO_USER}/${REPO_NAME}@${DEFAULT_BRANCH}`,
    );

    useEffect(() => {
        const fetchData = async () => {
            let currentBaseUrl = cdnUrl;

            try {
                const commitRes = await fetch(
                    `https://api.github.com/repos/${REPO_USER}/${REPO_NAME}/commits/${DEFAULT_BRANCH}`,
                );

                if (commitRes.ok) {
                    const commitData = await commitRes.json();
                    currentBaseUrl = `https://cdn.jsdelivr.net/gh/${REPO_USER}/${REPO_NAME}@${commitData.sha}`;
                    setCdnUrl(currentBaseUrl);
                } else {
                    console.warn(
                        "Rate limit or error fetching commit SHA, falling back to branch name alias.",
                    );
                }

                const postsRes = await fetch(`${currentBaseUrl}/Blog/posts.json`);
                const postsData = await postsRes.json();

                setPosts(postsData.posts || []);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-7xl mx-auto px-6 md:px-10 w-full pt-24 pb-24">
                {/* 3. Header & Search Section */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-16 gap-8">
                    <div className="space-y-3 max-w-lg">
                        <Reveal>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-foreground">
                                Writings
                            </h1>
                        </Reveal>
                        <Reveal delay={0.4}>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                A collection of thoughts, updates, and engineering changelogs.
                            </p>
                        </Reveal>
                    </div>

                    {/* Minimal Search Bar */}
                    <Reveal delay={0.5}>
                        <div className="relative w-full md:w-80 group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 group-focus-within:text-foreground transition-colors duration-300">
                                <Search size={18} strokeWidth={2} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-muted/40 hover:bg-muted/60 focus:bg-background border border-transparent focus:border-border/50 focus:ring-1 focus:ring-border rounded-xl outline-none transition-all duration-300 placeholder:text-muted-foreground/50 text-sm"
                            />
                        </div>
                    </Reveal>
                </div>

                {/* 4. Grid Layout */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {[...Array(6)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : (
                    <>
                        {filteredPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                                {filteredPosts.map((post, index) => (
                                    <BlogCard
                                        key={post.id}
                                        post={post}
                                        index={index}
                                        cdnUrl={cdnUrl}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-32 text-center border border-dashed border-border rounded-xl">
                                <p className="text-muted-foreground text-lg">
                                    No articles found matching "{searchQuery}".
                                </p>
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="mt-4 text-sm font-medium text-foreground hover:underline underline-offset-4"
                                >
                                    Clear search
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// 5. Individual Card Component
function BlogCard({
                      post,
                      index,
                      cdnUrl,
                  }: {
    post: any;
    index: number;
    cdnUrl: string;
}) {
    const [imgError, setImgError] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false); // Track if image has finished loading

    const date = new Date(post.created_at * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const imageUrl = `${cdnUrl}/Blog/headers/${post.id}.webp`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link
                href={`/blog/${post.id}`}
                className="group flex flex-col gap-4 h-full"
            >
                {/* Image Container */}
                <div className="w-full aspect-[16/10] relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 shadow-sm">
                    {/* LOADING STATE: Centered Spinner */}
                    {/* Only show if image is NOT loaded yet and has NOT failed */}
                    {!imgLoaded && !imgError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-10">
                            <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
                        </div>
                    )}

                    {!imgError ? (
                        <>
                            <img
                                src={imageUrl}
                                alt={post.title}
                                loading="lazy"
                                // We start with opacity-0 and toggle to opacity-100 when onLoad fires
                                className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.01] ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                                onLoad={() => setImgLoaded(true)}
                                onError={() => setImgError(true)}
                            />

                            {/* Overlay: Minimalist darken on hover */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                <span className="flex items-center gap-2 text-white font-medium text-sm tracking-wide px-5 py-2.5 rounded-full border border-white/10 bg-white/1 backdrop-blur-md transition-transform duration-600 translate-y-0.5 group-hover:translate-y-0">
                  Read Article
                </span>
                            </div>
                        </>
                    ) : (
                        // Fallback
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-2">
              <span className="text-[10px] uppercase tracking-widest font-semibold">
                Image Unavailable
              </span>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex flex-col gap-2">
                    <div className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-widest pl-1">
                        {date}
                    </div>
                    <h2 className="text-2xl font-bold text-foreground font-serif leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                    </h2>
                </div>
            </Link>
        </motion.div>
    );
}

// 6. Skeleton Component
function SkeletonCard() {
    return (
        <div className="flex flex-col gap-4 animate-pulse">
            <div className="w-full aspect-[16/10] bg-muted/70 rounded-xl border border-border/50"></div>
            <div className="flex flex-col gap-3 px-1">
                <div className="h-3 w-24 bg-muted/70 rounded-full"></div>
                <div className="space-y-2">
                    <div className="h-6 w-full bg-muted/70 rounded-md"></div>
                    <div className="h-6 w-2/3 bg-muted/70 rounded-md"></div>
                </div>
            </div>
        </div>
    );
}

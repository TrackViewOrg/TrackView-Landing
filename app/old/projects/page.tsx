"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Github, Star, GitFork } from "lucide-react";
import Reveal from "@/components/Reveal";
import { motion } from "motion/react";

// 1. Mock Data with sizing logic
const PROJECTS = [
  {
    id: "trackview-core",
    title: "TrackView Core",
    description:
      "The intelligent data visualization engine powering our analytics. Handles millions of data points with WebGL acceleration.",
    tags: ["TypeScript", "WebGL", "Rust"],
    stars: 1240,
    size: "large", // spans 2 cols, 2 rows
    image:
      "https://cdn.jsdelivr.net/gh/TrackViewOrg/TrackView-Data@3669147/Blog/headers/trackview-core.webp", // Mock URL
    link: "https://github.com",
  },
  {
    id: "ui-kit",
    title: "Design System",
    description:
      "An open-source component library focused on accessibility and dark mode.",
    tags: ["React", "Tailwind"],
    stars: 85,
    size: "tall", // spans 1 col, 2 rows
    link: "https://github.com",
  },
  {
    id: "cli",
    title: "TV-CLI",
    description: "Command line tool for scaffolding dashboards instantly.",
    tags: ["Go"],
    stars: 342,
    size: "small", // spans 1 col, 1 row
    link: "https://github.com",
  },
  {
    id: "docs",
    title: "Documentation",
    description: "Comprehensive guides and API references.",
    tags: ["MDX", "Next.js"],
    stars: 40,
    size: "small",
    link: "https://github.com",
  },
  {
    id: "mobile",
    title: "Mobile Companion",
    description:
      "Monitor your stats on the go with real-time push notifications.",
    tags: ["React Native"],
    stars: 120,
    size: "wide", // spans 2 cols, 1 row
    link: "https://github.com",
  },
];

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 800);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full pt-24 pb-24">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-foreground mb-4">
              Selected Work
            </h1>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="text-muted-foreground text-lg leading-relaxed">
              A collection of open source tools, experiments, and production
              applications.
            </p>
          </Reveal>
        </div>

        {/* The Bento Grid */}
        {loading ? (
          <BentoSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[200px] gap-4 md:gap-6">
            {PROJECTS.map((project, index) => (
              <BentoCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BentoCard({ project, index }: { project: any; index: number }) {
  // Determine CSS classes based on size prop
  const getSizeClasses = (size: string) => {
    switch (size) {
      case "large":
        return "md:col-span-2 md:row-span-2";
      case "tall":
        return "md:col-span-1 md:row-span-2";
      case "wide":
        return "md:col-span-2 md:row-span-1";
      case "small":
      default:
        return "md:col-span-1 md:row-span-1";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={getSizeClasses(project.size)}
    >
      <Link
        href={project.link}
        target="_blank"
        className={`
                    group relative overflow-hidden rounded-3xl bg-muted/30 border border-border/50
                    hover:border-border hover:shadow-md transition-all duration-300
                    flex flex-col justify-between p-6 h-full
                `}
      >
        {/* Background decoration (optional) */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Top Area: Icon & Arrow */}
        <div className="flex justify-between items-start z-10">
          <div className="p-2 bg-background rounded-full border border-border/50 shadow-sm">
            <Github size={20} className="text-foreground" />
          </div>
          <ArrowUpRight className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </div>

        {/* Content Area */}
        <div className="z-10 mt-auto">
          <h3 className="text-xl font-bold font-serif mb-2 text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {project.description}
          </p>

          {/* Footer: Tags & Stars */}
          <div className="flex items-center justify-between pt-4 border-t border-border/20">
            <div className="flex gap-2">
              {project.tags.slice(0, 2).map((tag: string) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono uppercase bg-muted/60 px-2 py-1 rounded text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            {project.stars > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                <Star size={12} className="fill-muted-foreground/30" />
                {project.stars}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function BentoSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[200px] gap-4 md:gap-6 animate-pulse">
      <div className="md:col-span-2 md:row-span-2 bg-muted/40 rounded-3xl"></div>
      <div className="md:col-span-1 md:row-span-2 bg-muted/40 rounded-3xl"></div>
      <div className="md:col-span-1 md:row-span-1 bg-muted/40 rounded-3xl"></div>
      <div className="md:col-span-1 md:row-span-1 bg-muted/40 rounded-3xl"></div>
      <div className="md:col-span-2 md:row-span-1 bg-muted/40 rounded-3xl"></div>
    </div>
  );
}

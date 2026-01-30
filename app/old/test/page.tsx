'use client';

import React from 'react';
import { Code, MapPin, Trophy } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full pt-24 pb-24">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-foreground mb-4">
            The Team
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Well this is awkward
          </p>
        </div>

        {/* Main Profile Card */}
        <div className="group relative rounded-3xl border border-border/50 bg-muted/30 overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-all duration-300">
          {/* LEFT: The "Driver Profile" Visual */}
          <div className="w-full md:w-1/3 bg-muted/20 border-b md:border-b-0 md:border-r border-border/50 p-8 flex flex-col justify-between">
            {/* Avatar Area */}
            <div>
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-muted border border-border/60 mb-6 overflow-hidden">
                {/* Replace src with your actual avatar */}
                <img
                  src="https://i.imgur.com/TG0etAl.jpeg"
                  alt="Founder"
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
              </div>

              <h3 className="text-2xl font-bold font-serif text-foreground">
                Martin Ortiz
              </h3>
              <p className="text-sm text-muted-foreground font-mono mt-1">
                Founder & Lead Eng.
              </p>
            </div>

            {/* Meta Details (Minimalist) */}
            <div className="mt-8 space-y-3 text-xs font-mono text-muted-foreground/80">
              <div className="flex items-center gap-2">
                <MapPin size={12} />
                <span>Based in [Location]</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy size={12} />
                <span>iRacing Class A</span>
              </div>
              <div className="flex items-center gap-2">
                <Code size={12} />
                <span>Full Stack Dev</span>
              </div>
            </div>
          </div>

          {/* RIGHT: The Manifesto */}
          <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center bg-transparent">
            <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
              <p className="text-4xl text-foreground font-serif leading-relaxed mb-6">
                TrackView is a solo project born out of frustration.
              </p>
              <p className="text-muted-foreground text-base leading-relaxed mb-4">
                As a sim racer, I found that existing telemetry tools were
                either incredibly powerful but user-hostile (MoTeC), or friendly
                but lacking depth. There was no middle ground for the driver who
                wants engineering-grade insights without a degree in data
                science.
              </p>
              <p className="text-muted-foreground text-base leading-relaxed">
                I handle the entire stack—from the Rust-based data ingestion
                engine to the React frontend and design system. This tight
                feedback loop allows me to build features on Sunday that I
                needed during my race on Saturday.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

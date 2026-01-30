'use client';

import React from 'react';
import { CircleDashed, Filter, Loader2, Search } from 'lucide-react';

// 1. Expanded Mock Data to simulate volume
const UPDATES = [
  // --- ACTIVE / PLANNED ---
  {
    id: '1',
    title: 'Real-time Collaboration',
    status: 'in-progress',
    date: 'Q3 2024',
    category: 'Feature',
    description: 'Multi-user editing with live cursors.',
    tags: ['WebSockets'],
  },
  {
    id: '2',
    title: 'API V3',
    status: 'in-progress',
    date: 'Q4 2024',
    category: 'Backend',
    description: 'GraphQL support and faster response times.',
    tags: ['API'],
  },
  {
    id: '3',
    title: 'Mobile Application',
    status: 'planned',
    date: 'Late 2024',
    category: 'Platform',
    description: 'Native iOS/Android view for dashboards.',
    tags: ['Mobile'],
  },
  {
    id: '4',
    title: 'AI Analysis',
    status: 'planned',
    date: 'TBD',
    category: 'Exp.',
    description: 'LLM-based anomaly summaries.',
    tags: ['AI'],
  },

  // --- COMPLETED (History) ---
  // Simulating many entries to show how the list handles volume
  {
    id: '5',
    title: 'Advanced Data Filters',
    status: 'completed',
    version: 'v2.1.0',
    date: '2023-10-12',
    category: 'Core',
    description: 'Added regex matching and boolean logic groups.',
    tags: ['UX'],
  },
  {
    id: '6',
    title: 'Dark Mode Overhaul',
    status: 'completed',
    version: 'v2.0.5',
    date: '2023-09-28',
    category: 'Design',
    description: 'High-contrast dark mode implementation.',
    tags: ['UI'],
  },
  {
    id: '7',
    title: 'SSO Integration',
    status: 'completed',
    version: 'v2.0.2',
    date: '2023-09-15',
    category: 'Security',
    description: 'SAML and OIDC support for enterprise clients.',
    tags: ['Auth'],
  },
  {
    id: '8',
    title: 'API Rate Limiting',
    status: 'completed',
    version: 'v2.0.1',
    date: '2023-08-15',
    category: 'Backend',
    description: 'Sliding window limits for stability.',
    tags: ['Infra'],
  },
  {
    id: '9',
    title: 'Dashboard PDF Export',
    status: 'completed',
    version: 'v1.9.0',
    date: '2023-07-22',
    category: 'Feature',
    description: 'High-res PDF generation for reports.',
    tags: ['Export'],
  },
  {
    id: '10',
    title: 'User Roles',
    status: 'completed',
    version: 'v1.8.5',
    date: '2023-06-10',
    category: 'Admin',
    description: 'Granular permission settings for teams.',
    tags: ['Access'],
  },
];

export default function UpdatesPage() {
  // Grouping Logic
  const inProgress = UPDATES.filter((u) => u.status === 'in-progress');
  const planned = UPDATES.filter((u) => u.status === 'planned');

  // Sort completed by date descending
  const completed = UPDATES.filter((u) => u.status === 'completed').sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full pt-24 pb-24">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-foreground mb-4">
            Dev Diaries
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            A transparent timeline of our product journey.
          </p>
        </div>

        {/* SECTION 1: THE HORIZON (Roadmap)
                    Cards work best here because there are usually fewer items
                    and they are "exciting" features users want to read about.
                */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Column: In Progress */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-amber-500 mb-2">
                <Loader2 size={18} className="animate-spin-slow" />
                <span className="font-serif font-bold text-lg text-foreground">
                  In Progress
                </span>
              </div>
              {inProgress.map((item) => (
                <RoadmapCard key={item.id} item={item} />
              ))}
            </div>

            {/* Column: Planned */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <CircleDashed size={18} />
                <span className="font-serif font-bold text-lg text-foreground">
                  Planned
                </span>
              </div>
              {planned.map((item) => (
                <RoadmapCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: THE ARCHIVE (Changelog)
                    A dense list view works best here. You can have 100 items
                    and it still looks neat and scannable.
                */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-serif font-bold text-foreground">
                Changelog History
              </h2>
              <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                {completed.length}
              </span>
            </div>

            {/* Fake Filter UI for aesthetic */}
            <div className="flex gap-2">
              <button className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors">
                <Search size={16} />
              </button>
              <button className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors">
                <Filter size={16} />
              </button>
            </div>
          </div>

          <div className="relative border-l border-border/40 ml-3 space-y-8">
            {completed.map((item, index) => (
              <ChangelogItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// COMPONENT: Cards for Roadmap (Bigger, more detail)
function RoadmapCard({ item }) {
  return (
    <div
      className="
            group p-5 rounded-xl bg-muted/30 border border-border/50
            hover:border-border hover:shadow-sm hover:bg-muted/40
            transition-all duration-200
        "
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 bg-muted/50 px-2 py-0.5 rounded-sm">
          {item.category}
        </span>
        <span className="text-xs text-muted-foreground font-mono">
          {item.date}
        </span>
      </div>

      <h3 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
        {item.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {item.description}
      </p>

      <div className="flex gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs text-muted-foreground/50 border border-border/30 px-1.5 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// COMPONENT: Dense List for History (Scalable)
function ChangelogItem({ item }) {
  // Format date nicely
  const dateObj = new Date(item.date);
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  return (
    <div className="relative pl-8 md:pl-12 group">
      {/* Timeline Dot */}
      <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-muted-foreground/20 ring-4 ring-background group-hover:bg-emerald-500/50 transition-colors"></div>

      <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6">
        {/* Date Column */}
        <div className="flex-shrink-0 w-24 text-xs font-mono text-muted-foreground/70">
          <span className="text-foreground font-bold">
            {month} {day}
          </span>
          , {year}
        </div>

        {/* Content Column */}
        <div className="flex-grow pb-8 border-b border-border/30 last:border-0 last:pb-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors cursor-default">
              {item.title}
            </h3>
            <span className="px-1.5 py-0.5 rounded bg-muted/50 text-[10px] font-mono text-muted-foreground border border-border/50">
              {item.version}
            </span>
          </div>

          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {item.description}
          </p>

          {/* Tags - Visible only on hover to reduce noise */}
          <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-muted-foreground/60 bg-muted/30 px-1.5 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  ArrowUpRight,
  Activity,
  MoveUpRight,
  GitGraph,
  Waves,
  MousePointerClick,
  TimerReset,
  type LucideIcon,
} from "lucide-react";
import { motion, type Variants } from "motion/react";
import Reveal from "@/components/Reveal";

// Interface for Method Data
interface Method {
  id: string;
  title: string;
  category: string;
  icon: LucideIcon;
  simple_desc: string;
  technical_desc: string;
  paper: {
    title: string;
    link: string;
  };
  sota?: boolean;
}

// 1. Expanded Data Structure
const METHODS: Method[] = [
  {
    id: "1",
    title: "Tire Slip Angle Optimization",
    category: "Physics-Informed ML",
    icon: Activity,
    simple_desc:
      "We analyse exactly how much your car slides before it loses grip, helping you ride the perfect edge of traction.",
    technical_desc:
      "Utilising a Bayesian Neural Network to estimate the peak friction coefficient (μ) relative to slip angle variations in real-time telemetry.",
    paper: {
      title: "Estimation of Tire-Road Friction Coefficients (arXiv:2104.xxxxx)",
      link: "https://arxiv.org",
    },
    sota: true,
  },
  {
    id: "2",
    title: "Trail Braking Decay Modeling",
    category: "Stochastic Analysis",
    icon: MoveUpRight,
    simple_desc:
      "Calculates the perfect curve for releasing the brake as you turn in, keeping the car's nose pinned to the apex.",
    technical_desc:
      "Applying Gaussian Process Regression to model the ideal brake pressure release gradient relative to steering input velocity.",
    paper: {
      title:
        "Optimal Braking Strategies in High-Speed Cornering (arXiv:1908.xxxxx)",
      link: "https://arxiv.org",
    },
  },
  {
    id: "3",
    title: "Suspension Damping FFT",
    category: "Signal Processing",
    icon: Waves,
    simple_desc:
      "Identifies if your suspension is too soft (bouncing) or too stiff (skipping) over bumps to maximise contact patch load.",
    technical_desc:
      "Performing Fast Fourier Transform (FFT) analysis on damper position sensors to isolate resonant frequencies and calculate damping ratios.",
    paper: {
      title: "Frequency Domain Analysis of Vehicle Dynamics (SAE 2020-01-xxxx)",
      link: "https://sae.org",
    },
  },
  {
    id: "4",
    title: "Ghost-Lap Trajectory",
    category: "Genetic Algorithms",
    icon: GitGraph,
    simple_desc:
      "Instead of just showing your best lap, we generate a theoretical 'perfect' racing line based on your car's specific physics.",
    technical_desc:
      "A localized Euler Spiral optimization algorithm that generates a time-optimal path constrained by vehicle g-force limits.",
    paper: {
      title:
        "Time-Optimal Path Planning for Autonomous Racing (arXiv:2003.xxxxx)",
      link: "https://arxiv.org",
    },
  },
  {
    id: "5",
    title: "Input Smoothness Scoring",
    category: "Pattern Recognition",
    icon: MousePointerClick,
    simple_desc:
      "Measures how jerky your steering and pedal inputs are, helping you unsettle the car less on entry and exit.",
    technical_desc:
      "Calculating the jerk (derivative of acceleration) of driver inputs and comparing against idealized smooth-spline baselines.",
    paper: {
      title: "Quantifying Driver Smoothness and Performance (ResearchGate)",
      link: "https://researchgate.net",
    },
  },
  {
    id: "6",
    title: "Optimal Shift Points",
    category: "Multivariable Regression",
    icon: TimerReset,
    simple_desc:
      "Tells you exactly what RPM to shift at for every single gear to maximise average acceleration down the straight.",
    technical_desc:
      "Modeling the engine torque curve and aerodynamic drag forces to solve for intersection points of tractive force across gear ratios.",
    paper: {
      title:
        "Powertrain Optimization Strategies for Lap Time (arXiv:2201.xxxxx)",
      link: "https://arxiv.org",
    },
  },
];

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 15,
    },
  },
};

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full pt-16 pb-24">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-foreground mb-4">
              The Analysis Engine
            </h1>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We extract insights using state-of-the-art machine learning models
              and physics engines derived from academic research.
            </p>
          </Reveal>
        </div>

        {/* The Grid: 2 Columns on Desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {METHODS.map((method, index) => (
            <MethodCard key={method.id} method={method} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function MethodCard({ method }: { method: Method }) {
  const Icon = method.icon;

  return (
    <motion.div
      variants={itemVariants}
      className="group flex flex-col h-full p-6 md:p-8 rounded-2xl bg-muted/30 border border-border/50 hover:border-border transition-all duration-300"
    >
      {/* Top Row: Icon + Badge */}
      <div className="flex items-start justify-between mb-6">
        <div className="h-14 p-2 w-14 rounded-xl bg-background border border-border/60 flex items-center justify-center text-primary shadow-sm transition-transform duration-300">
          <Icon size={28} strokeWidth={1.5} />
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-mono font-medium border border-primary/20 leading-none uppercase tracking-wider">
            {method.category}
          </span>
          {method.sota && (
            <span className="flex items-center gap-1 text-amber-500 text-[10px] font-mono font-medium leading-none">
              <StarIcon /> SOTA
            </span>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-grow flex flex-col">
        <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-3 leading-tight">
          {method.title}
        </h2>

        {/* 1. Simple Desc */}
        <p className="text-foreground text-sm md:text-base leading-relaxed mb-5">
          {method.simple_desc}
        </p>

        {/* 2. Technical Desc (Boxed) */}
        <div className="mt-auto mb-6 py-2 rounded-lg bg-background/50">
          <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
            {method.technical_desc}
          </p>
        </div>
      </div>

      {/* Footer: Paper Link */}
      <div className="pt-4 border-t border-border/30">
        <Link
          href={method.paper.link}
          target="_blank"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group/paper w-full"
        >
          <FileText size={14} />
          <span className="truncate font-medium flex-1">
            {method.paper.title}
          </span>
          <ArrowUpRight
            size={14}
            className="opacity-50 group-hover/paper:opacity-100 transition-opacity flex-shrink-0"
          />
        </Link>
      </div>
    </motion.div>
  );
}

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-3 h-3"
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      />
    </svg>
  );
}

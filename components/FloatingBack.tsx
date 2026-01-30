'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx'; // Assuming you have clsx or use template literals

export function FloatingBackBtn() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show if at top (0) OR scrolling UP
      // Hide if scrolling DOWN and parsed 50px
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={clsx(
        'fixed top-6 right-6 z-50 transition-all duration-300 ease-in-out will-change-transform hover:opacity-0',
        isVisible ? 'translate-y-0' : '-translate-y-[200%]'
      )}
    >
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background/80 backdrop-blur-md border border-border/40 text-primary font-medium hover:bg-primary/5 transition-all shadow-sm hover:shadow-md"
      >
        <ArrowLeft size={16} />
        <span>Back to Writings</span>
      </Link>
    </div>
  );
}

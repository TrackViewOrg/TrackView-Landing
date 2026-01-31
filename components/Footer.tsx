'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import TrackViewIcon from '@/components/TrackViewIcon';
import { Button } from '@/components/ui/button';

// Constants
const SOCIAL_LINKS = {
  twitter: 'https://x.com/home',
  youtube: 'https://www.youtube.com/@TrackViewApp',
  status: 'https://status.trackview.app',
  email: 'mailto:support@trackview.app',
};

// X Icon Component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={cn('fill-current', className)}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Youtube Icon Component
const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

const productLinks = [
  { name: 'Tracks', path: '/tracks' },
  { name: 'Cars', path: '/cars' },
  { name: 'Games', path: '/games' },
  { name: 'Features', path: '/features' },
  { name: 'Roadmap', path: '/roadmap' },
];

const companyLinks = [
  { name: 'About', path: '/about' },
  { name: 'Journal', path: '/journal' },
  { name: 'Contact', path: '/contact' },
  { name: 'Status', path: SOCIAL_LINKS.status },
];

const legalItems = [
  { name: 'Privacy Policy', path: '/legal/privacy' },
  { name: 'Terms of Service', path: '/legal/terms' },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background pt-16 pb-8 px-4 md:px-8 lg:px-30">
      <div className="flex flex-col gap-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand Section */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <Link href={'/'} className={'gap-2 flex items-center w-fit'}>
              <TrackViewIcon className="dark:bg-background dark:border-background h-10 w-10 rounded-sm border bg-[#101010] p-1.5 text-[#dff976]" />
              <span className="font-bold text-2xl tracking-tight">
                TrackView
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              The ultimate platform for tracking your racing journey. Compatible
              with your favorite simulators and tracks.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Link
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-sm w-10 h-10 hover:bg-foreground hover:text-background transition-colors"
                >
                  <XIcon className="h-4 w-4" />
                  <span className="sr-only">X (Twitter)</span>
                </Button>
              </Link>
              <Link
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-sm w-10 h-10 hover:bg-foreground hover:text-background transition-colors"
                >
                  <YoutubeIcon className="h-5 w-5" />
                  <span className="sr-only">YouTube</span>
                </Button>
              </Link>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Support
              </span>
              <a
                href={SOCIAL_LINKS.email}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                support@trackview.app
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-foreground tracking-wide uppercase text-sm">
                Product
              </h3>
              <div className="flex flex-col gap-3">
                {productLinks.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-foreground tracking-wide uppercase text-sm">
                Company
              </h3>
              <div className="flex flex-col gap-3">
                {companyLinks.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border/50">
          <p className="text-xs text-muted-foreground order-2 md:order-1">
            © {new Date().getFullYear()} TrackView. All rights reserved.
          </p>

          <div className="flex items-center gap-6 order-1 md:order-2">
            {legalItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

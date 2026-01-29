"use client";
import React, { useState, useRef, useEffect } from "react";
import TrackViewIcon from "@/components/TrackViewIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PlusMinusIcon from "@/components/PlusMinusIcon";

const navItems = [
  {
    name: "Compatibility",
    path: "/compatibility", // Path won't be used for linking, just ID
    subItems: [
      { name: "Tracks", path: "/tracks" },
      { name: "Cars", path: "/cars" },
      { name: "Games", path: "/games" },
    ],
  },
  { name: "Journal", path: "/journal" },
  { name: "Roadmap", path: "/roadmap" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

function Navbar() {
  const currentPath = usePathname();
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Scroll behavior state
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);

  // Set navbar height as a CSS variable
  useEffect(() => {
    if (navRef.current) {
      const height = navRef.current.offsetHeight;
      document.documentElement.style.setProperty("--navbar-height", `${height}px`);
    }
  }, []); // Only run once on mount (or if navRef changes), as height is now static

  // Close submenu on path change
  useEffect(() => {
    setActiveSubmenu(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [currentPath]);

  // Handle scroll to hide/show navbar
  useEffect(() => {
    let scrollableViewport: Element | null = null;
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      if (!scrollableViewport) return;
      const currentScrollY = scrollableViewport.scrollTop;

      // Check if we are at the top (within 200px)
      if (currentScrollY <= 200) {
        setIsAtTop(true);
      } else {
        setIsAtTop(false);
      }

      // A threshold to prevent hiding on small scrolls at the top
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsScrollingDown(true);
        setActiveSubmenu(null);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      } else if (currentScrollY < lastScrollY.current) {
        setIsScrollingDown(false);
      }
      lastScrollY.current = currentScrollY;
    };

    const initScrollListener = () => {
      scrollableViewport = document.querySelector(
        '[data-slot="scroll-area-viewport"]'
      );
      if (scrollableViewport) {
        scrollableViewport.addEventListener("scroll", handleScroll);
      } else {
        timeoutId = setTimeout(initScrollListener, 100);
      }
    };

    initScrollListener();

    return () => {
      clearTimeout(timeoutId);
      if (scrollableViewport) {
        scrollableViewport.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // 1. When hovering an item or the sub-bar, clear the close timer and set active
  const handleMouseEnter = (itemName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveSubmenu(itemName);
  };

  // 2. When leaving, wait 400ms before closing.
  // If the user enters the sub-bar before 400ms, handleMouseEnter fires and cancels this.
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveSubmenu(null);
      timeoutRef.current = null;
    }, 300);
  };

  return (
      <div
          ref={navRef}
          className={cn(
              "w-full flex flex-col z-50 transition-transform duration-300 fixed top-0 left-0",
              {
                  "-translate-y-full": isScrollingDown,
              }
          )}
      >
        {/* --- TOP BAR --- */}
        <div
            className={cn(
              "w-full py-2.5 px-50 bg-background flex items-center justify-between border-border relative z-20 transition-all duration-300",
              // Show border if NOT at top OR if submenu is active
              (!isAtTop || activeSubmenu) ? "border-b border-border" : "border-b-transparent"
            )}
        >
          <div className={"gap-5 flex items-center"}>
            <Link href={"/"} className={"gap-2 flex items-center"}>
              <TrackViewIcon className="dark:bg-background dark:border-background h-8 w-8 rounded-sm border bg-[#101010] p-1 text-[#dff976]" />
            </Link>
            <div className={"flex items-center gap-0.5"}>
              {navItems.map((item, i) => {
                const hasSubItems = item.subItems && item.subItems.length > 0;

                // Common Button Style
                const buttonContent = (
                    <Button
                        variant={"navbarItem"}
                        size={"navbar"}
                        className={`uppercase tracking-wider ${
                            (currentPath === item.path || activeSubmenu === item.name) &&
                            "bg-muted/70 text-foreground"
                        }`}
                    >
                      {item.name}
                    </Button>
                );

                return (
                    <div
                        key={i}
                        // Apply hover logic here to the wrapper
                        onMouseEnter={() =>
                            hasSubItems ? handleMouseEnter(item.name) : handleMouseEnter("")
                        }
                        onMouseLeave={handleMouseLeave}
                        className="relative" // purely for positioning context if needed later
                    >
                      {hasSubItems ? (
                          // RENDER AS DIV (Non-clickable)
                          <div className="cursor-default">{buttonContent}</div>
                      ) : (
                          // RENDER AS LINK (Clickable)
                          <Link href={item.path}>{buttonContent}</Link>
                      )}
                    </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE ACTIONS */}
          <div className={"flex items-center gap-2"}>
            <Link href={"/demo"}>
              <Button
                  variant={"navbarItem"}
                  size={"navbar"}
                  className={`uppercase tracking-wider`}
              >
                Demo
              </Button>
            </Link>
            <Link href={"/pricing"}>
              <Button
                  variant={"navbarItem"}
                  size={"navbar"}
                  className={`uppercase tracking-wider`}
              >
                Pricing
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                  variant={"primary"}
                  size={"navbar"}
                  className={`uppercase tracking-wider font-medium`}
              >
                Sign In
              </Button>
            </Link>
            <Button variant={"link"} size={"icon-sm"}>
              <PlusMinusIcon isOpen={false}/>
            </Button>
          </div>
        </div>

        {/* --- SUB BARS (Rendered Absolutely) --- */}
        {navItems.map((item, index) => {
          if (!item.subItems || item.subItems.length === 0) return null;
          const isOpen = activeSubmenu === item.name;

          return (
              <div
                  key={`${item.name}-sub`}
                  // Crucial: Apply the same mouse handlers to the sub-bar
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                  className={cn(
                      "absolute top-full left-0 w-full py-2.5 px-50 bg-background flex items-center justify-between border-border border-b transition-all duration-300 -z-10",
                      isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none"
                  )}
              >
                <div className={"flex items-center gap-2"}>
                  {item.subItems.map((subItem, subIndex) => (
                      <Link key={subIndex} href={subItem.path}>
                        <Button
                            variant={"navbarItem"}
                            size={"navbar"}
                            className={`uppercase tracking-wider ${
                                currentPath === subItem.path && "bg-muted/70 text-foreground"
                            }`}
                        >
                          {subItem.name}
                        </Button>
                      </Link>
                  ))}
                </div>
              </div>
          );
        })}
      </div>
  );
}

export default Navbar;
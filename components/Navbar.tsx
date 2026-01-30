"use client";
import React, { useState, useRef, useEffect } from "react";
import TrackViewIcon from "@/components/TrackViewIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {ArrowRight, ArrowUpRightIcon} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import PlusMinusIcon from "@/components/PlusMinusIcon";

const navItems = [
  {
    name: "Compatibility",
    path: "/compatibility",
    subItems: [
      { name: "Tracks", path: "/tracks" },
      { name: "Cars", path: "/cars" },
      { name: "Games", path: "/games" },
    ],
  },
  { name: "Features", path: "/features" },
  { name: "Journal", path: "/journal" },
  { name: "Roadmap", path: "/roadmap" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

function Navbar() {
  const currentPath = usePathname();
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  }, []);

  // Close submenu and mobile menu on path change
  useEffect(() => {
    setActiveSubmenu(null);
    setIsMobileMenuOpen(false);
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
      if (currentScrollY <= 10) {
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
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveSubmenu(null);
      timeoutRef.current = null;
    }, 100);
  };

  // Flatten items for mobile
  const mobileNavItems = navItems.flatMap((item) => {
    if (item.subItems && item.subItems.length > 0) {
      return item.subItems;
    }
    return item;
  });

  return (
      <div
          ref={navRef}
          className={cn(
              "w-full flex flex-col z-50 transition-transform duration-200 fixed top-0 left-0",
              {
                  "-translate-y-full": isScrollingDown && !isMobileMenuOpen,
              }
          )}
      >
        {/* --- TOP BAR --- */}
        <div
            className={cn(
              "w-full py-2.5 px-4 md:px-8 lg:px-12 bg-background/90 backdrop-blur-xl flex items-center justify-between border-border relative z-20 transition-all duration-200",
              (!isAtTop || activeSubmenu || isMobileMenuOpen) ? "border-b border-border" : "border-b-transparent"
            )}
        >
          <div className={"gap-5 flex items-center"}>
            <Link href={"/"} className={"gap-2 flex items-center"}>
              <TrackViewIcon className="dark:bg-background dark:border-background h-8 w-8 rounded-sm border bg-[#101010] p-1 text-[#dff976]" />
            </Link>
            
            {/* Desktop Navigation */}
            <div className={"hidden lg:flex items-center gap-0.5"}>
              {navItems.map((item, i) => {
                const hasSubItems = item.subItems && item.subItems.length > 0;

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
                        onMouseEnter={() =>
                            hasSubItems ? handleMouseEnter(item.name) : handleMouseEnter("")
                        }
                        onMouseLeave={handleMouseLeave}
                        className="relative"
                    >
                      {hasSubItems ? (
                          <div className="cursor-default">{buttonContent}</div>
                      ) : (
                          <Link href={item.path}>{buttonContent}</Link>
                      )}
                    </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE ACTIONS (Desktop) */}
          <div className={"hidden lg:flex items-center gap-2"}>
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
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-foreground hover:bg-transparent"
            >
              <PlusMinusIcon isOpen={isMobileMenuOpen} />
            </Button>
          </div>
        </div>

        {/* --- SUB BARS (Desktop - Rendered Absolutely) --- */}
        <div className="hidden lg:block">
            {navItems.map((item, index) => {
              if (!item.subItems || item.subItems.length === 0) return null;
              const isOpen = activeSubmenu === item.name;

              return (
                  <div
                      key={`${item.name}-sub`}
                      onMouseEnter={() => handleMouseEnter(item.name)}
                      onMouseLeave={handleMouseLeave}
                      className={cn(
                          "absolute top-full left-0 w-full py-2.5 px-4 md:px-8 lg:px-12 bg-background/90 backdrop-blur-xl flex items-center justify-between border-border border-b transition-all duration-200 -z-10",
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

        {/* --- MOBILE MENU --- */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="lg:hidden fixed left-0 w-full bg-background/95 backdrop-blur-2xl z-10 overflow-y-auto border-b border-border shadow-2xl pb-35"
              style={{
                top: "var(--navbar-height, 60px)",
                height: "calc(100vh - var(--navbar-height, 60px))"
              }}
            >
              <div className="flex flex-col gap-2">
                {mobileNavItems.map((item, i) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group flex items-center justify-between py-4 border-b border-border/40 hover:border-primary/50 transition-colors px-5"
                    >
                      <span className="text-3xl uppercase font-medium text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </span>

                      <ArrowUpRightIcon />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}

export default Navbar;
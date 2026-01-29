import type { Metadata } from "next";
import { Instrument_Serif, Space_Grotesk, Space_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "next-themes";
import { ScrollArea } from "@/components/ui/scroll-area";

// 👇 THIS LINE FIXES THE CACHING ISSUE
export const dynamic = "force-dynamic";

const geistSans = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Fix 1: Added weight property (Instrument Serif usually only supports 400)
const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

const archivo = localFont({
  src: [
    {
      path: "../public/fonts/Archivo-SemiExpanded-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Archivo-SemiExpanded-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Archivo-SemiExpanded-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "TrackView",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${spaceMono.variable} ${archivo.variable} ${instrumentSerif.variable} font-archivo selection:text-background antialiased selection:bg-[#dff976] bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className={"h-screen w-screen flex flex-col overflow-hidden"}>
            <Navbar />
            <ScrollArea className={"w-full h-full"}>
              <div className={"pt-[var(--navbar-height,60px)] min-h-full"}>
                {children}
              </div>
            </ScrollArea>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { Providers } from "@/components/shared/providers";
import { messages } from "@/config/messages";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s · ${siteConfig.name}` },
  description: messages.siteDescription,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: next-themes sets the theme class before hydration.
    <html
      lang={siteConfig.locale}
      suppressHydrationWarning
      className={cn("h-full", inter.variable, geistMono.variable, "font-sans")}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="bg-primary text-primary-foreground sr-only z-50 rounded-md px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {messages.nav.skipToContent}
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

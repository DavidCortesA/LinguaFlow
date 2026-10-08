import { Languages } from "lucide-react";
import Link from "next/link";

import { SiteNav } from "@/components/shared/site-nav";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 rounded-md font-semibold tracking-tight">
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
            <Languages className="size-4" aria-hidden="true" />
          </span>
          {siteConfig.name}
        </Link>
        <div className="flex items-center gap-1">
          <SiteNav />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

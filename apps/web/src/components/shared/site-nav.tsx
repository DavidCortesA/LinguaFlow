"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { messages } from "@/config/messages";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: messages.nav.home },
  { href: "/learn", label: messages.nav.learn },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label={messages.nav.main}>
      <ul className="flex items-center gap-1">
        {links.map(({ href, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active && "text-foreground bg-muted",
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

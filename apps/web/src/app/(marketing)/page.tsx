import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { messages } from "@/config/messages";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { home } = messages;

  return (
    <div className="bg-brand-glow">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-4 py-20 sm:px-6 sm:py-28">
        <Badge variant="accent">{home.badge}</Badge>
        <h1 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
          {siteConfig.name}: {home.title}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
          {home.description}
        </p>
        <Link href="/learn" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-base")}>
          {home.cta}
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>

      <section aria-label={siteConfig.name} className="mx-auto w-full max-w-5xl px-4 pb-24 sm:px-6">
        <ul className="grid gap-4 sm:grid-cols-3">
          {home.features.map((feature) => (
            <li key={feature.title}>
              <Card className="h-full gap-2">
                <h2 className="font-semibold">{feature.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

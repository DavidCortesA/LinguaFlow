import { messages } from "@/config/messages";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="text-muted-foreground mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-8 text-sm sm:px-6">
        <p className="text-foreground font-medium">{siteConfig.name}</p>
        <p>{messages.home.footer}</p>
      </div>
    </footer>
  );
}

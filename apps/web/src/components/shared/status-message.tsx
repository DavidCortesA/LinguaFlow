import { AlertCircle, CheckCircle2, Inbox, Loader2 } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

type Variant = "loading" | "empty" | "success" | "error";

const styles: Record<Variant, string> = {
  loading: "bg-muted/60 text-foreground",
  empty: "border-dashed bg-transparent text-muted-foreground",
  success: "border-success/30 bg-success-muted text-success",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
};

const icons: Record<Variant, React.ReactNode> = {
  loading: <Loader2 className="size-4 animate-spin" aria-hidden="true" />,
  empty: <Inbox className="size-4" aria-hidden="true" />,
  success: <CheckCircle2 className="size-4" aria-hidden="true" />,
  error: <AlertCircle className="size-4" aria-hidden="true" />,
};

interface StatusMessageProps {
  variant: Variant;
  title?: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/**
 * One component for every non-default state so loading, empty, success and error look and
 * announce themselves consistently. Errors use `role="alert"`; the rest use a polite status.
 */
export function StatusMessage({ variant, title, children, action, className }: StatusMessageProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      data-variant={variant}
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-4 text-sm",
        styles[variant],
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5">{icons[variant]}</span>
        <div className="flex flex-col gap-1">
          {title ? <p className="font-semibold">{title}</p> : null}
          {children ? <div className="leading-relaxed">{children}</div> : null}
        </div>
      </div>
      {action ? <div className="pl-6">{action}</div> : null}
    </div>
  );
}

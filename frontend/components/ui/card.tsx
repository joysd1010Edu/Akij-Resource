/* ==========  frontend/components/ui/card.tsx  ===============*/
import * as React from "react";

import { cn } from "@/lib/utils";

/* ==========  Function Card contains reusable module logic used by this feature.  ===============*/
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/80 bg-white/90 text-slate-900 shadow-sm backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}

/* ==========  Function CardHeader contains reusable module logic used by this feature.  ===============*/
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

/* ==========  Function CardTitle contains reusable module logic used by this feature.  ===============*/
function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

/* ==========  Function CardDescription contains reusable module logic used by this feature.  ===============*/
function CardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-slate-600", className)} {...props} />;
}

/* ==========  Function CardContent contains reusable module logic used by this feature.  ===============*/
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

/* ==========  Function CardFooter contains reusable module logic used by this feature.  ===============*/
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

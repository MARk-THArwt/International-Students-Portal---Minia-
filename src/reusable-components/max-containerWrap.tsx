import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export default function MaxContainerWrapper({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn("max-w-7xl mx-auto px-2.5 lg:px-20", className)}
      {...props}
    >
      {children}
    </section>
  );
}

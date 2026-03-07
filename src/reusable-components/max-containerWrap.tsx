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
    <div className={cn("max-w-7xl mx-auto", className)} {...props}>
      {children}
    </div>
  );
}

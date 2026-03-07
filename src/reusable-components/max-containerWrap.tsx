import type { HTMLAttributes, ReactNode } from "react";

export default function MaxContainerWrapper({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  return <div>MaxContainerWrapper</div>;
}

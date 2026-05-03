import type { ReactNode } from "react";

export function Card({
  title,
  value,
  children,
}: {
  title: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <p className="text-xs text-gray-400">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
      {children}
    </div>
  );
}

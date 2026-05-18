import type { ReactNode } from "react";
import ArrowIcon from "./../../../assets/icons-svg/arrow.svg?react";

function ServicesCard({
  data,
  children,
}: {
  data: { title: string; description: string };
  children: ReactNode;
}) {
  return (
    <div className="border border-original-border rounded-lg p-4 font-['Public_Sans']">
      {/* icon */}
      <div className="bg-original-accent-subtle w-12 h-12 rounded-[10px] flex items-center justify-center my-[0.8rem]">
        {children}
      </div>

      {/* title */}
      <h3 className="text-original-secondary font-bold text-[20px] leading-[28px]">
        {data.title}
      </h3>

      {/* description */}
      <p className="text-original-text-muted text-[14px] leading-[28px] mt-1">
        {data.description}
      </p>

      {/* link */}
      <a
        href="#"
        className="text-original-primary font-bold text-[14px] leading-[20px] no-underline flex items-center gap-[3px] mt-2"
      >
        Learn More
        <ArrowIcon />
      </a>
    </div>
  );
}

export default ServicesCard;

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
    <div className="border border-[#E2E8F0] rounded-lg p-4 font-['Public_Sans']">
      {/* icon */}
      <div className="bg-[#c59f5928] w-12 h-12 rounded-[10px] flex items-center justify-center my-[0.8rem]">
        {children}
      </div>

      {/* title */}
      <h3 className="text-[#002147] font-bold text-[20px] leading-[28px]">
        {data.title}
      </h3>

      {/* description */}
      <p className="text-[#475569] text-[14px] leading-[28px] mt-1">
        {data.description}
      </p>

      {/* link */}
      <a
        href="#"
        className="text-[#0F0FBD] font-bold text-[14px] leading-[20px] no-underline flex items-center gap-[3px] mt-2"
      >
        Learn More
        <ArrowIcon />
      </a>
    </div>
  );
}

export default ServicesCard;

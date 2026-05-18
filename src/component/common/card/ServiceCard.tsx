import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import Arow from "@/assets/icons-svg/arow.svg?react";
export function CardImage({
  data,
  children,
}: {
  data: {
    span: string;
    title: string;
    description: string;
    imgServ: string;
    link: string;
  };
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-t-2xl border-1 border-original-border max-w-sm min-w-xs">
      <div className="relative w-full ">
        <img
          src={data.imgServ}
          alt="Service Image"
          className=" h-48 w-full object-cover rounded-t-2xl"
        />
        <span className="absolute top-3 right-3 w-fit bg-original-card drop-shadow-sm p-2 rounded-xl">
          {children}
        </span>
      </div>
      <div className="p-6 flex flex-col gap-3 ">
        <span className="text-original-primary bg-original-primary-subtle font-bold text-sm uppercase px-3 rounded-2xl w-fit">
          {data.span}
        </span>
        <h3 className="font-bold text-2xl text-original-text-dark">
          {data.title}
        </h3>
        <p className="text-original-text-muted leading-normal text-sm">
          {data.description}
        </p>
        <hr />
        <Link
          to={"/"}
          className="flex items-center gap-1 text-original-primary text-sm font-bold"
        >
          {data.link}
          <Arow className="w-4 h-4 " />
        </Link>
      </div>
    </div>
  );
}
export default CardImage;

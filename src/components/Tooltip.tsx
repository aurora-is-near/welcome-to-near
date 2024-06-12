import React from "react";
import clsx from "clsx";

export default function Tooltip({
  children,
  tooltipClassname,
  content,
}: {
  children: React.ReactNode;
  content: React.ReactNode | string;
  tooltipClassname?: string;
}) {
  return (
    <div className="group relative -m-1 cursor-pointer p-1">
      {children}
      <div className="invisible absolute left-1/2 z-10 -translate-x-1/2 translate-y-1 cursor-auto pt-2 opacity-0 transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div
          className={clsx(
            "w-56 rounded-xl bg-black/70 px-3 pb-2.5 pt-2 text-xs text-sand-4 shadow-xl backdrop-blur-xl",
            tooltipClassname
          )}
        >
          {content}
        </div>
      </div>
    </div>
  );
}

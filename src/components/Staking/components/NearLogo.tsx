import { NearLogo as Icon } from "@/icons";
import clsx from "clsx";

export default function NearLogo({ active }: { active: boolean }) {
  return (
    <div
      className={clsx(
        "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
        { "bg-[#01EC97]": active, "bg-sand-7 text-sand-9": !active }
      )}
    >
      <Icon className="h-5 w-5" />
    </div>
  );
}

import clsx from "clsx";

interface Props {
  size?: "xs" | "sm" | "default" | "lg";
  success?: boolean;
  className?: string;
}

const Spinner = ({ size = "default", className }: Props) => (
  <div
    className={clsx(
      "flex flex-shrink-0 animate-spin items-center justify-center rounded-full",
      className,
      {
        "h-3 w-3 border-2 border-current": size === "xs",
        "h-4 w-4 border-2 border-current": size === "sm",
        "h-6 w-6 border-[3px] border-current": size === "default",
        "h-10 w-10 border-4 border-current": size === "lg",
      }
    )}
    style={{ borderRightColor: "transparent" }}
  />
);

export default Spinner;

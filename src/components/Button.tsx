import { ReactNode, MouseEventHandler, forwardRef } from "react";
import Link from "next/link";
import clsx from "clsx";

type ButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  href?: string;
  size?: "xs" | "sm" | "md";
  style?:
    | "primary"
    | "secondary"
    | "white"
    | "dark-border"
    | "light-border"
    | "transparent"
    | "green";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children: ReactNode;
  [rest: string]: any;
};

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      onClick,
      href,
      size = "md",
      style = "primary",
      disabled = false,
      loading = false,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const content = loading ? (
      <>
        <span className="opacity-0">{children}</span>
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center">
          <div
            className="h-4 w-4 animate-spin rounded-full border-2 border-current"
            style={{ borderRightColor: "transparent" }}
          />
        </div>
      </>
    ) : (
      children
    );

    const classes = clsx(
      "relative inline-flex items-center justify-center gap-2 rounded-full font-mono font-semibold leading-normal tracking-wider focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-12",
      {
        "h-9 px-4 text-sm": size === "xs",
        "h-10 px-5 text-sm": size === "sm",
        "h-12 px-6 text-base": size === "md",

        "bg-sand-12 text-white": style === "primary",
        "border border-sand-6 bg-sand-3 text-sand-12": style === "secondary",
        "bg-white text-sand-12": style === "white",
        "border border-sand-12 text-sand-12": style === "dark-border",
        "border border-sand-8 text-white": style === "light-border",
        "bg-transparent text-sand-12": style === "transparent",
        "border border-green-8 bg-green-9 text-green-12": style === "green",

        "pointer-events-none opacity-50": disabled,
      },
      className
    );

    return href ? (
      <Link
        href={href}
        className={classes}
        onClick={onClick}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...rest}
      >
        {content}
      </Link>
    ) : (
      <button
        onClick={onClick}
        className={classes}
        disabled={isDisabled}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...rest}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

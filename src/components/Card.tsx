import clsx from "clsx";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className }: Props) => (
  <div className={clsx("rounded-2xl bg-sand-1 shadow-custom-lg", className)}>
    {children}
  </div>
);

export const CardPadding = ({ children, className }: Props) => (
  <div className={clsx("px-4 py-6 sm:p-8", className)}>{children}</div>
);

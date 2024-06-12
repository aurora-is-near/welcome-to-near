import clsx from "clsx";
import { ReactNode } from "react";

const ErrorMessage = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={clsx("text-center text-sm font-semibold text-red-8", className)}
  >
    {children}
  </div>
);

export default ErrorMessage;

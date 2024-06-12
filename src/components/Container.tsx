import clsx from "clsx";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  maxWidthClassName?: string;
  as?: keyof JSX.IntrinsicElements;
  [props: string]: any;
}

const Container = ({
  children,
  className,
  maxWidthClassName = "max-w-[1368px]",
  as: Tag = "div",
  ...props
}: Props) => (
  <Tag
    className={clsx(
      "mx-auto w-full px-4 sm:px-6",
      maxWidthClassName,
      className
    )}
    {...props}
  >
    {children}
  </Tag>
);

export default Container;

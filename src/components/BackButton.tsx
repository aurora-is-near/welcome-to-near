import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import React from "react";

export default function BackButton({
  href,
  onClick,
}: {
  href?: string;
  onClick?: () => void;
}) {
  const classes =
    "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-sand-6 focus-visible:outline focus-visible:outline-sand-12 focus-visible:outline-2 focus-visible:outline-offset-2";

  const iconClasses = "h-4.5 w-4.5 flex-shrink-0 text-sand-12";

  return href ? (
    <Link onClick={onClick} href={href} className={classes}>
      <span className="sr-only">Back</span>
      <ArrowLeftIcon className={iconClasses} />
    </Link>
  ) : (
    <button onClick={onClick} className={classes}>
      <span className="sr-only">Back</span>
      <ArrowLeftIcon className={iconClasses} />
    </button>
  );
}

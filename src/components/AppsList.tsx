"use client";

import Button from "@/components/Button";
import Image from "next/image";
import { useState } from "react";

const AppsList = ({
  name,
  apps,
  showAll = false,
}: {
  name?: string;
  apps: any[];
  showAll?: boolean;
}) => {
  const [expanded, setExpanded] = useState(showAll);

  const displayedApps = expanded ? apps : apps.slice(0, 4);

  return (
    <div>
      {name && (
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-sans text-3xl font-medium leading-[1.3] text-sand-12">
            {name}
          </h2>
          {!expanded && apps.length > 4 ? (
            <Button
              onClick={() => setExpanded(true)}
              size="sm"
              style="dark-border"
            >
              Expand
            </Button>
          ) : null}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {displayedApps.map((app: any) => (
          <a
            key={app.name}
            href={app.website}
            target="_blank"
            rel="noreferrer noopener"
            className="flex flex-col items-center justify-center rounded-2xl bg-sand-1 px-8 py-5 shadow-custom"
          >
            <Image
              src={app.logo}
              height={72}
              width={72}
              className="overflow-hidden rounded-2xl object-cover"
              alt=""
            />
            <h3 className="mt-3 text-center text-base font-bold leading-normal tracking-wide text-sand-12">
              {app.name}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-center text-sm leading-normal tracking-wide text-sand-11">
              {app.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AppsList;

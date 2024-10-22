"use client";

import AppsList from "@/components/AppsList";
import Button from "@/components/Button";
import appCategories from "@/constants/appCategories";
import { useState } from "react";

const Apps = ({ allApps, topApps }: { allApps: any[]; topApps: any[] }) => {
  const [activeCategory, setActiveCategory] = useState("trending");

  const visibleApps =
    activeCategory === "trending"
      ? topApps.slice(0, 8)
      : allApps
          .reverse() // Reverse to get the latest apps first. A lot of the apps on DappRadar are added quite a long time ago and are not fresh and have broken links etc.
          .filter((app: any) => app.categories.includes(activeCategory));

  return (
    <div className="mt-8 w-full">
      <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 hide-scrollbar sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-hidden sm:px-0">
        <Button
          className="flex-shrink-0"
          onClick={() => setActiveCategory("trending")}
          style={activeCategory === "trending" ? "primary" : "transparent"}
        >
          Trending
        </Button>
        {appCategories.map(({ name, category }) => {
          const active = category === activeCategory;

          return (
            <Button
              key={category}
              className="flex-shrink-0"
              onClick={() => setActiveCategory(category)}
              style={active ? "primary" : "transparent"}
            >
              {name}
            </Button>
          );
        })}
      </div>
      <div className="mt-8">
        <AppsList apps={visibleApps} showAll={true} />
      </div>
    </div>
  );
};

export default Apps;

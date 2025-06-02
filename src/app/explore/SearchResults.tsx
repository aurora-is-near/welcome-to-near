"use client";

import AppsList from "@/components/AppsList";

const SearchResults = ({
  allApps,
  search,
}: {
  allApps: any[];
  search: string;
}) => {
  const filteredApps = allApps
    .reverse() // Reverse to get the latest apps first. A lot of the apps on DappRadar are added quite a long time ago and are not fresh and have broken links etc.
    .filter((app: any) => {
      try {
        return app.name.toLowerCase().includes(search.trim().toLowerCase());
      } catch {
        return false;
      }
    });

  if (!filteredApps.length)
    return (
      <div>
        <h3 className="font-sans text-3xl font-medium leading-[1.3] text-sand-12">
          Search results
        </h3>
        <p className="mt-6 text-base leading-normal tracking-wide">
          No dapps found.
        </p>
      </div>
    );

  return <AppsList name="Search results" apps={filteredApps} showAll={true} />;
};

export default SearchResults;

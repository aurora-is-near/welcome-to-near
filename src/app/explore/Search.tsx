"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Spinner from "@/components/Spinner";

const Search = ({ search }: { search?: string }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const isSearching = timeoutId || isPending;

  return (
    <div>
      <label htmlFor="search" className="sr-only">
        Search dapps
      </label>
      <div className="relative overflow-hidden rounded-2xl shadow-custom-lg">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
          <MagnifyingGlassIcon
            className="h-8 w-8 text-black"
            aria-hidden="true"
          />
        </div>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search dapps on NEAR"
          className="block w-full rounded-2xl border-0 py-6 pl-16 pr-12 text-base leading-normal text-sand-12 placeholder:text-sand-11 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
          defaultValue={search}
          onChange={(event) => {
            clearTimeout(timeoutId);

            if (!event.target.value) return router.push("/explore");

            const id = setTimeout(() => {
              startTransition(() => {
                router.push(`/explore?search=${event.target.value}`);

                setTimeoutId(undefined);
              });
            }, 500);

            setTimeoutId(id);
          }}
        />
        {isSearching && (
          <div
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5 text-sand-11"
            data-testid="search-dapps-spinner"
          >
            <Spinner size="sm" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

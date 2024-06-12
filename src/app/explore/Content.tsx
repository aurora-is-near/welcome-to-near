"use client";

import Container from "@/components/Container";
import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import SearchResults from "./SearchResults";

const Content = ({
  allApps,
  children,
}: {
  allApps: any[];
  children: ReactNode;
}) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  if (search) {
    return (
      <Container className="space-y-16 py-16">
        <SearchResults allApps={allApps} search={search} />
      </Container>
    );
  }

  return children;
};

export default Content;

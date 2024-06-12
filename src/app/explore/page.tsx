import Container from "@/components/Container";
import Category from "./Category";
import Search from "./Search";
import appCategories from "@/constants/appCategories";
import LayoutWrapper from "@/components/Staking/components/LayoutWrapper";
import TopApps from "./TopApps";
import { getAllApps } from "@/utils/dappRadar";
import Content from "./Content";
import { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Explore",
};

const ExplorePage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const search =
    typeof searchParams["search"] === "string"
      ? searchParams["search"]
      : undefined;

  const allApps = (await getAllApps()) || [];

  return (
    <div className="flex-1 bg-sand-2">
      <LayoutWrapper title="Explore" color="cyan">
        <Search search={search} />
      </LayoutWrapper>
      <Content allApps={allApps}>
        <TopApps />
        <Container className="space-y-16 py-16">
          {appCategories.map(({ name, category }) => (
            <Category key={name} name={name} category={category} />
          ))}
        </Container>
      </Content>
    </div>
  );
};

export default ExplorePage;

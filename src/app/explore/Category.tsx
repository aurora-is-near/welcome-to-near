import { getAllApps } from "@/utils/dappRadar";
import AppsList from "../../components/AppsList";

const Category = async ({
  category,
  name,
}: {
  category: string;
  name: string;
}) => {
  const allApps = (await getAllApps()) || [];

  const categoryApps = allApps
    .reverse() // Reverse to get the latest apps first. A lot of the apps on DappRadar are added quite a long time ago and are not fresh and have broken links etc.
    .filter((app: any) => app.categories.includes(category));

  if (!categoryApps.length) return null;

  return <AppsList name={name} apps={categoryApps} />;
};

export default Category;

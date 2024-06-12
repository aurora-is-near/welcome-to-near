import { getAllApps, getTopApps } from "@/utils/dappRadar";
import Apps from "./Apps";

const Explore = async () => {
  const allApps = (await getAllApps()) || [];
  const topApps = (await getTopApps()) || [];

  return <Apps allApps={allApps} topApps={topApps} />;
};

export default Explore;

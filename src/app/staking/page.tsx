import Staking from "@/components/Staking";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staking",
};

const StakingPage = () => {
  return <Staking />;
};

export default StakingPage;

import AppsList from "@/components/AppsList";
import Container from "@/components/Container";
import { getTopApps } from "@/utils/dappRadar";

const TopApps = async () => {
  const topApps = (await getTopApps()) || [];

  return (
    <div className="bg-cyan-3 bg-gradient-to-br from-[rgba(253,253,252,0.6)] from-[2.55%] via-[rgba(207,207,255,0.6)] via-[49.76%] to-[rgba(178,255,227,0.6)] to-[91.46%]">
      <Container className="py-16">
        <AppsList name="Trending" apps={topApps} />
      </Container>
    </div>
  );
};

export default TopApps;

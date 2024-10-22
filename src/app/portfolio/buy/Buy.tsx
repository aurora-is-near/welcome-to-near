import BackButton from "@/components/BackButton";
import { Card, CardPadding } from "@/components/Card";
import { useCards } from "../useCards";
import BuyOptions from "@/components/BuyOptions";

const Buy = () => {
  const { closeCard } = useCards();

  return (
    <Card>
      <CardPadding>
        <div className="flex items-center gap-x-4">
          <BackButton onClick={closeCard} />
          <h2 className="mt-0.5 font-sans text-2xl font-medium leading-none text-sand-12">
            Buy
          </h2>
        </div>
      </CardPadding>
      <div className="overflow-hidden rounded-b-2xl border-t border-sand-5">
        <div className="bg-sand-3 px-4 py-4 sm:px-8">
          <h3 className="font-sans text-lg font-medium leading-none text-sand-12">
            Onramps
          </h3>
        </div>
        <div className="divide-y divide-sand-5 border-y border-sand-5">
          <BuyOptions type="onramps" />
        </div>
        {/* <div className="bg-sand-3 px-4 py-4 sm:px-8">
          <h3 className="font-sans text-lg font-medium leading-none text-sand-12">
            Exchanges
          </h3>
        </div>
        <div className="divide-y divide-sand-5 border-y border-sand-5">
          <BuyOptions type="exchanges" />
        </div> */}
      </div>
    </Card>
  );
};

export default Buy;

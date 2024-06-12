import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import Button from "@/components/Button";
import { Card, CardPadding } from "@/components/Card";

const ErrorCard = ({ error }: { error: string }) => {
  return (
    <Card className="h-[503px] max-w-[512px]">
      <CardPadding className="flex h-full flex-col items-center justify-center gap-5">
        <div className="mt-14 flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-6">
            <ExclamationCircleIcon className="h-8 w-8" />
          </div>
          <span className="font-sans text-xl font-medium tracking-[0.3px]">
            {error}
          </span>
        </div>
        <Button href="/staking">Go back</Button>
      </CardPadding>
    </Card>
  );
};
export default ErrorCard;

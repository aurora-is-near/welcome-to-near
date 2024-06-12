import { CheckIcon } from "@heroicons/react/20/solid";
import { useSend } from "./Send";
import { txExplorerLink } from "@/utils/near";
import {
  ArrowTopRightOnSquareIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/20/solid";
import Button from "@/components/Button";
import { useCards } from "../useCards";
import { CardPadding } from "@/components/Card";

const Success = () => {
  const { closeCard } = useCards();
  const { result, reset } = useSend();

  return (
    <CardPadding className="flex flex-col items-center justify-center">
      <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-green-9">
        <CheckIcon className="h-8 w-8 text-green-12" />
      </div>
      <div className="mt-5 flex flex-col items-center justify-center">
        <h2 className="text-center font-sans text-xl font-medium tracking-wide text-sand-12">
          Successfully sent!
        </h2>
        {result && (
          <Button
            style="dark-border"
            size="sm"
            href={txExplorerLink(result.transaction.hash)}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-5 border-opacity-30"
          >
            View on explorer
            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="mt-8 grid w-full gap-2 sm:mt-12 sm:grid-cols-2">
        <Button
          style="dark-border"
          className="border-opacity-30"
          onClick={reset}
        >
          <ArrowUturnLeftIcon className="-mt-0.5 h-5 w-5" />
          Send again
        </Button>
        <Button onClick={closeCard}>Close</Button>
      </div>
    </CardPadding>
  );
};

export default Success;

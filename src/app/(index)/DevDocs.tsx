import Button from "@/components/Button";
import { DevDocsIcon, ArrowSquareOut } from "@/icons";

const DevDocs = async () => {
  return (
    <div className="relative mx-auto flex w-full justify-between overflow-hidden rounded-2xl bg-sand-1 p-4 shadow-custom-lg ring-1 ring-black/[0.03] sm:p-6 md:max-w-lg lg:max-w-none">
      <DevDocsIcon className="absolute right-10 top-1/2 h-[230px] w-[230px] -translate-y-1/2 text-sand-5 opacity-50 sm:opacity-100" />
      <div className="relative ml-2 max-w-80 py-4 sm:ml-4 sm:py-6">
        <h3 className="font-sans text-2xl font-bold leading-[1.3] text-sand-12 sm:text-3xl">
          NEAR developer? Start here.
        </h3>
        <p className="mt-2 text-base leading-normal tracking-wider text-sand-12 sm:mt-3.5">
          Learn how to integrate Ethereum Wallets to Near DApps.
        </p>
      </div>
      <Button
        href="https://doc.aurora.dev/dev-reference/eth-wallets/"
        target="_blank"
        rel="noreferrer noopener"
        className="relative w-12 bg-white"
        style="light-border"
      >
        <span className="sr-only">Learn more</span>
        <ArrowSquareOut className="h-5 w-5 flex-shrink-0 text-sand-12" />
      </Button>
    </div>
  );
};

export default DevDocs;

import { Validator } from "../utils";
import ValidatorItem from "./ValidatorItem";
import BackButton from "../../BackButton";
import Button from "../../Button";
import { MagnifyingGlass } from "@/icons";
import { Card, CardPadding } from "@/components/Card";
import ValidatorSkeleton from "./ValidatorSkeleton";

export default function ValidatorSelector({
  onFilter,
  validators,
  onBack,
  buildValidatorLink,
  loading,
  noMatchesFound,
  disableFilter,
}: {
  onBack: () => void;
  loading: boolean;
  onFilter: (value: string) => void;
  buildValidatorLink: (accoutnId: string) => string;
  validators: Validator[];
  noMatchesFound: boolean;
  disableFilter: boolean;
}) {
  return (
    <Card className="overflow-hidden">
      <CardPadding className="border-b border-sand-6">
        <div className="flex items-center justify-start gap-4">
          <BackButton onClick={onBack} />
          <span className="font-sans text-2xl font-medium">
            Select a validator
          </span>
        </div>

        <div className="relative mt-5">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlass className="h-5 w-5" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            onChange={(e) => onFilter(e.target.value)}
            placeholder="validator-name.near"
            className="block w-full rounded-md border border-sand-6 py-2 pl-10 pr-3 text-base font-medium leading-normal text-sand-12 placeholder:text-sand-10 focus:border-sand-12 focus:outline focus:outline-offset-0 focus:outline-sand-12"
            disabled={disableFilter}
          />
        </div>
      </CardPadding>

      <CardPadding className="h-fit max-h-[570px] overflow-y-auto overflow-x-hidden sm:max-h-[730px]">
        {(() => {
          if (loading) {
            return (
              <div className="space-y-8">
                {Array.from({ length: 5 }, (_, index) => (
                  <ValidatorSkeleton key={index} />
                ))}
              </div>
            );
          }
          if (noMatchesFound) {
            return (
              <span className="text-balance text-center text-sm text-sand-11">
                No validators matching your filter criteria.
              </span>
            );
          }
          return (
            <div className="space-y-8">
              {validators.map((validator) => (
                <ValidatorItem
                  key={validator.publicKey}
                  validator={validator}
                  href={buildValidatorLink(validator.accountId)}
                  rightSide={
                    <Button
                      style="light-border"
                      size="sm"
                      className="hidden !text-sand-12 sm:block"
                    >
                      Select
                    </Button>
                  }
                />
              ))}
            </div>
          );
        })()}
      </CardPadding>
    </Card>
  );
}

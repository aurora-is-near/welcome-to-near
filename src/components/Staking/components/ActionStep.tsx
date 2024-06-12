import React from "react";
import BackButton from "../../BackButton";
import AmountFieldToken from "./AmountFieldToken";
import Button from "../../Button";
import InfoItem from "./InfoItem";
import { Card, CardPadding } from "@/components/Card";
import ErrorMessage from "@/components/ErrorMessage";

export default function ActionStep({
  header,
  amount,
  subInputText,
  onChange,
  formattedMaxValue,
  setMax,
  submitText,
  onSubmit,
  error,
  isLoading,
  submitDisabled,
  infoItems,
  onBack,
  hideIsMax,
  inputDisabledByDefault,
  tokenIcon,
}: {
  amount: string;
  header: string;
  tokenIcon?: string;
  error?: string;
  isLoading: boolean;
  hideIsMax: boolean;
  submitDisabled: boolean;
  formattedMaxValue: string;
  subInputText: string;
  onChange: (value: string) => void;
  setMax: () => void;
  submitText: string;
  onSubmit: () => Promise<void>;
  infoItems: React.JSX.Element;
  onBack: () => void;
  inputDisabledByDefault: boolean;
}) {
  return (
    <Card>
      <CardPadding className="border-b border-sand-6">
        <div className="flex items-center justify-start gap-4">
          <BackButton onClick={onBack} />
          <span className="font-sans text-2xl font-medium">{header}</span>
        </div>
        <AmountFieldToken
          className="mt-5"
          tokenIcon={tokenIcon}
          amount={amount}
          onChange={onChange}
          disabled={inputDisabledByDefault || submitDisabled}
        />
        {formattedMaxValue && (
          <InfoItem
            wrapperClassName="mt-3"
            left={subInputText}
            right={
              <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.24px]">
                {formattedMaxValue}
                {hideIsMax ? null : (
                  <div
                    className="flex h-8 w-12 cursor-pointer items-center justify-center rounded-[50px] border border-sand-6 text-xs font-semibold tracking-[0.24px]"
                    onClick={setMax}
                  >
                    MAX
                  </div>
                )}
              </div>
            }
          />
        )}
      </CardPadding>

      <CardPadding>
        <div className="flex flex-col gap-5">{infoItems}</div>
        <Button
          disabled={submitDisabled}
          loading={isLoading}
          onClick={onSubmit}
          className="mt-8 w-full"
        >
          {submitText}
        </Button>
        {error && <ErrorMessage className="mt-4">{error}</ErrorMessage>}
      </CardPadding>
    </Card>
  );
}

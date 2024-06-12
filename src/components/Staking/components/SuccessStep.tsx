import React from "react";
import BackButton from "../../BackButton";
import { CheckIcon } from "@heroicons/react/20/solid";
import Button from "@/components/Button";
import { ArrowSquareOut } from "@/icons";
import { Card, CardPadding } from "@/components/Card";

export default function SuccessStep({
  header,
  onBackHref,
  description,
  actionButtonText,
  onActionButtonClick,
  canRepeatAction,
  txLink,
}: {
  header: string;
  onBackHref: string;
  onActionButtonClick: () => void;
  description: React.JSX.Element;
  actionButtonText: string;
  canRepeatAction: boolean;
  txLink: string;
}) {
  return (
    <Card>
      <CardPadding>
        <div className="flex items-center justify-start gap-4">
          <BackButton href={onBackHref} />
          <span className="font-sans text-2xl font-medium">{header}</span>
        </div>
        <div className="mt-14 flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-9">
            <CheckIcon className="h-8 w-8 text-green-12" />
          </div>
          <span className="text-center font-sans text-xl font-medium tracking-wide text-sand-12">
            Success!
          </span>
          <span className="max-w-80 text-sm leading-normal tracking-wider text-sand-11">
            {description}
          </span>
          <span className="max-w-80 text-sm leading-normal tracking-wider text-sand-11">
            You can now view your delegation and staking rewards from your
            staking dashboard.
          </span>
        </div>
        <div className="mt-12 flex flex-wrap gap-2">
          <Button
            style="light-border"
            className="flex-1 whitespace-nowrap !text-sand-12"
            href={txLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            View In Explorer
            <span className="text-sand-10">
              <ArrowSquareOut />
            </span>
          </Button>
          {canRepeatAction && (
            <Button
              style="green"
              className="flex-1 whitespace-nowrap"
              onClick={onActionButtonClick}
            >
              {actionButtonText}
            </Button>
          )}
        </div>
      </CardPadding>
    </Card>
  );
}

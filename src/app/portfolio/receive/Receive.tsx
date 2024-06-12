import Button from "@/components/Button";
import { useCards } from "../useCards";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import QRCode from "react-qr-code";
import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import BackButton from "@/components/BackButton";
import { Card, CardPadding } from "@/components/Card";

const Receive = () => {
  const { closeCard } = useCards();
  const { accountId } = useWalletSelector();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timeout = setTimeout(() => setCopied(false), 1000);
    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <Card>
      <CardPadding>
        <div className="flex items-center gap-x-4">
          <BackButton onClick={closeCard} />
          <h2 className="mt-0.5 font-sans text-2xl font-medium leading-none text-sand-12">
            Receive
          </h2>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center">
          <div className="max-w-72 rounded-xl border p-5">
            <QRCode
              size={256}
              className="h-auto w-full max-w-full"
              value={accountId ?? ""}
              viewBox={`0 0 256 256`}
            />
          </div>
          <div className="mt-6 max-w-72 break-words text-center text-base font-semibold leading-normal tracking-wider text-sand-11">
            {accountId}
          </div>
          <CopyToClipboard
            text={accountId ?? ""}
            onCopy={() => setCopied(true)}
          >
            <Button
              className="mt-8 w-full border-opacity-30"
              style="dark-border"
            >
              {copied ? (
                <>
                  <ClipboardDocumentCheckIcon className="h-5 w-5 text-green-10" />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="h-5 w-5 text-sand-10" />
                  Copy address
                </>
              )}
            </Button>
          </CopyToClipboard>
        </div>
      </CardPadding>
    </Card>
  );
};

export default Receive;

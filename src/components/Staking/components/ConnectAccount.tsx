import { Card, CardPadding } from "@/components/Card";
import ConnectWalletButton from "@/app/(index)/ConnectWalletButton";

export default function ConnectAccount() {
  return (
    <Card>
      <CardPadding className="flex flex-col items-center gap-6">
        <span className="text-center font-sans text-2xl font-medium">
          Connect wallet to get started
        </span>
        <ConnectWalletButton />
      </CardPadding>
    </Card>
  );
}

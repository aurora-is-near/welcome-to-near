import { useCards } from "../useCards";
import { TokenInfo, useTokens } from "../useTokens";
import { createContext, useContext, useEffect, useState } from "react";
import Amount from "./Amount";
import SelectToken from "./SelectToken";
import Recipient from "./Recipient";
import Confirm from "./Confirm";
import Success from "./Success";
import { FinalExecutionOutcome } from "@near-wallet-selector/core";
import BackButton from "@/components/BackButton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Card, CardPadding } from "@/components/Card";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";

type Step = 0 | 1 | 2 | 3 | 4;

type SendContext = {
  values: {
    amount: string;
    recipient: string;
  };
  next: () => void;
  previous: () => void;
  setValues: (values: { amount: string; recipient: string }) => void;
  setSelectedToken: (symbol: string | null) => void;
  selectedTokenInfo: TokenInfo | undefined;
  result: FinalExecutionOutcome | undefined;
  setResult: (result: FinalExecutionOutcome | undefined) => void;
  reset: () => void;
};

const SendContext = createContext<SendContext>({} as SendContext);

export const useSend = () => {
  const context = useContext(SendContext);
  if (!context) {
    throw new Error("useSend must be used within SendContext");
  }
  return context;
};

const initialValues = {
  amount: "",
  recipient: "",
};

const Send = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const txHash = searchParams.get("transactionHashes");
  const router = useRouter();
  const { accountId } = useWalletSelector();
  const { closeCard } = useCards();
  const { tokens } = useTokens();
  const [step, setStep] = useState<Step>(0);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [result, setResult] = useState<FinalExecutionOutcome | undefined>(
    undefined
  );
  const selectedTokenInfo = tokens.find((t) => t.symbol === selectedToken);
  const [values, setValues] = useState(initialValues);

  const next = () =>
    setStep((prevStep) => (prevStep < 4 ? ((prevStep + 1) as Step) : prevStep));

  const previous = () =>
    setStep((prevStep) => (prevStep > 0 ? ((prevStep - 1) as Step) : prevStep));

  const reset = () => setStep(0);

  useEffect(() => {
    if (step === 0) {
      setValues(initialValues);
      setResult(undefined);
    }
  }, [step]);

  useEffect(() => {
    if (!accountId) {
      reset();
      closeCard();
    }
  }, [accountId]);

  // Show success screen after coming back from MyNearWallet
  useEffect(() => {
    if (txHash) {
      setStep(4);

      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("transactionHashes");

      const newParamsString = newParams.toString();

      router.replace(pathname + newParamsString ? `?${newParamsString}` : "", {
        scroll: false,
      });
    }
  }, [txHash]);

  return (
    <Card>
      {step !== 4 && (
        <CardPadding>
          <div className="flex items-center gap-x-4">
            <BackButton onClick={step === 0 ? closeCard : previous} />
            <h2 className="mt-0.5 font-sans text-2xl font-medium leading-none text-sand-12">
              {step === 0 && "Select asset to send"}
              {step === 1 && "Enter amount"}
              {step === 2 && "Enter recipient"}
              {step === 3 && "Confirm send"}
            </h2>
          </div>
        </CardPadding>
      )}

      <SendContext.Provider
        value={{
          next,
          previous,
          values,
          setValues,
          setSelectedToken,
          selectedTokenInfo,
          result,
          setResult,
          reset,
        }}
      >
        {step === 0 && <SelectToken />}
        {step === 1 && <Amount />}
        {step === 2 && <Recipient />}
        {step === 3 && <Confirm />}
        {step === 4 && <Success />}
      </SendContext.Provider>
    </Card>
  );
};

export default Send;

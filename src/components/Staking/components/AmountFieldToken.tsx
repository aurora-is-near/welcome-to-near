import clsx from "clsx";
import Image from "next/image";
import NearLogo from "./NearLogo";
type Props = {
  amount: string;
  className?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  tokenIcon?: string;
};

const AmountFieldToken = ({
  amount,
  onChange,
  disabled = false,
  autoFocus,
  className,
  tokenIcon,
}: Props) => (
  <div className={clsx("relative", className)}>
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
      {tokenIcon ? (
        <Image
          width={40}
          height={40}
          src={tokenIcon}
          alt="Token Icon"
          className="min-h-[40px] min-w-[40px] rounded-full"
        />
      ) : (
        <NearLogo active />
      )}
    </div>
    <input
      type="text"
      value={amount}
      placeholder="0"
      autoFocus={autoFocus}
      onChange={(e) => {
        if (onChange) onChange(e.target.value);
      }}
      disabled={disabled}
      className="block w-full rounded-2xl border border-sand-6 bg-sand-3 pb-4 pl-18 pr-4 pt-4.5 font-sans text-3xl font-medium leading-none text-sand-12 placeholder:text-sand-10 focus:border-sand-12 focus:outline focus:outline-offset-0 focus:outline-sand-12"
    />
  </div>
);

export default AmountFieldToken;

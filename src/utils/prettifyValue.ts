const prettifyValue = ({
  value,
  maxDigits = 2,
}: {
  value?: string | number;
  maxDigits?: number;
}) => {
  if (!value || value === "0") return "0.00";

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: maxDigits,
  }).format(+value);
};

export const TOKEN_DEFAULT_DIGITS = 3;
export default prettifyValue;

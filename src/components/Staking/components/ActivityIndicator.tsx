import { Validator } from "../utils";
import clsx from "clsx";

export default function ActivityIndicator({
  validator,
}: {
  validator: Validator;
}) {
  return (
    <div
      className={clsx(
        "inline-block h-2 min-h-2 w-2 min-w-2 flex-shrink-0 rounded-full",
        validator.active && !validator.contractNotDeployedOrDontSupportStaking
          ? "bg-green-8"
          : "bg-red-8"
      )}
    />
  );
}

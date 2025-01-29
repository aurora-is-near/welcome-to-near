import Button from "@/components/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSend } from "./Send";
import { validateAccountId } from "@/utils/near";
import { CardPadding } from "@/components/Card";
import ErrorMessage from "@/components/ErrorMessage";
import { useState } from "react";

type Inputs = {
  recipient: string;
};

const Recipient = () => {
  const { next, values, setValues } = useSend();
  const [isValdating, setIsValidating] = useState(false);
  const initialValue = values?.recipient || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<Inputs>({
    defaultValues: {
      recipient: initialValue,
    },
    reValidateMode: "onSubmit",
  });

  const onSubmit: SubmitHandler<Inputs> = ({ recipient }) => {
    const cleanedRecipient = recipient.trim().toLowerCase();
    setValues({ ...values, recipient: cleanedRecipient });
    next();
  };

  return (
    <CardPadding className="-mt-6 sm:-mt-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="recipient" className="sr-only">
            Recipient
          </label>
          <input
            id="recipient"
            type="text"
            className="w-full rounded-lg border-sand-6 bg-sand-3 px-4 py-3.5 text-left text-base leading-normal tracking-wider text-sand-12 placeholder:text-sand-11 focus:border-sand-12 focus:outline focus:outline-offset-0 focus:outline-sand-12"
            placeholder="Enter NEAR account ID"
            {...register("recipient", {
              required: true,
              onChange: () => {
                clearErrors("recipient");
              },
              validate: {
                positive: (v) => {
                  const cleanedRecipient = v.trim().toLowerCase();
                  return (
                    validateAccountId(cleanedRecipient) ||
                    "Enter a valid NEAR account."
                  );
                },
                notBanned: async (v) => {
                  try {
                    setIsValidating(true);
                    const cleanedRecipient = v.trim().toLowerCase();
                    const response = await fetch(
                      `/api/isBanned?address=${cleanedRecipient}`
                    );
                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                    const payload = await response.json();

                    return (
                      !Boolean(payload.isBanned) ||
                      "This account has been restricted from transferring tokens to."
                    );
                  } catch {
                    return "Someting went wrong while validating recipient.";
                  } finally {
                    setIsValidating(false);
                  }
                },
              },
            })}
          />
          {errors.recipient?.message && (
            <ErrorMessage className="mt-4">
              {errors.recipient.message}
            </ErrorMessage>
          )}
        </div>
        <Button className="mt-6 w-full" loading={isValdating}>
          Continue
        </Button>
      </form>
    </CardPadding>
  );
};

export default Recipient;

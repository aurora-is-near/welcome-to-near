import Button from "@/components/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSend } from "./Send";
import { validateAccountId } from "@/utils/near";
import { CardPadding } from "@/components/Card";
import ErrorMessage from "@/components/ErrorMessage";

type Inputs = {
  recipient: string;
};

const Recipient = () => {
  const { next, values, setValues } = useSend();
  const initialValue = values?.recipient || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      recipient: initialValue,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = ({ recipient }) => {
    const cleanedRecipient = recipient.trim().toLowerCase();
    setValues({ ...values, recipient: cleanedRecipient });
    next();
  };

  return (
    <CardPadding className="sm:-mt-8 -mt-6">
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
              validate: {
                positive: (v) => {
                  const cleanedRecipient = v.trim().toLowerCase();
                  return (
                    validateAccountId(cleanedRecipient) ||
                    "Enter a valid NEAR account."
                  );
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
        <Button className="mt-6 w-full">Continue</Button>
      </form>
    </CardPadding>
  );
};

export default Recipient;

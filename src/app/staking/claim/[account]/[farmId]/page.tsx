import Action from "@/components/Staking/Action";

const ValidatorPage = ({
  params,
}: {
  params: { account: string; farmId: string };
}) => {
  return (
    <Action
      action="claim"
      actionData={{
        validatorAccountId: params.account,
        farmId: params.farmId,
      }}
    />
  );
};

export default ValidatorPage;

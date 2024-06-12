import Action from "@/components/Staking/Action";

const ValidatorPage = ({ params }: { params: { account: string } }) => {
  return (
    <Action
      actionData={{
        validatorAccountId: params.account,
      }}
      action="unstake"
    />
  );
};

export default ValidatorPage;

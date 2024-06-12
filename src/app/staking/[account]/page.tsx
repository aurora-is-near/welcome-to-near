import Validator from "@/components/Staking/Validator";

const ValidatorPage = ({ params }: { params: { account: string } }) => {
  return <Validator validatorAccountId={params.account} />;
};

export default ValidatorPage;

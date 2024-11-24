import NameStep from "../components/create/NameStep/NameStep";
import ObjectStep from "../components/create/ObjectStep/ObjectStep";
import UserStep from "../components/create/UserStep/UserStep";
import VariantStep from "../components/create/VariantStep/VariantStep";
import Layout from "../components/layout/Layout/Layout";
import useCreateRoom from "../hooks/useCreateRoom";

const Create = () => {
  const { step } = useCreateRoom();
  return (
    <Layout name="Create">
      <CreateSteps step={step} />
    </Layout>
  );
};

type CreateStepsProps = {
  step: number;
};

const CreateSteps: React.FC<CreateStepsProps> = ({ step }) => {
  switch (step) {
    case 0:
      return <VariantStep />;
    case 1:
      return <NameStep />;
    case 2:
      return <ObjectStep />;
    case 3:
      return <UserStep />;
  }
};

export default Create;

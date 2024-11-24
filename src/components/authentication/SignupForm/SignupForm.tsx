import { EnvelopeIcon, KeyIcon, UserIcon } from "@heroicons/react/24/outline";
import { UseFormReturn } from "react-hook-form";
import { SignupFormFields } from "../../../views/Signup";
import CustomizableButton from "../../common/Buttons/CustomizableButton";
import Divider from "../../common/Dividers/Dividers";
import TextInputLine from "../../common/TextInputs/TextInputLine";
import GoogleSignupButton from "../GoogleLoginButton/GoogleLoginButton";
import styles from "./SignupForm.module.css";

type SignupFormProps = {
  form: UseFormReturn<SignupFormFields>;
  handleSubmit: (data: SignupFormFields) => void;
};

const SignupForm: React.FC<SignupFormProps> = ({ form, handleSubmit }) => {
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className={styles.fields}>
        <TextInputLine
          form={form}
          name="email"
          placeholder="Email"
          icon={<EnvelopeIcon />}
        />
        <TextInputLine
          form={form}
          name="username"
          placeholder="Username"
          icon={<UserIcon />}
        />
        <TextInputLine
          form={form}
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          icon={<KeyIcon />}
        />
        <CustomizableButton
          type="submit"
          variant="default"
          width="full"
          size="base"
        >
          Sign up
        </CustomizableButton>
        <Divider
          color="rgba(var(--base-mid), .5)"
          textColor="rgb(var(--base))"
          thickness=".5px"
          orientation="horizontal"
        >
          or
        </Divider>
        <GoogleSignupButton />
      </div>
    </form>
  );
};

export default SignupForm;

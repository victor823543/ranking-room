import { EnvelopeIcon, KeyIcon } from "@heroicons/react/24/outline";
import { UseFormReturn } from "react-hook-form";
import { LoginFormFields } from "../../../views/Login";
import CustomizableButton from "../../common/Buttons/CustomizableButton";
import Divider from "../../common/Dividers/Dividers";
import TextInputLine from "../../common/TextInputs/TextInputLine";
import GoogleLoginButton from "../GoogleLoginButton/GoogleLoginButton";
import styles from "./LoginForm.module.css";

type LoginFormProps = {
  form: UseFormReturn<LoginFormFields>;
  handleSubmit: (data: LoginFormFields) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ form, handleSubmit }) => {
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className={styles.fields}>
        <TextInputLine
          form={form}
          name="email"
          placeholder="Your Email"
          icon={<EnvelopeIcon />}
        />
        <TextInputLine
          form={form}
          name="password"
          type="password"
          placeholder="Your Password"
          autoComplete="current-password"
          icon={<KeyIcon />}
        />
        <CustomizableButton
          type="submit"
          variant="default"
          width="full"
          size="base"
        >
          Log in
        </CustomizableButton>
        <Divider
          color="rgba(var(--base-mid), .5)"
          textColor="rgb(var(--base))"
          thickness=".5px"
          orientation="horizontal"
        >
          or
        </Divider>
        <GoogleLoginButton />
      </div>
    </form>
  );
};

export default LoginForm;

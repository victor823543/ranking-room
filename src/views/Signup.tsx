import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import AuthLayout from "../components/authentication/AuthLayout/AuthLayout";
import SignupForm from "../components/authentication/SignupForm/SignupForm";
import Alerts from "../components/common/Alerts/Alerts";
import { ErrorAlert, useAlerts } from "../hooks/useAlerts";
import { useAuth } from "../provider/authProvider";
import { ErrorCode } from "../types/StatusCode";
import { callAPI, ControlledError } from "../utils/apiService";

const signupSchema = yup.object().shape({
  email: yup.string().email().required("Email cannot be empty."),
  username: yup.string().required("Username cannot be empty."),
  password: yup
    .string()
    .required("You must create a password.")
    .matches(/[A-Za-z]/, "Must contain at least 1 letter")
    .matches(/\d/, "Must contain at least 1 number")
    .min(6, "Must be at least 6 characters"),
});

export type SignupFormFields = yup.InferType<typeof signupSchema>;

type SignupResponse = {
  token: string;
};

const Signup = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const { alerts, pushAlert, removeAlert } = useAlerts();

  const form = useForm<SignupFormFields>({
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(signupSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: ({ username, email, password }: SignupFormFields) =>
      callAPI<SignupResponse>("/users/signup", "POST", {
        username,
        email,
        password,
      }),
    onSuccess: (response) => {
      setToken(response.token);
      navigate("/");
    },
    onError: (err: Error) => {
      if (err instanceof ControlledError) {
        if (
          err.status === ErrorCode.NO_RESULT ||
          err.status === ErrorCode.BAD_REQUEST
        ) {
          pushAlert(new ErrorAlert(err.message));
        } else {
          pushAlert(new ErrorAlert("An error occurred. Please try again."));
          console.log(err);
        }
      } else {
        pushAlert(new ErrorAlert("An error occurred. Please try again."));
        console.log(err);
      }
    },
  });

  const handleSubmit = (data: SignupFormFields) => {
    mutation.mutate(data);
  };

  return (
    <AuthLayout
      title="Create an account"
      redirect={{
        message: "Already have an account?",
        href: "/login",
        linkText: "Log in",
      }}
    >
      <SignupForm form={form} handleSubmit={handleSubmit} />
      <Alerts
        list={alerts}
        onClose={(item) => removeAlert(item)}
        onDurationEnd={(item) => removeAlert(item)}
        hasSidebar={false}
      />
    </AuthLayout>
  );
};

export default Signup;

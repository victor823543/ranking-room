import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Alert, ErrorAlert, SuccessAlert } from "../../../hooks/useAlerts";
import useLogout from "../../../hooks/useLogout";
import { useAuth } from "../../../provider/authProvider";
import { callAPI } from "../../../utils/apiService";
import CustomizableButton from "../../common/Buttons/CustomizableButton";
import Divider from "../../common/Dividers/Dividers";
import { Header } from "../../common/Headers/Headers";
import TextInputLine from "../../common/TextInputs/TextInputLine";
import styles from "./AccountSettings.module.css";

const updateAccountSchema = yup.object().shape({
  username: yup.string().min(3).max(16),
  password: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .matches(/[A-Za-z]/, "Must contain at least 1 letter")
    .matches(/\d/, "Must contain at least 1 number")
    .min(6, "Must be at least 6 characters")
    .notRequired(),
  rePassword: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .when("password", (password, schema) => {
      return password[0]
        ? schema
            .oneOf(
              [yup.ref("password")],
              "Your passwords don't match. Please try again.",
            )
            .required("Reentered password cannot be empty.")
        : schema.notRequired();
    }),
});

export type UpdateAccountFormFields = yup.InferType<typeof updateAccountSchema>;

type AccountSettingsProps = {
  pushAlert: (item: Alert) => void;
};

const AccountSettings: React.FC<AccountSettingsProps> = ({ pushAlert }) => {
  const { user, setToken } = useAuth();
  const [disableUpdate, setDisableUpdate] = useState(true);
  const logout = useLogout();
  const form = useForm<UpdateAccountFormFields>({
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(updateAccountSchema),
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        password: "",
      });
    }
  }, [user]);

  useEffect(() => {
    const subscription = form.watch(async (value) => {
      const isValid = await form.trigger();
      const hasPassword = !!value.password && value.password.length > 0;
      const nameIsNew = value.username !== user?.username;

      // Enable update button if form is valid and either the password is entered or username is changed
      if ((hasPassword || nameIsNew) && isValid) {
        setDisableUpdate(false);
      } else {
        setDisableUpdate(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch(), form, user]);

  const updateMutation = useMutation({
    mutationFn: (params: UpdateAccountFormFields) =>
      callAPI<{ token: string }>(`/users/update`, "PUT", {
        username: params.username,
        password: params.password,
      }),
    onSuccess: (response) => {
      setToken(response.token);
      pushAlert(
        new SuccessAlert("Account updated successfully", {
          duration: 4,
          global: true,
        }),
      );
      console.log("Account updated successfully");
    },
    onError: (err: Error) => {
      pushAlert(new ErrorAlert("An error occurred. Please try again."));
      console.log(err.message);
    },
  });

  const handleSubmit = (params: UpdateAccountFormFields) => {
    updateMutation.mutate(params);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className={styles.container}>
        <Header
          as="h2"
          center={false}
          variant="gridbox"
          className={styles.header}
        >
          Account Settings
        </Header>
        <Divider thickness="1px" color="rgba(var(--base), 0.5)" />
        <div className={styles.settingsStep}>
          <h3 className={styles.stepTitle}>Username</h3>
          <TextInputLine
            name="username"
            form={form}
            placeholder="Username"
            icon={<ChevronRightIcon strokeWidth={3} />}
          />
          <div className={styles.stepDivider}></div>
        </div>
        <div className={styles.settingsStep}>
          <h3 className={styles.stepTitle}>Password</h3>
          <TextInputLine
            name="password"
            form={form}
            placeholder="New Password"
            autoComplete="new-password"
            type="password"
            icon={<ChevronRightIcon strokeWidth={3} />}
          />

          <div className={styles.stepDivider}></div>
        </div>
        <div className={styles.settingsStep}>
          <h3 className={styles.stepTitle}>Reenter Password</h3>
          <TextInputLine
            name="rePassword"
            form={form}
            placeholder="Re-enter Password"
            autoComplete="new-password"
            type="password"
            icon={<ChevronRightIcon strokeWidth={3} />}
          />
          <div className={styles.stepDivider}></div>
        </div>
        <CustomizableButton
          className={styles.submitButton}
          type="submit"
          disabled={disableUpdate}
          variant="primary"
        >
          Save Changes
        </CustomizableButton>
      </div>
    </form>
  );
};

export default AccountSettings;

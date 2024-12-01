import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import TextInputLine from "../../common/TextInputs/TextInputLine";
import SettingsStep from "../SettingsStep/SettingsStep";

const schema = yup.object({
  name: yup
    .string()
    .max(25, "Your room name can have a maximum 25 characters")
    .required("Room name is required"),
});

type FormFields = yup.InferType<typeof schema>;

type NameSettingsProps = {
  value: string;
  setValue: (value: string) => void;
};

const NameSettings: React.FC<NameSettingsProps> = ({ value, setValue }) => {
  const form = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      name: value || "",
    },
  });

  useEffect(() => {
    if (value) {
      form.setValue("name", value);
    }
  }, [value]);

  const handleSubmit = (data: FormFields) => {
    setValue(data.name);
  };

  const handleChange = (value: string) => {
    if (form.formState.isValid) {
      setValue(value);
    }
  };

  return (
    <SettingsStep title="Room name">
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <TextInputLine
          form={form}
          name="name"
          placeholder="Room name"
          onInputChange={handleChange}
          icon={<ChevronRightIcon strokeWidth={3} />}
        />
      </form>
    </SettingsStep>
  );
};

export default NameSettings;

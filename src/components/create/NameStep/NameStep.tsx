import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import useCreateRoom from "../../../hooks/useCreateRoom";
import { BackButton } from "../../common/Buttons/BackButton/BackButton";
import TextInputLine from "../../common/TextInputs/TextInputLine";
import styles from "./NameStep.module.css";

const schema = yup.object({
  name: yup
    .string()
    .max(25, "Your room name can have a maximum 25 characters")
    .required("Room name is required"),
});

type FormFields = yup.InferType<typeof schema>;

const NameStep = () => {
  const { nextStep, setName, previousStep, body } = useCreateRoom();

  const form = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      name: body?.name || "",
    },
  });

  useEffect(() => {
    if (body) {
      form.setValue("name", body.name);
    }
  }, [body]);

  const handleSubmit = (data: FormFields) => {
    setName(data.name);
    nextStep();
  };

  return (
    <div className={styles.nameStep}>
      <motion.div
        className={styles.btnContainer}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <BackButton onClick={previousStep} />
      </motion.div>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <TextInputLine
            icon={<ChevronRightIcon strokeWidth={3} />}
            form={form}
            name="name"
            placeholder="Room Name"
          />
        </motion.div>
      </form>
    </div>
  );
};

export default NameStep;

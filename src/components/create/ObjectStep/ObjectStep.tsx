import { ChevronRightIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import AddImageSvg from "../../../assets/svgs/AddImageSvg";
import useCreateRoom from "../../../hooks/useCreateRoom";
import { useHandleSearchParam } from "../../../hooks/useHandleSearchParam";
import { BackButton } from "../../common/Buttons/BackButton/BackButton";
import CustomizableButton from "../../common/Buttons/CustomizableButton";
import ImageModal from "../../common/ImageModal/ImageModal";
import TextInputLine from "../../common/TextInputs/TextInputLine";
import styles from "./ObjectStep.module.css";

const schema = yup.object({
  name: yup
    .string()
    .max(18, "An object name can have a maximum 18 characters")
    .required("Object name is required"),
  image: yup.string().url("Invalid URL"),
});

type FormFields = yup.InferType<typeof schema>;

const ObjectStep = () => {
  const { nextStep, previousStep, addObject, body, deleteObject } =
    useCreateRoom();
  const { hasParam, addParam, removeParam } =
    useHandleSearchParam("select-image");

  const form = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = (data: FormFields) => {
    addObject(data);
    form.reset();
  };

  return (
    <div className={styles.objectStep}>
      <div className={styles.btnContainer}>
        <BackButton onClick={previousStep} />
      </div>
      <div className={styles.container}>
        <div>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={styles.form}
            >
              <TextInputLine
                form={form}
                name="name"
                placeholder="Object name"
                icon={<ChevronRightIcon strokeWidth={3} />}
              />
              <button
                type="button"
                className={styles.imgBtn}
                onClick={addParam}
                style={
                  form.getValues("image")
                    ? { padding: 0 }
                    : {
                        padding: "0.5rem 0.25rem 0.25rem 0.5rem",
                      }
                }
              >
                {form.getValues("image") ? (
                  <img src={form.getValues("image")} alt="Chosen image" />
                ) : (
                  <AddImageSvg />
                )}
              </button>
              <CustomizableButton variant="opaque" type="submit">
                Add Object
              </CustomizableButton>
            </motion.div>
          </form>
          <motion.div
            className={styles.nextStep}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <CustomizableButton variant="primary" onClick={nextStep}>
              Continue
            </CustomizableButton>
            <p>You can always add more objects later...</p>
          </motion.div>
        </div>
        <div>
          <div className={styles.objectList}>
            {body?.objects.map((object, index) => (
              <motion.div
                key={index}
                className={styles.object}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              >
                <div className={styles.imgContainer}>
                  {object.image ? (
                    <img
                      className={styles.objectImg}
                      src={object.image}
                      alt={object.name}
                    />
                  ) : (
                    <PhotoIcon />
                  )}
                </div>
                <p>{object.name}</p>

                <button
                  className={styles.delete}
                  onClick={() => deleteObject(index)}
                >
                  <TrashIcon />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {hasParam && (
        <ImageModal
          onWrapperClick={removeParam}
          onUploadComplete={(url) => {
            form.setValue("image", url), removeParam();
          }}
          onSelectImage={(url) => {
            form.setValue("image", url), removeParam();
          }}
        />
      )}
    </div>
  );
};

export default ObjectStep;

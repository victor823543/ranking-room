import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { PhotoIcon, TrashIcon } from "@heroicons/react/24/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import AddImageSvg from "../../assets/svgs/AddImageSvg";
import Breadcrumbs from "../../components/common/Breadcrumbs/Breadcrumbs";
import CustomizableButton from "../../components/common/Buttons/CustomizableButton";
import Divider from "../../components/common/Dividers/Dividers";
import ErrorPage from "../../components/common/Error/ErrorPage/ErrorPage";
import ImageModal from "../../components/common/ImageModal/ImageModal";
import LoadingPage from "../../components/common/Loading/LoadingPage/LoadingPage";
import TextInputLine from "../../components/common/TextInputs/TextInputLine";
import Layout from "../../components/layout/Layout/Layout";
import useAddObject from "../../hooks/useAddObject";
import { useHandleSearchParam } from "../../hooks/useHandleSearchParam";
import { GetRoomResponse } from "../../types/Room";
import { callAPI } from "../../utils/apiService";
import styles from "./AddObjects.module.css";

const schema = yup.object({
  name: yup
    .string()
    .max(18, "An object name can have a maximum 18 characters")
    .required("Object name is required"),
  image: yup.string().url("Invalid URL"),
});

type FormFields = yup.InferType<typeof schema>;

const AddObjects = () => {
  const { id } = useParams<{ id: string }>();
  const { addObject, deleteObject, submit, addedObjects } = useAddObject();
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

  const { data, isLoading, error } = useQuery({
    enabled: !!id,
    queryKey: ["room", id],
    queryFn: () => callAPI<GetRoomResponse>(`/rooms/${id}`, "GET"),
  });

  if (error) return <ErrorPage />;
  if (isLoading || data === undefined) return <LoadingPage name="Rooms" />;

  return (
    <Layout name="Rooms">
      <div className={styles.objectStep}>
        <div className={styles.breadcrumbsContainer}>
          <Breadcrumbs
            items={[
              { name: "Rooms", href: "/rooms" },
              { name: data.name, href: `/rooms/${id}` },
              { name: "Add Objects", href: `/rooms/${id}/add-objects` },
            ]}
          />
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
              <CustomizableButton
                variant="primary"
                onClick={() => submit(data.id)}
              >
                Submit Created Objects
              </CustomizableButton>
            </motion.div>
          </div>
          <div>
            <div className={styles.objectList}>
              {[...addedObjects].reverse().map((object, index) => (
                <motion.div
                  key={object.name}
                  className={`${styles.object} ${styles.addedObject}`}
                  initial={{ opacity: 0, y: -50 }}
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
              {addedObjects.length > 0 && (
                <Divider color="rgba(var(--base), 0.5)" margin="1rem">
                  Old Objects
                </Divider>
              )}
              {data.objects.map((object, index) => (
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
    </Layout>
  );
};

export default AddObjects;

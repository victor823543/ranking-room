import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizableButton from "../../common/Buttons/CustomizableButton";
import Divider from "../../common/Dividers/Dividers";
import styles from "./CreateObjectPrompt.module.css";

type CreateObjectPromptProps = {
  totalObjects: number;
};

const CreateObjectPrompt: React.FC<CreateObjectPromptProps> = ({
  totalObjects,
}) => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <p className={styles.p}>Total objects: {totalObjects}</p>
      <Divider color="rgba(var(--base), 0.5)" margin="1rem" />
      <CustomizableButton
        style={{ margin: "0 auto" }}
        variant="primary"
        onClick={() => navigate("add-objects")}
      >
        Create Objects
      </CustomizableButton>
    </div>
  );
};

export default CreateObjectPrompt;

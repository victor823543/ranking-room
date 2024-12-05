import React from "react";
import { useNavigate } from "react-router-dom";
import { Alert, WarningAlert } from "../../../hooks/useAlerts";
import CustomizableButton from "../../common/Buttons/CustomizableButton";
import Divider from "../../common/Dividers/Dividers";
import styles from "./CreateObjectPrompt.module.css";

type CreateObjectPromptProps = {
  totalObjects: number;
  hasAddPermission: boolean;
  pushAlert: (item: Alert) => void;
};

const CreateObjectPrompt: React.FC<CreateObjectPromptProps> = ({
  totalObjects,
  hasAddPermission,
  pushAlert,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (hasAddPermission) {
      navigate("add-objects");
    } else {
      pushAlert(
        new WarningAlert(
          "You don't have permission to add objects to this room",
        ),
      );
    }
  };
  return (
    <div className={styles.container}>
      <p className={styles.p}>Total objects: {totalObjects}</p>
      <Divider color="rgba(var(--base), 0.5)" margin="1rem" />
      <CustomizableButton
        style={{ margin: "0 auto" }}
        variant="primary"
        onClick={handleClick}
      >
        Create Objects
      </CustomizableButton>
    </div>
  );
};

export default CreateObjectPrompt;

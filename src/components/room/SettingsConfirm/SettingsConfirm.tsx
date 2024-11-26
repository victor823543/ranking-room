import React from "react";
import { UpdatedRoomValues } from "../../../hooks/useRoomSettings";
import CustomizableButton from "../../common/Buttons/CustomizableButton";
import Divider from "../../common/Dividers/Dividers";
import styles from "./SettingsConfirm.module.css";

type SettingsConfirmProps = {
  updatedValues: UpdatedRoomValues;
  updateSettings: () => void;
};

const SettingsConfirm: React.FC<SettingsConfirmProps> = ({
  updatedValues,
  updateSettings,
}) => {
  return (
    <div className={styles.box}>
      <h3 className={styles.h3}>Updated Values</h3>
      <Divider color="rgba(var(--base), 0.5)" />
      {updatedValues.name && (
        <p>
          Name:{" "}
          <span className={updatedValues.name.isUpdated ? styles.updated : ""}>
            {updatedValues.name.content}
          </span>
        </p>
      )}
      {updatedValues.users && updatedValues.users.length > 0 && (
        <>
          <Divider color="rgba(var(--base), 0.5)" />
          <p>Users:</p>
          <ul>
            {updatedValues.users.map((user) => (
              <li key={user.userId}>
                <span className={user.name.isUpdated ? styles.updated : ""}>
                  {user.name.content} -{" "}
                </span>
                <span className={user.role.isUpdated ? styles.updated : ""}>
                  {user.role.content}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
      <Divider color="rgba(var(--base), 0.5)" />
      <CustomizableButton variant="primary" onClick={updateSettings}>
        Update Room
      </CustomizableButton>
    </div>
  );
};

export default SettingsConfirm;

import React from "react";
import CustomizableButton from "../../common/Buttons/CustomizableButton";
import SettingsStep from "../SettingsStep/SettingsStep";

type DeleteRoomProps = {
  deleteRoom: () => void;
};

const DeleteRoom: React.FC<DeleteRoomProps> = ({ deleteRoom }) => {
  return (
    <SettingsStep title="Delete Room">
      <CustomizableButton variant="warning" onClick={deleteRoom}>
        Delete Room
      </CustomizableButton>
    </SettingsStep>
  );
};

export default DeleteRoom;

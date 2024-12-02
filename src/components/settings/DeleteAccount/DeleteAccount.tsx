import CustomizableButton from "../../common/Buttons/CustomizableButton";
import Divider from "../../common/Dividers/Dividers";
import { Header } from "../../common/Headers/Headers";
import styles from "./DeleteAccount.module.css";

type DeleteAccountProps = {
  setShowDeleteModal: (value: boolean) => void;
};

const DeleteAccount: React.FC<DeleteAccountProps> = ({
  setShowDeleteModal,
}) => {
  return (
    <div className={styles.container}>
      <Header
        as="h2"
        center={false}
        variant="gridbox"
        className={styles.header}
      >
        Delete Account
      </Header>
      <Divider thickness="1px" color="rgba(var(--base), 0.5)" margin="1rem" />
      <div className={styles.delete}>
        <div>
          <p className={styles.p}>
            Deleting account will permanently remove all your data. This action
            cannot be undone.
          </p>
        </div>
        <div>
          <CustomizableButton
            variant="warning"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Account
          </CustomizableButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;

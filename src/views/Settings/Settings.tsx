import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Alerts from "../../components/common/Alerts/Alerts";
import CustomizableButton from "../../components/common/Buttons/CustomizableButton";
import { Header } from "../../components/common/Headers/Headers";
import {
  ModalWrapperBlur,
  WarningModal,
} from "../../components/common/Modals/Modals";
import Section from "../../components/common/Sections/Sections";
import GridLayout from "../../components/layout/GridLayout/GridLayout";
import Layout from "../../components/layout/Layout/Layout";
import AccountSettings from "../../components/settings/AccountSettings/AccountSettings";
import DeleteAccount from "../../components/settings/DeleteAccount/DeleteAccount";
import ThemeSettings from "../../components/settings/ThemeSettings/ThemeSettings";
import { useAlerts } from "../../hooks/useAlerts";
import useLogout from "../../hooks/useLogout";
import { callAPI } from "../../utils/apiService";
import styles from "./Settings.module.css";

const Settings = () => {
  const { pushAlert, removeAlert, alerts } = useAlerts();

  const logout = useLogout();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => callAPI(`/users`, "DELETE"),
    onSuccess: () => {
      logout();
    },
    onError: (err) => {
      console.log(err.message);
    },
  });
  return (
    <Layout name="Settings">
      <GridLayout
        topRightBaseBase={
          <Section>
            <ThemeSettings />
          </Section>
        }
        topLeftTallWide={
          <Section>
            <AccountSettings pushAlert={pushAlert} />
          </Section>
        }
        bottomRightShortBase={
          <Section>
            <DeleteAccount setShowDeleteModal={setShowDeleteModal} />
          </Section>
        }
      />
      <Alerts
        list={alerts}
        onClose={removeAlert}
        onDurationEnd={removeAlert}
        hasSidebar
      />
      {showDeleteModal && (
        <ModalWrapperBlur onClick={() => setShowDeleteModal(false)}>
          <WarningModal>
            <div className={styles.container}>
              <Header variant="gridbox">Are you sure?</Header>
              <p className={styles.p}>
                Deleting your account is irreversible and you will lose all your
                data.
              </p>
              <div className={styles.btnContainer}>
                <CustomizableButton
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </CustomizableButton>
                <CustomizableButton
                  onClick={() => deleteMutation.mutate()}
                  type="button"
                  variant="warning"
                >
                  Delete
                </CustomizableButton>
              </div>
            </div>
          </WarningModal>
        </ModalWrapperBlur>
      )}
    </Layout>
  );
};

export default Settings;

import Alerts from "../components/common/Alerts/Alerts";
import Section from "../components/common/Sections/Sections";
import GridLayout from "../components/layout/GridLayout/GridLayout";
import Layout from "../components/layout/Layout/Layout";
import AccountSettings from "../components/settings/AccountSettings/AccountSettings";
import ThemeSettings from "../components/settings/ThemeSettings/ThemeSettings";
import { useAlerts } from "../hooks/useAlerts";

const Settings = () => {
  const { pushAlert, removeAlert, alerts } = useAlerts();
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
      />
      <Alerts
        list={alerts}
        onClose={removeAlert}
        onDurationEnd={removeAlert}
        hasSidebar
      />
    </Layout>
  );
};

export default Settings;

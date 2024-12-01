import Section from "../components/common/Sections/Sections";
import GridLayout from "../components/layout/GridLayout/GridLayout";
import Layout from "../components/layout/Layout/Layout";
import ThemeSettings from "../components/settings/ThemeSettings/ThemeSettings";

const Settings = () => {
  return (
    <Layout name="Settings">
      <GridLayout
        topRightBaseBase={
          <Section>
            <ThemeSettings />
          </Section>
        }
        bottomLeftBaseWide={<div>Test</div>}
      />
    </Layout>
  );
};

export default Settings;

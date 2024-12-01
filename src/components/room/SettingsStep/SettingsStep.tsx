import React from "react";
import styles from "./SettingsStep.module.css";
type SettingsStepProps = {
  title: string;
  children: React.ReactNode;
};

const SettingsStep: React.FC<SettingsStepProps> = ({ title, children }) => {
  return (
    <div className={styles.settingsStep}>
      <div className={styles.gradientDivider}></div>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </div>
  );
};

export default SettingsStep;

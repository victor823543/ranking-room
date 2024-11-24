import React from "react";
import styles from "./Sections.module.css";

type SectionProps = {
  children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ children }) => {
  return <section className={styles.section}>{children}</section>;
};

export default Section;

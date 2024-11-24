import { motion } from "framer-motion";
import React from "react";
import styles from "./TransitionTabs.module.css";

export type Tab = {
  label: string;
  id: string;
};

type TransitionTabsProps = {
  borderRadius?: string;
  highlightColor?: string;
  color?: string;
  tabs: Tab[];
  selected: string;
  setTab: (tabId: string) => void;
};

const TransitionTabs: React.FC<TransitionTabsProps> = ({
  borderRadius = "var(--border-radius)",
  highlightColor = "rgb(var(--primary-dark))",
  color = "rgb(var(--base-x-light))",
  tabs,
  selected = tabs[0].id,
  setTab,
}) => {
  return (
    <div
      className={styles.tabs}
      style={
        {
          "--highlight": highlightColor,
          "--text": color,
        } as React.CSSProperties
      }
    >
      {tabs.map(({ label, id }) => (
        <div
          key={id}
          onClick={() => setTab(id)}
          className={`${styles.tab} ${selected === id ? styles.selected : ""}`}
          style={borderRadius ? { borderRadius: borderRadius } : {}}
        >
          <span>{label}</span>
          {selected === id && (
            <motion.div
              layoutId="highlight"
              transition={{ type: "spring", duration: 0.5 }}
              className={styles.highlight}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TransitionTabs;

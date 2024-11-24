import { motion } from "framer-motion";
import React from "react";
import styles from "./ProgressBar.module.css";

type ProgressBarProps = {
  value: number;
  max: number;
  backgroundColor?: string;
  progressColor?: string;
  height?: string;
  animate?: boolean;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  backgroundColor = "rgba(var(--base-x-dark), 0.4)",
  progressColor = "rgb(var(--primary))",
  height = "1rem",
  animate = false,
}) => {
  return (
    <div className={styles.progressBar} style={{ backgroundColor, height }}>
      <motion.div
        className={styles.progress}
        animate={animate ? { width: `${(value / max) * 100}%` } : {}}
        style={{
          width: `${(value / max) * 100}%`,
          backgroundColor: progressColor,
        }}
      />
    </div>
  );
};

export default ProgressBar;

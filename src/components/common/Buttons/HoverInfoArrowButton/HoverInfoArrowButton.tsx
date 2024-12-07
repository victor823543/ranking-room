import { motion } from "framer-motion";
import React, { useState } from "react";
import styles from "./HoverInfoArrowButton.module.css";

type HoverInfoArrowButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  info: Array<{ label?: string; info: string }>;
  infoHeight?: number;
};

const HoverInfoArrowButton: React.FC<HoverInfoArrowButtonProps> = ({
  children,
  onClick,
  info,
  infoHeight = 60,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={styles.btn}
      initial={{ borderColor: "rgba(var(--primary), 0)" }}
      animate={
        isHovered
          ? { borderColor: "rgba(var(--primary), 1)" }
          : { borderColor: "rgba(var(--primary), 0)" }
      }
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layout
    >
      <div className={styles.main}>
        <span>{children}</span>
        <span className={styles.arrow}>
          <svg
            className="HoverArrow"
            width="20"
            height="10"
            viewBox="0 0 10 10"
            aria-hidden="true"
          >
            <g fillRule="evenodd">
              <path className="HoverArrow__linePath" d="M0 5h10"></path>
              <path className="HoverArrow__tipPath" d="M4 1l3 4-3 4"></path>
            </g>
          </svg>
        </span>
      </div>
      <motion.div
        custom={infoHeight}
        className={styles.info}
        variants={infoContainerVariants}
        initial="hidden"
        animate={isHovered ? "hover" : "hidden"}
      >
        {info.map((item, index) => (
          <motion.p key={index} variants={infoPVariants} className={styles.p}>
            {item.label && <span className={styles.label}>{item.label}: </span>}
            <span>{item.info}</span>
          </motion.p>
        ))}
      </motion.div>
    </motion.button>
  );
};

const infoContainerVariants = {
  hidden: { height: 0, marginTop: 0 },
  hover: (height: number) => ({
    height,
    marginTop: 10,
    transition: {
      staggerChildren: 0.1,
    },
  }),
};

const infoPVariants = {
  hidden: { opacity: 0, x: -15 },
  hover: { opacity: 1, x: 0 },
};

export default HoverInfoArrowButton;

import { motion } from "framer-motion";
import React from "react";
import styles from "./Headers.module.css";

type HeaderProps = React.HTMLProps<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  variant?: "primary" | "secondary" | "gridbox" | "landing" | "config";
  center?: boolean;
  animate?: boolean;
  animateOnScroll?: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  as: Tag = "h1",
  variant = "primary",
  children,
  center = true,
  className = "",
  animate = false,
  animateOnScroll = false,
  ...rest
}) => {
  const renderHeader = () => {
    return (
      <Tag
        className={`${styles.header} ${styles[variant]} ${center ? styles.center : ""} ${className}`}
        {...rest}
      >
        {children}
      </Tag>
    );
  };
  if (animateOnScroll || animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={animateOnScroll ? { opacity: 1, y: 0 } : undefined}
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {renderHeader()}
      </motion.div>
    );
  } else {
    return renderHeader();
  }
};

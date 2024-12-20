import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";
import styles from "./Modals.module.css";

type ModalWrapperStylingProps = {
  /** Backdrop blur - any css measureunits - eg. (4px) */
  blur: string;
  /** Background opacity - fraction from 0 to 1 */
  darken: string;
  /** Background color - rgb value */
  rgb?: string;
};

type ModalWrapperProps = HTMLMotionProps<"div"> & {
  noSidebar?: boolean;
  noPointerEvents?: boolean;
  noNavbar?: boolean;
};

const createModalWrapper =
  ({
    blur,
    darken,
    rgb = "3, 7, 17",
  }: ModalWrapperStylingProps): React.FC<ModalWrapperProps> =>
  ({
    children,
    style,
    className,
    noSidebar = false,
    noNavbar = false,
    noPointerEvents = false,
    ...rest
  }) => {
    const pointerEvents = noPointerEvents ? "none" : "auto";
    return (
      <motion.div
        style={{
          ...style,
          WebkitBackdropFilter: `blur(${blur})`,
          backdropFilter: `blur(${blur})`,
          backgroundColor: `rgba(${rgb}, ${darken})`,
          pointerEvents,
        }}
        className={`${className} ${styles.modalWrapper} ${noSidebar ? "" : styles.marginLeft} ${noNavbar ? "" : styles.marginTop}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  };

export const ModalWrapper = createModalWrapper({
  darken: ".2",
  blur: "0",
});

export const ModalWrapperTransparent = createModalWrapper({
  darken: "0",
  blur: "0",
});

export const ModalWrapperBlur = createModalWrapper({
  darken: ".1",
  blur: "4px",
});

export const ModalWrapperStrong = createModalWrapper({
  darken: ".3",
  blur: "8px",
});

export const ModalWrapperBlurToned = createModalWrapper({
  darken: ".1",
  blur: "6px",
  rgb: "var(--primary-x-dark)",
});

interface ModalProps extends HTMLMotionProps<"div"> {}

type ModalStylingProps = {
  borderRadius: string;
  backgroundColor: string;
  padding: string;
  boxShadow: string;
};

const createModal =
  ({
    borderRadius,
    backgroundColor,
    padding,
    boxShadow,
  }: ModalStylingProps): React.FC<ModalProps> =>
  ({ children, onClick, style, ...rest }) => {
    return (
      <motion.div
        onClick={(e) => {
          e.stopPropagation(), onClick;
        }}
        style={{ borderRadius, backgroundColor, padding, boxShadow, ...style }}
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  };

export const Modal = createModal({
  borderRadius: "8px",
  backgroundColor: "var(--gray-x-light)",
  padding: "2rem 4rem",
  boxShadow: "var(--shadow-lg)",
});

export const OpaqueModal = createModal({
  borderRadius: "var(--border-radius)",
  backgroundColor: "rgba(var(--base-3x-dark), 0.7)",
  padding: "2rem",
  boxShadow: "var(--shadow-lg)",
});

export const WarningModal = createModal({
  borderRadius: ".75rem",
  backgroundColor: "rgba(var(--red-3x-dark), 0.8)",
  padding: "3rem",
  boxShadow: "var(--shadow-lg)",
});
